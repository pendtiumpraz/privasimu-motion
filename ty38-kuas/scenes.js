// TY38 — KALIGRAFI KUAS "Satu Kata untuk 2027": kertas kosong; satu kata digores kuas tinta tebal dengan cipratan;
// stempel merah; lalu tiga langkah siap PP 33 ditulis kuas kecil.
// Hook (logika dipatahkan): "Resolusi 2027 kantor ini cukup satu kata."
// Komposisi: 50% edukasi · 50% meme. Satu gaya: masker sapuan (clip-path bergerigi) membuka teks; tekstur tinta; cipratan.
(function (root) {
  const CONFIG = {
    title: 'TY38 · Satu Kata untuk 2027 (kaligrafi kuas)',
    naskah: 'TY38',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+4%',
    maxPause: 0.5,
    beat: 60 / 80 / 2,
    tail: 0.4,
    burnCaptions: false,
    music: { bpm: 80, mode: 'major', root: 55, lead: 'bell', drums: 'none', sonic: true },
    mix: { duckTo: 0.45, musicGain: 0.75 },
    meta: {
      judul: 'Satu Kata untuk 2027',
      gaya: 'Kaligrafi kuas',
      tampilan: 'kertas beras krem; kata RAPI digores kuas tinta hitam tebal dengan cipratan; stempel merah; langkah-langkah ditulis kuas kecil',
      jenisHook: 'Logika dipatahkan',
      hook: '"Resolusi 2027 kantor ini cukup satu kata."',
      komposisi: '50% edukasi · 50% meme',
      fakta: [
        'PP 33/2026 berlaku 16 Januari 2027. GAP Assessment: kuesioner, skor, rencana remediasi (fakta_produk.json: gap-assessment). Langkah "GAP → perbaikan → bukti" = ringkasan program siap PP 33; pastikan program masih ditawarkan.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const K = (o) => ({ type: 'ku', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4, voDelay: 0.5, mus: 'hush',
      vo: 'Resolusi dua ribu dua puluh tujuh kantor ini, cukup satu kata.',
      layar: 'Kertas beras kosong; kuas melayang. Di "satu kata", tetes tinta jatuh.',
      sfx: [[0.2, 'paper', 0.3], ['w:satu', 'tock', 0.3]],
      vis: K({ teks: 'Resolusi 2027 kantor ini, *cukup satu kata*.' }),
    },
    {
      id: 's2', min: 3.5, voDelay: 0.6, mus: 'hush',
      vo: 'Rapi.',
      layar: 'Kuas menggores RAPI. besar dari kiri ke kanan dengan cipratan tinta; stempel merah "SIAP PP 33" menghantam.',
      sfx: [[0.15, 'scratch', 0.5], [0.6, 'scratch', 0.4], ['w:Rapi+0.9', 'stamp', 0.6]],
      vis: K({ gores: 0.15, stempel: 'w:Rapi+0.9' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.25, mus: 'calm',
      vo: 'Rapi catatannya lewat GAP Assessment. Rapi perbaikannya. Rapi buktinya, sebelum enam belas Januari.',
      layar: 'Tiga baris kuas kecil ditulis: catatan → GAP Assessment · perbaikan · bukti; tanggal 16 Jan 2027 di sudut.',
      sfx: [['w:catatannya', 'scratch', 0.3], ['w:perbaikannya', 'scratch', 0.3], ['w:buktinya', 'scratch', 0.3], ['w:enam', 'tick', 0.35]],
      vis: K({ baris: [['catatan · GAP Assessment', 'w:catatannya-0.4'], ['perbaikan · rencana remediasi', 'w:perbaikannya-0.4'], ['bukti · tersusun', 'w:buktinya-0.4']], tanggal: 'w:enam', teks: 'Rapi catatan, perbaikan, bukti — *sebelum 16 Januari 2027*.' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Satu kata, satu platform. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup bergaya kertas: logo, "Satu kata, satu platform.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: K({ cta: { terang: true, tag: 'Satu kata,|*satu platform*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
