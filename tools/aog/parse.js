// Đọc bảng "Hero Statistics" (tab Overall, bảng đầu tiên) từ HTML mà API Liquipedia trả về (action=parse).
// Trả về { games, rows: [[tên, pick, thắng, thua, thắng%, pick%, cấm, cấm%], ...] }. Không cần thư viện ngoài.
function parseStats(html) {
  const games = +((html.match(/(\d+) games/) || [])[1] || 0);
  const start = html.search(/<th[^>]*>\s*Picks &amp; Bans/);
  if (start < 0) throw new Error('không thấy bảng Hero Statistics');
  const strip = s => s.replace(/<[^>]*>/g, '').replace(/&#160;|&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
  const rows = [];
  for (const chunk of html.slice(start).split(/<tr[\s>]/).slice(1)) {
    const cells = [];
    const re = /<td[^>]*>([\s\S]*?)<\/td>/g; let m;
    while (cells.length < 17 && (m = re.exec(chunk))) cells.push(strip(m[1]));
    if (cells.length < 17 || !/^\d+$/.test(cells[0])) continue;
    if (+cells[0] !== rows.length + 1) { if (rows.length) break; else continue; }   // hạng phải liên tiếp 1, 2, 3…; hết dãy là hết bảng
    const n = s => parseFloat(s.replace('%', ''));
    rows.push([cells[1], +cells[2], +cells[3], +cells[4], n(cells[5]), n(cells[6]), +cells[15], n(cells[16])]);
  }
  return { games, rows };
}
if (typeof module !== 'undefined') module.exports = { parseStats };
