"""Ảnh động kiểu "live wallpaper" cho sân khấu "Mạnh nhất mỗi đường": tạo bản đồ dòng chảy a/<key>.webp.

Web (assets/app.js, khối ANIM) vẽ ảnh bìa s2/<key>.webp bằng WebGL và cho các vệt tóc, áo choàng, lửa, khói, mây
"chảy" theo bản đồ này (kỹ thuật flow map: lấy mẫu lệch theo hướng chảy, hai pha đan xen nên chảy liên tục không méo dần),
thêm hạt sáng bay và ánh sáng lấp lánh. Mặt, da, thân giữa giữ đứng yên.

a/<key>.webp (lossless, 1/4 kích thước ảnh): R,G = hướng chảy × độ mạnh (0,5 = đứng yên),
B = dải hào quang quanh tướng (nơi vẽ lửa năng lượng màu của đường). Độ lệch pha do shader tự tạo bằng nhiễu.
Hướng chảy = hướng nét vẽ (structure tensor), chọn chiều toả ra khỏi thân tướng và hơi đi lên (như gió thổi, lửa bốc).
Mặt nạ tướng (tools/anim/mask/<key>.png, nửa kích thước) = hợp 3 mô hình rembg (u2net, isnet-general-use, isnet-anime);
có sẵn thì dùng lại, chưa có thì tạo (cần pip install --break-system-packages "rembg[cpu]" opencv-python-headless).
Chạy: python3 tools/anim/make.py ryoma billow …   rồi thêm key vào A_KEYS ở assets/app.js (xem thử trước khi thêm)."""
import sys, os
import numpy as np, cv2
from PIL import Image
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
keys = sys.argv[1:]
if not keys: sys.exit(__doc__)
MD = os.path.join(REPO, 'tools', 'anim', 'mask'); os.makedirs(MD, exist_ok=True)

def mask_of(k, im):
    p = os.path.join(MD, k + '.png')
    if os.path.exists(p): return np.asarray(Image.open(p).convert('L').resize(im.size, Image.BILINEAR), np.float32) / 255
    from rembg import remove, new_session
    m = np.zeros(im.size[::-1], np.float32)
    for name in ['u2net', 'isnet-general-use', 'isnet-anime']:
        m = np.maximum(m, np.asarray(remove(im, session=new_session(name), only_mask=True), np.float32))
    Image.fromarray(m.astype(np.uint8)).resize((im.size[0] // 2, im.size[1] // 2), Image.LANCZOS).save(p, optimize=True)
    return m / 255

def sstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)

for k in keys:
    im = Image.open(os.path.join(REPO, 's2', k + '.webp')).convert('RGB')
    M = mask_of(k, im)
    W, H = im.size; w, h = W // 2, H // 2                      # tính ở nửa kích thước
    rgb = cv2.resize(np.asarray(im), (w, h), interpolation=cv2.INTER_AREA)
    m = cv2.resize(M, (w, h), interpolation=cv2.INTER_AREA)
    solid = (m > .5).astype(np.uint8)
    dist = cv2.distanceTransform(cv2.copyMakeBorder(solid, 40, 40, 40, 40, cv2.BORDER_REPLICATE), cv2.DIST_L2, 5)[40:-40, 40:-40]
    # da (mặt, tay): giữ yên
    hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV).astype(np.float32)
    hh, ss, vv = hsv[..., 0], hsv[..., 1] / 255, hsv[..., 2] / 255
    skin = (((hh <= 14) | (hh >= 172)) & (ss > .15) & (ss < .62) & (vv > .35)).astype(np.float32) * m
    skin = np.clip(cv2.GaussianBlur(cv2.dilate(skin, np.ones((7, 7), np.uint8)), (0, 0), 4) * 1.6, 0, 1)
    skinB = np.clip(cv2.GaussianBlur(cv2.dilate(skin, np.ones((15, 15), np.uint8)), (0, 0), 6) * 1.5, 0, 1)  # vùng đệm quanh mặt/da
    distOut = cv2.distanceTransform(1 - solid, cv2.DIST_L2, 5)
    flexIn = 1 - sstep(18, 48, dist)                           # trong bóng tướng: dải sát mép (tóc, áo choàng, lửa) chảy, thân giữa đứng yên
    aura = .55 * (1 - sstep(8, 80, distOut))                   # ngoài bóng: quầng quanh tướng (khói, hào quang) chảy, nền xa đứng yên
    S = (m * flexIn + (1 - m) * aura) * (1 - skinB)
    S = cv2.GaussianBlur(S.astype(np.float32), (0, 0), 2)
    # hướng nét vẽ
    g = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY).astype(np.float32) / 255
    gx = cv2.Sobel(g, cv2.CV_32F, 1, 0, ksize=3); gy = cv2.Sobel(g, cv2.CV_32F, 0, 1, ksize=3)
    Jxx = cv2.GaussianBlur(gx * gx, (0, 0), 5); Jyy = cv2.GaussianBlur(gy * gy, (0, 0), 5); Jxy = cv2.GaussianBlur(gx * gy, (0, 0), 5)
    th = .5 * np.arctan2(2 * Jxy, Jxx - Jyy)
    coh = np.sqrt((Jxx - Jyy) ** 2 + 4 * Jxy ** 2) / (Jxx + Jyy + 1e-6)
    ex, ey = -np.sin(th), np.cos(th)                           # dọc theo nét
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    cy, cx = (np.average(ys, weights=m + 1e-6), np.average(xs, weights=m + 1e-6))
    rx, ry = (xs - cx) / w, (ys - cy) / h - .9                 # toả ra khỏi thân + đi lên
    rn = np.sqrt(rx * rx + ry * ry) + 1e-6; rx, ry = rx / rn, ry / rn
    sg = np.sign(ex * rx + ey * ry); sg[sg == 0] = 1; ex, ey = ex * sg, ey * sg
    c = np.clip(coh, 0, 1)
    dx, dy = c * ex + (1 - c) * rx, c * ey + (1 - c) * ry
    dx, dy = cv2.GaussianBlur(dx, (0, 0), 3), cv2.GaussianBlur(dy, (0, 0), 3)
    n = np.sqrt(dx * dx + dy * dy) + 1e-6; dx, dy = dx / n * S, dy / n * S
    # A = dải hào quang quanh bóng tướng (lửa/năng lượng màu của đường bốc lên ở đây), nhẹ ở viền trong, tránh mặt
    aur = np.clip((1 - sstep(1, 64, distOut)) * (1 - solid) + (1 - sstep(0, 7, dist)) * .45 * solid, 0, 1) * (1 - .7 * skinB)
    aur = cv2.GaussianBlur(aur.astype(np.float32), (0, 0), 3)
    out = np.dstack([.5 + .5 * dx, .5 + .5 * dy, aur])        # ảnh đục (không dùng kênh alpha: trình duyệt có thể làm hỏng màu ở chỗ trong suốt)
    out = cv2.resize(out, (W // 4, H // 4), interpolation=cv2.INTER_AREA)
    Image.fromarray((np.clip(out, 0, 1) * 255).round().astype(np.uint8)).save(os.path.join(REPO, 'a', k + '.webp'), 'WEBP', lossless=True, quality=100, method=6)
    print(k, os.path.getsize(os.path.join(REPO, 'a', k + '.webp')) // 1024, 'kB')
