# Checklist làm clip TikTok @bangtierlienquan

Mục đích kênh: kéo người xem về **tierlq.com**. Đọc file này trước khi làm clip mới, và ghi thêm điều học được sau mỗi lần đo số liệu.

> Ghi chú nguồn: bản tổng hợp đề xuất đầu tiên (rút từ phân tích các clip Top 5 rừng, Astrid, Sinestrea…) chỉ nằm trong khung chat và bị mất khi cuộc trò chuyện bị nén. Phần dưới viết lại từ những mốc còn lưu được, chưa chắc đủ hết. **Ai nhớ đề xuất nào còn thiếu thì thêm vào đây.**

## Mốc đo (đọc ở TikTok Studio, chỉ có sau khi đăng)
- Giữ chân ở giây 3: mục tiêu **≥ 65%**.
- Xem hết clip: bình thường 28–38%; Top 5 rừng đạt 39,8%.
- Tỉ lệ follow ≈ 0,1% lượt xem.
- Giờ đăng: khoảng **19:30–20:00** (follower hoạt động 17–21 giờ). Muốn thử trưa với tối thì so lượt xem 3 giờ đầu.
- Đo bằng tab Phân tích của từng clip (`/tiktokstudio/analytics/<id>/overview`), biểu đồ giữ chân đọc theo từng giây.

## Quy tắc làm clip
1. Dài 15–20 giây, khổ 1080×1920, 30 fps.
2. Hook trong 3 giây đầu: nêu một nghịch lý bằng số liệu (ví dụ "bị cấm 84% mà vẫn thắng 69%"), tem số hiện ngay trên hình đang chuyển động.
3. Phụ đề đốt vào hình, nằm trong vùng an toàn của TikTok (chữ cách lề phải ≥ 150 px, phụ đề từ y = 1300; hai dòng chạm y ≈ 1444, giống các clip cũ).
4. Tem số liệu hiện đúng lúc giọng nói tới ý đó.
5. Có một câu hỏi để kéo bình luận (cấm hay giảm sức mạnh? xếp lại thế nào?) rồi mới tới kêu gọi.
6. Cảnh cuối là ảnh chụp thật tierlq.com, nói và hiện chữ "tierlq.com", kèm "follow để biết tướng tiếp theo". Link bio chỉ dán được khi đủ 1.000 follower.
7. Chỉ dùng số liệu có trên web (`assets/data.js`); mẫu nhỏ thì nói thẳng (ví dụ Tamyn mới 45 trận). Không nhắc giải đấu nếu hình là trận tập/trận của chủ kênh.
8. Giọng đọc là AI (Vbee, "HN - Minh Quân"); nếu có người hỏi thì trả lời thật.
9. Âm lượng: chuẩn hoá ≈ −14 đến −15 LUFS và **đỉnh sau khi mã hoá AAC ≤ −1 dBFS** (bản v2 clip Tamyn chạm +0,2 dBFS vì chuẩn hoá −14 LUFS ở TP −1,5, phải làm lại).
10. Bình luận ghim và caption soạn sẵn cùng clip; người đăng là chủ kênh, Claude chỉ soạn nháp, không tự đăng, không tự trả lời bình luận.
11. Chọn ảnh bìa là khung có tem số liệu rõ nhất (clip Tamyn: khoảng giây 2,9).

## Chưa làm / còn bỏ ngỏ
- **Kết clip nối vòng về đầu clip** (loop-ending) chưa làm ở clip nào gần đây; clip Tamyn kết bằng "follow để biết tướng tiếp theo".
- Giọng Vbee đọc "tier L Q chấm com" chưa nghe thử; nghe và sửa trước khi đăng.
- Điểm mạnh/yếu và Khắc chế của Tamyn trên web còn trống (nguồn ROV META để trống).

## Cách đọc "tier L Q chấm com" trong kịch bản Vbee
Gõ `tier L Q chấm com` (không gõ "tierlq.com"). Chưa xác nhận chắc chắn Vbee đọc đúng; đổi cách gõ nếu nghe sai.

## Quy trình dựng (mẫu ở các thư mục clip trong phiên làm việc, không nằm trong repo)
Trang HTML có hàm `render(t)` cho từng thời điểm, Playwright chụp từng khung rồi ghép bằng ffmpeg; nhạc chiptune và hiệu ứng tạo bằng numpy; giọng Vbee tăng tốc ×1,1 và cắt khoảng lặng. **Các tệp mẫu này nằm ở thư mục tạm của phiên, sẽ mất khi phiên kết thúc** nếu chưa được chép vào repo.
