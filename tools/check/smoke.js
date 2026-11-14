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
        if (!m.querySelector('.bd.gr')) out.bad.push(h.id + ': không có thanh Game rank (Garena)');
        else {
          const g = m.querySelector('.bd.gr');
          if (!/Bậc Garena T[0-4] ·/.test(g.innerText)) out.bad.push(h.id + ': thanh Game rank thiếu bậc Garena T0–T4');
          const wd = parseFloat(g.querySelector('.bdbar i').style.width);
          if (!(wd > 0 && wd <= 100)) out.bad.push(h.id + ': thanh Game rank rỗng hoặc quá 100% (' + g.querySelector('.bdbar i').style.width + ')');
        }
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
    // tên cột Số liệu không dính nhau (≥6px giữa chữ hai cột, cả khi có mũi tên sắp xếp)
    const gap = await p.evaluate(() => { const e = [...document.querySelectorAll('table.stats thead th button')].filter(b => b.offsetWidth).map(b => { const r = document.createRange(); r.selectNodeContents(b); return r.getBoundingClientRect(); });
      return Math.min(...e.slice(1).map((r, i) => r.left - e[i].right)); });
    if (gap < 6) bad(`tên cột Số liệu dính nhau (cách ${Math.round(gap)}px)`);
    // máy tính: nút lên đầu trang (cố định góc phải dưới) không che số ở cột cuối của bảng Số liệu
    if (w > 760) {
      const tt = await p.evaluate(() => { const t = document.getElementById('totop'), hid = t.hidden; t.hidden = false; const L = t.getBoundingClientRect().left; t.hidden = hid;
        const r = document.createRange(); r.selectNodeContents(document.querySelector('table.stats tbody td:last-child')); return L - r.getBoundingClientRect().right; });
      if (tt < 4) bad(`nút lên đầu trang che số cột cuối bảng Số liệu (cách ${Math.round(tt)}px)`);
    }
    // nút "Game rank" ở chế độ Số liệu: đủ tướng, bỏ cột Trận, có ghi nguồn, sắp xếp được, không tràn ngang; bấm lại ĐTDV thì cột Trận trở về
    await p.click('#board [data-src="rank"]'); await p.waitForTimeout(200);
    const rk = await p.evaluate(() => { const rows = [...document.querySelectorAll('#board table.stats tbody tr')];
      const nak = rows.find(r => r.dataset.id.startsWith('nakroth-'));
      const tam = rows.find(r => r.dataset.id.startsWith('tamyn-'));
      return { n: rows.length, hasN: !!document.querySelector('table.stats th.c-n'), hasGt: !!document.querySelector('table.stats th.c-gt'), gtN: document.querySelectorAll('#board table.stats td.c-gt').length, tam: tam ? tam.querySelector('td.c-gt')?.innerText : null, cap: document.querySelector('.st-cap').innerText, nak: nak ? nak.querySelector('td.c-wr').innerText : null,
        pressed: document.querySelector('#board [data-src="rank"]').getAttribute('aria-pressed'), ov: document.documentElement.scrollWidth > document.documentElement.clientWidth }; });
    const minRows = w > 700 ? 100 : 15;   // điện thoại chỉ hiện một đường
    if (rk.n < minRows) bad(`Số liệu Game rank chỉ có ${rk.n} dòng`);
    if (rk.hasN) bad('Số liệu Game rank vẫn còn cột Trận');
    if (!rk.hasGt || rk.gtN < minRows) bad(`Số liệu Game rank thiếu cột Garena (${rk.gtN} ô)`);
    if (rk.tam && rk.tam !== 'T3') bad(`Tamyn bậc Garena hiện "${rk.tam}", cần T3`);
    if (!/Garena/.test(rk.cap) || !/vào điểm tier/.test(rk.cap)) bad('Số liệu Game rank thiếu dòng ghi nguồn');
    if (rk.nak && !/^49,1/.test(rk.nak)) bad(`Nakroth Game rank hiện "${rk.nak}", cần 49,1`);
    // Flowborn có hai dạng với số khác nhau: xạ thủ (Rồng) 53,04 / pháp sư (Giữa) 52,74
    const fb = await p.evaluate(() => { const a = rankOf(HEROES.find(h => h.id === 'flowborn-ad')), m = rankOf(HEROES.find(h => h.id === 'flowborn-mid')); return [a && a[0], m && m[0]]; });
    if (fb[0] !== 53.04 || fb[1] !== 52.74) bad(`Flowborn Game rank sai: Rồng ${fb[0]}, Giữa ${fb[1]} (cần 53,04 và 52,74)`);
    if (rk.pressed !== 'true') bad('nút Game rank không ở trạng thái bấm');
    if (rk.ov) bad('Số liệu Game rank tràn ngang');
    // nút chọn nguồn ĐTDV / Game rank đủ cao để chạm (≥40px); tên cột Game rank không dính nhau ở mọi cách sắp
    const segH = await p.evaluate(() => Math.min(...[...document.querySelectorAll('#board .st-src button')].map(b => { b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect(), x = r.left + r.width / 2;
      let t = 0, d = 0; while (d < 30 && document.elementFromPoint(x, r.top + r.height / 2 - d - 1) === b) d++; while (t < 30 && document.elementFromPoint(x, r.top + r.height / 2 + t + 1) === b) t++; return d + t + 1; })));
    if (segH < 40) bad(`nút ĐTDV / Game rank chỉ chạm được trong ${Math.round(segH)}px chiều cao`);
    const colGap = () => p.evaluate(() => { const e = [...document.querySelectorAll('table.stats thead th button')].filter(b => b.offsetWidth).map(b => { const r = document.createRange(); r.selectNodeContents(b); return r.getBoundingClientRect(); });
      return Math.min(...e.slice(1).map((r, i) => r.left - e[i].right)); });
    const laneN = w > 700 ? 1 : await p.evaluate(() => document.querySelectorAll('#lanesM button').length);   // điện thoại: độ rộng cột đổi theo tên tướng của từng đường
    for (let li = 0; li < laneN; li++) {
      if (w <= 700) { await p.evaluate(i => document.querySelectorAll('#lanesM button')[i].click(), li); await p.waitForTimeout(150); }
      for (const k of ['c-gt', 'c-pk', 'c-bn', 'c-wr']) {
        await p.click(`#board th.${k} button`); await p.waitForTimeout(80);
        const g = await colGap(); if (g < 6) bad(`tên cột Game rank dính nhau khi sắp theo ${k}, đường ${li} (cách ${Math.round(g)}px)`);
        if (await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) bad(`Số liệu Game rank tràn ngang khi sắp theo ${k}, đường ${li}`);
      }
    }
    if (w <= 700) { await p.evaluate(() => document.querySelectorAll('#lanesM button')[0].click()); await p.waitForTimeout(150); }
    if (await p.evaluate(() => document.querySelector('#board th.c-wr').getAttribute('aria-sort') !== 'descending')) { await p.click('#board th.c-wr button'); await p.waitForTimeout(80); }
    // vào Game rank thì mặc định sắp theo Thắng giảm dần (đúng thứ tự trong game)
    const wrs = await p.evaluate(() => [...document.querySelectorAll('#board table.stats td.c-wr b')].map(b => parseFloat(b.innerText.replace(',', '.'))).filter(x => !isNaN(x)));
    if (wrs.length < minRows || wrs.some((x, i) => i && x > wrs[i - 1] + 1e-9)) bad('sắp xếp theo Thắng ở Game rank sai thứ tự');
    await p.click('#board th.c-gt button'); await p.waitForTimeout(100);
    const gts = await p.evaluate(() => [...document.querySelectorAll('#board table.stats td.c-gt b')].map(b => parseInt(b.innerText.slice(1))));
    if (gts.length < minRows || gts.some((x, i) => i && x < gts[i - 1]) || gts[0] !== 0) bad('sắp xếp theo Garena sai: T0 phải đứng đầu và bậc không được giảm lên');
    if (await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) bad('Số liệu Game rank (sắp theo Garena) tràn ngang');
    await p.click('#board [data-src="aog"]'); await p.waitForTimeout(200);
    if (!(await p.evaluate(() => !!document.querySelector('table.stats th.c-n')))) bad('bấm lại ĐTDV (giải) mà cột Trận không trở về');
    if (await p.evaluate(() => !!document.querySelector('table.stats th.c-gt'))) bad('ĐTDV (giải) không được có cột Garena');
    // link nằm giữa câu trong mục Cách xếp không bị tách thành dòng riêng
    if (await p.evaluate(() => [...document.querySelectorAll('.box li>a')].some(a => getComputedStyle(a).display === 'block' && [...a.parentElement.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()))))
      bad('link giữa câu trong mục Cách xếp bị tách dòng (thêm class="inl")');
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
