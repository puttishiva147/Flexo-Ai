# Web/PWA foundation status

This repository is being upgraded in place. The current interface is migrated from the existing embedded HTML asset into the repository root without redesigning it or changing the existing `flexo_v1` local data key.

## What this foundation delivers
- The existing Flexo interface is served as a normal web app from `index.html`.
- Existing local scripts and browser-side data behavior are retained.
- PWA manifest and service worker provide install support on compatible browsers and cache the app shell for offline reopening after the first successful visit.
- The service worker does not cache API requests.

## Important limitations (not represented as completed)
- Offline app-shell availability is not the same as offline generative AI. A real local language model runtime and downloadable model are still required.
- Built-in responses and keyword-based knowledge lookup are not a general-purpose reasoning model.
- Online research, live source citations, document extraction, vector retrieval, and local-model orchestration remain future implementation stages.
- Installability and offline behavior must be verified on the deployed HTTPS origin and on target devices.

## Preserve existing data
The migrated interface continues to use the existing `flexo_v1` browser storage key. Do not clear browser storage during upgrades. Android WebView storage and browser/PWA storage are separate origins and are not automatically migrated between them.

## Deployment
Deploy the repository root as a static site on an HTTPS host. The root `index.html` is the entry point. No API key is required for this PWA shell.
