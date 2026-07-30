/* ============================================
   Micasa — Service Worker
   Híbrido: Network-First (API/HTML) / Cache-First (Assets)
   ============================================ */

const CACHE_VERSION = 'micasa-v1';

// Detect base path dynamically
const BASE = self.registration.scope;

// Archivos estáticos a pre-cachear (muy básico para Next.js)
const STATIC_FILES = [
  '/',
  '/manifest.json',
  '/icon.svg'
];

// ── Install: precache all static assets ──
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(async (cache) => {
      const urls = STATIC_FILES.map(f => new URL(f, BASE).href);
      await cache.addAll(urls);
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: clean old caches ──
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: Network-First for HTML/Data, Cache-First for assets ──
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Solo procesamos peticiones GET (Supabase maneja las mutaciones)
  if (request.method !== 'GET') return;
  // Solo interceptamos HTTP/HTTPS
  if (!request.url.startsWith('http')) return;

  const url = new URL(request.url);

  // CACHE-FIRST para archivos estáticos de Next.js (_next/static), imágenes, iconos
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/_next/image/') ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|gif|woff2?|css|js)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; // Encontrado en caché
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_VERSION).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // NETWORK-FIRST para el resto (HTML, datos, API)
  // De esta manera la app siempre muestra los datos más recientes si hay conexión.
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_VERSION).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Fallback a caché si estamos offline
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;
        
        // Offline fallback genérico si es navegación a documento
        if (request.destination === 'document') {
           const rootCache = await caches.match(new URL('/', BASE).href);
           if (rootCache) return rootCache;
        }
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      })
  );
});