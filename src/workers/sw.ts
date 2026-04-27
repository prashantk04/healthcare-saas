/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'medcore-v1';
const STATIC_ASSETS = ['/', '/index.html'];

// ─── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ─── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
  );
  self.clients.claim();
});

// ─── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event: FetchEvent) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request);
    })
  );
});

// ─── Message: show notification from app ─────────────────────────────────────
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  if (event.data?.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon } = event.data as {
      type: string;
      title: string;
      body: string;
      icon?: string;
    };
    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: icon ?? '/favicon.svg',
        badge: '/favicon.svg',
        vibrate: [200, 100, 200],
        tag: 'medcore-alert',
        renotify: true,
      })
    );
  }
});

// ─── Push ─────────────────────────────────────────────────────────────────────
self.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json() as { title: string; body: string } | undefined;
  const title = data?.title ?? 'MedCore Alert';
  const body = data?.body ?? 'New clinical update.';
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      vibrate: [200, 100, 200],
      tag: 'medcore-push',
    })
  );
});

// ─── Notification click ───────────────────────────────────────────────────────
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      const existing = clientList.find((c) => c.url.includes('/dashboard'));
      if (existing) return existing.focus();
      return self.clients.openWindow('/dashboard');
    })
  );
});