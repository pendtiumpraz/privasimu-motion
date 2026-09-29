# Brief produksi video iklan Privasimu (untuk agen per video)

Kamu memproduksi SATU video iklan (16:9 dan 9:16) di folder `motion/<folder-kamu>/`. Video dirakit dari kode:
animasi HTML dirender per frame, VO (TTS placeholder; nanti diganti VN tim), musik & SFX disintesis, subtitle otomatis.

## Tujuan kreatif
- **Gaya visual KHAS** untuk videomu (lihat arahan di prompt). Jangan terlihat seperti template dashboard biru-gelap generik.
- **Luwes & elegan, tidak kaku**: gerak berlapis (overlapping), easing halus, teks muncul per kata/huruf, elemen mengapung halus,
  kamera bergerak pelan, transisi kreatif. Setiap scene harus "hidup" sepanjang durasinya.
- **Efek ala CapCut** boleh & dianjurkan (zoom punch, RGB split, glitch, flash, shake, speed lines, blur transition, stop-motion,
  VHS, light leak, confetti, emoji pop, dll) — pilih yang cocok dengan gayamu. Pustaka referensi: `motion/PUSTAKA-GAYA.md`
  (sedang disusun agen riset; pakai bila sudah ada).
- **Meme**: format meme DIBUAT ULANG secara orisinal (Drake-style ❌/✅, Ekspektasi vs Realita, "Nobody:", "POV:", stiker emoji,
  dialog error jadul, dll) di momen yang pas dengan naskah. SFX meme sintetis tersedia (lihat daftar SFX).

## Aturan wajib
1. Hanya ubah file di folder videomu (`scenes.js`, `style.css`, `style.js`, `index.html`, `music.js`). JANGAN ubah `lib/`, folder lain,
   atau `naskah/`. Kalau menemukan bug di `lib/`, akali di foldermu dan laporkan.
2. Teks VO tiap scene = **persis** teks VO naskahmu di `motion/naskah/<Nxx>-*.txt` (bagian [S1], [S2], ...). Id scene `s1`, `s2`, ...
   berurutan. Semua bagian (termasuk yang OPSIONAL) dipakai.
3. Klaim hanya dari naskah (bagian "DASAR FAKTA") dan `backend-go/internal/konten/data/fakta_produk.json`. Angka di UI boleh sebagai
   ilustrasi. Dilarang "100% patuh", "dijamin lolos", dsb.
4. **Tanpa unduhan media dari internet** (gambar, video, audio, meme). Pakai CSS, SVG, canvas, emoji, dan Google Fonts (via `<link>`).
   Tanpa gambar/karakter/logo/jingle berhak cipta, tanpa wajah selebriti, tanpa nama/merek pihak lain (mis. parodi "iklan obat
   jadul" boleh sebagai GENRE, tapi jangan pakai nama/logo/jingle produk nyata).
5. **Deterministik**: semua gerak dihitung dari waktu `lt` di fungsi render. JANGAN pakai CSS `transition`, `@keyframes`/`animation`,
   `Math.random()`, `Date.now()`, `setTimeout`. Untuk acak pakai `MG.hash(n)`.
6. Dua format harus rapi. 9:16 (1080×1920): konten penting di y 200–1430 dan x 60–1020 (subtitle otomatis muncul ± y 1480–1600).
   16:9 (1920×1080): margin ± 80 px. Tidak ada teks terpotong/bertumpuk.
7. JANGAN render video penuh (`node build.js <folder>` tanpa `--audio-only`). Sutradara yang merender.
8. Logo: `../assets/privasimu_logo.png` (wordmark putih). Di latar terang pakai CSS `filter: brightness(0)` (hitam) atau
   `filter: brightness(0) invert(13%) sepia(40%) saturate(2000%) hue-rotate(205deg)` (navy).

## Alur kerja & uji
```bash
cd D:/AI/privasimu/motion
node build.js <folder> --audio-only                      # TTS + timeline + audio; cetak durasi tiap scene
node lib/render.js still <folder> 16x9 1.2 3.5 6.0 ...   # screenshot ke out/<folder>/stills/ (error JS halaman tercetak)
node lib/render.js still <folder> 9x16 1.2 3.5 6.0 ...
node lib/contact.js out/<folder>/c16.jpg 4 2400 out/<folder>/stills/16x9-*.jpg
node lib/contact.js out/<folder>/c9.jpg 6 2400 out/<folder>/stills/9x16-*.jpg
```
Lihat contact sheet (Read tool) dan iterasi. Ambil beberapa frame per scene (awal, tengah, akhir). Cek `out/<folder>/timeline.json`
untuk waktu scene/kata. Pratinjau: buka `motion/<folder>/index.html?fmt=9x16` di browser.

## Struktur scenes.js
```js
(function (root) {
  const CONFIG = {
    title, naskah: 'N0x', voice: 'id-ID-ArdiNeural' | 'id-ID-GadisNeural', voiceRate: '+10%',
    beat: 60 / bpm,            // durasi scene dibulatkan ke ketukan; samakan dengan music.bpm
    tail: 0.45,                // jeda setelah VO tiap scene
    music: { bpm, root, mode: 'minor'|'major', clock: false, lead: 'pluck'|'keys'|'bell'|'chip', drums: 'full'|'light'|'chip'|'none', sonic: true },
    mix: { duckTo: 0.4 },      // opsional
  };
  const SCENES = [{ id: 's1', min: 4, voDelay: 0.4, tail?, theme: 'brand', mus: 'main', vo: '...', sfx: [[when, 'nama', gain]], autoSfx?: false, vis: {...} }, ...];
  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
```
- Waktu (`at`, `when`): angka detik lokal scene | `'w:kata'` (awal kata di VO; `'w:kata#2'` kemunculan ke-2; `'w:kata+0.3'` offset) | `'end-0.5'`.
- `mus` (energi musik per scene): `hook | tense | hush | main | calm | play | outro | none`. Scene terakhir biasanya `outro`.
- `theme` (palet latar bawaan): `danger | warn | brand | calm | dark` atau tema kustom via `KIT.style({ themes })`.

## Tipe scene bawaan kit (`vis.type`) — semua bisa ditata ulang total lewat style.css
- `headline` `{ lines: [{ text, size: 'xl'|'lg'|'md'|'sm', at, fx: 'up'|'blur'|'punch', color, mono, sfx }] }` (`*teks*` = warna aksen)
- `alert` `{ time, date, at, app, title, body, aside: [{ text, size, at }] }` (HP + notifikasi; aside hanya 16:9)
- `countdown` `{ label, hours: 72, at, speed, ref }`
- `stack` `{ step, items: [{ kind: 'file'|'mail'|'chat'|'note', text, from, sub, at, pos: { h: [x,y], v: [x,y] }, r }], words: [{ text, at, color, size: 'sm', glitch }], merge: { at, title, sub } }`
- `checklist` `{ title, alarm, rows: [{ text, tag, at, check, chip, chipLabel }] }`
- `flow` `{ title, numbered, steps: [{ icon, title, sub, at }] }` (2–5 langkah)
- `card` `{ app, icon, title, sub, dark, fields: [{ label, icon, kind: 'text'|'toggle'|'sign'|'pill', value, tone: 'red'|'amber'|'green'|'blue', at, on }] }`
- `dashboard` `{ menu, active, title, badge, badgeTone, panels: [...] }`; panel `kind`: `kpis {items:[{label,value}]}`, `timer {title,hours,speed}`,
  `gauge {title,label,start,end,from,dur}`, `queue|log {title, items:[{text,pill,tone,icon,who:'user'|'ai',at}], wide}`,
  `chat {title, msgs:[{from:'u'|'a', who, text, at}]}`, `raci {title, rows:[{task,on:[kolom],names}], cols}`; `v: false` = sembunyi di 9:16.
- `badges` `{ lines: [{ text, size, at }], badges: [{ text, small, at }], sub, subAt }`
- `tree` `{ title, root, at, colorful, children: [{ name, score, tone, at }], scoreAt, unifyAt }`
- `grid` `{ title, at, scanDur, fixAt, fixDur, red, amber, legend: ['Belum','Sebagian','Sudah'] }` (peta pasal merah/kuning/hijau)
- `doc` `{ kicker, title, sub, foot, marks: [{ target: 'title'|'sub', at }], stamp: { text, big, at, color: ''|'blue'|'green' } }`
- `logo` `{ at, nexus, nexusAt, tagline, tagAt }`
- `cta` `{ nexus: true|false, lines: [{ text, size: 'sm'|'', at }], button, btnAt, foot }`
- `meme` — `variant: 'drake'` `{ rows: [{ text, emoji, at }, { text, emoji, at }] }` | `'expect'` `{ left: { label, emoji, text, at }, right: {...} }` |
  `'nobody'` `{ lines: [{ text, at }], emoji, emojiAt }` | `'pov'` `{ text, at, emoji, emojiAt }`
- Semua tipe: `stickers: [{ e: '😱' | img, at, x: 0..1, y: 0..1, size, rot, v: { x, y }, sfx, gain }]`, `shake: [waktu]`, `flash: true`,
  `blackEnd: true`, `push: 0.035` (dorongan kamera), `enter: 'none'`, `exit: 'none'`.
- Ikon (`icon`): doc shield alert clock user users check cloud server layers key lock cap award search db link sync spark chart list flag
  mail chat form baby access building handshake route folder target dot.
- Kelas CSS utama untuk ditata ulang: `.k-head .k-line .k-phone .k-notif .k-cd .k-it .k-word .k-merge .k-list .k-row .k-box .k-flow .k-step
  .k-arrow .k-card .k-f .k-pill .k-app .k-pn .k-kpi .k-q .k-msg .k-bd .k-node .k-cells .k-doc .k-stamp .k-logo .k-cta-lines .k-btn .k-foot
  .k-meme .k-stk .kw`. Kelas format di `<html>`: `.h` (16:9) / `.v` (9:16). Kelas tema scene: `.t-<theme>`.

## Membuat tipe scene & efek sendiri (style.js — dimuat sebelum KIT.run)
```js
KIT.style({
  fonts: ['400 20px "Press Start 2P"'],               // font tambahan yang ditunggu sebelum render
  themes: { retro: ['#c0c', '#300', '#000', 'rgba(255,255,255,.08)', 'rgba(255,255,255,.5)'] },
  bg: (cx, t, sceneId, theme, SW, SH, lt) => { ... },   // ganti latar canvas (grain tetap ditambahkan)
  frame: (sceneId, lt, d, sectionEl) => { ... },        // hook per frame (overlay, efek global)
});
KIT.registerType('namaku', (root, v, sc, tm, T) => {    // T(spec, fallback) -> detik lokal
  const el = KIT.h(`<div class="x">${KIT.rich(v.text)}</div>`); root.appendChild(el);
  const words = KIT.splitWords(el);
  return (lt, d) => { KIT.revealWords(words, T(v.at, .3), lt); MG.tf(el, { y: KIT.float(lt, 0, 6) }); };
});
```
Tipe kustom tidak punya SFX otomatis — tulis di `sfx` scene. Helper: `KIT.h(html)`, `KIT.esc`, `KIT.rich`, `KIT.splitWords(el)`,
`KIT.revealWords(spans, t0, lt, { stagger, dur, dist, blur })`, `KIT.float(lt, i, amp, speed)`, `KIT.icon(nama, size, stroke)`,
`KIT.$(sel, root)`, `KIT.pick(nilai16x9, nilai9x16)`, `KIT.V`, `KIT.SW`, `KIT.SH`.
Engine `MG`: `P(t,a,b)` (progres 0..1), `cl`, `lerp`, `E.{out3,in3,io3,outExpo,inExpo,outBack,outElastic}`, `hash(n)`,
`tf(el, { x, y, s, r, o, blur, rx, ry, sx, sy })` (menimpa transform), `glitch(el, t, amt)`, `wt(sceneId, 'kata', fb)`.
Untuk efek stop-motion: kuantisasi waktu, mis. `const q = Math.floor(lt * 12) / 12`.

## SFX (nama untuk `sfx`)
whoosh suck riser riserLong sweep impact boom stamp hit glitch pop tick key ding shimmer clock tock flip paper slam check heart alarm
vineboom scratch sadtrombone dundun rimshot buzzer correct boing slidewhistle crickets airhorn coin levelup blip tada
hitmarker rewind clank slidedown auraUp auraDown notif shutter sadviolin reveal error shock gameover outro eurobeat,
atau `'file:nama'` untuk file di `motion/sfx-kustom/` (belum ada isinya). SFX otomatis dari event kit bisa dimatikan per scene (`autoSfx: false`).

## Laporan akhir (balasan terakhirmu, ringkas)
Gaya & palet, font, ide visual per scene, momen meme & efek CapCut yang dipakai, durasi total, lokasi contact sheet
(`out/<folder>/c16.jpg`, `c9.jpg`), dan masalah/bug `lib/` bila ada.
