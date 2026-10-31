#!/usr/bin/env node
// Kiểm link tĩnh trên mọi trang HTML của web (không cần mạng):
//  - link nội bộ (href/src bắt đầu "/" hoặc tương đối) trỏ tới tệp có thật
//  - neo "#id" trên trang đích có phần tử id đó (trang chủ: chỉ kiểm id có sẵn trong HTML, bỏ qua #tuong-… do app.js mở)
//  - mỗi trang có <title>, meta description ≤160 ký tự, canonical đúng địa chỉ, đúng 1 thẻ h1
//  - mọi URL trong sitemap.xml có tệp, và mọi trang (trừ 404, tệp xác minh) có trong sitemap
// Chạy: node tools/check/links.js   (thoát mã 1 nếu có lỗi)
const fs = require('fs'), path = require('path');
const R = path.resolve(__dirname, '..', '..');
const SITE = JSON.parse(fs.readFileSync(path.join(R, 'tools/site.json'), 'utf8')).origin.replace(/\/$/, '');
const SKIP_DIR = new Set(['.git', 'tools', 'node_modules', '.well-known']);
const pages = [];
(function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    if (f.isDirectory()) { if (!SKIP_DIR.has(f.name)) walk(path.join(d, f.name)); }
    else if (f.name.endsWith('.html')) pages.push(path.join(d, f.name));
  }
})(R);
const rel = f => '/' + path.relative(R, f).replace(/\\/g, '/').replace(/index\.html$/, '');
const html = {}, ids = {};
for (const f of pages) {
  const h = fs.readFileSync(f, 'utf8'); html[f] = h;
  ids[f] = new Set([...h.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
}
const errs = [], warn = [];
const resolveFile = (from, u) => {
  let p = u.startsWith('/') ? path.join(R, u) : path.join(path.dirname(from), u);
  if (u.endsWith('/') || fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
  return p;
};
const isVerify = f => /google[0-9a-f]+\.html$/.test(f);
let nLinks = 0;
for (const f of pages) {
  if (isVerify(f)) continue;
  const h = html[f], me = rel(f);
  // các thẻ cơ bản
  const title = (h.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (!title) errs.push(`${me}: thiếu <title>`);
  const desc = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!/404\.html$/.test(f)) {
    if (!desc) errs.push(`${me}: thiếu meta description`);
    else if (desc.replace(/&amp;/g, '&').replace(/&quot;/g, '"').length > 160) errs.push(`${me}: description ${desc.length} ký tự (>160)`);
    const canon = (h.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
    if (!canon) errs.push(`${me}: thiếu canonical`);
    else if (canon !== SITE + me) errs.push(`${me}: canonical ${canon} khác ${SITE + me}`);
  }
  const h1 = (h.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) warn.push(`${me}: có ${h1} thẻ h1`);
  // link và tài nguyên
  const body = h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  for (const m of body.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    let u = m[1].replace(/&amp;/g, '&');
    if (/^(https?:|mailto:|tel:|data:|javascript:|blob:)/.test(u) || u.startsWith('//')) continue;
    if (u.startsWith(SITE)) u = u.slice(SITE.length) || '/';
    nLinks++;
    const [pth, hash] = u.split('#'); const clean = pth.split('?')[0];
    const target = clean === '' ? f : resolveFile(f, clean);
    if (!fs.existsSync(target)) { errs.push(`${me}: link hỏng ${u}`); continue; }
    if (hash && target.endsWith('.html') && ids[target]) {
      if (rel(target) === '/' && /^tuong-/.test(hash)) continue; // app.js mở bảng chi tiết
      if (!ids[target].has(decodeURIComponent(hash))) errs.push(`${me}: neo #${hash} không có trên ${rel(target)}`);
    }
  }
}
// sitemap
const sm = fs.readFileSync(path.join(R, 'sitemap.xml'), 'utf8');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const inSm = new Set();
for (const l of locs) {
  if (!l.startsWith(SITE)) { errs.push(`sitemap: ${l} không thuộc ${SITE}`); continue; }
  const u = l.slice(SITE.length) || '/'; inSm.add(u);
  if (!fs.existsSync(resolveFile(path.join(R, 'index.html'), u))) errs.push(`sitemap: ${u} không có tệp`);
}
if (new Set(locs).size !== locs.length) errs.push('sitemap: có URL trùng');
for (const f of pages) { const u = rel(f); if (!isVerify(f) && !/404\.html$/.test(f) && !inSm.has(u)) errs.push(`${u}: chưa có trong sitemap`); }
console.log(`${pages.length} trang · ${nLinks} link nội bộ · sitemap ${locs.length} URL`);
warn.forEach(w => console.log('Cảnh báo:', w));
errs.forEach(e => console.log('LỖI:', e));
console.log(errs.length ? `${errs.length} lỗi` : 'Không có lỗi link.');
process.exit(errs.length ? 1 : 0);
