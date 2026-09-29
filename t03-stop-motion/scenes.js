// T03 — STOP MOTION TYPOGRAPHY "Rating Kebiasaan Data di Kantor": papan gabus, huruf guntingan (ransom), sticky note
// spidol, kertas ketik, stempel tinta. Semua bergerak 12 fps (tiap objek bergetar kecil per langkah, seperti diambil
// frame demi frame). Hook relate (format rating jujur): papan terisi kebiasaan buruk + nilainya (1/10, 2/10, 3/10, 0/10)
// → "Terus, siapa yang dapat sepuluh?" → papan disapu bersih → kartu Privasimu Nexus rapi + stempel 10/10 → CTA.
// Objek: { id, k: ransom|strip|sticky|monitor|bubble|flash|cal|stamp|card|logo|type, at: cue, ... } — posisi per format di style.js.
(function (root) {
  const CONFIG = {
    title: 'T03 · Stop Motion: Rating Kebiasaan Data',
    naskah: 'T03',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 104,
    tail: 0.45,
    burnCaptions: false, // semua ucapan sudah tertulis di papan; .srt tetap dibuat
    music: { bpm: 104, mode: 'major', root: 60, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.4 },
    capMap: [['sepuluh dari sepuluh', '10/10']],
  };
  const S = (focus, objs, extra = {}) => ({ type: 'sm', enter: 'none', exit: 'none', push: 0, focus, objs, ...extra });
  const LET = (at, n, name = 'tick', g = 0.3) => Array.from({ length: n }, (_, i) => [typeof at === 'number' ? at + i / 12 : `${at}+${(i / 12).toFixed(3)}`, name, g]);

  const SCENES = [
    {
      id: 's1', min: 3.4, voDelay: 0.5, mus: 'play',
      vo: 'Rating kebiasaan data di kantor. Jujur, ya.',
      sfx: [[0, 'shutter', 0.5], ...LET(0, 6, 'paper', 0.25), ['w:kebiasaan', 'paper', 0.4], ['w:Jujur', 'pop', 0.45]],
      vis: S('title', [
        { id: 'rating', k: 'ransom', text: 'RATING', at: 0 },
        { id: 'strip1', k: 'strip', text: 'kebiasaan data di kantor', at: 'w:kebiasaan' },
        { id: 'jujur', k: 'sticky', color: 'p', lines: [['JUJUR,', 'mk xl'], ['ya.', 'mk lg']], at: 'w:Jujur', pin: 'tape' },
      ]),
    },
    {
      id: 's2', min: 4, voDelay: 0.3, mus: 'play',
      vo: 'Password ditempel di monitor. Satu dari sepuluh.',
      sfx: [['w:Password', 'paper', 0.4], ['w:Satu', 'stamp', 0.7], ['w:Satu+0.25', 'buzzer', 0.35]],
      vis: S('n1', [
        { id: 'mon', k: 'monitor', at: 0.15 },
        { id: 'pw', k: 'sticky', color: 'y', lines: [['PASSWORD:', 'mk sm'], ['admin123', 'mk xl'], ['jgn dibuang!!', 'hw md']], at: 'w:Password', pin: 'tape' },
        { id: 'st1', k: 'stamp', text: '1/10', color: 'red', at: 'w:Satu' },
      ]),
    },
    {
      id: 's3', min: 4.5, voDelay: 0.3, mus: 'play',
      vo: 'Kirim foto KTP pelanggan lewat grup. Dua dari sepuluh.',
      sfx: [['w:Kirim', 'paper', 0.4], ['w:foto', 'pop', 0.3], ['w:Dua', 'stamp', 0.7], ['w:Dua+0.25', 'crickets', 0.4]],
      vis: S('n2', [
        { id: 'bub', k: 'bubble', head: 'Grup Kantor (128)', text: '📎 foto_ktp_pelanggan.jpg', sub: 'terkirim ✓✓', at: 'w:Kirim', typeAt: 'w:foto' },
        { id: 'st2', k: 'stamp', text: '2/10', color: 'red', at: 'w:Dua' },
      ]),
    },
    {
      id: 's4', min: 5, voDelay: 0.3, mus: 'play',
      vo: 'RoPA final final revisi, disimpan di flashdisk. Tiga dari sepuluh.',
      sfx: [['w:RoPA', 'paper', 0.4], ['w:flashdisk', 'pop', 0.4], ['w:Tiga', 'stamp', 0.7], ['w:Tiga+0.25', 'error', 0.4]],
      vis: S('n3', [
        { id: 'fd', k: 'flash', tag: 'RoPA_FINAL_final_revisi (1).xlsx', at: 'w:RoPA', tagAt: 'w:final' },
        { id: 'st3', k: 'stamp', text: '3/10', color: 'red', at: 'w:Tiga' },
      ]),
    },
    {
      id: 's5', min: 4.4, voDelay: 0.3, tail: 0.8, mus: 'hush',
      vo: 'Lapor insiden? Nanti saja, habis rapat. Nol.',
      sfx: [['w:Lapor', 'paper', 0.4], ['w:rapat', 'pop', 0.35], ['w:Nol', 'stamp', 0.9], ['w:Nol+0.2', 'sadtrombone', 0.45]],
      vis: S('n4', [
        { id: 'cal', k: 'cal', big: '3×24 JAM', sub: 'batas lapor insiden', at: 'w:Lapor', scribble: 'nanti aja, habis rapat', scribbleAt: 'w:Nanti' },
        { id: 'rapat', k: 'sticky', color: 'b', lines: [['Rapat lagi', 'hw lg'], ['jam 3 ☕', 'hw lg']], at: 'w:rapat', pin: 'red' },
        { id: 'st4', k: 'stamp', text: '0/10', color: 'red', big: true, at: 'w:Nol' },
      ]),
    },
    {
      id: 's6', min: 3, voDelay: 0.35, tail: 0.9, mus: 'tense',
      vo: 'Terus, siapa yang dapat sepuluh?',
      sfx: [[0.35, 'whoosh', 0.3], ['w:sepuluh+0.35', 'sweep', 0.5], ['w:sepuluh+0.45', 'paper', 0.5], ['w:sepuluh+0.6', 'paper', 0.4]],
      vis: S('all', [], { sweepAt: 'w:sepuluh+0.35' }),
    },
    {
      id: 's7', min: 7, voDelay: 0.3, tail: 0.6, mus: 'main',
      vo: 'Kantor yang semuanya tercatat di Privasimu Nexus: RoPA rapi, tenggat terpantau, bukti siap diperiksa. Sepuluh dari sepuluh.',
      sfx: [[0.1, 'shutter', 0.4], ['w:Kantor', 'paper', 0.45], ['w:RoPA', 'key', 0.35], ['w:tenggat', 'key', 0.35], ['w:bukti', 'key', 0.35], ['w:Sepuluh', 'stamp', 0.8], ['w:Sepuluh+0.2', 'tada', 0.5]],
      vis: S('nexus', [
        { id: 'card', k: 'card', at: 'w:Kantor', items: [['RoPA rapi di satu register', 'w:RoPA'], ['Tenggat DSR terpantau', 'w:tenggat'], ['Bukti siap diperiksa', 'w:bukti']] },
        { id: 'st10', k: 'stamp', text: '10/10', color: 'blue', big: true, at: 'w:Sepuluh' },
      ]),
    },
    {
      id: 's8', min: 6, voDelay: 0.3, tail: 1.7, mus: 'outro',
      vo: 'Naikkan nilai kantormu. Cek kesiapan gratis di privasimu dot com.',
      sfx: [['w:Naikkan', 'paper', 0.4], ['w:Cek', 'pop', 0.45], ...LET('w:privasimu', 13, 'paper', 0.18)],
      vis: S('cta', [
        { id: 'strip2', k: 'strip', text: 'Naikkan nilai kantormu.', at: 'w:Naikkan' },
        { id: 'url', k: 'ransom', text: 'PRIVASIMU.COM', at: 'w:privasimu', small: true },
        { id: 'cek', k: 'sticky', color: 'y', lines: [['Cek kesiapan', 'mk md'], ['GRATIS!', 'mk xl']], at: 'w:Cek', pin: 'red' },
        { id: 'kontak', k: 'type', text: 'support@privasimu.com · 0851 8318 2722', at: 'w:dot' },
      ], { cardTo: true }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
