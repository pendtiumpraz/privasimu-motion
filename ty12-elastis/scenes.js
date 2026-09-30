// TY12 — ELASTIS / HURUF KARET "Yang Tidak Bisa Ditarik": kata TENGGAT (karet merah muda) ditarik pegangan berkali-
// kali — memanjang lalu memantul balik (elastis), tiap tarikan berlabel "minggu depan / bulan depan / kuartal depan"
// → kata 3×24 JAM (baja) ditarik: tidak bergerak; pegangannya sendiri yang melar lalu terpental; gembok → digit
// berubah jadi penghitung mundur 71:59:5x, tahapan insiden asli & chip daftar periksa/log/templat → huruf SIAP
// memantul masuk (karet biru) dengan label simulasi insiden; CTA.
// Hook (logika dipatahkan): "Tenggat proyek bisa ditarik-tarik. 3×24 jam tidak."
// Komposisi: 50% edukasi · 50% meme. Satu gaya: huruf karet (lebar per huruf diskalakan, pegas teredam saat dilepas).
(function (root) {
  const CONFIG = {
    title: 'TY12 · Yang Tidak Bisa Ditarik (huruf karet)',
    naskah: 'TY12',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+12%',
    maxPause: 0.4,
    beat: 60 / 112 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 112, mode: 'major', root: 57, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.72 },
    meta: {
      judul: 'Yang Tidak Bisa Ditarik',
      gaya: 'Elastis (huruf karet)',
      tampilan: 'latar navy gelap; kata TENGGAT merah muda karet ditarik pegangan cincin putih, huruf memanjang ke arah tarikan lalu memantul balik; label tarikan; kata 3×24 JAM bergradasi baja tidak bergerak, pegangan melar & terpental, gembok kecil; digit menjadi penghitung mundur; kartu tahapan insiden asli; chip; huruf SIAP biru memantul masuk',
      jenisHook: 'Logika dipatahkan',
      hook: '"Tenggat proyek bisa ditarik-tarik. 3×24 jam tidak."',
      komposisi: '50% edukasi · 50% meme',
      rekam: ['breach-detail'],
      fakta: [
        'Manajemen Insiden (fakta_produk.json): penghitung mundur batas pemberitahuan 3 x 24 jam; daftar periksa penahanan dan log linimasa dibuat otomatis saat insiden dicatat; templat pemberitahuan tertulis kepada subjek data dan lembaga.',
        'Simulasi & Fire Drill (fakta_produk.json): latihan kesiapan tim berupa kuis, tabletop, dan walkthrough.',
        'Tahapan insiden = tangkapan asli assets/app/breach-detail.png (stepper, tanpa nama organisasi).',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const K = (o) => ({ type: 'el', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5.5, voDelay: 0.5, mus: 'hook',
      vo: 'Tenggat proyek bisa ditarik-tarik: minggu depan, bulan depan, kuartal depan.',
      layar: 'Kata TENGGAT (karet merah muda) muncul; pegangan cincin memegang ujung kanan dan menarik: huruf memanjang, label "minggu depan" muncul, dilepas → memantul balik; tarikan kedua "bulan depan" lebih panjang; ketiga "kuartal depan" paling panjang.',
      sfx: [[0.1, 'whoosh', 0.3], ['w:minggu-0.3', 'whoosh', 0.3], ['w:minggu', 'pop', 0.3], ['w:bulan-0.3', 'whoosh', 0.3], ['w:bulan', 'pop', 0.3], ['w:kuartal-0.3', 'whoosh', 0.35], ['w:kuartal', 'pop', 0.35]],
      vis: K({ mulai: 0.1, tarik: ['w:minggu-0.45', 'w:bulan-0.45', 'w:kuartal-0.45'] }),
    },
    {
      id: 's2', min: 5.5, voDelay: 0.3, mus: 'tense',
      vo: 'Tenggat lapor insiden data? Tiga kali dua puluh empat jam. Tidak bisa ditarik.',
      layar: 'TENGGAT mengecil ke atas; kata 3×24 JAM (baja) muncul besar; pegangan mencoba menarik: kata diam (getar 2 px), pegangan sendiri yang melar lalu memantul; percobaan ketiga pegangan terpental keluar; gembok kecil menempel di kata.',
      sfx: [['w:Tiga', 'hit', 0.4], ['w:jam', 'tick', 0.3], ['w:Tidak-0.4', 'whoosh', 0.3], ['w:Tidak', 'hit', 0.35], ['w:ditarik-0.2', 'whoosh', 0.3], ['w:ditarik', 'pop', 0.35]],
      vis: K({ baja: 'w:Tiga-0.1', coba: ['w:jam+0.2', 'w:Tidak-0.3', 'w:ditarik-0.3'], kunci: 'w:ditarik' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Begitu insiden dicatat, Privasimu Nexus menyalakan hitung mundurnya, daftar periksa, dan templat pemberitahuan.',
      layar: 'Digit 3×24 JAM berubah menjadi penghitung mundur 71:59:5x yang berdetak; kartu tahapan insiden asli naik di bawahnya; chip "daftar periksa penahanan", "log linimasa", "templat pemberitahuan" muncul berurutan.',
      sfx: [['w:dicatat', 'tick', 0.3], ['w:menyalakan', 'ding', 0.45], ['w:daftar', 'pop', 0.3], ['w:templat', 'pop', 0.3]],
      vis: K({ mundur: 'w:menyalakan-0.1', layar: { nama: 'breach-detail', potong: [290, 365, 944, 90], at: 'w:mundurnya', judul: 'Insiden · Tahapan' }, chip: ['w:daftar', 'w:daftar+0.5', 'w:templat'] }),
    },
    {
      id: 's4', min: 5, voDelay: 0.3, mus: 'main',
      vo: 'Yang tidak bisa ditarik, dilatih dulu. Simulasi insiden: kuis, tabletop, walkthrough.',
      layar: 'Penghitung & kartu mengecil ke bawah; huruf SIAP (karet biru) jatuh satu per satu dengan pantulan elastis (gepeng lalu memanjang); label "Simulasi insiden · kuis · tabletop · walkthrough".',
      sfx: [['w:dilatih', 'whoosh', 0.35], ['w:dilatih+0.15', 'pop', 0.3], ['w:dilatih+0.3', 'pop', 0.3], ['w:dilatih+0.45', 'pop', 0.3], ['w:Simulasi', 'ding', 0.4]],
      vis: K({ siap: 'w:dilatih', latih: 'w:Simulasi-0.1' }),
    },
    {
      id: 's5', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Siapkan sebelum ditarik. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Siapkan sebelum ditarik.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: K({ cta: { tag: 'Siapkan|*sebelum ditarik*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
