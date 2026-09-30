// TY27 — HURUF 3D / ISOMETRIK "Kota PP 33": huruf PP 33 berdiri seperti gedung bersisi; dibangun lantai demi lantai;
// jendela menyala saat program siap PP 33 disebutkan.
// Hook (anomali): "Bangunan ini selesai 16 Januari 2027. Kantormu sudah punya kuncinya?"
// Komposisi: 50% edukasi · 50% meme. Satu gaya: ekstrusi teks (lapisan bayangan bertumpuk) + kamera orbit kecil.
(function (root) {
  const CONFIG = {
    title: 'TY27 · Kota PP 33 (huruf 3D isometrik)',
    naskah: 'TY27',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+6%',
    maxPause: 0.4,
    beat: 60 / 96 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 96, mode: 'major', root: 55, lead: 'keys', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.8 },
    meta: {
      judul: 'Kota PP 33',
      gaya: 'Huruf 3D / isometrik',
      tampilan: 'huruf PP 33 sebagai gedung bersisi biru di atas tanah isometrik; dibangun lantai demi lantai; papan tanggal; jendela menyala',
      jenisHook: 'Anomali',
      hook: '"Bangunan ini selesai 16 Januari 2027. Kantormu sudah punya kuncinya?"',
      komposisi: '50% edukasi · 50% meme',
      rekam: ['"PP 33" dibaca "pe-pe tiga puluh tiga".'],
      fakta: [
        'PP 33/2026 (peraturan pelaksana UU PDP) berlaku 16 Januari 2027. Cek ulang tanggal sebelum tayang.',
        'GAP Assessment: kuesioner kepatuhan UU PDP, skor dan rencana remediasi (fakta_produk.json: gap-assessment). "Program siap PP 33" = nama program pendampingan; pastikan masih ditawarkan.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const K = (o) => ({ type: 'k3', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.4, mus: 'hook',
      vo: 'Bangunan ini selesai enam belas Januari dua ribu dua puluh tujuh.',
      layar: 'Huruf PP 33 tumbuh lantai demi lantai dari tanah isometrik (bunyi konstruksi); papan tanggal 16 · 01 · 2027 naik di depannya.',
      sfx: [[0.3, 'clank', 0.4], [0.75, 'clank', 0.4], [1.2, 'clank', 0.4], [1.65, 'clank', 0.4], [2.1, 'clank', 0.4], ['w:enam', 'stamp', 0.4]],
      vis: K({ bangun: 0.2, tanggal: 'w:enam', teks: 'Selesai *16 Januari 2027*.' }),
    },
    {
      id: 's2', min: 3, voDelay: 0.25, mus: 'tense',
      vo: 'Kantormu sudah punya kuncinya?',
      layar: 'Kunci besar berputar di depan gedung dengan tanda tanya.',
      sfx: [['w:kuncinya', 'coin', 0.45]],
      vis: K({ kunci: 'w:kuncinya-0.3', teks: 'Kantormu sudah punya *kuncinya?*' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.25, mus: 'main',
      vo: 'Program siap PP tiga puluh tiga: GAP Assessment, rencana perbaikan, dan bukti yang tersusun rapi.',
      layar: 'Jendela-jendela gedung menyala satu per satu; cip: GAP Assessment · rencana perbaikan · bukti tersusun.',
      sfx: [['w:GAP', 'blip', 0.35], ['w:rencana', 'blip', 0.35], ['w:bukti', 'blip', 0.35], ['w:rapi', 'levelup', 0.4]],
      vis: K({ nyala: 'w:Program', cip: [['GAP Assessment', 'w:GAP'], ['rencana perbaikan', 'w:rencana'], ['bukti tersusun', 'w:bukti']], teks: 'Program siap PP 33: *tiga langkah*.' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Mulai dari cek kesiapan gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Kuncinya: mulai sekarang.", tombol privasimu.com, kontak.',
      sfx: [['w:cek', 'pop', 0.4]],
      vis: K({ cta: { tag: 'Kuncinya:|*mulai sekarang*.', at: 0.15, btnAt: 'w:cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
