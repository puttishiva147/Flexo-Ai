# Flexo AI Gateway

This backend keeps AI provider credentials off the Android client. The app calls only this gateway.

## Run locally

`cd backend && python -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt && cp .env.example .env && uvicorn app:app --host 0.0.0.0 --port 8000`

Set the values from `.env.example` in the server environment. Never commit `.env` or place provider keys in the app.

## Endpoints
- `GET /api/health`
- `POST /api/chat` — general AI chat with optional user knowledge context.
- `POST /api/video/jobs` — forwards text-to-video or image-to-video requests to a separately hosted GPU worker.
- `GET /api/video/jobs/{job_id}` — returns generation status and the completed video URL.

## Video model hosting
The GPU worker is separate because a multi-billion-parameter video model cannot run inside Android WebView or a serverless function. Deploy the selected open-weight model on a GPU host and implement the worker contract (`POST /jobs`, `GET /jobs/{id}`). Set `VIDEO_WORKER_URL` and `VIDEO_WORKER_TOKEN`. The model name and host remain server-side and are never returned to the app.

This repository does not include model weights, a GPU runtime, or a paid inference endpoint. Video generation remains unavailable until the worker is deployed and configured. Review model and dependency licences before commercial use.
