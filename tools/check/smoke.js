#!/usr/bin/env node
// Kiểm tra chức năng bằng Playwright (Chromium có sẵn), tự chạy máy chủ tĩnh, chặn mọi request ra ngoài (font, GA).
// Ở 1440px và 390px:
//  - trang chủ: không lỗi JS, không 404, 5 slide, bảng có thẻ, không tràn ngang
//  - mở lần lượt mọi bảng chi tiết: có build (đồ, ngọc có tên Việt, phép, link tra cứu), bộ chiêu thức, điểm mạnh/yếu (trừ Tamyn), mục khắc chế (trừ tướng nguồn không có), không còn "Đang tải"
//  - mọi ảnh do app.js chèn (thẻ, build, ngọc, phù hiệu, khắc chế) trỏ tới tệp có thật
//  - bấm tướng trong mục khắc chế sang tướng khác; hộp thông tin món đồ; nút Quay lại đóng bảng; chế độ Số liệu và Tự xếp
//  - các trang tĩnh tiêu biểu (tra cứu, trang tướng, trang đường) không tràn ngang ở 390px; thêm --all để đo mọi trang
// Chạy: NODE_PATH=$(npm root -g) node tools/check/smoke.js   (thoát mã 1 nếu có lỗi)
// Ghi chú: ảnh có loading="lazy" ở dưới màn hình không tự tải trong trình duyệt không cuộn; đừng chờ sự kiện load của chúng.
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const R = path.resolve(__dirname, '..', '..');
const NO_COUNTERS = new Set(['celica', 'tamyn']); // nguồn ROV META không có danh sách (xem CLAUDE.md)
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain' };
const fileOf = u => { let p = path.join(R, decodeURIComponent(u.split('?')[0].split('#')[0])); if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html'); return p; };
const srv = http.createServer((q, s) => { const p = fileOf(q.url); if (!p.startsWith(R) || !fs.existsSync(p)) { s.writeHead(404); return s.end('404'); } s.writeHead(200, { 'content-type': MIME[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(s); });
const errs = [], log = (...a) => console.log(...a);
(async () => {
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const B = `http://127.0.0.1:${srv.address().port}`;
  const b = await chromium.launch();
  for (const [vp, w, h] of [['1440', 1440, 900], ['390', 390, 800]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, bypassCSP: true, serviceWorkers: 'block', reducedMotion: 'reduce', isMobile: w < 500, hasTouch: w < 500 });
    await ctx.route(u => new URL(u).hostname !== '127.0.0.1', r => r.abort());
    const p = await ctx.newPage();
    const bad = m => errs.push(`[${vp}] ${m}`);
    p.on('pageerror', e => bad('lỗi JS: ' + e.message));
    p.on('response', r => { if (r.status() >= 400) bad(`${r.status()} ${r.url().replace(B, '')}`); });
    await p.goto(B + '/', { waitUntil: 'domcontentloaded' });
    await p.evaluate(() => { loadBuilds(); loadSkills(); loadCounters(); });
    await p.waitForFunction(() => typeof BUILDS !== 'undefined' && typeof SKILLS !== 'undefined' && typeof COUNTERS !== 'undefined', null, { timeout: 20000 });
    const home = await p.evaluate(() => ({ slides: document.querySelectorAll('.slide').length, cards: document.querySelectorAll('#board .card').length, heroes: HEROES.length,
      ov: document.documentElement.scrollWidth > document.documentElement.clientWidth }));
    if (home.slides !== 5) bad(`có ${home.slides} slide (cần 5)`);
    if (!home.cards) bad('bảng không có thẻ tướng');
    if (home.ov) bad('trang chủ tràn ngang');
    // mở mọi bảng chi tiết
    const res = await p.evaluate(async (noCn) => {
      const out = { n: 0, bad: [], srcs: new Set() };
      for (const h of HEROES) {
        if (openModal.off) openModal.off();
        openModal(h.id); out.n++;
        await new Promise(r => setTimeout(r, 0));
        const m = document.querySelector('.modal'); if (!m) { out.bad.push(h.id + ': không mở được'); continue; }
        const t = m.innerText;
        if (/Đang tải/.test(t)) out.bad.push(h.id + ': còn "Đang tải"');
        if (!m.querySelector('.bld-items li')) out.bad.push(h.id + ': không có build');
        if (m.querySelectorAll('.bld-ar li').length < 1) out.bad.push(h.id + ': không có ngọc');
        if (!m.querySelector('.bld-sp li')) out.bad.push(h.id + ': không có phép bổ trợ');
        if (![...m.querySelectorAll('.bld-ar b')].every(b => /^(Đỏ|Tím|Xanh) III .+ ×\d+$/.test(b.textContent))) out.bad.push(h.id + ': ngọc thiếu tên Việt');
        if (!m.querySelector('.bld-hint a[href="/bang-ngoc/"]')) out.bad.push(h.id + ': gợi ý build thiếu link Bảng ngọc');
        { const b2 = m.querySelector('#mshare2'); if (!b2) out.bad.push(h.id + ': thiếu nút Gửi tướng này cho bạn bè'); else if (b2.getBoundingClientRect().height > 80) out.bad.push(h.id + ': nút Gửi tướng quá cao (biểu tượng không có cỡ)'); }
        if (!m.querySelector('.sk-list li')) out.bad.push(h.id + ': không có bộ chiêu');
        if (!noCn.includes(h.key) && !m.querySelector('.cn .cn-b')) out.bad.push(h.id + ': không có mục khắc chế');
        if (h.key !== 'tamyn' && m.querySelectorAll('.sw li').length < 2) out.bad.push(h.id + ': không có điểm mạnh/yếu');
        m.querySelectorAll('img').forEach(i => { const s = i.getAttribute('src'); if (s && !/^https?:/.test(s)) out.srcs.add(s.replace(/^\//, '')); });
        document.querySelectorAll('#board .card img').forEach(i => { const s = i.getAttribute('src'); if (s && !/^https?:/.test(s)) out.srcs.add(s.replace(/^\//, '')); });
      }
      out.srcs = [...out.srcs]; return out;
    }, [...NO_COUNTERS]);
    res.bad.forEach(x => bad(x));
    for (const s of res.srcs) if (!fs.existsSync(fileOf('/' + s))) bad('ảnh không có: ' + s);
    // khắc chế → sang tướng khác; hộp thông tin món đồ; nút Quay lại
    // tải lại trang (tài liệu mới) rồi bấm thẻ tướng như người dùng thật, để lịch sử trình duyệt giống thật
    await p.goto(B + '/?smoke=1', { waitUntil: 'domcontentloaded' });
    await p.waitForFunction(() => typeof BUILDS !== 'undefined', null, { timeout: 20000 });
    const cardSel = '#board .card[data-id="zata-mid"]';
    if (!(await p.$(cardSel))) await p.evaluate(() => { const b = document.querySelector('[data-lane="mid"],[data-l="mid"]'); b && b.click(); });
    const card = (await p.$(cardSel)) || (await p.$('#board .card'));
    await card.scrollIntoViewIfNeeded(); await card.click();
    await p.waitForSelector('.modal .cn-b', { timeout: 15000 });
    const before = await p.evaluate(() => document.querySelector('.modal h3').textContent);
    await p.click('.modal .cn-b');
    const after = await p.evaluate(() => document.querySelector('.modal h3')?.textContent);
    if (!after || after === before) bad('bấm tướng trong mục khắc chế không đổi bảng');
    await p.waitForSelector('.modal .bi-b', { timeout: 15000 });
    await p.click('.modal .bi-b');
    const tip = await p.evaluate(() => { const t = document.getElementById('itip'); return t && !t.hidden && t.innerText.length > 5; });
    if (!tip) bad('hộp thông tin món đồ không hiện');
    await p.evaluate(() => document.getElementById('itip') && (document.getElementById('itip').hidden = true));
    await p.goBack(); await p.waitForTimeout(300);
    if (await p.evaluate(() => !!document.querySelector('.modal'))) bad('nút Quay lại không đóng bảng chi tiết');
    // chế độ Số liệu, Tự xếp, rồi về Meta
    await p.evaluate(() => scrollTo(0, document.getElementById('m-stats').getBoundingClientRect().top + scrollY - 200));
    await p.click('#m-stats'); await p.waitForTimeout(200);
    const stats = await p.evaluate(() => document.querySelectorAll('#board table tr, #board [role=row]').length);
    if (stats < 10) bad(`chế độ Số liệu chỉ có ${stats} dòng`);
    await p.click('#m-mine'); await p.waitForTimeout(200);
    if (await p.evaluate(() => document.getElementById('m-mine').getAttribute('aria-pressed') !== 'true')) bad('không bật được chế độ Tự xếp');
    await p.click('#m-meta'); await p.waitForTimeout(200);
    if (!(await p.evaluate(() => document.querySelectorAll('#board .card').length))) bad('về Meta không còn thẻ tướng');
    log(`[${vp}] trang chủ: ${home.slides} slide, ${home.cards} thẻ, mở ${res.n}/${home.heroes} bảng chi tiết, ${res.srcs.length} ảnh`);
    // trang tĩnh tiêu biểu
    const ALL = process.argv.includes('--all');
    const pages = ALL ? fs.readFileSync(path.join(R, 'sitemap.xml'), 'utf8').match(/<loc>[^<]+<\/loc>/g).map(x => x.replace(/<\/?loc>/g, '').replace(/^https?:\/\/[^/]+/, '')).concat('/404.html')
      : ['/trang-bi/', '/phu-hieu/', '/bang-ngoc/', '/phep-bo-tro/', '/phuong-phap/', '/tuong/zata-mid/', '/duong/rung/', '/ban-cap-nhat/', '/gioi-thieu/', '/404.html'];
    for (const u of pages) {
      await p.goto(B + u, { waitUntil: 'load' }); // chờ CSS áp xong mới đo, đo sớm sẽ báo tràn nhầm
      if (await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) bad(`${u} tràn ngang`);
    }
    await ctx.close();
  }
  await b.close(); srv.close();
  errs.forEach(e => log('LỖI:', e));
  log(errs.length ? `${errs.length} lỗi` : 'Không có lỗi chức năng.');
  process.exit(errs.length ? 1 : 0);
})().catch(e => { console.error('Không chạy được:', e.message); srv.close(); process.exit(2); });
