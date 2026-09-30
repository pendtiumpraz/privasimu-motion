// SN02 — NEON SIGN "Cooked vs Chill": dinding bata malam, lantai basah memantul; layar terbagi: neon merah COOKED
// berkedip panik (DPO A) · neon biru CHILL tenang (DPO B); baris-baris neon kecil; bedanya = alur insiden yang sudah
// siap (stepper 5 fase asli); CTA.
// Hook (relate): "Jam 3 pagi, insiden. DPO A vs DPO B."
// Komposisi: 40% edukasi · 60% meme. Satu gaya: tulisan tabung neon (text-shadow berlapis, kedip dari hash, pantulan).
(function (root) {
  const CONFIG = {
    title: 'SN02 · Cooked vs Chill (neon sign)',
    naskah: 'SN02',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 96 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 96, mode: 'minor', root: 50, lead: 'keys', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.75 },
    meta: {
      judul: 'Cooked vs Chill',
      gaya: 'Neon sign',
      tampilan: 'dinding bata gelap, lantai basah memantulkan cahaya; kiri neon merah COOKED berkedip tak stabil + baris neon panik; kanan neon biru CHILL stabil + baris neon rapi; jam neon 03:00 di atas; kartu stepper insiden asli',
      jenisHook: 'Relate',
      hook: '"Jam 3 pagi, insiden. DPO A vs DPO B."',
      komposisi: '40% edukasi · 60% meme',
      rekam: ['breach-detail'],
      fakta: [
        'Manajemen Insiden (fakta_produk.json): daftar periksa penahanan & log linimasa dibuat otomatis saat insiden dicatat; penghitung 3×24 jam; matriks RACI; templat pemberitahuan ke subjek data & lembaga.',
        'Stepper 5 fase (Terdeteksi · Assessment · Containment · Notifikasi · Ditutup) = tangkapan asli assets/app/breach-detail.png (header organisasi dipotong).',
        '"DPO A/B" = tokoh fiktif tanpa wajah/nama; "cooked/chill" = bahasa gaul, bukan klaim.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const N = (o) => ({ type: 'ne', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.5, mus: 'hook',
      vo: 'Jam tiga pagi, insiden. DPO A… versus DPO B.',
      layar: 'Jam neon "03:00 · INSIDEN" menyala di atas; neon merah COOKED menyala tersendat (DPO A); neon biru CHILL menyala mulus (DPO B).',
      sfx: [[0.1, 'hit', 0.35], ['w:DPO', 'tick', 0.3], ['w:DPO#2', 'ding', 0.35]],
      vis: N({ jam: 0.1, cooked: 'w:DPO-0.1', chill: 'w:DPO#2-0.1' }),
    },
    {
      id: 's2', min: 6.5, voDelay: 0.3, mus: 'tense',
      vo: 'DPO A: cari nomor siapa yang dihubungi, cari templat, cari apa pun. DPO B: buka Nexus. Daftar periksa ada, linimasa jalan, templat siap.',
      layar: 'Kiri: baris neon merah berkedip "nomor siapa?", "templat?", "lapor ke mana?". Kanan: baris neon biru stabil "checklist ✓", "timeline ✓", "templat ✓".',
      sfx: [['w:cari', 'tick', 0.25], ['w:cari#2', 'tick', 0.25], ['w:cari#3', 'tick', 0.25], ['w:Daftar', 'ding', 0.3], ['w:linimasa', 'ding', 0.3], ['w:templat#2', 'ding', 0.3]],
      vis: N({ merah: ['w:cari', 'w:cari#2', 'w:cari#3'], biru: ['w:Daftar', 'w:linimasa', 'w:templat#2'] }),
    },
    {
      id: 's3', min: 5.5, voDelay: 0.3, mus: 'main',
      vo: 'Bedanya bukan orangnya. Alurnya sudah siap, sebelum jam tiga pagi.',
      layar: 'Neon merah padam, neon biru tetap; kartu asli stepper 5 fase insiden (Terdeteksi → Ditutup) naik di tengah.',
      sfx: [['w:Bedanya', 'whoosh', 0.35], ['w:Alurnya', 'pop', 0.3]],
      vis: N({ padam: 'w:Bedanya', layar: { nama: 'breach-detail', potong: [290, 365, 944, 90], at: 'w:Alurnya', judul: 'Manajemen Insiden · 5 fase' } }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Jam tiga pagi, tetap chill. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Jam 3 pagi: tetap chill.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: N({ cta: { tag: 'Jam 3 pagi:|*tetap chill*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
