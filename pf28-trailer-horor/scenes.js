// PF28 — TRAILER HOROR "Jangan Buka File Itu": layar gelap, kartu teks trailer berkedip, senter menyapu meja kerja
// yang gelap: file RoPA_FINAL_final_v7.xlsx terbuka sendiri, tab beranak-pinak, jam 03:00, notifikasi "audit besok";
// twist: lampu dinyalakan — Privasimu Nexus (Impor Dokumen + pengisian RoPA berbantuan AI), register RoPA asli; CTA.
// Hook (reverse psychology): "Jangan buka file itu."
// Komposisi: 20% edukasi · 80% meme. Satu gaya: parodi trailer horor (flicker, vinyet pekat, teks bergetar, dentuman).
// Tanpa wajah, darah, hantu; benda kantor saja.
(function (root) {
  const CONFIG = {
    title: 'PF28 · Jangan Buka File Itu (trailer horor)',
    naskah: 'PF28',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+6%',
    maxPause: 0.5,
    beat: 60 / 80 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 80, mode: 'minor', root: 45, lead: 'keys', drums: 'full', sonic: true },
    mix: { duckTo: 0.4, musicGain: 0.8 },
    meta: {
      judul: 'Jangan Buka File Itu',
      gaya: 'Trailer horor',
      tampilan: 'layar hitam bervinyet pekat; kartu teks trailer serif tinggi (Cinzel) yang memudar masuk & berkedip kilat; meja kerja gelap disapu senter (radial gradient bergerak): ikon file RoPA_FINAL_final_v7.xlsx, tab beranak-pinak, jam 03:00, notifikasi; teks bergetar saat dentuman; lampu menyala jadi terang biru muda',
      jenisHook: 'Reverse psychology',
      hook: '"Jangan buka file itu."',
      komposisi: '20% edukasi · 80% meme',
      rekam: ['ropa-list-baru'],
      fakta: [
        'RoPA (fakta_produk.json): pengisian otomatis berbantuan AI berdasarkan nama kegiatan; kode rekaman otomatis ROPA-TAHUN-NOMOR; alur Maker, Reviewer, Approver dengan riwayat perubahan (tidak ada lagi "final_final_v7").',
        'Menu "Impor Dokumen" tampak di sidebar tangkapan asli assets/app/ropa-list-baru.png; register RoPA (5 rekaman, kode ROPA-IT-2026-002 dst.) = tangkapan asli, crop tanpa nama organisasi.',
        '"14 tab", "03:00", "audit besok" = lelucon trailer (ilustrasi).',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const H = (o) => ({ type: 'hr', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.8, mus: 'hush',
      vo: 'Di sebuah kantor, seseorang membuka file itu.',
      layar: 'Hitam; kartu "DI SEBUAH KANTOR…" memudar masuk & berkedip; senter menyapu meja gelap dan berhenti di ikon file "RoPA_FINAL_final_v7.xlsx"; DENTUM.',
      sfx: [[0.2, 'hit', 0.5], ['w:membuka', 'tick', 0.3], ['w:itu', 'hit', 0.6]],
      vis: H({ kartu: [[0, 0.3, 'w:seseorang-0.2']], senter: 'w:seseorang-0.3', file: 'w:itu-0.1', dentum: [0.2, 'w:itu'] }),
    },
    {
      id: 's2', min: 5.5, voDelay: 0.5, mus: 'tense',
      vo: 'Musim ini: RoPA yang tak pernah final. Empat belas tab, jam tiga pagi, audit besok.',
      layar: 'Kartu "MUSIM INI" → "RoPA YANG TAK PERNAH FINAL"; jendela spreadsheet terbuka: tab beranak-pinak sampai 14 (Sheet1 (2), rev_final, FIX…); jam 03:00 merah; notifikasi "Audit besok" menghantam; teks bergetar.',
      sfx: [[0.1, 'hit', 0.5], ['w:final', 'hit', 0.45], ['w:Empat', 'tick', 0.3], ['w:Empat+0.3', 'tick', 0.3], ['w:Empat+0.6', 'tick', 0.3], ['w:Jam', 'tick', 0.35], ['w:besok', 'hit', 0.65]],
      vis: H({ kartu: [[1, 0.1, 'w:RoPA-0.1'], [2, 'w:RoPA-0.1', 'w:Empat-0.2']], tab: 'w:Empat-0.2', jam: 'w:Jam', notif: 'w:besok-0.2', dentum: [0.1, 'w:final', 'w:besok'] }),
    },
    {
      id: 's3', min: 6, voDelay: 0.5, mus: 'main',
      vo: 'Kecuali, lampunya dinyalakan. Privasimu Nexus: unggah dokumen lama, AI membantu mengisi RoPA. Kode otomatis, alur persetujuan.',
      layar: 'Kartu "KECUALI…"; pada "dinyalakan" layar jadi terang biru muda; nama file dicoret → ROPA-IT-2026-002; kartu register RoPA asli masuk; label "Impor Dokumen · AI membantu mengisi".',
      sfx: [[0.1, 'hit', 0.45], ['w:dinyalakan', 'ding', 0.5], ['w:Nexus', 'pop', 0.3], ['w:Kode', 'tick', 0.3], ['w:Alur', 'tick', 0.3]],
      vis: H({ kartu: [[3, 0.1, 'w:dinyalakan-0.1']], terang: 'w:dinyalakan', coret: 'w:Nexus', layar: { nama: 'ropa-list-baru', potong: [280, 200, 1140, 285], at: 'w:unggah', judul: 'Register RoPA' }, label: ['w:unggah', 'w:AI', 'w:Kode', 'w:Alur'] }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Akhiri sekuelnya. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Akhiri sekuelnya. Impor, lalu final.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: H({ cta: { tag: 'Akhiri sekuelnya.|*Impor, lalu final*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
