// TY11 — FONT VARIABEL "BERNAPAS" "Minggu Depan Ya": satu kata AUDIT yang makin tebal, makin sesak, makin merah tiap hari
// mendekati audit; satu klik ekspor laporan kepatuhan → kata kembali ringan dan bernapas.
// Hook (relate): "Begini rasanya saat auditor bilang: minggu depan ya."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: sumbu wght & wdth font variabel dianimasikan per frame dari waktu.
(function (root) {
  const CONFIG = {
    title: 'TY11 · Minggu Depan Ya (font variabel bernapas)',
    naskah: 'TY11',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+6%',
    maxPause: 0.4,
    beat: 60 / 100 / 2,
    tail: 0.35,
    burnCaptions: false,
    capMap: [['ha min', 'H-']],
    music: { bpm: 100, mode: 'minor', root: 50, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.8 },
    meta: {
      judul: 'Minggu Depan Ya',
      gaya: 'Font variabel "bernapas"',
      tampilan: 'satu kata AUDIT raksasa; tiap hari (H-7 → H-1) hurufnya menebal, menyempit, memerah, dan bergetar; setelah satu klik ekspor, kembali ringan dan bernapas',
      jenisHook: 'Relate',
      hook: '"Begini rasanya saat auditor bilang: minggu depan ya."',
      komposisi: '70% edukasi · 30% meme',
      sasaran: 'DPO/PPDP, manajemen',
      rekam: ['S2 dibaca cepat seperti hitung mundur: "H-6" dibaca "ha min enam", lalu "lima, empat, tiga, dua, satu".'],
      fakta: [
        'Dasbor kepatuhan lintas modul (fakta_produk.json: ppdp); tombol "Export Compliance Report" terlihat di dasbor asli (assets/app/dashboard.png). GAP Assessment: skor kepatuhan (fakta_produk.json: gap-assessment).',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const F = (o) => ({ type: 'fv', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4, voDelay: 0.35, mus: 'hush',
      vo: 'Begini rasanya saat auditor bilang: minggu depan ya.',
      layar: 'Kata AUDIT tipis dan lebar, tenang, bernapas pelan. Pil "H-7". Di "minggu depan ya", kata sedikit menebal.',
      sfx: [['w:minggu', 'heart', 0.5]],
      vis: F({ hari: 7, tegang: 'w:minggu', teks: 'Saat auditor bilang: *"minggu depan ya."*' }),
    },
    {
      id: 's2', min: 4, voDelay: 0.25, mus: 'tense', voiceRate: '+22%', maxPause: 0.25,
      vo: 'ha min enam. lima. empat. tiga. dua. satu.',
      layar: 'Tiap hari: H-6 … H-1, kata makin tebal, makin sempit, makin merah, getaran bertambah; detak jantung makin cepat.',
      sfx: [['w:enam', 'heart', 0.5], ['w:lima', 'heart', 0.55], ['w:empat', 'heart', 0.6], ['w:tiga', 'heart', 0.65], ['w:dua', 'heart', 0.7], ['w:satu', 'heart', 0.8]],
      vis: F({ langkah: ['w:enam', 'w:lima', 'w:empat', 'w:tiga', 'w:dua', 'w:satu'] }),
    },
    {
      id: 's3', min: 5.5, voDelay: 0.3, mus: 'main',
      vo: 'Atau: satu klik. Ekspor laporan kepatuhan dari dasbor. Dan bernapas.',
      layar: 'Di "klik", potongan dasbor asli dengan tombol Export Compliance Report muncul dan diklik; kata AUDIT melepas: tipis, lebar, hijau tenang, bernapas.',
      sfx: [['w:klik', 'key', 0.6], ['w:klik+0.3', 'check', 0.45], ['w:bernapas', 'shimmer', 0.35]],
      vis: F({ klik: 'w:klik', lega: 'w:klik+0.35', teks: 'Satu klik: *ekspor laporan kepatuhan*.' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Bernapas lega sebelum audit. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Bernapas lega sebelum audit.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: F({ cta: { tag: 'Bernapas lega|*sebelum audit*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
