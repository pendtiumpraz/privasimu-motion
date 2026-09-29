// T01 — STOMP "Satu Platform": tipografi menghentak di atas pola stomp-stomp-clap 100 bpm (orisinal, disintesis).
// Hook (anomali + relate): "12 spreadsheet. 7 folder. 3 grup chat. 1 DPO." → break "Cukup. Saatnya rapi." →
// drop: modul menghentak satu per satu (screenshot ASLI) → "Semua. Dalam. Satu. Platform." → logo →
// "16 Januari 2027: PP 33/2026 berlaku" → "Siap? …atau masih 12 spreadsheet?" (callback hook) → CTA.
// Scene tanpa VO (vo: '') = murni musik + visual. CONFIG.beat = 1 birama: semua scene berdurasi kelipatan birama,
// jadi pola stomp global (dihitung dari detik 0) selalu jatuh di kartu yang benar.
// Kartu: { b: ketukan sejak awal scene | at: cue kata, bg, num, word, big, kick, sub, shot, tag, deco, chips, logo, fx }
(function (root) {
  const BPM = 100, BEAT = 60 / BPM, BAR = 4 * BEAT;
  const CONFIG = {
    title: 'T01 · Stomp: Satu Platform',
    naskah: 'T01',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+5%',
    maxPause: 0.3,
    beat: BAR,
    tail: 0.3,
    music: { bpm: BPM },
    mix: { duckTo: 0.5, musicGain: 0.95, sfxGain: 0.85 },
  };
  const CUT = { enter: 'none', exit: 'none', push: 0 };

  // hook: angka (stomp) → kata di pita (stomp) → clap (kilat + dekorasi)
  const trio = (b, num, word, bg, bg2, deco) => [
    { b, bg, num },
    { b: b + 0.5, bg, num, word },
    { b: b + 1, bg: bg2, num, word, deco, fx: 'flash' },
  ];
  // modul: kata raksasa (stomp) → screenshot ASLI menghantam (stomp) → chip manfaat + kilat (clap)
  const MOD = [
    { word: 'RoPA', src: 'ropa-list-baru', crop: [262, 0, 1178, 560], tag: 'tercatat rapi', bg: 'b' },
    { word: 'DPIA', src: 'dpia-risiko', crop: [262, 0, 1002, 600], tag: 'risiko terukur', bg: 'w' },
    { word: 'DSR', src: 'dsr-detail', crop: [0, 0, 1002, 250], tag: 'tenggat terpantau', bg: 'y' },
    { word: 'CONSENT', src: 'consent-detail', crop: [300, 0, 1324, 560], tag: 'persetujuan bisa dibuktikan', bg: 'k' },
    { word: 'INSIDEN', src: 'breach-detail', crop: [262, 0, 1002, 620], tag: 'siap lapor 3×24 jam', bg: 'r' },
    { word: 'GAP', kick: 'ASSESSMENT', src: 'gap-hasil', crop: [0, 0, 1002, 690], tag: 'skor + rekomendasi per pasal', bg: 'w' },
    { word: 'AI AGENT', src: 'ai-agent-chat', crop: [262, 0, 1002, 569], tag: 'bantu jawab & beri rekomendasi', bg: 'v' },
    { word: 'ACADEMY', kick: 'DPO', src: 'dpo-academy', crop: [262, 40, 1178, 480], tag: 'tim ikut paham', bg: 'y' },
  ];
  const drop = MOD.flatMap((m, i) => {
    const base = { bg: m.bg, big: m.word, kick: m.kick, deco: 'marquee' }, shot = { src: `../assets/app/${m.src}.png`, crop: m.crop, label: (m.kick ? m.kick + ' ' : '') + m.word };
    return [
      { b: i * 2, ...base, fx: i % 2 ? 'slideR' : 'slideL' },
      { b: i * 2 + 0.5, ...base, shot },
      { b: i * 2 + 1, ...base, shot, tag: '✓ ' + m.tag, fx: 'flash' },
    ];
  });
  const CHIPS = ['RoPA', 'DPIA', 'DSR', 'Consent', 'Insiden', 'GAP', 'AI Agent', 'DPO Academy', 'LIA', 'TIA', 'Pihak Ketiga', 'Data Discovery'];

  const SCENES = [
    {
      id: 's1', min: 2 * BAR, vo: '', mus: 'hook',
      vis: { type: 'stomp', ...CUT, pulse: true, cards: [
        ...trio(0, '12', 'SPREADSHEET', 'k', 'w', 'grid'),
        ...trio(2, '7', 'FOLDER', 'w', 'y', 'emo:🗂️'),
        ...trio(4, '3', 'GRUP CHAT', 'y', 'b', 'chat'),
        ...trio(6, '1', 'DPO.', 'r', 'k', 'emo:😵'),
      ] },
    },
    {
      id: 's2', min: BAR, voDelay: 0.2, tail: 0.15, voiceRate: '+25%', mus: 'break', cap: false,
      vo: 'Cukup. Saatnya rapi.',
      sfx: [[0, 'scratch', 0.7], ['w:Cukup', 'stamp', 0.6], ['w:rapi', 'hit', 0.5]],
      vis: { type: 'stomp', ...CUT, cards: [
        { b: 0, bg: 'k', emoji: '😵', fx: 'cut' },
        { at: 'w:Cukup-0.04', bg: 'k', big: 'CUKUP.' },
        { at: 'w:Saatnya-0.04', bg: 'w', big: 'SAATNYA', fx: 'cut' },
        { at: 'w:rapi-0.04', bg: 'w', kick: 'SAATNYA', big: 'RAPI.' },
      ] },
    },
    {
      id: 's3', min: 4 * BAR, vo: '', mus: 'drop',
      vis: { type: 'stomp', ...CUT, pulse: true, cards: drop },
    },
    {
      id: 's4', min: BAR, vo: '', mus: 'drop',
      vis: { type: 'stomp', ...CUT, pulse: true, cards: [
        { b: 0, bg: 'w', big: 'SEMUA.' },
        { b: 0.5, bg: 'b', big: 'DALAM.', fx: 'slideR' },
        { b: 1, bg: 'y', big: 'SATU.', fx: 'flash' },
        { b: 2, bg: 'k', big: 'PLATFORM.', chips: CHIPS },
        { b: 3, bg: 'k', big: 'PLATFORM.', chips: CHIPS, converge: true, fx: 'flash' },
      ] },
    },
    {
      id: 's5', min: BAR, vo: '', mus: 'logo',
      sfx: [[0, 'impact', 0.6]],
      vis: { type: 'stomp', ...CUT, cards: [
        { b: 0, bg: 'n', logo: true, deco: 'rays', fx: 'flash' },
        { b: 2, bg: 'n', logo: true, deco: 'rays', chips: CHIPS, ticker: true, fx: 'cut' },
      ] },
    },
    {
      id: 's6', min: 2 * BAR, vo: '', mus: 'siap',
      sfx: [[4 * BEAT, 'vineboom', 0.55], [8 * BEAT - 1.15, 'riser', 0.4]],
      vis: { type: 'stomp', ...CUT, pulse: 4, cards: [
        { b: 0, bg: 'r', num: '16' },
        { b: 0.5, bg: 'r', num: '16', word: 'JANUARI 2027' },
        { b: 1, bg: 'k', num: '16', word: 'JANUARI 2027', fx: 'flash' },
        { b: 2, bg: 'w', big: 'PP 33/2026' },
        { b: 2.5, bg: 'w', kick: 'PP 33/2026', big: 'BERLAKU.' },
        { b: 3, bg: 'r', kick: 'PP 33/2026', big: 'BERLAKU.', fx: 'flash' },
        { b: 4, bg: 'w', big: 'SIAP?', fx: 'zoom' },
        { b: 6, bg: 'w', big: 'SIAP?', sub: '…atau masih 12 spreadsheet?', fx: 'hold' },
      ] },
    },
    {
      id: 's7', min: 3 * BAR, voDelay: 0.35, tail: 3.0, free: true, voiceRate: '+12%', mus: 'cta',
      vo: 'Privasimu Nexus. Satu platform untuk semua kewajiban UU PDP. Cek kesiapanmu gratis, di privasimu dot com.',
      sfx: [[0, 'impact', 0.5], ['w:Satu', 'whoosh', 0.3], ['w:Cek', 'pop', 0.45], ['w:privasimu#2', 'ding', 0.4]],
      vis: { type: 'stomp_cta', ...CUT, pulse: true, lineAt: 'w:Satu', line2At: 'w:semua', btnAt: 'w:Cek', urlAt: 'w:privasimu#2' },
    },
  ];

  const api = { CONFIG, SCENES, BEAT, BAR };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
