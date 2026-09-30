// TY25 — ENTRI KAMUS "DPO (n.)": halaman kamus; kata kepala, cara baca, kelas kata, arti bernomor yang makin jujur,
// lalu arti terakhir: dengan Privasimu Nexus. Gambar ilustrasi kamus = layar asisten AI Priva asli.
// Hook (relate): "DPO (n.): orang yang ditanya semua hal tentang data, termasuk yang bukan urusannya."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: tata letak kamus serif; arti muncul per kata; nomor arti bertambah.
(function (root) {
  const CONFIG = {
    title: 'TY25 · DPO (n.) (entri kamus)',
    naskah: 'TY25',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+6%',
    maxPause: 0.4,
    beat: 60 / 88 / 2,
    tail: 0.35,
    burnCaptions: false, // teks kamus = ucapan
    music: { bpm: 88, mode: 'major', root: 55, lead: 'keys', drums: 'none', sonic: true },
    mix: { duckTo: 0.45, musicGain: 0.8 },
    meta: {
      judul: 'DPO (n.)',
      gaya: 'Entri kamus',
      tampilan: 'halaman kamus krem berhuruf serif: kata kepala DPO, cara baca, kelas kata, arti 1–3 yang makin jujur, gambar ilustrasi = layar Priva asli',
      jenisHook: 'Relate',
      hook: '"DPO (n.): orang yang ditanya semua hal tentang data, termasuk yang bukan urusannya."',
      komposisi: '70% edukasi · 30% meme',
      sasaran: 'DPO/PPDP dan rekan kerjanya',
      rekam: ['Dibaca seperti pembaca kamus: datar, jelas, sedikit jenaka di arti 1 dan 2.'],
      fakta: [
        'Dukungan PPDP: dasbor kepatuhan lintas modul, antrean pekerjaan, asisten AI Priva yang menjawab berdasarkan knowledge base platform (fakta_produk.json: ppdp).',
        '"Enam spreadsheet" = angka ilustrasi (diberi label). Layar yang tampil = AI Agent asli (assets/app/ai-agent-home.png).',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const K = (o) => ({ type: 'km', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.4, mus: 'calm',
      vo: 'DPO. Kata benda. Satu: orang yang ditanya semua hal tentang data, termasuk yang bukan urusannya.',
      layar: 'Halaman kamus: DPO /de·pe·o/ n. — arti 1 sudah terlihat redup sejak frame pertama dan menyala per kata.',
      sfx: [[0.1, 'paper', 0.35], ['w:Satu', 'tick', 0.35]],
      vis: K({ arti: 0, karaoke: true }),
    },
    {
      id: 's2', min: 4.5, voDelay: 0.25, mus: 'calm',
      vo: 'Dua: orang yang membuka enam spreadsheet dulu sebelum menjawab: sebentar, saya cek.',
      layar: 'Arti 2 muncul per kata; catatan kecil "*angka ilustrasi".',
      sfx: [['w:Dua', 'tick', 0.35], ['w:sebentar', 'pop', 0.3]],
      vis: K({ arti: 1 }),
    },
    {
      id: 's3', min: 6, voDelay: 0.25, mus: 'main',
      vo: 'Tiga: dengan Privasimu Nexus, orang dengan satu dasbor kepatuhan, antrean kerja, dan asisten AI bernama Priva.',
      layar: 'Arti 3 muncul; gambar ilustrasi kamus: layar AI Agent asli dengan keterangan "Gambar 1. Priva".',
      sfx: [['w:Tiga', 'tick', 0.35], ['w:Priva-0.2', 'shimmer', 0.35]],
      vis: K({ arti: 2, gambarAt: 'w:asisten-0.2' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Lihat juga: privasimu dot com. Cek kesiapanmu, gratis.',
      layar: 'Baris "Lihat juga" → kartu penutup bergaya kamus: logo, "Lihat juga: privasimu.com", kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: K({ cta: { terang: true, tag: 'Lihat juga:', at: 'w:privasimu-0.3', btnAt: 'w:privasimu-0.05', sub: 'Cek kesiapanmu · *gratis*' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
