/* =====================================================================
   SỐ LIỆU NGUỒN — sửa ở đây khi có dữ liệu mới (xem CLAUDE.md)
   ===================================================================== */
const SRC = {
  // ĐTDV mùa hiện tại: [tỉ lệ thắng %, tỉ lệ pick % số trận, tỉ lệ cấm % số trận, số pick, số cấm]
  aog: {
    "elandorr": [51.38, 33.3, 34.6, 109, 113],
    "ybneth": [62.96, 33, 33, 108, 108],
    "marja": [46.67, 32.1, 41.6, 105, 136],
    "violet": [57.84, 31.2, 4.9, 102, 16],
    "astrid": [41.18, 31.2, 22.9, 102, 75],
    "flowborn-ad": [41.58, 30.9, 14.1, 101, 46],
    "billow": [48.48, 30.3, 25.7, 99, 84],
    "lorion": [47.87, 28.7, 17.7, 94, 58],
    "airi": [48.84, 26.3, 12.8, 86, 42],
    "dolia": [57.65, 26, 31.2, 85, 102],
    "zata": [54.76, 25.7, 19.9, 84, 65],
    "liliana": [50.6, 25.4, 9.8, 83, 32],
    "annette": [50, 25.1, 11, 82, 36],
    "ryoma": [51.85, 24.8, 5.5, 81, 18],
    "sinestrea": [51.85, 24.8, 44.3, 81, 145],
    "valhein": [50.62, 24.8, 18.3, 81, 60],
    "toro": [38.27, 24.8, 2.1, 81, 7],
    "thane": [49.32, 22.3, 8.6, 73, 28],
    "teemee": [45.83, 22, 11.6, 72, 38],
    "hayate": [47.14, 21.4, 8, 70, 26],
    "biron": [58.73, 19.3, 3.7, 63, 12],
    "tachi": [47.54, 18.7, 8.3, 61, 27],
    "capheny": [44.83, 17.7, 3.4, 58, 11],
    "wiro": [44.83, 17.7, 3.1, 58, 10],
    "edras": [64.91, 17.4, 15, 57, 49],
    "stuart": [54.39, 17.4, 14.1, 57, 46],
    "maloch": [50.94, 16.2, 16.5, 53, 54],
    "rouie": [67.31, 15.9, 83.2, 52, 272],
    "zephys": [43.14, 15.6, 4, 51, 13],
    "tamyn": [68.09, 14.4, 83.8, 47, 274],
    "butterfly": [61.7, 14.4, 10.7, 47, 35],
    "cresht": [48.94, 14.4, 3.4, 47, 11],
    "nakroth": [38.3, 14.4, 6.4, 47, 21],
    "mina": [75.56, 13.8, 23.9, 45, 78],
    "iggy": [46.51, 13.1, 4.9, 43, 16],
    "skud": [40.48, 12.8, 4, 42, 13],
    "qi": [51.22, 12.5, 2.4, 41, 8],
    "wisp": [42.5, 12.2, 0.6, 40, 2],
    "taara": [28.21, 11.9, 15.6, 39, 51],
    "alice": [59.46, 11.3, 6.1, 37, 20],
    "mganga": [52.78, 11, 10.7, 36, 35],
    "ignis": [38.89, 11, 3.7, 36, 12],
    "yue": [46.88, 9.8, 4.9, 32, 16],
    "florentino": [41.94, 9.5, 23.5, 31, 77],
    "yena": [32.26, 9.5, 1.5, 31, 5],
    "baldum": [43.33, 9.2, 4.9, 30, 16],
    "enzo": [34.48, 8.9, 5.2, 29, 17],
    "murad": [50, 7.3, 8.9, 24, 29],
    "richter": [69.57, 7, 0, 23, 0],
    "darcy": [52.63, 5.8, 3.7, 19, 12],
    "gildur": [47.06, 5.2, 2.4, 17, 8],
    "keera": [56.25, 4.9, 0.3, 16, 1],
    "chaugnar": [57.14, 4.3, 2.8, 14, 9],
    "elsu": [57.14, 4.3, 0.3, 14, 1],
    "omen": [57.14, 4.3, 17.7, 14, 58],
    "dyadia": [61.54, 4, 3.1, 13, 10],
    "krizzix": [38.46, 4, 5.2, 13, 17],
    "aoi": [36.36, 3.4, 0.6, 11, 2],
    "zuka": [60, 3.1, 0, 10, 0],
    "evita": [12.5, 2.4, 3.7, 8, 12],
    "preyta": [28.57, 2.1, 1.2, 7, 4],
    "trieuvan": [28.57, 2.1, 0, 7, 0],
    "rourke": [33.33, 1.8, 0.6, 6, 2],
    "goverra": [60, 1.5, 0.3, 5, 1],
    "fennik": [40, 1.5, 0.9, 5, 3],
    "wonderwoman": [100, 1.2, 0, 4, 0],
    "ata": [50, 1.2, 0.3, 4, 1],
    "heino": [25, 1.2, 0.9, 4, 3],
    "natalya": [0, 1.2, 0, 4, 0],
    "aleister": [100, 0.9, 0, 3, 0],
    "yan": [66.67, 0.9, 0, 3, 0],
    "aya": [50, 0.6, 0.9, 2, 3],
    "xeniel": [50, 0.6, 0, 2, 0],
    "yorn": [50, 0.6, 0, 2, 0],
    "kahlii": [0, 0.6, 0, 2, 0],
    "raz": [0, 0.6, 0, 2, 0],
    "roxie": [0, 0.6, 0, 2, 0],
    "zip": [0, 0.6, 0, 2, 0],
    "allain": [100, 0.3, 0, 1, 0],
    "celica": [100, 0.3, 0, 1, 0],
    "dieuthuyen": [100, 0.3, 0, 1, 0],
    "errol": [100, 0.3, 0, 1, 0],
    "omega": [100, 0.3, 0, 1, 0],
    "azzenka": [0, 0.3, 0, 1, 0],
    "charlotte": [0, 0.3, 0, 1, 0],
    "laville": [0, 0.3, 0, 1, 0],
    "lubo": [0, 0.3, 0, 1, 0],
    "tulen": [0, 0.3, 0, 1, 0]
  },
  aogGames: 327, // tổng số trận ĐTDV mùa hiện tại (cả mùa, đọc Liquipedia 22/11/2026)
  aogDone: true, // true = mùa đã kết thúc (chữ trên web ghi "cả mùa, đến chung kết <aogTo>"); tools/aog/update.js đặt false khi có số mới giữa mùa
  aogTo: "07/11", // mùa xong: ngày chung kết; giữa mùa: ngày tools/aog/update.js đọc được số mới
  // Mùa trước: cùng định dạng với aog
  prev: {
    "toro": [52.29, 36.5, 33.4, 109, 100],
    "wisp": [54.64, 32.4, 5.4, 97, 16],
    "hayate": [57.14, 30.4, 23.7, 91, 71],
    "ybneth": [51.65, 30.4, 20.1, 91, 60],
    "lorion": [58.89, 30.1, 23.4, 90, 70],
    "zephys": [45.56, 30.1, 18.1, 90, 54],
    "teemee": [55.06, 29.8, 19.1, 89, 57],
    "marja": [53.49, 28.8, 49.2, 86, 147],
    "tachi": [50.0, 27.4, 16.7, 82, 50],
    "rouie": [48.15, 27.1, 57.5, 81, 172],
    "billow": [51.28, 26.1, 19.7, 78, 59],
    "elandorr": [56.58, 25.4, 49.8, 76, 149],
    "airi": [54.93, 23.7, 14.0, 71, 42],
    "violet": [47.14, 23.4, 8.4, 70, 25],
    "capheny": [42.86, 23.4, 11.7, 70, 35],
    "ryoma": [53.62, 23.1, 11.7, 69, 35],
    "enzo": [60.29, 22.7, 10.4, 68, 31],
    "fennik": [46.97, 22.1, 6.4, 66, 19],
    "skud": [46.97, 22.1, 14.7, 66, 44],
    "qi": [56.25, 21.4, 13.4, 64, 40],
    "yena": [42.86, 21.1, 6.0, 63, 18],
    "zata": [53.33, 20.1, 26.4, 60, 79],
    "iggy": [46.43, 18.7, 6.0, 56, 18],
    "stuart": [50.0, 17.4, 16.7, 52, 50],
    "thane": [46.15, 17.4, 2.7, 52, 8],
    "mganga": [50.98, 17.1, 14.0, 51, 42],
    "keera": [35.29, 17.1, 12.4, 51, 37],
    "annette": [59.57, 15.7, 6.0, 47, 18],
    "dolia": [36.17, 15.7, 7.0, 47, 21],
    "valhein": [50.0, 15.4, 6.4, 46, 19],
    "murad": [51.11, 15.1, 28.1, 45, 84],
    "liliana": [44.44, 15.1, 4.3, 45, 13],
    "moren": [52.63, 12.7, 2.3, 38, 7],
    "richter": [43.24, 12.4, 1.7, 37, 5],
    "volkath": [51.43, 11.7, 6.0, 35, 18],
    "ignis": [55.88, 11.4, 2.3, 34, 7],
    "florentino": [48.48, 11.0, 34.8, 33, 104],
    "sinestrea": [59.38, 10.7, 87.6, 32, 262],
    "biron": [40.63, 10.7, 2.7, 32, 8],
    "edras": [38.71, 10.4, 2.7, 31, 8],
    "wiro": [50.0, 10.0, 1.7, 30, 5],
    "taara": [44.83, 9.7, 2.3, 29, 7],
    "aya": [38.46, 8.7, 9.0, 26, 27],
    "yue": [26.92, 8.7, 3.0, 26, 9],
    "omen": [32.0, 8.4, 29.1, 25, 87],
    "yan": [60.87, 7.7, 0.3, 23, 1],
    "gildur": [56.52, 7.7, 3.3, 23, 10],
    "goverra": [30.43, 7.7, 3.3, 23, 10],
    "mina": [55.0, 6.7, 11.4, 20, 34],
    "zuka": [50.0, 6.7, 0.0, 20, 0],
    "maloch": [35.0, 6.7, 5.4, 20, 16],
    "cresht": [52.63, 6.4, 1.7, 19, 5],
    "krizzix": [72.22, 6.0, 6.0, 18, 18],
    "azzenka": [47.06, 5.7, 1.3, 17, 4],
    "natalya": [50.0, 5.4, 0.3, 16, 1],
    "nakroth": [46.15, 4.3, 1.0, 13, 3],
    "flowborn-ad": [30.77, 4.3, 1.3, 13, 4],
    "errol": [58.33, 4.0, 1.0, 12, 3],
    "slimz": [50.0, 4.0, 0.0, 12, 0],
    "dyadia": [54.55, 3.7, 4.7, 11, 14],
    "aoi": [45.45, 3.7, 2.3, 11, 7],
    "heino": [55.56, 3.0, 2.0, 9, 6],
    "baldum": [33.33, 3.0, 1.3, 9, 4],
    "chaugnar": [22.22, 3.0, 1.7, 9, 5],
    "grakk": [57.14, 2.3, 1.3, 7, 4],
    "arduin": [42.86, 2.3, 0.0, 7, 0],
    "telannas": [28.57, 2.3, 0.0, 7, 0],
    "kriknak": [80.0, 1.7, 0.0, 5, 0],
    "amily": [66.67, 1.0, 0.0, 3, 0],
    "charlotte": [66.67, 1.0, 0.0, 3, 0],
    "kilgroth": [66.67, 1.0, 0.0, 3, 0],
    "ming": [66.67, 1.0, 0.0, 3, 0],
    "tulen": [66.67, 1.0, 0.0, 3, 0],
    "arthur": [33.33, 1.0, 0.0, 3, 0],
    "elsu": [33.33, 1.0, 0.3, 3, 1],
    "xeniel": [33.33, 1.0, 0.0, 3, 0],
    "max": [100.0, 0.7, 0.0, 2, 0],
    "wonderwoman": [100.0, 0.7, 0.0, 2, 0],
    "astrid": [50.0, 0.7, 0.0, 2, 0],
    "zip": [50.0, 0.7, 0.7, 2, 2],
    "raz": [0.0, 0.7, 0.0, 2, 0],
    "helen": [100.0, 0.3, 0.0, 1, 0],
    "trieuvan": [100.0, 0.3, 0.0, 1, 0],
    "erin": [0.0, 0.3, 0.0, 1, 0],
    "omega": [0.0, 0.3, 0.0, 1, 0]
  },
  prevGames: 299, // tổng số trận mùa trước
  // RoV Pro League: [tỉ lệ thắng % hoặc null nếu ít trận, pick %, cấm %]
  rpl: {
    "butterfly": [77.2, 4.0, 1.7],
    "goverra": [72.8, 1.2, 0.7],
    "slimz": [71.4, 1.6, 0.0],
    "chaugnar": [68.2, 2.5, 1.8],
    "roxie": [64.3, 1.6, 0.2],
    "krizzix": [62.8, 6.7, 7.0],
    "zuka": [59.7, 6.5, 0.3],
    "violet": [59.5, 13.8, 4.7],
    "wiro": [58.6, 3.3, 0.3],
    "omen": [57.9, 8.7, 16.5],
    "mina": [57.9, 8.7, 12.9],
    "astrid": [57.9, 6.5, 3.1],
    "cresht": [57.4, 8.6, 3.4],
    "sinestrea": [55.6, 18.3, 64.0],
    "zip": [55.6, 1.1, 0.2],
    "alice": [55.5, 7.4, 9.2],
    "wisp": [54.8, 20.2, 3.6],
    "skud": [54.5, 17.8, 9.8],
    "iggy": [54.3, 22.3, 9.2],
    "annette": [54.0, 12.9, 6.2],
    "lorion": [53.7, 27.3, 18.2],
    "taara": [53.5, 21.1, 7.1],
    "aya": [52.3, 7.6, 8.5],
    "marja": [52.1, 34.8, 39.7],
    "baldum": [52.1, 5.5, 2.9],
    "billow": [51.8, 28.2, 23.1],
    "maloch": [51.7, 12.8, 6.5],
    "ybneth": [51.7, 30.0, 25.0],
    "yena": [51.6, 18.1, 2.6],
    "volkath": [51.4, 8.2, 8.3],
    "zata": [51.3, 25.8, 38.8],
    "airi": [51.3, 13.1, 4.7],
    "elandorr": [51.2, 29.4, 47.1],
    "hayate": [51.1, 31.0, 17.1],
    "rouie": [50.5, 21.0, 68.3],
    "ryoma": [50.3, 18.6, 6.8],
    "raz": [50.0, 2.1, 0.0],
    "teemee": [50.0, 19.8, 8.2],
    "murad": [49.5, 12.9, 29.0],
    "yue": [49.0, 11.0, 6.2],
    "mganga": [48.9, 17.0, 13.2],
    "toro": [48.9, 37.3, 24.5],
    "edras": [48.7, 17.2, 14.1],
    "stuart": [48.5, 22.6, 10.4],
    "nakroth": [48.2, 12.6, 5.7],
    "enzo": [48.0, 16.9, 14.0],
    "fennik": [47.6, 19.2, 4.3],
    "tachi": [47.6, 25.4, 22.0],
    "zephys": [47.5, 23.1, 12.0],
    "capheny": [47.0, 24.5, 7.7],
    "ignis": [46.9, 13.1, 1.7],
    "omega": [46.7, 1.7, 0.0],
    "aoi": [46.6, 3.4, 1.8],
    "dolia": [46.5, 24.3, 33.2],
    "florentino": [45.8, 10.7, 35.0],
    "liliana": [45.6, 20.7, 6.3],
    "flowborn": [45.5, 16.9, 10.6],
    "moren": [44.9, 7.9, 3.0],
    "valhein": [44.2, 14.7, 11.9],
    "qi": [44.0, 27.5, 17.4],
    "thane": [43.6, 11.5, 1.6],
    "telannas": [42.8, 3.2, 0.0],
    "biron": [41.2, 13.0, 3.4],
    "keera": [39.6, 17.0, 12.9],
    "natalya": [38.9, 4.1, 0.8],
    "jinna": [38.6, 1.5, 0.0],
    "xeniel": [38.4, 1.5, 0.2],
    "elsu": [36.5, 8.4, 4.1],
    "gildur": [35.4, 3.5, 1.3],
    "heino": [34.6, 3.0, 1.1],
    "yan": [33.3, 1.7, 0.0],
    "errol": [33.3, 1.4, 0.2],
    "tulen": [33.3, 1.4, 0.0],
    "dyadia": [32.0, 2.8, 1.1],
    "ngokhong": [null, 0.4, 0.0],
    "ilumia": [null, 0.3, 0.0],
    "kriknak": [null, 0.7, 0.2],
    "grakk": [null, 0.4, 0.2],
    "bright": [null, 0.3, 0.2],
    "trieuvan": [null, 0.8, 0.0],
    "helen": [null, 0.8, 0.7],
    "azzenka": [null, 0.9, 0.0],
    "thorne": [null, 0.4, 0.0],
    "bijan": [null, 0.4, 0.0],
    "sephera": [null, 0.9, 0.0],
    "paine": [null, 0.3, 0.0],
    "erin": [null, 0.8, 0.0],
    "lubo": [null, 0.6, 0.0],
    "wonderwoman": [null, 0.9, 0.0],
    "kahlii": [null, 0.9, 0.4],
    "ming": [null, 0.7, 0.4],
    "arthur": [null, 0.9, 0.2],
    "arduin": [null, 0.8, 0.1],
    "arum": [null, 0.3, 0.0],
    "krixi": [null, 0.3, 0.0],
    "tamyn": [71.4, 1.2, 0.2],
    "richter": [69.6, 7.9, 2.4]
  },
  // Tier list rank cộng đồng (Đã tổng hợp từ @darkiaov9126 & @blvkhanhhy; từ 07/11 thêm bảng theo từng đường của @zena_sama): S+ / S / A / B / C (D chỉ dùng cho bảng Giữa 03/11)
  rm: {
    // === Bậc S+ (Đỉnh meta ở cả 2 bảng) ===
    "rouie": "S+",
    "tamyn": "S+",
    "marja": "S+",
    "ybneth": "S+",
    "sinestrea": "S+",
    "billow": "S+",
    "astrid": "S+",
    "elandorr": "S+",

    // === Bậc S (S/A+ cộng đồng & A/B giải đấu) ===
    "taara": "S",
    "florentino": "S",
    "lorion": "S",
    "annette": "S",
    "edras": "S",
    "flowborn": "S",
    "valhein": "S",
    "dolia": "S",
    "zata": "S",
    "liliana": "S",
    "airi": "S",
    "ryoma": "S",
    "biron": "S",
    "teemee": "S",
    "toro": "S",
    "thane": "S",
    "butterfly": "S",
    "tachi": "S",
    "violet": "S",
    "hayate": "S",

    // === Bậc A (S/A+ cộng đồng hoặc A cộng đồng + B giải) ===
    "nakroth": "A",
    "dyadia": "A",
    "baldum": "A",
    "azzenka": "A",
    "goverra": "A",
    "darcy": "A",
    "gildur": "A",
    "murad": "A",
    "omen": "A",
    "qi": "A",
    "enzo": "A",
    "zephys": "A",
    "aya": "A",
    "aleister": "A",
    "veres": "A",
    "mina": "A",
    "maloch": "A",
    "stuart": "A",
    "capheny": "A",
    "alice": "A",

    // === Bậc B (A cộng đồng / C giải đấu) ===
    "yena": "B",
    "volkath": "B",
    "richter": "B",
    "skud": "B",
    "krizzix": "B",
    "arthur": "B",
    "chaugnar": "B",
    "zip": "B",
    "cresht": "B",
    "iggy": "B",
    "mganga": "B",
    "natalya": "B",
    "ignis": "B",
    "yue": "B",
    "zuka": "B",
    "aoi": "B",
    "keera": "B",
    "wisp": "B",
    "wiro": "B",

    // === Bậc C (Nhóm D giải đấu & ít xuất hiện) ===
    "elsu": "C",
    "fennik": "C",
    "rourke": "C",
    "heino": "C",
    "wonderwoman": "C",
    "preyta": "C",
    "kahlii": "C",
    "dieuthuyen": "C",
    "yorn": "C",
    "laville": "C",
    "lubo": "C",
    "errol": "C",
    "yan": "C",
    "brunhilda": "C",
    "erin": "C",
    "krixi": "C",
    "raz": "C",
    "grakk": "C",
    "tulen": "C",
    "bonnie": "C",
    "bijan": "C",
    "paine": "C",
    "ming": "C",
    "slimz": "C",
    "quillen": "C",
    "kriknak": "C",
    "xeniel": "C",
    "teeri": "C",
    "ilumia": "C",
    "kaine": "C",
    "kilgroth": "C",
    "payna": "C",
    "mortos": "C",
    "theflash": "C",
    "dirak": "C",
    "boltbaron": "C",
    "superman": "C",
    "moren": "C",
    "bright": "C",
    "dextra": "C",
    "lauriel": "C",
    "ormarr": "C",
    "celica": "C",
    "ngokhong": "C",
    "thorne": "C",
    "ata": "C",
    "allain": "C",
    "helen": "C",
    "amily": "C",
    "lumburr": "C",
    "charlotte": "C",
    "telannas": "C",
    "zill": "C",
    "veera": "C",
    "arum": "C",
    "lindis": "C",
    "ishar": "C",
    "trieuvan": "C",
    "arduin": "C",
    "roxie": "C",
    "jinna": "C",
    "omega": "C",
    "sephera": "C",
    "max": "C",

    // === Tier list theo từng đường (TikTok @zena_sama 24/10/2026, tuyển thủ ANK WeiT, LiTing xếp; chủ web yêu cầu 07/11/2026) ===
    // Khoá "tướng-đường" ưu tiên hơn khoá "tướng" (đã tổng hợp ở trên) cho đúng đường đó. SS/S+/T0→S+, S/T0.5→S, A/T1→A, B/T2→B, C/T3→C, D→D, nhãn "special" bỏ qua.
    // 07/11/2026 đọc lại cả 3 bảng (chỉ so với tướng có ô ở đường đó), chủ web yêu cầu "y chang" nên tier cuối cũng ghim trong MANUAL.
    // Chỉ ghi tướng nhận ra chắc chắn từ chân dung; đường Rồng không có trong bài.
    // --- Tà Thần --- (bậc "special" không tính: Ata, Triệu Vân, Edras, Wiro)
    "tamyn-top": "S",
    "mina-top": "A",
    "murad-top": "B",
    "ngokhong-top": "B",
    "astrid-top": "B",
    "xeniel-top": "B",
    "roxie-top": "B",
    "airi-top": "S+",
    "qi-top": "S",
    "marja-top": "S",
    "florentino-top": "S",
    "taara-top": "A",
    "yan-top": "A",
    "richter-top": "A",
    "yena-top": "A",
    "biron-top": "A",
    "maloch-top": "A",
    "boltbaron-top": "A",
    "omen-top": "A",
    "skud-top": "A",
    "ryoma-top": "A",
    "volkath-top": "B",
    "charlotte-top": "B",
    "veres-top": "B",
    "zuka-top": "B",
    "max-top": "B",
    "lubo-top": "B",
    "allain-top": "C",
    "amily-top": "C",
    "kilgroth-top": "C",
    "kaine-top": "C",
    "arthur-top": "C",
    // --- Rừng --- (bảng có bậc D)
    "elandorr-jg": "S",
    "volkath-jg": "S",
    "boltbaron-jg": "A",
    "darcy-jg": "A",
    "edras-jg": "A",
    "wonderwoman-jg": "A",
    "rourke-jg": "A",
    "yan-jg": "A",
    "veres-jg": "A",
    "fennik-jg": "B",
    "tulen-jg": "B",
    "bijan-jg": "B",
    "errol-jg": "B",
    "zill-jg": "B",
    "lubo-jg": "C",
    "kilgroth-jg": "D",
    "lindis-jg": "D",
    "skud-jg": "D",
    "nakroth-jg": "S+",
    "tamyn-jg": "S+",
    "billow-jg": "S+",
    "astrid-jg": "S+",
    "sinestrea-jg": "S+",
    "aoi-jg": "S",
    "tachi-jg": "S",
    "ryoma-jg": "A",
    "ngokhong-jg": "A",
    "trieuvan-jg": "A",
    "zephys-jg": "A",
    "butterfly-jg": "A",
    "enzo-jg": "B",
    "keera-jg": "B",
    "murad-jg": "B",
    "zuka-jg": "B",
    "kriknak-jg": "C",
    "quillen-jg": "C",
    "paine-jg": "C",
    "bright-jg": "D",
    "kaine-jg": "D",
    // --- Giữa ---
    // Từ 07/11/2026 theo bảng riêng của @zena_sama đăng 03/11/2026 ("Tier Mid Meta Tác Chiến Sa Hải", SS→S+, có thêm bậc D), thay bảng 24/10 cho đường này.
    // Chủ web yêu cầu "y chang bảng này": tier cuối của các ô Giữa còn được ghim trong MANUAL (ô "-mid"). Erin, Alice, Aya, Dolia, Dyadia, The Flash được thêm ô Giữa (đường phụ trong SECONDARY).
    "lorion-mid": "S+",
    "rouie-mid": "S+",
    "darcy-mid": "S",
    "evita-mid": "S",
    "ignis-mid": "S",
    "liliana-mid": "S",
    "zata-mid": "S",
    "annette-mid": "A",
    "goverra-mid": "A",
    "iggy-mid": "A",
    "raz-mid": "A",
    "yue-mid": "A",
    "aleister-mid": "B",
    "azzenka-mid": "B",
    "dirak-mid": "B",
    "mganga-mid": "B",
    "natalya-mid": "B",
    "preyta-mid": "B",
    "dieuthuyen-mid": "C",
    "flowborn-mid": "C",
    "heino-mid": "C",
    "ilumia-mid": "C",
    "jinna-mid": "C",
    "kahlii-mid": "C",
    "krixi-mid": "C",
    "lauriel-mid": "C",
    "sephera-mid": "C",
    "tulen-mid": "C",
    "veera-mid": "C",
    "bonnie-mid": "D",
    "ishar-mid": "D",
    "erin-mid": "S",
    "alice-mid": "A",
    "aya-mid": "B",
    "dolia-mid": "C",
    "dyadia-mid": "C",
    "theflash-mid": "D",
    "gildur-mid": "B",   // bảng 03/11 không có Gildur: giữ nguyên từ bảng 24/10
    // --- Trợ thủ --- (T0→S+, T0.5→S, T1→A, T2→B, T3→C)
    "veres-sp": "S",
    "maloch-sp": "A",
    "richter-sp": "A",
    "arthur-sp": "B",
    "ybneth-sp": "S+",
    "thane-sp": "S+",
    "wiro-sp": "S+",
    "dolia-sp": "S+",
    "teemee-sp": "S",
    "ata-sp": "S",
    "cresht-sp": "S",
    "krizzix-sp": "S",
    "ormarr-sp": "A",
    "baldum-sp": "A",
    "toro-sp": "A",
    "omega-sp": "A",
    "alice-sp": "A",
    "lumburr-sp": "B",
    "xeniel-sp": "B",
    "chaugnar-sp": "B",
    "zip-sp": "B",
    "aya-sp": "B",
    "arum-sp": "C",
    "grakk-sp": "C",
    "arduin-sp": "C",
    "roxie-sp": "C",   // chủ web xác nhận ô T3 tóc xanh lá là Roxie
  },
  aogFull: true
};

/* ===== Danh sách tướng, ghi chú bản cập nhật, chỉnh tay và cách chấm điểm ===== */
const LANES={top:"Tà Thần",jg:"Rừng",mid:"Giữa",ad:"Rồng",sp:"Trợ thủ"};
const LANEDESC={top:"Đường Caesar",jg:"Đi rừng",mid:"Đường giữa",ad:"Đường Rồng",sp:"Hỗ trợ"};
const CLASSES={tank:"Đỡ đòn",fighter:"Đấu sĩ",assassin:"Sát thủ",mage:"Pháp sư",marksman:"Xạ thủ",support:"Trợ thủ"};
// Biểu tượng lớp tướng: một bộ nét đều (lưới 24, nét tròn, vùng vẽ 2–22), độ dày nét đặt bằng CSS theo chỗ hiện.
// Khiên, kiếm chéo, trái tim, tâm ngắm, sao bốn cánh theo dáng bộ Lucide (giấy phép ISC); dao găm vẽ riêng cùng quy cách (vẽ lại 19/11/2026).
const ICON={
 tank:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',
 fighter:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5 3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2M14.5 6.5 18 3h3v3l-3.5 3.5M5 14l4 4M7 17l-3 3M3 19l2 2"/></svg>',
 assassin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3 10.6 15.6l-2.2-2.2z"/><path d="M6.2 11.2l6.6 6.6M9.5 14.5 4.6 19.4"/><circle cx="3.9" cy="20.1" r=".9"/></svg>',
 mage:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.94 15.5a2 2 0 0 0-1.44-1.44l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.13 1.58a.5.5 0 0 1 0 .96l-6.13 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/></svg>',
 marksman:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5"/></svg>',
 support:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/></svg>'
};
const TIERS=["S","A","B","C","D"];
const TNAME={S:"Rất mạnh",A:"Mạnh",B:"Ổn",C:"Tình huống",D:"Yếu"};
const GROUPS={S:["Đỉnh meta","nên cấm hoặc chọn sớm"],A:["Meta","lựa chọn an toàn khi leo rank"],C:["Ngoài meta","cần đội hình phù hợp"],D:["Ít được dùng","đang yếu ở bản hiện tại"]};
const TR={up:["+ Tăng","up","Được tăng sức mạnh"],down:["− Giảm","down","Bị giảm sức mạnh"],mix:["± Chỉnh","mix","Điều chỉnh"],new:["Mới","new","Tướng mới / làm lại"]};
// Bản cập nhật gần nhất: Điều chỉnh giữa mùa Vết Nứt Thời Không 17/11/2026 (lienquan.garena.vn)
// key: [xu hướng, ghi chú, true nếu phần báo VN đã chỉnh theo bản này]; key có thể kèm đường (flowborn-ad)
const PATCH="17/11";
const P={
 butterfly:["mix","Làm lại một số kỹ năng: chiêu 1 bỏ hiệu ứng tăng 25% sát thương lên mỗi mục tiêu trúng đích, thêm đao ảnh gây 80 (+16/cấp, +0,25 công vật lý); chiêu 2 bỏ hiệu ứng tăng tỉ lệ chí mạng, mục tiêu đầu chịu 50 (+10/cấp, +0,15 công vật lý) sát thương phép chắc chắn chí mạng (trước là 100, +20/cấp, +0,3 sát thương vật lý), ba đòn đánh cường hóa thêm 20 (+4/cấp, +0,3 công vật lý) sát thương phép chí mạng; chiêu 3 hồi máu mỗi lần gây sát thương lên mục tiêu bị đánh dấu, 20% khi đánh tướng và 10% với mục tiêu khác (trước là 35% khi dấu kết thúc hoặc mục tiêu bị hạ)."],
 arduin:["up","Tăng sức mạnh: nội tại hồi 180 (+13/cấp, +0,05 máu cộng thêm) máu, trước là 4% máu tối đa; sát thương chuẩn chiêu 2 thành 150 (+30/cấp, +0,5 công vật lý cộng thêm), trước là 125 (+25/cấp); sát thương gốc chiêu 3 thành 300 (+150/cấp, +1,5 công vật lý), trước là 300 (+125/cấp, +1,2)."],
 grakk:["up","Tăng sức mạnh: sát thương gốc của nội tại thành 55 (+4/cấp, +0,2 SMPT, +0,02 máu tối đa), trước là 40; sát thương kích nổ thành 225 (+16/cấp, +0,8 SMPT, +0,08 máu tối đa), trước là 160; sát thương gốc chiêu 1 thành 180 (+36/cấp, +0,55 SMPT), trước là 150 (+30/cấp, +0,5)."],
 dirak:["up","Tăng sức mạnh: hồi chiêu 2 còn 10s (−0,4s/cấp), trước là 12,5s (−0,5s/cấp)."],
 richter:["mix","Điều chỉnh: hồi chiêu 1 thành 8s (−0,3s/cấp), sát thương lướt chặt thành 75 (+15/cấp, +0,5 công vật lý), trước là 20 (+20/cấp, +0,4), sát thương chém thành 150 (+30/cấp, +1,0), trước là 50 (+50/cấp); chiêu 3 sát thương gốc còn 50 (+25/cấp, +0,2 công vật lý), trước là 60 (+30/cấp, +0,13), sát thương nổ còn 300 (+150/cấp, +1,2), trước là 330 (+165/cấp, +1,0)."],
 fennik:["up","Tăng sức mạnh: sát thương gốc và sát thương nổ của chiêu 1 cùng thành 125 (+25/cấp, +0,75 công vật lý), trước là 90 (+18/cấp, +0,65)."],
 dyadia:["down","Giảm sức mạnh: sát thương gốc của nội tại còn 140–280 (+1,0 công vật lý, +0,25 SMPT), trước là 150–300 (+1,0, +0,3); sát thương kéo dài của chiêu 2 còn 540 (+108/cấp, +1,0 SMPT), trước là 640 (+128/cấp, +0,95)."]
};
// đường|lớp|tier: danh sách
const RAW=[
 ["top","tank","A","Y'bneth"],["top","tank","B","Taara"],["top","tank","C","Ata"],["top","tank","D","Omega,Max"],
 ["sp","tank","A","Toro"],["sp","tank","B","Mina"],["sp","tank","C","Roxie,Baldum,Chaugnar,Thane"],["sp","tank","C","Xeniel"],["sp","tank","D","Ormarr,Arduin,Wiro"],
 ["top","fighter","S","Arthur,Zuka,Florentino,Volkath"],["top","fighter","B","Ryoma,Maloch,Triệu Vân,Airi,Yena,Veres,Qi,Bijan"],
 ["top","fighter","C","Lữ Bố,Omen,Richter,Errol,Allain,Edras,Biron,Bolt Baron"],
 ["top","fighter","D","Skud,Kil'Groth,Superman,Amily,Charlotte,Wonder Woman,Rourke,Dextra,Yan"],
 ["top","mage","B","Marja"],
 ["jg","fighter","-","Tamyn"],
 ["jg","fighter","D","Astrid,Tachi"],
 ["mid","support","-","Annette,Rouie"],
 ["jg","fighter","B","Zephys"],
 ["jg","assassin","S","Sinestrea,Billow"],["jg","assassin","A","Butterfly,Murad,Ngộ Không,Nakroth,Paine"],["jg","assassin","B","Zill,Quillen,Kaine,Enzo"],
 ["jg","assassin","C","Keera,Kriknak"],["jg","assassin","D","Aoi,Bright,The Flash"],
 ["mid","mage","S","Yue,Zata"],["mid","mage","A","Gildur,Raz,Lorion,Azzen'Ka,Iggy"],
 ["mid","mage","-","Evita"],
 ["mid","mage","B","Krixi,Veera,Natalya,Lauriel,Aleister,Tulen,Liliana,Heino,Flowborn,Goverra"],
 ["mid","mage","C","Kahlii,Mganga,Ilumia,Điêu Thuyền,Bonnie,Ignis"],["mid","mage","C","Sephera"],["mid","mage","D","Preyta,Jinna,D'Arcy,Ishar,Dirak"],
 ["ad","marksman","S","Violet,Hayate"],["ad","marksman","A","Flowborn,Moren,Elsu"],["ad","marksman","B","Valhein,Slimz,Fennik,Stuart,Tel'Annas,Capheny,Laville"],
 ["ad","marksman","C","Celica,Eland'orr,Yorn,Lindis,Wisp,Thorne,Erin"],["ad","marksman","D","Teeri"],
 ["sp","support","S","Alice,Dolia,Aya"],["sp","support","A","Annette,Dyadia"],["sp","support","B","Cresht,Grakk,Rouie"],
 ["sp","support","C","Krizzix,Arum"],["sp","support","D","Lumburr,Helen,TeeMee,Zip,Ming"]
];
/*RANK:BEGIN tự sinh bằng `node tools/rank/emit.js` từ tools/rank/garena.txt, đừng sửa tay. [thắng %, chọn %, cấm %, bậc Garena 0–4 = T0–T4, phần tử thứ 5 nếu có = ngày dd/mm của số cũ khi tướng không có trong bảng lần ghi này]; thắng/chọn/cấm vào điểm tổng qua rankScore, bậc Garena chỉ hiển thị*/
const RANK={src:"Garena Liên Quân Mobile",where:"Cẩm nang → Bảng Phân Bậc Tướng",filter:"Đấu hạng (Tất cả)",read:"19/11/2026",d:{
"trieuvan":[55.07,34.82,16.56,0],"preyta":[54.95,8.18,4.4,2],"omega":[54.5,2.38,0.39,4],"dyadia":[54.08,3.58,20.74,3],"erin":[54.01,13.31,5.47,2],
"tamyn":[53.83,3.97,22.09,3],"moren":[53.82,6.08,1.11,2],"roxie":[53.34,1.52,0.4,4],"flowborn-ad":[53.19,17.4,30.22,0],"lumburr":[53.06,0.72,0.1,4],
"thorne":[52.85,2.11,0.1,4],"evita":[52.78,12.44,68.02,0],"marja":[52.65,7.1,8.51,2],"dextra":[52.65,0.56,0.1,4],"fennik":[52.6,8.92,1.47,2],
"flowborn-mid":[52.52,1.2,1.13,4],"astrid":[52.41,4.11,0.84,3],"zata":[52.4,10.79,58.39,0],"xeniel":[52.32,2.23,0.38,4],"max":[52.28,1.5,0.13,4],
"ybneth":[52.27,7.07,11.44,2],"cresht":[52.03,5.2,0.44,3],"rourke":[51.87,1.1,0.1,4],"butterfly":[51.81,22.98,9.85,0],"thane":[51.79,4.49,0.26,3],
"teemee":[51.73,1.08,0.54,4],"azzenka":[51.64,5.6,0.54,3],"veres":[51.54,13.92,0.75,2],"wisp":[51.52,2.06,0.1,4],"volkath":[51.51,5.2,15.75,2],
"helen":[51.48,2.44,1.69,4],"dirak":[51.44,2.38,0.31,4],"telannas":[51.32,19.81,1.33,1],"laville":[51.32,5.57,0.11,3],"yorn":[51.27,13.35,0.7,2],
"sinestrea":[51.26,6.4,5.55,2],"chaugnar":[51.18,3.89,1.41,3],"zip":[51.11,1.81,4.03,4],"darcy":[50.97,7.01,22.89,2],"arthur":[50.94,18.18,2.41,1],
"boltbaron":[50.94,9.88,1.17,2],"lorion":[50.91,4.2,0.85,3],"ming":[50.83,0.7,0.1,4],"kahlii":[50.77,4.27,0.21,3],"wiro":[50.49,0.67,0.11,4],
"mina":[50.43,8.12,1,2],"slimz":[50.42,6.85,0.11,2],"edras":[50.4,13.28,9.56,2],"baldum":[50.38,3.9,0.72,3],"krizzix":[50.23,3.22,11.99,3],
"annette":[50.23,7.55,32.19,2],"ata":[50.21,1.11,0.1,4],"maloch":[50.18,11.12,0.92,2],"bijan":[50.16,13.08,4.16,2],"goverra":[50.11,6.7,14.63,2],
"arduin":[50.1,4.43,0.18,3],"quillen":[50.08,7.11,1.73,2],"sephera":[50.06,1.7,0.52,4],"teeri":[50.02,2.54,0.1,4],"qi":[50.01,3.65,0.1,3],
"alice":[49.96,12.94,4.89,2],"tachi":[49.91,6.24,0.19,2],"ryoma":[49.9,11.8,1.51,2],"airi":[49.85,7.2,0.33,2],"celica":[49.78,0.6,0.1,4],
"enzo":[49.75,6.53,17.97,2],"taara":[49.69,13.15,4.28,2],"ilumia":[49.63,11.7,0.53,2],"dieuthuyen":[49.63,5.04,0.41,3],"ormarr":[49.6,1.67,0.1,4],
"violet":[49.59,26.7,0.81,0],"biron":[49.53,5.24,0.51,3],"allain":[49.49,11.36,3.24,2],"toro":[49.43,23.33,7.27,0],"iggy":[49.32,2.76,0.12,4],
"dolia":[49.31,8.11,57.69,1],"arum":[49.27,3.91,18.26,3],"nakroth":[49.23,24.14,22.88,0],"zill":[49.18,4.72,0.16,3],"keera":[49.01,6.05,1.67,2],
"bonnie":[49,3.29,0.64,3],"lauriel":[48.91,5.34,1.72,3],"omen":[48.91,4.33,0.38,3],"florentino":[48.81,19.26,26.13,0],"lubo":[48.69,2.24,0.17,4],
"veera":[48.68,17.17,17.32,1],"yue":[48.62,16.64,40.39,0],"stuart":[48.61,6.88,3.18,2],"krixi":[48.56,16.69,0.69,1],"tulen":[48.55,9.38,0.32,2],
"amily":[48.54,3.2,0.1,3],"murad":[48.51,15.48,21.24,1],"hayate":[48.51,29,15.66,0],"yena":[48.45,3.26,0.1,3],"aleister":[48.44,4.98,40.1,2],
"liliana":[48.44,7.77,0.28,2],"natalya":[48.43,21.44,7.15,0],"kaine":[48.41,7.1,12.26,2],"elsu":[48.41,18.79,26.78,0],"zephys":[48.3,6.59,0.14,2],
"valhein":[48.3,16.66,1.34,1],"heino":[48.28,5.18,2.53,3],"lindis":[48.13,1.63,0.14,4],"wonderwoman":[48.03,0.33,0.1,4],"errol":[48,5.71,0.56,3],
"ishar":[48,3.4,0.39,3],"skud":[47.99,1.54,0.12,4],"billow":[47.99,10.05,3.83,2],"ngokhong":[47.95,24.9,10.43,0],"gildur":[47.93,16.54,18.38,1],
"raz":[47.92,16.12,3.38,1],"kriknak":[47.9,2.24,0.1,4],"capheny":[47.88,8.81,0.3,2],"aoi":[47.82,1.45,0.21,4],"ignis":[47.77,1.42,0.1,4],
"richter":[47.77,6.85,0.6,2],"grakk":[47.7,11.47,34.53,1],"zuka":[47.59,11.53,0.26,2],"bright":[47.59,2.58,0.1,4],"jinna":[47.52,0.75,0.1,4],
"mganga":[47.5,3.8,0.2,3],"elandorr":[47.38,4.5,0.19,3],"paine":[47.21,8.2,1.65,2],"kilgroth":[46.94,3.88,0.83,3],"yan":[46.89,1.51,0.1,4],
"aya":[46.79,10.21,71.72,0],"charlotte":[46.73,0.47,0.1,4],"rouie":[46.72,2.71,11.86,3],"theflash":[45.94,0.6,0.19,4],"superman":[45.11,0.33,0.38,4],
}};
/*RANK:END*/
const slug=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/đ/gi,"d").toLowerCase().replace(/[^a-z]/g,"");
const HEROES=[];
// Điểm tổng hợp (trọng số chuẩn hoá): ĐTDV mùa Đông 36% · mùa trước 13% · RoV Pro League 11% · rank cộng đồng 18% · game rank 22% (thêm 11/11/2026 theo yêu cầu chủ web). Đã bỏ tier list báo game VN (19/10/2026).
const VNS={S:5,A:4,B:3,C:2,D:1}, RMS={"S+":5,S:4.5,A:3.5,B:2.5,C:1.5,D:1};
function proScore(r){if(!r)return null;const [w,p,b]=r,P=p+b;let s=P>=50?5:P>=30?4.5:P>=20?4:P>=10?3.5:P>=5?3:2.5;
  if(w!=null&&p>=5){if(w>=55)s+=.5;else if(w<=45)s-=.5}return Math.max(1,Math.min(5,s))}
const aogOf=(k,lane)=>SRC.aog[k+"-"+lane]||(k==="flowborn"?null:SRC.aog[k]);
function aogScore(a){if(!a)return 1.5;const [w,p,bn]=a;let s=p>=30?5:p>=25?4.5:p>=20?4:p>=15?3.5:p>=10?3:p>=5?2.5:p>=2?2:1.5;
  if(bn>=40)s+=.5;else if(bn>=20)s+=.25;
  if(p>=5){if(w>=55)s+=.5;else if(w<=45)s-=.5}return Math.max(1,Math.min(5,s))}
// Game rank (số trong game của Garena, khối RANK ở trên): cùng cách tính với ĐTDV nhưng ngưỡng theo thang của người chơi rank
// (số trận lớn hơn giải đấu rất nhiều nên tỉ lệ chọn thấp hơn; tỉ lệ thắng dao động hẹp quanh 50%, phân vị 10%/90% ≈ 47,7%/52,8%).
// Game không ghi số trận nên tỉ lệ thắng chỉ tính khi tướng được chọn từ 3% số trận. Bậc T0–T4 của Garena không vào điểm vì chỉ là cách Garena gộp chính các số này.
const rankData=(k,lane)=>RANK.d[k+"-"+lane]||(k==="flowborn"?null:RANK.d[k]);
function rankScore(r){if(!r)return null;const [w,p,bn]=r;let s=p>=25?5:p>=20?4.5:p>=15?4:p>=10?3.5:p>=6?3:p>=3?2.5:p>=1?2:1.5;
  if(bn>=40)s+=.5;else if(bn>=20)s+=.25;
  if(p>=3){if(w>=53)s+=.5;else if(w>=51.5)s+=.25;else if(w<=46)s-=.5;else if(w<=47)s-=.25}return Math.max(1,Math.min(5,s))}
const prevOf=(k,lane)=>SRC.prev[k+"-"+lane]||(k==="flowborn"?null:SRC.prev[k]);
function score(k,vn,lane){const parts=[];   // tier list báo game VN đã bỏ khỏi điểm (chủ web yêu cầu 19/10/2026)
  // ĐTDV (đủ 310 trận, gồm vòng bảng và playoffs) là nguồn nặng nhất, ưu tiên số trận được CHỌN; cấm nhiều chỉ cộng thêm
  const a=aogOf(k,lane);parts.push([aogScore(a),.4]);
  // Mùa trước (299 trận): cùng cách tính, trọng số nhẹ hơn vì đã qua nhiều bản cập nhật
  parts.push([aogScore(prevOf(k,lane)),.15]);
  const r=SRC.rpl[k],ps=proScore(r);if(ps!=null)parts.push([ps,r[1]+r[2]>=5?.12:.04]);
  const m=SRC.rm[k+"-"+lane]||SRC.rm[k];if(m)parts.push([RMS[m],.2]);
  // Game rank (người chơi rank, số trong game của Garena): thêm 11/11/2026, trọng số .25
  const gr=rankScore(rankData(k,lane));if(gr!=null)parts.push([gr,.25]);
  return parts.reduce((s,[v,w])=>s+v*w,0)/parts.reduce((s,[,w])=>s+w,0)}
// Điều chỉnh thủ công của người biên tập (ưu tiên cao nhất)
const MANUAL={evita:"A",raz:"A",preyta:"A",aoi:"B",darcy:"A",zuka:"B",nakroth:"A",airi:"A","arthur-sp":"B",krizzix:"A",chaugnar:"B",taara:"A",qi:"A",yena:"A","billow-top":"C","boltbaron-ad":"A",
  // Đường Giữa ghim theo bảng @zena_sama 03/11/2026 (chủ web yêu cầu "y chang bảng này" 07/11/2026). Xoá các dòng "-mid" dưới đây để đường Giữa tính lại theo điểm.
  "lorion-mid":"S","rouie-mid":"S","darcy-mid":"A","evita-mid":"A","ignis-mid":"A","liliana-mid":"A","zata-mid":"A","annette-mid":"B","goverra-mid":"B","iggy-mid":"B","raz-mid":"B","yue-mid":"B","aleister-mid":"C","azzenka-mid":"C","dirak-mid":"C","mganga-mid":"B","natalya-mid":"C","preyta-mid":"B","dieuthuyen-mid":"D","flowborn-mid":"C","heino-mid":"B","ilumia-mid":"C","jinna-mid":"D","kahlii-mid":"C","krixi-mid":"C","lauriel-mid":"C","sephera-mid":"C","tulen-mid":"D","veera-mid":"C","bonnie-mid":"D","ishar-mid":"D",
  "erin-mid":"A","alice-mid":"B","aya-mid":"C","dolia-mid":"D","dyadia-mid":"D","theflash-mid":"D",
  // Tà Thần, Rừng, Trợ thủ ghim theo bảng TikTok @zena_sama 24/10/2026 (chủ web yêu cầu y chang 07/11/2026). Tướng không có trong bảng giữ tier theo điểm.
  // Từ 07/11/2026 18:11 chủ web yêu cầu lùi một bậc cho cả 4 bảng: bậc cao nhất của bảng (SS/S+/T0) = S, bậc kế = A, rồi B, C; hai bậc thấp nhất (C và D, hoặc T3) đều = D.
  "airi-top":"S","qi-top":"A","marja-top":"S","florentino-top":"S","taara-top":"A","yan-top":"B","richter-top":"B","yena-top":"B","biron-top":"A","maloch-top":"B","boltbaron-top":"B","omen-top":"B","skud-top":"B","ryoma-top":"B","volkath-top":"C","charlotte-top":"C","veres-top":"C","zuka-top":"C","max-top":"C","lubo-top":"C","allain-top":"C","amily-top":"D","kilgroth-top":"D","kaine-top":"D","arthur-top":"B","nakroth-jg":"S","tamyn-jg":"S","billow-jg":"S","astrid-jg":"S","sinestrea-jg":"S","aoi-jg":"C","tachi-jg":"A","ryoma-jg":"B","ngokhong-jg":"C","trieuvan-jg":"B","zephys-jg":"A","butterfly-jg":"S","enzo-jg":"C","keera-jg":"B","murad-jg":"B","zuka-jg":"C","kriknak-jg":"D","quillen-jg":"D","paine-jg":"C","bright-jg":"D","kaine-jg":"D","ybneth-sp":"S","thane-sp":"S","wiro-sp":"S","dolia-sp":"S","teemee-sp":"A","ata-sp":"A","cresht-sp":"A","krizzix-sp":"A","ormarr-sp":"B","baldum-sp":"B","toro-sp":"B","omega-sp":"A","alice-sp":"B","lumburr-sp":"C","xeniel-sp":"C","chaugnar-sp":"B","zip-sp":"C","aya-sp":"C","arum-sp":"D","grakk-sp":"C","arduin-sp":"B",
  "elandorr-jg":"A","volkath-jg":"A","boltbaron-jg":"D","darcy-jg":"C","edras-jg":"B","wonderwoman-jg":"C","rourke-jg":"C","yan-jg":"B","veres-jg":"C","fennik-jg":"C","tulen-jg":"C","bijan-jg":"C","errol-jg":"C","zill-jg":"C","lubo-jg":"D","kilgroth-jg":"D","lindis-jg":"D","skud-jg":"D","tamyn-top":"A","mina-top":"A","murad-top":"B","ngokhong-top":"C","astrid-top":"C","xeniel-top":"C","roxie-top":"C","veres-sp":"A","maloch-sp":"B","richter-sp":"B","arthur-sp":"C","roxie-sp":"D",
  // Chủ web yêu cầu 11/11/2026: Ata Tà Thần lên A (theo công thức ra D, kể cả sau khi thêm game rank)
  "ata-top":"A",
  // Chủ web yêu cầu 11/11/2026: Erin và Yorn đường Rồng lên B (theo điểm đang ra C; Erin Giữa đã ghim A)
  "erin-ad":"B","yorn-ad":"B",
  // Chủ web yêu cầu 11/11/2026 21:05: Edras Tà Thần S, Thorne Rồng D
  "edras-top":"S","thorne-ad":"D",
  // Chủ web yêu cầu 11/11/2026 21:08: Chaugnar Trợ thủ C→B, Omega Trợ thủ B→A (sửa giá trị ở trên)
  // Chủ web yêu cầu 11/11/2026 21:07: "lindis lên C" (đường chính Rồng; Lindis Rừng giữ D)
  "lindis-ad":"C",
  // Chủ web yêu cầu 11/11/2026 21:18: Zephys Tà Thần xuống B; Taara, Mina, Biron Tà Thần B→A (sửa giá trị ở trên)
  "zephys-top":"B",
  // Chủ web yêu cầu 11/11/2026 21:16: Arduin Trợ thủ D→C (sửa giá trị ở trên)
  // Chủ web yêu cầu 11/11/2026 21:16: Sephera Giữa D→C (sửa giá trị ở trên)
  // Chủ web yêu cầu 11/11/2026 21:15: Arthur Tà Thần D→B, Billow Tà Thần B→C (sửa giá trị ở trên)
  // Chủ web yêu cầu 11/11/2026 21:15: Allain Tà Thần D→C (sửa giá trị ở trên)
  // Chủ web yêu cầu 11/11/2026 21:14: Paine Rừng D→C (sửa giá trị ở trên)
  // Chủ web yêu cầu 11/11/2026 21:12: Preyta, Mganga Giữa C→B (sửa giá trị ở trên)
  // Chủ web yêu cầu 11/11/2026 21:11: Lauriel, Veera, Krixi, Flowborn (phép), Ilumia, Kahlii, Heino ở Giữa D→C (sửa giá trị ở trên)
  // Chủ web yêu cầu 11/11/2026 21:09: Grakk Trợ thủ D→C (sửa giá trị ở trên)
  // Chủ web yêu cầu 11/11/2026 21:09: Wisp Rồng xuống C, Dyadia Trợ thủ (đường chính) lên A; Dyadia Giữa giữ D
  "wisp-ad":"B","dyadia-sp":"A",   // 14/11/2026 chủ web: Wisp C→B
  // Chủ web yêu cầu 14/11/2026: Tel'Annas Rồng xuống C
  "telannas-ad":"C",
  // Chủ web yêu cầu 11/11/2026 21:13: Gildur Giữa xuống B
  "gildur-mid":"B",
  // Chủ web yêu cầu 11/11/2026 21:20: Elsu Rồng lên A
  "elsu-ad":"A",
  // Chủ web yêu cầu 14/11/2026: Heino Giữa C→B (sửa giá trị ở trên)
  // Chủ web yêu cầu 14/11/2026: "zephys lên A" = Zephys Rừng (đường chính) B→A; Zephys Tà Thần giữ B
  // Chủ web yêu cầu 14/11/2026: Veres, Ngộ Không, Wonder Woman, Rourke Rừng B→C (sửa giá trị ở trên)
  // Chủ web yêu cầu 14/11/2026: Aoi Rừng B→C (sửa giá trị ở trên)
  // Chủ web yêu cầu 14/11/2026: Sephera Trợ thủ (ô mới) C; Triệu Vân Rừng B (đã B, ghi lại cho chắc)
  "sephera-sp":"C","trieuvan-jg":"B",
  // Chủ web yêu cầu 11/11/2026 20:18: Bolt Baron Rừng D (lần 20:14 hiểu sai chữ "thêm"; Rừng giữ D như 20:11); thêm ô Rồng cho Murad và Edras, ghim B
  "murad-ad":"B","edras-ad":"B",
  // Chủ web yêu cầu 11/11/2026 20:16: Marja và Florentino Tà Thần A→S
  // Chủ web yêu cầu 11/11/2026 20:14 ("thêm murad và bolt baron lên B", hiểu là ô Rừng vì Tà Thần của cả hai đã B): Murad Rừng C→B, Bolt Baron Rừng D→B (đảo lại D của 20:11)
  // Chủ web yêu cầu 11/11/2026 20:13: Murad Tà Thần C→B
  // Chủ web yêu cầu 11/11/2026 20:11: D'Arcy Rừng B→C, Bolt Baron Rừng B→D, Keera Rừng C→B ("kerra" = Keera, web chỉ có ô Rừng)
  // Annette, Rouie không có trong bảng Trợ thủ; chủ web chốt 07/11/2026: Rouie Trợ thủ S, Annette Trợ thủ A
  "rouie-sp":"S","annette-sp":"A"};
// Ngưỡng điểm cố định (11/11/2026, chủ web yêu cầu tướng không bị xê dịch khi thêm bớt tướng): tier của một tướng chỉ phụ thuộc điểm của chính nó.
// Ngưỡng chọn sao cho giữ đúng tier đang hiện của các ô không chỉnh tay (trước đó chia theo tỉ lệ trong đường: 12/32/57/80%).
const CUT=[["S",4.25],["A",2.9],["B",2.15],["C",1.65]];
const toTier=s=>(CUT.find(([,v])=>s>=v)||["D"])[0];
// Lớp tướng theo phân loại chính thức trên lienquan.garena.vn
const CLASSFIX={airi:"assassin",chaugnar:"support",cresht:"tank",zill:"mage",xeniel:"support",ata:"fighter",boltbaron:"mage",arum:"tank",bright:"marksman",roxie:"fighter",lumburr:"tank",ormarr:"fighter",theflash:"mage",arduin:"fighter",sephera:"support"};
function addHero(lane,cls,vn,n,sec){const k=slug(n),p=P[k+"-"+lane]||P[k]||[],sc=score(k,vn,lane);cls=CLASSFIX[k]||cls;
  const a=aogOf(k,lane),pres=a?a[1]+a[2]:0;let tier=toTier(sc),floor="";
  // Sàn theo ĐTDV: pick+cấm ≥ 75% số trận → S, ≥ 55% → tối thiểu A
  if(pres>=75&&tier!=="S"){tier="S";floor="S"}else if(pres>=55&&"BCD".includes(tier)){tier="A";floor="A"}
  // Sàn theo số trận được chọn ở ĐTDV (tỉ lệ thắng từ 45% trở lên): chọn ≥ 30% số trận → S, ≥ 20% → tối thiểu A
  const pk=a?a[1]:0,wr=a?a[0]:0;
  if(wr>=45){if(pk>=30&&tier!=="S"){tier="S";floor="pickS"}else if(pk>=20&&"BCD".includes(tier)){tier="A";floor="pickA"}}
  const man=MANUAL[k+"-"+lane]||MANUAL[k];if(man){tier=man;floor="manual"}
  HEROES.push({id:k+"-"+lane,key:k,name:n,lane,cls,vn,score:sc,tier,floor,pres,sec:!!sec,trend:p[0]||"",note:p[1]||"",vnAdj:!!p[2]})}
RAW.forEach(([lane,cls,vn,names])=>names.split(",").forEach(n=>addHero(lane,cls,vn,n)));
// Đường phụ: tướng thường được đưa sang đường khác ngoài đường chính (đã bỏ Toro và Marja)
const SECONDARY={"Y'bneth":["sp"],Taara:["sp"],Omega:["sp"],Ata:["sp"],Zuka:["jg"],Ryoma:["jg"],"Triệu Vân":["jg"],   // 14/11/2026 chủ web bỏ ô Airi Rừng và Qi Rừng
 
  Billow:["top"],Zephys:["top"],Kaine:["top"],Zill:["mid"],Wiro:["top"],Arthur:["sp"],Arduin:["top"],"Bolt Baron":["ad"],
  // Thêm ô Giữa 07/11/2026 theo bảng Giữa của @zena_sama 03/11 (chủ web yêu cầu)
  Erin:["mid"],Alice:["mid"],Aya:["mid"],Dolia:["mid"],Dyadia:["mid"],"The Flash":["mid"]};
// Thêm ô 07/11/2026 cho tướng có trong 3 bảng TikTok @zena_sama 24/10 (Rừng, Tà Thần, Trợ thủ) mà web chưa có ô ở đường đó (chủ web yêu cầu)
for(const [n,ls] of Object.entries({"Eland'orr": ["jg"], "Volkath": ["jg"], "Bolt Baron": ["jg"], "D'Arcy": ["jg"], "Edras": ["jg"], "Wonder Woman": ["jg"], "Rourke": ["jg"], "Yan": ["jg"], "Veres": ["jg", "sp"], "Fennik": ["jg"], "Tulen": ["jg"], "Bijan": ["jg"], "Errol": ["jg"], "Lữ Bố": ["jg"], "Kil'Groth": ["jg"], "Lindis": ["jg"], "Skud": ["jg"], "Tamyn": ["top"], "Mina": ["top"], "Murad": ["top"], "Ngộ Không": ["top"], "Astrid": ["top"], "Xeniel": ["top"], "Roxie": ["top"], "Maloch": ["sp"], "Richter": ["sp"]}))(SECONDARY[n]=SECONDARY[n]||[]).push(...ls);
// Thêm ô Trợ thủ 14/11/2026 cho Sephera (chủ web yêu cầu "thêm sephera đi sp tier C"); tier ghim C trong MANUAL
for(const [n,ls] of Object.entries({"Sephera":["sp"]}))(SECONDARY[n]=SECONDARY[n]||[]).push(...ls);
// Thêm ô Rồng 11/11/2026 cho Murad và Edras (chủ web yêu cầu "thêm murad và edras ad ở B"); tier ghim B trong MANUAL
for(const [n,ls] of Object.entries({"Murad":["ad"],"Edras":["ad"]}))(SECONDARY[n]=SECONDARY[n]||[]).push(...ls);
for(const [n,lanes] of Object.entries(SECONDARY)){const base=HEROES.find(h=>h.name===n&&!h.sec);if(!base)continue;
  lanes.forEach(l=>{if(!HEROES.some(h=>h.key===base.key&&h.lane===l))addHero(l,base.cls,base.vn,n,true)})}
HEROES.filter(h=>h.lane==="mid"&&["annette","rouie"].includes(h.key)).forEach(h=>h.sec=true);
// Đường chính thứ hai (không phải đường phụ)
HEROES.filter(h=>["ybneth-sp","omega-sp"].includes(h.id)).forEach(h=>h.sec=false);
// Bỏ hẳn các ô tướng theo yêu cầu biên tập
for(const id of ["ybneth-top","omega-top"]){const i=HEROES.findIndex(h=>h.id===id);if(i>=0)HEROES.splice(i,1)}
// Xếp tier theo từng đường: so tướng với các tướng cùng đường (đường phụ trừ 0,4 điểm, tối đa tier A)
// Top 12% của đường → S, 12–32% → A, 32–57% → B, 57–80% → C, còn lại → D; sau đó áp sàn ĐTDV và chỉnh tay
for(const l of Object.keys(LANES)){
  const arr=HEROES.filter(h=>h.lane===l).map(h=>(h.adj=h.score-(h.sec?.4:0),h)).sort((a,b)=>b.adj-a.adj);
  const n=arr.length;
  arr.forEach((h,i)=>{h.rank=i+1;h.laneN=n;h.tier=toTier(h.adj);h.floor="";
    const a=aogOf(h.key,h.lane),pres=a?a[1]+a[2]:0,pk=a?a[1]:0,wr=a?a[0]:0;h.pres=pres;
    if(!h.sec){
      if(pres>=75&&h.tier!=="S"){h.tier="S";h.floor="S"}else if(pres>=55&&"BCD".includes(h.tier)){h.tier="A";h.floor="A"}
      if(wr>=45){if(pk>=30&&h.tier!=="S"){h.tier="S";h.floor="pickS"}else if(pk>=20&&"BCD".includes(h.tier)){h.tier="A";h.floor="pickA"}}
    }else if(h.tier==="S")h.tier="A";
    const man=MANUAL[h.key+"-"+h.lane]||MANUAL[h.key];if(man){h.tier=man;h.floor="manual"}
  });
}
// Hạng trong đường: xếp theo tier cuối cùng (sau sàn ĐTDV và chỉnh tay của chủ web) rồi mới tới điểm,
// để hạng ghi trong bảng chi tiết khớp với bảng tier và sân khấu "Mạnh nhất mỗi đường"
for(const l of Object.keys(LANES)){const TO="SABCD";HEROES.filter(h=>h.lane===l).sort((a,b)=>TO.indexOf(a.tier)-TO.indexOf(b.tier)||b.adj-a.adj).forEach((h,i)=>h.rank=i+1)}
// Tier ở lần cập nhật trước: mũi tên lên/xuống bậc trên ảnh tướng (giống Prydwen). h.prev = tier cũ, h.move = "up"/"down"/"".
// ĐỪNG SỬA TAY: chạy `node tools/tiers/snapshot.js <ngày dd/mm>` NGAY TRƯỚC mỗi lần cập nhật số liệu hoặc bản mới,
// để mũi tên cho thấy những gì lần cập nhật đó thay đổi. Chỉnh tay lẻ của chủ web giữa hai lần cập nhật thì không chạy.
const PREV_DATE="30/10";
const PREV_T="S:annette-mid,annette-sp,astrid-jg,billow-jg,dolia-sp,edras-top,elandorr-ad,hayate-ad,liliana-mid,lorion-mid,marja-top,rouie-mid,rouie-sp,ryoma-top,sinestrea-jg,tamyn-jg,violet-ad,ybneth-sp,zata-mid;A:airi-jg,airi-top,alice-sp,biron-top,boltbaron-ad,capheny-ad,cresht-sp,darcy-mid,evita-mid,florentino-top,flowborn-ad,gildur-mid,iggy-mid,ignis-mid,krizzix-sp,maloch-top,mganga-mid,mina-sp,nakroth-jg,preyta-mid,qi-jg,qi-top,raz-mid,ryoma-jg,skud-top,stuart-ad,taara-sp,taara-top,tachi-jg,teemee-sp,thane-sp,toro-sp,valhein-ad,yena-top,yue-mid,zephys-jg,zephys-top;B:aleister-mid,aoi-jg,arthur-sp,arthur-top,aya-sp,azzenka-mid,baldum-sp,billow-top,butterfly-jg,chaugnar-sp,dyadia-sp,elsu-ad,enzo-jg,errol-top,fennik-ad,flowborn-mid,goverra-mid,heino-mid,keera-jg,moren-ad,murad-jg,natalya-mid,omen-top,richter-top,slimz-ad,veres-top,volkath-top,wiro-sp,wiro-top,wisp-ad,yan-top,zuka-jg,zuka-top;C:allain-top,arduin-sp,arum-sp,ata-top,bijan-top,boltbaron-top,bright-jg,celica-ad,erin-ad,grakk-sp,helen-sp,ilumia-mid,jinna-mid,kahlii-mid,kriknak-jg,krixi-mid,laville-ad,lubo-top,max-top,ngokhong-jg,paine-jg,roxie-sp,sephera-mid,telannas-ad,thorne-ad,trieuvan-top,tulen-mid,wonderwoman-top,xeniel-sp,zip-sp;D:amily-top,arduin-top,ata-sp,bonnie-mid,charlotte-top,dextra-top,dieuthuyen-mid,dirak-mid,ishar-mid,kaine-jg,kaine-top,kilgroth-top,lauriel-mid,lindis-ad,lumburr-sp,ming-sp,omega-sp,ormarr-sp,quillen-jg,rourke-top,superman-top,teeri-ad,theflash-jg,trieuvan-jg,veera-mid,yorn-ad,zill-jg,zill-mid";
{const pv={};PREV_T.split(";").forEach(s=>{const [t,ids]=s.split(":");ids&&ids.split(",").forEach(id=>pv[id]=t)});
  HEROES.forEach(h=>{const o=pv[h.id]||"";h.prev=o;h.move=""})}  // 11/11/2026 chủ web bỏ dấu lên/xuống bậc (chỉ giữ dấu tăng/giảm sức mạnh): h.move luôn rỗng, mọi chỗ hiện dấu bậc tự ẩn. Muốn bật lại: h.move=o&&o!==h.tier?("SABCD".indexOf(h.tier)<"SABCD".indexOf(o)?"up":"down"):""
const picksOf=h=>{const a=aogOf(h.key,h.lane);return a?a[3]:0};
HEROES.sort((a,b)=>picksOf(b)-picksOf(a)||b.score-a.score||a.name.localeCompare(b.name,"vi"));
