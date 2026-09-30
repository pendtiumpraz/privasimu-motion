// Membuat kerangka folder video baru (seri katalog gaya). Folder diberi berkas DRAF supaya belum masuk antrean render.
//   node lib/baru.js <folder> "<judul>" ["<famili Google Fonts, dipisah |>"]
//   contoh: node lib/baru.js ty33-anagram "TY33 · NAMA ↔ AMAN" "Archivo:wght@400..900|Instrument+Serif:ital@0;1"
// Lalu tulis scenes.js, style.js, style.css di folder itu. Selesai & lolos cek → node lib/siap.js <folder>
const fs = require('fs');
const path = require('path');

const [folder, judul, fonts = ''] = process.argv.slice(2);
if (!folder || !judul) { console.error('pakai: node lib/baru.js <folder> "<judul>" ["Font+Satu:wght@400;700|Font+Dua"]'); process.exit(1); }
const dir = path.join(__dirname, '..', folder);
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'DRAF'), '');
const fam = ['Plus+Jakarta+Sans:wght@400;500;600;700;800', 'JetBrains+Mono:wght@500;700', ...fonts.split('|').filter(Boolean)];
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
fs.writeFileSync(path.join(dir, 'index.html'), `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<title>${esc(judul)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?${fam.map((f) => 'family=' + f).join('&')}&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../lib/kit.css">
<link rel="stylesheet" href="../lib/pendek.css">
<link rel="stylesheet" href="style.css">
</head>
<body>
<div id="stage"></div>
<script src="../lib/wordtime.js"></script>
<script src="../lib/engine.js"></script>
<script src="../lib/kit-events.js"></script>
<script src="../lib/kit.js"></script>
<script src="../lib/pendek.js"></script>
<script src="scenes.js"></script>
<script src="style.js"></script>
<script src="timeline.js"></script>
<script>KIT.run(PRV);</script>
</body>
</html>
`);
const mus = path.join(dir, 'music.js');
if (!fs.existsSync(mus)) fs.writeFileSync(mus, "const { CONFIG, SCENES } = require('./scenes');\nmodule.exports = require('../lib/music-kit')(CONFIG.music, SCENES);\n");
console.log(`${folder}: kerangka dibuat (DRAF, index.html, music.js)`);
