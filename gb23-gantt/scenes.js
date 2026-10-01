// GB23 — LINIMASA / GANTT "Hitung Mundur Sudah Jalan": sumbu waktu 16 Jul 2026 (PP 33/2026 diundangkan) → 16 Jan 2027
// (berlaku); penanda HARI INI merayap ke kanan sepanjang video. Baris tahapan kosong ("?") → semua tahapan baru mulai
// Desember: antre, menumpuk, melewati tenggat (merah, stempel LEWAT TENGGAT) → di Privasimu Nexus rencana remediasi
// GAP Assessment mengalir bertangga dari hari ini, tiap batang terisi → time-lapse: penanda melesat ke tenggat, batang
// dicentang satu per satu, bendera tenggat berubah SIAP; CTA.
// Hook (anomali): "Hitung mundur sudah jalan. Rencanamu?"
// Komposisi: 80% edukasi · 20% meme. Satu gaya: linimasa Gantt (batang scaleX berurutan, penanda hari ini bergerak).
(function (root) {
  const CONFIG = {
    title: 'GB23 · Hitung Mundur Sudah Jalan (linimasa Gantt)',
    naskah: 'GB23',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+12%',
    maxPause: 0.4,
    beat: 60 / 108 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 108, mode: 'minor', root: 50, lead: 'chip', drums: 'chip', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.7 },
    meta: {
      judul: 'Hitung Mundur Sudah Jalan',
      gaya: 'Linimasa / Gantt',
      tampilan: 'kertas terang; sumbu waktu JUL 2026 → JAN 2027 dengan bendera tenggat merah "16 JAN 2027 · PP 33 BERLAKU"; penanda merah HARI INI merayap ke kanan; lima baris tahapan (GAP Assessment, RoPA, DPIA, Kebijakan & consent, Latihan tim): kosong → menumpuk merah di Desember → bertangga berwarna dari hari ini → dicentang saat penanda melesat; bendera menjadi hijau SIAP; kartu rekomendasi GAP asli',
      jenisHook: 'Anomali',
      hook: '"Hitung mundur sudah jalan. Rencanamu?"',
      komposisi: '80% edukasi · 20% meme',
      rekam: ['gap-rekomendasi'],
      fakta: [
        'PP 33/2026 diundangkan 16 Juli 2026, berlaku 6 bulan kemudian (Ps. 225) = 16 Januari 2027 (rujukan sama dengan ad2-pp33 & t01-stomp).',
        'GAP Assessment (fakta_produk.json): kuesioner penilaian kepatuhan UU PDP, skor kepatuhan dan rencana remediasi, analisis dokumen bukti oleh AI per pertanyaan.',
        'Tahapan lain = modul platform yang saling terhubung: RoPA, DPIA, Consent, simulasi insiden (fakta_produk.json: platform, breach).',
        'Kartu rekomendasi = tangkapan asli assets/app/gap-rekomendasi.png (dipotong, tanpa nama organisasi).',
        'Posisi HARI INI dihitung dari tanggal saat render; durasi & urutan tahapan = jadwal ilustrasi (ditandai *).',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const G = (o) => ({ type: 'gt', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.6, mus: 'hook',
      vo: 'Hitung mundur ke enam belas Januari sudah jalan. Rencanamu?',
      layar: 'Sumbu waktu tergambar (JUL → JAN), bendera tenggat merah di ujung; penanda HARI INI turun ke sumbu dan mulai merayap; pada "Rencanamu?" lima baris tahapan muncul kosong dengan pil "?".',
      sfx: [[0.1, 'whoosh', 0.3], ['w:mundur', 'tick', 0.3], ['w:jalan', 'tick', 0.25], ['w:Rencanamu', 'pop', 0.35]],
      vis: G({ mulai: 0.1, garis: 0.15, tanya: 'w:Rencanamu-0.1' }),
    },
    {
      id: 's2', min: 5, voDelay: 0.3, mus: 'tense',
      vo: 'Kalau semuanya baru dimulai Desember, lima tahapan antre di enam minggu terakhir, dan lewat tenggat.',
      layar: 'Batang abu-abu tumbuh berurutan mulai dari kolom DES, saling menyambung, menjulur melewati bendera tenggat ke zona merah; batang memerah, bendera bergetar, stempel "LEWAT TENGGAT" menghantam; catatan "*jadwal ilustrasi".',
      sfx: [['w:Desember', 'whoosh', 0.3], ['w:antre', 'tick', 0.25], ['w:antre+0.3', 'tick', 0.25], ['w:lewat', 'hit', 0.45]],
      vis: G({ sesak: 'w:Desember-0.1', lewat: 'w:lewat-0.1' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Di Privasimu Nexus, GAP Assessment menyusun rencana remediasinya: RoPA, DPIA, kebijakan, latihan tim. Tinggal kamu jadwalkan.',
      layar: 'Batang mengalir kembali ke barisnya, bertangga dari HARI INI, berganti warna; tiap batang terisi saat namanya disebut; kartu rekomendasi GAP asli muncul di pojok.',
      sfx: [['w:Nexus', 'whoosh', 0.35], ['w:GAP', 'tick', 0.3], ['w:RoPA', 'tick', 0.3], ['w:DPIA', 'tick', 0.3], ['w:kebijakan', 'tick', 0.3], ['w:latihan', 'tick', 0.3], ['w:Tinggal', 'ding', 0.35]],
      vis: G({ rapi: 'w:Nexus-0.2', isi: ['w:GAP', 'w:RoPA', 'w:DPIA', 'w:kebijakan', 'w:latihan'], layar: { nama: 'gap-rekomendasi', potong: [327, 495, 647, 405], at: 'w:remediasi', judul: 'GAP Assessment · Rekomendasi' } }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'main',
      vo: 'Saat hitung mundur habis, yang tersisa tinggal centang.',
      layar: 'Time-lapse: penanda HARI INI melesat ke kanan, tiap batang yang dilewati dapat centang hijau; penanda tiba di tenggat, bendera merah berubah hijau "SIAP" dengan denyar cincin.',
      sfx: [['w:Saat', 'whoosh', 0.4], ['w:hitung+0.3', 'tick', 0.25], ['w:habis', 'tick', 0.25], ['w:habis+0.3', 'tick', 0.25], ['w:tinggal', 'ding', 0.45]],
      vis: G({ lari: 'w:Saat' }),
    },
    {
      id: 's5', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Mulai sekarang, bukan Desember. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Mulai sekarang, bukan Desember.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: G({ cta: { tag: 'Mulai sekarang,|*bukan Desember*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
