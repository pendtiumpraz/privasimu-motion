// Iklan #2 — "Hitung Mundur PP 33/2026" (berlaku 16 Januari 2027).
// Fakta regulasi dari basis pengetahuan platform (FAQ & KB PP 33/2026 di backend):
//   PP 33/2026 diundangkan 16 Juli 2026, berlaku 6 bulan kemudian (Ps. 225) = 16 Januari 2027.
//   RoPA isi minimal Ps. 74 · Notifikasi 3x24 jam Ps. 114 · DPIA Ps. 120–122 · Data anak Ps. 38 · Transfer lintas negara Ps. 162–163.
(function (root) {
  const CONFIG = {
    title: 'Privasimu Nexus — Hitung Mundur PP 33/2026',
    naskah: 'N01',      // kode naskah: VN tim ditaruh di folder vn/ sebagai N01_S1.wav, ... atau N01.wav utuh
    voice: 'id-ID-GadisNeural',
    voiceRate: '+15%',
    beat: 0.5,          // 120 bpm: durasi scene dibulatkan ke ketukan, cut jatuh tepat di beat
    tail: 0.45,
    mix: { duckTo: 0.4 },
  };

  // Split-flap: JUL 2026 (diundangkan) -> JAN 2027 (berlaku)
  const FLAPS = [['JUL', '2026'], ['AGU', '2026'], ['SEP', '2026'], ['OKT', '2026'], ['NOV', '2026'], ['DES', '2026'], ['JAN', '2027']];
  const FLIP_TIMES = [0.25, 0.42, 0.57, 0.71, 0.86, 1.05]; // ganti bulan; mendarat di JAN 2027 pada flip terakhir
  const LAND = 1.05;

  const DUTIES = [
    { text: 'Catatan kegiatan pemrosesan (RoPA)', pasal: 'PP 33/2026 Ps. 74', word: 'RoPA', module: 'RoPA' },
    { text: 'DPIA untuk pemrosesan berisiko tinggi', pasal: 'Ps. 120–122', word: 'DPIA', module: 'DPIA otomatis' },
    { text: 'Notifikasi insiden 3×24 jam', pasal: 'Ps. 114', word: 'notifikasi', module: 'Data Breach' },
    { text: 'Persetujuan wali untuk data anak', pasal: 'Ps. 38', word: 'persetujuan', module: 'Children Pro' },
    { text: 'Transfer data lintas negara', pasal: 'Ps. 162–163', word: 'transfer', module: 'Cross Border + TIA' },
  ];
  const CHECK_STEP = 0.5; // centang per ketukan di scene solusi

  const SCENES = [
    {
      id: 'date', min: 4.5, voDelay: 1.3,
      vo: 'Enam belas Januari, dua ribu dua puluh tujuh.',
      sfx: [['flips', 'flip', 0.9], [LAND, 'impact', 0.9], [LAND, 'stamp', 0.5]],
    },
    {
      id: 'pp', min: 5.5, voDelay: 0.25,
      vo: 'Hari itu, PP tiga puluh tiga tahun dua ribu dua puluh enam, aturan pelaksana UU PDP, mulai berlaku.',
      sfx: [[0.0, 'paper', 0.9], [0.05, 'whoosh', 0.4], ['w:berlaku', 'stamp', 1]],
    },
    {
      id: 'wajib', min: 6.5, voDelay: 0.2,
      vo: 'RoPA, DPIA, notifikasi insiden tiga kali dua puluh empat jam, persetujuan wali untuk data anak, hingga transfer lintas negara, semua harus siap.',
      sfx: [['rows', 'slam', 0.9], ['w:semua', 'alarm', 0.8], ['w:semua', 'hit', 0.6]],
    },
    {
      id: 'siap', min: 3.5, voDelay: 0.25, tail: 0.9,
      vo: 'Organisasi Anda, sudah siap?',
      sfx: [['end-2.0', 'riserLong', 0.8], ['end-0.4', 'suck', 0.8]],
    },
    {
      id: 'nexus', min: 7.0, voDelay: 0.6,
      vo: 'Privasimu Nexus memetakan kewajiban UU PDP dan PP tiga puluh tiga, pasal demi pasal, ke modul yang menanganinya.',
      sfx: [[0.0, 'boom', 1], [0.0, 'shimmer', 0.7], ['checks', 'check', 0.9], ['checks', 'tick', 0.4]],
    },
    {
      id: 'cta', min: 6.5, voDelay: 0.35,
      vo: 'Jangan tunggu enam belas Januari, siapkan sekarang di privasimu dot com.',
      sfx: [[0.0, 'whoosh', 0.6], ['w:enam', 'stamp', 0.6], ['w:privasimu', 'ding', 0.7]],
    },
  ];

  const CUE_EXPANDERS = {
    flips: () => FLIP_TIMES,
    rows: (sc) => DUTIES.map((d) => wordTimeSafe(sc, 'w:' + d.word)),
    checks: (sc) => { const t0 = checkStart(sc); return DUTIES.map((_, i) => t0 + i * CHECK_STEP); },
  };

  // Centang dimulai pada kata "pasal" (pertama), dibulatkan ke ketukan global agar sinkron dengan musik
  function checkStart(sc) {
    const t = wordTimeSafe(sc, 'w:pasal');
    const beat = CONFIG.beat, abs = sc.start + t;
    return Math.ceil(abs / beat - 1e-6) * beat - sc.start;
  }
  function wordTimeSafe(sc, spec) {
    const wt = (typeof module !== 'undefined') ? require('../lib/wordtime').wordTime : root.wordTime;
    return wt(sc, spec);
  }

  const api = { CONFIG, SCENES, FLAPS, FLIP_TIMES, LAND, DUTIES, CHECK_STEP, CUE_EXPANDERS, checkStart };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
