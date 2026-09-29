// A22 — "Rekap Tahunan DPO 2026": format rekap akhir tahun ala slide cerita (tanpa meniru merek/warna/font layanan musik).
// Hook (relate): "Rekap tahunan DPO 2026 kamu sudah siap." Angka lucu = ILUSTRASI (diberi label di layar).
(function (root) {
  const CONFIG = {
    title: 'A22 · Rekap Tahunan DPO 2026',
    naskah: 'A22',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+12%',
    maxPause: 0.3,
    beat: 60 / 118 / 2,
    tail: 0.5,
    music: { bpm: 118, mode: 'major', root: 60, lead: 'bell', drums: 'full', sonic: true },
    mix: { duckTo: 0.45 },
    capMap: [['dua belas ribu empat ratus delapan puluh', '12.480']],
  };
  const CUT = { enter: 'none', exit: 'none' }; // transisi geser ala slide cerita ditangani style.js

  const SCENES = [
    {
      id: 's1', min: 4, voDelay: 0.8, tail: 0.6, mus: 'play',
      vo: 'Rekap tahunan DPO dua ribu dua puluh enam kamu, sudah siap.',
      sfx: [[0.1, 'riser', 0.35], [0.7, 'reveal', 0.5], ['w:siap', 'tada', 0.6], ['w:siap+0.05', 'pop', 0.4], ['w:siap+0.2', 'pop', 0.35]],
      vis: { type: 'r_buka', ...CUT, openAt: 0.7, titleAt: 'w:Rekap', boomAt: 'w:siap' },
    },
    {
      id: 's2', min: 4.5, voDelay: 0.3, tail: 1.2, mus: 'play',
      vo: 'Kalimat yang paling sering kamu ketik tahun ini: tolong isi form-nya, ya.',
      sfx: [[0.05, 'whoosh', 0.35], ['w:tolong', 'key', 0.25], ['w:tolong+0.1', 'key', 0.22], ['w:tolong+0.2', 'key', 0.25], ['w:isi', 'key', 0.22], ['w:form-nya', 'key', 0.25],
        ['w:ya#2', 'pop', 0.45], ['w:ya#2+0.3', 'coin', 0.4]],
      vis: { type: 'r_kalimat', ...CUT, labelAt: 0.1, typeAt: 'w:tolong', typeEnd: 'w:ya#2+0.1', countAt: 'w:ya#2+0.2' },
    },
    {
      id: 's3', min: 5, voDelay: 0.3, mus: 'play',
      vo: 'Dua belas ribu empat ratus delapan puluh menit, di rapat: data pribadi itu apa, sih?',
      sfx: [[0.05, 'whoosh', 0.35], [0.3, 'tick', 0.3], [0.45, 'tick', 0.3], [0.6, 'tick', 0.3], [0.75, 'tick', 0.3], [0.9, 'tick', 0.3], ['w:menit', 'ding', 0.45], ['w:sih', 'vineboom', 0.8]],
      vis: { type: 'r_angka', ...CUT, countAt: 0.25, countEnd: 'w:menit', quoteAt: 'w:data', boomAt: 'w:sih' },
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'play',
      vo: 'File favoritmu: RoPA final final versi tiga. Dan saudara kembarnya.',
      sfx: [[0.05, 'whoosh', 0.35], [0.3, 'pop', 0.3], ['w:RoPA', 'pop', 0.5], ['w:saudara', 'pop', 0.4], ['w:kembarnya', 'pop', 0.4], ['w:kembarnya+0.3', 'boing', 0.35]],
      vis: { type: 'r_file', ...CUT, f1At: 'w:RoPA', f2At: 'w:saudara', f3At: 'w:kembarnya' },
    },
    {
      id: 's5', min: 4, voDelay: 0.3, mus: 'play',
      vo: 'Kepribadian DPO-mu tahun ini: si paling revisi.',
      sfx: [[0.05, 'whoosh', 0.35], [0.2, 'pop', 0.35], ['w:si-0.3', 'whoosh', 0.3], ['w:si', 'shimmer', 0.45], ['w:revisi', 'levelup', 0.5]],
      vis: { type: 'r_persona', ...CUT, cardAt: 'w:si', traitAt: 'w:revisi+0.2' },
    },
    {
      id: 's6', min: 6, voDelay: 0.3, mus: 'play',
      vo: 'Tahun depan, PP tiga puluh tiga berlaku enam belas Januari. Bikin rekap dua ribu dua puluh tujuh lebih rapi, bareng Privasimu Nexus.',
      sfx: [[0.05, 'whoosh', 0.35], ['w:Tahun+0.05', 'pop', 0.45], ['w:PP-0.6', 'riser', 0.35], ['w:berlaku', 'impact', 0.45], ['w:Bikin', 'whoosh', 0.35], ['w:Nexus', 'ding', 0.45]],
      vis: { type: 'r_2027', ...CUT, yearAt: 'w:Tahun', ppAt: 'w:berlaku', shotAt: 'w:Bikin', nexusAt: 'w:Privasimu' },
    },
    {
      id: 's7', min: 5, voDelay: 0.3, tail: 1.6, mus: 'outro',
      vo: 'Bagikan rekapmu, dan tag DPO kantormu.',
      sfx: [[0.05, 'whoosh', 0.35], ['w:Bagikan', 'pop', 0.45], ['w:tag', 'tada', 0.5], ['w:tag+0.1', 'pop', 0.35], ['w:tag+0.25', 'pop', 0.35]],
      vis: { type: 'r_share', ...CUT, cardAt: 0.1, tagAt: 'w:tag' },
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
