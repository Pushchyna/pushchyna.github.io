const CACHE_NAME = 'digital-publications-cache-v2'; // Оновіть версію для очищення старого кешу
const urlsToCache = [
  '/',
  '/index.html',
  // Додайте статичні ресурси, якщо потрібно (наприклад, фавікон, маніфест)
  '/manifest.json',
  // '/icon-192x192.png', // Якщо є
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // Повертаємо з кешу, якщо є
        }
        // Клонуємо запит для динамічного кешування
        const fetchRequest = event.request.clone();
        return fetch(fetchRequest).then((networkResponse) => {
          // Перевіряємо, чи відповідь валідна
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          // Клонуємо відповідь і додаємо до кешу
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          return networkResponse;
        });
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});