// Đổi tên miền của web trong MỘT lệnh (sau khi đã mua tên miền, chưa đổi DNS cũng được).
//   node tools/domain/doi-ten-mien.js https://ten-mien-moi.vn --dry    xem trước, không ghi gì
//   node tools/domain/doi-ten-mien.js https://ten-mien-moi.vn          ghi thật: tools/site.json, index.html, 404.html, robots.txt, security.txt, tệp CNAME, rồi chạy lại seo/build.js và tiktok/links.js
// Việc còn lại (làm tay, xem tools/domain/HUONG-DAN.md): trỏ DNS, nhập tên miền ở GitHub Settings > Pages, thêm tài sản mới ở Search Console.
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const arg = process.argv[2], dry = process.argv.includes('--dry');
if (!arg || !/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}$/i.test(arg)) { console.error('Cần địa chỉ dạng https://ten-mien.vn (không có dấu / ở cuối, không có đường dẫn).'); process.exit(1); }
const NEW = arg.toLowerCase(), cfg = path.join(ROOT, 'tools', 'site.json'), OLD = JSON.parse(fs.readFileSync(cfg, 'utf8')).origin;
if (NEW === OLD) { console.log('Tên miền đã là', OLD); process.exit(0); }
const files = ['index.html', '404.html', 'robots.txt', '.well-known/security.txt'];
for (const f of files) {
  const p = path.join(ROOT, f), s = fs.readFileSync(p, 'utf8'), n = s.split(OLD).length - 1;
  console.log(`${f}: ${n} chỗ`);
  if (!dry && n) fs.writeFileSync(p, s.split(OLD).join(NEW));
}
if (dry) { console.log(`(xem trước) ${OLD} → ${NEW}; sẽ ghi tools/site.json, CNAME và chạy lại build`); process.exit(0); }
fs.writeFileSync(cfg, JSON.stringify({ origin: NEW }) + '\n');
fs.writeFileSync(path.join(ROOT, 'CNAME'), NEW.replace(/^https:\/\//, '') + '\n');
cp.execSync('node tools/seo/build.js && node tools/tiktok/links.js', { cwd: ROOT, stdio: 'inherit' });
console.log('Xong. Nhớ đổi ?v= các script trong index.html, commit và đẩy lên, rồi làm các bước trong tools/domain/HUONG-DAN.md');
