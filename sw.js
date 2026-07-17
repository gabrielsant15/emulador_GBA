const CACHE_NAME = 'gba-space-v3';
// Liste aqui EXATAMENTE os arquivos que você tem no seu GitHub
const CACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './screenshot.png',
  './icon.png' // Certifique-se de que este arquivo existe na raiz
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Tenta adicionar os assets, mas não trava se um falhar
      return Promise.allSettled(
        CACHE_ASSETS.map(asset => cache.add(asset))
      ).then(results => {
        results.forEach((result, i) => {
          if (result.status === 'rejected') {
            console.warn(`Falha ao cachear asset: ${CACHE_ASSETS[i]}`, result.reason);
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
