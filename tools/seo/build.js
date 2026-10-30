// Tạo phần cho Google / trợ lý AI đọc được mà không cần chạy JavaScript:
//  1. Mục "Hỏi nhanh" (FAQ) trong index.html, giữa <!--FAQ--> … <!--/FAQ--> và JSON-LD FAQPage giữa <!--FAQLD--> … <!--/FAQLD-->
//  2. Trang riêng từng ô tướng: tuong/<key>-<đường>/index.html (tier, điểm, build, phù hiệu, bộ chiêu, link mở bảng chi tiết)
//  3. Trang bản cập nhật: ban-cap-nhat/<dd-mm-yyyy>/ (từ P trong data.js + lịch sử tools/seo/patches.json) và ban-cap-nhat/ (danh sách)
//  4. Trang Giới thiệu / Liên hệ / Quyền riêng tư (gioi-thieu/, lien-he/, quyen-rieng-tu/) và mục lục liên kết trong index.html (<!--HEROLINKS-->)
//  5. sitemap.xml (trang chủ + mọi trang)
// Chạy lại mỗi khi đổi assets/data.js, assets/builds.js hoặc assets/skills.js:   node tools/seo/build.js
// Không sửa tay các tệp trong tuong/ — chạy lại script này.
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..', '..'), SITE = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools', 'site.json'), 'utf8')).origin;   // đổi tên miền: node tools/domain/doi-ten-mien.js
const ctx = {}; vm.createContext(ctx);
for (const f of ['assets/data.js', 'assets/builds.js', 'assets/skills.js'])
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/^const /gm, 'var '), ctx);
const { HEROES, LANES, CLASSES, TIERS, TNAME, PATCH, PREV_DATE, P, BUILDS, BITEM, BSPELL, BENCH, BARC, SKILLS } = ctx;
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
const NAVF = `<a href="/gioi-thieu/">Giới thiệu</a> · <a href="/ban-cap-nhat/">Bản cập nhật</a> · <a href="/lien-he/">Liên hệ</a> · <a href="/quyen-rieng-tu/">Quyền riêng tư</a>`;
const pageShell = ({ title, desc, path: pth, h1, over, body }) => `<!doctype html>
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
<meta property="og:type" content="website"><meta property="og:site_name" content="Bảng Tier Liên Quân">
<meta property="og:title" content="${esc(h1)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${pth}"><meta property="og:image" content="${SITE}/og.jpg"><meta property="og:locale" content="vi_VN">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
  { '@type': 'ListItem', position: 1, name: 'Bảng Tier Liên Quân', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: h1, item: SITE + pth }] })}</script>
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
  // Mô tả cho Google: tối đa ~160 ký tự (dài hơn bị cắt trên trang kết quả) → bớt dần số món đồ trong build
  const mkDesc = n => `${h.name} đi ${L}${h.sec ? ' (đường phụ)' : ''}: tier ${h.tier} (${TNAME[h.tier]}), hạng ${h.rank}/${h.laneN} đường ${L}.` +
    (items.length && n ? ` Build: ${items.slice(0, n).join(', ')}…` : '') + (spells.length ? ` Phép: ${spells.join(', ')}.` : '') + ` Cập nhật ${upd}.`;
  let desc = mkDesc(4);
  for (let n = 3; desc.length > 160 && n >= 0; n--) desc = mkDesc(n);
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
<p class="lead">${esc(h.name)} đi ${esc(L)} đang ở <b>tier ${h.tier} (${TNAME[h.tier]})</b>, hạng ${h.rank}/${h.laneN} trong đường ${esc(L)}, điểm tổng hợp ${h.score.toFixed(2)}/5.${h.move ? ` ${h.move === 'up' ? 'Lên' : 'Xuống'} bậc từ tier ${h.prev} (so với ngày ${PREV_DATE}).` : ''} Cập nhật ${upd}, bản ${PATCH}.</p>
<a class="go" href="/#tuong-${h.id}">Xem chi tiết trên Bảng Tier →</a>
${h.note ? `<h2>Bản ${PATCH}</h2><p>${esc(h.note)}</p><p><a href="${purl(curP)}">Xem mọi thay đổi của bản ${PATCH} →</a></p>` : ''}
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
  const lanes = Object.keys(LANES).map(l => { const s = byLane(l).filter(h => h.tier === 'S'); return s.length ? `<li><b>${esc(LANES[l])}:</b> ${s.map(h => `<a href="${url(h)}">${esc(h.name)}</a>`).join(', ')}</li>` : ''; }).join('');
  const others = patches.filter(x => x !== p);
  const body = `<p class="lead">${esc(p.title)} ngày ${p.date}/${p.year} thay đổi ${ch.length} tướng (${sum}). Mỗi tướng bên dưới có tóm tắt thay đổi và tier hiện tại trên Bảng Tier Liên Quân (dữ liệu ${upd}).</p>
${sec('up', 'Được tăng sức mạnh')}${sec('down', 'Bị giảm sức mạnh')}${sec('mix', 'Được điều chỉnh')}${sec('new', 'Tướng mới hoặc làm lại')}
<p class="src">Nguồn: <a href="${esc(p.url)}" rel="noopener">Garena – ${esc(p.title)} ${p.date}/${p.year}</a>. Số liệu trước/sau lấy từ bài này, lời mô tả là tóm tắt lại. Tier chỉ phản ánh số liệu giải đấu và rank, không tự đổi ngay theo bản vá.</p>
<h2>Tier S hiện tại theo từng đường</h2><ul class="chg plain">${lanes}</ul>
${others.length ? `<h2>Các bản khác</h2><ul class="links">${others.map(x => `<li><a href="${purl(x)}">Bản ${x.date}/${x.year}</a></li>`).join('')}<li><a href="/ban-cap-nhat/">Tất cả bản cập nhật</a></li></ul>` : ''}`;
  writePage(purl(p).slice(1), pageShell({ title: `Bản ${p.date}/${p.year} Liên Quân: tướng tăng giảm, tier mới | Bảng Tier Liên Quân`, desc, path: purl(p), h1: `Liên Quân bản ${p.date}/${p.year}`, over: `Bản cập nhật · ${p.title} · ${season}`, body }));
}
writePage('ban-cap-nhat', pageShell({ title: 'Các bản cập nhật cân bằng tướng Liên Quân | Bảng Tier Liên Quân', desc: `Danh sách các bản điều chỉnh sức mạnh tướng Liên Quân ${season}: tướng nào tăng, giảm, đổi, kèm tier hiện tại.`, path: '/ban-cap-nhat/', h1: 'Các bản cập nhật', over: `Cân bằng tướng · ${season}`,
  body: `<p class="lead">Mỗi bản điều chỉnh sức mạnh của Garena một trang: tướng nào được tăng, bị giảm, được đổi và đang ở tier nào.</p><ul class="chg plain">${patches.map(p => `<li><a href="${purl(p)}"><b>Bản ${p.date}/${p.year}</b></a> · ${p.changes.length} tướng thay đổi<p>${esc(p.title)}</p></li>`).join('')}</ul>` }));

// ---------- 4. Giới thiệu / Liên hệ / Quyền riêng tư + mục lục liên kết ----------
const TT = 'https://www.tiktok.com/@bangtierlienquan';
writePage('gioi-thieu', pageShell({ title: 'Giới thiệu Bảng Tier Liên Quân: tier list tướng theo từng đường', desc: 'Bảng Tier Liên Quân xếp hạng tướng Liên Quân Mobile theo từng đường từ số liệu giải đấu và rank, cập nhật sau mỗi bản cân bằng.', path: '/gioi-thieu/', h1: 'Giới thiệu', over: 'Về web',
  body: `<p class="lead">Bảng Tier Liên Quân xếp hạng tướng Liên Quân Mobile theo từng đường (Tà Thần, Rừng, Giữa, Rồng, Trợ thủ). Web do một người chơi duy trì, không thuộc Garena hay TiMi Studio.</p>
<h2>Mỗi tướng có gì</h2><p>Tier từ S đến D, điểm tổng hợp trên thang 5, build tham khảo theo từng đường, bảng ngọc, phù hiệu, bộ chiêu thức tóm tắt và ghi chú khi tướng thay đổi ở bản cập nhật. Có chế độ Số liệu để so tỉ lệ thắng, chọn, cấm ở ĐTDV, và chế độ Tự xếp để làm tier list của riêng bạn.</p>
<h2>Tier được xếp thế nào</h2><p>Điểm gộp từ số liệu ĐTDV mùa Đông 2026 (46%), mùa trước (17%), RoV Pro League (14%) và tier list rank cộng đồng do người biên tập tổng hợp (23%). Tier xếp theo thứ hạng trong từng đường. Một số tướng được người biên tập chỉnh tay, danh sách công khai trong mục "Cách xếp và nguồn" ở <a href="/#method">trang chủ</a>.</p>
<h2>Cập nhật</h2><p>Bảng được cập nhật sau mỗi bản cân bằng của Garena và khoảng 2 tuần một lần theo số liệu giải. Ngày cập nhật ghi ở cuối mỗi trang; lịch sử các bản ở mục <a href="/ban-cap-nhat/">Bản cập nhật</a>.</p>
<h2>Nguồn dữ liệu</h2><ul class="links"><li><a href="https://liquipedia.net/honorofkings/Arena_of_Glory" rel="noopener">Liquipedia (ĐTDV)</a></li><li><a href="https://rovmeta.com/stats" rel="noopener">ROV META (RoV Pro League)</a></li><li><a href="https://lienquan.garena.vn/category/cap-nhat/" rel="noopener">Garena Liên Quân</a></li><li><a href="https://aov-builds.com/" rel="noopener">AOV-Builds</a></li><li><a href="https://github.com/AoV-IndeX/avix-data" rel="noopener">AoV-IndeX</a></li></ul>
<h2>Lưu ý</h2><p>Thông tin để tham khảo. Meta đổi theo bản vá, trình độ và cách chơi, nên tier không thay cho cảm nhận của bạn khi chơi. Tên và hình ảnh tướng thuộc bản quyền Garena / TiMi Studio.</p>
<p>Kênh TikTok: <a href="${TT}" rel="noopener">@bangtierlienquan</a> · Góp ý, báo sai số liệu: <a href="/lien-he/">Liên hệ</a>.</p>` }));
writePage('lien-he', pageShell({ title: 'Liên hệ Bảng Tier Liên Quân: góp ý, báo sai số liệu, hợp tác', desc: 'Cách liên hệ Bảng Tier Liên Quân để góp ý, báo sai số liệu, đề nghị hợp tác hoặc báo lỗi bảo mật.', path: '/lien-he/', h1: 'Liên hệ', over: 'Về web',
  body: `<p class="lead">Góp ý, báo tướng hoặc số liệu bị sai, đề nghị hợp tác: nhắn tin riêng cho kênh TikTok <a href="${TT}" rel="noopener">@bangtierlienquan</a>.</p>
<h2>Khi báo sai số liệu</h2><p>Ghi rõ tên tướng, đường, điều bạn thấy sai và nguồn (ví dụ bài cập nhật của Garena) để kiểm tra nhanh hơn.</p>
<h2>Báo lỗi bảo mật</h2><p>Xem tệp <a href="/.well-known/security.txt">security.txt</a> của web để biết cách báo riêng tư.</p>` }));
writePage('quyen-rieng-tu', pageShell({ title: 'Chính sách quyền riêng tư | Bảng Tier Liên Quân', desc: 'Bảng Tier Liên Quân không có tài khoản, không thu thập thông tin cá nhân; dùng Google Analytics để đếm lượt xem. Chi tiết dữ liệu và cách từ chối.', path: '/quyen-rieng-tu/', h1: 'Quyền riêng tư', over: `Cập nhật ${upd}`,
  body: `<p class="lead">Web không có tài khoản, không có biểu mẫu và không yêu cầu bạn cung cấp họ tên, email hay số điện thoại.</p>
<h2>Thống kê lượt xem</h2><p>Web dùng Google Analytics để biết có bao nhiêu người xem, xem trang nào, bằng thiết bị và ở quốc gia nào. Google Analytics dùng cookie hoặc mã định danh trình duyệt cho việc này. Tính năng tín hiệu Google và cá nhân hoá quảng cáo đã tắt. Bạn có thể từ chối bằng cách chặn cookie bên thứ ba hoặc cài <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener">tiện ích từ chối Google Analytics</a> của Google.</p>
<h2>Dữ liệu lưu trên thiết bị của bạn</h2><p>Bảng Tự xếp, chế độ xem, giao diện sáng/tối, các tướng xem gần đây và lựa chọn về gợi ý cài ứng dụng được lưu trong bộ nhớ trình duyệt của bạn (localStorage). Dữ liệu này không gửi đi đâu. Một bộ nhớ đệm (service worker) cũng lưu ảnh và tệp của web để mở nhanh và dùng được khi mất mạng. Xoá dữ liệu trang web trong trình duyệt là xoá hết.</p>
<h2>Dịch vụ bên ngoài</h2><ul><li>Phông chữ tải từ Google Fonts.</li><li>Hình biểu tượng chiêu thức tải từ máy chủ của Garena (lienquan.garena.vn), không gửi kèm địa chỉ trang bạn đang xem.</li><li>Web được lưu trữ trên GitHub Pages; GitHub có thể ghi nhật ký truy cập theo chính sách của họ.</li><li>Các liên kết ra ngoài (TikTok, Garena, trang nguồn) thuộc chính sách riêng của từng nơi.</li></ul>
<h2>Quảng cáo</h2><p>Hiện web không chạy quảng cáo. Nếu có thay đổi, trang này sẽ được cập nhật.</p>
<h2>Liên hệ</h2><p>Câu hỏi về trang này: xem <a href="/lien-he/">Liên hệ</a>.</p>` }));

// mục lục liên kết tới mọi trang (để Google và người đọc tìm thấy mọi trang tướng bằng liên kết thường)
const dirHTML = `<!--HEROLINKS-->
  <section class="faq dir" aria-label="Mục lục các trang">
    <details><summary>Mục lục: ${HEROES.length} trang tướng, bản cập nhật, giới thiệu</summary>
${Object.keys(LANES).map(l => `      <h3>${esc(LANES[l])}</h3><p class="faq-l">${[...HEROES.filter(h => h.lane === l)].sort((a, b) => TO.indexOf(a.tier) - TO.indexOf(b.tier) || a.rank - b.rank).map(h => `<a href="${url(h)}">${esc(h.name)}${h.sec ? ' (phụ)' : ''}</a>`).join(' · ')}</p>`).join('\n')}
      <h3>Bản cập nhật</h3><p class="faq-l">${patches.map(p => `<a href="${purl(p)}">Bản ${p.date}/${p.year}</a>`).join(' · ')} · <a href="/ban-cap-nhat/">Tất cả</a></p>
      <h3>Về web</h3><p class="faq-l"><a href="/gioi-thieu/">Giới thiệu</a> · <a href="/lien-he/">Liên hệ</a> · <a href="/quyen-rieng-tu/">Quyền riêng tư</a></p>
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
${[...patches.map(p => [purl(p), pIso(p), 'monthly', '0.7']), ['/ban-cap-nhat/', iso, 'weekly', '0.7'], ['/gioi-thieu/', iso, 'monthly', '0.4'], ['/lien-he/', iso, 'yearly', '0.3'], ['/quyen-rieng-tu/', iso, 'yearly', '0.3']].map(([u, m, c, pr]) => `  <url><loc>${SITE}${u}</loc><lastmod>${m}</lastmod><changefreq>${c}</changefreq><priority>${pr}</priority></url>`).join('\n')}
${HEROES.map(h => `  <url><loc>${SITE}${url(h)}</loc><lastmod>${iso}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`).join('\n')}
</urlset>
`);
console.log(`FAQ ${faq.length} câu · ${HEROES.length} trang tướng · ${patches.length} trang bản cập nhật · 3 trang phụ · sitemap ${HEROES.length + 1 + patches.length + 4} link (cập nhật ${upd})`);
