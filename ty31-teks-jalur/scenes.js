// TY31 — TEKS DI JALUR / PUSARAN "Ke Mana Perginya?": kata-kata data pribadi mengalir mengikuti spiral yang mengecil ke
// tengah (pusaran) setelah tombol Kirim ditekan; lalu keluar tersusun sebagai baris RoPA: tujuan, penerima, retensi.
// Hook (anomali): "Ke mana perginya data setelah tombol 'Kirim' ditekan?"
// Komposisi: 50% edukasi · 50% meme. Satu gaya: SVG textPath dengan startOffset dianimasikan; spiral mengecil ke tengah.
(function (root) {
  const CONFIG = {
    title: 'TY31 · Ke Mana Perginya? (teks di jalur pusaran)',
    naskah: 'TY31',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+7%',
    maxPause: 0.4,
    beat: 60 / 96 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 96, mode: 'minor', root: 52, lead: 'keys', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.8 },
    meta: {
      judul: 'Ke Mana Perginya?',
      gaya: 'Teks di jalur / pusaran',
      tampilan: 'tombol KIRIM ditekan; kata nama · email · NIK mengalir di jalur spiral menuju pusaran gelap; keluar sebagai baris RoPA rapi; notifikasi "RoPA berhasil dibuat" asli',
      jenisHook: 'Anomali',
      hook: '"Ke mana perginya data setelah tombol \'Kirim\' ditekan?"',
      komposisi: '50% edukasi · 50% meme',
      fakta: [
        'RoPA: wizard mencatat tujuan, dasar pemrosesan, kategori data, subjek, penerima, retensi, dan pengamanan (fakta_produk.json: ropa). Layar = assets/app/ropa-tersimpan.png (notifikasi "RoPA berhasil dibuat", data demo).',
        'Isi baris RoPA di layar (tujuan/penerima/retensi) = contoh ilustrasi.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const J = (o) => ({ type: 'jl', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4, voDelay: 0.4, mus: 'hush',
      vo: 'Ke mana perginya data, setelah tombol Kirim ditekan?',
      layar: 'Tombol KIRIM besar ditekan di "Kirim"; kata-kata (nama · email · no. HP · NIK) mulai mengalir di jalur spiral menuju pusaran.',
      sfx: [['w:Kirim', 'key', 0.6], ['w:ditekan', 'suck', 0.4]],
      vis: J({ tekan: 'w:Kirim', alir: 'w:Kirim+0.2', teks: 'Ke mana perginya data setelah *Kirim* ditekan?' }),
    },
    {
      id: 's2', min: 4, voDelay: 0.25, mus: 'tense',
      vo: 'Berputar. Turun. Hilang ke sistem yang tidak ada yang mencatatnya.',
      layar: 'Aliran makin cepat ke pusat; pusaran menggelap.',
      sfx: [['w:Hilang', 'slidedown', 0.4]],
      vis: J({ cepat: 'w:Berputar', teks: 'Berputar. Turun. *Hilang*, tanpa catatan.' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.25, mus: 'main',
      vo: 'Di Privasimu Nexus, data yang masuk keluar sebagai catatan RoPA: tujuan, penerima, retensi. Tersimpan.',
      layar: 'Dari pusaran keluar baris RoPA rapi: Tujuan · Penerima · Retensi; notifikasi asli "RoPA berhasil dibuat".',
      sfx: [['w:keluar', 'reveal', 0.4], ['w:tujuan', 'pop', 0.3], ['w:penerima', 'pop', 0.3], ['w:retensi', 'pop', 0.3], ['w:Tersimpan', 'ding', 0.45]],
      vis: J({ keluar: 'w:keluar', baris: [['Tujuan', 'layanan pelanggan', 'w:tujuan'], ['Penerima', 'tim layanan · penyedia cloud (pihak ketiga)', 'w:penerima'], ['Retensi', '5 tahun setelah kontrak berakhir', 'w:retensi']], simpan: 'w:Tersimpan', teks: 'Keluar sebagai *catatan RoPA*.' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Tahu ke mana perginya. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Tahu ke mana perginya.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: J({ cta: { tag: 'Tahu ke mana|*perginya*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
