// LP03 — "MEMO UNTUK DEWAN DIREKSI" · video landing page, TANPA voice-over, 16:9 utama + 9:16.
// Gaya: editorial mewah — memo direksi cetak premium di atas kertas ivory. Formula n07-konsultan: kertas digambar
// SEKALI di `bg`, satu tipe scene kustom per halaman (style.js, awalan mm-), transisi di `frame` (balik halaman /
// garis tinta / lembar diangkat), logo diwarnai ulang navy lewat canvas. Tinta navy = "cetakan"; biru #2F6BFF HANYA
// untuk tanda pena (garis bawah, lingkaran, paraf) dan stempel DISETUJUI.
// Semua waktu = detik lokal scene, diletakkan di kisi ketukan 72 bpm (b(n) = n ketukan) → teks, SFX, musik bersamaan.
// Nada: elegan, tenang, berwibawa (sasaran korporasi besar & grup usaha). Komposisi: 100% edukasi + CTA, tanpa meme.
//
// DASAR FAKTA (diverifikasi di KB regulasi: psql tabel regulasi_pasal/regulasi_butir, 2 Okt 2026; cek ulang sebelum tayang)
// - UU PDP No. 27/2022 diundangkan 17 Okt 2022 (Pasal 76), masa penyesuaian 2 tahun (Pasal 74) → berlaku penuh Okt 2024.
// - PP No. 33/2026 diundangkan 16 Juli 2026, mulai berlaku 6 bulan kemudian (Pasal 225) → 16 Januari 2027.
// - Denda administratif paling tinggi 2% dari pendapatan/penerimaan tahunan — UU PDP Pasal 57 ayat (3).
// - Pemberitahuan tertulis kegagalan pelindungan data paling lambat 3×24 jam — UU PDP Pasal 46; PP 33/2026 Pasal 114.
// - "Tunjukkan buktinya": akuntabilitas — UU PDP Pasal 47 (wajib menunjukkan pertanggungjawaban); PP 33/2026
//   Pasal 138 ayat (2) huruf d (menunjukkan pemenuhan kepatuhan dan bukti dokumentasi seluruh kegiatan pemrosesan).
// - Rujukan daftar usulan: perekaman kegiatan pemrosesan Pasal 31 · penilaian dampak Pasal 34 · hak subjek data
//   Pasal 5–14 · kegagalan pelindungan Pasal 46 · prosesor/pihak ketiga Pasal 51 · transfer ke luar negeri Pasal 56 ·
//   pejabat atau petugas pelindungan data pribadi Pasal 53 (semua UU PDP).
// - Kapabilitas produk HANYA dari fakta_produk.json (versi 2026.10.1):
//   RoPA: register terpusat, kode rekaman otomatis, jejak/log audit · DPIA: matriks 5×5, rencana penanganan risiko ·
//   DSR: tenggat otomatis 72 jam · insiden: penghitung mundur 3×24 jam · pihak ketiga: kuesioner, skor, bukti ·
//   lintas negara: register + TIA · PPDP: dasbor kepatuhan, antrean kerja, asisten AI Priva ·
//   platform: SaaS maupun on-premise, opsi basis data terdedikasi bagi tenant enterprise, log audit dengan rantai hash
//   opsional yang tahan rusak (+ log audit aktor manusia maupun AI, modul ppdp), modul saling terhubung.
//   Tampilan holding/anak usaha TIDAK ada di fakta_produk.json → halaman 7 memakai kapabilitas platform di atas.
// - Tanpa klaim "100% patuh"/"dijamin lolos audit"; selalu "pihak ketiga".
// - CTA: "Konsultasi gratis · Jadwalkan Demo", privasimu.com, support@privasimu.com · 0851 8318 2722; "Pre-Check gratis"
//   (pastikan penawaran masih berlaku sebelum tayang).
(function (root) {
  const BPM = 72, BEAT = 60 / BPM;
  const b = (n) => +(n * BEAT).toFixed(3); // n ketukan → detik
  const beats = (n) => n * BEAT - 0.004; // durasi minimum tepat n ketukan (build membulatkan ke atas)
  const CONFIG = {
    title: 'LP03 · Memo untuk Dewan Direksi',
    naskah: 'LP03',
    beat: BEAT,
    tail: 0,
    burnCaptions: false, // tanpa VO; seluruh pesan ada di layar
    music: { bpm: BPM, root: 51, mode: 'major', lead: 'keys', drums: 'none', sonic: true },
    mix: { musicGain: 0.9, sfxGain: 0.72 },
    meta: {
      judul: 'Memo untuk Dewan Direksi',
      gaya: 'Editorial mewah — memo direksi cetak di kertas ivory (tinta navy, tanda pena biru)',
      sasaran: 'korporasi besar & grup usaha (bank, asuransi, BUMN, holding): direksi, PPDP/DPO, legal, risiko',
      komposisi: '100% edukasi + CTA',
      jenisHook: 'relate (memo rahasia untuk direksi)',
      hook: 'MEMO — RAHASIA · Kepada: Dewan Direksi · Perihal: Kesiapan UU PDP & PP 33/2026',
    },
  };

  // tipe kustom (style.js) — transisi kit dimatikan; transisi halaman ditulis di `frame`
  const PG = (type, o) => ({ type, enter: 'none', exit: 'none', push: 0.018, ...o });
  // SFX transisi (bunyi balik halaman yang lebih panjang disintesis di music.js)
  const TURN = [[0.02, 'paper', 0.34]], WIPE = [[0.04, 'sweep', 0.06]], LIFT = [[0.02, 'paper', 0.3], [0.2, 'whoosh', 0.05]];

  const SCENES = [
    // ---------- 1 · sampul memo (hook): kop, "Memo.", Kepada / Dari / Perihal / Tanggal ----------
    {
      id: 's1', vo: '', min: beats(12), theme: 'ivory', mus: 'calm',
      sfx: [[0.02, 'paper', 0.22], [b(0.75), 'shimmer', 0.05], [b(2.5), 'tick', 0.06], [b(3.5), 'tick', 0.06], [b(4.5), 'tick', 0.06], [b(5.5), 'tick', 0.06]],
      vis: PG('mm-cover', {
        page: 1, letterhead: 'Memo — Rahasia', title: 'Memo.',
        rows: [['Kepada', 'Dewan Direksi'], ['Dari', 'Kantor Pejabat Pelindungan Data'], ['Perihal', 'Kesiapan UU PDP & PP 33/2026'], ['Tanggal', 'Oktober 2026']],
        at: { lh: b(0.25), title: b(0.75), rows: [b(2.5), b(3.5), b(4.5), b(5.5)] },
      }),
    },
    // ---------- 2 · landasan: UU PDP berlaku penuh sejak Oktober 2024 ----------
    {
      id: 's2', vo: '', min: beats(10), theme: 'ivory', mus: 'calm',
      sfx: [...TURN, [b(4.25), 'tick', 0.05], [b(5), 'tick', 0.06], [b(6.5), 'tick', 0.05], [b(7.25), 'key', 0.05]],
      vis: PG('mm-law', {
        page: 2, trans: 'turn', sec: '01 — Landasan hukum',
        lines: { h: ['Sejak Oktober 2024,', 'UU PDP No. 27/2022', 'berlaku *[penuh.]*'], v: ['Sejak Oktober 2024,', 'UU PDP No. 27/2022', 'berlaku *[penuh.]*'] },
        tl: {
          from: [2022, 1], to: [2027, 4], years: [2022, 2023, 2024, 2025, 2026, 2027],
          seg: [[2022, 10], [2024, 10]], dash: [[2024, 10], [2027, 1]],
          marks: [
            { d: [2022, 10], t: '17.10.2022', s: 'Diundangkan', pos: 'up' },
            { d: [2024, 10], t: 'Oktober 2024', s: 'Berlaku penuh', pos: 'up', strong: true },
            { d: [2027, 1], t: '16.01.2027', s: 'PP 33/2026', pos: 'up', future: true },
          ],
        },
        note: 'UU No. 27 Tahun 2022 · Pasal 74 — masa penyesuaian dua tahun sejak diundangkan.',
        at: { sec: b(1), lines: [b(1.25), b(2), b(2.75)], pen: b(4.25), tl: { base: b(1.5), seg: b(4.75), dash: b(6.25) }, note: b(7) },
      }),
    },
    // ---------- 3 · PP 33/2026 berlaku 16 Januari 2027 (angka besar ala laporan tahunan) ----------
    {
      id: 's3', vo: '', min: beats(10), theme: 'ivory', mus: 'calm',
      sfx: [...WIPE, [b(2), 'tick', 0.06], [b(3.5), 'tick', 0.05], [b(5), 'tick', 0.04], [b(6.75), 'key', 0.05]],
      vis: PG('mm-date', {
        page: 3, trans: 'wipe', sec: '02 — Peraturan pelaksana',
        lead: 'PP No. 33/2026 berlaku',
        day: '16', month: 'Januari', year: '2027',
        cap: { h: ['Peraturan pelaksana', 'UU PDP mulai berlaku.'], v: ['Peraturan pelaksana UU PDP', 'mulai berlaku.'] },
        note: 'PP 33/2026 · Pasal 225 — diundangkan 16\u00a0Juli\u00a02026, berlaku enam bulan kemudian.',
        at: { sec: b(1), lead: b(1.25), day: b(2), month: b(2.75), year: b(3.5), pen: b(5), cap: b(5.5), note: b(6.75) },
      }),
    },
    // ---------- 4 · ruang lingkup: bukan lagi urusan satu divisi ----------
    {
      id: 's4', vo: '', min: beats(12), theme: 'ivory', mus: 'calm',
      sfx: [...TURN, [b(5.5), 'tick', 0.05], [b(6.5), 'tick', 0.05], [b(7.5), 'tick', 0.05]],
      vis: PG('mm-scope', {
        page: 4, trans: 'turn', sec: '03 — Ruang lingkup',
        lines: { h: ['Pelindungan data pribadi', 'bukan lagi urusan *satu divisi.*'], v: ['Pelindungan data pribadi', 'bukan lagi urusan', '*satu divisi.*'] },
        lead: 'Ia menyentuh setiap',
        cols: [['a', 'nasabah,'], ['b', 'karyawan,'], ['c', 'dan pihak ketiga.']],
        at: { sec: b(1), lines: [b(1.25), b(2.25), b(3)], rule: b(4), lead: b(4.5), cols: [b(5.5), b(6.5), b(7.5)] },
      }),
    },
    // ---------- 5 · taruhan: 2% · 3×24 jam ----------
    {
      id: 's5', vo: '', min: beats(14), theme: 'ivory', mus: 'tense',
      sfx: [...LIFT, [b(1.5), 'tick', 0.06], [b(4), 'key', 0.05], [b(6.5), 'tick', 0.05],
        [b(7), 'tock', 0.06], [b(8), 'tock', 0.06], [b(9), 'tock', 0.06], [b(10), 'tock', 0.07], [b(10.75), 'key', 0.05]],
      vis: PG('mm-stakes', {
        page: 5, trans: 'lift', sec: '04 — Taruhan',
        pct: '2%', cap1: { h: ['Denda administratif hingga 2%', 'dari pendapatan tahunan.'], v: ['Denda administratif hingga 2%', 'dari pendapatan tahunan.'] }, ref1: 'UU PDP · Pasal 57 ayat (3)',
        big2: '3×24', unit2: 'jam', cap2: { h: ['Batas pemberitahuan tertulis atas', 'kegagalan pelindungan data.'], v: ['Batas pemberitahuan', 'tertulis atas kegagalan', 'pelindungan data.'] }, ref2: 'UU PDP Pasal 46 · PP 33/2026 Pasal 114',
        at: { sec: b(1), pct: b(1.5), cap1: b(3), ref1: b(4), div: b(5), ring: b(5.5), big2: b(6.5), fill: [b(7), b(10.5)], cap2: b(9), ref2: b(10.75) },
      }),
    },
    // ---------- 6 · kutipan: "Tunjukkan buktinya." ----------
    {
      id: 's6', vo: '', min: beats(10), theme: 'ivory', mus: 'hush',
      sfx: [...WIPE, [b(1.25), 'shimmer', 0.05], [b(5.5), 'key', 0.04]],
      vis: PG('mm-quote', {
        page: 6, trans: 'wipe', sec: '05 — Pertanyaan pemeriksa',
        lines: ['Tunjukkan', '[buktinya.]'],
        attr: 'Pertanyaan pertama setiap pemeriksa',
        note: 'Akuntabilitas: UU PDP Pasal 47 · PP 33/2026 Pasal 138 ayat (2) — menunjukkan pemenuhan kepatuhan dan bukti dokumentasi.',
        at: { sec: b(0.75), qm: b(0.75), lines: [b(1.25), b(2.5)], pen: b(4), attr: b(4.75), note: b(5.5) },
      }),
    },
    // ---------- 7 · usulan: Privasimu menyiapkan bukti itu, setiap hari ----------
    {
      id: 's7', vo: '', min: beats(22), theme: 'ivory', mus: 'main',
      sfx: [...TURN, ...[4, 6, 8, 10, 12, 14, 16].flatMap((n) => [[b(n), 'tick', 0.06], [b(n) + 0.7, 'key', 0.035]])],
      vis: PG('mm-list', {
        page: 7, trans: 'turn', sec: '06 — Usulan',
        lines: { h: ['*Privasimu*', 'menyiapkan', 'bukti itu,', 'setiap hari:'], v: ['*Privasimu* menyiapkan', 'bukti itu, setiap hari:'] },
        caption: 'Modul-modul yang saling terhubung, dalam satu platform.',
        hdr: ['Kapabilitas', 'Rujukan UU PDP'],
        rows: [
          { t: 'Register pemrosesan terpusat', tag: 'RoPA', s: 'Kode rekaman otomatis & jejak audit', r: 'Pasal 31' },
          { t: 'Penilaian dampak', tag: 'DPIA', s: 'Matriks 5×5 & rencana penanganan risiko', r: 'Pasal 34' },
          { t: 'Permohonan hak subjek data', tag: 'DSR', s: 'Tenggat otomatis 72 jam', r: 'Pasal 5–14' },
          { t: 'Manajemen insiden', tag: '', s: 'Penghitung mundur batas 3×24 jam', r: 'Pasal 46' },
          { t: 'Manajemen risiko pihak ketiga', tag: '', s: 'Kuesioner, skor risiko & bukti per pihak ketiga', r: 'Pasal 51' },
          { t: 'Transfer data lintas negara', tag: 'TIA', s: 'Register transfer & penilaian dampak transfer', r: 'Pasal 56' },
          { t: 'Dukungan Pejabat PDP', tag: 'PPDP', s: 'Dasbor kepatuhan, antrean kerja & asisten AI Priva', r: 'Pasal 53' },
        ],
        at: { sec: b(1), lines: [b(1.25), b(1.75), b(2.25), b(2.75)], caption: b(3.5), hdr: b(3.25), rows: [4, 6, 8, 10, 12, 14, 16].map(b) },
      }),
    },
    // ---------- 8 · arsitektur (kapabilitas platform; tampilan holding tidak ada di fakta → tidak diklaim) ----------
    {
      id: 's8', vo: '', min: beats(10), theme: 'ivory', mus: 'main',
      sfx: [...WIPE, [b(2.5), 'tick', 0.05], [b(4), 'tick', 0.05], [b(5.5), 'tick', 0.05]],
      vis: PG('mm-arch', {
        page: 8, trans: 'wipe', sec: '07 — Arsitektur',
        lines: { h: ['Mengikuti kebijakan TI perusahaan:'], v: ['Mengikuti kebijakan', 'TI perusahaan:'] },
        cols: [
          { ix: 'i.', ic: 'deploy', t: 'SaaS atau on-premise', s: 'Tersedia dalam kedua model penerapan.' },
          { ix: 'ii.', ic: 'db', t: 'Basis data terdedikasi', s: 'Opsi bagi tenant enterprise.' },
          { ix: 'iii.', ic: 'chain', t: 'Log audit tahan rusak', s: 'Rantai hash opsional; mencatat aktor manusia maupun AI.' },
        ],
        at: { sec: b(0.75), lines: [b(1), b(1.5)], cols: [b(2.5), b(4), b(5.5)] },
      }),
    },
    // ---------- 9 · rekomendasi: mulai dari Pre-Check · paraf Kantor DPO · stempel DISETUJUI ----------
    {
      id: 's9', vo: '', min: beats(12), theme: 'ivory', mus: 'calm',
      sfx: [...TURN, [b(3.25), 'tick', 0.04], [b(8), 'stamp', 0.95], [b(8) + 0.03, 'paper', 0.12]],
      vis: PG('mm-close', {
        page: 9, trans: 'turn', sec: '08 — Rekomendasi',
        lead: 'Rekomendasi:', lines: { h: ['Mulai dari *Pre-Check.*'], v: ['Mulai dari', '*Pre-Check.*'] },
        sub: 'Pre-Check gratis · privasimu.com',
        regards: 'Hormat kami,', signer: 'Kantor DPO', signer2: 'Pejabat Pelindungan Data Pribadi',
        stamp: { main: 'DISETUJUI', top: 'DEWAN DIREKSI', bot: 'OKTOBER 2026' },
        at: { sec: b(1), lead: b(1.25), lines: [b(1.75), b(2.5)], sub: b(3.25), regards: b(4), sign: b(4.5), signDur: b(2), name: b(6.25), stamp: b(8) },
      }),
    },
    // ---------- 10 · CTA (bebas, ≥ 6 dtk) ----------
    {
      id: 's10', vo: '', min: 9.6, free: true, theme: 'ivory', mus: 'outro',
      sfx: [...LIFT, [b(1.5), 'shimmer', 0.12], [b(4.25), 'tick', 0.05]],
      vis: PG('mm-cta', {
        trans: 'lift', push: 0.012,
        tag: 'Platform manajemen privasi · UU PDP & PP 33/2026',
        lines: { h: ['Konsultasi gratis · Jadwalkan Demo'], v: ['Konsultasi gratis', 'Jadwalkan Demo'] },
        url: 'privasimu.com',
        foot: 'support@privasimu.com · 0851 8318 2722',
        at: { logo: b(1.25), tag: b(2.5), orn: b(2.75), lines: [b(3.25), b(3.75)], url: b(4.25), foot: b(4.75) },
      }),
    },
  ];

  const api = { CONFIG, SCENES, BEAT, b };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
