# Motion graphics iklan Privasimu

Video iklan dibuat dari kode: animasi HTML di-render per frame, musik dan SFX disintesis (bebas royalti), voice-over
dari TTS atau rekaman tim (VN), lalu di-mix jadi MP4 16:9 dan 9:16 lengkap dengan subtitle.

## Isi folder

| Path | Isi |
|---|---|
| `ad1-awareness/`, `ad2-pp33/`, `n03-insiden/` … `n11-meme-dpo/`, `m01-dasbor/`, `m02-gap/`, `a22-rekap-dpo/`, `t01-stomp/`, `t02-tipografi/`, `t03-stop-motion/` | Satu folder per video (lihat **Daftar video**): `scenes.js` (naskah VO, durasi, SFX), `music.js`, animasi di `index.html` (ad1/ad2) atau kit + `style.css`/`style.js` (N03 dst.). Video modul (M..) memakai kit seri "Nexus Explained" (`lib/seri-modul.js`/`.css`: tipe `nx_text`, `nx_shot`, `nx_cta`) |
| `naskah/` | 17 naskah VO (.txt) untuk direkam tim (N01–N11, M01, M02, A22, T01–T03; N11 = 3 suara); `cadangan/` berisi 2 naskah tambahan |
| `vn/` | Taruh rekaman tim di sini (lihat bawah) |
| `sfx-kustom/` | SFX milik sendiri/berlisensi (mis. teriakan "AAAHHH!" rekaman tim) → dipakai sebagai `'file:nama'` |
| `assets/meme/` | Gambar/foto meme milik sendiri/berlisensi → dipakai sebagai stiker `{ img: '../assets/meme/x.png' }` |
| `assets/app/` | Screenshot ASLI aplikasi (dari `dataroom/` & `frontend/tmp/audit4/`, file sumber tidak diubah), dipotong dan area sensitif diburamkan oleh `node lib/app-shots.js`; isi tiap gambar di `manifest.json` |
| `lib/` | Engine bersama: `engine.js` (format, subtitle, pratinjau), `audio.js` (synth, SFX meme, mix), `render.js`, `vn.js`, `captions.js`, `tts.py`; kit scene: `kit.js`, `kit.css`, `kit-events.js`, `music-kit.js` |
| `PUSTAKA-GAYA.md` | Pustaka efek/gaya (CapCut, paper animation, meme edit, B2B) + resep teknis + pemetaan per video |
| `BRIEF-AGEN.md` | Referensi API kit untuk membuat video baru (tipe scene, stiker, meme, hook gaya, SFX, musik) |
| `out/<iklan>/` | Hasil: `<iklan>-16x9.mp4`, `<iklan>-9x16.mp4`, `<iklan>.srt`, `audio-master.m4a`, `music-sfx-tanpa-vo.wav` |
| `vo/` | Cache TTS & VN yang sudah dibersihkan (boleh dihapus) |
| `RENDER.bat` + `antrian-render.txt` | Antrean render tanpa Claude: klik dua kali `RENDER.bat` (lihat Perintah). Video yang sudah dirender dan sumbernya tidak berubah dilewati otomatis (catatan sidik jari di `out/<folder>/render-info.json`, dicek `lib/status-render.js`); rekaman VN baru di `vn/` otomatis memicu render ulang video itu |
| `rancangan/` | Excel rancangan iklan & video (flow unggulan, 22 video modul, video pendek, 48 konsep meme, bank sound, efek VO, opsi TTS); generator di `rancangan/sumber/` |
| `out/_demo/` | Demo audio: `demo-efek-vo.mp3` (11 efek VO) & `demo-sfx-meme.mp3` (25 SFX meme sintetis) |

## Daftar video

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
| N11 | `n11-meme-dpo` | Konten meme (tools) | Kompilasi meme TikTok 2026: freeze frame, Things to Say, Polyester Edit, Kinda chic, MLG 2016 | 66,6 dtk |
| M01 | `m01-dasbor` | Video modul (Nexus Explained) | Dasbor Kepatuhan & Postur Privasi; hook "bukan yang paling tebal", screenshot asli berkamera | 45,9 dtk |
| M02 | `m02-gap` | Video modul (Nexus Explained) | GAP Assessment; hook psikologi terbalik "jangan cek skornya", analisis bukti AI | 48,3 dtk |
| A22 | `a22-rekap-dpo` | Konten relate (share) | Rekap Tahunan DPO 2026: slide cerita bergradasi, angka ilustrasi, kartu untuk dibagikan | 46 dtk |
| T01 | `t01-stomp` | Tools (gaya stomp) | Tipografi menghentak tiap ketukan stomp-clap 100 bpm, screenshot asli menghantam; hook "12 spreadsheet · 7 folder · 3 grup chat · 1 DPO" | 38,2 dtk |
| T02 | `t02-tipografi` | Awareness → tools (full typography) | Kinetic type tanpa gambar: kamera menjelajah satu kanvas teks lalu mundur jadi poster; hook "Jangan tonton video ini…" | 53,6 dtk |
| T03 | `t03-stop-motion` | Relate → tools (stop motion) | Papan gabus 12 fps: huruf guntingan, sticky note, stempel nilai 1/10…0/10 → 10/10 | 51,4 dtk |

Hasil tiap video: `out/<folder>/<folder>-16x9.mp4` (1920×1080) dan `-9x16.mp4` (1080×1920, subtitle karaoke
dibakar), 30 fps, AAC 48 kHz, -14 LUFS, plus `<folder>.srt`.

## Perintah

```bat
RENDER.bat                             :: cek semua folder di antrian-render.txt, render HANYA yang belum jadi / berubah (10-15 menit/video)
RENDER.bat t01-stomp n05-dsr           :: cek/render folder tertentu saja (atau seret folder ke RENDER.bat)
RENDER.bat --paksa n05-dsr             :: render ulang walau sudah jadi
RENDER.bat --audio-only                :: cepat: timeline + audio saja (cek naskah/VN)
```

```bash
node build.js ad2-pp33                 # TTS/VN -> audio -> render 16:9 + 9:16 -> MP4 (± 5 menit)
node build.js ad1-awareness --fmt=9x16 # satu format saja
node build.js ad2-pp33 --audio-only    # hanya timeline + audio (cepat, untuk cek naskah/durasi)
node build.js ad2-pp33 --tts           # paksa TTS walau ada VN
node lib/render.js still ad2-pp33 9x16 3 12.5 30   # cek frame -> out/ad2-pp33/stills/
node lib/demo-audio.js                 # buat ulang demo efek VO & SFX meme -> out/_demo/
cd rancangan/sumber && python buat_excel.py        # buat ulang Excel rancangan
```

Setiap build memverifikasi hasil: gagal bila MP4 tidak punya track audio atau audionya senyap.
Audio dinormalkan ke -14 LUFS (standar YouTube/Instagram/TikTok).

Pratinjau di browser: buka `ad2-pp33/index.html?fmt=9x16` lalu klik tombol putar (audio muncul setelah build).

## Memasang VN dari tim

1. Simpan file ke `vn/` dengan nama sesuai kode naskah: `N01_S1.m4a`, `N01_S2.m4a`, … (satu file per bagian),
   atau satu file utuh `N01.m4a` dengan jeda ± 2 detik antar bagian (dipotong otomatis).
   Format apa saja yang dibaca FFmpeg: wav, m4a, mp3, ogg/opus (VN WhatsApp), dll.
2. Jalankan `node build.js <folder>` sesuai tabel **Daftar video**, mis. `node build.js n05-dsr` untuk VN `N05_…`.
   Video lain tidak ikut berubah.

Otomatis: noise dikurangi, hening awal/akhir dipotong, dinamika diratakan, loudness disamakan (-17 LUFS), durasi scene
menyesuaikan tempo rekaman, dan timing kata diselaraskan dari referensi TTS lewat jeda nyata di rekaman
(diuji dengan rekaman simulasi: median error 0,06 dtk). Bagian yang belum direkam sementara memakai TTS.

## Mengubah naskah

- Teks VO ada di `vo` tiap scene di `<iklan>/scenes.js`. TTS dibuat ulang otomatis (cache per teks).
- Cue `w:<kata>` (SFX & animasi yang jatuh tepat di sebuah kata) harus tetap ada di teks, kalau tidak build berhenti dengan pesan jelas.
- Rekaman VN harus membaca teks yang sama dengan `scenes.js`.
- Suara TTS: `CONFIG.voice` (`id-ID-ArdiNeural` / `id-ID-GadisNeural`), tempo: `CONFIG.voiceRate`, nada: `voicePitch` (mis. `'-14Hz'`);
  ketiganya bisa diatur per scene (N11 memakai 3 "pemeran" dari 2 suara).
- `CONFIG.maxPause` / `s.maxPause` (detik): merapatkan jeda panjang TTS di titik/tanda tanya (ritme video meme). VN tim tidak diubah.
- `CONFIG.capMap`: ejaan fonetis untuk TTS -> tulisan di subtitle, mis. `['hev', 'have']`, `['kainda syik', 'Kinda chic']`.
- Efek VO per scene: `voFx: 'berat' | 'tupai' | 'telepon' | 'toa' | 'robot' | 'gema' | 'aula' | 'bisik' | 'lebay' | 'nangis'` (lib/vofx.js; berlaku juga untuk VN tim). Dengar di `out/_demo/demo-efek-vo.mp3`.
- Scene tanpa suara: `vo: ''` + `min` (durasi) — murni musik & visual (T01 stomp). Nomor VN tetap mengikuti urutan scene
  (mis. T01 hanya punya `T01_S2` dan `T01_S7`).
- Subtitle bakar (9:16) bisa dimatikan untuk video tipografi: `CONFIG.burnCaptions = false` atau `s.cap = false` per scene;
  file `.srt` tetap lengkap.
- `CONFIG.beat` membulatkan durasi scene ke ketukan (T01: 1 birama). `s.free = true` = scene tanpa pembulatan (penutup).

## Catatan

- **Suara TTS hanya placeholder.** edge-tts memakai layanan Read Aloud Microsoft Edge yang tidak ditujukan untuk iklan
  komersial. Untuk tayang, pakai VN tim, atau suara yang sama lewat Azure AI Speech dengan lisensi komersial.
- Musik & SFX disintesis di `lib/audio.js` dan `<iklan>/music.js` (orisinal, bebas royalti). Font: Plus Jakarta Sans &
  JetBrains Mono (SIL OFL). Logo: `assets/privasimu_logo.png`.
- Elemen ilustrasi (bukan data nyata): penghitung "data terekspos", skor kepatuhan 38→94%, "42 dari 48 pertanyaan".
- Sebelum tayang, pastikan penawaran masih berlaku: "konsultasi gratis" (N07, N08, N10) dan "Start Pre Check /
  pre-assessment gratis" (N03, N04, N06, N09). Kontak di CTA: support@privasimu.com · 0851 8318 2722 (dari privasimu.com).
- Dependensi: Node, FFmpeg, Python + `pip install edge-tts`, Chromium Playwright dari `../frontend/node_modules`.
- Saat render berjalan, jangan jalankan pekerjaan berat lain di komputer yang sama (build lain, game, dsb.): render memakai
  4 Chromium + 4 encoder sekaligus. Frame yang macet kini ditunggu sampai 2 menit dan dicoba ulang 3x otomatis.
