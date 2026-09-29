# PUSTAKA GAYA — efek & gaya animasi untuk iklan motion graphics Privasimu

Disusun 29 September 2026 dari riset tren CapCut/TikTok/desain 2025–2026 (hanya membaca halaman web, tidak ada media yang diunduh).
Semua resep dibuat untuk engine kami: HTML/CSS/SVG/canvas yang dirender per frame, deterministik dari waktu lokal scene `lt`
(30 fps, 1 frame = 0,033 dtk), **tanpa** CSS `transition`/`@keyframes`, `Math.random`, `Date.now`, `setTimeout`.

**Cara membaca.** ID entri: **T** transisi · **X** teks · **V** visual/filter · **R** ritme & meme · **C** craft · **B** B2B elegan
(dipakai di bagian 8, *Pemetaan ke video*). `[n]` = nomor sumber di bagian 10 (tanda † = hanya terlihat di hasil pencarian, halamannya belum dibuka penuh).
Angka yang diberi `[n]` berasal dari sumber itu (sebagian klaim blog, bukan hasil uji kami); angka lain adalah **titik awal dari kami**, bukan standar baku — setel dengan mata.
✔ pada judul entri = resepnya sudah diuji render di Chromium (rinciannya di akhir bagian 1).
Semua px berlaku di 16:9 maupun 9:16 karena sisi terpendek layar = 1080 px. Detik ditulis "dtk", desimal dengan koma di prosa dan titik di kode.

---

## 0. Pilih cepat & aturan emas

| Kebutuhan | Pakai |
|---|---|
| Ganti scene tegas | T1 flash · T2 whip pan · T6 glitch |
| Ganti scene halus | T5 blur dip · T9 push · T10 match cut |
| Menekan kata/angka kunci | X4 slam · V1 zoom punch · X1 caption kata-per-kata · V4 shake |
| Tegang / cyber / insiden | V13 CCTV · V12 CRT · V6 glitch · X6 scramble · V3 speed ramp |
| Jenaka / meme | R1–R11 · V11 stiker · R9 dialog error |
| Premium / kredibel | B10 editorial · X5 mask reveal · V2 push-in · V8 light leak |
| Handmade / hangat | C1–C7 (kertas, krayon, stop-motion, scrapbook) |
| Retro / gim | V7 VHS · C8 pixel/RPG · T7 pixel wipe · V12 CRT |
| Teknis / arsitektural | C9 blueprint · B3 isometrik · B7 garis tipis |

**Tren yang benar-benar naik (2025–2026).**
(1) Transisi teratas CapCut 2026: velocity/speed ramp, beat-sync, glitch & RGB split, cinematic fade/zoom, swipe/spin, before-after, slow-mo + blur [1][3].
(2) Kinetic typography sebagai tulang punggung iklan, dan caption kata-per-kata dengan kata kunci berwarna [21][22][23][24].
(3) "Craft as luxury": kertas robek, stop-motion, garis tangan, tekstur analog (grain, serat kertas), frame rate sedikit diturunkan agar terasa taktil [44][46][47].
(4) Kaca translusen (glassmorphism → "Liquid Glass" Apple, Juni 2025), garis tipis, gradien mengalir, isometrik, bento grid untuk SaaS [55][56][60][62][70].
(5) Retro analog (VHS, grain, tungsten) dan CRT/pixel [47].
(6) Indonesia: jedag-jedug (beat + flash/zoom/shake/split) [27]; absurd/brainrot & "meme anomali" (loop singkat, audio aneh, ekspresi berlebihan) [28][29]; POV [31]; ekspektasi vs realita [35]; #QuietLuxury sebagai kontra-tren yang tenang [29].
(7) Iklan TikTok: hook di 3 dtk pertama, teks di luar zona UI, audio wajib [36][37].
(8) Template CapCut yang ramai: AI one-click (klip–musik–transisi tersinkron otomatis), remix template viral, filter estetik niche (Y2K, cozy), mini-vlog bertutur dengan teks + VO, montase beat-sync [3]. Polanya kita tiru secara prosedural; template/asetnya tidak dipakai (bagian 9).

**Aturan emas.**
1. **Satu efek per momen.** Menumpuk transisi menurunkan retensi (klaim [2]: −12%); transisi bawaan 1 dtk terasa lambat, pakai 0,2–0,3 dtk.
2. **Efek jatuh tepat di kata/ketukan**; geser ±2 frame sampai terasa pas [24].
3. **Hirarki gerak**: pesan utama = gerak terbesar, pendukung = halus, teks legal = fade sederhana; teks harus terbaca ≥ 0,5 dtk setelah berhenti [24].
4. **Glitch/flash untuk menegaskan momen, bukan tiap cut** (saran umum panduan CapCut 2026). Kedip ≤ 3 kali per detik pada area besar (WCAG 2.3.1) [86].
5. **Gaya mengikuti emosi scene**; pergantian gaya = pergantian nada ("suasana berbalik" di N03).
6. **9:16**: konten penting di y 200–1430 dan x 60–1020 (aturan brief). TikTok menyarankan hindari ±10% atas, 10% kanan, 20% bawah [37]; hook ≤ 3 dtk [36].
7. **Filter SVG mahal**: nyalakan hanya saat efek aktif dan set `filter:'none'` ketika nilainya 0.
8. **Deterministik**: acak = `MG.hash`; gerak = fungsi `lt`. Bila animasi harus berulang, pakai `lt % periode`.

---

## 1. Fondasi engine (tempel di `style.js`, dibungkus IIFE `(function () { … })();` agar nama tidak bentrok)

Catatan engine yang dipakai resep: `KIT.style({ bg, frame, fonts, themes })`; hook `frame(sceneId, lt, d, sec)` dipanggil **setelah** kit menulis
`transform/filter/opacity` scene — jadi menimpa atau menambah (pakai `add()` di bawah supaya blur bawaan kit tidak hilang). `MG.tf(el,{x,y,s,r,o,blur,rx,ry,sx,sy})`
menimpa `transform/opacity/filter` elemen itu: pasang filter SVG **sesudah** `tf`. Opsi scene kit yang sudah ada: `flash`, `shake:[t]`, `push`, `enter/exit:'none'`,
`stickers`, `fx:'punch'`, `meme` (`drake|expect|nobody|pov`), `countdown`. Sinkron kata: `MG.wt('s2','kata')`. Font tambahan: `KIT.style({fonts:['400 20px "Anton"']})` + `<link>` Google Fonts.

```js
// ── Fondasi (semua deterministik dari lt) ──────────────────────────────
const { P, E, hash, tf, lerp, cl } = MG;
const fr   = (lt, fps = 30) => Math.floor(lt * fps);                        // nomor frame diskret → seed
const q    = (lt, fps = 12) => Math.floor(lt * fps) / fps;                  // kuantisasi waktu (stop-motion 8–12 fps)
const dec  = (lt, t0, k = 9) => (lt < t0 ? 0 : Math.exp(-(lt - t0) * k));   // peluruhan eksponensial (hit, shake, RGB split)
const bump = (lt, t0, up, dn) => P(lt, t0, t0 + up) * (1 - P(lt, t0 + up, t0 + up + dn)); // 0→1→0
const rnd  = (i, s = 0) => hash(i * 12.9898 + s * 78.233);                  // acak deterministik
const A    = (id, k, v) => document.getElementById(id).setAttribute(k, v);  // set atribut filter SVG tiap frame
const add  = (cur, f) => (cur && cur !== 'none' ? cur + ' ' : '') + f;      // tambah filter tanpa menimpa blur kit

// Speed ramp: kurva kecepatan piecewise-linear → waktu terpetakan u. Gerakkan objek dengan u, bukan lt.
// pts = [[t, kecepatan], …], titik pertama HARUS t = 0 (1 = normal). Kontinu; diuji numerik.
const remap = (lt, pts) => { let u = 0;
  for (let i = 0; i < pts.length; i++) { const [t0, v0] = pts[i];
    if (lt <= t0) return u + (i ? 0 : lt * v0);
    if (i === pts.length - 1) return u + (lt - t0) * v0;
    const [t1, v1] = pts[i + 1];
    if (lt <= t1) { const d = lt - t0; return u + (2 * v0 + (v1 - v0) * d / (t1 - t0)) / 2 * d; }
    u += (v0 + v1) / 2 * (t1 - t0); }
  return u; };
```

```js
// ── Filter SVG siap pakai (sisipkan sekali; atribut diubah tiap frame lewat A()) ──
document.body.insertAdjacentHTML('beforeend', `<svg width="0" height="0" style="position:absolute"><defs>
<filter id="f-rgb" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
 <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r"/>
 <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g"/>
 <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b"/>
 <feOffset id="f-rgb-r" in="r" dx="0" result="r2"/><feOffset id="f-rgb-b" in="b" dx="0" result="b2"/>
 <feBlend in="r2" in2="g" mode="screen" result="rg"/><feBlend in="rg" in2="b2" mode="screen"/></filter>
<filter id="f-blurx" x="-30%" y="-10%" width="160%" height="120%"><feGaussianBlur id="f-blurx-g" stdDeviation="1 0"/></filter>
<filter id="f-slice" x="-10%" y="-5%" width="120%" height="110%" color-interpolation-filters="sRGB">
 <feTurbulence id="f-slice-t" type="turbulence" baseFrequency="0.0009 0.03" numOctaves="1" seed="1" result="n"/>
 <feColorMatrix in="n" type="matrix" values="1 0 0 0 0  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 1" result="nx"/>
 <feComponentTransfer in="nx" result="nq"><feFuncR type="discrete" tableValues="0.5 0.5 0.5 0.5 0.5 0.5 0.5 0.5 0.92 0.5 0.5 0.5 0.5 0.08 0.5 0.5 0.5 0.5 0.5 0.5"/></feComponentTransfer>
 <feDisplacementMap id="f-slice-d" in="SourceGraphic" in2="nq" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="f-pixel" x="0" y="0" width="100%" height="100%">
 <feFlood id="f-px-f" x="5" y="5" width="2" height="2"/><feComposite id="f-px-c" width="12" height="12"/><feTile result="t"/>
 <feComposite in="SourceGraphic" in2="t" operator="in"/><feMorphology id="f-px-m" operator="dilate" radius="6"/></filter>
<filter id="f-crayon" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
 <feTurbulence id="f-cr-t" type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="1" result="warp"/>
 <feDisplacementMap in="SourceGraphic" in2="warp" scale="9" xChannelSelector="R" yChannelSelector="G" result="wob"/>
 <feTurbulence type="fractalNoise" baseFrequency="0.85 0.55" numOctaves="2" seed="11" result="grain"/>
 <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.2 0 0 0 -0.75" result="holes"/>
 <feComposite in="wob" in2="holes" operator="in"/></filter>
<filter id="f-paper" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
 <feTurbulence type="fractalNoise" baseFrequency="0.9 0.6" numOctaves="4" seed="2" result="n"/>
 <feDiffuseLighting in="n" surfaceScale="1.6" diffuseConstant="1.05" lighting-color="#fff" result="l"><feDistantLight azimuth="235" elevation="62"/></feDiffuseLighting>
 <feComposite in="SourceGraphic" in2="l" operator="arithmetic" k1="0.85" k2="0.25" k3="0" k4="0"/></filter>
<filter id="f-wavy" x="-2%" y="-2%" width="104%" height="104%">
 <feTurbulence id="f-wavy-t" type="fractalNoise" baseFrequency="0.002 0.04" numOctaves="1" seed="1" result="n"/>
 <feDisplacementMap in="SourceGraphic" in2="n" scale="12" xChannelSelector="R" yChannelSelector="B"/></filter>
</defs></svg>`);
```

```js
// ── Contoh pakai di hook frame: RGB split + irisan glitch meluruh 0,2 dtk mulai t0 ──
KIT.style({ frame: (id, lt, d, sec) => {
  const t0 = 1.20, g = lt >= t0 && lt < t0 + .2 ? 1 - (lt - t0) / .2 : 0;     // jendela 6 frame
  if (g) { A('f-slice-t', 'seed', fr(lt, 24) % 89 + 1); A('f-slice-d', 'scale', 120 * g);
           A('f-rgb-r', 'dx', 12 * g); A('f-rgb-b', 'dx', -12 * g);
           sec.style.filter = add(sec.style.filter, 'url(#f-slice) url(#f-rgb)'); }   // filter berantai valid
}});
```

Gotcha: (a) `feDisplacementMap`/`feTurbulence` butuh `seed` **bilangan bulat** → `fr(...) % N + 1`. (b) `z-index:-1` (mis. stabilo di belakang teks) tenggelam di belakang latar induk yang berwarna —
beri `isolation:isolate` pada pembungkus. (c) Jangan pasang `clip-path` dan `drop-shadow` pada elemen yang sama (bayangan terpotong): bayangan di pembungkus, `clip-path` di anak.
(d) Wadah `overflow:hidden` untuk mask/word-swap harus punya lebar & tinggi tetap. (e) SVG `marker` (panah) selalu tampak walau garis belum tergambar → sembunyikan (`visibility:hidden`) sampai mulai.

**Diuji render (Chromium/Playwright, halaman uji sementara di scratch)**: seluruh kode di atas; T2 T6 T7 T8 · X2 X5–X10 · V1 V4–V15 · R3 R6 R8–R10 · C1 C3–C6 C8 C9 · B2–B7 B9 B10; `remap()` diuji numerik (kontinu, kecepatan 0,25×→3,2×→1×). Sisanya turunan sederhana dari pola yang sama.

---

## 2. Transisi (T)

Di engine kami scene berganti dengan **potongan keras** pada batas scene. Transisi = separuh-keluar di akhir scene A + separuh-masuk di awal scene B, ditulis di hook `frame`
(beri `enter:'none'`/`exit:'none'` bila menimpa blur bawaan kit; `d` = durasi scene, `W`,`H` = `MG.width`,`MG.height`).
Untuk menggeser scene, **tambahkan** ke transform kit agar skala/shake bawaan tetap ada: ``sec.style.transform += ` translateX(${x}px)` ``; T3 boleh menimpa.

#### T1 · Flash cut / white flash (strobe)
- **Tampilan:** kilat putih (atau berwarna) penuh di frame potongan, memudar cepat; strobe = beberapa kilat berturut.
- **Cocok:** pergantian scene tepat di ketukan/snare, hook, kejutan. Hindari di nada tenang.
- **Resep:** `o = lt < t0 ? 0 : .95 * (1 - P(lt, t0, t0 + .30)) ** 2` — mulai keras, pudar 8–12 frame [11]. Versi 2 frame: `o = (lt >= t0 && lt < t0 + .067) ? 1 : 0` (CapCut menyarankan 2 frame, bukan 15) [2]. Kit: `vis.flash:true` (`.9 − lt/.35`). Tukar isi scene tepat di frame puncak. Warna: putih; `#fecaca` (alarm); `#fde68a` (hangat). Strobe ≤ 3 kilat/dtk [86].
- **SFX:** `hit` (ringan) atau `impact` · **Sumber:** [2][11][86]

#### T2 · Whip pan (swish pan) ✔
- **Tampilan:** adegan tersapu ke satu sisi dengan blur searah; adegan berikut menyapu masuk dari sisi lawan; potongan tersembunyi di puncak blur.
- **Cocok:** sambungan antar kalimat VO yang mengalir; energik tapi bersih. Arah gerak objek di kedua scene sama [4].
- **Resep:** keluar (`lt` di [d−0,17; d]): `k=E.inExpo(P(lt,d-.17,d))`, `x=-k*1.15*W`, `bx=80*k`. Masuk (`lt` di [0; 0,2]): `k=E.outExpo(P(lt,0,.2))`, `x=(1-k)*1.15*W`, `bx=80*(1-k)`. Blur horizontal murni lewat SVG: `A('f-blurx-g','stdDeviation', bx+' 0')` + `filter:url(#f-blurx)` (CSS `blur()` menyebar ke segala arah). Total ≈ 0,35 dtk (10 frame) [10]; matikan filter saat `bx<1`.
- **SFX:** `whoosh`, mulai 0,05 dtk sebelum potongan · **Sumber:** [4][8][9][10] (whip pan, jump cut, glitch = teknik transisi populer TikTok [8])

#### T3 · Spin (rotasi 3D-ish)
- **Tampilan:** adegan berputar ±90° sambil membesar; adegan berikut berputar masuk. Playful.
- **Cocok:** konten ringan/meme, reveal energik; jangan di nada serius.
- **Resep:** keluar `k=E.in3(P(lt,d-.15,d))`: `r=90*k`°, `s=1+.35*k`, `blur=16*k`, `o=1-.6*k`. Masuk `k=E.outExpo(P(lt,0,.18))`: `r=-90*(1-k)`°, `s=1.35-.35*k`, `blur=16*(1-k)`. Total ≤ 0,3 dtk, sinkron snare [2]. Tulis ``sec.style.transform = `rotate(${r}deg) scale(${s})` `` di hook `frame`.
- **SFX:** `whoosh` / `slidewhistle` · **Sumber:** [1][2]

#### T4 · Zoom-through (crash zoom)
- **Tampilan:** kamera "menembus" sebuah objek/huruf/lubang; adegan berikut sudah ada di dalamnya.
- **Cocok:** reveal besar (masalah → solusi), masuk ke UI/dasbor.
- **Resep:** keluar: `transform-origin` = titik target (mis. pusat lingkaran), `s=1+4.5*E.inExpo(P(lt,d-.28,d))`, `blur=24*P(lt,d-.28,d)`, `o=1-P(lt,d-.1,d)`. Masuk: `s=.55+.45*E.outExpo(P(lt,0,.32))`, `blur=20*(1-P(lt,0,.25))`. Varian "lubang": elemen lingkaran/jendela yang di-scale sampai memenuhi layar, isinya scene berikutnya (`clip-path:circle(r)`).
- **SFX:** `suck` saat masuk, `impact` saat tiba · **Sumber:** [1] (cinematic fade & zoom)

#### T5 · Blur dip (slow-mo + blur)
- **Tampilan:** adegan mengabur dan memudar; berikutnya menajam dari blur. Bawaan kit.
- **Cocok:** nada tenang/premium, momen "suasana berbalik".
- **Resep:** bawaan kit: masuk `blur=(1-outQuint(P(lt,0,.5)))*10`, keluar `blur=in3(P(lt,d-.32,d))*12`, skala ±3–4%. Untuk gaya slow-mo + blur: perpanjang 0,5–0,7 dtk, blur 16–20 px, skala keluar 1→1,06. CapCut memakai blur ±0,3 dtk [2].
- **SFX:** `shimmer` / `sweep` halus · **Sumber:** [1][2]

#### T6 · Glitch transition (irisan + RGB) ✔
- **Tampilan:** 4–8 frame layar terpecah irisan horizontal dan kanal warna bergeser; isi berganti di tengah.
- **Cocok:** teknologi, urgensi, cyber (N03). Satu kali per beberapa scene: glitch untuk menegaskan momen, bukan lem antar-klip.
- **Resep:** `#f-slice` + `#f-rgb` pada `sec` (kode di bagian 1). `seed=fr(lt,24)%89+1`, `scale=120*g`, RGB `dx=±12*g`, `g` meluruh 1→0 dalam 0,13–0,27 dtk (4–8 frame) [2]. Pita tebal: `baseFrequency="0.0009 0.014"`; pita halus: `"0.0009 0.05"`; scale 90–160. Potong isi (hard cut) di frame ke-3. Blok kasar ala datamosh: `baseFrequency="0.012 0.03"` + `discrete` juga di kanal G — hasil bintik-bintik, cukup 2–3 frame. Intensitas RGB CapCut ±40% [2]; di AE seed noise `time*15` [12].
- **SFX:** `glitch` · **Sumber:** [1][2][12]

#### T7 · Pixelate & dither wipe ✔
- **Tampilan:** adegan memecah jadi blok piksel yang membesar lalu pulih di adegan berikut; atau kotak-kotak gelap menutup layar acak (8-bit).
- **Cocok:** retro/arcade (N09), reveal teknologi/redaksi.
- **Resep:** (a) `#f-pixel`: sel `c=Math.round(lerp(2,64,E.in3(P(lt,d-.3,d))))` di akhir scene A; `c=Math.round(lerp(64,2,E.outExpo(P(lt,0,.3))))` di awal B. Set: `A('f-px-f','x',c/2-1)`, `A('f-px-f','y',c/2-1)`, `A('f-px-c','width',c)`, `A('f-px-c','height',c)`, `A('f-px-m','radius',c/2)`. (b) Dither: kanvas 60×34 (16:9) atau 34×60 (9:16), `if (hash(x*12.9898+y*78.233) < progress) fillRect(x,y,1,1)`, `progress=E.io3(P(lt,d-.5,d))`, diperbesar CSS dengan `image-rendering:pixelated`.
- **SFX:** `blip` tiap langkah / `coin` · **Sumber:** [2] (pixelate transition), [51]

#### T8 · Iris / shape wipe (lingkaran, diagonal, blinds, bintang) ✔
- **Tampilan:** lingkaran/bintang membuka-menutup layar; diagonal; kisi-kisi. Klasik TV 90-an.
- **Cocok:** parodi TV jadul (N04), pop/playful, reveal logo.
- **Resep:** penutup warna solid di atas scene: lingkaran `clip-path:circle(${E.io3(k)*Math.hypot(W,H)}px at ${x}px ${y}px)`; diagonal `polygon(0 0, ${a}px 0, ${a-100}px 100%, 0 100%)`; blinds `mask-image:repeating-linear-gradient(90deg,#000 0,#000 ${k*15}px,transparent ${k*15}px,transparent 15px)`; bintang = polygon 10 titik (radius luar:dalam 1:0,4) di-scale. Tutup di 0,35 dtk terakhir scene A, buka (kebalikannya) di 0,35 dtk pertama scene B.
- **SFX:** `slidewhistle` / `pop` · **Sumber:** [53] (gaya iklan 90-an)

#### T9 · Push + stretch (swipe halus)
- **Tampilan:** scene baru mendorong yang lama; elemen melar searah gerak lalu mengencang.
- **Cocok:** bersih/elegan, poster kinetik (N08), dasbor.
- **Resep:** `k=E.outExpo(P(lt,0,.4))`, `x=(1-k)*W*.35`, kecepatan-proksi `v=4*k*(1-k)`, `sx=1+.22*v`, `skewX=-10*v`°; scene keluar `x=-k*W*.35`, `o=1-k`. Overshoot kecil: ganti `E.outExpo` dengan `E.outBack` berskala 0,6.
- **SFX:** `paper` / `whoosh` pendek · **Sumber:** [1] (smooth swipe)

#### T10 · Match cut (jangkar bentuk)
- **Tampilan:** dua adegan berbeda tersambung lewat bentuk/posisi yang sama (lingkaran jam → cincin countdown).
- **Cocok:** transisi naratif cerdas tanpa efek berlebih (N03 S1→S2, N10 peta → dasbor).
- **Resep:** definisikan jangkar `{x,y,size}` yang **identik** di akhir A dan awal B (tanpa fade pada jangkar); isi di sekitarnya berganti lewat blur dip 0,12 dtk; tambahkan denyut `1→1.06→1` (0,15 dtk) tepat di frame potong sebagai "engsel". Kredibel bila bentuk/gerak cocok [4].
- **SFX:** `impact` lembut / `tock` · **Sumber:** [4]

---

## 3. Efek teks (X)

CapCut menyediakan preset teks In/Out/Loop: typewriter, fade, fold, flip-up, bounce, blur, glitch, wave, scale-up, dissolve, trail, flicker, ink print, flutter [25]. Di engine kami semuanya dihitung dari `lt`;
`KIT.splitWords(el)` + `KIT.revealWords(spans,t0,lt,{stagger,dur,dist,blur})` sudah ada untuk reveal per kata.

#### X1 · Auto-caption kata-per-kata (gaya Hormozi/karaoke)
- **Tampilan:** 1–3 kata per baris, HURUF KAPITAL tebal bertepi hitam; kata yang sedang diucapkan menyala kuning dan membesar sedikit.
- **Cocok:** VO cepat, hook, 9:16 (TikTok/Reels).
- **Resep:** font Montserrat 900 / Anton, 80–120 px (lebar 1080), stroke hitam 8–12 px (`-webkit-text-stroke:10px #000; paint-order:stroke fill`), `letter-spacing` 0…−0,02em; putih `#fff`, aksen `#FFD93D` (atau `#39FF14`), satu kata kunci per frasa; kata tampil 200–500 ms [21]. Pop: `tw=MG.wt('s2','kata')`, `k=P(lt,tw,tw+.09)`, `s=1+.12*Math.sin(Math.PI*k)+.05*k` (naik ke 1,12 lalu tahan 1,05; ≤ 105% saat diam). Posisi y ≈ 60–70% tinggi (9:16: 1150–1350 px) — jangan tabrakan dengan subtitle otomatis (y 1480–1600). Satu elemen beranimasi per frame: jangan gabung bounce + warna + skala sekaligus [23].
- **SFX:** `tick` opsional (gain 0,2) · **Sumber:** [21][22][23]

#### X2 · Typewriter + caret ✔
- **Tampilan:** huruf muncul berurutan, kursor berkedip.
- **Cocok:** terminal, CCTV, dialog RPG, anotasi teknis (N03, N09, N10).
- **Resep:** `n=Math.floor((lt-t0)*cps)` dengan cps 24–30 (≈ 33–42 ms/huruf; contoh CSS memakai 50 ms [26]); `text.slice(0,n)+caret`; caret `Math.floor(lt*2.5)%2 ? ' ' : '█'` (on/off tegas, bukan fade); jeda 6–8 frame di tanda baca. Mono: JetBrains Mono / Press Start 2P.
- **SFX:** `key` tiap 2 huruf (gain 0,3) · **Sumber:** [25][26]

#### X3 · Bounce / pop per huruf
- **Tampilan:** huruf melompat masuk berurutan dengan overshoot.
- **Cocok:** ceria/relatable (N05, N09), judul ringan.
- **Resep:** pecah per huruf; huruf i: `k=E.outBack(P(lt,t0+i*.04,t0+i*.04+.35))`, `s=k`, `y=(1-k)*.5em`, `o=P(lt,t0+i*.04,t0+i*.04+.1)`; lebih kenyal: `E.outElastic`. Stagger 35–50 ms. Napas idle: `s*=1+.015*Math.sin(lt*2+i*.6)`. Jangan kombinasikan dengan blur.
- **SFX:** `pop` per 2 huruf · **Sumber:** [24][25]

#### X4 · Scale slam / punch text
- **Tampilan:** teks menghantam layar dari besar ke normal disertai kilat/guncangan.
- **Cocok:** angka/pesan kunci ("3x24 JAM", tanggal, "LEVEL UP!").
- **Resep:** kit `fx:'punch'` (`s 1.7→1`, outExpo 0,25 dtk). Tambahan: `blur 12→0` dalam 0,15 dtk, `letter-spacing .08em→0`, guncang kit `shake:[t]` (14 px, 0,3 dtk), `flash:true`. Setelah mendarat: napas `1→1.02` sepanjang scene. Pesan utama = gerak terbesar, pendukung lebih halus [24].
- **SFX:** `hit` / `slam`; humor: `vineboom` · **Sumber:** [24]

#### X5 · Mask reveal + tracking ✔
- **Tampilan:** baris teks naik dari balik garis potong; jarak huruf menyempit tenang.
- **Cocok:** editorial/premium (N07), judul korporat.
- **Resep:** pembungkus `overflow:hidden; height:1.15em` (ukuran tetap); isi `translateY(110%→0)` dengan `E.outExpo(P(lt,t0+i*.12,t0+i*.12+.9))`, `letter-spacing=(1-k)*.2em`. Garis 1 px di bawahnya `scaleX(E.io3(P(lt,t0+.3,t0+1.1)))` (origin kiri); label kecil `opacity P(lt,t0+.9,t0+1.3)`. Satu gerakan per elemen [68].
- **SFX:** `sweep` sangat halus · **Sumber:** [24][68]

#### X6 · Scramble / decode ✔
- **Tampilan:** huruf acak berganti cepat lalu "terkunci" menjadi kata sebenarnya satu per satu.
- **Cocok:** cyber/hacker, kode insiden, loading (N03 kode BRC-…, N09).
- **Resep:** untuk huruf i sebelum `t0+i*.07`: `CHARSET[Math.floor(hash(i*7.7+fr(lt,20)*3.1)*CHARSET.length)]` (refresh 20 fps); sesudahnya huruf asli. `CHARSET='ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&'`. Hijau/amber + `text-shadow:0 0 12px c`. Variasi redaksi: tampil `█` lalu terungkap.
- **SFX:** `blip`/`tick` tiap 3 huruf · **Sumber:** —

#### X7 · Outline echo stack ✔
- **Tampilan:** teks solid dengan 4–6 salinan outline bergeser diagonal memudar.
- **Cocok:** poster kinetik/Swiss (N08), pernyataan tebal.
- **Resep:** N salinan `-webkit-text-stroke:2px #111; color:transparent`, offset `(k*10,k*10)*E.outExpo(P(lt,t0,t0+.6))`, `opacity=1-k*.15`; salinan utama solid. Putar arah offset tiap ketukan (`cos/sin` sudut = indeks ketukan × 90°).
- **SFX:** `whoosh` pendek · **Sumber:** —

#### X8 · Marquee / ticker ✔
- **Tampilan:** pita teks berjalan tak putus; dua pita bersilang, satu miring.
- **Cocok:** poster (N08), disclaimer parodi (N04), "breaking".
- **Resep:** pita 1 `x=-((lt*180)%period)`, pita 2 `x=((lt*220)%period)-period` (`period` = lebar satu pengulangan teks; ulang teks ≥ 4×); pita miring `rotate(-3deg)`, tinggi 70 px, huruf 900 44 px; kontras tinggi (hitam/kuning, merah/putih). Samakan kecepatan dengan ketukan (px per ketukan). Disclaimer parodi: huruf kecil 18–22 px, 220 px/dtk, nada datar.
- **SFX:** — · **Sumber:** —

#### X9 · Odometer / counter roll ✔
- **Tampilan:** digit menggulung vertikal lalu berhenti bergiliran.
- **Cocok:** angka (72 jam, skor, tanggal) — N05, N08, N10.
- **Resep:** satu kolom per digit; strip 0–9 diulang; `translateY(-(target+10*(1-k))*h)`, `k=E.outExpo(P(lt,i*.08,i*.08+.9))`, pembungkus `overflow:hidden` (lebar/tinggi tetap). Countdown kontinu: `rem=total-elapsed*speed`, digit dari `rem` (kit `countdown`). Split-flap sudah ada di iklan #2.
- **SFX:** `flip` / `tick` tiap digit mendarat · **Sumber:** —

#### X10 · Neon flicker & blink ✔
- **Tampilan:** teks bercahaya berkedip tak stabil lalu stabil; atau kedip on-off ala papan arcade.
- **Cocok:** alarm merah (N03), "INSERT COIN / PRESS START" (N09).
- **Resep:** `text-shadow:0 0 4px #fff, 0 0 12px c, 0 0 28px c, 0 0 56px c2`. Flicker awal 0,3 dtk: `o=hash(fr(lt,30))<.5 ? .25 : 1`; sesudahnya `hash(fr(lt,30)*1.3)<.04 ? .55 : 1`. Blink arcade: `Math.floor(lt*2)%2`. Batasi ≤ 3 kedip/dtk [86].
- **SFX:** `alarm` (N03) / `blip` · **Sumber:** [86]

#### X11 · Teks di belakang objek (kedalaman)
- **Tampilan:** teks raksasa berada di belakang objek utama sehingga tampak menyelip.
- **Cocok:** hero shot (kursi penasihat N07), poster, kartu nama.
- **Resep:** susun z: latar → teks (tinggi huruf 22–30% layar, `opacity .9–1`) → objek ilustrasi (SVG/emoji sendiri) → efek. Paralaks berlawanan: teks `x=camX*.3`, objek `x=camX`, `camX=±24*Math.sin(lt*.6)`. Tanpa keying video karena objek dibuat sendiri (padanan "body tracking + teks" yang sedang tren di CapCut [2]).
- **SFX:** — · **Sumber:** [2]

---

## 4. Efek visual / filter (V)

#### V1 · Zoom punch (beat zoom) ✔
- **Tampilan:** kamera "menabrak" masuk 8–15% tepat di ketukan lalu mengendur.
- **Cocok:** punchline, kata kunci, ketukan kuat, jedag-jedug.
- **Resep:** `k=E.outExpo(P(lt,t0,t0+.11))`, `back=E.out3(P(lt,t0+.11,t0+.5))`, `s=1+.12*k*(1-back)` — naik ke 1,12 dalam 0,11 dtk, kembali ≤ 1,03 dalam 0,4 dtk. Terapkan ke pembungkus konten, bukan latar. Kombinasi: T1 flash 2 frame + V4 shake 8–12 px + V5 RGB split meluruh 0,3 dtk. Zoom lambat (Ken Burns): V2. CapCut: keyframe skala 100→115% dalam 1 dtk untuk zoom sinematik [2].
- **SFX:** `hit` / `boom` · **Sumber:** [2][27]

#### V2 · Slow push-in / drift / paralaks
- **Tampilan:** kamera merangkak maju atau melayang pelan sepanjang scene.
- **Cocok:** semua scene tahan-lama; wajib untuk nuansa premium/arsitektural.
- **Resep:** `s=1+Z*E.io3(lt/d)` dengan Z = 0,04–0,06 (kit `push:.035`); drift `x=14*Math.sin(lt*.5)`, `y=8*Math.cos(lt*.4)`; lapisan paralaks `x_i=camX*(0.2+0.25*i)`. "3D zoom" ala CapCut (foto berkedalaman) = lapisan depan membesar lebih cepat dari latar: `s_i=1+Z*(1+.6*i)*E.io3(lt/d)`, i = kedalaman (0 = paling jauh). Maks 8% per scene agar tidak terasa "zoom video".
- **SFX:** `riser` sangat pelan bila perlu · **Sumber:** [2]

#### V3 · Speed ramp / velocity (time remap)
- **Tampilan:** gerak melambat dramatis lalu melesat, sinkron musik.
- **Cocok:** momen "paling lambat" (N03 S2), reveal, transisi.
- **Resep:** `u=remap(lt,pts)` (bagian 1) menggantikan `lt` untuk semua gerak objek. Preset: **Montage** `[[0,1],[.35,1],[.6,.25],[1.1,.25],[1.3,3.2],[1.6,3.2],[1.9,1]]`; **Hero** `[[0,1],[.3,.3],[.9,.3],[1.1,1]]`; **Bullet** `[[0,1],[.2,.15],[.6,.15],[.7,4],[.9,1]]`. Pendamping: blur searah `bx=clamp((v-1)*6,0,18)` px, skala `1+.04*(v-1)`; jangan lonjakkan bunyi. CapCut: Speed → Curve, rentang 0,1×–10×, preset Montage/Hero/Bullet/Jump Cut/Flash In/Flash Out, opsi "smooth slow-mo" [5][6]; contoh blog: 0,5× selama 0,5 dtk lalu 2× [2].
- **SFX:** `suck` → `riser` → `impact` · **Sumber:** [2][5][6][7]

#### V4 · Camera shake (impact, meluruh) ✔
- **Tampilan:** layar bergetar keras lalu mereda.
- **Cocok:** hit/impact, alarm, punchline.
- **Resep:** `amp=A*dec(lt,t0,9)` (A = 26 px untuk hit besar, 8–12 px halus); dengan `f=fr(lt,30)`: `dx=(hash(f*2.1)-.5)*2*amp`, `dy=(hash(f*3.7+1)-.5)*2*amp`, `rot=(hash(f*5.3+2)-.5)*2*2.2*dec(lt,t0,9)`°; efektif 0,3–0,4 dtk. Kit: `shake:[t]` (14 px, 0,3 dtk). CapCut "Camera Shake": turunkan ke ±30% dan padukan dip kecepatan 0,1× [2]; contoh AE `wiggle(5,10)` [14].
- **SFX:** `impact` / `boom` · **Sumber:** [2][14]

#### V5 · RGB split / chromatic aberration ✔
- **Tampilan:** kanal merah dan biru bergeser berlawanan; tepi berpendar cyan/merah.
- **Cocok:** kejutan, teknologi, glitch; versi halus untuk kesan sinematik.
- **Resep:** SVG `#f-rgb`: `dx=12*dec(lt,t0,8)` px (sumbu x); teks saja: `text-shadow:${d}px 0 rgba(255,0,60,.9), ${-d}px 0 rgba(0,220,255,.9)`; elemen tunggal: `drop-shadow(${d}px 0 0 rgba(255,0,60,.85)) drop-shadow(${-d}px 0 0 rgba(0,220,255,.85))`; sinematik statis: d = 2–3 px + vignette. CapCut: RGB Split turunkan ke ±40%, Chromatic Aberration ±20% [2]; kanal digeser lewat Shift Channels + Screen di AE [13].
- **SFX:** `glitch` · **Sumber:** [2][13]

#### V6 · Glitch slice / datamosh ringan ✔
- **Tampilan:** pita horizontal bergeser, blok pecah.
- **Cocok:** urgensi/cyber; jangan tiap cut.
- **Resep:** `#f-slice` (lihat T6): `seed=fr(lt,24)%89+1`, scale 90–160, 4–8 frame, sisipkan `#f-rgb` ±10 px; tekstur kotak: `#f-pixel` dengan sel 3–6 px selama 2 frame; gabungkan dengan V4. Keluarkan efek di luar jendela.
- **SFX:** `glitch` · **Sumber:** [2][12]

#### V7 · VHS / camcorder ✔
- **Tampilan:** garis pindai, warna meleber, pita "tracking" menyapu, gelombang horizontal, OSD "▶ PLAY".
- **Cocok:** parodi 90-an (N04), nostalgia, flashback.
- **Resep:** (1) scanline `repeating-linear-gradient(0deg,rgba(0,0,0,.22) 0 2px,transparent 2px 4px)`, geser 2 px pada frame ganjil; (2) chroma bleed `text-shadow ±4px rgba(255,0,70,.7)/rgba(0,220,255,.7)`, blur 0,6 px, saturasi 0,85; (3) `#f-wavy` (seed `fr(lt,15)%40+1`); (4) pita 26 px `linear-gradient(0deg,transparent,rgba(255,255,255,.35),transparent)` `mix-blend-mode:screen`, `y=(lt*150)%(H+50)-30`; (5) jitter x `(hash(fr)-.5)*5`; (6) strip noise 12 px di bawah; (7) OSD mono kuning `▶ PLAY 00:00:07`. Transisi VHS: 6 frame glitch + pita besar.
- **SFX:** `tick` / `glitch` · **Sumber:** [16][47]

#### V8 · Film burn / light leak ✔
- **Tampilan:** kilatan cahaya hangat oranye-merah menyapu layar, inti kuning-putih.
- **Cocok:** transisi hangat, momen emosional, nostalgia; versi sangat halus (alpha ≤ 0,22) untuk premium.
- **Resep:** overlay `mix-blend-mode:screen`; `env=Math.sin(Math.PI*P(lt,t0,t0+dur))`, dur 0,5–1,0 dtk (puncak tepat di frame potong); `radial-gradient(circle at ${X}% 30%, rgba(255,255,240,env) 0, rgba(255,190,90,.9*env) 12%, rgba(255,90,20,.8*env) 32%, rgba(190,20,40,.5*env) 55%, transparent 75%)`, X: 30→70% selama dur; lapisan kedua di X+30%, y 85%. Dingin/futuristik: cyan–ungu. Fade masuk-keluar wajib; mode Screen/Overlay/Soft Light, opasitas ditahan [15]; warm untuk golden-hour, cool untuk malam/futuristik [15].
- **SFX:** `shimmer` / `whoosh` lembut · **Sumber:** [15]

#### V9 · Halftone / pop-art dots ✔
- **Tampilan:** titik-titik berukuran bervariasi ala cetakan koran/komik.
- **Cocok:** poster, komik, tekstur latar (N08), penekanan.
- **Resep:** dua layer: `radial-gradient(circle at center,#000 0,#000 0,#fff 72%) 0 0/16px 16px` + tone ramp `radial-gradient(circle at ${X}% 45%,#000 0,#fff 75%)`; `background-blend-mode:screen; filter:contrast(24); mix-blend-mode:multiply` di atas kertas berwarna; sel 12–20 px; geser `X` pelan (titik "bernapas"). Titik konstan: `radial-gradient(circle,#e11d48 0 2.4px,transparent 2.8px) 0 0/10px 10px`.
- **SFX:** — · **Sumber:** [18]

#### V10 · Speed lines / starburst ✔
- **Tampilan:** garis radial manga; badge bintang segi-banyak.
- **Cocok:** aksi/pengumuman ("BARU!"), N04, format meme.
- **Resep:** SVG N=64 poligon tipis: sudut `a=(i+hash*.8)*2π/N`, lebar sudut 0,006–0,026 rad, `r0=84..150+hash*60` (tengah kosong), `r1=420+`; lewati 30% acak; regenerasi 12 fps (`seed=Math.floor(lt*12)`, "on 2s"); putih di latar gelap/hitam di kertas; opasitas 0,55–0,95; masuk: `r0` menyusut 420→90 dalam 0,15 dtk. Starburst: poligon 16–24 titik (radius luar:dalam 1:0,82), `rot=lt*20`°, teks miring −8°. CapCut: efek Energy pada tab Comics [19].
- **SFX:** `whoosh` + `impact` · **Sumber:** [19]

#### V11 · Freeze frame + outline (stiker potong) ✔
- **Tampilan:** objek "berhenti", diberi kontur putih tebal seperti stiker, lalu diberi nama/teks.
- **Cocok:** memperkenalkan elemen/karakter, meme reaksi.
- **Resep:** bekukan gerak objek di `t0` (pakai `lt_eff=Math.min(lt,t0)`); kontur putih 5–6 px lewat 8× `drop-shadow(±o px 0 0 #fff)` (0°,45°,…,315°) + `drop-shadow(0 10px 8px rgba(0,0,0,.35))`; rotasi −4…−6°; masuk `E.outElastic` 0,4 dtk; caption X4. CapCut: freeze frame + outline/cutout [17]. Kit `stickers:[{e,at,sfx}]` sudah memberi pop elastis.
- **SFX:** `stamp` / `pop` · **Sumber:** [17]

#### V12 · CRT scanline + glow ✔
- **Tampilan:** garis pindai halus, cahaya fosfor, vignette, kedip halus.
- **Cocok:** monitor/terminal (N03), arcade (N09).
- **Resep:** overlay `repeating-linear-gradient(0deg,rgba(0,0,0,.3) 0 2px,transparent 2px 4px)` (N09 ringan: alpha .18) + `radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,.7) 100%)`; teks `text-shadow:0 0 8px c,0 0 2px light`; flicker `opacity=.96+.04*hash(fr(lt,30))`; pita pindai bergerak 100 px alpha 0,1 naik sekali per 10 dtk [26]; chromatic fringe halus (`text-shadow ±0.4–2.8px`) [26].
- **SFX:** — · **Sumber:** [26]

#### V13 · CCTV HUD / night vision ✔
- **Tampilan:** rekaman kamera pengawas: label kamera, ● REC berkedip, timecode berjalan, bracket deteksi.
- **Cocok:** insiden/pengawasan (N03).
- **Resep:** label kiri atas `CAM 03 · LOBI` (mono 22 px, `#d1fadf`); `● REC` kanan atas berkedip `Math.floor(lt*1.6)%2`; timecode `HH:MM:SS:FF` kanan bawah (`FF=Math.floor(lt*30)%30`); kotak deteksi 2 px `#86efac` yang "mengunci" (`scale 1.3→1`, 0,2 dtk); scanline 1 px/3 px alpha 0,25; vignette 45%→75%; grain kuat; night-vision opsional `filter:grayscale(1) sepia(1) hue-rotate(60deg) saturate(2.2)`; "tracking glitch" (V6) sekali per ±3 dtk. Elemen HUD mengikuti paket overlay CCTV komersial (label CAM, REC berkedip, timestamp, static halus) [52].
- **SFX:** `tick` per detik; `alarm` di momen kritis · **Sumber:** [52]

#### V14 · Sparkle / lens glint ✔
- **Tampilan:** bintang 4 sudut berkilau + garis anamorfik horizontal singkat.
- **Cocok:** lencana/sertifikat, logo reveal, "baru" (N04, N07).
- **Resep:** SVG bintang `M0 -z Q0 0 z 0 Q0 0 0 z Q0 0 -z 0 Q0 0 0 -z Z`, `z=size*Math.sin(Math.PI*P(lt,t0,t0+.45))`, putar `45*P°`; garis `rect` tipis lebar `220*sin(πk)` px, `screen`; 2–3 kilau bergantian selisih 0,12–0,18 dtk. Lambat & jarang = mewah.
- **SFX:** `ding` / `shimmer` · **Sumber:** —

#### V15 · Clone / echo trail ✔
- **Tampilan:** beberapa salinan objek berjeda waktu mengekor gerak utama (afterimage).
- **Cocok:** dash sprite (N09), penegasan gerak, "banyak versi diri".
- **Resep:** untuk k=1..4: salinan elemen di posisi `path(lt-k*.07)`, `opacity=.55-k*.1`, `scale=1-k*.06`; salinan utama di `path(lt)`. Jalur `x=40+340*E.io3(P(t,0,1.2))`. Padanan CapCut: masking beberapa rekaman jadi "banyak dirimu" [20].
- **SFX:** `whoosh` pendek · **Sumber:** [20]

---

## 5. Ritme & edit meme (R)

**Peta tren meme/format Indonesia (pelajari pola & ritmenya, JANGAN pakai asetnya):**

| Format | Pola & ritme | Dibuat ulang lewat |
|---|---|---|
| Jedag-jedug | potongan pendek di ketukan, flash/zoom/shake/split [27] | R1 |
| Ekspektasi vs Realita | dua panel, reveal + bunyi "scratch" [35] | R3 |
| POV / Nobody | teks pembuka + situasi relatable + punchline [31] | R5 |
| Freeze + lingkaran merah + caption | reaksi, zoom lambat, "boom" [33][34] | R2 |
| Plot twist / record scratch | musik berhenti, freeze, narator menyela (praktik umum komedi) | R7 |
| Absurd / brainrot / meme anomali | video looping singkat, audio aneh, ekspresi berlebihan tanpa konteks; karakter AI hibrida makhluk+benda dengan narasi AI (mis. yang viral 2025) [28][29][30] | R11 (hemat) |
| Quiet luxury (kontra-tren) | tenang, netral, minimalis [29] | B10 |

Angka ritme di bawah adalah kebiasaan editor/perkiraan kami, bukan standar.

#### R1 · Jedag-jedug (beat-cut montage)
- **Tampilan:** potongan pendek sinkron beat drop; tiap ketukan disertai zoom/flash/shake/split.
- **Cocok:** hook 3 dtk pertama, montase fitur cepat. Maks ±8 ketukan berturut lalu istirahat 1 bar.
- **Resep:** `beat=60/bpm` (128–150 bpm → 0,47–0,40 dtk); `hits=[t0+n*beat]`; tiap hit: V1 zoom punch (0,11 dtk) + T1 flash 2 frame + shake 8–12 px; konten berganti tiap ketukan (kata besar/ikon); selipkan split 2×2 sebagai pengisi. Jangan menumpuk lebih dari satu transisi per klip [2]. Musik sintetis `drums:'full'`, bpm 128–140.
- **SFX:** `hit` di tiap ketukan kuat · **Sumber:** [27][2]

#### R2 · Freeze + lingkaran merah + caption Impact-style
- **Tampilan:** momen berhenti, lingkaran merah digambar di detail konyol/kunci, teks putih bertepi hitam kapital, "boom".
- **Cocok:** menyorot absurditas ("RoPA_final_REVISI(2).xlsx", email menumpuk).
- **Resep:** bekukan (`lt_eff`); `<circle>` SVG `stroke:#ef4444; stroke-width:10; pathLength=1; stroke-dasharray=1; stroke-dashoffset=1-E.out3(P(lt,t0,t0+.25))` (rotasi −90° di sekitar pusat; untuk oval pakai `ellipse` tanpa rotasi), lalu goyang ±2 px 8 fps; zoom pelan 1→1,08 selama 1,2 dtk; caption Anton/Bebas Neue kapital, stroke hitam 6–10 px (`paint-order:stroke fill`), atas/bawah. Pengganti Impact = Anton (OFL).
- **SFX:** `vineboom` di t0; `crickets` bila canggung · **Sumber:** [32][33][34]

#### R3 · Ekspektasi vs Realita (split screen) ✔
- **Tampilan:** layar terbelah dua; kiri ideal, kanan kacau; reveal kanan dengan "scratch".
- **Cocok:** sebelum/sesudah, perbandingan (N04 spreadsheet vs register).
- **Resep:** `clip-path:inset(0 50% 0 0)` dan `inset(0 0 0 50%)`, garis tengah 4 px hitam; panel kanan masuk `x=(1-E.outBack(P(lt,t0,t0+.4)))*8%`; label "EKSPEKTASI"/"REALITA" (X4 kecil); shake 12 px + `scratch` saat reveal. Kit: `meme variant:'expect'`. CapCut: split screen + mirror flip untuk format ini [2]. Varian 2×2 untuk montase.
- **SFX:** `scratch` · **Sumber:** [2][35]

#### R4 · Drake-style ❌/✅ (dibuat ulang orisinal)
- **Tampilan:** dua baris — yang ditolak (❌) dan yang dipilih (✅).
- **Cocok:** cara lama vs baru (N05: balas WhatsApp pribadi ❌ / formulir DSR + tenggat otomatis ✅).
- **Resep:** kit `meme variant:'drake'`. Tanpa foto: dua panel pastel + ikon/ilustrasi sendiri. Baris 1 masuk di kata pertama, ❌ `E.outElastic` 0,3 dtk; baris 2 masuk +0,6 dtk dengan ✅ hijau; baris 1 meredup `opacity .5`. Jangan menulis nama pihak lain di layar.
- **SFX:** `buzzer` → `correct` · **Sumber:** [80] (alasan tidak memakai foto asli)

#### R5 · POV / Nobody
- **Tampilan:** "POV:" kecil + kalimat besar; atau "Nobody: / Me:" dua baris.
- **Cocok:** pembuka relatable (POV termasuk tren konten TikTok 2026 [31]).
- **Resep:** kit `meme variant:'pov'|'nobody'`. Ritme: kata muncul stagger 60 ms; jeda canggung 0,6 dtk; punchline dengan V1. Font sans tebal.
- **SFX:** `crickets` (jeda) → `hit` (punchline) · **Sumber:** [31]

#### R6 · Reaction punch (zoom + stiker emoji + boom) ✔
- **Tampilan:** zoom cepat ke ekspresi kaget/stiker emoji melompat + bunyi keras.
- **Cocok:** punchline ("data bocor!"); maks 1–2 kali per video.
- **Resep:** stiker (V11) `scale 2.4→1` outExpo 0,25 dtk + goyang `sin(lt*2)*5°`; kamera V1 (1→1,12 dalam 0,1 dtk); kit `stickers:[{e:'😱',at,sfx:'vineboom',gain:.7}]`. Zoom + freeze + teks adalah paket komedi klasik [32].
- **SFX:** `vineboom` / `airhorn` · **Sumber:** [32][34]

#### R7 · Record scratch / plot twist
- **Tampilan:** musik berhenti mendadak, gambar membeku, narator menyela.
- **Cocok:** pembalikan ("Tapi…"), N03 S3, N04 S1.
- **Resep:** `scratch` di t0; bekukan objek 0,6–0,8 dtk (`lt_eff`); musik turun ke 0 (duck) 0,4 dtk lalu kembali (atur di `music.js`); teks kecil di tengah (X3).
- **SFX:** `scratch` · **Sumber:** — (praktik umum komedi)

#### R8 · Chat bubble skit ✔
- **Tampilan:** percakapan gelembung berganti, titik mengetik.
- **Cocok:** keluhan pelanggan (N05), narasi relatable.
- **Resep:** bubble `s=.6+.4*E.outBack(P(lt,t0,t0+.35))`, `transform-origin` di ekor; jeda antar pesan 0,5 dtk; titik mengetik 3 bulatan 10 px: `y=-5*Math.max(0,Math.sin(lt*6-i*.7))`, `opacity=.5+.5*Math.max(0,Math.sin(lt*6-i*.7))`; pengirim kanan aksen pastel (`#ec4899`), penerima kiri putih. Tanpa logo/UI aplikasi nyata.
- **SFX:** `pop` per bubble; `key` saat mengetik · **Sumber:** [38]

#### R9 · Dialog error jadul ✔
- **Tampilan:** jendela error ala OS 90-an dengan tombol OK, menumpuk.
- **Cocok:** humor "file ganda" (N04), "Ups".
- **Resep:** kotak `#c0c0c0`, bevel `border:2px solid; border-color:#fff #404040 #404040 #fff`, title bar `linear-gradient(90deg,#000080,#1084d0)`, ikon ✖ merah, tombol [OK]; muncul `s .85→1` outBack 0,25 dtk; gandakan bertingkat (offset 34 px, jeda 0,18 dtk) sampai menutup layar. Orisinal: tanpa logo/tipe OS nyata.
- **SFX:** `buzzer` per jendela · **Sumber:** — (estetika jadul, dibuat orisinal)

#### R10 · Confetti / emoji burst ✔
- **Tampilan:** partikel warna/emoji melontar dan jatuh.
- **Cocok:** keberhasilan, CTA (N05, N09).
- **Resep:** 24–48 partikel; `v0=380..700` px/dtk, sudut `-π/2+(hash(i)-.5)*1.6`; `t=lt-t0`; `x=x0+vx*t`, `y=y0+vy*t+.5*900*t²`, `rot=360*hash(i+90)*t*2`, `o=1-P(t,.9,1.4)`; bentuk 8×14 px, palet 4–5 warna; deterministik via `hash`.
- **SFX:** `tada` / `coin` · **Sumber:** —

#### R11 · Loop absurd (brainrot) — hemat
- **Tampilan:** klip 0,6–1 dtk diulang cepat dengan zoom dan warna berubah, teks besar repetitif.
- **Cocok:** hanya lelucon sela di konten meme (N05); tidak untuk audiens formal.
- **Resep:** `loopT=.8`, `n=Math.floor(lt/loopT)`, `p=(lt%loopT)/loopT`, `s=1+.08*E.outExpo(P(p,0,.2))`, `hue=n*40`° (`hue-rotate`), teks yang sama ×3 membesar 1,0→1,15→1,3. **Jangan** memakai karakter/audio viral (hak cipta) — buat maskot orisinal. Ciri format: loop singkat, audio aneh, ekspresi berlebihan tanpa konteks [29].
- **SFX:** `boing` / `pop` berulang · **Sumber:** [28][29][30]

---

## 6. Gaya animasi / craft (C)

Paper animation (mis. paperanimation.com — kini dialihkan ke paperanimator.com [40]) menawarkan preset gerak *paper boil, stop motion, float, bounce, fold-out* dan kontrol tepi (gunting bersih vs sobek), ketebalan tepi, kekasaran tepi, grain, tekstur kertas koran/kraft, kedalaman & arah bayangan [39][40]. Tren 2026: hand-drawn (garis longgar, outline tak rata), tekstur analog (grain, serat kertas), torn paper yang lebih rapi/terkendali dengan frame rate sedikit diturunkan, tata letak modular [46].

#### C1 · Paper cut-out (sobek + bayangan + tape) ✔
- **Tampilan:** kartu/ikon dari kertas berwarna dengan tepi robek tak beraturan, bayangan lembut, selotip.
- **Cocok:** hangat/handmade (N06), tema anak, kartu formulir.
- **Resep:** pembungkus `filter:drop-shadow(0 10px 10px rgba(0,0,0,.4))`; anak `clip-path:polygon(...)`: tepi bawah `y=H-6-hash(i*1.7+seed)*16`, tepi atas `hash(i*2.9+seed2)*5`, N = 34–40 titik, sisi samping ±3 px; warna kertas krem `#fbf3df` atau pastel jenuh-rendah; rotasi `-2°±.6°` (`Math.sin(lt*1.2)`); tape `rgba(255,235,150,.72)` 110×34 px rotate −4° + `box-shadow:0 1px 3px rgba(0,0,0,.25)`; masuk `translateY(40px→0)` `E.outExpo` 0,5 dtk. Tepi robek, tape, tekstur kertas adalah kunci "collage" [45][44].
- **SFX:** `paper` · **Sumber:** [39][44][45]

#### C2 · Stop-motion "on 3s" + paper boil
- **Tampilan:** gerak patah-patah (8–12 fps) dengan getar kecil tiap langkah; tepi kertas "menggelegak".
- **Cocok:** N06; segala gaya handmade.
- **Resep:** `qt=q(lt,8)` (12 fps = lebih halus); evaluasi posisi/rotasi objek pada `qt`, bukan `lt`; jitter per langkah `dx=(hash(step*3.1)-.5)*4`, `dy=(hash(step*5.7)-.5)*4`, `rot=(hash(step*7.3)-.5)*2.4`°; polygon tepi kertas di-seed `step` (regen 8 fps → *paper boil*) sementara tekstur kertas seed tetap; campur kadensi: objek utama 8 fps, latar/kamera 24–30 fps agar terbaca. Rentang stop-motion 8–12 fps, 10 fps umum [42][43]; "wiggle paths pada frame rate rendah" [41].
- **SFX:** `tick` halus per langkah (opsional) · **Sumber:** [41][42][43][46]

#### C3 · Tekstur kertas serat ✔
- **Tampilan:** permukaan kertas dengan serat halus tertimpa cahaya miring.
- **Cocok:** kartu/latar semua gaya craft; menghilangkan kesan "digital datar".
- **Resep:** `filter:url(#f-paper)` pada kartu/latar (bagian 1); tambahkan grain kit (opacity 0,06) dan lipatan `linear-gradient` tipis `mix-blend-mode:multiply`. Analog texture: grain, serat kertas, debu, artefak cahaya lembut [46][47].
- **SFX:** — · **Sumber:** [46][47]

#### C4 · Krayon / pastel + line boil ✔
- **Tampilan:** isi warna berbintik seperti krayon, tepi bergoyang; garis tangan bergetar tiap beberapa frame.
- **Cocok:** ikon anak-anak, badge, bintang (N06).
- **Resep:** `filter:url(#f-crayon)` pada `<g>`; boil: `A('f-cr-t','seed', fr(lt,8)%50+1)` (8 fps); goyangan tepi `scale=9` (krayon), 3–6 untuk garis tipis, ±20 untuk gaya doodle; bintik: `alpha=3.2*R-0.75` dari noise 0,85/0,55 seed tetap. Referensi teknik: `feTurbulence baseFrequency 0.02, numOctaves 2` + `feDisplacementMap scale 20`, diperbarui tiap 100 ms dengan 4 offset berputar [48]. Palet krayon: `#f97316 #2563eb #16a34a #facc15 #ec4899` di atas krem `#f5efe0`.
- **SFX:** `pop` lembut · **Sumber:** [48][46]

#### C5 · Draw-on (garis tergambar) ✔
- **Tampilan:** garis menggambar dirinya dari awal ke akhir.
- **Cocok:** lini masa, alur, denah, panah tulisan tangan (N06, N10, N07 versi garis tipis).
- **Resep:** SVG `pathLength="1"`, `stroke-dasharray="1"`, `stroke-dashoffset=1-E.io3(P(lt,t0,t0+dur))` (dur 0,6–1,2 dtk), `stroke-linecap:round`, tebal 8–16 px untuk krayon (+ C4) atau 2–3 px untuk garis tipis; titik penanda bergerak `path.getPointAtLength(L*k)`. Teknik dasar dash [49].
- **SFX:** `sweep` halus / `tick` · **Sumber:** [49]

#### C6 · Scrapbook collage (stamp-in, polaroid, ransom-note) ✔
- **Tampilan:** foto polaroid, tape, stiker, dan judul huruf-tempel tumpang tindih; jatuh ke tempat dengan "stamp".
- **Cocok:** N06 (formulir persetujuan), tema kenangan/handmade.
- **Resep:** polaroid putih padding 12 px (bawah 44 px), rotasi ±3–5°; ransom-note: tiap huruf font/warna/ukuran/rotasi dari `hash(i)` (rot ±6°, ukuran 0,9–1,15×); stamp-in: `s=1.18→1`, `y=-24→0`, `E.outExpo` 0,12 dtk, bayangan mengecil 24→8 px; kadensi 12 fps (`q(lt,12)`), stagger 0,06–0,15 dtk; 5–7 elemen per scene. Estetika: tepi robek, tape transparan, tekstur kertas, kekacauan yang terlihat disengaja [45][54].
- **SFX:** `stamp` / `paper` · **Sumber:** [45][54]

#### C7 · Paper parallax layers + cut-out puppet
- **Tampilan:** 3–5 lapis kertas berbayangan bergeser paralaks; tokoh "wayang kertas" bergerak di sendi.
- **Cocok:** latar N06, maskot sederhana.
- **Resep:** lapis i: `x_i=camX*(0.2+0.25*i)` dengan `camX=30*Math.sin(q(lt,12)*.5)`, `drop-shadow(0 4px 6px rgba(0,0,0,.3))` bertingkat, tepi robek tiap lapis; puppet: `transform-origin` di sendi, `rot=A*Math.sin(2π*f*q(lt,8))` (A 8–14°, f 0,8–1,4 Hz). "Layered, stacked, modular" adalah ciri paper animation [44].
- **SFX:** `paper` · **Sumber:** [44]

#### C8 · Pixel art 8-bit + UI RPG ✔
- **Tampilan:** sprite piksel bergerak patah, kotak dialog RPG, bar HP/XP, teks arcade.
- **Cocok:** N09; gim/edukasi ringan.
- **Resep:** sprite dari matriks string (`'..XX..'`) → kanvas 16×16 (1 px/sel) → skala CSS bilangan bulat ×8–12 dengan `image-rendering:pixelated`; palet 4–8 warna; animasi `Math.floor(lt*6)%n` (6 fps, 2–4 frame); kamera snap ke grid (`Math.round(x/8)*8`). Dialog RPG: `background:#1e3a8a; border:4px solid #fff; box-shadow:0 0 0 4px #000, inset 0 0 0 4px #000`, teks Press Start 2P 16–28 px typewriter 30 cps + ▼ berkedip 2 Hz; XP bar 10 blok 14×18 px; "INSERT COIN/PRESS START" kedip (X10). Font retro: Press Start 2P, VT323, Silkscreen (OFL) [51].
- **SFX:** `blip`, `coin`, `levelup` · **Sumber:** [51]

#### C9 · Blueprint / gambar teknik ✔
- **Tampilan:** garis putih-biru pucat di atas biru tua bergrid; garis dimensi berpanah, label mono.
- **Cocok:** arsitektural/sistematis (N10), struktur grup.
- **Resep:** latar `#0b3a8c`; grid minor 24 px alpha 0,13 + mayor 120 px alpha 0,25 (`<pattern>` SVG); garis `#e0f2fe` 2,4 px draw-on (C5), urutan: kontur 1,2 dtk → detail 0,8 dtk → garis dimensi 0,5 dtk → label 0,2 dtk; panah `marker` 8 px, label `Courier New`/JetBrains Mono 14 px (`24.000`); title block pojok kanan bawah ("PROYEK · REV A · SKALA 1:1"); marker `visibility:hidden` sampai garisnya mulai. Blueprint tradisional: garis putih di biru tua; tiap elemen ber-dimensi/koordinat [50].
- **SFX:** `tick` per label · **Sumber:** [50]

---

## 7. Gaya B2B elegan (B)

Peta gaya motion SaaS: flat 2D, thin lines, 2D UI animation, kinetic typography, hybrid [55]; tren 2026: kinetic typography, gradien mengalir, garis tipis, minimalisme, morphing, 2D+3D [56]; kaca translusen sebagai pemisah ruang [46][57]; isometrik untuk sistem/proses [62][63].

#### B1 · Kinetic typography SaaS
- **Tampilan:** kata muncul mengikuti VO; kata kunci berpindah/berganti (word swap); hirarki gerak jelas.
- **Cocok:** hampir semua iklan Nexus; pesan padat.
- **Resep:** pesan utama = scale-pop 0→100% `E.outBack` 0,35 dtk; pendukung = slide+fade 0,4 dtk; legal = fade 0,3 dtk [24]. Kata demi kata: `KIT.revealWords(spans,t0,lt,{stagger:.07,dur:.6,dist:.5,blur:8})`. Word swap: kata lama naik keluar (`y 0→-0.6em`, `o 1→0`), kata baru naik masuk (`y +0.6em→0`) 0,35 dtk dalam wadah `overflow:hidden` berukuran tetap. Satu kata beraksen warna; ≥ 0,5 dtk terbaca setelah berhenti; ≥ 30% ruang kosong.
- **SFX:** `tick`/`pop` halus · **Sumber:** [24][55][56]

#### B2 · Glass / Liquid-glass card ✔
- **Tampilan:** kartu kaca buram dengan tepi terang dan sorot dalam, di atas gradien berwarna.
- **Cocok:** dasbor, kartu fitur, UI melayang.
- **Resep:** `background:linear-gradient(135deg,rgba(255,255,255,.22),rgba(255,255,255,.06)); backdrop-filter:blur(22px) saturate(1.5); border:1px solid rgba(255,255,255,.28); border-radius:24px; box-shadow:0 20px 50px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.4)`. Blur 8–24 px (≥ 20 px menurunkan keterbacaan) [58][59]; butuh latar berwarna kuat di belakang (blob gradien); jangan menganimasikan `backdrop-filter` (mahal) — animasikan posisi/opasitas saja; sorot specular = B5. "Liquid Glass" Apple membiaskan latar (bukan hanya blur): tiru dengan tepi terang 2 px, sedikit skala 1,02 saat "terangkat", dan gradien sorot yang bergerak lambat [60][61].
- **SFX:** `shimmer` · **Sumber:** [58][59][60][61]

#### B3 · Isometrik (lapisan terbuka) ✔
- **Tampilan:** blok/kartu berlapis dalam proyeksi isometrik, lapisan terpisah naik.
- **Cocok:** arsitektur sistem, anak usaha/silo (N10), alur data.
- **Resep:** pembungkus `perspective:1400px`; kontainer `transform-style:preserve-3d; transform:rotateX(58deg) rotateZ(-45deg)` (isometrik sejati `rotateX(54.7356deg)`; 2:1 gaya piksel `rotateX(60deg)`); lapisan i `translateZ(${i*sep}px)`, `sep=46*E.outExpo(P(lt,0,.6))`; warna makin terang ke atas, tepi 2 px terang; garis penghubung putus-putus mengalir `stroke-dashoffset=-lt*60`. Sudut 30° dan grid isometrik menjaga konsistensi [62][63].
- **SFX:** `tick` / `whoosh` pendek · **Sumber:** [62][63]

#### B4 · Bento grid stagger ✔
- **Tampilan:** kartu-kartu berukuran beragam menyusun grid, muncul berurutan.
- **Cocok:** ringkasan modul (RoPA, DPIA, DSR, Audit, Insiden, Vendor), dasbor.
- **Resep:** tile radius 18–24 px, ukuran bervariasi (2×1, 1×1, 2×2), satu tile "hero" beraksen; `s=.75+.25*E.outBack(P(lt,i*.06,i*.06+.45))`, `o=P(lt,i*.06,i*.06+.2)`; idle `y=±3*Math.sin(lt+i)`. Bento grid termasuk tren web 2026 [70].
- **SFX:** `pop` per tile (gain 0,3) · **Sumber:** [70]

#### B5 · Kartu 3D tilt + specular sweep ✔
- **Tampilan:** kartu UI miring 3D yang bernapas pelan; kilau menyapu permukaan.
- **Cocok:** dasbor Nexus, laporan → dasbor (N07 S5), N10.
- **Resep:** induk `perspective:900px`; `rotateX(${8+3*Math.sin(lt*1.5)}deg) rotateY(${-14+5*Math.cos(lt*1.2)}deg)` (`MG.tf` punya `rx`,`ry`); bayangan `0 30px 60px rgba(0,0,0,.45)`; sweep: pita 90 px `linear-gradient(90deg,transparent,rgba(255,255,255,.45),transparent)` `skewX(-20deg)`, `left=-100+520*P(lt%2.2,.3,1.2)`. Transformasi laporan→dasbor: `rotateY` 0→90° kartu laporan, lalu −90°→0 kartu dasbor (0,5 dtk total).
- **SFX:** `shimmer` · **Sumber:** —

#### B6 · Demo produk: kursor + ripple klik + auto-zoom ✔
- **Tampilan:** kursor bergerak halus ke tombol, klik beriak, kamera zoom otomatis ke area klik.
- **Cocok:** menunjukkan alur (wizard RoPA, formulir DSR, klik "isi dengan AI").
- **Resep:** jalur kursor `E.io3` 0,8–1,0 dtk dengan busur `-Math.sin(πk)*40` px; klik: tombol `scale 1-.06*sin(π*P(lt,tc-.05,tc+.15))`; ripple: lingkaran 20 px border 3 px `scale 1→6`, `opacity 1-k` selama 0,55 dtk; auto-zoom: `scale 1→1.4` `E.io3` 0,7 dtk dengan `transform-origin` di titik klik, kembali setelah 1,0–1,4 dtk. Efek ini standar perekam demo modern (auto-zoom mengikuti klik, ripple, gerak kursor dihaluskan pegas) [64][65]. UI dibuat sendiri, tanpa tangkapan layar produk lain.
- **SFX:** `tick` (klik) · **Sumber:** [64][65]

#### B7 · Garis tipis (line icon draw + pulse) ✔
- **Tampilan:** ikon/diagram garis 2–3 px satu warna; garis menggambar diri, titik denyut menyusuri jalur.
- **Cocok:** enterprise/teknis, alur langkah (N07 empat langkah), diagram sistem.
- **Resep:** stroke 2–3 px `#e0f2fe`, `pathLength=1` draw-on 0,6 dtk per ikon (stagger 0,12 dtk), sesudahnya fill aksen alpha 0,12 (fade 0,3 dtk); titik denyut `getPointAtLength(L*k)` (7 px); ikon dari `KIT.icon(nama,size,stroke)`. "Thin lines": garis halus sebagai penuntun arah [56][55].
- **SFX:** `tick` · **Sumber:** [55][56]

#### B8 · Latar aurora gradient + grain
- **Tampilan:** gradien warna organik bergerak sangat pelan dengan butiran halus.
- **Cocok:** latar semua scene B2B; menggantikan latar datar.
- **Resep:** di `KIT.style({bg})`: 3–4 blob radial `globalCompositeOperation='lighter'`, orbit `x=cx+A*Math.sin(t*f+ph)` (periode 12–20 dtk), warna brand `#2563eb #06b6d4 #7c3aed` alpha 0,35–0,55; grain kit (480×270, opacity 0,06) + vignette; ganti palet per scene untuk membedakan nada. Gradien mengalir = tren 2026 [56]; tekstur/grain memberi bobot [46].
- **SFX:** — · **Sumber:** [46][56]

#### B9 · Swiss grid kinetic (poster) ✔
- **Tampilan:** grid ketat, tipografi sans tebal asimetris, warna terbatas, gerak geometris tegas.
- **Cocok:** N08; pesan tegas, angka besar.
- **Resep:** grid 12 kolom, margin 80 px, gutter 24 px; Inter Tight/Archivo 900 kapital rata kiri, kontras ukuran ekstrem (hero 320–480 px vs label 20 px); palet 3 warna `#e30613 #0a0a0a #f4f4f0`; elemen geometris (lingkaran, bar, garis 4–14 px); gerak linear/`E.io3` 0,35–0,45 dtk menyusuri sumbu grid (`translateX(-120px→0)` outExpo), bar tumbuh `scaleY/scaleX`, hard-cut di ketukan; tanpa bayangan/gradasi. Prinsip Swiss: grid, sans-serif, asimetri, minimalis [66][67].
- **SFX:** `slam` / `tick` · **Sumber:** [66][67]

#### B10 · Editorial premium (serif + emas) ✔
- **Tampilan:** serif elegan, label kapital renggang, garis emas 1 px, ruang kosong lega, gerak sangat tenang.
- **Cocok:** N07; kredibel, mewah, "penasihat tepercaya".
- **Resep:** serif display (Playfair Display / Cormorant Garamond / Fraunces — OFL) 56–110 px, bobot 400–500; label kapital `letter-spacing:.3–.5em` 15–18 px (Inter Tight); palet `#0e0e10 #f5efe6 #c9a96a`; ≥ 40% ruang kosong; satu gerak per elemen (posisi *atau* opasitas), `E.outExpo` 0,9 dtk, stagger 0,15 dtk; transisi = blur dip 0,5 s (T5); push-in 4% per 8 dtk (V2); grain 5–8%; light leak halus (V8). "Pilih satu gerak: berat, opasitas, atau posisi — dan tahan" [68]; serif + huruf kapital dengan tracking lebar terkesan mewah [68][69]; selaras tren #QuietLuxury [29].
- **SFX:** `shimmer` sangat lembut · **Sumber:** [29][68][69]

---

## 8. Pemetaan ke video

Tiap video punya 5–8 efek yang **berbeda satu sama lain**; setiap video memiliki "efek tanda tangan" sendiri. Jangan menyalin mentah — sesuaikan waktu ke kata VO (`'w:kata'`) dan ketukan.
Saran palet/font hanyalah titik awal; font Google (OFL) dimuat lewat `KIT.style({fonts})`.

**Matriks tanda tangan:** N03 CCTV HUD · N04 VHS + dialog error · N05 chat + Drake · N06 kertas + krayon · N07 mask reveal + light leak · N08 echo stack + marquee · N09 pixel + RPG · N10 blueprint + isometrik.

### N03 · Cyber-noir CCTV — insiden 3x24 jam
Palet: latar `#030806`, hijau CCTV `#d1fadf/#86efac`, merah alarm `#ef4444`, amber `#f59e0b`; font JetBrains Mono + Plus Jakarta Sans. Musik `tense` → tenang di S4.
1. **V13 CCTV HUD** (S1–S3): `CAM 03 · SERVER`, `● REC`, timecode berjalan dari `02:00:00:00`, kotak deteksi mengunci saat notifikasi; S4: HUD memudar 0,5 dtk (suasana berbalik).
2. **V12 CRT scanline + glow + vignette pekat** (S1–S3): alpha scanline 0,3 → 0 di S4.
3. **V6 + V5 glitch slice + RGB split**: pada kata "bocor" (S1, 4–6 frame) dan tiap file menumpuk (S3).
4. **V4 shake 10–14 px + X10 neon flicker merah** pada notifikasi/"data pelanggan Anda bocor" (S1).
5. **X6 scramble/decode**: kode insiden `████-████-███` terbuka menjadi `BRC-2027-001` (S4), hijau → cyan.
6. **V3 speed ramp** (S2): hitung mundur 72:00:00 melambat 0,25× di "paling lambat" lalu melesat 3,2× (Montage).
7. **T10 match cut** jam dinding bulat (S1) → cincin countdown (S2) + **T1 flash merah** S2→S3.
8. **T5 blur dip** S3→S4: glitch berhenti, palet merah/amber → cyan/teal (nada berbalik).

### N04 · Parodi iklan obat TV jadul 90-an — RoPA
Palet: krem TV `#f4e8c1`, biru `#1d4ed8`, merah `#e11d48`, kuning `#facc15`; font Anton + VT323 (OSD). Parodi GENRE saja: tanpa nama/logo/jingle produk nyata; klaim "obat" hanya lelucon, tanpa klaim medis.
1. **V7 VHS penuh**: scanline, chroma bleed, pita tracking, wavy, OSD `▶ PLAY` di S1–S6.
2. **R9 dialog error jadul bertumpuk** (S1): "RoPA_final_REVISI(2).xlsx sudah ada. Timpa?" + `buzzer`.
3. **X4 slam "Familiar?!"** + V1 zoom punch + `rimshot`.
4. **V10 starburst "BARU!" + speed lines** (S3) untuk wizard/AI; badge berputar 20°/dtk.
5. **T8 star/iris wipe** S3→S4 dan S5→S6.
6. **R3 "SEBELUM / SESUDAH" split diagonal** (S5): tumpukan file vs satu register.
7. **X8 ticker disclaimer cepat** (bawah layar, 220 px/dtk, huruf kecil): "*Efek samping: lembur, revisi ke-3…" — parodi catatan kaki.
8. **V14 sparkle glint** pada "Privasimu Nexus"/tombol CTA + V1 punch di "pensiunkan" + `tada`.

### N05 · Chat-app pastel + meme — hak subjek data
Palet: lavender `#ddd6fe`, pink `#fbcfe8`, mint `#bbf7d0`, teks `#1f2937`, aksen `#ec4899`; font Fredoka/Nunito + Anton untuk caption. Meme dibuat ulang orisinal (emoji/ilustrasi sendiri).
1. **R8 chat bubble + titik mengetik** (S1): email "Tolong hapus data saya" tampil sebagai gelembung chat; staf membalas "Siapa yang menangani?".
2. **R2 freeze + lingkaran merah + caption Anton** pada "tolong hapus data saya" + `vineboom`.
3. **V11 stiker die-cut** (😰 🗑️ ✅ ⏳) `outElastic`, rotasi ±6°.
4. **R4 Drake ❌/✅** (S3): "balas WhatsApp pribadi ❌ / formulir DSR + tenggat otomatis ✅".
5. **T2 whip pan lembut** S2→S3→S4.
6. **X3 bounce per huruf** "tiga kali dua puluh empat jam" (S2) + **X9 odometer** 72 jam / `DSR-2027-001` (S3).
7. **R10 confetti/emoji burst** di S6 + `tada`.
8. **V1 zoom punch** pada punchline "siapa yang menangani?" + `crickets`.

### N06 · Paper-craft + krayon — data anak
Palet: krem `#f5efe0`, oranye `#f97316`, biru `#2563eb`, hijau `#16a34a`, kuning `#facc15`; font Patrick Hand/Fredoka (OFL).
1. **C1 potongan kertas sobek + bayangan + tape**: HP/tablet, formulir persetujuan.
2. **C3 tekstur kertas serat** pada latar dan kartu.
3. **C2 stop-motion 8 fps + paper boil** untuk objek; latar/kamera 24 fps.
4. **C4 krayon + line boil**: ikon usia, bintang, badge.
5. **C5 draw-on krayon**: lini masa anak → dewasa (S3), garis sinyal ke sistem (S5).
6. **C6 scrapbook stamp-in**: dua tanda tangan anak & wali sebagai stempel + selotip (S2), polaroid.
7. **C7 paper parallax layers + puppet**: balon/maskot kertas melayang; **V11 stiker bintang** untuk "persetujuan".

### N07 · Editorial premium mewah — konsultan PDP
Palet: `#0e0e10 #f5efe6 #c9a96a`; font Playfair Display + Inter Tight. Musik `calm`/`main` lembut.
1. **B10 sistem editorial**: serif display, label tracking 0,5em, garis emas 1 px.
2. **X5 mask reveal + tracking** untuk judul/tanggal (S1, S6).
3. **V2 push-in 1,00→1,05 + drift paralaks** tiap scene.
4. **T5 blur dip 0,5–0,7 dtk** sebagai satu-satunya transisi.
5. **V8 light leak hangat halus** (alpha ≤ 0,22), sekali di S2 saat lencana muncul.
6. **V14 sparkle glint** pada lencana CIPP/E · CIPM · FIP (S2).
7. **X11 "16.01.2027" raksasa di belakang siluet kursi penasihat** (S1).
8. **B7 garis tipis** untuk alur 4 langkah (S4) + **B5 kartu 3D tilt** laporan → dasbor (S5).

### N08 · Poster Swiss kinetik — siap PP 33
Palet: `#e30613 #0a0a0a #f4f4f0`; font Inter Tight/Archivo 900. Musik ritmis tegas, potongan di ketukan.
1. **B9 grid Swiss 12 kolom** + palet 3 warna.
2. **X7 outline echo stack** untuk "16.01.2027" (S1, S5).
3. **X8 marquee silang miring** "PP 33/2026 ★ 16.01.2027 ★" (S1/S6).
4. **T9 push + stretch geometris** 0,35 dtk antar scene.
5. **X9 odometer/countdown** angka raksasa (S1 hari menuju; S3 penomoran 5 prioritas).
6. **X4 slam + `stamp`**: stempel 16.01.2027 (S5).
7. **V9 halftone** pada peta pasal (S2) dengan status merah/kuning/hijau sebagai bar tegas.
8. **T1 flash 2 frame** di ganti scene (tanpa transisi lain).

### N09 · Arcade/RPG 8-bit — PPDP baru
Palet: `#000`, biru RPG `#1e3a8a`, kuning `#facc15`, hijau `#22c55e`, merah `#ef4444`; font Press Start 2P. Musik `lead:'chip'`, `drums:'chip'`.
1. **C8 sprite piksel** + palet 8 warna + `image-rendering:pixelated`, kamera snap 8 px.
2. **X2 dialog RPG typewriter** 30 cps + ▼ berkedip (S1, S2; chat Priva di S4).
3. **T7 pixel dither wipe / pixelate** antar scene (0,5 dtk).
4. **V12 CRT scanline ringan** (alpha 0,18) + vignette.
5. **X10 blink "PRESS START"** + HUD XP bar 10 blok.
6. **R10 confetti piksel + koin** (S1 "Selamat") + `coin`/`levelup`.
7. **X4 "LEVEL UP!" slam + V4 shake 12 px** untuk blok "?" raksasa (akhir S1).
8. **V15 clone/echo trail** pada sprite yang berlari (afterimage).

### N10 · Blueprint arsitektural — holding
Palet: `#0b3a8c`, garis `#e0f2fe`, aksen `#7dd3fc`; font JetBrains Mono + Plus Jakarta Sans. Musik `calm`→`main`, berwibawa.
1. **C9 blueprint**: grid 24/120 px, garis putih-biru draw-on, title block kanan bawah.
2. **B3 isometrik**: anak usaha sebagai balok/gedung; lapisan terbuka; silo terkunci (S4).
3. **T10 match cut**: node peta grup (S1) → tile dasbor (S3), jangkar posisi sama.
4. **B5 kartu 3D tilt + specular sweep** untuk dasbor holding (S3).
5. **X2 label mono typewriter** + garis dimensi & koordinat (S1/S2).
6. **V2 drift kamera + paralaks grid** (sangat pelan).
7. **X9 odometer** skor kesiapan per anak usaha (S2).
8. **T4 zoom-through** S3→S4 masuk ke "silo" terkunci.

---

## 9. Catatan legal singkat (bukan nasihat hukum — konfirmasi dengan penasihat hukum)

**Kenapa aset/audio meme viral dan klip berhak cipta tidak dipakai di iklan komersial**
1. **Iklan = penggunaan komersial.** UU 28/2014 Pasal 9 ayat (2)–(3): pelaksanaan hak ekonomi serta penggandaan/penggunaan komersial ciptaan wajib seizin Pencipta/Pemegang Hak; Pasal 113 ayat (2)–(3): pidana penjara sampai 3–4 tahun dan/atau denda sampai Rp500 juta–Rp1 miliar untuk pelanggaran hak ekonomi tertentu pada penggunaan komersial [71][72]. Pembatasan hak cipta (Pasal 43–51: pendidikan, penelitian, pemberitaan, dll.) berupa daftar tertutup (bukan "fair use" terbuka seperti di AS) dan tidak mencakup iklan komersial [72].
2. **Meme = turunan karya berhak cipta.** Foto, potongan film, karya seni, musik dilindungi (Pasal 40 ayat (1)) [72]. Yang bebas ditiru hanya **ide/format** (Pasal 41 huruf b: ide, prosedur, sistem, metode, konsep) — misalnya "pilih A bukan B", "POV:", "Ekspektasi vs Realita" — bukan ekspresi spesifiknya (foto, klip, audio, karakter). Karena itu pustaka ini hanya menyalin **format & ritme**, tidak pernah asetnya.
3. **Wajah orang.** Pasal 12 ayat (1): potret untuk reklame/periklanan komersial perlu persetujuan tertulis orang yang dipotret (denda sampai Rp500 juta, Pasal 115) [72][73]. Untuk merek pelindungan data pribadi, memakai wajah orang tak dikenal dari meme juga bertentangan dengan pesan merek.
4. **Audio viral / "trending sound"** dimiliki label/pencipta/kreator. Library suara umum TikTok hanya untuk akun personal non-komersial; akun bisnis wajib memakai Commercial Music Library (CML) [74][76]. Preseden: juri AS memutus Grumpy Cat Ltd. vs Grenade Beverage dengan ganti rugi ± US$710.000 (merek + hak cipta) [79]; agensi menyarankan meme dan sound dilisensikan resmi [81]; pembelaan fair use umumnya ditolak untuk pemakaian komersial merek [80].
5. **Aset CapCut.** Sejak Juni 2025 banyak musik, template pihak ketiga, stok, stiker, dan efek berstatus personal-use; hanya materi berlabel "commercial use" (Dual Use) yang boleh untuk materi promosi, dan bila dicampur dengan materi non-komersial seluruh hasil jadi personal-only; lisensi terikat akun dan tidak dapat dialihkan (tidak menutup kerja untuk klien) [77][78]. → CapCut kami pakai hanya sebagai **kosakata gaya**; efeknya dibuat ulang prosedural.
6. **Risiko praktis:** takedown/mute, iklan ditolak, klaim ganti rugi, dan reputasi merek privasi.

**Alternatif berlisensi**

| Kebutuhan | Opsi aman | Catatan |
|---|---|---|
| Musik & SFX | (1) sintesis sendiri (`lib/audio.js`, `music.js`) — orisinal; (2) library komersial: Epidemic Sound (paket komersial menutup iklan berbayar & kerja klien; batas 3 akun per platform), Artlist (paket Pro: media sosial tak terbatas, iklan berbayar, kerja klien), Envato Elements (lisensi per proyek — daftarkan proyeknya) [82][83]; (3) **TikTok Commercial Music Library**: 1 juta+ lagu & SFX pra-lisensi untuk akun bisnis, organik dan iklan berbayar **di TikTok** [74][75][76] | CML tidak berlaku di YouTube/Instagram/siaran — bila video yang sama tayang di sana, pakai musik sintesis/berlisensi lintas platform. Simpan bukti lisensi per video |
| Meme/format | buat ulang orisinal: ilustrasi/emoji/SVG sendiri, tulis ulang teks, tanpa foto orang, karakter, atau logo pihak lain | mis. Drake → dua panel ❌/✅ berilustrasi netral |
| Footage/wajah | rekaman sendiri dengan persetujuan tertulis (model release) atau stok berlisensi komersial | wajah = data pribadi (UU PDP) |
| Font | Google Fonts (SIL OFL 1.1, boleh komersial): Anton/Bebas Neue (pengganti Impact), Press Start 2P, Playfair Display, Inter Tight, Montserrat [84] | jangan pakai font berbayar tanpa lisensi |
| Emoji/stiker | Noto Color Emoji (font OFL, gambar Apache-2.0) atau SVG sendiri [85] | render kami memakai emoji font sistem — pastikan lisensi set emoji di mesin render atau pakai Noto |
| Suara VO | VN tim, atau TTS berlisensi komersial (edge-tts hanya placeholder — lihat README) | — |

**Checklist sebelum tayang:** (a) daftar aset + lisensi per video; (b) tidak ada wajah/suara/merek pihak lain; (c) kilat ≤ 3×/dtk [86]; (d) klaim sesuai naskah dan `fakta_produk.json`; (e) iklan TikTok: musik dari CML; (f) simpan log build dan file sumber.

---

## 10. Daftar sumber

Tanda † = terlihat di hasil pencarian, halaman belum dibuka penuh. Semua halaman hanya dibaca; tidak ada media yang diunduh.

**A · CapCut/TikTok: transisi, efek, template**
1. https://www.capcut.com/help/capcut-transitions
2. https://arwriterai.com/en/blog/best-capcut-effects-transitions-boost-views-2026/
3. https://www.capcut.com/id-id/help/latest-capcut-editing-trends
4. https://www.capcut.com/resource/ai-camera-transitions-whip-pan-match-cut
5. https://www.capcut.com/resource/how-to-do-velocity-on-capcut
6. https://www.capcut.com/explore/speed-ramp-effect †
7. https://www.capcut.com/explore/latest-velocity-trend-2026 †
8. https://www.capcut.com/explore/tiktok-transition-trends
9. https://www.premiumbeat.com/blog/create-seamless-transitons-whip-pan/
10. https://photofocus.com/software/tutorials-software/easy-whip-swish-pan-in-after-effects/ †
11. https://indietalk.com/archive/index.php/t-34499.html †
12. https://schoolofmotion.com/blog/how-to-create-a-glitch-effect-in-after-effects
13. https://aejuice.com/blog/how-to-create-an-rgb-split-effect-in-after-effects/
14. https://aejuice.com/blog/how-to-do-camera-shake-in-after-effects/
15. https://www.capcut.com/resource/film-light-leak-overlay
16. https://www.capcut.com/explore/vhs-effect-transition †
17. https://www.capcut.com/explore/freeze-frame-effect †
18. https://www.capcut.com/explore/halftone-effect-illustration †
19. https://www.tiktok.com/discover/speed-lines-effect †
20. https://www.makeuseof.com/capcut-how-to-clone-without-green-screen/ †

**B · Efek teks & kinetic typography**
21. https://ascynd.io/en/blog/hormozi-captions
22. https://blitzcutai.com/blog/best-caption-style-tiktok
23. https://rendercut.io/what-is-karaoke-caption-style
24. https://www.ikagency.com/graphic-design-typography/kinetic-typography/
25. https://autoae.online/blog/how-to-do-text-animation-in-capcut-pc †
26. https://dev.to/ekeijl/retro-crt-terminal-screen-in-css-js-4afh

**C · Ritme & edit meme (Indonesia), format iklan TikTok**
27. https://www.capcut.com/id-id/explore/heart-stopping-jedag-jedug-edit
28. https://tekno.kompas.com/read/2025/04/21/15150087/apa-itu-italian-brainrot-atau-meme-anomali-yang-lagi-viral-di-tiktok
29. https://www.popmama.com/life/health/tren-tiktok-viral-tahun-2025-00-nzqrb-f23w1f
30. https://rri.co.id/hiburan/2079615/deretan-meme-viral-yang-mengguncang-internet-2025
31. https://www.idntimes.com/tech/trend/tren-konten-tiktok-diprediksi-viral-2026-c1c2-01-b222l-knw4kb
32. https://www.finchley.co.uk/finchley-learning/funny-video-editing-techniques-to-make-your-content-stand-out
33. https://www.capcut.com/explore/red-circle-meme
34. https://knowyourmeme.com/memes/vine-thud-boom-sound-effect †
35. https://www.tiktok.com/discover/ekspektasi-vs-realita †
36. https://ads.tiktok.com/help/article/creative-best-practices †
37. https://zeely.ai/blog/tiktok-safe-zones/ †
38. https://www.flexclip.com/learn/text-message-animation.html †

**D · Paper animation, kolase/scrapbook, stop-motion, craft, retro**
39. https://paper-animation.com/
40. https://paperanimator.com/ (paperanimation.com dialihkan 301 ke sini)
41. https://lesterbanks.com/2020/02/an-easy-way-to-get-a-paper-cutout-stop-motion-look-in-ae/
42. https://blog.pond5.com/73152-stop-motion-video-effect/
43. https://stopmotionmagazine.com/why-your-frame-rate-fps-matters-in-animation/ †
44. https://blog.videobolt.net/post/how-to-use-torn-paper-animation-in-your-videos
45. https://artcoastdesign.com/blog/how-to-master-digital-collage-trend
46. https://blog.videobolt.net/post/top-motion-graphics-trends-2026
47. https://elements.envato.com/learn/motion-design-trends
48. https://camillovisini.com/coding/simulating-hand-drawn-motion-with-svg-filters
49. https://jakearchibald.com/2013/animated-line-drawing-svg/ †
50. https://superdesign.dev/library/architectural-blueprint †
51. https://pixelbuddha.net/fonts/retro-game-fonts †
52. https://elements.envato.com/retro-cctv-screen-animation-XZRCADH †
53. https://theretronetwork.com/15-totally-awesome-90s-infomercials/ †
54. https://www.svgator.com/blog/graphic-design-trends-prediction/ †

**E · Motion graphics B2B/SaaS elegan (kinetic type, glass, isometrik, Swiss, editorial)**
55. https://www.contentbeta.com/blog/motion-graphics-styles/
56. https://blog.nobledesktop.com/motion-graphics-trends
57. https://garagefarm.net/blog/animation-trends-to-watch †
58. https://ixdf.org/literature/topics/glassmorphism †
59. https://axesslab.com/glassmorphism-meets-accessibility-can-frosted-glass-be-inclusive/ †
60. https://css-tricks.com/getting-clarity-on-apples-liquid-glass/ †
61. https://www.setproduct.com/blog/liquid-glass-vs-glassmorphism †
62. https://garagefarm.net/blog/isometric-animation-breathing-life-into-stylized-worlds †
63. https://advids.co/insights/isometric-design-in-motion-why-this-style-is-perfect-for-visualizing-systems-and-processes †
64. https://www.tella.com/features/zoom †
65. https://www.tella.com/blog/animated-cursors-for-screen-recordings †
66. https://gt3themes.com/swiss-style-in-motion-animation-in-international-typographic-style/
67. https://wearefevr.com/the-influence-of-swiss-design
68. https://www.designrush.com/best-designs/video/trends/8-25-seconds-to-impress-typography-animation-examples-that-maximize-viewer-retention †
69. https://creativemarket.com/blog/luxury-fonts †
70. https://theplusaddons.com/blog/web-design-trends-2026/ †

**F · Legal, lisensi, aksesibilitas**
71. https://peraturan.bpk.go.id/details/38690 † (UU 28/2014)
72. https://id.wikisource.org/wiki/Undang-Undang_Republik_Indonesia_Nomor_28_Tahun_2014
73. https://www.hukumonline.com/klinik/a/hukumnya-menggunakan-foto-orang-lain-tanpa-izin-cl5732/ †
74. https://ads.tiktok.com/help/article/commercial-music-library?lang=en
75. https://ads.tiktok.com/business/en-US/blog/audio-library-royalty-free-music †
76. https://www.soundstripe.com/blogs/tiktok-music-library-explained
77. https://www.capcut.com/clause/material-license-agreement
78. https://blazemedia.co.uk/2025/06/26/capcut-2025-copyright-changes
79. https://ipwatchdog.com/2018/01/27/grumpy-cat-wins-copyright-trademark-infringement/id=92904/ †
80. https://futuresocial.beehiiv.com/p/meme-marketing-isnt-legal-brands
81. https://digiday.com/marketing/marketing-briefing-legality-questions-swirl-as-brands-use-more-memes-trending-creator-sounds/
82. https://photutorial.com/artlist-vs-epidemic-sound/ †
83. https://pixflow.net/blog/royalty-free-music-video-editing/ †
84. https://choosealicense.com/licenses/ofl-1.1/ †
85. https://github.com/googlefonts/noto-emoji †
86. https://www.boia.org/wcag2/cp/2.3.1 (WCAG 2.3.1 — maks. 3 kilatan per detik)
