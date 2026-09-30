// TY35 — ASCII ART "README.md": terminal gelap; `cat README.md` diketik; banner blok "PRIVASIMU" dari karakter #
// muncul baris demi baris (karakter acak lalu "menetap"); 3 langkah integrasi dengan diagram ASCII (browser → API →
// webhook); gembok ASCII terbentuk = bukti tersimpan; kartu metode integrasi Consent asli; CTA.
// Hook (reverse psychology): "Jangan baca README ini kalau integrasimu sudah mencatat bukti persetujuan."
// Komposisi: 30% edukasi · 70% meme. Satu gaya: ASCII art (blok <pre> monospace, karakter berganti membentuk gambar).
(function (root) {
  const CONFIG = {
    title: 'TY35 · README.md (ASCII art)',
    naskah: 'TY35',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 108 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 108, mode: 'minor', root: 50, lead: 'chip', drums: 'chip', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.65 },
    meta: {
      judul: 'README.md',
      gaya: 'ASCII art',
      tampilan: 'terminal hijau-di-hitam dengan glow fosfor; blok <pre> monospace: banner PRIVASIMU dari #, diagram integrasi dari karakter, gembok ASCII; karakter acak menetap jadi gambar baris demi baris; kartu metode integrasi Consent asli',
      jenisHook: 'Reverse psychology',
      hook: '"Jangan baca README ini kalau integrasimu sudah mencatat bukti persetujuan."',
      komposisi: '30% edukasi · 70% meme',
      rekam: ['consent-detail'],
      fakta: [
        'Consent & Cookie (fakta_produk.json): banner cookie & pusat preferensi yang dapat disematkan; log persetujuan beserta bukti tiap subjek; penarikan dihormati di seluruh kanal; API dan webhook untuk sinkronisasi ke sistem internal.',
        'Kartu metode integrasi (Consent Form Embed · Preference Center · Consent Items Editor) = tangkapan asli assets/app/consent-detail.png.',
        'Nama berkas/endpoint di README = ilustrasi, bukan dokumentasi API.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const A = (o) => ({ type: 'as', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5.5, voDelay: 0.5, mus: 'hook',
      vo: 'Jangan baca README ini… kalau integrasimu sudah mencatat bukti persetujuan.',
      layar: 'Terminal: `$ cat README.md` diketik; banner blok PRIVASIMU muncul dari karakter acak; baris peringatan "> JANGAN BACA kalau bukti persetujuan sudah tercatat".',
      sfx: [[0.1, 'tick', 0.25], ['w:Jangan', 'whoosh', 0.3], ['w:bukti', 'tick', 0.3]],
      vis: A({ bagian: [[0, 0.1], [1, 'w:Jangan-0.3'], [2, 'w:kalau']] }),
    },
    {
      id: 's2', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Tiga langkah: sematkan formulir persetujuan, kirim lewat API, dan dengarkan webhook saat persetujuan ditarik.',
      layar: 'Bagian "## 3 langkah" dengan diagram ASCII: [browser]--consent-form.js-->[Nexus]; POST /consent; webhook consent.withdrawn --> [CRM]; tiap baris "menetap" saat disebut.',
      sfx: [['w:sematkan', 'tick', 0.3], ['w:API', 'tick', 0.3], ['w:webhook', 'tick', 0.3]],
      vis: A({ bagian: [[3, 'w:Tiga-0.2'], [4, 'w:sematkan'], [5, 'w:API'], [6, 'w:webhook']] }),
    },
    {
      id: 's3', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Setiap "setuju" jadi bukti: siapa, kapan, versi formulir apa. Terkunci di Privasimu Nexus.',
      layar: 'Gembok ASCII besar terbentuk dari karakter acak; baris `[✓] bukti: subjek · waktu · versi formulir`; kartu metode integrasi asli muncul di samping/bawah.',
      sfx: [['w:Setiap', 'whoosh', 0.35], ['w:bukti', 'pop', 0.3], ['w:Terkunci', 'hit', 0.4]],
      vis: A({ bagian: [[7, 'w:Setiap'], [8, 'w:bukti+0.4']], gembok: 'w:Terkunci-0.6', layar: { nama: 'consent-detail', potong: [313, 780, 897, 200], at: 'w:Nexus', judul: 'Consent · Metode integrasi' } }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'README dibaca, bukti tercatat. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "README dibaca, bukti tercatat.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: A({ cta: { tag: 'README dibaca,|*bukti tercatat*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
