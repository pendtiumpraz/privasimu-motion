// N09 — "Baru ditunjuk jadi PPDP?" (pelatihan & pendampingan). Gaya: ARCADE / RPG QUEST 8-bit.
// Tipe scene kustom (quest, train, party, hud, achieve, title) ada di style.js; SFX ditulis manual di `sfx`.
// Layar produk = screenshot ASLI ../assets/app/*.png (learn, dashboard, ppdp, ai-agent) di dalam monitor piksel.
(function (root) {
  const CONFIG = {
    title: 'N09 · PPDP Baru',
    naskah: 'N09',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+20%',
    beat: 60 / 128,
    tail: 0.45,
    music: { bpm: 128, mode: 'major', root: 55, lead: 'chip', drums: 'chip' },
  };

  // kursor pilihan yang bimbang di S1 (dipakai visual + SFX)
  const S1_MOVES = ['w:mulai+0.3', 'w:dari+0.12', 'w:mana+0.3', 'w:mana+0.62', 'w:mana+0.94', 'w:mana+1.26'];
  const NOTRANS = { enter: 'none', exit: 'none' }; // transisi diganti "pixel dissolve" (style.js)

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.45, tail: 0.55, theme: 'arcade', mus: 'play',
      vo: 'Selamat, Anda baru ditunjuk sebagai Pejabat Pelindungan Data Pribadi. Lalu, mulai dari mana?',
      sfx: [
        ['w:Selamat-0.12', 'coin', 0.9], ['w:Selamat', 'pop', 0.5], ['w:Selamat+0.05', 'shimmer', 0.35],
        ['w:ditunjuk-0.1', 'blip', 0.7], ['w:ditunjuk', 'whoosh', 0.25],
        ['w:Pejabat', 'blip', 0.28], ['w:Pelindungan', 'blip', 0.28], ['w:Data', 'blip', 0.28], ['w:Pribadi', 'blip', 0.28],
        ['w:Lalu-0.2', 'blip', 0.55], ...S1_MOVES.map((m) => [m, 'blip', 0.32]),
        ['w:mana+0.3', 'boing', 0.65],
      ],
      vis: {
        type: 'quest', ...NOTRANS, push: 0.012, shake: ['w:mana+0.3'],
        banner: { text: 'QUEST BARU!', at: 'w:Selamat-0.12' }, confettiAt: 'w:Selamat',
        card: {
          at: 'w:ditunjuk-0.1', label: 'PERAN BARU DIBUKA', tag: 'PPDP',
          title: 'Pejabat Pelindungan Data Pribadi', words: ['w:Pejabat', 'w:Pelindungan', 'w:Data', 'w:Pribadi'],
          status: 'STATUS: <b>BARU DITUNJUK</b> <span>LV 1</span>', statusAt: 'w:Pribadi+0.5',
        },
        dialog: {
          at: 'w:Lalu-0.2', who: 'ANDA', text: 'Lalu, mulai dari mana?', words: ['w:Lalu', 'w:mulai', 'w:dari', 'w:mana'],
          choices: ['Baca UU PDP dari awal', 'Cari tutorial di internet', 'Pura-pura sibuk dulu'], choicesAt: 'w:mulai-0.1',
          moves: S1_MOVES, order: [1, 2, 1, 0, 2, 1],
        },
        q: { at: 'w:mana+0.3' },
      },
    },
    {
      id: 's2', min: 8, voDelay: 0.3, tail: 1.75, theme: 'arcade', mus: 'main',
      vo: 'Tenang. Privasimu menyiapkan pelatihan untuk PPDP dan tim IT, dari dasar UU PDP dan PP tiga puluh tiga sampai praktik sehari-hari.',
      sfx: [
        ['w:Tenang', 'shimmer', 0.55], ['w:Tenang+0.05', 'blip', 0.45], ['w:Tenang+0.21', 'blip', 0.45], ['w:Tenang+0.37', 'blip', 0.5],
        ['w:Privasimu-0.15', 'whoosh', 0.35], ['w:Privasimu+0.3', 'sweep', 0.3],
        ['w:pelatihan', 'pop', 0.5], ['w:PPDP', 'blip', 0.6], ['w:IT', 'blip', 0.6],
        ['w:dasar', 'coin', 0.6], ['w:tiga', 'coin', 0.6], ['w:praktik', 'coin', 0.6],
        ['w:sehari-hari+0.5', 'levelup', 1.0], ['w:sehari-hari+1.05', 'correct', 0.6],
      ],
      vis: {
        type: 'train', ...NOTRANS, push: 0.012, shake: ['w:sehari-hari+0.5'],
        calm: { text: 'Tenang.', hp: 'HP PULIH!', at: 'w:Tenang', out: 'w:Privasimu-0.3' },
        // screenshot ASLI DPO Academy (1440×900); koordinat = pecahan gambar
        screen: {
          img: 'dpo-academy.png', label: 'LEARN', cap: 'DPO ACADEMY', bg: '#edf1f5', at: 'w:Privasimu-0.15', on: 'w:Privasimu+0.3',
          views: [
            { cx: 0.5, cy: 0.5, z: 1 }, { at: 'w:pelatihan', cx: 0.59, cy: 0.3, z: 1.25 },
            { at: 'w:dasar', cx: 0.29, cy: 0.33, z: 1.9 }, { at: 'w:tiga', cx: 0.56, cy: 0.32, z: 1.4 },
          ],
          boxes: [{ x: 0.19, y: 0.18, w: 0.2, h: 0.305, at: 'w:dasar+0.2', until: 'w:tiga' }],
        },
        head: { title: 'PELATIHAN', at: 'w:pelatihan', for: 'UNTUK', forAt: 'w:untuk' },
        party: [{ spr: 'hero', name: 'PPDP', at: 'w:PPDP' }, { spr: 'it', name: 'TIM IT', at: 'w:IT' }],
        modsAt: 'w:pelatihan+0.3',
        mods: [
          { text: 'Dasar UU PDP', xp: 40, at: 'w:dasar' },
          { text: 'PP 33/2026', xp: 30, at: 'w:tiga' },
          { text: 'Praktik sehari-hari', xp: 30, at: 'w:praktik' },
        ],
        levelAt: 'w:sehari-hari+0.5', level: { sub: 'PPDP & TIM IT  LV 2' },
        certAt: 'w:sehari-hari+1.05', cert: { kicker: 'DPO ACADEMY', title: 'SERTIFIKAT', sub: 'Pelatihan PPDP & Tim IT' },
      },
    },
    {
      id: 's3', min: 7, voDelay: 0.3, tail: 0.5, theme: 'arcade', mus: 'main',
      vo: 'Konsultan kami yang bersertifikasi internasional siap mendampingi saat Anda menyusun RoPA, DPIA, dan kebijakan pertama.',
      sfx: [
        [0.12, 'tada', 0.45], [0.2, 'whoosh', 0.3],
        ['w:Konsultan-0.05', 'whoosh', 0.35], ['w:Konsultan+0.2', 'pop', 0.5],
        ['w:bersertifikasi', 'blip', 0.6], ['w:bersertifikasi+0.2', 'blip', 0.6], ['w:bersertifikasi+0.4', 'blip', 0.65],
        ['w:mendampingi', 'coin', 0.7], ['w:mendampingi+0.1', 'pop', 0.5],
        ['w:RoPA', 'correct', 0.5], ['w:DPIA', 'correct', 0.5], ['w:kebijakan', 'correct', 0.55],
      ],
      vis: {
        type: 'party', ...NOTRANS, push: 0.012,
        banner: { text: 'PARTY MEMBER JOINED!', at: 0.12 },
        card: {
          at: 'w:Konsultan-0.05', cls: 'KONSULTAN', name: 'Konsultan Privasimu', stat: 'SABAR', statAt: 'w:kami',
          certLabel: 'SERTIFIKASI INTERNASIONAL', certLabelAt: 'w:bersertifikasi-0.1',
          certs: [{ text: 'CIPP/E', at: 'w:bersertifikasi' }, { text: 'CIPM', at: 'w:bersertifikasi+0.2' }, { text: 'FIP', at: 'w:bersertifikasi+0.4' }],
        },
        stageAt: 'w:siap-0.15', joinAt: 'w:mendampingi',
        quests: {
          title: 'MISI BERSAMA', at: 'w:menyusun-0.25',
          items: [{ text: 'Menyusun RoPA', at: 'w:RoPA' }, { text: 'Menyusun DPIA', at: 'w:DPIA' }, { text: 'Kebijakan pertama', at: 'w:kebijakan' }],
        },
      },
    },
    {
      id: 's4', min: 6, voDelay: 0.3, tail: 0.55, theme: 'arcade', mus: 'main',
      vo: 'Sehari-hari, Anda bekerja di Privasimu Nexus: dasbor kepatuhan, antrean tugas, dan asisten AI Priva.',
      sfx: [
        ['w:Sehari-hari-0.1', 'whoosh', 0.35], ['w:Anda', 'pop', 0.4],
        ['w:Privasimu', 'sweep', 0.35], ['w:Privasimu+0.05', 'blip', 0.5], ['w:Nexus', 'blip', 0.4],
        ['w:dasbor', 'coin', 0.55], ['w:dasbor', 'glitch', 0.16], ['w:kepatuhan', 'blip', 0.35],
        ['w:antrean', 'coin', 0.55], ['w:antrean', 'glitch', 0.16], ['w:tugas', 'blip', 0.35],
        ['w:asisten', 'coin', 0.55], ['w:asisten', 'glitch', 0.16], ['w:AI+0.05', 'tick', 0.7],
        ['w:Priva#2', 'glitch', 0.14], ['w:Priva#2', 'pop', 0.55], ['w:Priva#2+0.05', 'shimmer', 0.3],
      ],
      vis: {
        type: 'hud', ...NOTRANS, push: 0.012,
        monitor: { at: 'w:Sehari-hari-0.1', on: 'w:Privasimu', label: 'NEXUS' },
        inv: { title: 'INVENTORI HARIAN', at: 'w:Anda' },
        // layar dalam game = screenshot ASLI (assets/app); cx/cy/z & kotak sorot dalam pecahan gambar (0..1)
        shots: [
          {
            img: 'dashboard.png', cap: 'PRIVASIMU NEXUS', at: 'w:Privasimu',
            views: [{ cx: 0.5, cy: 0.5, z: 1 }, { at: 'w:Nexus', cx: 0.3, cy: 0.3, z: 1.2 }],
            boxes: [{ x: 0.052, y: 0.008, w: 0.104, h: 0.062, at: 'w:Nexus' }],
          },
          {
            img: 'dashboard-postur.png', cap: 'DASBOR KEPATUHAN', bg: '#f0f4f8', at: 'w:dasbor',
            views: [{ cx: 0.5, cy: 0.5, z: 1 }, { at: 'w:kepatuhan', cx: 0.66, cy: 0.5, z: 1.18 }],
            boxes: [{ x: 0.668, y: 0.172, w: 0.306, h: 0.814, at: 'w:kepatuhan' }],
          },
          {
            img: 'ropa-list-baru.png', cap: 'ANTREAN TUGAS', bg: '#edf1f5', at: 'w:antrean',
            views: [{ cx: 0.59, cy: 0.3, z: 1.45 }, { at: 'w:tugas', cx: 0.45, cy: 0.22, z: 1.65 }],
            boxes: [{ x: 0.2, y: 0.125, w: 0.375, h: 0.053, at: 'w:tugas' }],
          },
          {
            img: 'ai-agent-home.png', cap: 'ASISTEN AI PRIVA', bg: '#eef1f5', at: 'w:asisten',
            views: [{ cx: 0.59, cy: 0.4, z: 1.6 }],
            cursor: { at: 'w:AI+0.05', x: 0.69, y: 0.5 },
            boxes: [{ x: 0.592, y: 0.478, w: 0.196, h: 0.05, at: 'w:AI+0.05' }],
          },
          {
            img: 'ai-agent-chat.png', cap: 'ASISTEN AI PRIVA', bg: '#f0f3f7', at: 'w:Priva#2',
            views: [{ cx: 0.53, cy: 0.45, z: 1.35 }],
            boxes: [{ x: 0.25, y: 0.385, w: 0.554, h: 0.225, at: 'w:Priva#2+0.3' }],
          },
        ],
        slots: [
          { icon: 'chart', text: 'Dasbor kepatuhan', at: 'w:dasbor' },
          { icon: 'list', text: 'Antrean tugas', at: 'w:antrean' },
          { icon: 'bot', text: 'Asisten AI Priva', at: 'w:asisten' },
        ],
        join: { text: 'PRIVA +1 PARTY', at: 'w:Priva#2' },
      },
    },
    {
      id: 's5', min: 4, voDelay: 0.3, tail: 0.65, theme: 'arcade', mus: 'play',
      vo: 'Setiap tindakan, oleh manusia maupun AI, tercatat di log audit.',
      sfx: [
        [0.2, 'blip', 0.45], ['w:tindakan', 'blip', 0.5], ['w:manusia', 'blip', 0.5], ['w:AI', 'blip', 0.5], ['w:AI+0.35', 'blip', 0.5],
        ['w:tercatat', 'tick', 0.5], ['w:tercatat+0.09', 'tick', 0.5], ['w:tercatat+0.18', 'tick', 0.5], ['w:tercatat+0.27', 'tick', 0.55],
        ['w:log-0.1', 'correct', 0.6], ['w:log', 'shimmer', 0.35],
      ],
      vis: {
        type: 'achieve', ...NOTRANS, push: 0.012,
        log: {
          title: 'LOG AUDIT', sub: 'MANUSIA & AI', at: 0.15, recAt: 'w:tercatat',
          rows: [
            { spr: 'hero', who: 'PPDP', text: 'menyetujui RoPA-014', time: '09:02', at: 'w:tindakan' },
            { spr: 'it', who: 'Tim IT', text: 'memperbarui data vendor', time: '09:05', at: 'w:manusia' },
            { spr: 'bot', who: 'Priva (AI)', text: 'menjawab pertanyaan PPDP', time: '09:06', at: 'w:AI', ai: true },
            { spr: 'bot', who: 'AI', text: 'menyarankan isian RoPA', time: '09:07', at: 'w:AI+0.35', ai: true },
          ],
        },
        toast: { kicker: 'ACHIEVEMENT UNLOCKED', title: 'Log audit lengkap', sub: 'manusia & AI tercatat', at: 'w:log-0.1' },
      },
    },
    {
      id: 's6', min: 5, voDelay: 0.35, tail: 0.85, theme: 'arcade', mus: 'outro',
      vo: 'Privasimu. Dari hari pertama, Anda tidak sendirian. privasimu dot com.',
      sfx: [
        ['w:Privasimu-0.1', 'shimmer', 0.5], ['w:Privasimu', 'coin', 0.6],
        ['w:Anda', 'blip', 0.4], ['w:Anda+0.2', 'blip', 0.4], ['w:sendirian+0.55', 'coin', 0.55], ['w:sendirian+0.6', 'shimmer', 0.3],
        ['w:privasimu#2', 'coin', 0.9],
      ],
      vis: {
        type: 'title', ...NOTRANS, nexus: false, push: 0.012,
        logoAt: 'w:Privasimu-0.1',
        lines: [
          { text: 'Dari hari pertama,', words: ['w:Dari', 'w:hari', 'w:pertama'] },
          { text: 'Anda *tidak* *sendirian.*', words: ['w:Anda', 'w:tidak', 'w:sendirian'] },
        ],
        walkAt: 'w:Anda-0.2', jumpAt: 'w:sendirian+0.55',
        press: { text: 'PRESS START', at: 'w:privasimu#2-0.3' },
        button: { text: 'privasimu.com', at: 'w:privasimu#2' },
        foot: { a: '<b>Start Pre Check</b> · pre-assessment gratis', b: 'support@privasimu.com · 0851 8318 2722', at: 'w:dot' },
      },
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
