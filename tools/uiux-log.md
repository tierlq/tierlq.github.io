# Nhật ký cải thiện giao diện (UI/UX)

Việc định kỳ mỗi Thứ Bảy (7:45 giờ Việt Nam) đọc tệp này trước khi làm, rồi thêm một mục mới ở cuối.
Mỗi mục: ngày, đã sửa gì và vì sao, đã kiểm tra gì, ý tưởng để lần sau.

## Đã chốt, không làm ngược lại
- Sân khấu "Mạnh nhất mỗi đường" luôn tràn kín mép, không có viền ở bất kỳ bước cuộn nào: không thu nhỏ khung, không mở ảnh từ khung hẹp (viền kem hay viền đen hai bên đều bị chủ web chê, 18/10/2026). Chuyển động chỉ ở bên trong: ảnh thu dần + trôi dọc, tỉ lệ phóng luôn đủ phủ phần trôi.
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
- Tràn sát mép thì chủ web thấy thô → sân khấu thành khung thẳng lề nội dung (1320px, cách mép 20/16px như phần còn lại); ảnh trong khung trôi kèm thu nhẹ (1,2 → 1,12) khi cuộn qua để vẫn có chuyển động. Đã thử phương án ảnh tan vào nền kem ở mép trên: trông bạc màu, bỏ.
- Chủ web: khung thẳng lề làm mất cảm giác tràn ra kiểu Bugatti → sân khấu lại tràn mép (nền đen), máy tính: ảnh mở dần từ khung thẳng lề nội dung ra tràn mép khi cuộn tới (biến `--cx`, `--s`, `--ty`, `--tc` đặt trên `#stage`, `clip-path` bù theo tỉ lệ phóng ảnh); chữ và nút tạm dừng thẳng lề nội dung (`--gut`). Điện thoại tràn mép luôn. IntersectionObserver của hiệu ứng cuộn gọi cập nhật ngay khi khối hiện ra (trước đây nhảy thẳng tới bằng link thì chưa áp hiệu ứng tới lần cuộn sau).
- Chủ web chê viền đen hai bên khi ảnh đang mở → bỏ hẳn hiệu ứng mở khung. Ảnh thu từ 1,22 xuống ~1,08 khi cuộn qua (tỉ lệ tối thiểu tính theo độ trôi để không lộ mép ảnh). Quét cả trang khi cuộn (1440/2000/390, sáng/tối): ảnh sân khấu luôn phủ kín khung, sân khấu/đầu trang/dải chuyển/thanh dính/dải chữ chạy đều sát hai mép, chữ dải chạy không hở đầu đuôi. Kịch bản quét: dựng lại theo mô tả này nếu cần.
- Ảnh sân khấu mờ trên màn lớn (ảnh 960px nén q60 bị phóng gần 2 lần) → thêm `s2/` (bản gốc avix rộng 1386, chép nguyên tệp; Tamyn nguồn 600px nên dùng bản 960), sân khấu và bảng chi tiết dùng `srcset` (máy nhỏ vẫn tải bản 960; điện thoại mật độ cao và màn rộng tải s2). Giảm phóng ảnh khi cuộn còn 1,14 → ~1,1, độ trôi ±25px. `sw.js` lưu lâu cả `s2/`.
