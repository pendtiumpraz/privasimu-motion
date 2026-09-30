// TY46 — FINE PRINT ZOOM "Tanda Bintang": formulir dengan tombol Setuju; kamera menyelam ke tanda bintang kecil di
// bawahnya, terus masuk sampai ke dalam tanda bintang itu sendiri: log persetujuan per subjek.
// Hook (anomali): "Pelanggan sudah klik Setuju. Pertanyaannya: bisa kamu buktikan?"
// Komposisi: 70% edukasi · 30% meme. Satu gaya: zoom eksponensial berkelanjutan ke teks mikro (ketajaman muncul bertahap).
(function (root) {
  const CONFIG = {
    title: 'TY46 · Tanda Bintang (zoom tulisan kecil)',
    naskah: 'TY46',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 96 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 96, mode: 'major', root: 55, lead: 'keys', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.8 },
    meta: {
      judul: 'Tanda Bintang',
      gaya: 'Tulisan kecil (fine print) zoom',
      tampilan: 'formulir pendaftaran bersih dengan tombol Setuju; kamera menyelam ke catatan kaki bertanda bintang, lalu masuk ke dalam tanda bintangnya: log persetujuan',
      jenisHook: 'Anomali',
      hook: '"Pelanggan sudah klik Setuju. Pertanyaannya: bisa kamu buktikan?"',
      komposisi: '70% edukasi · 30% meme',
      sasaran: 'pemilik produk digital, tim pemasaran & legal, DPO/PPDP',
      fakta: [
        'Consent & Cookie: log persetujuan beserta bukti untuk setiap subjek; titik pengumpulan per kanal (web, aplikasi, loket); penarikan dihormati di seluruh kanal (fakta_produk.json: consent).',
        'Formulir dan tabel log di layar = ilustrasi tampilan (diberi label), bukan tangkapan layar aplikasi; nama subjek disamarkan.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const F = (o) => ({ type: 'fp', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 3.2, voDelay: 0.35, mus: 'calm',
      vo: 'Pelanggan sudah klik Setuju.',
      layar: 'Formulir "Buat akun" dengan kotak centang syarat & ketentuan*. Di "klik", tombol Setuju ditekan; centang menyala.',
      sfx: [['w:klik', 'key', 0.6], ['w:Setuju+0.1', 'check', 0.4]],
      vis: F({ klik: 'w:klik', teks: 'Pelanggan sudah klik *Setuju*.' }),
    },
    {
      id: 's2', min: 3.5, voDelay: 0.25, mus: 'tense',
      vo: 'Pertanyaannya: bisa kamu buktikan?',
      layar: 'Kamera menyelam ke catatan kaki kecil di bawah formulir: "*bukti persetujuan: ada / tidak ada?"',
      sfx: [['w:bisa-0.1', 'riser', 0.3]],
      vis: F({ zoom1: 'w:Pertanyaannya', teks: 'Pertanyaannya: *bisa kamu buktikan?*' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.2, mus: 'main',
      vo: 'Di Privasimu Nexus, setiap persetujuan tersimpan beserta buktinya: siapa, kapan, kanal apa, versi apa.',
      layar: 'Kamera terus masuk ke dalam tanda bintang → log persetujuan per subjek: kolom subjek, waktu, kanal, versi, bukti ✓. Label "*ilustrasi tampilan".',
      sfx: [['w:Di', 'riser', 0.3], ['w:tersimpan', 'pop', 0.35], ['w:siapa', 'tick', 0.35], ['w:kapan', 'tick', 0.35], ['w:kanal', 'tick', 0.35], ['w:versi', 'tick', 0.35]],
      vis: F({ zoom2: 'w:Di', kolom: ['w:siapa', 'w:kapan', 'w:kanal', 'w:versi'], teks: 'Tersimpan beserta *buktinya*: siapa, kapan, kanal, versi.' , teksAt: 'w:tersimpan' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Buktinya juga harus satu klik. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Setuju satu klik. Buktinya juga.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: F({ cta: { terang: true, tag: 'Setuju itu satu klik.|*Buktinya* juga.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
