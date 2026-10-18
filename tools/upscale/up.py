"""Ảnh bìa siêu nét s3/<key>.webp (rộng 2772 = gấp đôi s2/) cho sân khấu "Mạnh nhất mỗi đường" trên màn lớn.

Phóng to s2/<key>.webp ×2 bằng Real-ESRGAN x2plus (AI làm nét, xoá vệt nén), lưu WebP chất lượng 82 (~150 kB).
Cài: pip install --break-system-packages spandrel   (kéo theo torch, chạy CPU được, ~80 giây/ảnh với 2 nhân)
Trọng số: https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.1/RealESRGAN_x2plus.pth  → truyền đường dẫn bằng --model
Chạy: python3 tools/upscale/up.py --model /đường/dẫn/RealESRGAN_x2plus.pth ryoma billow …   (bỏ qua key đã có s3/, trừ khi --force)
Sau khi tạo, thêm key vào S3_KEYS ở assets/app.js. Tamyn bỏ qua (nguồn chỉ 600px)."""
import sys, os, time, argparse
import numpy as np, torch
from PIL import Image
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
ap = argparse.ArgumentParser(); ap.add_argument('--model', required=True); ap.add_argument('--force', action='store_true'); ap.add_argument('keys', nargs='+')
a = ap.parse_args()
from spandrel import ModelLoader
torch.set_num_threads(max(1, os.cpu_count() or 1))
m = ModelLoader().load_from_file(a.model).eval(); S = m.scale
for k in a.keys:
    dst = os.path.join(REPO, 's3', k + '.webp')
    if k == 'tamyn' or (os.path.exists(dst) and not a.force): continue
    im = Image.open(os.path.join(REPO, 's2', k + '.webp')).convert('RGB')
    x = torch.from_numpy(np.asarray(im).copy()).permute(2, 0, 1).float()[None] / 255
    _, _, H, W = x.shape; T, P = 256, 16; out = torch.zeros(1, 3, H * S, W * S); t = time.time()
    with torch.inference_mode():
        for y0 in range(0, H, T):
            for x0 in range(0, W, T):
                ya, yb, xa, xb = max(0, y0 - P), min(H, y0 + T + P), max(0, x0 - P), min(W, x0 + T + P)
                o = m(x[:, :, ya:yb, xa:xb]); oy, ox = (y0 - ya) * S, (x0 - xa) * S
                th, tw = (min(H, y0 + T) - y0) * S, (min(W, x0 + T) - x0) * S
                out[:, :, y0 * S:y0 * S + th, x0 * S:x0 * S + tw] = o[:, :, oy:oy + th, ox:ox + tw]
    r = Image.fromarray((out[0].clamp(0, 1).permute(1, 2, 0).numpy() * 255).round().astype(np.uint8))
    if r.size[0] != W * 2: r = r.resize((W * 2, H * 2), Image.LANCZOS)
    r.save(dst, 'WEBP', quality=82, method=6)
    print(k, r.size, os.path.getsize(dst) // 1024, 'kB', round(time.time() - t), 's', flush=True)
