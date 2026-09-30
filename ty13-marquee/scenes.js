// TY13 — MARQUEE BRUTALIST "Yang Mana Punyamu?": baris-baris teks raksasa berjalan berlawanan arah memenuhi layar
// (semua kewajiban UU PDP), lalu berhenti; tiap kewajiban dicap dengan modul yang menanganinya.
// Hook (anomali): "Semua tulisan ini kewajiban. Yang mana yang sudah kamu kerjakan?"
// Komposisi: 50% edukasi · 50% meme. Satu gaya: pita teks translateX berkecepatan beda, berhenti serentak, cap modul.
(function (root) {
  const CONFIG = {
    title: 'TY13 · Yang Mana Punyamu? (marquee brutalist)',
    naskah: 'TY13',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.35,
    beat: 60 / 120 / 2,
    tail: 0.3,
    burnCaptions: false,
    music: { bpm: 120, mode: 'minor', root: 50, lead: 'chip', drums: 'full', sonic: true },
    mix: { duckTo: 0.38, musicGain: 0.8 },
    meta: {
      judul: 'Yang Mana Punyamu?',
      gaya: 'Marquee brutalist (teks berjalan bertumpuk)',
      tampilan: 'hitam-putih-kuning asam; tujuh pita teks kapital raksasa berjalan berlawanan arah, berhenti serentak, lalu dicap modul',
      jenisHook: 'Anomali',
      hook: '"Semua tulisan ini kewajiban. Yang mana yang sudah kamu kerjakan?"',
      komposisi: '50% edukasi · 50% meme',
      fakta: [
        'Kewajiban di pita = ringkasan kewajiban UU PDP yang ditangani modul Nexus: catat pemrosesan (RoPA), nilai risiko (DPIA), jawab permohonan (DSR), lapor insiden 3×24 jam (Insiden; UU PDP Pasal 46), kelola persetujuan (Consent), nilai pihak ketiga (TPRM), catat transfer (Transfer Lintas Negara) — fakta_produk.json.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const M = (o) => ({ type: 'mq', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 3.5, voDelay: 0.35, mus: 'hook',
      vo: 'Semua tulisan ini: kewajiban.',
      layar: 'Tujuh pita teks kapital raksasa berjalan cepat berlawanan arah: CATAT PEMROSESAN · NILAI RISIKO · JAWAB PERMOHONAN · LAPOR INSIDEN 3×24 JAM · …',
      sfx: [[0.05, 'whoosh', 0.4], ['w:kewajiban', 'hit', 0.4]],
      vis: M({ teks: 'Semua tulisan ini: *kewajiban*.' }),
    },
    {
      id: 's2', min: 3.5, voDelay: 0.25, mus: 'tense',
      vo: 'Yang mana yang sudah kamu kerjakan?',
      layar: 'Pita melambat lalu berhenti serentak di "kerjakan"; kotak centang kosong muncul di depan tiap kewajiban.',
      sfx: [['w:kerjakan-0.9', 'slidedown', 0.4], ['w:kerjakan+0.35', 'tock', 0.5]],
      vis: M({ stop: 'w:kerjakan-0.9', kotak: 'w:kerjakan+0.4', teks: '*Yang mana* yang sudah kamu kerjakan?' }),
    },
    {
      id: 's3', min: 7, voDelay: 0.25, mus: 'main',
      vo: 'Di Privasimu Nexus, tiap kewajiban punya modulnya: RoPA, DPIA, DSR, Insiden, Consent, pihak ketiga, transfer.',
      layar: 'Kotak dicentang satu per satu dan cap modul (RoPA, DPIA, DSR, INSIDEN, CONSENT, PIHAK KETIGA, TRANSFER) menempel di tiap baris.',
      sfx: [['w:RoPA', 'stamp', 0.4], ['w:DPIA', 'stamp', 0.4], ['w:DSR', 'stamp', 0.4], ['w:Insiden', 'stamp', 0.4], ['w:Consent', 'stamp', 0.4], ['w:pihak', 'stamp', 0.4], ['w:transfer', 'stamp', 0.4]],
      vis: M({ cap: ['w:RoPA', 'w:DPIA', 'w:DSR', 'w:Insiden', 'w:Consent', 'w:pihak', 'w:transfer'], teks: 'Tiap kewajiban *punya modulnya*.' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Tujuh kewajiban, satu platform. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup brutalist: logo, "Tujuh kewajiban, satu platform.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: M({ cta: { tag: 'Tujuh kewajiban,|*satu platform*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
