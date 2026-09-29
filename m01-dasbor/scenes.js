// M01 — Dasbor Kepatuhan & Postur Privasi. Seri "Nexus Explained" (lib/seri-modul.js), rancangan: rancangan/…xlsx (M01).
// Hook (logika dipatahkan): "Laporan kepatuhan terbaik bukan yang paling tebal… tapi yang bisa dipahami dalam 10 detik."
(function (root) {
  const CONFIG = {
    title: 'M01 · Dasbor Kepatuhan & Postur Privasi',
    naskah: 'M01',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+8%',
    maxPause: 0.35,
    beat: 60 / 100 / 2,
    tail: 0.5,
    music: { bpm: 100, mode: 'major', root: 55, lead: 'keys', drums: 'light', clock: true, sonic: true },
    mix: { duckTo: 0.38 },
  };
  const KONTAK = 'support@privasimu.com · 0851 8318 2722';

  const SCENES = [
    {
      id: 's1', min: 4.5, voDelay: 1.3, tail: 0.7, mus: 'hook',
      vo: 'Laporan kepatuhan terbaik, bukan yang paling tebal.',
      // lembar ke-i mendarat di 0,44 + i × 0,075 dtk (lihat style.js)
      sfx: [[0.12, 'paper', 0.45], [0.44, 'slam', 0.3], [0.59, 'slam', 0.32], [0.74, 'slam', 0.34], [0.89, 'slam', 0.34], [1.04, 'slam', 0.36], [1.19, 'slam', 0.36], [1.34, 'slam', 0.38], [1.42, 'impact', 0.5],
        ['w:bukan', 'scratch', 0.7], ['w:tebal', 'stamp', 0.55]],
      vis: { type: 'm01_tumpukan', lineAt: 'w:Laporan', line2At: 'w:bukan', strikeAt: 'w:tebal', shake: ['w:tebal'] },
    },
    {
      id: 's2', min: 4, voDelay: 0.35, mus: 'hush',
      vo: 'Tapi yang bisa dipahami direksi dalam sepuluh detik.',
      sfx: [[0.02, 'whoosh', 0.45], ['w:direksi', 'pop', 0.3], ['w:sepuluh', 'ding', 0.5]],
      vis: { type: 'm01_jam', lineAt: 'w:Tapi', numAt: 'w:sepuluh' },
    },
    {
      id: 's3', min: 6, voDelay: 0.35, mus: 'main',
      vo: 'Dasbor Privasimu Nexus merangkum kepatuhan lintas modul dalam satu layar.',
      sfx: [[0.1, 'whoosh', 0.35], ['w:kepatuhan', 'pop', 0.4], ['w:lintas', 'pop', 0.4], ['w:modul', 'pop', 0.4], ['w:satu', 'ding', 0.4]],
      vis: {
        type: 'nx_shot', eyebrow: 'M01 · Dasbor kepatuhan', title: 'Satu layar. *Semua modul.*', titleAt: 0.2,
        src: '../assets/app/dashboard.png', size: [1264, 790], view: [1002, 560], label: 'Dashboard',
        cam: [{ at: 0, x: 262, y: 40, w: 1002 }, { at: 'w:merangkum', x: 262, y: 228, w: 1002, dur: 1.2 }],
        marks: [
          { at: 'w:kepatuhan', to: 'w:lintas', r: [288, 466, 302, 101], label: 'Skor GAP 81%', tone: 'blue' },
          { at: 'w:lintas', to: 'w:modul', r: [612, 466, 300, 101], label: '4 DSR pending', tone: 'amber' },
          { at: 'w:modul', to: 'w:satu', r: [934, 466, 302, 101], label: '20 insiden aktif', tone: 'red' },
          { at: 'w:satu', r: [288, 394, 948, 48], label: 'Yang perlu perhatian, langsung di atas', tone: 'amber', side: 'bottom' },
        ],
      },
    },
    {
      id: 's4', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Tren tiap modul dan skor kepatuhan terlihat dari data kerja harian, bukan tebakan.',
      sfx: [[0.1, 'whoosh', 0.35], ['w:Tren', 'pop', 0.4], ['w:skor', 'pop', 0.4], ['w:tebakan', 'check', 0.45]],
      vis: {
        type: 'nx_shot', eyebrow: 'M01 · Postur kepatuhan', title: 'Tren per modul, *bukan tebakan.*', titleAt: 0.15,
        src: '../assets/app/dashboard-postur.png', size: [1002, 480], view: [1002, 480], label: 'Dashboard · Postur Kepatuhan',
        cam: [{ at: 0, x: 0, y: 0, w: 1002 }, { at: 'w:skor', x: 250, y: 40, w: 752, dur: 1.1 }],
        marks: [
          { at: 'w:Tren', to: 'w:skor', r: [27, 86, 623, 384], label: 'Tren bulanan: RoPA · DPIA · DSR · Breach · Consent', tone: 'blue' },
          { at: 'w:skor', r: [672, 86, 300, 384], label: 'Compliance Score 81%', tone: 'green' },
        ],
      },
    },
    {
      id: 's5', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Risiko tertinggi langsung kelihatan: heatmap DPIA dan daftar risiko teratas.',
      sfx: [[0.1, 'whoosh', 0.35], ['w:heatmap', 'pop', 0.45], ['w:daftar', 'pop', 0.45], ['w:teratas', 'alarm', 0.2]],
      vis: {
        type: 'nx_shot', eyebrow: 'M01 · Analitik risiko', title: 'Risiko teratas, *langsung kelihatan.*', titleAt: 0.15,
        src: '../assets/app/dashboard-risiko.png', size: [1002, 478], view: [1002, 478], label: 'Dashboard · Risk Analytics',
        cam: [{ at: 0, x: 0, y: 0, w: 1002 }, { at: 'w:daftar', x: 242, y: 40, w: 760, dur: 1.1 }],
        marks: [
          { at: 'w:heatmap', to: 'w:daftar', r: [110, 175, 235, 235], label: 'Heatmap DPIA 5×5', tone: 'red' },
          { at: 'w:daftar', r: [592, 86, 380, 384], label: '5 risiko teratas', tone: 'red' },
        ],
      },
    },
    {
      id: 's6', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Postur privasi dihitung dari tiga lapisan: data, proses, dan respons.',
      sfx: [[0.1, 'whoosh', 0.35], ['w:Postur', 'pop', 0.4], ['w:data', 'tick', 0.45], ['w:proses', 'tick', 0.45], ['w:respons', 'tick', 0.45], ['w:respons+0.4', 'ding', 0.4]],
      vis: {
        type: 'nx_shot', eyebrow: 'M01 · Postur privasi', title: 'Data · proses · *respons.*', titleAt: 0.15,
        src: '../assets/app/postur-privasi.png', size: [1000, 355], view: [1000, 355], label: 'Data Security Posture',
        cam: [{ at: 0, x: 0, y: 0, w: 1000 }],
        marks: [
          { at: 'w:Postur', to: 'w:data', r: [19, 126, 238, 222], label: 'Skor postur 56 · Cukup', tone: 'amber' },
          { at: 'w:data', to: 'w:proses', r: [279, 170, 712, 58], label: 'Lapisan data · bobot 50%', tone: 'blue' },
          { at: 'w:proses', to: 'w:respons', r: [279, 231, 712, 58], label: 'Lapisan proses · bobot 30%', tone: 'blue' },
          { at: 'w:respons', r: [279, 292, 712, 56], label: 'Lapisan respons · bobot 20%', tone: 'amber', side: 'bottom' },
        ],
      },
    },
    {
      id: 's7', min: 6.5, voDelay: 0.5, tail: 1.8, mus: 'outro',
      vo: 'Privasimu Nexus. Kepatuhan yang bisa dibaca sekilas. Coba di privasimu dot com.',
      sfx: [['w:Kepatuhan', 'pop', 0.35], ['w:privasimu#2-0.1', 'pop', 0.45]],
      vis: {
        type: 'nx_cta', tag: 'Kepatuhan yang bisa dibaca *sekilas.*', tagAt: 'w:Kepatuhan', sub: 'Rapat berikutnya: cukup satu layar.', subAt: 'w:sekilas+0.2',
        btn: 'privasimu.com', btnAt: 'w:privasimu#2-0.1', chips: ['Start Pre Check · gratis', 'Schedule Demo'], foot: KONTAK,
      },
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
