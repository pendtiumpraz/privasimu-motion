// TY32 — HURUF BERJATUHAN "40 Halaman": paragraf kebijakan privasi yang padat; huruf-hurufnya lepas, jatuh, memantul,
// dan menumpuk di bawah; lalu huruf naik lagi tersusun jadi "TEMUAN PER BAB"; kartu Telaah Kebijakan asli; CTA.
// Hook (relate): "Tidak ada yang membaca kebijakan privasi 40 halaman*. Termasuk yang menulisnya."
// Komposisi: 30% edukasi · 70% meme. Satu gaya: huruf jatuh dengan lintasan rumus (gravitasi + pantulan), rotasi dari hash.
(function (root) {
  const CONFIG = {
    title: 'TY32 · 40 Halaman (huruf berjatuhan)',
    naskah: 'TY32',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+12%',
    maxPause: 0.4,
    beat: 60 / 100 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 100, mode: 'minor', root: 50, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.72 },
    meta: {
      judul: '40 Halaman',
      gaya: 'Huruf berjatuhan',
      tampilan: 'halaman krem berisi paragraf legal serif; huruf lepas satu per satu, jatuh dengan gravitasi, memantul, menumpuk di dasar; huruf naik tersusun jadi daftar temuan; kartu ringkasan Telaah Kebijakan asli',
      jenisHook: 'Relate',
      hook: '"Tidak ada yang membaca kebijakan privasi 40 halaman*. Termasuk yang menulisnya."',
      komposisi: '30% edukasi · 70% meme',
      rekam: ['policy-review'],
      fakta: [
        'Telaah Kebijakan (fakta_produk.json): telaah per bab dengan temuan dan rekomendasi; bunyi pasal dari knowledge base regulasi, bukan ditulis AI; harmonisasi antar dokumen; hasil dapat disunting konsultan.',
        'Kartu "Ringkasan portofolio" = tangkapan asli assets/app/policy-review.png (dinilai terhadap UU PDP & PP 33/2026; angka tenant uji).',
        '"40 halaman" dan tiga temuan di layar = ilustrasi/contoh (ditandai *).',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const F = (o) => ({ type: 'hj', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.5, mus: 'hook',
      vo: 'Tidak ada yang membaca kebijakan privasi empat puluh halaman. Termasuk yang menulisnya.',
      layar: 'Paragraf kebijakan privasi rapat; pada "halaman" huruf-huruf mulai lepas dan berjatuhan, memantul, menumpuk di bawah.',
      sfx: [[0.1, 'whoosh', 0.3], ['w:halaman', 'tick', 0.3], ['w:Termasuk', 'hit', 0.3]],
      vis: F({ runtuh: 'w:halaman', teks: 'Kebijakan privasi *40 halaman**. Tidak ada yang membaca.' }),
    },
    {
      id: 's2', min: 5.5, voDelay: 0.3, mus: 'main',
      vo: 'Privasimu Nexus menelaahnya per bab: temuan, rekomendasi, dan bunyi pasal dari knowledge base.',
      layar: 'Huruf-huruf naik dari tumpukan dan tersusun jadi "TEMUAN PER BAB" + tiga temuan contoh dengan rujukan pasal.',
      sfx: [['w:menelaahnya', 'whoosh', 0.45], ['w:temuan', 'pop', 0.3], ['w:rekomendasi', 'pop', 0.3], ['w:pasal', 'ding', 0.3]],
      vis: F({ susun: 'w:menelaahnya', teks: 'Per bab: *temuan*, *rekomendasi*, *bunyi pasal*.' }),
    },
    {
      id: 's3', min: 5, voDelay: 0.3, mus: 'main',
      vo: 'Hasilnya bisa disunting konsultan, dan diharmonisasi antar dokumen.',
      layar: 'Kartu asli "Ringkasan portofolio" (dinilai terhadap UU PDP & PP 33/2026) muncul di bawah daftar temuan.',
      sfx: [['w:Hasilnya', 'pop', 0.3], ['w:diharmonisasi', 'ding', 0.3]],
      vis: F({ layar: { nama: 'policy-review', potong: [282, 66, 1138, 190], at: 'w:Hasilnya', judul: 'Telaah Kebijakan · Ringkasan portofolio' }, teks: 'Bisa disunting. Bisa *diharmonisasi*.' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Panjang boleh, asal ditelaah per bab. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Panjang boleh, asal ditelaah per bab.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: F({ cta: { tag: 'Panjang boleh,|*asal ditelaah per bab*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
