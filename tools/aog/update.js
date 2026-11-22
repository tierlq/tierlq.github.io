// Tự cập nhật số liệu ĐTDV (SRC.aog) từ API Liquipedia — kể cả tự đổi mùa và tự đánh dấu hết mùa, không cần người nhớ.
// Chạy: node tools/aog/update.js [--file <html>] [--dry]   (GitHub Actions .github/workflows/aog.yml chạy mỗi sáng)
//
// Mỗi lần chạy gọi API MediaWiki của Liquipedia 3 lần, cách nhau vài giây (đúng điều khoản API: User-Agent có liên hệ,
// gzip, lệnh parse nặng tối đa 1 lần/30 giây, không đọc trang HTML thường):
//   1. list=allpages (nhẹ): tìm mùa ĐTDV mới nhất có trang "<năm>/<Spring|Summer|Winter>/Statistics".
//   2. action=parse (nặng): đọc bảng Hero Statistics của mùa đang dùng (hoặc mùa mới).
//   3. revisions (nhẹ): đọc ngày kết thúc (edate) trong hộp thông tin trang mùa → biết mùa đã xong chưa.
// Đổi mùa: mùa mới có ≥ minGamesNewSeason trận (config.json, mặc định 40) thì tự chuyển số mùa cũ sang SRC.prev, ghi mùa mới
//   vào SRC.aog, đổi "page" trong config.json, đổi chữ "mùa Đông 2026" → "mùa Xuân 2027", link Liquipedia và số trận mùa trước
//   ở index.html/app.js/build.js. Ít trận hơn (đầu mùa, số còn nhiễu) thì giữ mùa cũ.
// Kiểm chặt: thắng + thua = pick, % tính lại khớp tổng trận, cùng mùa thì số trận không giảm và tướng đã có không được mất.
//   Sai → thoát mã 1, không sửa tệp nào, GitHub báo đỏ. Tên tướng lạ (tướng chưa có trên web) → bỏ qua, chỉ cảnh báo.
// Không có gì mới → thoát 0, không sửa gì. Có thay đổi → ghi tệp + tools/aog/.msg (nội dung commit), workflow kiểm tra rồi đẩy.
const fs = require('fs'), path = require('path'), vm = require('vm');
const { parseStats } = require('./parse.js');
const ROOT = path.join(__dirname, '..', '..');
const CFG_PATH = path.join(__dirname, 'config.json');
const CFG = JSON.parse(fs.readFileSync(CFG_PATH, 'utf8'));
const MIN_NEW = CFG.minGamesNewSeason || 40;
const SEASON = { Spring: [1, 'Xuân'], Summer: [2, 'Hè'], Autumn: [3, 'Thu'], Fall: [3, 'Thu'], Winter: [4, 'Đông'] };
const args = process.argv.slice(2), DRY = args.includes('--dry'), FILE = args.includes('--file') ? args[args.indexOf('--file') + 1] : null;
const GH = !!process.env.GITHUB_ACTIONS;
// lỗi/cảnh báo in thêm dạng ::error:: / ::warning:: để hiện ở trang tóm tắt lượt chạy trên GitHub (xem được không cần mở nhật ký)
const fail = m => { console.error('LỖI: ' + m); if (GH) console.log('::error::' + String(m).split('\n')[0].slice(0, 300)); process.exit(1); };
const warn = m => { console.log('Cảnh báo: ' + m); if (GH) console.log('::warning::' + m.slice(0, 300)); };
const out = (k, v) => { if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `${k}=${v}\n`); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const load = js => { const c = {}; vm.createContext(c); vm.runInContext(js + ';this.SRC=SRC;this.HEROES=HEROES', c); return c; };
const slug = n => CFG.map[n] || n.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '');
const norm = t => t.replace(/ /g, '_');
const seasonOf = page => {
  const m = norm(page).match(/(\d{4})\/([A-Za-z]+)\/Statistics$/);
  return m && SEASON[m[2]] ? { y: +m[1], n: m[2], ord: +m[1] * 10 + SEASON[m[2]][0], vi: `mùa ${SEASON[m[2]][1]} ${m[1]}` } : null;
};

async function api(params) {
  const url = `https://liquipedia.net/${CFG.wiki}/api.php?format=json&formatversion=2&` + new URLSearchParams(params);
  const r = await fetch(url, { headers: { 'User-Agent': CFG.userAgent, 'Accept-Encoding': 'gzip' } });
  if (!r.ok) fail(`API Liquipedia trả về ${r.status} ${r.statusText} (${params.action}${params.list ? ' ' + params.list : ''})`);
  const j = await r.json();
  if (j.error) fail('API Liquipedia báo lỗi: ' + JSON.stringify(j.error));
  return j;
}
const statsHTML = async page => {
  const j = await api({ action: 'parse', prop: 'text', page });
  if (!j.parse || !j.parse.text) fail('API không trả về nội dung ' + page);
  return j.parse.text;
};

// bảng → { "key": [thắng%, pick%, cấm%, pick, cấm] }, kiểm từng dòng
function toAog(G, rows, keys) {
  const aog = {}, unknown = [];
  if (!G) fail('không đọc được tổng số trận ("N games")');
  for (const [name, p, w, l, wr, pt, b, bt] of rows) {
    if (CFG.skip.includes(name)) continue;
    const k = slug(name);
    if (!keys.has(k.split('-')[0]) && !keys.has(k)) { unknown.push(name); continue; }
    if (aog[k]) fail(`trùng tướng ${name}`);
    if (p !== w + l) fail(`${name}: thắng ${w} + thua ${l} ≠ pick ${p}`);
    if (Math.abs(p / G * 100 - pt) > 0.006 || Math.abs(b / G * 100 - bt) > 0.006) fail(`${name}: % pick/cấm không khớp ${G} trận`);
    if (p && Math.abs(w / p * 100 - wr) > 0.006) fail(`${name}: tỉ lệ thắng không khớp`);
    aog[k] = [+wr.toFixed(2), +(p / G * 100).toFixed(1), +(b / G * 100).toFixed(1), p, b];
  }
  if (unknown.length) warn(`bỏ qua tướng chưa có trên web (nếu là tên quốc tế của tướng đã có thì thêm vào "map" trong tools/aog/config.json): ${unknown.join(', ')}`);
  return aog;
}
const block = (name, obj) => `  ${name}: {\n` + Object.entries(obj).sort((x, y) => y[1][3] - x[1][3] || y[1][0] - x[1][0])
  .map(([k, v]) => `    "${k}": [${v.join(', ')}]`).join(',\n') + '\n  },\n';
const same = (a, b) => JSON.stringify(Object.entries(a).sort()) === JSON.stringify(Object.entries(b).sort());

(async () => {
  const now = new Date(Date.now() + 7 * 3600e3);   // giờ Việt Nam
  const dd = String(now.getUTCDate()).padStart(2, '0'), mm = String(now.getUTCMonth() + 1).padStart(2, '0'), yyyy = now.getUTCFullYear();
  const todayISO = now.toISOString().slice(0, 10);
  const dataPath = path.join(ROOT, 'assets/data.js');
  let data = fs.readFileSync(dataPath, 'utf8');
  const cur = load(data), keys = new Set(cur.HEROES.map(h => h.key));
  const oldS = seasonOf(CFG.page);
  if (!oldS) fail('"page" trong config.json không đúng dạng <năm>/<mùa>/Statistics: ' + CFG.page);
  let page = norm(CFG.page), G, rows, switched = null;

  if (FILE) ({ games: G, rows } = parseStats(fs.readFileSync(FILE, 'utf8')));
  else {
    // 1. mùa mới nhất có trang thống kê
    const j = await api({ action: 'query', list: 'allpages', apprefix: 'Arena_of_Glory/', aplimit: '500' });
    const newest = j.query.allpages.map(p => norm(p.title))
      .filter(t => /^Arena_of_Glory\/\d{4}\/[A-Za-z]+\/Statistics$/.test(t) && seasonOf(t))
      .sort((a, b) => seasonOf(b).ord - seasonOf(a).ord)[0];
    if (newest && seasonOf(newest).ord > oldS.ord) {
      await sleep(3000);
      const r = parseStats(await statsHTML(newest));
      if (r.games >= MIN_NEW && r.rows.length >= 10) { page = newest; G = r.games; rows = r.rows; switched = seasonOf(newest); }
      else { console.log(`Có trang ${newest} nhưng mới ${r.games} trận (< ${MIN_NEW}), chưa đổi mùa.`); await sleep(31000); }
    }
    // 2. bảng của mùa đang dùng
    if (!switched) { await sleep(3000); ({ games: G, rows } = parseStats(await statsHTML(page))); }
  }
  if (rows.length < 10) fail(`bảng chỉ có ${rows.length} dòng, nghi đọc sai`);
  const aog = toAog(G, rows, keys);
  console.log(`Liquipedia ${page}: ${G} trận, ${rows.length} dòng; web đang có ${cur.SRC.aogGames} trận (${oldS.vi}).`);
  if (!switched) {
    if (G < cur.SRC.aogGames) fail(`số trận giảm ${cur.SRC.aogGames} → ${G} trong cùng mùa, nghi đọc sai`);
    const lost = Object.keys(cur.SRC.aog).filter(k => !aog[k]);
    if (lost.length) fail(`tướng biến mất khỏi bảng: ${lost.join(', ')}`);
  }

  // 3. mùa đã xong chưa (ngày kết thúc edate trong hộp thông tin ở đầu trang mùa)
  let edate = null;
  if (!FILE) {
    await sleep(3000);
    const seasonPage = page.replace(/\/Statistics$/, '');
    const j = await api({ action: 'query', prop: 'revisions', rvprop: 'content', rvslots: 'main', titles: seasonPage });
    const w = (((j.query.pages[0] || {}).revisions || [])[0] || {}).slots;
    const m = w && w.main.content.match(/\|\s*edate\s*=\s*(\d{4}-\d{2}-\d{2})/);
    if (m) edate = m[1]; else warn('không đọc được ngày kết thúc mùa (edate) ở ' + seasonPage);
  }
  const done = edate ? todayISO > edate : (switched ? false : cur.SRC.aogDone);
  const numbersChanged = !!switched || G !== cur.SRC.aogGames || !same(aog, cur.SRC.aog);
  const doneChanged = done !== cur.SRC.aogDone;
  if (!numbersChanged && !doneChanged) { console.log('Không có gì mới.'); out('changed', 'false'); return; }

  // ghi data.js
  const cut = (startTag, endTag, body) => {
    const a = data.indexOf(startTag), z = data.indexOf(endTag);
    if (a < 0 || z < a) fail('data.js thiếu ' + startTag);
    data = data.slice(0, a) + body + data.slice(z);
  };
  const sub = (re, s) => { if (!re.test(data)) fail('data.js thiếu dòng ' + re); data = data.replace(re, s); };
  const reSeason = s => switched ? s.replace(/mùa (Xuân|Hè|Thu|Đông)( \d{4})?/g, (m0, n, y) => `mùa ${SEASON[switched.n][1]}${y ? ' ' + switched.y : ''}`) : s;
  data = reSeason(data);
  const aogTo = done && edate ? `${edate.slice(8, 10)}/${edate.slice(5, 7)}` : (numbersChanged ? `${dd}/${mm}` : cur.SRC.aogTo);
  cut('  aog: {', '  aogGames:', block('aog', aog));
  sub(/  aogGames: \d+, \/\/[^\n]*/, `  aogGames: ${G}, // tổng số trận ĐTDV mùa hiện tại (tools/aog/update.js đọc API Liquipedia ${dd}/${mm}/${yyyy})`);
  sub(/  aogDone: (true|false), \/\//, `  aogDone: ${done}, //`);
  sub(/  aogTo: "[^"]*", \/\//, `  aogTo: "${aogTo}", //`);
  if (switched) {
    cut('  prev: {', '  prevGames:', block('prev', cur.SRC.aog));
    sub(/  prevGames: \d+, \/\/[^\n]*/, `  prevGames: ${cur.SRC.aogGames}, // tổng số trận mùa trước (${oldS.vi}, tự chuyển ${dd}/${mm}/${yyyy})`);
  }

  // chữ trên web khi đổi mùa: tên mùa, link Liquipedia, số trận mùa trước; luôn đổi ngày cập nhật và ?v=
  const files = {};
  const edit = (f, fn) => { const p = path.join(ROOT, f); files[p] = fn(files[p] !== undefined ? files[p] : fs.readFileSync(p, 'utf8')); };
  if (switched) {
    for (const f of ['index.html', 'assets/app.js', 'tools/seo/build.js']) edit(f, reSeason);
    edit('index.html', s => s.split(norm(CFG.page)).join(page)
      .replace(/(Mùa trước \(13%\):<\/b> bảng thống kê )\d+( trận)/, `$1${cur.SRC.aogGames}$2`));
  }
  edit('index.html', s => {
    if (!/Dữ liệu cập nhật \d{1,2}\/\d{1,2}\/\d{4}/.test(s)) fail('index.html thiếu "Dữ liệu cập nhật"');
    s = s.replace(/Dữ liệu cập nhật \d{1,2}\/\d{1,2}\/\d{4}/, `Dữ liệu cập nhật ${dd}/${mm}/${yyyy}`);
    const oldV = Math.max(...(s.match(/\?v=(\d+)/g) || ['?v=0']).map(x => +x.slice(3)));
    let v = +now.toISOString().slice(0, 16).replace(/\D/g, ''); if (v <= oldV) v = oldV + 1;
    return s.replace(/\?v=\d+/g, '?v=' + v);
  });

  const after = load(data);
  const before = Object.fromEntries(cur.HEROES.map(h => [h.id, h.tier]));
  const moved = after.HEROES.filter(h => before[h.id] && before[h.id] !== h.tier).map(h => `${h.id} ${before[h.id]}→${h.tier}`);
  const added = Object.keys(aog).filter(k => !cur.SRC.aog[k]);
  const head = switched ? `Tự đổi mùa ĐTDV: ${oldS.vi} → ${switched.vi} (${G} trận)`
    : numbersChanged ? `Tự cập nhật số liệu ĐTDV từ Liquipedia: ${cur.SRC.aogGames} → ${G} trận`
    : `Tự đánh dấu ĐTDV ${oldS.vi} đã kết thúc (chung kết ${aogTo})`;
  const msg = `${head}\n\nNguồn: API Liquipedia (${page}), đọc ${dd}/${mm}/${yyyy} bằng GitHub Actions (tools/aog/update.js).\n`
    + (switched ? `Số ${oldS.vi} (${cur.SRC.aogGames} trận) chuyển sang "mùa trước"; chữ tên mùa, link nguồn đổi theo.\n` : '')
    + (done && edate ? `Mùa đã kết thúc ngày ${edate}.\n` : '')
    + (!switched && added.length ? `Tướng mới có pick: ${added.join(', ')}.\n` : '')
    + (moved.length ? `Ô đổi tier: ${moved.join(', ')}.\n` : 'Không ô nào đổi tier.\n');
  console.log(msg);
  if (DRY) { console.log('(--dry: không ghi tệp)'); out('changed', 'false'); return; }
  fs.writeFileSync(dataPath, data);
  for (const [p, s] of Object.entries(files)) fs.writeFileSync(p, s);
  if (switched) fs.writeFileSync(CFG_PATH, JSON.stringify({ ...CFG, page }, null, 2) + '\n');
  fs.writeFileSync(path.join(__dirname, '.msg'), msg);
  out('changed', 'true');
})().catch(e => fail(e.stack || e));
