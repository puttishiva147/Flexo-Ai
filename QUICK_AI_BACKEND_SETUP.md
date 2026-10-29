# Flexo Quick AI backend

Quick AI's Android screen is stored at `android/app/src/main/assets/quick-ai.html`. It sends requests to `/api/quick-ai`; the API key is kept on the server, never in the APK.

## Deploy

1. Import this repository into a Vercel project.
2. Ensure the project includes the `api/quick-ai.py` function.
3. In Vercel Project Settings → Environment Variables, add `OPENAI_API_KEY` with your own provider API key. Optional: set `OPENAI_MODEL` (defaults to `gpt-4o-mini`) and `OPENAI_BASE_URL` for an OpenAI-compatible provider.
4. Deploy the project. The API URL will be `https://YOUR-DEPLOYMENT-DOMAIN/api/quick-ai`.
5. Open Quick AI in the Android app. On first send, enter that HTTPS URL in the Connect Quick AI dialog.

## Important

- The endpoint intentionally does not include an API key. Do not put provider secrets in the Android app or GitHub source.
- The screen sends chat messages and optionally a shared image/text context to the endpoint. It does not silently read the phone screen.
- Screenshot/file image context is sent only after the user chooses an image.
- This endpoint is not live until deployed and `OPENAI_API_KEY` is configured. The APK build by itself cannot create a hosted AI service.
