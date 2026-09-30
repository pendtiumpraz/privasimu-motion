// TY39 — STENSIL / CAT SEMPROT "Dilarang Patuh Setengah-setengah": huruf stensil disemprot ke dinding beton, cat
// meluber & menetes; panah ke daftar "setengah" (RoPA ada — bukti tidak, dst.); kartu GAP Assessment asli; CTA.
// Hook (reverse psychology): "DILARANG PATUH SETENGAH-SETENGAH."
// Komposisi: 20% edukasi · 80% meme. Satu gaya: stensil semprot (font stensil + bintik overspray + lelehan cat).
(function (root) {
  const CONFIG = {
    title: 'TY39 · Dilarang Patuh Setengah-setengah (stensil cat semprot)',
    naskah: 'TY39',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+6%',
    maxPause: 0.4,
    beat: 60 / 100 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 100, mode: 'minor', root: 48, lead: 'chip', drums: 'full', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.75 },
    meta: {
      judul: 'Dilarang Patuh Setengah-setengah',
      gaya: 'Stensil / cat semprot',
      tampilan: 'dinding beton abu bertekstur; huruf stensil merah disemprot kata demi kata dengan halo overspray dan tetesan cat yang turun; panah semprot; daftar "setengah" hitam; kartu rekomendasi GAP asli ditempel seperti poster',
      jenisHook: 'Reverse psychology',
      hook: '"DILARANG PATUH SETENGAH-SETENGAH."',
      komposisi: '20% edukasi · 80% meme',
      rekam: ['gap-rekomendasi'],
      fakta: [
        'GAP Assessment (fakta_produk.json): kuesioner kepatuhan UU PDP; skor kepatuhan dan rencana remediasi; analisis dokumen bukti oleh AI per pertanyaan.',
        'Kartu "Rekomendasi Perbaikan (CRITICAL/HIGH/MEDIUM)" = tangkapan asli assets/app/gap-rekomendasi.png.',
        'Daftar "setengah" = contoh situasi umum (ilustrasi), bukan data pelanggan.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const S = (o) => ({ type: 'st', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.6, mus: 'hook',
      vo: 'Dilarang. Patuh. Setengah-setengah.',
      layar: 'Dinding beton; kata demi kata disemprot merah: DILARANG / PATUH / SETENGAH-SETENGAH — cat menetes.',
      sfx: [['w:Dilarang-0.3', 'whoosh', 0.5], ['w:Patuh-0.3', 'whoosh', 0.5], ['w:Setengah-setengah-0.3', 'whoosh', 0.6], ['w:Setengah-setengah+0.6', 'hit', 0.3]],
      vis: S({ semprot: [[0, 'w:Dilarang-0.3'], [1, 'w:Patuh-0.3'], [2, 'w:Setengah-setengah-0.3']] }),
    },
    {
      id: 's2', min: 6, voDelay: 0.3, mus: 'tense',
      vo: 'RoPA ada, bukti tidak. Kebijakan ada, pelatihan tidak. DPIA ada, mitigasi tidak.',
      layar: 'Panah semprot ke bawah; tiga baris stensil hitam disemprot: RoPA ADA — BUKTI TIDAK / KEBIJAKAN ADA — PELATIHAN TIDAK / DPIA ADA — MITIGASI TIDAK.',
      sfx: [['w:RoPA-0.2', 'whoosh', 0.45], ['w:Kebijakan-0.2', 'whoosh', 0.45], ['w:DPIA-0.2', 'whoosh', 0.45]],
      vis: S({ panah: 0.1, daftar: ['w:RoPA-0.2', 'w:Kebijakan-0.2', 'w:DPIA-0.2'] }),
    },
    {
      id: 's3', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'GAP Assessment di Privasimu Nexus menunjukkan yang setengah: skor per area, rekomendasi per pasal, rencana remediasi.',
      layar: 'Tulisan memudar; label semprot "GAP ASSESSMENT ↓"; kartu asli Rekomendasi Perbaikan (9 CRITICAL · 1 HIGH · 1 MEDIUM) ditempel di dinding.',
      sfx: [['w:GAP', 'whoosh', 0.45], ['w:menunjukkan', 'pop', 0.3], ['w:rencana', 'ding', 0.3]],
      vis: S({ bersih: 'w:GAP-0.2', label: 'w:GAP', layar: { nama: 'gap-rekomendasi', potong: [327, 495, 647, 405], at: 'w:menunjukkan', judul: 'GAP Assessment · Rekomendasi' } }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Patuh itu penuh, bukan setengah. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Patuh itu penuh, bukan setengah.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: S({ cta: { tag: 'Patuh itu penuh,|*bukan setengah*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
