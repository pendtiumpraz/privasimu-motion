// TY22 — ISI TITIK-TITIK "Isi Titik-titik Ini": lembar soal dengan ruang kosong bergaris; jawaban tulisan tangan
// muncul, dihapus, diganti (server? laptop? spreadsheet? pihak ketiga?) → kunci jawaban: katalog sistem & sumber data.
// Hook (reverse psychology): "Jangan isi titik-titik ini kalau belum yakin: data pelanggan kami disimpan di ______."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: garis bawah + jawaban ketik/hapus bergantian; tanda tanya bergoyang.
(function (root) {
  const CONFIG = {
    title: 'TY22 · Isi Titik-titik Ini (isi titik-titik)',
    naskah: 'TY22',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 104 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 104, mode: 'major', root: 57, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.8 },
    meta: {
      judul: 'Isi Titik-titik Ini',
      gaya: 'Isi titik-titik',
      tampilan: 'lembar soal bergaris (kertas ujian); jawaban tulisan tangan pensil muncul lalu dihapus berganti-ganti; kunci jawaban berupa kartu katalog sistem',
      jenisHook: 'Reverse psychology',
      hook: '"Jangan isi titik-titik ini kalau belum yakin: data pelanggan kami disimpan di ______."',
      komposisi: '70% edukasi · 30% meme',
      sasaran: 'manajemen, tim TI, DPO/PPDP',
      fakta: [
        'Data Discovery: katalog sistem dan sumber data organisasi; keterkaitan kolom data ke RoPA (fakta_produk.json: data-discovery).',
        'Kartu "kunci jawaban" = ilustrasi tampilan (diberi label), bukan tangkapan layar; nama sistem = contoh umum.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const S = (o) => ({ type: 'it', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4, voDelay: 0.35, mus: 'hook',
      vo: 'Jangan isi titik-titik ini, kalau belum yakin.',
      layar: 'Lembar soal: "Soal 1. Data pelanggan kami disimpan di ________." Pensil melayang ragu di atas garis.',
      sfx: [[0.1, 'paper', 0.35], ['w:yakin', 'tick', 0.35]],
      vis: S({ teks: 'Jangan isi, kalau *belum yakin*.' }),
    },
    {
      id: 's2', min: 6, voDelay: 0.25, mus: 'play',
      vo: 'Server? Laptop staf? Spreadsheet? Pihak ketiga? Semua di atas?',
      layar: 'Jawaban ditulis lalu dihapus bergantian: server → laptop staf → spreadsheet → pihak ketiga → "semua di atas??" (tanda tanya bergoyang).',
      sfx: [['w:Server', 'key', 0.35], ['w:Laptop-0.15', 'scratch', 0.3], ['w:Spreadsheet-0.15', 'scratch', 0.3], ['w:Pihak-0.15', 'scratch', 0.3], ['w:Semua-0.15', 'scratch', 0.3], ['w:atas+0.3', 'boing', 0.4]],
      vis: S({ jawab: [['server', 'w:Server'], ['laptop staf', 'w:Laptop'], ['spreadsheet', 'w:Spreadsheet'], ['pihak ketiga', 'w:Pihak'], ['semua di atas??', 'w:Semua']], teks: 'Server? Laptop? Spreadsheet? Pihak ketiga? *Semua?*' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.25, mus: 'main',
      vo: 'Data Discovery memetakan sistem dan sumber datanya, lalu mengaitkannya ke RoPA.',
      layar: 'Kunci jawaban meluncur: kartu "Katalog sistem & sumber data" — CRM, email, spreadsheet HR, penyedia cloud (pihak ketiga) — tiap baris dicentang dan diberi "→ RoPA". Label "*ilustrasi tampilan".',
      sfx: [['w:memetakan', 'whoosh', 0.35], ['w:sistem', 'check', 0.3], ['w:sistem+0.3', 'check', 0.3], ['w:sistem+0.6', 'check', 0.3], ['w:sistem+0.9', 'check', 0.3], ['w:RoPA', 'ding', 0.4]],
      vis: S({ kunci: 'w:memetakan', centang: 'w:sistem', ropa: 'w:RoPA', teks: 'Katalog sistem & sumber data → *RoPA*.' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Isi dengan yakin. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Isi dengan yakin.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: S({ cta: { terang: true, tag: 'Isi dengan *yakin*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
