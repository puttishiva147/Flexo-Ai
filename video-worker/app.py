import base64
import hashlib
import hmac
import io
import os
import secrets
import subprocess
import threading
import time
import uuid
from pathlib import Path
from typing import Any

from fastapi import FastAPI, Header, HTTPException, Query
from fastapi.responses import FileResponse
from PIL import Image, UnidentifiedImageError
from pydantic import BaseModel, Field

app = FastAPI(title="Flexo Private Video Worker", version="0.1.0")
ROOT = Path(os.getenv("WAN_REPO_DIR", "/opt/Wan2.2")).resolve()
CHECKPOINT = Path(os.getenv("WAN_CKPT_DIR", "/models/Wan2.2-TI2V-5B")).resolve()
PYTHON = os.getenv("WAN_PYTHON", "python")
OUTPUT = Path(os.getenv("VIDEO_OUTPUT_DIR", "/data/videos")).resolve()
IMAGE_DIR = OUTPUT / "inputs"
OUTPUT.mkdir(parents=True, exist_ok=True)
IMAGE_DIR.mkdir(parents=True, exist_ok=True)
WORKER_TOKEN = os.getenv("VIDEO_WORKER_TOKEN", "")
MEDIA_SECRET = os.getenv("MEDIA_SIGNING_SECRET", "")
PUBLIC_BASE_URL = os.getenv("WORKER_PUBLIC_BASE_URL", "").rstrip("/")
MAX_IMAGE_BYTES = 8 * 1024 * 1024
jobs: dict[str, dict[str, Any]] = {}
jobs_lock = threading.Lock()
gpu_lock = threading.Lock()


def authorize(value: str | None) -> None:
    if not WORKER_TOKEN or not secrets.compare_digest(value or "", f"Bearer {WORKER_TOKEN}"):
        raise HTTPException(401, "Unauthorized")


def sign_media(job_id: str, expires: int) -> str:
    if not MEDIA_SECRET:
        raise RuntimeError("MEDIA_SIGNING_SECRET is not configured")
    payload = f"{job_id}:{expires}".encode()
    return hmac.new(MEDIA_SECRET.encode(), payload, hashlib.sha256).hexdigest()


def media_url(job_id: str) -> str:
    expiry = int(time.time()) + 3600
    signature = sign_media(job_id, expiry)
    return f"{PUBLIC_BASE_URL}/media/{job_id}?expires={expiry}&sig={signature}"


class JobRequest(BaseModel):
    prompt: str = Field(min_length=1, max_length=3000)
    mode: str = Field(pattern="^(text|image)$")
    image_data_url: str | None = None
    duration_seconds: int = Field(default=5, ge=5, le=10)
    resolution: str = Field(default="720p", pattern="^(480p|720p)$")


def decode_image(data_url: str, job_id: str) -> Path:
    if not data_url.startswith("data:image/") or "," not in data_url:
        raise ValueError("Invalid image upload")
    header, encoded = data_url.split(",", 1)
    if not any(header.startswith(f"data:image/{kind};base64") for kind in ("jpeg", "jpg", "png", "webp")):
        raise ValueError("Only JPEG, PNG and WebP images are supported")
    raw = base64.b64decode(encoded, validate=True)
    if len(raw) > MAX_IMAGE_BYTES:
        raise ValueError("Image must be 8 MB or smaller")
    try:
        with Image.open(io.BytesIO(raw)) as image:
            image.verify()
        with Image.open(io.BytesIO(raw)) as image:
            image.load()
            image = image.convert("RGB")
            suffix = ".jpg"
            path = IMAGE_DIR / f"{job_id}{suffix}"
            image.save(path, format="JPEG", quality=92)
            return path
    except (UnidentifiedImageError, OSError) as exc:
        raise ValueError("The uploaded image could not be decoded") from exc


def run_generation(job_id: str, request: JobRequest, image_path: Path | None) -> None:
    output_path = OUTPUT / f"{job_id}.mp4"
    try:
        if not (ROOT / "generate.py").is_file():
            raise RuntimeError("Wan inference repository is missing on this GPU worker")
        if not CHECKPOINT.is_dir():
            raise RuntimeError("Video model checkpoint directory is missing on this GPU worker")
        # Wan TI2V-5B officially supports both text and image conditioning.
        # Keep the first production preset at 5 seconds until longer clips are load-tested.
        frames = {5: 121, 8: 193, 10: 241}[request.duration_seconds]
        size = "1280*704"
        if image_path:
            with Image.open(image_path) as image:
                if image.height > image.width:
                    size = "704*1280"
        command = [
            PYTHON, str(ROOT / "generate.py"),
            "--task", "ti2v-5B",
            "--size", size,
            "--ckpt_dir", str(CHECKPOINT),
            "--offload_model", "True",
            "--convert_model_dtype",
            "--t5_cpu",
            "--frame_num", str(frames),
            "--prompt", request.prompt,
            "--save_file", str(output_path),
        ]
        if image_path:
            command.extend(["--image", str(image_path)])
        with gpu_lock:
            with jobs_lock:
                jobs[job_id]["status"] = "processing"
                jobs[job_id]["message"] = "Generating your video"
            completed = subprocess.run(
                command,
                cwd=str(ROOT),
                capture_output=True,
                text=True,
                timeout=60 * 60,
                check=False,
            )
        if completed.returncode != 0:
            detail = (completed.stderr or completed.stdout or "Inference failed")[-3000:]
            raise RuntimeError(detail)
        if not output_path.is_file() or output_path.stat().st_size == 0:
            raise RuntimeError("Inference finished without producing a video file")
        with jobs_lock:
            jobs[job_id].update(status="completed", message="Video is ready", video_path=str(output_path))
    except Exception as exc:
        with jobs_lock:
            jobs[job_id].update(status="failed", message="Video generation failed", error=str(exc)[:3000])
    finally:
        if image_path:
            image_path.unlink(missing_ok=True)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "model_ready": (ROOT / "generate.py").is_file() and CHECKPOINT.is_dir(),
        "gpu_worker": True,
    }


@app.post("/jobs")
async def create_job(body: JobRequest, authorization: str | None = Header(default=None)):
    authorize(authorization)
    if not PUBLIC_BASE_URL or not MEDIA_SECRET:
        raise HTTPException(503, "Private media delivery is not configured")
    image_path = None
    if body.mode == "image":
        if not body.image_data_url:
            raise HTTPException(422, "Image-to-video requires an image")
        try:
            job_id = uuid.uuid4().hex
            image_path = decode_image(body.image_data_url, job_id)
        except (ValueError, base64.binascii.Error) as exc:
            raise HTTPException(422, str(exc)) from exc
    else:
        job_id = uuid.uuid4().hex
    if body.duration_seconds != 5:
        # Longer clips are intentionally disabled until GPU memory and runtime are load-tested.
        raise HTTPException(422, "The initial production preset supports 5-second clips only")
    with jobs_lock:
        jobs[job_id] = {"status": "queued", "message": "Waiting for the GPU", "created_at": int(time.time())}
    thread = threading.Thread(target=run_generation, args=(job_id, body, image_path), daemon=True)
    thread.start()
    return {"job_id": job_id, "status": "queued"}


@app.get("/jobs/{job_id}")
async def get_job(job_id: str, authorization: str | None = Header(default=None)):
    authorize(authorization)
    with jobs_lock:
        job = jobs.get(job_id)
        if not job:
            raise HTTPException(404, "Video job not found")
        result = {"job_id": job_id, "status": job["status"], "message": job["message"]}
        if job["status"] == "completed":
            result["video_url"] = media_url(job_id)
        if job["status"] == "failed":
            result["error"] = job.get("error", "Generation failed")
        return result


@app.get("/media/{job_id}")
async def get_media(job_id: str, expires: int = Query(...), sig: str = Query(...)):
    if expires < int(time.time()):
        raise HTTPException(403, "Video link expired")
    expected = sign_media(job_id, expires)
    if not hmac.compare_digest(sig, expected):
        raise HTTPException(403, "Invalid video link")
    with jobs_lock:
        job = jobs.get(job_id)
        if not job or job.get("status") != "completed":
            raise HTTPException(404, "Video not found")
        path = Path(job["video_path"])
    if not path.is_file():
        raise HTTPException(404, "Video file is no longer available")
    return FileResponse(path, media_type="video/mp4", filename="flexo-video.mp4")
