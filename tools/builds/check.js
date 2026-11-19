// Kiểm tra build của mọi ô tướng: node tools/builds/check.js (chạy ở gốc repo). Lỗi → thoát mã 1.
// Ô có nhiều bộ (BUILDS[...].v) thì kiểm từng bộ, bộ nào cũng phải đủ đồ, ngọc, phép, phù hiệu và có tên (t).
const fs=require('fs'),vm=require('vm'),path=require('path');const R=path.join(__dirname,'..','..');const ctx={};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(R,'assets/data.js'),'utf8')+';this.HEROES=HEROES',ctx);
vm.runInContext(fs.readFileSync(path.join(R,'assets/builds.js'),'utf8')+';this.BUILDS=BUILDS;this.BITEM=BITEM;this.BARC=BARC;this.BSPELL=BSPELL;this.BENCH=BENCH',ctx);
const {HEROES,BUILDS,BITEM,BARC,BSPELL,BENCH}=ctx;let bad=0;
function problems(b,lane){const f=[];
  const cats=b.i.map(i=>BITEM[i]?BITEM[i][1]:'??'),jg=cats.includes('jg'),pun=b.s.includes('punish');
  if(cats.includes('??'))f.push('đồ lạ');if(b.r.some(([a])=>!BARC[a]))f.push('ngọc lạ');if(b.s.some(s=>!BSPELL[s]))f.push('phép lạ');
  if((b.e||[]).some(e=>!BENCH[e]))f.push('phù hiệu lạ');
  if(lane==='jg'&&!(jg&&pun))f.push('đi rừng thiếu đồ rừng hoặc Trừng Trị');
  if(lane!=='jg'&&(jg||(pun&&!(b.o||[]).includes('punish'))))f.push('đi đường mà có đồ rừng/Trừng Trị');
  if(lane==='sp'&&b.i.length&&!cats.includes('sup'))f.push('trợ thủ thiếu đồ trợ thủ');
  if(lane!=='sp'&&cats.includes('sup'))f.push('đi đường mà có đồ trợ thủ');
  return f}
for(const h of HEROES){const b=BUILDS[h.key+'@'+h.lane];let f=[];
  if(!b)f.push('chưa có build @'+h.lane+' trong vn.txt');
  else{f=problems(b,h.lane);
    if(b.v){if(!b.t)f.push('nhiều bộ mà bộ 1 thiếu tên (TITLE)');
      b.v.forEach((v,k)=>{const g=problems(v,h.lane).map(x=>`bộ ${k+2}: ${x}`);if(!v.t)g.push(`bộ ${k+2}: thiếu tên (TITLE)`);f.push(...g)})}}
  if(f.length){bad++;console.log(h.id,'→',f.join('; '))}}
const multi=Object.entries(BUILDS).filter(([,b])=>b.v).map(([k,b])=>`${k} ${1+b.v.length} bộ`);
console.log(`${HEROES.length} ô tướng, ${bad} lỗi`+(multi.length?` (nhiều bộ: ${multi.join(', ')})`:''));process.exit(bad?1:0);
