// PF11 — PRAKIRAAN CUACA "Prakiraan Kepatuhan": grafis TV cuaca, tetapi petanya peta DIVISI (bukan peta negara):
// matahari di Legal, badai lokal di Marketing, berawan di IT, hujan di HR, angin di CS; lower-third + strip skor*;
// lalu dasbor asli: skor GAP per area; CTA. Pembawa acara = suara saja.
// Hook (anomali): "Prakiraan kepatuhan hari ini: cerah di Legal, badai lokal di Marketing."
// Komposisi: 60% edukasi · 40% meme. Satu gaya: peta cuaca bentuk sederhana + ikon cuaca bergerak.
(function (root) {
  const CONFIG = {
    title: 'PF11 · Prakiraan Kepatuhan (prakiraan cuaca)',
    naskah: 'PF11',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 112 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 112, mode: 'major', root: 55, lead: 'keys', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.7 },
    meta: {
      judul: 'Prakiraan Kepatuhan',
      gaya: 'Prakiraan cuaca',
      tampilan: 'grafis TV cuaca biru: peta wilayah berbentuk blob berlabel divisi (Legal, IT, Marketing, HR, Finance, CS), ikon matahari/awan/petir/hujan/angin bergerak, lower-third "PRAKIRAAN KEPATUHAN · HARI INI", strip skor per divisi (*ilustrasi); kartu skor GAP per area asli',
      jenisHook: 'Anomali',
      hook: '"Prakiraan kepatuhan hari ini: cerah di Legal, badai lokal di Marketing."',
      komposisi: '60% edukasi · 40% meme',
      rekam: ['gap-hasil'],
      fakta: [
        'GAP Assessment (fakta_produk.json): skor kepatuhan dan rencana remediasi; kartu "Statistik Assessment per Area" = tangkapan asli assets/app/gap-hasil.png (Tata Kelola 72%, Siklus Proses PDP 85%, Governance 75%).',
        'Dukungan PPDP: dasbor kepatuhan lintas modul. Cuaca per divisi & skor di strip = ilustrasi (ditandai *).',
        'DSR: tenggat otomatis 72 jam (peringatan dini di ticker).',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const W = (o) => ({ type: 'cw', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.5, mus: 'hook',
      vo: 'Prakiraan kepatuhan hari ini: cerah di Legal, badai lokal di Marketing.',
      layar: 'Peta divisi muncul + lower-third; matahari terbit di Legal pada "cerah"; awan petir menyambar di Marketing pada "badai".',
      sfx: [[0.1, 'whoosh', 0.3], ['w:cerah', 'ding', 0.3], ['w:badai', 'hit', 0.45], ['w:badai+0.4', 'hit', 0.3]],
      vis: W({ peta: 0.1, cuaca: [['legal', 'w:cerah'], ['marketing', 'w:badai']] }),
    },
    {
      id: 's2', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Berawan di IT: kebijakan lama belum diperbarui. Hujan ringan di HR: formulir persetujuan tertinggal. Angin kencang di CS: permintaan hapus data menumpuk.',
      layar: 'Awan di IT, hujan di HR, garis angin di CS muncul saat disebut; strip skor per divisi* di bawah peta; ticker "Peringatan dini: tenggat DSR 72 jam".',
      sfx: [['w:Berawan', 'tick', 0.25], ['w:Hujan', 'tick', 0.25], ['w:Angin', 'whoosh', 0.35]],
      vis: W({ cuaca: [['it', 'w:Berawan'], ['hr', 'w:Hujan'], ['cs', 'w:Angin']], strip: 'w:Berawan+0.5', ticker: 'w:Angin' }),
    },
    {
      id: 's3', min: 5.5, voDelay: 0.3, mus: 'main',
      vo: 'Prakiraan bisa akurat kalau ada datanya. Dasbor Privasimu Nexus: skor GAP per area, dan tren per modul.',
      layar: 'Peta meredup; kartu asli "Statistik Assessment per Area" (72% · 85% · 75%) naik di depan.',
      sfx: [['w:Dasbor', 'whoosh', 0.4], ['w:skor', 'pop', 0.3]],
      vis: W({ redup: 'w:Dasbor', layar: { nama: 'gap-hasil', potong: [327, 315, 647, 360], at: 'w:Dasbor', judul: 'GAP Assessment · Statistik per Area' } }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Cuaca kepatuhan bisa diprakirakan. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Cuaca kepatuhan bisa diprakirakan.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: W({ cta: { tag: 'Cuaca kepatuhan|*bisa diprakirakan*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
