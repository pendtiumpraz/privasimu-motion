// TY23 — CARI KATA "Cari 5 Kewajiban": kotak huruf acak; lima kata (RoPA, DPIA, DSR, CONSENT, INSIDEN) dilingkari satu
// per satu sambil timer berjalan; lalu "di Nexus tidak perlu dicari": menu modul asli.
// Hook (relate): "Cari 5 kewajiban UU PDP di kotak ini. Waktumu 10 detik."
// Komposisi: 50% edukasi · 50% meme (mengundang komentar). Satu gaya: grid huruf + kapsul lingkaran (stroke) + timer.
(function (root) {
  const CONFIG = {
    title: 'TY23 · Cari 5 Kewajiban (cari kata)',
    naskah: 'TY23',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 112 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 112, mode: 'major', root: 57, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.8 },
    meta: {
      judul: 'Cari 5 Kewajiban',
      gaya: 'Cari kata',
      tampilan: 'kotak teka-teki cari kata di atas kertas biru muda; timer 10 detik; kata yang ditemukan dilingkari kapsul kuning; lalu menu modul asli',
      jenisHook: 'Relate',
      hook: '"Cari 5 kewajiban UU PDP di kotak ini. Waktumu 10 detik."',
      komposisi: '50% edukasi · 50% meme',
      fakta: [
        'Lima kata = modul Nexus yang menangani kewajiban UU PDP: RoPA (catatan pemrosesan), DPIA (penilaian dampak), DSR (hak subjek data), Consent (persetujuan), Insiden (pemberitahuan 3×24 jam) — fakta_produk.json. Menu di layar = sidebar dasbor asli (assets/app/dashboard.png).',
        'Angka "10 detik" = permainan, bukan klaim produk.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const W = (o) => ({ type: 'ck', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4, voDelay: 0.35, mus: 'play',
      vo: 'Cari lima kewajiban UU PDP di kotak ini. Waktumu sepuluh detik.',
      layar: 'Kotak cari kata 12×9 penuh huruf; di "sepuluh detik" timer 10,0 mulai berjalan.',
      sfx: [[0.1, 'paper', 0.3], ['w:sepuluh', 'tick', 0.4]],
      vis: W({ timer: 'w:sepuluh', teks: 'Cari *5 kewajiban* di kotak ini. Waktumu 10 detik.' }),
    },
    {
      id: 's2', min: 6, voDelay: 0.6, mus: 'play',
      vo: 'RoPA. DPIA. DSR. Consent. Insiden.',
      layar: 'Kapsul kuning melingkari RoPA, DPIA, DSR, CONSENT, INSIDEN tepat saat disebut; penghitung 1/5 … 5/5; timer berhenti.',
      sfx: [['w:RoPA', 'pop', 0.35], ['w:DPIA', 'pop', 0.35], ['w:DSR', 'pop', 0.35], ['w:Consent', 'pop', 0.35], ['w:Insiden', 'tada', 0.4]],
      vis: W({ temu: ['w:RoPA', 'w:DPIA', 'w:DSR', 'w:Consent', 'w:Insiden'], stopAt: 'w:Insiden+0.4' }),
    },
    {
      id: 's3', min: 5, voDelay: 0.25, mus: 'main',
      vo: 'Di Privasimu Nexus tidak perlu dicari: semuanya sudah ada di satu menu.',
      layar: 'Kotak memudar; potongan menu sidebar asli (RoPA, DPIA, LIA, TIA, …) meluncur masuk dengan sorotan bergerak.',
      sfx: [['w:menu-0.3', 'whoosh', 0.35], ['w:menu+0.2', 'check', 0.4]],
      vis: W({ menu: 'w:tidak', teks: 'Tidak perlu dicari: *semuanya di satu menu*.' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Ketemu berapa? Tulis di komentar. Lalu cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Ketemu berapa? Tulis di komentar.", tombol privasimu.com, kontak.',
      sfx: [['w:cek', 'pop', 0.4]],
      vis: W({ cta: { terang: true, tag: 'Ketemu berapa?|*Tulis di komentar.*', at: 0.15, btnAt: 'w:cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
