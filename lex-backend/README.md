# Lex — Pika H3 Flex inference service

Lex is the video-generation workspace integrated into the existing Flexo AI Android app. It calls the official **Pika H3 Flex open-weight inference CLI** through this FastAPI service. The model does not run on the phone, in the WebView, or on Netlify/Vercel.

## What is supported

- Text-to-video-and-audio (T2VA)
- First-frame conditioning (I2VA)
- Last-frame conditioning (L2VA)
- First + last frame conditioning (FL2VA)
- Reference-guided generation (Ref2VA), with image, video and audio reference inputs
- Native 480p / 768p, 24 fps, synchronized 32 kHz stereo audio
- 5–15 second requests, 11 aspect ratios, seed control

Reference-mode limits: up to 9 images, 3 videos and 3 standalone audio clips, 12 files total. At least one image or video is required. Each standalone audio/video reference must be 2–15 seconds; combined standalone audio duration and combined video duration are each limited to 15 seconds. A video's embedded soundtrack stays with that video.

## Hardware reality

This is a large GPU workload, not a lightweight web API. The upstream package has representative validation on one NVIDIA H100 80GB GPU. It uses one GPU per generation request and does not shard a single request across multiple GPUs. Allow about 211 GB for base model components plus about 5.5 GB for both adapters, plus dependency and download staging space. Start by qualifying 480p / 5 seconds. Some larger jobs need CPU offload and substantial host RAM; it is not a guarantee that all shapes/reference combinations fit.

The app UI can be integrated and built without a GPU. Actual video generation remains unavailable until this backend is built and deployed on a compatible GPU host. A normal shared CPU web host or static Vercel/Netlify deployment cannot run this model.

## Build the GPU container

Build on a host with Docker and NVIDIA Container Toolkit:

```bash
docker build -t flexo-lex -f lex-backend/Dockerfile .
```

Run it with persistent model and job storage:

```bash
docker run --rm --gpus 'device=0' -p 8000:8000 \
  -e LEX_API_KEY='use-a-long-random-secret' \
  -e HF_TOKEN='your-hugging-face-token-if-required' \
  -e LEX_CORS_ORIGINS='*' \
  -v lex-model-cache:/root/.cache/huggingface \
  -v lex-jobs:/data/lex \
  flexo-lex
```

Publish the service behind HTTPS before connecting the Android app. LEX_API_KEY is required; the service returns 503 until configured. HF_TOKEN is only needed if the model host requires authentication. Never commit either secret or bake it into the image. The access token entered into the Lex settings is stored in the app's local WebView storage; this is suitable only for a single-user/private beta and is not a production multi-user identity system. Use per-user authentication or a trusted server-side proxy before distributing the app publicly.

For Android WebView local assets, the browser origin may be null. Wildcard CORS is used without credential cookies; keep bearer-token access enabled and the service behind HTTPS. For a hosted web frontend, replace LEX_CORS_ORIGINS with its exact HTTPS origin.

Set LEX_CPU_OFFLOAD=true if the chosen job shape needs the official CLI's CPU-offload mode. It reduces sampling VRAM at the cost of substantial host RAM and slower transfers.

## API

- GET /health — service and pinned model status (does not expose secrets).
- POST /v1/jobs — multipart fields: prompt, mode (t2va, i2va, l2va, fl2va, ref2va), resolution (480p / 768p), aspect, duration (5–15), seed, optional first_image, last_image, and repeated reference_files.
- GET /v1/jobs/{id} — queued/running/completed/failed status.
- GET /v1/jobs/{id}/video — completed MP4.

Authenticated routes require Authorization: Bearer <LEX_API_KEY>. Requests are serialized through one inference worker. The queue is bounded by LEX_MAX_QUEUED_JOBS (default 4); each upload is bounded by LEX_MAX_UPLOAD_BYTES (default 100 MiB). Job metadata currently lives in process memory, so restarting the API loses status lookup for in-flight/previous jobs even though generated files and model cache are on persistent storage. Use one API process per GPU.

## Upstream and license

The inference/loader code is Apache-2.0. The Pika H3 Flex adapters are Model Derivatives of MiniMax H3 and are subject to the MiniMax H3 Community License Agreement, not simply the Apache code license. Review the upstream LICENSE, NOTICE and usage restrictions before commercial use or redistribution. Retain the required MiniMax/Mellis notices and Pika attribution. Model weights are downloaded at runtime and are not committed to this repository.

- Upstream code: https://github.com/Pika-Labs/Pika-H3-Flex
- Model weights: https://huggingface.co/Pika-Labs/Pika-H3-Flex
- Hardware requirements: https://github.com/Pika-Labs/Pika-H3-Flex/blob/main/docs/hardware.md
- Prompt guide: https://github.com/Pika-Labs/Pika-H3-Flex/blob/main/docs/prompt-guidance.md
