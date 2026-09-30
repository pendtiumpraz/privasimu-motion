// GB52 — RANTAI "Mata Rantai Terlemah": rantai mendatar dari brankas DATAMU ke beban TARIK; tiap mata berlabel pihak
// (kamu, payroll*, cloud*, call center*, logistik*, percetakan*). Ditarik → satu mata retak (garis retak tergambar,
// memerah) → ditarik lagi → putus: dua paruh terpental, dokumen berjatuhan dari celah → tautan asesmen publik + kartu
// kuesioner (ilustrasi) terisi → tiap mata dapat lencana skor, yang terlemah merah 41* → rantai ditempa ulang (pijar
// las), ditarik keras: TAHAN; CTA.
// Hook (anomali): "Keamanan datamu sekuat pihak ketigamu yang paling lemah."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: mata rantai (div berulang, retakan SVG dash, sorot).
(function (root) {
  const CONFIG = {
    title: 'GB52 · Mata Rantai Terlemah (rantai)',
    naskah: 'GB52',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+12%',
    maxPause: 0.4,
    beat: 60 / 100 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 100, mode: 'minor', root: 50, lead: 'keys', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.7 },
    meta: {
      judul: 'Mata Rantai Terlemah',
      gaya: 'Rantai',
      tampilan: 'latar abu-gelap berbutir; rantai baja mendatar (mata pipih berongga & mata samping) dari blok brankas "DATAMU" ke blok beban "TARIK"; label pihak di bawah tiap mata; retakan putih-merah tergambar pada satu mata; putus: dua paruh terpental, dokumen kecil berjatuhan; chip tautan asesmen; kartu kuesioner ilustrasi; lencana skor berwarna; pijar las oranye; stempel hijau TAHAN',
      jenisHook: 'Anomali',
      hook: '"Keamanan datamu sekuat pihak ketigamu yang paling lemah."',
      komposisi: '70% edukasi · 30% meme',
      fakta: [
        'Manajemen Risiko Pihak Ketiga (fakta_produk.json): kuesioner asesmen pihak ketiga lewat tautan publik tanpa perlu akun; penilaian risiko dan skor per pihak ketiga; analisis dokumen bukti oleh AI per pertanyaan; keterkaitan ke RoPA dan kontrak.',
        'Sebelum: kuesioner dikirim lewat surel dan jawabannya tercecer (fakta_produk.json).',
        'Nama pihak, jumlah pertanyaan, dan skor (82/76/91/41/88/79) = ilustrasi (ditandai *); tanpa merek.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const R = (o) => ({ type: 'rt', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.5, mus: 'hook',
      vo: 'Keamanan datamu sekuat pihak ketigamu yang paling lemah.',
      layar: 'Brankas DATAMU di kiri, rantai tersambung ke beban TARIK di kanan; label pihak muncul di bawah tiap mata; rantai ditarik tegang (bergetar); pada "paling lemah" satu mata (call center*) retak: garis retak tergambar, mata memerah.',
      sfx: [[0.1, 'whoosh', 0.3], ['w:sekuat', 'tick', 0.3], ['w:paling-0.2', 'hit', 0.4], ['w:lemah', 'tick', 0.3]],
      vis: R({ mulai: 0.1, tarik: 'w:sekuat-0.2', retak: 'w:paling-0.2' }),
    },
    {
      id: 's2', min: 5.5, voDelay: 0.3, mus: 'tense',
      vo: 'Kontraknya rapi. Kuesionernya dikirim lewat surel tahun lalu, jawabannya tercecer. Lalu ditarik.',
      layar: 'Label mata retak berganti "kuesioner: surel, tahun lalu*"; tarikan menguat, getar makin kasar; pada "ditarik" mata putus: paruh kiri & kanan terpental berputar, dokumen-dokumen kecil berjatuhan dari celah.',
      sfx: [['w:Kontraknya', 'tick', 0.25], ['w:surel', 'tick', 0.25], ['w:tercecer', 'pop', 0.3], ['w:ditarik-0.3', 'whoosh', 0.35], ['w:ditarik', 'hit', 0.5]],
      vis: R({ catat: 'w:Kuesionernya', putus: 'w:ditarik-0.05' }),
    },
    {
      id: 's3', min: 6.5, voDelay: 0.3, mus: 'main',
      vo: 'Di Privasimu Nexus: kuesioner asesmen lewat tautan, tanpa akun; bukti dianalisis AI; skor risiko per pihak ketiga.',
      layar: 'Chip tautan asesmen muncul di atas celah; kartu kuesioner (ilustrasi) naik, baris-barisnya tercentang; lencana skor muncul di tiap mata (82, 76, 91, 41 merah, 88, 79).',
      sfx: [['w:Nexus', 'whoosh', 0.35], ['w:tautan', 'pop', 0.3], ['w:tanpa', 'tick', 0.25], ['w:bukti', 'tick', 0.25], ['w:skor', 'ding', 0.45], ['w:skor+0.4', 'pop', 0.3]],
      vis: R({ tautan: 'w:tautan-0.1', kuesioner: 'w:tanpa-0.1', skor: 'w:skor-0.1' }),
    },
    {
      id: 's4', min: 5, voDelay: 0.3, mus: 'main',
      vo: 'Mata rantai terlemah diketahui sebelum ditarik. Tempa dulu, baru tarik.',
      layar: 'Kedua paruh menyatu kembali; mata yang retak menyala pijar las oranye lalu utuh; rantai ditarik keras (getar) dan bertahan; stempel hijau TAHAN; lencana 41 berganti "asesmen ulang*".',
      sfx: [['w:Mata', 'whoosh', 0.3], ['w:Tempa', 'hit', 0.35], ['w:Tempa+0.3', 'tick', 0.25], ['w:tarik-0.2', 'whoosh', 0.35], ['w:tarik+0.3', 'ding', 0.45]],
      vis: R({ tempa: 'w:Mata-0.1', las: 'w:Tempa-0.1', tarik2: 'w:tarik-0.2', tahan: 'w:tarik+0.25' }),
    },
    {
      id: 's5', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Kenali mata rantaimu. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Kenali mata rantaimu.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: R({ cta: { tag: 'Kenali|*mata rantaimu*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
