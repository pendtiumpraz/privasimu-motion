// PF34 — ULAR TANGGA "Ular Tangga Kepatuhan": papan 8×8 bernomor; bidak DPO melompat sesuai dadu; kena ular
// "lupa mencatat pihak ketiga" (47 → 12); naik tangga RoPA & DPIA; kena ular "insiden tak dilapor 3×24 jam" (58 → 30);
// lalu tangga panjang Privasimu Nexus 30 → 64 (PATUH) dengan konfeti; CTA.
// Hook (relate): "Kotak 47: lupa mencatat pihak ketiga. Turun ke kotak 12."
// Komposisi: 60% edukasi · 40% meme. Satu gaya: papan permainan (grid, bidak melompat, jalur ular & tangga).
(function (root) {
  const CONFIG = {
    title: 'PF34 · Ular Tangga Kepatuhan (ular tangga)',
    naskah: 'PF34',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+14%',
    maxPause: 0.4,
    beat: 60 / 112 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 112, mode: 'major', root: 57, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.72 },
    meta: {
      judul: 'Ular Tangga Kepatuhan',
      gaya: 'Ular tangga',
      tampilan: 'papan permainan 8×8 pastel bernomor di meja kayu; bidak bundar "DPO" melompat per kotak (busur), dadu menggelinding; ular merah berkelok dengan label kelalaian; tangga hijau berlabel modul; tangga emas panjang Nexus; konfeti di kotak 64 PATUH',
      jenisHook: 'Relate',
      hook: '"Kotak 47: lupa mencatat pihak ketiga. Turun ke kotak 12."',
      komposisi: '60% edukasi · 40% meme',
      fakta: [
        'Tangga = modul Nexus (fakta_produk.json): RoPA (catatan kegiatan), DPIA (penilaian dampak); tangga panjang = platform dengan modul saling terhubung.',
        'Ular = kelalaian umum: pihak ketiga tidak tercatat (modul Manajemen Pihak Ketiga), insiden tidak dilaporkan dalam 3×24 jam (Manajemen Insiden).',
        'Nomor kotak & dadu = permainan (ilustrasi).',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const U = (o) => ({ type: 'ut', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5.5, voDelay: 0.5, mus: 'hook',
      vo: 'Kotak empat puluh tujuh: lupa mencatat pihak ketiga. Turun… ke kotak dua belas.',
      layar: 'Papan tampil; dadu menggelinding: 3; bidak dari 44 melompat ke 45, 46, 47; kepala ular merah "lupa mencatat pihak ketiga" — bidak meluncur turun ke kotak 12.',
      sfx: [[0.1, 'whoosh', 0.25], ['w:Kotak-0.4', 'tick', 0.3], ['w:Kotak', 'pop', 0.25], ['w:Kotak+0.25', 'pop', 0.25], ['w:Kotak+0.5', 'pop', 0.25], ['w:Turun', 'whoosh', 0.5], ['w:dua', 'hit', 0.35]],
      vis: U({ dadu: ['w:Kotak-0.6', 3], lompat: [[44, 47, 'w:Kotak']], ular: [[0, 'w:Turun']] }),
    },
    {
      id: 's2', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Naik tangga RoPA. Naik tangga DPIA. Lalu ular lagi: insiden tak dilapor tiga kali dua puluh empat jam. Turun.',
      layar: 'Bidak melompat ke 14 lalu memanjat tangga RoPA ke 35; melompat ke 38, memanjat tangga DPIA ke 51; melompat ke 58 — ular "insiden tak dilapor 3×24 jam" menurunkannya ke 30.',
      sfx: [['w:Naik', 'pop', 0.25], ['w:RoPA', 'ding', 0.3], ['w:Naik#2', 'pop', 0.25], ['w:DPIA', 'ding', 0.3], ['w:Lalu', 'tick', 0.25], ['w:Turun', 'whoosh', 0.5], ['w:Turun+0.9', 'hit', 0.35]],
      vis: U({ lompat: [[12, 14, 'w:Naik'], [35, 38, 'w:Naik#2'], [51, 58, 'w:Lalu']], tangga: [[0, 'w:RoPA'], [1, 'w:DPIA']], ular: [[1, 'w:Turun']] }),
    },
    {
      id: 's3', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Di Privasimu Nexus, tangganya panjang: satu platform, dari kotak tiga puluh langsung ke kotak patuh.',
      layar: 'Tangga emas panjang Nexus tergambar dari 30 ke 64; bidak memanjat dalam satu tarikan; kotak 64 "PATUH" meledak konfeti.',
      sfx: [['w:Nexus', 'whoosh', 0.4], ['w:tangganya', 'ding', 0.35], ['w:patuh', 'hit', 0.45], ['w:patuh+0.2', 'ding', 0.4]],
      vis: U({ nexus: 'w:Nexus', tangga: [[2, 'w:langsung-0.2']], konfeti: 'w:patuh' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Kurangi ularnya, panjangkan tangganya. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Kurangi ularnya, panjangkan tangganya.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: U({ cta: { tag: 'Kurangi ularnya,|*panjangkan tangganya*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
