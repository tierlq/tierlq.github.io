// Tự cập nhật số liệu ĐTDV (SRC.aog) từ API Liquipedia. Chạy: node tools/aog/update.js [--file <html>] [--dry]
// GitHub Actions (.github/workflows/aog.yml) chạy mỗi sáng. Luồng:
//   1. gọi API MediaWiki của Liquipedia MỘT lần (action=parse trang thống kê ghi trong config.json)
//      — đúng điều khoản API: User-Agent có tên ứng dụng + cách liên hệ, gzip, không đọc trang HTML thường.
//   2. đọc bảng Hero Statistics (parse.js), kiểm chặt: thắng + thua = pick, % tính lại khớp, tên tướng phải biết,
//      số trận không được giảm, tướng đã có không được biến mất. Sai bất kỳ điều gì → thoát mã 1, KHÔNG sửa tệp.
//   3. số y hệt số đang có → in "không có gì mới", thoát 0, không sửa gì.
//   4. có số mới → ghi khối aog, aogGames, aogTo (ngày hôm nay giờ VN), aogDone=false trong assets/data.js,
//      ngày "Dữ liệu cập nhật" và ?v= trong index.html; ghi nội dung commit (kèm ô đổi tier) ra tools/aog/.msg
// Sau đó workflow chạy build.js và các bước kiểm tra rồi mới đẩy lên main.
// Đổi mùa (trang thống kê mới): người sửa tay — chuyển aog sang prev, đổi "page" trong config.json.
const fs = require('fs'), path = require('path'), vm = require('vm');
const { parseStats } = require('./parse.js');
const ROOT = path.join(__dirname, '..', '..');
const CFG = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
const args = process.argv.slice(2), DRY = args.includes('--dry'), FILE = args.includes('--file') ? args[args.indexOf('--file') + 1] : null;
const fail = m => { console.error('LỖI: ' + m); process.exit(1); };
const out = (k, v) => { if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `${k}=${v}\n`); };

function load(js) {   // chạy data.js trong hộp kín, lấy SRC và HEROES (tier, điểm)
  const c = {}; vm.createContext(c); vm.runInContext(js + ';this.SRC=SRC;this.HEROES=HEROES', c); return c;
}
const slug = n => CFG.map[n] || n.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '');

(async () => {
  let html;
  if (FILE) html = fs.readFileSync(FILE, 'utf8');
  else {
    const url = `https://liquipedia.net/${CFG.wiki}/api.php?action=parse&format=json&formatversion=2&prop=text&page=${encodeURIComponent(CFG.page)}`;
    const r = await fetch(url, { headers: { 'User-Agent': CFG.userAgent, 'Accept-Encoding': 'gzip' } });
    if (!r.ok) fail(`API Liquipedia trả về ${r.status} ${r.statusText}`);
    const j = await r.json();
    if (j.error) fail('API Liquipedia báo lỗi: ' + JSON.stringify(j.error));
    html = j.parse && j.parse.text;
    if (!html) fail('API không trả về nội dung trang');
  }
  const { games: G, rows } = parseStats(html);
  if (!G) fail('không đọc được tổng số trận ("N games")');
  if (rows.length < 20) fail(`bảng chỉ có ${rows.length} dòng, nghi đọc sai`);

  const dataPath = path.join(ROOT, 'assets/data.js');
  let data = fs.readFileSync(dataPath, 'utf8');
  const cur = load(data), keys = new Set(cur.HEROES.map(h => h.key));
  const aog = {}, bad = [];
  for (const [name, p, w, l, wr, pt, b, bt] of rows) {
    if (CFG.skip.includes(name)) continue;
    const k = slug(name);
    if (!keys.has(k.split('-')[0]) && !keys.has(k)) { bad.push(name); continue; }
    if (aog[k]) fail(`trùng tướng ${name}`);
    if (p !== w + l) fail(`${name}: thắng ${w} + thua ${l} ≠ pick ${p}`);
    if (Math.abs(p / G * 100 - pt) > 0.006 || Math.abs(b / G * 100 - bt) > 0.006) fail(`${name}: % pick/cấm không khớp ${G} trận`);
    if (p && Math.abs(w / p * 100 - wr) > 0.006) fail(`${name}: tỉ lệ thắng không khớp`);
    aog[k] = [+wr.toFixed(2), +(p / G * 100).toFixed(1), +(b / G * 100).toFixed(1), p, b];
  }
  if (bad.length) fail(`tên tướng lạ (thêm vào "map" hoặc "skip" trong tools/aog/config.json): ${bad.join(', ')}`);
  if (G < cur.SRC.aogGames) fail(`số trận giảm ${cur.SRC.aogGames} → ${G} (đổi mùa? cần người cập nhật theo CLAUDE.md)`);
  const lost = Object.keys(cur.SRC.aog).filter(k => !aog[k]);
  if (lost.length) fail(`tướng biến mất khỏi bảng: ${lost.join(', ')}`);

  const same = G === cur.SRC.aogGames && Object.keys(aog).length === Object.keys(cur.SRC.aog).length
    && Object.entries(aog).every(([k, v]) => JSON.stringify(v) === JSON.stringify(cur.SRC.aog[k]));
  console.log(`Liquipedia: ${G} trận, ${rows.length} dòng; web đang có ${cur.SRC.aogGames} trận.`);
  if (same) { console.log('Không có gì mới.'); out('changed', 'false'); return; }

  // ghi số mới
  const now = new Date(Date.now() + 7 * 3600e3), dd = String(now.getUTCDate()).padStart(2, '0'), mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const a = data.indexOf('  aog: {'), z = data.indexOf('  aogGames:');
  if (a < 0 || z < a) fail('không tìm thấy khối aog trong data.js');
  const body = '  aog: {\n' + Object.entries(aog).sort((x, y) => y[1][3] - x[1][3] || y[1][0] - x[1][0])
    .map(([k, v]) => `    "${k}": [${v.join(', ')}]`).join(',\n') + '\n  },\n';
  data = data.slice(0, a) + body + data.slice(z);
  const sub = (re, s) => { if (!re.test(data)) fail('data.js thiếu dòng ' + re); data = data.replace(re, s); };
  sub(/  aogGames: \d+, \/\/[^\n]*/, `  aogGames: ${G}, // tổng số trận ĐTDV mùa hiện tại (tools/aog/update.js đọc API Liquipedia ${dd}/${mm}/${now.getUTCFullYear()})`);
  sub(/  aogDone: (true|false), \/\//, '  aogDone: false, //');
  sub(/  aogTo: "[^"]*", \/\//, `  aogTo: "${dd}/${mm}", //`);
  const after = load(data);
  const before = Object.fromEntries(cur.HEROES.map(h => [h.id, h.tier]));
  const moved = after.HEROES.filter(h => before[h.id] && before[h.id] !== h.tier).map(h => `${h.id} ${before[h.id]}→${h.tier}`);

  const idxPath = path.join(ROOT, 'index.html');
  let idx = fs.readFileSync(idxPath, 'utf8');
  if (!/Dữ liệu cập nhật \d{1,2}\/\d{1,2}\/\d{4}/.test(idx)) fail('index.html thiếu "Dữ liệu cập nhật"');
  idx = idx.replace(/Dữ liệu cập nhật \d{1,2}\/\d{1,2}\/\d{4}/, `Dữ liệu cập nhật ${dd}/${mm}/${now.getUTCFullYear()}`);
  const oldV = Math.max(...(idx.match(/\?v=(\d+)/g) || ['?v=0']).map(s => +s.slice(3)));
  let v = +now.toISOString().slice(0, 16).replace(/\D/g, ''); if (v <= oldV) v = oldV + 1;
  idx = idx.replace(/\?v=\d+/g, '?v=' + v);

  const added = Object.keys(aog).filter(k => !cur.SRC.aog[k]);
  const msg = `Tự cập nhật số liệu ĐTDV từ Liquipedia: ${cur.SRC.aogGames} → ${G} trận\n\n`
    + `Nguồn: API Liquipedia (${CFG.page}), đọc ${dd}/${mm}/${now.getUTCFullYear()} bằng GitHub Actions (tools/aog/update.js).\n`
    + (added.length ? `Tướng mới có pick: ${added.join(', ')}.\n` : '')
    + (moved.length ? `Ô đổi tier: ${moved.join(', ')}.\n` : 'Không ô nào đổi tier.\n');
  console.log(msg);
  if (DRY) { console.log('(--dry: không ghi tệp)'); out('changed', 'false'); return; }
  fs.writeFileSync(dataPath, data); fs.writeFileSync(idxPath, idx); fs.writeFileSync(path.join(__dirname, '.msg'), msg);
  out('changed', 'true');
})().catch(e => fail(e.stack || e));
