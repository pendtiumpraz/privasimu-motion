// TY28 — BAYANGAN PANJANG (long shadow) "Bayangan Tenggat": huruf datar "16 JAN" dengan bayangan diagonal 45° yang
// memanjang seiring waktu sampai menutupi meja kerja (kertas RoPA/DPIA/DSR, keyboard, cangkir); daftar Siap PP 33
// menyala dan bayangan memendek lagi; CTA.
// Hook (anomali): "Makin dekat tanggalnya, makin panjang bayangannya."
// Komposisi: 50% edukasi · 50% meme. Satu gaya: long shadow (tumpukan salinan teks ber-offset diagonal di kanvas).
(function (root) {
  const CONFIG = {
    title: 'TY28 · Bayangan Tenggat (long shadow)',
    naskah: 'TY28',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 100 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 100, mode: 'minor', root: 52, lead: 'keys', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.72 },
    meta: {
      judul: 'Bayangan Tenggat',
      gaya: 'Bayangan panjang (long shadow)',
      tampilan: 'latar kuning oker datar; "16 JAN" putih tebal di kiri atas dengan bayangan diagonal bergradasi yang memanjang menutupi ikon meja kerja datar (kertas berlabel modul, keyboard, cangkir); panel putih Siap PP 33',
      jenisHook: 'Anomali',
      hook: '"Makin dekat tanggalnya, makin panjang bayangannya."',
      komposisi: '50% edukasi · 50% meme',
      fakta: [
        'PP 33/2026 berlaku 16 Januari 2027 (basis yang sama dengan TY40/TY53 & knowledge base regulasi platform).',
        'Daftar Siap PP 33 = modul Nexus (fakta_produk.json): RoPA, DPIA, DSR, Consent, Insiden.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const B = (o) => ({ type: 'ls', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.5, mus: 'hook',
      vo: 'Makin dekat tanggalnya… makin panjang bayangannya.',
      layar: '"16 JAN" muncul dengan bayangan pendek; pada "makin panjang" bayangan mulai memanjang ke kanan-bawah.',
      sfx: [[0.1, 'hit', 0.35], ['w:panjang', 'whoosh', 0.35]],
      vis: B({ muncul: 0.1, panjang: ['w:panjang', 260], teks: 'Makin dekat tanggalnya, *makin panjang bayangannya*.' }),
    },
    {
      id: 's2', min: 6, voDelay: 0.3, mus: 'tense',
      vo: 'Oktober, masih terang. November, mulai gelap. Desember, seluruh meja tertutup bayangan.',
      layar: 'Label bulan berganti; bayangan memanjang bertahap sampai menutupi kertas RoPA/DPIA/DSR, keyboard, dan cangkir di meja.',
      sfx: [['w:Oktober', 'tick', 0.25], ['w:November', 'tick', 0.25], ['w:Desember', 'hit', 0.35]],
      vis: B({ bulan: [['w:Oktober', 'OKTOBER', 320], ['w:November', 'NOVEMBER', 560], ['w:Desember', 'DESEMBER', 980]], teks: 'Desember: *seluruh meja tertutup*.' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Program Siap PP 33 di Privasimu Nexus: RoPA, DPIA, DSR, Consent, Insiden. Siap sebelum tanggalnya, bayangannya pendek lagi.',
      layar: 'Panel putih "SIAP PP 33" muncul di meja; tiap modul tercentang saat disebut; bayangan memendek sampai pendek lagi.',
      sfx: [['w:Program', 'whoosh', 0.4], ['w:RoPA', 'pop', 0.25], ['w:DPIA', 'pop', 0.25], ['w:DSR', 'pop', 0.25], ['w:Consent', 'pop', 0.25], ['w:Insiden', 'pop', 0.25], ['w:pendek', 'ding', 0.35]],
      vis: B({ panel: 'w:Program', centang: ['w:RoPA', 'w:DPIA', 'w:DSR', 'w:Consent', 'w:Insiden'], pendek: 'w:pendek-0.6' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Tanggalnya tetap, bayangannya bisa pendek. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Tanggalnya tetap, bayangannya bisa pendek.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: B({ cta: { tag: 'Tanggalnya tetap,|*bayangannya bisa pendek*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
