// Tạo phần cho Google / trợ lý AI đọc được mà không cần chạy JavaScript:
//  1. Mục "Hỏi nhanh" (FAQ) trong index.html, giữa <!--FAQ--> … <!--/FAQ--> và JSON-LD FAQPage giữa <!--FAQLD--> … <!--/FAQLD-->
//  2. Trang riêng từng ô tướng: tuong/<key>-<đường>/index.html (tier, điểm, build, phù hiệu, khắc chế/hợp cặp, bộ chiêu, link mở bảng chi tiết)
//  3. Trang bản cập nhật: ban-cap-nhat/<dd-mm-yyyy>/ (từ P trong data.js + lịch sử tools/seo/patches.json) và ban-cap-nhat/ (danh sách)
//  4. Trang Giới thiệu / Phương pháp / Liên hệ / Quyền riêng tư (gioi-thieu/, phuong-phap/, lien-he/, quyen-rieng-tu/) và mục lục liên kết trong index.html (<!--HEROLINKS-->)
//  3b. Tier list từng đường: duong/<ta-than|rung|giua|rong|tro-thu>/ (tướng xếp theo tier, hạng, điểm, ghi chú bản vá)
//  3c. Bài viết phân tích: bai-viet/<slug>/ và bai-viet/ (nguồn: tools/seo/articles/<slug>.html — phần đầu "khoá: giá trị", dòng ---, thân HTML; liên kết sang trang tướng/bản vá được thêm tự động)
//  3d. Trang Phụ kiện (phu-kien/): link tiếp thị Shopee / TikTok Shop, nguồn tools/seo/affiliate.json; mảng items rỗng thì không tạo trang, không thêm link nào
//  5. sitemap.xml (trang chủ + mọi trang)
// Chạy lại mỗi khi đổi assets/data.js, assets/builds.js, assets/skills.js hoặc assets/counters.js:   node tools/seo/build.js
// Không sửa tay các tệp trong tuong/ — chạy lại script này.
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..', '..'), SITE = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools', 'site.json'), 'utf8')).origin;   // đổi tên miền: node tools/domain/doi-ten-mien.js
const ctx = {}; vm.createContext(ctx);
for (const f of ['assets/data.js', 'assets/builds.js', 'assets/skills.js', 'assets/counters.js'])
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/^const /gm, 'var '), ctx);
const { HEROES, LANES, CLASSES, TIERS, TNAME, PATCH, PREV_DATE, P, BUILDS, BITEM, BSPELL, BENCH, BARC, SKILLS, COUNTERS, CNSRC } = ctx;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
let index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const upd = (index.match(/Dữ liệu cập nhật (\d{1,2}\/\d{1,2}\/\d{4})/) || [])[1] || '';
const season = (index.match(/Mùa (S\d+ \d{4})/) || [])[1] || '';
const iso = upd ? upd.split('/').reverse().map(x => x.padStart(2, '0')).join('-') : new Date().toISOString().slice(0, 10);
const TO = 'SABCD', COLVI = { red: 'đỏ', purple: 'tím', teal: 'xanh' };
const byLane = l => HEROES.filter(h => h.lane === l && !h.sec).sort((a, b) => TO.indexOf(a.tier) - TO.indexOf(b.tier) || a.rank - b.rank);
const url = h => `/tuong/${h.id}/`;
const skey = h => h.key === 'flowborn' ? 'flowborn-' + h.lane : h.key;
const has = (dir, h) => fs.existsSync(path.join(ROOT, dir, skey(h) + '.webp'));

// ---------- Phần dùng chung cho trang phụ (bản cập nhật, giới thiệu...) ----------
const CSP0 = index.match(/<meta http-equiv="Content-Security-Policy"[^>]*>/)[0];
const affItems = (JSON.parse(fs.readFileSync(path.join(__dirname, 'affiliate.json'), 'utf8')).items) || [];
affItems.forEach((x, i) => { if (!x.name || !x.desc || !/^https:\/\//.test(x.url || '') || !['Shopee', 'TikTok Shop'].includes(x.shop)) throw Error(`tools/seo/affiliate.json mục ${i + 1}: cần name, desc, shop (Shopee hoặc TikTok Shop) và url bắt đầu bằng https://`); });
const affShops = [...new Set(affItems.map(x => x.shop))].join(' và ');
const NAVF = `<a href="/gioi-thieu/">Giới thiệu</a> · <a href="/phuong-phap/">Phương pháp</a> · <a href="/ban-cap-nhat/">Bản cập nhật</a> · <a href="/bai-viet/">Bài viết</a>${affItems.length ? ' · <a href="/phu-kien/">Phụ kiện</a>' : ''} · <a href="/lien-he/">Liên hệ</a> · <a href="/quyen-rieng-tu/">Quyền riêng tư</a>`;
const pageShell = ({ title, desc, path: pth, h1, over, body, og = 'website', ld = [] }) => `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="color-scheme" content="dark light only">
<meta name="viewport" content="width=device-width,initial-scale=1">
${CSP0}
<meta name="referrer" content="strict-origin-when-cross-origin">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-5WRPCM36GN"></script>
<script src="/assets/boot.js"></script>
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${pth}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="${og}"><meta property="og:site_name" content="Bảng Tier Liên Quân">
<meta property="og:title" content="${esc(h1)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${pth}"><meta property="og:image" content="${SITE}/og.jpg"><meta property="og:locale" content="vi_VN">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
  { '@type': 'ListItem', position: 1, name: 'Bảng Tier Liên Quân', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: h1, item: SITE + pth }] })}</script>
${ld.map(x => `<script type="application/ld+json">${JSON.stringify(x)}</script>`).join('\n')}
<link rel="stylesheet" href="/assets/page.css">
</head>
<body>
<header><a class="home" href="/">Tier · Liên Quân</a></header>
<main>
<p class="over">${esc(over)}</p>
<h1>${esc(h1)}</h1>
${body}
<a class="go" href="/">Mở Bảng Tier →</a>
</main>
<footer><a href="/">Bảng Tier Liên Quân</a> · ${NAVF}<br>Dữ liệu cập nhật ${upd}. Hình tướng thuộc bản quyền Garena / TiMi Studio.</footer>
</body>
</html>
`;
const writePage = (dir, html) => { fs.mkdirSync(path.join(ROOT, dir), { recursive: true }); fs.writeFileSync(path.join(ROOT, dir, 'index.html'), html); };
const heroOf = k => HEROES.find(h => h.id === k) || HEROES.find(h => h.key === k && !h.sec) || HEROES.find(h => h.key === k);
const pslug = p => `${p.date.replace('/', '-')}-${p.year}`;
const purl = p => `/ban-cap-nhat/${pslug(p)}/`;
const TRN = { up: 'Được tăng sức mạnh', down: 'Bị giảm sức mạnh', mix: 'Được điều chỉnh', new: 'Tướng mới hoặc làm lại' };
const strip = n => n.replace(/^(Tăng sức mạnh|Giảm sức mạnh|Điều chỉnh)[^:]*: /, '');

// lịch sử bản cập nhật: bản hiện tại (P trong data.js) được ghi vào tools/seo/patches.json, bản cũ giữ nguyên
const PFILE = path.join(ROOT, 'tools', 'seo', 'patches.json');
const patches = JSON.parse(fs.readFileSync(PFILE, 'utf8'));
const curP = patches.find(p => p.date === PATCH);
if (!curP) throw Error(`Thêm bản ${PATCH} vào tools/seo/patches.json (date, year, title, url, changes: []) rồi chạy lại`);
curP.changes = Object.entries(P).map(([k, v]) => ({ id: (heroOf(k) || {}).id || k, trend: v[0], note: v[1] }));
fs.writeFileSync(PFILE, JSON.stringify(patches, null, 1) + '\n');
patches.sort((a, b) => (b.year * 10000 + +b.date.split('/')[1] * 100 + +b.date.split('/')[0]) - (a.year * 10000 + +a.date.split('/')[1] * 100 + +a.date.split('/')[0]));
const pIso = p => `${p.year}-${p.date.split('/')[1].padStart(2, '0')}-${p.date.split('/')[0].padStart(2, '0')}`;
const LSLUG = { top: 'ta-than', jg: 'rung', mid: 'giua', ad: 'rong', sp: 'tro-thu' };   // trang tier list từng đường: /duong/<slug>/
const lurl = l => `/duong/${LSLUG[l]}/`;

// bài viết: tools/seo/articles/<slug>.html = vài dòng "khoá: giá trị" (title, h1, desc, date, over, patch, heroes) + dòng --- + phần thân HTML
const ADIR = path.join(ROOT, 'tools', 'seo', 'articles');
const aurl = a => `/bai-viet/${a.slug}/`;
const dmy = iso => iso.split('-').reverse().join('/');
const articles = (fs.existsSync(ADIR) ? fs.readdirSync(ADIR).filter(f => f.endsWith('.html')) : []).map(f => {
  const raw = fs.readFileSync(path.join(ADIR, f), 'utf8'), cut = raw.indexOf('\n---\n');
  if (cut < 0) throw Error(`${f}: thiếu dòng --- giữa phần đầu và thân bài`);
  const a = { slug: f.replace(/\.html$/, ''), body: raw.slice(cut + 5).trim() };
  for (const line of raw.slice(0, cut).split('\n')) { const m = line.match(/^(\w+):\s*(.*)$/); if (m) a[m[1]] = m[2].trim(); }
  for (const k of ['title', 'h1', 'desc', 'date', 'over']) if (!a[k]) throw Error(`${f}: thiếu "${k}:" ở phần đầu`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a.date)) throw Error(`${f}: date phải dạng yyyy-mm-dd`);
  if (a.desc.length > 160) throw Error(`${f}: desc dài ${a.desc.length} ký tự (tối đa 160)`);
  a.heroes = (a.heroes || '').split(',').map(s => s.trim()).filter(Boolean);
  for (const id of a.heroes) if (!HEROES.some(h => h.id === id)) throw Error(`${f}: heroes có id lạ "${id}"`);
  for (const m of a.body.matchAll(/href="\/tuong\/([^"/]+)\/"/g)) if (!HEROES.some(h => h.id === m[1])) throw Error(`${f}: liên kết tới trang tướng không có: ${m[1]}`);
  return a;
}).sort((x, y) => y.date.localeCompare(x.date));
const artsOf = h => articles.filter(a => a.heroes.includes(h.id));

// ---------- 1. FAQ ----------
const tops = Object.keys(LANES).map(l => [l, byLane(l)]);
const names = (arr, n) => arr.slice(0, n).map(h => h.name).join(', ');
const faq = [
  [`Tướng nào mạnh nhất Liên Quân ${season} hiện nay?`,
   `Theo bảng tổng hợp (cập nhật ${upd}, bản ${PATCH}), tướng đứng đầu mỗi đường là: ` + tops.map(([l, a]) => `${LANES[l]} ${a[0].name}`).join(', ') + '.',
   tops.map(([l, a]) => `${LANES[l]}: <a href="${url(a[0])}">${esc(a[0].name)}</a>`).join(' · ')],
  ...tops.map(([l, a]) => {
    const s = a.filter(h => h.tier === 'S'), list = (s.length ? s : a.slice(0, 3));
    return [`Tướng ${LANES[l]} mạnh nhất Liên Quân là ai?`,
      `Ở đường ${LANES[l]}, tier S gồm: ${names(list, 8)}.` + (a.filter(h => h.tier === 'A').length ? ` Tier A: ${names(a.filter(h => h.tier === 'A'), 6)}.` : ''),
      list.slice(0, 8).map(h => `<a href="${url(h)}">${esc(h.name)}</a>`).join(', ') + ` · <a href="${lurl(l)}">Cả tier list ${esc(LANES[l])}</a>`];
  }),
  ['Bảng tier được xếp dựa trên gì?',
   'Điểm tổng hợp từ số liệu ĐTDV mùa Đông 2026 (46%), mùa trước (17%), RoV Pro League (14%) và tier list rank cộng đồng (23%). Tier xếp theo thứ hạng trong từng đường.', ''],
  ['Xem tướng khắc chế và hợp cặp ở đâu?',
   `Bấm vào một tướng trên bảng tier, mục "Khắc chế và hợp cặp" có ba danh sách: bị khắc chế bởi, khắc chế và hợp cặp. Danh sách là ghi chú viết tay của người biên tập ROV META cho server Thái (bản ${CNSRC.patch}), không phải tỉ lệ thắng, nên server Việt Nam có thể lệch. Mỗi trang tướng riêng cũng có mục này.`,
   `Ví dụ: <a href="${url(tops.find(([l]) => l === 'mid')[1][0])}">khắc chế ${esc(tops.find(([l]) => l === 'mid')[1][0].name)}</a>`],
  ['Tra giá và tác dụng trang bị, bảng ngọc, phù hiệu, phép bổ trợ ở đâu?',
   'Mỗi tướng có build riêng theo đường trong bảng chi tiết. Muốn tra từng món thì xem trang Trang bị, Phù hiệu, Bảng ngọc và Phép bổ trợ: giá, chỉ số, nội tại hoặc tác dụng, kèm số build tham khảo dùng món đó.',
   '<a href="/trang-bi/">Trang bị</a> · <a href="/phu-hieu/">Phù hiệu</a> · <a href="/bang-ngoc/">Bảng ngọc</a> · <a href="/phep-bo-tro/">Phép bổ trợ</a>'],
  ['Bảng tier cập nhật khi nào?',
   `Lần cập nhật gần nhất ngày ${upd}, theo bản ${PATCH} của Garena. Bảng được cập nhật sau mỗi bản cân bằng tướng và khoảng 2 tuần một lần theo số liệu giải.`, ''],
];
const faqHTML = `<!--FAQ-->
  <section class="faq" aria-labelledby="faqTitle">
    <h2 id="faqTitle">Hỏi nhanh</h2>
${faq.map(([q, a, links]) => `    <details><summary>${esc(q)}</summary><p>${esc(a)}</p>${links ? `<p class="faq-l">${links}</p>` : ''}</details>`).join('\n')}
  </section>
  <!--/FAQ-->`;
const faqLD = `<!--FAQLD--><script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) })}</script><!--/FAQLD-->`;
if (!/<!--FAQ-->[\s\S]*<!--\/FAQ-->/.test(index) || !/<!--FAQLD-->[\s\S]*<!--\/FAQLD-->/.test(index)) throw Error('index.html thiếu chỗ đánh dấu <!--FAQ--> hoặc <!--FAQLD-->');
index = index.replace(/<!--FAQ-->[\s\S]*<!--\/FAQ-->/, faqHTML).replace(/<!--FAQLD-->[\s\S]*<!--\/FAQLD-->/, faqLD);
fs.writeFileSync(path.join(ROOT, 'index.html'), index);

// ---------- 2. Trang từng tướng ----------
const CSP = index.match(/<meta http-equiv="Content-Security-Policy"[^>]*>/)[0];
const outDir = path.join(ROOT, 'tuong'); fs.rmSync(outDir, { recursive: true, force: true });
for (const h of HEROES) {
  const L = LANES[h.lane], b = BUILDS[h.key + '@' + h.lane], sk = SKILLS[h.key === 'flowborn' ? 'flowborn-' + h.lane : h.key];
  const items = b ? b.i.map(id => BITEM[id][0]) : [], spells = b ? b.s.map(s => BSPELL[s][0]) : [];
  const others = HEROES.filter(x => x.key === h.key && x.id !== h.id);
  const peers = HEROES.filter(x => x.lane === h.lane && x.tier === h.tier && x.id !== h.id).slice(0, 12);
  const title = `${h.name} ${L} – tier ${h.tier} ${season} | Bảng Tier Liên Quân`;
  // Mô tả cho Google: tối đa ~160 ký tự (dài hơn bị cắt trên trang kết quả) → bớt dần số món đồ trong build
  const cn0 = COUNTERS[h.key], cnNames = cn0 ? cn0[0].slice(0, 3).map(k => (heroOf(k) || {}).name).filter(Boolean) : [];
  const mkDesc = (n, c) => `${h.name} đi ${L}${h.sec ? ' (đường phụ)' : ''}: tier ${h.tier} (${TNAME[h.tier]}), hạng ${h.rank}/${h.laneN} đường ${L}.` +
    (cnNames.length && c ? ` Bị khắc chế bởi ${cnNames.slice(0, c).join(', ')}.` : '') +
    (items.length && n ? ` Build: ${items.slice(0, n).join(', ')}…` : '') + (spells.length ? ` Phép: ${spells.join(', ')}.` : '') + ` Cập nhật ${upd}.`;
  // thử lần lượt: nhiều món đồ + 3 tướng khắc chế, rồi bớt dần; cuối cùng bỏ hẳn khắc chế và đồ
  let desc = '';
  for (const [n, c] of [[4, 3], [3, 3], [2, 3], [1, 3], [3, 2], [2, 2], [1, 2], [0, 3], [0, 2], [0, 1], [0, 0]]) { desc = mkDesc(n, c); if (desc.length <= 160) break; }
  const img = has('s', h) ? `${SITE}/s/${skey(h)}.webp` : `${SITE}/og.jpg`;
  const ban = has('s2', h) ? `/s2/${skey(h)}.webp` : has('s', h) ? `/s/${skey(h)}.webp` : '';
  const ld = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Bảng Tier Liên Quân', item: SITE + '/' },
    { '@type': 'ListItem', position: 2, name: `${h.name} ${L}`, item: SITE + url(h) }] };
  const ench = b && b.e ? b.e.map(id => BENCH[id][0]) : [];
  const cn = COUNTERS[h.key];
  const cnRow = (t, l) => l.length ? `<p><b>${esc(t)}:</b> ${l.map(k => { const x = heroOf(k); return x ? `<a href="${url(x)}">${esc(x.name)}</a>` : ''; }).filter(Boolean).join(', ')}</p>` : '';
  const html = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="color-scheme" content="dark light only">
<meta name="viewport" content="width=device-width,initial-scale=1">
${CSP}
<meta name="referrer" content="strict-origin-when-cross-origin">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-5WRPCM36GN"></script>
<script src="/assets/boot.js"></script>
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${url(h)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="article"><meta property="og:site_name" content="Bảng Tier Liên Quân">
<meta property="og:title" content="${esc(`${h.name} ${L} · Tier ${h.tier}`)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${url(h)}"><meta property="og:image" content="${img}"><meta property="og:locale" content="vi_VN">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<link rel="stylesheet" href="/assets/page.css">
</head>
<body>
<header><a class="home" href="/">Tier · Liên Quân</a></header>
<main>
${ban ? `<div class="ban"><img src="${ban}" alt="${esc(h.name)}" width="1386" height="852"></div>` : ''}
<p class="over">${esc(L)}${h.sec ? ' · đường phụ' : ''} · ${esc(CLASSES[h.cls] || '')} · ${esc(season)}</p>
<h1>${esc(h.name)} <span>tier ${h.tier}</span></h1>
<p class="lead">${esc(h.name)} đi ${esc(L)} đang ở <b>tier ${h.tier} (${TNAME[h.tier]})</b>, hạng ${h.rank}/${h.laneN} trong đường ${esc(L)}, điểm tổng hợp ${h.score.toFixed(2)}/5.${h.move ? ` ${h.move === 'up' ? 'Lên' : 'Xuống'} bậc từ tier ${h.prev} (so với ngày ${PREV_DATE}).` : ''} Cập nhật ${upd}, bản ${PATCH}.</p>
<a class="go" href="/#tuong-${h.id}">Xem chi tiết trên Bảng Tier →</a>
${h.note ? `<h2>Bản ${PATCH}</h2><p>${esc(h.note)}</p><p><a href="${purl(curP)}">Xem mọi thay đổi của bản ${PATCH} →</a></p>` : ''}
${artsOf(h).length ? `<h2>Bài viết liên quan</h2><ul class="links">${artsOf(h).map(a => `<li><a href="${aurl(a)}">${esc(a.h1)}</a></li>`).join('')}</ul>` : ''}
${b ? `<h2>Build ${h.lane === 'sp' ? 'Trợ thủ' : 'đi ' + esc(L)}</h2>
<ol class="items">${b.i.map(id => `<li><a href="/trang-bi/#${id}">${esc(BITEM[id][0])}</a></li>`).join('')}</ol>
<p><b>Phép bổ trợ:</b> ${b.s.map(s => `<a href="/phep-bo-tro/#${s}">${esc(BSPELL[s][0])}</a>`).join(' hoặc ')}</p>
<p><b>Bảng ngọc:</b> ${b.r.map(([a, n]) => `<a href="/bang-ngoc/#${a}">${esc(BARC[a][2])}</a> ×${n} (${esc(BARC[a][1])})`).join('; ')}</p>
${ench.length ? `<p><b>Phù hiệu:</b> ${b.e.map(id => `<a href="/phu-hieu/#${id}">${esc(BENCH[id][0])}</a>`).join(', ')}</p>` : ''}
<p class="src">Nguồn build: <a href="${esc(b.l)}" rel="noopener">${esc(new URL(b.l).hostname)}</a> (server Việt).</p>` : ''}
${cn ? `<h2>Khắc chế và hợp cặp với ${esc(h.name)}</h2>
${cnRow('Bị khắc chế bởi', cn[0])}${cnRow(`${h.name} khắc chế`, cn[1])}${cnRow('Hợp cặp', cn[2])}<p class="src">Theo danh sách viết tay của <a href="${CNSRC.base}${esc(cn[3])}" rel="noopener">${esc(CNSRC.name)}</a> (server Thái, bản ${esc(CNSRC.patch)}, đọc ngày ${esc(CNSRC.read)}), không phải tỉ lệ thắng; server Việt Nam có thể lệch.</p>` : ''}
${sk ? `<h2>Bộ chiêu thức</h2><dl class="sk">${sk[1].map(([n, , s], k) => `<dt>${['Nội tại', 'Chiêu 1', 'Chiêu 2', 'Chiêu cuối'][k] || 'Chiêu'}${n ? ' · ' + esc(n) : ''}</dt><dd>${esc(s || '')}</dd>`).join('')}</dl>
<p class="src">Tóm tắt từ <a href="https://lienquan.garena.vn/hoc-vien/tuong-skin/d/${esc(sk[0])}/" rel="noopener">Học viện Garena</a>.</p>` : ''}
${others.length ? `<h2>${esc(h.name)} ở đường khác</h2><ul class="links">${others.map(x => `<li><a href="${url(x)}">${esc(LANES[x.lane])}${x.sec ? ' (phụ)' : ''} · tier ${x.tier}</a></li>`).join('')}</ul>` : ''}
${peers.length ? `<h2>Cùng tier ${h.tier} ở ${esc(L)}</h2><ul class="links">${peers.map(x => `<li><a href="${url(x)}">${esc(x.name)}</a></li>`).join('')}</ul>` : ''}
<p><a href="${lurl(h.lane)}">Xem cả tier list ${esc(L)} →</a></p>
<a class="go" href="/#tuong-${h.id}">Mở ${esc(h.name)} trên Bảng Tier →</a>
</main>
<footer><a href="/">Bảng Tier Liên Quân</a> · ${NAVF}<br>Dữ liệu cập nhật ${upd}. Hình tướng thuộc bản quyền Garena / TiMi Studio.</footer>
</body>
</html>
`;
  fs.mkdirSync(path.join(outDir, h.id), { recursive: true });
  fs.writeFileSync(path.join(outDir, h.id, 'index.html'), html);
}

// ---------- 3. Trang bản cập nhật ----------
fs.rmSync(path.join(ROOT, 'ban-cap-nhat'), { recursive: true, force: true });
const tierLine = h => `<span class="tb">${esc(LANES[h.lane])}${h.sec ? ' (phụ)' : ''} · tier ${h.tier}</span>`;
for (const p of patches) {
  const ch = p.changes.map(c => ({ ...c, h: heroOf(c.id) })).filter(c => c.h);
  const grp = t => ch.filter(c => c.trend === t);
  const names3 = (t, n) => grp(t).slice(0, n).map(c => c.h.name).join(', ');
  const cnt = { up: grp('up').length, down: grp('down').length, mix: grp('mix').length, new: grp('new').length };
  const sum = [cnt.up && `${cnt.up} tăng`, cnt.down && `${cnt.down} giảm`, cnt.mix && `${cnt.mix} điều chỉnh`, cnt.new && `${cnt.new} mới`].filter(Boolean).join(', ');
  const mkDesc = n => `Liên Quân bản ${p.date}/${p.year}: ` + [cnt.up && `tăng sức mạnh ${names3('up', n)}`, cnt.down && `giảm ${names3('down', n)}`, cnt.mix && `chỉnh ${names3('mix', n)}`, cnt.new && `mới ${names3('new', n)}`].filter(Boolean).join('; ') + '. Kèm tier hiện tại.';
  let desc = mkDesc(4); for (let n = 3; desc.length > 160 && n >= 1; n--) desc = mkDesc(n);
  if (desc.length > 160) desc = `Liên Quân bản ${p.date}/${p.year}: ${sum}. Kèm tier hiện tại của từng tướng thay đổi.`;
  const sec = (t, h2) => grp(t).length ? `<h2>${h2} (${grp(t).length})</h2><ul class="chg">${grp(t).map(c => `<li><a href="${url(c.h)}"><b>${esc(c.h.name)}</b></a> ${tierLine(c.h)}<p>${esc(strip(c.note))}</p></li>`).join('')}</ul>` : '';
  const lanes = Object.keys(LANES).map(l => { const s = byLane(l).filter(h => h.tier === 'S'); return s.length ? `<li><b><a href="${lurl(l)}">${esc(LANES[l])}</a>:</b> ${s.map(h => `<a href="${url(h)}">${esc(h.name)}</a>`).join(', ')}</li>` : ''; }).join('');
  const others = patches.filter(x => x !== p);
  const pArts = articles.filter(a => a.patch === p.date);
  const body = `<p class="lead">${esc(p.title)} ngày ${p.date}/${p.year} thay đổi ${ch.length} tướng (${sum}). Mỗi tướng bên dưới có tóm tắt thay đổi và tier hiện tại trên Bảng Tier Liên Quân (dữ liệu ${upd}).</p>
${pArts.map(a => `<p><a href="${aurl(a)}">Bài phân tích: ${esc(a.h1)} →</a></p>`).join('')}
${sec('up', 'Được tăng sức mạnh')}${sec('down', 'Bị giảm sức mạnh')}${sec('mix', 'Được điều chỉnh')}${sec('new', 'Tướng mới hoặc làm lại')}
<p class="src">Nguồn: <a href="${esc(p.url)}" rel="noopener">Garena – ${esc(p.title)} ${p.date}/${p.year}</a>. Số liệu trước/sau lấy từ bài này, lời mô tả là tóm tắt lại. Tier chỉ phản ánh số liệu giải đấu và rank, không tự đổi ngay theo bản vá.</p>
<h2>Tier S hiện tại theo từng đường</h2><ul class="chg plain">${lanes}</ul>
${others.length ? `<h2>Các bản khác</h2><ul class="links">${others.map(x => `<li><a href="${purl(x)}">Bản ${x.date}/${x.year}</a></li>`).join('')}<li><a href="/ban-cap-nhat/">Tất cả bản cập nhật</a></li></ul>` : ''}`;
  writePage(purl(p).slice(1), pageShell({ title: `Bản ${p.date}/${p.year} Liên Quân: tướng tăng giảm, tier mới | Bảng Tier Liên Quân`, desc, path: purl(p), h1: `Liên Quân bản ${p.date}/${p.year}`, over: `Bản cập nhật · ${p.title} · ${season}`, body }));
}
writePage('ban-cap-nhat', pageShell({ title: 'Các bản cập nhật cân bằng tướng Liên Quân | Bảng Tier Liên Quân', desc: `Danh sách các bản điều chỉnh sức mạnh tướng Liên Quân ${season}: tướng nào tăng, giảm, đổi, kèm tier hiện tại.`, path: '/ban-cap-nhat/', h1: 'Các bản cập nhật', over: `Cân bằng tướng · ${season}`,
  body: `<p class="lead">Mỗi bản điều chỉnh sức mạnh của Garena một trang: tướng nào được tăng, bị giảm, được đổi và đang ở tier nào.</p><ul class="chg plain">${patches.map(p => `<li><a href="${purl(p)}"><b>Bản ${p.date}/${p.year}</b></a> · ${p.changes.length} tướng thay đổi<p>${esc(p.title)}</p></li>`).join('')}</ul>` }));

// ---------- 3b. Tier list từng đường (duong/<slug>/): trang đích cho "tier list rừng liên quân"... ----------
fs.rmSync(path.join(ROOT, 'duong'), { recursive: true, force: true });
const rowL = h => `<li><a href="${url(h)}"><b>${esc(h.name)}</b></a>${h.sec ? '<span class="tb">đường phụ</span>' : ''}<span class="tb">hạng ${h.rank}/${h.laneN}</span><span class="tb">${h.score.toFixed(2)}/5</span>${h.move ? `<span class="tb">${h.move === 'up' ? '↑ lên' : '↓ xuống'} từ tier ${h.prev}</span>` : ''}${h.note ? `<p>Bản ${PATCH}: ${esc(strip(h.note))}</p>` : ''}</li>`;
for (const l of Object.keys(LANES)) {
  const L = LANES[l], a = HEROES.filter(h => h.lane === l).sort((x, y) => TO.indexOf(x.tier) - TO.indexOf(y.tier) || x.rank - y.rank);   // cùng cách đếm hạng/tổng như trang từng tướng (gồm đường phụ)
  const nSec = a.filter(h => h.sec).length, S = a.filter(h => h.tier === 'S'), Sm = S.filter(h => !h.sec), Ss = S.filter(h => h.sec), topN = Sm.length ? Sm : a.slice(0, 3);   // tier S ghi đường chính trước, đường phụ sau (khớp mục Hỏi nhanh)
  const cnt = TO.split('').filter(t => a.some(h => h.tier === t)).map(t => `${a.filter(h => h.tier === t).length} tier ${t}`).join(', ');
  const mkDesc = n => `Tier list ${L} Liên Quân ${season} (cập nhật ${upd}): ${Sm.length ? 'tier S' : 'đứng đầu'} ${names(topN, n)}. Xếp ${a.length} tướng ${L} theo số liệu ĐTDV và rank.`;
  let desc = mkDesc(5); for (let n = 4; desc.length > 160 && n >= 1; n--) desc = mkDesc(n);
  const body = `<p class="lead">Bảng xếp ${a.length} tướng đi ${esc(L)} trong Liên Quân ${esc(season)}${nSec ? ` (gồm ${nSec} tướng đi như đường phụ)` : ''}, từ mạnh đến yếu: ${esc(cnt)}. ${S.length ? `Tier S gồm ${esc(names(Sm.length ? Sm : Ss, 10))}${Sm.length && Ss.length ? ` và ${esc(names(Ss, 5))} (đường phụ)` : ''}.` : `Đứng đầu là ${esc(names(topN, 3))}.`} Cập nhật ${upd}, bản ${PATCH}.</p>
${TO.split('').map(t => { const g = a.filter(h => h.tier === t); return g.length ? `<h2>Tier ${t} · ${TNAME[t]} (${g.length})</h2><ul class="chg plain">${g.map(rowL).join('')}</ul>` : ''; }).join('\n')}
<h2>Tier được xếp thế nào</h2><p>Điểm tổng hợp trên thang 5 từ số liệu ĐTDV mùa hiện tại (46%), mùa trước (17%), RoV Pro League (14%) và tier list rank cộng đồng (23%). Tier xếp theo thứ hạng trong riêng đường ${esc(L)}, nên một tướng đi nhiều đường có thể có tier khác nhau ở mỗi đường. Thông tin để tham khảo, meta đổi theo bản vá và cách chơi. <a href="/phuong-phap/">Chi tiết cách xếp</a> ·<a href="${purl(curP)}">Thay đổi của bản ${PATCH}</a>.</p>
<h2>Các đường khác</h2><ul class="links">${Object.keys(LANES).filter(x => x !== l).map(x => `<li><a href="${lurl(x)}">Tier list ${esc(LANES[x])}</a></li>`).join('')}</ul>`;
  writePage(lurl(l).slice(1, -1), pageShell({ title: `Tier list ${L} Liên Quân ${season}: tướng mạnh nhất | Bảng Tier Liên Quân`, desc, path: lurl(l), h1: `Tier list ${L}`, over: `Liên Quân ${season} · cập nhật ${upd}`, body }));
}

// ---------- 3c. Bài viết (bai-viet/<slug>/ và bai-viet/): nguồn ở tools/seo/articles/ ----------
fs.rmSync(path.join(ROOT, 'bai-viet'), { recursive: true, force: true });
for (const a of articles) {
  const related = a.heroes.map(id => HEROES.find(h => h.id === id)).filter(Boolean);
  const body = `<p class="src">Đăng ${dmy(a.date)} · Bảng Tier Liên Quân</p>
${a.body}
${related.length ? `<h2>Tướng được nhắc trong bài</h2><ul class="links">${related.map(h => `<li><a href="${url(h)}">${esc(h.name)} ${esc(LANES[h.lane])}</a></li>`).join('')}</ul>` : ''}
<p><a href="/bai-viet/">Tất cả bài viết →</a></p>`;
  const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: a.h1, description: a.desc, inLanguage: 'vi', datePublished: a.date, dateModified: a.date, image: [`${SITE}/og.jpg`],
    mainEntityOfPage: SITE + aurl(a), author: { '@type': 'Organization', name: 'Bảng Tier Liên Quân', url: SITE + '/' }, publisher: { '@type': 'Organization', name: 'Bảng Tier Liên Quân', url: SITE + '/' } };
  writePage(aurl(a).slice(1), pageShell({ title: `${a.title} | Bảng Tier Liên Quân`, desc: a.desc, path: aurl(a), h1: a.h1, over: a.over, body, og: 'article', ld: [ld] }));
}
writePage('bai-viet', pageShell({ title: 'Bài viết về meta và cân bằng tướng Liên Quân | Bảng Tier Liên Quân', desc: `Phân tích các bản cập nhật cân bằng tướng Liên Quân ${season}: tướng nào đáng chơi, số liệu giải đấu và ý kiến người chơi.`, path: '/bai-viet/', h1: 'Bài viết', over: `Phân tích · ${season}`,
  body: `<p class="lead">Phân tích sau mỗi bản cân bằng: tướng nào đáng chơi, số liệu giải đấu nói gì và người chơi nghĩ gì.</p><ul class="chg plain">${articles.map(a => `<li><a href="${aurl(a)}"><b>${esc(a.h1)}</b></a><span class="tb">${dmy(a.date)}</span><p>${esc(a.desc)}</p></li>`).join('')}</ul>` }));

// ---------- 3d. Phụ kiện (link tiếp thị), chỉ khi tools/seo/affiliate.json có món ----------
if (affItems.length) writePage('phu-kien', pageShell({ title: 'Phụ kiện chơi Liên Quân: găng tay, quạt tản nhiệt điện thoại | Bảng Tier Liên Quân', desc: 'Gợi ý phụ kiện chơi Liên Quân Mobile trên điện thoại. Trang có liên kết tiếp thị ' + affShops + ', giá bạn trả không đổi.', path: '/phu-kien/', h1: 'Phụ kiện chơi Liên Quân', over: 'Gợi ý · có liên kết tiếp thị',
  body: `<p class="lead">Vài món phụ kiện cho người chơi trên điện thoại, chọn theo lượt bán trên Shopee. Đây không phải bài đánh giá hay xếp hạng như bảng tier: hãy đọc đánh giá của người mua trước khi quyết định.</p><p><b>Lưu ý:</b> các liên kết bên dưới là liên kết tiếp thị (affiliate). Nếu bạn mua qua đó, người duy trì web có thể nhận một khoản hoa hồng, giá bạn trả không đổi. Hoa hồng không ảnh hưởng tier hay nhận định trong bài.</p><ul class="chg plain">${affItems.map(x => `<li><a href="${esc(x.url)}" rel="sponsored nofollow noopener" target="_blank"><b>${esc(x.name)}</b></a><span class="tb">${esc(x.shop)}</span><p>${esc(x.desc)}</p></li>`).join('')}</ul>` }));

// ---------- 3e. Trang tra cứu: trang bị, phù hiệu, bảng ngọc, phép bổ trợ (dữ liệu BITEM/BINFO/BENCH/BARC/BSPELL trong builds.js; "số build" = đếm trong BUILDS) ----------
const { BINFO, BENCHB } = ctx;
const nB = Object.keys(BUILDS).length;
const countBy = pick => { const m = {}; Object.values(BUILDS).forEach(b => pick(b).forEach(x => { m[x] = (m[x] || 0) + 1; })); return m; };
const cItem = countBy(b => b.i), cSpell = countBy(b => b.s), cEnch = countBy(b => b.e || []), cArc = countBy(b => b.r.map(([a]) => a));
const goldFmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const byCountName = (cm, nameOf) => (a, b) => (cm[b] || 0) - (cm[a] || 0) || nameOf(a).localeCompare(nameOf(b), 'vi');
const REFNOTE = `Số build là đếm trong ${nB} build tham khảo của web (chủ yếu từ AOV-Builds, server Việt), không phải tỉ lệ dùng trong game.`;
const CONCEPTS = [['/trang-bi/', 'Trang bị'], ['/phu-hieu/', 'Phù hiệu'], ['/bang-ngoc/', 'Bảng ngọc'], ['/phep-bo-tro/', 'Phép bổ trợ']];
const otherConcepts = cur => `<h2>Tra cứu khác</h2><ul class="links">${CONCEPTS.filter(([u]) => u !== cur).map(([u, n]) => `<li><a href="${u}">${n}</a></li>`).join('')}<li><a href="/phuong-phap/">Cách xếp tier</a></li><li><a href="${lurl('jg')}">Tier list Rừng</a></li></ul>`;
const ITCAT = [['atk', 'Tấn công'], ['mag', 'Phép thuật'], ['def', 'Phòng thủ'], ['boot', 'Giày'], ['jg', 'Đồ rừng'], ['sup', 'Đồ trợ thủ']];
const itemLi = id => { const [vi, , ic] = BITEM[id], f = BINFO[id] || { s: [], n: [] };
  return `<li id="${id}"><img class="ic" src="/b/i-${esc(ic)}.webp" alt="" width="40" height="40" loading="lazy"><b>${esc(vi)}</b>${f.p ? `<span class="tb">${goldFmt(f.p)} vàng</span>` : ''}<span class="tb">${cItem[id] || 0} build</span>${f.s && f.s.length ? `<p>${esc(f.s.join(' · '))}</p>` : ''}${(f.n || []).map(([n, d]) => `<p><b>${esc(n)}:</b> ${esc(d)}</p>`).join('')}</li>`; };
const itemIds = Object.keys(BITEM);
writePage('trang-bi', pageShell({ title: 'Trang bị Liên Quân: giá, chỉ số, nội tại từng món | Bảng Tier Liên Quân', desc: `${itemIds.length} món trang bị Liên Quân ${season}: giá, chỉ số, nội tại và số build tham khảo dùng món đó, chia theo nhóm tấn công, phép thuật, phòng thủ.`, path: '/trang-bi/', h1: 'Trang bị Liên Quân', over: `Tra cứu · ${season}`,
  body: `<p class="lead">${itemIds.length} món trang bị xuất hiện trong ${nB} build tham khảo của Bảng Tier Liên Quân, chia theo nhóm. Mỗi món ghi giá, chỉ số, nội tại và số build dùng món đó; món nhiều build đứng trước.</p>
<p class="src">${REFNOTE} Giá và chỉ số theo dữ liệu AoV-IndeX bản Việt, có thể lệch nếu Garena vừa chỉnh. Tra chính thức ở <a href="https://lienquan.garena.vn/hoc-vien/trang-bi/" rel="noopener">Học viện Garena</a>.</p>
${ITCAT.map(([c, t]) => { const ids = itemIds.filter(id => BITEM[id][1] === c).sort(byCountName(cItem, id => BITEM[id][0])); return ids.length ? `<h2>${t} (${ids.length})</h2><ul class="chg plain">${ids.map(itemLi).join('')}</ul>` : ''; }).join('\n')}
${otherConcepts('/trang-bi/')}` }));
const benchIds = Object.keys(BENCH), ROM = ['', 'I', 'II', 'III'];
writePage('phu-hieu', pageShell({ title: 'Phù hiệu Liên Quân: các nhánh, cấp độ và tác dụng | Bảng Tier Liên Quân', desc: `${benchIds.length} phù hiệu Liên Quân ${season} chia theo ${Object.keys(BENCHB).length} nhánh, kèm cấp độ, tác dụng và số build tham khảo dùng phù hiệu đó.`, path: '/phu-hieu/', h1: 'Phù hiệu Liên Quân', over: `Tra cứu · ${season}`,
  body: `<p class="lead">Phù hiệu chia thành ${Object.keys(BENCHB).length} nhánh: ${Object.values(BENCHB).map(esc).join(', ')}. Mỗi bộ có 3 phù hiệu ở nhánh chính (cấp I, II, III) và 2 phù hiệu phụ cấp I hoặc II ở nhánh khác. Bảng liệt kê ${benchIds.length} phù hiệu xuất hiện trong ${nB} build tham khảo, kèm tác dụng và số build dùng.</p>
<p class="src">${REFNOTE} Tên và mô tả theo dữ liệu AoV-IndeX bản Việt. Tra chính thức ở <a href="https://lienquan.garena.vn/hoc-vien/phu-hieu/" rel="noopener">Học viện Garena</a>.</p>
${Object.entries(BENCHB).map(([br, bn]) => { const ids = benchIds.filter(id => BENCH[id][1] === br).sort((a, b) => BENCH[a][2] - BENCH[b][2] || BENCH[a][0].localeCompare(BENCH[b][0], 'vi')); return ids.length ? `<h2>${esc(bn)} (${ids.length})</h2><ul class="chg plain">${ids.map(id => `<li id="${id}"><img class="ic" src="/b/e-${id}.webp" alt="" width="40" height="40" loading="lazy"><b>${esc(BENCH[id][0])}</b><span class="tb">Cấp ${ROM[BENCH[id][2]] || BENCH[id][2]}</span><span class="tb">${cEnch[id] || 0} build</span><p>${esc(BENCH[id][3])}</p></li>`).join('')}</ul>` : ''; }).join('\n')}
${otherConcepts('/phu-hieu/')}` }));
const arcIds = Object.keys(BARC), ARCCOL = [['red', 'đỏ'], ['purple', 'tím'], ['teal', 'xanh']];
writePage('bang-ngoc', pageShell({ title: 'Bảng ngọc Liên Quân: chỉ số 30 viên ngọc đỏ, tím, xanh | Bảng Tier Liên Quân', desc: `${arcIds.length} viên ngọc Liên Quân ${season}: tên, chỉ số cấp III của ngọc đỏ, tím, xanh và số build tham khảo dùng từng viên.`, path: '/bang-ngoc/', h1: 'Bảng ngọc Liên Quân', over: `Tra cứu · ${season}`,
  body: `<p class="lead">Mỗi bảng ngọc gồm 30 viên, 10 viên mỗi màu đỏ, tím, xanh (đúng như các build tham khảo của web). Trang này liệt kê ${arcIds.length} loại ngọc cấp III, ${arcIds.length / 3} loại mỗi màu, kèm chỉ số và số build dùng loại đó; loại nhiều build đứng trước.</p>
<p class="src">${REFNOTE} Tên ngọc theo trang <a href="https://lienquan.garena.vn/hoc-vien/bang-ngoc/" rel="noopener">Bảng ngọc của Học viện Garena</a> (đọc ngày 31/10/2026), chỉ số theo dữ liệu AoV-IndeX. Ngọc cấp I và II có chỉ số thấp hơn, xem ở Học viện. Hai loại ngọc tím Hút máu và Tỷ lệ chí mạng/Máu chưa được trang Học viện liệt kê ở cấp III nên tên theo cấp II của trang đó.</p>
${ARCCOL.map(([c, cn]) => { const ids = arcIds.filter(id => BARC[id][0] === c).sort(byCountName(cArc, id => BARC[id][2])); return `<h2>Ngọc ${cn} (${ids.length})</h2><ul class="chg plain">${ids.map(id => `<li id="${id}"><img class="ic" src="/b/a-${id}.webp" alt="" width="40" height="40" loading="lazy"><b>${esc(BARC[id][2])}</b><span class="tb">${cArc[id] || 0} build</span><p>${esc(BARC[id][1])}</p></li>`).join('')}</ul>`; }).join('\n')}
${otherConcepts('/bang-ngoc/')}` }));
const spellIds = Object.keys(BSPELL).sort(byCountName(cSpell, id => BSPELL[id][0]));
writePage('phep-bo-tro', pageShell({ title: 'Phép bổ trợ Liên Quân: tác dụng từng phép | Bảng Tier Liên Quân', desc: `${spellIds.length} phép bổ trợ Liên Quân ${season}: ${spellIds.slice(0, 4).map(id => BSPELL[id][0]).join(', ')}... kèm tác dụng và số build tham khảo dùng phép đó.`, path: '/phep-bo-tro/', h1: 'Phép bổ trợ Liên Quân', over: `Tra cứu · ${season}`,
  body: `<p class="lead">${spellIds.length} phép bổ trợ xuất hiện trong ${nB} build tham khảo của Bảng Tier Liên Quân, kèm tác dụng và số build dùng phép đó. Trong các build của web, tướng đi Rừng đều mang Trừng Trị.</p>
<p class="src">${REFNOTE} Tên và mô tả theo dữ liệu AoV-IndeX bản Việt. Tra chính thức ở <a href="https://lienquan.garena.vn/hoc-vien/phu-tro/" rel="noopener">Học viện Garena</a>.</p>
<ul class="chg plain">${spellIds.map(id => `<li id="${id}"><img class="ic" src="/b/t-${id}.webp" alt="" width="40" height="40" loading="lazy"><b>${esc(BSPELL[id][0])}</b><span class="tb">${cSpell[id] || 0} build</span><p>${esc(BSPELL[id][1])}</p></li>`).join('')}</ul>
${otherConcepts('/phep-bo-tro/')}` }));

// ---------- 4. Giới thiệu / Liên hệ / Quyền riêng tư + mục lục liên kết ----------
const TT = 'https://www.tiktok.com/@bangtierlienquan';
writePage('gioi-thieu', pageShell({ title: 'Giới thiệu Bảng Tier Liên Quân: tier list tướng theo từng đường', desc: 'Bảng Tier Liên Quân xếp hạng tướng Liên Quân Mobile theo từng đường từ số liệu giải đấu và rank, cập nhật sau mỗi bản cân bằng.', path: '/gioi-thieu/', h1: 'Giới thiệu', over: 'Về web',
  body: `<p class="lead">Bảng Tier Liên Quân xếp hạng tướng Liên Quân Mobile theo từng đường (Tà Thần, Rừng, Giữa, Rồng, Trợ thủ). Web do một người chơi duy trì, không thuộc Garena hay TiMi Studio.</p>
<h2>Mỗi tướng có gì</h2><p>Tier từ S đến D, điểm tổng hợp trên thang 5, build tham khảo theo từng đường, bảng ngọc, phù hiệu, bộ chiêu thức tóm tắt, danh sách tướng khắc chế và hợp cặp (theo ROV META, server Thái) và ghi chú khi tướng thay đổi ở bản cập nhật. Có chế độ Số liệu để so tỉ lệ thắng, chọn, cấm ở ĐTDV, và chế độ Tự xếp để làm tier list của riêng bạn.</p>
<h2>Tra cứu</h2><p>Trang riêng cho từng món <a href="/trang-bi/">trang bị</a>, từng <a href="/phu-hieu/">phù hiệu</a>, <a href="/bang-ngoc/">bảng ngọc</a> (30 loại ngọc) và <a href="/phep-bo-tro/">phép bổ trợ</a> (giá, chỉ số, tác dụng), cùng <a href="/phuong-phap/">trang Phương pháp</a> ghi công thức xếp tier.</p>
<h2>Tier được xếp thế nào</h2><p>Điểm gộp từ số liệu ĐTDV mùa Đông 2026 (46%), mùa trước (17%), RoV Pro League (14%) và tier list rank cộng đồng do người biên tập tổng hợp (23%). Tier xếp theo thứ hạng trong từng đường. Một số tướng được người biên tập chỉnh tay, danh sách công khai trong mục "Cách xếp và nguồn" ở <a href="/#method">trang chủ</a>. Công thức đầy đủ, ngưỡng điểm và giới hạn: <a href="/phuong-phap/">trang Phương pháp</a>.</p>
<h2>Cập nhật</h2><p>Bảng được cập nhật sau mỗi bản cân bằng của Garena và khoảng 2 tuần một lần theo số liệu giải. Ngày cập nhật ghi ở cuối mỗi trang; lịch sử các bản ở mục <a href="/ban-cap-nhat/">Bản cập nhật</a>.</p>
<h2>Nguồn dữ liệu</h2><ul class="links"><li><a href="https://liquipedia.net/honorofkings/Arena_of_Glory" rel="noopener">Liquipedia (ĐTDV)</a></li><li><a href="https://rovmeta.com/stats" rel="noopener">ROV META (RoV Pro League)</a></li><li><a href="https://rovmeta.com/heroes" rel="noopener">ROV META (khắc chế và hợp cặp, server Thái)</a></li><li><a href="https://lienquan.garena.vn/category/cap-nhat/" rel="noopener">Garena Liên Quân</a></li><li><a href="https://aov-builds.com/" rel="noopener">AOV-Builds</a></li><li><a href="https://github.com/AoV-IndeX/avix-data" rel="noopener">AoV-IndeX</a></li></ul>
<h2>Lưu ý</h2><p>Thông tin để tham khảo. Meta đổi theo bản vá, trình độ và cách chơi, nên tier không thay cho cảm nhận của bạn khi chơi. Tên và hình ảnh tướng thuộc bản quyền Garena / TiMi Studio.</p>
<p>Kênh TikTok: <a href="${TT}" rel="noopener">@bangtierlienquan</a> · Góp ý, báo sai số liệu: <a href="/lien-he/">Liên hệ</a>.</p>` }));
// Phương pháp (phuong-phap/): công thức xếp tier. Số trận, danh sách chỉnh tay và đường phụ đọc thẳng từ data.js; ngưỡng điểm phải khớp aogScore/proScore/QUOTA trong data.js
const manualList = HEROES.filter(h => h.floor === 'manual').sort((a, b) => TO.indexOf(a.tier) - TO.indexOf(b.tier) || a.name.localeCompare(b.name, 'vi')).map(h => `${esc(h.name)} (${esc(LANES[h.lane])}) → ${h.tier}`);
const secList = HEROES.filter(h => h.sec).map(h => `${esc(h.name)} (${esc(LANES[h.lane])})`);
writePage('phuong-phap', pageShell({ title: 'Phương pháp xếp tier Liên Quân: công thức và nguồn | Bảng Tier Liên Quân', desc: 'Cách Bảng Tier Liên Quân xếp tier: nguồn ĐTDV và RoV Pro League, công thức tính điểm, ngưỡng từng tier và danh sách chỉnh tay công khai.', path: '/phuong-phap/', h1: 'Phương pháp xếp tier', over: `Cách làm · ${season}`,
  body: `<p class="lead">Tier trên Bảng Tier Liên Quân đến từ một công thức công khai, chạy trên số liệu giải đấu và tier list rank cộng đồng, cộng một danh sách chỉnh tay của người biên tập cũng công khai. Trang này giải thích từng bước để bạn tự kiểm lại.</p>
<h2>Bốn nguồn số liệu</h2><ul class="items">
<li><b>ĐTDV mùa hiện tại (46%):</b> ${ctx.SRC.aogGames} trận của Đấu Trường Danh Vọng (Arena of Glory) theo bảng thống kê Liquipedia, ưu tiên số trận được chọn.</li>
<li><b>ĐTDV mùa trước (17%):</b> ${ctx.SRC.prevGames} trận, cùng cách tính, trọng số nhẹ hơn vì đã qua nhiều bản cập nhật.</li>
<li><b>RoV Pro League (14%):</b> giải đấu của server Thái Lan, lấy từ ROV META. Tướng ít xuất hiện chỉ được tính rất nhẹ.</li>
<li><b>Tier list rank cộng đồng (23%):</b> người biên tập tổng hợp từ hai nhà sáng tạo nội dung (@darkiaov9126 và @blvkhanhhy). Đây là ý kiến, không phải số liệu.</li></ul>
<p>Trọng số được chia lại theo các nguồn có mặt: tướng chưa có trong tier list rank cộng đồng thì chỉ tính ba nguồn còn lại. Tướng không xuất hiện ở ĐTDV nhận 1,5 điểm ở nguồn đó. Tier list của báo game Việt Nam không còn được tính từ 19/10/2026.</p>
<h2>Điểm của một tướng (thang 1 đến 5)</h2><ul class="items">
<li><b>ĐTDV:</b> tỉ lệ chọn từ 30% số trận = 5 điểm, 25% = 4,5, 20% = 4, 15% = 3,5, 10% = 3, 5% = 2,5, 2% = 2, thấp hơn = 1,5. Bị cấm từ 40% số trận cộng 0,5, từ 20% cộng 0,25.</li>
<li><b>Tỉ lệ thắng chỉ được tính khi tướng được chọn ở ít nhất 5% số trận:</b> thắng từ 55% cộng 0,5, từ 45% trở xuống trừ 0,5. Nhờ vậy tướng chỉ đánh vài trận với tỉ lệ thắng cao không tự nhảy lên tier cao.</li>
<li><b>RoV Pro League:</b> tỉ lệ chọn cộng cấm từ 50% = 5 điểm, 30% = 4,5, 20% = 4, 10% = 3,5, 5% = 3, thấp hơn = 2,5; khi tướng chọn từ 5% số trận, thắng từ 55% cộng 0,5, từ 45% trở xuống trừ 0,5.</li>
<li><b>Rank cộng đồng:</b> S+ = 5, S = 4,5, A = 3,5, B = 2,5, C = 1,5.</li></ul>
<h2>Từ điểm thành tier</h2><ul class="items">
<li><b>Tier xếp theo từng đường:</b> tướng chỉ so với các tướng cùng đường. Top 12% của đường là S, 12–32% là A, 32–57% là B, 57–80% là C, còn lại là D.</li>
<li><b>Đường phụ:</b> tướng thường được đưa sang đường khác bị trừ 0,4 điểm khi so và tối đa tier A, vì số liệu giải không tách theo đường.</li>
<li><b>Sàn theo ĐTDV (chỉ đường chính):</b> chọn cộng cấm từ 75% số trận luôn là S, từ 55% tối thiểu A. Chọn từ 30% số trận (thắng từ 45%) là S, từ 20% tối thiểu A.</li>
<li><b>Chỉnh tay của người biên tập</b> ghi đè mọi quy tắc trên và được giữ khi cập nhật số liệu.</li>
<li>Mũi tên lên hoặc xuống trên ảnh tướng so tier hiện tại với tier ở lần cập nhật trước (${esc(PREV_DATE)}).</li></ul>
<h2>Chỉnh tay hiện tại</h2><p>${manualList.join(' · ')}.</p>
<h2>Tướng đang ghi đường phụ</h2><p>${secList.join(' · ')}.</p>
<h2>Điều không ảnh hưởng tier</h2><ul class="items">
<li>Liên kết tiếp thị và hoa hồng. Hiện chỉ có trang ${affItems.length ? '<a href="/phu-kien/">Phụ kiện</a>' : 'Phụ kiện (khi có)'}, tách khỏi bảng tier và ghi rõ trên trang.</li>
<li>Mục "Khắc chế và hợp cặp" ở trang từng tướng. Đó là danh sách viết tay của <a href="https://rovmeta.com/" rel="noopener">ROV META</a> (server Thái, bản ${esc(CNSRC.patch)}), không phải tỉ lệ thắng và không vào điểm tier.</li>
<li>Bản vá của Garena không tự đổi tier. Ghi chú bản vá hiện cạnh tướng; tier đổi khi có số liệu giải mới hoặc khi người biên tập chỉnh tay. Xem <a href="${purl(curP)}">thay đổi của bản ${PATCH}</a>.</li></ul>
<h2>Giới hạn</h2><ul class="items">
<li>ĐTDV là giải chuyên nghiệp với ${ctx.SRC.aogGames} trận mùa này; tướng ít xuất hiện có rất ít dữ liệu và rank thường có thể khác.</li>
<li>Số liệu giải không tách theo đường nên tier ở đường phụ chỉ là ước tính.</li>
<li>RoV Pro League là giải của server Thái Lan, tham khảo cho xu hướng chứ không thay số liệu server Việt Nam.</li></ul>
<p>Thấy tướng xếp sai hoặc số liệu lệch: <a href="/lien-he/">báo cho người duy trì</a>. Nguồn đầy đủ ở <a href="/gioi-thieu/">trang Giới thiệu</a>.</p>` }));
writePage('lien-he', pageShell({ title: 'Liên hệ Bảng Tier Liên Quân: góp ý, báo sai số liệu, hợp tác', desc: 'Cách liên hệ Bảng Tier Liên Quân để góp ý, báo sai số liệu, đề nghị hợp tác hoặc báo lỗi bảo mật.', path: '/lien-he/', h1: 'Liên hệ', over: 'Về web',
  body: `<p class="lead">Góp ý, báo tướng hoặc số liệu bị sai, đề nghị hợp tác: nhắn tin riêng cho kênh TikTok <a href="${TT}" rel="noopener">@bangtierlienquan</a>.</p>
<h2>Khi báo sai số liệu</h2><p>Ghi rõ tên tướng, đường, điều bạn thấy sai và nguồn (ví dụ bài cập nhật của Garena) để kiểm tra nhanh hơn.</p>
<h2>Báo lỗi bảo mật</h2><p>Xem tệp <a href="/.well-known/security.txt">security.txt</a> của web để biết cách báo riêng tư.</p>` }));
writePage('quyen-rieng-tu', pageShell({ title: 'Chính sách quyền riêng tư | Bảng Tier Liên Quân', desc: 'Bảng Tier Liên Quân không có tài khoản, không thu thập thông tin cá nhân; dùng Google Analytics để đếm lượt xem. Chi tiết dữ liệu và cách từ chối.', path: '/quyen-rieng-tu/', h1: 'Quyền riêng tư', over: `Cập nhật ${upd}`,
  body: `<p class="lead">Web không có tài khoản, không có biểu mẫu và không yêu cầu bạn cung cấp họ tên, email hay số điện thoại.</p>
<h2>Thống kê lượt xem</h2><p>Web dùng Google Analytics để biết có bao nhiêu người xem, xem trang nào, bằng thiết bị và ở quốc gia nào. Google Analytics dùng cookie hoặc mã định danh trình duyệt cho việc này. Tính năng tín hiệu Google và cá nhân hoá quảng cáo đã tắt. Bạn có thể từ chối bằng cách chặn cookie bên thứ ba hoặc cài <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener">tiện ích từ chối Google Analytics</a> của Google.</p>
<h2>Dữ liệu lưu trên thiết bị của bạn</h2><p>Bảng Tự xếp, chế độ xem, giao diện sáng/tối, các tướng xem gần đây và lựa chọn về gợi ý cài ứng dụng được lưu trong bộ nhớ trình duyệt của bạn (localStorage). Dữ liệu này không gửi đi đâu. Một bộ nhớ đệm (service worker) cũng lưu ảnh và tệp của web để mở nhanh và dùng được khi mất mạng. Xoá dữ liệu trang web trong trình duyệt là xoá hết.</p>
<h2>Dịch vụ bên ngoài</h2><ul><li>Phông chữ tải từ Google Fonts.</li><li>Hình biểu tượng chiêu thức tải từ máy chủ của Garena (lienquan.garena.vn), không gửi kèm địa chỉ trang bạn đang xem.</li><li>Web được lưu trữ trên GitHub Pages; GitHub có thể ghi nhật ký truy cập theo chính sách của họ.</li><li>Các liên kết ra ngoài (TikTok, Garena, trang nguồn) thuộc chính sách riêng của từng nơi.</li></ul>
<h2>${affItems.length ? 'Quảng cáo và liên kết tiếp thị' : 'Quảng cáo'}</h2><p>${affItems.length ? 'Web không chạy quảng cáo hiển thị. Trang <a href="/phu-kien/">Phụ kiện</a> có liên kết tiếp thị (affiliate) tới ' + affShops + ': nếu bạn mua qua liên kết đó, người duy trì web có thể nhận hoa hồng, giá bạn trả không đổi. Các liên kết này được ghi rõ trên trang và không xuất hiện ở bảng tier.' : 'Hiện web không chạy quảng cáo. Nếu có thay đổi, trang này sẽ được cập nhật.'}</p>
<h2>Liên hệ</h2><p>Câu hỏi về trang này: xem <a href="/lien-he/">Liên hệ</a>.</p>` }));

// mục lục liên kết tới mọi trang (để Google và người đọc tìm thấy mọi trang tướng bằng liên kết thường)
const dirHTML = `<!--HEROLINKS-->
  <section class="faq dir" aria-label="Mục lục các trang">
    <details><summary>Mục lục: ${HEROES.length} trang tướng, bản cập nhật, giới thiệu</summary>
${Object.keys(LANES).map(l => `      <h3>${esc(LANES[l])}</h3><p class="faq-l">${[...HEROES.filter(h => h.lane === l)].sort((a, b) => TO.indexOf(a.tier) - TO.indexOf(b.tier) || a.rank - b.rank).map(h => `<a href="${url(h)}">${esc(h.name)}${h.sec ? ' (phụ)' : ''}</a>`).join(' · ')}</p>`).join('\n')}
      <h3>Tier list theo đường</h3><p class="faq-l">${Object.keys(LANES).map(l => `<a href="${lurl(l)}">Tier list ${esc(LANES[l])}</a>`).join(' · ')}</p>
      <h3>Bản cập nhật</h3><p class="faq-l">${patches.map(p => `<a href="${purl(p)}">Bản ${p.date}/${p.year}</a>`).join(' · ')} · <a href="/ban-cap-nhat/">Tất cả</a></p>
      <h3>Bài viết</h3><p class="faq-l">${articles.map(a => `<a href="${aurl(a)}">${esc(a.h1)}</a>`).join(' · ')} · <a href="/bai-viet/">Tất cả</a></p>
      <h3>Tra cứu</h3><p class="faq-l">${CONCEPTS.map(([u, n]) => `<a href="${u}">${n}</a>`).join(' · ')}</p>
      <h3>Về web</h3><p class="faq-l"><a href="/gioi-thieu/">Giới thiệu</a> · <a href="/phuong-phap/">Phương pháp</a>${affItems.length ? ' · <a href="/phu-kien/">Phụ kiện</a>' : ''} · <a href="/lien-he/">Liên hệ</a> · <a href="/quyen-rieng-tu/">Quyền riêng tư</a></p>
    </details>
  </section>
  <!--/HEROLINKS-->`;
let idx2 = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
if (!/<!--HEROLINKS-->[\s\S]*<!--\/HEROLINKS-->/.test(idx2)) throw Error('index.html thiếu chỗ đánh dấu <!--HEROLINKS-->');
fs.writeFileSync(path.join(ROOT, 'index.html'), idx2.replace(/<!--HEROLINKS-->[\s\S]*<!--\/HEROLINKS-->/, dirHTML));

// ---------- 5. sitemap ----------
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE}/</loc><lastmod>${iso}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
${[...Object.keys(LANES).map(l => [lurl(l), iso, 'weekly', '0.8']), ...patches.map(p => [purl(p), pIso(p), 'monthly', '0.7']),['/ban-cap-nhat/', iso, 'weekly', '0.7'], ...articles.map(a => [aurl(a), a.date, 'monthly', '0.7']), ['/bai-viet/', articles[0] ? articles[0].date : iso, 'weekly', '0.6'], ['/gioi-thieu/', iso, 'monthly', '0.4'], ['/phuong-phap/', iso, 'monthly', '0.5'], ...CONCEPTS.map(([u]) => [u, iso, 'weekly', '0.6']), ...(affItems.length ? [['/phu-kien/', iso, 'monthly', '0.3']] : []), ['/lien-he/', iso, 'yearly', '0.3'], ['/quyen-rieng-tu/', iso, 'yearly', '0.3']].map(([u, m, c, pr]) => `  <url><loc>${SITE}${u}</loc><lastmod>${m}</lastmod><changefreq>${c}</changefreq><priority>${pr}</priority></url>`).join('\n')}
${HEROES.map(h => `  <url><loc>${SITE}${url(h)}</loc><lastmod>${iso}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`).join('\n')}
</urlset>
`);
console.log(`FAQ ${faq.length} câu · ${HEROES.length} trang tướng · ${patches.length} trang bản cập nhật · ${Object.keys(LANES).length} trang đường · ${articles.length} bài viết · ${4 + CONCEPTS.length + (affItems.length ? 1 : 0)} trang phụ (gồm ${CONCEPTS.length} trang tra cứu) · sitemap ${HEROES.length + 1 + patches.length + Object.keys(LANES).length + articles.length + 6 + CONCEPTS.length + (affItems.length ? 1 : 0)} link (cập nhật ${upd})`);
