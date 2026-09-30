// TY45 — TES MATA "Baca Baris Paling Bawah": papan tes mata yang hurufnya membentuk kalimat persetujuan. Makin ke bawah
// makin kecil, dan justru di baris terkecil tertulis untuk apa datanya dipakai.
// Hook (reverse psychology): "Coba baca baris paling bawah. Itu syarat yang baru saja kamu setujui."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: papan huruf yang mengecil + penunjuk + kamera mendekat.
(function (root) {
  const CONFIG = {
    title: 'TY45 · Baca Baris Paling Bawah (tes mata)',
    naskah: 'TY45',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 92 / 2,
    tail: 0.35,
    burnCaptions: false, // kalimat VO tampil di pita teks bawah; .srt tetap dibuat
    music: { bpm: 92, mode: 'major', root: 55, lead: 'bell', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.75 },
    meta: {
      judul: 'Baca Baris Paling Bawah',
      gaya: 'Tes mata (papan huruf mengecil)',
      tampilan: 'papan tes mata hitam-putih; hurufnya membentuk kalimat persetujuan, penunjuk merah turun ke baris terkecil, kamera mendekat',
      jenisHook: 'Reverse psychology',
      hook: '"Coba baca baris paling bawah. Itu syarat yang baru saja kamu setujui."',
      komposisi: '70% edukasi · 30% meme',
      sasaran: 'pemilik produk digital, tim legal & pemasaran, DPO/PPDP',
      fakta: [
        'UU PDP (UU 27/2022) Pasal 22 ayat (4): permintaan persetujuan harus dapat dibedakan secara jelas, dibuat dengan format yang dapat dipahami dan mudah diakses, serta memakai bahasa yang sederhana dan jelas; ayat (5): bila tidak, batal demi hukum. CEK ULANG bunyi pasal sebelum tayang.',
        'Inclusive Privacy = persetujuan yang aksesibel bagi penyandang disabilitas (fakta_produk.json: consent). Layar yang tampil = layar asli (assets/app/inclusive-privacy.png).',
        'Kalimat di papan ("…dibagikan ke pihak ketiga untuk pemasaran…") = contoh ilustrasi, bukan kutipan dokumen mana pun.',
      ],
    },
  };
  const M = (o) => ({ type: 'tm', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 3, voDelay: 0.35, mus: 'hook',
      vo: 'Coba baca baris paling bawah.',
      layar: 'Papan tes mata: SAYA / SETUJU / DATA SAYA / BOLEH DIPAKAI / DAN DIBAGIKAN / KE PIHAK KETIGA / … makin kecil. Penunjuk merah turun dari baris pertama ke baris terkecil.',
      sfx: [['w:baris', 'slidedown', 0.3], ['w:bawah+0.25', 'tick', 0.5]],
      vis: M({ turun: 'w:baris', teks: 'Coba baca baris *paling bawah*.', karaoke: true }),
    },
    {
      id: 's2', min: 3.5, voDelay: 0.25, mus: 'tense',
      vo: 'Itu syarat yang baru saja kamu setujui.',
      layar: 'Kamera mendekat ke dua baris terkecil; tulisannya menajam: "untuk pemasaran, pemrofilan, dan tujuan lain".',
      sfx: [[0.1, 'riser', 0.3], ['w:setujui', 'impact', 0.4]],
      vis: M({ zoom: 0.1, teks: 'Itu syarat yang baru saja kamu *setujui*.' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.2, mus: 'main',
      vo: 'Persetujuan yang tidak terbaca, bukan persetujuan. Inclusive Privacy membuatnya aksesibel untuk semua orang.',
      layar: 'Kamera mundur; semua baris berubah jadi sama besar dan terbaca. Layar Inclusive Privacy asli masuk. Catatan kecil: UU PDP Pasal 22.',
      sfx: [['w:bukan', 'whoosh', 0.35], ['w:bukan+0.7', 'check', 0.45], ['w:Inclusive-0.1', 'whoosh', 0.3]],
      vis: M({ jelas: 'w:bukan-0.1', layar: 'w:Inclusive-0.1', teks: 'Persetujuan yang tidak terbaca, *bukan persetujuan*.', teks2: '*Inclusive Privacy*: aksesibel untuk semua orang.', teks2At: 'w:Inclusive', catatan: 'UU PDP Pasal 22: jelas, mudah dipahami, mudah diakses' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.6,
      vo: 'Privasimu Nexus. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo Privasimu Nexus, "Persetujuan yang bisa dibaca semua orang.", tombol privasimu.com, kontak.',
      sfx: [[0.1, 'shimmer', 0.3], ['w:Cek', 'pop', 0.4]],
      vis: M({ cta: { terang: true, tag: 'Persetujuan yang bisa dibaca|*semua orang*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
