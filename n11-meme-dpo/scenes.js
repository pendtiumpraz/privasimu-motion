// N11 — "Hidup DPO (2026)": kompilasi meme 1 menit tentang DPO & Privasimu Nexus.
// Format meme yang sedang naik (Agu–Sep 2026) dibuat ulang secara orisinal: record scratch/freeze frame (nostalgia 2016),
// "orang have / haven't / not yet", "astaga, bercanda", "Things to Say", borgol kebesaran, "Polyester Edit",
// "Kinda chic", +1000 aura & kacamata "deal with it" ala MLG 2016. Tipe scene kustom ada di style.js; SFX ditulis manual.
// Suara: DPO = GadisNeural, Pak Bos & narator "Things to Say" = ArdiNeural (pitch diturunkan).
(function (root) {
  const CONFIG = {
    title: 'N11 · Hidup DPO (2026)',
    naskah: 'N11',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+25%',
    beat: 60 / 128 / 2, // potongan jatuh di ketukan 1/8 (music.js tetap 128 bpm)
    tail: 0.45,
    maxPause: 0.3, // jeda TTS dirapatkan (ritme editan meme); VN tim tidak diubah
    mix: { duckTo: 0.42, musicGain: 0.9 },
    // ejaan fonetis untuk TTS -> tulisan di subtitle
    capMap: [['hev', 'have'], ['hevent', "haven't"], ['kainda syik', 'Kinda chic'], ['seratus persen', '100%'], ['jam tiga pagi', 'Jam 3 pagi']],
  };

  // transisi keras ala editan meme (kit: tanpa dip-blur; efek potong ditangani style.js)
  const CUT = { enter: 'none', exit: 'none' };

  const SCENES = [
    {
      id: 's1', min: 4.5, voDelay: 1.1, tail: 0.78, mus: 'chaos',
      vo: 'Yep, itu aku. Pasti bingung kok bisa begini.',
      sfx: [
        [0.02, 'alarm', 0.45], [0.18, 'paper', 0.5], [0.42, 'whoosh', 0.35], [0.55, 'notif', 0.5], [0.72, 'paper', 0.4],
        [0.9, 'scratch', 1.0], [0.92, 'shutter', 0.55], ['w:itu', 'pop', 0.45], ['w:bingung', 'blip', 0.35],
        ['end-0.78', 'rewind', 0.8],
      ],
      vis: {
        type: 'freeze', ...CUT, freezeAt: 0.9, yepAt: 'w:Yep', arrowAt: 'w:itu', wonderAt: 'w:bingung', rewindAt: 'end-0.78',
        files: ['RoPA_final_revisi2_FIX.xlsx', 'DPIA (1) copy.docx', 'consent_scan.pdf', 'data_pelanggan_ALL.csv', 'RoPA_final_revisi3.xlsx'],
        notifs: ['📩 3 permohonan DSR baru', '⚠️ Audit minggu depan', '🔥 Dugaan insiden?!', '📞 Pak Bos memanggil…'],
      },
    },
    {
      id: 's2', min: 5, voDelay: 0.3, tail: 0.4, mus: 'bounce', maxPause: 0.36, voiceRate: '+30%',
      vo: 'Ada orang hev: RoPA lengkap, DPIA beres. Ada orang hevent: RoPA masih di Excel. Aku? Orang not yet.',
      sfx: [
        [0.05, 'glitch', 0.35], ['w:hev', 'pop', 0.55], ['w:lengkap', 'correct', 0.55], ['w:beres', 'correct', 0.55],
        ['w:hevent', 'pop', 0.55], ['w:Excel', 'buzzer', 0.35], ['w:Excel+0.3', 'scratch', 0.3],
        ['w:Aku', 'vineboom', 0.95], ['w:not', 'auraDown', 0.7],
      ],
      vis: {
        type: 'have', ...CUT, haveAt: 'w:hev', h1At: 'w:lengkap', h2At: 'w:beres', haventAt: 'w:hevent', fileAt: 'w:masih', scribAt: 'w:Excel+0.3',
        notAt: 'w:Aku', faceAt: 'w:not',
      },
    },
    {
      id: 's3', min: 2.6, voDelay: 0.7, tail: 0.3, mus: 'muzak', voice: 'id-ID-ArdiNeural', voiceRate: '+4%', voicePitch: '-14Hz',
      vo: 'Kita sudah patuh UU PDP, kan?',
      sfx: [[0.12, 'pop', 0.3], ['w:Kita', 'notif', 0.45], ['w:kan', 'tick', 0.3]],
      vis: { type: 'bos', ...CUT, typingAt: 0.12, msgAt: 'w:Kita', sweatAt: 'w:PDP' },
    },
    {
      id: 's4', min: 3.5, voDelay: 0.35, tail: 1.1, mus: 'muzak', voiceRate: '+22%', maxPause: 0.42,
      vo: 'Sudah dong, Pak. Seratus persen. Astaga, bercanda.',
      sfx: [
        [0.05, 'key', 0.25], [0.15, 'key', 0.22], [0.25, 'key', 0.25], ['w:Sudah', 'pop', 0.5], ['w:Seratus', 'ding', 0.45],
        ['w:Astaga', 'pop', 0.5], ['w:bercanda+0.42', 'vineboom', 1.0], ['w:bercanda+0.62', 'auraDown', 0.7],
      ],
      vis: { type: 'balas', ...CUT, r1At: 'w:Sudah', okAt: 'w:Seratus', r2At: 'w:Astaga', skullAt: 'w:bercanda+0.42', cookedAt: 'w:bercanda+0.62' },
    },
    {
      id: 's5', min: 8, voDelay: 0.4, tail: 0.75, mus: 'phonk', voice: 'id-ID-ArdiNeural', voiceRate: '+26%', voicePitch: '-6Hz', maxPause: 0.28,
      vo: 'Hal yang bisa kamu bilang ke auditor: data pribadi? Maksudnya KTP di grup kantor? RoPA ada kok, di kepala saya. Kenapa bocor? Adalah pokoknya. Jangan ditiru.',
      sfx: [
        [0.05, 'whoosh', 0.4], ['w:Hal', 'hit', 0.45], ['w:Data', 'pop', 0.5], ['w:kantor+0.1', 'boing', 0.3],
        ['w:RoPA', 'pop', 0.5], ['w:kepala+0.1', 'boing', 0.3], ['w:Kenapa', 'pop', 0.5], ['w:pokoknya+0.25', 'vineboom', 0.8],
        ['w:Jangan', 'stamp', 1.0], ['w:Jangan+0.12', 'auraDown', 0.8],
      ],
      vis: {
        type: 'things', ...CUT, titleAt: 'w:Hal', stampAt: 'w:Jangan',
        items: [
          { at: 'w:Data', text: 'Data pribadi? Maksudnya KTP di grup kantor?' },
          { at: 'w:RoPA', text: 'RoPA ada kok. Di kepala saya.' },
          { at: 'w:Kenapa', text: 'Kenapa bocor? *Adalah pokoknya.*' },
        ],
      },
    },
    {
      id: 's6', min: 7, voDelay: 0.45, tail: 0.5, mus: 'tense', voiceRate: '+30%',
      vo: 'Jam tiga pagi: dugaan kebocoran data. Wajib lapor dalam tiga kali dua puluh empat jam. Tenang, di Nexus alurnya siap.',
      sfx: [
        [0.15, 'notif', 0.6], ['w:dugaan', 'alarm', 0.4], ['w:Wajib-0.25', 'whoosh', 0.4], ['w:Wajib', 'clank', 1.0], ['w:Wajib', 'impact', 0.55],
        ['w:tiga#2', 'tick', 0.4], ['w:dua', 'tick', 0.4], ['w:empat', 'tick', 0.4], ['w:jam#2', 'tick', 0.45],
        ['w:Tenang', 'slidedown', 0.6], ['w:Tenang+0.45', 'clank', 0.7], ['w:Nexus-0.1', 'whoosh', 0.4], ['w:siap', 'check', 0.6], ['w:siap+0.1', 'auraUp', 0.7],
      ],
      vis: {
        type: 'borgol', ...CUT, notifAt: 0.15, cuffAt: 'w:Wajib', cdAt: 'w:tiga#2', slideAt: 'w:Tenang', shotAt: 'w:Nexus-0.1', markAt: 'w:alurnya',
        shot: { src: '../assets/app/breach-detail.png', size: [1264, 790], label: 'Privasimu Nexus · Insiden' },
      },
    },
    {
      id: 's7', min: 5, voDelay: 0.25, tail: 0.45, mus: 'funk', voiceRate: '+34%', maxPause: 0.16,
      vo: 'RoPA, DPIA, DSR, consent, insiden, asisten AI. Semua nyambung, di satu tempat.',
      sfx: [
        [0.02, 'glitch', 0.5], ['w:RoPA', 'hit', 0.55], ['w:DPIA', 'hit', 0.55], ['w:DSR', 'hit', 0.55], ['w:consent', 'hit', 0.55],
        ['w:insiden', 'hit', 0.55], ['w:asisten', 'hit', 0.55], ['w:Semua', 'impact', 0.6], ['w:Semua+0.05', 'auraUp', 0.8],
        ['w:RoPA+0.05', 'coin', 0.35], ['w:DPIA+0.05', 'coin', 0.35], ['w:DSR+0.05', 'coin', 0.35], ['w:consent+0.05', 'coin', 0.35],
        ['w:insiden+0.05', 'coin', 0.35], ['w:asisten+0.05', 'coin', 0.35],
      ],
      vis: {
        type: 'poly', ...CUT, titleAt: 0.02, allAt: 'w:Semua',
        cuts: [
          { at: 'w:RoPA', shot: 'ropa-baru', label: 'RoPA' },
          { at: 'w:DPIA', shot: 'dpia-risiko', label: 'DPIA' },
          { at: 'w:DSR', shot: 'dsr-form', label: 'DSR' },
          { at: 'w:consent', shot: 'consent-detail', label: 'CONSENT' },
          { at: 'w:insiden', shot: 'breach-fase', label: 'INSIDEN' },
          { at: 'w:asisten', shot: 'ai-agent-chat', label: 'ASISTEN AI' },
          { at: 'w:Semua', shot: 'dashboard', label: 'SEMUA NYAMBUNG' },
        ],
        fillers: ['ropa-tersimpan', 'dpia-list', 'dsr-detail', 'gap-hasil', 'breach-aksi', 'ai-agent-home', 'dashboard-risiko', 'dpo-academy', 'policy-review', 'children-pro', 'fire-drill-header', 'dashboard-postur'],
      },
    },
    {
      id: 's8', min: 6, voDelay: 0.4, tail: 0.5, mus: 'chic', voiceRate: '+20%',
      vo: 'Kainda syik: lapor insiden tepat waktu, RoPA rapi, dan siap PP tiga puluh tiga sebelum enam belas Januari.',
      sfx: [
        [0.05, 'shimmer', 0.35], ['w:lapor', 'ding', 0.3], ['w:RoPA', 'ding', 0.3], ['w:siap', 'ding', 0.35], ['w:Januari+0.3', 'auraUp', 0.5],
      ],
      vis: {
        type: 'chic', ...CUT, kickerAt: 'w:Kainda',
        lines: [
          { at: 'w:lapor', text: 'lapor insiden tepat waktu.' },
          { at: 'w:RoPA', text: 'RoPA rapi di satu register.' },
          { at: 'w:siap', text: 'siap PP 33 sebelum 16 Januari 2027.' },
        ],
        shot: { src: '../assets/app/dashboard.png', size: [1264, 790] },
      },
    },
    {
      id: 's9', min: 5.5, voDelay: 1.2, tail: 1.6, mus: 'mlg', voiceRate: '+15%',
      vo: 'Privasimu Nexus: biar DPO tetap waras. privasimu dot com.',
      sfx: [
        [0.05, 'whoosh', 0.5], [0.42, 'hitmarker', 0.8], [0.5, 'airhorn', 0.75], [0.62, 'hitmarker', 0.7], [0.8, 'hitmarker', 0.7], [0.55, 'auraUp', 0.8],
        ['w:Privasimu', 'impact', 0.5], ['w:waras', 'hitmarker', 0.6], ['w:privasimu#2-0.1', 'pop', 0.4],
      ],
      vis: {
        type: 'mlg', ...CUT, glassesAt: 0.12, hitAt: [0.42, 0.62, 0.8], logoAt: 'w:Privasimu', tagAt: 'w:Biar', btnAt: 'w:privasimu#2-0.1',
        tag: 'Biar DPO tetap waras.', button: 'privasimu.com', foot: 'support@privasimu.com · 0851 8318 2722', chips: ['Schedule Demo', 'Start Pre Check · gratis'],
      },
    },
  ];

  // Penghitung AURA (HUD lintas scene): [scene, waktu, perubahan]
  const AURA = [
    ['s1', 0.9, -100], ['s2', 'w:not', -500], ['s4', 'w:bercanda+0.62', -1000], ['s5', 'w:Jangan+0.12', -9999],
    ['s6', 'w:siap+0.1', 1000],
    ['s7', 'w:RoPA+0.05', 1000], ['s7', 'w:DPIA+0.05', 1000], ['s7', 'w:DSR+0.05', 1000], ['s7', 'w:consent+0.05', 1000],
    ['s7', 'w:insiden+0.05', 1000], ['s7', 'w:asisten+0.05', 1000], ['s7', 'w:Semua+0.05', 10000],
    ['s8', 'w:lapor', 1000], ['s8', 'w:RoPA', 1000], ['s8', 'w:siap', 1000],
  ];

  const api = { CONFIG, SCENES, AURA };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
