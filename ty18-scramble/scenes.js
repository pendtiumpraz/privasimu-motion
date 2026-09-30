// TY18 — TEXT SCRAMBLE "kol_17": nama kolom yang tak bermakna berputar acak lalu "terkunci" satu huruf demi satu huruf
// menjadi jenis data pribadi yang sebenarnya; kolom ditandai umum/spesifik dan dikaitkan ke RoPA.
// Hook (anomali): "Kolom bernama kol_17 ini ternyata berisi NIK."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: decode/scramble per karakter (monospace, huruf terkunci berubah warna).
(function (root) {
  const CONFIG = {
    title: 'TY18 · kol_17 (text scramble)',
    naskah: 'TY18',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 112 / 2,
    tail: 0.35,
    burnCaptions: false,
    capMap: [['kol tujuh belas', 'kol_17']],
    music: { bpm: 112, mode: 'minor', root: 52, lead: 'chip', drums: 'chip', sonic: true },
    mix: { duckTo: 0.4, musicGain: 0.75 },
    meta: {
      judul: 'kol_17',
      gaya: 'Text scramble / decode',
      tampilan: 'tabel gelap bergaya basis data; nama kolom dan isinya berputar acak lalu terkunci karakter demi karakter menjadi NIK, No. HP, Email, Riwayat kesehatan',
      jenisHook: 'Anomali',
      hook: '"Kolom bernama kol_17 ini ternyata berisi NIK."',
      komposisi: '70% edukasi · 30% meme',
      sasaran: 'tim TI/data, DPO/PPDP',
      rekam: ['"kol_17" dibaca "kol tujuh belas".'],
      fakta: [
        'Data Discovery: katalog sistem & sumber data; pemindaian kolom mendeteksi data pribadi umum dan spesifik; keterkaitan kolom ke RoPA (fakta_produk.json: data-discovery).',
        'Data kesehatan termasuk data pribadi yang bersifat spesifik (UU PDP Pasal 4 ayat 2). NIK, nomor HP, email = data pribadi umum.',
        'Nama kolom, isi sel (disamarkan), dan jumlah kolom = ilustrasi; diberi label "*ilustrasi" di layar. Kode RoPA yang tampil mengikuti data demo register (ROPA-IT-2026-002 · Layanan pelanggan).',
      ],
    },
  };
  const S = (o) => ({ type: 'sc', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4, voDelay: 0.35, mus: 'tense',
      vo: 'Kolom bernama kol tujuh belas ini, ternyata berisi NIK.',
      layar: 'Kolom "kol_17" dengan isi acak berputar. Di "ternyata", nama kolom terkunci jadi "NIK" dan isinya terurai (disamarkan).',
      sfx: [['w:ternyata', 'glitch', 0.35], ['w:NIK', 'correct', 0.45]],
      vis: S({ kunci: [[0, 'w:ternyata']], teks: 'Kolom "kol_17" ini, ternyata berisi *NIK*.' }),
    },
    {
      id: 's2', min: 5, voDelay: 0.25, mus: 'main',
      vo: 'Pemindaian Data Discovery menemukan kolom lain: nomor HP, email, dan riwayat kesehatan.',
      layar: 'Tiga kolom lain muncul acak, lalu terkunci satu per satu: No. HP, Email, Riwayat kesehatan.',
      sfx: [['w:kolom', 'blip', 0.3], ['w:nomor', 'correct', 0.35], ['w:email', 'correct', 0.35], ['w:riwayat', 'correct', 0.35]],
      vis: S({ munculAt: 'w:kolom', kunci: [[1, 'w:nomor'], [2, 'w:email'], [3, 'w:riwayat']], teks: 'Pemindaian menemukan kolom lain: *nomor HP, email, riwayat kesehatan*.' }),
    },
    {
      id: 's3', min: 5, voDelay: 0.25, mus: 'main',
      vo: 'Ditandai sebagai data pribadi umum atau spesifik, lalu dikaitkan ke RoPA-nya.',
      layar: 'Label "umum" (3×) dan "spesifik" (merah) muncul di bawah kolom; lalu pil "RoPA-IT-2026-002 · Layanan pelanggan" terhubung ke tabel.',
      sfx: [['w:umum', 'pop', 0.35], ['w:spesifik', 'shock', 0.35], ['w:RoPA-nya', 'ding', 0.4]],
      vis: S({ tandaAt: 'w:umum', spesifikAt: 'w:spesifik', ropaAt: 'w:RoPA-nya', teks: 'Ditandai *umum* / *spesifik*, lalu dikaitkan ke RoPA.' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Tahu di mana data pribadimu, sebelum orang lain yang tahu. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Tahu di mana datamu, sebelum orang lain tahu.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: S({ cta: { tag: 'Tahu di mana datamu,|*sebelum orang lain* tahu.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
