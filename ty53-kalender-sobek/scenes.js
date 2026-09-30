// TY53 — KALENDER SOBEK "H-sekian": kalender harian di dinding; lembar disobek satu per satu (berputar di engsel atas
// lalu jatuh), makin cepat, dari 1 Oktober 2026 dan berhenti di 16 Januari 2027 (PP 33/2026 berlaku). Lalu daftar
// "Siap PP 33" tercentang.
// Hook (anomali): "Tiap lembar yang disobek, PP 33 makin dekat."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: kalender sobek (rotateX engsel atas + jatuh), angka fit-to-width.
(function (root) {
  const CONFIG = {
    title: 'TY53 · H-sekian (kalender sobek)',
    naskah: 'TY53',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 112 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 112, mode: 'minor', root: 52, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.72 },
    meta: {
      judul: 'H-sekian',
      gaya: 'Kalender sobek',
      tampilan: 'dinding polos; kalender harian putih berbingkai hitam dengan pita bulan; lembar berputar di engsel atas lalu jatuh, makin cepat; lembar terakhir merah 16 Januari 2027; daftar centang di sampingnya',
      jenisHook: 'Anomali',
      hook: '"Tiap lembar yang disobek, PP 33 makin dekat."',
      komposisi: '70% edukasi · 30% meme',
      fakta: [
        'PP 33/2026 berlaku 16 Januari 2027 (basis yang sama dengan TY40 & knowledge base regulasi platform).',
        'Daftar "Siap PP 33" = modul Nexus (fakta_produk.json): RoPA, DPIA, DSR, Consent, Insiden.',
        'Tanggal awal 1 Oktober 2026 = awal kalender tayang kampanye; tidak ada angka H- eksplisit supaya tidak basi.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const K = (o) => ({ type: 'ks', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4.5, voDelay: 0.5, mus: 'hook',
      vo: 'Tiap lembar yang disobek… PP tiga puluh tiga makin dekat.',
      layar: 'Kalender menunjukkan 1 Oktober 2026; pada "disobek" lembar pertama berputar di engsel atas dan jatuh; sobekan berlanjut makin cepat.',
      sfx: [[0.1, 'whoosh', 0.3], ['w:disobek', 'tick', 0.35]],
      vis: K({ mulai: 'w:disobek', teks: 'Tiap lembar yang disobek, *PP 33 makin dekat*.' }),
    },
    {
      id: 's2', min: 5, voDelay: 0.25, mus: 'tense',
      vo: 'Oktober. November. Desember. Dan berhenti, di enam belas Januari dua ribu dua puluh tujuh.',
      layar: 'Lembar-lembar beterbangan melewati bulan; berhenti tepat pada "berhenti": lembar merah 16 JANUARI 2027 · PP 33/2026 BERLAKU.',
      sfx: [['w:Oktober', 'tick', 0.25], ['w:November', 'tick', 0.25], ['w:Desember', 'tick', 0.25], ['w:berhenti', 'hit', 0.45], ['w:berhenti+0.3', 'ding', 0.3]],
      vis: K({ akhir: 'w:berhenti', teks: 'Berhenti di *16 Januari 2027*.' }),
    },
    {
      id: 's3', min: 5.5, voDelay: 0.3, mus: 'main',
      vo: 'Program Siap PP 33 di Privasimu Nexus: RoPA, DPIA, DSR, Consent, Insiden. Tercentang, sebelum tanggalnya.',
      layar: 'Kalender bergeser; daftar "SIAP PP 33" muncul dan tercentang satu per satu saat disebut.',
      sfx: [['w:Program', 'whoosh', 0.35], ['w:RoPA', 'pop', 0.25], ['w:DPIA', 'pop', 0.25], ['w:DSR', 'pop', 0.25], ['w:Consent', 'pop', 0.25], ['w:Insiden', 'pop', 0.25], ['w:Tercentang', 'ding', 0.3]],
      vis: K({ geser: 'w:Program', centang: ['w:RoPA', 'w:DPIA', 'w:DSR', 'w:Consent', 'w:Insiden'] }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Sebelum lembar terakhir disobek, pastikan siap. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Sebelum lembar terakhir, siap PP 33.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: K({ cta: { tag: 'Sebelum lembar terakhir,|*siap PP 33*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
