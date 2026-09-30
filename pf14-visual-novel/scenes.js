// PF14 — VISUAL NOVEL "Pilih Jawabanmu": ruangan datar, dua siluet (auditor & kamu), kotak dialog mengetik di bawah,
// menu pilihan. Auditor: "RoPA-nya mana?" → A "Sebentar…": 12 jendela spreadsheet* bertumpuk, hari berlalu, BAD END →
// muat ulang (rewind) → B "Ini.": kartu ITEM berisi register RoPA asli, auditor: "Lengkap." → GOOD END → twist: auditor
// bertanya "DPIA-nya?" dan menu pilihan hanya menyisakan B (A tidak tersedia) karena draf DPIA dibuat otomatis; CTA.
// Hook (relate): "Auditor: 'RoPA-nya mana?' ▶ A. 'Sebentar…' ▶ B. 'Ini.'"
// Komposisi: 40% edukasi · 60% meme. Satu gaya: visual novel (tokoh siluet, tanpa gaya karakter gim tertentu).
(function (root) {
  const CONFIG = {
    title: 'PF14 · Pilih Jawabanmu (visual novel)',
    naskah: 'PF14',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+12%',
    maxPause: 0.4,
    beat: 60 / 112 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 112, mode: 'major', root: 57, lead: 'chip', drums: 'chip', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.7 },
    meta: {
      judul: 'Pilih Jawabanmu',
      gaya: 'Visual novel',
      tampilan: 'ruangan kantor datar (dinding lilac, jendela bercahaya, meja); dua siluet navy: auditor berpapan jalan (kiri) dan kamu (kanan); kotak dialog putih dengan pil nama & teks mengetik; menu pilihan A/B dengan kursor ▶; kartu BAD END merah & GOOD END hijau-emas; kartu ITEM emas berisi register RoPA asli',
      jenisHook: 'Relate',
      hook: '"Auditor: \'RoPA-nya mana?\' ▶ A. \'Sebentar…\' ▶ B. \'Ini.\'"',
      komposisi: '40% edukasi · 60% meme',
      rekam: ['ropa-list-baru'],
      fakta: [
        'RoPA (fakta_produk.json): satu register terpusat dengan kode rekaman ROPA-TAHUN-NOMOR; alur Maker/Reviewer/Approver dengan riwayat perubahan; RoPA berisiko TINGGI otomatis membuat draf DPIA.',
        'Register RoPA = tangkapan asli assets/app/ropa-list-baru.png (dipotong, tanpa nama organisasi).',
        '"12 spreadsheet" & "3 hari" = ilustrasi (ditandai *); tokoh = siluet tanpa nama/wajah; tanpa gaya karakter gim tertentu.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const N = (o) => ({ type: 'vn', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4.5, voDelay: 0.5, mus: 'hook',
      vo: 'Auditor: "RoPA-nya mana?" Pilih jawabanmu.',
      layar: 'Ruangan & dua siluet muncul; kotak dialog naik, pil nama AUDITOR, teks mengetik "RoPA-nya mana?"; menu pilihan A. "Sebentar…" / B. "Ini." muncul dengan kursor ▶ di A.',
      sfx: [[0.1, 'whoosh', 0.3], ['w:RoPA-nya', 'tick', 0.25], ['w:mana', 'tick', 0.2], ['w:Pilih', 'pop', 0.35]],
      vis: N({ mulai: 0.1, dialog: [[0, 'w:RoPA-nya-0.15']], menu1: 'w:Pilih-0.1' }),
    },
    {
      id: 's2', min: 6, voDelay: 0.3, mus: 'tense',
      vo: 'A: "Sebentar." Dua belas spreadsheet dibuka, tiga hari berlalu. Akhir buruk.',
      layar: 'Kursor memilih A (kedip); dialog KAMU "Sebentar… (membuka 12 spreadsheet*)"; jendela-jendela spreadsheet kecil bermunculan berantakan; chip HARI 1 → 3; layar gelap: BAD END merah, "Temuan: RoPA tidak dapat ditunjukkan", "Muat ulang?" berkedip.',
      sfx: [['w:A', 'tick', 0.3], ['w:Dua', 'pop', 0.3], ['w:Dua+0.3', 'pop', 0.25], ['w:tiga', 'tick', 0.3], ['w:Akhir', 'hit', 0.45]],
      vis: N({ pilihA: 'w:A', dialog: [[1, 'w:Sebentar-0.1']], sheet: 'w:Dua-0.1', hari: 'w:tiga-0.1', buruk: 'w:Akhir-0.1' }),
    },
    {
      id: 's3', min: 6.5, voDelay: 0.3, mus: 'main',
      vo: 'Muat ulang. B: "Ini." Di Privasimu Nexus, RoPA tercatat dengan kode dan riwayatnya, tinggal tunjukkan.',
      layar: 'Efek rewind (garis-garis, ◀◀ MUAT ULANG); menu kembali, kursor turun ke B lalu memilih; dialog KAMU "Ini."; kartu ITEM emas naik berisi register RoPA asli; dialog AUDITOR "Lengkap. Terima kasih."',
      sfx: [['w:Muat', 'whoosh', 0.4], ['w:B', 'tick', 0.3], ['w:Ini', 'pop', 0.3], ['w:tercatat', 'ding', 0.45], ['w:tunjukkan', 'tick', 0.3]],
      vis: N({ ulang: 'w:Muat-0.1', menu2: 'w:Muat+0.5', pilihB: 'w:B', dialog: [[2, 'w:Ini-0.1'], [3, 'w:tunjukkan-0.2']], item: 'w:tercatat-0.2', layar: { nama: 'ropa-list-baru', potong: [280, 200, 1140, 285], judul: 'Register RoPA' } }),
    },
    {
      id: 's4', min: 5.5, voDelay: 0.3, mus: 'main',
      vo: 'Akhir baik. Pertanyaan berikutnya: "DPIA-nya?" Pilihannya tinggal satu.',
      layar: 'Layar GOOD END hijau-emas dengan statistik (spreadsheet dibuka: 0*); kembali ke ruangan: dialog AUDITOR "DPIA-nya?"; menu pilihan muncul lagi: A "Sebentar…" dicoret "tidak tersedia", B "Ini." menyala dengan catatan "draf DPIA dibuat otomatis".',
      sfx: [['w:Akhir', 'ding', 0.45], ['w:Pertanyaan', 'whoosh', 0.3], ['w:DPIA-nya', 'tick', 0.3], ['w:Pilihannya', 'pop', 0.35], ['w:satu', 'ding', 0.4]],
      vis: N({ baik: 'w:Akhir-0.1', tanya2: 'w:Pertanyaan', dialog: [[4, 'w:DPIA-nya-0.2']], menu3: 'w:Pilihannya-0.1', satu: 'w:satu-0.1' }),
    },
    {
      id: 's5', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Pilih jawaban yang ada. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Pilih jawaban yang ada.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: N({ cta: { tag: 'Pilih jawaban|*yang ada*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
