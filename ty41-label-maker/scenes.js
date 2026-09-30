// TY41 — LABEL MAKER "Beri Label Semuanya": pita label timbul hitam-putih dicetak alat lalu ditempel ke benda-benda
// kantor, makin cepat makin kewalahan (sampai kopi dan tanaman ikut dilabeli) → pemindaian memberi label otomatis.
// Hook (relate): "Coba beri label semua data di kantormu. Satu per satu."
// Komposisi: 50% edukasi · 50% meme. Satu gaya: pita label timbul (text-shadow) keluar dari alat lalu ditempel miring.
(function (root) {
  const CONFIG = {
    title: 'TY41 · Beri Label Semuanya (label maker)',
    naskah: 'TY41',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+10%',
    maxPause: 0.35,
    beat: 60 / 116 / 2,
    tail: 0.3,
    burnCaptions: false,
    capMap: [['si-si-ti-vi', 'CCTV']],
    music: { bpm: 116, mode: 'major', root: 57, lead: 'pluck', drums: 'full', sonic: true },
    mix: { duckTo: 0.4, musicGain: 0.8 },
    meta: {
      judul: 'Beri Label Semuanya',
      gaya: 'Label maker (pita timbul)',
      tampilan: 'meja kantor datar berisi benda-benda (emoji); alat label mencetak pita hitam bertulisan timbul DATA PRIBADI yang ditempel miring, makin cepat makin kacau; lalu pemindaian memberi label rapi',
      jenisHook: 'Relate',
      hook: '"Coba beri label semua data di kantormu. Satu per satu."',
      komposisi: '50% edukasi · 50% meme',
      sasaran: 'tim TI/data, DPO/PPDP',
      rekam: ['"CCTV" dibaca "si-si-ti-vi".'],
      fakta: [
        'Data Discovery: katalog sistem & sumber data; pemindaian kolom mendeteksi data pribadi umum dan spesifik; keterkaitan kolom ke RoPA (fakta_produk.json: data-discovery).',
        'Benda-benda dan pembagian umum/spesifik di layar = ilustrasi.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const L = (o) => ({ type: 'lm', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4, voDelay: 0.35, mus: 'main',
      vo: 'Coba beri label semua data di kantormu. Satu per satu.',
      layar: 'Meja kantor: map, laptop, spreadsheet, lemari arsip, surel, CCTV, formulir, chat, kopi, tanaman. Alat label mencetak DATA PRIBADI → ditempel ke map; di "Satu", ke laptop.',
      sfx: [['w:label', 'key', 0.5], ['w:label+0.55', 'slam', 0.35], ['w:Satu', 'key', 0.5], ['w:Satu+0.55', 'slam', 0.35]],
      vis: L({ label: [[0, 'w:label'], [1, 'w:Satu']], teks: 'Coba beri label *semua* data di kantormu.' }),
    },
    {
      id: 's2', min: 4.5, voDelay: 0.2, mus: 'play',
      vo: 'Spreadsheet. Email. si-si-ti-vi. Formulir. Chat. Arsip. Kopi? Tanaman?',
      layar: 'Label beterbangan makin cepat ke tiap benda; dua label terakhir salah sasaran: kopi dan tanaman ("DATA PRIBADI?").',
      sfx: [['w:Spreadsheet', 'key', 0.4], ['w:Email', 'key', 0.4], ['w:si-si-ti-vi', 'key', 0.4], ['w:Formulir', 'key', 0.4], ['w:Chat', 'key', 0.4], ['w:Arsip', 'key', 0.4], ['w:Kopi', 'boing', 0.4], ['w:Tanaman', 'slidewhistle', 0.4]],
      vis: L({ label: [[2, 'w:Spreadsheet'], [4, 'w:Email'], [5, 'w:si-si-ti-vi'], [6, 'w:Formulir'], [7, 'w:Chat'], [3, 'w:Arsip'], [8, 'w:Kopi'], [9, 'w:Tanaman']], teks: 'Satu per satu… *sampai kewalahan*.' , teksAt: 'w:Formulir' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.25, mus: 'main',
      vo: 'Atau biarkan pemindaian yang memberi label: umum, spesifik, dan kaitannya ke RoPA.',
      layar: 'Sinar pemindai menyapu meja; label kacau lenyap; tanda rapi muncul: UMUM (biru), SPESIFIK (merah), lalu pil "→ RoPA".',
      sfx: [['w:pemindaian', 'sweep', 0.45], ['w:umum', 'pop', 0.35], ['w:spesifik', 'pop', 0.35], ['w:RoPA', 'ding', 0.4]],
      vis: L({ pindai: 'w:pemindaian', umum: 'w:umum', spesifik: 'w:spesifik', ropa: 'w:RoPA', teks: 'Pemindaian memberi label: *umum*, *spesifik*, kaitan ke RoPA.' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Data Discovery, di Privasimu Nexus. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Label yang benar, tanpa pegal.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: L({ cta: { terang: true, tag: 'Label yang benar,|*tanpa pegal*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
