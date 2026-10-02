// LP01 — STOMP "Buktinya Ada di Layar" · video landing page, 16:9 utama + 9:16, ± 60–65 dtk, VO edge-tts + musik stomp + SFX.
// Formula diadaptasi dari t01-stomp (kartu tipografi menghentak di pola stomp-stomp-clap 100 bpm), tetapi seluruh
// screenshot diambil dari aplikasi ASLI berisi DATA DEMO grup fiktif Arunika (php artisan db:seed --class=DemoSeeder):
// assets/app/arunika-*.png (salinan WebP-nya di repo privasimu: screenshot/aplikasi/).
// Alur: hook angka korporasi → "Cukup. Saatnya terbukti." → drop register (RoPA, DPIA, Discovery, transfer, TIA, LIA)
// → drop tata kelola (dasbor, holding, telaah, RTP) → SEMUA. DALAM. SATU. PLATFORM. → logo → siap enterprise →
// 16 Januari 2027 → CTA Pre-Check.
// DASAR FAKTA: sama dengan LP02 (UU PDP Pasal 31/34/46/56/57(3); PP 33/2026 Pasal 225 → berlaku 16.01.2027).
// Kapabilitas enterprise (holding, SaaS/on-prem, SSO & SCIM, log audit berantai hash) = fakta_produk.json / beranda v2.
// Crop screenshot = [x, y, lebar, tinggi] dalam piksel gambar sumber; sidebar aplikasi ±256 px (dipotong).
(function (root) {
  const BPM = 100, BEAT = 60 / BPM, BAR = 4 * BEAT;
  const CONFIG = {
    title: 'LP01 · Stomp: Buktinya Ada di Layar',
    naskah: 'LP01',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.3,
    beat: BAR,
    tail: 0.3,
    music: { bpm: BPM },
    mix: { duckTo: 0.5, musicGain: 0.95, sfxGain: 0.85 },
    meta: {
      judul: 'Buktinya Ada di Layar',
      gaya: 'Stomp: tipografi menghentak + screenshot aplikasi asli (data demo Arunika)',
      sasaran: 'korporasi & grup usaha: DPO/PPDP, legal, risiko, TI',
      komposisi: 'produk + edukasi + CTA',
    },
  };
  const CUT = { enter: 'none', exit: 'none', push: 0 };
  const shotOf = (src, crop, label) => ({ src: `../assets/app/${src}.png`, crop, label });

  const trio = (b, num, word, bg, bg2, deco) => [
    { b, bg, num },
    { b: b + 0.5, bg, num, word },
    { b: b + 1, bg: bg2, num, word, deco, fx: 'flash' },
  ];
  // kata raksasa (stomp) → screenshot menghantam (stomp) → chip manfaat + kilat (clap)
  const dropDari = (mods) => mods.flatMap((m, i) => {
    const base = { bg: m.bg, big: m.word, kick: m.kick, deco: 'marquee' };
    const shot = shotOf(m.src, m.crop, (m.kick ? m.kick + ' ' : '') + m.word);
    // 4 ketukan per modul: kata (stomp) → screenshot (stomp) → chip + kilat (clap) → tahan agar layar terbaca
    return [
      { b: i * 4, ...base, fx: i % 2 ? 'slideR' : 'slideL' },
      { b: i * 4 + 1, ...base, shot },
      { b: i * 4 + 2, ...base, shot, tag: '✓ ' + m.tag, fx: 'flash' },
    ];
  });
  const REGISTER = [
    { word: 'RoPA', src: 'arunika-ropa', crop: [256, 40, 1184, 600], tag: 'setiap pemrosesan tercatat', bg: 'b' },
    { word: 'DPIA', src: 'arunika-dpia-matriks', crop: [0, 80, 1180, 620], tag: 'matriks risiko 5×5', bg: 'w' },
    { word: 'DISCOVERY', kick: 'DATA', src: 'arunika-discovery', crop: [256, 40, 1184, 600], tag: 'data pribadi ditemukan', bg: 'y' },
    { word: 'TRANSFER', kick: 'LINTAS NEGARA', src: 'arunika-transfer', crop: [256, 40, 1184, 520], tag: 'tujuan & dasar transfer', bg: 'k' },
    { word: 'TIA', src: 'arunika-tia', crop: [0, 60, 1180, 620], tag: 'dampak transfer dinilai', bg: 'w' },
    { word: 'LIA', src: 'arunika-lia', crop: [256, 40, 1184, 520], tag: 'kepentingan sah diuji', bg: 'v' },
  ];
  const TATA_KELOLA = [
    { word: 'DASBOR', src: 'arunika-dasbor', crop: [256, 60, 1184, 600], tag: 'posisi kepatuhan sekilas', bg: 'n' },
    { word: 'HOLDING', src: 'arunika-holding', crop: [256, 60, 1184, 600], tag: 'induk & anak usaha', bg: 'y' },
    { word: 'TELAAH', kick: 'MAKER · REVIEWER', src: 'arunika-telaah', crop: [256, 40, 1184, 640], tag: 'persetujuan berjenjang', bg: 'w' },
    { word: 'RTP', kick: 'RENCANA RISIKO', src: 'arunika-rtp', crop: [0, 40, 1180, 620], tag: 'mitigasi + tenggat', bg: 'r' },
  ];
  const CHIPS = ['RoPA', 'DPIA', 'DSR', 'Consent', 'Insiden', 'Discovery', 'Transfer', 'TIA', 'LIA', 'Pihak Ketiga', 'GAP', 'PPDP'];

  const SCENES = [
    {
      id: 's1', min: 2 * BAR, vo: '', mus: 'hook',
      vis: { type: 'stomp', ...CUT, pulse: true, cards: [
        ...trio(0, '9', 'KEWAJIBAN', 'k', 'w', 'grid'),
        ...trio(2, '4', 'ANAK USAHA', 'w', 'y', 'emo:🏢'),
        ...trio(4, '16', 'DIVISI', 'y', 'b', 'chat'),
        ...trio(6, '1', 'AUDITOR.', 'r', 'k', 'emo:🧐'),
      ] },
    },
    {
      id: 's2', min: BAR, voDelay: 0.2, tail: 0.15, voiceRate: '+22%', mus: 'break', cap: false,
      vo: 'Mana buktinya? Ada di layar.',
      sfx: [[0, 'scratch', 0.7], ['w:buktinya', 'stamp', 0.6], ['w:layar', 'hit', 0.5]],
      vis: { type: 'stomp', ...CUT, cards: [
        { b: 0, bg: 'k', emoji: '🧐', fx: 'cut' },
        { at: 'w:Mana-0.04', bg: 'k', big: 'MANA', fx: 'cut' },
        { at: 'w:buktinya-0.04', bg: 'k', kick: 'MANA', big: 'BUKTINYA?' },
        { at: 'w:Ada-0.04', bg: 'w', big: 'ADA DI', fx: 'cut' },
        { at: 'w:layar-0.04', bg: 'w', kick: 'ADA DI', big: 'LAYAR.' },
      ] },
    },
    {
      id: 's3', min: 6 * BAR, voDelay: 0.3, mus: 'drop',
      vo: 'Register pemrosesan, penilaian dampak, temuan data pribadi, transfer lintas negara, sampai uji kepentingan sah.',
      vis: { type: 'stomp', ...CUT, pulse: true, cards: dropDari(REGISTER) },
    },
    {
      id: 's4', min: 4 * BAR, voDelay: 0.3, mus: 'drop',
      vo: 'Dasbor kepatuhan, tampilan holding, telaah berjenjang, dan rencana penanganan risiko.',
      vis: { type: 'stomp', ...CUT, pulse: true, cards: dropDari(TATA_KELOLA) },
    },
    {
      id: 's5', min: BAR, vo: '', mus: 'drop',
      vis: { type: 'stomp', ...CUT, pulse: true, cards: [
        { b: 0, bg: 'w', big: 'SEMUA.' },
        { b: 0.5, bg: 'b', big: 'DALAM.', fx: 'slideR' },
        { b: 1, bg: 'y', big: 'SATU.', fx: 'flash' },
        { b: 2, bg: 'k', big: 'PLATFORM.', chips: CHIPS },
        { b: 3, bg: 'k', big: 'PLATFORM.', chips: CHIPS, converge: true, fx: 'flash' },
      ] },
    },
    {
      id: 's6', min: BAR, vo: '', mus: 'logo',
      sfx: [[0, 'impact', 0.6]],
      vis: { type: 'stomp', ...CUT, cards: [
        { b: 0, bg: 'n', logo: true, deco: 'rays', fx: 'flash' },
        { b: 2, bg: 'n', logo: true, deco: 'rays', chips: CHIPS, ticker: true, fx: 'cut' },
      ] },
    },
    {
      id: 's7', min: 2 * BAR, voDelay: 0.3, mus: 'drop',
      vo: 'Siap untuk grup usaha: SaaS atau on-premise, S S O dan SCIM, log audit berantai hash.',
      vis: { type: 'stomp', ...CUT, pulse: true, cards: [
        { b: 0, bg: 'w', kick: 'GRUP USAHA', big: 'HOLDING' },
        { b: 1, bg: 'w', kick: 'GRUP USAHA', big: 'HOLDING', tag: '✓ induk → anak usaha', fx: 'flash' },
        { b: 2, bg: 'b', kick: 'PENERAPAN', big: 'SaaS · ON-PREM', fx: 'slideR' },
        { b: 3, bg: 'b', kick: 'PENERAPAN', big: 'SaaS · ON-PREM', tag: '✓ ikut kebijakan TI', fx: 'flash' },
        { b: 4, bg: 'y', kick: 'AKSES', big: 'SSO · SCIM', fx: 'slideL' },
        { b: 5, bg: 'y', kick: 'AKSES', big: 'SSO · SCIM', tag: '✓ SAML 2.0 · SCIM 2.0', fx: 'flash' },
        { b: 6, bg: 'k', kick: 'JEJAK', big: 'AUDIT', fx: 'slideR' },
        { b: 7, bg: 'k', kick: 'JEJAK', big: 'AUDIT', tag: '✓ berantai hash', fx: 'flash' },
      ] },
    },
    {
      id: 's8', min: 2 * BAR, vo: '', mus: 'siap',
      sfx: [[4 * BEAT, 'vineboom', 0.55], [8 * BEAT - 1.15, 'riser', 0.4]],
      vis: { type: 'stomp', ...CUT, pulse: 4, cards: [
        { b: 0, bg: 'r', num: '16' },
        { b: 0.5, bg: 'r', num: '16', word: 'JANUARI 2027' },
        { b: 1, bg: 'k', num: '16', word: 'JANUARI 2027', fx: 'flash' },
        { b: 2, bg: 'w', big: 'PP 33/2026' },
        { b: 2.5, bg: 'w', kick: 'PP 33/2026', big: 'BERLAKU.' },
        { b: 3, bg: 'r', kick: 'PP 33/2026', big: 'BERLAKU.', fx: 'flash' },
        { b: 4, bg: 'w', big: 'BUKTINYA?', fx: 'zoom' },
        { b: 6, bg: 'w', big: 'BUKTINYA?', sub: '…sudah siap ditunjukkan?', fx: 'hold' },
      ] },
    },
    {
      id: 's9', min: 3 * BAR, voDelay: 0.35, tail: 3.0, free: true, voiceRate: '+10%', mus: 'cta',
      vo: 'Privasimu. Semua bukti kepatuhan U U P D P, dalam satu platform. Mulai Pre-Check gratis, di privasimu titik com.',
      sfx: [[0, 'impact', 0.5], ['w:Semua', 'whoosh', 0.3], ['w:Mulai', 'pop', 0.45], ['w:privasimu#2', 'ding', 0.4]],
      vis: { type: 'stomp_cta', ...CUT, pulse: true, lineAt: 'w:Semua', line2At: 'w:satu', btnAt: 'w:Mulai', urlAt: 'w:privasimu#2' },
    },
  ];

  const api = { CONFIG, SCENES, BEAT, BAR };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
