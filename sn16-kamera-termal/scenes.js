// SN16 — KAMERA TERMAL "Yang Panas": tampilan kamera termal (palet besi: hitam → ungu → merah → kuning → putih) menyapu
// denah kantor; bercak panas berdenyut = pemrosesan berisiko; bidik (reticle) mengunci satu per satu; citra termal
// terkuantisasi jadi grid 5×5 → menyatu dengan DPIA Risk Heatmap asli; CTA.
// Hook (anomali): "Dilihat dengan kamera termal, titik paling panas ada di sini."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: peta warna termal dari medan panas deterministik + HUD kamera.
(function (root) {
  const CONFIG = {
    title: 'SN16 · Yang Panas (kamera termal)',
    naskah: 'SN16',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+6%',
    maxPause: 0.4,
    beat: 60 / 96 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 96, mode: 'minor', root: 50, lead: 'keys', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.72 },
    meta: {
      judul: 'Yang Panas',
      gaya: 'Kamera termal',
      tampilan: 'citra termal palet besi (ungu dingin → merah → kuning → putih panas) atas denah kantor yang bergeser pelan; bercak panas berdenyut; HUD kamera: bidik silang, sudut bingkai, skala warna, kode waktu; kuantisasi 5×5; kartu DPIA Risk Heatmap asli',
      jenisHook: 'Anomali',
      hook: '"Dilihat dengan kamera termal, titik paling panas ada di sini."',
      komposisi: '70% edukasi · 30% meme',
      rekam: ['dashboard-risiko'],
      fakta: [
        'DPIA (fakta_produk.json): matriks kemungkinan × dampak 5×5; register risiko + rencana mitigasi; draf otomatis dari RoPA berisiko TINGGI.',
        'Titik panas & angka (Penggajian karyawan · 4 kategori data; Deteksi kesehatan pasien digital · 9 kategori; Registrasi nasabah; distribusi High 9 · Medium 2 · Low 19 dari 30 RoPA) diambil dari tangkapan asli assets/app/dashboard-risiko.png (tenant uji).',
        'Denah kantor & citra termal = ilustrasi; bukan citra kamera sungguhan.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const Tm = (o) => ({ type: 'tm', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5.5, voDelay: 0.6, mus: 'hush',
      vo: 'Dilihat dengan kamera termal… titik paling panas ada di sini.',
      layar: 'Kamera termal menyala (statis sesaat), menyapu denah kantor; pada "sini" bidik mengunci bercak terpanas: "Penggajian karyawan · HR · 4 kategori data · HIGH".',
      sfx: [[0.1, 'hit', 0.3], ['w:termal', 'tick', 0.25], ['w:sini', 'ding', 0.4]],
      vis: Tm({ nyala: 0.1, bidik: [[0, 'w:sini-0.3']] }),
    },
    {
      id: 's2', min: 6, voDelay: 0.3, mus: 'tense',
      vo: 'Bukan cuma satu. Kesehatan pasien digital. Registrasi nasabah. Sembilan titik panas, dari tiga puluh pemrosesan.',
      layar: 'Bidik melompat ke bercak lain saat disebut (kesehatan pasien · 9 kategori; registrasi nasabah); penghitung HUD naik: HIGH 9 · MED 2 · LOW 19 (n=30).',
      sfx: [['w:Kesehatan', 'tick', 0.3], ['w:Registrasi', 'tick', 0.3], ['w:Sembilan', 'hit', 0.35]],
      vis: Tm({ bidik: [[1, 'w:Kesehatan-0.2'], [2, 'w:Registrasi-0.2']], hitung: 'w:Sembilan' }),
    },
    {
      id: 's3', min: 6.5, voDelay: 0.3, mus: 'main',
      vo: 'Privasimu Nexus memetakannya di matriks lima kali lima: kemungkinan kali dampak, lalu rencana mitigasi. Yang panas, didinginkan dulu.',
      layar: 'Citra termal terkuantisasi jadi grid 5×5 berwarna, lalu kartu asli "DPIA Risk Heatmap (5×5)" menyatu di atasnya; bercak panas meredup ke biru pada "didinginkan".',
      sfx: [['w:matriks', 'whoosh', 0.4], ['w:lima', 'tick', 0.3], ['w:rencana', 'pop', 0.3], ['w:didinginkan', 'ding', 0.4]],
      vis: Tm({ kotak: 'w:matriks-0.2', layar: { nama: 'dashboard-risiko', potong: [28, 84, 545, 386], at: 'w:kemungkinan', judul: 'DPIA Risk Heatmap (5×5)' }, dingin: 'w:didinginkan' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Lihat yang panas, sebelum terbakar. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Lihat yang panas sebelum terbakar.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: Tm({ cta: { tag: 'Lihat yang panas|*sebelum terbakar*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
