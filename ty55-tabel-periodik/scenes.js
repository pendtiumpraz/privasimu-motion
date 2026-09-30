// TY55 — TABEL PERIODIK "Unsur-unsur Kepatuhan": kotak unsur dua huruf bernomor tersusun ala tabel periodik; Ro, Dp, Ds
// menyala berurutan & membesar; "reaksi": Ro (data spesifik) → risiko TINGGI → Dp draf otomatis; unsur paling reaktif In
// (3×24 jam) bergetar; lalu unsur-unsur bergeser membentuk satu rumus senyawa → PRIVASIMU NEXUS; CTA.
// Hook (anomali): "Ro. Dp. Ds. Tiga unsur yang wajib ada di kantormu."
// Komposisi: 30% edukasi · 70% meme. Satu gaya: grid kotak unsur (warna sendiri per golongan, bukan meniru logo serial TV).
(function (root) {
  const CONFIG = {
    title: 'TY55 · Unsur Kepatuhan (tabel periodik)',
    naskah: 'TY55',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+9%',
    maxPause: 0.4,
    beat: 60 / 108 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 108, mode: 'minor', root: 52, lead: 'chip', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.7 },
    meta: {
      judul: 'Unsur-unsur Kepatuhan',
      gaya: 'Tabel periodik',
      tampilan: 'latar papan tulis gelap kebiruan; 12 kotak unsur berwarna per golongan (lambang dua huruf, nomor, nama) jatuh ke tempatnya ala tabel periodik; kotak terpilih menyala & membesar; panah reaksi; kotak bergetar; unsur bergeser membentuk baris rumus senyawa → lencana NEXUS',
      jenisHook: 'Anomali',
      hook: '"Ro. Dp. Ds. Tiga unsur yang wajib ada di kantormu."',
      komposisi: '30% edukasi · 70% meme',
      fakta: [
        'RoPA (fakta_produk.json): data spesifik menandai risiko TINGGI otomatis; RoPA berisiko TINGGI otomatis membuat draf DPIA.',
        'DSR: tenggat otomatis 72 jam. Insiden (breach): penghitung mundur pemberitahuan 3×24 jam.',
        'Unsur lain = modul platform (Consent, Pihak ketiga/TPRM, Transfer lintas negara, GAP, Maturity, Simulasi, Telaah kontrak, PPDP) — modul saling terhubung.',
        'Nomor "unsur" & tata letak = permainan visual (bukan sistem periodik nyata; warna/tata letak dibuat sendiri).',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const T = (o) => ({ type: 'tp', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.5, mus: 'hook',
      vo: 'Ro. Dp. Ds. Tiga unsur yang wajib ada di kantormu.',
      layar: 'Kotak-kotak unsur berjatuhan ke posisi tabel; Ro, Dp, Ds menyala berurutan dan membesar saat disebut.',
      sfx: [[0.05, 'whoosh', 0.3], ['w:Ro', 'tick', 0.35], ['w:Dp', 'tick', 0.35], ['w:Ds', 'tick', 0.35], ['w:wajib', 'ding', 0.3]],
      vis: T({ mulai: 0.05, nyala: [['Ro', 'w:Ro'], ['Dp', 'w:Dp'], ['Ds', 'w:Ds']], teks: 'Tiga unsur *wajib*: Ro · Dp · Ds.' }),
    },
    {
      id: 's2', min: 5, voDelay: 0.3, mus: 'tense',
      vo: 'Reaksinya: RoPA dengan data spesifik jadi risiko tinggi, otomatis memicu DPIA. Paling reaktif: Insiden, tenggat tiga kali dua puluh empat jam.',
      layar: 'Ro berpendar merah berlabel "data spesifik → TINGGI"; panah reaksi ke Dp berlabel "draf otomatis"; In bergetar, berpijar, berlabel "3×24 jam".',
      sfx: [['w:Reaksinya', 'tick', 0.3], ['w:tinggi', 'hit', 0.35], ['w:DPIA', 'ding', 0.35], ['w:Insiden', 'hit', 0.45], ['w:jam', 'tick', 0.3]],
      vis: T({ reaksi: 'w:tinggi-0.3', picu: 'w:DPIA-0.2', reaktif: 'w:Insiden-0.2', teks: 'Ro + data spesifik → *TINGGI* → Dp otomatis.' }),
    },
    {
      id: 's3', min: 5, voDelay: 0.3, mus: 'main',
      vo: 'Di Privasimu Nexus, semua unsur jadi satu senyawa. Satu platform, saling terhubung.',
      layar: 'Kotak lain memudar; Ro·Dp·Ds·Cs·In·Pk·Tr meluncur membentuk satu baris rumus dengan titik pemisah; panah → lencana "NEXUS" muncul berpendar.',
      sfx: [['w:Di', 'whoosh', 0.45], ['w:senyawa', 'pop', 0.3], ['w:Satu', 'ding', 0.4]],
      vis: T({ senyawa: 'w:senyawa-0.4', nexus: 'w:Satu', teks: 'Satu *senyawa*: Privasimu Nexus.' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Unsur lengkap, reaksi aman. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Unsur lengkap, reaksi aman.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: T({ cta: { tag: 'Unsur lengkap,|*reaksi aman*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
