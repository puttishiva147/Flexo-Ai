# Lex — Pika H3 Flex inference service

This service is the GPU inference backend for the Lex Beta module embedded in Flexo AI. It wraps the official Pika H3 Flex CLI; it does not reimplement the model or redistribute model weights.

## Hardware and model

Use a dedicated NVIDIA GPU host. The official inference package is tested on an H100 80GB for representative requests. The model downloads approximately 210 GB of base components plus adapter files at runtime; provision persistent disk and substantial host RAM. Start with 480p / 5 seconds. The package supports Python 3.12 and the official pinned dependency stack.

## Build and run

Build the image with Docker, then run it on a GPU host with the NVIDIA container runtime. Publish port 8000 behind HTTPS. Set LEX_API_KEY to a long random secret, set HF_TOKEN if Hugging Face authentication is required, and mount persistent volumes at /root/.cache/huggingface and /data/lex. Never commit either secret to GitHub or put them in the Android APK.

Set LEX_CORS_ORIGINS to the exact app origins when known. Android WebView local assets can send a null origin; allow `null` or retain wildcard CORS (without credentials) for that client. Keep the service behind HTTPS and keep the API key private. The API refuses job/status/video requests until LEX_API_KEY is configured.

## API

- GET /health
- POST /v1/jobs — multipart fields: prompt, mode (t2va, i2va, l2va, fl2va, ref2va), resolution (480p / 768p), aspect, duration (5–15), seed, optional first_image, last_image, and repeated reference_files.
- GET /v1/jobs/{id} — queued/running/completed/failed status.
- GET /v1/jobs/{id}/video — completed MP4.

LEX_API_KEY is required and enforced as a Bearer token. Set LEX_CPU_OFFLOAD=true to enable the official CLI's CPU-offload mode; it reduces sampling VRAM at the cost of substantial host RAM and transfer time. Job state is in process memory; completed files and model cache live on persistent volumes. Use one worker process per GPU; this implementation intentionally serializes inference requests.

## Model and license notices

The inference code is Apache-2.0. Pika H3 Flex adapters and bundled MiniMax-H3 components are subject to the MiniMax H3 Community License Agreement, not Apache-2.0. Review the current upstream LICENSE, NOTICE and usage restrictions before commercial use or redistribution. Keep the required MiniMax/Mellis notices and Pika attribution with any redistribution. This project downloads model files at runtime and does not commit weights.

Upstream sources:
- https://github.com/Pika-Labs/Pika-H3-Flex
- https://huggingface.co/Pika-Labs/Pika-H3-Flex
- https://github.com/Pika-Labs/Pika-H3-Flex/blob/main/LICENSE-CODE
- https://github.com/Pika-Labs/Pika-H3-Flex/blob/main/LICENSE
