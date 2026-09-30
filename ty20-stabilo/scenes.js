// TY20 — STABILO PADA PASAL "AI yang Tidak Mengarang Pasal": jawaban AI "kreatif" dicoret; jawaban Priva mengutip pasal;
// bunyi pasal di kertas disapu stabilo kuning tepat saat diucapkan; hasil telaah bisa disunting konsultan.
// Hook (logika dipatahkan): "AI terbaik untuk DPO bukan yang paling kreatif. Tapi yang tidak mengarang pasal."
// Komposisi: 80% edukasi · 20% meme. Satu gaya: sapuan stabilo (background-size) mengikuti kata VO di atas teks pasal.
(function (root) {
  const CONFIG = {
    title: 'TY20 · AI yang Tidak Mengarang Pasal (stabilo)',
    naskah: 'TY20',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+7%',
    maxPause: 0.4,
    beat: 60 / 100 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 100, mode: 'major', root: 55, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.8 },
    meta: {
      judul: 'AI yang Tidak Mengarang Pasal',
      gaya: 'Stabilo pada pasal',
      tampilan: 'kertas peraturan; stabilo kuning bertepi kasar menyapu frasa pasal saat diucapkan; gelembung jawaban AI di sampingnya',
      jenisHook: 'Logika dipatahkan',
      hook: '"AI terbaik untuk DPO bukan yang paling kreatif. Tapi yang tidak mengarang pasal."',
      komposisi: '80% edukasi · 20% meme',
      sasaran: 'DPO/PPDP, konsultan, legal',
      fakta: [
        'Telaah Kebijakan: bunyi pasal diambil dari knowledge base regulasi, bukan ditulis AI; hasil telaah dapat disunting konsultan; telaah per bab dengan temuan & rekomendasi (fakta_produk.json: policy-review). Priva menjawab berdasarkan knowledge base platform (ppdp).',
        'Kutipan di layar: UU PDP (UU 27/2022) Pasal 46 ayat (1) — pemberitahuan tertulis paling lambat 3 x 24 jam kepada Subjek Data Pribadi dan lembaga. CEK ULANG bunyi pasal persis sebelum tayang.',
        'Jawaban "kira-kira seminggu" = contoh jawaban keliru (ilustrasi), bukan keluaran produk mana pun.',
      ],
    },
  };
  const S = (o) => ({ type: 'st', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4, voDelay: 0.35, mus: 'hook',
      vo: 'AI terbaik untuk DPO bukan yang paling kreatif.',
      layar: 'Gelembung tanya: "Batas pemberitahuan kebocoran data berapa lama?" → jawaban AI "kreatif": "Kira-kira seminggu, mungkin?" dicoret merah, stempel MENGARANG.',
      sfx: [[0.3, 'notif', 0.4], ['w:kreatif', 'buzzer', 0.45]],
      vis: S({ tahap: 'tanya', coret: 'w:kreatif', teks: 'AI terbaik untuk DPO bukan yang paling *kreatif*.' }),
    },
    {
      id: 's2', min: 3.5, voDelay: 0.25, mus: 'main',
      vo: 'Tapi yang tidak mengarang pasal.',
      layar: 'Jawaban Priva masuk: "Paling lambat 3×24 jam — UU PDP Pasal 46 ayat (1)", lencana "dari knowledge base".',
      sfx: [['w:Tapi', 'pop', 0.35], ['w:pasal', 'check', 0.4]],
      vis: S({ tahap: 'priva', privaAt: 'w:Tapi', teks: 'Tapi yang *tidak mengarang pasal*.' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.25, mus: 'main',
      vo: 'Bunyi pasalnya disorot langsung dari knowledge base regulasi: paling lambat tiga kali dua puluh empat jam, secara tertulis, kepada subjek data dan lembaga.',
      layar: 'Kertas UU PDP Pasal 46 ayat (1). Stabilo kuning menyapu "paling lambat 3 x 24 jam", "secara tertulis", "Subjek Data Pribadi dan lembaga" tepat saat diucapkan.',
      sfx: [['w:Bunyi', 'paper', 0.35], ['w:paling', 'sweep', 0.3], ['w:secara', 'sweep', 0.3], ['w:subjek', 'sweep', 0.3]],
      vis: S({ tahap: 'kertas', kertasAt: 'w:Bunyi', sorot: ['w:paling', 'w:secara', 'w:subjek'], teks: 'Bunyi pasal dari *knowledge base regulasi*, bukan ditulis ulang AI.' }),
    },
    {
      id: 's4', min: 3.5, voDelay: 0.25, mus: 'main',
      vo: 'Hasil telaahnya bisa disunting konsultan sebelum dipakai.',
      layar: 'Kartu temuan telaah per bab dengan ikon pensil; kursor teks berkedip di kolom rekomendasi.',
      sfx: [['w:disunting', 'key', 0.4], ['w:disunting+0.3', 'key', 0.3]],
      vis: S({ tahap: 'sunting', suntingAt: 'w:disunting-0.2', teks: 'Hasil telaah bisa *disunting konsultan*.' }),
    },
    {
      id: 's5', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Priva, asisten AI di Privasimu Nexus. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo, "AI yang mengutip, bukan mengarang.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: S({ cta: { terang: true, tag: 'AI yang *mengutip*,|bukan mengarang.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
