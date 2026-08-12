// ── E Tech Elevators — Hero Video Service Worker ─────────────────────────────
// Cache-first strategy with full Range Request support for .mp4 video assets.
// Videos use HTTP byte-range requests (206) for streaming; this SW intercepts
// those, fetches the FULL video once, caches it, then slices byte ranges from
// the cache — giving instant replay on every subsequent visit.
//
// Versioning: bump CACHE_NAME to force old caches to be cleared on next visit.

const CACHE_NAME = "etch-video-cache-v3";

// Only intercept these specific video paths (keeps the cache lean)
const VIDEO_PATTERNS = [
  "/images/elevator-allkeyframe-desktop.mp4",
  "/images/elevator-allkeyframe-mobile.mp4",
];

// ── Install: skip waiting so the new SW activates immediately ────────────────
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// ── Activate: delete old caches ──────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  // Take control of all pages immediately (no need for a second refresh)
  self.clients.claim();
});

// ── Build a proper 206 Partial Content response from a cached full response ──
async function buildRangeResponse(cachedResponse, rangeHeader) {
  const arrayBuffer = await cachedResponse.arrayBuffer();
  const totalBytes = arrayBuffer.byteLength;

  // Parse "bytes=start-end" header
  const [, rangeStr] = rangeHeader.split("=");
  const [startStr, endStr] = rangeStr.split("-");
  const start = parseInt(startStr, 10);
  const end = endStr ? parseInt(endStr, 10) : totalBytes - 1;

  const slicedBuffer = arrayBuffer.slice(start, end + 1);

  return new Response(slicedBuffer, {
    status: 206,
    statusText: "Partial Content",
    headers: {
      "Content-Type": cachedResponse.headers.get("Content-Type") || "video/mp4",
      "Content-Length": String(slicedBuffer.byteLength),
      "Content-Range": `bytes ${start}-${end}/${totalBytes}`,
      "Accept-Ranges": "bytes",
    },
  });
}

// ── Fetch: cache-first for videos, passthrough for everything else ────────────
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Only intercept GET requests for our specific video files
  if (
    event.request.method !== "GET" ||
    !VIDEO_PATTERNS.some((pattern) => url.pathname === pattern)
  ) {
    return; // Let the browser handle it normally
  }

  const rangeHeader = event.request.headers.get("Range");

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Build a cache key using just the URL (no Range header) so all
      // range requests map to the same single full-video cache entry
      const cacheKey = new Request(event.request.url);

      // 1. Check if we already have the full video cached
      const cachedFull = await cache.match(cacheKey);

      if (cachedFull) {
        // Serve from cache — handle range requests by slicing the buffer
        if (rangeHeader) {
          return buildRangeResponse(cachedFull.clone(), rangeHeader);
        }
        return cachedFull.clone();
      }

      // 2. Not cached yet — fetch the FULL video directly
      try {
        const networkResponse = await fetch(event.request.url);

        if (networkResponse.ok && networkResponse.status === 200) {
          // Store the full response in cache (clone because body can only be read once)
          cache.put(cacheKey, networkResponse.clone());
        }

        // If the original request was a range request, convert the full 200
        // response into a proper 206 slice so the video player doesn't choke
        if (rangeHeader && networkResponse.ok) {
          return buildRangeResponse(networkResponse, rangeHeader);
        }

        return networkResponse;
      } catch (err) {
        // Network failed and nothing in cache — fall back to original request
        return fetch(event.request);
      }
    })
  );
});
