# Ảnh xem trước khi chia sẻ trang Đoán tướng (og-doan-tuong.jpg, 1200x630). Chạy: python3 tools/game/og.py
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
W, H = 1200, 630
INTER = '/usr/share/fonts/opentype/inter/Inter-%s.otf'
MONO = '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
GOLD, CREAM, MUTED = (233, 207, 143), (243, 242, 239), (176, 172, 162)

im = Image.new('RGB', (W, H), (0, 0, 0))
# nền: quầng xanh tím giống đầu trang chủ
glow = Image.new('L', (W, H), 0); ImageDraw.Draw(glow).ellipse((520, -120, 1320, 760), fill=255)
glow = glow.filter(ImageFilter.GaussianBlur(160))
im.paste(Image.new('RGB', (W, H), (26, 30, 74)), (0, 0), glow)
d = ImageDraw.Draw(im)

# lưới 3x3 chân dung, ô giữa là dấu ?
keys = ['nakroth', 'violet', 'trieuvan', 'florentino', None, 'lauriel', 'butterfly', 'murad', 'tulen']
S, G, X0, Y0 = 138, 14, 700, 92
for i, k in enumerate(keys):
    x, y = X0 + (i % 3) * (S + G), Y0 + (i // 3) * (S + G)
    if k:
        p = Image.open(os.path.join(ROOT, 'p', k + '.webp')).convert('RGB').resize((S, S), Image.LANCZOS)
        mask = Image.new('L', (S, S), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, S - 1, S - 1), 14, fill=255)
        im.paste(p, (x, y), mask)
        d.rounded_rectangle((x, y, x + S - 1, y + S - 1), 14, outline=(255, 255, 255, 40), width=1)
    else:
        d.rounded_rectangle((x, y, x + S - 1, y + S - 1), 14, fill=(20, 18, 10), outline=GOLD, width=3)
        f = ImageFont.truetype(INTER % 'Light', 92)
        d.text((x + S / 2, y + S / 2 + 4), '?', font=f, fill=GOLD, anchor='mm')

# chữ bên trái
d.text((72, 118), 'TRÒ CHƠI MỖI NGÀY  ·  TIERLQ.COM', font=ImageFont.truetype(INTER % 'Medium', 19), fill=MUTED)
ft = ImageFont.truetype(INTER % 'ExtraLight', 76)
d.text((68, 158), 'ĐOÁN TƯỚNG', font=ft, fill=CREAM)
d.text((68, 246), 'LIÊN QUÂN', font=ft, fill=CREAM)
d.text((72, 352), 'Đề mới lúc 0 giờ · 3 cách chơi', font=ImageFont.truetype(INTER % 'Regular', 28), fill=GOLD)
d.text((72, 392), 'Cổ điển · Qua kỹ năng · Qua hình ảnh', font=ImageFont.truetype(INTER % 'Regular', 24), fill=MUTED)
# một hàng ô màu như kết quả chia sẻ
cols = [(76, 196, 114), (232, 146, 54), (204, 64, 64), (76, 196, 114), (204, 64, 64), (76, 196, 114), (232, 146, 54)]
for i, c in enumerate(cols):
    x = 72 + i * 52; d.rounded_rectangle((x, 466, x + 42, 508), 6, fill=c)
d.text((72, 540), 'Chơi liên tục không giới hạn · không cần tài khoản', font=ImageFont.truetype(INTER % 'Regular', 20), fill=MUTED)
im.save(os.path.join(ROOT, 'og-doan-tuong.jpg'), quality=86, optimize=True, progressive=True)
print('og-doan-tuong.jpg', os.path.getsize(os.path.join(ROOT, 'og-doan-tuong.jpg')) // 1024, 'kB')
