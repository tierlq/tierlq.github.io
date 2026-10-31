import json,os,re
os.chdir(os.path.dirname(os.path.abspath(__file__)))
from PIL import Image
D=os.environ.get('AVIX_DATA','/tmp/ext/avix-data')+'/data';A=os.environ.get('AVIX_ASSETS','/tmp/ext/avix');REPO=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
C=json.load(open('compiled.json'))
# Web chỉ dùng build riêng theo đường từ nguồn tiếng Việt (vn.txt, khoá "<key>@<đường>").
# Build chung ROV META trong raw.txt không còn hiện trên web (chỉ giữ để tra cứu).
B={k:v for k,v in C['B'].items() if '@' in k}
en=json.load(open(f'{D}/en/equipments.json'));vi=json.load(open(f'{D}/vi/equipments.json'))
EQ={e['equipmentId']:dict(e,vi=v['name']) for e,v in zip(en,vi)}
FIXVI={'frostys-revenge':'Trượng Băng'}
CAT={'attack':'atk','magic':'mag','defense':'def','movement':'boot','jungling':'jg','support':'sup'}
AR={a['arcanaId']:a for a in json.load(open(f'{D}/en/arcanas.json'))}
STATVI={'abilityPower':'Công phép','attackDamage':'Công vật lý','physicalPierce':'Xuyên giáp','physicalLifesteal':'Hút máu','criticalRate':'Tỉ lệ chí mạng','criticalDamage':'Sát thương chí mạng','attackSpeed':'Tốc đánh','physicalArmor':'Giáp','maxHp':'Máu tối đa','magicPierce':'Xuyên giáp phép','magicLifesteal':'Hút máu phép','hpRegen':'Hồi máu/5 giây','movementSpeed':'Tốc chạy','magicArmor':'Giáp phép','cooldownReduction':'Giảm hồi chiêu'}
PCT={'physicalLifesteal','criticalRate','criticalDamage','attackSpeed','magicLifesteal','movementSpeed','cooldownReduction'}
tal_en=json.load(open(f'{D}/en/talents.json'));tal_vi=json.load(open(f'{D}/vi/talents.json'))
TAL={t['talentId']:dict(t,vi=v['name'],desc=v['description']) for t,v in zip(tal_en,tal_vi)}
os.makedirs(f'{REPO}/b',exist_ok=True)
def icon(src,dst,size=72):
    im=Image.open(src).convert('RGBA');im.thumbnail((size,size),Image.LANCZOS)
    if im.size!=(size,size):
        c=Image.new('RGBA',(size,size),(0,0,0,0));c.paste(im,((size-im.size[0])//2,(size-im.size[1])//2));im=c
    im.save(dst,'WEBP',quality=72,method=6)
used_i=sorted({i for b in B.values() for i in b['i']});used_a=sorted({a for b in B.values() for a,_ in b['r']});used_t=sorted({t for b in B.values() for t in b['s']})
keep=set()
# Thông tin trang bị hiện khi trỏ/chạm vào đồ (giá, chỉ số, nội tại) — từ avix-data bản Việt, khớp trang Học viện của Garena
VIEQ={e['equipmentId']:e for e in vi}
ISTAT=[('attackDamage','Công vật lý',''),('abilityPower','Công phép',''),('attackSpeed','Tốc đánh','%'),('criticalRate','Tỉ lệ chí mạng','%'),
       ('physicalLifesteal','Hút máu','%'),('magicLifesteal','Hút máu phép','%'),('cooldownReduction','Giảm hồi chiêu','%'),('maxHp','Máu tối đa',''),
       ('physicalArmor','Giáp',''),('magicArmor','Giáp phép',''),('movementSpeed','Tốc chạy','%'),('hpRegen','Hồi máu mỗi 5 giây',''),
       ('maxMana','Năng lượng tối đa',''),('manaRegen','Hồi năng lượng mỗi 5 giây','')]
# Bản 29/09/2026 làm lại Giáp Thống Khổ: dữ liệu nguồn chưa đổi chỉ số → sửa theo ghi chú bản cập nhật của Garena
FIXSTAT={'mail-of-pain':{'attackDamage':50,'physicalArmor':300,'maxHp':700}}
FIXPAS={'mail-of-pain':{'Phản pháo':'Kích hoạt: Tăng hiệu ứng nội tại [Phản phệ] lên 25%, kéo dài 3 giây. Hồi chiêu 75 giây.'}}
INFO={}
for i in used_i:
    v=VIEQ[i];st=FIXSTAT.get(i,v['stats'])
    INFO[i]={'p':v['price'],'s':[f"+{st[k]}{u} {lb}" for k,lb,u in ISTAT if st.get(k)],
             'n':[[x.get('name') or 'Nội tại',FIXPAS.get(i,{}).get(x.get('name'),x['description'])] for x in v.get('passives',[])]}
    unk=set(st)-{k for k,_,_ in ISTAT}
    assert not unk,(i,unk)
ITEM={}
for i in used_i:
    e=EQ[i];ITEM[i]=[FIXVI.get(i,e['vi']),CAT[e['categoryId']],i,e['name']]
    icon(f"{A}/{e['asset']}",f'{REPO}/b/i-{i}.webp');keep.add(f'i-{i}.webp')
# Bảng ngọc: xuất cả 30 viên (không chỉ viên có trong build) cho trang /bang-ngoc/. Tên Việt theo trang Học viện Garena
# https://lienquan.garena.vn/hoc-vien/bang-ngoc/ (đọc 31/10/2026; dạng "<Màu> III <chỉ số>"), ghép với avix-data theo chỉ số.
# Hai viên tím Hút máu (reaper) và Tỷ lệ chí mạng/Máu (tyrant): trang Garena chưa liệt kê ở cấp III, tên theo cấp II của chính trang đó.
ARCVI={'red_wise':'Công phép','red_samurai':'Công vật lý','red_berserker':'Công vật lý/Xuyên giáp','red_bloodlust':'Công vật lý/Hút máu',
 'red_rampage':'Tỉ lệ chí mạng/Sát thương chí mạng','red_guardian':'Tốc đánh/Máu/Giáp','red_nomad':'Công phép/Xuyên thủ phép','red_sovereign':'Công phép/Tốc đánh',
 'red_savage':'Tỉ lệ chí mạng','red_blitz':'Tốc đánh/Tỉ lệ chí mạng',
 'purple_colossus':'Máu tối đa','purple_cleric':'Hút máu phép','purple_tyrant':'Tỷ lệ chí mạng/Máu','purple_reaper':'Hút máu','purple_undying':'Máu tối đa/Hồi máu',
 'purple_crusader':'Hút máu/Thủ phép','purple_vampire':'Công phép/Hút máu phép','purple_reliever':'Máu/Hồi máu/Tốc chạy','purple_assassin':'Công vật lý/Tốc chạy','purple_fairy':'Tốc đánh/Tốc chạy',
 'teal_bastion':'Giáp','teal_mythril':'Giáp/Giáp phép','teal_paladin':'Máu tối đa/Giảm hồi chiêu','teal_monarch':'Giáp phép','teal_hexer':'Công phép/Giảm hồi chiêu',
 'teal_dragoon':'Công vật lý/Xuyên giáp','teal_degenerate':'Tốc đánh/Xuyên giáp phép','teal_templar':'Giảm hồi chiêu','teal_darksider':'Hút máu phép/Giáp','teal_crusader':'Giáp/Giáp phép/Hồi chiêu'}
COLNAME={'red':'Đỏ','purple':'Tím','teal':'Xanh'}
assert set(ARCVI)==set(AR),set(AR)^set(ARCVI)
ARC={}
for a in sorted(AR):
    s=AR[a]['stats'];txt=' · '.join(f"{STATVI[k]} +{v}{'%' if k in PCT else ''}" for k,v in s.items());col=a.split('_')[0]
    ARC[a]=[col,txt,f"{COLNAME[col]} III {ARCVI[a]}"];icon(f"{A}/{AR[a]['asset']}",f'{REPO}/b/a-{a}.webp',64);keep.add(f'a-{a}.webp')
# Phù hiệu: tên Việt, nhánh, cấp, mô tả (avix-data bản Việt); ảnh b/e-<id>.webp
ENV={e['enchantmentId']:e for e in json.load(open(f'{D}/vi/enchantments.json'))}
BRV={'leagueofhumans':'Thành khởi nguyên','veda':'Tháp quang minh','lokheim':'Vực hỗn mang','afata':'Rừng nguyên sinh'}
ENCH={}
for e in sorted(C.get('E',[])):
    v=ENV[e];ENCH[e]=[v['name'][:1].upper()+v['name'][1:],v['categoryId'],v['level'],v['description']]
    icon(f"{A}/{v['asset']}",f'{REPO}/b/e-{e}.webp',64);keep.add(f'e-{e}.webp')
SP={}
for t in used_t:
    SP[t]=[TAL[t]['vi'],TAL[t]['desc']];icon(f"{A}/{TAL[t]['asset']}",f'{REPO}/b/t-{t}.webp',64);keep.add(f't-{t}.webp')
# xoá ảnh không còn dùng
for f in os.listdir(f'{REPO}/b'):
    if f not in keep: os.remove(f'{REPO}/b/{f}')
js='/* Build tham khảo cho từng tướng theo từng đường — tạo tự động từ tools/builds/vn.txt, đừng sửa tay.\n   BUILDS["<key>@<đường>"]: nguồn tiếng Việt (server Việt Nam), link trang nguồn ở trường l.\n   Tên đồ, ngọc, phép bổ trợ bản Việt và ảnh: AoV-IndeX (avix-data, avix-assets). Ảnh trong thư mục b/. */\n'
js+='const BSRC={"aov-builds.com":"AOV-Builds","gamezingmobile.com":"GameZing Mobile","lienquanmobile.gg":"LienquanMobile.GG","www.finhay.com.vn":"Finhay","cellphones.com.vn":"Sforum CellphoneS"};\n'
js+='const BITEM='+json.dumps(ITEM,ensure_ascii=False,separators=(',',':'))+';\n'
js+='const BINFO='+json.dumps(INFO,ensure_ascii=False,separators=(',',':'))+';\n'
js+='const BARC='+json.dumps(ARC,ensure_ascii=False,separators=(',',':'))+';\n'
js+='const BENCHB='+json.dumps(BRV,ensure_ascii=False,separators=(',',':'))+';\n'
js+='const BENCH='+json.dumps(ENCH,ensure_ascii=False,separators=(',',':'))+';\n'
js+='const BSPELL='+json.dumps(SP,ensure_ascii=False,separators=(',',':'))+';\n'
js+='const BUILDS={\n'+',\n'.join(f'  {json.dumps(k)}:'+json.dumps(v,ensure_ascii=False,separators=(",",":")) for k,v in sorted(B.items()))+'\n};\n'
open(f'{REPO}/assets/builds.js','w',encoding='utf-8').write(js)
print(len(js),'bytes',len(B),'builds',len(os.listdir(f'{REPO}/b')),'icons')
