// GB40 — SPEEDOMETER "Berani Lihat Jarumnya?" (reverse psychology, target ±18 detik): meter jarum tertutup penutup
// besar bertulisan "JANGAN LIHAT."; bayangan jarum menari liar di balik penutup; penonton ditantang ("Masih nonton?
// Serius, jangan." 3-2-1) → penutup terbelah: jarum berayun lalu berhenti di 56 "Cukup" (antiklimaks yang jadi
// lelucon) → match-cut: meter gambar mengecil dan mendarat tepat di meter asli Privacy Posture Score (tangkapan asli)
// → CTA reverse psychology: "Jangan cek skormu. Kecuali penasaran."
// Hook (reverse psychology): "Jangan lihat jarum ini kalau belum siap."
// Komposisi: 60% edukasi · 40% meme. Satu gaya: meter jarum (busur conic-gradient, jarum rotasi dari nilai, angka menghitung).
(function (root) {
  const CONFIG = {
    title: 'GB40 · Berani Lihat Jarumnya? (speedometer)',
    naskah: 'GB40',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+12%',
    maxPause: 0.3,
    beat: 60 / 100 / 2,
    tail: 0.3,
    burnCaptions: false,
    music: { bpm: 100, mode: 'minor', root: 50, lead: 'keys', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.7 },
    meta: {
      judul: 'Berani Lihat Jarumnya?',
      gaya: 'Speedometer / meter jarum',
      tampilan: 'latar navy gelap; penutup baja gelap dua bagian dengan tulisan besar "JANGAN LIHAT." dan hitung mundur 3-2-1; bayangan jarum kabur menari di permukaan penutup; penutup terbelah → meter setengah lingkaran merah→kuning→hijau dengan tanda skala, jarum putih, angka besar menghitung, label CUKUP; meter mengecil dan menyatu dengan kartu Privacy Posture Score asli',
      jenisHook: 'Reverse psychology',
      hook: '"Jangan lihat jarum ini kalau belum siap."',
      komposisi: '60% edukasi · 40% meme',
      rekam: ['postur-privasi'],
      fakta: [
        'Privacy Posture Score = tangkapan asli assets/app/postur-privasi.png (tenant uji): skor agregat 56 "Cukup" (0–100) dari 3 layer — Data 49, Process 80, Response 38; dipotong di bawah baris deskripsi (tanpa nama organisasi).',
        'Angka 56 & label "Cukup" mengikuti data demo di tangkapan layar tersebut; tidak ada angka lain yang dikarang.',
        'Durasi sengaja pendek (±18 dtk): reverse psychology harus cepat menuntaskan tantangannya; lelucon = antiklimaks "cukup".',
        '"Cek skormu gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const S = (o) => ({ type: 'sp', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 3.2, voDelay: 0.4, mus: 'hook',
      vo: 'Jangan lihat jarum ini kalau belum siap.',
      layar: 'Penutup baja gelap menutup layar, tulisan besar "JANGAN LIHAT." lalu "kalau belum siap."; bayangan jarum kabur menari liar di permukaan penutup, bunyi detak.',
      sfx: [[0.1, 'whoosh', 0.3], ['w:Jangan', 'hit', 0.35], ['w:jarum', 'tick', 0.3], ['w:siap', 'tick', 0.3]],
      vis: S({ mulai: 0.1, bayang: 'w:jarum-0.2', sub: 'w:kalau-0.1' }),
    },
    {
      id: 's2', min: 3.8, voDelay: 0.3, mus: 'tense',
      vo: 'Masih nonton? Oke. Tiga, dua, satu.',
      layar: 'Tulisan berganti "Masih nonton?" → "Oke. Siap?"; bayangan jarum makin cepat; digit 3 · 2 · 1 besar berganti; pada "satu" penutup terbelah atas-bawah dengan kilat.',
      sfx: [['w:Masih', 'tick', 0.3], ['w:Oke', 'pop', 0.3], ['w:Tiga', 'tick', 0.35], ['w:dua', 'tick', 0.35], ['w:satu', 'tick', 0.35], ['w:satu+0.25', 'hit', 0.5]],
      vis: S({ masih: 'w:Masih-0.1', serius: 'w:Oke-0.1', hitung: ['w:Tiga-0.1', 'w:dua-0.1', 'w:satu-0.1'], buka: 'w:satu+0.2' }),
    },
    {
      id: 's3', min: 5, voDelay: 0.35, mus: 'main',
      vo: 'Lima puluh enam. Cukup. Bukan bagus, bukan gawat. Data asli, Privasimu Nexus.',
      layar: 'Meter terlihat: jarum berayun melewati 56 lalu berhenti tepat di 56, angka menghitung, label CUKUP muncul; meter mengecil dan mendarat persis di meter kartu Privacy Posture Score asli (match-cut); label "tangkapan asli".',
      sfx: [['w:Lima', 'tick', 0.3], ['w:enam', 'ding', 0.4], ['w:Cukup', 'pop', 0.35], ['w:Data', 'whoosh', 0.35], ['w:Nexus', 'ding', 0.35]],
      vis: S({ label: 'w:Cukup-0.1', asli: 'w:Data-0.1', tunjuk: 'w:Privasimu', layar: { nama: 'postur-privasi', potong: [20, 125, 970, 225], judul: 'Privacy Posture Score' } }),
    },
    {
      id: 's4', min: 4, voDelay: 0.3, mus: 'outro', free: true, tail: 1.1,
      vo: 'Jangan cek skormu. Kecuali penasaran. Gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Jangan cek skormu. Kecuali penasaran.", tombol privasimu.com, kontak.',
      sfx: [['w:Kecuali', 'pop', 0.35], ['w:Gratis', 'pop', 0.4]],
      vis: S({ cta: { tag: 'Jangan cek skormu.|*Kecuali penasaran*.', at: 0.15, btnAt: 'w:Gratis' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
