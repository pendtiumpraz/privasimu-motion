// N04 — "RoPA final revisi dua": parodi GENRE iklan obat TV jadul 90-an (rekaman VHS, bingkai 4:3).
// Visual & efek: style.js (tipe scene kustom n4*). Layar aplikasi = screenshot ASLI di assets/app/ (koordinat r = [x, y, lebar] px gambar).
(function (root) {
  const CONFIG = {
    title: 'N04 · RoPA Final Revisi Dua',
    naskah: 'N04',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+20%',
    beat: 60 / 116,
    tail: 0.45,
    music: { bpm: 116, mode: 'major', root: 55, lead: 'bell', drums: 'light', sonic: true },
  };
  const APP = '../assets/app/';
  const K = { push: 0, enter: 'none', exit: 'none' }; // bingkai TV diam; kamera & transisi VHS diatur di style.js

  const SCENES = [
    {
      id: 's1', min: 4.5, voDelay: 0.4, theme: 'vhs', mus: 'play',
      vo: 'RoPA final. RoPA final revisi. RoPA final revisi dua... Familiar?',
      sfx: [[0.02, 'glitch', 0.3], ['w:RoPA', 'pop', 0.5], ['w:RoPA#2', 'pop', 0.5], ['w:RoPA#3', 'pop', 0.55], ['w:revisi#2', 'pop', 0.4],
        ['w:revisi#2+0.18', 'pop', 0.4], ['w:dua', 'boing', 0.55], ['w:dua+0.2', 'pop', 0.35], ['w:dua+0.4', 'pop', 0.35], ['w:Familiar+0.12', 'rimshot', 0.7]],
      vis: {
        type: 'n4kantor', ...K,
        familiarAt: 'w:Familiar', handsAt: 'w:RoPA#3', sweatAt: 'w:dua',
        top: 'SERING\nMENGALAMI INI?',
        faces: [{ at: 0, e: '😐' }, { at: 'w:RoPA#2', e: '😬' }, { at: 'w:RoPA#3', e: '😰' }, { at: 'w:dua', e: '🤯' }, { at: 'w:Familiar', e: '😵‍💫' }],
        files: [
          { text: 'RoPA_final.xlsx', at: 'w:RoPA', slot: 1 },
          { text: 'RoPA_final_REVISI.xlsx', at: 'w:RoPA#2', slot: 0 },
          { text: 'RoPA_final_REVISI(2).xlsx', at: 'w:RoPA#3', slot: 5 },
          { text: 'RoPA_HR_v7.xlsx', at: 'w:revisi#2', slot: 3 },
          { text: 'RoPA_final_FIX.xlsx', at: 'w:revisi#2+0.18', slot: 4 },
          { text: 'RoPA_IT_JANGAN_DIUBAH.xlsx', at: 'w:dua', slot: 2 },
          { text: 'Copy of RoPA_final (3).xlsx', at: 'w:dua+0.2', slot: 6 },
          { text: 'RoPA_FINAL_beneran.xlsx', at: 'w:dua+0.4', slot: 7 },
        ],
      },
    },
    {
      id: 's2', min: 6, voDelay: 0.25, tail: 1.4, theme: 'vhs', mus: 'play',
      vo: 'PP tiga puluh tiga merinci isi minimal catatan pemrosesan data. Kalau masih tersebar di spreadsheet per divisi, siap-siap repot.',
      sfx: [[0.06, 'hit', 0.8], [0.3, 'heart', 0.5], [1.1, 'heart', 0.35], ['w:merinci', 'slam', 0.35], ['w:isi', 'slam', 0.35], ['w:minimal', 'slam', 0.35],
        ['w:catatan', 'slam', 0.35], ['w:pemrosesan', 'slam', 0.35], ['w:data', 'slam', 0.35], ['w:tersebar', 'whoosh', 0.55], ['w:spreadsheet', 'pop', 0.5],
        ['w:per', 'pop', 0.5], ['w:divisi+0.2', 'pop', 0.5], ['w:siap-siap-0.12', 'blip', 0.5], ['w:siap-siap', 'sadtrombone', 0.8]],
      vis: {
        type: 'n4pusing', ...K,
        pp: 'ISI MINIMAL RoPA · PP 33/2026 Ps. 74', ppSmall: ' (antara lain)', ppAt: 'w:PP',
        rows: [
          { text: 'Kontak pengendali & PPDP', at: 'w:merinci' },
          { text: 'Dasar & tujuan pemrosesan', at: 'w:isi' },
          { text: 'Jenis data & kategori subjek', at: 'w:minimal' },
          { text: 'Sumber & tujuan pengiriman data', at: 'w:catatan' },
          { text: 'Masa retensi', at: 'w:pemrosesan' },
          { text: 'Langkah pengamanan', at: 'w:data' },
        ],
        foot: '…dan butir lainnya. Semua harus tercatat.',
        scatterAt: 'w:tersebar', droopAt: 'w:repot',
        wins: [
          { title: 'RoPA_HR.xlsx', at: 'w:spreadsheet', h: [912, 150, -5], v: [930, 70, -5], errs: [[20, 44, '#REF!'], [210, 106, '#N/A']] },
          { title: 'RoPA_Marketing_v7.xlsx', at: 'w:per', h: [960, 360, 4], v: [960, 280, 4], errs: [[114, 74, '#VALUE!']] },
          { title: 'RoPA_IT_final.xlsx', at: 'w:divisi+0.2', h: [890, 570, -2], v: [900, 480, -2], errs: [[30, 136, '#REF!'], [220, 44, '???']] },
        ],
        dlg: { at: 'w:siap-siap-0.12', title: 'RoPA_final_REVISI(2).xlsx', text: 'File sedang dikunci untuk diedit oleh pengguna lain.' },
      },
    },
    {
      id: 's3', min: 6, voDelay: 0.4, theme: 'vhs', mus: 'main',
      vo: 'Di Privasimu Nexus, RoPA diisi lewat wizard bertahap, bisa dibantu AI, dengan alur maker, reviewer, dan approver.',
      sfx: [[0.05, 'tada', 0.7], [0.35, 'shimmer', 0.5], ['w:Nexus', 'airhorn', 0.26], ['w:RoPA', 'whoosh', 0.5], ['w:wizard', 'pop', 0.55], ['w:wizard+0.45', 'ding', 0.3],
        ['w:dibantu', 'pop', 0.55], ['w:AI', 'shimmer', 0.45], ['w:dengan', 'whoosh', 0.35], ['w:maker', 'tick', 0.6], ['w:reviewer', 'tick', 0.6], ['w:approver', 'correct', 0.6]],
      vis: {
        type: 'n4packshot', ...K, flash: true,
        boxAt: 0.05, burstAt: 'w:Nexus', demoAt: 'w:RoPA', burst: 'BARU!',
        top: 'KINI HADIR!', bottom: 'Meredakan pusing<br><span style="color:#ffe14d">RoPA, DPIA &amp; audit</span>',
        layout: {
          h: { hero: [720, 470, 1.12], box: [262, 700, .58], burst: .72, mon: [512, 40, 1] },
          v: { hero: [720, 450, 1.05], box: [150, 880, .4], burst: .8, mon: [82, 80, 1.45] },
        },
        demo: {
          shots: [
            { src: APP + 'ropa-baru.png', w: 1264, h: 569, at: 0,
              keys: [{ at: 0, r: [60, 0, 910] }, { at: 'w:RoPA+0.3', r: [190, 10, 880], dur: 1.2 }],
              marks: [{ at: 'w:RoPA+0.3', r: [204, 34, 388, 54], dir: 'up' }] },
            { src: APP + 'ropa-data-spesifik.png', w: 1002, h: 940, at: 'w:wizard',
              keys: [{ at: 'w:wizard', r: [0, 280, 720] }, { at: 'w:bisa', r: [0, 120, 660], dur: 0.8 }],
              marks: [{ at: 'w:wizard+0.1', to: 'w:bisa', r: [42, 318, 250, 386], dir: 'left' }, { at: 'w:dibantu', r: [44, 192, 244, 46], dir: 'left' }] },
            { src: APP + 'ropa-list-baru.png', w: 1440, h: 900, at: 'w:dengan',
              keys: [{ at: 'w:dengan', r: [280, 56, 1000] }, { at: 'w:maker', r: [284, 96, 720], dur: 1.0 }, { at: 'w:approver', r: [640, 180, 620], dur: 0.7 }],
              marks: [{ at: 'w:maker', to: 'w:approver', r: [296, 119, 524, 36], dir: 'up' }, { at: 'w:approver+0.15', r: [1080, 244, 74, 228], dir: 'right' }] },
          ],
        },
        pills: [{ text: 'Wizard bertahap', at: 'w:wizard', h: [40, 132, -2] }, { text: 'Dibantu AI', emo: '✨', at: 'w:dibantu', h: [40, 250, 1.5] }],
        mra: [{ icon: 'form', text: 'Maker', at: 'w:maker' }, { icon: 'search', text: 'Reviewer', at: 'w:reviewer' }, { icon: 'check', text: 'Approver', at: 'w:approver' }],
        mraPos: [470, 848],
      },
    },
    {
      id: 's4', min: 5, voDelay: 0.25, theme: 'vhs', mus: 'main',
      vo: 'Data spesifik otomatis ditandai berisiko tinggi, dan langsung memicu draf DPIA.',
      sfx: [[0.05, 'sweep', 0.45], ['w:Data', 'pop', 0.5], ['w:otomatis', 'riser', 0.4], ['w:berisiko', 'alarm', 0.6], ['w:tinggi', 'hit', 0.45],
        ['w:langsung', 'sweep', 0.5], ['w:draf', 'pop', 0.5], ['w:DPIA', 'stamp', 0.7]],
      vis: {
        type: 'n4cara', ...K,
        title: 'CARA KERJA', sub: '*DI DALAM PRIVASIMU NEXUS', zb: 'OTOMATIS!', zbAt: 'w:otomatis', note: '*Ilustrasi',
        n1: { src: APP + 'ropa-data-spesifik.png', w: 1002, h: 940, at: 'w:Data', markAt: 'w:spesifik', label: 'Data spesifik', small: 'mis. kesehatan, biometrik',
          r0: [300, 560, 360], r1: [345, 640, 320], mark: [352, 699, 294, 37] },
        n2: { at: 'w:ditandai', redAt: 'w:berisiko', label: 'Ditandai otomatis' },
        n3: { src: APP + 'dpia-risiko.png', w: 1264, h: 790, r: [289, 170, 258], cap: 'DPIA-BARU', at: 'w:draf', stampAt: 'w:DPIA', label: 'Draf DPIA', small: 'langsung dibuat' },
        tubes: [{ at: 'w:otomatis', chip: 'OTOMATIS', emo: '⚡' }, { at: 'w:langsung', chip: 'LANGSUNG' }],
      },
    },
    {
      id: 's5', min: 5, voDelay: 0.25, theme: 'vhs', mus: 'main',
      vo: 'Setiap perubahan tercatat di log audit. Satu register, bukan puluhan file.',
      sfx: [[0.08, 'shimmer', 0.5], ['w:Setiap', 'key', 0.6], ['w:perubahan', 'key', 0.6], ['w:tercatat', 'key', 0.6], ['w:tercatat+0.05', 'blip', 0.4],
        ['w:audit+0.35', 'buzzer', 0.4], ['w:Satu', 'correct', 0.7], ['w:bukan', 'stamp', 0.75]],
      vis: {
        type: 'n4lega', ...K,
        recAt: 'w:tercatat', drakeAt: 'w:audit+0.35', yesAt: 'w:Satu', stampAt: 'w:bukan',
        log: [
          { at: 'w:Setiap', time: '10:02', who: 'MAKER', what: 'mengubah isian' },
          { at: 'w:perubahan', time: '10:15', who: 'REVIEWER', what: 'memberi catatan' },
          { at: 'w:tercatat', time: '10:31', who: 'APPROVER', what: 'menyetujui' },
        ],
        monitor: { src: APP + 'ropa-tersimpan.png', w: 1264, h: 569, r: [262, 0, 870] },
        no: { text: 'Puluhan<br>file', small: 'RoPA_final_REVISI(2).xlsx & kawan-kawan' },
        yes: { text: 'Satu<br>register', small: 'terpusat · tercatat di log audit', src: APP + 'ropa-list-baru.png', w: 1440, h: 900, r: [286, 205, 400] },
        stamp: 'BUKAN!', top: 'LEGA!', zb: 'REGISTER RoPA: 1',
      },
    },
    {
      id: 's6', min: 6, voDelay: 0.3, tail: 0.9, theme: 'vhs', mus: 'outro',
      vo: 'Privasimu Nexus. Saatnya pensiunkan RoPA final revisi dua. Kunjungi privasimu dot com.',
      sfx: [[0.05, 'whoosh', 0.45], ['w:Privasimu', 'shimmer', 0.5], ['w:pensiunkan', 'slidewhistle', 0.6], ['w:pensiunkan+0.85', 'boing', 0.5],
        ['w:Kunjungi', 'ding', 0.6], ['end-0.55', 'suck', 0.45]],
      vis: {
        type: 'n4tutup', ...K, nexus: true,
        logoAt: 'w:Privasimu', nexusAt: 'w:Nexus', tagAt: 'w:Saatnya', flyAt: 'w:pensiunkan', btnAt: 'w:Kunjungi', discAt: 'w:revisi+0.3',
        tag: 'Saatnya pensiunkan', file: 'RoPA_final_REVISI(2).xlsx', rip: 'terima kasih atas jasamu', binLbl: 'DIPENSIUNKAN', button: 'privasimu.com',
        cta2: 'Schedule Demo · <b>Start Pre Check (gratis)</b>',
        disc1: 'Baca aturan pakai. Jika pusing berlanjut, hubungi konsultan Privasimu.',
        disc2: '<b>*Bukan obat. Jangan diminum.</b>',
        contact: 'support@privasimu.com · 0851 8318 2722',
        pos: {
          h: { box: [330, 480, .78], tag: [640, 352], file: [990, 470], bin: [1310, 470], btn: [990, 642], cta2: [990, 790] },
          v: { box: [300, 560, .9], tag: [620, 150], file: [960, 300], bin: [1282, 330], btn: [960, 600], cta2: [960, 754], contact: [960, 818] },
        },
      },
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
