/* Đoán tướng hôm nay (/doan-tuong/) — trò chơi mỗi ngày kiểu LoLdle cho Liên Quân.
   Chạy sau assets/data.js (cần HEROES, RANK, CLASSES, LANES); bộ chiêu lấy từ assets/skills.js (tải khi cần).
   3 chế độ, mỗi chế độ một tướng riêng, cả nước cùng một đề, đổi lúc 0 giờ giờ Việt Nam:
   - Cổ điển: đoán tên, mỗi lượt so 5 thuộc tính (lớp, đường, tier cao nhất trên web, bậc Garena, tỉ lệ thắng rank)
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
    ["Lớp", (g, a) => [setCmp(g.cls, a.cls), ""], g => [...g.cls].map(c => CLASSES[c]).join(", ")],
    ["Đường", (g, a) => [setCmp(g.lanes, a.lanes), ""], g => [...g.lanes].map(l => LANES[l]).join(", ")],
    ["Tier", (g, a) => ordCmp(g.tier, a.tier, true), g => TIERS[g.tier] || "–"],
    ["Bậc Garena", (g, a) => ordCmp(g.gr, a.gr, true), g => g.gr == null ? "–" : "T" + g.gr],
    ["Thắng rank", (g, a) => g.wr == null || a.wr == null ? ["no", ""] : Math.abs(g.wr - a.wr) < 0.05 ? ["ok", ""] : ["no", a.wr > g.wr ? "↑" : "↓"], g => g.wr == null ? "–" : g.wr.toFixed(1).replace(".", ",") + "%"]
  ];

  /* ---- trạng thái ---- */
  let MODES = [["co", "Cổ điển"], ["chieu", "Chiêu thức"], ["anh", "Ảnh tướng"]];
  let mode = (location.hash.slice(1) in { co: 1, chieu: 1, anh: 1 }) ? location.hash.slice(1) : "co";
  const today = dayNow();
  const keyOf = m => m + ":" + today;
  const guesses = m => store.get(keyOf(m), []).filter(find);
  const solved = m => { const p = puzzle(m, today); return guesses(m).includes(p.t.key); };

  /* ---- khung trang ---- */
  root.textContent = "";
  const tabs = el("div", "dt-tabs"); tabs.setAttribute("role", "tablist"); tabs.setAttribute("aria-label", "Chế độ chơi");
  const intro = el("p", "dt-intro");
  const clue = el("div", "dt-clue");
  const form = el("form", "dt-form"); form.setAttribute("autocomplete", "off");
  const lab = el("label", "dt-sr", "Nhập tên tướng"); lab.htmlFor = "dtIn";
  const inp = el("input"); inp.id = "dtIn"; inp.type = "text"; inp.placeholder = "Gõ tên tướng…"; inp.setAttribute("role", "combobox"); inp.setAttribute("aria-autocomplete", "list"); inp.setAttribute("aria-controls", "dtList"); inp.setAttribute("aria-expanded", "false"); inp.spellcheck = false;
  const btn = el("button", "dt-go", "Đoán"); btn.type = "submit";
  const list = el("ul", "dt-list"); list.id = "dtList"; list.setAttribute("role", "listbox"); list.hidden = true;
  form.append(lab, inp, btn, list);
  const count = el("p", "dt-count");
  const board = el("div", "dt-board");
  const win = el("div", "dt-win"); win.hidden = true; win.setAttribute("role", "status");
  const yest = el("p", "dt-yest");
  root.append(tabs, intro, clue, form, count, win, board, yest);

  // 3 ô chọn chế độ: mỗi ô có hình minh hoạ cách chơi, tên, một dòng mô tả và trạng thái hôm nay
  const DESC = { co: "Đoán qua lớp, đường, tier", chieu: "Nhìn biểu tượng chiêu", anh: "Nhìn mảnh ảnh tướng" };
  function tileArt(m) {
    const a = el("span", "dt-art dt-art-" + m); a.setAttribute("aria-hidden", "true");
    if (m === "co") ["ok", "part", "no", "ok", "no"].forEach(c => a.append(el("i", c)));
    else if (m === "chieu") a.append(el("b", null, "?"));
    else { const y = puzzle("anh", today - 1).t; a.style.backgroundImage = `url("${y.splash}")`; a.append(el("b", null, "?")); }
    return a;
  }
  function makeTabs() { tabs.textContent = ""; for (const [m, name] of MODES) {
    const b = el("button", "dt-tab"); b.type = "button"; b.setAttribute("role", "tab"); b.dataset.m = m;
    b.append(tileArt(m), el("span", "dt-tn", name), el("span", "dt-td", DESC[m]), el("span", "dt-ts"));
    b.addEventListener("click", () => { if (m !== mode) { mode = m; history.replaceState(null, "", "#" + m); render(); } });
    b.addEventListener("keydown", e => { if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return; const i = MODES.findIndex(([x]) => x === mode), n = MODES[(i + (e.key === "ArrowRight" ? 1 : MODES.length - 1)) % MODES.length][0]; mode = n; history.replaceState(null, "", "#" + n); render(); tabs.querySelector(`[data-m="${n}"]`).focus(); });
    tabs.append(b);
  } }
  // dải chân dung với ô "?" ở giữa: gợi ý của chế độ Cổ điển (đúng rồi thì ô giữa hiện đáp án)
  function stage(p, done) {
    const r = rng(today * 13 + 5), pool = LIST.filter(t => t !== p.t), pick = [];
    while (pick.length < 10) { const t = pool[Math.floor(r() * pool.length)]; if (!pick.includes(t)) pick.push(t); }
    const box = el("div", "dt-stage"), row = el("div", "dt-row"); row.setAttribute("aria-hidden", "true");
    pick.forEach((t, i) => { if (i === 5) row.append(el("span", "dt-gap")); const im = el("img"); im.src = t.img; im.alt = ""; im.width = 64; im.height = 64; im.loading = "lazy"; row.append(im); });
    const mys = el("div", "dt-mys" + (done ? " won" : ""));
    if (done) { const im = el("img"); im.src = p.t.img; im.alt = p.t.name; im.width = 120; im.height = 120; mys.append(im); }
    else { mys.append(el("b", null, "?")); mys.setAttribute("role", "img"); mys.setAttribute("aria-label", "Tướng bí ẩn"); }
    box.append(row, mys);
    return box;
  }

  /* ---- gợi ý khi gõ ---- */
  let opts = [], sel = -1;
  function suggest() {
    const q = strip(inp.value), used = new Set(guesses(mode));
    opts = q ? LIST.filter(t => !used.has(t.key) && t.q.includes(q)).sort((a, b) => (b.q.startsWith(q) - a.q.startsWith(q)) || (a.q < b.q ? -1 : 1)).slice(0, 8) : [];
    list.textContent = ""; sel = opts.length ? 0 : -1;
    opts.forEach((t, i) => {
      const li = el("li"); li.setAttribute("role", "option"); li.id = "dtO" + i; li.setAttribute("aria-selected", i === sel);
      const im = el("img"); im.src = t.img; im.alt = ""; im.width = 36; im.height = 36; im.loading = "lazy";
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
  function render(fresh) {
    const p = puzzle(mode, today), g = guesses(mode), done = g.includes(p.t.key);
    for (const b of tabs.children) {
      const m = b.dataset.m, on = m === mode, n = guesses(m).length, ok = solved(m);
      b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; b.classList.toggle("ok", ok);
      b.querySelector(".dt-ts").textContent = ok ? `✓ Đúng sau ${n} lượt` : n ? `Đang đoán · ${n} lượt` : "Chưa chơi";
    }
    intro.textContent = { co: "Gõ tên một tướng bất kỳ. Các ô màu cho biết tướng đó giống tướng bí ẩn ở điểm nào.", chieu: "Chiêu này của tướng nào? Sai 4 lượt sẽ hiện tên chiêu.", anh: "Ảnh này của tướng nào? Mỗi lượt sai, ảnh thu nhỏ để lộ thêm." }[mode];
    // gợi ý
    clue.textContent = ""; clue.className = "dt-clue dt-" + mode;
    if (mode === "chieu") {
      const box = el("div", "dt-skill");
      box.setAttribute("role", "img"); box.setAttribute("aria-label", "Biểu tượng chiêu cần đoán");
      const im = el("img"); im.alt = ""; im.referrerPolicy = "no-referrer"; im.width = 96; im.height = 96;
      im.addEventListener("error", () => { box.textContent = "?"; box.classList.add("dt-noimg"); });
      im.src = SKU + p.skill[1];
      box.append(im);
      const slot = ["Nội tại", "Chiêu 1", "Chiêu 2", "Chiêu cuối"][p.slot] || "Chiêu " + p.slot;
      const hint = el("p", "dt-hint", done || g.length >= 4 ? `${slot}: ${p.skill[0]}` : `Sai ${4 - g.length} lượt nữa sẽ hiện tên chiêu`);
      clue.append(box, hint);
    } else if (mode === "co") {
      clue.append(stage(p, done), el("p", "dt-hint", done ? `Tướng bí ẩn hôm nay là ${p.t.name}` : `Tướng bí ẩn hôm nay · ${LIST.length} tướng có thể là đáp án`));
    } else if (mode === "anh") {
      const z = done ? 1 : Math.max(1.2, 6 - g.length * 0.7);
      const box = el("div", "dt-splash"); box.setAttribute("role", "img"); box.setAttribute("aria-label", "Một phần ảnh tướng cần đoán");
      const im = el("img"); im.src = p.t.splash; im.alt = ""; im.decoding = "async";
      im.style.transformOrigin = p.x + "% " + p.y + "%"; im.style.transform = "scale(" + z + ")";
      box.append(im); clue.append(box);
    }
    form.hidden = done;
    count.textContent = g.length ? `${g.length} lượt đoán` : "";
    // bảng lượt đoán (mới nhất ở trên)
    board.textContent = "";
    if (mode === "co" && g.length) {
      const tb = el("table", "dt-grid"); const cap = el("caption", "dt-sr", "Các lượt đoán, mới nhất ở trên"); tb.append(cap);
      const hr = el("tr"); hr.append(el("th", null, "Tướng")); COLS.forEach(([n]) => hr.append(el("th", null, n)));
      const th = el("thead"); th.append(hr); tb.append(th);
      const tbody = el("tbody");
      g.slice().reverse().forEach((k, i) => {
        const t = find(k), tr = el("tr");
        const c0 = el("td", "dt-h"); const im = el("img"); im.src = t.img; im.alt = t.name; im.title = t.name; im.width = 48; im.height = 48; c0.append(im); tr.append(c0);
        COLS.forEach(([n, cmp, show], j) => {
          const [st, ar] = cmp(t, p.t), td = el("td", "dt-c " + st);
          td.append(el("span", null, show(t)));
          if (ar) td.append(el("b", "dt-ar", ar));
          td.setAttribute("aria-label", `${n}: ${show(t)}, ${{ ok: "đúng", part: "đúng một phần", no: "sai" }[st]}${ar === "↑" ? ", đáp án cao hơn" : ar === "↓" ? ", đáp án thấp hơn" : ""}`);
          if (i === 0 && fresh) td.style.animationDelay = (j * 0.25) + "s";
          if (i === 0 && fresh) td.classList.add("flip");
          tr.append(td);
        });
        tbody.append(tr);
      });
      tb.append(tbody);
      const wrap = el("div", "dt-scroll"); wrap.append(tb); board.append(wrap);
      const legend = el("p", "dt-legend"); legend.innerHTML = '<span class="ok">Đúng</span><span class="part">Đúng một phần</span><span class="no">Sai</span><span>↑↓ Đáp án cao/thấp hơn (tier S, bậc T0 là cao nhất)</span>';
      board.append(legend);
    } else if (mode === "co") {
      // chưa đoán lượt nào: một lượt mẫu để thấy màu và mũi tên nghĩa là gì
      const ex = el("div", "dt-ex"); ex.append(el("p", "dt-ex-t", "Một lượt đoán sẽ trông như thế này"));
      const row = el("div", "dt-ex-row"); row.setAttribute("aria-hidden", "true");
      [["Lớp", "Pháp sư", "ok", ""], ["Đường", "Giữa, Trợ thủ", "part", ""], ["Tier", "B", "no", "↑"], ["Bậc Garena", "T2", "ok", ""], ["Thắng rank", "49,5%", "no", "↓"]].forEach(([h, v, c, a]) => {
        const cell = el("div", "dt-ex-c"); cell.append(el("span", "dt-ex-h", h)); const b = el("span", "dt-c " + c); b.append(el("span", null, v)); if (a) b.append(el("b", "dt-ar", a)); cell.append(b); row.append(cell);
      });
      const keys = el("ul", "dt-keys");
      [["ok", "Xanh", "trùng với tướng bí ẩn"], ["part", "Cam", "trùng một phần, ví dụ cùng một trong hai đường"], ["no", "Đỏ", "khác hẳn"], ["ar", "↑ ↓", "tướng bí ẩn cao hơn hay thấp hơn (tier S và bậc T0 là cao nhất)"]].forEach(([c, n, d]) => { const li = el("li", c); li.append(el("b", null, n), document.createTextNode(" " + d)); keys.append(li); });
      ex.append(row, keys); board.append(ex);
    } else if (g.length) {
      const ul = el("ul", "dt-wrong");
      g.slice().reverse().forEach(k => { const t = find(k), li = el("li", k === p.t.key ? "ok" : "no"); const im = el("img"); im.src = t.img; im.alt = ""; im.width = 40; im.height = 40; li.append(im, el("span", null, t.name)); ul.append(li); });
      board.append(ul);
    }
    // thắng
    win.hidden = !done; win.textContent = "";
    if (done) {
      const st = store.get("streak:" + mode, { n: 0, best: 0 });
      const head = el("div", "dt-win-h"); const im = el("img"); im.src = p.t.img; im.alt = ""; im.width = 64; im.height = 64;
      const tx = el("div"); tx.append(el("p", "dt-win-t", `Đúng rồi: ${p.t.name}`), el("p", "dt-win-s", `${g.length} lượt · chuỗi ${st.n || 1} ngày` + ((st.best || 0) > (st.n || 1) ? ` (dài nhất ${st.best})` : "")));
      head.append(im, tx); win.append(head);
      const row = el("div", "dt-win-b");
      const a = el("a", "dt-btn", "Xem tier, lên đồ →"); a.href = p.t.page;
      const sh = el("button", "dt-btn dt-share", "Chia sẻ kết quả"); sh.type = "button"; sh.addEventListener("click", () => share(p, g));
      row.append(a, sh); win.append(row);
      const nx = el("p", "dt-next"); win.append(nx); tick(nx);
      const other = MODES.find(([m]) => !solved(m));
      if (other) { const ob = el("button", "dt-btn dt-more", `Chơi tiếp: ${other[1]}`); ob.type = "button"; ob.addEventListener("click", () => { mode = other[0]; history.replaceState(null, "", "#" + mode); render(); window.scrollTo({ top: 0, behavior: "smooth" }); }); win.append(ob); }
    }
    yest.textContent = `Đề #${num(today)}`;
    if (num(today - 1) >= 1) { const y = puzzle(mode, today - 1).t; yest.append(` · Hôm qua là `); const ya = el("a", null, y.name); ya.href = y.page; yest.append(ya); }
  }

  let timer = 0;
  function tick(node) {
    clearInterval(timer);
    const f = () => { const ms = (today + 1) * 864e5 - (Date.now() + 7 * 36e5); if (ms <= 0) { location.reload(); return; } const s = Math.floor(ms / 1000); node.textContent = `Đề mới sau ${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
    f(); timer = setInterval(f, 1000);
  }

  function share(p, g) {
    const name = MODES.find(([m]) => m === mode)[1];
    let lines = "";
    if (mode === "co") lines = g.map(k => COLS.map(([, cmp]) => ({ ok: "🟩", part: "🟧", no: "🟥" })[cmp(find(k), p.t)[0]]).join("")).join("\n");
    else lines = g.map(k => k === p.t.key ? "🟩" : "🟥").join("");
    const url = location.origin + "/doan-tuong/?utm_source=chia_se&utm_medium=doan_tuong";
    const text = `Đoán tướng Liên Quân #${num(today)} · ${name} · ${g.length} lượt\n${lines}\n${url}`;
    track("doan_tuong_chia_se", { che_do: mode });
    if (navigator.share) { navigator.share({ text }).catch(() => {}); return; }
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(() => toast("Đã chép kết quả, dán vào Zalo/Messenger để khoe")).catch(() => toast("Không chép được, hãy chụp màn hình"));
  }
  function toast(t) { const n = el("p", "dt-toast", t); n.setAttribute("role", "status"); document.body.append(n); setTimeout(() => n.remove(), 2600); }

  // Chiêu thức cần skills.js: tải một lần (cùng số ?v= với game.js), rồi vẽ
  // skills.js không tải được thì bỏ chế độ Chiêu thức thay vì báo lỗi
  function start() {
    if (typeof SKILLS === "undefined") { MODES = MODES.filter(([m]) => m !== "chieu"); if (mode === "chieu") mode = "co"; }
    makeTabs(); render();
  }
  if (typeof SKILLS === "undefined") {
    const s = document.createElement("script"); s.src = "/assets/skills.js" + (V ? "?v=" + V : ""); s.onload = start; s.onerror = start; document.head.append(s);
  } else start();
  // cho smoke.js kiểm tra: đáp án hôm nay của từng chế độ
  window.__dt = { answer: m => puzzle(m, today).t.key, names: () => LIST.map(t => t.name), keys: () => LIST.map(t => t.key) };
})();
