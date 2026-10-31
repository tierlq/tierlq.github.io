#!/usr/bin/env python3
"""Tạo assets/counters.js (khắc chế / hợp cặp từng tướng) từ tools/counters/rovmeta_raw.txt.

Nguồn: danh sách "Weak against / Strong against / Best synergy" viết tay ở trang từng tướng của ROV META (https://rovmeta.com/heroes/<tên>),
server Thái, bản 1.64; chủ web yêu cầu tham khảo ngày 31/10/2026. Chỉ lấy danh sách tên tướng, không chép lời văn.
rovmeta_raw.txt: dòng 1 = từ điển tên (cách nhau dấu phẩy), dòng "===", rồi mỗi dòng
  <slug rovmeta>|<bị khắc chế bởi>|<khắc chế>|<hợp cặp>, mỗi tướng là số thứ tự trong từ điển viết hệ 36, 2 ký tự.
Chạy:  python3 tools/counters/emit.py        (sau đó node tools/seo/build.js và đổi ?v= trong index.html)
Tên quốc tế → tên Việt: Lu Bu = Lữ Bố, Zanis = Triệu Vân, Wukong = Ngộ Không, Diao Chan = Điêu Thuyền, Riktor = Richter, Jinnar = Jinna.
Tướng web không có ở nguồn (Celica) hoặc nguồn để trống (Tamyn) thì không có mục; tướng nguồn có mà web không có (Brunhilda, Mortos, Payna) bị bỏ.
"""
import re, json, os, sys, subprocess
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
raw = open(os.path.join(ROOT, 'tools/counters/rovmeta_raw.txt'), encoding='utf-8').read()
dic, body = raw.split('\n===\n'); names = dic.split(',')
ALIAS = {'lubu': 'lubo', 'zanis': 'trieuvan', 'wukong': 'ngokhong', 'diaochan': 'dieuthuyen', 'riktor': 'richter', 'jinnar': 'jinna'}
key = lambda s: ALIAS.get(re.sub('[^a-z]', '', s.lower()), re.sub('[^a-z]', '', s.lower()))
# khoá tướng của web (cùng cách đặt key với CLAUDE.md: bỏ dấu, chỉ giữ a–z)
js = ('const fs=require("fs"),vm=require("vm");const c={};vm.createContext(c);vm.runInContext(fs.readFileSync("assets/data.js","utf8").replace(/^const /gm,"var "),c);'
      'const key=n=>n.normalize("NFD").replace(/đ/g,"d").replace(/Đ/g,"D").replace(/[\\u0300-\\u036f]/g,"").toLowerCase().replace(/[^a-z]/g,"");'
      'console.log(JSON.stringify([...new Set(c.HEROES.map(h=>h.key))]))')
web = set(json.loads(subprocess.check_output(['node', '-e', js], cwd=ROOT).decode()))
out, skipped = {}, []
for ln in body.strip().split('\n'):
    slug, w, s, y = ln.split('|')
    k = key(slug)
    if k not in web or not (w or s or y):
        skipped.append(k); continue
    dec = lambda x: [key(names[int(x[i:i + 2], 36)]) for i in range(0, len(x), 2)]
    lists = [dec(w), dec(s), dec(y)]
    for l in lists:
        for h in l:
            if h not in web: sys.exit(f'{k}: tướng lạ trong danh sách: {h}')
    out[k] = lists + [slug]
head = ('/* Khắc chế và hợp cặp từng tướng. Tạo bằng python3 tools/counters/emit.py từ tools/counters/rovmeta_raw.txt, đừng sửa tay.\n'
        '   COUNTERS[khoá tướng] = [bị khắc chế bởi, khắc chế, hợp cặp, tên trang ROV META]. Nguồn: danh sách viết tay của ROV META (server Thái, bản 1.64), không phải tỉ lệ thắng. */\n'
        'const CNSRC={name:"ROV META",patch:"1.64",read:"31/10/2026",base:"https://rovmeta.com/heroes/"};\n')
body_js = 'const COUNTERS={' + ','.join(f'{json.dumps(k)}:{json.dumps(v, ensure_ascii=False, separators=(",", ":"))}' for k, v in sorted(out.items())) + '};\n'
open(os.path.join(ROOT, 'assets/counters.js'), 'w', encoding='utf-8').write(head + body_js)
print(f'{len(out)} tướng có mục; bỏ qua: {", ".join(sorted(skipped))}; web chưa có: {", ".join(sorted(web - set(out)))}')
