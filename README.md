# Flexo AI

Flexo AI is being upgraded in this existing repository as a local-first, installable web application.

## Implemented foundation and intelligence stage
- Existing UI retained at the repository root; existing flexo_v1 browser storage key preserved.
- PWA manifest and service worker for app installation and offline app-shell caching.
- Optional browser-local WebLLM inference using Qwen2.5-0.5B-Instruct (q4f16_1). Requires WebGPU and a one-time model download.
- Conversation context and ranked local knowledge retrieval are passed to the model when loaded.
- Optional keyless public Wikipedia research, disabled by default.
- Knowledge import for text, CSV, JSON, HTML, DOCX, XLSX, PPTX, ODT, EPUB and text-based PDF.

## Honest capability statement
This is meaningful working functionality, but not yet the complete all-in-one AI vision. The compact local model has limited capability; full web research, image understanding, scanned-PDF OCR, audio/video, advanced vector search, persistent memory, and device-level acceptance testing remain outstanding.

See WEB_PLATFORM_STATUS.md for implementation details and limitations.

## Deployment
The repository root is the static web app. Deploy on HTTPS to enable PWA installation and WebGPU features. No provider API key is required for the local model or the optional Wikipedia search.
