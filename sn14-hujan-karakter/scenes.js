// SN14 — HUJAN KARAKTER "Hujan Data": kolom karakter (angka & huruf) turun di layar navy gelap dengan kecepatan beda;
// tantangan "ada 1 NIK, temukan" → kaca pembesar manusia berkeliling 3 jam* tanpa hasil, hujan makin deras → garis
// pemindai Privasimu Nexus menyapu dari atas: satu kolom membeku, 16 digit menyala merah, label "NIK · kolom
// no_identitas*" → twist: kamera menjauh, ternyata empat sistem dengan 18 kolom data pribadi* menyala → kartu peta
// sumber data "dikaitkan ke RoPA"; CTA.
// Hook (anomali): "Di antara hujan ini ada 1 NIK. Temukan."
// Komposisi: 50% edukasi · 50% meme. Satu gaya: hujan karakter di kanvas (warna & susunan sendiri, bukan tiruan film).
(function (root) {
  const CONFIG = {
    title: 'SN14 · Hujan Data (hujan karakter)',
    naskah: 'SN14',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+12%',
    maxPause: 0.4,
    beat: 60 / 100 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 100, mode: 'minor', root: 45, lead: 'chip', drums: 'chip', sonic: true },
    mix: { duckTo: 0.4, musicGain: 0.7 },
    meta: {
      judul: 'Hujan Data',
      gaya: 'Hujan karakter',
      tampilan: 'layar navy sangat gelap; kolom karakter biru-es (angka dominan, sedikit huruf/simbol) turun dengan kecepatan berbeda dan berkelip; kaca pembesar putih berkeliling; chip penghitung waktu; garis pemindai sian menyapu; 16 digit NIK menyala merah dengan kurung & label; kamera menjauh ke 4 panel sistem dengan kolom merah; kartu peta sumber data',
      jenisHook: 'Anomali',
      hook: '"Di antara hujan ini ada 1 NIK. Temukan."',
      komposisi: '50% edukasi · 50% meme',
      fakta: [
        'Data Discovery (fakta_produk.json): katalog sistem & sumber data; pemindaian kolom untuk mendeteksi data pribadi umum dan spesifik; keterkaitan kolom data ke RoPA.',
        'Sebelum: lokasi data pribadi hanya diketahui dari ingatan tim TI → "mata manusia" = ilustrasi.',
        'NIK di layar = 16 digit palsu yang strukturnya tidak valid (3200009900990000); nama sistem, "3 jam", "4 sistem · 18 kolom" = ilustrasi (ditandai *).',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const R = (o) => ({ type: 'hj', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4.5, voDelay: 0.6, mus: 'hook',
      vo: 'Di antara hujan ini, ada satu NIK. Temukan.',
      layar: 'Hujan karakter biru-es turun di layar gelap; teks tengah "Di antara hujan ini ada 1 NIK." lalu "TEMUKAN." besar; kaca pembesar muncul dan mulai berkeliling.',
      sfx: [[0.1, 'whoosh', 0.3], ['w:satu', 'tick', 0.3], ['w:Temukan', 'hit', 0.4]],
      vis: R({ mulai: 0.1, temukan: 'w:Temukan-0.1' }),
    },
    {
      id: 's2', min: 4.5, voDelay: 0.3, mus: 'tense',
      vo: 'Mata manusia: tiga jam, nol temuan. Hujannya makin deras.',
      layar: 'Chip "MATA MANUSIA · 00:00:00 → 03:00:00* · 0 temuan" berputar cepat; kaca pembesar makin gelisah; hujan bertambah cepat.',
      sfx: [['w:Mata', 'tick', 0.3], ['w:tiga', 'tick', 0.3], ['w:nol', 'pop', 0.3], ['w:deras', 'whoosh', 0.4]],
      vis: R({ mata: 'w:Mata-0.1', deras: 'w:deras-0.3' }),
    },
    {
      id: 's3', min: 5.5, voDelay: 0.3, mus: 'main',
      vo: 'Privasimu Nexus memindai kolomnya. Ketemu: NIK, di kolom nomor identitas.',
      layar: 'Kaca pembesar lenyap; garis pemindai sian menyapu dari atas ke bawah; saat melewati satu kolom, kolom itu membeku dan 16 digit menyala merah dengan kurung; kolom lain meredup; label "NIK terdeteksi · kolom no_identitas* · dikaitkan ke RoPA".',
      sfx: [['w:memindai', 'whoosh', 0.45], ['w:memindai+0.8', 'tick', 0.3], ['w:Ketemu', 'ding', 0.5], ['w:kolom#2', 'tick', 0.3]],
      vis: R({ pindai: 'w:memindai-0.2', label: 'w:Ketemu' }),
    },
    {
      id: 's4', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Dan bukan cuma satu. Tujuh belas kolom lagi, di empat sistem, semuanya dikaitkan ke RoPA.',
      layar: 'Kamera menjauh: layar tadi mengecil jadi satu dari empat panel sistem (basis data pelanggan*, HRIS*, gudang data*, spreadsheet keuangan*), tiap panel punya kolom-kolom merah; chip nama sistem & jumlah kolom; kartu "4 sistem · 18 kolom data pribadi* → RoPA".',
      sfx: [['w:bukan', 'whoosh', 0.4], ['w:Tujuh', 'pop', 0.3], ['w:empat', 'pop', 0.3], ['w:semuanya', 'ding', 0.45]],
      vis: R({ banyak: 'w:bukan-0.1', peta: 'w:semuanya-0.2' }),
    },
    {
      id: 's5', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Jangan cari data dengan mata. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Jangan cari data dengan mata.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: R({ cta: { tag: 'Jangan cari data|*dengan mata*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
