# Flexo AI Gateway

This backend keeps AI provider credentials off the Android client. The app calls only this gateway.

## Run locally

`cd backend && python -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt && cp .env.example .env && uvicorn app:app --host 0.0.0.0 --port 8000`

Set the values from `.env.example` in the server environment. Never commit `.env` or place provider keys in the app.

## Endpoints

- `GET /api/health`
- `POST /api/chat` — general AI chat with optional user knowledge context.
- `POST /api/video/jobs` — submits a private text-to-video or image-to-video job.
- `GET /api/video/jobs/{job_id}` — returns generation status and the completed video URL.

## Hosted video generation (recommended)

Flexo supports the managed Pika H3 Flex API. This avoids renting and maintaining a dedicated GPU worker.

1. Create an API key in the Pika API dashboard.
2. Add `PIKA_API_KEY` to the backend host's secret environment variables.
3. Keep `PIKA_API_BASE=https://api.dev.pika.art` (or the production API base supplied by Pika for your account).
4. Deploy/restart the gateway.
5. Check `GET /api/health`; `video_configured` should be true.

The API key is only read by this server and is never sent to the Android client. Text-to-video and image-to-video use Pika's asynchronous job API. Image uploads are sent through Pika's presigned upload flow; generated results are returned as a video URL.

Current Flexo UI preset: 5 seconds at 768p. Pika's published H3 Flex rate is $0.02/output second at 768p, so a successful 5-second generation is approximately $0.10 USD. 480p is $0.01/second. Only successful jobs are charged according to the current published pricing; check the account dashboard before production use.

- Pika H3 Flex text-to-video API: https://dev.pika.art/models/pika/pika-h3-flex/text-to-video
- Pika H3 Flex image-to-video API: https://dev.pika.art/models/pika/pika-h3-flex/image-to-video
- Pricing: https://dev.pika.art/models/pika/pika-h3-flex/text-to-video/pricing

## Self-hosted fallback

If `PIKA_API_KEY` is not set, the gateway can still forward jobs to a private GPU worker using `VIDEO_WORKER_URL` and `VIDEO_WORKER_TOKEN`. See `../video-worker/README.md`. This is optional when using the hosted Pika API.
