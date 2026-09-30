// PF35 — KARTU KOLEKSI "Kartu Modul": kartu koleksi bergambar (desain sendiri) dengan nama, kelangkaan, kemampuan, dan
// angka kekuatan yang menghitung; kartu dibalik (flip) dengan kilau holografik: RoPA, DPIA, DSR → set lengkap 7 kartu; CTA.
// Hook (anomali): "Kartu langka: DPIA. Kemampuan: menilai sebelum terlambat."
// Komposisi: 40% edukasi · 60% meme. Satu gaya: kartu koleksi flip + kilau + angka menghitung.
(function (root) {
  const CONFIG = {
    title: 'PF35 · Kartu Modul (kartu koleksi)',
    naskah: 'PF35',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 108 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 108, mode: 'major', root: 55, lead: 'bell', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.75 },
    meta: {
      judul: 'Kartu Modul',
      gaya: 'Kartu koleksi',
      tampilan: 'meja beludru ungu; kartu koleksi bertepi emas (punggung berpola logo) dibalik satu per satu: gambar ikon modul, nama, label kelangkaan, kemampuan, angka kekuatan menghitung, kilau holografik menyapu; akhir: kipas 7 kartu "SET LENGKAP"',
      jenisHook: 'Anomali',
      hook: '"Kartu langka: DPIA. Kemampuan: menilai sebelum terlambat."',
      komposisi: '40% edukasi · 60% meme',
      fakta: [
        'RoPA: wizard bertahap 7 langkah (tujuan, dasar, kategori data, subjek, penerima, retensi, pengamanan); data spesifik → risiko TINGGI; kode ROPA-TAHUN-NOMOR.',
        'DPIA: matriks kemungkinan × dampak 5×5 (25 sel); register risiko + rencana mitigasi; draf otomatis dari RoPA berisiko TINGGI.',
        'DSR: tenggat otomatis 72 jam; verifikasi identitas; alur Handler–Reviewer–Approver; formulir yang dapat disematkan.',
        'Set lengkap = modul platform (fakta_produk.json): RoPA, DPIA, DSR, Consent, Insiden, Pihak ketiga, Transfer lintas negara. Label kelangkaan = lelucon.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const K = (o) => ({ type: 'kk', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.5, mus: 'hook',
      vo: 'Kartu langka: DPIA. Kemampuan: menilai sebelum terlambat.',
      layar: 'Tiga kartu tertutup di meja; kartu tengah (DPIA) dibalik dengan kilau: gambar perisai-matriks, "SANGAT LANGKA", kemampuan, kekuatan 25 (matriks 5×5) menghitung.',
      sfx: [[0.1, 'whoosh', 0.3], ['w:DPIA', 'ding', 0.4], ['w:Kemampuan', 'tick', 0.25]],
      vis: K({ buka: [[1, 'w:DPIA-0.2']] }),
    },
    {
      id: 's2', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Kartu awal: RoPA, mencatat semuanya dalam tujuh langkah. Kartu penjaga: DSR, tenggat tujuh puluh dua jam otomatis.',
      layar: 'Kartu kiri (RoPA) dibalik: kekuatan 7 langkah; kartu kanan (DSR) dibalik: kekuatan 72 jam; kilau menyapu tiap kartu.',
      sfx: [['w:RoPA', 'ding', 0.4], ['w:DSR', 'ding', 0.4], ['w:tenggat', 'tick', 0.25]],
      vis: K({ buka: [[0, 'w:RoPA-0.2'], [2, 'w:DSR-0.2']] }),
    },
    {
      id: 's3', min: 5.5, voDelay: 0.3, mus: 'main',
      vo: 'Kumpulkan semuanya: Consent, Insiden, Pihak ketiga, Transfer. Satu set lengkap, di Privasimu Nexus.',
      layar: 'Empat kartu lagi muncul di belakang membentuk kipas; lencana emas "SET LENGKAP 7/7".',
      sfx: [['w:Consent', 'pop', 0.3], ['w:Insiden', 'pop', 0.3], ['w:Pihak', 'pop', 0.3], ['w:Transfer', 'pop', 0.3], ['w:lengkap', 'ding', 0.45]],
      vis: K({ set: ['w:Consent', 'w:Insiden', 'w:Pihak', 'w:Transfer'], lencana: 'w:lengkap' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Kumpulkan set lengkapnya. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Kumpulkan set lengkapnya.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: K({ cta: { tag: 'Kumpulkan|*set lengkapnya*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
