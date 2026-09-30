// TY19 — REDAKSI "Siapa yang Terakhir Membuka?": dokumen ketikan dengan balok hitam menutup jawaban; balok bergeser
// terbuka satu per satu → peran, waktu, kanal; lalu baris log audit (manusia & AI) dengan rantai hash.
// Hook (anomali): "Siapa yang terakhir membuka data pelanggan ini? ████████."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: balok redaksi (scaleX) di atas teks mesin tik, urutan buka mengikuti VO.
(function (root) {
  const CONFIG = {
    title: 'TY19 · Siapa yang Terakhir Membuka? (redaksi)',
    naskah: 'TY19',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+6%',
    maxPause: 0.4,
    beat: 60 / 92 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 92, mode: 'minor', root: 50, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.8 },
    meta: {
      judul: 'Siapa yang Terakhir Membuka?',
      gaya: 'Redaksi (sensor hitam)',
      tampilan: 'kertas arsip bertulisan mesin tik; balok hitam menutup nama, waktu, dan kanal; balok terbuka memperlihatkan isi log audit',
      jenisHook: 'Anomali',
      hook: '"Siapa yang terakhir membuka data pelanggan ini? ████████."',
      komposisi: '70% edukasi · 30% meme',
      sasaran: 'DPO/PPDP, auditor internal, manajemen TI',
      fakta: [
        'Log audit untuk aktor manusia maupun AI (fakta_produk.json: ppdp); log audit dengan rantai hash opsional yang tahan rusak (fakta_produk.json: platform).',
        'Isi dokumen (peran, waktu, hash) = ilustrasi; tanpa nama orang.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const R = (o) => ({ type: 'rd', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 3.5, voDelay: 0.35, mus: 'tense',
      vo: 'Siapa yang terakhir membuka data pelanggan ini?',
      layar: 'Kertas arsip: "Terakhir dibuka oleh ████ pada ████ lewat ████." Balok hitam sudah tampak sejak frame pertama.',
      sfx: [[0.1, 'paper', 0.4], ['w:ini', 'tock', 0.4]],
      vis: R({ teks: 'Siapa yang *terakhir membuka* data ini?' }),
    },
    {
      id: 's2', min: 3, voDelay: 0.25, mus: 'tense',
      vo: 'Di banyak kantor, jawabannya: tidak ada yang tahu.',
      layar: 'Stempel merah "TIDAK TERCATAT" menghantam kertas di "tidak".',
      sfx: [['w:tidak', 'stamp', 0.6]],
      vis: R({ stempel: 'w:tidak', teks: 'Jawabannya: *tidak ada yang tahu*.' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.25, mus: 'main',
      vo: 'Di Privasimu Nexus, tiap akses tercatat: siapa, kapan, lewat apa. Termasuk yang dilakukan AI.',
      layar: 'Balok terbuka satu per satu: "Peran: Admin TI" · "14 Sep 2026, 09.41" · "aplikasi web". Baris log audit muncul, termasuk aktor AI (Priva).',
      sfx: [['w:siapa', 'flip', 0.4], ['w:kapan', 'flip', 0.4], ['w:lewat', 'flip', 0.4], ['w:Termasuk', 'pop', 0.35], ['w:AI', 'blip', 0.4]],
      vis: R({ buka: ['w:siapa', 'w:kapan', 'w:lewat'], logAt: 'w:Termasuk-0.2', aiAt: 'w:AI', teks: 'Tiap akses tercatat: *siapa, kapan, lewat apa*. Termasuk AI.' }),
    },
    {
      id: 's4', min: 5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Log audit dengan rantai hash: tahan diubah diam-diam. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Rantai hash menyambung antarbaris log; kartu penutup: logo, "Tercatat. Tidak bisa dihapus diam-diam.", tombol, kontak.',
      sfx: [['w:rantai', 'clank', 0.4], ['w:Cek', 'pop', 0.4]],
      vis: R({ rantai: 'w:rantai', cta: { terang: true, tag: 'Tercatat.|*Tidak bisa diubah* diam-diam.', at: 'w:Cek-0.9', btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
