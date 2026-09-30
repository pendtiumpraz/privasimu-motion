// TY17 — SATU KATA PER LAYAR "Patuh Bukan Perasaan": satu kata besar berganti tepat saat diucapkan (huruf tengah jadi
// titik fokus), latar berganti warna tiap kata; lalu skor GAP asli.
// Hook (logika dipatahkan): "Patuh. Bukan. Perasaan."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: RSVP (rapid serial visual presentation) dengan huruf fokus berwarna.
(function (root) {
  const CONFIG = {
    title: 'TY17 · Patuh Bukan Perasaan (satu kata per layar)',
    naskah: 'TY17',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+0%',
    maxPause: 0.6,
    beat: 60 / 100 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 100, mode: 'minor', root: 50, lead: 'pluck', drums: 'full', sonic: true },
    mix: { duckTo: 0.4, musicGain: 0.8 },
    meta: {
      judul: 'Patuh Bukan Perasaan',
      gaya: 'Satu kata per layar',
      tampilan: 'satu kata raksasa memenuhi layar, berganti tepat di ketukan ucapan; huruf tengah berwarna sebagai titik fokus; latar berganti navy–putih–kuning',
      jenisHook: 'Logika dipatahkan',
      hook: '"Patuh. Bukan. Perasaan."',
      komposisi: '70% edukasi · 30% meme',
      rekam: ['Tiap kata di S1 dibaca terpisah dengan jeda pendek: "Patuh. Bukan. Perasaan."'],
      fakta: [
        'GAP Assessment: kuesioner penilaian kepatuhan UU PDP, skor kepatuhan dan rencana remediasi (fakta_produk.json: gap-assessment). Layar = assets/app/gap-hasil.png; skor 81% = data demo.',
        '"Start Pre Check (gratis)" = CTA resmi; pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const S = (o) => ({ type: 'sk', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 3.5, voDelay: 0.3, mus: 'hook',
      vo: 'Patuh. Bukan. Perasaan.',
      layar: 'PATUH (navy) → BUKAN (putih, huruf merah) → PERASAAN (kuning), tiap kata memenuhi layar tepat saat diucapkan.',
      sfx: [['w:Patuh', 'hit', 0.5], ['w:Bukan', 'hit', 0.55], ['w:Perasaan', 'hit', 0.6]],
      vis: S({ kata: [['PATUH', 'w:Patuh', 'navy'], ['BUKAN', 'w:Bukan', 'putih'], ['PERASAAN', 'w:Perasaan', 'kuning']] }),
    },
    {
      id: 's2', min: 5, voDelay: 0.3, mus: 'main',
      vo: 'Ukur. Skor kepatuhan, dari GAP Assessment.',
      layar: 'UKUR (biru) → layar hasil GAP asli dengan skor 81% masuk; label "skor kepatuhan · rencana remediasi".',
      sfx: [['w:Ukur', 'hit', 0.6], ['w:Skor', 'whoosh', 0.35], ['w:Skor+0.5', 'levelup', 0.4]],
      vis: S({ kata: [['UKUR', 'w:Ukur', 'biru']], layar: 'w:Skor', teks: 'Skor kepatuhan · *rencana remediasi*', teksAt: 'w:kepatuhan' }),
    },
    {
      id: 's3', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Start Pre Check, gratis. Di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Patuh itu diukur.", tombol privasimu.com, "Start Pre Check · gratis", kontak.',
      sfx: [['w:Start', 'pop', 0.4]],
      vis: S({ cta: { tag: 'Patuh itu *diukur*.', at: 0.15, btnAt: 'w:Start', sub: '*Start Pre Check* · gratis' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
