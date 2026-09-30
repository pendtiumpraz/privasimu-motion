// TY54 — TIPOGRAFI AKSESIBEL "Persetujuan yang Bisa Dibaca": kalimat persetujuan yang sama berubah dari kecil-rapat-
// pudar menjadi besar, renggang, kontras tinggi; lalu dibacakan (gelombang suara) → Inclusive Privacy.
// Hook (logika dipatahkan): "Persetujuan yang tidak bisa dibaca, bukan persetujuan."
// Komposisi: 80% edukasi · 20% meme. Satu gaya: interpolasi ukuran, jarak huruf, tebal, dan kontras dari waktu.
(function (root) {
  const CONFIG = {
    title: 'TY54 · Persetujuan yang Bisa Dibaca (tipografi aksesibel)',
    naskah: 'TY54',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+7%',
    maxPause: 0.45,
    beat: 60 / 84 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 84, mode: 'major', root: 57, lead: 'keys', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.8 },
    meta: {
      judul: 'Persetujuan yang Bisa Dibaca',
      gaya: 'Tipografi aksesibel (morph)',
      tampilan: 'satu kalimat persetujuan berubah dari kecil, rapat, dan pudar menjadi besar, renggang, dan kontras tinggi; ikon pembaca layar; lalu layar Inclusive Privacy asli',
      jenisHook: 'Logika dipatahkan',
      hook: '"Persetujuan yang tidak bisa dibaca, bukan persetujuan."',
      komposisi: '80% edukasi · 20% meme',
      sasaran: 'pemilik produk digital, tim UX & legal, DPO/PPDP',
      fakta: [
        'Inclusive Privacy: persetujuan yang aksesibel bagi penyandang disabilitas; titik pengumpulan persetujuan per kanal (fakta_produk.json: consent). Layar = assets/app/inclusive-privacy.png.',
        'UU PDP Pasal 22 ayat (4): permintaan persetujuan dibuat dengan format yang dapat dipahami dan mudah diakses, bahasa sederhana dan jelas. Cek ulang bunyi pasal sebelum tayang.',
        'Kalimat persetujuan di layar = contoh ilustrasi.',
      ],
    },
  };
  const A = (o) => ({ type: 'ak', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4, voDelay: 0.4, mus: 'hush',
      vo: 'Persetujuan yang tidak bisa dibaca, bukan persetujuan.',
      layar: 'Kalimat persetujuan kecil, rapat, abu-abu pudar di tengah layar. Di "bukan", kalimat mulai membesar dan menajam.',
      sfx: [['w:bukan', 'riser', 0.3]],
      vis: A({ morph: 'w:bukan', teks: 'Persetujuan yang tidak bisa dibaca, *bukan persetujuan*.' }),
    },
    {
      id: 's2', min: 4, voDelay: 0.25, mus: 'main',
      vo: 'Ukuran. Jarak. Kontras. Dan dibacakan, bila perlu.',
      layar: 'Tiap kata: ukuran naik, jarak huruf melebar, kontras jadi hitam di atas putih. Di "dibacakan", ikon pengeras suara + gelombang suara bergerak.',
      sfx: [['w:Ukuran', 'pop', 0.3], ['w:Jarak', 'pop', 0.3], ['w:Kontras', 'pop', 0.3], ['w:dibacakan', 'blip', 0.4]],
      vis: A({ tahap: ['w:Ukuran', 'w:Jarak', 'w:Kontras'], suara: 'w:dibacakan', teks: '*Ukuran. Jarak. Kontras.* Dan dibacakan, bila perlu.' }),
    },
    {
      id: 's3', min: 5, voDelay: 0.2, mus: 'main',
      vo: 'Inclusive Privacy: persetujuan yang aksesibel bagi penyandang disabilitas, di tiap kanal.',
      layar: 'Kalimat mengecil ke atas; layar Inclusive Privacy asli (tab Aksesibilitas) masuk; catatan kecil UU PDP Pasal 22.',
      sfx: [['w:Inclusive-0.1', 'whoosh', 0.35], ['w:kanal', 'check', 0.4]],
      vis: A({ layar: 'w:Inclusive-0.1', teks: '*Inclusive Privacy*: aksesibel bagi penyandang disabilitas, di tiap kanal.', catatan: 'UU PDP Pasal 22 ayat (4): dapat dipahami · mudah diakses · bahasa sederhana' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Semua orang berhak paham. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup kontras tinggi: logo, "Semua orang berhak paham.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: A({ cta: { terang: true, tag: 'Semua orang|*berhak paham*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
