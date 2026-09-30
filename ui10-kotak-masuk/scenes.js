// UI10 — KOTAK MASUK EMAIL "Senin, 08.02": aplikasi email fiktif; baris-baris masuk dari atas, lalu satu subjek
// menghentikan semuanya: "Tolong hapus semua data saya." → diteruskan (Fwd) ke 4 orang, balasan "sudah ditangani?"
// berbalas, prefiks Re: Fwd: menumpuk, sementara hitung mundur 72 jam berlari turun & memerah → di Privasimu Nexus
// email itu ditarik ke formulir "Buat DSR Baru" (asli) dan menjadi tiket DSR-2026-017 · 71h tersisa (asli), 4 orang
// menyusut jadi Handler → Reviewer → Approver → kotak masuk kembali: baris berlabel hijau, diarsipkan, jam 08.03; CTA.
// Hook (relate): "Email paling ditakuti customer service: 'Tolong hapus semua data saya.'"
// Komposisi: 70% edukasi · 30% meme. Satu gaya: UI kotak masuk fiktif (baris slide, sorot & membesar).
(function (root) {
  const CONFIG = {
    title: 'UI10 · Senin, 08.02 (kotak masuk email)',
    naskah: 'UI10',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+12%',
    maxPause: 0.4,
    beat: 60 / 104 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 104, mode: 'major', root: 55, lead: 'keys', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.7 },
    meta: {
      judul: 'Senin, 08.02',
      gaya: 'Kotak masuk email',
      tampilan: 'aplikasi email fiktif abu-terang: bilah samping folder, kepala dengan jam "Senin · 08.02", daftar baris (avatar inisial, pengirim, subjek, pratinjau, jam); baris "Tolong hapus semua data saya." merah menyorot & membesar; 4 avatar penerima Fwd (CS, Legal, IT, DPO) dengan gelembung balasan; chip hitung mundur 72:00:00 memerah; formulir Buat DSR Baru & bar tiket DSR-2026-017 asli; rantai Handler → Reviewer → Approver; label hijau lalu diarsipkan',
      jenisHook: 'Relate',
      hook: '"Email paling ditakuti customer service: \'Tolong hapus semua data saya.\'"',
      komposisi: '70% edukasi · 30% meme',
      rekam: ['dsr-form', 'dsr-detail'],
      fakta: [
        'DSR (fakta_produk.json): permohonan dari berbagai kanal tercatat di satu antrean; tenggat otomatis 72 jam sejak dicatat; alur Handler, Reviewer, Approver dengan jejak audit; kode DSR-TAHUN-NOMOR; sebelum: permohonan lewat surel tanpa pencatatan terpusat, tenggat dihitung manual.',
        'Formulir "Buat DSR Baru" = tangkapan asli assets/app/dsr-form.png (modal saja); bar tiket = assets/app/dsr-detail.png (di bawah nama organisasi).',
        'Aplikasi email, pengirim, isi email, "4 orang", "1 menit" = fiktif/ilustrasi (ditandai *); alamat pemohon disamarkan.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const M = (o) => ({ type: 'em', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.5, mus: 'hook',
      vo: 'Email paling ditakuti customer service: "Tolong hapus semua data saya."',
      layar: 'Aplikasi email muncul, baris-baris biasa masuk dari atas (newsletter, rapat, timesheet…); pada "Tolong" baris baru menghantam masuk di atas: "Tolong hapus semua data saya." — baris lain meredup, baris itu membesar berbingkai merah.',
      sfx: [[0.1, 'whoosh', 0.3], [0.4, 'tick', 0.2], [0.55, 'tick', 0.2], [0.7, 'tick', 0.2], ['w:Tolong-0.1', 'hit', 0.45], ['w:saya', 'ding', 0.3]],
      vis: M({ mulai: 0.1, takut: 'w:Tolong-0.15', sorot: 'w:hapus' }),
    },
    {
      id: 's2', min: 6, voDelay: 0.3, mus: 'tense',
      vo: 'Diteruskan ke empat orang. Balasannya cuma "sudah ditangani?", sementara tujuh puluh dua jam terus berjalan.',
      layar: 'Chip "Fwd:" terbang dari baris ke 4 avatar (CS, Legal, IT, DPO); gelembung balasan bermunculan ("sudah ditangani?", "belum, kamu?", "cc DPO ya", "…"); prefiks subjek menumpuk "Re: Fwd: Re: Fwd:"; chip TENGGAT 72:00:00 berlari turun ke 13:07:22 dan memerah.',
      sfx: [['w:Diteruskan', 'whoosh', 0.3], ['w:empat', 'pop', 0.25], ['w:empat+0.2', 'pop', 0.25], ['w:Balasannya', 'tick', 0.25], ['w:sudah', 'tick', 0.25], ['w:sementara', 'tick', 0.3], ['w:berjalan', 'hit', 0.35]],
      vis: M({ fwd: 'w:Diteruskan', balas: 'w:Balasannya-0.1', mundur: 'w:sementara-0.2' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Di Privasimu Nexus, email itu jadi tiket DSR: kode otomatis, tenggat terhitung, satu penanggung jawab.',
      layar: 'Formulir "Buat DSR Baru" asli naik ke tengah, baris email tersedot ke dalamnya; formulir berganti bar tiket asli "DSR-2026-017 · 71h tersisa"; 4 avatar menyusut menjadi rantai Handler → Reviewer → Approver.',
      sfx: [['w:Nexus', 'whoosh', 0.4], ['w:tiket', 'pop', 0.35], ['w:kode', 'ding', 0.4], ['w:tenggat', 'tick', 0.3], ['w:satu', 'pop', 0.3]],
      vis: M({ tiket: 'w:Nexus-0.1', detail: 'w:kode-0.2', alur: 'w:satu-0.2', form: { nama: 'dsr-form', potong: [352, 44, 560, 470], judul: 'DSR · Buat DSR Baru' }, bar: { nama: 'dsr-detail', potong: [22, 82, 958, 140], judul: 'DSR · Tiket' } }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'main',
      vo: 'Senin, delapan lewat tiga: tercatat. Kotak masuk kembali tenang.',
      layar: 'Kembali ke kotak masuk: jam 08.03; baris "Tolong hapus…" berlabel hijau "DSR-2026-017 · 71h tersisa" lalu meluncur keluar (diarsipkan), baris lain naik & kembali terang; chip hijau "tercatat · 1 menit*".',
      sfx: [['w:Senin', 'tick', 0.25], ['w:tercatat', 'ding', 0.45], ['w:Kotak', 'whoosh', 0.3], ['w:tenang', 'pop', 0.3]],
      vis: M({ kembali: 'w:Senin-0.2', arsip: 'w:Kotak-0.1' }),
    },
    {
      id: 's5', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Jangan takut sama email. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Jangan takut sama email.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: M({ cta: { tag: 'Jangan takut|*sama email*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
