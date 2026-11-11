#!/usr/bin/env node
// Đọc tools/rank/garena.txt (tỉ lệ thắng / chọn / cấm game rank, chép từ Bảng Phân Bậc Tướng trong game Liên Quân Mobile của Garena)
// và ghi khối `RANK` vào assets/data.js, giữa /*RANK:BEGIN*/ và /*RANK:END*/ (chưa có thì chèn ngay trên dòng `const slug=`).
// Dùng: node tools/rank/emit.js [--dry]
// Số chỉ để HIỂN THỊ (chế độ Số liệu, bảng chi tiết, trang tướng), không tính vào điểm tier.
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..', '..');
const DATA = path.join(ROOT, 'assets', 'data.js');
const TXT = path.join(__dirname, 'garena.txt');
const dry = process.argv.includes('--dry');

const text = fs.readFileSync(TXT, 'utf8');
const lines = text.split(/\r?\n/);
const read = (text.match(/Ghi ngày (\d\d\/\d\d\/\d{4})/) || [])[1];
const errs = [];
if (!read) errs.push('garena.txt thiếu "Ghi ngày dd/mm/yyyy" ở dòng chú thích');

// Khoá web = bỏ dấu, chữ thường, chỉ giữ a–z của TÊN tướng, cùng hàm `slug` trong data.js (Flowborn có hai khoá: -ad và -mid, như SRC.aog).
const slug = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z]/g, '');
const num = s => Number(String(s).trim().replace(',', '.'));
const d = {};
let prevW = Infinity;
lines.forEach((ln, i) => {
  if (!ln.trim() || ln.startsWith('#')) return;
  const f = ln.split('|');
  const at = `dòng ${i + 1}`;
  if (f.length !== 7) { errs.push(`${at}: cần 7 cột (khoá|tên|vai trò|Garena|thắng|chọn|cấm)`); return; }
  const key = f[0].trim(), [w, p, b] = f.slice(4).map(num);
  if (key !== slug(f[1]) && !(slug(f[1]) === 'flowborn' && /^flowborn-(ad|mid)$/.test(key))) errs.push(`${at}: khoá "${key}" không khớp tên "${f[1]}"`);
  if (!/^T[0-4]$/.test(f[3].trim())) errs.push(`${at} (${key}): bậc Garena "${f[3]}" phải là T0–T4`);
  if (d[key]) errs.push(`${at}: trùng tướng ${key}`);
  for (const [n, v] of [['thắng', w], ['chọn', p], ['cấm', b]])
    if (!Number.isFinite(v) || v < 0 || v > 100) errs.push(`${at} (${key}): ${n} "${v}" không hợp lệ`);
  if (w < 30 || w > 70) errs.push(`${at} (${key}): tỉ lệ thắng ${w} ngoài khoảng 30–70, kiểm lại`);
  // Bảng trong game sắp theo thắng giảm dần: dòng nào chép sai chữ số hay sai chỗ sẽ làm vỡ thứ tự này
  if (w > prevW + 1e-9) errs.push(`${at} (${key}): thắng ${w} lớn hơn dòng trên ${prevW}, bảng phải giảm dần (chép sai số hoặc sai thứ tự)`);
  prevW = w;
  d[key] = [w, p, b, Number(f[3].trim()[1])];   // [thắng, chọn, cấm, bậc Garena 0–4 (T0 mạnh nhất)]
});

// Đối chiếu với danh sách ô tướng của web: mỗi ô phải có số (khoá tướng-đường, hoặc khoá tướng).
let src = fs.readFileSync(DATA, 'utf8');
const ctx = {}; vm.createContext(ctx);
vm.runInContext(src.replace(/^const /gm, 'var '), ctx);
const cells = vm.runInContext('HEROES.map(h=>[h.id,h.key,h.lane])', ctx);
const has = (key, lane) => d[key + '-' + lane] || (key === 'flowborn' ? null : d[key]);
const missing = [...new Set(cells.filter(([, k, l]) => !has(k, l)).map(([, k]) => k))];
const used = new Set(cells.map(([, k, l]) => d[k + '-' + l] ? k + '-' + l : k));
const unknown = Object.keys(d).filter(k => !used.has(k));
if (unknown.length) errs.push('khoá không có trên web: ' + unknown.join(', '));
if (errs.length) { console.error('LỖI:\n - ' + errs.join('\n - ')); process.exit(1); }
if (missing.length) console.warn('Cảnh báo: tướng của web chưa có số rank: ' + missing.join(', '));

const parts = Object.keys(d).map(k => `${JSON.stringify(k)}:${JSON.stringify(d[k])}`);
const body = []; let cur = '';
for (const p of parts) { if (cur && (cur + p).length > 150) { body.push(cur); cur = ''; } cur += p + ','; }
if (cur) body.push(cur);
const block = '/*RANK:BEGIN tự sinh bằng `node tools/rank/emit.js` từ tools/rank/garena.txt, đừng sửa tay. [thắng %, chọn %, cấm %, bậc Garena 0–4 = T0–T4]; chỉ hiển thị, không vào điểm tier*/\n' +
  `const RANK={src:"Garena Liên Quân Mobile",where:"Cẩm nang → Bảng Phân Bậc Tướng",filter:"Đấu hạng (Tất cả)",read:${JSON.stringify(read)},d:{\n${body.join('\n')}\n}};\n/*RANK:END*/`;

const re = /\/\*(?:RANK|LQ):BEGIN[\s\S]*?\/\*(?:RANK|LQ):END\*\//;
let out;
if (re.test(src)) out = src.replace(re, () => block);
else {
  const at = src.indexOf('const slug=');
  if (at < 0) { console.error('LỖI: không tìm thấy "const slug=" trong data.js để chèn khối RANK'); process.exit(1); }
  out = src.slice(0, at) + block + '\n' + src.slice(at);
}
if (dry) { console.log(`(thử) ${Object.keys(d).length} dòng, ghi ${read}`); process.exit(0); }
fs.writeFileSync(DATA, out);
console.log(`Đã ghi khối RANK: ${Object.keys(d).length} dòng (${cells.length} ô tướng của web), ghi ngày ${read}.`);
