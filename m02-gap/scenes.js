// M02 — GAP Assessment. Seri "Nexus Explained" (lib/seri-modul.js), rancangan: rancangan/…xlsx (M02).
// Hook (reverse psychology): "Jangan cek skor kepatuhan perusahaanmu… kalau belum siap kaget."
(function (root) {
  const CONFIG = {
    title: 'M02 · GAP Assessment',
    naskah: 'M02',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+8%',
    maxPause: 0.35,
    beat: 60 / 100 / 2,
    tail: 0.5,
    music: { bpm: 100, mode: 'major', root: 57, lead: 'keys', drums: 'light', sonic: true },
    mix: { duckTo: 0.38 },
  };
  const KONTAK = 'support@privasimu.com · 0851 8318 2722';

  const SCENES = [
    {
      id: 's1', min: 4, voDelay: 0.9, tail: 0.5, mus: 'hush',
      vo: 'Jangan cek skor kepatuhan perusahaanmu.',
      sfx: [[0.2, 'whoosh', 0.25], ['w:Jangan', 'buzzer', 0.25], ['w:perusahaanmu', 'tick', 0.35]],
      vis: { type: 'm02_tombol', lineAt: 'w:Jangan', stopAt: 'w:Jangan', enter: 'none' },
    },
    {
      id: 's2', min: 2.8, voDelay: 0.25, tail: 0.8, mus: 'hook',
      vo: 'Kalau belum siap kaget.',
      sfx: [['w:kaget', 'vineboom', 1.0]],
      vis: { type: 'm02_kaget', lineAt: 'w:Kalau', boomAt: 'w:kaget', shake: ['w:kaget'] },
    },
    {
      id: 's3', min: 4.5, voDelay: 0.3, mus: 'tense',
      vo: 'Banyak organisasi merasa sudah patuh. Tapi perasaan bukan bukti.',
      sfx: [[0.05, 'whoosh', 0.35], ['w:merasa', 'pop', 0.4], ['w:patuh', 'pop', 0.4], ['w:patuh+0.15', 'buzzer', 0.3], ['w:perasaan', 'pop', 0.4], ['w:bukti', 'stamp', 0.5]],
      vis: { type: 'm02_neq', aAt: 'w:merasa', bAt: 'w:patuh', cAt: 'w:perasaan', dAt: 'w:bukti' },
    },
    {
      id: 's4', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'GAP Assessment mengukur kepatuhan UU PDP dengan indikator yang jelas, lengkap dengan skor dan riwayatnya.',
      sfx: [[0.1, 'whoosh', 0.35], ['w:indikator', 'pop', 0.4], ['w:skor', 'pop', 0.45], ['w:riwayatnya', 'ding', 0.4]],
      vis: {
        type: 'nx_shot', eyebrow: 'M02 · GAP Assessment', title: 'Ukur, *jangan menebak.*', sub: '34 indikator kepatuhan UU PDP, plus pertanyaan khusus organisasimu.', titleAt: 0.2,
        src: '../assets/app/gap-ringkasan.png', size: [1002, 660], view: [1002, 660], label: 'Gap Assessment',
        cam: [{ at: 0, x: 0, y: 0, w: 1002 }, { at: 'w:skor', x: 0, y: 0, w: 780, dur: 1.1 }],
        marks: [
          { at: 'w:indikator', to: 'w:skor', r: [26, 14, 948, 84], label: 'Ringkasan asesmen', tone: 'blue' },
          { at: 'w:skor', to: 'w:riwayatnya', r: [268, 14, 222, 84], label: 'Skor tertinggi 81%', tone: 'green' },
          { at: 'w:riwayatnya', r: [26, 123, 556, 523], label: 'Riwayat skor tiap versi', tone: 'blue', side: 'bottom' },
        ],
      },
    },
    {
      id: 's5', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Hasilnya dirinci per area, jadi kelihatan mana yang sudah, dan mana yang belum.',
      sfx: [[0.1, 'whoosh', 0.35], ['w:Hasilnya', 'pop', 0.4], ['w:area', 'pop', 0.45], ['w:belum', 'ding', 0.4]],
      vis: {
        type: 'nx_shot', eyebrow: 'M02 · Hasil', title: 'Kelihatan *mana yang belum.*', titleAt: 0.15,
        src: '../assets/app/gap-hasil.png', size: [1002, 690], view: [1002, 690], label: 'Gap Assessment · Hasil',
        cam: [{ at: 0, x: 0, y: 0, w: 1002 }, { at: 'w:area', x: 300, y: 200, w: 702, dur: 1.1 }],
        marks: [
          { at: 'w:Hasilnya', to: 'w:area', r: [327, 62, 646, 225], label: 'Compliance score 81% · UU PDP', tone: 'green', side: 'bottom' },
          { at: 'w:area', r: [327, 313, 646, 362], label: 'Skor per area: 72% · 85% · 75%', tone: 'blue' },
        ],
      },
    },
    {
      id: 's6', min: 6.5, voDelay: 0.3, mus: 'main',
      vo: 'Tiap temuan punya rekomendasi per pasal, dan rencana remediasi bisa disusun dengan bantuan AI.',
      sfx: [[0.1, 'whoosh', 0.35], ['w:rekomendasi', 'pop', 0.45], ['w:pasal', 'pop', 0.4], ['w:remediasi', 'whoosh', 0.3], ['w:AI', 'shimmer', 0.45]],
      vis: {
        type: 'nx_shot', eyebrow: 'M02 · Rekomendasi', title: 'Rekomendasi per pasal, *rencana dari AI.*', titleAt: 0.15,
        src: '../assets/app/gap-rekomendasi.png', size: [1002, 900], view: [1002, 700], label: 'Gap Assessment · Rekomendasi',
        cam: [{ at: 0, x: 300, y: 180, w: 702 }, { at: 'w:rekomendasi-0.2', x: 300, y: 400, w: 702, dur: 1.0 }, { at: 'w:remediasi-0.2', x: 300, y: 180, w: 702, dur: 1.0 }],
        marks: [
          { at: 'w:rekomendasi', to: 'w:pasal', r: [351, 601, 598, 92], label: '9 critical · 1 high · 1 medium', tone: 'red' },
          { at: 'w:pasal', to: 'w:remediasi-0.2', r: [351, 730, 598, 170], label: 'Rekomendasi per pasal', tone: 'amber' },
          { at: 'w:AI', r: [679, 189, 294, 282], label: 'AI Remediation Plan', tone: 'blue', side: 'bottom' },
        ],
      },
    },
    {
      id: 's7', min: 4.5, voDelay: 0.3, mus: 'main',
      vo: 'Dokumen bukti pun bisa dianalisis AI, per pertanyaan.',
      sfx: [[0.1, 'whoosh', 0.35], ['w:Dokumen', 'paper', 0.4], ['w:dianalisis', 'shimmer', 0.45], ['w:pertanyaan', 'pop', 0.35], ['w:pertanyaan+0.15', 'pop', 0.35], ['w:pertanyaan+0.3', 'pop', 0.35], ['w:pertanyaan+0.45', 'pop', 0.35]],
      vis: { type: 'm02_ai', docAt: 'w:Dokumen', aiAt: 'w:dianalisis', resAt: 'w:pertanyaan' },
    },
    {
      id: 's8', min: 6, voDelay: 0.5, tail: 1.8, mus: 'outro',
      vo: 'Berani cek? Mulai dari Start Pre Check gratis, di privasimu dot com.',
      sfx: [['w:Berani', 'pop', 0.4], ['w:privasimu-0.1', 'pop', 0.45]],
      vis: {
        type: 'nx_cta', tag: 'Berani cek *skornya?*', tagAt: 'w:Berani', sub: 'Mulai dari Start Pre Check, gratis.', subAt: 'w:Mulai',
        btn: 'privasimu.com', btnAt: 'w:privasimu-0.1', chips: ['Start Pre Check · gratis', 'Schedule Demo'], foot: KONTAK,
      },
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
