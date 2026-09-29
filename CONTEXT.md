# CONTEXT — konteks lengkap untuk sesi AI baru

> Untuk Claude (sesi/akun lain) atau AI apa pun yang melanjutkan pekerjaan di `motion/`.
> `README.md` = cara pakai. Berkas ini = latar belakang, aturan, isi kepala, dan status terakhir.
> Terakhir diperbarui: 29-09-2026.

## 0. Ringkasan 30 detik

- `motion/` adalah **pabrik video iklan** untuk produk **Privasimu Nexus**. Video dibuat dari kode (HTML → frame →
  MP4 16:9 & 9:16) dengan TTS/VN, musik & SFX sintetis.
- Motion **tidak mengubah aplikasi** (frontend/backend). Ia hanya **membaca** screenshot aplikasi dan dokumen fakta produk.
- **Pengguna yang merender** lewat `RENDER.bat` (supaya tidak "membakar token"). AI menyiapkan naskah, visual, musik,
  lalu memeriksa hasil dengan beberapa still, bukan render penuh.
- Semua **17 video sudah dirender** (per 29-09-2026). Rancangan puluhan video lain ada di `rancangan/*.xlsx`.
- Repo git sendiri: `github.com/pendtiumpraz/privasimu-motion` (**PUBLIK**), branch `main`.

## 1. Apa ini dan hubungannya dengan aplikasi

**Produk:** Privasimu Nexus — SaaS (dan on-prem) kepatuhan pelindungan data pribadi Indonesia: UU PDP No. 27/2022 dan
PP 33/2026 (peraturan pelaksana). Pasar: korporasi, lembaga keuangan (OJK), holding + anak usaha. Siklus modul:
GAP Assessment → RoPA → DPIA → Data Discovery → Consent / DSR / Insiden → Fire Drill → kembali ke GAP; pendukung:
Manajemen Risiko Pihak Ketiga (TPRM), transfer lintas negara + TIA, LIA, Maturity, telaah kontrak/kebijakan, generator
kebijakan, AI Agent (asisten "Priva"), DPO Academy (LMS).

**Kode aplikasinya ada di monorepo** `D:/AI/privasimu` (git root induk `D:/AI`), BUKAN di repo ini:

| Folder monorepo | Isi | Dipakai motion? |
|---|---|---|
| `../backend/` | Laravel 12 / PHP 8.3 API (canonical backend) | hanya **dibaca**: `resources/konten/fakta_produk.json`, `docs/KONTEKS-PLATFORM.md` |
| `../frontend/` | Next.js 16 / React 19 (UI aplikasi) | hanya dibaca: screenshot di `tmp/audit4/`; `node_modules/playwright-core` dipinjam untuk render |
| `../dataroom/` | arsip bukti UAT (178 screenshot root/superadmin/tenant) + `AUDIT_REPORT.md` | hanya dibaca: `03-tenant/<modul>/*.png` |
| `../CLAUDE.md` | aturan & arsitektur monorepo | bacaan latar |
| `../ai-onprem/` | stack inferensi AI on-prem (vLLM, endpoint kompatibel OpenAI) | belum dipakai |

Motion tidak di-deploy dan tidak dipanggil aplikasi. **Jangan pernah mengedit apa pun di luar folder `motion/`**
(pesan pengguna: "jangan ngedit apa-apa dari aplikasiku, nanti rusak").

**Kalau hanya meng-clone repo motion (tanpa monorepo):** screenshot sudah jadi di `assets/app/`, jadi semua video tetap
bisa dibangun. Jalankan `npm install` dan `npx playwright install chromium` untuk render. `lib/app-shots.js` tidak bisa
dijalankan karena sumbernya ada di monorepo. Fakta produk ringkas ada di bagian 3 di bawah.

## 2. Aturan kerja (wajib dipatuhi)

1. **Jangan edit aplikasi.** Semua file di luar `motion/` hanya dibaca. Olahan (crop/blur) disimpan sebagai salinan di
   `motion/assets/`.
2. **Render penuh = tugas pengguna.** Alur AI: tulis `scenes.js`/`style`/`music.js` → `node build.js <folder> --audio-only`
   → `node lib/cek-cue.js <folder>` → QA still dengan `bash lib/qa-sheet.sh …` (kedua format) → perbaiki → tulis naskah
   di `naskah/` → masukkan folder ke `antrian-render.txt` → beri tahu pengguna untuk klik dua kali `RENDER.bat`.
3. **Jangan ganggu render pengguna.** Sebelum menjalankan pekerjaan berat, cek apakah ada `node build.js`/`ffmpeg`
   yang berjalan (PowerShell: `Get-CimInstance Win32_Process -Filter "Name='node.exe'"`). Jalankan pekerjaan berat AI
   dengan prioritas rendah: `cmd //c "start /belownormal /wait /b node build.js <folder> --audio-only"` (Git Bash).
   **Jangan** `--audio-only` pada folder yang sedang dirender (menimpa `timeline.js`/audio). **Jangan** mengedit
   `RENDER.bat` saat sedang berjalan (cmd membaca .bat baris per baris dari disk).
4. **Satu per satu.** Pengguna tidak ingin multi-agent/sub-agent paralel.
5. **Keamanan.** Jangan pernah memasukkan password atau login ke situs mana pun. Kredensial yang pernah ditempel
   pengguna tidak boleh dipakai. Unduhan harus seizin pengguna (sebut nama berkas, sumber, ukuran). API key (DeepSeek,
   ElevenLabs, …) hanya lewat environment variable, dan jangan minta pengguna menempelkannya ke chat.
6. **Git (repo motion).** Commit/push hanya bila diminta. Stage path eksplisit (bukan `git add -A`). Tulis pesan
   berbahasa Indonesia lewat `git commit -F`, diakhiri baris atribusi sesuai instruksi sesi. Identitas lokal sudah diset:
   Galih Praz `<pendtiumpraz@gmail.com>`. Jangan commit `out/`, `vo/`, `timeline.js`, atau rekaman VN (sudah di
   `.gitignore`).
7. **Repo ini PUBLIK.** Jangan commit data pribadi, kredensial, nama klien/perusahaan asli, atau screenshot tanpa blur.
8. **Bahasa:** Indonesia untuk naskah, teks layar, komentar kode, dan komunikasi dengan pengguna.
9. **File Windows:** jangan menulis file sumber lewat PowerShell (BOM). `RENDER.bat` & `antrian-render.txt` wajib ASCII + CRLF.

## 3. Aturan konten iklan (brand, hukum, lisensi)

**Fitur:** hanya yang tercantum di `../backend/resources/konten/fakta_produk.json` (16 modul: RoPA, DPIA, DSR,
Consent & Cookie, Insiden kebocoran, Data Discovery, GAP Assessment, Maturity, Risiko Pihak Ketiga, Transfer Lintas
Negara + TIA, Telaah Kebijakan, Telaah Kontrak, Simulasi & Fire Drill, Dukungan PPDP + AI Priva, Paparan Sanksi,
Privasimu Nexus platform). Aturan berkas itu: **jangan menulis fitur di luar daftar; angka hanya dari bidang `angka`.**
Selain itu, yang boleh ditampilkan adalah yang terlihat di screenshot asli.

**Istilah:** selalu "**pihak ketiga**", jangan "vendor", di teks layar, VO, dan subtitle.

**Angka:** angka di screenshot = data demo. Angka lucu/hiperbola diberi label "*angka ilustrasi" (A22, rating T03,
"12 spreadsheet" T01). Klaim retoris (mis. "10 detik") dicatat di bagian DASAR FAKTA naskah.

**Fakta hukum yang dipakai (cek ulang sebelum tayang):**
- UU PDP No. 27/2022 berlaku penuh sejak Oktober 2024. PP 33/2026 berlaku **16 Januari 2027**.
- Pemberitahuan insiden paling lambat **3×24 jam** (UU PDP Pasal 46; PP 33/2026 Pasal 114).
- Denda administratif paling tinggi **2%** dari pendapatan/penerimaan tahunan (UU PDP Pasal 57 ayat 3).
- Transfer data ke luar negeri diatur Pasal 56.

**CTA:** privasimu.com · support@privasimu.com · 0851 8318 2722 · "Start Pre Check (gratis)" · "Schedule Demo" ·
"konsultasi gratis". Penawaran harus dikonfirmasi masih berlaku sebelum tayang.

**Brand:**
- Logo `assets/privasimu_logo.png` (putih). Untuk latar terang pakai filter navy:
  `brightness(0) invert(13%) sepia(40%) saturate(2000%) hue-rotate(205deg)`. Filter ini tertimpa bila elemen yang sama
  diberi `filter: blur()` lewat animasi, jadi bungkus logo dan animasikan pembungkusnya.
- Warna: navy `#0B1B4D`, biru `#2F6BFF`, ungu `#6D4CFF`. Font utama Plus Jakarta Sans.

**Meme & audio pihak lain:**
- Format meme dibuat ulang secara orisinal.
- JANGAN memakai klip/gambar meme asli: myinstants hanya untuk pemakaian pribadi/non-komersial.
- Suara vokal meme ("FAAAH", "HAH?", dll.) harus direkam tim ke `sfx-kustom/` atau dibuat dengan TTS berlisensi.
- Tanpa karakter, wajah, atau merek pihak lain.
- Format "rekap tahunan" tanpa meniru warna, font, atau logo layanan musik.

**Suara:** edge-tts = placeholder, bukan untuk iklan komersial. Tayang pakai VN tim atau TTS berlisensi (Azure
Speech / ElevenLabs berbayar).

**Musik/SFX:** disintesis di kode, bebas royalti.

**Font:** Google Fonts OFL/Apache: Plus Jakarta Sans, JetBrains Mono, Anton, Archivo, Instrument Serif, Bricolage
Grotesque, Permanent Marker, Caveat, Special Elite, Abril Fatface, Archivo Black, Bebas Neue, Playfair Display,
Noto Color Emoji.

## 4. Asal screenshot aplikasi & data sensitif

**Sumber** (hanya dibaca), dikurasi oleh `lib/app-shots.js` → `assets/app/*.png` + `manifest.json` (32 aset berdeskripsi):

| Sumber | Keterangan | Blur standar |
|---|---|---|
| `../dataroom/03-tenant/<modul>/*.png` | screenshot UAT tampilan **lama** (viewport lebar 1264; halaman panjang di-crop) | blok nama user sidebar `[0,470,262,140]` |
| `../frontend/tmp/audit4/*.png` | audit UI **terbaru** (lebar 1440) | nama organisasi di header `[300,22,200,26]` |

Pengguna sudah setuju screenshot tampilan lama dipakai.

Aset siap pakai:
- dashboard, dashboard-postur, dashboard-risiko, dashboard-sla
- breach-detail, breach-fase, breach-aksi, breach-ai, breach-list-baru
- ropa-baru, ropa-data-spesifik, ropa-tersimpan, ropa-list-baru
- dpia-list, dpia-risiko, dpia-list-baru
- dsr-form, dsr-detail, consent-detail
- ai-agent-chat, ai-agent-home
- gap-hasil, gap-rekomendasi, gap-ringkasan, gap-mulai
- postur-privasi, children-pro, inclusive-privacy, dpo-academy, policy-review, holding-header, fire-drill-header

**Menambah aset:**
1. Tambah entri `{ name, src, crop:[x,y,w,h], blur:[[x,y,w,h]…], desc }` di `SHOTS` (`lib/app-shots.js`). Koordinat
   dihitung relatif ke gambar SUMBER.
2. Jalankan `node lib/app-shots.js`. Hanya bisa di monorepo.
3. Periksa hasil dan blur-nya.
4. Pakai sebagai `../assets/app/<nama>.png`.

**Jangan pakai / wajib diburamkan** (daftar ini sengaja tanpa menyebut nama):
- Layar holding superadmin (`02-superadmin`, matriks & pohon grup) memuat **nama grup perusahaan asli**. Jangan dipakai;
  cukup `holding-header` (tanpa data grup).
- `dsr/01-overview` memuat nama aplikasi milik institusi asli. Tabel cookie memuat nama layanan/domain asli.
- `ropa/03` (DPO/Team) memuat alamat email. `data-discovery/03` memuat formulir kredensial.
- Angka tampil rusak di tampilan lama: donat Distribusi Risiko ("09192", sudah diburamkan di `dashboard-risiko`),
  Simulation "142109650%", policy-review "3785", contract-review "152195". Hindari atau potong.
- Kartu "Terakhir disimpan" di GAP memuat ID soal & nama file (sudah diburamkan di `gap-ringkasan`).

## 5. Cara kerja pipeline

`node build.js <folder> [--audio-only] [--fmt=16x9,9x16] [--tts] [--workers=N]`:

1. **TTS** (`lib/tts.py`, edge-tts): cache `vo/<scene>-<md5>.mp3` + timing kata `.json`. Waktu kata dikoreksi +0,085 dtk
   (edge-tts melapor lebih awal).
2. **VN** (`lib/vn.js`): `vn/<KODE>_S<n>.*` menggantikan TTS. Hasilnya dibersihkan, dipotong, dan timing kata
   diselaraskan dari referensi TTS.
3. **maxPause**: jeda panjang dirapatkan memakai `silencedetect` FFmpeg (bukan dari durasi kata).
   **voFx**: efek suara per scene (`lib/vofx.js`).
4. **Timeline**:
   - durasi scene = `max(min, voDelay + ucapan + tail)`, lalu dibulatkan ke `CONFIG.beat` (kecuali `s.free`);
   - scene `vo: ''` = tanpa suara;
   - hasil → `<folder>/timeline.js` (dimuat halaman) dan `out/<folder>/timeline.json`.
5. **Cue SFX**: detik lokal | `'w:kata[#n][±off]'` | `'end-x'`. Subtitle (`lib/captions.js`, `CONFIG.capMap`,
   `burnCaptions`/`cap`), dibakar hanya di 9:16.
6. **Audio** (`lib/audio.js`): musik (`<folder>/music.js` → `compose(music, rev, tl)` atau `lib/music-kit.js`) +
   SFX + VO → ducking → loudnorm -14 LUFS → `audio-master.m4a`.
7. **Render** (`lib/render.js`):
   - Chromium headless, 4 pekerja paralel, `window.seek(t)` per frame, JPEG → x264 CRF 17, 30 fps;
   - frame macet ditunggu 120 dtk + coba ulang 3×;
   - mux + verifikasi audio (track ada, tidak senyap);
   - catat sidik jari sumber ke `out/<folder>/render-info.json` (`lib/status-render.js`).

**`RENDER.bat`:**
- membaca `antrian-render.txt` (baris `#` dilewati);
- per folder memanggil `node lib/status-render.js` (kode keluar 10 = sudah jadi & tidak berubah → dilewati);
- `--paksa` merender ulang;
- ringkasan di `out/log/antrian-*.txt`.

**Struktur `scenes.js`** (berlaku di Node dan browser):
- `CONFIG`: `title, naskah (kode VN), voice, voiceRate, voicePitch, maxPause, beat, tail, music{bpm, mode, root, lead,
  drums, clock, sonic}, mix{duckTo, musicGain, voGain, sfxGain}, capMap, burnCaptions`.
- Scene: `id, vo, min, voDelay, tail, free, cap, voice*, maxPause, voFx, mus (bagian musik), sfx:[[kapan, nama, gain]],
  vis:{type, enter/exit:'none', push, shake:[cue], flash, …param tipe}`.

**Mesin visual:**
- `lib/engine.js` (`MG`): `P` (progres), `cl`, `lerp`, easing `E`, `hash`, `tf`, `fmtNum`, `pick`, `wt`.
- `lib/kit.js` (`KIT`):
  - `run`, `registerType`, `style({fonts, bg, frame, themes})`;
  - helper: `h`, `$`, `esc`, `rich` (`*kata*` → aksen), `splitWords`/`revealWords`, `float`, `V` (true = 9:16), `SW`/`SH`.
- **Semua gerak harus fungsi murni dari waktu** (render paralel & seek acak): tanpa `Math.random`, `Date`, atau CSS
  transition/animation. Pakai `hash()`.

**Tipe scene:**
- Kit umum: `headline, alert, countdown, stack, checklist, flow, card, dashboard, badges, tree, grid, doc, logo, cta,
  meme` (+ stiker).
- Seri modul "Nexus Explained" (`lib/seri-modul.js`): `nx_text`, `nx_shot` (bingkai browser 3D + kamera + sorotan),
  `nx_cta`.
- Tipe khusus per video ada di `<folder>/style.js`:
  - `m01_*`, `m02_*`;
  - `r_*` (A22 slide cerita);
  - `stomp`/`stomp_cta` (T01 kartu per ketukan);
  - `ky`/`ky_cta` (T02 kanvas dunia + kamera per baris);
  - `sm` (T03 papan 12 fps);
  - tipe meme N11.

Detail API: `BRIEF-AGEN.md`; ide gaya: `PUSTAKA-GAYA.md`.

**SFX tersedia (53)**: whoosh, suck, riser, riserLong, sweep, impact, boom, stamp, hit, glitch, pop, tick, key, ding,
shimmer, clock, tock, flip, paper, slam, check, heart, vineboom, scratch, sadtrombone, dundun, rimshot, buzzer, correct,
boing, slidewhistle, crickets, airhorn, coin, levelup, blip, tada, alarm, hitmarker, rewind, clank, slidedown, auraUp,
auraDown, notif, shutter, sadviolin, reveal, error, shock, gameover, outro, eurobeat. SFX milik sendiri: `'file:nama'`
dari `sfx-kustom/`.

**music-kit:**
- `mus` per scene: `hook | tense | hush | main | calm | play | outro | none`.
- Opsi: `lead` `pluck|keys|bell|chip`, `drums` `full|light|chip|none`, `sonic: true` = sonic logo "Pri-va-si-mu"
  (sol-mi-re-do).

## 5b. Versi per sales

- `RENDER-SALES.bat` → `lib/sales.js` membaca `sales/daftar-sales.xlsx` (lewat `lib/baca_sales.py`; template dibuat
  `lib/buat_template_sales.py`). Excel ini berisi data pribadi (nama & nomor HP sales) → di `.gitignore`, jangan
  pernah di-commit (repo publik) atau disalin ke tempat lain.
- Mekanisme: halaman menerima `&kontak={"penuh","nomor"}`. `lib/engine.js` (`MG.kontak`, `applyKontak` di `boot`) dan
  `lib/kit.js` (`deepKontak` di `run`, sebelum teks dipecah per huruf) mengganti
  `support@privasimu.com · 0851 8318 2722` dan `0851 8318 2722`. Tanpa parameter, halaman tidak berubah. Jangan mengubah
  teks kontak umum tanpa memperbarui pola di `engine.js`.
- `sales.js` per video/format:
  1. cari detik pertama kontak terlihat (scan DOM di halaman);
  2. cari keyframe terakhir sebelumnya (paket berflag K via ffprobe);
  3. kepala video dasar dipotong dengan muxer segment (tanpa encode);
  4. render ekor sejak keyframe itu dengan kontak sales;
  5. concat + audio dasar;
  6. verifikasi durasi, jumlah frame (harus sama persis) dan decode.
  Catatan & cache analisis di `out/<folder>/sales-info.json`. Hasil `<pola>.mp4` di `out/<folder>/`.
- Nomor dinormalkan (0812…, +62…, 62… → 0812-3456-7890); nama dipotong `maks_huruf_nama`. Video tanpa kontak di CTA
  (A22) dilewati. Sales sebaiknya sudah setuju nomornya ditampilkan.

## 6. Formula iklan (dari `rancangan/Rancangan-Iklan-Video-Privasimu.xlsx`)

**Hook** wajib di 0–3 detik, salah satu dari 4 jenis:
- psikologi terbalik ("Jangan cek skornya…");
- relate ("Rekap tahunan DPO…");
- anomali ("12 spreadsheet…");
- logika dipatahkan ("Laporan terbaik bukan yang paling tebal").

**Alur:** hook → masalah/taruhan (UU PDP, PP 33, sanksi) → solusi (fitur nyata + screenshot asli) → bukti → CTA.

**Skor:** Awareness / Convert / Share, dengan bobot bernama `W_AW` / `W_CV` / `W_SH` (sheet Metodologi Skor).

**Isi Excel:**
- Ringkasan
- Flow Semua Modul (unggulan "Perjalanan Satu Data" ± 3 menit + penanda potongan 60/30 dtk)
- Daftar Video Modul (M01–M22)
- Flow per Modul (scene, screenshot, crop/blur, teks layar, VO, SFX)
- Video Pendek 5-10-15 (P01–P32)
- Rancangan Ads Meme (A01–A48)
- Screenshot per Modul
- Bank Sound Meme
- Efek VO
- Opsi TTS
- Kalender Tayang
- Metodologi Skor

Generator: `rancangan/sumber/buat_excel.py` (data di `data_rancangan.py`, `data_meme.py`).

**Yang sudah dibuat dari Excel:** M01, M02, A22. Sisanya masih rancangan.

## 7. Status video (29-09-2026)

Semua 17 video di `README.md` sudah dirender (hasil di `out/`, tidak ikut git). Naskah VN tim untuk semuanya ada di
`naskah/`. Belum ada rekaman VN tim, jadi semua masih memakai TTS placeholder.

## 8. Resep tugas umum

- **Video modul berikutnya (M03…):**
  1. Salin `m02-gap/` (index.html, music.js) ke folder baru.
  2. Tulis `scenes.js` dari baris Excel (sheet Flow per Modul) memakai `nx_*`, plus tipe hook khusus di `style.js`.
  3. `node build.js <folder> --audio-only`, lalu `lib/cek-cue.js`, lalu `lib/qa-sheet.sh` (16x9 & 9x16).
  4. Tulis naskah `naskah/Mxx-….txt`.
  5. Tambah ke `antrian-render.txt` dan tabel README.
- **Gaya baru:** contoh lengkap di `t01-stomp` (kartu per ketukan + musik custom), `t02-tipografi` (kanvas + kamera),
  `t03-stop-motion` (12 fps + tekstur hash), `a22-rekap-dpo` (slide cerita).
- **Ganti teks VO:** edit `vo` → `--audio-only` → `cek-cue` (cue `w:` harus tetap ada) → QA still → `RENDER.bat`
  (otomatis dirender ulang karena sumber berubah).
- **Pasang VN:** taruh file di `vn/` → `RENDER.bat` (otomatis).
- **Versi per sales:** isi `sales/daftar-sales.xlsx` → `RENDER-SALES.bat` (lihat 5b). Untuk menguji tanpa menyentuh data
  pengguna, salin Excel ke file lain lalu `node lib/sales.js <folder> --fmt=9x16 --excel=sales/_uji.xlsx`, lalu hapus hasil uji.
- **Cek status semua:** `for f in $(grep -v '^#' antrian-render.txt | tr -d '\r'); do node lib/status-render.js $f; done`.

## 9. Pelajaran teknis (jebakan yang pernah terjadi)

**Cue & timing**
- `w:kata` mencocokkan awalan (`w:ya` kena "yang") → cek dengan `lib/cek-cue.js`, pakai `#n`.
- Durasi kata edge-tts memanjang sebelum tanda baca → merapatkan jeda harus pakai `silencedetect`.

**Render & mesin**
- Font & gambar sudah dimuat saat render pertama (engine menunggu). Ukur teks (auto-fit) secara malas di render pertama,
  bukan saat membangun DOM.
- Emoji yang baru ditambahkan saat animasi harus sudah ada di DOM saat boot (div tersembunyi pemuat emoji). Font
  teks tidak punya emoji → beri kelas yang memakai `Noto Color Emoji`.
- Anton tidak punya glyph `×`.
- Ukur posisi dengan `offsetLeft/Top/Width` (tidak terpengaruh transform), bukan `getBoundingClientRect`.
- `overflow:hidden` pada pembungkus kata memotong efek slam/pop/stretch → hanya untuk efek "naik".
- `opacity < 1` pada elemen `preserve-3d` memipihkan 3D (kartu flip terlihat terbalik) → jangan beri opacity pada
  wadah 3D.
- Filter `blur` animasi menimpa `filter` CSS (logo navy jadi putih) → animasikan pembungkus.
- Kamera yang mundur di luar tekstur memperlihatkan tepi → jepit posisi kamera atau perbesar margin tekstur.
- Scene berdurasi kelipatan birama (`CONFIG.beat`) membuat pola musik global & kartu visual tetap sinkron.
- Render berat bersamaan dengan pekerjaan lain membuat screenshot Playwright timeout → prioritas rendah + retry
  (sudah di `render.js`).

**Windows & alat**
- Path scratchpad yang terlalu panjang membuat Python gagal membuka file (MAX_PATH) → taruh skrip Python di
  `rancangan/sumber/`.
- Backslash di heredoc bash → Python bisa berubah jadi newline. Untuk kode berisi `\`, pakai tool Write/Edit.
- `.bat` yang sedang berjalan dibaca ulang dari disk per baris → jangan diedit saat berjalan.
- Filter drawtext FFmpeg: hindari `:` di label.
- `ffprobe … -of csv=p=0` bisa mencetak koma di akhir (`8.333333,`) → ambil kolom pertama, jangan `Number(baris)`.
- `-shortest` saat mux bisa membuang frame terakhir bila audio 2 ms lebih pendek → untuk versi sales tidak dipakai.

## 10. Ide lanjutan (belum dikerjakan)

- **Aplikasi generator:** LLM (mis. DeepSeek lewat API kompatibel OpenAI) menulis `scenes.js` dalam skema JSON ketat dari
  sebuah brief, lalu validator (cue ada di naskah, aturan brand/hukum, label ilustrasi), build otomatis, cek tata letak
  lewat DOM, pratinjau, dan antrean render.
  - Model teks cukup untuk mengisi tipe scene yang ada. Gaya baru tetap perlu developer + QA visual.
  - Brief berisi data klien jangan dikirim ke penyedia di luar negeri tanpa dasar transfer (UU PDP Pasal 56).
    Alternatif: model open-weights lewat `../ai-onprem/`.
- **TTS berlisensi:** integrasi ElevenLabs/Azure Speech (API key lewat environment variable).
- **Video modul M03–M22, video pendek P01–P32, konsep meme A01–A48:** tinggal dieksekusi dari Excel.
