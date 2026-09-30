// GB05 — ONE-LINE ART "Satu Garis": satu garis tinta yang tidak pernah putus menggambar perjalanan satu data pelanggan.
// Rute garis = siluet gembok: badan gembok = perjalanan data yang tidak tercatat (marketing, layanan pelanggan, pihak
// ketiga, cloud, lalu kusut); sengkang = perjalanan di Privasimu Nexus (bukti persetujuan, RoPA, DPIA, DSR);
// garis berakhir di lubang kunci. Saat kamera mundur, seluruh perjalanan terlihat sebagai satu gembok.
// Hook (reverse psychology): "Jangan ikuti garis ini… kalau kamu sudah tahu ke mana saja data pelangganmu pergi."
// Komposisi: ± 90% edukasi · 10% meme. Sumber: flow unggulan "Perjalanan Satu Data" (versi 60 dtk). Rina = tokoh ilustrasi.
//
// vis.gambar: [[potongan, mulai, selesai], …] = kapan tiap potongan garis digambar (cue lokal scene).
//   Potongan penghubung di antaranya (rute gembok) dijadwalkan otomatis mengisi celah waktu. Geometri ada di style.js.
// vis.teks: baris narasi di layar; tiap kata muncul saat diucapkan. '*kata*' = aksen warna.
(function (root) {
  const CONFIG = {
    title: 'GB05 · Satu Garis (one-line art)',
    naskah: 'GB05',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+10%',
    maxPause: 0.45,
    beat: 60 / 84 / 2,
    tail: 0.35,
    burnCaptions: false, // narasi sudah tampil di layar sebagai bagian desain; .srt tetap dibuat
    music: { bpm: 84, mode: 'major', root: 57, lead: 'keys', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.8 },
  };
  const OL = (o) => ({ type: 'ol', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 6, voDelay: 0.7, mus: 'hush',
      vo: 'Jangan ikuti garis ini… kalau kamu sudah tahu ke mana saja data pelangganmu pergi.',
      sfx: [[0.12, 'pop', 0.3], [0.2, 'paper', 0.3]],
      vis: OL({
        teks: ['*Jangan* ikuti garis ini…', 'kalau kamu sudah tahu ke mana saja', 'data pelangganmu pergi.'], teksAwal: 1, // baris 1 tampil sejak frame pertama
        gambar: [['pembuka', 0.2, 'end-0.15']],
      }),
    },
    {
      id: 's2', min: 5, voDelay: 0.35, mus: 'calm',
      vo: 'Ini Rina. Dia baru saja mengisi formulir, dan klik setuju.',
      sfx: [['w:Rina', 'pop', 0.3], ['w:formulir', 'paper', 0.3], ['w:setuju+0.35', 'check', 0.4]],
      vis: OL({
        teks: ['Ini *Rina.*', 'Dia baru saja mengisi formulir,', 'dan klik *setuju.*'],
        gambar: [['rina', 'w:Ini-0.25', 'w:Dia-0.1'], ['form', 'w:mengisi-0.2', 'w:setuju+0.55']],
      }),
    },
    {
      id: 's3', min: 8, voDelay: 0.3, mus: 'main',
      vo: 'Sejak itu, datanya berjalan. Ke tim marketing. Ke layanan pelanggan. Ke pihak ketiga. Ke cloud.',
      sfx: [['w:berjalan', 'whoosh', 0.25], ['w:marketing', 'pop', 0.3], ['w:pelanggan', 'pop', 0.3], ['w:ketiga', 'pop', 0.3], ['w:cloud', 'pop', 0.3]],
      vis: OL({
        teks: ['Sejak itu, datanya *berjalan.*', 'Ke tim marketing. Ke layanan pelanggan.', 'Ke pihak ketiga. Ke cloud.'],
        gambar: [['marketing', 'w:marketing-0.55', 'w:marketing+0.75'], ['cs', 'w:layanan-0.35', 'w:pelanggan+0.6'],
          ['pihak3', 'w:pihak-0.35', 'w:ketiga+0.6'], ['cloud', 'w:cloud-0.4', 'w:cloud+0.9']],
      }),
    },
    {
      id: 's4', min: 8, voDelay: 0.35, tail: 0.7, mus: 'tense',
      vo: 'Lalu Rina minta datanya dihapus. Tanpa catatan, tidak ada yang tahu harus mulai dari mana. Garisnya… kusut.',
      sfx: [['w:dihapus', 'notif', 0.3], ['w:Tanpa', 'riser', 0.22], ['w:kusut', 'scratch', 0.4]],
      vis: OL({
        teks: ['Lalu Rina minta datanya *dihapus.*', 'Tanpa catatan, tidak ada yang tahu', 'harus mulai dari mana. Garisnya… *kusut.*'],
        gambar: [['surat', 'w:Rina-0.3', 'w:dihapus+0.5'], ['kusut', 'w:Tanpa-0.1', 'w:kusut+0.7']],
      }),
    },
    {
      id: 's5', min: 4.5, voDelay: 0.35, mus: 'main',
      vo: 'Di Privasimu Nexus, garisnya rapi. Setiap langkah tercatat.',
      sfx: [['w:garisnya', 'shimmer', 0.4], ['w:rapi', 'ding', 0.35], ['w:tercatat', 'check', 0.35]],
      vis: OL({
        teks: ['Di *Privasimu Nexus,*', 'garisnya *rapi.*', 'Setiap langkah tercatat.'],
        urai: ['w:garisnya-0.1', 'w:rapi+0.35'],
        gambar: [['o7', 'w:Setiap-0.15', 'end-0.0']], // kamera menunggu di gulungan sampai garisnya rapi, baru lanjut
      }),
    },
    {
      id: 's6', min: 8, voDelay: 0.3, mus: 'main',
      vo: 'Persetujuannya tersimpan beserta buktinya. Pemrosesannya tercatat di RoPA. Risikonya dinilai lewat DPIA.',
      sfx: [['w:buktinya', 'check', 0.4], ['w:RoPA', 'check', 0.4], ['w:DPIA', 'check', 0.4]],
      vis: OL({
        teks: ['Persetujuannya tersimpan beserta *buktinya.*', 'Pemrosesannya tercatat di *RoPA.*', 'Risikonya dinilai lewat *DPIA.*'],
        gambar: [['bukti', 'w:Persetujuannya', 'w:buktinya+0.45'], ['ropa', 'w:Pemrosesannya', 'w:RoPA+0.5'], ['dpia', 'w:Risikonya', 'w:DPIA+0.55']],
      }),
    },
    {
      id: 's7', min: 4.5, voDelay: 0.3, mus: 'calm',
      vo: 'Dan permintaan Rina? Terlacak, sampai selesai.',
      sfx: [['w:Terlacak', 'pop', 0.3], ['w:selesai', 'correct', 0.45]],
      vis: OL({
        teks: ['Dan permintaan Rina?', '*Terlacak,* sampai selesai.'],
        gambar: [['dsr', 'w:permintaan-0.2', 'w:selesai+0.45']],
      }),
    },
    {
      id: 's8', min: 9, voDelay: 0.4, tail: 2.2, free: true, mus: 'outro',
      vo: 'Satu data, satu garis, satu platform. Privasimu Nexus. Cek kesiapanmu gratis, di privasimu dot com.',
      sfx: [['w:Satu', 'whoosh', 0.3], ['w:platform', 'impact', 0.4], ['w:Privasimu', 'reveal', 0.4], ['w:Cek', 'pop', 0.4], ['w:privasimu#2', 'ding', 0.4]],
      vis: OL({
        teks: ['Satu data, satu garis,', '*satu platform.*'],
        gambar: [['pulang', 0.05, 'w:garis+0.2'], ['kunci', 'w:satu#3-0.2', 'w:platform+1.0']],
        mundur: 'w:Satu+0.1', logoAt: 'w:Privasimu', ctaAt: 'w:Cek', urlAt: 'w:privasimu#2',
      }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
