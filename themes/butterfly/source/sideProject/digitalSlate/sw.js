const CACHE_PREFIX = 'michaelpig-digital-slate-';
const CACHE_NAME = `${CACHE_PREFIX}v8`;
const ASSETS = ['./', './index.html', './styles.css', './app.mjs', './model.mjs', './sounds.mjs', './manifest.webmanifest', './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];
const assetURLs = new Set(ASSETS.map(path => new URL(path, self.registration.scope).href));
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  url.search = ''; url.hash = '';
  // Only this app's known assets are cached; other side projects are untouched.
  if (!assetURLs.has(url.href)) return;
  event.respondWith(caches.open(CACHE_NAME).then(async cache => (await cache.match(url.href)) || fetch(event.request)));
});
