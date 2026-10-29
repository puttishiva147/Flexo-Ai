import json
import os
from http.server import BaseHTTPRequestHandler
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

MAX_BODY = 10 * 1024 * 1024

class handler(BaseHTTPRequestHandler):
    def _send(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self._send(200, {"ok": True})

    def do_POST(self):
        if self.path.rstrip("/") != "/api/quick-ai":
            self._send(404, {"error": "Endpoint not found"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0 or length > MAX_BODY:
                self._send(413, {"error": "Request must be under 10 MB"})
                return
            data = json.loads(self.rfile.read(length).decode("utf-8"))
        except Exception:
            self._send(400, {"error": "Invalid JSON request"})
            return

        api_key = os.environ.get("OPENAI_API_KEY", "").strip()
        if not api_key:
            self._send(503, {"error": "AI backend is not configured: set OPENAI_API_KEY in deployment environment variables."})
            return

        system = str(data.get("system") or "You are Flexo Quick AI. Be concise and helpful.")[:8000]
        incoming = data.get("messages") or []
        if not isinstance(incoming, list):
            self._send(400, {"error": "messages must be a list"})
            return
        messages = [{"role": "system", "content": system}]
        for m in incoming[-24:]:
            if not isinstance(m, dict) or m.get("role") not in ("user", "assistant"):
                continue
            content = str(m.get("content", ""))[:20000]
            messages.append({"role": m["role"], "content": content})

        context_text = str(data.get("context_text") or "")[:12000]
        image_data_url = data.get("image_data_url")
        if context_text or image_data_url:
            # Attach shared context to the latest user turn only.
            for idx in range(len(messages) - 1, 0, -1):
                if messages[idx]["role"] == "user":
                    parts = [{"type": "text", "text": messages[idx]["content"]}]
                    if context_text:
                        parts.append({"type": "text", "text": "User-shared context:\n" + context_text})
                    if isinstance(image_data_url, str) and image_data_url.startswith("data:image/") and len(image_data_url) <= 8 * 1024 * 1024:
                        parts.append({"type": "image_url", "image_url": {"url": image_data_url}})
                    messages[idx]["content"] = parts
                    break

        payload = json.dumps({
            "model": os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
            "messages": messages,
            "temperature": 0.4,
            "max_tokens": 900
        }).encode("utf-8")
        request = Request(
            os.environ.get("OPENAI_BASE_URL", "https://api.openai.com/v1/chat/completions"),
            data=payload,
            headers={"Authorization": "Bearer " + api_key, "Content-Type": "application/json"},
            method="POST"
        )
        try:
            with urlopen(request, timeout=45) as response:
                result = json.loads(response.read().decode("utf-8"))
            answer = result.get("choices", [{}])[0].get("message", {}).get("content", "")
            if isinstance(answer, list):
                answer = "\n".join(p.get("text", "") for p in answer if isinstance(p, dict))
            if not answer:
                self._send(502, {"error": "The AI provider returned an empty answer"})
                return
            self._send(200, {"text": answer})
        except HTTPError as exc:
            detail = exc.read(1500).decode("utf-8", "replace")
            self._send(502, {"error": "AI provider request failed (" + str(exc.code) + "). Check provider configuration."})
        except (URLError, TimeoutError):
            self._send(504, {"error": "AI provider timed out or could not be reached"})
        except Exception:
            self._send(500, {"error": "Unexpected AI backend error"})
