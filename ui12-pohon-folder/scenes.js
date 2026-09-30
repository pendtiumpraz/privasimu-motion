// UI12 — POHON FOLDER "Baru (2)": jendela penjelajah berkas; folder di dalam folder di dalam folder, namanya makin putus
// asa (Baru → Baru (2) → FIX banget → FINAL_beneran); kursor mengejar & mengeklik; di dasar: 4 versi RoPA "final",
// kontrak pihak ketiga 2019, formulir consent lama, folder scan KTP ⚠; pencarian "RoPA final" = 7 hasil; payoff:
// semua diseret ke panel "Privasimu Nexus · Impor Dokumen" → progres per berkas ✓ → register RoPA rapi (asli); CTA.
// Hook (relate): "Folder 'Baru' di dalam 'Baru (2)' di dalam 'FIX banget'."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: UI penjelajah berkas (pohon bertingkat, breadcrumb, kursor).
(function (root) {
  const CONFIG = {
    title: 'UI12 · Baru (2) (pohon folder)',
    naskah: 'UI12',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+9%',
    maxPause: 0.4,
    beat: 60 / 108 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 108, mode: 'major', root: 55, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.7 },
    meta: {
      judul: 'Baru (2)',
      gaya: 'Pohon folder',
      tampilan: 'jendela penjelajah berkas generik (panel pohon kiri, daftar kanan, breadcrumb, kotak cari); folder terbuka bertingkat makin dalam dengan nama makin putus asa; kursor panah mengejar & mengeklik; panel biru "Privasimu Nexus · Impor Dokumen" menerima seret-lepas; kartu register RoPA asli',
      jenisHook: 'Relate',
      hook: '"Folder \'Baru\' di dalam \'Baru (2)\' di dalam \'FIX banget\'."',
      komposisi: '70% edukasi · 30% meme',
      rekam: ['ropa-list-baru'],
      fakta: [
        'RoPA (fakta_produk.json): wizard bertahap; pengisian otomatis berbantuan AI berdasarkan nama kegiatan; kode otomatis ROPA-TAHUN-NOMOR; register = tangkapan asli assets/app/ropa-list-baru.png (menu "Impor Dokumen" tampak di sidebar tangkapan yang sama).',
        'Nama berkas/folder & "7 hasil" = ilustrasi keseharian kantor (ditandai *), bukan data pelanggan; tanpa nama orang.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const F = (o) => ({ type: 'pf', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5.5, voDelay: 0.5, mus: 'hook',
      vo: 'Folder "Baru"… di dalam "Baru dua"… di dalam "FIX banget".',
      layar: 'Jendela penjelajah: kursor mengeklik Shared Drive → Kepatuhan → Baru → Baru (2) → FIX banget; pohon makin menjorok, breadcrumb makin panjang.',
      sfx: [[0.1, 'whoosh', 0.25], ['w:Baru', 'tick', 0.3], ['w:Baru#2', 'tick', 0.3], ['w:FIX', 'tick', 0.3], ['w:banget', 'pop', 0.3]],
      vis: F({ buka: [[0, 0.2], [1, 'w:Baru-0.4'], [2, 'w:Baru'], [3, 'w:Baru#2'], [4, 'w:FIX']] }),
    },
    {
      id: 's2', min: 5, voDelay: 0.3, mus: 'tense',
      vo: 'Di dasarnya: empat RoPA "final", kontrak pihak ketiga yang lama, dan satu folder yang sebaiknya tidak ada. Cari: tujuh hasil.',
      layar: 'Folder FINAL_beneran terbuka: daftar berkas muncul satu-satu (4 versi RoPA final, kontrak_pihak_ketiga_2019.pdf, formulir_consent_lama.docx, scan_ktp_karyawan/ ⚠); kotak cari diketik "RoPA final" → 7 hasil*.',
      sfx: [['w:dasarnya', 'tick', 0.3], ['w:empat', 'pop', 0.25], ['w:kontrak', 'pop', 0.25], ['w:folder', 'hit', 0.35], ['w:Cari', 'tick', 0.25], ['w:tujuh', 'ding', 0.3]],
      vis: F({ buka: [[5, 'w:dasarnya-0.3']], berkas: 'w:empat-0.2', peringatan: 'w:folder', cari: 'w:Cari', hasil: 'w:tujuh' }),
    },
    {
      id: 's3', min: 5, voDelay: 0.3, mus: 'main',
      vo: 'Seret semuanya ke Privasimu Nexus: impor dokumen, isi otomatis berbantuan AI. Jadilah satu register RoPA, final beneran.',
      layar: 'Semua berkas terpilih → diseret ke panel "Privasimu Nexus · Impor Dokumen"; progres per berkas berjalan dan tercentang; kartu register RoPA asli muncul; breadcrumb menyusut jadi "Nexus / RoPA".',
      sfx: [['w:Seret', 'whoosh', 0.4], ['w:Impor', 'tick', 0.25], ['w:Impor+0.4', 'tick', 0.25], ['w:Impor+0.8', 'tick', 0.25], ['w:jadilah', 'ding', 0.4]],
      vis: F({ pilih: 'w:Seret-0.3', seret: 'w:Seret', impor: 'w:Impor', layar: { nama: 'ropa-list-baru', potong: [280, 200, 1140, 285], at: 'w:jadilah', judul: 'Register RoPA' } }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Pensiunkan folder "Baru dua". Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Pensiunkan folder Baru (2).", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: F({ cta: { tag: 'Pensiunkan folder|*"Baru (2)"*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
