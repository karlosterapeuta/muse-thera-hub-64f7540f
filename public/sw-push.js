// Push notification handler for service worker
// This file is injected into the service worker build

self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Faça suas devolutivas com os pais usando a Escala Musetera!',
      icon: data.icon || '/icon-original.png',
      badge: data.badge || '/icon-original.png',
      tag: data.tag || 'musetera-notification',
      renotify: true,
      requireInteraction: true,
      data: data.data || { url: '/evaluation' },
      vibrate: [200, 100, 200],
    };

    event.waitUntil(
      self.registration.showNotification(data.title || '🎵 Musetera', options)
    );
  } catch (e) {
    console.error('[SW] Push parse error:', e);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/evaluation';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing window if available
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      // Open new window
      return self.clients.openWindow(urlToOpen);
    })
  );
});
