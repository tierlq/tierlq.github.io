const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
 const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:1280,height:900},deviceScaleFactor:2,bypassCSP:true});
 const p=await ctx.newPage();
 await p.route(/^https?:\/\/(?!localhost)/,r=>r.abort());
 await p.goto('http://localhost:8765/index.html',{waitUntil:'load'});
 await p.waitForTimeout(2500);
 await p.evaluate(()=>{const c=document.querySelector('.card[data-id="aya-sp"]');c.scrollIntoView({block:'center'})});
 await p.waitForTimeout(1200);
 const rc=await p.evaluate(()=>{const c=document.querySelector('.card[data-id="aya-sp"]').getBoundingClientRect();return [c.x,c.y,c.width,c.height]});
 console.log(JSON.stringify(rc));
 // focus ring look: add outline via CSS
 await p.addStyleTag({content:'.card[data-id="aya-sp"]{outline:0}'});
 await p.screenshot({path:'web_board2.png'});
 fs.writeFileSync('rc2.json',JSON.stringify(rc));
 await b.close();
})();
