/* Đoán tướng hôm nay (/doan-tuong/) — trò chơi mỗi ngày kiểu LoLdle cho Liên Quân.
   Chạy sau assets/data.js (cần HEROES, RANK, CLASSES, LANES); bộ chiêu lấy từ assets/skills.js (tải khi cần).
   3 chế độ, mỗi chế độ một tướng riêng, cả nước cùng một đề, đổi lúc 0 giờ giờ Việt Nam:
   - Cổ điển: đoán tên, mỗi lượt so 6 thuộc tính như LoLdle (giới tính, đường, lớp, tầm đánh, tier cao nhất trên web, năm ra mắt)
     xanh = trùng, cam = trùng một phần, đỏ = sai; mũi tên ↑/↓ = đáp án cao/thấp hơn.
   - Chiêu thức: biểu tượng một chiêu (ảnh Garena), sai 4 lượt thì hiện tên chiêu.
   - Ảnh tướng: một mảnh ảnh bìa phóng to, mỗi lượt sai thì thu nhỏ dần.
   Lượt đã đoán, chuỗi ngày lưu ở localStorage (bọc try/catch); không có máy chủ, không cần tài khoản.
   Đề chọn theo hoán vị cố định của danh sách tướng (sắp theo key) và số thứ tự ngày, nên trong một vòng không lặp tướng. */
(function () {
  "use strict";
  const root = document.getElementById("dt");
  if (!root || typeof HEROES === "undefined") return;
  const V = (document.querySelector('script[src*="game.js"]') || {}).src?.split("?v=")[1] || "";
  const TIERS = ["S", "A", "B", "C", "D"];
  const EPOCH = Date.UTC(2026, 10, 25) / 864e5;                 // #1 = 25/11/2026
  const dayNow = () => Math.floor((Date.now() + 7 * 36e5) / 864e5); // ngày theo giờ Việt Nam
  const num = d => d - EPOCH + 1;
  const strip = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]/g, "");
  const track = (n, p) => { try { if (typeof gtag === "function") gtag("event", n, p || {}); } catch (e) {} };
  const store = {
    get(k, d) { try { const v = localStorage.getItem("dt:" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("dt:" + k, JSON.stringify(v)); } catch (e) {} }
  };
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  /* ---- danh sách tướng (gộp các ô cùng tướng) ---- */
  const byKey = new Map();
  for (const h of HEROES) {
    let t = byKey.get(h.key);
    if (!t) byKey.set(h.key, t = { key: h.key, name: h.name, cls: new Set(), lanes: new Set(), tier: 9, cells: [] });
    t.cls.add(h.cls); t.lanes.add(h.lane); t.cells.push(h);
    t.tier = Math.min(t.tier, TIERS.indexOf(h.tier));
  }
  const LIST = [...byKey.values()].sort((a, b) => a.key < b.key ? -1 : 1);
  for (const t of LIST) {
    const rk = RANK.d[t.key] || RANK.d[t.key + "-ad"] || RANK.d[t.key + "-mid"];
    t.gr = rk ? rk[3] : null; t.wr = rk ? rk[0] : null;
    t.img = "/p/" + (t.key === "flowborn" ? "flowborn-ad" : t.key) + ".webp";
    t.splash = "/s2/" + (t.key === "flowborn" ? "flowborn-ad" : t.key) + ".webp";
    t.page = "/tuong/" + (t.cells.find(c => !c.sec) || t.cells[0]).id + "/";
    t.q = strip(t.name);
  }
  // Giới tính và tầm đánh (gợi ý kiểu LoLdle). Nguồn: wiki Arena of Valor trên Fandom (ô "Attackrange", đại từ trong phần Lore),
  // đọc qua API ngày 25/11/2026; tướng wiki không ghi tầm đánh thì theo lớp chính (Pháp sư, Xạ thủ, Trợ thủ = đánh xa), không ghi giới tính
  // thì theo người biên tập. M = cận chiến, R = đánh xa, B = cả hai; m = Nam, f = Nữ, x = Khác, o = tuỳ chọn (Flowborn). Sửa ở tools/game/thuoc-tinh.md.
  const ATTR = "airi:Mf aleister:Rm alice:Rf allain:Mm amily:Mf annette:Rf aoi:Mf arduin:Mm arthur:Mm arum:Rf astrid:Mf ata:Mm aya:Rf azzenka:Rm baldum:Mm bijan:Mm billow:Mm biron:Mm boltbaron:Rm bonnie:Rf bright:Mm butterfly:Mf capheny:Rf celica:Rf charlotte:Mf chaugnar:Mm cresht:Mm darcy:Rm dextra:Mf dieuthuyen:Rf dirak:Rm dolia:Rf dyadia:Rf edras:Mm elandorr:Rm elsu:Rm enzo:Bm erin:Rf errol:Mm evita:Rf fennik:Rm florentino:Mm flowborn:Ro gildur:Rm goverra:Rf grakk:Mm hayate:Rm heino:Rm helen:Rf iggy:Rm ignis:Rm ilumia:Rf ishar:Rf jinna:Rm kahlii:Rf kaine:Mm keera:Mf kilgroth:Mm kriknak:Mm krixi:Rf krizzix:Rm lauriel:Rf laville:Rm liliana:Rf lindis:Rf lorion:Rm lubo:Mm lumburr:Mm maloch:Mm marja:Rf max:Mm mganga:Rm mina:Mf ming:Rm moren:Rm murad:Mm nakroth:Mm natalya:Rf ngokhong:Mm omega:Mm omen:Mm ormarr:Mm paine:Rm preyta:Rm qi:Mf quillen:Mm raz:Mm richter:Mm rouie:Rf rourke:Rm roxie:Mf ryoma:Mm sephera:Rf sinestrea:Mf skud:Mm slimz:Rm stuart:Rm superman:Mm taara:Mf tachi:Mm tamyn:Mm teemee:Mm teeri:Rf telannas:Rf thane:Mm theflash:Mm thorne:Rm toro:Mm trieuvan:Mm tulen:Rm valhein:Rm veera:Rf veres:Mf violet:Rf volkath:Mm wiro:Mm wisp:Rf wonderwoman:Mf xeniel:Mm yan:Mm ybneth:Mx yena:Mf yorn:Rm yue:Rf zata:Rm zephys:Mm zill:Rm zip:Mm zuka:Mm";
  const GEN = { m: "Nam", f: "Nữ", x: "Khác", o: "Tuỳ chọn" }, RNG = { M: ["Cận chiến"], R: ["Đánh xa"], B: ["Cận chiến", "Đánh xa"] };
  for (const tok of ATTR.split(" ")) { const [k, v] = tok.split(":"), t = byKey.get(k); if (t) { t.rng = new Set(RNG[v[0]]); t.gen = GEN[v[1]]; } }
  // Năm ra mắt (bản quốc tế): bảng "Hero(es) release timeline" ở trang Heroes của wiki Arena of Valor (Fandom), đọc 25/11/2026;
  // Dyadia, Edras, Tamyn, Evita, Flowborn lấy ngày ra mắt AoV ở Liquipedia (wiki Fandom chưa ghi). Celica chưa có nguồn nên để trống.
  const YEAR = "airi:17 aleister:17 alice:16 allain:20 amily:18 annette:18 aoi:21 arduin:17 arthur:17 arum:18 astrid:17 ata:20 aya:21 azzenka:16 baldum:18 bijan:23 billow:25 biron:24 boltbaron:24 bonnie:23 bright:20 butterfly:16 capheny:19 charlotte:24 chaugnar:16 cresht:17 darcy:19 dextra:20 dieuthuyen:17 dirak:19 dolia:24 dyadia:26 edras:25 elandorr:19 elsu:18 enzo:19 erin:24 errol:19 evita:26 fennik:17 florentino:19 flowborn:26 gildur:16 goverra:25 grakk:17 hayate:19 heino:25 helen:22 iggy:21 ignis:17 ilumia:17 ishar:19 jinna:17 kahlii:16 kaine:23 keera:20 kilgroth:17 kriknak:17 krixi:16 krizzix:19 lauriel:17 laville:20 liliana:18 lindis:18 lorion:20 lubo:16 lumburr:17 maloch:17 marja:18 max:18 mganga:16 mina:16 ming:23 moren:17 murad:17 nakroth:17 natalya:17 ngokhong:17 omega:16 omen:18 ormarr:16 paine:20 preyta:17 qi:19 quillen:18 raz:17 richter:18 rouie:20 rourke:18 roxie:18 ryoma:17 sephera:18 sinestrea:20 skud:17 slimz:17 stuart:23 superman:17 taara:16 tachi:21 tamyn:26 teemee:18 teeri:22 telannas:17 thane:16 theflash:18 thorne:20 toro:16 trieuvan:16 tulen:18 valhein:16 veera:16 veres:19 violet:17 volkath:19 wiro:18 wisp:18 wonderwoman:17 xeniel:17 yan:22 ybneth:18 yena:19 yorn:16 yue:22 zata:20 zephys:16 zill:17 zip:19 zuka:17";
  for (const tok of YEAR.split(" ")) { const [k, v] = tok.split(":"), t = byKey.get(k); if (t) t.year = 2000 + +v; }
  const find = k => byKey.get(k);

  /* ---- đề mỗi ngày ---- */
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function answerOf(mode, day, pool) {
    const n = pool.length, round = Math.floor(day / n), salt = { co: 11, chieu: 23, anh: 37 }[mode];
    const r = rng(round * 1000 + salt), p = pool.slice();
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
    return p[((day % n) + n) % n];
  }
  const skillsOf = t => (typeof SKILLS === "undefined" ? null : SKILLS[t.key === "flowborn" ? "flowborn-ad" : t.key]);
  const poolFor = mode => mode === "chieu" ? LIST.filter(t => { const s = skillsOf(t); return s && s[1].some(x => x[1]); }) : LIST;
  function puzzle(mode, day) {
    const t = answerOf(mode, day, poolFor(mode)), r = rng(day * 7 + 3);
    if (mode === "chieu") { const sk = skillsOf(t)[1].map((x, i) => [x, i]).filter(([x]) => x[1]); const [s, i] = sk[Math.floor(r() * sk.length)]; return { t, skill: s, slot: i }; }
    if (mode === "anh") return { t, x: 20 + Math.floor(r() * 60), y: 15 + Math.floor(r() * 55) };
    return { t };
  }

  /* ---- so sánh ở chế độ Cổ điển ---- */
  const setCmp = (a, b) => { const same = a.size === b.size && [...a].every(x => b.has(x)); return same ? "ok" : [...a].some(x => b.has(x)) ? "part" : "no"; };
  // giá trị nhỏ hơn = mạnh hơn (tier S=0, bậc T0=0); mũi tên chỉ phía đáp án
  const ordCmp = (g, a, lowerIsHigher) => g == null || a == null ? ["no", ""] : g === a ? ["ok", ""] : ["no", (lowerIsHigher ? a < g : a > g) ? "↑" : "↓"];
  const COLS = [
    ["Giới tính", (g, a) => [g.gen && g.gen === a.gen ? "ok" : "no", ""], g => g.gen || "–"],
    ["Đường", (g, a) => [setCmp(g.lanes, a.lanes), ""], g => [...g.lanes].map(l => LANES[l]).join(", ")],
    ["Lớp", (g, a) => [setCmp(g.cls, a.cls), ""], g => [...g.cls].map(c => CLASSES[c]).join(", ")],
    ["Tầm đánh", (g, a) => [g.rng && a.rng ? setCmp(g.rng, a.rng) : "no", ""], g => g.rng ? [...g.rng].join(", ") : "–"],
    ["Tier", (g, a) => ordCmp(g.tier, a.tier, true), g => TIERS[g.tier] || "–"],
    ["Năm ra mắt", (g, a) => ordCmp(g.year, a.year, false), g => g.year || "–"]
  ];

  /* ---- trạng thái ---- */
  let MODES = [["co", "Cổ điển"], ["chieu", "Chiêu thức"], ["anh", "Ảnh tướng"]];
  let mode = (location.hash.slice(1) in { co: 1, chieu: 1, anh: 1 }) ? location.hash.slice(1) : "co";
  const today = dayNow();
  const keyOf = m => m + ":" + today;
  const guesses = m => store.get(keyOf(m), []).filter(find);
  const solved = m => { const p = puzzle(m, today); return guesses(m).includes(p.t.key); };
  const go = m => { mode = m; history.replaceState(null, "", "#" + m); render(); };

  /* ---- khung trang (bố cục kiểu LoLdle: hàng biểu tượng chế độ, khung gợi ý, ô nhập, bảng ô vuông, chú thích màu) ---- */
  document.body.classList.add("dtg");
  // nền: ảnh bìa một tướng (không phải đáp án), mờ dần xuống nền đen
  const bgT = LIST[Math.floor(rng(today * 3 + 1)() * LIST.length)];
  const bg = el("div", "dt-bg"); bg.setAttribute("aria-hidden", "true");
  const bgi = el("img"); bgi.alt = ""; bgi.decoding = "async"; bgi.src = "/s/" + (bgT.key === "flowborn" ? "flowborn-ad" : bgT.key) + ".webp"; bg.append(bgi);
  document.body.prepend(bg);

  root.textContent = "";
  const tabs = el("div", "dt-modes"); tabs.setAttribute("role", "tablist"); tabs.setAttribute("aria-label", "Chế độ chơi");
  const panel = el("section", "dt-panel");
  const form = el("form", "dt-form"); form.setAttribute("autocomplete", "off");
  const lab = el("label", "dt-sr", "Nhập tên tướng"); lab.htmlFor = "dtIn";
  const inp = el("input"); inp.id = "dtIn"; inp.type = "text"; inp.placeholder = "Gõ tên tướng…"; inp.setAttribute("role", "combobox"); inp.setAttribute("aria-autocomplete", "list"); inp.setAttribute("aria-controls", "dtList"); inp.setAttribute("aria-expanded", "false"); inp.spellcheck = false;
  const btn = el("button", "dt-go"); btn.type = "submit"; btn.setAttribute("aria-label", "Đoán"); btn.append(el("span", null, "▶"));
  const list = el("ul", "dt-list"); list.id = "dtList"; list.setAttribute("role", "listbox"); list.hidden = true;
  form.append(lab, inp, btn, list);
  const count = el("p", "dt-count");
  const win = el("section", "dt-panel dt-win"); win.hidden = true; win.setAttribute("role", "status");
  const board = el("div", "dt-board");
  const legend = el("section", "dt-panel dt-legend");
  const yest = el("p", "dt-yest");
  root.append(tabs, panel, form, count, win, board, legend, yest);

  // biểu tượng chế độ: vòng tròn có hình, tên bên dưới, dấu ✓ khi đã đoán đúng
  const ICON = {
    co: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5" opacity=".55"/><rect x="3" y="13" width="8" height="8" rx="1.5" opacity=".55"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>',
    chieu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
    anh: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z" fill="none" stroke="currentColor" stroke-width="2"/><path d="m6 17 4-5 3 3 2-2 3 4z"/><circle cx="15.5" cy="9" r="1.6"/></svg>'
  };
  function makeTabs() { tabs.textContent = ""; for (const [m, name] of MODES) {
    const b = el("button", "dt-mode"); b.type = "button"; b.setAttribute("role", "tab"); b.dataset.m = m;
    const ring = el("span", "dt-ring"); ring.innerHTML = ICON[m]; ring.append(el("i", "dt-tick", "✓"));
    b.append(ring, el("span", "dt-mn", name));
    b.addEventListener("click", () => { if (m !== mode) go(m); });
    b.addEventListener("keydown", e => { if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return; const i = MODES.findIndex(([x]) => x === mode); go(MODES[(i + (e.key === "ArrowRight" ? 1 : MODES.length - 1)) % MODES.length][0]); tabs.querySelector(`[data-m="${mode}"]`).focus(); });
    tabs.append(b);
  } }

  /* ---- gợi ý khi gõ ---- */
  let opts = [], sel = -1;
  function suggest() {
    const q = strip(inp.value), used = new Set(guesses(mode));
    opts = q ? LIST.filter(t => !used.has(t.key) && t.q.includes(q)).sort((a, b) => (b.q.startsWith(q) - a.q.startsWith(q)) || (a.q < b.q ? -1 : 1)).slice(0, 8) : [];
    list.textContent = ""; sel = opts.length ? 0 : -1;
    opts.forEach((t, i) => {
      const li = el("li"); li.setAttribute("role", "option"); li.id = "dtO" + i; li.setAttribute("aria-selected", i === sel);
      const im = el("img"); im.src = t.img; im.alt = ""; im.width = 40; im.height = 40; im.loading = "lazy";
      li.append(im, el("span", null, t.name));
      li.addEventListener("mousedown", e => { e.preventDefault(); guess(t); });
      list.append(li);
    });
    list.hidden = !opts.length; inp.setAttribute("aria-expanded", String(!list.hidden));
    inp.setAttribute("aria-activedescendant", sel >= 0 ? "dtO" + sel : "");
  }
  function mark() { [...list.children].forEach((li, i) => li.setAttribute("aria-selected", i === sel)); inp.setAttribute("aria-activedescendant", sel >= 0 ? "dtO" + sel : ""); }
  inp.addEventListener("input", suggest);
  inp.addEventListener("keydown", e => {
    if (list.hidden) return;
    if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % opts.length; mark(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel + opts.length - 1) % opts.length; mark(); }
    else if (e.key === "Escape") { list.hidden = true; inp.setAttribute("aria-expanded", "false"); }
  });
  inp.addEventListener("blur", () => setTimeout(() => { list.hidden = true; inp.setAttribute("aria-expanded", "false"); }, 150));
  form.addEventListener("submit", e => {
    e.preventDefault();
    const q = strip(inp.value); if (!q) return;
    const t = opts[sel] || LIST.find(x => x.q === q);
    if (t && !guesses(mode).includes(t.key)) guess(t);
  });

  function guess(t) {
    const g = guesses(mode); if (solved(mode)) return;
    g.push(t.key); store.set(keyOf(mode), g);
    inp.value = ""; list.hidden = true; inp.setAttribute("aria-expanded", "false");
    const p = puzzle(mode, today);
    if (g.length === 1) track("doan_tuong_bat_dau", { che_do: mode });
    if (t.key === p.t.key) {
      track("doan_tuong_dung", { che_do: mode, so_luot: g.length });
      const st = store.get("streak:" + mode, { last: null, n: 0, best: 0 });
      st.n = st.last === today - 1 ? st.n + 1 : st.last === today ? st.n : 1; st.last = today; st.best = Math.max(st.best || 0, st.n);
      store.set("streak:" + mode, st);
    }
    render(true);
  }

  /* ---- vẽ ---- */
  const ARIA = { ok: "đúng", part: "đúng một phần", no: "sai" };
  function render(fresh) {
    const p = puzzle(mode, today), g = guesses(mode), done = g.includes(p.t.key);
    for (const b of tabs.children) { const on = b.dataset.m === mode; b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; b.classList.toggle("ok", solved(b.dataset.m)); }

    // khung gợi ý
    panel.textContent = ""; panel.className = "dt-panel dt-clue dt-" + mode;
    const title = { co: "Đoán tướng Liên Quân hôm nay!", chieu: "Chiêu này của tướng nào?", anh: "Ảnh này của tướng nào?" }[mode];
    panel.append(el("h2", "dt-pt", title));
    if (mode === "co") {
      panel.append(el("p", "dt-ps", "Gõ tên một tướng bất kỳ để bắt đầu. Mỗi ô màu cho biết tướng bạn đoán giống tướng bí ẩn ở điểm nào."));
    } else if (mode === "chieu") {
      const box = el("div", "dt-skill"); box.setAttribute("role", "img"); box.setAttribute("aria-label", "Biểu tượng chiêu cần đoán");
      const im = el("img"); im.alt = ""; im.referrerPolicy = "no-referrer"; im.width = 104; im.height = 104;
      im.addEventListener("error", () => { box.textContent = "?"; box.classList.add("dt-noimg"); });
      im.src = SKU + p.skill[1]; box.append(im);
      const slot = ["Nội tại", "Chiêu 1", "Chiêu 2", "Chiêu cuối"][p.slot] || "Chiêu " + p.slot;
      panel.append(box, el("p", "dt-ps", done || g.length >= 4 ? `${slot}: ${p.skill[0]}` : `Sai thêm ${4 - g.length} lượt sẽ hiện tên chiêu`));
    } else {
      const z = done ? 1 : Math.max(1.2, 6 - g.length * 0.7);
      const box = el("div", "dt-splash"); box.setAttribute("role", "img"); box.setAttribute("aria-label", "Một phần ảnh tướng cần đoán");
      const im = el("img"); im.src = p.t.splash; im.alt = ""; im.decoding = "async";
      im.style.transformOrigin = p.x + "% " + p.y + "%"; im.style.transform = "scale(" + z + ")";
      box.append(im);
      panel.append(box, el("p", "dt-ps", done ? "Ảnh đầy đủ" : "Mỗi lượt sai, ảnh thu nhỏ để lộ thêm"));
    }
    form.hidden = done;
    count.textContent = g.length && !done ? `Đã đoán ${g.length} lượt` : "";

    // các lượt đoán, mới nhất ở trên
    board.textContent = "";
    if (mode === "co" && g.length) {
      const tb = el("table", "dt-grid"); tb.append(el("caption", "dt-sr", "Các lượt đoán, mới nhất ở trên"));
      const hr = el("tr"); hr.append(el("th", null, "Tướng")); COLS.forEach(([n]) => hr.append(el("th", null, n)));
      const th = el("thead"); th.append(hr); tb.append(th);
      const tbody = el("tbody");
      g.slice().reverse().forEach((k, i) => {
        const t = find(k), tr = el("tr");
        const c0 = el("td", "dt-h"); const im = el("img"); im.src = t.img; im.alt = t.name; im.title = t.name; im.width = 64; im.height = 64; c0.append(im); tr.append(c0);
        COLS.forEach(([n, cmp, show], j) => {
          const [st, ar] = cmp(t, p.t), td = el("td", "dt-c " + st + (ar === "↑" ? " up" : ar === "↓" ? " down" : ""));
          td.append(el("span", null, show(t)));
          td.setAttribute("aria-label", `${n}: ${show(t)}, ${ARIA[st]}${ar === "↑" ? ", tướng bí ẩn cao hơn" : ar === "↓" ? ", tướng bí ẩn thấp hơn" : ""}`);
          if (i === 0 && fresh) { td.classList.add("flip"); td.style.animationDelay = (j * 0.3) + "s"; }
          tr.append(td);
        });
        tbody.append(tr);
      });
      tb.append(tbody);
      const wrap = el("div", "dt-scroll"); wrap.append(tb); board.append(wrap);
    } else if (g.length) {
      const ul = el("ul", "dt-wrong");
      g.slice().reverse().forEach(k => { const t = find(k), li = el("li", k === p.t.key ? "ok" : "no"); const im = el("img"); im.src = t.img; im.alt = ""; im.width = 44; im.height = 44; li.append(im, el("span", null, t.name)); ul.append(li); });
      board.append(ul);
    }

    // chú thích màu (chế độ Cổ điển)
    legend.hidden = mode !== "co"; legend.textContent = "";
    if (mode === "co") {
      legend.append(el("h2", "dt-pt dt-sm", "Chú thích màu"));
      const ul = el("ul", "dt-keys");
      [["ok", "", "Đúng"], ["part", "", "Một phần"], ["no", "", "Sai"], ["no up", "", "Cao hơn"], ["no down", "", "Thấp hơn"]].forEach(([c, , n]) => { const li = el("li"); li.append(el("span", "dt-c " + c), el("span", "dt-kn", n)); ul.append(li); });
      legend.append(ul, el("p", "dt-ps dt-small", "Một phần: trùng một trong các đường, lớp hoặc tầm đánh. Cao hơn: tướng bí ẩn có tier cao hơn (S là cao nhất) hoặc ra mắt muộn hơn. Thấp hơn: tier thấp hơn hoặc ra mắt sớm hơn."));
    }

    // thắng
    win.hidden = !done; win.textContent = "";
    if (done) {
      const st = store.get("streak:" + mode, { n: 0, best: 0 });
      win.append(el("p", "dt-gg", "Chính xác!"));
      const head = el("div", "dt-win-h"); const im = el("img"); im.src = p.t.img; im.alt = ""; im.width = 72; im.height = 72;
      const tx = el("div"); tx.append(el("p", "dt-win-l", "Bạn đã đoán ra"), el("p", "dt-win-t", p.t.name));
      head.append(im, tx); win.append(head);
      win.append(el("p", "dt-win-s", `Số lượt: ${g.length} · Chuỗi ngày đúng: ${st.n || 1}` + ((st.best || 0) > (st.n || 1) ? ` (dài nhất ${st.best})` : "")));
      const row = el("div", "dt-win-b");
      const a = el("a", "dt-btn", "Xem tier, lên đồ"); a.href = p.t.page;
      const sh = el("button", "dt-btn dt-share", "Chia sẻ kết quả"); sh.type = "button"; sh.addEventListener("click", () => share(p, g));
      row.append(sh, a); win.append(row);
      const nx = el("p", "dt-next"); win.append(nx); tick(nx);
      const other = MODES.find(([m]) => !solved(m));
      if (other) { const ob = el("button", "dt-btn dt-more", `Chơi tiếp: ${other[1]}`); ob.type = "button"; ob.addEventListener("click", () => { go(other[0]); window.scrollTo({ top: 0, behavior: "smooth" }); }); win.append(ob); }
    }
    yest.textContent = `Đề #${num(today)}`;
    if (num(today - 1) >= 1) { const y = puzzle(mode, today - 1).t; yest.append(" · Tướng hôm qua là "); const ya = el("a", null, y.name); ya.href = y.page; yest.append(ya); }
  }

  let timer = 0;
  function tick(node) {
    clearInterval(timer);
    const f = () => { const ms = (today + 1) * 864e5 - (Date.now() + 7 * 36e5); if (ms <= 0) { location.reload(); return; } const s = Math.floor(ms / 1000); node.textContent = `Đề mới sau ${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
    f(); timer = setInterval(f, 1000);
  }

  function share(p, g) {
    const name = MODES.find(([m]) => m === mode)[1];
    const lines = mode === "co" ? g.map(k => COLS.map(([, cmp]) => ({ ok: "🟩", part: "🟧", no: "🟥" })[cmp(find(k), p.t)[0]]).join("")).join("\n") : g.map(k => k === p.t.key ? "🟩" : "🟥").join("");
    const url = location.origin + "/doan-tuong/?utm_source=chia_se&utm_medium=doan_tuong";
    const text = `Đoán tướng Liên Quân #${num(today)} · ${name} · ${g.length} lượt\n${lines}\n${url}`;
    track("doan_tuong_chia_se", { che_do: mode });
    if (navigator.share) { navigator.share({ text }).catch(() => {}); return; }
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(() => toast("Đã chép kết quả, dán vào Zalo/Messenger để khoe")).catch(() => toast("Không chép được, hãy chụp màn hình"));
  }
  function toast(t) { const n = el("p", "dt-toast", t); n.setAttribute("role", "status"); document.body.append(n); setTimeout(() => n.remove(), 2600); }

  // Chiêu thức cần skills.js: tải một lần (cùng số ?v= với game.js); không tải được thì bỏ chế độ này
  function start() {
    if (typeof SKILLS === "undefined") { MODES = MODES.filter(([m]) => m !== "chieu"); if (mode === "chieu") mode = "co"; }
    makeTabs(); render();
  }
  if (typeof SKILLS === "undefined") {
    const s = document.createElement("script"); s.src = "/assets/skills.js" + (V ? "?v=" + V : ""); s.onload = start; s.onerror = start; document.head.append(s);
  } else start();
  // cho smoke.js kiểm tra: đáp án hôm nay của từng chế độ
  window.__dt = { answer: m => puzzle(m, today).t.key, names: () => LIST.map(t => t.name), keys: () => LIST.map(t => t.key), noAttr: () => LIST.filter(t => !t.gen || !t.rng).map(t => t.key) };
})();
