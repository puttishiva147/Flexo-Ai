import os
import secrets
import subprocess
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, File, Form, Header, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

ROOT = Path(os.getenv("LEX_DATA_DIR", str(Path(__file__).parent / "data"))).resolve()
ROOT.mkdir(parents=True, exist_ok=True)
MODEL_REPO = os.getenv("MODEL_REPO", "Pika-Labs/Pika-H3-Flex")
MODEL_REVISION = os.getenv("MODEL_REVISION", "0ddf55ad7067ca1e76812253bd7b4600df87f759")
API_KEY = os.getenv("LEX_API_KEY", "")
MAX_UPLOAD = int(os.getenv("LEX_MAX_UPLOAD_BYTES", str(100 * 1024 * 1024)))
MAX_JOBS = int(os.getenv("LEX_MAX_QUEUED_JOBS", "4"))
ALLOWED_ASPECTS = {"21:9", "16:9", "3:2", "4:3", "5:4", "1:1", "4:5", "3:4", "2:3", "9:16", "9:21"}
VIDEO_EXTENSIONS = {".mp4", ".mov", ".webm", ".mkv"}
AUDIO_EXTENSIONS = {".wav", ".mp3", ".m4a", ".aac", ".flac", ".ogg"}
jobs = {}
lock = threading.Lock()
pool = ThreadPoolExecutor(max_workers=1, thread_name_prefix="lex-pika")

app = FastAPI(title="Lex Video Inference API", version="0.2.0")
origins = [x.strip() for x in os.getenv("LEX_CORS_ORIGINS", "*").split(",") if x.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["GET", "POST", "OPTIONS"], allow_headers=["Authorization", "Content-Type"])


def authorize(value: Optional[str]):
    if not API_KEY:
        raise HTTPException(status_code=503, detail="Lex backend is not configured: set LEX_API_KEY")
    if value != "Bearer " + API_KEY:
        raise HTTPException(status_code=401, detail="Invalid Lex backend access token")


def safe_suffix(upload: UploadFile, default: str = ".bin") -> str:
    suffix = Path(upload.filename or "").suffix.lower()
    if not suffix or len(suffix) > 10 or not suffix[1:].isalnum():
        return default
    return suffix


async def save_upload(upload: UploadFile, destination: Path):
    data = await upload.read(MAX_UPLOAD + 1)
    if len(data) > MAX_UPLOAD:
        raise HTTPException(status_code=413, detail="Each uploaded file must be smaller than the configured limit")
    if not data:
        raise HTTPException(status_code=400, detail="An uploaded file is empty")
    destination.write_bytes(data)
    return destination


def run_job(job_id: str, folder: Path, prompt: str, mode: str, resolution: str, aspect: str, duration: int, seed: int, first_path, last_path, refs):
    output = folder / "generated.mp4"
    prompt_path = folder / "prompt.txt"
    command = [
        "pika-h3-pro", "--task", mode, "--prompt-file", str(prompt_path),
        "--model-repo", MODEL_REPO, "--revision", MODEL_REVISION,
        "--resolution", resolution, "--aspect", aspect, "--duration", str(duration),
        "--seed", str(seed), "--output", str(output)
    ]
    if first_path:
        command += ["--first-image", str(first_path)]
    if last_path:
        command += ["--last-image", str(last_path)]
    if os.getenv("LEX_CPU_OFFLOAD", "false").lower() in {"1", "true", "yes"}:
        command.append("--cpu-offload")
    for kind, path in refs:
        command += ["--ref", kind + ":" + str(path)]
    with lock:
        jobs[job_id]["status"] = "running"
        jobs[job_id]["started_at"] = time.time()
    try:
        env = os.environ.copy()
        env["MODEL_REPO"] = MODEL_REPO
        env["MODEL_REVISION"] = MODEL_REVISION
        completed = subprocess.run(command, capture_output=True, text=True, timeout=2400, env=env)
        if completed.returncode != 0 or not output.exists():
            raise RuntimeError((completed.stderr or completed.stdout or "Pika inference failed")[-5000:])
        with lock:
            jobs[job_id].update(status="completed", video_url="/v1/jobs/" + job_id + "/video", finished_at=time.time())
    except subprocess.TimeoutExpired:
        with lock:
            jobs[job_id].update(status="failed", error="Generation exceeded the 40-minute server timeout.", finished_at=time.time())
    except Exception as exc:
        with lock:
            jobs[job_id].update(status="failed", error=str(exc)[-3000:], finished_at=time.time())


@app.get("/health")
def health():
    return {"ok": True, "service": "lex-pika-h3-flex", "model": MODEL_REPO, "revision": MODEL_REVISION, "auth_configured": bool(API_KEY)}


@app.post("/v1/jobs")
async def create_job(
    prompt: str = Form(...),
    mode: str = Form("t2va"),
    resolution: str = Form("480p"),
    aspect: str = Form("16:9"),
    duration: int = Form(5),
    seed: int = Form(42),
    first_image: Optional[UploadFile] = File(None),
    last_image: Optional[UploadFile] = File(None),
    reference_files: list[UploadFile] = File(default=[]),
    authorization: Optional[str] = Header(None),
):
    authorize(authorization)
    prompt = prompt.strip()
    if not prompt or len(prompt) > 8000:
        raise HTTPException(status_code=400, detail="Prompt must contain 1–8,000 characters")
    if mode not in {"t2va", "i2va", "l2va", "fl2va", "ref2va"}:
        raise HTTPException(status_code=400, detail="Unsupported generation mode")
    if resolution not in {"480p", "768p"} or aspect not in ALLOWED_ASPECTS or not 5 <= duration <= 15:
        raise HTTPException(status_code=400, detail="Unsupported resolution, aspect ratio, or duration")
    if mode in {"i2va", "fl2va"} and first_image is None:
        raise HTTPException(status_code=400, detail="This mode requires a first-frame image")
    if mode in {"l2va", "fl2va"} and last_image is None:
        raise HTTPException(status_code=400, detail="This mode requires a last-frame image")
    if mode != "ref2va" and reference_files:
        raise HTTPException(status_code=400, detail="Reference files are only accepted in reference-guided mode")
    if mode == "ref2va" and not reference_files:
        raise HTTPException(status_code=400, detail="Reference mode requires at least one image or video")
    if len(reference_files) > 12:
        raise HTTPException(status_code=400, detail="At most 12 reference files are accepted")

    with lock:
        active = sum(1 for item in jobs.values() if item["status"] in {"queued", "running"})
        if active >= MAX_JOBS:
            raise HTTPException(status_code=429, detail="Lex generation queue is full. Try again shortly.")

    job_id = secrets.token_urlsafe(12)
    folder = ROOT / job_id
    folder.mkdir(parents=True, exist_ok=False)
    (folder / "prompt.txt").write_text(prompt, encoding="utf-8")
    try:
        first_path = await save_upload(first_image, folder / ("first-frame" + safe_suffix(first_image, ".png"))) if first_image else None
        last_path = await save_upload(last_image, folder / ("last-frame" + safe_suffix(last_image, ".png"))) if last_image else None
        refs = []
        image_count = video_count = audio_count = 0
        for index, upload in enumerate(reference_files):
            suffix = safe_suffix(upload)
            content_type = (upload.content_type or "").lower()
            if content_type.startswith("video/") or suffix in VIDEO_EXTENSIONS:
                kind = "video"; video_count += 1
            elif content_type.startswith("audio/") or suffix in AUDIO_EXTENSIONS:
                kind = "audio"; audio_count += 1
            elif content_type.startswith("image/") or suffix in {".png", ".jpg", ".jpeg", ".webp", ".bmp"}:
                kind = "image"; image_count += 1
            else:
                raise HTTPException(status_code=415, detail="Reference files must be images, videos, or audio")
            path = await save_upload(upload, folder / ("reference-" + str(index) + suffix))
            refs.append((kind, path))
        if mode == "ref2va":
            if image_count > 9 or video_count > 3 or audio_count > 3:
                raise HTTPException(status_code=400, detail="Reference limits: 9 images, 3 videos, and 3 standalone audio files")
            if image_count + video_count == 0:
                raise HTTPException(status_code=400, detail="At least one image or video reference is required; audio-only reference generation is not supported")
        with lock:
            jobs[job_id] = {"id": job_id, "status": "queued", "created_at": time.time(), "prompt": prompt, "mode": mode, "resolution": resolution, "aspect": aspect, "duration": duration, "seed": seed}
        pool.submit(run_job, job_id, folder, prompt, mode, resolution, aspect, duration, seed, first_path, last_path, refs)
        return {"id": job_id, "status": "queued"}
    except Exception:
        for child in folder.iterdir():
            if child.is_file():
                child.unlink()
        folder.rmdir()
        raise


@app.get("/v1/jobs/{job_id}")
def job_status(job_id: str, authorization: Optional[str] = Header(None)):
    authorize(authorization)
    with lock:
        job = jobs.get(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found (jobs are cleared if the inference service restarts)")
        return dict(job)


@app.get("/v1/jobs/{job_id}/video")
def job_video(job_id: str, authorization: Optional[str] = Header(None)):
    authorize(authorization)
    video = (ROOT / job_id / "generated.mp4").resolve()
    if not str(video).startswith(str(ROOT) + os.sep) or not video.is_file():
        raise HTTPException(status_code=404, detail="Video is not ready")
    return FileResponse(video, media_type="video/mp4", filename="lex-" + job_id + ".mp4")
