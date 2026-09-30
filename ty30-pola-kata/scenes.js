// TY30 — POLA KATA BERULANG "12 Definisi Patuh": layar penuh kata PATUH ×12 seperti wallpaper, tiap sel berbeda
// gaya huruf (12 "definisi"); kamera mendekat ke sel yang aneh; lalu semua diseragamkan → dasbor grup.
// Hook (anomali): "1 grup usaha. 12 anak perusahaan. 12 definisi 'patuh'."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: grid teks; satu sel berubah; kamera mendekat ke sel itu.
(function (root) {
  const CONFIG = {
    title: 'TY30 · 12 Definisi Patuh (pola kata berulang)',
    naskah: 'TY30',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+7%',
    maxPause: 0.4,
    beat: 60 / 108 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 108, mode: 'major', root: 55, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.8 },
    meta: {
      judul: '12 Definisi Patuh',
      gaya: 'Pola kata berulang',
      tampilan: 'grid 12 sel bertuliskan PATUH, tiap sel beda font/warna/gaya; kamera mendekat ke sel yang aneh; lalu semua diseragamkan; header dasbor grup asli',
      jenisHook: 'Anomali',
      hook: '"1 grup usaha. 12 anak perusahaan. 12 definisi \'patuh\'."',
      komposisi: '70% edukasi · 30% meme',
      sasaran: 'holding / grup usaha, direksi, DPO grup',
      fakta: [
        'Holding Group Dashboard (monitoring & manajemen compliance seluruh anak perusahaan) terlihat di layar asli assets/app/holding-header.png (tanpa data grup).',
        'Angka "12 anak perusahaan" = ilustrasi; tanpa nama grup/perusahaan nyata.',
        'CTA "konsultasi gratis": pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const P0 = (o) => ({ type: 'pk', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4, voDelay: 0.35, mus: 'main',
      vo: 'Satu grup usaha. Dua belas anak perusahaan.',
      layar: 'Grid 12 sel muncul cepat, tiap sel bertuliskan PATUH dengan gaya huruf berbeda-beda.',
      sfx: [['w:Dua', 'pop', 0.3], ['w:Dua+0.12', 'pop', 0.3], ['w:Dua+0.24', 'pop', 0.3], ['w:Dua+0.36', 'pop', 0.3], ['w:Dua+0.48', 'pop', 0.3], ['w:Dua+0.6', 'pop', 0.3]],
      vis: P0({ muncul: 'w:Dua-0.1', teks: '1 grup usaha. *12 anak perusahaan.*' }),
    },
    {
      id: 's2', min: 4.5, voDelay: 0.25, mus: 'play',
      vo: 'Dua belas definisi patuh. Termasuk yang ini.',
      layar: 'Tiap sel berdenyut bergantian; di "yang ini", kamera mendekat ke sel "patuh (nanti)".',
      sfx: [['w:definisi', 'tick', 0.3], ['w:yang', 'whoosh', 0.3], ['w:ini+0.3', 'sadtrombone', 0.35]],
      vis: P0({ denyut: 'w:definisi', dekat: 'w:yang', teks: '12 definisi *patuh*.' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.25, mus: 'main',
      vo: 'Satu standar untuk semua anak usaha, dipantau dari dasbor grup.',
      layar: 'Kamera mundur; sapuan biru menyeragamkan semua sel jadi PATUH ✓ yang sama; header Holding Group Dashboard asli masuk di atas.',
      sfx: [['w:Satu', 'sweep', 0.45], ['w:semua', 'check', 0.4], ['w:dasbor-0.1', 'whoosh', 0.3]],
      vis: P0({ jauh: 'w:Satu-0.2', seragam: 'w:Satu', layar: 'w:dasbor-0.1', teks: 'Satu standar, *dipantau dari dasbor grup*.' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Untuk grup usaha: konsultasi gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo, "12 anak usaha, 1 definisi patuh.", tombol privasimu.com, "Konsultasi gratis", kontak.',
      sfx: [['w:konsultasi', 'pop', 0.4]],
      vis: P0({ cta: { tag: '12 anak usaha,|*1 definisi* patuh.', at: 0.15, btnAt: 'w:konsultasi', sub: '*Konsultasi gratis* untuk grup usaha' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
