// UI24 — URUTAN BOOT "Memeriksa…": layar POST hitam "KEPATUHAN-OS" (fiktif) memeriksa komponen satu per satu dengan
// status [ OK ] / [WARN] / [FAIL] berwarna dan bilah progres; pemeriksaan berhenti di yang gagal → PANIK KEPATUHAN
// (layar merah "AUDIT MINGGU DEPAN") → reboot ke Privasimu Nexus · GAP Assessment: semua [ OK ] + kartu rekomendasi asli; CTA.
// Hook (anomali): "Memeriksa RoPA… OK. Memeriksa bukti persetujuan… TIDAK DITEMUKAN."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: teks putih di layar hitam, baris berurutan, status berwarna.
(function (root) {
  const CONFIG = {
    title: 'UI24 · Memeriksa… (urutan boot)',
    naskah: 'UI24',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+9%',
    maxPause: 0.4,
    beat: 60 / 120 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 120, mode: 'minor', root: 50, lead: 'chip', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.65 },
    meta: {
      judul: 'Memeriksa…',
      gaya: 'Urutan boot',
      tampilan: 'layar POST hitam penuh, huruf mono putih; baris pemeriksaan muncul berurutan dengan titik-titik penuntun dan status [ OK ] hijau / [WARN] kuning / [FAIL] merah; bilah progres; layar merah PANIK KEPATUHAN bergetar; reboot ke layar Nexus dengan kartu rekomendasi GAP asli',
      jenisHook: 'Anomali',
      hook: '"Memeriksa RoPA… OK. Memeriksa bukti persetujuan… TIDAK DITEMUKAN."',
      komposisi: '70% edukasi · 30% meme',
      rekam: ['gap-rekomendasi'],
      fakta: [
        'GAP Assessment (fakta_produk.json): kuesioner penilaian kepatuhan UU PDP; skor kepatuhan dan rencana remediasi; analisis dokumen bukti oleh AI per pertanyaan (1 kredit, hasil dicache).',
        'Kartu "Rekomendasi Perbaikan (11): 9 CRITICAL · 1 HIGH · 1 MEDIUM" = tangkapan asli assets/app/gap-rekomendasi.png.',
        '"KEPATUHAN-OS" dan hasil pemeriksaan (retensi 2019, 3 kontrak belum ditelaah) = fiktif/ilustrasi (ditandai *); tanpa merek sistem operasi nyata.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const B = (o) => ({ type: 'bt', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5.5, voDelay: 0.6, mus: 'hook',
      vo: 'Memeriksa RoPA… OK. Memeriksa bukti persetujuan… tidak ditemukan.',
      layar: 'KEPATUHAN-OS v2026.9 boot: "Memeriksa RoPA ..... [ OK ]", "Memeriksa DPIA ..... [WARN] draf", "Memeriksa bukti persetujuan ..... [FAIL] tidak ditemukan"; bilah progres berhenti di 41%.',
      sfx: [[0.1, 'tick', 0.3], ['w:RoPA', 'tick', 0.25], ['w:OK', 'ding', 0.3], ['w:bukti', 'tick', 0.25], ['w:tidak', 'hit', 0.4]],
      vis: B({ baris: [[0, 0.15], [1, 'w:RoPA-0.3'], [2, 'w:OK+0.5'], [3, 'w:bukti-0.3']], status: [[1, 'w:OK'], [2, 'w:bukti-0.2'], [3, 'w:tidak']], progres: [['w:RoPA-0.3', 0.41]] }),
    },
    {
      id: 's2', min: 5, voDelay: 0.3, mus: 'tense',
      vo: 'Kebijakan retensi: versi 2019. Kontrak pihak ketiga: tiga belum ditelaah. Panik kepatuhan.',
      layar: 'Baris lanjut: "Memeriksa kebijakan retensi ..... [FAIL] versi 2019*", "Memeriksa kontrak pihak ketiga ..... [WARN] 3 belum ditelaah*"; lalu layar merah penuh bergetar: PANIK KEPATUHAN — AUDIT MINGGU DEPAN.',
      sfx: [['w:Kebijakan', 'tick', 0.25], ['w:2019', 'hit', 0.35], ['w:Kontrak', 'tick', 0.25], ['w:tiga', 'hit', 0.3], ['w:Panik', 'hit', 0.6], ['w:Panik+0.15', 'hit', 0.4]],
      vis: B({ baris: [[4, 'w:Kebijakan-0.3'], [5, 'w:Kontrak-0.3']], status: [[4, 'w:2019'], [5, 'w:tiga']], panik: 'w:Panik' }),
    },
    {
      id: 's3', min: 5.5, voDelay: 0.3, mus: 'main',
      vo: 'Reboot ke Privasimu Nexus GAP Assessment: kuesioner UU PDP, bukti dianalisis AI, rencana remediasi. Semua OK.',
      layar: 'Layar hitam lagi: "PRIVASIMU NEXUS · GAP ASSESSMENT" boot ulang; baris hijau semua: kuesioner UU PDP [ OK ], analisis bukti AI [ OK ], rencana remediasi [ OK ] 11 rekomendasi; bilah progres 100%; kartu asli Rekomendasi Perbaikan muncul.',
      sfx: [['w:Reboot', 'whoosh', 0.45], ['w:kuesioner', 'ding', 0.25], ['w:bukti', 'ding', 0.25], ['w:rencana', 'ding', 0.25], ['w:Semua', 'ding', 0.4]],
      vis: B({ reboot: 'w:Reboot', baris: [[6, 'w:GAP-0.2'], [7, 'w:kuesioner-0.2'], [8, 'w:bukti-0.2'], [9, 'w:rencana-0.2']], status: [[7, 'w:kuesioner+0.3'], [8, 'w:bukti+0.4'], [9, 'w:rencana+0.4']], progres: [['w:kuesioner', 1]], layar: { nama: 'gap-rekomendasi', potong: [327, 495, 647, 405], at: 'w:Semua-0.2', judul: 'GAP Assessment · Rekomendasi Perbaikan' } }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Boot kepatuhanmu tanpa FAIL. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Boot kepatuhanmu tanpa [FAIL].", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: B({ cta: { tag: 'Boot kepatuhanmu|*tanpa [FAIL]*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
