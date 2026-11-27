#!/usr/bin/env node
// Kiểm tra chức năng bằng Playwright (Chromium có sẵn), tự chạy máy chủ tĩnh, chặn mọi request ra ngoài (font, GA).
// Ở 1440px và 390px:
//  - trang chủ: không lỗi JS, không 404, 5 slide, bảng có thẻ, không tràn ngang
//  - mở lần lượt mọi bảng chi tiết: có build (đồ, ngọc có tên Việt, phép, link tra cứu), bộ chiêu thức, điểm mạnh/yếu (trừ Tamyn), mục khắc chế (trừ tướng nguồn không có), không còn "Đang tải"
//  - mọi ảnh do app.js chèn (thẻ, build, ngọc, phù hiệu, khắc chế) trỏ tới tệp có thật
//  - bấm tướng trong mục khắc chế sang tướng khác; hộp thông tin món đồ; nút Quay lại đóng bảng; chế độ Số liệu và Tự xếp
//  - Đoán tướng hôm nay (/doan-tuong/): đủ tướng, đoán sai rồi đúng ở cả 3 chế độ, tải lại vẫn giữ kết quả
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
        if (document.getElementById('affTpl') && document.getElementById('affTpl').innerHTML && m.querySelectorAll('.aff a[rel~="sponsored"]').length < 1) out.bad.push(h.id + ': thiếu khối phụ kiện cuối bảng chi tiết');
        if (m.querySelector('.aff') && !/Liên kết tiếp thị/i.test(m.querySelector('.aff').innerText)) out.bad.push(h.id + ': khối phụ kiện thiếu nhãn Liên kết tiếp thị');
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
        { // nhiều bộ build: nút chọn bộ, mỗi bộ một khung riêng; ô một bộ thì không có nút
          const bb = BUILDS[h.key + '@' + h.lane], nset = bb ? 1 + (bb.v || []).length : 1, tabs = [...m.querySelectorAll('.bld-tab')], panes = [...m.querySelectorAll('.bld-pane')];
          if (nset === 1 && (tabs.length || panes.length)) out.bad.push(h.id + ': ô một bộ mà có nút chọn bộ');
          if (nset > 1) {
            if (tabs.length !== nset || panes.length !== nset) out.bad.push(h.id + ': số nút/khung bộ build không khớp (' + tabs.length + '/' + panes.length + ' so với ' + nset + ')');
            else {
              if (!tabs.every(t => t.querySelector('span') && t.querySelector('span').textContent.trim())) out.bad.push(h.id + ': nút bộ thiếu tên');
              if (panes.some((pn, k) => pn.hidden !== (k > 0))) out.bad.push(h.id + ': chỉ bộ 1 được hiện khi mở bảng');
              if (!panes.every(pn => pn.querySelector('.bld-items li') && pn.querySelector('.bld-ar li') && pn.querySelector('.bld-sp li') && pn.querySelector('.bld-en .en-b'))) out.bad.push(h.id + ': có bộ thiếu đồ/ngọc/phép/phù hiệu');
              const first = panes[0].querySelector('.bi-n').textContent;
              tabs[1].click();   // chuyển sang bộ 2: bộ 1 ẩn, bộ 2 hiện và có đồ khác
              if (!(panes[0].hidden && !panes[1].hidden && tabs[1].getAttribute('aria-selected') === 'true' && tabs[0].getAttribute('aria-selected') === 'false')) out.bad.push(h.id + ': bấm Bộ 2 không đổi khung');
              else if (panes[1].querySelector('.bi-n').textContent === first && panes[1].innerHTML === panes[0].innerHTML) out.bad.push(h.id + ': Bộ 2 giống Bộ 1');
              tabs[0].click();
              if (panes[0].hidden || !panes[1].hidden) out.bad.push(h.id + ': bấm lại Bộ 1 không trở về');
              out.multi = (out.multi || 0) + 1;
            }
          }
        }
        if (!m.querySelector('.sk-list li')) out.bad.push(h.id + ': không có bộ chiêu');
        if (!noCn.includes(h.key) && !m.querySelector('.cn .cn-b')) out.bad.push(h.id + ': không có mục khắc chế');
        if (h.key !== 'tamyn' && m.querySelectorAll('.sw li').length < 2) out.bad.push(h.id + ': không có điểm mạnh/yếu');
        m.querySelectorAll('img').forEach(i => { const s = i.getAttribute('src'); if (s && !/^https?:/.test(s)) out.srcs.add(s.replace(/^\//, '')); });
        document.querySelectorAll('#board .card img').forEach(i => { const s = i.getAttribute('src'); if (s && !/^https?:/.test(s)) out.srcs.add(s.replace(/^\//, '')); });
      }
      out.srcs = [...out.srcs]; return out;
    }, [...NO_COUNTERS]);
    res.bad.forEach(x => bad(x));
    if ((res.multi || 0) < 2) bad(`chỉ ${res.multi || 0} ô có nhiều bộ build, đáng ra phải ≥ 2 (Aya Giữa, Aya Trợ thủ)`);
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
    if (rk.nak && !/^49,2/.test(rk.nak)) bad(`Nakroth Game rank hiện "${rk.nak}", cần 49,2`);
    // Flowborn có hai dạng với số khác nhau: xạ thủ (Rồng) 53,04 / pháp sư (Giữa) 52,74
    const fb = await p.evaluate(() => { const a = rankOf(HEROES.find(h => h.id === 'flowborn-ad')), m = rankOf(HEROES.find(h => h.id === 'flowborn-mid')); return [a && a[0], m && m[0]]; });
    if (fb[0] !== 53.19 || fb[1] !== 52.52) bad(`Flowborn Game rank sai: Rồng ${fb[0]}, Giữa ${fb[1]} (cần 53,19 và 52,52)`);
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
    log(`[${vp}] trang chủ: ${home.slides} slide, ${home.cards} thẻ, mở ${res.n}/${home.heroes} bảng chi tiết (${res.multi || 0} ô nhiều bộ build), ${res.srcs.length} ảnh`);
    // trang tĩnh tiêu biểu
    const ALL = process.argv.includes('--all');
    const pages = ALL ? fs.readFileSync(path.join(R, 'sitemap.xml'), 'utf8').match(/<loc>[^<]+<\/loc>/g).map(x => x.replace(/<\/?loc>/g, '').replace(/^https?:\/\/[^/]+/, '')).concat('/404.html')
      : ['/trang-bi/', '/phu-hieu/', '/bang-ngoc/', '/phep-bo-tro/', '/phuong-phap/', '/tuong/zata-mid/', '/duong/rung/', '/ban-cap-nhat/', '/gioi-thieu/', '/404.html'];
    for (const u of pages) {
      await p.goto(B + u, { waitUntil: 'load' }); // chờ CSS áp xong mới đo, đo sớm sẽ báo tràn nhầm
      if (await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) bad(`${u} tràn ngang`);
    }
    // trang chủ có lối vào Đoán tướng ngang bảng tier: nút ở đầu trang, mục lớn 3 cách chơi, menu
    { const hp = await ctx.newPage(); await hp.goto(B + '/', { waitUntil: 'load' });
      const gm = await hp.evaluate(() => ({ hero: !!document.querySelector('.hero-acts a.hero-game[href="/doan-tuong/"]'), cards: document.querySelectorAll('#game .gm-m').length, menu: !!document.querySelector('.menu-l a[href="/doan-tuong/"]'), left: /Đề mới sau \d\d:\d\d:\d\d/.test(document.getElementById('gmLeft')?.textContent || ''), num: /Đề #\d+/.test(document.getElementById('gmOver')?.textContent || '') }));
      if (!gm.hero || gm.cards !== 3 || !gm.menu || !gm.left || !gm.num) bad(`Trang chủ: lối vào Đoán tướng thiếu ${JSON.stringify(gm)}`);
      await hp.close(); }
    // Đoán tướng hôm nay: đoán sai một lượt rồi đúng ở cả 3 chế độ, tải lại vẫn giữ kết quả
    await p.goto(B + '/doan-tuong/', { waitUntil: 'load' });
    await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'load' });
    await p.waitForFunction(() => window.__dt && document.querySelectorAll('.dt-mode').length === 3, null, { timeout: 10000 });
    const dtN = await p.evaluate(() => ({ noAttr: __dt.noAttr(), n: __dt.names().length, keys: new Set(HEROES.map(h => h.key)).size, fb: __dt.names().filter(x => /Flowborn/.test(x)).length }));
    await p.waitForSelector('.dt-bg img.on', { state: 'attached', timeout: 5000 }).catch(() => bad('Đoán tướng: ảnh nền không hiện'));
    if (await p.evaluate(() => { const k = (document.querySelector('.dt-bg img.on').getAttribute('src').match(/\/s\/([a-z-]+)\.webp/) || [])[1]; return ['co', 'chieu', 'anh'].some(m => __dt.answer(m) === k || (k === 'flowborn-ad' && __dt.answer(m) === 'flowborn')); })) bad('Đoán tướng: ảnh nền trùng đáp án');
    if (dtN.noAttr.length) bad(`Đoán tướng: thiếu giới tính/tầm đánh: ${dtN.noAttr.join(', ')} (thêm vào ATTR trong assets/game.js)`);
    if (dtN.n !== dtN.keys || dtN.fb !== 1) bad(`Đoán tướng: ${dtN.n} tướng (cần ${dtN.keys}), Flowborn ${dtN.fb} lần`);
    // danh sách gợi ý: tô chữ khớp, di chuột vào dòng 3 thì chỉ dòng 3 sáng, danh sách nằm trên các khung bên dưới
    await p.fill('#dtIn', 's'); await p.waitForTimeout(80);
    if (vp === '1440') { const bx = await p.locator('.dt-list li').nth(2).boundingBox(); await p.mouse.move(bx.x + 20, bx.y + 10); }
    const dd = await p.evaluate(() => { const li = [...document.querySelectorAll('.dt-list li')], L = document.querySelector('.dt-list').getBoundingClientRect();
      return { on: li.map(l => l.getAttribute('aria-selected')).filter(x => x === 'true').length, marks: document.querySelectorAll('.dt-list mark').length, n: li.length,
        cover: li.filter(l => { const r = l.getBoundingClientRect(); return r.top >= L.top && r.bottom <= L.bottom && r.bottom <= innerHeight && !document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)?.closest('.dt-list'); }).length,
        third: li[2]?.getAttribute('aria-selected') }; });
    if (dd.on !== 1 || dd.marks !== dd.n || dd.cover || (vp === '1440' && dd.third !== 'true')) bad(`Đoán tướng: danh sách gợi ý lỗi ${JSON.stringify(dd)}`);
    await p.fill('#dtIn', '');
    for (const m of ['co', 'chieu', 'anh']) {
      await p.click(`.dt-mode[data-m=${m}]`);
      const [ans, wrong] = await p.evaluate(m => { const a = __dt.answer(m); return [__dt.names()[__dt.keys().indexOf(a)], __dt.names().find((x, i) => __dt.keys()[i] !== a)]; }, m);
      for (const name of [wrong, ans]) { await p.fill('#dtIn', name); await p.waitForTimeout(80); await p.keyboard.press('Enter'); await p.waitForTimeout(150); }
      const st = await p.evaluate(() => ({ win: !document.querySelector('.dt-win').hidden, rows: document.querySelectorAll('.dt-grid tbody tr, .dt-wrong li').length, form: !document.querySelector('.dt-form').hidden }));
      if (!st.win || st.rows !== 2 || st.form) bad(`Đoán tướng ${m}: thắng ${st.win}, ${st.rows} lượt (cần 2), ô nhập còn hiện ${st.form}`);
    }
    await p.reload({ waitUntil: 'load' }); await p.waitForFunction(() => window.__dt && document.querySelectorAll('.dt-mode').length === 3);
    if (await p.evaluate(() => document.querySelectorAll('.dt-mode.ok').length !== 3)) bad('Đoán tướng: tải lại mất kết quả đã đoán');
    if (!(await p.evaluate(() => /^1\s*ngày liên tiếp/.test(document.querySelector('.dt-streak')?.textContent.replace(/^\D*/, '') || '')))) bad('Đoán tướng: huy hiệu chuỗi ngày không hiện 1 sau khi đoán đúng');
    if (await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) bad('/doan-tuong/ tràn ngang');
    log(`[${vp}] Đoán tướng: ${dtN.n} tướng, thắng đủ 3 chế độ`);
    // thắng đề hôm nay thì có thống kê của bạn (đã chơi, đúng, phân bố số lượt)
    if (!(await p.evaluate(() => /đã chơi \d+ đề · đúng \d+/.test(document.querySelector('.dt-win .dt-stats')?.textContent || '') && document.querySelectorAll('.dt-win .dt-bar').length === 4))) bad('Đoán tướng: khung thắng thiếu thống kê');
    // gợi ý mở dần: Cổ điển sai 5 lượt thì nút Gợi ý: Kỹ năng mở khoá, bấm thì hiện gợi ý, nút sau còn khoá
    { const q = await ctx.newPage(); await q.goto(B + '/doan-tuong/#lt', { waitUntil: 'load' }); await q.waitForFunction(() => window.__dt);
      const w5 = await q.evaluate(() => { const a = __dt.answer('co'); return __dt.names().filter((x, i) => __dt.keys()[i] !== a).slice(0, 5); });
      const h0 = await q.$$eval('.dt-hint', l => l.map(x => x.disabled));
      for (const n of w5) { await q.fill('#dtIn', n); await q.keyboard.press('Enter'); await q.waitForTimeout(60); }
      const h1 = await q.$$eval('.dt-hint', l => l.map(x => x.disabled));
      await q.click('.dt-hint:not([disabled])'); const h2 = await q.$$eval('.dt-hint', l => l.map(x => x.className));
      if (JSON.stringify(h0) !== '[true,true]' || JSON.stringify(h1) !== '[false,true]' || !h2[0].includes('on')) bad(`Đoán tướng: gợi ý mở dần sai ${JSON.stringify({ h0, h1, h2 })}`);
      await q.close(); }
    // mỗi cách chơi có trang riêng: mở đúng cách chơi, tiêu đề theo cách chơi, đổi cách chơi thì đổi địa chỉ; có nút khoe chuỗi
    for (const [u, m, h] of [['/doan-tuong/ky-nang/', 'chieu', 'Đoán tướng qua kỹ năng'], ['/doan-tuong/hinh-anh/', 'anh', 'Đoán tướng qua hình ảnh']]) {
      const q = await ctx.newPage(); await q.goto(B + u, { waitUntil: 'load' }); await q.waitForFunction(() => window.__dt);
      const st = await q.evaluate(() => ({ on: document.querySelector('.dt-mode[aria-selected="true"], .dt-mode.on')?.dataset.m, h1: document.querySelector('main > h1').textContent, og: document.querySelector('meta[property="og:image"]').content }));
      await q.click('.dt-mode[data-m=co]'); const back = await q.evaluate(() => [location.pathname, document.querySelector('main > h1').textContent]);
      if (st.on !== m || st.h1 !== h || !/og-doan-tuong\.jpg$/.test(st.og) || back[0] !== '/doan-tuong/' || back[1] !== 'Đoán tướng Liên Quân') bad(`Đoán tướng: trang ${u} sai ${JSON.stringify({ st, back })}`);
      await q.close();
    }
    // Chơi liên tục: đoán đúng → nút Tướng tiếp theo đổi đề; Bỏ qua → hiện đáp án
    await p.click('.dt-kb[data-k=lt]'); await p.click('.dt-mode[data-m=co]');
    if (!(await p.evaluate(() => __dt.endless() && location.hash === '#lt' && location.pathname === '/doan-tuong/'))) bad('Đoán tướng: không chuyển được sang Chơi liên tục');
    const lt1 = await p.evaluate(() => { const a = __dt.answer('co'); return [a, __dt.names()[__dt.keys().indexOf(a)], __dt.names().find((x, i) => __dt.keys()[i] !== a)]; });
    for (const name of [lt1[2], lt1[1]]) { await p.fill('#dtIn', name); await p.waitForTimeout(80); await p.keyboard.press('Enter'); await p.waitForTimeout(150); }
    if (!(await p.$('.dt-win:not([hidden]) .dt-nextbtn'))) bad('Đoán tướng liên tục: đoán đúng mà không có nút Tướng tiếp theo');
    const stLt = await p.evaluate(() => document.querySelector('.dt-streak b')?.textContent);
    // nút Khoe chuỗi chỉ hiện từ chuỗi 2 (chuỗi 1 nghe gượng); Tướng tiếp theo rộng cả khung
    if (await p.evaluate(() => [...document.querySelectorAll('.dt-win .dt-btn')].some(b => /Khoe chuỗi/.test(b.textContent)) || !document.querySelector('.dt-win .dt-nextbtn.dt-wide'))) bad('Đoán tướng liên tục: nút khung thắng sai');
    if (stLt !== '1') bad(`Đoán tướng liên tục: huy hiệu chuỗi ${stLt} (cần 1 sau một tướng đúng)`);
    await p.click('.dt-nextbtn'); await p.waitForTimeout(150);
    const lt2 = await p.evaluate(() => ({ a: __dt.answer('co'), rows: document.querySelectorAll('.dt-grid tbody tr').length, form: !document.querySelector('.dt-form').hidden }));
    if (lt2.a === lt1[0] || lt2.rows || !lt2.form) bad(`Đoán tướng liên tục: sang tướng mới lỗi (cùng đáp án ${lt2.a === lt1[0]}, ${lt2.rows} lượt cũ, ô nhập ${lt2.form})`);
    if (await p.isVisible('.dt-skip')) bad('Đoán tướng liên tục: nút Bỏ qua hiện khi chưa đoán lượt nào');
    await p.fill('#dtIn', await p.evaluate(() => __dt.names().find((x, i) => __dt.keys()[i] !== __dt.answer('co')))); await p.keyboard.press('Enter'); await p.waitForTimeout(150);
    await p.click('.dt-skip'); await p.waitForTimeout(100);
    if (await p.$('.dt-win.dt-lose:not([hidden])')) bad('Đoán tướng liên tục: bấm Bỏ qua một lần đã mất lượt (phải hỏi lại)');
    await p.click('.dt-skip'); await p.waitForTimeout(100);
    if (!(await p.$('.dt-win.dt-lose:not([hidden]) .dt-nextbtn'))) bad('Đoán tướng liên tục: Bỏ qua không hiện đáp án');
    if (await p.evaluate(() => document.querySelector('.dt-streak b')?.textContent) !== '0') bad('Đoán tướng liên tục: Bỏ qua mà chuỗi không về 0');
    await p.click('.dt-kb[data-k=day]');
    if (await p.evaluate(() => __dt.endless() || document.querySelectorAll('.dt-mode.ok').length !== 3)) bad('Đoán tướng: quay lại Đề hôm nay mất kết quả');
    log(`[${vp}] Đoán tướng: chơi liên tục, sang tướng mới, bỏ qua đều chạy`);
    await ctx.close();
  }
  await b.close(); srv.close();
  errs.forEach(e => log('LỖI:', e));
  log(errs.length ? `${errs.length} lỗi` : 'Không có lỗi chức năng.');
  process.exit(errs.length ? 1 : 0);
})().catch(e => { console.error('Không chạy được:', e.message); srv.close(); process.exit(2); });
