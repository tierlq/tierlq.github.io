const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const mode=process.argv[2];
(async()=>{
 const b=await chromium.launch();
 const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
 await p.goto('file://'+path.resolve('index.html'));
 await p.evaluate(()=>document.fonts.ready);
 await p.waitForFunction(()=>[...document.images].every(i=>i.complete));
 const D=JSON.parse(fs.readFileSync('tl.json')).D;
 if(mode==='preview'){
   fs.mkdirSync('pv',{recursive:true});
   for(const t of process.argv.slice(3).map(Number)){
     await p.evaluate(t=>window.render(t),t);
     await p.screenshot({path:`pv/p_${t.toFixed(2)}.png`,omitBackground:true});
   }
 } else {
   fs.mkdirSync('frames',{recursive:true});
   const n=Math.ceil(D*30);
   for(let i=0;i<n;i++){
     await p.evaluate(t=>window.render(t),i/30);
     await p.screenshot({path:`frames/f${String(i).padStart(4,'0')}.png`,omitBackground:true});
   }
   console.log('frames',n);
 }
 await b.close();
})();
