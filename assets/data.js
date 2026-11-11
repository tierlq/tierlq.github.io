/* =====================================================================
   SỐ LIỆU NGUỒN — sửa ở đây khi có dữ liệu mới (xem CLAUDE.md)
   ===================================================================== */
const SRC = {
  // ĐTDV mùa hiện tại: [tỉ lệ thắng %, tỉ lệ pick % số trận, tỉ lệ cấm % số trận, số pick, số cấm]
  aog: {
    "elandorr": [50.94, 34.2, 34.2, 106, 106],
    "ybneth": [63.11, 33.2, 33.9, 103, 105],
    "marja": [46.0, 32.3, 42.3, 100, 131],
    "astrid": [41.84, 31.6, 23.2, 98, 72],
    "violet": [57.29, 31.0, 5.2, 96, 16],
    "flowborn-ad": [42.11, 30.6, 14.8, 95, 46],
    "billow": [49.46, 30.0, 25.8, 93, 80],
    "lorion": [49.43, 28.1, 17.4, 87, 54],
    "zata": [54.22, 26.8, 19.4, 83, 60],
    "dolia": [57.32, 26.5, 30.0, 82, 93],
    "airi": [49.38, 26.1, 12.9, 81, 40],
    "ryoma": [51.25, 25.8, 5.2, 80, 16],
    "liliana": [52.56, 25.2, 10.0, 78, 31],
    "annette": [47.44, 25.2, 10.6, 78, 33],
    "valhein": [50.0, 24.5, 17.4, 76, 54],
    "sinestrea": [54.67, 24.2, 46.1, 75, 143],
    "toro": [40.0, 24.2, 2.3, 75, 7],
    "thane": [52.94, 21.9, 8.4, 68, 26],
    "hayate": [46.97, 21.3, 8.1, 66, 25],
    "teemee": [42.42, 21.3, 11.6, 66, 36],
    "biron": [58.33, 19.4, 3.9, 60, 12],
    "tachi": [47.46, 19.0, 8.4, 59, 26],
    "capheny": [44.64, 18.1, 3.5, 56, 11],
    "wiro": [43.64, 17.7, 2.9, 55, 9],
    "edras": [64.81, 17.4, 15.2, 54, 47],
    "stuart": [56.6, 17.1, 13.5, 53, 42],
    "rouie": [66.67, 16.5, 82.6, 51, 256],
    "maloch": [50.98, 16.5, 16.5, 51, 51],
    "zephys": [41.67, 15.5, 3.9, 48, 12],
    "cresht": [47.83, 14.8, 2.9, 46, 9],
    "tamyn": [68.89, 14.5, 83.5, 45, 259],
    "butterfly": [62.22, 14.5, 10.0, 45, 31],
    "nakroth": [40.0, 14.5, 6.5, 45, 20],
    "mina": [74.42, 13.9, 23.2, 43, 72],
    "iggy": [43.9, 13.2, 5.2, 41, 16],
    "skud": [41.46, 13.2, 3.9, 41, 12],
    "wisp": [43.59, 12.6, 0.6, 39, 2],
    "taara": [28.21, 12.6, 16.1, 39, 50],
    "qi": [50.0, 12.3, 2.6, 38, 8],
    "ignis": [37.14, 11.3, 3.5, 35, 11],
    "alice": [55.88, 11.0, 6.5, 34, 20],
    "mganga": [54.55, 10.6, 11.0, 33, 34],
    "yue": [48.28, 9.4, 4.5, 29, 14],
    "enzo": [34.48, 9.4, 5.5, 29, 17],
    "yena": [34.48, 9.4, 1.3, 29, 4],
    "baldum": [42.86, 9.0, 4.5, 28, 14],
    "florentino": [37.04, 8.7, 24.5, 27, 76],
    "richter": [68.18, 7.1, 0.0, 22, 0],
    "murad": [54.55, 7.1, 9.0, 22, 28],
    "darcy": [52.63, 6.1, 3.5, 19, 11],
    "gildur": [47.06, 5.5, 2.6, 17, 8],
    "chaugnar": [57.14, 4.5, 2.6, 14, 8],
    "elsu": [57.14, 4.5, 0.3, 14, 1],
    "keera": [50.0, 4.5, 0.3, 14, 1],
    "krizzix": [38.46, 4.2, 5.5, 13, 17],
    "omen": [66.67, 3.9, 17.7, 12, 55],
    "dyadia": [63.64, 3.5, 2.6, 11, 8],
    "aoi": [36.36, 3.5, 0.6, 11, 2],
    "zuka": [42.86, 2.3, 0.0, 7, 0],
    "preyta": [28.57, 2.3, 1.3, 7, 4],
    "evita": [14.29, 2.3, 3.9, 7, 12],
    "rourke": [33.33, 1.9, 0.6, 6, 2],
    "fennik": [40.0, 1.6, 1.0, 5, 3],
    "trieuvan": [0.0, 1.6, 0.0, 5, 0],
    "wonderwoman": [100.0, 1.3, 0.0, 4, 0],
    "goverra": [75.0, 1.3, 0.3, 4, 1],
    "ata": [50.0, 1.3, 0.3, 4, 1],
    "natalya": [0.0, 1.3, 0.0, 4, 0],
    "aleister": [100.0, 1.0, 0.0, 3, 0],
    "yan": [66.67, 1.0, 0.0, 3, 0],
    "aya": [50.0, 0.6, 1.0, 2, 3],
    "heino": [50.0, 0.6, 1.0, 2, 3],
    "xeniel": [50.0, 0.6, 0.0, 2, 0],
    "yorn": [50.0, 0.6, 0.0, 2, 0],
    "kahlii": [0.0, 0.6, 0.0, 2, 0],
    "raz": [0.0, 0.6, 0.0, 2, 0],
    "roxie": [0.0, 0.6, 0.0, 2, 0],
    "zip": [0.0, 0.6, 0.0, 2, 0],
    "celica": [100.0, 0.3, 0.0, 1, 0],
    "dieuthuyen": [100.0, 0.3, 0.0, 1, 0],
    "errol": [100.0, 0.3, 0.0, 1, 0],
    "azzenka": [0.0, 0.3, 0.0, 1, 0],
    "charlotte": [0.0, 0.3, 0.0, 1, 0],
    "laville": [0.0, 0.3, 0.0, 1, 0],
    "lubo": [0.0, 0.3, 0.0, 1, 0],
    "tulen": [0.0, 0.3, 0.0, 1, 0]
  },
  aogGames: 310, // tổng số trận ĐTDV mùa hiện tại
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
// Biểu tượng lớp tướng: nét mảnh cùng một bộ (lưới 24, nét tròn), độ dày nét đặt bằng CSS theo chỗ hiện
const ICON={
 tank:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5 5 6.3v5c0 4.2 2.9 7.6 7 9.2 4.1-1.6 7-5 7-9.2v-5z"/><path d="M12 8.5v7"/></svg>',
 fighter:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m5 5 9.5 9.5M12.5 16.5l4-4M14.5 14.5 19 19M19 5l-9.5 9.5M7.5 12.5l4 4M9.5 14.5 5 19"/></svg>',
 assassin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19.5 4.5 14.1 12.4 10.9 14.9 9.1 13.1 11.6 9.9z"/><path d="m7.6 11.6 4.8 4.8M10 14l-5 5"/></svg>',
 mage:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4c.7 4.5 3.5 7.3 8 8-4.5.7-7.3 3.5-8 8-.7-4.5-3.5-7.3-8-8 4.5-.7 7.3-3.5 8-8z"/></svg>',
 marksman:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="6.5"/><path d="M12 2.5v4.2M12 17.3v4.2M2.5 12h4.2M17.3 12h4.2"/><circle cx="12" cy="12" r=".6"/></svg>',
 support:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19.5s-7.5-4.4-7.5-10a4 4 0 0 1 7.5-2 4 4 0 0 1 7.5 2c0 5.6-7.5 10-7.5 10z"/></svg>'
};
const TIERS=["S","A","B","C","D"];
const TNAME={S:"Rất mạnh",A:"Mạnh",B:"Ổn",C:"Tình huống",D:"Yếu"};
const GROUPS={S:["Đỉnh meta","nên cấm hoặc chọn sớm"],A:["Meta","lựa chọn an toàn khi leo rank"],C:["Ngoài meta","cần đội hình phù hợp"],D:["Ít được dùng","đang yếu ở bản hiện tại"]};
const TR={up:["+ Tăng","up","Được tăng sức mạnh"],down:["− Giảm","down","Bị giảm sức mạnh"],mix:["± Chỉnh","mix","Điều chỉnh"],new:["Mới","new","Tướng mới / làm lại"]};
// Bản cập nhật gần nhất: Điều chỉnh giữa mùa Vết Nứt Thời Không 30/10/2026 (lienquan.garena.vn)
// key: [xu hướng, ghi chú, true nếu phần báo VN đã chỉnh theo bản này]; key có thể kèm đường (flowborn-ad)
const PATCH="30/10";
const P={
 evita:["down","Giảm sức mạnh: sát thương chiêu 1 còn 300 (+60/cấp, +0,6 SMPT), trước là 325 (+65/cấp, +0,65); sát thương chiêu 3 còn 30 (+15/cấp, +0,06 SMPT), hồi chiêu 3 tăng lên 55s (−5s/cấp)."],
 astrid:["down","Giảm sức mạnh: tốc đánh cộng thêm của chiêu 1 còn 15% (+3%/cấp), trước là 20% (+4%/cấp); sát thương chiêu 1 còn 275 (+55/cấp, +1,0 công vật lý), trước là 300 (+60/cấp, +1,1)."],
 tamyn:["down","Giảm sức mạnh: đòn đánh cường hóa của nội tại còn 182–364 (+0,28 công vật lý cộng thêm), trước là 200–396 (+0,3)."],
 hayate:["mix","Điều chỉnh: sát thương chuẩn của nội tại thành 45 (+0,23 công vật lý), trước là 40 (+0,25); chiêu 1 gây 110 (+22/cấp, +0,18 công vật lý), trước là 105 (+21/cấp, +0,2). Mạnh hơn đầu trận, nhẹ hơn cuối trận."],
 keera:["up","Tăng sức mạnh: hồi chiêu 1 còn 5s (−0,2s/cấp), trước là 6s (−0,4s/cấp); chiêu 2 gây 100 (+20/cấp, +0,2 SMPT) trên đường lướt và 400 (+80/cấp, +0,8 SMPT) ở vùng tam giác."],
 erin:["up","Tăng sức mạnh: chiêu 1 gây 450 (+90/cấp, +1,05 SMPT, +0,6 công vật lý), trước là 350 (+70/cấp, +0,8, +0,45); sát thương trúng đích 150 (+30/cấp, +0,35 SMPT); hồi chiêu giảm 0,3s mỗi cấp.",true],
 xeniel:["up","Tăng sức mạnh: lá chắn chiêu 1 thành 500 (+100/cấp, +0,5 SMPT, +5% máu tối đa), trước là 350 (+110/cấp, +0,4, +4%); sát thương chiêu 1 thành 500 (+100/cấp, +0,5 SMPT, +5% máu tối đa).",true],
 sephera:["up","Tăng sức mạnh: nội tại thêm hiệu ứng tự hồi máu bằng 4% máu tối đa cộng thêm.",true]
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
/*RANK:BEGIN tự sinh bằng `node tools/rank/emit.js` từ tools/rank/garena.txt, đừng sửa tay. [thắng %, chọn %, cấm %, bậc Garena 0–4 = T0–T4]; thắng/chọn/cấm vào điểm tổng qua rankScore, bậc Garena chỉ hiển thị*/
const RANK={src:"Garena Liên Quân Mobile",where:"Cẩm nang → Bảng Phân Bậc Tướng",filter:"Đấu hạng (Tất cả)",read:"11/11/2026",d:{
"trieuvan":[55.24,35.18,13.42,0],"omega":[55.05,2.1,0.28,4],"preyta":[54.98,7.37,4.8,2],"tamyn":[54.63,3.2,22.36,3],"moren":[54.34,5.65,1.2,2],
"dyadia":[54.25,3.36,20.25,3],"erin":[53.98,10.72,3.67,2],"evita":[53.75,11.47,69.68,0],"thorne":[53.53,2.01,0.1,4],"astrid":[53.32,3.41,1.07,3],
"flowborn-ad":[53.04,14.92,29.2,0],"roxie":[53.03,1.34,0.36,4],"dextra":[52.81,0.5,0.1,4],"lumburr":[52.78,0.7,0.1,4],"ybneth":[52.76,7.09,10.66,2],
"flowborn-mid":[52.74,1.13,1.17,4],"zata":[52.7,10.83,56.51,0],"max":[52.52,1.27,0.13,4],"rourke":[52.26,1.02,0.1,4],"xeniel":[52.22,2.26,0.43,4],
"marja":[52.2,6.49,7.83,2],"cresht":[52.19,5.3,0.45,3],"teemee":[52.06,1.08,0.49,4],"wisp":[51.92,1.86,0.1,4],"dirak":[51.86,1.75,0.13,4],
"fennik":[51.82,5.7,0.62,2],"helen":[51.77,2.43,1.65,4],"thane":[51.73,4.29,0.25,3],"yorn":[51.72,13.71,0.79,2],"telannas":[51.69,20.53,1.39,0],
"darcy":[51.63,6.89,23.85,2],"volkath":[51.56,4.65,16.92,2],"veres":[51.52,13.93,0.73,2],"laville":[51.5,5.38,0.13,3],"sinestrea":[51.46,5.71,5.55,2],
"boltbaron":[51.38,9.22,1.1,2],"azzenka":[51.28,4.95,0.5,3],"arthur":[51.23,19.07,2.51,1],"ilumia":[51.1,5.11,0.22,3],"kahlii":[50.95,4.17,0.23,3],
"chaugnar":[50.85,3.72,1.27,3],"zip":[50.81,1.56,3.5,4],"lorion":[50.78,4.17,0.86,3],"quillen":[50.75,6.49,1.72,2],"edras":[50.69,9.82,8.53,2],
"ming":[50.65,0.64,0.1,4],"mina":[50.64,8.47,1.01,2],"slimz":[50.59,6.35,0.12,2],"goverra":[50.52,6.21,14.88,2],"wiro":[50.47,0.59,0.1,4],
"krizzix":[50.44,2.66,10.1,3],"bijan":[50.44,13.1,4.05,2],"ryoma":[50.32,15.21,1.67,1],"violet":[50.24,33.78,1.06,0],"tachi":[50.22,6.77,0.2,2],
"airi":[50.17,10.65,0.41,2],"maloch":[50.16,9.76,0.81,2],"baldum":[50.16,3.35,0.58,3],"alice":[50.11,13.73,5.04,2],"butterfly":[50.08,16.98,6.58,1],
"annette":[50.04,7.61,31.12,2],"teeri":[49.96,2.58,0.1,4],"zill":[49.93,4.53,0.16,3],"ata":[49.91,0.97,0.1,4],"ormarr":[49.75,1.56,0.1,4],
"arum":[49.72,4.11,18.49,3],"enzo":[49.72,5.89,17.57,2],"taara":[49.71,9.25,4.22,2],"biron":[49.7,4.74,0.52,3],"arduin":[49.67,2.68,0.1,4],
"qi":[49.65,3.74,0.1,3],"dieuthuyen":[49.55,4.87,0.43,3],"sephera":[49.49,2.05,0.71,4],"toro":[49.47,23.85,7.22,0],"dolia":[49.4,8.26,55.61,1],
"allain":[49.3,10.91,3.05,2],"bonnie":[49.19,3.3,0.65,3],"nakroth":[49.07,35.28,30.65,0],"stuart":[49.04,6.89,3.25,2],"celica":[48.98,0.55,0.1,4],
"iggy":[48.98,2.67,0.12,4],"keera":[48.97,5.84,1.97,2],"krixi":[48.95,19.13,0.77,1],"omen":[48.93,4.52,0.46,3],"veera":[48.89,17.03,18.54,0],
"tulen":[48.87,9.24,0.34,2],"kaine":[48.78,7,12.47,2],"zephys":[48.74,6.32,0.14,2],"amily":[48.73,3.12,0.1,3],"elsu":[48.72,18.47,26.83,0],
"ngokhong":[48.64,25.82,10.68,0],"yue":[48.62,17.28,39.23,0],"aleister":[48.59,5.02,40.82,2],"murad":[48.56,23.21,22.68,0],"lubo":[48.49,2.2,0.19,4],
"hayate":[48.48,29.61,16.84,0],"lindis":[48.47,1.6,0.14,4],"florentino":[48.46,16.27,23.98,0],"heino":[48.43,5,2.49,3],"liliana":[48.37,7.1,0.27,2],
"bright":[48.37,3.52,0.1,3],"billow":[48.37,8.53,4.01,2],"lauriel":[48.33,7.23,1.91,2],"natalya":[48.3,21.12,5.83,0],"errol":[48.29,6.97,0.63,2],
"valhein":[48.23,16.28,1.33,1],"skud":[48.23,1.48,0.12,4],"yena":[48.14,2.57,0.1,4],"kriknak":[48.05,2.18,0.1,4],"gildur":[48.01,17.15,19.04,0],
"wonderwoman":[48.01,0.29,0.1,4],"raz":[47.99,23.38,3.83,0],"ishar":[47.93,3.42,0.4,3],"paine":[47.81,7.72,1.41,2],"aoi":[47.81,1.39,0.22,4],
"ignis":[47.79,1.36,0.1,4],"capheny":[47.72,10.84,0.39,2],"zuka":[47.67,10.58,0.27,2],"jinna":[47.54,0.74,0.1,4],"elandorr":[47.5,4.39,0.18,3],
"grakk":[47.49,10.76,32.24,1],"mganga":[47.25,4.22,0.21,3],"yan":[47.06,2.94,0.13,3],"kilgroth":[47.04,3.84,0.93,3],"richter":[46.95,4.91,0.21,3],
"rouie":[46.78,2.94,11.4,3],"aya":[46.71,10.37,70.74,0],"charlotte":[46.61,0.42,0.1,4],"theflash":[46.11,0.53,0.2,4],"superman":[45.01,0.3,0.37,4],
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
const MANUAL={evita:"A",raz:"A",preyta:"A",aoi:"B",darcy:"A",zuka:"B",nakroth:"A",airi:"A","arthur-sp":"B",krizzix:"A",chaugnar:"B",taara:"A",qi:"A",yena:"A","billow-top":"B","boltbaron-ad":"A",
  // Đường Giữa ghim theo bảng @zena_sama 03/11/2026 (chủ web yêu cầu "y chang bảng này" 07/11/2026). Xoá các dòng "-mid" dưới đây để đường Giữa tính lại theo điểm.
  "lorion-mid":"S","rouie-mid":"S","darcy-mid":"A","evita-mid":"A","ignis-mid":"A","liliana-mid":"A","zata-mid":"A","annette-mid":"B","goverra-mid":"B","iggy-mid":"B","raz-mid":"B","yue-mid":"B","aleister-mid":"C","azzenka-mid":"C","dirak-mid":"C","mganga-mid":"B","natalya-mid":"C","preyta-mid":"B","dieuthuyen-mid":"D","flowborn-mid":"C","heino-mid":"C","ilumia-mid":"C","jinna-mid":"D","kahlii-mid":"C","krixi-mid":"C","lauriel-mid":"C","sephera-mid":"D","tulen-mid":"D","veera-mid":"C","bonnie-mid":"D","ishar-mid":"D",
  "erin-mid":"A","alice-mid":"B","aya-mid":"C","dolia-mid":"D","dyadia-mid":"D","theflash-mid":"D",
  // Tà Thần, Rừng, Trợ thủ ghim theo bảng TikTok @zena_sama 24/10/2026 (chủ web yêu cầu y chang 07/11/2026). Tướng không có trong bảng giữ tier theo điểm.
  // Từ 07/11/2026 18:11 chủ web yêu cầu lùi một bậc cho cả 4 bảng: bậc cao nhất của bảng (SS/S+/T0) = S, bậc kế = A, rồi B, C; hai bậc thấp nhất (C và D, hoặc T3) đều = D.
  "airi-top":"S","qi-top":"A","marja-top":"S","florentino-top":"S","taara-top":"B","yan-top":"B","richter-top":"B","yena-top":"B","biron-top":"B","maloch-top":"B","boltbaron-top":"B","omen-top":"B","skud-top":"B","ryoma-top":"B","volkath-top":"C","charlotte-top":"C","veres-top":"C","zuka-top":"C","max-top":"C","lubo-top":"C","allain-top":"D","amily-top":"D","kilgroth-top":"D","kaine-top":"D","arthur-top":"D","nakroth-jg":"S","tamyn-jg":"S","billow-jg":"S","astrid-jg":"S","sinestrea-jg":"S","aoi-jg":"B","tachi-jg":"A","ryoma-jg":"B","ngokhong-jg":"B","trieuvan-jg":"B","zephys-jg":"B","butterfly-jg":"B","enzo-jg":"C","keera-jg":"B","murad-jg":"B","zuka-jg":"C","kriknak-jg":"D","quillen-jg":"D","paine-jg":"D","bright-jg":"D","kaine-jg":"D","ybneth-sp":"S","thane-sp":"S","wiro-sp":"S","dolia-sp":"S","teemee-sp":"A","ata-sp":"A","cresht-sp":"A","krizzix-sp":"A","ormarr-sp":"B","baldum-sp":"B","toro-sp":"B","omega-sp":"A","alice-sp":"B","lumburr-sp":"C","xeniel-sp":"C","chaugnar-sp":"B","zip-sp":"C","aya-sp":"C","arum-sp":"D","grakk-sp":"C","arduin-sp":"D",
  "elandorr-jg":"A","volkath-jg":"A","boltbaron-jg":"D","darcy-jg":"C","edras-jg":"B","wonderwoman-jg":"B","rourke-jg":"B","yan-jg":"B","veres-jg":"B","fennik-jg":"C","tulen-jg":"C","bijan-jg":"C","errol-jg":"C","zill-jg":"C","lubo-jg":"D","kilgroth-jg":"D","lindis-jg":"D","skud-jg":"D","tamyn-top":"A","mina-top":"B","murad-top":"B","ngokhong-top":"C","astrid-top":"C","xeniel-top":"C","roxie-top":"C","veres-sp":"A","maloch-sp":"B","richter-sp":"B","arthur-sp":"C","roxie-sp":"D",
  // Chủ web yêu cầu 11/11/2026: Ata Tà Thần lên A (theo công thức ra D, kể cả sau khi thêm game rank)
  "ata-top":"A",
  // Chủ web yêu cầu 11/11/2026: Erin và Yorn đường Rồng lên B (theo điểm đang ra C; Erin Giữa đã ghim A)
  "erin-ad":"B","yorn-ad":"B",
  // Chủ web yêu cầu 11/11/2026 21:05: Edras Tà Thần S, Thorne Rồng D
  "edras-top":"S","thorne-ad":"D",
  // Chủ web yêu cầu 11/11/2026 21:08: Chaugnar Trợ thủ C→B, Omega Trợ thủ B→A (sửa giá trị ở trên)
  // Chủ web yêu cầu 11/11/2026 21:07: "lindis lên C" (đường chính Rồng; Lindis Rừng giữ D)
  "lindis-ad":"C",
  // Chủ web yêu cầu 11/11/2026 21:12: Preyta, Mganga Giữa C→B (sửa giá trị ở trên)
  // Chủ web yêu cầu 11/11/2026 21:11: Lauriel, Veera, Krixi, Flowborn (phép), Ilumia, Kahlii, Heino ở Giữa D→C (sửa giá trị ở trên)
  // Chủ web yêu cầu 11/11/2026 21:09: Grakk Trợ thủ D→C (sửa giá trị ở trên)
  // Chủ web yêu cầu 11/11/2026 21:09: Wisp Rồng xuống C, Dyadia Trợ thủ (đường chính) lên A; Dyadia Giữa giữ D
  "wisp-ad":"C","dyadia-sp":"A",
  // Chủ web yêu cầu 11/11/2026 21:13: Gildur Giữa xuống B
  "gildur-mid":"B",
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
const SECONDARY={"Y'bneth":["sp"],Taara:["sp"],Omega:["sp"],Ata:["sp"],Zuka:["jg"],Ryoma:["jg"],Qi:["jg"],Airi:["jg"],"Triệu Vân":["jg"],
  Billow:["top"],Zephys:["top"],Kaine:["top"],Zill:["mid"],Wiro:["top"],Arthur:["sp"],Arduin:["top"],"Bolt Baron":["ad"],
  // Thêm ô Giữa 07/11/2026 theo bảng Giữa của @zena_sama 03/11 (chủ web yêu cầu)
  Erin:["mid"],Alice:["mid"],Aya:["mid"],Dolia:["mid"],Dyadia:["mid"],"The Flash":["mid"]};
// Thêm ô 07/11/2026 cho tướng có trong 3 bảng TikTok @zena_sama 24/10 (Rừng, Tà Thần, Trợ thủ) mà web chưa có ô ở đường đó (chủ web yêu cầu)
for(const [n,ls] of Object.entries({"Eland'orr": ["jg"], "Volkath": ["jg"], "Bolt Baron": ["jg"], "D'Arcy": ["jg"], "Edras": ["jg"], "Wonder Woman": ["jg"], "Rourke": ["jg"], "Yan": ["jg"], "Veres": ["jg", "sp"], "Fennik": ["jg"], "Tulen": ["jg"], "Bijan": ["jg"], "Errol": ["jg"], "Lữ Bố": ["jg"], "Kil'Groth": ["jg"], "Lindis": ["jg"], "Skud": ["jg"], "Tamyn": ["top"], "Mina": ["top"], "Murad": ["top"], "Ngộ Không": ["top"], "Astrid": ["top"], "Xeniel": ["top"], "Roxie": ["top"], "Maloch": ["sp"], "Richter": ["sp"]}))(SECONDARY[n]=SECONDARY[n]||[]).push(...ls);
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
  HEROES.forEach(h=>{const o=pv[h.id]||"";h.prev=o;h.move=o&&o!==h.tier?("SABCD".indexOf(h.tier)<"SABCD".indexOf(o)?"up":"down"):""})}
const picksOf=h=>{const a=aogOf(h.key,h.lane);return a?a[3]:0};
HEROES.sort((a,b)=>picksOf(b)-picksOf(a)||b.score-a.score||a.name.localeCompare(b.name,"vi"));
