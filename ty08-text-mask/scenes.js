// TY08 — TEXT MASK "Ada Apa di Dalam Empat Huruf Ini?": singkatan raksasa jadi jendela; layar aplikasi asli terlihat di
// dalam badan hurufnya, lalu kamera masuk ke satu huruf sampai huruf itu menjadi layar penuh.
// Hook (anomali): "RoPA. Empat huruf. Isinya: semua yang kantormu lakukan terhadap data pribadi."
// Komposisi: 80% edukasi · 20% meme. Satu gaya: huruf sebagai masker (clip-path teks) + zoom masuk ke badan huruf.
// vis.ke: [indeks huruf, posisi x di dalam huruf (0–1), posisi y (0 = atas huruf, 1 = garis dasar)] = titik tujuan kamera.
(function (root) {
  const CONFIG = {
    title: 'TY08 · Ada Apa di Dalam Empat Huruf Ini? (text mask)',
    naskah: 'TY08',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.35,
    beat: 60 / 104 / 2,
    tail: 0.35,
    burnCaptions: false, // kalimat VO tampil di pita bawah; .srt tetap dibuat
    capMap: [['de-pe-i-a', 'DPIA'], ['de-es-er', 'DSR']],
    music: { bpm: 104, mode: 'minor', root: 50, lead: 'pluck', drums: 'full', sonic: true },
    mix: { duckTo: 0.4, musicGain: 0.8 },
    meta: {
      judul: 'Ada Apa di Dalam Empat Huruf Ini?',
      gaya: 'Text mask (layar di dalam huruf)',
      tampilan: 'singkatan raksasa di atas navy gelap; isi hurufnya adalah layar aplikasi asli; kamera masuk ke satu huruf sampai jadi layar penuh',
      jenisHook: 'Anomali',
      hook: '"RoPA. Empat huruf. Isinya: semua yang kantormu lakukan terhadap data pribadi."',
      komposisi: '80% edukasi · 20% meme',
      rekam: ['Singkatan dibaca seperti biasa diucapkan: "ropa", "de-pe-i-a", "de-es-er".'],
      fakta: [
        'RoPA = catatan kegiatan pemrosesan (UU PDP mewajibkan perekaman kegiatan pemrosesan); di Nexus berupa satu register terpusat dengan kode rekaman otomatis (fakta_produk.json: ropa).',
        'DPIA: matriks kemungkinan × dampak 5×5, satu matriks yang sama untuk semua penilai (fakta_produk.json: dpia).',
        'DSR: tenggat otomatis 72 jam sejak permohonan dicatat (fakta_produk.json: dsr).',
        'Layar yang tampil = layar asli (ropa-list-baru, dpia-risiko, dsr-detail), dipotong tanpa nama organisasi; isinya data demo.',
      ],
    },
  };
  const M = (o) => ({ type: 'tk', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 6, voDelay: 0.3, mus: 'hook',
      vo: 'RoPA. Empat huruf. Isinya: semua yang kantormu lakukan terhadap data pribadi.',
      layar: 'Kata RoPA raksasa; di dalam hurufnya terlihat register RoPA asli. Di "Isinya" kamera masuk ke huruf R sampai layar penuh.',
      sfx: [['w:Isinya-0.05', 'riser', 0.35], ['w:Isinya+1.0', 'impact', 0.45]],
      vis: M({
        kata: 'RoPA', ke: [0, 0.29, 0.8], masuk: 'w:Isinya-0.05', bawah: 'Empat huruf.', bawahAt: 'w:Empat',
        layar: 'ropa-list-baru', potong: { h: [280, 60, 1140, 470], v: [280, 60, 770, 470] }, judul: 'Register RoPA',
        teks: 'Isinya: *semua* yang kantormu lakukan terhadap data pribadi.',
      }),
    },
    {
      id: 's2', min: 4, voDelay: 0.25, mus: 'main',
      vo: 'de-pe-i-a. Risikonya dinilai dengan satu matriks.',
      layar: 'Kata DPIA raksasa berisi layar penilaian risiko asli; kamera masuk ke huruf D.',
      sfx: [[0.02, 'whoosh', 0.35], ['w:Risikonya-0.05', 'riser', 0.3], ['w:Risikonya+1.0', 'impact', 0.4]],
      vis: M({
        kata: 'DPIA', ke: [0, 0.24, 0.5], masuk: 'w:Risikonya-0.05',
        layar: 'dpia-risiko', potong: { h: [288, 168, 950, 500], v: [570, 168, 668, 500] }, judul: 'DPIA · Potensi Risiko',
        teks: 'Risikonya dinilai dengan *satu matriks*.',
      }),
    },
    {
      id: 's3', min: 4, voDelay: 0.25, mus: 'main',
      vo: 'de-es-er. Tenggat tujuh puluh dua jam, dihitung otomatis.',
      layar: 'Kata DSR raksasa berisi layar detail permohonan asli; kamera masuk ke huruf D. Pil tenggat diperbesar.',
      sfx: [[0.02, 'whoosh', 0.35], ['w:Tenggat-0.05', 'riser', 0.3], ['w:Tenggat+1.0', 'impact', 0.4]],
      vis: M({
        kata: 'DSR', ke: [0, 0.24, 0.5], masuk: 'w:Tenggat-0.05',
        layar: 'dsr-detail', potong: { h: [25, 82, 955, 140], v: [25, 82, 560, 140] }, lensa: [852, 100, 126, 46], judul: 'DSR · Detail permohonan',
        teks: 'Tenggat *72 jam*, dihitung otomatis.',
      }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Tiga singkatan, satu platform. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo Privasimu Nexus, "Tiga singkatan, satu platform.", tombol privasimu.com, kontak.',
      sfx: [[0.05, 'whoosh', 0.3], ['w:Cek', 'pop', 0.4]],
      vis: { type: 'pd_cta', enter: 'none', tag: 'Tiga singkatan,|*satu platform*.', at: 0.15, btnAt: 'w:Cek', tirai: false },
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
