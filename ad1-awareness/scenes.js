// Iklan #1 — Awareness UU PDP. Dipakai build (TTS, timeline, SFX) dan index.html (visual).
(function (root) {
  const CONFIG = {
    title: 'Privasimu Nexus — Awareness UU PDP',
    naskah: 'N02',               // kode naskah: VN tim ditaruh di folder vn/ sebagai N02_S1.wav, N02_S2.wav, ... atau N02.wav utuh
    moduleCount: '20+',          // ganti ke '21' / '22' bila ingin angka pasti
    voice: 'id-ID-ArdiNeural',   // atau 'id-ID-GadisNeural'
    voiceRate: '+12%',
    tail: 0.5,                   // jeda setelah VO tiap scene (detik)
  };

  // min = durasi minimum scene (detik). vo = naskah voice-over.
  // sfx = [waktu, nama sfx, gain]; waktu = detik lokal | 'w:<kata>[#n][+/-offset]' | 'end-<detik>' | nama expander
  const SCENES = [
    {
      id: 'hook', min: 4.6, voDelay: 0.5,
      vo: 'Setiap hari, data pribadi bisa bocor, tanpa kita sadari.',
      sfx: [[0.0, 'glitch', 0.8], [0.9, 'glitch', 0.5], ['w:bocor', 'impact', 1], ['w:bocor', 'glitch', 0.9]],
    },
    {
      id: 'law', min: 7.0, voDelay: 0.3,
      vo: 'Sejak UU PDP berlaku, setiap organisasi wajib melindungi data pribadi, dengan sanksi denda hingga dua persen dari pendapatan tahunan.',
      sfx: [[0.0, 'whoosh', 0.7], [0.45, 'stamp', 1], ['w:Dengan-0.5', 'whoosh', 0.5], ['w:dua', 'impact', 0.8]],
    },
    {
      id: 'chaos', min: 5.2, voDelay: 0.2,
      vo: 'Tapi, mengelola kepatuhan secara manual? Rumit, lambat, dan berisiko.',
      sfx: [[0.1, 'pop', 0.5], [0.35, 'pop', 0.5], [0.6, 'pop', 0.5], [0.85, 'pop', 0.5], [1.1, 'pop', 0.5], [1.35, 'pop', 0.5],
            ['w:Rumit', 'hit', 0.9], ['w:lambat', 'hit', 0.9], ['w:berisiko', 'hit', 1], ['end-1.1', 'riser', 0.9], ['end-0.35', 'suck', 0.9]],
    },
    {
      id: 'reveal', min: 4.2, voDelay: 1.3,
      vo: 'Kenalkan, Privasimu Nexus.',
      sfx: [[0.0, 'boom', 1], [0.0, 'shimmer', 0.8], [1.0, 'sweep', 0.6]],
    },
    {
      id: 'modules', min: 8.5, voDelay: 0.2,
      vo: 'Lebih dari dua puluh modul kepatuhan dalam satu platform. RoPA, DPIA, consent, hak subjek data, hingga insiden kebocoran.',
      sfx: [[0.0, 'whoosh', 0.6], ['tiles', 'tick', 0.35], ['w:platform', 'ding', 0.5], ['w:RoPA', 'pop', 0.6], ['w:DPIA', 'pop', 0.6], ['w:consent', 'pop', 0.6], ['w:hak', 'pop', 0.6], ['w:insiden', 'pop', 0.6]],
    },
    {
      id: 'ai', min: 7.0, voDelay: 0.3,
      vo: 'Didukung AI yang mengisi dokumen, mendeteksi risiko, dan membantu DPO bekerja jauh lebih cepat.',
      sfx: [[0.0, 'whoosh', 0.6], ['w:mengisi', 'pop', 0.55], ['w:mendeteksi-0.2', 'whoosh', 0.4], ['w:mendeteksi', 'pop', 0.55], ['w:membantu-0.2', 'whoosh', 0.4], ['w:membantu', 'ding', 0.5]],
    },
    {
      id: 'deploy', min: 6.0, voDelay: 0.3,
      vo: 'Fleksibel untuk SaaS, hybrid, maupun on-premise. Siap untuk grup dan holding multi perusahaan.',
      sfx: [[0.0, 'whoosh', 0.6], [0.35, 'pop', 0.6], [0.7, 'pop', 0.6], [1.05, 'pop', 0.6], ['w:holding-0.9', 'sweep', 0.5]],
    },
    {
      id: 'cta', min: 6.5, voDelay: 0.6,
      vo: 'Privasimu Nexus. Patuh UU PDP, tanpa ribet. Kunjungi privasimu dot com.',
      sfx: [[0.0, 'boom', 0.8], [0.0, 'shimmer', 0.7], ['w:privasimu#2', 'ding', 0.6]],
    },
  ];

  const TILE_START = 0.5, TILE_STEP = 0.075;
  const TYPE_START = 0.9, TYPE_STEP = 0.045;
  const PROMPT = 'Buatkan draft DPIA untuk RoPA Rekrutmen Karyawan';

  const MODULES = [
    'Gap Assessment', 'RoPA', 'DPIA', 'Consent', 'Cookie Banner', 'Data Subject Request',
    'Data Breach', 'Fire Drill', 'Data Discovery', 'Risk Treatment', 'TPRM Vendor', 'Cross Border',
    'LIA', 'TIA', 'Maturity', 'Contract Review', 'Policy Review', 'Policy Generator',
    'Document Import AI', 'Children Pro', 'Inclusive Privacy', 'PPDP', 'AI Agent', 'DPO Academy',
  ];

  // Cue berulang: nama -> daftar waktu lokal
  const CUE_EXPANDERS = {
    tiles: () => MODULES.map((_, k) => TILE_START + k * TILE_STEP),
    typing: () => [...PROMPT].map((c, k) => (c === ' ' ? null : TYPE_START + k * TYPE_STEP)).filter((x) => x !== null),
  };

  const api = { CONFIG, SCENES, MODULES, TILE_START, TILE_STEP, TYPE_START, TYPE_STEP, PROMPT, CUE_EXPANDERS };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
