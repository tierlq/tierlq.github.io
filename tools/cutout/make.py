"""Tạo lớp tách nền cho hiệu ứng ảnh nổi khối ở sân khấu "Mạnh nhất mỗi đường".

Với mỗi key: c/<key>.webp  = tướng đã tách nền (trong suốt, cùng khung với s2/<key>.webp)
             c/<key>-bg.webp = ảnh nền đã xoá tướng (lấp bằng inpaint) để khi hai lớp lệch nhau không thấy hai hình tướng.
             c/<key>-flex.webp = bản đồ phần mềm (tóc, áo choàng) cho cử động toàn thân bằng WebGL.
Mặt nạ = hợp (max) của 3 mô hình rembg: u2net, isnet-general-use, isnet-anime (mỗi mô hình hỏng ở tướng khác nhau, gộp lại thì đủ).
Cài: pip install --break-system-packages "rembg[cpu]" opencv-python-headless  (mô hình tự tải từ GitHub về ~/.rembg).
Chạy: python3 tools/cutout/make.py ryoma billow ...   rồi thêm key vào C_KEYS trong assets/app.js (xem ảnh trước khi thêm!)."""
import sys, os
import numpy as np, cv2
from PIL import Image
from rembg import remove, new_session
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
MODELS = ['u2net', 'isnet-general-use', 'isnet-anime']
keys = sys.argv[1:]
if not keys: sys.exit(__doc__)
imgs = {k: Image.open(os.path.join(REPO, 's2', k + '.webp')).convert('RGB') for k in keys}
masks = {k: np.zeros(im.size[::-1], np.float32) for k, im in imgs.items()}
for m in MODELS:
    s = new_session(m)
    for k, im in imgs.items():
        masks[k] = np.maximum(masks[k], np.asarray(remove(im, session=s, only_mask=True), np.float32))
for k, im in imgs.items():
    a = masks[k]; a[a < 16] = 0
    a = cv2.dilate(a, np.ones((5, 5), np.uint8))                       # nới 2px để mép tướng không lộ viền nền cũ
    fg = im.copy(); fg.putalpha(Image.fromarray(a.clip(0, 255).astype(np.uint8)))
    fg.save(os.path.join(REPO, 'c', k + '.webp'), 'WEBP', quality=82, alpha_quality=90, method=6)
    # Nền: xoá vùng tướng (nới rộng 16px) rồi lấp ở nửa độ phân giải, chỉ dán phần đã lấp vào ảnh gốc
    rgb = np.asarray(im); h, w = a.shape
    hole = cv2.dilate((a > 24).astype(np.uint8) * 255, np.ones((33, 33), np.uint8))
    sm = cv2.resize(rgb, (w // 2, h // 2), interpolation=cv2.INTER_AREA); hm = cv2.resize(hole, (w // 2, h // 2), interpolation=cv2.INTER_NEAREST)
    fill = cv2.inpaint(cv2.cvtColor(sm, cv2.COLOR_RGB2BGR), hm, 12, cv2.INPAINT_TELEA)
    fill = cv2.cvtColor(cv2.resize(fill, (w, h), interpolation=cv2.INTER_CUBIC), cv2.COLOR_BGR2RGB)
    fill = cv2.GaussianBlur(fill, (0, 0), 6)
    f = cv2.GaussianBlur(hole.astype(np.float32) / 255, (0, 0), 6)[..., None]
    bg = (rgb * (1 - f) + fill * f).astype(np.uint8)
    Image.fromarray(bg).save(os.path.join(REPO, 'c', k + '-bg.webp'), 'WEBP', quality=78, method=6)
    # Bản đồ "mềm" cho cử động toàn thân: phần gần mép bóng tướng (tóc, áo choàng, tay chân mảnh) = trắng (lay nhiều),
    # thân giữa = đen (gần như cứng). Mép khung ảnh không tính là mép bóng (phần người bị cắt ở đáy ảnh vẫn cứng).
    solid = (a > 128).astype(np.uint8)
    pad = cv2.copyMakeBorder(solid, 60, 60, 60, 60, cv2.BORDER_REPLICATE)
    dist = cv2.distanceTransform(pad, cv2.DIST_L2, 5)[60:-60, 60:-60]
    flex = np.clip(1 - dist / 46, 0, 1)                                # ngoài bóng = 1 để mép bóng lay ra được
    flex = cv2.GaussianBlur(flex.astype(np.float32), (0, 0), 5)
    Image.fromarray((flex * 255).astype(np.uint8)).resize((w // 4, h // 4), Image.LANCZOS).save(os.path.join(REPO, 'c', k + '-flex.webp'), 'WEBP', quality=70)
    print(k, os.path.getsize(os.path.join(REPO, 'c', k + '.webp')) // 1024, 'kB +', os.path.getsize(os.path.join(REPO, 'c', k + '-bg.webp')) // 1024, 'kB')
