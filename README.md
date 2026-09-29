# Privasimu Motion — pabrik video iklan Privasimu Nexus

Video iklan dibuat dari **kode**: animasi HTML dirender frame demi frame di Chromium, musik & SFX disintesis sendiri
(bebas royalti), voice-over dari TTS sementara atau rekaman tim (VN), lalu di-mix menjadi MP4 **16:9 dan 9:16**
lengkap dengan subtitle. Satu folder = satu video.

> **Untuk AI / sesi baru:** baca [`CONTEXT.md`](CONTEXT.md) dulu — latar produk, hubungan dengan aplikasi
> (frontend/backend), asal screenshot, aturan konten & hukum, aturan kerja dengan pengguna, dan status semua video.
> Referensi API kit: [`BRIEF-AGEN.md`](BRIEF-AGEN.md) · pustaka gaya: [`PUSTAKA-GAYA.md`](PUSTAKA-GAYA.md).

## Mulai cepat

**Render (tanpa AI):** klik dua kali **`RENDER.bat`**. Semua folder di `antrian-render.txt` dicek; hanya video yang
belum jadi atau sumbernya berubah yang dirender (± 10–15 menit per video). Hasil: `out/<folder>/<folder>-16x9.mp4`
dan `-9x16.mp4`.

```bat
RENDER.bat                             :: cek semua di antrian-render.txt, render hanya yang belum jadi / berubah
RENDER.bat t01-stomp n05-dsr           :: cek/render folder tertentu saja (atau seret folder ke RENDER.bat)
RENDER.bat --paksa n05-dsr             :: render ulang walau sudah jadi
RENDER.bat --audio-only                :: cepat: timeline + audio saja (cek naskah/VN)
```

Selama render berjalan, jangan jalankan pekerjaan berat lain di komputer yang sama (render memakai 4 Chromium +
4 encoder). Jangan mengedit `RENDER.bat` saat sedang berjalan.

## Instalasi

Butuh **Node.js ≥ 20**, **FFmpeg** (ada di PATH), **Python 3** + paket di `requirements.txt`, dan Chromium Playwright.

| Situasi | Langkah |
|---|---|
| Di dalam monorepo `D:/AI/privasimu/motion` (asal repo ini) | `pip install -r requirements.txt` — Playwright dipinjam otomatis dari `../frontend/node_modules` |
| Clone repo ini saja (tanpa monorepo) | `npm install` · `npx playwright install chromium` · `pip install -r requirements.txt` |

`lib/render.js` mencari `playwright-core` di `node_modules` milik motion dulu, lalu di `../frontend`.

## Perintah

```bash
node build.js t01-stomp                 # TTS/VN -> audio -> render 16:9 + 9:16 -> MP4
node build.js t01-stomp --audio-only    # hanya timeline + audio (cepat; untuk cek naskah, durasi, cue)
node build.js t01-stomp --fmt=9x16      # satu format saja
node build.js t01-stomp --tts           # paksa TTS walau ada VN
node lib/cek-cue.js t01-stomp           # cek semua cue 'w:kata' kena kata yang benar (setelah --audio-only)
bash lib/qa-sheet.sh t01-stomp 9x16 6 qa9 0.05 1.9 5.4 8.0 18.05 34.2   # still + lembar kontak -> out/t01-stomp/qa9.jpg
node lib/render.js still t01-stomp 16x9 3 12.5       # still satuan -> out/t01-stomp/stills/
node lib/status-render.js t01-stomp     # sudah dirender & tidak berubah? (dipakai RENDER.bat)
node lib/app-shots.js                   # kurasi ulang screenshot aplikasi -> assets/app (hanya di monorepo)
node lib/demo-audio.js                  # demo efek VO & SFX meme -> out/_demo/
cd rancangan/sumber && python buat_excel.py     # buat ulang Excel rancangan
```

Pratinjau di browser: buka `<folder>/index.html?fmt=9x16` (setelah build; `timeline.js` dibuat oleh build).

Setiap build memverifikasi hasil (gagal bila MP4 tanpa track audio atau senyap); audio dinormalkan ke -14 LUFS.
Setelah render berhasil, sidik jari sumber dicatat di `out/<folder>/render-info.json` sehingga `RENDER.bat` melewati
video yang tidak berubah; rekaman VN baru di `vn/` otomatis memicu render ulang video itu.

## Daftar video (semua sudah dirender per 29-09-2026)

| Kode | Folder | Jenis iklan | Gaya visual | Durasi |
|---|---|---|---|---|
| N01 | `ad2-pp33` | Tools | Papan split-flap, hitung mundur PP 33/2026 | 45 dtk |
| N02 | `ad1-awareness` | Tools | Awareness UU PDP, tampilan asli aplikasi | 54 dtk |
| N03 | `n03-insiden` | Tools | Cyber-noir CCTV, insiden 3×24 jam | 38,5 dtk |
| N04 | `n04-ropa` | Tools | Parodi iklan obat jadul 90-an, RoPA | 50,7 dtk |
| N05 | `n05-dsr` | Tools | Chat pastel + meme, hak subjek data | 43 dtk |
| N06 | `n06-anak` | Tools | Paper-craft, data anak & inklusif | 45,6 dtk |
| N07 | `n07-konsultan` | Konsultasi | Editorial mewah | 45 dtk |
| N08 | `n08-siap-pp33` | Konsultasi + tools | Poster Swiss | 49,4 dtk |
| N09 | `n09-ppdp` | Konsultasi + pelatihan | Arcade RPG | 52 dtk |
| N10 | `n10-holding` | Konsultasi + tools enterprise | Blueprint | 36 dtk |
| N11 | `n11-meme-dpo` | Konten meme (tools) | Kompilasi meme 2026: freeze frame, Things to Say, Polyester Edit, Kinda chic, MLG 2016 | 66,6 dtk |
| M01 | `m01-dasbor` | Video modul (Nexus Explained) | Dasbor Kepatuhan & Postur Privasi; hook "bukan yang paling tebal", screenshot asli berkamera | 45,9 dtk |
| M02 | `m02-gap` | Video modul (Nexus Explained) | GAP Assessment; hook psikologi terbalik "jangan cek skornya", analisis bukti AI | 48,3 dtk |
| A22 | `a22-rekap-dpo` | Konten relate (share) | Rekap Tahunan DPO 2026: slide cerita bergradasi, angka ilustrasi, kartu untuk dibagikan | 46 dtk |
| T01 | `t01-stomp` | Tools (gaya stomp) | Tipografi menghentak tiap ketukan stomp-clap 100 bpm, screenshot asli menghantam | 38,2 dtk |
| T02 | `t02-tipografi` | Awareness → tools (full typography) | Kinetic type tanpa gambar: kamera menjelajah satu kanvas teks lalu mundur jadi poster | 53,6 dtk |
| T03 | `t03-stop-motion` | Relate → tools (stop motion) | Papan gabus 12 fps: huruf guntingan, sticky note, stempel nilai 1/10…0/10 → 10/10 | 51,4 dtk |

Hasil tiap video: `out/<folder>/<folder>-16x9.mp4` (1920×1080) dan `-9x16.mp4` (1080×1920, subtitle karaoke dibakar
kecuali video tipografi), 30 fps, AAC 48 kHz, -14 LUFS, plus `<folder>.srt`. Folder `out/` tidak ikut repo git.

## Isi repo

| Path | Isi |
|---|---|
| `<kode-video>/` | Satu folder per video: `scenes.js` (naskah VO, durasi, cue, SFX, tipe visual), `music.js`, `index.html`, `style.css`/`style.js` (gaya khusus video) |
| `lib/` | Mesin bersama: `engine.js` (waktu, easing, subtitle, pratinjau), `kit.js`/`kit.css`/`kit-events.js` (tipe scene umum), `seri-modul.js`/`.css` (seri "Nexus Explained"), `audio.js` (synth, 53 SFX, mix), `music-kit.js`, `render.js`, `captions.js`, `wordtime.js`, `tts.py`, `vn.js`, `vofx.js`, `status-render.js`, `cek-cue.js`, `qa-sheet.sh`, `app-shots.js`, `contact.js`, `demo-audio.js` |
| `assets/app/` | 32 screenshot ASLI aplikasi yang sudah dipotong & diburamkan (daftar + deskripsi di `manifest.json`) |
| `assets/privasimu_logo.png` | Logo (putih) · `assets/meme/` gambar meme milik sendiri/berlisensi |
| `naskah/` | 17 naskah VO (.txt) untuk direkam tim + `cadangan/` |
| `vn/` | Tempat rekaman tim (tidak ikut repo git) |
| `sfx-kustom/` | SFX milik sendiri/berlisensi → dipakai sebagai `'file:nama'` |
| `rancangan/` | Excel rancangan iklan (flow semua modul, 22 video modul, 32 video pendek, 48 konsep meme, bank sound, efek VO, opsi TTS, kalender) + generator `rancangan/sumber/` |
| `RENDER.bat`, `antrian-render.txt` | Antrean render tanpa AI |
| `RENDER-SALES.bat`, `sales/` | Versi video per sales dari `sales/daftar-sales.xlsx` (`lib/sales.js`, `lib/baca_sales.py`, `lib/buat_template_sales.py`) |
| `BRIEF-AGEN.md`, `PUSTAKA-GAYA.md`, `CONTEXT.md` | Referensi API kit · pustaka gaya · konteks untuk AI |

## Versi per sales (nama + nomor WhatsApp di penutup video)

1. Klik dua kali **`RENDER-SALES.bat`** — bila belum ada, `sales/daftar-sales.xlsx` dibuat dulu.
2. Isi Excel itu: sheet **Sales** (Nama, No. WhatsApp, Aktif = Ya), sheet **Video** (video yang dibuatkan versi sales +
   format 9:16/16:9), sheet **Pengaturan** (teks kontak di layar, pola nama file). Simpan.
3. Klik dua kali `RENDER-SALES.bat` lagi. Hasil di folder video yang sama, mis.
   `out/t01-stomp/t01-stomp-9x16-081234567890.mp4`.

Cara kerjanya: kontak umum `support@privasimu.com · 0851 8318 2722` di penutup diganti `{nama} · WA {telp}`
(parameter `&kontak=` dibaca `lib/engine.js`/`lib/kit.js`), dan **hanya bagian akhir** video (sejak keyframe terakhir
sebelum kontak muncul) yang dirender ulang lalu disambung ke video dasar tanpa encode ulang; suara tetap. ± 20–60 detik
per video per format per sales. Versi yang sudah jadi dilewati otomatis (`out/<folder>/sales-info.json`), jadi menambah
sales baru hanya merender sales itu. Video dasar harus sudah dirender (`RENDER.bat`). Opsi: `RENDER-SALES.bat t01-stomp
--fmt=16x9 --paksa`. A22 tidak punya nomor kontak di CTA-nya (bawaan: tidak dibuatkan versi sales).

`sales/daftar-sales.xlsx` berisi data pribadi (nama & nomor HP) dan **tidak ikut repo git**.

## Memasang VN dari tim

1. Simpan file ke `vn/` dengan nama sesuai kode naskah: `N01_S1.m4a`, `N01_S2.m4a`, … (nomor = urutan scene),
   atau satu file utuh `N01.m4a` dengan jeda ± 2 detik antar bagian (dipotong otomatis). Format apa saja yang dibaca
   FFmpeg (wav, m4a, mp3, ogg/opus VN WhatsApp, …). Scene tanpa suara tidak butuh file (T01 hanya `T01_S2` & `T01_S7`).
2. Klik dua kali `RENDER.bat` — video yang VN-nya baru otomatis dirender ulang; video lain dilewati.

Otomatis: noise dikurangi, hening awal/akhir dipotong, dinamika diratakan, loudness disamakan (-17 LUFS), durasi scene
menyesuaikan tempo rekaman, dan timing kata diselaraskan dari referensi TTS (median error ± 0,06 dtk). Bagian yang
belum direkam sementara memakai TTS.

## Mengubah naskah & opsi scene

- Teks VO ada di `vo` tiap scene di `<folder>/scenes.js`; TTS dibuat ulang otomatis (cache per teks di `vo/`).
- Cue `w:<kata>[#n][±detik]` (SFX & animasi yang jatuh tepat di sebuah kata) harus tetap ada di teks. Cocok awalan:
  `w:ya` bisa kena "yang" — pakai `w:ya#2`. Cek dengan `node lib/cek-cue.js <folder>`.
- Rekaman VN harus membaca teks yang sama dengan `scenes.js`.
- Suara: `CONFIG.voice` (`id-ID-ArdiNeural` / `id-ID-GadisNeural`), `voiceRate`, `voicePitch` (bisa per scene).
- `maxPause`: merapatkan jeda panjang TTS · `capMap`: ejaan fonetis TTS → tulisan subtitle ·
  `voFx`: efek VO (`berat`, `tupai`, `telepon`, `toa`, `robot`, `gema`, `aula`, `bisik`, `lebay`, `nangis`).
- Scene tanpa suara: `vo: ''` + `min` · subtitle bakar mati: `CONFIG.burnCaptions = false` / `s.cap = false` ·
  `CONFIG.beat` membulatkan durasi scene ke ketukan, `s.free = true` untuk scene penutup tanpa pembulatan.

## Catatan lisensi & tayang

- **Suara TTS hanya placeholder** (edge-tts/Read Aloud tidak ditujukan untuk iklan komersial). Untuk tayang pakai VN tim
  atau TTS berlisensi komersial (Azure AI Speech / ElevenLabs berbayar).
- Musik & SFX disintesis di kode (orisinal, bebas royalti). Semua font dari Google Fonts berlisensi OFL/Apache.
- Angka lucu/ilustrasi diberi label di layar; angka di screenshot adalah data demo.
- Sebelum tayang pastikan penawaran masih berlaku ("Start Pre Check gratis", "konsultasi gratis", "Schedule Demo").
  Kontak CTA: support@privasimu.com · 0851 8318 2722 · privasimu.com.
