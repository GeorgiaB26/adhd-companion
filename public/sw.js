// Hummingbird Service Worker — handles push notifications & offline caching
const CACHE_NAME = 'hummingbird-v1';
const ASSETS = ['/', '/logo.svg'];

// Install
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — serve from cache when offline
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// Push notification handler
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || 'Hummingbird 🌿';
  const options = {
    body: data.body || 'Time for a quick check-in!',
    icon: '/logo.svg',
    badge: '/logo.svg',
    vibrate: [100, 50, 100],
    data: { url: '/' },
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// Click handler — open app when notification is tapped
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url === '/' && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
