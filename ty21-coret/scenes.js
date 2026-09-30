// TY21 — CORET & TULIS ULANG "Lebih Tua dari Undang-undangnya": halaman kebijakan privasi lama dikoreksi editor bertinta
// merah: frasa usang dicoret, tanda sisip, tulisan tangan pengganti; lalu kartu Telaah Kebijakan asli.
// Hook (anomali): "Kebijakan privasi di situsmu mungkin lebih tua dari UU PDP."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: garis coret digambar (stroke), caret, tulisan tangan (Caveat) muncul.
(function (root) {
  const CONFIG = {
    title: 'TY21 · Lebih Tua dari Undang-undangnya (coret & tulis ulang)',
    naskah: 'TY21',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+7%',
    maxPause: 0.4,
    beat: 60 / 96 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 96, mode: 'major', root: 55, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.8 },
    meta: {
      judul: 'Lebih Tua dari Undang-undangnya',
      gaya: 'Coret & tulis ulang (koreksi editor)',
      tampilan: 'halaman kebijakan privasi putih bergaya web lama; pena merah melingkari tahun, mencoret frasa usang, menulis pengganti dengan tulisan tangan',
      jenisHook: 'Anomali',
      hook: '"Kebijakan privasi di situsmu mungkin lebih tua dari UU PDP."',
      komposisi: '70% edukasi · 30% meme',
      sasaran: 'pemilik situs/produk digital, legal, DPO/PPDP',
      fakta: [
        'Telaah Kebijakan: telaah per bab dengan temuan dan rekomendasi; bunyi pasal dari knowledge base regulasi; harmonisasi antar dokumen (fakta_produk.json: policy-review). Layar = assets/app/policy-review.png (angka 38% = data demo).',
        'UU PDP (UU 27/2022) disahkan Oktober 2022; persetujuan harus eksplisit (Pasal 20 ayat 2); tenggat DSR 72 jam = fitur Nexus (fakta_produk.json: dsr). Cek ulang rujukan pasal sebelum tayang.',
        'Kutipan kebijakan lama ("dianggap setuju", "hubungi kami via email") = contoh ilustrasi umum, bukan kutipan situs mana pun.',
      ],
    },
  };
  const K = (o) => ({ type: 'kr', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4, voDelay: 0.35, mus: 'hook',
      vo: 'Kebijakan privasi di situsmu, mungkin lebih tua dari undang-undangnya.',
      layar: 'Halaman "Kebijakan Privasi · Terakhir diperbarui 12 Maret 2019". Di "lebih tua", pena merah melingkari 2019 dan menulis "UU PDP: 2022!".',
      sfx: [[0.1, 'paper', 0.35], ['w:lebih', 'scratch', 0.35]],
      vis: K({ lingkar: 'w:lebih', teks: 'Kebijakan privasimu mungkin *lebih tua* dari undang-undangnya.' }),
    },
    {
      id: 's2', min: 7, voDelay: 0.25, mus: 'main',
      vo: 'Bab dua: dianggap setuju. Coret. Persetujuan harus eksplisit. Bab lima: hubungi kami via email. Coret. Formulir permohonan, tenggat tujuh puluh dua jam.',
      layar: 'Bab 2: frasa "dengan menggunakan situs ini Anda dianggap setuju" dicoret, tulisan tangan "persetujuan eksplisit (UU PDP Ps. 20)". Bab 5: "hubungi kami via email" dicoret → "formulir permohonan · tenggat 72 jam".',
      sfx: [['w:Coret', 'scratch', 0.45], ['w:eksplisit', 'key', 0.3], ['w:Coret#2', 'scratch', 0.45], ['w:Formulir', 'key', 0.3]],
      vis: K({ coret: [['w:Coret', 'w:Persetujuan'], ['w:Coret#2', 'w:Formulir']], teks: 'Dicoret, ditulis ulang: *persetujuan eksplisit* · *formulir DSR 72 jam*.', teksAt: 'w:Coret' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.25, mus: 'main',
      vo: 'Telaah Kebijakan menandai temuan per bab, dengan rekomendasi dan rujukan pasal dari knowledge base.',
      layar: 'Halaman bergeser; kartu Telaah Kebijakan asli (ringkasan portofolio, dinilai terhadap UU PDP & PP 33/2026) masuk; cip "temuan per bab", "rekomendasi", "rujukan pasal".',
      sfx: [['w:Telaah', 'whoosh', 0.35], ['w:temuan', 'pop', 0.3], ['w:rekomendasi', 'pop', 0.3], ['w:rujukan', 'pop', 0.3]],
      vis: K({ layar: 'w:Telaah', cip: [['temuan per bab', 'w:temuan'], ['rekomendasi', 'w:rekomendasi'], ['rujukan pasal dari KB', 'w:rujukan']], teks: 'Temuan per bab, rekomendasi, *rujukan pasal*.' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Perbarui sebelum diperiksa. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Perbarui sebelum diperiksa.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: K({ cta: { terang: true, tag: 'Perbarui|*sebelum diperiksa*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
