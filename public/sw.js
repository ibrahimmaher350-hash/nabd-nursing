/**
 * public/sw.js — نبض للتمريض المنزلي
 * Service Worker — PWA + offline fallback + FCM background messages.
 */

const CACHE_NAME = 'nabd-v1'
const OFFLINE_URL = '/offline'

// Assets to precache
const PRECACHE_ASSETS = [
  '/',
  '/services',
  '/booking',
  '/offline',
  '/manifest.webmanifest',
  '/logo.jpg',
]

// ── Install ────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Pre-cache failed:', err)
      })
    })
  )
  self.skipWaiting()
})

// ── Activate ───────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

// ── Fetch ─────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and API routes
  if (
    event.request.method !== 'GET' ||
    event.request.url.includes('/api/') ||
    event.request.url.includes('firebase')
  ) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached

      return fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (response.ok && response.type === 'basic') {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          }
          return response
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL)
          }
          return new Response('Offline', { status: 503 })
        })
    })
  )
})

// ── Firebase Cloud Messaging (background) ─────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return

  let data = {}
  try {
    data = event.data.json()
  } catch {
    data = { notification: { title: 'نبض للتمريض المنزلي', body: event.data.text() } }
  }

  const notification = data.notification ?? {}
  const title = notification.title ?? 'نبض للتمريض المنزلي'
  const body = notification.body ?? ''

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      dir: 'rtl',
      lang: 'ar-EG',
      data: data.data ?? {},
      actions: [
        { action: 'view', title: 'عرض التفاصيل' },
        { action: 'close', title: 'إغلاق' },
      ],
    })
  )
})

// ── Notification click ─────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'close') return

  const bookingId = event.notification.data?.bookingId
  const url = bookingId ? `/booking?id=${bookingId}` : '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const existingClient = clientList.find((c) => c.url.includes(self.location.origin))
      if (existingClient) {
        existingClient.focus()
        existingClient.navigate(url)
      } else {
        clients.openWindow(url)
      }
    })
  )
})
