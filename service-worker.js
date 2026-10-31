const CACHE_NAME = "flexo-app-shell-v3";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./builtin-intelligence.js",
  "./jszip.min.js",
  "./icons/flexo-mark.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  const runtimeOrigin = url.origin === "https://esm.run" || url.origin === "https://cdn.jsdelivr.net";
  if (!sameOrigin && !runtimeOrigin) return;
  if (url.pathname.includes("/api/")) return;

  // Cache only the explicitly used JavaScript module CDNs. Model weights are
  // managed by WebLLM's own browser cache; arbitrary external data is not cached.
  if (!sameOrigin) {
    if (!/\\.(?:m?js)(?:$|\\?)/i.test(url.pathname) && !url.pathname.includes("/@mlc-ai/web-llm")) return;
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(response => {
        if (response.ok && response.type !== "opaque") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      }))
    );
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put("./index.html", copy));
        }
        return response;
      }).catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});