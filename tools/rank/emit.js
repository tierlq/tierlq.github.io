#!/usr/bin/env node
// Đọc tools/rank/lqmb.txt (số tỉ lệ thắng / chọn / cấm game rank của LQMB GG) và ghi khối `LQ`
// vào assets/data.js, giữa /*LQ:BEGIN*/ và /*LQ:END*/ (chưa có thì chèn ngay trên dòng `const slug=`).
// Dùng: node tools/rank/emit.js [--dry]
// Số chỉ để HIỂN THỊ (chế độ Số liệu, bảng chi tiết, trang tướng), không tính vào điểm tier.
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..', '..');
const DATA = path.join(ROOT, 'assets', 'data.js');
const TXT = path.join(__dirname, 'lqmb.txt');
const dry = process.argv.includes('--dry');

const lines = fs.readFileSync(TXT, 'utf8').split(/\r?\n/);
const read = (lines.join('\n').match(/Đọc ngày (\d\d\/\d\d\/\d{4})/) || [])[1];
const url = (lines.join('\n').match(/\((https:\/\/lienquanmobile\.gg\/[^)\s]*)\)/) || [])[1];
const errs = [];
if (!read) errs.push('lqmb.txt thiếu "Đọc ngày dd/mm/yyyy" ở dòng chú thích');
if (!url) errs.push('lqmb.txt thiếu link nguồn trong ngoặc ở dòng chú thích');

// Khoá web = bỏ dấu, chữ thường, chỉ giữ a–z của TÊN tướng (cột 2), cùng hàm `slug` trong data.js.
// Cột 1 là slug trong link của nguồn (có gạch nối, ví dụ lu-bo) chỉ để tra lại.
const slug = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z]/g, '');
const d = {};
lines.forEach((ln, i) => {
  if (!ln.trim() || ln.startsWith('#')) return;
  const f = ln.split('|');
  if (f.length !== 6) { errs.push(`dòng ${i + 1}: cần 6 cột (slug|tên|tier|thắng|chọn|cấm)`); return; }
  const key = slug(f[1]), [w, p, b] = f.slice(3).map(Number);
  if (!key) errs.push(`dòng ${i + 1}: tên tướng trống`);
  if (d[key]) errs.push(`dòng ${i + 1}: trùng tướng ${key}`);
  for (const [n, v] of [['thắng', w], ['chọn', p], ['cấm', b]])
    if (!Number.isFinite(v) || v < 0 || v > 100) errs.push(`dòng ${i + 1} (${key}): ${n} "${v}" không hợp lệ`);
  if (w < 30 || w > 70) errs.push(`dòng ${i + 1} (${key}): tỉ lệ thắng ${w} ngoài khoảng 30–70, kiểm lại nguồn`);
  d[key] = [w, p, b];
});

// Đối chiếu với danh sách tướng của web (khoá = slug tên, như data.js).
let src = fs.readFileSync(DATA, 'utf8');
const ctx = {}; vm.createContext(ctx);
vm.runInContext(src.replace(/^const /gm, 'var '), ctx);
const webKeys = [...new Set(vm.runInContext('HEROES.map(h=>h.key)', ctx))];
const unknown = Object.keys(d).filter(k => !webKeys.includes(k));
const missing = webKeys.filter(k => !d[k]);
if (unknown.length) errs.push('khoá không có trên web: ' + unknown.join(', '));
if (errs.length) { console.error('LỖI:\n - ' + errs.join('\n - ')); process.exit(1); }
if (missing.length) console.warn('Cảnh báo: tướng của web chưa có số rank: ' + missing.join(', '));

const parts = Object.keys(d).map(k => `${JSON.stringify(k)}:${JSON.stringify(d[k])}`);
const body = []; let cur = '';
for (const p of parts) { if (cur && (cur + p).length > 150) { body.push(cur); cur = ''; } cur += p + ','; }
if (cur) body.push(cur);
const block = '/*LQ:BEGIN tự sinh bằng `node tools/rank/emit.js` từ tools/rank/lqmb.txt, đừng sửa tay. [thắng %, chọn %, cấm %]; chỉ hiển thị, không vào điểm tier*/\n' +
  `const LQ={src:"LQMB GG",url:${JSON.stringify(url)},read:${JSON.stringify(read)},d:{\n${body.join('\n')}\n}};\n/*LQ:END*/`;

const re = /\/\*LQ:BEGIN[\s\S]*?\/\*LQ:END\*\//;
let out;
if (re.test(src)) out = src.replace(re, () => block);
else {
  const at = src.indexOf('const slug=');
  if (at < 0) { console.error('LỖI: không tìm thấy "const slug=" trong data.js để chèn khối LQ'); process.exit(1); }
  out = src.slice(0, at) + block + '\n' + src.slice(at);
}
if (dry) { console.log(`(thử) ${Object.keys(d).length} tướng, đọc ${read}`); process.exit(0); }
fs.writeFileSync(DATA, out);
console.log(`Đã ghi khối LQ: ${Object.keys(d).length} tướng, đọc ${read}, ${webKeys.length} khoá trên web.`);
