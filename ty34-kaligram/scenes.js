// TY34 — KALIGRAM "Gembok dari Kata-kata": ratusan kata kecil (RoPA, DPIA, bukti, log audit, tenggat…) berkumpul
// membentuk siluet gembok; kata yang diucapkan menyala; sengkang gembok turun mengunci → logo.
// Hook (anomali): "Gembok ini tidak terbuat dari besi, tapi dari catatan."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: kata ditempatkan di titik-titik siluet (dihitung sekali dari kanvas).
(function (root) {
  const CONFIG = {
    title: 'TY34 · Gembok dari Kata-kata (kaligram)',
    naskah: 'TY34',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+6%',
    maxPause: 0.4,
    beat: 60 / 92 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 92, mode: 'minor', root: 52, lead: 'keys', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.8 },
    meta: {
      judul: 'Gembok dari Kata-kata',
      gaya: 'Kaligram (kata membentuk gambar)',
      tampilan: 'navy gelap; ratusan kata kecil putih-biru tersusun membentuk gembok; kata yang disebut menyala kuning; sengkang turun mengunci',
      jenisHook: 'Anomali',
      hook: '"Gembok ini tidak terbuat dari besi, tapi dari catatan."',
      komposisi: '70% edukasi · 30% meme',
      fakta: [
        'Kata-kata di gembok = istilah modul Nexus yang nyata: RoPA, DPIA, DSR, bukti persetujuan, log audit, tenggat, insiden 3×24 jam, pihak ketiga, transfer, TIA, LIA (fakta_produk.json).',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const K = (o) => ({ type: 'kg', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4, voDelay: 0.5, mus: 'hush',
      vo: 'Gembok ini tidak terbuat dari besi. Tapi dari catatan.',
      layar: 'Ratusan kata berkumpul cepat membentuk gembok (selesai ± 1,3 detik). Di "catatan", kamera mendekat ke badan gembok sampai kata-katanya terbaca.',
      sfx: [[0.05, 'shimmer', 0.35], ['w:catatan-0.1', 'whoosh', 0.3]],
      vis: K({ kumpul: 0.05, dekat: 'w:catatan-0.1', teks: 'Gembok ini tidak terbuat dari besi. Tapi dari *catatan*.' }),
    },
    {
      id: 's2', min: 5, voDelay: 0.25, mus: 'main',
      vo: 'RoPA. DPIA. Bukti persetujuan. Log audit. Tenggat. Semua tercatat di satu tempat.',
      layar: 'Kata yang diucapkan menyala kuning di seluruh gembok (RoPA, DPIA, bukti persetujuan, log audit, tenggat). Di "satu tempat", kamera mundur: gembok utuh.',
      sfx: [['w:RoPA', 'tick', 0.35], ['w:DPIA', 'tick', 0.35], ['w:Bukti', 'tick', 0.35], ['w:Log', 'tick', 0.35], ['w:Tenggat', 'tick', 0.35], ['w:satu', 'whoosh', 0.3]],
      vis: K({ nyala: [['ropa', 'w:RoPA'], ['dpia', 'w:DPIA'], ['bukti', 'w:Bukti'], ['log', 'w:Log'], ['tenggat', 'w:Tenggat']], jauh: 'w:Semua', teks: '*RoPA. DPIA. Bukti. Log. Tenggat.* Semua tercatat di satu tempat.' }),
    },
    {
      id: 's3', min: 3, voDelay: 0.6, mus: 'main',
      vo: 'Privasimu Nexus.',
      layar: 'Sengkang gembok turun dan mengunci (bunyi klik logam); logo Privasimu Nexus muncul di bawah gembok.',
      sfx: [[0.25, 'clank', 0.6], ['w:Privasimu', 'shimmer', 0.35]],
      vis: K({ kunci: 0.25, logoAt: 'w:Privasimu' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Kepatuhan yang terbuat dari catatan. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Kepatuhan yang terbuat dari catatan.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: K({ cta: { tag: 'Kepatuhan yang terbuat|dari *catatan*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
