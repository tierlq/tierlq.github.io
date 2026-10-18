/* Bộ nhớ đệm cho web: ảnh tướng và ảnh đồ/ngọc/phép lưu lâu (tải 1 lần); trang luôn lấy bản mới, mất mạng thì dùng bản đã lưu.
   Tệp JS có ?v= (assets/*.js?v=…): dùng ngay bản đã lưu rồi lấy bản mới ở nền cho lần sau, vì ?v= đổi mỗi lần sửa
   → lần mở sau trên mạng yếu không phải chờ tải lại mã.
   Khi thay ảnh trong p/, s/, s2/ hoặc b/ có cùng tên tệp, tăng V để người xem nhận ảnh mới. */
const V = "v1";
const IMG = "img-" + V, PAGES = "pages-" + V;
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== IMG && k !== PAGES) await caches.delete(k);
  await self.clients.claim();
})()));
self.addEventListener("fetch", e => {
  const req = e.request, u = new URL(req.url);
  if (req.method !== "GET" || u.origin !== location.origin) return;
  if (/\/(p|s|s2|b)\/[^/]+\.webp$/.test(u.pathname) || /\.(png|jpg|svg)$/.test(u.pathname)) {
    e.respondWith(caches.open(IMG).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const r = await fetch(req);
      if (r.ok && r.type === "basic") c.put(req, r.clone());
      return r;
    }));
    return;
  }
  if (/^\/assets\/[^/]+\.js$/.test(u.pathname) && u.searchParams.has("v")) {
    e.respondWith((async () => {
      const c = await caches.open(PAGES), hit = await c.match(req);
      const net = fetch(req).then(async r => {
        if (r.ok && r.type === "basic") { await c.delete(req, { ignoreSearch: true }); await c.put(req, r.clone()); }
        return r;
      });
      if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
      try { return await net; } catch (err) { return (await c.match(req, { ignoreSearch: true })) || Response.error(); }
    })());
    return;
  }
  e.respondWith((async () => {
    try {
      const r = await fetch(req);
      // Chỉ lưu bản mới nhất của mỗi tệp (bỏ các bản ?v= cũ để bộ nhớ không phình ra)
      if (r.ok && r.type === "basic") { const c = await caches.open(PAGES); await c.delete(req, { ignoreSearch: true }); await c.put(req, r.clone()); }
      return r;
    } catch (err) {
      return (await caches.match(req, { ignoreSearch: true })) || Response.error();
    }
  })());
});
