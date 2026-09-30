// TY51 — ZOOM TANPA AKHIR "Di Dalam Titik Huruf i": kamera masuk ke titik huruf i; di dalamnya ada kalimat berikutnya,
// yang titik i-nya berisi kalimat berikutnya lagi: RoPA → risiko tinggi → draf DPIA otomatis → rencana penanganan risiko.
// Hook (anomali): "Di dalam titik huruf i ini, ada satu kewajiban lagi."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: tingkat bersarang (tiap tingkat = layar penuh yang diperkecil ke titik i).
// Tingkat (LEVEL) didefinisikan di style.js; scene hanya menentukan kapan kamera masuk (vis.masuk) dan teks pendamping.
(function (root) {
  const CONFIG = {
    title: 'TY51 · Di Dalam Titik Huruf i (zoom tanpa akhir)',
    naskah: 'TY51',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 100 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 100, mode: 'major', root: 57, lead: 'bell', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.8 },
    meta: {
      judul: 'Di Dalam Titik Huruf i',
      gaya: 'Zoom tanpa akhir lewat huruf',
      tampilan: 'kalimat besar berlatar warna merek; kamera masuk ke titik huruf i dan menemukan kalimat berikutnya, berulang empat kali',
      jenisHook: 'Anomali',
      hook: '"Di dalam titik huruf i ini, ada satu kewajiban lagi."',
      komposisi: '70% edukasi · 30% meme',
      fakta: [
        'RoPA: data yang bersifat spesifik menandai risiko TINGGI otomatis; RoPA berisiko TINGGI otomatis membuat draf DPIA (fakta_produk.json: ropa).',
        'DPIA: rencana penanganan risiko (Risk Treatment Plan) (fakta_produk.json: dpia).',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const Z = (o) => ({ type: 'zi', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4, voDelay: 0.35, mus: 'hook',
      vo: 'Di dalam titik huruf i ini, ada satu kewajiban lagi.',
      layar: 'Navy: "Di dalam titik huruf i". Di "ada", kamera masuk ke titik huruf i terakhir → tingkat berikutnya (biru).',
      sfx: [['w:ada-0.05', 'riser', 0.3], ['w:ada+1.25', 'pop', 0.4]],
      vis: Z({ tingkat: 0, masuk: 'w:ada-0.05', teks: 'ada satu *kewajiban* lagi.', teksAt: 'w:ada' }),
    },
    {
      id: 's2', min: 4, voDelay: 0.25, mus: 'main',
      vo: 'RoPA mencatat kegiatannya. Kalau risikonya tinggi…',
      layar: 'Biru: "RoPA mencatat kegiatannya. / risiko tinggi". Di "tinggi", kamera masuk ke titik i → tingkat ungu.',
      sfx: [['w:tinggi-0.05', 'riser', 0.3], ['w:tinggi+1.25', 'pop', 0.4]],
      vis: Z({ tingkat: 1, masuk: 'w:tinggi-0.05' }),
    },
    {
      id: 's3', min: 3.5, voDelay: 0.2, mus: 'main',
      vo: '…draf DPIA dibuat otomatis.',
      layar: 'Ungu: "draf DPIA / dibuat otomatis". Di "otomatis", kamera masuk ke titik i → tingkat krem.',
      sfx: [['w:otomatis-0.05', 'riser', 0.3], ['w:otomatis+1.25', 'pop', 0.4]],
      vis: Z({ tingkat: 2, masuk: 'w:otomatis-0.05' }),
    },
    {
      id: 's4', min: 3.5, voDelay: 0.2, mus: 'main',
      vo: 'Lengkap dengan rencana penanganan risikonya.',
      layar: 'Krem: "rencana penanganan / risiko". Di "risikonya", kamera masuk ke titik i → tingkat terakhir: logo.',
      sfx: [['w:risikonya-0.05', 'riser', 0.3], ['w:risikonya+1.25', 'shimmer', 0.4]],
      vis: Z({ tingkat: 3, masuk: 'w:risikonya-0.05' }),
    },
    {
      id: 's5', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Satu platform, kewajiban yang saling menyambung. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo Privasimu Nexus, "Kewajiban yang saling menyambung.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: Z({ tingkat: 4, cta: { tag: 'Kewajiban yang|*saling menyambung*.', at: 0.15, btnAt: 'w:Cek', tirai: false } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
