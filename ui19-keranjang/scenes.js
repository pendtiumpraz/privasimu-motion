// UI19 — KERANJANG BELANJA "Keranjang 12.12": halaman keranjang toko fiktif saat promo; barang diskon 90% masuk; lalu
// baris aneh menyelip: "Data pelanggan (1,2 juta baris)" — risiko insiden; total berubah; peringatan musim promo;
// lalu Fire Drill (banner asli) sebagai "latihan sebelum musim promo"; CTA.
// Hook (anomali): "Diskon 90%. Data pelanggan ikut 'diskon'?"
// Komposisi: 50% edukasi · 50% meme. Satu gaya: UI keranjang belanja (baris menyelip, total berubah). Toko fiktif.
(function (root) {
  const CONFIG = {
    title: 'UI19 · Keranjang 12.12 (keranjang belanja)',
    naskah: 'UI19',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+12%',
    maxPause: 0.4,
    beat: 60 / 120 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 120, mode: 'major', root: 57, lead: 'pluck', drums: 'full', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.72 },
    meta: {
      judul: 'Keranjang 12.12',
      gaya: 'Keranjang belanja',
      tampilan: 'halaman keranjang toko fiktif "TokoKita" bergaya e-commerce (jingga), baris barang dengan diskon 90% masuk satu per satu, baris merah "Data pelanggan" menyelip, ringkasan total berubah, banner peringatan; kartu banner Fire Drill asli',
      jenisHook: 'Anomali',
      hook: '"Diskon 90%. Data pelanggan ikut \'diskon\'?"',
      komposisi: '50% edukasi · 50% meme',
      rekam: ['fire-drill-header'],
      fakta: [
        'Simulasi & Fire Drill (fakta_produk.json): latihan kesiapan tim menghadapi insiden — kuis, tabletop, walkthrough; skenario kustom berbantuan AI; penilaian rubrik.',
        'Manajemen Insiden: penghitung mundur pemberitahuan 3×24 jam.',
        'Toko, barang, harga, dan "1,2 juta baris" = fiktif/ilustrasi (ditandai *).',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const U = (o) => ({ type: 'kb', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5.5, voDelay: 0.5, mus: 'hook',
      vo: 'Diskon sembilan puluh persen. Data pelanggan ikut "diskon"?',
      layar: 'Keranjang TokoKita 12.12: tiga barang diskon 90% masuk; pada "Data" baris merah "Data pelanggan · 1,2 juta baris*" menyelip; total berubah.',
      sfx: [[0.1, 'whoosh', 0.25], [0.3, 'pop', 0.3], [0.6, 'pop', 0.3], [0.9, 'pop', 0.3], ['w:Data', 'hit', 0.45]],
      vis: U({ barang: [0.3, 0.6, 0.9], aneh: 'w:Data' }),
    },
    {
      id: 's2', min: 5.5, voDelay: 0.3, mus: 'tense',
      vo: 'Musim promo: trafik naik, tim lembur, celah terbuka. Insiden suka datang saat semua sibuk.',
      layar: 'Lencana "trafik 10×*" dan "tim lembur" muncul; banner peringatan merah di atas keranjang: "Insiden suka datang saat semua sibuk".',
      sfx: [['w:trafik', 'tick', 0.3], ['w:lembur', 'tick', 0.3], ['w:Insiden', 'hit', 0.35]],
      vis: U({ lencana: ['w:trafik', 'w:lembur'], peringatan: 'w:Insiden' }),
    },
    {
      id: 's3', min: 5, voDelay: 0.3, mus: 'main',
      vo: 'Di Privasimu Nexus, latihan dulu: Fire Drill, simulasi insiden. Sebelum dua belas dua belas.',
      layar: 'Keranjang meredup; kartu banner Fire Drill asli naik; tombol fiktif "Latihan sekarang" berdenyut.',
      sfx: [['w:Di', 'whoosh', 0.4], ['w:Fire', 'ding', 0.35], ['w:Sebelum', 'pop', 0.3]],
      vis: U({ redup: 'w:Di', layar: { nama: 'fire-drill-header', potong: [80, 66, 1140, 132], at: 'w:Fire-0.2', judul: 'Simulasi & Fire Drill' }, tombol: 'w:Sebelum' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Diskon boleh sembilan puluh persen, data jangan ikut. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Diskon boleh 90%, data jangan ikut.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: U({ cta: { tag: 'Diskon boleh 90%,|*data jangan ikut*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
