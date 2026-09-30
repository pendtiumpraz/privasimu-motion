// SN13 — PELUNCURAN ROKET "Nilai Dulu, Baru Meluncur": landasan peluncuran fajar, roket garis sederhana berlabel
// PROYEK BARU; hitung mundur besar 3-2-… berhenti: HOLD "DPIA?"; kartu wizard DPIA asli (Potensi Risiko) → GO →
// roket meluncur dengan asap partikel & guncangan kamera; CTA.
// Hook (anomali): "Proyek paling berisiko di kantormu biasanya yang paling ditunggu-tunggu."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: sinematik peluncuran (hitung mundur, asap, guncangan).
(function (root) {
  const CONFIG = {
    title: 'SN13 · Nilai Dulu, Baru Meluncur (peluncuran roket)',
    naskah: 'SN13',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+6%',
    maxPause: 0.5,
    beat: 60 / 120 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 120, mode: 'minor', root: 50, lead: 'keys', drums: 'full', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.75 },
    meta: {
      judul: 'Nilai Dulu, Baru Meluncur',
      gaya: 'Peluncuran roket',
      tampilan: 'langit fajar ungu-jingga, landasan & menara garis, roket putih sederhana berlabel PROYEK BARU; angka hitung mundur raksasa Orbitron; HOLD merah "DPIA?"; GO hijau; asap partikel, api berkedip, guncangan kamera saat lepas landas',
      jenisHook: 'Anomali',
      hook: '"Proyek paling berisiko di kantormu biasanya yang paling ditunggu-tunggu."',
      komposisi: '70% edukasi · 30% meme',
      rekam: ['dpia-risiko'],
      fakta: [
        'DPIA (fakta_produk.json): matriks kemungkinan × dampak 5×5; register risiko dengan rencana mitigasi; draf otomatis dari RoPA berisiko TINGGI; kode DPIA-TAHUN-NOMOR.',
        'Kartu "Potensi Risiko · Section 3 of 4" = tangkapan asli assets/app/dpia-risiko.png (header organisasi dipotong).',
        'Roket & proyek = ilustrasi; tanpa lembaga antariksa/merek.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const R = (o) => ({ type: 'rk', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.5, mus: 'hush',
      vo: 'Proyek paling berisiko di kantormu… biasanya yang paling ditunggu-tunggu.',
      layar: 'Landasan fajar; roket berlabel PROYEK BARU berdiri di menara; papan "PELUNCURAN HARI INI"; lampu landasan berkedip.',
      sfx: [[0.1, 'whoosh', 0.3], ['w:ditunggu-tunggu', 'tick', 0.25]],
      vis: R({ mulai: 0.05, teks: 'Proyek paling berisiko… *paling ditunggu-tunggu*.' }),
    },
    {
      id: 's2', min: 5.5, voDelay: 0.4, mus: 'tense',
      vo: 'Tiga. Dua. Sa— tunggu. DPIA-nya?',
      layar: 'Hitung mundur raksasa 3 → 2 → "1" terpotong: layar merah HOLD, label "DPIA?"; alarm.',
      sfx: [['w:Tiga', 'tick', 0.45], ['w:Dua', 'tick', 0.45], ['w:tunggu-0.1', 'hit', 0.5], ['w:DPIA-nya', 'hit', 0.35]],
      vis: R({ hitung: [['w:Tiga', '3'], ['w:Dua', '2'], ['w:Sa—', '1']], hold: 'w:tunggu-0.1' }),
    },
    {
      id: 's3', min: 7, voDelay: 0.3, mus: 'main',
      vo: 'Di Privasimu Nexus, DPIA dinilai dulu: matriks kemungkinan kali dampak, register risiko, rencana mitigasi. Selesai? GO. Meluncur.',
      layar: 'Kartu asli wizard DPIA "Potensi Risiko" masuk; pada "GO" layar hijau GO; pada "Meluncur" roket lepas landas: api, asap partikel, kamera berguncang, tulisan LIFT-OFF.',
      sfx: [['w:Di', 'whoosh', 0.35], ['w:matriks', 'tick', 0.25], ['w:register', 'tick', 0.25], ['w:rencana', 'tick', 0.25], ['w:GO', 'ding', 0.45], ['w:Meluncur', 'hit', 0.6], ['w:Meluncur+0.2', 'whoosh', 0.6]],
      vis: R({ layar: { nama: 'dpia-risiko', potong: [570, 170, 665, 480], at: 'w:Di', judul: 'DPIA · Potensi Risiko', sampai: 'w:GO-0.2' }, go: 'w:GO', luncur: 'w:Meluncur' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Nilai dulu, baru meluncur. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Nilai dulu, baru meluncur.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: R({ cta: { tag: 'Nilai dulu,|*baru meluncur*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
