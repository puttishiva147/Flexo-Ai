# Flexo AI

Flexo AI — Your Personal AI Assistant. This repository currently contains an Android debug-app shell and a GitHub Actions workflow that builds an APK.

## Build APK
1. Open **Actions**.
2. Select **Build Flexo AI APK** and run it manually, or push changes under `android/`.
3. Open the completed workflow run and download the `FlexoAI-debug-apk` artifact.

## Current limitations
- The Android shell and local Quick AI fallback are buildable scaffolding, not the full original Flexo AI web/backend product.
- The included Quick AI page prepares questions locally; it does not generate AI answers without a hosted AI backend.
- A debug APK is unsigned for production distribution. A production release requires a securely configured signing key.


## Quick AI overlay (Android)
- Open **Quick AI Settings** from the main screen.
- Grant **Display over other apps** permission.
- Enable Quick AI and choose the floating button and/or volume-key gesture.
- To use volume-key gestures, manually enable **Flexo Quick AI shortcut listener** in Android Accessibility settings. This optional service requests key-event filtering only to detect the selected volume key; Android/OEM behavior may vary and some devices may not deliver these events.
- Set the HTTPS endpoint ending in `/api/quick-ai`. Configure `OPENAI_API_KEY` as a server-side environment variable on the API host. Never put provider secrets in the Android app.
- The overlay is a foreground service with an ongoing notification. Android can still stop services, restrict overlays on the lock screen, or block background launches. The app does not use hidden APIs.
- Current shortcut options: double press Volume Down/Up and long press Volume Down/Up. Long press is detected on key release when Android delivers key events to the enabled Accessibility Service; it is not universally guaranteed.

### Known limitations / verification
- Accessibility-based global hardware-key interception depends on Android version, OEM implementation, the user enabling the service, and system policy. Floating button is the reliable fallback.
- The overlay chat supports text and conversational context in memory for the service lifetime. Image/screen understanding is not implemented in the native overlay yet.
- Real AI responses require a reachable hosted API and a valid server-side API key.
- Build CI validates compilation; physical overlay/volume-key testing must still be done on each target device. Do not treat CI build success as real-device acceptance.
