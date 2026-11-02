# Lex Beta integration status

## Implemented in this branch

- Added Lex to the existing Flexo navigation and screen system through the already-loaded built-in intelligence asset. No separate app or site was created.
- Added a dedicated video workspace with a distinct visual design.
- Added text-to-video, first-frame image-to-video, first + last frame, and reference-guided modes.
- Added prompt, resolution, aspect ratio, duration, GPU backend URL and access-token controls.
- Added job submission, queue/running/completed/failed polling, MP4 retrieval, preview and download.
- Added a FastAPI inference adapter that invokes the official `pika-h3-pro` CLI and serializes one inference request per GPU.
- Added a GPU Docker build recipe and backend setup documentation.
- Added a Python backend validation workflow and enabled the Flexo APK build workflow on this feature branch.

## Not yet complete / external prerequisites

- The GPU inference backend has not been deployed. Lex needs a dedicated NVIDIA GPU host and persistent storage.
- No GPU provider, server URL, Hugging Face token, or backend access token has been provisioned. No secrets have been added to GitHub.
- No real generation has been executed end-to-end. UI syntax validation alone does not prove inference works.
- Official Pika documentation describes representative H100 80GB tests and approximately 210 GB of base model components. Start at 480p / 5 seconds and qualify hardware before enabling higher settings.
- Physical Android WebView testing, backend integration testing, and a full APK build remain to be checked by CI and on-device.
- The API job queue is process-local; deploy a single API process per GPU and use persistent volumes. A production multi-replica service needs a durable queue and shared job store.

## Licensing

The inference code is Apache-2.0. Pika H3 Flex adapters and MiniMax-H3 base components are subject to the MiniMax H3 Community License Agreement. Retain upstream LICENSE, NOTICE, third-party notices and Pika attribution. The model weights are downloaded at runtime and are not committed to this repository.

## Branch safety

This work is on `feature/lex-pika-h3-flex`. The production branch has not been changed and no deployment has been triggered.
