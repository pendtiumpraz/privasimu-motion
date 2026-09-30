// SN17 — STRIP FILM / LEMBAR KONTAK "36 Bingkai": tiga strip film berlubang (36 bingkai momen kantor) bergulir di meja
// cahaya; berhenti; spidol merah melingkari 3 bingkai: CATAT · TAHAN · BERI TAHU; tiap bingkai ditarik & diperbesar
// dengan penjelasan; lembar meredup, tiga bingkai berjajar + kartu Fase 1 asli; CTA.
// Hook (anomali): "36 bingkai. Hanya 3 yang penting saat insiden."
// Komposisi: 50% edukasi · 50% meme. Satu gaya: strip film berlubang, bingkai berisi kartu, lingkaran spidol.
(function (root) {
  const CONFIG = {
    title: 'SN17 · 36 Bingkai (strip film / lembar kontak)',
    naskah: 'SN17',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 100 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 100, mode: 'minor', root: 52, lead: 'keys', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.72 },
    meta: {
      judul: '36 Bingkai',
      gaya: 'Strip film / lembar kontak',
      tampilan: 'meja cahaya putih hangat; tiga strip film hitam berlubang sproket, 12 bingkai per strip berisi kartu momen kantor bernada sepia; strip bergulir lalu berhenti; lingkaran spidol merah menggambar sendiri; bingkai terpilih membesar ke tengah; kartu Fase 1 asli',
      jenisHook: 'Anomali',
      hook: '"36 bingkai. Hanya 3 yang penting saat insiden."',
      komposisi: '50% edukasi · 50% meme',
      rekam: ['breach-fase'],
      fakta: [
        'Manajemen Insiden (fakta_produk.json): kode rekaman otomatis BRC-TAHUN-NOMOR; daftar periksa penahanan & log linimasa dibuat otomatis saat insiden dicatat; penghitung mundur pemberitahuan 3×24 jam; templat pemberitahuan ke subjek data & lembaga.',
        'Kartu "Fase 1: Deteksi & Eskalasi" = tangkapan asli assets/app/breach-fase.png.',
        '"36 bingkai" & isi bingkai lain (rapat, kopi, tab…) = ilustrasi.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const F = (o) => ({ type: 'fs', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5.5, voDelay: 0.5, mus: 'hook',
      vo: 'Tiga puluh enam bingkai. Hanya tiga yang penting… saat insiden.',
      layar: 'Tiga strip film bergulir masuk di meja cahaya (36 bingkai momen kantor); pada "tiga" strip berhenti; pada "insiden" tiga lingkaran spidol merah menggambar sendiri di bingkai 7, 19, 31.',
      sfx: [[0.1, 'whoosh', 0.3], ['w:tiga#2', 'tick', 0.3], ['w:insiden', 'pop', 0.3], ['w:insiden+0.25', 'pop', 0.3], ['w:insiden+0.5', 'pop', 0.3]],
      vis: F({ gulir: 0.1, berhenti: 'w:tiga#2', lingkar: 'w:insiden' }),
    },
    {
      id: 's2', min: 7, voDelay: 0.3, mus: 'main',
      vo: 'Catat: kode otomatis, linimasa langsung berjalan. Tahan: daftar periksa penahanan. Beri tahu: templat pemberitahuan, tiga kali dua puluh empat jam.',
      layar: 'Bingkai terpilih ditarik & membesar ke tengah satu per satu: CATAT (BRC-2026-… · linimasa), TAHAN (daftar periksa penahanan), BERI TAHU (templat · 3×24 jam).',
      sfx: [['w:Catat', 'whoosh', 0.35], ['w:Tahan', 'whoosh', 0.35], ['w:Beri', 'whoosh', 0.35], ['w:jam', 'ding', 0.35]],
      vis: F({ besar: ['w:Catat', 'w:Tahan', 'w:Beri'] }),
    },
    {
      id: 's3', min: 5.5, voDelay: 0.3, mus: 'main',
      vo: 'Di Privasimu Nexus, ketiganya sudah tersusun sejak insiden dicatat. Bingkai lain boleh buram.',
      layar: 'Lembar kontak meredup & buram; tiga bingkai berjajar rapi di atas; kartu asli "Fase 1: Deteksi & Eskalasi" (4 tugas tercentang) muncul di bawahnya.',
      sfx: [['w:Di', 'whoosh', 0.4], ['w:tersusun', 'ding', 0.35], ['w:buram', 'pop', 0.3]],
      vis: F({ susun: 'w:Di', layar: { nama: 'breach-fase', potong: [30, 20, 900, 320], at: 'w:tersusun', judul: 'Fase 1 · Deteksi & Eskalasi' } }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Tiga puluh enam bingkai, tiga yang menyelamatkan. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "36 bingkai, 3 yang menyelamatkan.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: F({ cta: { tag: '36 bingkai,|*3 yang menyelamatkan*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
