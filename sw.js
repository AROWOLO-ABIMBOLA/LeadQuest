/* Lead Quest offline helper.
   The game page is fetched fresh whenever there is internet, so updates you upload reach players
   the next time they open the game. All files sit side by side (no folders), so uploading is simple. Bible books (bible-<book>.js) are saved in their own store the first time they
   are opened, and are kept across updates, so families never need to download them twice. */
const CACHE = "lead-quest-v48";
const BIBLE = "lead-quest-bible-v2";
const STORIES = "lead-quest-stories-v2";
const BOOKPACKS = "lead-quest-books-v1";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./favicon-64.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE && k !== BIBLE && k !== STORIES && k !== BOOKPACKS).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (/\/bible-[a-z0-9]+\.js$/.test(url.pathname)) {
    e.respondWith(caches.open(BIBLE).then((c) => c.match(req).then((hit) => hit || fetch(req).then((r) => { if (r.ok) c.put(req, r.clone()); return r; }))));
    return;
  }
  if (/\/book-[a-z0-9]+\.js$/.test(url.pathname)) {
    /* library book packs: same rule as story packs; an updated book has a new ?v= */
    e.respondWith(caches.open(BOOKPACKS).then((c) => c.match(req).then((hit) => hit || fetch(req).then((r) => {
      if (r.ok) { c.put(req, r.clone()); c.keys().then((ks) => ks.forEach((k) => { const u = new URL(k.url); if (u.pathname === url.pathname && u.search !== url.search) c.delete(k); })); }
      return r; }))));
    return;
  }
  if (/\/story-[a-z0-9]+\.js$/.test(url.pathname)) {
    /* story packs: kept across updates; a changed book has a new ?v= and replaces its old copy */
    e.respondWith(caches.open(STORIES).then((c) => c.match(req).then((hit) => hit || fetch(req).then((r) => {
      if (r.ok) { c.put(req, r.clone()); c.keys().then((ks) => ks.forEach((k) => { const u = new URL(k.url); if (u.pathname === url.pathname && u.search !== url.search) c.delete(k); })); }
      return r; }))));
    return;
  }
  if (req.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname.endsWith("/")) {
    e.respondWith(fetch(req).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return r; })
      .catch(() => caches.match(req).then((r) => r || caches.match("./index.html"))));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => {
    if (r.ok || r.type === "opaque") { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
    return r; })));
});
