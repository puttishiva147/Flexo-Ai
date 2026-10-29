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
