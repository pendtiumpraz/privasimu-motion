// SN08 — FILM BISU "Auditor Datang": hitam-putih berkedip, goresan film, kartu teks berornamen; adegan siluet:
// kantor tenang → pintu terbuka, auditor masuk → panik gaya film bisu (gerak patah-patah, kertas beterbangan) →
// kartu "Untung… sudah tercatat." → film berubah berwarna: register RoPA asli → kartu TAMAT + CTA. Iringan piano.
// Hook (relate): "Pada suatu pagi yang tenang… auditor datang."
// Komposisi: 50% edukasi · 50% meme. Satu gaya: film bisu (kartu teks + siluet + flicker). Tanpa wajah/orang nyata.
(function (root) {
  const CONFIG = {
    title: 'SN08 · Auditor Datang (film bisu)',
    naskah: 'SN08',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+4%',
    maxPause: 0.5,
    beat: 60 / 120 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 120, mode: 'minor', root: 57, lead: 'keys', drums: 'none', sonic: true },
    mix: { duckTo: 0.45, musicGain: 0.8 },
    meta: {
      judul: 'Auditor Datang',
      gaya: 'Film bisu (kartu teks)',
      tampilan: 'hitam-putih berkedip dengan goresan film & vinyet tebal; kartu teks hitam berbingkai ornamen dengan huruf serif; adegan siluet kantor (meja, jam, pintu) dan sosok bertopi; gerak patah-patah 12 fps; berubah berwarna saat register RoPA asli muncul',
      jenisHook: 'Relate',
      hook: '"Pada suatu pagi yang tenang… auditor datang."',
      komposisi: '50% edukasi · 50% meme',
      rekam: ['ropa-list-baru'],
      fakta: [
        'RoPA (fakta_produk.json): kode rekaman otomatis ROPA-TAHUN-NOMOR; alur Maker–Reviewer–Approver dengan riwayat perubahan; register = tangkapan asli assets/app/ropa-list-baru.png (5 rekaman tenant uji).',
        'Semua sosok = siluet bentuk sederhana (tanpa wajah/orang nyata); musik piano disintesis (bukan lagu berhak cipta).',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const S = (o) => ({ type: 'fb', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4.5, voDelay: 0.6, mus: 'hush',
      vo: 'Pada suatu pagi yang tenang…',
      layar: 'Kartu teks "Pada suatu pagi yang tenang…"; lalu adegan siluet kantor: sosok di meja, jam dinding berputar.',
      sfx: [[0.1, 'whoosh', 0.25], ['w:tenang+0.4', 'tick', 0.2]],
      vis: S({ kartu: [[0, 0.15, 'w:tenang+0.3']], adeganMulai: [[0, 'w:tenang+0.3']] }),
    },
    {
      id: 's2', min: 4.5, voDelay: 1.4, mus: 'hush',
      vo: 'Auditor datang.',
      layar: 'Pintu terbuka, sosok bertopi berkoper masuk patah-patah; kartu "— Auditor datang. —".',
      sfx: [[0.2, 'hit', 0.3], ['w:datang', 'ding', 0.25]],
      vis: S({ pintu: 0.2, kartu: [[1, 'w:datang+0.4', 'end-0.05']], adeganAkhir: [[0, 'w:datang+0.4']] }),
    },
    {
      id: 's3', min: 6, voDelay: 0.3, mus: 'tense',
      vo: 'RoPA-nya mana? Panik. Laci dibuka. Kertas beterbangan.',
      layar: 'Kartu "RoPA-nya mana?!"; adegan panik: sosok berlari bolak-balik patah-patah, laci terbuka, kertas putih beterbangan, tanda "!!".',
      sfx: [[0.1, 'hit', 0.3], ['w:Panik', 'whoosh', 0.3], ['w:Laci', 'tick', 0.3], ['w:Kertas', 'whoosh', 0.3]],
      vis: S({ kartu: [[2, 0.1, 'w:Panik-0.4']], adeganMulai: [[1, 'w:Panik-0.4']], adeganAkhir: [[1, 'end+9']] }),
    },
    {
      id: 's4', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Untung, sudah tercatat di Privasimu Nexus. Register RoPA lengkap, kode otomatis, siap ditunjukkan.',
      layar: 'Kartu "Untung… sudah tercatat."; film berubah berwarna; kartu register RoPA asli (5 rekaman, kode ROPA-IT-2026-002, dst.).',
      sfx: [[0.1, 'ding', 0.3], ['w:Privasimu', 'whoosh', 0.4], ['w:Register', 'pop', 0.3]],
      vis: S({ kartu: [[3, 0.1, 'w:Privasimu-0.2']], adeganAkhir: [[1, 0.1]], warna: 'w:Privasimu-0.2', layar: { nama: 'ropa-list-baru', potong: [280, 200, 1140, 285], at: 'w:Register-0.3', judul: 'Register RoPA' } }),
    },
    {
      id: 's5', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Jangan tunggu auditor datang. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup bergaya kartu film: "TAMAT — jangan tunggu auditor datang.", logo, tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: S({ cta: { tag: 'TAMAT|*jangan tunggu auditor datang*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
