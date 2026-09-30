// TY44 — PAPAN HURUF (letter board) "Sedang Tayang": papan beralur dengan huruf plastik putih yang dipasang satu-satu
// (bunyi klik), beberapa huruf miring. Judul berganti: SEDANG TAYANG: AUDIT → SEGERA: FIRE DRILL → menu latihan + banner asli.
// Hook (relate): "SEDANG TAYANG: AUDIT. Tanpa gladi resik."
// Komposisi: 50% edukasi · 50% meme. Satu gaya: papan huruf; layar produk = potongan banner Fire Drill asli.
(function (root) {
  const CONFIG = {
    title: 'TY44 · Sedang Tayang: Fire Drill (papan huruf bioskop)',
    naskah: 'TY44',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+10%',
    maxPause: 0.4,
    beat: 60 / 96 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 96, mode: 'minor', root: 50, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.7 },
    meta: {
      judul: 'Sedang Tayang',
      gaya: 'Papan huruf (letter board)',
      tampilan: 'papan kain beralur berbingkai kayu; huruf plastik putih masuk satu-satu dengan klik, beberapa miring; judul berganti seperti papan bioskop',
      jenisHook: 'Relate',
      hook: '"SEDANG TAYANG: AUDIT. Tanpa gladi resik."',
      komposisi: '50% edukasi · 50% meme',
      rekam: ['fire-drill-header'],
      fakta: [
        'Simulasi & Fire Drill (fakta_produk.json): kuis, tabletop, walkthrough; skenario kustom berbantuan AI; penilaian rubrik dan tindak lanjut.',
        'Banner "Fire Drill — Simulasi Insiden Data Breach" = tangkapan layar asli (assets/app/fire-drill-header.png), dipotong tanpa nama organisasi.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const B = (o) => ({ type: 'lb', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4.5, voDelay: 0.5, mus: 'hook',
      vo: 'Sedang tayang: audit. Tanpa gladi resik.',
      layar: 'Papan huruf kosong; huruf dipasang satu-satu: "SEDANG TAYANG:" / "AUDIT" / "TANPA GLADI RESIK".',
      sfx: [['w:audit', 'hit', 0.3]],
      vis: B({ baris: [[0, 0.1, 'SEDANG TAYANG:'], [1, 'w:audit-0.5', 'AUDIT'], [2, 'w:Tanpa-0.2', 'TANPA GLADI RESIK']] }),
    },
    {
      id: 's2', min: 5, voDelay: 0.3, mus: 'main',
      vo: 'Segera: fire drill. Latihan insiden data, sebelum yang sungguhan.',
      layar: 'Huruf lama dicopot, huruf baru dipasang: "SEGERA:" / "FIRE DRILL" / "LATIHAN INSIDEN DATA".',
      sfx: [['w:fire', 'whoosh', 0.3]],
      vis: B({ baris: [[0, 'w:Segera-0.3', 'SEGERA:'], [1, 'w:fire-0.4', 'FIRE DRILL'], [2, 'w:Latihan-0.2', 'LATIHAN INSIDEN DATA']] }),
    },
    {
      id: 's3', min: 5, voDelay: 0.3, mus: 'main',
      vo: 'Di Privasimu Nexus: kuis, tabletop, walkthrough. Skenario dibantu AI, dinilai rubrik.',
      layar: 'Baris berganti: "PRIVASIMU NEXUS" / "FIRE DRILL" tetap / "KUIS · TABLETOP · WALKTHROUGH"; kartu banner Fire Drill asli muncul di bawah papan.',
      sfx: [['w:Di', 'pop', 0.3], ['w:Skenario', 'ding', 0.3]],
      vis: B({ baris: [[0, 'w:Di', 'PRIVASIMU NEXUS'], [2, 'w:kuis-0.3', 'KUIS · TABLETOP · WALKTHROUGH']], layar: { nama: 'fire-drill-header', potong: [80, 66, 1140, 132], at: 'w:Skenario-0.2', judul: 'Simulasi & Fire Drill' } }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Latihan dulu, baru tayang. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Latihan dulu, baru tayang.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: B({ cta: { tag: 'Latihan dulu,|*baru tayang*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
