// PF32 — LABEL MUSEUM "Artefak": aula museum gelap; lampu sorot menyala ke vitrin No. 014 berisi spreadsheet RoPA
// ca. 2019 (14 tab, 1 orang yang paham) → kamera bergeser ke No. 015: surel "RE: FW: data pelanggan" (37 balasan,
// 0 keputusan) → twist: kamera mundur, kedua artefak dicap MASIH DIPAKAI* → koleksi terbaru No. 016: register RoPA
// asli, "dipakai setiap hari" → kamera mundur ke seluruh aula, artefak lama berplakat DIPENSIUNKAN ✓; CTA.
// Hook (relate): "Artefak: spreadsheet RoPA, sekitar 2019. Bahan: 14 tab, 1 orang yang paham."
// Komposisi: 50% edukasi · 50% meme. Satu gaya: label museum (vitrin, lampu sorot, kartu keterangan serif, kamera pan).
(function (root) {
  const CONFIG = {
    title: 'PF32 · Artefak (label museum)',
    naskah: 'PF32',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+12%',
    maxPause: 0.4,
    beat: 60 / 90 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 90, mode: 'minor', root: 52, lead: 'keys', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.7 },
    meta: {
      judul: 'Artefak',
      gaya: 'Label museum',
      tampilan: 'aula museum gelap berpanel kayu; tiga vitrin kaca di atas alas, masing-masing dengan lampu sorot kerucut dan kartu keterangan krem bergaya museum (huruf serif, nomor koleksi, tahun miring, bahan); papan atas "MUSEUM KEPATUHAN"; kamera bergeser & mundur; cap merah MASIH DIPAKAI* di kartu, plakat hijau DIPENSIUNKAN ✓ di depan kaca; register RoPA asli di vitrin terbaru',
      jenisHook: 'Relate',
      hook: '"Artefak: spreadsheet RoPA, sekitar 2019. Bahan: 14 tab, 1 orang yang paham."',
      komposisi: '50% edukasi · 50% meme',
      rekam: ['ropa-list-baru'],
      fakta: [
        'RoPA (fakta_produk.json): satu register terpusat dengan kode rekaman ROPA-TAHUN-NOMOR; setiap perubahan tercatat di log audit (riwayat); sebelum: catatan pemrosesan tersebar di spreadsheet per divisi.',
        'Register RoPA = tangkapan asli assets/app/ropa-list-baru.png (dipotong, tanpa nama organisasi).',
        'Artefak, tahun, "14 tab", "1 orang", "37 balasan", "folder Baru (3)" = ilustrasi (ditandai *); museum fiktif.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const M = (o) => ({ type: 'mu', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5.5, voDelay: 0.6, mus: 'hook',
      vo: 'Artefak: spreadsheet RoPA. Bahan: empat belas tab, satu orang yang paham.',
      layar: 'Aula gelap; lampu sorot menyala (klik) ke vitrin No. 014: lembar spreadsheet tua dengan deretan tab; kartu keterangan museum muncul baris demi baris: "Spreadsheet RoPA", "ca. 2019", "Bahan: 14 tab, 1 orang yang paham*".',
      sfx: [[0.15, 'hit', 0.3], ['w:spreadsheet', 'pop', 0.25], ['w:RoPA+0.3', 'tick', 0.25], ['w:Bahan', 'tick', 0.25], ['w:satu', 'tick', 0.25]],
      vis: M({ mulai: 0.15, label: [0, 'w:spreadsheet-0.15', 'w:RoPA+0.3', 'w:Bahan-0.1'] }),
    },
    {
      id: 's2', min: 5, voDelay: 0.5, mus: 'main',
      vo: 'Sebelahnya: surel berantai soal data pelanggan. Tiga puluh tujuh balasan, nol keputusan.',
      layar: 'Kamera bergeser ke vitrin No. 015 (lampu menyala): cetakan surel dengan subjek RE: FW: RE: FW: data pelanggan dan kutipan bertingkat; kartu: "ca. 2021", "37 balasan, 0 keputusan*".',
      sfx: [[0.05, 'whoosh', 0.3], [0.5, 'hit', 0.25], ['w:Tiga', 'tick', 0.25], ['w:nol', 'pop', 0.3]],
      vis: M({ geser: [1, 0.05], label: [1, 'w:surel-0.15', 'w:surel+0.4', 'w:Tiga-0.1'] }),
    },
    {
      id: 's3', min: 3.8, voDelay: 0.3, mus: 'tense',
      vo: 'Masalahnya, dua artefak ini masih dipakai di banyak kantor.',
      layar: 'Kamera mundur memperlihatkan kedua vitrin; cap merah "MASIH DIPAKAI*" menghantam kartu keterangan keduanya.',
      sfx: [['w:Masalahnya', 'whoosh', 0.3], ['w:masih', 'hit', 0.45], ['w:masih+0.25', 'hit', 0.35]],
      vis: M({ mundur: 'w:Masalahnya-0.1', cap: 'w:masih-0.1' }),
    },
    {
      id: 's4', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Privasimu Nexus: RoPA terpusat, berkode, ada riwayatnya. Spreadsheet itu? Resmi jadi artefak.',
      layar: 'Kamera meluncur ke vitrin No. 016 "Koleksi terbaru": register RoPA asli; kartu: "Register RoPA terpusat · Privasimu Nexus", "kode ROPA-TAHUN-NOMOR · riwayat perubahan", "Status: dipakai setiap hari"; kamera kembali ke dua vitrin lama (bingkai sama dengan twist): cap merah berganti plakat hijau besar "DIPENSIUNKAN ✓" di depan kaca.',
      sfx: [['w:Nexus-0.2', 'whoosh', 0.4], ['w:terpusat', 'ding', 0.35], ['w:berkode', 'tick', 0.3], ['w:Spreadsheet', 'whoosh', 0.35], ['w:Resmi', 'hit', 0.4], ['w:artefak', 'ding', 0.4]],
      vis: M({ geser: [2, 'w:Nexus-0.3'], label: [2, 'w:terpusat-0.15', 'w:berkode-0.1', 'w:riwayatnya'], semua: 'w:Spreadsheet-0.2', pensiun: 'w:Resmi-0.1', layar: { nama: 'ropa-list-baru', potong: [280, 200, 1140, 285], judul: 'Register RoPA' } }),
    },
    {
      id: 's5', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Pensiunkan artefakmu. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Pensiunkan artefakmu.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: M({ cta: { tag: 'Pensiunkan|*artefakmu*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
