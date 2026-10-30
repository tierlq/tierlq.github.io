# Đổi sang tên miền riêng

Chỉ chủ web mua tên miền (có thanh toán, không giao cho Claude làm). Mọi việc trong mã đã gom sẵn vào một lệnh.

## Cân nhắc trước khi đổi
- Web đang có hạng tốt trên Google với địa chỉ `tierlq.github.io` (tháng 10/2026: vị trí trung bình 4,7 cho "tier list liên quân"). Khi đổi, GitHub tự chuyển hướng 301 địa chỉ cũ sang tên miền mới,
  nhưng Google cần vài tuần để chuyển hạng và có thể tụt tạm thời. Đổi càng muộn, hạng càng lớn, rủi ro càng nhiều → nếu định đổi thì đổi sớm.
- Lợi ích: AdSense chỉ duyệt tên miền riêng, địa chỉ ngắn dễ nhớ để ghi trên video, không phụ thuộc github.io.
- Giá và giấy tờ tuỳ nhà đăng ký (tên miền .vn thường cần xác minh giấy tờ cá nhân; .com thường nhanh hơn). Chọn tên ngắn, dễ gõ, không dấu.

## Các bước
1. Mua tên miền.
2. Chạy thử: `node tools/domain/doi-ten-mien.js https://ten-mien-moi.vn --dry`, thấy ổn thì chạy bỏ `--dry` (ghi site.json, CNAME, index.html, 404.html, robots.txt, security.txt, tạo lại sitemap và trang tướng).
3. Đổi `?v=` các script trong index.html, commit, đẩy lên `main`.
4. Trỏ DNS ở nơi mua tên miền (kiểm lại số liệu hiện hành ở tài liệu GitHub Pages "Managing a custom domain"):
   - tên miền gốc: 4 bản ghi A tới 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - `www`: bản ghi CNAME tới `tierlq.github.io`
5. GitHub repo → Settings → Pages → Custom domain: nhập tên miền, chờ kiểm tra DNS xong thì bật **Enforce HTTPS**.
6. Search Console: thêm tài sản mới cho tên miền (loại "Tên miền", xác minh bằng bản ghi TXT), gửi `sitemap.xml`. Giữ tài sản cũ để xem hạng cũ chuyển sang.
7. Đổi link bio TikTok và mọi nơi đã dán link cũ (bộ link mới nằm ở `tools/tiktok/links.txt`).
