# Quick AI backend — repository status

**Status: NOT IMPLEMENTED in the current repository.**

The current source tree does not contain `api/quick-ai.py`, a Quick AI screen asset, a foreground overlay service, or a configured remote AI endpoint. Older instructions in this file referred to a planned implementation and must not be treated as deployable setup steps.

The current main chat is local-first:
- It checks the built-in response catalogue.
- It searches imported local knowledge.
- It extracts relevant text from the local library.
- It does not call a generative AI provider.

A future hosted AI integration must be implemented and tested end-to-end before setup instructions are published. Provider credentials must remain server-side; never put API keys in the Android app, HTML, JavaScript or GitHub repository.

Until that work is complete, the app should clearly describe its current local capabilities and limitations.
