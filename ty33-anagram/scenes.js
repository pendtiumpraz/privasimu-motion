// TY33 — ANAGRAM "NAMA ↔ AMAN": empat kartu huruf bertukar tempat. Huruf yang sama bisa berarti sekadar "nama" atau
// "aman"; bedanya hanya cara mengaturnya → data pelanggan yang tercatat rapi di register RoPA.
// Hook (anomali): "NAMA dan AMAN tersusun dari empat huruf yang sama."
// Komposisi: 90% edukasi · 10% meme. Satu gaya: anagram (huruf pindah tempat lewat lengkungan).
(function (root) {
  const CONFIG = {
    title: 'TY33 · NAMA ↔ AMAN (anagram)',
    naskah: 'TY33',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 100 / 2,
    tail: 0.35,
    burnCaptions: false, // kalimat VO sudah tampil di layar sebagai bagian desain; .srt tetap dibuat
    music: { bpm: 100, mode: 'major', root: 57, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.8 },
    meta: {
      judul: 'NAMA ↔ AMAN',
      gaya: 'Anagram (huruf bertukar tempat)',
      tampilan: 'empat kartu huruf warna-warni pindah tempat lewat lengkungan; NAMA menjadi AMAN',
      jenisHook: 'Anomali',
      hook: '"NAMA dan AMAN tersusun dari empat huruf yang sama."',
      komposisi: '90% edukasi · 10% meme',
      fakta: [
        'RoPA (catatan kegiatan pemrosesan): wizard bertahap, kode rekaman otomatis, alur Maker–Reviewer–Approver dengan riwayat perubahan, setiap perubahan tercatat di log audit (fakta_produk.json: ropa).',
        'Layar yang tampil = register RoPA asli (assets/app/ropa-list-baru.png); isinya data demo.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const A = (o) => ({ type: 'an', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 3.5, voDelay: 0.3, mus: 'hook',
      vo: 'NAMA dan AMAN, tersusun dari empat huruf yang sama.',
      layar: 'Empat kartu huruf N-A-M-A. Saat "AMAN" diucapkan, N melompat ke ujung dan tiga huruf lain bergeser: AMAN. Di "empat", tiap kartu berdenyut bergantian (1-2-3-4).',
      sfx: [['w:AMAN-0.05', 'whoosh', 0.4], ['w:AMAN+0.62', 'pop', 0.45], ['w:empat', 'tick', 0.4], ['w:empat+0.16', 'tick', 0.4], ['w:empat+0.32', 'tick', 0.4], ['w:empat+0.48', 'tick', 0.45]],
      vis: A({ tukar: 'w:AMAN-0.05', hitung: 'w:empat', teks: 'tersusun dari empat huruf yang *sama*.', label: 'NAMA ↔ AMAN' }),
    },
    {
      id: 's2', min: 3, voDelay: 0.2, mus: 'main',
      vo: 'Bedanya cuma satu: cara mengaturnya.',
      layar: 'Kartu berhamburan miring-miring, lalu di "mengaturnya" kembali berbaris menjadi AMAN; garis bawah dan centang muncul.',
      sfx: [['w:Bedanya', 'paper', 0.4], ['w:mengaturnya-0.05', 'whoosh', 0.35], ['w:mengaturnya+0.45', 'check', 0.5]],
      vis: A({ acak: 'w:Bedanya-0.05', rapi: 'w:mengaturnya-0.05', teks: 'Bedanya cuma satu: *cara mengaturnya*.' }),
    },
    {
      id: 's3', min: 5, voDelay: 0.2, mus: 'main',
      vo: 'Data pelanggan juga begitu. Di RoPA, semuanya tercatat rapi, lengkap dengan jejak auditnya.',
      layar: 'Kartu AMAN mengecil ke atas sebagai kepala. Register RoPA asli naik ke layar; label "kode otomatis", "riwayat perubahan", "log audit" muncul.',
      sfx: [['w:RoPA-0.1', 'whoosh', 0.35], ['w:tercatat', 'pop', 0.35], ['w:jejak', 'pop', 0.35], ['w:auditnya+0.3', 'ding', 0.35]],
      vis: A({
        kepala: 0.15, teks: 'Di RoPA, semuanya *tercatat rapi*.', teksAt: 'w:Di', layar: 'w:RoPA-0.1',
        cip: [['kode otomatis', 'w:tercatat'], ['riwayat perubahan', 'w:lengkap'], ['log audit', 'w:jejak']],
      }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.6,
      vo: 'Privasimu Nexus. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo Privasimu Nexus, "Huruf yang sama. Cara mengatur yang berbeda.", tombol privasimu.com, kontak.',
      sfx: [[0.1, 'shimmer', 0.3], ['w:Cek', 'pop', 0.4]],
      vis: A({ cta: { terang: true, tag: 'Huruf yang sama.|*Cara mengatur* yang berbeda.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
