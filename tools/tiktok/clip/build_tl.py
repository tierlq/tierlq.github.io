import json
SP=1.1
# raw line times in voice.wav (s) and inner blocks
LINES=[(0.0,3.692,[(0.0,1.90),(1.99,3.692)]),
(4.828,7.178,[(4.828,7.178)]),
(8.094,10.102,[(8.094,9.0815),(9.351,10.102)]),
(10.998,13.881,[(10.998,11.8284),(12.067,13.8807)]),
(14.7625,17.780,[(14.7625,15.0788),(15.55,17.7803)]),
(18.673,19.777,[(18.673,19.777)]),
(20.686,24.215,[(20.686,22.694),(22.9318,24.215)])]
G=[.30,.30,.22,.30,.30,.35]
c=[];e=[];blocks=[]
t=0.0
for i,(a,b,bl) in enumerate(LINES):
    c.append(t)
    blocks.append([[round(t+(x-a)/SP,3),round(t+(y-a)/SP,3)] for x,y in bl])
    t=t+(b-a)/SP
    e.append(round(t,3))
    if i<len(G): t+=G[i]
D=round(e[-1]+0.75,3)
out={'c':[round(x,3) for x in c],'e':e,'blocks':blocks,'D':D,'SP':SP,'raw':[(a,b) for a,b,_ in LINES]}
json.dump(out,open('tl.json','w'))
open('tl.js','w').write('window.TL='+json.dumps(out)+';')
print(json.dumps(out))
