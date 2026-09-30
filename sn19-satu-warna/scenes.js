// SN19 — HITAM-PUTIH + SATU WARNA "Satu Warna": formulir pencatatan pemrosesan serba abu-abu; garis pindai turun; hanya
// satu chip yang menyala MERAH ("Riwayat kesehatan" = data spesifik) → benang merah menarik stempel RISIKO TINGGI →
// benang merah kedua menarik draf DPIA otomatis → kartu wizard RoPA asli (abu-abu) dengan centang merah; CTA.
// Hook (anomali): "Di formulir ini, hanya satu kolom yang berwarna merah."
// Komposisi: 80% edukasi · 20% meme. Satu gaya: seluruh layar abu-abu (palet abu, tangkapan layar di-grayscale), satu warna aksen merah.
(function (root) {
  const CONFIG = {
    title: 'SN19 · Satu Warna (hitam-putih + satu warna)',
    naskah: 'SN19',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 96 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 96, mode: 'minor', root: 50, lead: 'keys', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.72 },
    meta: {
      judul: 'Satu Warna',
      gaya: 'Hitam-putih + satu warna',
      tampilan: 'seluruh layar abu-abu: formulir pencatatan pemrosesan bergaya kertas, garis pindai turun; satu chip menyala merah dengan denyut; benang merah menarik stempel RISIKO TINGGI dan kartu draf DPIA; tangkapan wizard RoPA asli di-grayscale dengan centang merah menyala satu per satu',
      jenisHook: 'Anomali',
      hook: '"Di formulir ini, hanya satu kolom yang berwarna merah."',
      komposisi: '80% edukasi · 20% meme',
      rekam: ['ropa-data-spesifik'],
      fakta: [
        'RoPA (fakta_produk.json): data yang bersifat spesifik menandai risiko TINGGI secara otomatis; RoPA berisiko TINGGI otomatis membuat draf DPIA.',
        'Daftar Data Pribadi Spesifik (kesehatan, biometrik, genetika, catatan kejahatan, anak, keuangan pribadi) = tangkapan asli assets/app/ropa-data-spesifik.png (bagian bawah, tanpa nama organisasi).',
        'Formulir abu-abu di awal = ilustrasi formulir generik, bukan tampilan produk.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const S = (o) => ({ type: 'sw', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.5, mus: 'hush',
      vo: 'Di formulir ini… hanya satu kolom yang berwarna merah.',
      layar: 'Formulir abu-abu (tujuan, dasar pemrosesan, kategori data sebagai chip); garis pindai turun dari atas; pada "merah" chip "Riwayat kesehatan" menyala merah dan berdenyut.',
      sfx: [[0.1, 'whoosh', 0.25], ['w:formulir', 'tick', 0.25], ['w:merah', 'hit', 0.45]],
      vis: S({ pindai: 'w:formulir-0.2', merah: 'w:merah', teks: 'Hanya satu kolom yang *merah*.' }),
    },
    {
      id: 's2', min: 5, voDelay: 0.3, mus: 'tense',
      vo: 'Data spesifik. Otomatis: risiko TINGGI. Otomatis: draf DPIA dibuat.',
      layar: 'Benang merah tergambar dari chip ke kanan → stempel "RISIKO TINGGI" menghantam; benang kedua turun → kartu "DPIA · draf otomatis" muncul dengan kode.',
      sfx: [['w:spesifik', 'tick', 0.3], ['w:TINGGI-0.2', 'whoosh', 0.35], ['w:TINGGI', 'hit', 0.5], ['w:DPIA-0.2', 'whoosh', 0.35], ['w:dibuat', 'ding', 0.35]],
      vis: S({ benang1: 'w:Otomatis-0.2', stempel: 'w:TINGGI', benang2: 'w:Otomatis#2-0.2', dpia: 'w:DPIA', teks: 'Data spesifik → *risiko TINGGI* → *draf DPIA*.' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Di Privasimu Nexus, RoPA menandainya sendiri: kesehatan, biometrik, anak, keuangan. Satu centang, dan sistem tahu.',
      layar: 'Formulir abu-abu menyingkir; kartu asli wizard RoPA "Data Pribadi Spesifik" (di-grayscale) masuk; centang merah menyala satu per satu saat disebut.',
      sfx: [['w:Di', 'whoosh', 0.4], ['w:kesehatan', 'tick', 0.3], ['w:biometrik', 'tick', 0.3], ['w:anak', 'tick', 0.3], ['w:keuangan', 'tick', 0.3], ['w:tahu', 'ding', 0.35]],
      vis: S({ singkir: 'w:Di', layar: { nama: 'ropa-data-spesifik', potong: [340, 665, 620, 240], at: 'w:Di+0.3', judul: 'RoPA · Pengumpulan Data · Data Pribadi Spesifik' }, centang: ['w:kesehatan', 'w:biometrik', 'w:anak', 'w:keuangan'] }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Yang abu-abu boleh lewat. Yang merah, jangan lolos. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Abu-abu boleh lewat, yang merah jangan lolos.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: S({ cta: { tag: 'Abu-abu boleh lewat,|*yang merah jangan lolos*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
