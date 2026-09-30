// TY10 — GLITCH / RGB SPLIT "03.00": jam 03.00, tulisan "dugaan kebocoran data" pecah jadi kanal merah-hijau-biru yang
// bergeser dan berkedip; penghitung 3×24 jam mulai; daftar periksa penahanan muncul rapi dan glitch hilang.
// Hook (anomali): "Jam 03.00. Tulisan ini muncul di layar: dugaan kebocoran data."
// Komposisi: 50% edukasi · 50% meme. Satu gaya: tiga salinan teks berwarna dengan offset hash per frame + irisan clip-path.
(function (root) {
  const CONFIG = {
    title: 'TY10 · 03.00 (glitch RGB split)',
    naskah: 'TY10',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+6%',
    maxPause: 0.4,
    beat: 60 / 100 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 100, mode: 'minor', root: 50, lead: 'chip', drums: 'full', sonic: true },
    mix: { duckTo: 0.4, musicGain: 0.8 },
    meta: {
      judul: '03.00',
      gaya: 'Glitch / RGB split',
      tampilan: 'layar gelap; jam 03:00 berkedip; teks pecah menjadi kanal merah-hijau-biru yang bergeser dengan irisan horizontal; glitch mereda saat daftar periksa muncul',
      jenisHook: 'Anomali',
      hook: '"Jam 03.00. Tulisan ini muncul di layar: dugaan kebocoran data."',
      komposisi: '50% edukasi · 50% meme',
      sasaran: 'tim TI/keamanan, DPO/PPDP, manajemen',
      fakta: [
        'Manajemen Insiden: daftar periksa penahanan dan log linimasa dibuat otomatis saat insiden dicatat; penghitung mundur 3 x 24 jam; templat pemberitahuan; kode BRC otomatis (fakta_produk.json: breach). UU PDP Pasal 46: pemberitahuan paling lambat 3 x 24 jam.',
        'Layar = assets/app/breach-detail.png (label HIGH/Wajib Notifikasi, stepper 5 fase; data demo).',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const G = (o) => ({ type: 'gl', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4, voDelay: 0.5, mus: 'hush',
      vo: 'Jam tiga pagi. Tulisan ini muncul di layar.',
      layar: 'Jam 03:00 berkedip di pojok; teks "DUGAAN KEBOCORAN DATA" muncul pecah-pecah (RGB split, irisan).',
      sfx: [[0.1, 'glitch', 0.5], ['w:Tulisan', 'glitch', 0.6], ['w:layar', 'shock', 0.4]],
      vis: G({ judul: 'DUGAAN KEBOCORAN DATA', munculAt: 'w:Tulisan-0.1', kuat: 1 }),
    },
    {
      id: 's2', min: 4, voDelay: 0.25, mus: 'tense',
      vo: 'Tiga kali dua puluh empat jam untuk memberi tahu. Penghitungnya mulai.',
      layar: 'Penghitung mundur 71:59:59 muncul besar (masih berglitch); kode BRC-2026-… berkedip.',
      sfx: [['w:Penghitungnya', 'alarm', 0.35], ['w:mulai', 'clock', 0.4]],
      vis: G({ hitung: 'w:Penghitungnya', kuat: 0.7 }),
    },
    {
      id: 's3', min: 6, voDelay: 0.25, mus: 'main',
      vo: 'Di Privasimu Nexus, daftar periksa penahanan dan linimasa sudah siap begitu insiden dicatat. Glitch selesai. Kerja dimulai.',
      layar: 'Glitch mereda; layar detail insiden asli (fase Terdeteksi → Assessment → Containment → Notifikasi → Ditutup) masuk bersih; cip daftar periksa · linimasa · templat pemberitahuan.',
      sfx: [['w:Di', 'sweep', 0.35], ['w:daftar', 'check', 0.35], ['w:linimasa', 'check', 0.35], ['w:Glitch', 'correct', 0.4]],
      vis: G({ tenang: 'w:Di', layar: 'w:daftar-0.2', cip: [['daftar periksa penahanan', 'w:daftar'], ['log linimasa', 'w:linimasa'], ['templat pemberitahuan', 'w:dicatat']], teks: 'Daftar periksa & linimasa *sudah siap* begitu insiden dicatat.' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Siap sebelum jam tiga pagi. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Siap sebelum jam 03.00.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: G({ cta: { tag: 'Siap sebelum|*jam 03.00*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
