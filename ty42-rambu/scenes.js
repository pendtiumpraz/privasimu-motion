// TY42 — RAMBU & MARKA JALAN "Rambu-rambu Data Pribadi": jalan bergerak (marka putus-putus), rambu-rambu berdatangan:
// WAJIB CATAT (bulat biru), HATI-HATI DATA SPESIFIK (segitiga), LAPOR 3×24 JAM (persegi merah), lalu papan petunjuk hijau
// berisi peta modul Nexus.
// Hook (relate): "Kalau kewajiban data pribadi dipasang seperti rambu jalan."
// Komposisi: 50% edukasi · 50% meme. Satu gaya: bentuk rambu SVG (lingkaran, segitiga, persegi) + huruf tebal; jalan bergerak.
(function (root) {
  const CONFIG = {
    title: 'TY42 · Rambu-rambu Data Pribadi (rambu & marka jalan)',
    naskah: 'TY42',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+7%',
    maxPause: 0.4,
    beat: 60 / 104 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 104, mode: 'major', root: 55, lead: 'pluck', drums: 'full', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.8 },
    meta: {
      judul: 'Rambu-rambu Data Pribadi',
      gaya: 'Rambu & marka jalan',
      tampilan: 'jalan aspal berperspektif dengan marka putus-putus yang bergerak; rambu bulat, segitiga, persegi berdatangan membesar; papan petunjuk hijau berisi modul',
      jenisHook: 'Relate',
      hook: '"Kalau kewajiban data pribadi dipasang seperti rambu jalan."',
      komposisi: '50% edukasi · 50% meme',
      fakta: [
        'Rambu = kewajiban yang ditangani modul Nexus: catat pemrosesan (RoPA), data spesifik menandai risiko tinggi & DPIA (ropa/dpia), pemberitahuan insiden 3×24 jam (breach; UU PDP Pasal 46) — fakta_produk.json.',
        'Bentuk rambu generik; tanpa lambang instansi atau rambu resmi tertentu.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const R = (o) => ({ type: 'rb', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4, voDelay: 0.4, mus: 'hook',
      vo: 'Kalau kewajiban data pribadi dipasang seperti rambu jalan…',
      layar: 'Jalan bergerak; rambu pertama muncul dari kejauhan: bulat biru "WAJIB CATAT" (RoPA), membesar lalu lewat.',
      sfx: [[0.1, 'whoosh', 0.3], ['w:rambu', 'whoosh', 0.4]],
      vis: R({ rambu: [[0, 'w:rambu']], teks: 'Kalau kewajiban data pribadi jadi *rambu jalan*…' }),
    },
    {
      id: 's2', min: 5, voDelay: 0.25, mus: 'main',
      vo: 'Wajib catat pemrosesan. Hati-hati, data spesifik. Lapor insiden, tiga kali dua puluh empat jam.',
      layar: 'Rambu-rambu berdatangan tepat saat disebut: segitiga kuning "HATI-HATI DATA SPESIFIK", persegi merah "LAPOR 3×24 JAM".',
      sfx: [['w:Wajib', 'whoosh', 0.35], ['w:Hati-hati', 'whoosh', 0.35], ['w:Lapor', 'whoosh', 0.35], ['w:jam', 'hit', 0.35]],
      vis: R({ rambu: [[1, 'w:Hati-hati'], [2, 'w:Lapor']], teks: 'Wajib catat · hati-hati data spesifik · *lapor 3×24 jam*.' }),
    },
    {
      id: 's3', min: 5, voDelay: 0.25, mus: 'main',
      vo: 'Di Privasimu Nexus, semua rambu itu ada di satu peta: RoPA, DPIA, DSR, Consent, Insiden.',
      layar: 'Papan petunjuk hijau besar berhenti di depan: PRIVASIMU NEXUS → RoPA · DPIA · DSR · Consent · Insiden (panah).',
      sfx: [['w:Di', 'whoosh', 0.4], ['w:RoPA', 'tick', 0.3], ['w:DPIA', 'tick', 0.3], ['w:DSR', 'tick', 0.3], ['w:Consent', 'tick', 0.3], ['w:Insiden', 'tick', 0.3]],
      vis: R({ papan: 'w:Di', modul: ['w:RoPA', 'w:DPIA', 'w:DSR', 'w:Consent', 'w:Insiden'], teks: 'Semua rambu, *satu peta*.' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Jalan yang aman, dengan rambu yang jelas. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Rambu yang jelas, jalan yang aman.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: R({ cta: { tag: 'Rambu yang jelas,|*jalan yang aman*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
