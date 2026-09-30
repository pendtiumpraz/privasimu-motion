// GB39 — KALEIDOSKOP "Dari Dekat, Kacau": satu irisan tangkapan layar dasbor dicerminkan 8 kali (transform + clip-path)
// dan berputar seperti teropong kaleidoskop; dari dekat tampak kacau, kamera mundur → pola simetris; lalu logo di
// tengah dengan cincin modul; CTA.
// Hook (logika dipatahkan): "Dari dekat terlihat kacau. Dari jauh, ini pola."
// Komposisi: 30% edukasi · 70% meme. Satu gaya: kaleidoskop 8 irisan dari potongan layar Postur Kepatuhan asli.
(function (root) {
  const CONFIG = {
    title: 'GB39 · Dari Dekat, Kacau (kaleidoskop)',
    naskah: 'GB39',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 96 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 96, mode: 'major', root: 57, lead: 'bell', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.75 },
    meta: {
      judul: 'Dari Dekat, Kacau',
      gaya: 'Kaleidoskop',
      tampilan: 'lingkaran kaleidoskop di latar ungu gelap: 8 irisan cermin dari potongan layar hasil GAP (skor 81% hijau, batang merah muda) berputar pelan; close-up kacau → mundur jadi mandala simetris; logo di pusat + cincin 7 modul',
      jenisHook: 'Logika dipatahkan',
      hook: '"Dari dekat terlihat kacau. Dari jauh, ini pola."',
      komposisi: '30% edukasi · 70% meme',
      rekam: ['gap-hasil'],
      fakta: [
        'Privasimu Nexus (fakta_produk.json, kunci platform): modul saling terhubung — RoPA, DPIA, DSR, Consent, insiden, pihak ketiga, transfer lintas negara.',
        'Sumber irisan = tangkapan asli assets/app/gap-hasil.png, header (nama organisasi) dipotong lewat clip-path.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const K = (o) => ({ type: 'kd', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4.5, voDelay: 0.5, mus: 'hook',
      vo: 'Dari dekat, terlihat kacau.',
      layar: 'Close-up kaleidoskop (zoom 2,4×): pecahan grafik, angka, warna berputar — kacau.',
      sfx: [[0.1, 'whoosh', 0.3], ['w:kacau', 'tick', 0.25]],
      vis: K({ mulai: 0.05, teks: 'Dari dekat, *terlihat kacau*.' }),
    },
    {
      id: 's2', min: 5, voDelay: 0.5, mus: 'main',
      vo: 'Dari jauh… ini pola.',
      layar: 'Kamera mundur pada "jauh": lingkaran penuh terlihat — mandala simetris 8 irisan yang berputar tenang.',
      sfx: [['w:jauh', 'whoosh', 0.45], ['w:pola', 'ding', 0.35]],
      vis: K({ jauh: 'w:jauh', teks: 'Dari jauh, *ini pola*.' }),
    },
    {
      id: 's3', min: 5.5, voDelay: 0.3, mus: 'main',
      vo: 'Privasimu Nexus: modul saling terhubung, dari RoPA sampai transfer lintas negara. Satu pola.',
      layar: 'Kaleidoskop meredup jadi latar; logo Privasimu muncul di pusat; cincin 7 pil modul menyala satu per satu saat disebut.',
      sfx: [['w:Privasimu', 'pop', 0.35], ['w:RoPA', 'tick', 0.2], ['w:RoPA+0.3', 'tick', 0.2], ['w:RoPA+0.6', 'tick', 0.2], ['w:RoPA+0.9', 'tick', 0.2], ['w:RoPA+1.2', 'tick', 0.2], ['w:RoPA+1.5', 'tick', 0.2], ['w:transfer', 'tick', 0.2], ['w:Satu', 'ding', 0.35]],
      vis: K({ logo: 'w:Privasimu', modul: ['w:RoPA', 'w:transfer'] }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Dari dekat kacau, dari jauh pola. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Dari dekat kacau, dari jauh pola.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: K({ cta: { tag: 'Dari dekat kacau,|*dari jauh pola*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
