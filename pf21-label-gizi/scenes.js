// PF21 — LABEL NILAI GIZI "Informasi Nilai Data": parodi label kemasan hitam-putih bergaris tebal; takaran saji
// 1 formulir; baris data pribadi dengan %; baris data spesifik menyala merah; "Persetujuan 0%"; lalu versi Nexus:
// tercatat di RoPA (kartu asli Data Pribadi Spesifik), risiko TINGGI → DPIA otomatis, persetujuan 100% + bukti; CTA.
// Hook (anomali): "Informasi nilai data. Takaran saji: 1 formulir."
// Komposisi: 60% edukasi · 40% meme. Satu gaya: label nilai gizi (tabel garis tebal, baris muncul, angka persen menghitung).
(function (root) {
  const CONFIG = {
    title: 'PF21 · Informasi Nilai Data (label nilai gizi)',
    naskah: 'PF21',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+12%',
    maxPause: 0.4,
    beat: 60 / 104 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 104, mode: 'major', root: 55, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.7 },
    meta: {
      judul: 'Informasi Nilai Data',
      gaya: 'Label nilai gizi',
      tampilan: 'kemasan krem polos; label putih bergaris hitam tebal/tipis ala informasi nilai gizi (Archivo tebal), baris muncul satu per satu dengan angka persen menghitung; baris data spesifik & persetujuan menyala merah; label versi Nexus hijau dengan stempel; kartu wizard RoPA asli',
      jenisHook: 'Anomali',
      hook: '"Informasi nilai data. Takaran saji: 1 formulir."',
      komposisi: '60% edukasi · 40% meme',
      rekam: ['ropa-data-spesifik'],
      fakta: [
        'RoPA (fakta_produk.json): wizard mencatat tujuan, dasar pemrosesan, kategori data, subjek, penerima, retensi, pengamanan; data spesifik menandai risiko TINGGI otomatis; RoPA TINGGI otomatis membuat draf DPIA.',
        'Consent & Cookie (fakta_produk.json): log persetujuan beserta bukti untuk setiap subjek; penarikan dihormati di seluruh kanal.',
        'Kartu "Data Pribadi Spesifik (dikumpulkan)" = tangkapan asli assets/app/ropa-data-spesifik.png (nama organisasi dipotong).',
        'Semua persentase & "%AKG" = parodi/ilustrasi (ditandai *ilustrasi); tanpa merek makanan.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const G = (o) => ({ type: 'lg', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.5, mus: 'hook',
      vo: 'Informasi nilai data, takaran saji satu formulir. Nama, email, nomor HP: seratus persen.',
      layar: 'Label "INFORMASI NILAI DATA" muncul; baris takaran saji; baris Nama/Email/Nomor HP muncul dengan angka % menghitung ke 100.',
      sfx: [[0.1, 'whoosh', 0.3], ['w:Takaran', 'tick', 0.25], ['w:Nama', 'tick', 0.25], ['w:email', 'tick', 0.25], ['w:nomor', 'tick', 0.25]],
      vis: G({ label: 0.1, baris: [[0, 'w:Takaran'], [1, 'w:Nama'], [2, 'w:email'], [3, 'w:nomor']] }),
    },
    {
      id: 's2', min: 5, voDelay: 0.3, mus: 'tense',
      vo: 'Data kesehatan dua belas persen: spesifik. Lokasi presisi delapan persen. Persetujuan: nol persen.',
      layar: 'Baris merah: "Data kesehatan 12%* — SPESIFIK", "Lokasi presisi 8%*"; baris besar "PERSETUJUAN 0% ⚠ · bukti: —"; catatan kaki %AKG berkedip.',
      sfx: [['w:Data', 'hit', 0.35], ['w:Lokasi', 'tick', 0.3], ['w:Persetujuan', 'hit', 0.45], ['w:nol', 'tick', 0.3]],
      vis: G({ baris: [[4, 'w:Data'], [5, 'w:Lokasi'], [6, 'w:Persetujuan']], kaki: 'w:nol' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Versi Privasimu Nexus: tercatat di RoPA, data spesifik otomatis risiko tinggi dan draf DPIA. Persetujuan seratus persen, bukti tersimpan.',
      layar: 'Label berganti versi hijau "NILAI DATA · TERCATAT": kartu asli Data Pribadi Spesifik; stempel "RISIKO TINGGI → DPIA OTOMATIS"; baris Persetujuan menghitung 0 → 100% + "bukti tersimpan ✓".',
      sfx: [['w:Versi', 'whoosh', 0.4], ['w:RoPA', 'ding', 0.3], ['w:tinggi', 'hit', 0.35], ['w:Persetujuan', 'pop', 0.3], ['w:tersimpan', 'ding', 0.4]],
      vis: G({ nexus: 'w:Versi', layar: { nama: 'ropa-data-spesifik', potong: [340, 668, 620, 240], at: 'w:RoPA-0.2', judul: 'RoPA · Pengumpulan Data' }, stempel: 'w:tinggi-0.2', penuh: 'w:Persetujuan', bukti: 'w:tersimpan' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Baca labelnya sebelum mengumpulkan. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Baca labelnya sebelum mengumpulkan.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: G({ cta: { tag: 'Baca labelnya|*sebelum mengumpulkan*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
