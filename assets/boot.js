/* Nạp trong <head> với defer (không chặn trang hiện lên; chạy ngay khi đọc xong HTML, trước data.js và app.js).
   Tách khỏi HTML để chính sách bảo mật (CSP) không phải cho phép mã nội tuyến.
   1. Google Analytics G-5WRPCM36GN (tắt chia sẻ dữ liệu quảng cáo của Google).
   2. Chống nhúng web vào khung (iframe) của trang khác để lừa bấm: nếu bị nhúng thì ẩn trang và thử mở ra ngoài.
   3. Bật font Google sau khi tải xong (thay cho onload nội tuyến).
   4. Đo lượt bấm link tiếp thị (sự kiện GA `bam_phu_kien`) và lượt mở trang Phụ kiện từ khối gợi ý (`mo_phu_kien`), ở mọi trang. */
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
gtag("js", new Date());
gtag("config", "G-5WRPCM36GN", { allow_google_signals: false, allow_ad_personalization_signals: false });

(function () {
  if (window.self === window.top) return;
  var html = document.documentElement;
  html.classList.add("framed");
  try { window.top.location.replace(window.location.href); } catch (e) {}
  // Trình duyệt thường chặn tự chuyển trang từ khung: hiện một link để người xem tự mở web ở tab riêng
  document.addEventListener("DOMContentLoaded", function () {
    var a = document.createElement("a");
    a.className = "framed-go"; a.href = window.location.href; a.target = "_top"; a.rel = "noopener";
    a.textContent = "Mở Bảng Tier Liên Quân";
    html.appendChild(a);
  });
})();

(function () {
  var l = document.getElementById("fontcss");
  if (!l) return;
  var on = function () { l.media = "all"; };
  if (l.sheet) on(); else l.addEventListener("load", on);
})();

// Đo link tiếp thị: trước 14/11/2026 web không biết có ai bấm hay không (bảng Shopee báo 0 lượt)
document.addEventListener("click", function (e) {
  var a = e.target && e.target.closest ? e.target.closest("a") : null;
  if (!a) return;
  try {
    if ((a.rel || "").indexOf("sponsored") > -1)
      gtag("event", "bam_phu_kien", { mon: (a.getAttribute("data-mon") || a.textContent || "").trim().slice(0, 80), link: a.href, trang: location.pathname, cho: a.closest(".modal") ? "bang_chi_tiet" : a.closest(".aff") ? "trang_tuong" : "trang_phu_kien" });
    else if (a.getAttribute("href") === "/phu-kien/" && a.closest(".aff,.aff-strip"))
      gtag("event", "mo_phu_kien", { trang: location.pathname });
  } catch (err) {}
}, true);
