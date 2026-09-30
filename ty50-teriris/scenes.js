// TY50 — TEKS TERIRIS (sliced) "Informasi yang Terpotong": satu kalimat kepatuhan diiris jadi 4 pita horizontal yang
// bergeser (Legal · IT · CS · Marketing) sehingga tak terbaca; di Nexus pita menyatu jadi kalimat utuh.
// Hook (anomali): "Tiap divisi pegang sepotong. Tidak ada yang pegang kalimat utuhnya."
// Komposisi: 50% edukasi · 50% meme. Satu gaya: salinan teks dengan clip-path pita + offset X per pita.
(function (root) {
  const CONFIG = {
    title: 'TY50 · Informasi yang Terpotong (teks teriris)',
    naskah: 'TY50',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 100 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 100, mode: 'minor', root: 52, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.75 },
    meta: {
      judul: 'Informasi yang Terpotong',
      gaya: 'Teks teriris (sliced)',
      tampilan: 'kalimat raksasa diiris jadi 4 pita horizontal; tiap pita bergeser ke kiri/kanan dengan label divisi, lalu meluncur menyatu jadi kalimat utuh',
      jenisHook: 'Anomali',
      hook: '"Tiap divisi pegang sepotong. Tidak ada yang pegang kalimat utuhnya."',
      komposisi: '50% edukasi · 50% meme',
      fakta: [
        'Privasimu Nexus (fakta_produk.json, kunci platform): modul saling terhubung — RoPA, DPIA, DSR, Consent, insiden, pihak ketiga, transfer lintas negara.',
        'Kalimat "Kami tahu data apa, di mana, untuk apa" = inti RoPA (kategori data, sistem/lokasi, tujuan pemrosesan); bukan klaim angka.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const S = (o) => ({ type: 'sl', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4.5, voDelay: 0.4, mus: 'hook',
      vo: 'Tiap divisi pegang sepotong. Tidak ada yang pegang kalimat utuhnya.',
      layar: 'Kalimat "KAMI TAHU DATA APA, DI MANA, UNTUK APA." teriris 4 pita yang bergeser; label LEGAL · IT · CS · MARKETING di tiap pita.',
      sfx: [[0.05, 'hit', 0.35], ['w:sepotong', 'tick', 0.3]],
      vis: S({ mulai: 0 }),
    },
    {
      id: 's2', min: 5, voDelay: 0.25, mus: 'tense',
      vo: 'Legal pegang kontrak. IT pegang sistem. CS pegang keluhan. Marketing pegang persetujuan.',
      layar: 'Tiap pita menyala dan bergeser sedikit saat divisinya disebut.',
      sfx: [['w:Legal', 'tick', 0.3], ['w:IT', 'tick', 0.3], ['w:CS', 'tick', 0.3], ['w:Marketing', 'tick', 0.3]],
      vis: S({ divisi: ['w:Legal', 'w:IT', 'w:CS', 'w:Marketing'] }),
    },
    {
      id: 's3', min: 5.5, voDelay: 0.3, mus: 'main',
      vo: 'Di Privasimu Nexus, potongannya menyatu: RoPA, Consent, DSR, Insiden. Satu platform, saling terhubung.',
      layar: 'Pita meluncur ke posisi semula → kalimat utuh terbaca; label divisi memudar; pil modul RoPA · Consent · DSR · Insiden muncul di bawah.',
      sfx: [['w:menyatu', 'whoosh', 0.45], ['w:menyatu+0.7', 'ding', 0.35], ['w:RoPA', 'pop', 0.25], ['w:Consent', 'pop', 0.25], ['w:DSR', 'pop', 0.25], ['w:Insiden', 'pop', 0.25]],
      vis: S({ satu: 'w:menyatu', modul: ['w:RoPA', 'w:Consent', 'w:DSR', 'w:Insiden'] }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Kalimat utuh, baru bisa dipertanggungjawabkan. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Satu kalimat utuh, satu peta data.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: S({ cta: { tag: 'Satu kalimat utuh,|*satu peta data*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
