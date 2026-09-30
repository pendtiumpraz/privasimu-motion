// UI05 — RETRO OS (dialog error beruntun) "FAAAH": desktop abu-abu jadul buatan sendiri (tanpa merek); kursor membuka
// RoPA_final_revisi3_FIX.xlsx → "dikunci oleh pengguna lain" → tidak merespons → dialog error beranak-pinak berjejer
// → "FAAAH" → Akhiri tugas → jendela modern: register RoPA asli (satu versi, kode otomatis); CTA.
// Hook (relate): "POV: auditor minta RoPA. Kamu buka RoPA_final_revisi3_FIX.xlsx."
// Komposisi: 30% edukasi · 70% meme. Satu gaya: jendela OS lama (bevel abu-abu, bilah judul biru) + dialog beruntun.
(function (root) {
  const CONFIG = {
    title: 'UI05 · FAAAH (retro OS dialog error beruntun)',
    naskah: 'UI05',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+10%',
    maxPause: 0.4,
    beat: 60 / 112 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 112, mode: 'minor', root: 52, lead: 'chip', drums: 'chip', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.7 },
    meta: {
      judul: 'FAAAH',
      gaya: 'Retro OS (dialog error beruntun)',
      tampilan: 'desktop teal jadul dengan ikon; jendela abu-abu ber-bevel dan bilah judul biru tua (OS fiktif "Sistem 98"); kursor panah & jam pasir; dialog error merah-putih beranak-pinak berjejer diagonal; teks raksasa FAAAH; jendela modern berisi register RoPA asli',
      jenisHook: 'Relate',
      hook: '"POV: auditor minta RoPA. Kamu buka RoPA_final_revisi3_FIX.xlsx."',
      komposisi: '30% edukasi · 70% meme',
      rekam: ['ropa-list-baru'],
      fakta: [
        'RoPA (fakta_produk.json): kode rekaman otomatis ROPA-TAHUN-NOMOR; alur Maker–Reviewer–Approver dengan riwayat perubahan; register = tangkapan asli assets/app/ropa-list-baru.png (crop tanpa nama organisasi).',
        'Tampilan OS, nama berkas, dan pesan error = fiktif/lelucon (tanpa merek sistem operasi nyata).',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const R = (o) => ({ type: 'ro', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.5, mus: 'hook',
      vo: 'POV: auditor minta RoPA. Kamu buka RoPA, final, revisi tiga, FIX.',
      layar: 'Desktop jadul; kursor bergerak ke ikon "RoPA_final_revisi3_FIX.xlsx", klik dua kali; jendela spreadsheet terbuka dengan jam pasir; dialog "Berkas dikunci oleh pengguna lain".',
      sfx: [[0.1, 'whoosh', 0.2], ['w:buka', 'tick', 0.3], ['w:buka+0.25', 'tick', 0.3], ['w:FIX', 'hit', 0.3]],
      vis: R({ kursor: 'w:buka-0.6', klik: 'w:buka', jendela: 'w:buka+0.5', kunci: 'w:FIX' }),
    },
    {
      id: 's2', min: 6, voDelay: 0.3, mus: 'tense',
      vo: 'Tidak merespons. Simpan sebagai FIX dua? Versi ini bukan yang terbaru. Makro dinonaktifkan. Memori kepatuhan penuh. Faaah.',
      layar: 'Jendela memutih "tidak merespons"; dialog error bermunculan berjejer diagonal makin cepat (Simpan sebagai FIX2? · Bukan versi terbaru · Makro dinonaktifkan · Memori kepatuhan penuh · …); teks raksasa FAAAH menghantam.',
      sfx: [['w:Tidak', 'tick', 0.3], ['w:Simpan', 'tick', 0.3], ['w:Versi', 'tick', 0.3], ['w:Makro', 'tick', 0.3], ['w:Memori', 'tick', 0.3], ['w:Memori+0.5', 'tick', 0.25], ['w:Memori+0.7', 'tick', 0.25], ['w:Memori+0.9', 'tick', 0.25], ['w:Faaah', 'hit', 0.55]],
      vis: R({ beku: 'w:Tidak', error: 'w:Simpan', banjir: 'w:Memori+0.4', faaah: 'w:Faaah' }),
    },
    {
      id: 's3', min: 5.5, voDelay: 0.3, mus: 'main',
      vo: 'Akhiri tugasnya. Di Privasimu Nexus, RoPA punya satu versi, kode otomatis, alur maker, reviewer, approver.',
      layar: 'Dialog "Akhiri tugas" → semua jendela lenyap; jendela modern berisi register RoPA asli (ROPA-IT-2026-002 …) dengan pil "1 versi · kode otomatis · Maker → Reviewer → Approver".',
      sfx: [['w:Akhiri', 'hit', 0.35], ['w:Nexus', 'whoosh', 0.45], ['w:satu', 'ding', 0.35], ['w:approver', 'pop', 0.3]],
      vis: R({ akhiri: 'w:Akhiri', bersih: 'w:Nexus-0.2', layar: { nama: 'ropa-list-baru', potong: [280, 200, 1140, 285], at: 'w:Nexus', judul: 'Privasimu Nexus · Register RoPA' }, pil: ['w:satu', 'w:kode', 'w:alur'] }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Satu versi, tanpa FIX dua. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Satu versi. Tanpa FIX2.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: R({ cta: { tag: 'Satu versi.|*Tanpa FIX2.*', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
