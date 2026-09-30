// GB11 — INFOGRAFIK ANIMASI "Patuh Itu Bukan Ya/Tidak": sakelar YA/TIDAK yang bolak-balik dicoret ✕ → berubah jadi
// tangga 5 tingkat kematangan; batang per domain tumbuh dengan angka menghitung; donat rata-rata + garis tren kuartal
// + rekomendasi peningkatan (Maturity Assessment); CTA.
// Hook (logika dipatahkan): "'Sudah patuh atau belum?' itu pertanyaan yang salah."
// Komposisi: 80% edukasi · 20% meme. Satu gaya: infografik bersih (batang/donat/garis tumbuh dari data, angka odometer).
(function (root) {
  const CONFIG = {
    title: 'GB11 · Patuh Itu Bukan Ya/Tidak (infografik animasi)',
    naskah: 'GB11',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+9%',
    maxPause: 0.4,
    beat: 60 / 108 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 108, mode: 'major', root: 55, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.7 },
    meta: {
      judul: 'Patuh Itu Bukan Ya/Tidak',
      gaya: 'Infografik animasi',
      tampilan: 'latar putih gading dengan kisi tipis; sakelar besar YA/TIDAK bolak-balik lalu dicoret merah; tangga 5 tingkat kematangan tumbuh; batang horizontal per domain memanjang dengan angka menghitung; donat rata-rata, garis tren kuartal, pil rekomendasi',
      jenisHook: 'Logika dipatahkan',
      hook: '"\'Sudah patuh atau belum?\' itu pertanyaan yang salah."',
      komposisi: '80% edukasi · 20% meme',
      fakta: [
        'Maturity Assessment (fakta_produk.json): penilaian tingkat kematangan per domain; analisis dokumen bukti oleh AI; rekomendasi peningkatan; hasil terukur dan dapat dibandingkan dari waktu ke waktu.',
        'Semua angka (tingkat per domain, rata-rata 2,8 → target 4,0; tren kuartal) = ilustrasi, ditandai *ilustrasi; skala 5 tingkat = kerangka kematangan umum.',
        'Tidak ada tangkapan layar Maturity di assets → tanpa kartu layar produk.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const I = (o) => ({ type: 'ig', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.5, mus: 'hook',
      vo: '"Sudah patuh, atau belum?" Itu pertanyaan yang salah.',
      layar: 'Sakelar raksasa PATUH? YA/TIDAK bolak-balik cepat; pada "salah" coretan ✕ merah menghantam sakelar dan sakelar bergetar.',
      sfx: [[0.1, 'whoosh', 0.25], ['w:Sudah', 'tick', 0.25], ['w:atau', 'tick', 0.25], ['w:belum', 'tick', 0.25], ['w:salah', 'hit', 0.45]],
      vis: I({ sakelar: 0.1, salah: 'w:salah' }),
    },
    {
      id: 's2', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Kematangan itu tangga, bukan sakelar. Tiap domain punya tingkatnya: tata kelola, hak subjek data, insiden, pihak ketiga, pelatihan.',
      layar: 'Sakelar melebur jadi tangga 5 tingkat (Awal → Optimal); batang per domain tumbuh satu per satu dengan angka tingkat menghitung (*ilustrasi).',
      sfx: [['w:tangga', 'whoosh', 0.4], ['w:tata', 'tick', 0.25], ['w:hak', 'tick', 0.25], ['w:insiden', 'tick', 0.25], ['w:pihak', 'tick', 0.25], ['w:pelatihan', 'tick', 0.25]],
      vis: I({ tangga: 'w:tangga-0.2', domain: ['w:tata', 'w:hak', 'w:insiden', 'w:pihak', 'w:pelatihan'] }),
    },
    {
      id: 's3', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Maturity Assessment di Privasimu Nexus mengukur tiap domain, menganalisis bukti dengan AI, memberi rekomendasi. Terukur, bisa dibandingkan tiap kuartal.',
      layar: 'Panel berganti: donat rata-rata 2,8 → target 4,0* mengisi; pil rekomendasi per domain muncul; garis tren Q1–Q4 naik tergambar.',
      sfx: [['w:Maturity', 'whoosh', 0.4], ['w:mengukur', 'ding', 0.3], ['w:rekomendasi', 'pop', 0.3], ['w:kuartal', 'ding', 0.35]],
      vis: I({ nexus: 'w:Maturity', donat: 'w:mengukur', rekom: 'w:rekomendasi', tren: 'w:Terukur' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Bukan ya atau tidak, tapi tingkat berapa. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Bukan ya/tidak, tapi tingkat berapa.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: I({ cta: { tag: 'Bukan ya/tidak,|*tapi tingkat berapa*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
