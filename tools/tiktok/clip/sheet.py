import subprocess,sys
from PIL import Image
ts=[float(x) for x in sys.argv[1:]]
ims=[]
for t in ts:
    subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{t:.3f}','-i','base.mp4','-frames:v','1','bf.png'])
    b=Image.open('bf.png').convert('RGBA');o=Image.open(f'pv/p_{t:.2f}.png').convert('RGBA')
    b.alpha_composite(o);ims.append(b.convert('RGB').resize((432,768)))
cols=5;rows=(len(ims)+cols-1)//cols
S=Image.new('RGB',(432*cols,768*rows))
for i,im in enumerate(ims):S.paste(im,((i%cols)*432,(i//cols)*768))
S.save('sheet.jpg',quality=85)
