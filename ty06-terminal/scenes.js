// TY06 — TERMINAL "cari --nama rina": layar hitam monospace; perintah diketik per karakter, hasil pencarian data satu
// pelanggan muncul baris demi baris: ditemukan di lebih banyak sistem daripada yang diketahui tim.
// Hook (anomali): "Ketik nama satu pelanggan. Di berapa sistem datanya tersimpan?"
// Komposisi: 50% edukasi · 50% meme. Satu gaya: ketik per karakter + kursor blok, keluaran per baris, scanline tipis.
// vis.baris: [[teks, cue, kelas]] — baris keluaran terminal; kelas 'ketik' = diketik per karakter, 'ok' hijau, 'peringatan' kuning, 'redup'.
(function (root) {
  const CONFIG = {
    title: 'TY06 · cari --nama rina (terminal)',
    naskah: 'TY06',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 108 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 108, mode: 'minor', root: 50, lead: 'chip', drums: 'chip', sonic: true },
    mix: { duckTo: 0.4, musicGain: 0.75 },
    meta: {
      judul: 'cari --nama "rina"',
      gaya: 'Terminal / command line',
      tampilan: 'jendela terminal gelap berhuruf IBM Plex Mono; perintah diketik dengan kursor blok berkedip; hasil pencarian muncul baris demi baris; scanline tipis',
      jenisHook: 'Anomali',
      hook: '"Ketik nama satu pelanggan. Di berapa sistem datanya tersimpan?"',
      komposisi: '50% edukasi · 50% meme',
      sasaran: 'tim TI/data, DPO/PPDP',
      fakta: [
        'Data Discovery: pencarian data milik satu subjek untuk mendukung permohonan DSR; katalog sistem & sumber data; keterkaitan ke RoPA (fakta_produk.json: data-discovery).',
        'Jumlah sistem (2 vs 7), nama sistem, dan perintah "cari" = ilustrasi (bukan sintaks produk); diberi label "*ilustrasi". Rina = tokoh ilustrasi.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const T0 = (o) => ({ type: 'tr', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 3.5, voDelay: 0.35, mus: 'hook',
      vo: 'Ketik nama satu pelanggan.',
      layar: 'Terminal: prompt lalu perintah diketik: cari --nama "rina" --semua-sistem',
      sfx: [[0.35, 'key', 0.25], [0.55, 'key', 0.25], [0.75, 'key', 0.25], [0.95, 'key', 0.25], [1.15, 'key', 0.25], [1.35, 'key', 0.25], [1.55, 'key', 0.25], [1.75, 'key', 0.25], [1.95, 'key', 0.25]],
      vis: T0({ baris: [['$ cari --nama "rina" --semua-sistem', 0.3, 'ketik']] }),
    },
    {
      id: 's2', min: 3.5, voDelay: 0.25, mus: 'tense',
      vo: 'Di berapa sistem datanya tersimpan?',
      layar: 'Enter; bilah pemindaian berjalan; dua hasil pertama: CRM ✓, Email ✓.',
      sfx: [[0.05, 'key', 0.5], ['w:sistem', 'blip', 0.3], ['w:tersimpan', 'blip', 0.3]],
      vis: T0({ baris: [['memindai 14 sistem terdaftar…', 0.1, 'redup'], ['[1/7] CRM pelanggan ............ nama, email, no. HP', 'w:sistem', 'ok'], ['[2/7] Server email .............. korespondensi', 'w:tersimpan', 'ok']] }),
    },
    {
      id: 's3', min: 6, voDelay: 0.25, mus: 'main', voiceRate: '+14%',
      vo: 'Yang kamu tahu: dua. Yang ditemukan: tujuh. Layanan pelanggan, arsip, spreadsheet, cadangan, formulir lama.',
      layar: 'Hasil terus bertambah sampai [7/7]; baris kuning: "yang kamu tahu: 2 · ditemukan: 7 *ilustrasi".',
      sfx: [['w:tujuh', 'shock', 0.35], ['w:Layanan', 'blip', 0.3], ['w:arsip', 'blip', 0.3], ['w:spreadsheet', 'blip', 0.3], ['w:cadangan', 'blip', 0.3], ['w:formulir', 'blip', 0.3]],
      vis: T0({ baris: [['[3/7] Tiket layanan pelanggan ... NIK (lampiran)', 'w:Layanan', 'ok'], ['[4/7] Arsip PDF ................. formulir 2019', 'w:arsip', 'ok'], ['[5/7] Spreadsheet HR ............ (mantan pelamar)', 'w:spreadsheet', 'ok'], ['[6/7] Cadangan basis data ....... salinan mingguan', 'w:cadangan', 'ok'], ['[7/7] Formulir web lama ......... masih aktif', 'w:formulir', 'ok'], ['yang kamu tahu: 2   ·   ditemukan: 7   *ilustrasi', 'w:formulir+0.6', 'peringatan']] }),
    },
    {
      id: 's4', min: 5.5, voDelay: 0.25, mus: 'main',
      vo: 'Data Discovery menemukan datanya di semua sistem, lalu mengaitkannya ke RoPA. Siap untuk permohonan hak subjek data.',
      layar: 'Baris ringkasan: "→ dikaitkan ke RoPA: ROPA-IT-2026-002" dan "siap untuk permohonan hak subjek data (DSR)".',
      sfx: [['w:RoPA', 'ding', 0.4], ['w:Siap', 'correct', 0.4]],
      vis: T0({ baris: [['→ dikaitkan ke RoPA: ROPA-IT-2026-002 (Layanan pelanggan)', 'w:mengaitkannya', 'ok'], ['→ siap untuk permohonan hak subjek data (DSR)', 'w:Siap', 'ok'], ['$ _', 'w:Siap+0.8', 'ketik']], teks: 'Data Discovery: *semua sistem*, terkait ke RoPA.' }),
    },
    {
      id: 's5', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Tahu di mana datamu, sebelum ditanya. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup bergaya terminal: logo, "Tahu di mana datamu, sebelum ditanya.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: T0({ cta: { tag: 'Tahu di mana datamu,|*sebelum ditanya*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
