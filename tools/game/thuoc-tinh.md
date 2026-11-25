# Giới tính và tầm đánh cho trò Đoán tướng (chế độ Cổ điển)

Dữ liệu nằm trong hằng `ATTR` ở đầu `assets/game.js` (`key:<tầm đánh><giới tính>`):
- Tầm đánh: `M` cận chiến, `R` đánh xa, `B` cả hai (Enzo).
- Giới tính: `m` Nam, `f` Nữ, `x` Khác (Y'bneth), `o` Tuỳ chọn (Flowborn, người chơi chọn giới tính).

Nguồn (đọc 25/11/2026 qua API của wiki Arena of Valor trên Fandom, `arenaofvalor.fandom.com/api.php`, nội dung trang từng tướng):
- Tầm đánh: ô `Attackrange` của hộp thông tin (Melee / Ranged / Long Range / Near / Medium; Enzo ghi "Ranged / Melee").
- Giới tính: đại từ trong phần Lore (she/her so với he/his); Zip và TeeMee đọc câu trong Lore ("Zip is he", "the brothers").
- Chỗ wiki không có (không có trang: Celica, Tamyn; hộp thông tin không ghi tầm đánh: Baldum, Billow, Cresht, Dyadia, Edras, Evita, Florentino, Flowborn, Gildur, Goverra, Heino, Iggy, Kaine, Keera, Lumburr, Max, Mina, Quillen, Slimz, Stuart, Taara, Tamyn, Thane, The Flash, Wisp, Zephys): tầm đánh theo lớp chính của tướng trên web (Pháp sư, Xạ thủ, Trợ thủ = đánh xa; còn lại cận chiến); giới tính do người biên tập điền (Celica, Dyadia, Evita, Goverra, Mina, Veres: Nữ; Edras, Heino, Kriknak, Tamyn: Nam).
- Wiki do cộng đồng viết, có thể sai. Có chỗ còn nghi: Arum, Paine, Bolt Baron (wiki ghi đánh xa), Liliana (wiki ghi đánh xa, dạng cáo đánh gần). Người chơi báo sai thì sửa thẳng trong `ATTR`, đổi `?v=`.

Tướng mới: thêm một mục vào `ATTR`; `tools/check/smoke.js` báo lỗi nếu tướng nào thiếu.

## Năm ra mắt (25/11/2026, chủ web: "bỏ bậc garena và thêm cho giống" LoLdle)
Hằng `YEAR` trong `assets/game.js` (`key:<năm − 2000>`). Nguồn: bảng "Hero(es) release timeline" ở trang Heroes của wiki Arena of Valor (Fandom, cập nhật khoảng 20/11/2026), là ngày ra mắt bản quốc tế nên có thể lệch máy chủ Việt Nam vài tháng (VN thường có tướng sớm hơn). 20 tướng đầu (Chaugnar … Valhein) wiki ghi chung 2016. Dyadia (2026), Edras (2025), Tamyn (2026), Evita (2026), Flowborn (2026) wiki chưa ghi nên lấy ngày ra mắt AoV ở trang tướng trên Liquipedia (API, 25/11/2026). Celica không có ở cả hai nguồn nên để trống (ô hiện "–", luôn đỏ).
Chưa làm "Vùng đất" và "Chủng loài"/"Tài nguyên" như LoLdle: wiki chỉ ghi nơi sinh cho khoảng 68/129 tướng, ô năng lượng (mana) ghi lẫn lộn.
