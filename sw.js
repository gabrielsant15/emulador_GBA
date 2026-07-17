const CACHE_NAME = 'gba-space-v4';
const CACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './screenshot.png',
  './icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        CACHE_ASSETS.map(asset => cache.add(asset))
      ).then(results => {
        results.forEach((result, i) => {
          if (result.status === 'rejected') {
            console.warn(`Falha ao cachear: ${CACHE_ASSETS[i]}`, result.reason);
          }
        });
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
