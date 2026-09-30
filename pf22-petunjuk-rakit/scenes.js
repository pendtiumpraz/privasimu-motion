// PF22 — PETUNJUK PERAKITAN "Cara Merakit Kepatuhan": lembar instruksi rakit-sendiri (gambar garis, nomor langkah,
// panah, sisa baut) yang membingungkan → versi Nexus: wizard RoPA 7 langkah rapi + modal "Buat RoPA Baru" asli.
// Hook (relate): "Langkah 1 dari 48. Sisa baut: 3."
// Komposisi: 60% edukasi · 40% meme. Satu gaya: ilustrasi garis ala petunjuk perakitan (gambar sendiri, tanpa merek furnitur).
(function (root) {
  const CONFIG = {
    title: 'PF22 · Cara Merakit Kepatuhan (petunjuk perakitan)',
    naskah: 'PF22',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+10%',
    maxPause: 0.4,
    beat: 60 / 100 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 100, mode: 'major', root: 57, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.7 },
    meta: {
      judul: 'Cara Merakit Kepatuhan',
      gaya: 'Petunjuk perakitan',
      tampilan: 'lembar putih bergaris tepi hitam; gambar garis hitam (orang bertanya, keping berlabel modul, baut, panah) yang tergambar sendiri; nomor langkah besar; versi rapi 7 langkah wizard + kartu modal RoPA asli',
      jenisHook: 'Relate',
      hook: '"Langkah 1 dari 48. Sisa baut: 3."',
      komposisi: '60% edukasi · 40% meme',
      rekam: ['ropa-baru'],
      fakta: [
        'RoPA (fakta_produk.json): wizard bertahap untuk mencatat tujuan, dasar pemrosesan, kategori data, subjek, penerima, retensi, dan pengamanan; data spesifik menandai risiko TINGGI; RoPA risiko TINGGI otomatis membuat draf DPIA.',
        'Modal "Buat RoPA Baru" = tangkapan asli assets/app/ropa-baru.png, dipotong di atas kolom entitas (nama organisasi tidak tampil).',
        '"48 langkah" dan "sisa baut" = lelucon petunjuk perakitan; bukan angka produk.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const R = (o) => ({ type: 'pr', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.5, mus: 'hook',
      vo: 'Langkah satu, dari empat puluh delapan. Sisa baut: tiga.',
      layar: 'Lembar "PETUNJUK PERAKITAN · KEPATUHAN PDP", langkah 1/48: orang garis kebingungan, tumpukan keping RoPA/DPIA/DSR/CONSENT/INSIDEN, "SISA BAUT: 3" dengan tiga baut.',
      sfx: [[0.1, 'whoosh', 0.3], ['w:Langkah', 'tick', 0.25], ['w:Sisa', 'pop', 0.3]],
      vis: R({ langkah: [[0, 'w:Langkah']], teks: 'Langkah *1 dari 48*. Sisa baut: 3.' }),
    },
    {
      id: 's2', min: 6, voDelay: 0.3, mus: 'tense',
      vo: 'Panel A ke lubang B. Ternyata B ada di halaman lain. Panel terbalik. Ulangi dari langkah dua.',
      layar: 'Lembar berganti cepat: 2/48 (Panel A → lubang B, "lihat hlm. 31"), 17/48 (keping terbalik, tanda ✗), 31/48 (panah memutar "ulangi dari langkah 2", sisa baut 5).',
      sfx: [['w:Panel', 'tick', 0.25], ['w:Ternyata', 'tick', 0.25], ['w:terbalik', 'hit', 0.3], ['w:Ulangi', 'whoosh', 0.3]],
      vis: R({ langkah: [[1, 'w:Panel'], [2, 'w:terbalik-0.3'], [3, 'w:Ulangi']], teks: 'Panel terbalik. *Ulangi dari langkah 2*.' }),
    },
    {
      id: 's3', min: 5, voDelay: 0.3, mus: 'main',
      vo: 'Di Privasimu Nexus, RoPA dirakit lewat wizard tujuh langkah: dari tujuan, sampai pengamanan. Sisa baut: nol.',
      layar: 'Lembar rapi "WIZARD RoPA · 7 LANGKAH": tujuh lingkaran bernomor tercentang saat disebut; "SISA BAUT: 0 ✓"; kartu modal "Buat RoPA Baru" asli.',
      sfx: [['w:Di', 'whoosh', 0.4], ['w:tujuan', 'tick', 0.2], ['w:tujuan+0.35', 'tick', 0.2], ['w:tujuan+0.7', 'tick', 0.2], ['w:tujuan+1.05', 'tick', 0.2], ['w:tujuan+1.4', 'tick', 0.2], ['w:tujuan+1.75', 'tick', 0.2], ['w:pengamanan', 'tick', 0.2], ['w:nol', 'ding', 0.35]],
      vis: R({ rapi: 'w:Di', centang: ['w:tujuan', 'w:pengamanan'], nol: 'w:nol', layar: { nama: 'ropa-baru', potong: [194, 25, 876, 175], at: 'w:wizard', judul: 'RoPA · Buat RoPA Baru' } }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Rakit kepatuhan tanpa sisa baut. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Rakit kepatuhan, tanpa sisa baut.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: R({ cta: { tag: 'Rakit kepatuhan,|*tanpa sisa baut*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
