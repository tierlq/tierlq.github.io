# Nhật ký cải thiện giao diện (UI/UX)

Việc định kỳ mỗi Thứ Bảy (7:45 giờ Việt Nam) đọc tệp này trước khi làm, rồi thêm một mục mới ở cuối.
Mỗi mục: ngày, đã sửa gì và vì sao, đã kiểm tra gì, ý tưởng để lần sau.

## Đã chốt, không làm ngược lại
- Sân khấu "Mạnh nhất mỗi đường" không thu nhỏ khi cuộn tới (nền sáng lộ hai dải kem hai bên, chủ web thấy kỳ, 18/10/2026); chỉ ảnh/chữ bên trong chuyển động.
- Đầu trang đen tan dần vào nền trang (`.hero-fade`), không để mép cứng đen → kem ở nền sáng (chủ web yêu cầu 18/10/2026).
- Phong cách lấy cảm hứng Bugatti: nền đen tuyền, chữ in hoa giãn rộng, góc vuông, đường kẻ mảnh, chuyển động chậm.
- Tên tướng không xuống dòng trên thẻ (chủ web yêu cầu). Tên dài trên điện thoại thu chữ nhẹ (lớp `.card.ln`).
- Hover chỉ đặt trong `@media (hover:hover)` (tránh nút "dính" màu sau khi chạm trên điện thoại).
- Thanh dính (tìm kiếm, chọn đường) và hàng tên đường dùng nền đặc `var(--bg)`, không để trong suốt.
- Thẻ tướng hiện ngay khi cuộn tới; không dùng lại hiệu ứng bật lên lần lượt (từng làm bảng mờ hơn 1 giây).
- Mỗi bảng chi tiết có build riêng theo đường từ nguồn server Việt; đi rừng luôn có đồ rừng + Trừng Trị.
- Danh sách chỉnh tay và đường phụ trong mục Cách xếp tự sinh từ dữ liệu, không viết tay.
- Món đồ và phép bổ trợ trong build dùng con trỏ bàn tay (`cursor:pointer`), không dùng `cursor:help` (dấu ?): chủ web thấy không tự nhiên.

## 2026-10-12 (làm tay cùng chủ web)
- Sửa nút dính màu sau khi chạm trên điện thoại; thanh dính nền đặc; thẻ tướng hiện ngay.
- Điện thoại: ảnh tướng 70px → tối đa 88px, 3 thẻ lấp đủ hàng.
- Bảng lọc điện thoại: nút "Xem N tướng". Máy tính: nút "Xem bảng tier" ở đầu trang. Ô tìm kiếm: mũi tên xuống nhảy tới thẻ đầu tiên.
- Thêm vùng `<main>`, tăng tương phản chữ phụ/vàng/xanh; axe-core sạch ở 1440/390, sáng/tối.
- Ý tưởng để lần sau:
  - Bảng chi tiết trên máy tính: chữ tên đồ trong phần build khá nhỏ (12.5px), cân nhắc tăng nhẹ.
  - Cột Tà Thần (42 tướng) dài hơn hẳn các cột khác trên máy tính, xem có cách đỡ trống ở cột ngắn.

## 2026-10-12 (lần 2, làm tay theo yêu cầu chủ web)
- Điện thoại: danh sách "Thay đổi theo bản" chỉ hiện 6 dòng đầu, nút "Xem thêm N thay đổi" / "Thu gọn" (bớt ~850px cuộn). Máy tính hiện đủ.
- Sửa lỗi gạch chân tên tướng trong danh sách thay đổi trên điện thoại bị lệch xuống dòng dưới (do vùng chạm nới rộng lần trước): dùng text-decoration thay border.
- Nhãn đầu trang "Tướng · 11/10" → "Tướng được xếp".
- Kiểm tra: 148 bảng chi tiết ở 1440/390, CSP không vi phạm, axe-core sạch.
- Ý tưởng để lần sau:
  - Bảng chi tiết trên máy tính: chữ tên đồ trong phần build khá nhỏ (12.5px), cân nhắc tăng nhẹ.
  - Cột Tà Thần (42 tướng) dài hơn hẳn các cột khác trên máy tính, xem có cách đỡ trống ở cột ngắn.

## 2026-10-12 (lần 3, theo yêu cầu chủ web)
- Trỏ chuột (máy tính) hoặc chạm (điện thoại) vào món đồ / phép bổ trợ trong phần build hiện hộp thông tin như trang Học viện · Trang bị
  của Garena: giá, chỉ số, nội tại. Bấm để ghim, Esc hoặc chạm ra ngoài để đóng; bàn phím Tab tới món đồ cũng hiện.
- Dữ liệu từ avix-data bản Việt (khớp trang Garena); Giáp Thống Khổ sửa theo ghi chú bản 29/09 vì nguồn chưa cập nhật chỉ số.

## 2026-10-17 (việc định kỳ Thứ Bảy)
- Sửa: trên điện thoại, mở tướng của đường khác đường đang xem (link `#tuong-…`, slide "Mạnh nhất mỗi đường", danh sách thay đổi)
  thì nút ‹ › và vuốt ngang trong bảng chi tiết bị khoá. Nay ‹ › đi theo thứ tự tier của đường tướng đó (cũng áp dụng khi bộ lọc đang ẩn tướng).
  Đo lại: ở 390px trước chỉ 39/146 bảng chi tiết có ‹ › dùng được, nay 146/146.
- Trình đọc màn hình: tên thẻ tướng thêm thay đổi ở bản mới ("…, tier S, bị giảm sức mạnh ở bản mới"); khối ảnh chân dung (huy hiệu PHỤ/MỚI, chữ cái đầu)
  ẩn khỏi trình đọc vì đã có trong tên thẻ. Nút hạng 2–3 trên sân khấu đọc tên tướng trước ("Edras, hạng 2, tier S").
- Không đổi gì nhìn thấy được (so ảnh trước/sau giống nhau, chỉ khác hiệu ứng chuyển động).
- Kiểm tra: 1440/390/360, sáng/tối; 146 bảng chi tiết mở không lỗi (phần build và Bộ chiêu thức tải đủ), 5 slide, không tràn ngang, không ảnh 404, không vi phạm CSP.
- axe-core 4.14: còn `label-content-name-mismatch` (20 nút ở 1440, 8 ở 390, có từ trước, không tăng). Luật này tính cả chữ chỉ để trang trí
  (số "02", huy hiệu "PHỤ"/"MỚI") nên báo dù tên tướng đã nằm trong tên nút; không sửa. Màn sáng báo tương phản tên tướng trên ảnh bìa
  trong bảng chi tiết là báo nhầm (axe lấy nền ảnh đen, thực tế chữ đen trên nền sáng).
- Ý tưởng để lần sau:
  - Bảng chi tiết trên máy tính: chữ tên đồ trong phần build khá nhỏ (12.5px), cân nhắc tăng nhẹ.
  - Cột Tà Thần dài hơn hẳn các cột khác trên máy tính, xem có cách đỡ trống ở cột ngắn.
  - Link "trang Học viện của Garena" cuối Bộ chiêu thức chỉ cao 15px trên điện thoại, cân nhắc nới vùng chạm.

## 2026-10-18 (làm tay theo yêu cầu chủ web: nền sáng đầu trang liền mạch hơn)
- Thiên hà WebGL: thêm lớp sương mờ (hạt to, rất nhạt; 360 hạt máy tính / 150 điện thoại, máy yếu ×0,6) lấp khoảng tối giữa các vòng và tạo quầng sáng quanh lõi; hạt lõi nhạt bớt để không thành cục trắng.
- Canvas chuyển sang `premultipliedAlpha:true`: trước đây màu bị nhân alpha hai lần nên chỗ ít hạt tối gắt, chỗ nhiều hạt chói đột ngột; giờ ánh sáng cộng đều. Sao thường giảm alpha bù lại độ sáng.
- Quầng nền CSS của `.hero` dùng `var(--gy)` do JS đặt đúng tâm thiên hà (trước cố định 62%, trên điện thoại lệch xuống dưới tâm ~15%).
- Nghiêng/phóng theo cuộn được làm mượt (nội suy theo thời gian), không giật khi cuộn bằng bánh xe.
- Kích thước điểm giới hạn theo `ALIASED_POINT_SIZE_RANGE` của máy.
- Kiểm tra: 1440/390 không lỗi JS, 5 slide, không tràn ngang; so ảnh trước/sau (swiftshader).
- Nền sáng: chủ web thấy chỗ nối đầu trang đen → nền kem quá tách bạch. Thêm `.hero-fade` (dải chuyển dần kiểu scrim, cao 1,6× khoảng cách đầu mục, chồng lên phần đệm của mục sau nên bố cục chỉ dài thêm ~0,6×). Nền tối không thấy khác. Khi mở "Cách đọc bảng" dải không chồng lên hộp.
- Bỏ hiệu ứng thu nhỏ sân khấu khi cuộn (scale 0,94 → 1) vì ở nền sáng lộ hai viền kem hai bên ảnh; giữ chuyển động ảnh nền và chữ bên trong. Bỏ `will-change` của `.stage`.
