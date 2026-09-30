// GB27 — LABIRIN "Mencari Satu Dokumen": labirin dari atas; garis pencari menyusuri lorong, buntu (kedip merah dengan
// label "Folder tim", "Email 2023", "Laptop lama"), balik, buntu lagi; di Nexus dinding memudar dan jalur lurus ke
// dokumen bukti tergambar; kartu rekomendasi GAP asli; CTA.
// Hook (relate): "Beginilah rasanya mencari satu dokumen bukti saat audit."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: labirin grid tetap (dibangkitkan deterministik), jalur = stroke SVG.
(function (root) {
  const CONFIG = {
    title: 'GB27 · Mencari Satu Dokumen (labirin)',
    naskah: 'GB27',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 104 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 104, mode: 'minor', root: 52, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.72 },
    meta: {
      judul: 'Mencari Satu Dokumen',
      gaya: 'Labirin',
      tampilan: 'labirin biru tua dari atas (dinding garis tebal), titik pencari kuning meninggalkan jejak; jalan buntu berkedip merah berlabel; dinding memudar lalu jalur hijau lurus ke ikon dokumen; kartu GAP asli',
      jenisHook: 'Relate',
      hook: '"Beginilah rasanya mencari satu dokumen bukti saat audit."',
      komposisi: '70% edukasi · 30% meme',
      rekam: ['gap-rekomendasi'],
      fakta: [
        'GAP Assessment (fakta_produk.json): analisis dokumen bukti oleh AI per pertanyaan (1 kredit per analisis, hasil dicache); skor kepatuhan dan rencana remediasi.',
        'Kartu "Rekomendasi Perbaikan" = tangkapan asli assets/app/gap-rekomendasi.png (CRITICAL/HIGH/MEDIUM, rekomendasi per pasal).',
        'Label jalan buntu (Folder tim, Email 2023, Laptop lama) = ilustrasi situasi, bukan fitur.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const L = (o) => ({ type: 'lb', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.5, mus: 'hook',
      vo: 'Beginilah rasanya mencari satu dokumen bukti, saat audit.',
      layar: 'Labirin penuh layar; ikon dokumen "Bukti" di ujung; titik pencari mulai berjalan pada "mencari", meninggalkan jejak.',
      sfx: [[0.1, 'whoosh', 0.3], ['w:mencari', 'tick', 0.3]],
      vis: L({ mulai: 'w:mencari', teks: 'Mencari *satu dokumen bukti* saat audit.' }),
    },
    {
      id: 's2', min: 6, voDelay: 0.3, mus: 'tense',
      vo: 'Folder tim. Email lama. Laptop yang sudah diganti. Buntu, balik, buntu lagi.',
      layar: 'Pencari masuk jalan buntu (kedip merah + label "Folder tim" / "Email 2023" / "Laptop lama"), balik, buntu lagi.',
      sfx: [['w:Folder', 'hit', 0.3], ['w:Email', 'hit', 0.3], ['w:Laptop', 'hit', 0.3], ['w:Buntu', 'tick', 0.3], ['w:buntu', 'tick', 0.3]],
      vis: L({ buntu: ['w:Folder', 'w:Email', 'w:Laptop'], teks: 'Buntu. Balik. *Buntu lagi*.' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Di Privasimu Nexus, bukti ditempel per pertanyaan, dianalisis AI, hasilnya tersimpan. Jalurnya lurus.',
      layar: 'Dinding labirin memudar; jalur hijau lurus tergambar dari awal ke dokumen; kartu asli "Rekomendasi Perbaikan" GAP muncul.',
      sfx: [['w:Di', 'whoosh', 0.45], ['w:lurus', 'ding', 0.35], ['w:dianalisis', 'pop', 0.3]],
      vis: L({ lurus: 'w:Di', layar: { nama: 'gap-rekomendasi', potong: [327, 495, 647, 405], at: 'w:dianalisis', judul: 'GAP Assessment · Rekomendasi' } }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Audit bukan labirin, kalau buktinya per pertanyaan. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Audit bukan labirin, kalau bukti per pertanyaan.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: L({ cta: { tag: 'Audit bukan labirin,|*kalau bukti per pertanyaan*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
