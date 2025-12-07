self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.registration.unregister()
    .then(() => console.log('Service Worker unregistered'))
    .catch((err) => console.error('Failed to unregister Service Worker', err));
});
