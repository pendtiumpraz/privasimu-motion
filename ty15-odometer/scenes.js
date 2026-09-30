// TY15 — ANGKA DIGITAL / ODOMETER "Angka yang Mulai Berjalan": penghitung mundur 72:00:00 dengan digit bergulir vertikal
// (odometer). Mulai berjalan saat insiden dicatat, time-lapse saat tugas fase 1 dikerjakan, berhenti saat pemberitahuan
// terkirim. Layar produk = potongan asli daftar tugas Fase 1 & bilah aksi (Template Pemberitahuan).
// Hook (anomali): "Angka ini mulai berjalan begitu insiden dicatat."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: odometer digit bergulir; angka jam contoh diberi *ilustrasi.
(function (root) {
  const CONFIG = {
    title: 'TY15 · Angka yang Mulai Berjalan (odometer 72 jam)',
    naskah: 'TY15',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+10%',
    maxPause: 0.4,
    beat: 60 / 120 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 120, mode: 'minor', root: 50, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.4, musicGain: 0.7 },
    meta: {
      judul: 'Angka yang Mulai Berjalan',
      gaya: 'Angka digital / odometer',
      tampilan: 'panel odometer gelap dengan sel digit putih bergulir vertikal (72:00:00), label JAM · MENIT · DETIK; kartu tangkapan layar asli di bawahnya; stempel hijau saat berhenti',
      jenisHook: 'Anomali',
      hook: '"Angka ini mulai berjalan begitu insiden dicatat."',
      komposisi: '70% edukasi · 30% meme',
      rekam: ['breach-fase', 'breach-aksi'],
      fakta: [
        'Manajemen Insiden (fakta_produk.json): penghitung mundur batas pemberitahuan 3×24 jam; daftar periksa penahanan & log linimasa dibuat otomatis saat insiden dicatat; templat pemberitahuan tertulis kepada subjek data dan lembaga.',
        'Tugas Fase 1 (tangkapan asli breach-fase.png): tentukan severity, isi deskripsi, estimasi jumlah subjek terdampak, tentukan wajib notifikasi.',
        'Angka jam saat berhenti (mis. 50:xx:xx) hanya contoh → ditandai *ilustrasi.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const O = (o) => ({ type: 'od', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.5, mus: 'hook',
      vo: 'Angka ini mulai berjalan… begitu insiden dicatat.',
      layar: 'Odometer 72:00:00 redup; pada "dicatat" panel menyala dan detik mulai bergulir ke bawah.',
      sfx: [[0.1, 'hit', 0.3], ['w:dicatat', 'ding', 0.35], ['w:dicatat+1', 'tick', 0.25], ['w:dicatat+2', 'tick', 0.25], ['w:dicatat+3', 'tick', 0.25]],
      vis: O({ mulai: 'w:dicatat', teks: 'Angka ini mulai berjalan begitu *insiden dicatat*.' }),
    },
    {
      id: 's2', min: 5, voDelay: 0.3, mus: 'tense',
      vo: 'Tiga kali dua puluh empat jam. Sementara itu, tugas fase satu: severity, deskripsi, jumlah terdampak, wajib notifikasi.',
      layar: 'Kartu asli "Fase 1: Deteksi & Eskalasi" — 4 tugas disorot satu per satu; odometer berputar cepat (time-lapse jam).',
      sfx: [['w:Sementara', 'whoosh', 0.4], ['w:severity', 'tick', 0.3], ['w:deskripsi', 'tick', 0.3], ['w:jumlah', 'tick', 0.3], ['w:wajib', 'tick', 0.3]],
      vis: O({ cepat: 'w:Sementara', layar: { nama: 'breach-fase', potong: [30, 130, 940, 210], at: 'w:tugas-0.2', judul: 'Fase 1 · Deteksi & Eskalasi' }, sorot: ['w:severity', 'w:deskripsi', 'w:jumlah', 'w:wajib'], teks: 'Tugas fase 1, *tercentang satu per satu*.' }),
    },
    {
      id: 's3', min: 5, voDelay: 0.3, mus: 'main',
      vo: 'Templat pemberitahuannya sudah disiapkan Privasimu Nexus: untuk subjek data dan lembaga. Kirim, sebelum angkanya habis.',
      layar: 'Bilah aksi asli (Template Pemberitahuan disorot cincin); pada "Kirim" odometer berhenti dan stempel "PEMBERITAHUAN TERKIRIM" muncul.',
      sfx: [['w:Templat', 'pop', 0.3], ['w:Kirim', 'hit', 0.4], ['w:Kirim+0.3', 'ding', 0.35]],
      vis: O({ layar: { nama: 'breach-aksi', potong: [30, 12, 950, 125], at: 'w:Templat', judul: 'Aksi insiden', cincin: [20, 16, 228, 40] }, stop: 'w:Kirim', teks: 'Templat pemberitahuan: *subjek data* & *lembaga*.' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Angkanya boleh jalan, kamu jangan panik. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Angka boleh jalan, kamu jangan panik.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: O({ cta: { tag: 'Angka boleh jalan,|*kamu jangan panik*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
