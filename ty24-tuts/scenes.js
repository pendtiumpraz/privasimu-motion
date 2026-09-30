// TY24 — TUTS KEYBOARD "Ctrl + Z": tuts raksasa ditekan; salah ketik bisa di-undo, data yang bocor tidak; tuts lebar
// FIRE DRILL menggantikan: latihan sebelum kejadian.
// Hook (logika dipatahkan): "Semua bisa di-undo. Kecuali data yang sudah bocor."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: kotak tuts 3D semu (bayangan) turun saat ditekan; SFX key.
(function (root) {
  const CONFIG = {
    title: 'TY24 · Ctrl + Z (tuts keyboard)',
    naskah: 'TY24',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+7%',
    maxPause: 0.4,
    beat: 60 / 104 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 104, mode: 'minor', root: 50, lead: 'chip', drums: 'light', sonic: true },
    mix: { duckTo: 0.4, musicGain: 0.8 },
    meta: {
      judul: 'Ctrl + Z',
      gaya: 'Tuts keyboard',
      tampilan: 'meja gelap; tuts keyboard raksasa berbayang (Ctrl, Z) turun 8 px saat ditekan; layar kecil di atasnya; tuts lebar FIRE DRILL',
      jenisHook: 'Logika dipatahkan',
      hook: '"Semua bisa di-undo. Kecuali data yang sudah bocor."',
      komposisi: '70% edukasi · 30% meme',
      fakta: [
        'Simulasi & Fire Drill: skenario kuis, tabletop, dan walkthrough; skenario kustom berbantuan AI; penilaian rubrik (fakta_produk.json: simulation). Layar = assets/app/fire-drill-header.png.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const K = (o) => ({ type: 'kb', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 3.2, voDelay: 0.35, mus: 'main',
      vo: 'Semua bisa di-undo.',
      layar: 'Layar kecil: "laporan bulanan finall.docx" (salah ketik). Tuts Ctrl + Z ditekan → huruf tambahan hilang. Centang hijau.',
      sfx: [['w:di-undo-0.1', 'key', 0.6], ['w:di-undo+0.25', 'check', 0.4]],
      vis: K({ tekan: [['w:di-undo-0.1']], undoKetik: 'w:di-undo', teks: 'Semua bisa *di-undo*.' }),
    },
    {
      id: 's2', min: 4, voDelay: 0.25, mus: 'tense',
      vo: 'Kecuali data yang sudah bocor.',
      layar: 'Layar: "DATA PELANGGAN BOCOR" merah. Ctrl + Z ditekan tiga kali cepat → tidak terjadi apa-apa; tooltip "tidak bisa dibatalkan".',
      sfx: [['w:bocor', 'key', 0.6], ['w:bocor+0.3', 'key', 0.6], ['w:bocor+0.6', 'key', 0.6], ['w:bocor+0.85', 'buzzer', 0.45]],
      vis: K({ bocor: 'w:Kecuali', tekan: [['w:bocor'], ['w:bocor+0.3'], ['w:bocor+0.6']], gagal: 'w:bocor+0.85', teks: 'Kecuali *data yang sudah bocor*.' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.25, mus: 'main',
      vo: 'Yang bisa: latihan sebelum kejadian. Fire Drill: skenario kuis, tabletop, walkthrough.',
      layar: 'Tuts lebar "FIRE DRILL" masuk menggantikan Ctrl + Z, ditekan → layar Fire Drill asli; cip kuis · tabletop · walkthrough.',
      sfx: [['w:Fire-0.1', 'whoosh', 0.35], ['w:Fire', 'key', 0.7], ['w:kuis', 'pop', 0.3], ['w:tabletop', 'pop', 0.3], ['w:walkthrough', 'pop', 0.3]],
      vis: K({ drill: 'w:Yang', tekanDrill: 'w:Fire', cip: [['kuis', 'w:kuis'], ['tabletop', 'w:tabletop'], ['walkthrough', 'w:walkthrough']], teks: 'Yang bisa: *latihan* sebelum kejadian.' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Latihan dulu, sebelum jadi berita. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Latihan dulu, sebelum jadi berita.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: K({ cta: { tag: 'Latihan dulu,|*sebelum jadi berita*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
