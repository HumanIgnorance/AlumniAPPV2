// ATMS service worker — offline app shell + safe, user-controlled updates.
//
// Same behaviour as the SCLF app's service worker:
//   - The app SHELL (page HTML, scripts, styles, fonts, icons) is cached, so the
//     interface still opens with no connection.
//   - DATA is never cached: /api/, /storage/, websockets and auth calls always go
//     to the network. Offline, lists simply do not load; nothing stale or private
//     is ever shown from here.
//   - A new version never swaps in underneath the person. It waits until they tap
//     "Update now" in the app (UpdateNotice sends SKIP_WAITING).
//
// To force every phone to refresh its cache after a big release, bump VERSION.

const VERSION = 'v1';
const SHELL_CACHE = `atms-shell-${VERSION}`;   // page HTML only (no user data)
const ASSET_CACHE = `atms-assets-${VERSION}`;  // /build/assets, /images, /sounds
const FONT_CACHE = `atms-fonts-${VERSION}`;    // Google Fonts
const KEEP = [SHELL_CACHE, ASSET_CACHE, FONT_CACHE];

const EXTRA_ASSETS = [
    '/images/site-logo.png', '/images/icon-192.png', '/images/icon-512.png',
    '/images/icon-maskable-512.png', '/images/apple-touch-icon.png',
    '/images/favicon-32.png', '/images/favicon-16.png', '/favicon.ico',
];

// Every JS/CSS file the production build produced (from Vite's manifest), so even
// pages the person has never opened are already on the device. Images are NOT
// precached (the build has several multi-MB photos); they are cached on first view.
async function buildFileList() {
    try {
        const res = await fetch('/build/manifest.json', { cache: 'no-cache' });
        if (!res.ok) return [];
        const manifest = await res.json();
        const urls = new Set();
        Object.values(manifest).forEach((e) => {
            if (e.file && /\.(js|css|woff2?)$/i.test(e.file)) urls.add('/build/' + e.file);
            (e.css || []).forEach((c) => urls.add('/build/' + c));
        });
        return [...urls];
    } catch (e) {
        return []; // dev server / no build: nothing to precache
    }
}

// A page produced while `npm run dev` is running points at the Vite dev server;
// saved, it would show a blank screen once that server is off.
async function saveShell(cache, key, res) {
    try {
        if (!res || !res.ok || res.redirected || res.type !== 'basic') return;
        const text = await res.clone().text();
        if (text.includes('@vite/client') || text.includes('/@react-refresh')) return;
        await cache.put(key, res.clone());
    } catch (e) { /* best effort */ }
}

async function precache() {
    const shell = await caches.open(SHELL_CACHE);
    const assets = await caches.open(ASSET_CACHE);
    const files = [...(await buildFileList()), ...EXTRA_ASSETS];
    await Promise.allSettled([
        fetch('/login', { credentials: 'same-origin' }).then((r) => saveShell(shell, new Request(self.location.origin + '/login'), r)).catch(() => {}),
        ...files.map((u) => assets.add(u).catch(() => {})),
    ]);
}

// Drop old cache versions and build files that no longer exist.
async function cleanup() {
    const names = await caches.keys();
    await Promise.all(names.filter((n) => n.startsWith('atms-') && !KEEP.includes(n)).map((n) => caches.delete(n)));
    try {
        const keep = new Set((await buildFileList()).concat(EXTRA_ASSETS));
        if (keep.size <= EXTRA_ASSETS.length) return; // no manifest: don't prune blindly
        const assets = await caches.open(ASSET_CACHE);
        for (const req of await assets.keys()) {
            const path = new URL(req.url).pathname;
            const isCode = /\.(js|css)$/i.test(path);
            if (path.startsWith('/build/assets/') && isCode && !keep.has(path)) await assets.delete(req);
        }
    } catch (e) { /* best effort */ }
}

self.addEventListener('install', (event) => {
    // No automatic skipWaiting: a new version waits until the person taps
    // "Update now" (see UpdateNotice). A very first install still activates at once.
    event.waitUntil(precache());
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(Promise.all([cleanup(), self.clients.claim()]));
});

const shellKey = (req) => {
    const u = new URL(req.url);
    return new Request(u.origin + u.pathname);
};

const timeout = (ms) => new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));

// Page loads: network first (always the freshest page when online), falling back
// to the saved shell when offline or the connection is too slow.
async function handleNavigation(request) {
    const cache = await caches.open(SHELL_CACHE);
    try {
        const res = await Promise.race([fetch(request), timeout(10000)]);
        if ([502, 503, 504].includes(res.status)) throw new Error('server down');
        saveShell(cache, shellKey(request), res.clone());
        return res;
    } catch (e) {
        const hit =
            (await cache.match(shellKey(request))) ||
            (await cache.match('/login')) ||
            (await cache.match((await cache.keys())[0] || '/login'));
        if (hit) return hit;
        return new Response(
            '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
            '<title>ATMS</title><body style="font-family:system-ui,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center;padding:24px">' +
            '<div><h1>You\'re offline</h1><p>Open ATMS once while connected so it can be used without a connection.</p>' +
            '<button onclick="location.reload()" style="padding:10px 22px;border:0;border-radius:10px;background:#2563eb;color:#fff;font-weight:700">Try again</button></div>',
            { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
        );
    }
}

async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const hit = await cache.match(request);
    if (hit) return hit;
    const res = await fetch(request);
    if (res && res.status === 200 && res.type === 'basic') cache.put(request, res.clone());
    return res;
}

async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const hit = await cache.match(request);
    const refresh = fetch(request)
        .then((res) => {
            if (res && (res.ok || res.type === 'opaque')) cache.put(request, res.clone());
            return res;
        })
        .catch(() => null);
    return hit || (await refresh) || Response.error();
}

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);

    if (url.origin === self.location.origin) {
        const p = url.pathname;
        // DATA is never cached or intercepted.
        if (p.startsWith('/api/') || p.startsWith('/storage/') || p.startsWith('/broadcasting') ||
            p.startsWith('/sanctum') || p.startsWith('/app/') || p === '/sw.js' || p === '/manifest.json') return;

        if (req.mode === 'navigate') {
            event.respondWith(handleNavigation(req));
            return;
        }
        if (p.startsWith('/build/assets/') || p.startsWith('/images/') || p.startsWith('/sounds/') || p === '/favicon.ico') {
            event.respondWith(cacheFirst(req, ASSET_CACHE));
        }
        return;
    }

    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
        event.respondWith(staleWhileRevalidate(req, FONT_CACHE));
    }
});
