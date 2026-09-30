// UI06 — LOCK SCREEN (notifikasi) "Sehari dalam Notifikasi": layar kunci ponsel; jam besar berganti 07.00 → 23.00 → 03.12;
// kartu notifikasi masuk dari atas dan menumpuk sepanjang hari; dugaan insiden jam 3 pagi; lalu satu notifikasi rapi
// dari Privasimu Nexus: antrean kerja PPDP; CTA. (Ikon aplikasi generik, tanpa merek.)
// Hook (relate): "07.00: 'Pagi, bisa minta RoPA terbaru?'"
// Komposisi: 70% edukasi · 30% meme. Satu gaya: UI layar kunci (jam besar + tumpukan notifikasi).
(function (root) {
  const CONFIG = {
    title: 'UI06 · Sehari dalam Notifikasi (lock screen)',
    naskah: 'UI06',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+12%',
    maxPause: 0.4,
    beat: 60 / 104 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 104, mode: 'minor', root: 52, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.7 },
    meta: {
      judul: 'Sehari dalam Notifikasi',
      gaya: 'Lock screen (notifikasi)',
      tampilan: 'layar kunci ponsel (bingkai ponsel di 16:9, penuh layar di 9:16) dengan wallpaper gradien; jam & tanggal besar; kartu notifikasi kaca masuk dari atas dan menumpuk; notifikasi merah jam 03.12 bergetar; satu kartu Privasimu Nexus rapi',
      jenisHook: 'Relate',
      hook: '"07.00: \'Pagi, bisa minta RoPA terbaru?\'"',
      komposisi: '70% edukasi · 30% meme',
      fakta: [
        'Dukungan PPDP (fakta_produk.json): antrean pekerjaan yang menunggu tindakan; dasbor kepatuhan lintas modul; asisten AI Priva.',
        'DSR: tenggat otomatis 72 jam. Insiden: daftar periksa & linimasa otomatis, penghitung 3×24 jam.',
        'Isi notifikasi & angka antrean (5 tugas · 1 insiden · 71 jam) = ilustrasi (ditandai *); aplikasi pengirim generik.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const U = (o) => ({ type: 'lsc', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4.5, voDelay: 0.5, mus: 'hook',
      vo: 'Tujuh pagi: "Pagi, bisa minta RoPA terbaru?"',
      layar: 'Layar kunci 07.00, Senin; notifikasi "Chat tim · Pagi, bisa minta RoPA terbaru?" masuk dari atas.',
      sfx: [[0.1, 'whoosh', 0.25], ['w:Pagi#2-0.2', 'ding', 0.35]],
      vis: U({ jam: [['07.00', 0]], notif: [[0, 'w:Pagi#2-0.2']] }),
    },
    {
      id: 's2', min: 5, voDelay: 0.3, mus: 'main',
      vo: 'Setengah sepuluh, audit internal. Siang, kontrak pihak ketiga. Sore, permohonan hapus data. Malam, penarikan persetujuan.',
      layar: 'Jam melompat 09.30 → 12.15 → 17.40 → 23.00; empat notifikasi menumpuk (Email, Kalender, Portal DSR, Chat tim).',
      sfx: [['w:Setengah', 'ding', 0.3], ['w:Siang', 'ding', 0.3], ['w:Sore', 'ding', 0.3], ['w:Malam', 'ding', 0.3]],
      vis: U({ jam: [['09.30', 'w:Setengah-0.3'], ['12.15', 'w:Siang-0.3'], ['17.40', 'w:Sore-0.3'], ['23.00', 'w:Malam-0.3']], notif: [[1, 'w:Setengah'], [2, 'w:Siang'], [3, 'w:Sore'], [4, 'w:Malam']] }),
    },
    {
      id: 's3', min: 4, voDelay: 0.4, mus: 'tense',
      vo: 'Tiga pagi: dugaan insiden. Laptop hilang.',
      layar: 'Jam 03.12, layar redup; notifikasi merah "Keamanan · Dugaan insiden: laptop berisi data pelanggan hilang" masuk, ponsel bergetar.',
      sfx: [['w:Tiga-0.2', 'hit', 0.45], ['w:dugaan', 'hit', 0.3]],
      vis: U({ jam: [['03.12', 'w:Tiga-0.3']], notif: [[5, 'w:Tiga']], getar: 'w:Tiga' }),
    },
    {
      id: 's4', min: 5, voDelay: 0.3, mus: 'main',
      vo: 'Di Privasimu Nexus, semuanya jadi satu antrean kerja: tugas, tenggat, insiden. Plus asisten AI Priva.',
      layar: 'Semua notifikasi tersapu; satu kartu rapi "Privasimu Nexus · Antrean kerja PPDP: 5 tugas · 1 insiden · tenggat 71 jam*" + "Asisten AI Priva siap"; jam 07.00 hari baru.',
      sfx: [['w:Di', 'whoosh', 0.4], ['w:satu', 'ding', 0.35], ['w:Plus', 'pop', 0.3]],
      vis: U({ jam: [['07.00', 'w:Di']], sapu: 'w:Di', rapi: 'w:satu', priva: 'w:Plus' }),
    },
    {
      id: 's5', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Notifikasi boleh banyak, antreannya satu. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Notifikasi boleh banyak, antrean cuma satu.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: U({ cta: { tag: 'Notifikasi boleh banyak,|*antrean cuma satu*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
