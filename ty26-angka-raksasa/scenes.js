// TY26 — ANGKA RAKSASA "2%": satu angka memenuhi layar, keterangan kecil di bawahnya, lalu peta kewajiban bersanksi.
// Hook (anomali): "Angka kecil yang bikin CFO berdiri dari kursinya: dua persen."
// Komposisi: 80% edukasi · 20% meme. Satu gaya: big number (fit-to-width, hentakan, bernapas lewat lebar huruf).
(function (root) {
  const CONFIG = {
    title: 'TY26 · 2% (angka raksasa)',
    naskah: 'TY26',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+6%',
    maxPause: 0.4,
    beat: 60 / 96 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 96, mode: 'minor', root: 50, lead: 'pluck', drums: 'full', sonic: true },
    mix: { duckTo: 0.4, musicGain: 0.8 },
    meta: {
      judul: '2%',
      gaya: 'Angka raksasa (big number)',
      tampilan: 'hitam pekat, angka 2% putih selebar layar dengan aksen merah; keterangan kecil; lalu angka mengecil dan peta kewajiban bersanksi muncul',
      jenisHook: 'Anomali',
      hook: '"Angka kecil yang bikin CFO berdiri dari kursinya: dua persen."',
      komposisi: '80% edukasi · 20% meme',
      sasaran: 'direksi, CFO, manajemen risiko, DPO/PPDP',
      fakta: [
        'UU PDP (UU 27/2022) Pasal 57 ayat (3): denda administratif paling tinggi 2% dari pendapatan tahunan atau penerimaan tahunan terhadap variabel pelanggaran. Cek ulang bunyi pasal sebelum tayang.',
        'Paparan Sanksi Administratif: pemetaan pasal bersanksi ke modul kepatuhan terkait + penilaian paparan sanksi (fakta_produk.json: sanksi). Peta di layar memakai nama kewajiban, bukan nomor pasal.',
        'CTA "konsultasi gratis": pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const B = (o) => ({ type: 'bn', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 3.5, voDelay: 0.35, mus: 'hook',
      vo: 'Angka kecil yang bikin CFO berdiri dari kursinya.',
      layar: 'Angka 2% putih raksasa selebar layar menghantam masuk; keterangan kecil "angka kecil" di bawahnya; di "kursinya" layar bergetar.',
      sfx: [[0.02, 'impact', 0.6], ['w:kursinya', 'hit', 0.4]],
      vis: B({ hantam: 0, getar: 'w:kursinya', teks: 'angka kecil.', teksAt: 'w:Angka' }),
    },
    {
      id: 's2', min: 3.5, voDelay: 0.25, mus: 'tense',
      vo: 'Dua persen. Dari pendapatan tahunan.',
      layar: 'Angka 2% berdenyut melebar saat disebut; keterangan: "dari pendapatan tahunan" + catatan kecil UU PDP Pasal 57 ayat (3).',
      sfx: [['w:Dua', 'boom', 0.45], ['w:pendapatan', 'tick', 0.4]],
      vis: B({ denyut: 'w:Dua', teks: 'dari *pendapatan tahunan*.', teksAt: 'w:Dari', catatan: 'UU PDP Pasal 57 ayat (3): denda administratif paling tinggi' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.25, mus: 'main',
      vo: 'Privasimu Nexus memetakan kewajiban mana yang bersanksi, dan modul mana yang menanganinya.',
      layar: 'Angka mengecil ke atas. Peta: Dasar pemrosesan → Consent; Catatan pemrosesan → RoPA; Penilaian dampak → DPIA; Lapor kebocoran 3×24 jam → Insiden.',
      sfx: [[0.05, 'whoosh', 0.35], ['w:kewajiban', 'pop', 0.3], ['w:kewajiban+0.5', 'pop', 0.3], ['w:kewajiban+1.0', 'pop', 0.3], ['w:kewajiban+1.5', 'pop', 0.3], ['w:modul', 'check', 0.4]],
      vis: B({
        kecil: 0.05, peta: 'w:kewajiban', modulAt: 'w:modul',
        baris: [['Dasar pemrosesan', 'Consent'], ['Catatan pemrosesan', 'RoPA'], ['Penilaian dampak', 'DPIA'], ['Lapor kebocoran 3×24 jam', 'Insiden']],
        teks: 'Kewajiban bersanksi → *modul yang menanganinya*.', teksAt: 'w:memetakan',
      }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Jangan tunggu angkanya jadi tagihan. Konsultasi gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Jangan tunggu angkanya jadi tagihan.", tombol privasimu.com, "Konsultasi gratis", kontak.',
      sfx: [['w:Konsultasi', 'pop', 0.4]],
      vis: B({ cta: { tag: 'Jangan tunggu angkanya|jadi *tagihan*.', sub: '*Konsultasi gratis* · Start Pre Check', at: 0.15, btnAt: 'w:Konsultasi' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
