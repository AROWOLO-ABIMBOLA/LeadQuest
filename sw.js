/* Lead Quest offline helper.
   The game page is fetched fresh whenever there is internet, so updates you upload reach players
   the next time they open the game. Bible books are saved in their own store the first time they
   are opened, and are kept across updates, so families never need to download them twice. */
const CACHE = "lead-quest-v41";
const BIBLE = "lead-quest-bible-v1";
const STORIES = "lead-quest-stories-v1";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/favicon-64.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE && k !== BIBLE && k !== STORIES).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.pathname.includes("/bible/")) {
    e.respondWith(caches.open(BIBLE).then((c) => c.match(req).then((hit) => hit || fetch(req).then((r) => { if (r.ok) c.put(req, r.clone()); return r; }))));
    return;
  }
  if (url.pathname.includes("/stories/")) {
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
