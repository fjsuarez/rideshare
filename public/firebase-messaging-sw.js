importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDBuWidFtSx4dxCHi2ztGmE9Ay6UZsOPZA",
  authDomain: "mcsbt-capstone.firebaseapp.com",
  projectId: "mcsbt-capstone",
  storageBucket: "mcsbt-capstone.firebasestorage.app",
  messagingSenderId: "276340456007",
  appId: "1:276340456007:web:98a7713b64c2f291634f62",
  measurementId: "G-XSJW2FV0L8",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] BACKGROUND message received:', payload);
  
  // Only show notification if we don't have a visible client
  clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then((clientList) => {
    // If we have an active window, don't show the notification
    // This avoids duplicate notifications since the foreground handler will show it
    if (clientList.length > 0 && clientList.some(client => client.visibilityState === 'visible')) {
      console.log('[firebase-messaging-sw.js] App is visible, not showing notification');
      return;
    }
    
    // No visible windows, show notification
    const notificationTitle = payload.notification?.title || 'Rideshare Notification';
    const notificationOptions = {
      body: payload.notification?.body || '',
      icon: '/assets/logo.png',
      badge: '/assets/logo.png', // Fixed typo in "assets"
      data: payload.data
    };
    
    return self.registration.showNotification(notificationTitle, notificationOptions);
  });
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click', event);
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ('focus' in client) {
            return client.focus();
          }
        }
        return clients.openWindow('/');
      })
  );
});