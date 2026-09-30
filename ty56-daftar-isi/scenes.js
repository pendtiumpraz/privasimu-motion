// TY56 — DAFTAR ISI BERTITIK "Halaman 482": halaman daftar isi laporan kepatuhan; judul bab muncul, titik-titik penuntun
// tumbuh ke kanan, nomor halaman menghitung naik sampai 482*; penanda "direksi berhenti di sini" di hlm. 2; halaman
// terlipat menjadi satu layar dasbor Postur Kepatuhan (asli).
// Hook (logika dipatahkan): "Bab 1 … hlm. 3. Bab 12 … hlm. 482. Direksi berhenti di hlm. 2."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: daftar isi bertitik; "482 halaman" = ilustrasi.
(function (root) {
  const CONFIG = {
    title: 'TY56 · Halaman 482 (daftar isi bertitik)',
    naskah: 'TY56',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 96 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 96, mode: 'major', root: 53, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.7 },
    meta: {
      judul: 'Halaman 482',
      gaya: 'Daftar isi bertitik',
      tampilan: 'halaman putih bergaya buku (serif) berjudul DAFTAR ISI; tiap bab muncul dengan titik penuntun yang tumbuh dan nomor halaman yang menghitung naik; penanda merah di bab 1; halaman terlipat lalu kartu dasbor asli muncul',
      jenisHook: 'Logika dipatahkan',
      hook: '"Bab 1 … hlm. 3. Bab 12 … hlm. 482*. Direksi berhenti di hlm. 2."',
      komposisi: '70% edukasi · 30% meme',
      rekam: ['dashboard-postur'],
      fakta: [
        'Postur Kepatuhan = tangkapan asli assets/app/dashboard-postur.png (tren bulanan per modul + Compliance Score 81%).',
        'Dukungan PPDP (fakta_produk.json): dasbor kepatuhan lintas modul.',
        'Nomor halaman & "482 halaman" = ilustrasi (ditandai *ilustrasi di halaman).',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const D = (o) => ({ type: 'di', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.5, mus: 'hook',
      vo: 'Bab satu… halaman tiga. Bab dua belas… halaman empat ratus delapan puluh dua. Direksi berhenti di halaman dua.',
      layar: 'Halaman DAFTAR ISI: "Bab 1 Pendahuluan ……… 3" muncul; bab 2–11 menyusul cepat; "Bab 12 Lampiran ……… 482*"; penanda merah "direksi berhenti di sini" di bab 1.',
      sfx: [[0.1, 'whoosh', 0.3], ['w:Bab', 'tick', 0.25], ['w:Bab#2', 'tick', 0.25], ['w:Direksi', 'pop', 0.35]],
      vis: D({ bab: ['w:Bab', 'w:tiga+0.4', 'w:Bab#2'], penanda: 'w:Direksi', teks: 'Bab 12 … hlm. 482. Direksi berhenti di *hlm. 2*.' }),
    },
    {
      id: 's2', min: 5, voDelay: 0.3, mus: 'main',
      vo: 'Laporan kepatuhan memang harus lengkap. Tapi yang dibaca direksi: skor, tren, dan status.',
      layar: 'Halaman bergulir pelan; tiga bab yang relevan (RoPA, DPIA, Insiden) disorot saat "skor, tren, status".',
      sfx: [['w:skor', 'tick', 0.25], ['w:tren', 'tick', 0.25], ['w:status', 'tick', 0.25]],
      vis: D({ sorot: ['w:skor', 'w:tren', 'w:status'], teks: 'Lengkap untuk auditor. *Ringkas* untuk direksi.' }),
    },
    {
      id: 's3', min: 5.5, voDelay: 0.3, mus: 'main',
      vo: 'Privasimu Nexus melipatnya jadi satu layar: postur kepatuhan, tren per modul, skor GAP.',
      layar: 'Halaman terlipat ke belakang; kartu asli "Postur Kepatuhan" (tren bulanan + Compliance Score 81%) naik menggantikannya.',
      sfx: [['w:melipatnya', 'whoosh', 0.45], ['w:layar', 'ding', 0.35]],
      vis: D({ lipat: 'w:melipatnya', layar: { nama: 'dashboard-postur', potong: [22, 82, 958, 392], at: 'w:layar-0.3', judul: 'Postur Kepatuhan' }, teks: 'Dilipat jadi *satu layar*.' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Daftar isi boleh panjang, ringkasannya satu layar. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Daftar isi boleh panjang, ringkasannya satu layar.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: D({ cta: { tag: 'Daftar isi boleh panjang,|*ringkasannya satu layar*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
