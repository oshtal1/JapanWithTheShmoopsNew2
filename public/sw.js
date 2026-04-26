const CACHE_VERSION = "japan-trip-v2";
const RUNTIME_CACHE = "japan-trip-runtime-v2";

const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/og-image.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
  "/locations/tokyo-shinjuku.png",
  "/locations/tokyo-asakusa.png",
  "/locations/kamakura.png",
  "/locations/izu.png",
  "/locations/osaka.png",
  "/locations/kyoto.png",
  "/locations/takayama.png",
  "/locations/matsumoto.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![CACHE_VERSION, RUNTIME_CACHE].includes(key))
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const fresh = await fetch(request);
    cache.put(request, fresh.clone());
    return fresh;
  } catch {
    return (await cache.match(request)) || (await caches.match("/"));
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  const cache = await caches.open(RUNTIME_CACHE);
  cache.put(request, response.clone());
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  if (["style", "script", "worker", "image", "font", "manifest"].includes(request.destination)) {
    event.respondWith(cacheFirst(request));
  }
});
