// Tạo phần cho Google / trợ lý AI đọc được mà không cần chạy JavaScript:
//  1. Mục "Hỏi nhanh" (FAQ) trong index.html, giữa <!--FAQ--> … <!--/FAQ--> và JSON-LD FAQPage giữa <!--FAQLD--> … <!--/FAQLD-->
//  2. Trang riêng từng ô tướng: tuong/<key>-<đường>/index.html (tier, điểm, build, phù hiệu, bộ chiêu, link mở bảng chi tiết)
//  3. sitemap.xml (trang chủ + mọi trang tướng)
// Chạy lại mỗi khi đổi assets/data.js, assets/builds.js hoặc assets/skills.js:   node tools/seo/build.js
// Không sửa tay các tệp trong tuong/ — chạy lại script này.
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..', '..'), SITE = 'https://tierlq.github.io';
const ctx = {}; vm.createContext(ctx);
for (const f of ['assets/data.js', 'assets/builds.js', 'assets/skills.js'])
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/^const /gm, 'var '), ctx);
const { HEROES, LANES, CLASSES, TIERS, TNAME, PATCH, BUILDS, BITEM, BSPELL, BENCH, BARC, SKILLS } = ctx;
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
      list.slice(0, 8).map(h => `<a href="${url(h)}">${esc(h.name)}</a>`).join(', ')];
  }),
  ['Bảng tier được xếp dựa trên gì?',
   'Điểm tổng hợp từ số liệu ĐTDV mùa Đông 2026 (46%), mùa trước (17%), RoV Pro League (14%) và tier list rank cộng đồng (23%). Tier xếp theo thứ hạng trong từng đường.', ''],
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
  const desc = `${h.name} đi ${L}${h.sec ? ' (đường phụ)' : ''}: tier ${h.tier} (${TNAME[h.tier]}), hạng ${h.rank}/${h.laneN} đường ${L}.` +
    (items.length ? ` Build: ${items.slice(0, 4).join(', ')}…` : '') + (spells.length ? ` Phép: ${spells.join(', ')}.` : '') + ` Cập nhật ${upd}.`;
  const img = has('s', h) ? `${SITE}/s/${skey(h)}.webp` : `${SITE}/og.jpg`;
  const ban = has('s2', h) ? `/s2/${skey(h)}.webp` : has('s', h) ? `/s/${skey(h)}.webp` : '';
  const ld = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Bảng Tier Liên Quân', item: SITE + '/' },
    { '@type': 'ListItem', position: 2, name: `${h.name} ${L}`, item: SITE + url(h) }] };
  const ench = b && b.e ? b.e.map(id => BENCH[id][0]) : [];
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
<p class="lead">${esc(h.name)} đi ${esc(L)} đang ở <b>tier ${h.tier} (${TNAME[h.tier]})</b>, hạng ${h.rank}/${h.laneN} trong đường ${esc(L)}, điểm tổng hợp ${h.score.toFixed(2)}/5. Cập nhật ${upd}, bản ${PATCH}.</p>
<a class="go" href="/#tuong-${h.id}">Xem chi tiết trên Bảng Tier →</a>
${h.note ? `<h2>Bản ${PATCH}</h2><p>${esc(h.note)}</p>` : ''}
${b ? `<h2>Build ${h.lane === 'sp' ? 'Trợ thủ' : 'đi ' + esc(L)}</h2>
<ol class="items">${items.map(n => `<li>${esc(n)}</li>`).join('')}</ol>
<p><b>Phép bổ trợ:</b> ${esc(spells.join(' hoặc '))}</p>
<p><b>Bảng ngọc:</b> ${b.r.map(([a, n]) => `ngọc ${COLVI[BARC[a][0]]} ×${n} (${esc(BARC[a][1])})`).join('; ')}</p>
${ench.length ? `<p><b>Phù hiệu:</b> ${esc(ench.join(', '))}</p>` : ''}
<p class="src">Nguồn build: <a href="${esc(b.l)}" rel="noopener">${esc(new URL(b.l).hostname)}</a> (server Việt).</p>` : ''}
${sk ? `<h2>Bộ chiêu thức</h2><dl class="sk">${sk[1].map(([n, , s], k) => `<dt>${['Nội tại', 'Chiêu 1', 'Chiêu 2', 'Chiêu cuối'][k] || 'Chiêu'}${n ? ' · ' + esc(n) : ''}</dt><dd>${esc(s || '')}</dd>`).join('')}</dl>
<p class="src">Tóm tắt từ <a href="https://lienquan.garena.vn/hoc-vien/tuong-skin/d/${esc(sk[0])}/" rel="noopener">Học viện Garena</a>.</p>` : ''}
${others.length ? `<h2>${esc(h.name)} ở đường khác</h2><ul class="links">${others.map(x => `<li><a href="${url(x)}">${esc(LANES[x.lane])}${x.sec ? ' (phụ)' : ''} · tier ${x.tier}</a></li>`).join('')}</ul>` : ''}
${peers.length ? `<h2>Cùng tier ${h.tier} ở ${esc(L)}</h2><ul class="links">${peers.map(x => `<li><a href="${url(x)}">${esc(x.name)}</a></li>`).join('')}</ul>` : ''}
<a class="go" href="/#tuong-${h.id}">Mở ${esc(h.name)} trên Bảng Tier →</a>
</main>
<footer><a href="/">Bảng Tier Liên Quân</a> · Dữ liệu cập nhật ${upd}. Hình tướng thuộc bản quyền Garena / TiMi Studio.</footer>
</body>
</html>
`;
  fs.mkdirSync(path.join(outDir, h.id), { recursive: true });
  fs.writeFileSync(path.join(outDir, h.id, 'index.html'), html);
}

// ---------- 3. sitemap ----------
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE}/</loc><lastmod>${iso}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
${HEROES.map(h => `  <url><loc>${SITE}${url(h)}</loc><lastmod>${iso}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`).join('\n')}
</urlset>
`);
console.log(`FAQ ${faq.length} câu · ${HEROES.length} trang tướng · sitemap ${HEROES.length + 1} link (cập nhật ${upd})`);
