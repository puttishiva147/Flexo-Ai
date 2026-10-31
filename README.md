# Flexo AI

Flexo AI is an Android app shell with a local-first interface. The current implementation stores chats and user-imported knowledge on the device and performs local text operations.

## Current implementation

- Local chat history and knowledge library using WebView storage.
- Manual notes and text-file import.
- ChatGPT-style export import for supported JSON/ZIP formats.
- Local knowledge retrieval with ranked passage matching.
- Offline text utilities: extractive summary, repeated-keyword extraction, revision points, word/character count, and checklist extraction.
- Local app data export and delete controls.

## Important limitations

This build does **not** contain a generative language model. It cannot independently reason, translate, compose original answers, understand images, or summarize arbitrary PDFs. Extractive summaries and keyword-based retrieval are deterministic local text processing, not AI-generated answers.

No OpenAI key, hosted AI API, or other cloud AI provider is configured. A genuine offline assistant requires a compatible on-device model runtime, a model file sized for the target device, and device-level performance testing. Until that is integrated, the app must not present those capabilities as working.

## Build APK

1. Open GitHub Actions.
2. Select **Build Flexo AI APK**.
3. Download the `FlexoAI-debug-apk` artifact from a successful run.

The workflow builds a debug APK. It is not a production-signed release.
