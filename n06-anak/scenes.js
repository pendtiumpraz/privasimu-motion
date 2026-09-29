// N06 — "Pengguna termuda Anda" (data anak & inklusif). Gaya: paper-craft cut-out + krayon (style.js / style.css).
// Layar produk = screenshot ASLI (assets/app/*.png) ditempel sebagai foto scrapbook; formulir, lini waktu tumbuh,
// dan benang ke sistem adalah ilustrasi konsep dari kertas. Tipe scene kustom -> SFX ditulis manual.
(function (root) {
  const CONFIG = {
    title: 'N06 · Pengguna Termuda Anda',
    naskah: 'N06',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+8%',
    beat: 60 / 100,
    tail: 0.45,
    music: { bpm: 100, mode: 'major', root: 53, lead: 'bell', drums: 'light' },
  };
  const PAPERFX = { enter: 'none', exit: 'none', push: 0 }; // transisi & kamera diatur style.js (kertas sobek, stop-motion)
  const WIPE = ['end-0.6', 'paper', 0.75]; // suara kertas sobek menutup scene

  const SCENES = [
    {
      id: 's1', min: 4, voDelay: 0.55, theme: 'p-s1', mus: 'play',
      vo: 'Aplikasi atau layanan Anda punya pengguna anak-anak?',
      sfx: [[0.06, 'paper', 0.8], [0.34, 'whoosh', 0.22], [0.46, 'pop', 0.4], ['w:layanan', 'blip', 0.55], ['w:punya', 'pop', 0.55], ['w:punya+0.04', 'boing', 0.25],
        ['w:anak-0.04', 'stamp', 0.35], ['w:anak', 'paper', 0.4], ['w:anak+0.3', 'pop', 0.4], WIPE],
      vis: {
        type: 'pcKid', ...PAPERFX,
        lines: ['Aplikasi atau layanan', 'Anda punya pengguna'], strip: 'anak-anak?', stripAt: 'w:anak',
        app: 'Belajar Seru', popText: 'Izinkan aplikasi memakai data kamu?', btnText: 'Setuju', laterText: 'baca dulu',
        popAt: 'w:layanan', tapAt: 'w:punya', ageAt: 'w:anak-0.04', age: '7 th',
      },
    },
    {
      id: 's2', min: 7, voDelay: 0.35, theme: 'p-s2', mus: 'calm',
      vo: 'Pemrosesan data anak wajib mendapat persetujuan orang tua atau wali, dan PP tiga puluh tiga mengatur rinciannya.',
      sfx: [[0.05, 'paper', 0.7], [0.47, 'tick', 0.35], [0.57, 'tick', 0.3], ['w:wajib', 'pop', 0.45], ['w:mendapat', 'paper', 0.3], ['w:persetujuan', 'check', 0.7],
        ['w:orang', 'paper', 0.35], ['w:wali', 'ding', 0.35], ['w:PP', 'stamp', 0.55], ['w:mengatur', 'tick', 0.35], WIPE],
      vis: {
        type: 'pcForm', ...PAPERFX,
        kicker: 'FORMULIR PERSETUJUAN', title: 'Pemrosesan Data Anak',
        rows: [{ label: 'Nama anak', value: 'Nara, 7 tahun', at: 'w:Pemrosesan+0.15' }, { label: 'Data yang diproses', value: 'nama, usia, progres belajar', at: 'w:data' }],
        checkText: 'Saya menyetujui pemrosesan data anak saya.', checkAt: 'w:persetujuan',
        kidName: 'Nara', kidLabel: 'Tanda tangan anak', kidAt: 'w:mendapat',
        guardLabel: 'Tanda tangan orang tua / wali', sigAt: 'w:orang', sigEnd: 'w:wali+0.45', circleAt: 'w:wali',
        note: 'wajib!', noteAt: 'w:wajib',
        tag: { title: 'PP 33/2026', sub: 'Pasal 38 · data anak', at: 'w:PP', lineAt: 'w:mengatur' },
      },
    },
    {
      id: 's3', min: 7, voDelay: 0.35, theme: 'p-s3', mus: 'play',
      vo: 'Children Pro di Privasimu Nexus mencatat persetujuan wali beserta buktinya, dan mengelola peralihan saat anak beranjak dewasa.',
      sfx: [['w:Children-0.05', 'shimmer', 0.4], ['w:Children', 'paper', 0.35], [0.8, 'paper', 0.55], ['w:wali', 'pop', 0.4], ['w:buktinya', 'pop', 0.4],
        ['w:dan', 'paper', 0.45], ['w:peralihan', 'flip', 0.6], ['w:peralihan', 'pop', 0.3], ['w:anak', 'flip', 0.6], ['w:beranjak+0.1', 'flip', 0.6], ['w:dewasa', 'correct', 0.5], WIPE],
      vis: {
        type: 'pcGrow', ...PAPERFX,
        title: 'Children Pro', titleAt: 'w:Children-0.05', sub: 'di Privasimu Nexus', subAt: 'w:di',
        shot: '../assets/app/children-pro.png', iw: 1440, ih: 900, photoAt: 0.8,
        pan: {
          h: [{ at: 0, z: 1.0, fx: 0.5, fy: 0.3 }, { at: 'w:mencatat', z: 1.16, fx: 0.42, fy: 0.25 }, { at: 'w:buktinya', z: 1.2, fx: 0.44, fy: 0.25 }, { at: 'w:dan', z: 1.21, fx: 0.45, fy: 0.25 }, { at: 'w:peralihan', z: 1.28, fx: 0.7, fy: 0.3 }, { at: 'end-0.1', z: 1.32, fx: 0.72, fy: 0.31 }],
          v: [{ at: 0, z: 1.45, fx: 0.5, fy: 0.28 }, { at: 'w:mencatat', z: 1.68, fx: 0.4, fy: 0.24 }, { at: 'w:buktinya', z: 1.72, fx: 0.43, fy: 0.24 }, { at: 'w:dan', z: 1.72, fx: 0.44, fy: 0.24 }, { at: 'w:peralihan', z: 1.74, fx: 0.74, fy: 0.3 }, { at: 'end-0.1', z: 1.76, fx: 0.76, fy: 0.31 }],
        },
        marks: [
          { at: 'w:wali', off: 'w:dan-0.2', fx: 0.342, fy: 0.227, fw: 0.092, fh: 0.036, note: 'persetujuan wali', n: { h: [-40, -44], v: [110, -44] }, nr: -3 },
          { at: 'w:buktinya', off: 'w:dan-0.2', fx: 0.429, fy: 0.227, fw: 0.085, fh: 0.03, kind: 'under', note: '+ bukti verifikasi', n: { h: [90, 50], v: [60, 50] }, nr: 3, noteBg: '#F7C9D4' },
          { at: 'w:peralihan', fx: 0.776, fy: 0.329, fw: 0.062, fh: 0.034, color: '#2F55B0', note: 'peralihan saat genap 18', n: { h: [-150, -52], v: [-170, -52] }, nr: -2, noteBg: '#BFD9F2' },
        ],
        timelineAt: 'w:dan', ages: ['7 th', '12 th', '17 th', 'Genap 18'], years: ['2027', '2032', '2037', '2038'], calLabel: 'TAHUN',
        hops: ['w:peralihan', 'w:anak', 'w:beranjak+0.1'], adultAt: 'w:dewasa',
      },
    },
    {
      id: 's4', min: 5, voDelay: 0.35, theme: 'p-s4', mus: 'calm',
      vo: 'Ada juga Inclusive Privacy: persetujuan yang aksesibel bagi penyandang disabilitas.',
      sfx: [[0.2, 'paper', 0.6], ['w:Inclusive', 'pop', 0.5], ['w:persetujuan', 'blip', 0.45], ['w:aksesibel', 'pop', 0.45], ['w:penyandang', 'pop', 0.45], ['w:disabilitas', 'pop', 0.5], WIPE],
      vis: {
        type: 'pcAccess', ...PAPERFX,
        title: 'Inclusive Privacy', titleAt: 'w:Inclusive', sub: 'persetujuan yang aksesibel', subAt: 'w:Privacy+0.35',
        shot: '../assets/app/inclusive-privacy.png', iw: 1440, ih: 900, photoAt: 0.2,
        pan: {
          h: [{ at: 0, z: 1.0, fx: 0.5, fy: 0.4 }, { at: 'w:persetujuan', z: 1.2, fx: 0.42, fy: 0.24 }, { at: 'w:penyandang', z: 1.26, fx: 0.42, fy: 0.28 }, { at: 'end-0.1', z: 1.3, fx: 0.43, fy: 0.29 }],
          v: [{ at: 0, z: 1.6, fx: 0.42, fy: 0.26 }, { at: 'w:persetujuan', z: 1.85, fx: 0.36, fy: 0.2 }, { at: 'w:penyandang', z: 1.95, fx: 0.36, fy: 0.26 }, { at: 'end-0.1', z: 2.0, fx: 0.37, fy: 0.27 }],
        },
        marks: [
          { at: 'w:persetujuan', fx: 0.331, fy: 0.113, fw: 0.272, fh: 0.016, kind: 'under', color: '#6E4FB0' },
          { at: 'w:aksesibel', fx: 0.335, fy: 0.227, fw: 0.08, fh: 0.036, color: '#DD5B3F' },
          { at: 'w:penyandang', fx: 0.332, fy: 0.278, fw: 0.082, fh: 0.026, kind: 'under', color: '#DD5B3F' },
        ],
        chips: [{ icon: '🔊', text: 'Audio', at: 'w:persetujuan' }, { icon: 'aa', text: 'Teks besar', at: 'w:aksesibel' }, { icon: 'contrast', text: 'Kontras tinggi', at: 'w:penyandang' }],
        wheelAt: 'w:disabilitas',
      },
    },
    {
      id: 's5', min: 6, voDelay: 0.35, theme: 'p-s5', mus: 'play',
      vo: 'Persetujuan bisa ditarik kapan saja, dan penarikannya tersinkron ke sistem Anda lewat API.',
      sfx: [[0.08, 'pop', 0.4], [0.3, 'paper', 0.5], [0.55, 'tick', 0.3], [0.67, 'tick', 0.3], [0.79, 'tick', 0.3], ['w:ditarik', 'pop', 0.6], ['w:ditarik+0.1', 'tick', 0.45],
        ['w:kapan', 'pop', 0.35], ['w:penarikannya', 'sweep', 0.45], ['w:tersinkron+0.12', 'check', 0.55], ['w:tersinkron+0.3', 'check', 0.5], ['w:tersinkron+0.48', 'check', 0.5],
        ['w:API', 'ding', 0.5], WIPE],
      vis: {
        type: 'pcThread', ...PAPERFX,
        shot: '../assets/app/consent-detail.png', iw: 1624, ih: 1014, photoAt: 0.3,
        pan: {
          h: [{ at: 0, z: 1.58, fx: 0.455, fy: 0.87 }, { at: 'w:kapan', z: 1.62, fx: 0.47, fy: 0.87 }, { at: 'end-0.1', z: 1.66, fx: 0.48, fy: 0.87 }],
          v: [{ at: 0, z: 2.2, fx: 0.46, fy: 0.866 }, { at: 'w:kapan', z: 2.3, fx: 0.48, fy: 0.866 }, { at: 'end-0.1', z: 2.36, fx: 0.49, fy: 0.866 }],
        },
        marks: [{ at: 'w:kapan', fx: 0.5105, fy: 0.855, fw: 0.052, fh: 0.024, note: 'kapan saja!', n: { h: [170, 118], v: [150, 112] }, nr: -4 }],
        button: 'Tarik persetujuan', buttonDone: 'Ditarik ✓', pressAt: 'w:ditarik',
        systems: [{ icon: '📱', name: 'Aplikasi' }, { icon: '📊', name: 'Analitik' }, { icon: '✉️', name: 'Pemasaran' }], syncText: 'tersinkron',
        threadAt: 'w:penarikannya', syncAt: 'w:tersinkron', api: 'API', apiSub: '& webhook', apiAt: 'w:API',
      },
    },
    {
      id: 's6', min: 5, voDelay: 0.35, theme: 'p-s6', mus: 'outro',
      vo: 'Privasimu Nexus. Lindungi pengguna termuda Anda. privasimu dot com.',
      sfx: [[0.04, 'paper', 0.6], [0.3, 'shimmer', 0.5], ['w:Nexus', 'pop', 0.4], ['w:Lindungi', 'shimmer', 0.3], ['w:Anda+0.3', 'pop', 0.4], ['w:privasimu#2', 'ding', 0.6], ['w:com', 'pop', 0.45]],
      vis: {
        type: 'pcCta', ...PAPERFX, nexus: true,
        logoAt: 'w:Privasimu', nexusAt: 'w:Nexus',
        tagline: { h: ['Lindungi pengguna termuda Anda.'], v: ['Lindungi pengguna', 'termuda Anda.'] },
        underAt: 'w:termuda+0.25', heartAt: 'w:Anda+0.3',
        button: 'privasimu.com', btnAt: 'w:privasimu#2', pressAt: 'w:com',
        ctas: [{ text: 'Schedule Demo' }, { text: 'Start Pre Check', sub: 'pre-assessment gratis' }],
        foot: ['support@privasimu.com', '0851 8318 2722'],
        decals: [
          { e: '🧒', size: 150, at: 'w:Lindungi', h: [250, 700], v: [140, 1330], rot: -8 },
          { e: '⭐', size: 104, at: 'w:pengguna', h: [1646, 160], v: [985, 262], rot: 12 },
          { e: '🎈', size: 140, at: 'w:termuda', h: [1706, 660], v: [955, 960], float: true },
        ],
      },
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
