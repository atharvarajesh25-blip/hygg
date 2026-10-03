const CACHE_NAME = 'ts-v29.8-pwa-v2';
const APP_SHELL = [
  '/hygg/',
  '/hygg/index.html',
  '/hygg/manifest.json',
  '/hygg/icons/icon-192.png',
  '/hygg/icons/icon-512.png',
  '/hygg/icons/icon-maskable-512.png',
  '/hygg/icons/apple-touch-icon.png',
  '/hygg/icons/favicon-64.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then(cached => cached || caches.match('/hygg/index.html')))
  );
});
