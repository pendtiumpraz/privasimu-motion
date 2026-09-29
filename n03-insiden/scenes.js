// N03 — "3 x 24 Jam" (insiden kebocoran data) · gaya "cyber-noir thriller / CCTV control room".
// Tipe kustom (terminal, bomb, chaos, monitor, briefing) + efek global (fx) ada di style.js. Tipe kustom tidak punya SFX
// otomatis, jadi SFX ditulis di `sfx` tiap scene — waktunya menempel ke kata VO agar tetap sinkron saat VN tim masuk.
// Tampilan aplikasi (s4, s5) memakai screenshot ASLI di ../assets/app/*.png (3200×2000 = viewport 1600×1000 @2x).
(function (root) {
  const CONFIG = {
    title: 'N03 · 3×24 Jam',
    naskah: 'N03',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+10%',
    beat: 0.5,
    tail: 0.45,
    music: { bpm: 120, root: 50, mode: 'minor', clock: true, lead: 'pluck', drums: 'full' },
  };

  // klik keyboard terminal: n klik mulai kata `word` (+offset o) tiap `step` detik
  const off = (x) => (x >= 0 ? '+' : '') + x.toFixed(3);
  const keys = (word, o, n, step = 0.07, g = 0.2) => Array.from({ length: n }, (_, i) => [`w:${word}${off(o + i * step)}`, 'key', g]);

  const SCENES = [
    {
      id: 's1', min: 4, voDelay: 0.5, theme: 'noir', mus: 'hook',
      vo: 'Jam dua pagi. Ada laporan: data pelanggan Anda bocor.',
      sfx: [
        [0, 'glitch', 0.4],
        ...keys('Jam', -0.3, 9),
        ['w:Jam-0.15', 'alarm', 0.45],
        ...keys('pagi', 0.05, 8, 0.07, 0.17),
        ...keys('Ada', 0, 8, 0.07, 0.17),
        ...keys('data', 0, 5, 0.07, 0.17),
        ['w:bocor', 'dundun', 0.9], ['w:bocor', 'glitch', 0.9], ['w:bocor', 'impact', 0.6],
        ['end-0.2', 'glitch', 0.5],
      ],
      vis: {
        type: 'terminal', enter: 'none', exit: 'none', push: 0.06,
        title: 'ssh root@srv-db04 · /var/log',
        prompt: 'root@srv-db04:/var/log#', cmd: 'tail -f auth.log',
        pre: [
          { ts: '02:00:07', tag: 'INFO', text: 'sshd: sesi admin ditutup' },
          { ts: '02:00:11', tag: 'INFO', text: 'cron: backup harian selesai' },
        ],
        lines: [
          { at: 'w:Jam-0.3', ts: '02:00:13', tag: 'ALERT', tone: 'red', text: 'akses tidak sah ke db_pelanggan' },
          { at: 'w:pagi+0.05', ts: '02:00:14', tag: 'WARN', tone: 'ghost', text: 'login root dari 203.0.113.66' },
          { at: 'w:Ada', ts: '02:00:15', tag: 'LAPOR', tone: 'ghost', text: 'sampel data beredar di forum' },
          { at: 'w:data', ts: '02:00:16', tag: 'EXFIL', tone: 'red', text: 'db_pelanggan', bar: [38, 100] },
        ],
        final: { ts: '02:00:17', tag: 'KRITIS', text: 'kebocoran terkonfirmasi' },
        clockAt: 'w:Jam', // 9:16: jam dinding "02:00" menyala tepat di kata "Jam"
        breakAt: 'w:bocor',
        alert: { k: '!! PERINGATAN KRITIS', title: 'DATA BOCOR', sub: 'data pelanggan · 1.284 baris terekspos' },
        shake: ['w:bocor'],
        fx: [
          { kind: 'flicker', at: 0, dur: 0.3 },
          { kind: 'glitch', at: 0, dur: 0.3, amt: 0.5 },
          { kind: 'glitch', at: 'w:bocor', dur: 0.6, amt: 1 },
          { kind: 'punch', at: 'w:bocor', amt: 0.12 },
          { kind: 'flash', at: 'w:bocor', color: '255,30,50', amt: 0.55, dur: 0.35 },
          { kind: 'glitchIn', at: 'end-0.22', dur: 0.22, amt: 1 },
        ],
      },
    },
    {
      id: 's2', min: 6, voDelay: 0.25, theme: 'noir', mus: 'tense',
      vo: 'Pemberitahuan tertulis ke subjek data dan lembaga wajib dikirim paling lambat tiga kali dua puluh empat jam.',
      sfx: [
        [0.12, 'blip', 0.5],
        ['w:subjek', 'tick', 0.5], ['w:lembaga', 'tick', 0.5],
        ['w:paling', 'impact', 0.8], ['w:paling', 'stamp', 0.6],
        ['w:tiga', 'hit', 0.35], ['w:dua', 'hit', 0.35], ['w:jam', 'hit', 0.5],
        ['end-0.18', 'glitch', 0.55],
      ],
      vis: {
        type: 'bomb', enter: 'none', exit: 'none', push: 0.04,
        label: 'BATAS PEMBERITAHUAN TERTULIS', state: 'AKTIF', hours: 72, on: 0.12, start: 'w:dikirim',
        kicker: 'KEWAJIBAN', title: 'Pemberitahuan tertulis', titleAt: 'w:Pemberitahuan',
        to: [{ text: 'Subjek data', icon: 'user', at: 'w:subjek' }, { text: 'Lembaga', icon: 'building', at: 'w:lembaga' }],
        stamp: { text: 'PALING LAMBAT', at: 'w:paling' },
        big: [{ text: '3', at: 'w:tiga' }, { text: '×', at: 'w:kali' }, { text: '24', at: 'w:dua' }, { text: 'JAM', at: 'w:jam' }],
        ref: 'UU PDP Ps. 46 jo. PP 33/2026 Ps. 114', refAt: 'w:wajib',
        shake: ['w:paling', 'w:jam'],
        fx: [
          { kind: 'glitch', at: 0, dur: 0.28, amt: 1 },
          { kind: 'punch', at: 'w:paling', amt: 0.08 },
          { kind: 'flash', at: 'w:paling', color: '255,30,50', amt: 0.3, dur: 0.25 },
          { kind: 'punch', at: 'w:jam', amt: 0.05 },
          { kind: 'glitchIn', at: 'end-0.2', dur: 0.2, amt: 1 },
        ],
      },
    },
    {
      id: 's3', min: 3.5, voDelay: 0.2, theme: 'noir', mus: 'tense',
      vo: 'Tapi siapa pegang apa? Templatnya di mana?',
      sfx: [
        ...[0.03, 0.1, 0.17, 0.24, 0.31, 0.38, 0.45, 0.52].map((t) => [t, 'pop', 0.28]),
        ['w:siapa', 'hit', 0.7], ['w:pegang', 'hit', 0.5], ['w:apa', 'hit', 0.75],
        ['w:apa+0.45', 'crickets', 0.6],
        ['w:Templatnya', 'vineboom', 1.0],
        ['w:Templatnya+0.45', 'tick', 0.4], ['w:Templatnya+0.57', 'tick', 0.4], ['w:Templatnya+0.69', 'tick', 0.4], ['w:Templatnya+0.81', 'tick', 0.45],
        ['end-0.52', 'suck', 0.75],
      ],
      vis: {
        type: 'chaos', enter: 'none', exit: 'none', push: 0.05,
        pov: { text: 'POV: kamu Tim IT, jam 2 pagi', emoji: '😰', at: 0.08 },
        items: [
          { kind: 'chat', from: 'Direksi', text: 'Siapa yang lapor ke lembaga??', time: '02:03', at: 0.03, pos: { h: [100, 214], v: [60, 360] }, r: -4 },
          { kind: 'mail', from: 'Legal', text: 'RE: RE: FWD: URGENT!!!', sub: 'Templat suratnya yang mana ya?', at: 0.1, pos: { h: [1250, 230], v: [420, 570] }, r: 3 },
          { kind: 'file', text: 'templat_FINAL_baru.docx', at: 0.17, pos: { h: [130, 730], v: [50, 780] }, r: 5 },
          { kind: 'call', text: '7 panggilan tak terjawab', from: 'Direktur Utama', at: 0.24, pos: { h: [1300, 720], v: [500, 940] }, r: -3 },
          { kind: 'note', text: 'LAPOR 3×24 JAM?!', at: 0.31, pos: { h: [1550, 460], v: [720, 330] }, r: 7 },
          { kind: 'chat', from: 'CS', text: 'Pelanggan mulai ramai di medsos 😭', time: '02:05', at: 0.38, pos: { h: [660, 820], v: [80, 1090] }, r: 2 },
          { kind: 'file', text: 'kronologi_v3_revisi.xlsx', at: 0.45, pos: { h: [700, 214], v: [470, 1210] }, r: -5 },
          { kind: 'mail', from: 'PPDP', text: 'Draft surat ke subjek data??', sub: 'Siapa yang tanda tangan?', at: 0.52, pos: { h: [80, 450], v: [100, 1250] }, r: -2 },
        ],
        words: [{ text: 'SIAPA', at: 'w:siapa' }, { text: 'PEGANG', at: 'w:pegang' }, { text: 'APA?', at: 'w:apa' }],
        // meme "dibaca doang": pesan di grup dibaca 14 orang, tak ada yang membalas → jangkrik
        seen: { text: '✓✓ Dibaca 14 orang · 0 balasan', emoji: '🦗', at: 'w:apa+0.4' },
        ask: [{ text: 'TEMPLATNYA', at: 'w:Templatnya' }, { text: 'DI MANA?', at: 'w:di' }],
        search: { q: 'templat', at: 'w:Templatnya+0.3', step: 0.12, files: ['templat_FINAL.docx', 'templat_FINAL_baru.docx', 'templat_FINAL_baru_REVISI(2).docx', 'templat_FINAL_FINAL_pakai-ini.docx'] },
        shake: ['w:siapa', 'w:apa', 'w:Templatnya'],
        fx: [
          { kind: 'glitch', at: 0, dur: 0.26, amt: 1 },
          { kind: 'punch', at: 'w:siapa', amt: 0.06 }, { kind: 'punch', at: 'w:pegang', amt: 0.04 }, { kind: 'punch', at: 'w:apa', amt: 0.07 },
          { kind: 'punch', at: 'w:Templatnya', amt: 0.14 },
          { kind: 'flash', at: 'w:Templatnya', color: '255,255,255', amt: 0.35, dur: 0.2 },
          { kind: 'glitch', at: 'w:Templatnya', dur: 0.35, amt: 0.6 },
        ],
      },
    },
    {
      id: 's4', min: 8, voDelay: 0.5, theme: 'calm', mus: 'main',
      vo: 'Di Privasimu Nexus, begitu insiden dicatat, daftar periksa penahanan dan linimasa langsung tersedia. Hitung mundurnya berjalan di layar, lengkap dengan pembagian peran dan templat pemberitahuan.',
      sfx: [
        [0.02, 'sweep', 0.45], [0.32, 'shimmer', 0.55],
        ['w:Nexus+0.45', 'whoosh', 0.4],
        ['w:dicatat+0.3', 'check', 0.5],
        ['w:daftar+0.3', 'check', 0.5], ['w:linimasa+0.3', 'check', 0.5], ['w:Hitung+0.3', 'check', 0.5],
        ['w:pembagian+0.3', 'check', 0.5], ['w:templat+0.3', 'check', 0.55],
        ['w:linimasa', 'key', 0.45], ['w:pembagian', 'key', 0.45], ['w:templat', 'key', 0.45], // klik kursor
        ['w:Hitung', 'clock', 0.5], ['w:Hitung+0.5', 'tock', 0.4],
      ],
      vis: {
        type: 'monitor', enter: 'none', push: 0,
        title: 'Privasimu Nexus · Manajemen Insiden', status: 'Terkendali',
        dockAt: 'w:Nexus+0.45',
        // screenshot ASLI (resolusi 1x — tampil maks 1,4x). Koordinat region/hl dalam piksel gambar: [x, y, lebar, tinggi]
        imgs: {
          list: { src: '../assets/app/breach-list-baru.png', w: 1440, h: 900 },
          detail: { src: '../assets/app/breach-detail.png', w: 1264, h: 790 },
        },
        // region = bidang kamera 16:9, rv = 9:16; hl/hlv = kotak sorotan (muncul di hlAt, bawaan: setelah kamera tiba)
        shots: [
          { at: 'w:Nexus+0.45', img: 'list', region: [282, 50, 930, 360], rv: [282, 160, 686, 220], hl: [284, 203, 1132, 48], hlAt: 'w:insiden', label: 'Insiden tercatat · kode BRC otomatis' },
          { at: 'w:daftar', img: 'detail', region: [290, 365, 946, 425], rv: [300, 470, 686, 320], hl: [300, 598, 926, 192], hlv: [300, 598, 686, 192], label: 'Daftar periksa tiap fase' },
          { at: 'w:linimasa', img: 'detail', region: [290, 150, 946, 310], rv: [290, 150, 686, 200] },
          { at: 'w:Hitung', img: 'detail', region: [290, 150, 946, 310], rv: [290, 150, 686, 200], hl: [458, 175, 132, 31], label: 'Wajib notifikasi · 3×24 jam' },
          { at: 'w:pembagian', img: 'detail', region: [290, 150, 946, 310], rv: [290, 150, 686, 200] },
        ],
        // kartu aksi insiden (screenshot asli) yang muncul di depan monitor; sorotan + kursor pindah antar tombol
        pop: {
          src: '../assets/app/breach-aksi.png', w: 1002, h: 150, crop: [27, 11, 946, 126], at: 'w:linimasa',
          hls: [
            { at: 'w:linimasa', box: [287, 27, 120, 44], label: 'Linimasa' },
            { at: 'w:Hitung', box: null },
            { at: 'w:pembagian', box: [417, 27, 141, 44], label: 'Pembagian peran (RACI)' },
            { at: 'w:templat', box: [47, 27, 230, 44], label: 'Templat pemberitahuan' },
          ],
        },
        ring: { at: 'w:Hitung', hours: 72, label: 'BATAS 3×24 JAM' },
        feats: [
          { text: 'Insiden tercatat', at: 'w:dicatat' },
          { text: 'Daftar periksa penahanan', at: 'w:daftar' },
          { text: 'Linimasa', at: 'w:linimasa' },
          { text: 'Hitung mundur 3×24 jam', at: 'w:Hitung' },
          { text: 'Pembagian peran (RACI)', at: 'w:pembagian' },
          { text: 'Templat pemberitahuan', at: 'w:templat' },
        ],
      },
    },
    {
      id: 's5', min: 4, voDelay: 0.2, theme: 'calm', mus: 'main',
      vo: 'Tim pun bisa berlatih lewat simulasi, sebelum kejadian sungguhan.',
      sfx: [
        [0.05, 'whoosh', 0.35],
        ['w:berlatih', 'pop', 0.45], ['w:lewat', 'pop', 0.4], ['w:simulasi', 'pop', 0.45],
        ['w:sebelum', 'check', 0.5], ['w:sebelum+0.15', 'check', 0.4],
        ['w:sungguhan', 'stamp', 0.7],
      ],
      vis: {
        type: 'briefing',
        kicker: 'MISSION BRIEFING', mode: 'MODE LATIHAN',
        // banner asli halaman Fire Drill (1240×260), dipotong ke spanduk merahnya
        banner: { src: '../assets/app/fire-drill-header.png', w: 1240, h: 260, crop: [80, 68, 1140, 125], cropV: [80, 68, 700, 125] },
        rows: [
          { k: 'SKENARIO', v: 'Kebocoran data pelanggan', at: 'w:Tim' },
          { k: 'FORMAT', tags: [{ text: 'Kuis', at: 'w:berlatih' }, { text: 'Tabletop', at: 'w:lewat' }, { text: 'Walkthrough', at: 'w:simulasi' }] },
          { k: 'PENILAIAN', v: 'Rubrik tim & tindak lanjut', at: 'w:sebelum' },
        ],
        team: [{ n: 'IT', r: 'Keamanan TI' }, { n: 'DPO', r: 'PPDP' }, { n: 'LG', r: 'Legal' }, { n: 'PR', r: 'Humas' }], teamAt: 'w:sebelum',
        stamp: { text: 'LATIHAN', sub: 'sebelum kejadian sungguhan', at: 'w:sungguhan' },
      },
    },
    {
      id: 's6', min: 6, voDelay: 0.3, theme: 'calm', mus: 'outro',
      vo: 'Privasimu Nexus. Siap sebelum jam mulai berdetak. Kunjungi privasimu dot com.',
      sfx: [['w:Nexus', 'shimmer', 0.5], ['w:berdetak', 'tock', 0.7]],
      vis: {
        type: 'cta', nexus: true, btnAt: 'w:Kunjungi',
        lines: [{ text: 'Siap sebelum', size: 'sm', at: 'w:Siap' }, { text: 'jam mulai *berdetak.*', at: 'w:jam' }],
        foot: 'support@privasimu.com · 0851 8318 2722',
        chips: ['Schedule Demo', 'Start Pre Check · gratis'], chipsAt: 'w:privasimu#2',
        tickAt: 'w:berdetak',
      },
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
