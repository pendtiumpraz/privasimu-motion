// TY43 — SPANDUK WARUNG TENDA "Warung Kepatuhan": spanduk vinil warna-warni berhuruf tebal bergradasi dan garis tepi
// ganda, kain bergelombang; "menu" modul; BUKA 24 JAM; "bisa dibungkus" = ekspor laporan.
// Hook (relate): "Kalau urusan data pribadi buka warung tenda: SEDIA RoPA, DPIA, DSR. Buka 24 jam."
// Komposisi: 30% edukasi · 70% meme. Satu gaya: huruf display + gradasi + outline ganda; kain bergelombang (sinus).
(function (root) {
  const CONFIG = {
    title: 'TY43 · Warung Kepatuhan (spanduk warung tenda)',
    naskah: 'TY43',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.35,
    beat: 60 / 112 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 112, mode: 'major', root: 57, lead: 'pluck', drums: 'full', sonic: true },
    mix: { duckTo: 0.4, musicGain: 0.8 },
    meta: {
      judul: 'Warung Kepatuhan',
      gaya: 'Spanduk warung tenda',
      tampilan: 'spanduk vinil kuning-merah berhuruf Lilita One bergradasi dengan garis tepi ganda, bergelombang seperti kain; papan menu modul; lencana BUKA 24 JAM',
      jenisHook: 'Relate',
      hook: '"Kalau urusan data pribadi buka warung tenda: SEDIA RoPA, DPIA, DSR. Buka 24 jam."',
      komposisi: '30% edukasi · 70% meme',
      fakta: [
        '"Menu" = modul nyata Privasimu Nexus: RoPA, DPIA, DSR, Consent, Insiden, Pihak Ketiga, Transfer (fakta_produk.json: platform). "Bisa dibungkus" = tombol Export Compliance Report di dasbor asli (assets/app/dashboard.png).',
        '"Buka 24 jam" = gaya spanduk warung (SaaS dapat diakses kapan saja), bukan klaim layanan dukungan 24 jam.',
        'Gaya huruf umum; tidak meniru spanduk warung tertentu. "Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku.',
      ],
    },
  };
  const W = (o) => ({ type: 'wr', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4, voDelay: 0.4, mus: 'play',
      vo: 'Kalau urusan data pribadi buka warung tenda…',
      layar: 'Spanduk vinil terbentang dari atas: WARUNG KEPATUHAN (huruf bergradasi, outline ganda), kain bergelombang.',
      sfx: [[0.1, 'whoosh', 0.4], [0.5, 'paper', 0.35]],
      vis: W({ bentang: 0, teks: 'Kalau urusan data pribadi *buka warung tenda*…' }),
    },
    {
      id: 's2', min: 6, voDelay: 0.25, mus: 'play',
      vo: 'Sedia: RoPA, DPIA, DSR, Consent, Insiden, pihak ketiga, transfer. Buka dua puluh empat jam.',
      layar: 'Papan menu: SEDIA → RoPA · DPIA · DSR · Consent · Insiden · Pihak Ketiga · Transfer muncul satu-satu; lencana BUKA 24 JAM berputar masuk.',
      sfx: [['w:RoPA', 'pop', 0.3], ['w:DPIA', 'pop', 0.3], ['w:DSR', 'pop', 0.3], ['w:Consent', 'pop', 0.3], ['w:Insiden', 'pop', 0.3], ['w:pihak', 'pop', 0.3], ['w:transfer', 'pop', 0.3], ['w:Buka', 'tada', 0.4]],
      vis: W({ menu: ['w:RoPA', 'w:DPIA', 'w:DSR', 'w:Consent', 'w:Insiden', 'w:pihak', 'w:transfer'], buka: 'w:Buka', teks: 'Sedia *semua menu* kepatuhan. Buka 24 jam.', teksAt: 'w:Buka' }),
    },
    {
      id: 's3', min: 4.5, voDelay: 0.25, mus: 'main',
      vo: 'Bisa dibungkus: ekspor laporan kepatuhan, satu klik.',
      layar: 'Label "BISA DIBUNGKUS" + tombol Export Compliance Report asli membesar dan diklik.',
      sfx: [['w:dibungkus', 'stamp', 0.45], ['w:klik', 'key', 0.5]],
      vis: W({ bungkus: 'w:dibungkus-0.1', klik: 'w:klik', teks: 'Bisa dibungkus: *ekspor laporan*.' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Mampir dulu. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup bergaya spanduk: logo, "Mampir dulu.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: W({ cta: { tag: '*Mampir* dulu.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
