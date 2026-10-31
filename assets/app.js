/* Giao diện và tương tác — thường không cần sửa khi cập nhật số liệu */

const $=id=>document.getElementById(id);
function store(k,v){try{if(v===undefined)return JSON.parse(localStorage.getItem(k));localStorage.setItem(k,JSON.stringify(v))}catch(e){return null}}
const freshMine=()=>Object.fromEntries(HEROES.map(h=>[h.id,h.tier]));
const mq=window.matchMedia("(max-width:719px)");

/* Trình duyệt trong Messenger/Facebook trên Android phóng to chữ theo cỡ chữ của điện thoại nhưng không giãn khung
   → chữ cụm lại, chồng lên nhau. Đo tỉ lệ phóng thật (so chữ trên trang với chữ vẽ trên canvas, canvas không bị phóng)
   rồi chia lại cỡ chữ trong CSS cho đúng thiết kế. Người xem vẫn chụm hai ngón để phóng to được.
   Thêm ?tz vào link để xem tỉ lệ đo được, ?tz=1.3 để thử bù với tỉ lệ cho trước. */
const TZ=(function fixTextZoom(){
  const qs=new URLSearchParams(location.search).get("tz"),TXT="Bảng Tier Liên Quân 2026";
  const res={r14:1,r32:1,applied:0};
  try{
    const ctx=document.createElement("canvas").getContext("2d");if(!ctx)return res;
    const box=document.createElement("div");box.setAttribute("aria-hidden","true");
    box.style.cssText="height:0;overflow:hidden;visibility:hidden;pointer-events:none";
    box.innerHTML=[14,32].map(s=>`<span style="display:inline;font:400 ${s}px/1 sans-serif;letter-spacing:0;text-transform:none;white-space:nowrap">${TXT}</span>`).join("<br>");
    (document.querySelector(".hero-l")||document.body).appendChild(box);
    const [p14,p32]=box.querySelectorAll("span");
    const ratio=(el,s)=>{ctx.font=`400 ${s}px sans-serif`;const w=ctx.measureText(TXT).width;return w?el.getBoundingClientRect().width/w:1};
    res.r14=ratio(p14,14);res.r32=ratio(p32,32);
    const forced=qs&&+qs>0?+qs:0,r=forced||res.r14;
    if(r>1.06&&r<3){
      // Chữ to cũng bị phóng gần như chữ nhỏ → bù mọi cỡ; nếu chữ to gần như không bị phóng → chỉ bù chữ ≤ 16px
      const linear=forced||res.r32>1+(r-1)*0.6;
      const saved=[],SZ=/(^|\s)(clamp\([^)]*\)|\d*\.?\d+(?:px|rem))(?=[\s\/]|$)/;
      const small=v=>{const m=/^(\d*\.?\d+)(px|rem)$/.exec(v.trim());return m&&(m[2]==="px"?+m[1]:+m[1]*16)<=16.5};
      const ok=v=>{const t=v.replace(/rem/g,"R");return /\d(?:px|R|vw|vh)/.test(t)&&!/\d(?:%|em)/.test(t)&&(linear||small(v))};
      const set=(st,p,v)=>{const pr=st.getPropertyPriority(p);saved.push([st,p,v,pr]);st.setProperty(p,p==="font"?v.replace(SZ,(m,a,b)=>`${a}calc(${b} / ${r})`):`calc(${v} / ${r})`,pr)};
      const walk=list=>{for(const rule of list){
        if(rule.style&&rule.selectorText){const st=rule.style,fs=st.getPropertyValue("font-size"),f=st.getPropertyValue("font");
          if(fs){if(ok(fs))set(st,"font-size",fs)}else if(f){const m=SZ.exec(f);if(m&&ok(m[2]))set(st,"font",f)}}
        if(rule.cssRules&&rule.cssRules.length)walk(rule.cssRules)}};
      for(const sh of document.styleSheets){let rl;try{rl=sh.cssRules}catch(e){continue}if(rl)walk(rl)}
      // Kiểm tra lại: chữ 14px phải hiện đúng 14px, nếu không thì trả nguyên như cũ
      p14.style.fontSize=`calc(14px / ${r})`;const after=ratio(p14,14);
      if(!forced&&Math.abs(after-1)>0.08)saved.forEach(([st,p,v,pr])=>st.setProperty(p,v,pr));
      else{res.applied=r;res.after=after;document.documentElement.classList.add("tz")}
    }
    box.remove();
  }catch(e){}
  if(qs!==null)setTimeout(()=>toast(`Chữ ${res.r14.toFixed(2)}× / ${res.r32.toFixed(2)}× · ${res.applied?"đã bù "+res.applied.toFixed(2):"không cần bù"}`),900);
  return res;
})();
// Bảng "Tự xếp" đọc lại từ bộ nhớ trình duyệt: chỉ nhận đúng mã tướng và tier hợp lệ, phần khác bỏ qua
function loadMine(){const m=freshMine(),saved=store("lq-mine2");
  if(saved&&typeof saved==="object")for(const id of Object.keys(m)){const t=saved[id];if(TIERS.includes(t)||t==="X")m[id]=t}
  return m}
let mode=store("lq-mode")==="mine"?"mine":"meta",sortK="pres",sortD=-1,q="",selected=null,mine=loadMine();
let mLane=LANES[store("lq-mlane")]?store("lq-mlane"):"top";
const F={lane:new Set(),cls:new Set(),trend:new Set()};
HEROES.forEach(h=>{if(!(h.id in mine))mine[h.id]=h.tier});

function initials(n){const w=n.replace(/[^\p{L}\s]/gu,"").trim().split(/\s+/);return (w.length>1?w[0][0]+w[1][0]:w[0].slice(0,2)).toUpperCase()}
const P_KEYS=new Set(["evita", "ishar", "tamyn", "ybneth", "taara", "ata", "omega", "max", "toro", "mina", "roxie", "baldum", "chaugnar", "thane", "ormarr", "arduin", "xeniel", "wiro", "arthur", "zuka", "florentino", "volkath", "ryoma", "maloch", "trieuvan", "airi", "yena", "veres", "qi", "bijan", "lubo", "omen", "richter", "errol", "allain", "edras", "biron", "boltbaron", "skud", "kilgroth", "superman", "amily", "charlotte", "astrid", "wonderwoman", "rourke", "dextra", "tachi", "yan", "zephys", "sinestrea", "billow", "butterfly", "murad", "ngokhong", "nakroth", "paine", "zill", "quillen", "kaine", "enzo", "keera", "kriknak", "aoi", "bright", "theflash", "gildur", "yue", "zata", "raz", "lorion", "azzenka", "iggy", "krixi", "veera", "natalya", "marja", "lauriel", "aleister", "tulen", "liliana", "heino", "flowborn-mid", "goverra", "kahlii", "mganga", "ilumia", "dieuthuyen", "bonnie", "ignis", "preyta", "jinna", "darcy", "sephera", "dirak", "violet", "hayate", "flowborn-ad", "moren", "elsu", "valhein", "slimz", "fennik", "stuart", "telannas", "capheny", "laville", "celica", "elandorr", "yorn", "lindis", "wisp", "thorne", "teeri", "erin", "alice", "dolia", "aya", "annette", "dyadia", "cresht", "grakk", "rouie", "krizzix", "arum", "lumburr", "helen", "teemee", "zip", "ming"]),S_KEYS=new Set(["evita", "ishar", "tamyn", "ybneth", "taara", "ata", "omega", "max", "toro", "mina", "roxie", "baldum", "chaugnar", "thane", "ormarr", "arduin", "xeniel", "wiro", "arthur", "zuka", "florentino", "volkath", "ryoma", "maloch", "trieuvan", "airi", "yena", "veres", "qi", "bijan", "lubo", "omen", "richter", "errol", "allain", "edras", "biron", "boltbaron", "skud", "kilgroth", "superman", "amily", "charlotte", "astrid", "wonderwoman", "rourke", "dextra", "tachi", "yan", "zephys", "sinestrea", "billow", "butterfly", "murad", "ngokhong", "nakroth", "paine", "zill", "quillen", "kaine", "enzo", "keera", "kriknak", "aoi", "bright", "theflash", "gildur", "yue", "zata", "raz", "lorion", "azzenka", "iggy", "krixi", "veera", "natalya", "marja", "lauriel", "aleister", "tulen", "liliana", "heino", "flowborn-mid", "goverra", "kahlii", "mganga", "ilumia", "dieuthuyen", "bonnie", "ignis", "preyta", "jinna", "darcy", "sephera", "dirak", "violet", "hayate", "flowborn-ad", "moren", "elsu", "valhein", "slimz", "fennik", "stuart", "telannas", "capheny", "laville", "celica", "elandorr", "yorn", "lindis", "wisp", "thorne", "teeri", "erin", "alice", "dolia", "aya", "annette", "dyadia", "cresht", "grakk", "rouie", "krizzix", "arum", "lumburr", "helen", "teemee", "zip", "ming"]);
const pKey=h=>{const k=h.key==="flowborn"?"flowborn-"+h.lane:h.key;return P_KEYS.has(k)?k:""};
/* Dấu trên ảnh tướng (góc phải trên, kiểu Prydwen): ô đặc mũi tên = lên/xuống bậc so với lần cập nhật trước,
   hình tròn kính tối có mũi tên ↑ / ↓ / ⇅ = tăng / giảm / điều chỉnh sức mạnh ở bản mới, MỚI = tướng mới.
   Hai loại khác nhau cả hình (vuông / tròn) lẫn nét (chữ V / mũi tên có thân) để nhìn là phân biệt. */
const mkS=(d,w=1.7)=>`<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
// Đường vẽ (lưới 12): bậc = chữ V (hai chữ V khi đổi từ 2 bậc trở lên); sức mạnh = mũi tên có thân, nét đậm
const MKD={up:"M3 7.6 6 4.6l3 3",up2:"M3 6 6 3l3 3M3 9.6l3-3 3 3",down:"M3 4.4l3 3 3-3",down2:"M3 2.4l3 3 3-3M3 6l3 3 3-3",
  pu:"M6 9.6V2.6M2.8 5.8 6 2.6l3.2 3.2",pd:"M6 2.4v7M2.8 6.2 6 9.4l3.2-3.2",pm:"M4 9.6V2.6M2.1 4.5 4 2.6l1.9 1.9M8 2.4v7M6.1 7.5 8 9.4l1.9-1.9"};
const MKW={up:2,up2:1.8,down:2,down2:1.8,pu:2,pd:2,pm:1.7};
const MKI=Object.fromEntries(Object.entries(MKD).map(([k,d])=>[k,mkS(d,MKW[k])]));
const ui=(d,extra="")=>`<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${extra}<path d="${d}"/></svg>`;
const moveN=h=>h.move?Math.abs(TIERS.indexOf(h.prev)-TIERS.indexOf(h.tier)):0;
const moveTxt=h=>h.move?`${h.move==="up"?"Lên":"Xuống"} bậc từ ${h.prev} (so với ${PREV_DATE})`:"";
function mkMove(m,n){return `<span class="mk ${m==="up"?"rise":"fall"}">${MKI[m+(n>1?"2":"")]}</span>`}
function mkTrend(t){return t==="new"?`<span class="mk new">MỚI</span>`:`<span class="mk pw p${t[0]}">${MKI["p"+t[0]]}</span>`}
function marks(h){const m=(h.move?mkMove(h.move,moveN(h)):"")+(h.trend?mkTrend(h.trend):"");return m?`<span class="mks">${m}</span>`:""}
function portrait(h){
  const src=imgOf(h);
  return `<div class="por${src?" has":""}" aria-hidden="true" style="--lc:var(--l-${h.lane})">${src?`<img src="${src}" alt="" loading="lazy" decoding="async" width="88" height="88">`:`<span class="ini">${initials(h.name)}</span>`}<span class="cls" title="${CLASSES[h.cls]}">${ICON[h.cls]}</span>${marks(h)}${h.sec?`<span class="secl">Phụ</span>`:""}</div>`;
}
const tierOf=h=>mode==="mine"?mine[h.id]:h.tier;
const uniq=new Set(HEROES.map(h=>h.key)).size;
$("heroCount").textContent=uniq;
// Dấu chấm ngăn hàng nghìn như toLocaleString("vi-VN") nhưng không phải nạp dữ liệu ngôn ngữ Intl lúc mở trang (~15 ms trên điện thoại)
const fmt=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,".");
const TOTAL_PICK=SRC.aogGames*10,TOTAL_BAN=Object.values(SRC.aog).reduce((s,v)=>s+v[4],0);
$("stPick").textContent=fmt(TOTAL_PICK);$("stBan").textContent=fmt(TOTAL_BAN);$("stGames").textContent=SRC.aogGames;

/* Bộ lọc */
function buildFilters(){
  const mk=(box,key,items,render)=>{const el=$(box);Object.entries(items).forEach(([k,v])=>{const b=document.createElement("button");b.className="ic";b.setAttribute("aria-pressed","false");b.dataset.key=key;b.dataset.val=k;render(b,k,v);
    b.onclick=()=>{F[key].has(k)?F[key].delete(k):F[key].add(k);b.setAttribute("aria-pressed",F[key].has(k));draw()};el.appendChild(b)})};
  mk("f-lane","lane",LANES,(b,k,v)=>{b.innerHTML=`<span class="d" style="background:var(--l-${k})"></span>${v}`});
  mk("f-class","cls",CLASSES,(b,k,v)=>{b.innerHTML=ICON[k]+v});
  mk("f-trend","trend",{rise:"Lên bậc",fall:"Xuống bậc",up:"Tăng sức mạnh",down:"Giảm sức mạnh",mix:"Điều chỉnh",new:"Mới"},(b,k,v)=>{b.innerHTML=(k==="rise"||k==="fall"?mkMove(k==="rise"?"up":"down"):mkTrend(k))+v});
  $("lanesM").innerHTML=Object.entries(LANES).map(([k,v])=>`<button data-l="${k}" style="--lc:var(--l-${k})" aria-pressed="${k===mLane}"><i></i>${v}</button>`).join("");
  $("lanesM").onclick=e=>{const b=e.target.closest("button");if(b)setLane(b.dataset.l)};
}
function setLane(l){if(!LANES[l]||l===mLane)return;mLane=l;store("lq-mlane",mLane);
  $("lanesM").querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x.dataset.l===mLane));
  const top=$("board").getBoundingClientRect().top,lim=$("bar").offsetHeight;
  if(top<lim-2)scrollTo({top:scrollY+top-lim-4,behavior:"auto"});
  draw()}
function activeCount(){return F.cls.size+F.trend.size+(mq.matches?0:F.lane.size)+(q?1:0)}
function syncFilterUI(shown){const n=activeCount();$("fcount").hidden=!(F.cls.size+F.trend.size);$("fcount").textContent=F.cls.size+F.trend.size;$("freset").hidden=!n;
  // Nút đóng bảng lọc trên điện thoại báo luôn số tướng sẽ hiện
  if(shown!=null)$("fdone").textContent=shown?`Xem ${shown} tướng`:"Đóng"}
function match(h){return (!F.cls.size||F.cls.has(h.cls))&&(!F.trend.size||F.trend.has(h.trend)||(h.move&&F.trend.has(h.move==="up"?"rise":"fall")))&&(!q||slug(h.name).includes(slug(q)))}

/* Vẽ bảng */
const reduce=matchMedia("(prefers-reduced-motion: reduce)");
let firstDraw=true,vtOn=false;
const TDESC={S:"Nên cấm hoặc chọn sớm",A:"Chọn an toàn khi leo rank",B:"Dùng tốt",C:"Cần đội hình phù hợp",D:"Đang yếu",X:"Chưa đặt vào tier"};
function draw(){
  const n=(mq.matches?HEROES.filter(h=>h.lane===mLane&&match(h)):HEROES.filter(h=>(!F.lane.size||F.lane.has(h.lane))&&match(h))).length;
  // Điện thoại: không dùng View Transition (chụp lại mọi thẻ tướng thành lớp đồ hoạ; Chrome Android thiếu bộ nhớ thì hiện ô đen/tím thay ảnh)
  vtOn=n<=60&&!mq.matches&&!matchMedia("(pointer:coarse)").matches;
  if(!firstDraw&&vtOn&&document.startViewTransition&&!reduce.matches){document.startViewTransition(()=>render());}else render();
  firstDraw=false;
}
function render(){
  const lanes=mq.matches?[mLane]:Object.keys(LANES).filter(l=>!F.lane.size||F.lane.has(l));
  const board=$("board");board.style.setProperty("--cols",lanes.length);board.style.setProperty("--minw",(lanes.length*172+84)+"px");
  const list=HEROES.filter(h=>lanes.includes(h.lane)&&match(h));
  syncFilterUI(list.length);
  if(!list.length){
    const elsewhere=mq.matches?Object.keys(LANES).filter(l=>l!==mLane).map(l=>[l,HEROES.filter(h=>h.lane===l&&match(h)).length]).filter(x=>x[1]):[];
    board.innerHTML=`<div class="empty"><b>${elsewhere.length?"Đường này không có tướng khớp":"Không có tướng nào khớp"}</b>
      <span>${elsewhere.length?"Có kết quả ở đường khác:":"Thử bỏ bớt bộ lọc hoặc đổi từ khoá tìm kiếm."}</span>
      ${elsewhere.length?`<div class="empty-go">${elsewhere.map(([l,n])=>`<button class="btn" data-lane="${l}"><span class="lanebar" style="background:var(--l-${l})"></span>${LANES[l]} · ${n}</button>`).join("")}</div>`:""}
      <button class="btn${elsewhere.length?" ghost":""}" id="emptyReset">Xoá lọc</button></div>`;
    $("emptyReset").onclick=resetFilters;syncPick();
    board.querySelectorAll("[data-lane]").forEach(bt=>bt.onclick=()=>setLane(bt.dataset.lane));
    return}
  board.classList.toggle("is-stats",mode==="stats");
  if(mode==="stats"){board.style.setProperty("--minw","0px");return renderStats(list)}
  let html=`<div class="hrow"><div></div>${lanes.map(l=>`<div style="--lc:var(--l-${l})"><span class="lanebar" style="background:var(--l-${l})"></span>${LANES[l]} <small>${list.filter(h=>h.lane===l).length}</small></div>`).join("")}</div>`;
  const rows=mode==="mine"?[...TIERS,"X"]:TIERS;
  rows.forEach(t=>{
    const inTier=list.filter(h=>tierOf(h)===t);
    if(mode==="meta"&&!inTier.length&&(q||F.cls.size||F.trend.size))return;
    html+=`<div class="trow${mode==="mine"&&selected?" target":""}" data-t="${t}"><div class="tl" aria-label="Tier ${t==="X"?"chưa xếp":t}, ${inTier.length} tướng"><span class="L">${t==="X"?"–":t}</span><small>${t==="X"?"Chưa xếp":TNAME[t]}</small><em>${TDESC[t]}</em><span class="cnt">${inTier.length} tướng</span></div>`;
    lanes.forEach(l=>{
      const items=inTier.filter(h=>h.lane===l);
      html+=`<div class="cell" data-t="${t}">${items.map(h=>`<button class="card${selected===h.id?" sel":""}${q?" hit":""}${h.name.length>10?" ln":""}" data-id="${h.id}" data-t="${tierOf(h)}" style="${vtOn?`view-transition-name:c-${h.id.replace(/[^a-z0-9-]/g,"")};`:""}--d:${(h.score*7)%4}" aria-label="${h.name}, ${LANES[h.lane]}${h.sec?" (đường phụ)":""}, tier ${tierOf(h)}${h.move?", "+moveTxt(h).toLowerCase():""}${TR[h.trend]?", "+TR[h.trend][2].toLowerCase()+" ở bản mới":""}" ${mode==="mine"?'draggable="true"':""}>${portrait(h).replace('</div>',tierOf(h)==="S"?'<span class="sweep"></span></div>':'</div>')}<span class="nm">${h.name}</span></button>`).join("")||'<span class="none" aria-hidden="true">—</span>'}</div>`;
    });
    html+=`</div>`;
  });
  board.innerHTML=html;
  observeRows();syncPick();
}
function syncPick(){const on=mode==="mine"&&!!selected,h=on&&HEROES.find(x=>x.id===selected);
  $("pickbar").hidden=!on;document.body.classList.toggle("picking",on&&mq.matches);
  if(h)$("pickTxt").innerHTML=`Đã chọn <b>${h.name}</b> · chạm hàng tier để đặt`}
function resetFilters(){Object.values(F).forEach(s=>s.clear());q="";$("q").value="";document.querySelectorAll(".filters [aria-pressed]").forEach(b=>b.setAttribute("aria-pressed","false"));draw()}

/* Tương tác bảng */
$("board").addEventListener("click",e=>{
  const c=e.target.closest(".card");
  if(c){e.stopPropagation();hideTip();
    if(mode==="meta")return openModal(c.dataset.id);
    const row=c.closest(".trow");
    if(selected&&selected!==c.dataset.id&&row&&mine[selected]!==row.dataset.t){place(selected,row.dataset.t);return}
    selected=selected===c.dataset.id?null:c.dataset.id;draw();
    $("minehint").textContent=selected?`Đã chọn ${HEROES.find(h=>h.id===selected).name}. Bấm vào hàng tier muốn đặt.`:"Bấm chọn một tướng, rồi bấm vào hàng tier muốn đặt. Trên máy tính có thể kéo thả. Bảng tự lưu trên trình duyệt này.";return}
  const row=e.target.closest(".trow");
  if(row&&mode==="mine"&&selected){place(selected,row.dataset.t)}
});
$("board").addEventListener("dragstart",e=>{const c=e.target.closest(".card");if(c){e.dataTransfer.setData("text/plain",c.dataset.id);hideTip()}});
$("board").addEventListener("dragover",e=>{if(mode==="mine"&&e.target.closest(".trow"))e.preventDefault()});
$("board").addEventListener("drop",e=>{const row=e.target.closest(".trow");if(row){e.preventDefault();place(e.dataTransfer.getData("text/plain"),row.dataset.t)}});
(function swipeLanes(){let x0=null,y0=0,t0=0;const b=$("board");
  b.addEventListener("touchstart",e=>{x0=null;if(!mq.matches||e.touches.length>1)return;const t=e.touches[0];if(t.clientX<24||t.clientX>innerWidth-24)return;x0=t.clientX;y0=t.clientY;t0=Date.now()},{passive:true});
  b.addEventListener("touchend",e=>{if(x0==null)return;const t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;x0=null;
    if(Date.now()-t0>700||Math.abs(dx)<70||Math.abs(dx)<Math.abs(dy)*2)return;
    const ks=Object.keys(LANES),n=ks[(ks.indexOf(mLane)+(dx<0?1:ks.length-1))%ks.length];setLane(n);toast("Đường "+LANES[n])},{passive:true});
})();
function place(id,t){if(!id)return;const h=HEROES.find(x=>x.id===id);mine[id]=t;store("lq-mine2",mine);selected=null;draw();
  $("minehint").textContent="Bấm chọn một tướng, rồi bấm vào hàng tier muốn đặt. Trên máy tính có thể kéo thả. Bảng tự lưu trên trình duyệt này.";
  if(h)toast(`${h.name} → ${t==="X"?"Chưa xếp":"tier "+t}`)}

/* Tooltip khi rê chuột */
let tipEl=null;
function hideTip(){if(tipEl){tipEl.remove();tipEl=null}}
if(window.matchMedia("(hover:hover) and (pointer:fine)").matches){
  $("board").addEventListener("mouseover",e=>{const c=e.target.closest(".card");if(!c){hideTip();return}
    const h=HEROES.find(x=>x.id===c.dataset.id);if(!h)return;const a=aogOf(h.key,h.lane);hideTip();
    tipEl=document.createElement("div");tipEl.className="tip";
    tipEl.innerHTML=`<h4>${h.name}</h4><div class="r"><span>${LANES[h.lane]}${h.sec?" (phụ)":""} · ${CLASSES[h.cls]}</span><b style="color:var(--t-${tierOf(h).toLowerCase()})">${tierOf(h)==="X"?"Chưa xếp":"Tier "+tierOf(h)}</b></div>
      <div class="r"><span>Điểm tổng · hạng trong đường</span><b>${h.score.toFixed(2)} · ${h.rank}/${h.laneN}</b></div>
      <div class="r"><span>ĐTDV pick · cấm</span><b>${a?a[3]+" · "+a[4]:"0 · 0"}</b></div>
      <div class="hint">${mode==="meta"?"Bấm để xem chi tiết":"Bấm để chọn, rồi bấm vào hàng tier"}</div>`;
    document.body.appendChild(tipEl);const r=c.getBoundingClientRect(),tw=tipEl.offsetWidth,th=tipEl.offsetHeight;
    let x=r.right+10,y=r.top;if(x+tw>innerWidth-8)x=r.left-tw-10;if(y+th>innerHeight-8)y=innerHeight-th-8;tipEl.style.left=Math.max(8,x)+"px";tipEl.style.top=Math.max(8,y)+"px"});
  $("board").addEventListener("mouseleave",hideTip);addEventListener("scroll",hideTip,{passive:true});
}

/* Hộp chi tiết */
function breakdown(h){
  const r=SRC.rpl[h.key],m=SRC.rm[h.key],ps=proScore(r),a=aogOf(h.key,h.lane);
  const bar=(label,val,txt)=>`<div class="bd"><span>${label}</span><div class="bdbar"><i style="width:${val==null?0:val/5*100}%"></i></div><b>${txt}</b></div>`;
  let pro="Chưa có dữ liệu";
  if(r)pro=r[1]+r[2]<5?`Ít xuất hiện (${(r[1]+r[2]).toFixed(1)}% pick+cấm)`:`Pick ${r[1]}% · Cấm ${r[2]}% · Thắng ${r[0]==null?"–":r[0]+"%"}`;
  // Tỉ lệ thắng chỉ vào điểm khi tướng được chọn từ 5% số trận (aogScore trong data.js): dưới mức đó ghi rõ là mẫu nhỏ
  const wrTxt=x=>x[3]?` · Thắng ${x[0]}%${x[1]<5?" (mẫu nhỏ, chọn dưới 5% số trận nên chưa tính vào điểm)":""}`:"";
  const aTxt=a?`${a[3]} pick · ${a[4]} cấm / ${SRC.aogGames} trận${wrTxt(a)}`:`Không được chọn trong ${SRC.aogGames} trận`;
  return `<div class="bds">
    ${bar("ĐTDV mùa Đông",aogScore(a),aTxt)}
    ${(()=>{const pv=prevOf(h.key,h.lane);return bar("Mùa trước",aogScore(pv),pv?`${pv[3]} pick · ${pv[4]} cấm / ${SRC.prevGames} trận${wrTxt(pv)}`:`Không được chọn trong ${SRC.prevGames} trận`)})()}
    ${bar("RoV Pro League",ps,pro)}
    ${bar("Rank cộng đồng",m?RMS[m]:null,m?"Tier "+m:"Chưa có dữ liệu")}
    <div class="bd total"><span>Điểm tổng</span><div class="bdbar"><i style="width:${h.score/5*100}%"></i></div><b>${h.score.toFixed(2)} / 5 · hạng ${h.rank}/${h.laneN} ở ${LANES[h.lane]}${h.sec?" (đường phụ: trừ 0,4, tối đa tier A)":""}</b></div>
    ${h.floor==="manual"?`<p class="floor">Tier ${h.tier} do người biên tập điều chỉnh thủ công, không theo điểm tổng.</p>`:h.floor==="pickS"||h.floor==="pickA"?`<p class="floor">Được nâng lên tier ${h.tier} vì được chọn ở ${aogOf(h.key,h.lane)[1]}% số trận ĐTDV mùa Đông.</p>`:h.floor?`<p class="floor">Được nâng lên tier ${h.floor} vì xuất hiện (pick hoặc cấm) ở ${h.pres.toFixed(0)}% số trận ĐTDV mùa Đông.</p>`:""}
  </div>`;
}
/* Build tham khảo: đồ, bảng ngọc, phép bổ trợ (dữ liệu ở assets/builds.js, tải sau khi trang hiện xong để bảng tier hiện sớm hơn) */
// Không nạp builds.js bằng thẻ script trong HTML: app.js tự tải nó khi trang đã hiện xong (hoặc ngay khi cần mở bảng chi tiết),
// dùng cùng số ?v= với app.js để trình duyệt nhận bản mới
const VQ=((document.currentScript&&document.currentScript.src)||"").split("?")[1]||"";
function loadJS(id,src){let s=$(id);if(!s){s=document.createElement("script");s.id=id;s.async=true;s.src=src+(VQ?"?"+VQ:"");document.body.appendChild(s)}return s}
function loadBuilds(){return loadJS("buildsjs","assets/builds.js")}
/* Bộ chiêu thức (assets/skills.js, ~37 kB): chỉ tải khi người xem chạm vào thẻ tướng hoặc mở bảng chi tiết,
   vì phần lớn người xem chỉ lướt bảng tier */
function loadSkills(){return loadJS("skillsjs","assets/skills.js")}
/* Điểm mạnh, điểm yếu + khắc chế và hợp cặp (assets/counters.js, ~20 kB nén): tóm tắt tiếng Việt và danh sách viết tay của ROV META (server Thái), tải cùng lúc với bộ chiêu thức */
function loadCounters(){return loadJS("countersjs","assets/counters.js")}
document.addEventListener("pointerdown",e=>{if(e.target.closest&&e.target.closest("#board .card")){loadSkills();loadCounters()}},{passive:true});
function waitCounters(){if(waitCounters.on)return;waitCounters.on=true;
  const redo=ok=>{waitCounters.on=false;const sec=document.querySelector(".modal .cn[data-wait]");if(!sec)return;const h=HEROES.find(x=>x.id===sec.dataset.wait);
    if(ok&&h&&typeof COUNTERS!=="undefined")sec.outerHTML=counterHTML(h);else sec.remove()};
  if(typeof COUNTERS!=="undefined")return redo(true);
  const s=loadCounters();s.addEventListener("load",()=>redo(true),{once:true});s.addEventListener("error",()=>redo(false),{once:true})}
function swHTML(h){const s=typeof STRWK!=="undefined"&&STRWK[h.key];if(!s)return "";
  const col=(t,l,w)=>`<div class="sw-c${w?" w":""}"><h5>${t}</h5><ul>${l.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`;
  return `<section class="sw" aria-label="Điểm mạnh và điểm yếu của ${esc(h.name)}"><h4 class="bds-h">Điểm mạnh, điểm yếu</h4><div class="sw-g">${col("Điểm mạnh",s[0])}${col("Điểm yếu",s[1],1)}</div>
    <p class="sk-src">Tóm tắt tiếng Việt theo mục Strengths / Weaknesses của <a href="${CNSRC.base+s[2]}" target="_blank" rel="noopener">${CNSRC.name}</a> (server Thái, bản ${CNSRC.patch}): nhận định của người biên tập trang đó, không phải số liệu.</p></section>`}
function counterHTML(h){
  const head=`<h4 class="bds-h">Khắc chế và hợp cặp</h4>`;
  if(typeof COUNTERS==="undefined"){waitCounters();return `<section class="cn" data-wait="${h.id}"><h4 class="bds-h">Điểm mạnh, điểm yếu</h4><p class="bld-note">Đang tải…</p></section>`}
  const c=COUNTERS[h.key],sw=swHTML(h);if(!c)return sw;
  const chip=k=>{const x=HEROES.find(y=>y.key===k&&!y.sec)||HEROES.find(y=>y.key===k);if(!x)return "";const src=imgOf(x);
    return `<li><button type="button" class="cn-b" data-cgo="${x.id}" style="--lc:var(--l-${x.lane})">${src?`<img src="${src}" alt="" loading="lazy" decoding="async" width="36" height="36">`:`<span class="cn-i">${initials(x.name)}</span>`}<span>${esc(x.name)}</span></button></li>`};
  const row=(t,l)=>l.length?`<div class="cn-r"><h5>${t}</h5><ul>${l.map(chip).join("")}</ul></div>`:"";
  return sw+`<section class="cn" aria-label="Khắc chế và hợp cặp của ${esc(h.name)}">${head}${row("Bị khắc chế bởi",c[0])}${row("Khắc chế",c[1])}${row("Hợp cặp",c[2])}
    <p class="sk-src">Theo danh sách viết tay của <a href="${CNSRC.base+c[3]}" target="_blank" rel="noopener">${CNSRC.name}</a> (server Thái, bản ${CNSRC.patch}), không phải tỉ lệ thắng; server Việt Nam có thể lệch. Chạm vào tướng để xem tướng đó.</p></section>`;
}
// bấm tướng trong mục Khắc chế: sang bảng chi tiết của tướng đó (gỡ phím tắt của bảng cũ như nút "Còn đi")
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest(".modal [data-cgo]");if(!b)return;
  track("khac_che",{tuong:b.textContent.trim()});if(openModal.off)openModal.off();openModal(b.dataset.cgo)});
function waitSkills(){if(waitSkills.on)return;waitSkills.on=true;
  const redo=ok=>{waitSkills.on=false;const sec=document.querySelector(".modal .sk[data-wait]");if(!sec)return;const h=HEROES.find(x=>x.id===sec.dataset.wait);
    if(ok&&h&&typeof SKILLS!=="undefined")sec.outerHTML=skillHTML(h);else sec.querySelector(".bld-note").textContent="Không tải được bộ chiêu thức. Tải lại trang để thử lại."};
  if(typeof SKILLS!=="undefined")return redo(true);
  const s=loadSkills();s.addEventListener("load",()=>redo(true),{once:true});s.addEventListener("error",()=>redo(false),{once:true})}
function skillHTML(h){
  const head=`<h4 class="bds-h">Bộ chiêu thức</h4>`;
  if(typeof SKILLS==="undefined"){waitSkills();return `<section class="sk" data-wait="${h.id}">${head}<p class="bld-note">Đang tải bộ chiêu thức…</p></section>`}
  const s=SKILLS[h.key==="flowborn"?"flowborn-"+h.lane:h.key];if(!s)return "";
  const [slug,list]=s,last=list.length-1;
  const lab=i=>i===0?"Nội tại":i===last?"Chiêu cuối":"Chiêu "+i;
  // Ảnh chiêu lấy từ máy chủ Garena; ảnh lỗi thì hiện chữ cái đầu (xem sự kiện error bên dưới)
  const li=list.map(([n,ic,d],i)=>`<li${i===0?' class="p"':""}><span class="sk-ic" aria-hidden="true">${esc((n||lab(i)).charAt(0))}${ic?`<img src="${SKU+ic}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" width="48" height="48">`:""}</span>
    <div><p class="sk-t"><em>${lab(i)}</em>${n?`<b>${esc(n)}</b>`:""}</p>${d?`<p class="sk-d">${esc(d)}</p>`:""}</div></li>`).join("");
  return `<section class="sk" aria-label="Bộ chiêu thức của ${esc(h.name)}">${head}<ol class="sk-list">${li}</ol>
    <p class="sk-src">Tóm tắt ngắn theo <a href="https://lienquan.garena.vn/hoc-vien/tuong-skin/d/${slug}/" target="_blank" rel="noopener">trang Học viện của Garena</a>. Mở trang để xem mô tả và chỉ số đầy đủ.</p></section>`;
}
// ảnh chiêu hiện mờ dần khi tải xong (không lộ biểu tượng ảnh hỏng trong lúc chờ), lỗi thì bỏ ảnh để lộ chữ cái đầu
const isSkImg=t=>t&&t.tagName==="IMG"&&t.parentNode&&t.parentNode.classList&&t.parentNode.classList.contains("sk-ic");
document.addEventListener("load",e=>{if(isSkImg(e.target))e.target.classList.add("ok")},true);
document.addEventListener("error",e=>{if(isSkImg(e.target))e.target.remove()},true);
if(document.readyState==="complete")setTimeout(loadBuilds,1200);else addEventListener("load",()=>setTimeout(loadBuilds,1200),{once:true});
function waitBuilds(){if(waitBuilds.on)return;waitBuilds.on=true;
  const redo=ok=>{waitBuilds.on=false;const sec=document.querySelector(".modal .bld[data-wait]");if(!sec)return;const h=HEROES.find(x=>x.id===sec.dataset.wait);
    if(ok&&h&&typeof BUILDS!=="undefined")sec.outerHTML=buildHTML(h);else sec.querySelector(".bld-note").textContent="Không tải được build. Tải lại trang để thử lại."};
  if(typeof BUILDS!=="undefined")return redo(true);
  const s=loadBuilds();s.addEventListener("load",()=>redo(true),{once:true});s.addEventListener("error",()=>redo(false),{once:true})}
const COLVI={red:"đỏ",purple:"tím",teal:"xanh"};
/* Phù hiệu: nhánh chính (cấp I–III) + 2 phù hiệu phụ, dữ liệu BENCH/BENCHB trong builds.js (tên, mô tả bản Việt từ AoV-IndeX) */
const ROM=["","I","II","III"];
function enchHTML(b){if(!b.e||typeof BENCH==="undefined")return "";
  const br=id=>BENCHB[BENCH[id][1]],main=b.e.slice(0,3),sub=b.e.slice(3);
  const pick=id=>{const [n,,l]=BENCH[id];return `<li><button type="button" class="en-b" data-ench="${id}" aria-describedby="itip"><img src="b/e-${id}.webp" alt="" loading="lazy" decoding="async" width="40" height="40"><span class="en-n">${esc(n)}</span><em>Cấp ${ROM[l]}</em></button></li>`};
  const subs=[...new Set(sub.map(br))],subBr=subs.length===1?"Phụ · "+subs[0]:"Phụ";
  const alt=b.el?`<p class="en-src">Nguồn build không ghi phù hiệu nên lấy theo <a href="${b.el}" target="_blank" rel="noopener">${BSRC[new URL(b.el).hostname]||new URL(b.el).hostname}</a>.</p>`:"";
  return `<div class="bld-en"><h5>Phù hiệu</h5><div class="en-row"><div class="en-g"><span class="en-br">${br(main[0])}</span><ul>${main.map(pick).join("")}</ul></div><div class="en-g sub"><span class="en-br">${subBr}</span><ul>${sub.map(pick).join("")}</ul></div></div>${alt}</div>`}
function buildHTML(h){
  if(typeof BUILDS==="undefined"){waitBuilds();return `<section class="bld" data-wait="${h.id}"><p class="bld-note">Đang tải build…</p></section>`}
  // Build riêng cho đường đang xem, nguồn tiếng Việt (server Việt Nam)
  const b=BUILDS[h.key+"@"+h.lane];
  const title=h.lane==="sp"?"Build Trợ thủ":`Build đi ${LANES[h.lane]}`;
  const host=b?new URL(b.l).hostname:"";
  const head=`<div class="bld-h"><h4>${title}</h4>${b?`<a href="${b.l}" target="_blank" rel="noopener">${BSRC[host]||host} · server Việt</a>`:""}</div>`;
  if(!b)return `<section class="bld">${head}<p class="bld-note">Chưa có build cho ${h.name} đi ${LANES[h.lane]}.</p></section>`;
  const notes=b.n?[b.n]:[];
  const items=`<ol class="bld-items">${b.i.map((id,k)=>{const [vi,cat,ic,en]=BITEM[id],jg=cat==="jg";
      return `<li class="bi${jg?" jg":""}"><button type="button" class="bi-b" data-item="${id}" aria-describedby="itip"><span class="bi-ic"><img src="b/i-${ic}.webp" alt="" loading="lazy" decoding="async" width="56" height="56"><b>${k+1}</b></span><span class="bi-n">${vi}</span>${jg?"<em>Đồ rừng</em>":cat==="sup"?"<em>Đồ trợ thủ</em>":""}</button></li>`}).join("")}</ol>
    <p class="bld-hint">${mq.matches?"Chạm":"Trỏ hoặc bấm"} vào món đồ, phép bổ trợ hay phù hiệu để xem chỉ số. Tra cứu đầy đủ: <a href="/trang-bi/" target="_blank" rel="noopener">Trang bị</a> · <a href="/phu-hieu/" target="_blank" rel="noopener">Phù hiệu</a> · <a href="/bang-ngoc/" target="_blank" rel="noopener">Bảng ngọc</a> · <a href="/phep-bo-tro/" target="_blank" rel="noopener">Phép bổ trợ</a>.</p>`;
  // tên ngọc theo Học viện Garena (BARC[a][2], ví dụ "Đỏ III Công phép"), dữ liệu cũ thiếu tên thì ghi theo màu
  const ar=b.r.map(([a,n])=>{const [c,t,vn]=BARC[a];return `<li><img src="b/a-${a}.webp" alt="" loading="lazy" width="30" height="30"><span><b>${vn?esc(vn):"Ngọc "+COLVI[c]} ×${n}</b>${t}</span></li>`}).join("");
  const sp=b.s.map(s=>`<li><button type="button" class="sp-b" data-spell="${s}" aria-describedby="itip"><img src="b/t-${s}.webp" alt="" loading="lazy" width="36" height="36"><span><b>${BSPELL[s][0]}</b>${(b.o||[]).includes(s)?"<em>Phương án thêm</em>":""}</span></button></li>`).join("");
  return `<section class="bld" aria-label="${title}">${head}${notes.map(n=>`<p class="bld-note">${n}</p>`).join("")}${items}
    <div class="bld-row"><div><h5>Bảng ngọc</h5><ul class="bld-ar">${ar}</ul></div><div><h5>Phép bổ trợ${b.s.length>1?" (chọn một)":""}</h5><ul class="bld-sp">${sp}</ul></div></div>${enchHTML(b)}</section>`;
}
/* Hộp thông tin khi trỏ (máy tính) hoặc chạm (điện thoại) vào món đồ / phép bổ trợ trong phần build:
   giá, chỉ số và nội tại như trang Học viện · Trang bị của Garena (dữ liệu BINFO trong assets/builds.js) */
const esc=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let itipFor=null,itipPin=false;
function itipEl(){let t=$("itip");if(!t){t=document.createElement("div");t.id="itip";t.className="itip";t.setAttribute("role","tooltip");t.hidden=true;document.body.appendChild(t)}return t}
function showItip(el,pin){const t=itipEl(),id=el.dataset.item,sp=el.dataset.spell,en=el.dataset.ench;let html="";
  if(id&&typeof BITEM!=="undefined"){const [vi,cat]=BITEM[id],f=(typeof BINFO!=="undefined"&&BINFO[id])||{s:[],n:[]};
    const tag=cat==="jg"?"Đồ rừng · cần Trừng Trị":cat==="sup"?"Đồ trợ thủ":"";
    html=`<div class="it-h"><b>${esc(vi)}</b>${f.p?`<span class="it-p">${f.p.toLocaleString("vi-VN")} vàng</span>`:""}</div>${tag?`<p class="it-tag">${tag}</p>`:""}
      ${f.s.length?`<ul class="it-s">${f.s.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}
      ${f.n.length?`<ul class="it-n">${f.n.map(([n,d])=>`<li><b>${esc(n)}:</b> ${esc(d)}</li>`).join("")}</ul>`:""}`}
  else if(sp&&typeof BSPELL!=="undefined"){const [n,d]=BSPELL[sp];html=`<div class="it-h"><b>${esc(n)}</b><span class="it-p">Phép bổ trợ</span></div><p class="it-d">${esc(d)}</p>`}
  else if(en&&typeof BENCH!=="undefined"&&BENCH[en]){const [n,c,l,d]=BENCH[en];html=`<div class="it-h"><b>${esc(n)}</b><span class="it-p">Cấp ${ROM[l]}</span></div><p class="it-tag">Phù hiệu · ${esc(BENCHB[c])}</p><p class="it-d">${esc(d)}</p>`}
  if(!html)return;
  t.innerHTML=html;t.hidden=false;itipFor=el;itipPin=!!pin;el.setAttribute("aria-expanded","true");
  // đặt hộp ngay dưới (hoặc trên) món đồ, không tràn khỏi màn hình
  const r=el.getBoundingClientRect(),w=Math.min(320,innerWidth-24);t.style.width=w+"px";
  const hgt=t.offsetHeight,below=innerHeight-r.bottom>=hgt+12||r.top<hgt+12;
  t.style.left=Math.max(12,Math.min(innerWidth-w-12,r.left+r.width/2-w/2))+"px";
  t.style.top=(below?Math.min(innerHeight-hgt-8,r.bottom+8):Math.max(8,r.top-hgt-8))+"px"}
function hideItip(){const t=$("itip");if(t)t.hidden=true;if(itipFor)itipFor.removeAttribute("aria-expanded");itipFor=null;itipPin=false}
(function itipEvents(){itipEl();const sel="[data-item],[data-spell],[data-ench]",fine=matchMedia("(hover:hover) and (pointer:fine)");
  document.addEventListener("pointerover",e=>{if(!fine.matches||itipPin)return;const el=e.target.closest&&e.target.closest(".modal "+sel);if(el&&el!==itipFor)showItip(el)});
  document.addEventListener("pointerout",e=>{if(!fine.matches||itipPin||!itipFor)return;const to=e.relatedTarget;if(!to||!itipFor.contains(to))hideItip()});
  document.addEventListener("click",e=>{const el=e.target.closest&&e.target.closest(".modal "+sel);
    if(el){if(itipFor===el&&itipPin)hideItip();else showItip(el,true);return}
    if(itipFor&&!(e.target.closest&&e.target.closest("#itip")))hideItip()});
  document.addEventListener("focusin",e=>{const el=e.target.closest&&e.target.closest(".modal "+sel);if(el&&el!==itipFor&&e.target.matches(":focus-visible"))showItip(el)});
  document.addEventListener("focusout",e=>{if(itipFor&&e.target===itipFor&&!itipPin)hideItip()});
  // Esc đóng hộp thông tin trước, chưa đóng bảng chi tiết
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&itipFor){e.stopPropagation();e.preventDefault();hideItip()}},true);
  addEventListener("resize",hideItip);document.addEventListener("scroll",()=>{if(itipFor)hideItip()},true)})();
let lastFocus=null;
/* ===== Nút Quay lại của điện thoại: đóng bảng chi tiết / menu / bộ lọc thay vì rời khỏi web =====
   Mỗi lớp mở thêm một mục lịch sử; đóng bằng nút trong trang thì tự gỡ mục đó (history.back, bỏ qua popstate tương ứng). */
try{history.scrollRestoration="manual"}catch(e){}
const BACK={st:[],skip:0,
  push(n,fn,url){try{history.pushState({lq:n},"",url||location.href)}catch(e){}this.st.push([n,fn])},
  top(n){const t=this.st[this.st.length-1];return t&&t[0]===n?t:null},
  set(n,fn,url){const t=this.top(n);if(t)t[1]=fn;else this.st.push([n,fn]);try{history.replaceState({lq:n},"",url||location.href)}catch(e){}},
  swap(a,n,fn,url){const t=this.top(a);if(!t)return false;t[0]=n;t[1]=fn;try{history.replaceState({lq:n},"",url||location.href)}catch(e){}return true},
  pop(n){const i=this.st.map(x=>x[0]).lastIndexOf(n);if(i<0)return;this.st.splice(i,1);if(history.state&&history.state.lq===n){this.skip++;history.back()}}};
addEventListener("popstate",()=>{if(BACK.skip){BACK.skip--;return}const t=BACK.st.pop();if(t)t[1]()});
function visibleOrder(){return [...document.querySelectorAll("#board .card, #board .st-h")].map(c=>c.dataset.id)}
function openModal(id,dir,via){
  const h=HEROES.find(x=>x.id===id);if(!h)return;const b=TR[h.trend];
  const nav=!!$("veil");if(!nav)lastFocus=document.activeElement;
  const others=HEROES.filter(x=>x.key===h.key&&x.id!==h.id);
  // Tướng không có trên bảng đang hiện (điện thoại đang xem đường khác, hoặc bị bộ lọc ẩn): ‹ › đi theo thứ tự đường của tướng đó
  const vis=visibleOrder(),order=vis.includes(id)?vis:TIERS.flatMap(t=>HEROES.filter(x=>x.lane===h.lane&&x.tier===t)).map(x=>x.id),i=order.indexOf(id);
  $("modalRoot").innerHTML=`<div class="veil${nav?" nav":""}" id="veil"><div class="modal${dir>0?" from-r":dir<0?" from-l":""}" role="dialog" aria-modal="true" aria-label="${h.name}">
    <div class="mtop"><button id="mshare" aria-label="Chia sẻ tướng này" title="Chia sẻ">${ui("m8.3 10.9 7.4-3.8M8.3 13.1l7.4 3.8",'<circle cx="17.5" cy="6" r="2.5"/><circle cx="6.5" cy="12" r="2.5"/><circle cx="17.5" cy="18" r="2.5"/>')}</button><button id="mprev" aria-label="Tướng trước" ${i<=0?"disabled":""}>${ui("M14.5 6 8.5 12l6 6")}</button><button id="mnext" aria-label="Tướng sau" ${i<0||i>=order.length-1?"disabled":""}>${ui("m9.5 6 6 6-6 6")}</button><button id="mx" aria-label="Đóng">${ui("m6.5 6.5 11 11m0-11-11 11")}</button></div>
    <div class="m-ban${splOf(h)?"":" noimg"}">${splOf(h)?`<img src="${splOf(h)}" srcset="${splOf(h)} 960w, ${sp2(splOf(h))} 1386w" sizes="(max-width:760px) 100vw, 760px" alt="" decoding="async">`:""}</div>
    <div class="m-body"><div class="card" data-t="${h.tier}">${portrait(h)}</div>
    <div><h3>${h.name}</h3>
      <div class="tags"><span class="tag tt" style="--tg:var(--t-${h.tier.toLowerCase()})">Tier ${h.tier} · ${TNAME[h.tier]}</span><span class="tag">${LANES[h.lane]}${h.sec?" (đường phụ)":""}</span><span class="tag">${CLASSES[h.cls]}</span>${h.move?`<span class="tag mv ${h.move==="up"?"rise":"fall"}">${mkMove(h.move,moveN(h))}${h.move==="up"?"Lên":"Xuống"} bậc · ${h.prev} → ${h.tier}<small> so với ${PREV_DATE}</small></span>`:""}${b?`<span class="tag mv ${b[1]}">${mkTrend(h.trend)}${b[2]}</span>`:""}</div>
      ${others.length?`<div class="other"><span>Còn đi:</span>${others.map(x=>`<button data-go="${x.id}" style="--lc:var(--l-${x.lane})"><i></i>${LANES[x.lane]}${x.sec?" (phụ)":""} · ${x.tier}</button>`).join("")}</div>`:""}
      ${buildHTML(h)}
      <h4 class="bds-h">Vì sao tier ${h.tier}</h4>
      ${breakdown(h)}
      <p>${h.note||`Không có thay đổi ở bản ${PATCH}.`}</p>
      ${counterHTML(h)}
      ${skillHTML(h)}
      <button class="cta m-share2" id="mshare2" type="button">${ui("m8.3 10.9 7.4-3.8M8.3 13.1l7.4 3.8",'<circle cx="17.5" cy="6" r="2.5"/><circle cx="6.5" cy="12" r="2.5"/><circle cx="17.5" cy="18" r="2.5"/>')}Gửi tướng này cho bạn bè</button>
      ${(()=>{const n=HEROES.find(x=>x.id===order[i+1]);return n?`<button class="m-next" id="mnext2" type="button"><span>Tiếp theo · ${LANES[n.lane]} · tier ${n.tier}</span><b>${n.name}</b><i aria-hidden="true">${ui("M5 12h14m-5.5-5.5L19 12l-5.5 5.5")}</i></button>`:""})()}
    </div></div></div></div>`;
  document.documentElement.classList.add("lock");hideTip();hideItip();track("xem_tuong",{tuong:h.name,duong:LANES[h.lane],tier:h.tier});
  $("mshare2").onclick=$("mshare").onclick=()=>shareLink(`${h.name} · Tier ${h.tier} ${LANES[h.lane]}`,`${h.name} đang ở tier ${h.tier} đường ${LANES[h.lane]} trên Bảng Tier Liên Quân`,pageUrl()+"#tuong-"+id);
  const shut=()=>{hideItip();$("modalRoot").innerHTML="";document.documentElement.classList.remove("lock");drawRecent();INST&&INST.maybe();document.removeEventListener("keydown",key);
    const back=document.querySelector(`#board .card[data-id="${id}"]`)||lastFocus;back&&back.focus&&back.focus(mq.matches?{preventScroll:true}:undefined)};
  const close=()=>{shut();BACK.pop("modal")};
  { const u=pageUrl()+"#tuong-"+id;
    if(nav||via==="history")BACK.set("modal",shut,u);           // sang tướng khác trong bảng chi tiết / mở lại bằng nút Tiến: không thêm mục lịch sử
    else if(!(via==="menu"&&BACK.swap("menu","modal",shut,u)))BACK.push("modal",shut,u) }
  const go=d=>{const n=order[i+d];if(n){document.removeEventListener("keydown",key);openModal(n,d)}};
  const key=e=>{if(e.key==="Escape")close();else if(e.key==="ArrowLeft")go(-1);else if(e.key==="ArrowRight")go(1);
    else if(e.key==="Tab"){const f=[...$("modalRoot").querySelectorAll("button:not(:disabled),a[href]")];if(!f.length)return;const first=f[0],last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}};
  document.addEventListener("keydown",key);
  $("veil").onclick=e=>{if(e.target.id==="veil")close()};$("mx").onclick=close;
  $("mprev").onclick=()=>go(-1);$("mnext").onclick=()=>go(1);if($("mnext2"))$("mnext2").onclick=()=>{track("tuong_tiep",{tuong:h.name});go(1)};
  pushRecent(id);
  $("modalRoot").querySelectorAll("[data-go]").forEach(bt=>bt.onclick=()=>{document.removeEventListener("keydown",key);openModal(bt.dataset.go)});
  openModal.off=()=>document.removeEventListener("keydown",key);
  fitNames($("modalRoot"));$("mx").focus({preventScroll:true});
  /* Điện thoại: vuốt xuống để đóng, vuốt ngang để sang tướng trước/sau */
  const md=$("modalRoot").querySelector(".modal");let x0=null,y0=0,dy=0,drag=false,horiz=false;
  md.addEventListener("touchstart",e=>{if(!mq.matches||e.touches.length>1){x0=null;return}const t=e.touches[0];x0=t.clientX;y0=t.clientY;dy=0;drag=false;horiz=false},{passive:true});
  md.addEventListener("touchmove",e=>{if(x0==null)return;const t=e.touches[0],ddx=t.clientX-x0,ddy=t.clientY-y0;
    if(!drag&&!horiz){if(Math.abs(ddx)>14&&Math.abs(ddx)>Math.abs(ddy)*1.5)horiz=true;else if(ddy>10&&md.scrollTop<=0)drag=true;else if(Math.abs(ddy)>10){x0=null;return}}
    if(drag){dy=Math.max(0,ddy);md.style.transition="none";md.style.transform=`translate3d(0,${dy}px,0)`;if(e.cancelable)e.preventDefault()}},{passive:false});
  md.addEventListener("touchend",e=>{if(x0==null)return;const ddx=e.changedTouches[0].clientX-x0;x0=null;
    if(drag){md.style.transition="transform .3s cubic-bezier(.22,.8,.18,1)";if(dy>110){md.style.transform="translate3d(0,100%,0)";$("veil").style.transition="opacity .3s";$("veil").style.opacity="0";setTimeout(close,260)}else md.style.transform=""}
    else if(horiz&&Math.abs(ddx)>60)go(ddx<0?1:-1)},{passive:true});
}

/* ===== Số liệu giải: bảng sắp xếp được theo cột (học từ OP.GG / Lolalytics), dùng chung bộ lọc đường, lớp, thay đổi, tìm kiếm =====
   Số liệu ĐTDV tính theo tướng, không theo đường, nên mỗi tướng một dòng (giữ ô đường chính); điện thoại xem từng đường như bảng tier */
const SCOL=[["wr","Thắng","Tỉ lệ thắng các trận được chọn ở ĐTDV"],["pk","Chọn","Tỉ lệ số trận được chọn"],["bn","Cấm","Tỉ lệ số trận bị cấm"],["pres","Có mặt","Chọn + cấm: tỉ lệ số trận tướng xuất hiện ở lượt cấm chọn"],["n","Trận","Số trận được chọn"]];
const nf1=v=>v.toLocaleString("vi-VN",{minimumFractionDigits:1,maximumFractionDigits:1});
function statOf(h){const a=aogOf(h.key,h.lane),p=prevOf(h.key,h.lane);
  if(!a)return {wr:null,pk:null,bn:null,pres:null,n:0,p};
  return {wr:a[3]?a[0]:null,pk:a[1],bn:a[2],pres:Math.round((a[1]+a[2])*10)/10,n:a[3],p}}
function delta(cur,prev,ok){if(!ok||prev==null)return "";const d=Math.round((cur-prev)*10)/10;if(Math.abs(d)<.1)return `<small class="dl">±0</small>`;
  return `<small class="dl ${d>0?"up":"down"}">${d>0?"+":"−"}${nf1(Math.abs(d))}</small>`}
function renderStats(list){
  const board=$("board"),seen=new Map();
  for(const h of list){const k=h.key==="flowborn"?h.id:h.key,o=seen.get(k);if(!o||(o.sec&&!h.sec))seen.set(k,h)}
  const rows=[...seen.values()].map(h=>[h,statOf(h)]);
  rows.sort(([a,x],[b,y])=>{const u=x[sortK],v=y[sortK];if(sortK==="wr"&&u!=null&&v!=null&&(x.n<10)!==(y.n<10))return (x.n<10)-(y.n<10);if(u==null||v==null)return (u==null)-(v==null)||(y.pres||0)-(x.pres||0)||a.name.localeCompare(b.name,"vi");
    return (u-v)*sortD||(y.pres||0)-(x.pres||0)||a.name.localeCompare(b.name,"vi")});
  const upd=(document.querySelector(".foot")?.textContent.match(/\d{1,2}\/\d{1,2}(?=\/\d{4})/)||[""])[0];
  const arrow=k=>k===sortK?ui(sortD<0?"M7 10l5 5 5-5":"M7 14l5-5 5 5"):"";
  const cell=(h,s,k)=>{const v=s[k];if(v==null)return `<td class="c-${k} na">—</td>`;
    if(k==="wr"){const few=s.n<10,cls=few?"few":v>=53?"hi":v<=47?"lo":"";return `<td class="c-wr ${cls}"${few?' title="Dưới 10 trận, tỉ lệ thắng chưa đáng tin"':""}><b>${nf1(v)}</b>${delta(v,s.p&&s.p[3]>=10?s.p[0]:null,!few)}</td>`}
    const pv=s.p?(k==="pk"?s.p[1]:k==="bn"?s.p[2]:k==="pres"?s.p[1]+s.p[2]:null):null;
    return `<td class="c-${k}"><b>${k==="n"?v:nf1(v)}</b>${k==="n"?"":delta(v,pv,true)}</td>`};
  board.innerHTML=`<div class="st-cap"><span>ĐTDV mùa Đông 2026 · ${SRC.aogGames} trận${upd?" · tới "+upd:""}</span><span>Số nhỏ: so với mùa trước · bấm tên cột để sắp xếp${sortK==="wr"?" · tướng dưới 10 trận xếp sau":""}</span></div>
  <table class="stats"><thead><tr><th scope="col" class="c-hero">Tướng <small>${rows.length}</small></th>${SCOL.map(([k,l,t])=>`<th scope="col" class="c-${k}" aria-sort="${k===sortK?(sortD<0?"descending":"ascending"):"none"}"><button type="button" data-sort="${k}" title="${t}">${l}${k==="n"?"":'<span class="pc"> %</span>'}${arrow(k)}</button></th>`).join("")}</tr></thead>
  <tbody>${rows.map(([h,s],i)=>{const im=imgOf(h);return `<tr data-id="${h.id}"${s.pres==null?' class="nodata"':""}><th scope="row" class="c-hero"><button type="button" class="st-h" data-id="${h.id}" aria-label="${h.name}, ${LANES[h.lane]}, tier ${h.tier}${s.pres==null?", chưa có số liệu ĐTDV":""}"><span class="st-i">${s.pres==null?"":i+1}</span><span class="st-p" style="--lc:var(--l-${h.lane})">${im?`<img src="${im}" alt="" width="36" height="36" loading="lazy" decoding="async">`:`<span>${initials(h.name)}</span>`}</span><span class="st-n"><b>${h.name}</b><small><i class="st-t" style="--tc:var(--t-${h.tier.toLowerCase()})">${h.tier}</i>${LANES[h.lane]}${h.sec?" · phụ":""}</small></span><span class="st-m">${h.move?mkMove(h.move,moveN(h)):""}${h.trend?mkTrend(h.trend):""}</span></button></th>${SCOL.map(([k])=>cell(h,s,k)).join("")}</tr>`}).join("")}</tbody></table>`;
  syncPick()}
$("board").addEventListener("click",e=>{if(mode!=="stats")return;const b=e.target.closest("[data-sort]");
  if(b){const k=b.dataset.sort;if(k===sortK)sortD=-sortD;else{sortK=k;sortD=-1}draw();const nb=$("board").querySelector(`[data-sort="${k}"]`);nb&&nb.focus({preventScroll:true});return}
  const r=e.target.closest("tr[data-id]");if(r)openModal(r.dataset.id)});

/* Chế độ, tìm kiếm, phím tắt */
function setMode(m){if(m!==mode)track("doi_che_do",{che_do:{mine:"tu_xep",stats:"so_lieu"}[m]||"meta"});mode=m;selected=null;store("lq-mode",m==="stats"?"meta":m);$("m-meta").setAttribute("aria-pressed",m==="meta");$("m-mine").setAttribute("aria-pressed",m==="mine");$("m-stats")&&$("m-stats").setAttribute("aria-pressed",m==="stats");$("minebar").hidden=m!=="mine";hideTip();draw()}
$("m-meta").onclick=()=>setMode("meta");$("m-mine").onclick=()=>setMode("mine");$("m-stats")&&($("m-stats").onclick=()=>setMode("stats"));
// Điện thoại chỉ hiện một đường: gõ tên tướng không có ở đường đang xem thì tự chuyển sang đường có kết quả
$("q").oninput=e=>{q=e.target.value.trim();
  if(q&&mq.matches&&mode!=="mine"&&!HEROES.some(h=>h.lane===mLane&&match(h))){const l=Object.keys(LANES).find(l=>HEROES.some(h=>h.lane===l&&!h.sec&&match(h)))||Object.keys(LANES).find(l=>HEROES.some(h=>h.lane===l&&match(h)));if(l){setLane(l);return}}
  draw()};
$("q").onkeydown=e=>{if(e.key==="Escape"){e.target.value="";q="";draw();e.target.blur()}
  else if(e.key==="Enter"){const first=document.querySelector("#board .card, #board .st-h");if(first&&mode!=="mine"){e.preventDefault();openModal(first.dataset.id)}}  // chặn Enter để nó không "bấm" luôn nút × vừa được focus trong bảng chi tiết
  // Mũi tên xuống: nhảy thẳng tới thẻ tướng đầu tiên, khỏi phải Tab qua cả dãy nút lọc
  else if(e.key==="ArrowDown"){const first=document.querySelector("#board .card, #board .st-h");if(first){e.preventDefault();first.focus()}}};
document.addEventListener("keydown",e=>{if(e.key==="/"&&!$("veil")&&document.activeElement.tagName!=="INPUT"){e.preventDefault();$("q").focus()}});
$("freset").onclick=resetFilters;
function setSheet(o){const was=$("filters").classList.contains("open");if(mq.matches&&o&&!was)BACK.push("sheet",()=>sheetDom(false));else if(!o&&was)BACK.pop("sheet");sheetDom(o)}
function sheetDom(o){$("filters").classList.toggle("open",o);$("ftoggle").setAttribute("aria-expanded",o);$("fveil").hidden=!(o&&mq.matches);if(o&&mq.matches)$("fdone").focus();else if(!o)$("ftoggle").focus()}
$("ftoggle").onclick=()=>setSheet(!$("filters").classList.contains("open"));
$("fdone").onclick=()=>setSheet(false);$("fveil").onclick=()=>setSheet(false);$("fclear").onclick=()=>{resetFilters()};
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&$("filters").classList.contains("open")&&!$("veil")&&mq.matches)setSheet(false)});
$("aboutBtn").onclick=()=>{const a=$("about");a.hidden=!a.hidden;$("aboutBtn").setAttribute("aria-expanded",!a.hidden);$("aboutBtn").textContent=a.hidden?"Cách đọc bảng":"Ẩn hướng dẫn";if(!a.hidden)a.scrollIntoView({behavior:reduce.matches?"auto":"smooth",block:"start"})};
function toast(s){const t=$("toast");t.textContent=s;t.hidden=false;clearTimeout(toast.h);toast.h=setTimeout(()=>t.hidden=true,1800)}
$("rmeta").onclick=()=>{mine=freshMine();store("lq-mine2",mine);draw();toast("Đã lấy lại bảng Meta")};
$("pickX").onclick=()=>{selected=null;draw();$("minehint").textContent="Bấm chọn một tướng, rồi bấm vào hàng tier muốn đặt. Trên máy tính có thể kéo thả. Bảng tự lưu trên trình duyệt này."};
$("rclear").onclick=()=>{HEROES.forEach(h=>mine[h.id]="X");store("lq-mine2",mine);draw();toast("Đã đưa hết về Chưa xếp")};
$("copy").onclick=()=>{
  const txt="Tier list Liên Quân của tôi\n"+Object.entries(LANES).map(([l,ln])=>`[${ln}]\n`+TIERS.map(t=>`${t}: ${HEROES.filter(h=>h.lane===l&&mine[h.id]===t).map(h=>h.name).join(", ")||"—"}`).join("\n")).join("\n\n");
  try{navigator.clipboard.writeText(txt).then(()=>toast("Đã sao chép"),()=>toast("Trình duyệt không cho sao chép"))}catch(e){toast("Trình duyệt không cho sao chép")}
};

/* Thanh dính: đo chiều cao để tiêu đề cột dính ngay bên dưới */
// Đọc hết rồi mới ghi, và chỉ ghi khi đổi: ghi biến CSS ở gốc bắt tính lại kiểu cả trang, đọc sau khi ghi sẽ bắt bố cục lại ngay
let barH=mq.matches?112:61,r1H=-1;   // khớp giá trị --barh đặt sẵn trong CSS: thường không phải ghi lại
function measure(){const b=$("bar"),h=b.offsetHeight,h1=b.querySelector(".row1").offsetHeight;
  if(h!==barH){barH=h;document.documentElement.style.setProperty("--barh",h+"px")}
  if(h1!==r1H){r1H=h1;b.style.setProperty("--r1h",h1+"px")}}
try{new ResizeObserver(measure).observe($("bar"))}catch(e){addEventListener("resize",measure)}
const sentinel=document.createElement("div");$("bar").before(sentinel);
try{new IntersectionObserver(([en])=>$("bar").classList.toggle("stuck",!en.isIntersecting)).observe(sentinel)}catch(e){}
mq.addEventListener?mq.addEventListener("change",()=>{draw();measure()}):mq.addListener(()=>{draw();measure()});

/* Danh sách thay đổi bản cập nhật gần nhất (PATCH trong data.js, mỗi tướng một dòng) */
const seen=new Set();
$("log").innerHTML=HEROES.filter(h=>h.trend&&!h.sec&&!seen.has(h.key)&&seen.add(h.key)).sort((a,b)=>"down up new mix".indexOf(a.trend)-"down up new mix".indexOf(b.trend)).map(h=>`<li><span class="mv ${TR[h.trend][1]}">${mkTrend(h.trend)}${{up:"Tăng",down:"Giảm",mix:"Điều chỉnh",new:""}[h.trend]}</span><span><button data-open="${h.id}">${h.name}</button> · ${h.note.replace(/^[^:]+: /,"")}</span></li>`).join("");
$("log").onclick=e=>{const b=e.target.closest("[data-open]");if(b)openModal(b.dataset.open)};
/* Lên / xuống bậc so với lần cập nhật trước (PREV_T trong data.js) */
(function moves(){const el=$("moves"),hd=$("moveTitle"),hs=HEROES.filter(h=>h.move);if(!el||!hd||!hs.length)return;const L=Object.keys(LANES);
  const row=(m,t)=>{const a=hs.filter(h=>h.move===m).sort((x,y)=>L.indexOf(x.lane)-L.indexOf(y.lane)||TIERS.indexOf(x.tier)-TIERS.indexOf(y.tier)||x.name.localeCompare(y.name,"vi"));
    return a.length?`<div class="mvrow"><span class="mvl">${mkMove(m)}${t} · ${a.length}</span><div>${a.map(h=>`<button type="button" data-open="${h.id}">${h.name}<small>${LANES[h.lane]}${h.sec?" (phụ)":""} · ${h.prev}→${h.tier}</small></button>`).join("")}</div></div>`:""};
  hd.textContent=`Đổi bậc so với ngày ${PREV_DATE}`;el.innerHTML=row("up","Lên bậc")+row("down","Xuống bậc");hd.hidden=el.hidden=false;
  el.onclick=e=>{const b=e.target.closest("[data-open]");if(b)openModal(b.dataset.open)}})();
(function logMore(){const ul=$("log"),bt=$("logMore"),n=ul.children.length,more=n-6;if(!bt||more<=0)return;
  const paint=()=>{const open=!ul.classList.contains("short");bt.textContent=open?"Thu gọn":`Xem thêm ${more} thay đổi`;bt.setAttribute("aria-expanded",open)};
  ul.classList.add("short");bt.hidden=false;paint();
  bt.onclick=()=>{ul.classList.toggle("short");paint();if(ul.classList.contains("short"))ul.scrollIntoView({block:"nearest"})}})();

/* Nổi bật mỗi đường */
const TORD={S:0,A:1,B:2,C:3,D:4};
function imgOf(h){return pKey(h)?`p/${pKey(h)}.webp`:""}
/* Ảnh bìa: s/ rộng 960 (máy nhỏ), s2/ bản gốc rộng 1386 (màn lớn, điện thoại mật độ điểm ảnh cao) — trình duyệt tự chọn qua srcset */
const sp2=u=>u.replace(/^s\//,"s2/");
/* s3/: bản siêu nét rộng 2772 (Real-ESRGAN ×2 từ s2/, tools/upscale/up.py) chỉ dùng ở sân khấu, cho màn lớn / mật độ điểm ảnh cao */
// Mọi tướng có s3/ trừ Tamyn (ảnh gốc chỉ 600px). Vài ảnh gốc khác cỡ chuẩn: ghi độ rộng thật để trình duyệt chọn đúng.
const S3_NO=new Set(["tamyn"]),S3_W={evita:3194,preyta:2400,veera:4000},S2_W={evita:1597,preyta:1200,veera:2000};
// Điện thoại (kể cả xoay ngang: sizes 1040px × DPR 3 chọn s3, giải nén ~19 MB/tấm) không dùng s3, s2 đã đủ nét
const PHONE=matchMedia("(pointer:coarse)").matches&&Math.min(screen.width,screen.height)<=500;
const s3Of=u=>{const k=u.slice(2,-5);return PHONE||S3_NO.has(k)?"":`, s3/${k}.webp ${S3_W[k]||2772}w`};
function splOf(h){const k=h.key==="flowborn"?"flowborn-"+h.lane:h.key;return S_KEYS.has(k)?`s/${k}.webp`:""}
const laneTop=l=>HEROES.filter(h=>h.lane===l&&!h.sec).sort((a,b)=>TORD[a.tier]-TORD[b.tier]||b.adj-a.adj).slice(0,3);
const DUR=7000;let sIdx=0,sTimer=null,sStart=0,sLeft=DUR,sPaused=false,sVisible=true;
function buildStage(){
  const lanes=Object.keys(LANES);
  const slides=lanes.map((l,i)=>{const top=laneTop(l),h=top[0];if(!h)return"";const a=aogOf(h.key,h.lane),sp=splOf(h);
    return `<div class="slide${i===0?" on":""}" role="group" aria-roledescription="trang" aria-label="${LANES[l]}: ${h.name}" style="--lc:var(--l-${l})"${i?' aria-hidden="true"':""}>
      <img class="bg" data-src="${sp||imgOf(h)}"${sp?` data-srcset="${sp} 960w, ${sp2(sp)} ${S2_W[sp.slice(2,-5)]||1386}w${s3Of(sp)}" sizes="(max-width:719px) 440px, (max-width:900px) 1040px, 100vw"`:""} alt="" decoding="async"${sp?"":' style="filter:blur(22px) brightness(.55)"'}>
      <div class="slide-c"><div class="over"><i></i>${LANES[l]} · Hạng ${h.rank}</div>
        <h3>${h.name}</h3>
        <div class="slide-meta"><span class="tier"><b>${h.tier}</b>Tier</span><span><b>${a?a[3]:0}</b>Pick ĐTDV</span><span><b>${a?a[4]:0}</b>Lượt cấm</span><span><b>${h.score.toFixed(2)}</b>Điểm / 5</span></div>
        <div class="slide-acts"><button class="cta" data-open="${h.id}">Xem chi tiết<i></i></button>
          <div class="runners">${top.slice(1).map((x,j)=>`<button data-open="${x.id}" aria-label="${x.name}, hạng ${x.rank}, tier ${x.tier}"><img data-src="${imgOf(x)}" alt="" decoding="async"><small aria-hidden="true">${String(x.rank).padStart(2,"0")}</small>${x.name}</button>`).join("")}</div></div>
      </div></div>`}).join("");
  const tabs=`<div class="tabs" role="tablist" aria-label="Chọn đường">${lanes.map((l,i)=>`<button role="tab" aria-selected="${i===0}" data-i="${i}">${LANES[l]}<b>${(laneTop(l)[0]||{}).name||""}</b><span class="pg"></span></button>`).join("")}</div>`;
  const pp=reduce.matches?"":`<button class="stage-pp" id="stagePP" aria-label="Tạm dừng trình chiếu"></button>`;
  const st=$("stage");st.innerHTML=slides+tabs+pp;st.style.setProperty("--dur",DUR+"ms");
  // Ảnh sân khấu không tải lúc mở trang (nhường mạng cho bảng tier): tải khi người xem bắt đầu cuộn,
  // khi sân khấu sắp hiện, hoặc 2,5 giây sau khi trang tải xong — cái nào tới trước
  const kick=()=>{if(kick.done)return;kick.done=true;loadSlide(0);loadSlide(1);st.querySelectorAll(".runners img[data-src]").forEach(im=>{im.src=im.dataset.src;im.removeAttribute("data-src")})};
  try{new IntersectionObserver(([en],o)=>{if(en.isIntersecting){kick();o.disconnect()}},{rootMargin:"150px 0px"}).observe(st)}catch(e){kick()}
  addEventListener("scroll",kick,{once:true,passive:true});
  if(document.readyState==="complete")setTimeout(kick,2500);else addEventListener("load",()=>setTimeout(kick,2500),{once:true});
  st.onclick=e=>{if(e.target.closest("#stagePP")){userPaused=!userPaused;paintPP();userPaused?pauseStage(true):(sPaused=false,$("stage").classList.remove("paused"),sLeft=DUR,schedule());return}const o=e.target.closest("[data-open]");if(o)return openModal(o.dataset.open);const t=e.target.closest("[data-i]");if(t)goSlide(+t.dataset.i,true)};
  let sx=null,sy=0;
  st.addEventListener("touchstart",e=>{const t=e.touches[0];sx=(e.touches.length>1||t.clientX<24||t.clientX>innerWidth-24)?null:t.clientX;sy=t.clientY},{passive:true});
  st.addEventListener("touchend",e=>{if(sx==null)return;const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;sx=null;
    if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5)goSlide((sIdx+(dx<0?1:4))%5,true)},{passive:true});
  st.onkeydown=e=>{if(e.target.closest(".tabs")&&(e.key==="ArrowRight"||e.key==="ArrowLeft")){e.preventDefault();goSlide((sIdx+(e.key==="ArrowRight"?1:4))%5,true);st.querySelectorAll(".tabs button")[sIdx].focus()}};
  if(!reduce.matches){st.addEventListener("pointerenter",()=>pauseStage(true));st.addEventListener("pointerleave",()=>pauseStage(false));
    st.addEventListener("focusin",()=>pauseStage(true));st.addEventListener("focusout",()=>pauseStage(false));
    try{new IntersectionObserver(([en])=>{sVisible=en.isIntersecting;sVisible?schedule():clearTimeout(sTimer)}).observe(st)}catch(e){}
    schedule()}
}
function loadSlide(i){const im=$("stage").querySelectorAll(".slide img.bg")[i];if(im&&im.dataset.src){if(im.dataset.srcset){im.srcset=im.dataset.srcset;im.removeAttribute("data-srcset")}im.src=im.dataset.src;im.removeAttribute("data-src")}}
function goSlide(i,user){const st=$("stage");sIdx=i;loadSlide(i);loadSlide((i+1)%5);
  st.querySelectorAll(".slide").forEach((s,k)=>{s.classList.toggle("on",k===i);k===i?s.removeAttribute("aria-hidden"):s.setAttribute("aria-hidden","true")});
  st.querySelectorAll(".tabs button").forEach((b,k)=>b.setAttribute("aria-selected",k===i));
  sLeft=DUR;if(!reduce.matches)schedule()}
function schedule(){clearTimeout(sTimer);if(sPaused||!sVisible||reduce.matches)return;sStart=performance.now();sTimer=setTimeout(()=>goSlide((sIdx+1)%5),sLeft)}
let userPaused=false;
const PAUSE=ui("M9 6.5v11m6-11v11"),PLAY=ui("M8.5 6.3v11.4L18 12z");
function paintPP(){const b=$("stagePP");if(!b)return;b.innerHTML=userPaused?PLAY:PAUSE;b.setAttribute("aria-label",userPaused?"Tiếp tục trình chiếu":"Tạm dừng trình chiếu")}
function pauseStage(p){if(!p&&userPaused)return;sPaused=p;$("stage").classList.toggle("paused",p);if(p){clearTimeout(sTimer);sLeft=Math.max(400,sLeft-(performance.now()-sStart))}else schedule()}

/* Sáng / tối */
const SUN=ui("M12 3.2V5m0 14v1.8M3.2 12H5m14 0h1.8M5.8 5.8l1.3 1.3m9.8 9.8 1.3 1.3M5.8 18.2l1.3-1.3m9.8-9.8 1.3-1.3",'<circle cx="12" cy="12" r="3.6"/>');
const MOON=ui("M19.5 14.6A7.8 7.8 0 1 1 9.4 4.5a6.2 6.2 0 0 0 10.1 10.1z");
function curTheme(){return document.documentElement.dataset.theme||(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark")}
function paintTheme(){const t=curTheme();$("themeBtn").innerHTML=t==="dark"?SUN:MOON;$("themeBtn").setAttribute("aria-label",t==="dark"?"Chuyển sang giao diện sáng":"Chuyển sang giao diện tối")}
const savedTheme=store("lq-theme");if(savedTheme==="light"||savedTheme==="dark")document.documentElement.dataset.theme=savedTheme;
$("themeBtn").onclick=()=>{const n=curTheme()==="dark"?"light":"dark";document.documentElement.dataset.theme=n;store("lq-theme",n);paintTheme()};
paintTheme();


/* ===== Thiên hà hạt (WebGL) =====
   Khởi tạo sau khung hình đầu tiên (tạo hạt, dịch shader, đo khung): trang hiện ra trước, thiên hà hiện ngay sau đó */
// Tâm thiên hà (--gy, cũng là tâm quầng nền CSS): ResizeObserver đo ngay sau lần bố cục đầu, trước khi vẽ, nên quầng nền đứng đúng chỗ từ khung đầu
const gSmall=matchMedia("(max-width:719px)").matches;let gOff=gSmall?-0.12:-0.36;
(function(){let lastGy=gSmall?"43.5%":"68.0%";const hero=$("hero"),hc=hero.querySelector(".hero-c"),hf=hero.querySelector(".hero-foot");
  function center(){if(gSmall){const h=hero.offsetHeight||1,a=hc.offsetTop+hc.offsetHeight,b=hf.offsetTop;gOff=b-a>60?1-2*((a+b)/2/h):-0.12}
    const v=((1-gOff)*50).toFixed(1)+"%";if(v!==lastGy){lastGy=v;hero.style.setProperty("--gy",v)}}
  try{const ro=new ResizeObserver(center);ro.observe(hc);ro.observe(hf)}catch(e){center()}})();
function galaxy(){
  const cv=$("galaxy"),hero=$("hero");
  const gl=cv.getContext("webgl",{antialias:false,alpha:true,premultipliedAlpha:true});
  if(!gl){hero.classList.add("nogl");return}
  const small=gSmall;
  const lowEnd=(navigator.hardwareConcurrency||8)<=4||(navigator.deviceMemory||8)<=4;
  const N=Math.round((TOTAL_PICK+TOTAL_BAN)*(small?2.6:6)*(lowEnd?0.6:1));   // mỗi lượt chọn/cấm → vài hạt
  const ARMS=5;                                               // 5 nhánh = 5 đường
  const laneCol=[[0.89,0.42,0.28],[0.25,0.70,0.47],[0.56,0.50,0.95],[0.91,0.65,0.28],[0.31,0.64,0.90]];
  const NH=Math.round((small?150:360)*(lowEnd?0.6:1));          // lớp sương mờ: hạt to, rất nhạt, lấp khoảng tối giữa các vòng
  const data=new Float32Array((N+NH)*8);let o=0;
  const gauss=()=>{let a=0;for(let k=0;k<3;k++)a+=Math.random();return a/3-.5};
  const RINGS=[0.34,0.6,0.88];
  for(let i=0;i<N;i++){
    const arm=i%ARMS,kind=Math.random();let r,theta;
    if(kind<0.07){r=Math.abs(gauss())*0.26;theta=Math.random()*Math.PI*2}                       // lõi sáng (nhạt bớt, sương lõi lo phần toả sáng)
    else if(kind<0.70){const R=RINGS[(Math.random()*3)|0];r=R+gauss()*0.09;theta=Math.random()*Math.PI*2} // các vòng
    else{const t=Math.pow(Math.random(),.7);r=0.12+t*0.95;theta=arm*(Math.PI*2/ARMS)+r*3.4+gauss()*0.5}  // 5 nhánh xoắn = 5 đường
    const y=gauss()*0.05*(1.1-Math.min(1,r));
    const t=Math.min(1,r/0.95),lc=laneCol[arm];
    const core=Math.max(0,1-r*3);
    // tâm trắng tím → giữa tím xanh → rìa xanh ngọc pha màu đường
    let cr=0.62-0.45*t+lc[0]*0.25*t, cg=0.55+0.30*t+lc[1]*0.15*t, cb=1.0-0.35*t+lc[2]*0.10*t;
    cr+=core*0.25;cg+=core*0.2;cb+=core*0.1;
    const sparkle=Math.random()<0.015?1:0;
    data[o++]=Math.max(0.02,r);data[o++]=theta;data[o++]=y;data[o++]=(1.0+Math.random()*2.2+core*0.6+sparkle*3.5);
    data[o++]=sparkle?1.0:cr;data[o++]=sparkle?0.9:cg;data[o++]=sparkle?0.6:cb;data[o++]=(0.36+Math.random()*0.44)*(1-core*0.45);
  }
  const HS=small?34:66;
  for(let i=0;i<NH;i++){
    const kind=Math.random(),arm=i%ARMS;let r,theta,sz=HS*(0.8+Math.random()*0.7),al=0.028+Math.random()*0.022;
    if(kind<0.14){r=Math.abs(gauss())*0.3;theta=Math.random()*Math.PI*2;sz*=1.35;al*=1.3}            // quầng lõi
    else if(kind<0.75){r=RINGS[(Math.random()*3)|0]+gauss()*0.16;theta=Math.random()*Math.PI*2}
    else{const t=Math.pow(Math.random(),.7);r=0.12+t*0.95;theta=arm*(Math.PI*2/ARMS)+r*3.4+gauss()*0.7}
    r=Math.max(0.02,r);const t=Math.min(1,r/0.95),lc=laneCol[arm];
    data[o++]=r;data[o++]=theta;data[o++]=gauss()*0.06;data[o++]=sz;
    data[o++]=0.5-0.28*t+lc[0]*0.18*t;data[o++]=0.46+0.2*t+lc[1]*0.12*t;data[o++]=0.98-0.3*t;data[o++]=al;
  }
  const vs=`attribute float aR,aT,aY,aS;attribute vec3 aC;attribute float aA;
    uniform float uTime,uTilt,uAsp,uDpr,uZoom,uOff,uMaxPt;uniform vec2 uMouse;uniform float uStir;varying vec3 vC;varying float vA;
    void main(){float w=0.55/pow(aR+0.12,1.25);float th=aT+uTime*w*0.22;
      vec3 p=vec3(cos(th)*aR,aY,sin(th)*aR);
      float c=cos(uTilt),s=sin(uTilt);p=vec3(p.x,p.y*c-p.z*s,p.y*s+p.z*c);
      float z=p.z+2.6;vec2 q=p.xy*uZoom/z*2.7;q.x/=uAsp;q.y+=uOff;
      vec2 d=q-uMouse;d.x*=uAsp;float dist=length(d);float f=exp(-dist*dist*28.0)*uStir;
      q+=normalize(d+1e-4)*f*vec2(1.0/uAsp,1.0)*0.12;
      gl_Position=vec4(q,0.0,1.0);gl_PointSize=min(uMaxPt,aS*uDpr*1.7*(2.6/z)*(1.0+f*0.7));
      vC=aC*(1.0+f*0.6);vA=aA*(0.7+0.3*smoothstep(1.1,0.0,aR));}`;
  const fs=`precision mediump float;varying vec3 vC;varying float vA;
    void main(){vec2 c=gl_PointCoord-0.5;float d=length(c);float a=smoothstep(0.5,0.0,d);a=a*a*1.1;gl_FragColor=vec4(vC*a*vA,a*vA);}`;
  function sh(t,src){const s=gl.createShader(t);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw gl.getShaderInfoLog(s);return s}
  let pr;try{pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw 0}catch(e){hero.classList.add("nogl");return}
  gl.useProgram(pr);
  const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
  const at=(n,size,off)=>{const l=gl.getAttribLocation(pr,n);gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,size,gl.FLOAT,false,32,off*4)};
  at("aR",1,0);at("aT",1,1);at("aY",1,2);at("aS",1,3);at("aC",3,4);at("aA",1,7);
  const U=n=>gl.getUniformLocation(pr,n);gl.uniform1f(U("uMaxPt"),(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)||[1,64])[1]);const uOff=U("uOff"),uTime=U("uTime"),uTilt=U("uTilt"),uAsp=U("uAsp"),uDpr=U("uDpr"),uMouse=U("uMouse"),uStir=U("uStir"),uZoom=U("uZoom");
  gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE);gl.clearColor(0,0,0,0);
  let W=0,H=0,dpr=1;
  /* Tự hạ chất lượng khi máy vẽ không kịp (card đồ hoạ yếu, màn độ phân giải cao, Chrome tắt tăng tốc phần cứng → vẽ bằng CPU):
     Q0 đầy đủ · Q1 bớt ~45% hạt, độ phân giải 1× · Q2 ~30% hạt, 0,75×, 30 hình/giây · Q3 ~20% hạt, 0,6×, 24 hình/giây.
     Vẽ bằng phần mềm thì vào thẳng Q2; mỗi giây đo lại, vẫn chậm thì hạ tiếp. */
  const soft=(()=>{try{const x=gl.getExtension("WEBGL_debug_renderer_info");return /swiftshader|llvmpipe|software|basic render/i.test(gl.getParameter(x?x.UNMASKED_RENDERER_WEBGL:gl.RENDERER)||"")}catch(e){return false}})();
  let Q=soft?2:0,heroH=hero.offsetHeight||1;
  const nMain=()=>Math.round(N*[1,.55,.3,.2][Q]),nHaze=()=>Math.round(NH*[1,.6,.4,.3][Q]);
  function size(){heroH=hero.offsetHeight||1;dpr=Math.min(devicePixelRatio||1,[small?1.25:1.5,1,.75,.6][Q]);const r=cv.getBoundingClientRect();W=Math.max(1,r.width*dpr|0);H=Math.max(1,r.height*dpr|0);cv.width=W;cv.height=H;gl.viewport(0,0,W,H)}
  size();try{new ResizeObserver(size).observe(cv)}catch(e){addEventListener("resize",size)}
  let mx=9,my=9,tmx=9,tmy=9,stir=0,tstir=0,t=0,last=performance.now(),visible=true,spin=1,scS=-1;
  function setPt(cx,cy){const r=cv.getBoundingClientRect();tmx=((cx-r.left)/r.width)*2-1;tmy=-(((cy-r.top)/r.height)*2-1);tstir=1;spin=Math.min(spin+0.08,3)}
  hero.addEventListener("pointermove",e=>setPt(e.clientX,e.clientY),{passive:true});
  hero.addEventListener("pointerdown",e=>{setPt(e.clientX,e.clientY);spin=3},{passive:true});
  hero.addEventListener("pointerleave",()=>{tstir=0});
  function frame(now){
    const dt=Math.min(0.05,(now-last)/1000);last=now;
    spin+= (1-spin)*Math.min(1,dt*1.5);t+=dt*spin;
    mx+=(tmx-mx)*Math.min(1,dt*8);my+=(tmy-my)*Math.min(1,dt*8);stir+=(tstir-stir)*Math.min(1,dt*4);
    const sc0=Math.min(1,Math.max(0,scrollY/heroH));scS=scS<0||reduce.matches?sc0:scS+(sc0-scS)*Math.min(1,dt*7);const sc=scS;   // nghiêng/phóng theo cuộn có làm mượt
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uTime,t);gl.uniform1f(uTilt,0.36+sc*0.55+Math.max(-1,Math.min(1,my))*0.05*stir);gl.uniform1f(uAsp,W/H);gl.uniform1f(uDpr,dpr);
    gl.uniform1f(uOff,gOff);gl.uniform2f(uMouse,mx,my);gl.uniform1f(uStir,stir);gl.uniform1f(uZoom,(small?0.56:0.95)*(1+sc*0.25));
    gl.drawArrays(gl.POINTS,0,nMain());gl.drawArrays(gl.POINTS,N,nHaze());
    if(!cv.classList.contains("on"))cv.classList.add("on");
  }
  if(reduce.matches){frame(performance.now());addEventListener("resize",()=>frame(performance.now()));return}
  // Điện thoại: vẽ ~30 hình/giây (hạt sáng chuyển động chậm nên mắt không thấy khác), đỡ pin và bộ nhớ đồ hoạ; khuất màn hình thì dừng hẳn
  let lastDraw=0,raf=0,win=[],prev=0,ws=0,hold=performance.now()+800;
  const gap=()=>Q>=3?40:(small||Q>=2)?30:0;
  function loop(now){raf=0;if(!visible||document.hidden){last=now;prev=0;win=[];return}
    if(now-lastDraw>=gap()){
      if(prev&&now>hold){const d=now-prev;if(d<400){if(!win.length)ws=now;win.push(d)}
        if(win.length>=8&&now-ws>1000){const avg=win.reduce((a,b)=>a+b,0)/win.length;win=[];
          if(Q<3&&avg>(gap()?gap()*1.5:24)){Q++;hold=now+600;size()}}}
      prev=now;lastDraw=now;frame(now)}
    raf=requestAnimationFrame(loop)}
  const wake=()=>{if(!raf&&visible&&!document.hidden){last=performance.now();raf=requestAnimationFrame(loop)}};
  document.addEventListener("visibilitychange",wake);
  try{new IntersectionObserver(([e])=>{visible=e.isIntersecting;wake()}).observe(hero)}catch(e){}
  wake();
}
requestAnimationFrame(()=>setTimeout(galaxy,0));

const setPh=()=>{$("q").placeholder=mq.matches?"Tìm…":"Tìm tướng"};setPh();mq.addEventListener&&mq.addEventListener("change",setPh);

/* Tên tướng không xuống dòng: thu nhỏ chữ tiêu đề lớn nếu vượt khung */
function fitOne(el){el.style.fontSize="";const max=el.parentElement.clientWidth;let fs=parseFloat(getComputedStyle(el).fontSize),n=0;
  while(el.scrollWidth>max&&fs>14&&n++<40){fs-=1;el.style.fontSize=fs+"px"}}
function fitNames(root){(root||document).querySelectorAll(".slide-c h3,.modal h3").forEach(fitOne)}
{let lw=innerWidth;addEventListener("resize",()=>{if(innerWidth!==lw){lw=innerWidth;fitNames()}})}

/* Cách xếp: danh sách chỉnh tay và đường phụ lấy thẳng từ dữ liệu */
(function notes(){const ord=Object.keys(LANES),by=(a,b)=>ord.indexOf(a.lane)-ord.indexOf(b.lane)||a.name.localeCompare(b.name,"vi");
  const man=ord.map(l=>[l,HEROES.filter(h=>h.floor==="manual"&&h.lane===l).sort(by).map(h=>`${h.name} ${h.tier}${h.sec?" (phụ)":""}`)]).filter(x=>x[1].length).map(([l,n])=>`${LANES[l]}: ${n.join(", ")}`);
  const ml=$("manualList");if(ml)ml.textContent=man.join("; ")||"chưa có";
  const sec=ord.map(l=>[l,HEROES.filter(h=>h.sec&&h.lane===l).sort(by).map(h=>h.name)]).filter(x=>x[1].length).map(([l,n])=>`${LANES[l]}: ${n.join(", ")}`);
  const sl=$("secList");if(sl)sl.textContent=sec.join("; ")})();
document.querySelectorAll(".lgm[data-mk]").forEach(el=>{const k=el.dataset.mk;el.innerHTML=k==="rise"?mkMove("up"):k==="fall"?mkMove("down"):mkTrend(k)});
/* Chú giải luôn hiện */
$("legendStrip").innerHTML=`<div class="ls-t">${TIERS.map(t=>`<span class="ls-tier" style="--tc:var(--t-${t.toLowerCase()})"><b>${t}</b>${TNAME[t]}</span>`).join("")}</div>
  <div class="ls-b"><span>${mkMove("up")}Lên bậc</span><span>${mkMove("down")}Xuống bậc</span><span>${mkTrend("up")}Tăng sức mạnh</span><span>${mkTrend("down")}Giảm sức mạnh</span>${HEROES.some(h=>h.trend==="mix")?`<span>${mkTrend("mix")}Điều chỉnh</span>`:""}<span>${mkTrend("new")}Tướng mới</span><span><i class="lg sec">PHỤ</i>Đường phụ</span></div>`;

/* ===== Hiệu ứng cuộn ===== */
const seenRows=new Set();
const revIO=("IntersectionObserver" in window)&&!reduce.matches?new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;const el=en.target;
  el.classList.add("in");if(el.classList.contains("trow"))seenRows.add(mode+el.dataset.t);revIO.unobserve(el)}),{threshold:0,rootMargin:"0px 0px -8% 0px"}):null;
function observeRows(){if(!revIO)return;document.querySelectorAll("#board .trow").forEach(r=>{
  r.querySelectorAll(".card").forEach((c,k)=>c.style.setProperty("--k",Math.min(k,14)));
  if(seenRows.has(mode+r.dataset.t))return;revIO.observe(r)})}
if(revIO)document.querySelectorAll(".sec-h,.legend-strip,.filters,.box").forEach(el=>revIO.observe(el));
(function scrollFx(){
  const root=document.documentElement,hero=$("hero"),stage=$("stage"),band=$("band"),totop=$("totop"),bar=$("sprog"),ring=$("topRing");
  const heroC=hero.querySelector(".hero-c"),heroF=hero.querySelector(".hero-foot"),heroS=hero.querySelector(".hero-stats"),r1=band.querySelector(".r1"),r2=band.querySelector(".r2");
  const vis={hero:true,stage:false,band:false};
  try{const io=new IntersectionObserver(es=>{es.forEach(en=>{vis[en.target.dataset.fx]=en.isIntersecting});req()},{rootMargin:"100px"});
    hero.dataset.fx="hero";stage.dataset.fx="stage";band.dataset.fx="band";[hero,stage,band].forEach(el=>io.observe(el))}catch(e){vis.stage=vis.band=true}
  let ticking=false,maxS=1,vh=innerHeight,lastY=scrollY,acc=0,dirUp=false,stickY=0;
  const barEl=$("bar"),qEl=$("q"),filt=$("filters");let sImg=null,sTxt=null,lastTi="",lastTt="";
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const measureDoc=()=>{vh=innerHeight;maxS=Math.max(1,root.scrollHeight-vh);stickY=sentinel.getBoundingClientRect().top+scrollY};
  function update(){ticking=false;
    const y=scrollY,pp=clamp(y/maxS);
    bar.style.transform=`scaleX(${pp.toFixed(4)})`;ring.style.strokeDashoffset=(125.7*(1-pp)).toFixed(1);
    const dy=y-lastY;lastY=y;if(dy&&Math.sign(dy)!==Math.sign(acc))acc=0;acc+=dy;if(acc<-12)dirUp=true;else if(acc>12)dirUp=false;
    const m=mq.matches;
    // Điện thoại: chỉ hiện nút lên đầu trang khi đang cuộn ngược lên và không che sân khấu
    const showTop=m?dirUp&&y>vh*1.5&&!vis.stage&&!document.body.classList.contains("picking"):y>vh*0.9;if(totop.hidden===showTop)totop.hidden=!showTop;
    // Điện thoại: cuộn xuống trong bảng thì ẩn hàng chế độ/tìm/lọc, cuộn lên thì hiện lại
    const cp=m&&!dirUp&&y>stickY+160&&document.activeElement!==qEl&&!filt.classList.contains("open");
    if(barEl.classList.contains("compact")!==cp)barEl.classList.toggle("compact",cp);
    if(reduce.matches)return;
    if(vis.hero){const hp=clamp(y/((hero.offsetHeight||1)*0.75));
      heroC.style.transform=`translate3d(0,${(-140*hp).toFixed(1)}px,0)`;heroC.style.opacity=(1-hp*1.5).toFixed(3);
      heroF.style.opacity=(1-hp*2.2).toFixed(3);if(!m)heroS.style.transform=`translate3d(0,${(-18*hp).toFixed(1)}px,0)`}
    // Sân khấu luôn tràn kín mép, không có viền ở bất kỳ bước cuộn nào (chủ web không muốn viền kem hay viền đen hai bên).
    // Chuyển động chỉ ở bên trong: ảnh thu dần từ 1,14 xuống ~1,1 và trôi dọc (phóng ít để ảnh nét), chữ trôi ngược. Tỉ lệ phóng luôn đủ phủ phần trôi
    // (không lộ mép ảnh). Ghi thẳng transform lên ảnh nền và khối chữ của cả 5 slide (slide mới chuyển tới cũng khớp), cùng công thức với CSS
    // (.slide img.bg / .slide-c). Trước đây đặt biến CSS trên #stage: mỗi khung hình trình duyệt phải tính lại kiểu cho mọi phần tử trong sân khấu.
    // Điện thoại: không làm thị sai cho sân khấu. transform 3D trên ảnh 5 slide giữ 5 lớp ảnh lớn trong bộ nhớ đồ hoạ suốt lúc xem trang,
    // Chrome Android thiếu bộ nhớ nên vẽ hỏng thẻ tướng ở bảng tier (ô đen/tím).
    if(m&&vis.stage){if(lastTi!=="m"){lastTi="m";lastTt="";stage.querySelectorAll(".slide img.bg,.slide-c").forEach(e=>e.style.transform="")}}
    else if(vis.stage){const sr=stage.getBoundingClientRect(),sp=clamp((vh-sr.top)/(vh+sr.height)),ty=(sp-.5)*-50;
      const s=Math.max(1.14-sp*0.08,1+(2*Math.abs(ty)+6)/Math.max(1,sr.height));
      if(!sImg||!sImg.length){sImg=stage.querySelectorAll(".slide img.bg");sTxt=stage.querySelectorAll(".slide-c")}
      const ti=`translate3d(0,${ty.toFixed(1)}px,0) scale(${s.toFixed(4)})`,tt=`translate3d(0,${((sp-.5)*40).toFixed(1)}px,0)`;
      if(ti!==lastTi){lastTi=ti;sImg.forEach(e=>e.style.transform=ti)}
      if(tt!==lastTt){lastTt=tt;sTxt.forEach(e=>e.style.transform=tt)}}
    if(vis.band){const br=band.getBoundingClientRect(),bp=clamp((vh-br.top)/(vh+br.height));
      r1.style.transform=`translate3d(${(-38*bp).toFixed(2)}%,0,0)`;r2.style.transform=`translate3d(${(-40+38*bp).toFixed(2)}%,0,0)`}
  }
  const req=()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}};
  addEventListener("scroll",req,{passive:true});addEventListener("resize",()=>{measureDoc();req()});
  // Lần đo đầu do ResizeObserver gọi ngay sau lần bố cục đầu tiên (đo ngay lúc chạy JS bắt trình duyệt bố cục cả trang thêm một lần)
  let first=true;
  try{new ResizeObserver(()=>{measureDoc();if(first){first=false;update()}else req()}).observe(document.body)}catch(e){measureDoc();update()}
  totop.onclick=()=>scrollTo({top:0,behavior:reduce.matches?"auto":"smooth"});
})();

/* ===== Đo lường (Google Analytics) ===== */
function track(name,params){try{window.gtag&&gtag("event",name,params||{})}catch(e){}}

/* ===== Chia sẻ, link riêng từng tướng ===== */
function pageUrl(){return location.origin+location.pathname}
function setHash(hh){try{history.replaceState(null,"",hh?"#"+hh:pageUrl())}catch(e){}}
async function shareLink(title,text,url){track("chia_se",{link:url.includes("#tuong-")?"tuong":"trang"});
  if(navigator.share){try{await navigator.share({title,text,url});return}catch(e){if(e&&e.name==="AbortError")return}}
  try{await navigator.clipboard.writeText(url);toast("Đã sao chép link")}catch(e){toast(url)}
}
$("sharePage").onclick=()=>shareLink("Bảng Tier Liên Quân","Tier list tướng Liên Quân theo từng đường, chấm điểm từ số liệu ĐTDV và giải đấu",pageUrl());
function openFromHash(via){const m=location.hash.match(/^#tuong-(.+)$/);if(!m||!HEROES.some(h=>h.id===m[1]))return;
  if(!via)try{history.replaceState(null,"",pageUrl())}catch(e){}openModal(m[1],0,via)}
addEventListener("hashchange",()=>{if(!$("veil"))openFromHash("history")});

/* ===== Xuất ảnh tier list ===== */
const TCOL={S:"#d9b56c",A:"#b9a9ff",B:"#86d0c3",C:"#8ea3cc",D:"#7a797f"};
const LCOL={top:"#e8805f",jg:"#5cc496",mid:"#a597ff",ad:"#e9b766",sp:"#6fb6ee"};
const loadImg=src=>new Promise(r=>{const im=new Image();im.onload=()=>r(im);im.onerror=()=>r(null);im.src=src});
// Dấu lên/xuống bậc và tăng/giảm sức mạnh trên ảnh tải về: vẽ giống hệt dấu trên web (cùng đường vẽ SVG)
const MKC={rise:[95,211,152],fall:[255,122,106],up:[95,211,152],down:[255,122,106],mix:[240,190,96],new:[217,181,108]};
function drawMarks(c,h,x1,y,font){const S=19,ls=[];x1-=3;y+=3;
  if(h.move){const k=h.move+(moveN(h)>1?"2":"");ls.push([MKC[h.move==="up"?"rise":"fall"],MKD[k],0,0,MKW[k]])}
  if(h.trend==="new")ls.push([MKC.new,"MỚI",1,2]);else if(h.trend){const k="p"+h.trend[0];ls.push([MKC[h.trend],MKD[k],0,1,MKW[k]])}
  ls.forEach(([[r,g,b],ic,txt,shape,lw])=>{c.save();c.font=`600 8.5px "JetBrains Mono",${font}`;const w=txt?Math.ceil(c.measureText(ic).width)+10:S,x=x1-w,col=a=>`rgba(${r},${g},${b},${a})`;
    const path=()=>{c.beginPath();if(shape===1)c.arc(x+S/2,y+S/2,S/2,0,Math.PI*2);else if(c.roundRect)c.roundRect(x,y,w,S,shape===2?S/2:5);else c.rect(x,y,w,S)};
    // quầng sáng
    c.shadowColor=col(.45);c.shadowBlur=10;path();c.fillStyle="rgba(8,9,13,.78)";c.fill();c.shadowBlur=0;c.shadowColor="transparent";
    const gr=c.createRadialGradient(x+w/2,y,0,x+w/2,y,S*1.2);gr.addColorStop(0,col(.34));gr.addColorStop(.6,col(.06));gr.addColorStop(1,col(.06));
    path();c.fillStyle=gr;c.fill();
    c.beginPath();if(shape===1)c.arc(x+S/2,y+S/2,S/2-.5,0,Math.PI*2);else if(c.roundRect)c.roundRect(x+.5,y+.5,w-1,S-1,shape===2?S/2-.5:4.5);else c.rect(x+.5,y+.5,w-1,S-1);
    c.strokeStyle=col(.85);c.lineWidth=1;c.stroke();
    const fg=`rgb(${r},${g},${b})`;
    if(txt){c.fillStyle=fg;c.textAlign="center";c.textBaseline="middle";c.fillText(ic,x+w/2,y+S/2+.5)}
    else{const gz=shape===1?12:11,k=gz/12;c.translate(x+(S-gz)/2,y+(S-gz)/2);c.scale(k,k);c.strokeStyle=fg;c.lineWidth=lw||1.7;c.lineCap=c.lineJoin="round";c.stroke(new Path2D(ic))}
    c.restore();y+=S+3})}
async function exportImage(which){track("tai_anh",{bang:which==="mine"?"tu_xep":"meta"});
  const btn=which==="mine"?$("dlMine"):$("dlImg");btn.setAttribute("aria-busy","true");toast("Đang tạo ảnh…");
  try{
    try{await Promise.all([document.fonts.load('200 48px "Lexend Exa"'),document.fonts.load('500 14px "Be Vietnam Pro"')])}catch(e){}
    const tierOfX=h=>which==="mine"?mine[h.id]:h.tier;
    const lanes=Object.keys(LANES),W=1680,PAD=56,LBL=130,CW=Math.floor((W-PAD*2-LBL)/5),CARD=80,GAP=10,NAMEH=22,PER=Math.max(1,Math.floor((CW-20+GAP)/(CARD+GAP)));
    const rowsH={};TIERS.forEach(t=>{const mx=Math.max(1,...lanes.map(l=>Math.ceil(HEROES.filter(h=>h.lane===l&&tierOfX(h)===t).length/PER)));rowsH[t]=mx*(CARD+NAMEH+GAP)+28});
    const HEAD=210,LANEH=56,FOOT=150,H=HEAD+LANEH+TIERS.reduce((s,t)=>s+rowsH[t]+12,0)+FOOT;
    const cv=document.createElement("canvas"),sc=2;cv.width=W*sc;cv.height=H*sc;const c=cv.getContext("2d");c.scale(sc,sc);
    const disp='"Lexend Exa","Be Vietnam Pro",sans-serif',body='"Be Vietnam Pro",system-ui,sans-serif';
    c.fillStyle="#000";c.fillRect(0,0,W,H);
    const g=c.createRadialGradient(W*.15,0,10,W*.15,0,W*.6);g.addColorStop(0,"rgba(165,151,255,.16)");g.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=g;c.fillRect(0,0,W,H*.5);
    const spaced=(t,x,y,sp)=>{for(const ch of t){c.fillText(ch,x,y);x+=c.measureText(ch).width+sp}return x};
    c.fillStyle="rgba(243,242,239,.6)";c.font=`400 15px ${disp}`;spaced(which==="mine"?"TIER LIST CỦA TÔI":"MÙA S4 2026 · BẢN VẾT NỨT THỜI KHÔNG",PAD,78,4.5);
    c.fillStyle="#f3f2ef";c.font=`200 58px ${disp}`;const x2=spaced("BẢNG TIER ",PAD,150,6);c.fillStyle="#e7cf9a";spaced("LIÊN QUÂN",x2,150,6);
    c.fillStyle="rgba(243,242,239,.55)";c.font=`400 15px ${body}`;c.textAlign="right";c.fillText(which==="mine"?"Tự xếp trên Bảng Tier Liên Quân":"Gộp số liệu ĐTDV mùa Đông, giải RoV, rank cộng đồng",W-PAD,150);c.textAlign="left";
    let y=HEAD;c.strokeStyle="rgba(255,255,255,.14)";c.lineWidth=1;
    lanes.forEach((l,i)=>{const x=PAD+LBL+i*CW+16;c.fillStyle=LCOL[l];c.beginPath();c.arc(x+5,y+26,5,0,7);c.fill();c.fillStyle="#f3f2ef";c.font=`400 14px ${disp}`;spaced(LANES[l].toUpperCase(),x+20,y+31,3);c.fillStyle=LCOL[l];c.fillRect(PAD+LBL+i*CW,y+LANEH-2,CW,2)});
    y+=LANEH+8;
    const needed=[...new Set(HEROES.filter(h=>TIERS.includes(tierOfX(h))).map(imgOf))];const imgs={};await Promise.all(needed.map(async s=>imgs[s]=await loadImg(s)));
    for(const t of TIERS){const rh=rowsH[t];
      c.fillStyle="rgba(255,255,255,.035)";c.fillRect(PAD,y,W-PAD*2,rh);c.strokeRect(PAD+.5,y+.5,W-PAD*2-1,rh-1);
      c.fillStyle=TCOL[t]+"2a";c.fillRect(PAD,y,LBL,rh);c.fillStyle=TCOL[t];c.fillRect(PAD,y,4,rh);
      c.font=`200 64px ${disp}`;c.fillText(t,PAD+24,y+76);c.fillStyle="#f3f2ef";c.font=`500 15px ${body}`;c.fillText(TNAME[t],PAD+24,y+104);
      lanes.forEach((l,i)=>{const x0=PAD+LBL+i*CW;if(i)c.fillStyle="rgba(255,255,255,.1)",c.fillRect(x0,y,1,rh);
        HEROES.filter(h=>h.lane===l&&tierOfX(h)===t).forEach((h,k)=>{const cx=x0+14+(k%PER)*(CARD+GAP),cy=y+14+Math.floor(k/PER)*(CARD+NAMEH+GAP);
          const im=imgs[imgOf(h)];if(im)c.drawImage(im,cx,cy,CARD,CARD);else{c.fillStyle=LCOL[l];c.fillRect(cx,cy,CARD,CARD)}
          c.strokeStyle=TCOL[t];c.lineWidth=t==="S"?2:1.5;c.strokeRect(cx+.75,cy+.75,CARD-1.5,CARD-1.5);c.lineWidth=1;c.strokeStyle="rgba(255,255,255,.14)";
          if(which!=="mine")drawMarks(c,h,cx+CARD,cy,body);
          if(h.sec){c.fillStyle="rgba(0,0,0,.72)";c.fillRect(cx,cy+CARD-16,CARD,16);c.fillStyle="#fff";c.font=`500 9px ${disp}`;c.textAlign="center";c.fillText("PHỤ",cx+CARD/2,cy+CARD-5);c.textAlign="left"}
          c.fillStyle="#f3f2ef";c.font=`500 12.5px ${body}`;let nm=h.name;while(c.measureText(nm).width>CARD+GAP-2&&nm.length>3)nm=nm.slice(0,-2)+"…";c.fillText(nm,cx,cy+CARD+16)})});
      y+=rh+12}
    // Chân ảnh: địa chỉ web to + mã QR để người xem ảnh được chia sẻ quét vào web (GA ghi nguồn anh_tier_list)
    const upd=(document.querySelector(".foot")?.textContent.match(/\d{1,2}\/\d{1,2}\/\d{4}/)||[""])[0];
    c.fillStyle="#f3f2ef";c.font=`300 30px ${disp}`;spaced("TIERLQ.COM",PAD,H-74,3);
    c.fillStyle="rgba(243,242,239,.6)";c.font=`400 15px ${body}`;c.fillText(`Xem build, bảng ngọc, phù hiệu từng tướng${upd?" · Cập nhật "+upd:""}`,PAD,H-44);
    const qr=await loadImg("qr.png?v=20261030"),QS=112;if(qr){const qx=W-PAD-QS,qy=H-FOOT+18;c.fillStyle="#fff";c.fillRect(qx-6,qy-6,QS+12,QS+12);c.imageSmoothingEnabled=false;c.drawImage(qr,qx,qy,QS,QS);c.imageSmoothingEnabled=true;
      c.textAlign="right";c.fillStyle="rgba(243,242,239,.6)";c.font=`400 13px ${body}`;c.fillText("Quét để xem bảng mới nhất",qx-18,qy+QS-4);c.textAlign="left"}
    const blob=await new Promise(r=>cv.toBlob(r,"image/jpeg",0.9));const name=which==="mine"?"tier-list-cua-toi.jpg":"bang-tier-lien-quan.jpg";
    const file=new File([blob],name,{type:"image/jpeg"});
    if(mq.matches&&navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:"Bảng Tier Liên Quân"});toast("Đã tạo ảnh");return}catch(e){if(e&&e.name==="AbortError")return}}
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},4000);toast("Đã tải ảnh "+name);
  }catch(e){toast("Không tạo được ảnh, thử lại sau")}finally{btn.removeAttribute("aria-busy")}
}
$("dlImg").onclick=()=>exportImage(mode);
$("dlMine").onclick=()=>exportImage("mine");

/* ===== Cài như ứng dụng + dùng khi mạng yếu ===== */
if("serviceWorker" in navigator&&location.protocol==="https:")addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
/* ===== Cuộn trôi + dừng ở thông tin quan trọng (kiểu Bugatti) =====
   Điểm dừng: đầu trang, sân khấu "Mạnh nhất mỗi đường" (giữa màn), đầu bảng tier, mục "Cách xếp và nguồn".
   Máy tính có chuột: lăn chuột thì trang trôi mượt (~0,8 s); đi ngang qua điểm dừng thì trôi êm vào đó và có lực cản,
   lăn tiếp đủ mạnh mới đi qua. Giữa các điểm (trong bảng tier dài) trôi tự do.
   Điện thoại / cảm ứng: cuộn gốc của máy; khi dừng tay gần một điểm dừng (trong ~20% chiều cao màn) thì nhẹ nhàng hút vào.
   Giảm chuyển động: tắt hết. Vùng tự cuộn bên trong (bảng chi tiết, menu, bộ lọc) cuộn riêng. */
(function glide(){if(reduce.matches)return;const H=document.documentElement;
  const stops=()=>{const vh=innerHeight,y=scrollY,o=[0],st=$("stage"),bt=$("boardTitle"),me=$("method");
    if(st){const r=st.getBoundingClientRect();o.push(Math.round(r.top+y+r.height/2-vh/2))}
    if(bt){o.push(Math.round(bt.closest(".sec").getBoundingClientRect().top+y))}
    if(me){o.push(Math.round(me.getBoundingClientRect().top+y-24))}
    const m=H.scrollHeight-vh;return o.filter(v=>v>=0&&v<=m)};
  const busyUI=()=>document.getElementById("veil")||!$("menu").hidden||document.body.classList.contains("picking");
  const jump=y=>scrollTo({top:y,behavior:"instant"});
  if(matchMedia("(hover:hover) and (pointer:fine)").matches){
    // Tới điểm dừng thì không khoá cứng: lăn tiếp chỉ "nhún" nhẹ (trang nhích ~25% lượng lăn như có lực cản),
    // lăn thêm ~1 nấc (90px) là vượt qua; ngừng lăn thì trôi êm về đúng điểm. Nhờ vậy không bị khựng.
    let target=scrollY,cur=scrollY,raf=0,last=0,at=null,push=0,decay=0;const TH=90;
    const max=()=>H.scrollHeight-innerHeight;
    const inner=(el,dy)=>{for(;el&&el!==document.body&&el!==H;el=el.parentElement){const o=getComputedStyle(el).overflowY;
      if((o==="auto"||o==="scroll")&&el.scrollHeight>el.clientHeight+1&&(dy>0?el.scrollTop+el.clientHeight<el.scrollHeight-1:el.scrollTop>0))return true}return false};
    const halt=()=>{if(raf){cancelAnimationFrame(raf);raf=0;last=0}at=null;push=0};
    function step(now){const dt=Math.min(.05,(now-(last||now))/1000)||1/60;last=now;
      cur+=(target-cur)*(1-Math.pow(1-.11,dt*60));                  // ~0,55 s, chậm dần đều
      if(Math.abs(target-cur)<.4){cur=target;jump(cur);raf=0;last=0;return}
      jump(cur);raf=requestAnimationFrame(step)}
    const go=()=>{if(!raf)raf=requestAnimationFrame(step)};
    addEventListener("wheel",e=>{if(e.ctrlKey||e.defaultPrevented||busyUI())return;
      const dy=e.deltaY*(e.deltaMode===1?40:e.deltaMode===2?innerHeight:1);if(!dy||Math.abs(e.deltaX)>Math.abs(dy)||inner(e.target,dy))return;
      e.preventDefault();if(!raf&&at===null)target=cur=scrollY;
      if(at!==null){push+=dy;clearTimeout(decay);
        if(Math.abs(push)<TH){target=Math.max(0,Math.min(max(),at+push*.25));decay=setTimeout(()=>{push=0;target=at;go()},140);go();return}
        const over=push-Math.sign(push)*TH;target=at;at=null;push=0;e=null;
        return move(over)}
      move(dy)},{passive:false});
    function move(dy){const from=target,to=Math.max(0,Math.min(max(),from+dy));
      const s=stops().filter(v=>Math.abs(v-from)>2&&(dy>0?v>from&&v<=to:v<from&&v>=to));
      if(s.length){target=dy>0?Math.min(...s):Math.max(...s);at=target;push=0}else target=to;go()}
    addEventListener("keydown",halt,true);addEventListener("mousedown",halt,true);
  }else{
    let t=0,lock=0;
    addEventListener("scroll",()=>{if(lock)return;clearTimeout(t);t=setTimeout(()=>{if(busyUI()||document.activeElement===$("q")||Date.now()<(window.__noMag||0))return;
      const y=scrollY,vh=innerHeight,n=stops().reduce((a,v)=>Math.abs(v-y)<Math.abs(a-y)?v:a,-1e9);
      if(Math.abs(n-y)>2&&Math.abs(n-y)<vh*.2){lock=1;scrollTo({top:n,behavior:"smooth"});setTimeout(()=>lock=0,800)}},180)},{passive:true});
  }
})();

if(matchMedia("(pointer:coarse)").matches)document.querySelectorAll("[data-tt]").forEach(a=>a.removeAttribute("target"));
document.addEventListener("click",e=>{if(e.target.closest("[data-tt]"))track("mo_tiktok",{noi:e.target.closest(".menu")?"menu":"cuoi_trang"})});

/* ===== Giữ chân người xem (theo số liệu GA 10/2026: ~6% quay lại, 51% mở bảng chi tiết) ===== */
// Cuộn tới một mục: bố cục phía trên có thể đổi trong lúc cuộn (ảnh, bảng hiện dần) nên kiểm lại khi dừng và chỉnh cho đúng
function goTo(el,off){if(!el)return;const want=()=>Math.max(0,el.getBoundingClientRect().top+scrollY-(off==null?($("bar").offsetHeight||0)+20:off));
  window.__noMag=Date.now()+2500;const sm=reduce.matches?"auto":"smooth";scrollTo({top:want(),behavior:sm});
  let n=0;const fix=()=>{const d=want()-scrollY;if(Math.abs(d)>4&&n++<3){window.__noMag=Date.now()+1500;scrollTo({top:want(),behavior:sm});setTimeout(fix,700)}};setTimeout(fix,900)}
// 1) Dải "bản cập nhật" ở đầu trang: cho thấy bảng luôn mới, bấm tới danh sách thay đổi
(function heroUpd(){const el=$("heroUpd");if(!el||typeof PATCH==="undefined")return;const keys=new Set(),c={up:0,down:0,new:0,mix:0};
  HEROES.forEach(h=>{if(h.trend&&!h.sec&&!keys.has(h.key)){keys.add(h.key);c[h.trend]++}});
  const rise=HEROES.filter(h=>h.move==="up").length,fall=HEROES.filter(h=>h.move==="down").length;
  const parts=[c.up&&`${c.up} tăng`,c.down&&`${c.down} giảm`,c.mix&&`${c.mix} điều chỉnh`,c.new&&`${c.new} tướng mới`,(rise||fall)&&`${rise} lên bậc, ${fall} xuống bậc`].filter(Boolean);
  if(!parts.length)return;const sh=[c.up&&`${c.up} tăng`,c.down&&`${c.down} giảm`,c.new&&`${c.new} mới`].filter(Boolean);
  el.innerHTML=`<i aria-hidden="true"></i><span class="dk">Theo bản ${PATCH} · ${parts.join(" · ")}</span><span class="mb">Bản ${PATCH} · ${sh.join(" · ")}</span><b aria-hidden="true">→</b>`;el.hidden=false;
  el.onclick=e=>{e.preventDefault();track("xem_thay_doi",{noi:"dau_trang"});goTo($("logTitle"))}})();
// 2) Tướng xem gần đây (lưu trên máy người xem)
function pushRecent(id){let r=store("lq-recent")||[];if(!Array.isArray(r))r=[];r=[id,...r.filter(x=>x!==id&&typeof x==="string")].slice(0,10);store("lq-recent",r);
  const n=(+store("lq-views")||0)+1;store("lq-views",n)}
function drawRecent(){const el=$("recent");if(!el)return;const r=(store("lq-recent")||[]).filter(id=>HEROES.some(h=>h.id===id)).slice(0,8);
  if(mode!=="meta"||r.length<2){el.hidden=true;return}
  el.innerHTML=`<span class="over">Xem gần đây</span><div class="recent-l">${r.map(id=>{const h=HEROES.find(x=>x.id===id);const im=imgOf(h);
    return `<button type="button" data-open="${id}" style="--lc:var(--l-${h.lane})">${im?`<img src="${im}" alt="" width="36" height="36" loading="lazy">`:""}<span>${h.name}<small>${LANES[h.lane]} · ${h.tier}</small></span></button>`}).join("")}</div>`;
  el.hidden=false}
{const sm=setMode;setMode=m=>{sm(m);drawRecent()}}
$("recent")&&($("recent").onclick=e=>{const b=e.target.closest("[data-open]");if(b){track("xem_gan_day",{});openModal(b.dataset.open)}});
drawRecent();
// 3) Mời thêm vào màn hình chính sau khi đã xem từ 3 tướng (Android: nút cài; iPhone: hướng dẫn); tắt thì 14 ngày sau mới hỏi lại
const INST=(()=>{const bar=$("instbar");if(!bar)return null;
  const standalone=matchMedia("(display-mode: standalone)").matches||navigator.standalone;
  const ua=navigator.userAgent,ios=/iP(hone|ad|od)/.test(ua)&&/Safari/.test(ua)&&!/CriOS|FxiOS|FBAN|FBAV|Zalo|Instagram|Line/i.test(ua);
  let evt=null;addEventListener("beforeinstallprompt",e=>{e.preventDefault();evt=e});
  addEventListener("appinstalled",()=>{track("cai_dat_xong",{});bar.hidden=true;document.body.classList.remove("inst")});
  const hide=()=>{bar.hidden=true;document.body.classList.remove("inst");store("lq-inst-off",Date.now())};
  $("instX").onclick=()=>{track("cai_dat_dong",{});hide()};
  $("instGo").onclick=async()=>{track("cai_dat_bam",{});if(evt){evt.prompt();try{await evt.userChoice}catch(e){}evt=null;hide()}else hide()};
  return {maybe(){if(standalone||bar.hidden===false)return;const off=+store("lq-inst-off")||0;if(Date.now()-off<14*864e5)return;
    if((+store("lq-views")||0)<3)return;
    if(evt){$("instTxt").innerHTML="<b>Mở bảng tier chỉ một chạm</b>Thêm vào màn hình chính, không cần tìm lại link mỗi lần có bản mới.";$("instGo").hidden=false}
    else if(ios){$("instTxt").innerHTML="<b>Thêm vào màn hình chính</b>Bấm nút Chia sẻ <span aria-hidden=\"true\">⬆</span> ở dưới rồi chọn “Thêm vào MH chính”.";$("instGo").hidden=true}
    else return;
    bar.hidden=false;document.body.classList.add("inst");track("cai_dat_hien",{})}}})();

/* ===== Menu (bảng trượt từ trái, kiểu Bugatti) ===== */
(function menu(){const m=$("menu"),btn=$("menuBtn");if(!m||!btn)return;let t=0;
  let built=0;const cards=()=>{if(built)return;built=1;$("menuCards").innerHTML=Object.keys(LANES).map(l=>{const h=laneTop(l)[0];if(!h)return"";const sp=splOf(h)||imgOf(h);
    return `<button class="menu-card" data-open="${h.id}"><img src="${sp}" alt="" decoding="async"><span><small>${LANES[l]} · Hạng 1</small><b>${h.name}</b></span></button>`}).join("");};
  let keepY=0;const B=document.body.style;
  const lock=()=>{keepY=scrollY;B.position="fixed";B.top=-keepY+"px";B.left="0";B.right="0";B.width="100%"};
  const unlock=()=>{if(B.position!=="fixed")return;B.position=B.top=B.left=B.right=B.width="";scrollTo({top:keepY,behavior:"instant"})};
  const open=()=>{cards();clearTimeout(t);m.hidden=false;lock();btn.setAttribute("aria-expanded","true");BACK.push("menu",()=>shut(false));
    requestAnimationFrame(()=>requestAnimationFrame(()=>m.classList.add("open")));m.querySelector(".menu-x").focus()};
  const shut=back=>{m.classList.remove("open");unlock();btn.setAttribute("aria-expanded","false");
    t=setTimeout(()=>{m.hidden=true},reduce.matches?0:550);if(back)btn.focus({preventScroll:true})};
  const close=back=>{shut(back);BACK.pop("menu")};
  btn.onclick=open;btn.addEventListener("pointerdown",cards,{passive:true});if(!mq.matches)setTimeout(cards,4000);
  m.addEventListener("click",e=>{const c=e.target.closest("[data-close]");if(c)return close(true);
    const a=e.target.closest(".menu-l a");if(a){if(/^\//.test(a.getAttribute("href")||""))return;if(a.hasAttribute("data-tt")){shut(false);const i=BACK.st.map(x=>x[0]).lastIndexOf("menu");if(i>=0)BACK.st.splice(i,1);return}close(false);const id=(a.getAttribute("href")||"").replace(/^#/,""),el=id&&document.getElementById(id);
      if(el&&!a.hasAttribute("data-tt")){e.preventDefault();requestAnimationFrame(()=>goTo(el,id==="spotTitle"?24:null))}return}
    const o=e.target.closest("[data-open]");if(o){shut(false);openModal(o.dataset.open,0,"menu")}});
  m.addEventListener("keydown",e=>{if(e.key==="Escape"){e.stopPropagation();close(true)}
    if(e.key==="Tab"){const f=[...m.querySelectorAll("button,a")],i=f.indexOf(document.activeElement);
      if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}});
})();

buildFilters();buildStage();paintPP();setMode(mode);  // measure() để ResizeObserver gọi sau lần bố cục đầu (gọi ngay ở đây bắt trình duyệt bố cục cả trang giữa lúc chạy JS)
openFromHash();
requestAnimationFrame(()=>fitNames());document.fonts&&document.fonts.ready.then(()=>fitNames());
