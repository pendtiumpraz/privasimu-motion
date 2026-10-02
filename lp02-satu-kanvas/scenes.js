// LP02 — "SATU KANVAS, SATU UNDANG-UNDANG" · video landing page (hero/galeri), voice-over edge-tts (pria), 16:9 utama + 9:16.
// Gaya: kinetic typography murni (tanpa gambar) di SATU kanvas raksasa (#kv-world). Tiap kalimat = satu "stasiun"
// teks di kanvas; kamera meluncur diagonal antarstasiun sebagai fungsi murni waktu global, grid hairline ikut bergerak.
// Di akhir kamera mundur: seluruh kanvas terbaca sebagai SATU poster — sembilan kewajiban mengelilingi satu pusat,
// garis tipis dari tiap stasiun bertemu di logo Privasimu.
// Formula diadaptasi dari t02-tipografi (kanvas dunia + kamera). Bedanya: tanpa VO, jadi tiap baris punya `at` sendiri
// (detik lokal scene) yang diletakkan di kisi ketukan 84 bpm (b(n) = n ketukan) → teks, SFX, dan musik jatuh bersamaan.
// Nada: elegan, tenang, berwibawa (sasaran korporasi & grup usaha). Komposisi: 100% edukasi + CTA, tanpa meme.
//
// Baris (lines): { t: teks (*kata* = penekanan serif miring), tv: teks khusus 9:16, c: kelas, at: detik lokal,
//   fx: rise | wipe | type | fade | slam | kick, cross: kata yang "menyeberang", bar: [mulai, akhir] (garis waktu) }
// Kelas: verb (kata kerja serif raksasa) · rest (grotesk) · deck (grotesk tipis) · tag (mono, rujukan pasal) ·
//   note (fakta produk) · kick (nomor + garis + label modul) · big/mid/small/mute/em-* (lihat style.css)
//
// DASAR FAKTA (diverifikasi di KB regulasi: psql tabel regulasi_pasal/regulasi_topik, 2 Okt 2026; cek ulang sebelum tayang)
// - UU PDP No. 27/2022 diundangkan 17 Okt 2022 (Pasal 76), masa penyesuaian 2 tahun (Pasal 74) → berlaku penuh Okt 2024.
// - PP No. 33/2026 diundangkan 16 Juli 2026, berlaku 6 bulan kemudian (Pasal 225) → 16 Januari 2027.
// - 01 Perekaman kegiatan pemrosesan: UU PDP Pasal 31; PP 33/2026 Pasal 74.
// - 02 Penilaian dampak (DPIA): UU PDP Pasal 34; PP 33/2026 Pasal 120.
// - 03 Hak Subjek Data: UU PDP Pasal 5–13 (hak) + Pasal 14 (permohonan tercatat). Fakta produk (fakta_produk.json,
//      modul dsr): "Tenggat otomatis 72 jam sejak permohonan dicatat".
// - 04 Persetujuan: UU PDP Pasal 20 (dasar pemrosesan, persetujuan sah eksplisit), Pasal 22 (tertulis/terekam),
//      Pasal 24 (wajib menunjukkan bukti persetujuan).
// - 05 Anak & penyandang disabilitas: UU PDP Pasal 25–26; PP 33/2026 Pasal 38 (Anak) & 39 (Penyandang Disabilitas).
//      Produk: Children Pro & Inclusive Privacy (kapabilitas modul consent di fakta_produk.json).
// - 06 Pihak ketiga (prosesor): UU PDP Pasal 51 (pemrosesan oleh prosesor tetap tanggung jawab pengendali).
// - 07 Transfer lintas negara: UU PDP Pasal 56.
// - 08 Kegagalan pelindungan data: pemberitahuan tertulis paling lambat 3×24 jam — UU PDP Pasal 46; PP 33/2026 Pasal 114.
// - 09 PPDP: UU PDP Pasal 53 (wajib menunjuk pejabat atau petugas yang melaksanakan fungsi PDP); PP 33/2026 Pasal 142
//      (definisi PPDP di PP Pasal 1 angka 25: "Pejabat atau Petugas yang Melaksanakan Fungsi Pelindungan Data Pribadi").
// - Sanksi: denda administratif paling tinggi 2% dari pendapatan/penerimaan tahunan — UU PDP Pasal 57 ayat (3).
// - Label modul di stasiun (RoPA, DPIA, DSR, Consent, Children Pro · Inclusive Privacy, Pihak Ketiga, Lintas Negara,
//   Insiden, PPDP) = nama modul/kapabilitas di fakta_produk.json. Tidak ada klaim "100% patuh"/"dijamin lolos audit".
// - CTA: "Jadwalkan Demo — privasimu.com", support@privasimu.com · 0851 8318 2722 (pastikan penawaran masih berlaku).
(function (root) {
  const BPM = 84, BEAT = 60 / BPM;
  const b = (n) => +(n * BEAT).toFixed(3); // n ketukan → detik
  const beats = (n) => n * BEAT - 0.004; // durasi minimum scene tepat n ketukan (build membulatkan ke atas)
  const CONFIG = {
    title: 'LP02 · Satu Kanvas, Satu Undang-Undang',
    naskah: 'LP02',
    beat: BEAT,
    tail: 0,
    burnCaptions: false, // seluruh pesan sudah ada di layar
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+0%',
    music: { bpm: BPM, root: 50, mode: 'minor', lead: 'keys', drums: 'light', sonic: true },
    mix: { duckTo: 0.45, musicGain: 0.92, sfxGain: 0.7 },
    meta: {
      judul: 'Satu Kanvas, Satu Undang-Undang',
      gaya: 'Kinetic typography satu kanvas (kamera menjelajah lalu mundur jadi poster)',
      sasaran: 'korporasi besar & grup usaha (bank, asuransi, BUMN, holding): direksi, DPO/PPDP, legal, risiko',
      komposisi: '100% edukasi + CTA',
    },
  };

  // ---------- pembentuk scene ----------
  const KV = (o) => ({ type: 'kv', enter: 'none', exit: 'none', push: 0, ...o });
  const MOVE = [0, b(2.25)]; // kamera meluncur ke stasiun: ketukan 0 → 2,25
  // Stasiun kewajiban: nomor + label modul (mono) → kata kerja serif raksasa → objek (grotesk) → rujukan pasal (mono)
  function station(no, label, verb, rest, tag, o = {}) {
    const lines = [
      { c: 'kick', fx: 'kick', no, t: label, at: b(1) },
      { t: verb, c: 'verb', fx: 'wipe', at: b(1.5) },
      ...rest.map((r, i) => ({ ...r, c: r.c || 'rest', fx: r.fx || 'rise', at: r.at ?? b(2.5 + i * 0.75) })),
      ...(o.extra || []),
      { t: tag, c: 'tag', fx: 'type', at: o.tagAt ?? b(3.75) },
    ];
    return {
      id: 's' + (+no + 2), min: beats(8), mus: 'station', k: +no,
      sfx: [[0.35, 'whoosh', 0.13], [b(1.5), 'tick', 0.16], [o.tagAt ?? b(3.75), 'key', 0.1], ...(o.sfx || [])],
      vis: KV({ blk: 'st st' + no, cell: o.cell, move: MOVE, lines }),
    };
  }

  const SCENES = [
    // 1 · HOOK (0–5,7 dtk): empat baris, kamera menyesuaikan bingkai tiap baris muncul
    {
      id: 's1', min: beats(8), mus: 'hook',
      sfx: [[b(0.5), 'tick', 0.14], [b(2), 'tick', 0.14], [b(3.5), 'tick', 0.12], [b(5), 'shimmer', 0.16]],
      vis: KV({
        blk: 'hook', cell: { h: [0, 0], v: [0, 0] }, frames: 'lines', move: [-1, -1], fill: { h: [0.8, 0.72], v: [0.9, 0.6] },
        lines: [
          { t: 'Satu undang-undang.', c: 'big', at: b(0.5) },
          { t: 'Ratusan proses bisnis.', c: 'big', at: b(2) },
          { t: 'Satu pertanyaan:', c: 'mid mute', at: b(3.5) },
          { t: 'Sudahkah *terlindungi?*', c: 'big', at: b(5) },
        ],
      }),
    },
    // 2 · KONTEKS: dua landasan hukum, tanggal berlaku
    {
      id: 's2', min: beats(12), mus: 'context',
      sfx: [[0.4, 'whoosh', 0.14], [b(1.5), 'tick', 0.12], [b(5), 'tick', 0.12], [b(6.5), 'key', 0.1]],
      vis: KV({
        blk: 'ctx', cell: { h: [1, 0], v: [1, 0] }, move: [0, b(2.5)], frames: [[0, 2, b(1)], [0, 6, b(4.5)]],
        lines: [
          { c: 'kick', fx: 'kick', no: '§', t: 'Landasan hukum', at: b(1) },
          { t: 'UU PDP No. 27/2022', c: 'law', at: b(1.5) },
          { t: 'berlaku penuh sejak _Oktober 2024._', tv: 'berlaku penuh sejak|_Oktober 2024._', c: 'when', at: b(3) },
          { t: '', c: 'sep', fx: 'rule', at: b(4.5) },
          { t: 'PP No. 33/2026', c: 'law', at: b(5) },
          { t: 'berlaku *16 Januari 2027.*', tv: 'berlaku|*16 Januari 2027.*', c: 'when', at: b(6.5) },
        ],
      }),
    },
    // 3–11 · SEMBILAN STASIUN KEWAJIBAN (masing-masing 8 ketukan ≈ 5,7 dtk)
    station('01', 'RoPA', 'Catat', [{ t: 'setiap kegiatan pemrosesan.', tv: 'setiap kegiatan|pemrosesan.' }],
      'UU PDP Pasal 31 · PP 33/2026 Pasal 74', { cell: { h: [2, 0], v: [2, 0] } }),
    station('02', 'DPIA', 'Nilai', [{ t: 'dampaknya sebelum berisiko.', tv: 'dampaknya|sebelum berisiko.' }],
      'UU PDP Pasal 34 · PP 33/2026 Pasal 120', { cell: { h: [3, 0], v: [2, 1] } }),
    station('03', 'DSR', 'Hormati', [{ t: 'hak subjek data.' }],
      'UU PDP Pasal 5–14', {
        cell: { h: [3, 1], v: [2, 2] }, tagAt: b(4.75),
        extra: [{ t: 'Tenggat 72 jam, dihitung otomatis.', tv: 'Tenggat 72 jam,|dihitung otomatis.', c: 'note', at: b(3.5) }],
        sfx: [[b(3.5), 'tick', 0.12]],
      }),
    station('04', 'Consent', 'Minta', [
      { t: 'persetujuan yang sah —' },
      { t: 'dan _buktikan._', c: 'rest', at: b(4.25) },
    ], 'UU PDP Pasal 20 · 22 · 24', { cell: { h: [3, 2], v: [2, 3] }, tagAt: b(5.25), sfx: [[b(4.25), 'tick', 0.13]] }),
    station('05', 'Children Pro · Inclusive Privacy', 'Lindungi', [
      { t: 'data anak &' },
      { t: 'penyandang disabilitas.', tv: 'penyandang|disabilitas.' },
    ], 'UU PDP Pasal 25–26 · PP 33/2026 Pasal 38–39', { cell: { h: [3, 3], v: [2, 4] }, tagAt: b(4.25) }),
    station('06', 'Pihak Ketiga', 'Kendalikan', [
      { t: 'pihak ketiga' },
      { t: 'yang memproses data atas nama Anda.', tv: 'yang memproses data|atas nama Anda.', c: 'deck', at: b(3.5) },
    ], 'UU PDP Pasal 51', { cell: { h: [2, 3], v: [1, 4] }, tagAt: b(4.5) }),
    station('07', 'Lintas Negara', 'Jaga', [{ t: 'data yang menyeberang negara.', tv: 'data yang|menyeberang negara.', cross: 'menyeberang' }],
      'UU PDP Pasal 56', { cell: { h: [1, 3], v: [0, 4] } }),
    station('08', 'Insiden', 'Laporkan', [
      { t: 'kegagalan pelindungan' },
      { t: 'dalam _3×24 jam._', bar: [b(4.5), b(8)] },
    ], 'UU PDP Pasal 46 · PP 33/2026 Pasal 114', { cell: { h: [0, 3], v: [0, 3] }, tagAt: b(4.25) }),
    station('09', 'PPDP', 'Tunjuk', [
      { t: 'pejabat atau petugas' },
      { t: 'pelindungan data pribadi.', tv: 'pelindungan|data pribadi.' },
    ], 'UU PDP Pasal 53 · PP 33/2026 Pasal 142', { cell: { h: [0, 2], v: [0, 2] }, tagAt: b(4.25) }),
    // 12 · TARUHAN: sanksi 2%
    {
      id: 's12', min: beats(10), mus: 'stakes',
      sfx: [[0.4, 'whoosh', 0.12], [b(1.5), 'tick', 0.12], [b(4) - 0.9, 'riser', 0.16], [b(4), 'impact', 0.42], [b(6.5), 'key', 0.1]],
      vis: KV({
        blk: 'stakes', cell: { h: [0, 1], v: [0, 1] }, move: [0, b(2.5)],
        lines: [
          { c: 'kick', fx: 'kick', no: '!', t: 'Sanksi administratif', at: b(1) },
          { t: 'denda hingga', c: 'rest mute', at: b(2.5) },
          { t: '2%', c: 'giga', fx: 'slam', at: b(4) },
          { t: 'dari pendapatan tahunan.', tv: 'dari pendapatan|tahunan.', c: 'rest', at: b(5.25) },
          { t: 'UU PDP Pasal 57 ayat (3)', c: 'tag', fx: 'type', at: b(6.5) },
        ],
      }),
    },
    // 13 · BALIK: sembilan kewajiban, puluhan divisi, satu platform (di pusat kanvas)
    {
      id: 's13', min: beats(8), mus: 'turn',
      sfx: [[0.4, 'whoosh', 0.14], [b(1.5), 'tick', 0.12], [b(3.5), 'tick', 0.12], [b(5.5), 'shimmer', 0.22]],
      vis: KV({
        blk: 'turn', hub: 'turn', move: [0, b(2.5)], frames: 'lines', fill: { h: [0.7, 0.62], v: [0.9, 0.5] },
        lines: [
          { t: 'Sembilan kewajiban.', c: 'big', at: b(1.5) },
          { t: 'Puluhan divisi.', c: 'big', at: b(3.5) },
          { t: 'Satu *platform.*', c: 'big', at: b(5.5) },
        ],
      }),
    },
    // 14 · KAMERA MUNDUR: seluruh kanvas = satu poster; garis dari tiap stasiun bertemu di logo
    {
      id: 's14', min: beats(14), mus: 'reveal',
      sfx: [[0.05, 'riserLong', 0.2], [b(3), 'sweep', 0.12], [b(5), 'reveal', 0.42], [b(7.5), 'shimmer', 0.13]],
      vis: KV({ reveal: true, pull: [0, b(4.5)], spokes: [b(2.75), b(5)], logo: b(5), ripple: b(7.5) }),
    },
    // 15 · CTA (bebas, tanpa pembulatan ketukan)
    {
      id: 's15', min: 8.8, free: true, mus: 'outro',
      sfx: [[0.25, 'whoosh', 0.1]],
      vis: {
        type: 'kv_cta', enter: 'none', exit: 'none', push: 0, move: [0, 1.9],
        tag: 'Kepatuhan PDP untuk korporasi & grup usaha.', tagAt: 1.0,
        btn: 'Jadwalkan Demo', url: 'privasimu.com', btnAt: 1.9,
        foot: 'support@privasimu.com · 0851 8318 2722', footAt: 2.7,
      },
    },
  ];
  // Voice-over edge-tts (dirender lokal lewat RENDER.bat / RENDER-LANDING.bat). Kalimat pendek agar muat di
  // durasi scene; angka ditulis sebagai kata supaya dibaca benar. Scene yang VO-nya lebih panjang dari `min`
  // otomatis memanjang (dibulatkan ke ketukan).
  const VO = {
    s1: 'Satu undang-undang. Ratusan proses bisnis. Satu pertanyaan: sudahkah terlindungi?',
    s2: 'U U P D P berlaku penuh sejak Oktober dua ribu dua puluh empat. P P tiga puluh tiga berlaku enam belas Januari dua ribu dua puluh tujuh.',
    s3: 'Catat setiap kegiatan pemrosesan.',
    s4: 'Nilai dampaknya, sebelum berisiko.',
    s5: 'Hormati hak subjek data, dengan tenggat yang dihitung otomatis.',
    s6: 'Minta persetujuan yang sah, dan buktikan.',
    s7: 'Lindungi data anak dan penyandang disabilitas.',
    s8: 'Kendalikan pihak ketiga yang memproses data atas nama Anda.',
    s9: 'Jaga data yang menyeberang negara.',
    s10: 'Laporkan kegagalan pelindungan dalam tiga kali dua puluh empat jam.',
    s11: 'Tunjuk pejabat pelindungan data pribadi.',
    s12: 'Sanksinya: denda hingga dua persen dari pendapatan tahunan.',
    s13: 'Sembilan kewajiban. Puluhan divisi. Satu platform.',
    s14: 'Privasimu.',
    s15: 'Jadwalkan demo di privasimu titik com.',
  };
  SCENES.forEach((s) => { s.vo = VO[s.id] || ''; s.voDelay = s.vo ? 0.35 : 0; s.theme = 'ink'; });

  const api = { CONFIG, SCENES, BPM, BEAT };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
