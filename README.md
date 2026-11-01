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
- Local built-in answer catalogue and keyword-based retrieval from imported knowledge.
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

- **No production AI backend is included in this repository.** The main chat does not call a hosted generative model. It returns built-in responses or extracts relevant sentences from the local knowledge library.
- **No on-device LLM is bundled.** Offline mode supports the built-in answer catalogue and local knowledge search, not unrestricted generative reasoning.
- **No image-understanding model is bundled.** Images can be attached/stored in a conversation, but the app cannot interpret their contents offline.
- **PDF extraction is not implemented.** Convert PDF text to TXT/MD before importing.
- **No cloud account, sync service, remote database, or server API is configured.** App data remains on the device and can be lost if app data is cleared or the app is uninstalled. Export backups regularly.
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
