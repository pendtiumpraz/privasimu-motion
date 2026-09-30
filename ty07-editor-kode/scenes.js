// TY07 — EDITOR KODE (syntax highlight) "Satu Baris yang Sering Dilupakan": editor gelap bernomor baris; kode diketik
// per karakter dengan warna sintaks; baris "Setuju" disorot; komentar "// lalu buktinya?" muncul; lalu baris versi
// Nexus (API persetujuan + webhook) diketik; panel log bukti tampil; kartu integrasi Consent asli; CTA.
// Hook (logika dipatahkan): "Tombol 'Setuju' itu satu baris kode. Buktinya ada di baris mana?"
// Komposisi: 50% edukasi · 50% meme. Satu gaya: editor kode. Kode = ilustrasi, bukan dokumentasi API.
(function (root) {
  const CONFIG = {
    title: 'TY07 · Satu Baris yang Sering Dilupakan (editor kode)',
    naskah: 'TY07',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 108 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 108, mode: 'minor', root: 50, lead: 'chip', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.65 },
    meta: {
      judul: 'Satu Baris yang Sering Dilupakan',
      gaya: 'Editor kode (syntax highlight)',
      tampilan: 'editor gelap (bilah tab, nomor baris, minimap tipis); kode diketik per karakter dengan warna sintaks; baris disorot merah/hijau; panel log terminal di bawah; kartu integrasi Consent asli',
      jenisHook: 'Logika dipatahkan',
      hook: '"Tombol \'Setuju\' itu satu baris kode. Buktinya ada di baris mana?"',
      komposisi: '50% edukasi · 50% meme',
      rekam: ['consent-detail'],
      fakta: [
        'Consent & Cookie (fakta_produk.json): log persetujuan beserta bukti untuk setiap subjek; API dan webhook untuk sinkronisasi ke sistem internal; penarikan dihormati di seluruh kanal.',
        'Kartu integrasi (Consent Form Embed · Preference Center · Consent Items Editor) = tangkapan asli assets/app/consent-detail.png (header organisasi dipotong).',
        'Kode di layar = ilustrasi (bukan dokumentasi API); kode rekaman CNT-2026-011 dari tangkapan asli.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const E = (o) => ({ type: 'ce', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5.5, voDelay: 0.5, mus: 'hook',
      vo: 'Tombol "Setuju" itu satu baris kode. Buktinya… ada di baris mana?',
      layar: 'Editor: baris 1–4 diketik cepat (<button onClick={setuju}>Setuju</button>, function setuju…); baris 1 disorot; pada "Buktinya" komentar merah "// lalu buktinya?" diketik di baris 4.',
      sfx: [[0.1, 'whoosh', 0.25], ['w:Setuju', 'tick', 0.25], ['w:Buktinya', 'hit', 0.3]],
      vis: E({ baris: [[0, 0.1], [1, 0.9], [2, 1.2], [3, 1.9]], sorot: [[0, 'w:satu', 'kuning']], komentar: 'w:Buktinya' }),
    },
    {
      id: 's2', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Di Privasimu Nexus, persetujuan dicatat lewat API, lengkap dengan bukti. Penarikan disinkronkan lewat webhook ke sistem internal.',
      layar: 'Baris 6–8 diketik: komentar "// versi Privasimu Nexus", consent.record({...bukti...}), webhook.on(\'consent.withdrawn\', …); baris API & webhook disorot hijau saat disebut.',
      sfx: [['w:Di', 'tick', 0.25], ['w:API', 'ding', 0.3], ['w:webhook', 'ding', 0.3]],
      vis: E({ baris: [[5, 'w:Di'], [6, 'w:persetujuan-0.2'], [7, 'w:persetujuan+0.5'], [8, 'w:persetujuan+1.9'], [9, 'w:Penarikan-0.2']], sorot: [[6, 'w:API', 'hijau'], [7, 'w:API', 'hijau'], [9, 'w:webhook', 'hijau']] }),
    },
    {
      id: 's3', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Setiap subjek punya log persetujuan beserta buktinya. Satu baris yang tidak lagi dilupakan.',
      layar: 'Panel log di bawah editor: "✔ tercatat CNT-2026-011 · bukti tersimpan · webhook → CRM"; kartu integrasi Consent asli muncul.',
      sfx: [['w:Setiap', 'pop', 0.3], ['w:log', 'ding', 0.3], ['w:Satu', 'tick', 0.25]],
      vis: E({ log: 'w:Setiap', layar: { nama: 'consent-detail', potong: [313, 780, 897, 200], at: 'w:Satu-0.3', judul: 'Consent · Metode integrasi' } }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Satu baris kode, satu baris bukti. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Satu baris kode, satu baris bukti.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: E({ cta: { tag: 'Satu baris kode,|*satu baris bukti*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
