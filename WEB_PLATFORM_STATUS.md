# Flexo AI implementation status

## Implemented in this branch
- Existing interface migrated to the web root and retained; existing flexo_v1 storage key remains in use.
- Installable PWA manifest and service worker with app-shell caching.
- Local WebLLM inference integration using the prebuilt Qwen2.5 0.5B Instruct q4f16_1 model. The user explicitly starts the model download; inference runs in the browser with WebGPU and does not send chat prompts to a provider.
- A local model status/download/unload panel, WebGPU capability check, and progress feedback.
- The chat path uses the local model when it is loaded, includes recent conversation turns, and injects ranked local knowledge passages. The legacy deterministic fallback remains when no model is loaded; it is not represented as general AI.
- Optional online research, disabled by default. When enabled and connected, Flexo searches public Wikipedia results without a provider API key. With a loaded local model, retrieved passages are supplied as context and source URLs are appended. Without a model, results are shown as research results, not misrepresented as generated answers.
- Knowledge import for TXT, Markdown, CSV, JSON, HTML, DOCX, XLSX, PPTX, ODT, EPUB, and text-based PDF. Office files are extracted from their Open XML/ZIP contents. PDF text extraction uses PDF.js; scanned/image-only PDFs still require OCR, which is not included.
- Improved local retrieval using term frequency, inverse document frequency, query coverage, exact phrase and title relevance.

## Important limitations not completed
- A 0.5B local model is compact and has limited reasoning, coding, math, long-context, and multilingual ability. It is not equivalent to a large hosted model.
- WebGPU availability and memory differ by device/browser. The model may fail to load on unsupported phones, low-memory devices, or browsers with WebGPU disabled. The user must test it on the target phone.
- Online research currently uses Wikipedia's public search/summary endpoints only. This is not full-web search, current news coverage, or a multi-source research engine.
- Image understanding, OCR for scanned PDFs, audio, video, advanced spreadsheet formulas, full vector embeddings, and a robust persistent memory system are not implemented yet.
- Offline first-run model setup requires internet to download the inference module and model assets. Once downloaded and retained by browser storage, offline use may work; browser storage eviction can require downloading again.
- This branch has been syntax-checked and source-inspected. It has not yet been tested on the user's physical device or a deployed HTTPS origin.

## Privacy and data
- Local model inference stays in the browser.
- Online research is opt-in and sends only the search query to Wikipedia. Private files and chat history are not sent to Wikipedia.
- Existing local storage is preserved; no migration clears the user's data.
