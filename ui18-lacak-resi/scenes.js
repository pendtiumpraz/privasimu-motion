// UI18 — LACAK PAKET / RESI "Lacak Permohonan": kartu pelacakan ala resi kurir (tanpa merek): paket dilacak sampai depan
// pintu → kartu berganti jadi pelacakan permohonan DSR-2026-017: diterima → identitas diverifikasi → ditelaah →
// disetujui → selesai, dengan pil tenggat 72 jam yang menyusut; kartu header DSR asli; CTA.
// Hook (relate): "Paket bisa dilacak sampai depan pintu. Permohonan hapus data?"
// Komposisi: 80% edukasi · 20% meme. Satu gaya: UI pelacakan (linimasa vertikal, titik berdenyut, cap waktu).
(function (root) {
  const CONFIG = {
    title: 'UI18 · Lacak Permohonan (lacak paket / resi)',
    naskah: 'UI18',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+10%',
    maxPause: 0.4,
    beat: 60 / 108 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 108, mode: 'major', root: 57, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.7 },
    meta: {
      judul: 'Lacak Permohonan',
      gaya: 'Lacak paket (resi)',
      tampilan: 'kartu putih ala aplikasi kurir di latar hijau-mint: nomor resi monospace, linimasa vertikal dengan titik status yang menyala satu per satu, garis terisi, titik aktif berdenyut, cap waktu, pil tenggat 72 jam',
      jenisHook: 'Relate',
      hook: '"Paket bisa dilacak sampai depan pintu. Permohonan hapus data?"',
      komposisi: '80% edukasi · 20% meme',
      rekam: ['dsr-detail'],
      fakta: [
        'DSR (fakta_produk.json): tenggat otomatis 72 jam sejak permohonan dicatat; alur Handler, Reviewer, Approver dengan jejak audit; verifikasi identitas pemohon; kode otomatis DSR-TAHUN-NOMOR.',
        'Header "DSR-2026-017 · 71h tersisa" = tangkapan asli assets/app/dsr-detail.png (dipotong di bawah header organisasi).',
        'Cap waktu di linimasa & pelacakan paket = ilustrasi (ditandai *); tanpa merek kurir.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const U = (o) => ({ type: 'lk', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.5, mus: 'hook',
      vo: 'Paket bisa dilacak sampai depan pintu. Permohonan hapus data?',
      layar: 'Kartu "Lacak Paket": tiga status menyala cepat sampai "Tiba di depan pintu ✓"; pada "Permohonan" kartu berganti jadi "Lacak Permohonan · DSR-2026-017 · Hapus data" dengan status kosong dan tanda tanya.',
      sfx: [[0.1, 'whoosh', 0.3], ['w:dilacak', 'tick', 0.2], ['w:dilacak+0.35', 'tick', 0.2], ['w:pintu', 'ding', 0.3], ['w:Permohonan', 'whoosh', 0.35]],
      vis: U({ paket: 'w:dilacak-0.2', ganti: 'w:Permohonan-0.1', teks: 'Paket dilacak sampai pintu. *Permohonan hapus data?*' }),
    },
    {
      id: 's2', min: 5, voDelay: 0.3, mus: 'main',
      vo: 'Di Privasimu Nexus, permohonan punya nomor, tenggat tujuh puluh dua jam, dan status: diterima, diverifikasi, ditelaah, disetujui, selesai.',
      layar: 'Status menyala satu per satu saat disebut; garis terisi; titik aktif berdenyut; pil tenggat menyusut 72h → 8h*.',
      sfx: [['w:nomor', 'tick', 0.25], ['w:tenggat', 'pop', 0.3], ['w:diterima', 'tick', 0.25], ['w:diverifikasi', 'tick', 0.25], ['w:ditelaah', 'tick', 0.25], ['w:disetujui', 'tick', 0.25], ['w:selesai', 'ding', 0.35]],
      vis: U({ status: ['w:diterima', 'w:diverifikasi', 'w:ditelaah', 'w:disetujui', 'w:selesai'], tenggat: 'w:tenggat' }),
    },
    {
      id: 's3', min: 5, voDelay: 0.3, mus: 'main',
      vo: 'Handler, reviewer, approver, semua tercatat dengan jejak audit.',
      layar: 'Kartu header DSR asli (DSR-2026-017 · Akses Data · pending review · 71h tersisa) muncul di bawah kartu pelacakan.',
      sfx: [['w:Handler', 'pop', 0.3], ['w:audit', 'ding', 0.3]],
      vis: U({ layar: { nama: 'dsr-detail', potong: [22, 82, 958, 140], at: 'w:Handler', judul: 'DSR · Detail permohonan' } }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Dilacak sampai selesai, bukan sampai lupa. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Dilacak sampai selesai, bukan sampai lupa.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: U({ cta: { tag: 'Dilacak sampai selesai,|*bukan sampai lupa*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
