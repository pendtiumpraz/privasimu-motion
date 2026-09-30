# Produksi seri katalog gaya (1 konten = 1 gaya)

> Permintaan pengguna (30-09-2026): buat SEMUA rancangan di katalog gaya yang gayanya belum pernah dibuat, satu per satu,
> untuk keluarga tipografi, grafis & bentuk, parodi format, sinematik & retro, dan layar & UI. Satu video satu gaya.
> **Render tetap urusan pengguna** (klik dua kali `RENDER.bat`); AI hanya merakit, membangun audio, dan cek still.

## Urutan

1. Tipografi (TY) → 2. Grafis & bentuk (GB) → 3. Parodi format (PF) → 4. Sinematik & retro (SN) → 5. Layar & UI (UI).
Di dalam keluarga, ikuti skor prioritas (kolom Peringkat di sheet Katalog Gaya). Daftar yang belum dibuat:

```bash
cd rancangan/sumber && python _daftar.py TY,GB,PF,SN,UI ringkas     # atau: python _daftar.py TY detail
```

Status = kolom Status di katalog (`gaya_*.py`): `Bisa` = belum dibuat, `Sudah (KODE)` = sudah dirakit.
Craft (CR) dan struktur edit (SE) tidak termasuk permintaan ini.

## Langkah per video

```bash
node lib/baru.js ty45-tes-mata "TY45 · Baca Baris Paling Bawah" "Font+Google:wght@400;700"   # folder + DRAF + index.html + music.js
#   tulis scenes.js (CONFIG.meta + bidang `layar` tiap scene), style.js, style.css
cmd //c "start /belownormal /wait /b node build.js ty45-tes-mata --audio-only"                  # TTS + timeline + audio
node lib/cek-cue.js ty45-tes-mata                                                                # cue kata harus tepat
node lib/qa.js ty45-tes-mata                                                                     # still 2 format + cek teks terpotong
#   lihat out/<folder>/qa-16x9.jpg dan qa-9x16.jpg, perbaiki, ulangi
node lib/siap.js ty45-tes-mata                                                                   # naskah VN + tandai katalog + hapus DRAF
```

- Selama berkas `DRAF` ada di folder, `RENDER.bat` melewati video itu. `siap.js` menghapusnya.
- Tiap beberapa video: `cd rancangan/sumber && python buat_excel.py && python cek_rumus.py` lalu `node lib/daftar-video.js`.
- Sebelum menjalankan build/QA, cek apakah pengguna sedang merender (proses `node build.js` / `ffmpeg`). Bila ya, cukup
  menulis berkas dulu; build & QA dijalankan dengan prioritas rendah (sudah otomatis di `qa.js`).

## Aturan isi (ringkas; lengkapnya di CONTEXT.md bagian 3)

- Nama folder = `<kode gaya huruf kecil>-<slug>`; `CONFIG.naskah` = kode gaya (mis. `TY45`), dipakai nama file VN.
- Hook terlihat sejak frame pertama. Alur: hook → masalah → fitur nyata → CTA. Durasi 12–25 detik.
- Fitur hanya dari `backend/resources/konten/fakta_produk.json` atau screenshot asli (`assets/app/`, lewat `PD.layar`).
- Angka yang bukan fakta produk/hukum diberi label "*ilustrasi" di layar dan dicatat di `CONFIG.meta.fakta`.
- "Pihak ketiga", bukan "vendor" (`siap.js` menolak bila ada). Tanpa wajah, nama, merek, atau suara pihak lain.
- Komposisi edukasi vs meme mengikuti kolom "Meme %" katalog; tulis di `CONFIG.meta.komposisi`.
- Kartu penutup memakai `PD.cta` (kontak umum harus persis `support@privasimu.com · 0851 8318 2722` supaya versi per
  sales bisa menggantinya); warnanya diatur lewat variabel CSS `.pd-cta { --pd-… }` agar ikut gaya video.
- Semua gerak = fungsi murni dari waktu. Elemen yang menyambung antarscene ditaruh di `PD.lapis()` dan digambar dari
  waktu global (`sc.start + lt`).

## Pustaka bersama

`lib/pendek.js` + `lib/pendek.css`: `PD.sync`, `PD.kata`, `PD.tampil`, `PD.huruf`, `PD.muat`, `PD.cta`, `PD.layar`, `PD.lapis`,
tipe scene `pd_cta`. Jangan mengubah perilaku fungsi yang sudah ada (video yang sudah dirender bergantung padanya);
tambah fungsi baru bila perlu.
