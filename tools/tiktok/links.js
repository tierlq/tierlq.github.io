// Tạo tools/tiktok/links.txt: link cho bio TikTok và link ngắn của từng ô tướng để ghi trong clip / chú thích.
// Chạy: node tools/tiktok/links.js   (không cần chạy lại khi chỉ đổi tier, chỉ khi thêm tướng)
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..', '..'), SITE = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools', 'site.json'), 'utf8')).origin, HOST = SITE.replace(/^https?:\/\//, '');
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets/data.js'), 'utf8').replace(/^const /gm, 'var '), ctx);
const { HEROES, LANES } = ctx;
const out = [];
out.push('# Link cho TikTok @bangtierlienquan');
out.push('');
out.push('## Link trong bio (dán vào ô Trang web; có mã theo dõi để Google Analytics biết người đến từ TikTok)');
out.push(`${SITE}/?utm_source=tiktok&utm_medium=bio&utm_campaign=bio`);
out.push('');
out.push('## Gợi ý chữ trên video / chú thích');
out.push(`Trên video (ngắn, dễ gõ): ${HOST}`);
out.push(`Chú thích: "Tier, build, bộ chiêu của <Tướng> cập nhật theo bản mới: ${HOST}/#tuong-<mã> (link trong bio)"`);
out.push('Bình luận ghim: link bio + câu hỏi để người xem trả lời (ví dụ "Bạn xếp <Tướng> tier mấy?")');
out.push('');
out.push('## Link ngắn từng ô tướng  (tên · đường · tier hiện tại · link mở thẳng bảng chi tiết)');
for (const l of Object.keys(LANES)) {
  out.push(`### ${LANES[l]}`);
  HEROES.filter(h => h.lane === l).sort((a, b) => 'SABCD'.indexOf(a.tier) - 'SABCD'.indexOf(b.tier) || a.rank - b.rank)
    .forEach(h => out.push(`${h.name}${h.sec ? ' (phụ)' : ''} · tier ${h.tier} · ${HOST}/#tuong-${h.id}`));
}
fs.writeFileSync(path.join(__dirname, 'links.txt'), out.join('\n') + '\n');
console.log('links.txt:', HEROES.length, 'ô tướng');
