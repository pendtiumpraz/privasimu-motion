// N10 — "Satu grup, satu standar" (holding & anak usaha: konsultasi + platform enterprise).
// Gaya "blueprint arsitektural": tipe scene kustom bp* di style.js. Tampilan produk = screenshot ASLI (assets/app).
// Nama anak usaha = sektor generik; skor & angka = ilustrasi. SFX ditulis manual (tipe kustom tidak punya SFX otomatis).
(function (root) {
  const CONFIG = {
    title: 'N10 · Satu Grup Satu Standar',
    naskah: 'N10',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    beat: 60 / 108,
    tail: 0.45,
    music: { bpm: 108, mode: 'major', root: 50, lead: 'keys', drums: 'light' },
  };

  // 12 anak usaha ilustratif: pola arsir + warna berbeda (s1), dipakai ulang di s2–s4 agar konsisten.
  const SUBS = [
    { code: 'AU-01', name: 'Energi', score: 82, pat: 'd45', tint: '#7DD3FC' },
    { code: 'AU-02', name: 'Logistik', score: 64, pat: 'dots', tint: '#FCD34D' },
    { code: 'AU-03', name: 'Keuangan', score: 47, pat: 'cross', tint: '#FDA4AF' },
    { code: 'AU-04', name: 'Ritel', score: 71, pat: 'hor', tint: '#86EFAC' },
    { code: 'AU-05', name: 'Properti', score: 58, pat: 'brick', tint: '#C4B5FD' },
    { code: 'AU-06', name: 'Kesehatan', score: 86, pat: 'ver', tint: '#FDBA74' },
    { code: 'AU-07', name: 'Manufaktur', score: 69, pat: 'd135', tint: '#5EEAD4' },
    { code: 'AU-08', name: 'Telko', score: 55, pat: 'grid', tint: '#F9A8D4' },
    { code: 'AU-09', name: 'Agro', score: 73, pat: 'iso', tint: '#BEF264' },
    { code: 'AU-10', name: 'Tambang', score: 61, pat: 'zig', tint: '#93C5FD' },
    { code: 'AU-11', name: 'Media', score: 77, pat: 'ring', tint: '#FDE68A' },
    { code: 'AU-12', name: 'Asuransi', score: 73, pat: 'isoL', tint: '#A5B4FC' },
  ];

  const SCENES = [
    {
      id: 's1', min: 6, voDelay: 0.6, tail: 0.35, theme: 'blueprint', mus: 'calm',
      vo: 'Satu holding, belasan anak usaha, masing-masing punya kebijakan dan cara sendiri mengelola data pribadi.',
      sfx: [
        [0.08, 'paper', 0.7], [0.46, 'paper', 0.55], ['w:holding', 'sweep', 0.2],
        ['w:belasan', 'tick', 0.4], ['w:anak', 'tick', 0.35], ['w:usaha', 'tick', 0.35], ['w:usaha+0.3', 'tick', 0.3],
        ['w:masing-masing', 'shimmer', 0.22], ['w:kebijakan', 'pop', 0.28], ['w:dan', 'pop', 0.24],
        ['w:cara', 'paper', 0.3], ['end-0.55', 'whoosh', 0.28],
      ],
      vis: {
        type: 'bpGroup', enter: 'none', exit: 'none', push: 0,
        title: { no: '01', text: 'PETA GRUP', sub: 'Holding & anak usaha · denah ilustrasi' },
        titleAt: 0.78, holdingAt: 'w:holding', subsAt: 'w:belasan', hatchAt: 'w:masing-masing', calloutAt: 'w:kebijakan', legendAt: 'w:cara',
        holdingLabel: 'INDUK · HOLDING', dim: '1 INDUK · 12 ANAK USAHA',
        docs: ['KEBIJAKAN_2019.pdf', 'SOP_privasi_v7.docx', 'Pedoman di wiki internal', 'Belum ada kebijakan'],
        legend: { title: 'CARA KELOLA DATA PRIBADI', items: ['Spreadsheet', 'Dokumen lepas', 'Formulir kertas', 'Aplikasi sendiri', 'Email & chat', 'Belum ada'] },
      },
    },
    {
      id: 's2', min: 7, voDelay: 0.35, theme: 'blueprint', mus: 'main',
      vo: 'Konsultan Privasimu membantu menyelaraskan kebijakan lintas perusahaan, lalu menilai kesiapan tiap anak usaha lewat asesmen holding.',
      sfx: [
        [0.25, 'paper', 0.35], ['w:menyelaraskan', 'sweep', 0.3], ['w:kebijakan', 'suck', 0.3], ['w:kebijakan+0.35', 'paper', 0.45],
        ['w:perusahaan', 'stamp', 0.8], ['w:perusahaan+0.5', 'tick', 0.3],
        ['w:lalu', 'whoosh', 0.22], ['w:menilai', 'tick', 0.35], ['w:kesiapan', 'tick', 0.3], ['w:tiap', 'tick', 0.3], ['w:usaha', 'tick', 0.3],
        ['w:asesmen', 'ding', 0.32], ['end-0.55', 'whoosh', 0.26],
      ],
      vis: {
        type: 'bpHarmoni', enter: 'none', exit: 'none', push: 0, dolly: 0.032,
        title: { no: '02', text: 'HARMONISASI & ASESMEN', sub: 'Konsultan Privasimu · lintas perusahaan' },
        docs: ['.pdf', '.docx', 'kertas', '.xlsx', 'wiki', 'draf'],
        alignAt: 'w:menyelaraskan', mergeAt: 'w:kebijakan', stampAt: 'w:perusahaan', shiftAt: 'w:lalu', chartAt: 'w:menilai', avgAt: 'w:asesmen',
        shot: { src: '../assets/app/policy-review.png', iw: 1440, ih: 900 },
        stamp: 'STANDAR GRUP', stampSub: 'KEBIJAKAN DISELARASKAN',
        note: { title: 'HARMONISASI', sub: 'kodifikasi · unifikasi · simplifikasi' },
        chart: { title: 'ASESMEN HOLDING', sub: 'Tampak depan · tingkat kesiapan tiap anak usaha', avg: 'RATA-RATA GRUP' },
      },
    },
    {
      id: 's3', min: 4.5, voDelay: 0.35, theme: 'blueprint', mus: 'main',
      vo: 'Hasilnya terpantau di satu dasbor holding, dengan akses yang diatur per divisi.',
      sfx: [
        [0.3, 'paper', 0.4], ['w:terpantau', 'paper', 0.3], ['w:dasbor', 'tick', 0.35], ['w:dasbor+0.2', 'tick', 0.3], ['w:holding', 'tick', 0.3],
        ['w:akses', 'tick', 0.3], ['w:diatur', 'key', 0.6], ['w:diatur+0.1', 'key', 0.5], ['w:diatur+0.2', 'key', 0.5], ['w:diatur+0.3', 'key', 0.45],
        ['w:divisi', 'check', 0.4], ['end-0.55', 'whoosh', 0.26],
      ],
      vis: {
        type: 'bpDash', enter: 'none', exit: 'none', push: 0, dolly: 0.045,
        title: { no: '03', text: 'DASBOR HOLDING', sub: 'Tampilan asli Privasimu · satu dasbor untuk grup' },
        header: { src: '../assets/app/holding-header.png', iw: 1240, ih: 200 },
        postur: { src: '../assets/app/dashboard-postur.png', iw: 1002, ih: 480 },
        // posisi tab di holding-header.png (piksel gambar asli)
        tabs: [{ text: 'ASESMEN', x: 214 }, { text: 'MATRIX', x: 460 }, { text: 'TREE', x: 527 }], tabY: 163,
        scoreNote: 'POSTUR KEPATUHAN', scoreAt: [822, 205],
        rooms: [
          { name: 'LEGAL', mods: 'Semua modul' },
          { name: 'TI', mods: 'RoPA · Insiden' },
          { name: 'SDM', mods: 'RoPA · DSR' },
          { name: 'KEUANGAN', mods: 'Pihak ketiga' },
        ],
        planTitle: 'AKSES MODUL PER DIVISI', planNote: 'diatur admin tenant',
        printAt: 0.3, tabsAt: 'w:satu', planAt: 'w:dengan', lockAt: 'w:diatur', divAt: 'w:divisi',
      },
    },
    {
      id: 's4', min: 6.5, voDelay: 0.35, theme: 'blueprint', mus: 'main',
      vo: 'Pilih SaaS, on-premise, atau lisensi perpetual, dengan data tiap anak usaha tetap terpisah dengan aman.',
      sfx: [
        [0.2, 'tick', 0.3], ['w:SaaS', 'pop', 0.3], ['w:on-premise', 'pop', 0.3], ['w:perpetual', 'pop', 0.3],
        ['w:dengan', 'sweep', 0.25], ['w:data', 'tick', 0.3], ['w:anak', 'tick', 0.3], ['w:terpisah', 'slam', 0.35],
        ['w:aman', 'key', 0.55], ['w:aman+0.08', 'key', 0.5], ['w:aman+0.16', 'key', 0.5], ['w:aman+0.24', 'key', 0.45], ['w:aman+0.4', 'check', 0.42],
        ['end-0.55', 'whoosh', 0.26],
      ],
      vis: {
        type: 'bpLisensi', enter: 'none', exit: 'none', push: 0,
        title: { no: '04', text: 'LISENSI & SILO DATA', sub: 'Pilihan penerapan · data terisolasi per entitas' },
        options: [
          { key: 'A', name: 'SaaS', sub: 'Dikelola di cloud', at: 'w:SaaS' },
          { key: 'B', name: 'On-premise', sub: 'Di infrastruktur sendiri', at: 'w:on-premise' },
          { key: 'C', name: 'Perpetual', sub: 'Lisensi permanen', at: 'w:perpetual' },
        ],
        shiftAt: 'w:dengan', siloAt: 'w:data', wallAt: 'w:terpisah', lockAt: 'w:aman',
        silo: { title: 'SILO DATA PER ANAK USAHA', sub: 'terisolasi per entitas', dim: 'DATA TIAP ANAK USAHA · TERPISAH & TERKUNCI' },
      },
    },
    {
      id: 's5', min: 6, voDelay: 0.35, tail: 0.85, theme: 'blueprint', mus: 'outro',
      vo: 'Privasimu. Satu grup, satu standar kepatuhan. Jadwalkan konsultasi gratis di privasimu dot com.',
      sfx: [
        [0.1, 'tick', 0.3], ['w:Privasimu', 'shimmer', 0.3], ['w:standar', 'tick', 0.35], ['w:kepatuhan+0.4', 'tick', 0.25],
        ['w:Jadwalkan', 'tick', 0.3], ['w:konsultasi', 'ding', 0.45],
      ],
      vis: {
        type: 'bpCta', enter: 'none', exit: 'none', push: 0, nexus: false,
        logoAt: 'w:Privasimu', dimLabel: 'KONSULTASI · PLATFORM ENTERPRISE',
        tag: [{ w: 'Satu', at: 'w:Satu' }, { w: 'grup,', at: 'w:grup' }, { w: 'satu', at: 'w:satu#2', hl: 1 }, { w: 'standar', at: 'w:standar', hl: 1 }, { w: 'kepatuhan.', at: 'w:kepatuhan' }],
        hlAt: 'w:standar', btnAt: 'w:Jadwalkan', fillAt: 'w:konsultasi',
        button: 'Konsultasi gratis · privasimu.com',
        foot: 'support@privasimu.com  ·  0851 8318 2722',
        block: [['PROYEK', 'Kepatuhan PDP grup'], ['LEMBAR', 'N10 · 05/05'], ['SKALA', '1 grup : 1 standar']], blockAt: 'w:kepatuhan+0.3',
      },
    },
  ];

  const api = { CONFIG, SCENES, SUBS };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
