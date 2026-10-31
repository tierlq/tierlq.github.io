// Đoạn mã chạy trong tab Chrome đang mở https://rovmeta.com (máy trong sandbox không tới được rovmeta.com, phải dùng trình duyệt).
// Lấy mục Strengths / Weaknesses (mỗi mục 4 ý, tiếng Anh) ở trang từng tướng rồi in ra trang dạng "slug|+|ý" / "slug|-|ý"
// để đọc bằng get_page_text. Bản tiếng Anh chỉ để người biên tập đọc rồi viết lại tiếng Việt vào tools/strengths/vi.txt:
// KHÔNG chép nguyên văn vào repo (repo công khai), chỉ giữ bản tóm tắt viết lại.
// Danh sách slug: cột đầu của tools/counters/rovmeta_raw.txt (sau dòng ===), thêm celica; bỏ tướng web không có.
(async (slugs) => {
  const grab = (d, name) => {
    const h = [...d.querySelectorAll('h3')].find(x => x.textContent.trim().toLowerCase() === name);
    const ul = h && h.parentElement.querySelector('ul');
    return ul ? [...ul.querySelectorAll('li')].map(li => li.textContent.replace(/[✓✕]/g, '').replace(/\s+/g, ' ').trim()) : null;
  };
  const out = {}, miss = [];
  await Promise.all(slugs.map(async s => {
    const r = await fetch('/heroes/' + s); if (!r.ok) return miss.push(s + ':' + r.status);
    const d = new DOMParser().parseFromString(await r.text(), 'text/html');
    const a = grab(d, 'strengths'), b = grab(d, 'weaknesses');
    if (!a || !b) return miss.push(s + ':trống'); out[s] = [a, b];
  }));
  const lines = [];
  Object.keys(out).sort().forEach(s => { out[s][0].forEach(x => lines.push(s + '|+|' + x)); out[s][1].forEach(x => lines.push(s + '|-|' + x)); });
  document.body.innerHTML = '<main><pre></pre></main>'; document.querySelector('pre').textContent = lines.join('\n');
  return `${Object.keys(out).length} tướng, thiếu: ${miss.join(', ')}`; // get_page_text cắt ở ~50.000 ký tự: chia làm 2 lần nếu cần
})('airi,zata'.split(','));
