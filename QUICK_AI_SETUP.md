# Flexo Quick AI setup

## Android overlay
1. Install the latest debug APK from the GitHub Actions artifact.
2. Open Flexo AI → Quick AI Settings.
3. Grant **Display over other apps** permission.
4. Enable Quick AI and the movable floating button.
5. For volume-key gestures, open Android Accessibility settings and manually enable **Flexo Quick AI shortcut listener**. Android/OEM versions may block or reserve global volume-key events; the floating button remains the supported fallback.
6. The optional listener only filters the configured volume-key gesture. It does not read screen content.

## Real AI backend
The Android client never contains the provider secret. Deploy `api/quick-ai.py` to a Python serverless host such as Vercel and set the server-side environment variable `OPENAI_API_KEY`; optionally set `OPENAI_MODEL` (default `gpt-4o-mini`). In Quick AI Settings, save the HTTPS endpoint ending in `/api/quick-ai`.

Without a valid hosted endpoint and API key, the overlay displays a clear configuration error rather than fabricating an AI response. Never paste the private API key into the Android app.

## Transparent logo
The APK workflow extracts the original icon from the app's existing embedded asset, removes connected neutral-gray background pixels, writes transparent launcher densities and the adaptive icon, and replaces the embedded icon with the same transparent source before building.

## Limitations
- Hardware button interception is not guaranteed on every device. Android and OEM software may reserve volume keys; Accessibility must be explicitly enabled by the user and must follow Play policy.
- Overlay permission and background-service restrictions vary by Android release. The user must grant overlay permission and can stop the service at any time.
- The GitHub workflow creates a debug APK, not a production-signed release APK.
