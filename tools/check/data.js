/* Kiểm dữ liệu an toàn trước khi đẩy (bảo mật, thêm 22/11/2026).
   app.js ghép chữ trong builds.js / skills.js / counters.js vào HTML (innerHTML). Chữ đã qua esc(),
   nhưng đường link (nguồn build, ảnh chiêu Garena, trang ROV META) thì ghép thẳng vào href/src.
   Dữ liệu này lấy từ trang ngoài, nên chặn ở đây: link phải là https:// và không chứa ký tự phá được thuộc tính HTML.
   Chạy: node tools/check/data.js (all.sh tự chạy). Lỗi thì thoát mã 1. */
const vm = require("vm"), fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..", "..");
const ctx = {}; vm.createContext(ctx);
for (const f of ["data", "builds", "skills", "counters"])
  vm.runInContext(fs.readFileSync(path.join(root, "assets", f + ".js"), "utf8").replace(/^(const|let) /gm, "var "), ctx);

const err = [];
const BAD = /["'<>\s`\\]/;                       // ký tự có thể thoát khỏi href="…" / src="…"
const url = (u, where) => {
  if (typeof u !== "string" || !/^https:\/\//.test(u) || BAD.test(u)) return err.push(`${where}: link không an toàn ${JSON.stringify(u)}`);
  try { new URL(u) } catch (e) { err.push(`${where}: link sai ${JSON.stringify(u)}`) }
};
const part = (s, where) => { if (typeof s !== "string" || !/^[\w./%-]+$/.test(s) || s.includes("..")) err.push(`${where}: đoạn đường dẫn lạ ${JSON.stringify(s)}`) };

// 1. Link nguồn build (gồm các bộ thêm .v)
for (const [k, b] of Object.entries(ctx.BUILDS)) {
  if (b.l) url(b.l, `BUILDS["${k}"].l`);
  (b.v || []).forEach((x, i) => x.l && url(x.l, `BUILDS["${k}"].v[${i}].l`));
}
// 2. Ảnh chiêu: SKU + đường dẫn tương đối
url(ctx.SKU, "SKU");
for (const [k, [slug, list]] of Object.entries(ctx.SKILLS)) {
  part(slug, `SKILLS["${k}"] slug`);
  list.forEach(([, ic], i) => ic && part(ic, `SKILLS["${k}"][${i}] ảnh`));
}
// 3. Trang ROV META: CNSRC.base + tên trang
url(ctx.CNSRC.base, "CNSRC.base");
for (const [k, c] of Object.entries(ctx.COUNTERS)) part(c[3], `COUNTERS["${k}"] trang`);
for (const [k, s] of Object.entries(ctx.STRWK)) part(s[2], `STRWK["${k}"] trang`);
// 4. Link tiếp thị (build.js đã esc(), kiểm thêm cho chắc)
const aff = JSON.parse(fs.readFileSync(path.join(root, "tools", "seo", "affiliate.json"), "utf8")).items || [];
aff.forEach((x, i) => url(x.url, `affiliate.json mục ${i + 1}`));

if (err.length) { console.log(err.slice(0, 30).join("\n")); console.log(`LỖI: ${err.length} chỗ dữ liệu không an toàn`); process.exit(1) }
console.log(`Dữ liệu an toàn: ${Object.keys(ctx.BUILDS).length} build, ${Object.keys(ctx.SKILLS).length} bộ chiêu, ${Object.keys(ctx.COUNTERS).length} khắc chế, ${aff.length} link tiếp thị`);
