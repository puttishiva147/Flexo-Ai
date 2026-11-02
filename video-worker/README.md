# Flexo private Wan video worker

This is the separate GPU service that the Flexo API gateway forwards video jobs to. It keeps model/provider details out of the mobile app.

## Requirements

- NVIDIA GPU with at least 24 GB VRAM for the official Wan2.2 TI2V-5B single-GPU offload recipe (e.g. RTX 4090 class).
- CUDA-compatible PyTorch installation and the official Wan2.2 dependencies.
- Model checkpoint downloaded to a persistent volume.
- Persistent output volume for generated MP4s.
- A reverse-proxy/TLS URL reachable by the Flexo gateway.

The upstream model card describes TI2V-5B as supporting both text-to-video and image-to-video at 720p/24fps and lists Apache-2.0. See https://huggingface.co/Wan-AI/Wan2.2-TI2V-5B and https://github.com/Wan-Video/Wan2.2. The official single-GPU example uses `--offload_model True --convert_model_dtype --t5_cpu` and states 24 GB VRAM. Confirm upstream requirements and all dependency licences before commercial use.

## Install on a GPU host

1. Clone the official repository to `/opt/Wan2.2` and install its requirements in a CUDA/PyTorch environment as described upstream.
2. Download `Wan-AI/Wan2.2-TI2V-5B` to a persistent directory such as `/models/Wan2.2-TI2V-5B`.
3. Install this service's requirements from `requirements.txt`.
4. Configure the environment variables below and run `uvicorn app:app --host 0.0.0.0 --port 8001` behind HTTPS.
5. Set `VIDEO_WORKER_URL` and `VIDEO_WORKER_TOKEN` in the Flexo gateway to this worker URL and token.

## Environment

- `VIDEO_WORKER_TOKEN`: long random secret shared only with the Flexo gateway.
- `MEDIA_SIGNING_SECRET`: separate long random secret for expiring private video links.
- `WORKER_PUBLIC_BASE_URL`: public HTTPS base URL for signed video delivery.
- `WAN_REPO_DIR`: official Wan2.2 checkout (default `/opt/Wan2.2`).
- `WAN_CKPT_DIR`: TI2V-5B checkpoint directory.
- `VIDEO_OUTPUT_DIR`: persistent generated-video storage.

## API

- `GET /health`
- `POST /jobs` with `mode=text|image`, prompt, optional image data URL, duration and resolution.
- `GET /jobs/{job_id}`
- `GET /media/{job_id}?expires=...&sig=...` returns a time-limited signed download/preview URL.

The initial worker accepts 5-second clips only. Longer durations are rejected until GPU memory/runtime are tested. Jobs are held in process memory and the worker is single-GPU/single-job; add a durable queue and object storage before scaling to multiple workers or production traffic. Do not run this on the phone or inside Vercel serverless functions.
