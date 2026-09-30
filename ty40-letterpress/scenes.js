// TY40 — LETTERPRESS / POSTER HURUF KAYU "PENGUMUMAN": poster pengumuman jadul di kertas tua; tiap baris dicap masuk
// dengan tinta tidak rata, font kayu campur; tanggal berlaku PP 33; program siap PP 33.
// Hook (anomali): "PENGUMUMAN: mulai 16 Januari 2027, 'nanti saja' tidak berlaku."
// Komposisi: 50% edukasi · 50% meme. Satu gaya: beberapa font display + tekstur tinta (bintik hash), masuk seperti dicap.
(function (root) {
  const CONFIG = {
    title: 'TY40 · PENGUMUMAN (letterpress poster kayu)',
    naskah: 'TY40',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+4%',
    maxPause: 0.45,
    beat: 60 / 84 / 2,
    tail: 0.35,
    burnCaptions: false, // teks poster = ucapan
    music: { bpm: 84, mode: 'major', root: 53, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.8 },
    meta: {
      judul: 'PENGUMUMAN',
      gaya: 'Letterpress / poster huruf kayu',
      tampilan: 'poster pengumuman jadul di kertas krem bernoda: huruf kayu besar (Rye, Alfa Slab, Playfair Black) dengan tinta tidak rata, garis hias ganda; tiap baris dicap masuk',
      jenisHook: 'Anomali',
      hook: '"PENGUMUMAN: mulai 16 Januari 2027, \'nanti saja\' tidak berlaku."',
      komposisi: '50% edukasi · 50% meme',
      rekam: ['Dibaca seperti juru warta/pengumuman resmi jadul, tegas dan berirama.'],
      fakta: [
        'PP 33/2026 berlaku 16 Januari 2027. Kewajiban di poster = modul Nexus: RoPA, DPIA, DSR, Consent, Insiden (fakta_produk.json). "Program siap PP 33" = nama program pendampingan; pastikan masih ditawarkan.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const L = (o) => ({ type: 'lp', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4, voDelay: 0.4, mus: 'hook',
      vo: 'Pengumuman. Kepada seluruh pengendali data pribadi.',
      layar: 'Poster kertas tua. Baris "PENGUMUMAN" dicap keras (Rye), lalu "KEPADA SELURUH PENGENDALI DATA PRIBADI" dan garis hias.',
      sfx: [['w:Pengumuman-0.05', 'stamp', 0.6], ['w:Kepada-0.05', 'stamp', 0.4]],
      vis: L({ baris: [[0, 'w:Pengumuman-0.05'], [1, 'w:Kepada-0.05']] }),
    },
    {
      id: 's2', min: 5, voDelay: 0.25, mus: 'tense',
      vo: 'Mulai enam belas Januari dua ribu dua puluh tujuh, nanti saja, tidak berlaku.',
      layar: 'Baris "MULAI 16 JANUARI 2027" (Alfa Slab) dicap; lalu "“NANTI SAJA” TIDAK BERLAKU" merah miring.',
      sfx: [['w:Mulai-0.05', 'stamp', 0.55], ['w:nanti-0.05', 'stamp', 0.6], ['w:berlaku', 'hit', 0.4]],
      vis: L({ baris: [[2, 'w:Mulai-0.05'], [3, 'w:nanti-0.05']] }),
    },
    {
      id: 's3', min: 6, voDelay: 0.25, mus: 'main',
      vo: 'Siapkan: catatan pemrosesan, penilaian dampak, penanganan permohonan, persetujuan, pemberitahuan insiden. Program siap PP tiga puluh tiga.',
      layar: 'Baris "SIAPKAN: RoPA · DPIA · DSR · CONSENT · INSIDEN" dicap per kata; baris terakhir "PROGRAM SIAP PP 33 — privasimu.com".',
      sfx: [['w:catatan', 'stamp', 0.3], ['w:penilaian', 'stamp', 0.3], ['w:penanganan', 'stamp', 0.3], ['w:persetujuan', 'stamp', 0.3], ['w:pemberitahuan', 'stamp', 0.3], ['w:Program-0.05', 'stamp', 0.5]],
      vis: L({ baris: [[4, 'w:Siapkan'], [5, 'w:Program-0.05']], kata: ['w:catatan', 'w:penilaian', 'w:penanganan', 'w:persetujuan', 'w:pemberitahuan'] }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Demikian pengumuman ini. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup bergaya poster: logo, "Demikian pengumuman ini.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: L({ cta: { terang: true, tag: 'Demikian|*pengumuman ini*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
