// T02 — FULL TYPOGRAPHY (kinetic type): seluruh pesan disampaikan huruf yang muncul kata per kata mengikuti VO.
// Kamera menjelajah SATU kanvas besar: tiap kalimat = satu blok teks (sebagian diputar 90°/180°), kamera pan + putar
// ke blok berikutnya. Di "di satu tempat" kamera mundur memperlihatkan seluruh kanvas sebagai satu poster → CTA.
// Hook psikologi terbalik: "Jangan tonton video ini… kalau perusahaanmu tidak menyimpan satu pun data pelanggan."
// Logika dipatahkan (blok 8, dunia terbalik 180°): "merasa aman" dicoret → "BUKTI."; solusi = dunia tegak kembali.
// Baris: { t: teks, c: kelas (mega|xxl|xl|lg|md|sm + red|blue|yel|mute|serif|cond|wide), fx: up|pop|slam|stretch|type|fade,
//          at: cue (bila teks ≠ ucapan, mis. "PP 33/2026"), strike: cue coret, check: true }
// Waktu tiap kata dicocokkan otomatis dengan kata VO di scene yang sama (berurutan).
(function (root) {
  const CONFIG = {
    title: 'T02 · Full Typography: Jangan Tonton',
    naskah: 'T02',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.35,
    beat: 60 / 112,
    tail: 0.3,
    burnCaptions: false, // teks di layar = VO; .srt tetap dibuat
    music: { bpm: 112, mode: 'minor', root: 50, lead: 'pluck', drums: 'full', sonic: true },
    mix: { duckTo: 0.4 },
    capMap: [['tiga puluh tiga', '33'], ['enam belas', '16'], ['dua ribu dua puluh tujuh', '2027'], ['dua persen', '2%'], ['tiga kali dua puluh empat', '3×24']],
  };
  const K = (blocks, extra = {}) => ({ type: 'ky', enter: 'none', exit: 'none', push: 0, blocks, ...extra });

  const SCENES = [
    {
      id: 's1', min: 2.2, voDelay: 0.25, mus: 'hook',
      vo: 'Jangan tonton video ini…',
      sfx: [[0, 'hit', 0.6]],
      vis: K([{ rot: 0, lines: [{ t: 'JANGAN', c: 'mega red', fx: 'slam', at: -0.12 }, { t: 'tonton', c: 'lg' }, { t: 'video ini…', c: 'lg serif' }] }]),
    },
    {
      id: 's2', min: 4, voDelay: 0.2, mus: 'tense',
      vo: '…kalau perusahaanmu tidak menyimpan satu pun nama, nomor HP, atau email pelanggan.',
      sfx: [['w:satu', 'pop', 0.35], ['w:nama', 'tick', 0.5], ['w:nomor', 'tick', 0.5], ['w:email', 'tick', 0.5]],
      vis: K([
        { rot: -90, lines: [{ t: '…kalau', c: 'sm mute' }, { t: 'perusahaanmu', c: 'xl cond' }, { t: 'tidak menyimpan', c: 'md' }, { t: 'SATU PUN', c: 'xxl yel', fx: 'stretch' }] },
        { rot: 0, lines: [{ t: 'nama,', c: 'xl', fx: 'pop' }, { t: 'nomor HP,', c: 'xl blue', fx: 'pop' }, { t: 'atau email', c: 'md' }, { t: 'pelanggan.', c: 'xl serif' }] },
      ]),
    },
    {
      id: 's3', min: 3, voDelay: 0.3, mus: 'tense',
      vo: 'Masih di sini? Berarti ini tentang kamu.',
      sfx: [['w:kamu', 'vineboom', 0.45]],
      vis: K([{ rot: 90, lines: [{ t: 'Masih', c: 'md' }, { t: 'di sini?', c: 'xl', fx: 'pop' }, { t: 'Berarti ini', c: 'sm mute' }, { t: 'tentang', c: 'md' }, { t: 'KAMU.', c: 'mega yel', fx: 'slam' }] }]),
    },
    {
      id: 's4', min: 5, voDelay: 0.25, mus: 'tense',
      vo: 'Undang-undangnya sudah berlaku. Aturan pelaksananya, PP tiga puluh tiga, berlaku enam belas Januari dua ribu dua puluh tujuh.',
      sfx: [['w:PP', 'flip', 0.5], ['w:enam', 'hit', 0.45]],
      vis: K([
        { rot: 0, lines: [{ t: 'Undang-undangnya', c: 'lg cond' }, { t: 'sudah', c: 'md mute' }, { t: 'BERLAKU.', c: 'xxl blue', fx: 'stretch' }] },
        { rot: 0, lines: [{ t: 'Aturan pelaksananya,', c: 'sm mute' }, { t: 'PP 33/2026', c: 'xxl', at: 'w:PP', fx: 'slam' }, { t: 'berlaku', c: 'md' }, { t: '16 JANUARI 2027', c: 'xl red', at: 'w:enam', fx: 'stretch' }] },
      ]),
    },
    {
      id: 's5', min: 3.5, voDelay: 0.25, mus: 'tense',
      vo: 'Sanksinya bisa sampai dua persen dari pendapatan tahunan.',
      sfx: [['w:dua', 'impact', 0.55]],
      vis: K([{ rot: -90, lines: [{ t: 'Sanksinya', c: 'lg' }, { t: 'bisa sampai', c: 'sm mute' }, { t: '2%', c: 'giga red', at: 'w:dua', fx: 'slam' }, { t: 'dari pendapatan tahunan.', c: 'md' }] }]),
    },
    {
      id: 's6', min: 3.2, voDelay: 0.3, mus: 'hush',
      vo: 'Masalahnya, merasa aman itu bukan bukti.',
      sfx: [['w:bukan', 'scratch', 0.35], ['w:bukti', 'stamp', 0.6]],
      vis: K([{ rot: 180, lines: [{ t: 'Masalahnya,', c: 'sm mute' }, { t: 'merasa aman', c: 'xl serif', strike: 'w:bukan' }, { t: 'itu bukan', c: 'md' }, { t: 'BUKTI.', c: 'mega yel', fx: 'slam' }] }]),
    },
    {
      id: 's7', min: 3.5, voDelay: 0.3, mus: 'main',
      vo: 'Privasimu Nexus mengubah kepatuhan jadi bukti yang rapi.',
      sfx: [['w:Privasimu', 'shimmer', 0.4]],
      vis: K([{ rot: 0, lines: [{ t: 'PRIVASIMU NEXUS', c: 'lg blue wide', fx: 'type' }, { t: 'mengubah kepatuhan', c: 'md' }, { t: 'jadi bukti', c: 'xxl' }, { t: 'yang rapi.', c: 'xl serif yel' }] }]),
    },
    {
      id: 's8', min: 3.8, voDelay: 0.25, mus: 'main',
      vo: 'Pemrosesan tercatat di RoPA. Risiko dinilai lewat DPIA.',
      sfx: [['w:RoPA+0.15', 'check', 0.4], ['w:DPIA+0.15', 'check', 0.4]],
      vis: K([{ rot: 90, lines: [{ t: 'Pemrosesan', c: 'lg' }, { t: 'tercatat di', c: 'sm mute' }, { t: 'RoPA.', c: 'xxl blue', check: true }, { t: 'Risiko', c: 'lg' }, { t: 'dinilai lewat', c: 'sm mute' }, { t: 'DPIA.', c: 'xxl blue', check: true }] }]),
    },
    {
      id: 's9', min: 5, voDelay: 0.25, mus: 'main',
      vo: 'Permintaan subjek data terlacak tenggatnya. Insiden siap dilaporkan tiga kali dua puluh empat jam.',
      sfx: [['w:tiga', 'hit', 0.45]],
      vis: K([{ rot: 0, lines: [{ t: 'Permintaan subjek data', c: 'lg cond' }, { t: 'terlacak', c: 'xl' }, { t: 'tenggatnya.', c: 'md serif' }, { t: 'Insiden', c: 'xl red' }, { t: 'siap dilaporkan', c: 'md' }, { t: '3×24 JAM.', c: 'xxl', at: 'w:tiga', fx: 'stretch' }] }]),
    },
    {
      id: 's10', min: 3.6, voDelay: 0.25, tail: 1.4, mus: 'main',
      vo: 'Semuanya, di satu tempat.',
      sfx: [['w:satu-0.5', 'riser', 0.3], ['w:satu', 'whoosh', 0.5]],
      vis: K([{ rot: 0, lines: [{ t: 'Semuanya,', c: 'xl' }, { t: 'di satu tempat.', c: 'xxl yel' }] }], { zoomOut: 'w:satu' }),
    },
    {
      id: 's11', min: 7, voDelay: 0.3, tail: 1.8, mus: 'outro',
      vo: 'Siap diperiksa kapan saja. Mulai dengan cek kesiapan gratis, di privasimu dot com.',
      sfx: [['w:Mulai', 'pop', 0.4], ['w:privasimu', 'ding', 0.4]],
      vis: { type: 'ky_cta', enter: 'none', exit: 'none', push: 0, logoAt: 'w:Mulai', pillAt: 'w:cek', urlAt: 'w:privasimu' },
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
