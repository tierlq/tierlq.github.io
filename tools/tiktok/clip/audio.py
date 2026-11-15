import numpy as np,json,subprocess,wave
SR=44100
TL=json.load(open('tl.json'));D=TL['D'];c=TL['c'];e=TL['e'];B=TL['blocks'];SP=TL['SP']
N=int(D*SR)+SR
def tri(f,t):return 2*np.abs(2*((f*t)%1)-1)-1
def sq(f,t,d=.25):return np.where((f*t)%1<d,1.0,-1.0)
def note(m):return 440*2**((m-69)/12)
# voice: speed up then cut lines
subprocess.run(['ffmpeg','-v','error','-y','-i','voice2.wav','-af','atempo=%s'%SP,'-ar',str(SR),'-ac','1','vs.wav'],check=True)
w=wave.open('vs.wav');v=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float64)/32768;w.close()
voice=np.zeros(N)
for k,(a,b) in enumerate(TL['raw']):
    sa=max(0,a/SP-0.02);sb=b/SP+0.05
    seg=v[int(sa*SR):int(sb*SR)].copy()
    n=len(seg);f=int(0.012*SR);seg[:f]*=np.linspace(0,1,f);seg[-f:]*=np.linspace(1,0,f)
    st=int((c[k]-(a/SP-sa))*SR)
    if st<0: seg=seg[-st:];st=0
    voice[st:st+len(seg)]+=seg[:N-st]
voice/=max(1e-9,np.abs(voice).max())/0.8
# music
bpm=112;beat=60/bpm;t=np.arange(N)/SR
music=np.zeros(N)
roots=[45,45,41,43]  # A2 A2 F2 G2
chords=[[57,60,64],[57,60,64],[53,57,60],[55,59,62]]
bar=beat*4
for i in range(int(D/bar)+2):
    r=roots[i%4];ch=chords[i%4]
    for q in range(8):
        t0=i*bar+q*beat/2
        if t0>=D+0.5:break
        i0=int(t0*SR);L=int(beat/2*SR*0.9)
        if i0+L>N:break
        tt=np.arange(L)/SR
        env=np.exp(-tt*9)
        # bass (triangle) on every 8th
        music[i0:i0+L]+=0.30*tri(note(r),tt)*np.minimum(1,tt*200)*np.exp(-tt*5)
        # arpeggio (square 25%)
        n=ch[q%3]+(12 if q%4==3 else 0)
        music[i0:i0+L]+=0.10*sq(note(n+12),tt)*env
    # hat-ish noise on offbeats
    rng=np.random.default_rng(i)
    for q in range(4):
        t0=i*bar+q*beat+beat/2
        i0=int(t0*SR);L=int(0.05*SR)
        if i0+L>N:break
        music[i0:i0+L]+=0.05*rng.standard_normal(L)*np.exp(-np.arange(L)/SR*70)
music/=np.abs(music).max();music*=0.55
# sfx
sfx=np.zeros(N)
def hit(t0,vol=0.8):
    i0=int(t0*SR);L=int(0.28*SR);tt=np.arange(L)/SR
    thump=np.sin(2*np.pi*(120*np.exp(-tt*18)+45)*tt)*np.exp(-tt*14)
    rng=np.random.default_rng(int(t0*100));nz=rng.standard_normal(L)*np.exp(-tt*60)*0.5
    x=(thump+nz)*vol
    if i0+L<=N:sfx[i0:i0+L]+=x
def ting(t0,f=1760,vol=0.45):
    i0=int(t0*SR);L=int(0.45*SR);tt=np.arange(L)/SR
    x=(np.sin(2*np.pi*f*tt)+0.4*np.sin(2*np.pi*f*2*tt))*np.exp(-tt*9)*vol
    if i0+L<=N:sfx[i0:i0+L]+=x
def swoosh(t0,vol=0.35):
    i0=int(t0*SR);L=int(0.3*SR);tt=np.arange(L)/SR
    rng=np.random.default_rng(7);nz=rng.standard_normal(L)
    # simple moving-average lowpass sweep via cumulative window
    k=np.convolve(nz,np.ones(40)/40,mode='same')
    x=k*np.sin(np.pi*tt/0.3)**2*vol*3
    if i0+L<=N:sfx[i0:i0+L]+=x
WEB0=c[6]-0.02
hits=[0.0,B[0][1][0],c[2],B[2][1][0],c[5]]
tings=[0.9,c[1]+0.15,B[3][1][0],B[4][1][0],B[6][1][0]]
for h in hits:hit(max(0,h)+0.01)
for h in tings:ting(h)
swoosh(WEB0);swoosh(B[6][0][1]);ting(c[6]+0.0,2093,0.3)
# ducking
env=np.abs(voice);k=int(0.06*SR)
sm=np.convolve(env,np.ones(k)/k,mode='same');sm=np.convolve(sm,np.ones(k)/k,mode='same')
duck=np.clip(sm/0.03,0,1)
mg=1-(1-10**(-7/20))*duck
mix=voice*1.0+music*mg*0.42+sfx*0.55
mix=mix[:int(D*SR)]
# fade out last 0.4s
f=int(0.4*SR);mix[-f:]*=np.linspace(1,0,f)
mix/= max(1e-9,np.abs(mix).max())/0.9
out=(mix*32767).astype(np.int16)
w=wave.open('mix_raw.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(out.tobytes());w.close()
print('ok',D)
