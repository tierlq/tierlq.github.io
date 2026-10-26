// Ghi tier hiện tại của mọi ô tướng vào PREV_T trong assets/data.js (mốc so sánh cho mũi tên lên/xuống bậc).
// Dùng: node tools/tiers/snapshot.js <dd/mm> [git-rev]
//   chạy NGAY TRƯỚC khi cập nhật số liệu / bản mới; <dd/mm> là ngày của bảng đang hiện (bảng sắp bị thay).
//   git-rev (tuỳ chọn): lấy tier từ một commit cũ thay vì bản đang có trên máy.
const vm = require('vm'), fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const root = path.join(__dirname, '..', '..'), file = path.join(root, 'assets', 'data.js');
const [date, rev] = process.argv.slice(2);
if (!/^\d{1,2}\/\d{1,2}$/.test(date || '')) { console.error('Cần ngày dạng dd/mm, ví dụ: node tools/tiers/snapshot.js 26/10'); process.exit(1); }
const tiersOf = src => { const c = {}; vm.createContext(c); vm.runInContext(src + ';this.H=HEROES.map(h=>[h.id,h.tier])', c); return c.H; };
const cur = fs.readFileSync(file, 'utf8');
const ids = new Set(tiersOf(cur).map(x => x[0]));
const base = rev ? tiersOf(execSync(`git show ${rev}:assets/data.js`, { cwd: root, maxBuffer: 1e8 }).toString()) : tiersOf(cur);
const by = {};
for (const [id, t] of base) if (ids.has(id)) (by[t] = by[t] || []).push(id);
const str = 'SABCD'.split('').filter(t => by[t]).map(t => t + ':' + by[t].sort().join(',')).join(';');
if (!/^const PREV_T="[^"]*";$/m.test(cur) || !/^const PREV_DATE="[^"]*";$/m.test(cur)) { console.error('Không thấy PREV_T / PREV_DATE trong data.js'); process.exit(1); }
fs.writeFileSync(file, cur.replace(/^const PREV_T="[^"]*";$/m, `const PREV_T="${str}";`).replace(/^const PREV_DATE="[^"]*";$/m, `const PREV_DATE="${date}";`));
console.log(`Đã ghi mốc tier ${date}: ${base.filter(([id]) => ids.has(id)).length} ô tướng.`);
