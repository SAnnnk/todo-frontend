self.addEventListener('install', event => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activated');
});

self.addEventListener('push', event => {
  let payload = { title: 'Notification', body: 'You have a message' };

  if (event.data) {
    try {
      payload = event.data.json();
    } catch (err) {
      console.error('Error parsing push payload:', err);
    }
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: 'logo192.png', 
    })
  );
});
