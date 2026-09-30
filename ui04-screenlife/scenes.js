// UI04 — SCREENLIFE "Pukul 16.58": seluruh cerita di desktop fiktif: jam 16.58; chat tim masuk ("blast promo ke semua
// nomor di database ya!"); jendela alat "Blast SMS" 12.480 nomor*; kursor ragu di KIRIM; notifikasi Privasimu Nexus:
// 4.120 nomor tanpa persetujuan marketing* → filter "hanya yang setuju" → 8.360* → kirim; kartu integrasi Consent asli; CTA.
// Hook (relate): "Nobody: … Marketing jam 5 sore: 'blast promo ke semua nomor di database ya!'"
// Komposisi: 70% edukasi · 30% meme. Satu gaya: desktop tiruan (jendela div, kursor lintasan halus, notifikasi).
(function (root) {
  const CONFIG = {
    title: 'UI04 · Pukul 16.58 (screenlife)',
    naskah: 'UI04',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+12%',
    maxPause: 0.4,
    beat: 60 / 108 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 108, mode: 'major', root: 55, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.7 },
    meta: {
      judul: 'Pukul 16.58',
      gaya: 'Screenlife (cerita di layar komputer)',
      tampilan: 'desktop fiktif abu-biru dengan bilah atas & jam 16.58; jendela chat tim, jendela alat "Blast SMS" dengan hitungan penerima & tombol KIRIM besar; kursor panah bergerak halus dan ragu; notifikasi Privasimu Nexus di pojok; kartu metode integrasi Consent asli',
      jenisHook: 'Relate',
      hook: '"Nobody: … Marketing jam 5 sore: \'blast promo ke semua nomor di database ya!\'"',
      komposisi: '70% edukasi · 30% meme',
      rekam: ['consent-detail'],
      fakta: [
        'Consent & Cookie (fakta_produk.json): titik pengumpulan persetujuan per kanal (web, aplikasi, loket); log persetujuan beserta bukti; penarikan dihormati di seluruh kanal; API & webhook untuk sinkronisasi ke sistem internal.',
        'Kartu metode integrasi = tangkapan asli assets/app/consent-detail.png.',
        'Angka penerima (12.480 · 4.120 · 8.360) & aplikasi desktop = fiktif/ilustrasi (ditandai *); tanpa merek.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const S = (o) => ({ type: 'sl', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.5, mus: 'hook',
      vo: 'Nobody. Marketing jam lima sore: "blast promo ke semua nomor di database ya!"',
      layar: 'Desktop, jam 16.58; jendela chat tim muncul, pesan Marketing masuk dengan gelembung & bunyi; jendela "Blast SMS" terbuka: 12.480 penerima*, tombol KIRIM.',
      sfx: [[0.1, 'whoosh', 0.25], ['w:Marketing', 'ding', 0.35], ['w:blast', 'pop', 0.3], ['w:database+0.4', 'whoosh', 0.3]],
      vis: S({ chat: 'w:Marketing', pesan: 'w:blast-0.2', alat: 'w:database+0.3' }),
    },
    {
      id: 's2', min: 5, voDelay: 0.3, mus: 'tense',
      vo: 'Kursor sudah di tombol Kirim. Tapi, yang setuju dihubungi untuk promo, siapa saja?',
      layar: 'Kursor meluncur ke KIRIM, ragu bergetar di atasnya; notifikasi Privasimu Nexus muncul: "4.120 nomor tanpa persetujuan marketing*".',
      sfx: [['w:Kursor', 'tick', 0.25], ['w:Tapi', 'hit', 0.3], ['w:siapa', 'ding', 0.35]],
      vis: S({ kursorKirim: 'w:Kursor', ragu: 'w:Tapi', notif: 'w:siapa-0.3' }),
    },
    {
      id: 's3', min: 5.5, voDelay: 0.3, mus: 'main',
      vo: 'Di Privasimu Nexus, persetujuan tercatat per kanal, dengan bukti. Filter: hanya yang setuju. Delapan ribu nomor lebih. Kirim.',
      layar: 'Kursor pindah ke "Filter: hanya yang setuju"; hitungan turun 12.480 → 8.360*; tombol KIRIM berubah hijau dan ditekan; kartu metode integrasi Consent asli muncul.',
      sfx: [['w:Filter', 'tick', 0.3], ['w:Delapan', 'pop', 0.3], ['w:Kirim', 'ding', 0.4]],
      vis: S({ filter: 'w:Filter', kirim: 'w:Kirim', layar: { nama: 'consent-detail', potong: [313, 780, 897, 200], at: 'w:tercatat', judul: 'Consent · Metode integrasi' } }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Kirim ke yang setuju, bukan ke semua. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Kirim ke yang setuju, bukan ke semua.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: S({ cta: { tag: 'Kirim ke yang setuju,|*bukan ke semua*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
