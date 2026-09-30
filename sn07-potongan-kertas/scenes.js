// SN07 — TITLE SEQUENCE POTONGAN KERTAS "Pembuka": pembuka film ala potongan kertas (paper cut-out) — lapisan kertas
// bertepi kasar, bentuk geometris tajam, tipografi tebal miring, kamera paralaks; kredit pembuka "dipersembahkan oleh:
// tenggat yang tidak menunggu" → "menampilkan RoPA… DPIA… DSR… Consent… Insiden… Pihak ketiga… Transfer" (tiap nama
// dipotong dari kertas & terbuka) → payoff: semua lapisan menyatu jadi perisai Privasimu Nexus → CTA.
// Hook (anomali): "Dipersembahkan oleh: tenggat yang tidak menunggu."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: potongan kertas berlapis (palet 3 warna), gerak kaku, huruf miring tebal.
(function (root) {
  const CONFIG = {
    title: 'SN07 · Lapisan yang Menyatu (title sequence potongan kertas)',
    naskah: 'SN07',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+9%',
    maxPause: 0.45,
    beat: 60 / 100 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 100, mode: 'minor', root: 50, lead: 'keys', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.78 },
    meta: {
      judul: 'Pembuka',
      gaya: 'Title sequence potongan kertas',
      tampilan: 'lapisan kertas bertepi kasar (krem, jingga bata, biru tua) bergerak paralaks dengan bayangan berlapis; bentuk geometris tajam (segitiga, lingkaran, garis diagonal) bergerak kaku; kartu judul modul "dipotong" & terbuka satu per satu; akhir: lapisan menyatu jadi perisai Privasimu Nexus',
      jenisHook: 'Anomali',
      hook: '"Dipersembahkan oleh: tenggat yang tidak menunggu."',
      komposisi: '70% edukasi · 30% meme',
      fakta: [
        'Privasimu Nexus (fakta_produk.json, kunci platform): platform manajemen privasi untuk UU PDP & PP 33/2026; modul saling terhubung — RoPA, DPIA, DSR, Consent, insiden, pihak ketiga, transfer lintas negara; tersedia SaaS maupun on-premise.',
        'Gaya pembuka film era potongan kertas secara umum; tidak meniru judul/film tertentu; tanpa nama orang.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const K = (o) => ({ type: 'pk', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.6, mus: 'hook',
      vo: 'Dipersembahkan oleh… tenggat yang tidak menunggu.',
      layar: 'Tirai kertas krem terbuka; bentuk geometris (segitiga bata, lingkaran biru) meluncur kaku; kartu kredit "DIPERSEMBAHKAN OLEH" lalu potongan kertas besar "TENGGAT YANG TIDAK MENUNGGU" terbuka miring.',
      sfx: [[0.1, 'whoosh', 0.3], ['w:Dipersembahkan', 'tick', 0.3], ['w:tenggat', 'hit', 0.4]],
      vis: K({ buka: 0.05, kredit: [[0, 'w:Dipersembahkan-0.2'], [1, 'w:tenggat-0.15']] }),
    },
    {
      id: 's2', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Menampilkan: RoPA, DPIA, DSR, Consent, Insiden, pihak ketiga, dan transfer lintas negara.',
      layar: 'Kredit "MENAMPILKAN"; tujuh kartu judul modul dipotong dari kertas dan terbuka satu per satu di posisi berbeda (paralaks 3 lapisan), palet bata/biru/krem.',
      sfx: [['w:Menampilkan', 'tick', 0.3], ['w:RoPA', 'pop', 0.3], ['w:DPIA', 'pop', 0.3], ['w:DSR', 'pop', 0.3], ['w:Consent', 'pop', 0.3], ['w:Insiden', 'pop', 0.3], ['w:pihak', 'pop', 0.3], ['w:transfer', 'pop', 0.3]],
      vis: K({ kredit: [[2, 'w:Menampilkan-0.2']], modul: ['w:RoPA', 'w:DPIA', 'w:DSR', 'w:Consent', 'w:Insiden', 'w:pihak', 'w:transfer'] }),
    },
    {
      id: 's3', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Tujuh potongan, satu lapisan: Privasimu Nexus. Modul saling terhubung, tersedia SaaS maupun on-premise.',
      layar: 'Payoff: tujuh kartu meluncur ke tengah dan menumpuk menjadi perisai kertas berlapis; logo Privasimu Nexus muncul di atasnya; garis diagonal kertas menyapu.',
      sfx: [['w:Tujuh', 'whoosh', 0.45], ['w:satu', 'hit', 0.4], ['w:Nexus', 'ding', 0.4], ['w:Modul', 'tick', 0.25]],
      vis: K({ satu: 'w:satu-0.3', logo: 'w:Nexus-0.2', sub: 'w:Modul' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Pembukanya sudah. Sekarang giliranmu. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Pembukanya sudah, sekarang giliranmu.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: K({ cta: { tag: 'Pembukanya sudah,|*sekarang giliranmu*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
