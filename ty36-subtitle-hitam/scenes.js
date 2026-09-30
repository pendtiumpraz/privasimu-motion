// TY36 — SUBTITLE DI LAYAR HITAM "Selamat Pagi, Kami dari Tim Audit": layar hitam total, hanya subtitle dan suara
// (ketukan pintu, langkah kaki, jangkrik, detak jantung). Gambar baru muncul saat "layar menyala": dasbor kepatuhan.
// Hook (anomali): "[pintu diketuk] Selamat pagi, kami dari tim audit."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: subtitle + keterangan suara dalam kurung siku; desain suara jadi "gambar".
// vis.subs: [[teks, mulai, selesai, jenis]] — jenis 'b' = keterangan bunyi (miring, abu-abu), 'u' = ucapan.
(function (root) {
  const CONFIG = {
    title: 'TY36 · Selamat Pagi, Kami dari Tim Audit (subtitle di layar hitam)',
    naskah: 'TY36',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+4%',
    maxPause: 0.5,
    tail: 0.4,
    burnCaptions: false, // seluruh video memang berupa subtitle; .srt tetap dibuat
    music: { bpm: 96, mode: 'major', root: 55, lead: 'keys', drums: 'light', sonic: true },
    mix: { duckTo: 0.5, musicGain: 0.9 },
    meta: {
      judul: 'Selamat Pagi, Kami dari Tim Audit',
      gaya: 'Subtitle saja di layar hitam',
      tampilan: 'layar hitam; hanya teks subtitle putih dan keterangan suara dalam kurung siku; gambar pertama baru muncul setelah ± 12 detik',
      jenisHook: 'Anomali',
      hook: '"[pintu diketuk] Selamat pagi, kami dari tim audit."',
      komposisi: '70% edukasi · 30% meme',
      pengisi: '2 suara: auditor (S1, S2) dan narator (S4, S5); boleh satu orang dengan dua gaya',
      rekam: ['S1 dan S2 dibaca sebagai auditor yang ramah tapi resmi. S4 dan S5 dibaca narator yang tenang.', 'S3 tanpa suara (hening, jangkrik, detak jantung disintesis).'],
      fakta: [
        'Dasbor kepatuhan lintas modul + antrean pekerjaan = perangkat kerja PPDP/DPO (fakta_produk.json: ppdp).',
        'Layar yang tampil = dasbor asli (assets/app/dashboard.png, dipotong tanpa nama organisasi); angka 81%, 4, 20 = data demo.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const S = (o) => ({ type: 'sub', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4, voDelay: 1.5, mus: 'none',
      vo: 'Selamat pagi. Kami dari tim audit.',
      layar: 'Layar hitam. Subtitle: [pintu diketuk] → "– Selamat pagi. Kami dari tim audit."',
      vis: S({ bunyi: [['ketuk', 0.2]], subs: [['[pintu diketuk]', 0, 1.4, 'b'], ['– Selamat pagi.', 'w:Selamat', 'w:Kami-0.05', 'u'], ['– Selamat pagi.|Kami dari tim audit.', 'w:Kami-0.05', 'end-0.0', 'u']] }),
    },
    {
      id: 's2', min: 3.6, voDelay: 1.15, mus: 'none',
      vo: 'Boleh kami lihat bukti kepatuhan data pribadinya?',
      layar: 'Layar hitam. Subtitle: [langkah kaki mendekat] → "– Boleh kami lihat bukti kepatuhan data pribadinya?"',
      vis: S({ bunyi: [['langkah', 0.1]], subs: [['[langkah kaki mendekat]', 0, 1.1, 'b'], ['– Boleh kami lihat|bukti kepatuhan data pribadinya?', 'w:Boleh', 'end-0.0', 'u']] }),
    },
    {
      id: 's3', min: 3.9, vo: '', mus: 'none',
      layar: 'Layar hitam. Subtitle: [hening panjang] → [suara jangkrik] → [jantung berdebar]',
      sfx: [[1.3, 'crickets', 0.5], [2.6, 'heart', 0.8], [3.2, 'heart', 0.9]],
      vis: S({ subs: [['[hening panjang]', 0.1, 1.3, 'b'], ['[suara jangkrik]', 1.3, 2.55, 'b'], ['[jantung berdebar]', 2.55, 'end-0.0', 'b']] }),
    },
    {
      id: 's4', min: 5, voDelay: 0.9, mus: 'main', voice: 'id-ID-GadisNeural', voiceRate: '+8%',
      vo: 'Atau, jawab dengan satu layar. Dasbor kepatuhan Privasimu Nexus.',
      layar: 'Subtitle: [klik. layar menyala] → dasbor kepatuhan asli menyala seperti monitor di ruang gelap. Subtitle mengikuti narator.',
      sfx: [[0.12, 'key', 0.7], [0.3, 'shimmer', 0.4], ['w:Dasbor', 'pop', 0.3]],
      vis: S({
        nyala: 0.3,
        subs: [['[klik. layar menyala]', 0.05, 0.85, 'b'], ['Atau, jawab dengan satu layar.', 'w:Atau', 'w:Dasbor-0.05', 'u'], ['Dasbor kepatuhan|Privasimu Nexus.', 'w:Dasbor-0.05', 'end-0.0', 'u']],
      }),
    },
    {
      id: 's5', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.3, voice: 'id-ID-GadisNeural', voiceRate: '+8%',
      vo: 'Siap diperiksa kapan saja. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup di atas hitam: logo Privasimu Nexus, "Siap diperiksa kapan saja.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: S({ cta: { tag: 'Siap diperiksa|*kapan saja*.', at: 0.15, btnAt: 'w:Cek', tirai: false } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
