// TY52 — LABEL NAMA "HALO" (stiker name tag) "Halo, Nama Saya DPO": stiker label nama merah-putih ditempel miring,
// tulisan spidol ditulis huruf demi huruf; stiker tugas bermunculan menumpuk; lalu stiker dirapikan + DPO Academy asli.
// Hook (relate): "HALO, nama saya: DPO (sejak kemarin sore)."
// Komposisi: 50% edukasi · 50% meme. Satu gaya: stiker label nama + tulisan spidol; layar produk = tangkapan DPO Academy.
(function (root) {
  const CONFIG = {
    title: 'TY52 · Halo, Nama Saya DPO (stiker label nama)',
    naskah: 'TY52',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+10%',
    maxPause: 0.4,
    beat: 60 / 108 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 108, mode: 'major', root: 57, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.75 },
    meta: {
      judul: 'Halo, Nama Saya DPO',
      gaya: 'Label nama "HALO" (stiker name tag)',
      tampilan: 'stiker label nama merah-putih ditempel miring di latar kertas; tulisan spidol hitam ditulis huruf demi huruf; stiker-stiker tugas menumpuk lalu berjatuhan',
      jenisHook: 'Relate',
      hook: '"HALO, nama saya: DPO (sejak kemarin sore)."',
      komposisi: '50% edukasi · 50% meme',
      rekam: ['dpo-academy'],
      fakta: [
        'DPO Academy = tangkapan layar asli (assets/app/dpo-academy.png): kursus Kepatuhan UU PDP Fundamentals, Manajemen Risiko Data Pribadi, Audit Kepatuhan PDP, Tata Kelola Data Pribadi.',
        'Dukungan PPDP (fakta_produk.json): asisten AI Priva yang menjawab berdasarkan knowledge base platform.',
        'Tenggat: DSR 72 jam (deadline otomatis modul DSR); pemberitahuan insiden 3×24 jam (UU PDP Pasal 46).',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const N = (o) => ({ type: 'nt', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4.5, voDelay: 0.5, mus: 'hook',
      vo: 'Halo, nama saya DPO. Sejak kemarin sore.',
      layar: 'Stiker "HALO / nama saya:" ditempel miring; spidol menulis "DPO", lalu kecil di bawahnya "(sejak kemarin sore)".',
      sfx: [[0.1, 'whoosh', 0.35], ['w:DPO-0.3', 'tick', 0.25], ['w:Sejak-0.2', 'tick', 0.2]],
      vis: N({ tempel: 0.05, tulis: 'w:DPO-0.3', sub: 'w:Sejak-0.2' }),
    },
    {
      id: 's2', min: 5, voDelay: 0.3, mus: 'tense',
      vo: 'Tugasnya? RoPA, DPIA, DSR, insiden, dan lainnya. Semua sejak kemarin sore.',
      layar: 'Stiker-stiker tugas "HALO, tugas saya: …" ditampar ke layar satu per satu, miring dan menumpuk di sekitar stiker utama.',
      sfx: [['w:RoPA', 'pop', 0.3], ['w:DPIA', 'pop', 0.3], ['w:DSR', 'pop', 0.3], ['w:insiden', 'pop', 0.3], ['w:dan', 'pop', 0.3], ['w:lainnya', 'pop', 0.3], ['w:Semua', 'hit', 0.3]],
      vis: N({ tugas: ['w:RoPA', 'w:DPIA', 'w:DSR', 'w:insiden', 'w:dan', 'w:lainnya'] }),
    },
    {
      id: 's3', min: 5, voDelay: 0.3, mus: 'main',
      vo: 'Di Privasimu Nexus ada DPO Academy: kepatuhan, risiko, audit, tata kelola. Plus asisten AI Priva.',
      layar: 'Stiker tugas berjatuhan; stiker utama naik mengecil; kartu DPO Academy asli (4 kartu kursus) muncul; "(sejak kemarin sore)" dicoret, ditulis "siap ✓".',
      sfx: [['w:Di', 'whoosh', 0.4], ['w:Academy', 'ding', 0.35], ['w:Plus', 'tick', 0.3]],
      vis: N({ bersih: 'w:Di', layar: { nama: 'dpo-academy', potong: [281, 168, 1138, 262], at: 'w:Academy-0.2', judul: 'DPO Academy' }, siap: 'w:Plus' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Nama boleh baru, kesiapannya jangan. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Nama boleh baru, kesiapan jangan.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: N({ cta: { tag: 'Nama boleh baru,|*kesiapan jangan*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
