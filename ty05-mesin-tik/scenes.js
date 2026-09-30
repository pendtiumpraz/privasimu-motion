// TY05 — MESIN TIK "Surat yang Hampir Dikirim DPO": surat diketik huruf demi huruf mengikuti suara; kalimat
// pengunduran diri ditimpa XXXX lalu diganti permintaan alat yang layak; dasbor asli muncul sebagai jawabannya.
// Hook (relate): "Dengan hormat, saya mengundurkan diri sebagai satu-satunya orang yang mengurus data pribadi di kantor ini."
// Komposisi: 70% edukasi · 30% meme (humor empati; tidak mengejek atasan). Satu gaya: ketikan per karakter + bunyi tuts.
(function (root) {
  const CONFIG = {
    title: 'TY05 · Surat yang Hampir Dikirim DPO (mesin tik)',
    naskah: 'TY05',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+4%',
    maxPause: 0.45,
    tail: 0.35,
    burnCaptions: false, // teks surat = ucapan
    music: { bpm: 80, mode: 'major', root: 53, lead: 'keys', drums: 'none', sonic: true },
    mix: { duckTo: 0.45, musicGain: 0.7 },
    meta: {
      judul: 'Surat yang Hampir Dikirim DPO',
      gaya: 'Mesin tik (typewriter)',
      tampilan: 'kertas krem di mesin tik; huruf muncul satu per satu (Special Elite) dengan bunyi tuts dan "ting" di ujung baris; salah ketik ditimpa XXXX',
      jenisHook: 'Relate',
      hook: '"Dengan hormat, saya mengundurkan diri sebagai satu-satunya orang yang mengurus data pribadi di kantor ini."',
      komposisi: '70% edukasi · 30% meme',
      sasaran: 'DPO/PPDP yang bekerja sendirian; manajemen yang menunjuknya',
      rekam: ['Dibaca seperti orang membaca surat yang sedang diketiknya sendiri: agak datar, lalu tersadar di S2.'],
      fakta: [
        'Dukungan PPDP: antrean pekerjaan yang menunggu tindakan, dasbor kepatuhan lintas modul, asisten AI Priva (fakta_produk.json: ppdp). Layar = dasbor asli (assets/app/dashboard.png, tanpa nama organisasi).',
        'Surat = fiksi humor; tidak merujuk orang atau perusahaan mana pun.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const T = (o) => ({ type: 'tw', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 6, voDelay: 0.6, mus: 'hush',
      vo: 'Dengan hormat. Saya mengundurkan diri sebagai satu-satunya orang yang mengurus data pribadi di kantor ini.',
      layar: 'Kertas di mesin tik. Baris demi baris diketik: "Dengan hormat," / "Saya mengundurkan diri sebagai satu-satunya orang" / "yang mengurus data pribadi di kantor ini."',
      sfx: [[0.15, 'paper', 0.4]],
      vis: T({ baris: [['Dengan hormat,', 'w:Dengan'], ['saya mengundurkan diri sebagai', 'w:Saya'], ['satu-satunya orang yang mengurus', 'w:satu-satunya'], ['data pribadi di kantor ini.', 'w:data']], kepala: 'Kepada Yth. Pimpinan' }),
    },
    {
      id: 's2', min: 3, voDelay: 0.5, mus: 'hush',
      vo: 'Eh. Maksud saya…',
      layar: 'Kata "mengundurkan diri" ditimpa XXXXXXXX cepat (bunyi tuts beruntun). Jeda.',
      sfx: [['w:Eh', 'pop', 0.3]],
      vis: T({ timpa: 'w:Eh+0.4' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.3, mus: 'calm',
      vo: 'Tolong beri saya alat yang layak: antrean kerja, dasbor kepatuhan, dan asisten AI.',
      layar: 'Baris baru diketik: "tolong beri saya alat yang layak." Dasbor kepatuhan asli menyusup dari sisi kertas dengan pita "antrean kerja · dasbor · asisten AI".',
      sfx: [['w:antrean-0.1', 'whoosh', 0.35], ['w:antrean', 'pop', 0.3], ['w:dasbor', 'pop', 0.3], ['w:asisten', 'pop', 0.3]],
      vis: T({ baris: [['Tolong beri saya alat yang layak:', 'w:Tolong'], ['antrean kerja, dasbor kepatuhan,', 'w:antrean'], ['dan asisten AI.', 'w:dan']], layar: 'w:antrean-0.1', cip: [['antrean kerja', 'w:antrean'], ['dasbor kepatuhan', 'w:dasbor'], ['asisten AI Priva', 'w:asisten']] }),
    },
    {
      id: 's4', min: 5, voDelay: 0.4, mus: 'outro', free: true, tail: 1.4,
      vo: 'Hormat saya, DPO yang akhirnya punya alat. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Baris penutup diketik: "Hormat saya, DPO yang akhirnya punya alat." → kartu penutup: logo, tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: T({ baris: [['Hormat saya,', 'w:Hormat'], ['DPO yang akhirnya punya alat.', 'w:DPO']], cta: { terang: true, tag: 'Suratnya batal.|*Alatnya* datang.', at: 'w:Cek-0.5', btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
