/* eslint-disable no-restricted-globals */

// Cache names
const CACHE_NAME = 'ai-chat-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/manifest.json'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch resources
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});