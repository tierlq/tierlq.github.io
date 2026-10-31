#!/usr/bin/env bash
# Kiểm tra toàn bộ trước khi đẩy lên main. Chạy: bash tools/check/all.sh   (thêm --all để đo tràn ngang mọi trang)
#  1. cú pháp mọi tệp assets/*.js
#  2. sinh lại các trang (build.js) và kiểm build từng ô tướng (check.js)
#  3. sửa assets/*.js mà chưa đổi ?v= trong index.html thì báo lỗi (quy tắc 6 trong CLAUDE.md)
#  4. link nội bộ, neo, sitemap, title/description/canonical (links.js)
#  5. chức năng trên trình duyệt ở 1440px và 390px, mở mọi bảng chi tiết (smoke.js)
set -u
cd "$(dirname "$0")/../.."
fail=0
step(){ printf '\n== %s\n' "$1"; }
step "Cú pháp JS"
for f in assets/*.js; do node --check "$f" || fail=1; done
step "Sinh trang và kiểm build"
node tools/seo/build.js | tail -1 || fail=1
node tools/builds/check.js | tail -1 || fail=1
step "Số ?v= của script"
vs=$(grep -o 'assets/[a-z]*\.js?v=[0-9]*' index.html | sed 's/.*?v=//' | sort -u)
if [ "$(echo "$vs" | wc -l)" != 1 ]; then echo "LỖI: các thẻ script dùng nhiều số ?v= khác nhau: $vs"; fail=1; fi
if git rev-parse --git-dir >/dev/null 2>&1; then
  changed=$(git diff --name-only HEAD -- 'assets/*.js')
  if [ -n "$changed" ] && ! git diff HEAD -- index.html | grep -q '^+.*?v='; then
    echo "LỖI: đã sửa $(echo $changed) nhưng chưa đổi ?v= trong index.html"; fail=1
  else echo "?v=$vs"; fi
fi
step "Link và sitemap"
node tools/check/links.js || fail=1
step "Chức năng trên trình duyệt"
NODE_PATH=$(npm root -g) node tools/check/smoke.js "$@" || fail=1
echo
if [ $fail = 0 ]; then echo "TẤT CẢ ĐẠT"; else echo "CÓ LỖI, xem ở trên"; fi
exit $fail
