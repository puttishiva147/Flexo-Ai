# Flexo AI

Flexo AI is currently an Android WebView application with a local-first chat interface, built-in response catalogue, searchable user knowledge library, conversation history, settings, notifications and local JSON backup/restore.

Repository: https://github.com/puttishiva147/Flexo-Ai

## Build a debug APK

1. Open **Actions**.
2. Select **Build Flexo AI APK**.
3. Wait for the workflow to finish successfully.
4. Download the `FlexoAI-debug-apk` artifact from that run.

The workflow builds a debug APK. It is not a production-signed release.

## Implemented in the current app

- Six navigation destinations: Chat, Knowledge, Tools, History, Settings and Data Hub.
- Existing local knowledge library, chunking, source management and retrieval.
- Optional online general-purpose AI chat through the new Flexo backend gateway; the original offline response/retrieval path remains available when no gateway is configured.
- In-app AI Video Studio UI for text-to-video and image-to-video requests, with job status, preview and download when a GPU worker is configured.
- Conversation-aware retrieval that includes recent user turns when searching the local library.
- Local chat and knowledge persistence using WebView localStorage.
- Knowledge imports: TXT, Markdown, CSV and JSON; conversation-export imports also support ZIP/JSON/TXT/MD/CSV/HTML where the selected parser recognises the format.
- Knowledge chunking, source listing, removal and manually written notes.
- JSON export and validated JSON backup restore. Restore validates the backup and preserves current data if validation or saving fails.
- In-app notifications for supported local actions.
- Native voice-to-text request through Android SpeechRecognizer, subject to microphone permission and an installed speech-recognition service.
- Android file chooser and JSON export through the system document picker.
- WebView navigation restricted to the app's local Android assets.

## Important capability boundaries

- **The backend integration is scaffolded but not deployed.** Configure and deploy `backend/` plus a compatible chat provider before online chat can work. Without a gateway URL, the app retains its local built-in response and knowledge retrieval behaviour.
- **No on-device LLM is bundled.** Offline mode supports the built-in answer catalogue and local knowledge search, not unrestricted generative reasoning.
- **No image-understanding model is bundled.** Images can be attached/stored in a conversation, but the app cannot interpret their contents offline.
- **PDF extraction is not implemented.** Convert PDF text to TXT/MD before importing.
- **No production account, sync service, remote database, or deployed Flexo gateway is configured yet.** App data remains on the device unless the user explicitly connects the gateway. Export backups regularly.
- **Video generation requires a separate GPU worker.** The app and gateway contracts are included, but the Wan model weights/runtime and a hosted GPU worker are not. Do not treat video generation as live until the worker is deployed and tested.
- **The Quick AI overlay/backend described in older setup notes is not present in the current source tree.** Do not assume overlay controls or a deployed `/api/quick-ai` service exist.
- **Storage uses WebView localStorage.** Large imports can hit device/browser quota limits; failed writes should be treated as unsuccessful.
- **Device acceptance is still required.** CI compilation does not prove the app works on every Android/OEM version.

## Permissions

The Android manifest declares microphone permission for voice input and vibration for haptic feedback. Android will still ask the user for microphone permission at runtime.

## Security notes

- Do not embed provider API keys in the APK or source repository.
- The WebView bridge is intended for the local bundled app. Navigation to arbitrary remote pages is blocked.
- Local data is not encrypted by an app-level database in this build. Use Android device security and keep exported backups private.

See `docs/PROJECT_GAP_AUDIT.md` for the verified implementation status and remaining work.


## New AI gateway integration

The feature branch adds `android/app/src/main/assets/flexo-ai-studio.js` and a FastAPI gateway under `backend/`. Configure the gateway URL and Flexo access token in Settings. The gateway uses server-side provider credentials; never place model keys in the APK. The gateway is not deployed by this repository change. Video generation additionally requires a private GPU worker implementing the contract documented in `backend/README.md`.
