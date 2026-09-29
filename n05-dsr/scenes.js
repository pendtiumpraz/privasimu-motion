// N05 — "Tolong hapus data saya" (hak subjek data / DSR). Gaya: meme chat-app pastel.
// Tipe scene kustom ada di style.js (inbox, rights, dsr, flowai, discovery); SFX ditulis manual per scene.
(function (root) {
  const CONFIG = {
    title: 'N05 · Tolong Hapus Data Saya',
    naskah: 'N05',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+10%',
    beat: 60 / 118,
    tail: 0.45,
    music: { bpm: 118, mode: 'major', root: 57, lead: 'pluck', drums: 'light' },
    mix: { duckTo: 0.4 },
  };

  const WIPE = ['end-0.42', 'whoosh', 0.32]; // transisi gelembung
  // derap ketikan (mis. AI menulis draf): n ketukan mulai kata tertentu
  const keys = (word, n, step, gain = 0.2) => Array.from({ length: n }, (_, i) => [`w:${word}+${(i * step).toFixed(2)}`, 'key', gain * (0.85 + 0.15 * (i % 3))]);

  const SCENES = [
    {
      id: 's1', min: 4.5, voDelay: 0.5, theme: 'lav', mus: 'play',
      vo: 'Satu email masuk: tolong hapus data saya. Lalu, siapa yang menangani?',
      sfx: [
        [0.05, 'whoosh', 0.3], ['w:Satu', 'ding', 0.5], ['w:Satu+0.05', 'pop', 0.35], ['w:tolong-0.3', 'blip', 0.4],
        ['w:saya+0.32', 'tick', 0.35], ['w:saya+0.42', 'whoosh', 0.45], ['w:Lalu', 'vineboom', 0.9], ['w:Lalu+0.35', 'pop', 0.3], ['w:menangani', 'boing', 0.35], ['w:menangani+0.2', 'pop', 0.3], ['w:menangani+0.48', 'pop', 0.28], WIPE,
      ],
      vis: {
        type: 'inbox', newAt: 'w:Satu', openAt: 'w:tolong-0.28', words: ['w:tolong', 'w:hapus', 'w:data', 'w:saya'], readAt: 'w:saya+0.32',
        memeAt: 'w:saya+0.5', l1At: 'w:saya+0.62', l2At: 'w:saya+0.85', eyesAt: 'w:Lalu', avAt: 'w:Lalu+0.35', qAt: 'w:menangani', reacAt: 'w:menangani+0.2', shake: ['w:Lalu'],
        mail: { av: 'RA', col: '#FF8FB8', fr: 'Rina Andini', flag: 'PENTING', sj: 'Tolong hapus data saya 🙏', pv: 'Halo, saya ingin semua data pribadi saya dihapus…', tm: '09.41', dot: true },
        rows: [
          { av: 'TM', col: '#A48CFF', fr: 'Tim Marketing', sj: 'Materi promo gajian 🛍️', pv: 'Draf konten untuk minggu depan…', tm: '08.15' },
          { av: 'BF', col: '#4CC79A', fr: 'Budi · Finance', sj: 'Reimburse bulan lalu', pv: 'Mohon dicek lampirannya ya…', tm: '07.58' },
          { av: 'KL', col: '#FFB36B', fr: 'Kalender', sj: 'Rapat mingguan · 10.00', pv: 'Ruang rapat lantai 3', tm: 'Kemarin' },
          { av: 'IT', col: '#6FB7FF', fr: 'Helpdesk IT', sj: 'Jadwal pembaruan sistem', pv: 'Malam ini pukul 22.00…', tm: 'Kemarin' },
        ],
        quote: ['tolong', 'hapus', 'data', 'saya'],
        l1: 'Nobody:', l2: 'Seluruh kantor saat email itu masuk:',
        team: [{ e: '😬', lb: 'CS', bg: '#E9E4FF' }, { e: '😶', lb: 'IT', bg: '#D8F5EA' }, { e: '🤔', lb: 'Legal', bg: '#FFE3D3' }, { e: '😳', lb: 'Marketing', bg: '#FFE0EE' }],
      },
    },
    {
      id: 's2', min: 6, voDelay: 0.3, theme: 'mint', mus: 'main',
      vo: 'Subjek data berhak mengakses, memperbaiki, hingga menghapus datanya. Untuk hak tertentu, batasnya tiga kali dua puluh empat jam.',
      sfx: [
        [0.12, 'pop', 0.35], ['w:mengakses', 'pop', 0.55], ['w:memperbaiki', 'pop', 0.55], ['w:menghapus', 'pop', 0.55], ['w:menghapus+0.08', 'boing', 0.3],
        ['w:Untuk-0.1', 'whoosh', 0.35], ['w:Untuk+0.35', 'boing', 0.4], ['w:tertentu', 'blip', 0.35], ['w:batasnya', 'flip', 0.6],
        ['w:tiga', 'tick', 0.45], ['w:kali', 'tick', 0.4], ['w:dua', 'tick', 0.45], ['w:jam', 'ding', 0.55], ['w:jam+0.2', 'shimmer', 0.35], WIPE,
      ],
      vis: {
        type: 'rights', head: 'Hak subjek data', headAt: 0.12,
        cards: [
          { e: '🔍', t: 'Akses', s: 'melihat datanya', at: 'w:mengakses' },
          { e: '✏️', t: 'Perbaikan', s: 'membetulkan datanya', at: 'w:memperbaiki' },
          { e: '🗑️', t: 'Penghapusan', s: 'menghapus datanya', at: 'w:menghapus' },
        ],
        shiftAt: 'w:Untuk-0.12', glassAt: 'w:Untuk', tag: 'untuk hak tertentu', tagAt: 'w:tertentu', flipAt: 'w:batasnya',
        num: ['w:tiga', 'w:kali', 'w:dua', 'w:jam'], eqAt: 'w:jam+0.2',
      },
    },
    {
      id: 's3', min: 6, voDelay: 0.3, theme: 'lav', mus: 'main',
      vo: 'Di Privasimu Nexus, permohonan masuk lewat formulir di situs Anda, identitas pemohon diverifikasi, dan tenggat tujuh puluh dua jam dipantau otomatis.',
      sfx: [
        [0.05, 'whoosh', 0.35], ['w:Nexus', 'blip', 0.3], ['w:permohonan', 'pop', 0.35], ['w:formulir-0.3', 'tick', 0.3], ['w:formulir', 'pop', 0.4], ['w:formulir+0.1', 'blip', 0.35],
        ['w:Anda', 'pop', 0.5], ['w:Anda+0.02', 'tada', 0.4], ['w:Anda+0.15', 'whoosh', 0.35], ['w:Anda+0.35', 'boing', 0.3],
        ['w:identitas', 'pop', 0.4], ['w:diverifikasi', 'correct', 0.55],
        ['w:dan-0.2', 'whoosh', 0.4], ['w:dan', 'buzzer', 0.45], ['w:tujuh', 'blip', 0.35], ['w:dua', 'correct', 0.6], ['w:dipantau', 'pop', 0.4], ['w:otomatis', 'shimmer', 0.4], WIPE,
      ],
      vis: {
        type: 'dsr',
        emb: 'Formulir DSR', embSub: 'bisa disematkan di situs Anda', embAt: 'w:formulir+0.1', embPos: { h: [1480, 770], v: [540, 1095] },
        sent: 'Permohonan masuk ✓✓', sentSub: 'langsung tercatat di Nexus', sendAt: 'w:Anda', sentPos: { h: [960, 190], v: [540, 410] },
        detailAt: 'w:Anda+0.35', detailY: { h: [365, 92], v: [590, 212] },
        idTxt: 'Identitas pemohon', idSub: 'diverifikasi', idAt: 'w:identitas', okAt: 'w:diverifikasi', idPos: { h: [960, 772], v: [540, 1030] },
        drakeAt: 'w:dan-0.2', noAt: 'w:dan', yesAt: 'w:dua',
        no: 'Tenggat dihitung manual', noSub: '📅 Senin + 3 hari… eh, ada libur? 🧮😵',
        yes: '*72 jam* dipantau otomatis', yesSub: '⏱️ dihitung sejak permohonan dicatat',
        live: 'dipantau otomatis', liveAt: 'w:dipantau', livePos: { h: [1456, 404], v: [836, 552] },
        form: {
          src: '../assets/app/dsr-form.png', size: [1264, 790], label: 'Privasimu Nexus · DSR Request',
          box: { h: [300, 96, 1320, 800], v: [60, 290, 960, 760] },
          cam: {
            h: [{ at: 0, x: 0, y: 0, w: 1264 }, { at: 'w:permohonan-0.35', x: 160, y: 10, w: 943, dur: 1.1 }],
            v: [{ at: 0, x: 182, y: 0, w: 900 }, { at: 'w:permohonan-0.35', x: 289, y: 30, w: 686, dur: 1.1 }],
          },
          marks: [
            { at: 'w:Nexus', to: 'w:permohonan', r: [370, 64, 160, 42] },
            { at: 'w:permohonan', to: 'w:formulir', r: [380, 236, 504, 66] },
            { at: 'w:formulir', r: [640, 348, 244, 42], tone: 'pink' },
          ],
          taps: [{ at: 'w:formulir', p: [770, 372] }],
        },
        detail: {
          src: '../assets/app/dsr-detail.png', size: [1002, 250], label: 'Privasimu Nexus · Detail DSR',
          box: { h: [359, 365, 1202, 364], v: [60, 590, 960, 364] },
          cam: {
            h: [{ at: 0, x: 0, y: 0, w: 1002 }],
            v: [{ at: 0, x: 0, y: 22, w: 700 }, { at: 'w:tenggat-0.25', x: 302, y: 22, w: 700, dur: 0.9 }],
          },
          marks: [
            { at: 'w:Anda+0.75', to: 'w:dan-0.2', r: [66, 90, 184, 36] },
            { at: 'w:tujuh', r: [856, 101, 118, 42], tone: 'green', spot: true },
          ],
        },
      },
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, theme: 'peach', mus: 'main',
      vo: 'Alur handler, reviewer, dan approver tercatat rapi, dan draf jawabannya bisa dibantu AI.',
      sfx: [
        [0.05, 'whoosh', 0.3], ['w:handler', 'pop', 0.5], ['w:handler+0.38', 'check', 0.4], ['w:reviewer', 'pop', 0.5], ['w:reviewer+0.38', 'check', 0.4],
        ['w:approver', 'pop', 0.5], ['w:approver+0.38', 'check', 0.4], ['w:tercatat', 'stamp', 0.55], ['w:draf-0.3', 'whoosh', 0.4], ['w:draf', 'pop', 0.4],
        ...keys('jawabannya', 11, 0.12, 0.2), ['w:AI', 'shimmer', 0.5], WIPE,
      ],
      vis: {
        type: 'flowai',
        steps: [
          { e: '👩‍💻', t: 'Handler', s: 'menangani', bg: '#E9E4FF', at: 'w:handler' },
          { e: '🧐', t: 'Reviewer', s: 'meninjau', bg: '#D8F5EA', at: 'w:reviewer' },
          { e: '👨‍💼', t: 'Approver', s: 'menyetujui', bg: '#FFE3D3', at: 'w:approver' },
        ],
        log: 'Jejak audit tercatat rapi', logAt: 'w:tercatat',
        aiAt: 'w:draf-0.3', typeAt: 'w:jawabannya', typeEnd: 'w:AI+0.25', sparkAt: 'w:AI',
        aiTitle: 'Draf jawaban', aiSub: 'dibantu AI · siap ditinjau', aiFoot: 'Draf · ditinjau tim sebelum dikirim',
        draft: 'Halo Rina, permohonan penghapusan data Anda sudah kami terima dan sedang kami proses. 🙏',
        stripAt: { h: [960, 612], v: [540, 730] }, logPos: { h: [960, 790], v: [540, 1222] }, aiPos: { h: [1122, 360], v: [60, 965] },
        detail: {
          src: '../assets/app/dsr-detail.png', size: [1002, 250], label: 'Privasimu Nexus · Detail DSR',
          box: { h: [359, 170, 1202, 364], v: [60, 310, 960, 364] },
          cam: { h: [{ at: 0, x: 0, y: 0, w: 1002 }], v: [{ at: 0, x: 0, y: 22, w: 700 }] },
          marks: [{ at: 'w:Alur', to: 'w:reviewer', r: [66, 90, 184, 36] }, { at: 'w:reviewer', r: [162, 122, 116, 30], tone: 'pink' }],
        },
        chat: {
          src: '../assets/app/ai-agent-chat.png', size: [1264, 569], label: 'Privasimu Nexus · AI Agent',
          box: { h: [110, 170, 1100, 600], v: [60, 300, 960, 620] },
          cam: { h: [{ at: 0, x: 290, y: 88, w: 950 }], v: [{ at: 0, x: 320, y: 90, w: 700 }] },
          marks: [{ at: 'w:draf', to: 'w:AI', r: [360, 102, 360, 46] }, { at: 'w:AI', r: [322, 216, 698, 134], tone: 'green' }],
        },
      },
    },
    {
      id: 's5', min: 4, voDelay: 0.3, theme: 'mint', mus: 'play',
      vo: 'Data Discovery membantu melacak data si pemohon di berbagai sistem.',
      sfx: [
        [0.2, 'pop', 0.35], ['w:Data', 'pop', 0.35], ...keys('Data', 7, 0.11, 0.2), ['w:melacak-0.05', 'blip', 0.3], ['w:melacak', 'sweep', 0.45],
        ['w:data#2', 'coin', 0.35], ['w:pemohon', 'coin', 0.35], ['w:berbagai', 'coin', 0.35], ['w:sistem', 'coin', 0.4], ['w:sistem+0.25', 'ding', 0.45],
      ],
      vis: {
        type: 'discovery', head: 'Data Discovery', headAt: 0.15, q: 'Rina Andini', qAt: 'w:Data', qEnd: 'w:membantu+0.1', scanAt: 'w:melacak', resAt: 'w:sistem+0.25',
        res: 'Data si pemohon ditemukan di *4 sistem*',
        headPos: { h: [960, 84], v: [540, 205] }, qPos: { h: [960, 166], v: [540, 290] }, resPos: { h: [960, 848], v: [540, 1300] },
        systems: [
          { e: '📇', n: 'CRM', sub: 'data pelanggan', f: '2 data', m: 1, bg: '#E9E4FF', at: 'w:data#2' },
          { e: '🛒', n: 'Transaksi', sub: 'riwayat pesanan', f: '3 data', m: 2, bg: '#FFE3D3', at: 'w:pemohon' },
          { e: '💌', n: 'Newsletter', sub: 'daftar email', f: '1 data', m: 0, bg: '#FFE0EE', at: 'w:berbagai' },
          { e: '🎧', n: 'Layanan', sub: 'tiket bantuan', f: '2 data', m: 3, bg: '#D8F5EA', at: 'w:sistem' },
        ],
      },
    },
    {
      id: 's6', min: 5, voDelay: 0.3, theme: 'lav', mus: 'outro',
      vo: 'Privasimu Nexus. Setiap permohonan, dijawab tepat waktu. privasimu dot com.',
      sfx: [['w:Setiap-0.1', 'pop', 0.4], ['w:dijawab-0.1', 'pop', 0.45], ['w:waktu', 'check', 0.5], ['w:waktu+0.4', 'pop', 0.35]],
      vis: {
        type: 'cta', nexus: true, button: 'privasimu.com', btnAt: 'w:privasimu#2-0.1', foot: 'support@privasimu.com · 0851 8318 2722',
        lines: [{ text: 'Setiap permohonan,', size: 'sm', at: 'w:Setiap' }, { text: 'dijawab *tepat waktu*.', at: 'w:dijawab' }],
        stickers: [
          { e: '💌', at: 'w:Setiap', x: 0.3, y: 0.4, size: 120, rot: -12, v: { x: 0.14, y: 0.34 } },
          { e: '⏱️', at: 'w:tepat', x: 0.845, y: 0.5, size: 120, rot: 10, v: { x: 0.87, y: 0.535 } },
          { e: '✅', at: 'w:waktu+0.1', x: 0.2, y: 0.62, size: 100, rot: -8, v: { x: 0.13, y: 0.515 } },
        ],
      },
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
