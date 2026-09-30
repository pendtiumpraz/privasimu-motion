// TY14 — PAPAN LED BERJALAN "Buka 24 Jam": papan LED titik-titik merah/kuning seperti di depan toko; teks berjalan,
// hitung mundur 72 jam berdetak; lalu formulir permohonan DSR asli.
// Hook (relate): "Kalau permohonan hak subjek data punya papan LED: BUKA 24 JAM."
// Komposisi: 50% edukasi · 50% meme. Satu gaya: kisi titik (canvas) menyala dari bitmap huruf, bergeser per kolom, pendar.
(function (root) {
  const CONFIG = {
    title: 'TY14 · Buka 24 Jam (papan LED berjalan)',
    naskah: 'TY14',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+7%',
    maxPause: 0.4,
    beat: 60 / 110 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 110, mode: 'minor', root: 52, lead: 'chip', drums: 'chip', sonic: true },
    mix: { duckTo: 0.4, musicGain: 0.8 },
    meta: {
      judul: 'Buka 24 Jam',
      gaya: 'Papan LED berjalan',
      tampilan: 'papan LED hitam berbingkai dengan titik-titik merah/kuning menyala membentuk teks berjalan dan hitung mundur; malam hari di depan toko',
      jenisHook: 'Relate',
      hook: '"Kalau permohonan hak subjek data punya papan LED: BUKA 24 JAM."',
      komposisi: '50% edukasi · 50% meme',
      fakta: [
        'DSR: formulir permohonan yang dapat disematkan di situs organisasi; tenggat otomatis 72 jam; semua permohonan tercatat di satu antrean (fakta_produk.json: dsr). Layar = assets/app/dsr-form.png (formulir kosong).',
        '"Buka 24 jam" = gaya papan toko (formulir daring bisa menerima permohonan kapan saja), bukan klaim layanan manusia 24 jam.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const L = (o) => ({ type: 'led', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4.5, voDelay: 0.4, mus: 'hook',
      vo: 'Kalau permohonan hak subjek data punya papan LED…',
      layar: 'Papan LED menyala: teks berjalan "BUKA 24 JAM ★ TERIMA PERMOHONAN HAPUS DATA ★ AKSES ★ PERBAIKAN ★".',
      sfx: [[0.05, 'blip', 0.4], [0.3, 'blip', 0.3]],
      vis: L({ jalan: 'BUKA 24 JAM  ★  TERIMA PERMOHONAN HAPUS DATA  ★  AKSES  ★  PERBAIKAN  ★  PENARIKAN PERSETUJUAN  ★  ', teks: 'Kalau permohonan hak subjek data punya *papan LED*…' }),
    },
    {
      id: 's2', min: 4.5, voDelay: 0.25, mus: 'tense',
      vo: 'Tenggat tujuh puluh dua jam, menghitung sendiri.',
      layar: 'Baris kedua papan: hitung mundur LED "71:59:58" berdetak turun; teks atas tetap berjalan.',
      sfx: [['w:Tenggat', 'tick', 0.4], ['w:menghitung', 'clock', 0.35], ['w:menghitung+0.5', 'tock', 0.35], ['w:menghitung+1.0', 'clock', 0.35]],
      vis: L({ hitung: 'w:Tenggat', teks: 'Tenggat 72 jam, *menghitung sendiri*.' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.25, mus: 'main',
      vo: 'Formulirnya bisa disematkan di situsmu. Tenggat dan antreannya, Nexus yang urus.',
      layar: 'Papan mengecil ke atas; formulir "Buat DSR Baru" asli meluncur masuk; cip "formulir tersemat", "tenggat otomatis", "satu antrean".',
      sfx: [['w:Formulirnya', 'whoosh', 0.35], ['w:disematkan', 'pop', 0.3], ['w:Tenggat', 'pop', 0.3], ['w:antreannya', 'pop', 0.3]],
      vis: L({ layar: 'w:Formulirnya', cip: [['formulir tersemat', 'w:disematkan'], ['tenggat otomatis', 'w:Tenggat'], ['satu antrean', 'w:antreannya']], teks: 'Formulir tersemat, tenggat & antrean *diurus Nexus*.' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Buka kapan saja, tanpa lembur. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Buka kapan saja, tanpa lembur.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: L({ cta: { tag: 'Buka kapan saja,|*tanpa lembur*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
