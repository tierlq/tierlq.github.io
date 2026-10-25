# Nhật ký hiệu năng

Việc định kỳ mỗi Chủ nhật (9:47 giờ Việt Nam) đọc tệp này trước khi làm, đo lại, rồi thêm một mục mới ở cuối.
Cách đo chuẩn (từ 12/10/2026): `python3 tools/perf/serve.py 8770 &` (máy chủ cục bộ có nén gzip như GitHub Pages) rồi
`NODE_PATH=$(npm root -g) node tools/perf/measure.js http://localhost:8770/ 5` (lấy trung vị 5 lần). Playwright + CDP, tắt bộ nhớ đệm.
Không tính Google Fonts và Google Analytics (môi trường chạy không vào được hai dịch vụ này).
- Điện thoại: 390×844, DPR 3, CPU chậm 4 lần, mạng 1,6 Mbps / độ trễ 150 ms.
- Máy tính: 1440×900, không giới hạn.
- Chỉ số: LCP, CLS, TBT (tổng phần long task vượt 50 ms, đo tới 3 giây sau khi bảng có thẻ), thời gian tới khi bảng có thẻ tướng,
  thời gian mở bảng chi tiết tướng đầu tiên, dung lượng tải và số yêu cầu lần đầu.

## 2026-10-12 — số đo gốc đầu tiên (máy chủ không nén, 1 lần đo, chỉ để tham khảo)
| Thiết bị | LCP | CLS | TBT | Bảng có thẻ | Mở bảng chi tiết | Tải lần đầu | Yêu cầu |
|---|---|---|---|---|---|---|---|
| Điện thoại (giả lập chậm) | 856 ms | 0,002 | 919 ms | 3141 ms | 801 ms | 347 kB | 29 |
| Máy tính | 100 ms | 0,009 | 87 ms | 514 ms | 201 ms | 347 kB | 29 |

Kích thước thư mục: p/ 800 KB, s/ 3,5 MB (ảnh bìa, tải dần), b/ 380 KB, assets/ 136 KB.
Ý tưởng để lần sau: TBT trên điện thoại khá cao (919 ms), xem phần nào chạy lâu lúc mở trang (vẽ thiên hà WebGL, dựng bảng, fixTextZoom);
mở bảng chi tiết trên điện thoại mất ~0,8 giây.

## 2026-10-12 — lần tối ưu đầu tiên (làm tay cùng chủ web, đo bằng tools/perf, trung vị 3–5 lần)
| Điện thoại (giả lập chậm) | Trước | Sau |
|---|---|---|
| Bảng tier có thẻ tướng | 1879 ms | 1146 ms |
| Tải tới lúc bảng hiện | 150 kB / 17 yêu cầu | 55 kB / 5 yêu cầu |
| TBT | 352 ms | 256 ms |
| LCP / CLS | 500 ms / 0 | 484 ms / 0 |
Máy tính không đổi đáng kể (bảng hiện ~0,5 giây, LCP ~0,1 giây).
- assets/builds.js (dữ liệu build) chuyển xuống sau app.js và tải async: bảng tier không phải chờ nó.
  Mở bảng chi tiết trước khi build tải xong thì hiện "Đang tải build…" rồi tự hiện build (`waitBuilds` trong app.js).
- Ảnh nền sân khấu (kể cả slide đầu) và ảnh tướng hạng 2–3 không tải lúc mở trang nữa; tải khi người xem bắt đầu cuộn,
  khi sân khấu cách màn hình 150px, hoặc 2,5 giây sau khi trang tải xong.
- Thêm tools/perf/serve.py và tools/perf/measure.js để các tuần sau đo cùng một cách.
Ý tưởng để lần sau: TBT trên điện thoại phần lớn là vẽ thiên hà WebGL (trong môi trường đo không có GPU nên bị phóng đại);
mở bảng chi tiết ~0,5–0,7 giây trên điện thoại chậm (dựng HTML + ảnh bìa 960px), xem có giảm được không.

## 2026-10-12 — sau khi thêm hộp thông tin trang bị
- builds.js lớn thêm (thêm giá, chỉ số, nội tại từng món: 46 → 67 kB chưa nén). Nạp async ngay từ HTML làm bảng tier chậm lại ~350 ms
  trên điện thoại chậm (1333 → 1684 ms), nên đổi sang để app.js tự tải builds.js 1,2 giây sau khi trang tải xong (hoặc khi mở bảng chi tiết).
- Điện thoại (giả lập chậm, trung vị 5 lần): bảng có thẻ 1260 ms, tải tới lúc bảng hiện 50 kB / 4 yêu cầu, TBT 342 ms, LCP 504 ms.
- Máy tính: bảng có thẻ 551 ms, LCP 108 ms.

## 2026-10-18 — việc định kỳ Chủ nhật
Đo bằng `tools/perf` (trung vị 5 lần, chạy 2 lượt xen kẽ bản cũ/bản mới trên cùng máy). Không tính Google Fonts và Google Analytics.
Máy đo tuần này chậm hơn tuần trước: bản 12/10 (61c0ff6) đo lại cho bảng có thẻ 1584 ms (tuần trước ghi 1260 ms), nên chỉ so trước/sau trong cùng lần chạy.

| Điện thoại (giả lập chậm) | Trước (432b91a) | Sau |
|---|---|---|
| LCP (= lần vẽ đầu, chữ ở đầu trang) | 552–616 ms | 428 ms |
| Bảng tier có thẻ tướng | 1908–1998 ms | 1301–1347 ms |
| TBT | 715–829 ms | 591–789 ms |
| CLS | 0,000 | 0,001 (nhiễu, cùng nguồn: hiệu ứng chữ tiêu đề) |
| Mở bảng chi tiết (tới khi hiện ảnh đồ) | 905–929 ms | 841–922 ms |
| Tải lần đầu | 52 kB / 4 yêu cầu tới lúc bảng hiện; 163 kB / 17 yêu cầu sau 3 giây | không đổi |
Máy tính: không đổi (LCP 120–148 ms, bảng có thẻ 505–600 ms, TBT 143–210 ms, mở bảng chi tiết 278–389 ms — trong mức dao động).
Lần mở sau (đã có service worker, máy chủ thử trễ 150 ms mỗi yêu cầu): boot/data/app.js lấy từ bộ nhớ đệm ~15 ms thay vì ~200 ms mỗi tệp;
bảng có thẻ 766–826 → 635–668 ms.

Đã làm:
- `boot.js`, `data.js`, `app.js` nạp bằng `defer`. Trước đây `boot.js` là script chặn trong `<head>`: trang phải chờ thêm một lượt tải
  (~150 ms trên mạng yếu) mới vẽ được chữ đầu tiên. Thứ tự chạy giữ nguyên (boot → data → app, trước DOMContentLoaded), GA vẫn nhận sự kiện,
  chống nhúng iframe vẫn ẩn trang (thử bằng iframe khác cổng). Riêng trong iframe, trang có thể hiện thoáng chốc trước khi bị ẩn.
- `fmt` (số "Lượt chọn"/"Lượt cấm") không dùng `toLocaleString("vi-VN")` nữa: lần gọi đầu nạp dữ liệu ngôn ngữ Intl mất ~50–130 ms
  (CPU chậm 4 lần) ngay trên đường dựng bảng. Kết quả giống hệt ("2.140", "1.710").
- `sw.js`: tệp `assets/*.js?v=…` dùng ngay bản đã lưu, lấy bản mới ở nền (tên có `?v=` đổi mỗi lần sửa nên không bị cũ);
  ảnh đồ/ngọc/phép trong `b/` lưu lâu như ảnh tướng (trước đây mỗi lần mở bảng chi tiết lại hỏi mạng). Không đổi `V` (không thay ảnh).

Kiểm tra: 1440/390, sáng/tối: 5 slide, bảng có thẻ, không tràn ngang, 147/147 bảng chi tiết mở được (build + Bộ chiêu thức đủ),
link `#tuong-…` mở bảng chi tiết, tải ảnh tier list ra tệp (cùng kích thước với bản cũ), không lỗi JS, không vi phạm CSP, không ảnh 404,
mất mạng vẫn mở được trang. Ảnh chụp trước/sau giống từng điểm ảnh, trừ thiên hà (hạt sinh ngẫu nhiên mỗi lần tải).

Đã xem rồi bỏ:
- Hoãn dựng thiên hà WebGL (~100 ms CPU chậm) tới sau lần vẽ đầu: thiên hà sẽ hiện trễ một nhịp, nhìn thấy được.
- Dừng thiên hà khi mở bảng chi tiết: lớp phủ chỉ tối 72%, thiên hà vẫn nhìn thấy sau lớp phủ.
- `measure()` và `fitOne` ép tính bố cục (~70–200 ms / ~90 ms CPU chậm) nhưng đó là lần bố cục đầu, bỏ đi thì trình duyệt vẫn phải làm.
Ý tưởng để lần sau:
- TBT trên điện thoại phần lớn là từng khung hình thiên hà (~60 ms mỗi khung khi không có GPU); trên máy thật nhẹ hơn nhiều. Cân nhắc giảm số hạt
  khi `deviceMemory`/`hardwareConcurrency` thấp hơn nữa, hoặc vẽ 30 khung/giây trên điện thoại (cần so mắt độ mượt).
- `data.js` dòng sắp xếp `HEROES` (`localeCompare(…, "vi")`) tốn ~70 ms CPU chậm lần đầu; không sửa vì thuộc dữ liệu/cách xếp.
- Lần bố cục đầu trang (~120 ms CPU chậm cho 144 phần tử) phần lớn do dò font hệ thống trong môi trường đo, có thể không đúng trên điện thoại.

## 2026-10-25 — việc định kỳ Chủ nhật
Đo bằng `tools/perf` (trung vị 5 lần, 2 lượt xen kẽ bản cũ 062552d / bản mới trên cùng máy). Không tính Google Fonts và Google Analytics.
Thêm phép đo độ mượt khi cuộn qua sân khấu "Mạnh nhất mỗi đường" (điện thoại 390px, CPU chậm 4 lần, cuộn 20px mỗi khung, trace Chromium, trung vị 5 lần).

| Điện thoại (giả lập chậm) | Trước | Sau |
|---|---|---|
| Tính lại kiểu (style) mỗi khung khi cuộn qua sân khấu | 11,3–11,7 ms | 1,8–2,4 ms |
| Tổng việc luồng chính mỗi khung (style + layout + paint + JS) | 17,4–17,5 ms | 6,9–8,1 ms |
| Khung hình trung bình / số khung > 34 ms (≈ 80 khung) | 36,7–37,2 ms / 27 | 28,6–30,0 ms / 13–17 |
| LCP / CLS | 400–436 ms / 0 | 396–404 ms / 0 |
| Bảng tier có thẻ tướng | 1151–1273 ms | 1157–1193 ms |
| TBT | 247–289 ms | 273–288 ms (trong mức dao động, đoạn mã sửa không chạy lúc mở trang) |
| Mở bảng chi tiết | 556–689 ms | 519–684 ms |
| Tải lần đầu | 58 kB / 4 yêu cầu tới lúc bảng hiện; 108 kB / 14 yêu cầu sau 3 giây | không đổi |
Máy tính: LCP 120–140 ms, bảng có thẻ 544–581 ms, mở bảng chi tiết 373–400 ms — như cũ. TBT máy tính 245–330 ms dao động mạnh vì phần lớn là
từng khung thiên hà WebGL vẽ bằng CPU (máy đo không có GPU).
Cuộn hết trang trên điện thoại tải tổng 574 kB / 53 yêu cầu (2 ảnh sân khấu s3/ 307 kB, 46 ảnh chân dung 194 kB); máy tính 936 kB / 137 yêu cầu.

Đã làm:
- Hiệu ứng thị sai sân khấu khi cuộn (`scrollFx` trong app.js): trước đây mỗi khung đặt 3 biến CSS (`--s`, `--ty`, `--tc`) trên `#stage`; biến CSS được kế thừa
  nên trình duyệt phải tính lại kiểu cho mọi phần tử trong 5 slide mỗi khung. Nay ghi thẳng `transform` (cùng công thức, cùng chuỗi số) lên 5 ảnh nền
  và 5 khối chữ, chỉ ghi khi giá trị đổi. Đã so `getComputedStyle(...).transform` ở 3 vị trí cuộn: giống hệt; ảnh chụp 390px sáng/tối giống từng điểm ảnh,
  1440px chỉ khác vài điểm ảnh khử răng cưa ở chữ (nhiễu hiệu ứng chữ hiện dần).

Kiểm tra: 1440/390, sáng/tối: 5 slide, bảng có thẻ, không tràn ngang, 146/146 bảng chi tiết mở được (build + Bộ chiêu thức), link `#tuong-zata-mid`
mở bảng chi tiết, tải ảnh tier list ra tệp (1,73 MB, như cũ), không lỗi JS, không vi phạm CSP, không ảnh 404.

Đã thử rồi bỏ:
- Vệt chạy của nút "Khám phá" ở đầu trang (máy tính) đang hoạt ảnh thuộc tính `top` → mỗi khung phải bố cục + vẽ lại (60 lần layout, 116 lần paint / 3 giây khi
  đứng yên ở đầu trang). Đổi sang `transform:translateY(350%)` (cùng quãng đường) thì hết layout/paint, nhưng TBT máy tính trong môi trường đo xấu đi rõ
  (trung vị 242–331 → 413–428 ms, đo 2 lượt × 7 lần), có lẽ do lớp hợp thành thêm tranh CPU với thiên hà vẽ bằng phần mềm. Không đạt điều kiện "không chỉ số nào xấu đi"
  nên bỏ; có thể thử lại nếu có cách đo trên máy có GPU.
Ý tưởng để lần sau:
- Đầu trang (thiên hà) vẫn là chỗ khung hình nặng nhất khi cuộn (mọi khung > 50 ms đều ở 900px đầu), nhưng phần lớn do máy đo không có GPU.
- Điện thoại 390px DPR 3 chọn ảnh sân khấu s3/ (2772px, 114–193 kB/ảnh) vì `sizes` là 1040px; s2/ (1386px) đã đủ ~1170px điểm ảnh cần cho màn 390px.
  Không đổi vì chủ web muốn sân khấu nét nhất (mục "Đã chốt" uiux-log) — chỉ hỏi chủ web nếu cần tiết kiệm dữ liệu di động.
