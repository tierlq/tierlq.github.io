# Nhật ký cải thiện giao diện (UI/UX)

Việc định kỳ mỗi Thứ Bảy (7:45 giờ Việt Nam) đọc tệp này trước khi làm, rồi thêm một mục mới ở cuối.
Mỗi mục: ngày, đã sửa gì và vì sao, đã kiểm tra gì, ý tưởng để lần sau.

## Đã chốt, không làm ngược lại
- Sân khấu "Mạnh nhất mỗi đường" luôn tràn kín mép, không có viền ở bất kỳ bước cuộn nào: không thu nhỏ khung, không mở ảnh từ khung hẹp (viền kem hay viền đen hai bên đều bị chủ web chê, 18/10/2026). Chuyển động chỉ ở bên trong: ảnh thu dần + trôi dọc, tỉ lệ phóng luôn đủ phủ phần trôi.
- Đầu trang đen tan dần vào nền trang (`.hero-fade`), không để mép cứng đen → kem ở nền sáng (chủ web yêu cầu 18/10/2026).
- Phong cách theo Bugatti 2026 (chủ web chọn 18/10/2026): nền đen tuyền, chữ tiêu đề in hoa giãn rộng, chữ phụ/nút kiểu đánh máy (JetBrains Mono), nút viên thuốc, khung ảnh/hộp bo góc nhẹ (8–12px), logo giữa thanh trên, hiện từ mờ sang nét khi cuộn, đường kẻ mảnh, chuyển động chậm. Sân khấu và đầu trang vẫn tràn mép, không bo.
- Tên tướng không xuống dòng trên thẻ (chủ web yêu cầu). Tên dài trên điện thoại thu chữ nhẹ (lớp `.card.ln`).
- Dấu trên ảnh tướng kiểu Prydwen (chủ web yêu cầu 26/10/2026): cột ô vuông nhỏ ở góc phải trên. Ô đặc xanh chữ V lên / đỏ chữ V xuống (hai chữ V khi đổi từ 2 bậc) = lên/xuống bậc so với lần cập nhật trước (`PREV_T`); ô tối có dấu + / − / ± = tăng / giảm / điều chỉnh sức mạnh ở bản Garena; ô vàng MỚI = tướng mới. Ô nổi cách mép 3px, bo 5px. Không đổi lại thành nhãn chữ "↑ Tăng".
- Icon dùng một bộ nét mảnh (lưới 24, nét 1,6, đầu nét tròn, lớp `svg.i`); biểu tượng lớp tướng cũng nét mảnh (khiên, kiếm chéo, dao găm, sao bốn cánh, tâm ngắm, trái tim). Trợ thủ không dùng dấu + để khỏi lẫn với dấu tăng sức mạnh.
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
- Ảnh nổi khối (chủ web chọn cách 2): 5 tướng đứng đầu (Ryoma, Billow, Zata, Eland'orr, Y'bneth) có lớp tướng tách nền + nền đã xoá tướng (`c/`, `tools/cutout/make.py`, mặt nạ gộp 3 mô hình rembg vì từng mô hình riêng cắt hỏng ở tướng khác nhau; BiRefNet quá nặng cho máy 7 GB). Máy tính: rê chuột thì tướng lệch ±16px, nền ngược ±8px; cuộn thì tướng trôi chậm hơn nền; tướng bồng bềnh nhẹ. Điện thoại: cuộn + bồng bềnh. Lớp chỉ bật khi tải xong cả hai ảnh; giảm chuyển động thì không tải. Đã đo: các lớp luôn phủ kín khung ở mọi vị trí chuột/cuộn.
- Chủ web muốn kiểu "nhân vật thở": bỏ bồng bềnh, lớp tướng (bọc trong `.fgw`, gốc biến đổi ở mép dưới khung) phồng nhẹ scale(1.004, 1.013) chu kỳ 4,6s, hít nhanh thở chậm, chỉ slide đang hiện. Đầu/vai nhích lên ~5–7px, chân gần như đứng yên.
- Chủ web muốn "cử động toàn thân": thay thở CSS bằng WebGL (`ALIVE`, một canvas dùng chung gắn vào slide đang hiện) uốn lớp tướng trong shader: thở 1,2% chiều cao từ mép dưới, lắc người 10px (phần trên lắc nhiều hơn, chu kỳ ~8,8s), tóc/áo choàng/mép bóng lay 7px theo sóng dựa trên `c/<key>-flex.webp` (khoảng cách tới mép bóng; mép khung ảnh không tính). Điện thoại ~30 hình/giây, dừng khi sân khấu khuất hoặc tab ẩn; mất WebGL thì quay về thở CSS.
- Chủ web gửi clip TikTok kiểu live wallpaper và bảo bỏ hết kiểu trước (tách lớp, rê chuột, thở, lắc người). Đã xoá `c/`, `tools/cutout/`. Làm mới: WebGL vẽ lại ảnh bìa, flow map `a/<key>.webp` (`tools/anim/make.py`: hướng theo nét vẽ, toả ra khỏi thân + đi lên; dải sát mép trong bóng tướng + quầng ngoài chảy, mặt/da/thân giữa/nền xa đứng yên), lửa năng lượng dạng dải mảnh (nhiễu gờ uốn miền) màu của đường trong kênh B, lấp lánh chỗ sáng, 110 hạt sáng (điện thoại 50). Giữ thu/trôi khi cuộn (áp chung cho ảnh và canvas).
- 18/10/2026: chủ web thử ảnh nổi khối, nhân vật thở, cử động toàn thân, ảnh động kiểu live wallpaper rồi bảo bỏ hết, quay về ảnh tĩnh (giữ ảnh nét s2/ và sân khấu tràn mép). **Đã chốt: không làm lại các hiệu ứng động cho ảnh tướng trừ khi chủ web yêu cầu.**
- Chủ web muốn ảnh sân khấu nét nhất có thể, "như thật kiểu Bugatti". Nguồn chính thức không có bản lớn hơn (Garena Học viện: 1280–1386px, vài skin 1920) → thêm `s3/` = Real-ESRGAN x2plus phóng ×2 từ s2/ (2772px, WebP q82 ~100–190 kB, xoá vệt nén), chỉ sân khấu dùng qua srcset (`S3_KEYS`). Đã so: anime_6B làm mịn quá, x2plus giữ chất vẽ.
- Đổi sang phong cách Bugatti 2026 (đã xem bugatti.com): font phụ JetBrains Mono (có tiếng Việt) cho nhãn, nút, tab; nút/thẻ lọc/nhãn dạng viên thuốc; ảnh chân dung bo 8px, bảng chi tiết bo 12px; logo giữa thanh trên (máy tính); tiêu đề mục, hộp, chú giải hiện từ mờ → nét; chữ sân khấu hiện từ mờ. Gộp ở khối CSS cuối `<style>` ("Phong cách Bugatti 2026").
- UX học từ bugatti.com: nút MENU góc trái (điện thoại: MENU trái, logo giữa, nút sáng/tối phải), bảng menu trượt từ trái, nền sau mờ; trong menu có mục trên trang và 5 thẻ ảnh lớn tướng đứng đầu mỗi đường (bấm mở bảng chi tiết); Esc/bấm nền để đóng, giữ focus trong menu. Hàng tab đường trên sân khấu thành kính mờ (như bảng chú thích của Bugatti).
- 18/10/2026: sau vài lần thử, chủ web chốt: cuộn trôi + dừng lại ở thông tin quan trọng (đầu trang, sân khấu, đầu bảng tier, mục Cách xếp và nguồn), không ghim sân khấu đổi tướng theo cuộn; sân khấu giữ trình chiếu tự chuyển 7 giây.
- Cuộn trôi kiểu Bugatti/Lenis (chủ web yêu cầu): máy tính có chuột, lăn chuột thì trang trôi tới vị trí mới rồi chậm dần (hàm `glide`, nội suy theo thời gian ~0,7s); điện thoại/cảm ứng/giảm chuyển động dùng cuộn gốc; vùng tự cuộn bên trong (bảng chi tiết, menu, bộ lọc) cuộn riêng; Ctrl+lăn vẫn phóng to; phím/kéo thanh cuộn huỷ hoạt ảnh.
- Cuộn trôi có điểm dừng (hàm `glide`): máy tính có chuột lăn qua điểm dừng thì dừng hẳn ở đó, đứng yên ~0,45s (lăn tiếp trong lúc dừng bị bỏ qua), rồi mới đi tiếp; giữa các điểm trôi tự do. Cảm ứng: dừng tay trong ~20% chiều cao màn quanh điểm dừng thì hút vào nhẹ.
- Điểm dừng khi cuộn bị chê khựng → bỏ khoá cứng 0,45s: tới điểm dừng thì trôi êm vào (nội suy 7,5%/khung ~0,8s), lăn tiếp chỉ nhún nhẹ (12% lượng lăn, như có lực cản), lăn tổng ~260px mới vượt qua, ngừng lăn thì trôi về đúng điểm.
- Chủ web: dừng hơi lâu, khó cuộn đi → ngưỡng vượt 260→90px (~1 nấc chuột), nhún 25%, trôi nhanh hơn (11%/khung ~0,55s).
- Zalo (Android): thanh dính (Meta/Tìm/Lọc + hàng đường) dính cách mép trên một khoảng, nội dung lộ phía trên → do trình duyệt trong Zalo báo `safe-area-inset-top` khác 0. Giờ chỉ dùng vùng an toàn phía trên khi web được cài như ứng dụng (`display-mode: standalone`, biến `--sat`); trình duyệt thường và trong app dính sát mép 0.

## 2026-10-24 (việc định kỳ Thứ Bảy)
- Sửa tương phản nhãn tier ("Tier S · Rất mạnh") trong bảng chi tiết: chữ màu tier trên nền nhuộm 14% chỉ đạt 3,6–4,2:1 ở giao diện sáng
  (S, A, B, D) và 4,37:1 với tier D ở giao diện tối. Nay chữ pha 70% màu tier + 30% màu chữ chính (`.tag.tt`, biến `--tg`): giữ sắc màu tier,
  đạt ≥ 4,5:1 ở cả 10 trường hợp. Nhìn gần như cũ, chỉ đậm hơn một chút.
- Link "trang Học viện của Garena" cuối Bộ chiêu thức: vùng chạm 15px → 27px (padding dọc trên chữ nội dòng, dòng chữ không xê dịch).
- Máy tính (≥ 720px): tên đồ trong build 12,5px → 13,5px cho dễ đọc. Đã quét 146 bảng chi tiết: không tên đồ nào bị cắt bởi giới hạn 2 dòng.
- Kiểm tra: 1440/390/360, sáng/tối; 146 bảng chi tiết mở không lỗi (build + Bộ chiêu thức), 5 slide, không tràn ngang, không ảnh 404,
  không vi phạm CSP. axe-core 4.10: trang chính sạch, bảng chi tiết hết lỗi color-contrast (trước có ở giao diện sáng). So ảnh trước/sau:
  chỉ khác ở nhãn tier, tên đồ (máy tính), còn lại là nhiễu chuyển động.
- Ghi chú môi trường kiểm tra: ảnh chiêu Garena, font Google, GA bị chặn trong máy kiểm tra (hiện chữ cái đầu thay ảnh chiêu) — bình thường.
- Ý tưởng để lần sau:
  - Cột Tà Thần dài hơn hẳn các cột khác trên máy tính, xem có cách đỡ trống ở cột ngắn.
  - Danh sách nguồn trong mục Cách xếp và nguồn: link cao 17px trên máy tính (điện thoại đã đủ), có thể nới khoảng cách dòng.
  - Tên tướng trong danh sách "Thay đổi theo bản" trên máy tính cao 18px; đủ chuẩn 24px nhờ khoảng cách, chỉ cân nhắc nếu thấy khó bấm.
- Chrome Android "Tự động làm tối trang web" (auto dark) đảo màu cả trang: đầu trang đen thành kem, nút sáng thành tối, vùng số liệu thành trắng. Thêm `<meta name="color-scheme" content="dark light only">` và `color-scheme: only dark / only light` ở :root (index, 404) để trình duyệt không tự đảo màu; web tự lo giao diện sáng/tối.
- Chrome Android (máy thật của chủ web): khi tải/cuộn, vùng số liệu đầu trang và cả đầu trang thành ô trắng, thiên hà phát sáng xanh trên nền trắng = Chrome chưa kịp vẽ lớp (thiếu bộ nhớ đồ hoạ). Sửa: nền đặc #000 dưới gradient đầu trang và khối số liệu (ô chưa vẽ sẽ đen chứ không trắng); điện thoại bỏ will-change thường trực, bỏ kính mờ ở tab sân khấu, không dịch khối số liệu khi cuộn, không tải ảnh s3 2772px (giải nén ~19 MB/tấm) mà dùng s2.
- Bản quay màn hình 25/10 (Chrome Android): (1) khối xanh đặc thay cho tiêu đề "Bảng tier theo đường" khi cuộn = hoạt ảnh filter:blur; (2) khoảng đen trống trước tiêu đề mục khi cuộn nhanh = hiện từ mờ 1,3s; (3) thẻ Marja trong menu đen lúc mở = ảnh tải lười, dựng lại mỗi lần mở; (4) bấm TikTok mở tab mới rồi app TikTok vào trang Đề xuất, không vào kênh. Sửa: điện thoại bỏ mọi hiệu ứng mờ (filter/backdrop-filter ở menu, nút bảng chi tiết), hiện mục nhanh 0,45s không mờ, tiêu đề đầu trang hiện dần thay vì giãn chữ; menu dựng thẻ một lần, ảnh tải sớm (khi chạm nút hoặc sau 4s); link TikTok trên màn cảm ứng mở ngay trong tab để Android chuyển thẳng sang app.
- Tự rà lỗi điện thoại 25/10: màn 320px nút sáng/tối bị đẩy ra ngoài mép (thu chữ logo ≤380px); "Bộ lọc" xuống 2 dòng; xoay ngang: chữ điều hướng xuống dòng (ẩn ở ≤1040px, đã có MENU), sân khấu cao đúng màn; máy cảm ứng ô tìm 16px để iPhone không tự phóng to; fitNames chỉ chạy khi đổi chiều ngang (thanh địa chỉ ẩn/hiện khi cuộn cũng phát resize, gây giật). Thử: 4 máy × sáng/tối OK, 320px, 844×390 ngang, 768 máy tính bảng.
- Menu trên điện thoại: bấm mục thì nhảy về đầu trang. Nguyên nhân: khoá cuộn bằng overflow:hidden trên html (Chrome Android đặt lại vị trí) và trả focus về nút MENU ở đầu trang khi đóng (trình duyệt cuộn tới nút). Sửa: khoá cuộn bằng body position:fixed giữ nguyên vị trí, focus({preventScroll:true}), mục trong menu tự cuộn tới đúng tiêu đề (trừ chiều cao thanh dính), tắt hút điểm dừng 2s sau khi nhảy.
- Giữ chân người xem (theo GA: ~6% quay lại, 51% mở bảng chi tiết, Google + ChatGPT là nguồn chính): dải "Theo bản 15/10 · 3 tăng · 2 giảm…" ở đầu trang (bấm tới danh sách thay đổi); "Xem gần đây" trên bảng tier (lưu máy người xem, hiện khi đã xem ≥2 tướng); nút "Tiếp theo" cuối bảng chi tiết; mời thêm vào màn hình chính sau 3 tướng (Android nút cài, iPhone hướng dẫn, tắt thì 14 ngày); ảnh tier list có địa chỉ web to + mã QR (utm anh_tier_list); mục Hỏi nhanh (FAQ) + 146 trang riêng từng tướng + sitemap cho Google (tools/seo/build.js). Cuộn tới mục (goTo) tự chỉnh lại khi bố cục phía trên đổi lúc đang cuộn.
- Chrome Android: chuyển đường thì thẻ tướng thành ô đen/tím (ảnh không vẽ, lớp gradient vẽ sai màu) = View Transition chụp mọi thẻ thành lớp đồ hoạ, máy thiếu bộ nhớ. Tắt View Transition trên điện thoại và máy cảm ứng (`vtOn`), máy tính giữ nguyên.
- Vẫn ô đen/tím ở thẻ tướng (cả trình duyệt khác) sau khi tắt View Transition. Giảm tiếp trên điện thoại: bỏ content-visibility:auto ở hàng tier (Chrome có lỗi ảnh trong vùng bỏ qua vẽ hiện đen), bỏ transform 3D thị sai trên ảnh 5 slide sân khấu (lần tối ưu 25/10 ghi transform lên cả 5 ảnh lớn → giữ 5 lớp đồ hoạ lớn), bỏ lớp gradient ::after và transition ở ảnh chân dung, menu không tải sẵn ảnh sau 4s. Chưa tái hiện được trên giả lập; chờ chủ web thử máy thật.
- Tối ưu điện thoại 26/10: nút Quay lại (Android) đóng bảng chi tiết / menu / bộ lọc thay vì rời web (BACK + pushState; link riêng #tuong- lúc mở trang cũng vậy; history.scrollRestoration=manual); gõ tìm tướng không có ở đường đang xem thì tự chuyển sang đường có kết quả; thiên hà trên điện thoại vẽ ~30 hình/giây, độ phân giải ≤1,25×, dừng hẳn khi khuất. Đo (CPU chậm 4×): TBT 595 → 434 ms, mở bảng chi tiết 939 → 613 ms.
- Hàng tab sân khấu bỏ kính mờ (máy tính lag khi cuộn qua sân khấu), dùng nền chuyển đen đặc hơn.

## 2026-10-26 (làm tay theo yêu cầu chủ web: dấu lên/xuống bậc kiểu Prydwen)
- Ảnh tướng: thay nhãn chữ cũ bằng cột ô vuông 20px góc phải trên (giống prydwen.gg/star-rail/tier-list): lên bậc / xuống bậc (mũi tên, ô đặc) tách khỏi tăng / giảm sức mạnh (dấu + / −, ô tối).
- Mốc so sánh: tier ngày 17/10 (`PREV_T` trong data.js, tạo bằng `tools/tiers/snapshot.js`). 13 ô lên bậc, 9 ô xuống bậc.
- Thêm danh sách "Đổi bậc so với ngày 17/10" dưới mục thay đổi bản; bộ lọc có thêm "Lên bậc"/"Xuống bậc"; bảng chi tiết ghi "Lên bậc · B → A"; ảnh tải về cũng có dấu; trang riêng từng tướng ghi lên/xuống bậc.

## 2026-10-27 (làm tay theo yêu cầu chủ web: làm đẹp icon)
- Dấu trên ảnh tướng: đổi mũi tên khối sang chữ V nét mảnh, hai chữ V khi đổi từ 2 bậc (ví dụ Rourke B → D); ô nổi cách mép 3px, bo 5px, màu theo bảng màu web (#5fd398 / #ff7466 / vàng tier S); MỚI dùng chữ JetBrains Mono.
- Biểu tượng lớp tướng vẽ lại thành bộ nét mảnh; ô lớp ở góc trái cùng kiểu ô với dấu bên phải. Biểu tượng Trợ thủ đổi từ dấu + sang trái tim.
- Icon giao diện (tìm, lọc, tải ảnh, chia sẻ, sáng/tối, dừng/chạy, đóng menu, lên đầu trang, nút ‹ › × trong bảng chi tiết, mũi tên "Tiếp theo") chuyển về cùng một bộ nét 1,6.
- Danh sách thay đổi bản và thẻ trong bảng chi tiết dùng chung ô dấu với ảnh tướng; ảnh tải về vẽ dấu y như web.

## 2026-10-27 (làm tay theo yêu cầu chủ web: học các web thống kê lớn)
- Tham khảo OP.GG, U.GG, Lolalytics, Mobalytics, Prydwen. Điểm chung web mình còn thiếu: bảng số liệu sắp xếp được theo cột, có số chênh lệch so với kỳ trước, ngưỡng số trận tối thiểu cho tỉ lệ thắng.
- Thêm chế độ "Số liệu" (nút thứ ba cạnh Meta / Tự xếp): mỗi tướng một dòng với Thắng / Chọn / Cấm / Có mặt / Trận ở ĐTDV, số nhỏ bên dưới là chênh lệch so với mùa trước; bấm tên cột để sắp xếp (mặc định Có mặt); tướng dưới 10 trận chữ xám và xếp sau khi sắp theo tỉ lệ thắng; dùng chung bộ lọc đường, lớp, thay đổi, tìm kiếm; bấm dòng mở bảng chi tiết. Hàng tiêu đề bảng dính dưới thanh lọc.
- Điện thoại ≤480px: nút Lọc chỉ còn biểu tượng (44×44) để ô tìm đủ rộng; ≤374px bảng số liệu ẩn ảnh đại diện cho vừa 4 cột.
- Sửa lỗi cũ: gõ tên tướng rồi Enter, bảng chi tiết mở ra rồi đóng ngay (Enter "bấm" luôn nút × vừa được focus).
- Không làm: "Khắc chế" (weak against) như OP.GG vì chưa có nguồn số liệu đối đầu.

## 2026-10-30 (làm tay: chủ web muốn dấu tăng/giảm sức mạnh dễ nhận hơn)
- Dấu sức mạnh trước là ô tối có dấu +/−/± nét mảnh, trông giống ô lớp tướng bên trái nên khó nhận. Nay là **hình tròn đặc màu** + mũi tên có thân nét đậm:
  xanh ↑ tăng, đỏ ↓ giảm, vàng cam ⇅ điều chỉnh. Dấu bậc giữ **ô vuông chữ V** (khác cả hình lẫn nét). Trên ảnh tướng có viền tối mỏng để nổi trên ảnh sáng.
- Ảnh tải về vẽ giống hệt (drawMarks). Mục "Ký hiệu trên thẻ" trong Cách đọc bảng dùng đúng dấu thật, thêm dòng lên/xuống bậc.
- Cùng ngày, chủ web muốn "hiện đại, hợp vibe web hơn": đổi mọi dấu (bậc, sức mạnh, MỚI) sang kiểu **kính tối phát sáng** cùng họ với ô lớp tướng —
  nền tối mờ có sắc màu từ trên xuống, viền mảnh + nét cùng màu, quầng sáng nhẹ. Giữ quy ước hình: bậc = ô vuông chữ V, sức mạnh = tròn mũi tên, MỚI = viên thuốc.
  Ngoài ảnh tướng ở nền sáng: nền màu nhạt + nét đậm màu (`--mcd`) cho đủ tương phản. Ảnh tải về vẽ giống hệt (`MKC` trong drawMarks).

## 2026-10-30 (việc định kỳ: rà UI/UX điện thoại)
- Đã thử bằng Playwright, thao tác chạm: iPhone 13, iPhone SE, Pixel 7, Android 360px, màn 320px, xoay ngang 844×390; sáng và tối. Các bước: tải trang, menu (mở, đóng ×, bấm từng mục từ đầu/giữa/cuối trang),
  sân khấu (đổi tab, vuốt, Xem chi tiết), thanh dính + hàng đường, chọn đường, tìm có/không kết quả, bộ lọc (kể cả đường không có tướng khớp), bảng chi tiết (build, hộp thông tin món đồ, Bộ chiêu thức, đóng),
  link `#tuong-zata-mid`, Tự xếp (chọn + đặt hàng, thanh báo), Số liệu, đổi sáng/tối, chân trang. Không lỗi JS, không ảnh 404, không tràn ngang, menu tới đúng mục (không nhảy về đầu trang), ảnh thẻ menu tải đủ.
- Sửa: **ô tìm trên điện thoại quá hẹp** (320px: 42px, gõ vào không thấy chữ, chỉ thấy nút ×; 360–390px: 82–96px, tên dài như Eland'orr bị cắt). Nay khi đang gõ (≤480px) tạm ẩn Meta/Tự xếp/Số liệu, ô tìm giãn hết hàng (232–320px); bỏ focus thì hàng chế độ hiện lại. Chiều cao thanh dính không đổi.
- Sửa: **điện thoại xoay ngang** (rộng 844px) trước đây dùng kiểu máy tính nên còn những thứ đã bỏ trên điện thoại vì gây màn trắng/xanh ở Chrome Android: kính mờ (menu, nút bảng chi tiết), hiệu ứng hiện từ mờ `filter:blur` ở tiêu đề mục,
  `will-change` thường trực ở 5 ảnh sân khấu, và ảnh sân khấu s3/ 2772px (sizes 1040px × DPR 3). Nay áp các quy tắc điện thoại cho `(pointer:coarse) and (max-height:500px)`; ảnh s3 không dùng trên điện thoại (`PHONE` trong app.js: màn cảm ứng, cạnh ngắn ≤500px), máy tính bảng và máy tính giữ nguyên.
- Vùng chạm trên màn cảm ứng: nút chia sẻ/‹ ›/× trong bảng chi tiết khi xoay ngang 38 → 44px; phép bổ trợ trong build 36 → 40px; mục trong menu 38 → 42px. Ẩn phím tắt "/" ở ô tìm và chữ "Trên máy tính, rê chuột…" khi xoay ngang.
- Hiệu năng (measure.js, 3 lần, đo bản cũ/mới cùng lúc): điện thoại TBT 412 → 429 ms, mở bảng chi tiết 581 → 569 ms, LCP 580 → 600 ms (dao động); máy tính không đổi đáng kể. Không thêm yêu cầu tải.
- Kiểm 1440/390 sáng/tối: 5 slide, bảng có thẻ (147/38), không tràn ngang, không lỗi JS.
- Không tự kiểm được: chữ "SỐ LIỆU" dấu tách rời trong ảnh chụp là do máy kiểm tra không tải được font Google (JetBrains Mono), máy thật bình thường. Cần chủ web thử máy thật: gõ tìm trên điện thoại (hàng Meta/Tự xếp/Số liệu ẩn tạm khi gõ),
  xoay ngang Chrome Android (còn màn trắng/xanh không), trình duyệt trong Zalo/Messenger/TikTok.
- Ý tưởng để lần sau: xoay ngang, bảng chi tiết cao ~310px nên ảnh bìa chiếm gần hết, phải cuộn trong bảng mới thấy build — cân nhắc thu ảnh bìa khi màn thấp.
