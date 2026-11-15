# Mẫu dựng clip TikTok (bản Aya 11/11/2026)

Chép cả thư mục ra ngoài repo rồi sửa cho tướng mới. Cần Node + Playwright, Python + numpy + Pillow, ffmpeg.

1. Giọng Vbee ("HN - Minh Quân") tải về → `voice.wav`. Tìm khoảng lặng: `ffmpeg -i voice.wav -af silencedetect=n=-40dB:d=0.12 -f null -`
   (lặng ~0,9 s = xuống dòng, 0,24–0,47 s = dấu phẩy).
2. `build_tl.py`: điền `LINES` (giây bắt đầu/kết thúc từng câu và từng vế trong `voice.wav`) và `G` (khoảng nghỉ giữa câu), chạy → `tl.json`, `tl.js` (giọng tăng tốc ×1,1).
3. Cảnh nền: `ffmpeg -ss 3 -i src.mp4 -t 25 -vf "crop=…,scale=1080:1000:flags=lanczos,pad=1080:1920:0:220:black,fps=30" -an -c:v libx264 -crf 14 base.mp4`
   (nguồn 2520×1080: `crop=1143:1056:688:0`; nguồn 1680×720: `crop=762:704:459:0`; cắt dưới để giấu UID).
4. Ảnh web: chạy máy chủ tĩnh ở gốc repo cổng 8765, `node shotb.js` (bảng tier) + chụp bảng chi tiết → `web_board2.png`, `web_modal_bars.png`.
5. `index.html`: sửa chữ trên tem (`.stamp`), thanh nguồn (`.srcbar`), mảng `SUBS`, `STAMPS`. Vùng an toàn: chữ không quá x = 930, phụ đề từ y ≈ 1292. Kiểm bằng `node safe.js`.
6. `node rend.js preview 0 1.5 …` + `python3 sheet.py 0 1.5 …` → `sheet.jpg` để xem nhanh; `node rend.js full` → `frames/`.
7. `python3 audio.py` → `mix_raw.wav` (chiptune, tiếng tem, ducking). Chỉnh âm lượng:
   `ffmpeg -i mix_raw.wav -af "volume=10.2dB,alimiter=limit=0.78:attack=2:release=60:level=false" mix2.wav` (đổi số dB để ra −14…−15 LUFS).
8. Ghép: `ffmpeg -i base.mp4 -framerate 30 -i frames/f%04d.png -i mix2.wav -filter_complex "[0:v][1:v]overlay=0:0:format=auto[v]" -map "[v]" -map 2:a -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart out.mp4`
9. Đo: `ffmpeg -i out.mp4 -af ebur128=peak=true -vn -f null -` (I −14…−15 LUFS, đỉnh ≤ −1 dBFS).
