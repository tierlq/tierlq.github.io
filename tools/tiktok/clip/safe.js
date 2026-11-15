const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+path.resolve('index.html'));await p.evaluate(()=>document.fonts.ready);
const T=JSON.parse(require('fs').readFileSync('tl.json'));
const out=await p.evaluate((T)=>{const res=[];
 const ids=['a1','a1b','a2','a2b','a3','a3b','a4','a5','a6'];
 for(let t=0;t<T.D;t+=0.1){window.render(t);
  for(const id of ids){const el=document.getElementById(id);if(+el.style.opacity>0.5){const r=el.getBoundingClientRect();res.push([id,Math.round(r.right),Math.round(r.top),Math.round(r.bottom)])}}
  const s=document.getElementById('subs');if(+s.style.opacity>0.5&&s.innerHTML){const rg=document.createRange();rg.selectNodeContents(s);const r=rg.getBoundingClientRect();res.push(['subs',Math.round(r.right),Math.round(r.top),Math.round(r.bottom)])}
 }
 const m={};for(const [id,r,t,b] of res){m[id]=m[id]||[0,9999,0];m[id][0]=Math.max(m[id][0],r);m[id][1]=Math.min(m[id][1],t);m[id][2]=Math.max(m[id][2],b)}return m},T);
console.log(JSON.stringify(out));await b.close()})();
