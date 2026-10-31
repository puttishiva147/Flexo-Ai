# Flexo AI

Flexo AI is being improved **in this existing repository**. The current interface has been migrated from the embedded asset into a root-level web app so it can be hosted as an installable PWA without creating a replacement product or repository.

## Current web foundation
- Existing interface retained at `index.html`.
- Existing browser scripts retained: `builtin-intelligence.js` and `jszip.min.js`.
- Existing `flexo_v1` local-storage key preserved.
- PWA manifest and service worker added for install support and offline app-shell caching after the first successful load.
- API requests are not cached by the service worker.

## Honest capability status
This is a foundation, not a claim that the full all-in-one AI vision is complete. Built-in responses and keyword-based local knowledge lookup are not equivalent to a general reasoning model. A true offline AI experience still needs an actual local model runtime and downloadable model weights. Online research, source-backed citations, robust document extraction, and advanced retrieval are also separate implementation stages.

See [WEB_PLATFORM_STATUS.md](./WEB_PLATFORM_STATUS.md) for details.

## Deployment
Deploy the repository root as a static site on an HTTPS host. The web entry point is `index.html`. No provider API key is needed for the PWA shell itself.

The legacy Android project is retained in this branch for now so existing files are not destructively removed before the web version is verified.
