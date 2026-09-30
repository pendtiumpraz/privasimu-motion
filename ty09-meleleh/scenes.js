// TY09 — LIQUID / HURUF MELELEH "72 Jam yang Meleleh": angka 72 JAM utuh, meleleh dan menetes saat dihitung manual,
// lalu membeku rapi saat tenggat dihitung otomatis (pil tenggat asli dari layar DSR).
// Hook (relate): "72 jam itu cepat. Apalagi kalau dihitung manual."
// Komposisi: 50% edukasi · 50% meme. Satu gaya: filter SVG feTurbulence + feDisplacementMap (skala naik), tetesan goo.
(function (root) {
  const CONFIG = {
    title: 'TY09 · 72 Jam yang Meleleh (liquid)',
    naskah: 'TY09',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 100 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 100, mode: 'minor', root: 52, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.8 },
    meta: {
      judul: '72 Jam yang Meleleh',
      gaya: 'Liquid / huruf meleleh',
      tampilan: 'angka 72 JAM tebal jingga meleleh bergelombang dan menetes (filter distorsi SVG), lalu membeku biru es; pil tenggat asli "71h tersisa" dari layar DSR',
      jenisHook: 'Relate',
      hook: '"72 jam itu cepat. Apalagi kalau dihitung manual."',
      komposisi: '50% edukasi · 50% meme',
      sasaran: 'tim layanan pelanggan, legal, DPO/PPDP',
      fakta: [
        'DSR: tenggat otomatis 72 jam sejak permohonan dicatat; semua permohonan tercatat di satu antrean (fakta_produk.json: dsr). Pil tenggat = potongan layar asli assets/app/dsr-detail.png (data demo).',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const L = (o) => ({ type: 'lq', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 3.5, voDelay: 0.35, mus: 'hook',
      vo: 'Tujuh puluh dua jam itu cepat.',
      layar: '"72 JAM" raksasa jingga utuh; mulai bergoyang halus seperti lilin hangat.',
      sfx: [[0.05, 'impact', 0.4]],
      vis: L({ teks: '72 jam itu *cepat*.' }),
    },
    {
      id: 's2', min: 5, voDelay: 0.25, mus: 'tense',
      vo: 'Apalagi kalau dihitungnya manual: email bolak-balik, spreadsheet, tanya sana-sini.',
      layar: 'Huruf meleleh makin parah dan menetes ke bawah; ikon surel beterbangan bolak-balik.',
      sfx: [['w:manual', 'slidedown', 0.35], ['w:email', 'notif', 0.35], ['w:spreadsheet', 'notif', 0.35], ['w:tanya', 'notif', 0.35]],
      vis: L({ leleh: 'w:Apalagi', surel: ['w:email', 'w:spreadsheet', 'w:tanya'], teks: 'Apalagi kalau *dihitung manual*.' }),
    },
    {
      id: 's3', min: 5.5, voDelay: 0.25, mus: 'main',
      vo: 'Di Privasimu Nexus, tenggat dihitung otomatis sejak permohonan dicatat. Beku. Rapi.',
      layar: 'Di "otomatis" huruf membeku: distorsi hilang, warna jadi biru es, tetesan menarik diri; pil tenggat asli "71h tersisa" membesar di sampingnya.',
      sfx: [['w:otomatis', 'shock', 0.4], ['w:otomatis+0.1', 'shimmer', 0.4], ['w:Beku', 'check', 0.4]],
      vis: L({ beku: 'w:otomatis', pil: 'w:dicatat', teks: 'Tenggat dihitung *otomatis*. Beku. Rapi.' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Jangan biarkan tenggatnya meleleh. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Jangan biarkan tenggatnya meleleh.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: L({ cta: { tag: 'Jangan biarkan|tenggatnya *meleleh*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
