// TY37 — TULISAN TANGAN (write-on) "Catatan Kecil untuk Direksi": catatan di kertas tempel kuning ditulis huruf demi
// huruf (pena mengikuti), ditempel di tumpukan laporan tebal, lalu dasbor asli satu layar muncul.
// Hook (relate): "Pak, laporannya 482 halaman. Ringkasannya satu layar."  ("482 halaman" = ilustrasi)
// Komposisi: 70% edukasi · 30% meme. Satu gaya: tulisan tangan write-on; layar produk = tangkapan dasbor asli.
(function (root) {
  const CONFIG = {
    title: 'TY37 · Catatan Kecil untuk Direksi (tulisan tangan write-on)',
    naskah: 'TY37',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+14%',
    maxPause: 0.4,
    beat: 60 / 92 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 92, mode: 'major', root: 55, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.7 },
    meta: {
      judul: 'Catatan Kecil untuk Direksi',
      gaya: 'Tulisan tangan (write-on)',
      tampilan: 'meja kayu terang; kertas tempel kuning dengan tulisan tangan yang muncul huruf demi huruf, ujung pena mengikuti; tumpukan laporan putih tebal; kartu dasbor asli',
      jenisHook: 'Relate',
      hook: '"Pak, laporannya 482 halaman*. Ringkasannya satu layar."',
      komposisi: '70% edukasi · 30% meme',
      rekam: ['dashboard'],
      fakta: [
        'Dasbor (tangkapan asli assets/app/dashboard.png, header berisi nama organisasi dipotong): GAP Score 81%, 4 DSR pending, 20 breach aktif, risiko DPIA belum dimitigasi — angka dari tenant uji, tampil apa adanya.',
        'Dukungan PPDP (fakta_produk.json): dasbor kepatuhan lintas modul; antrean pekerjaan yang menunggu tindakan.',
        '"482 halaman" = angka ilustrasi (ditandai *ilustrasi di catatan).',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const W = (o) => ({ type: 'wo', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.5, mus: 'hook',
      vo: 'Pak, laporannya empat ratus delapan puluh dua halaman. Ringkasannya? Satu layar.',
      layar: 'Kertas tempel kuning besar; pena menulis: "Pak, laporannya 482 halaman*." lalu "Ringkasannya: satu layar."',
      sfx: [[0.1, 'whoosh', 0.3], ['w:Pak', 'tick', 0.2], ['w:Ringkasannya', 'tick', 0.2]],
      vis: W({ nota: [[0, 0, 'w:Pak'], [0, 1, 'w:empat-0.2'], [0, 2, 'w:Ringkasannya'], [0, 3, 'w:satu']] }),
    },
    {
      id: 's2', min: 5, voDelay: 0.3, mus: 'main',
      vo: 'Yang perlu direksi tahu: skor kepatuhan, permintaan tertunda, insiden aktif.',
      layar: 'Catatan pertama ditempel di tumpukan laporan (kiri); catatan kedua ditulis: "Yang perlu direksi tahu:" + 3 poin.',
      sfx: [['w:Yang-0.4', 'whoosh', 0.35], ['w:skor', 'tick', 0.2], ['w:permintaan', 'tick', 0.2], ['w:insiden', 'tick', 0.2]],
      vis: W({ tempel: 'w:Yang-0.5', nota: [[1, 0, 'w:Yang'], [1, 1, 'w:skor'], [1, 2, 'w:permintaan'], [1, 3, 'w:insiden']] }),
    },
    {
      id: 's3', min: 5, voDelay: 0.3, mus: 'main',
      vo: 'Dasbor Privasimu Nexus merangkumnya di satu layar: skor GAP, DSR, insiden.',
      layar: 'Kedua catatan tersingkir; kartu dasbor asli muncul (Selamat Datang, Perlu Perhatian, GAP 81%, DSR, Breach); catatan kecil "satu layar ✓" ditempel di sudut kartu.',
      sfx: [['w:Dasbor', 'whoosh', 0.4], ['w:satu', 'pop', 0.3], ['w:skor', 'tick', 0.2]],
      vis: W({ dasbor: 'w:Dasbor', layar: { nama: 'dashboard', potong: [275, 85, 975, 635], judul: 'Dashboard' }, nota: [[2, 0, 'w:satu']] }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Laporan untuk auditor, satu layar untuk direksi. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Laporan untuk auditor, satu layar untuk direksi.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: W({ cta: { tag: 'Laporan untuk auditor,|*satu layar untuk direksi*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
