// GB03 — FLAT GEOMETRIC (BAUHAUS) "Tiga Bentuk": lingkaran merah = orang (subjek data), persegi biru = sistem,
// segitiga kuning = risiko. Tiga bentuk tampil mekanis di grid krem → berlipat & bertabrakan tanpa pola → mengunci
// menjadi poster Bauhaus rapi: alur RoPA–DPIA–DSR + tulisan PRIVASIMU NEXUS; CTA.
// Hook (anomali): "Semua urusan data pribadi bisa digambar dengan tiga bentuk."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: bentuk dasar warna primer, gerak mekanis tepat di beat.
(function (root) {
  const CONFIG = {
    title: 'GB03 · Tiga Bentuk (flat geometric Bauhaus)',
    naskah: 'GB03',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+10%',
    maxPause: 0.4,
    beat: 60 / 108 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 108, mode: 'major', root: 55, lead: 'chip', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.72 },
    meta: {
      judul: 'Tiga Bentuk',
      gaya: 'Flat geometric (Bauhaus)',
      tampilan: 'kanvas krem bergaris grid tipis; lingkaran merah, persegi biru, segitiga kuning + garis hitam tebal; masuk mekanis (menggelinding/geser/putar) tepat di beat; fase kacau: salinan bentuk memantul saling tumpang; fase poster: bentuk mengunci ke komposisi Bauhaus berlabel RoPA · DPIA · DSR + tulisan vertikal PRIVASIMU NEXUS',
      jenisHook: 'Anomali',
      hook: '"Semua urusan data pribadi bisa digambar dengan tiga bentuk."',
      komposisi: '70% edukasi · 30% meme',
      fakta: [
        'Privasimu Nexus (fakta_produk.json, kunci platform): modul saling terhubung — RoPA, DPIA, DSR, Consent, insiden, pihak ketiga, transfer lintas negara.',
        'RoPA mencatat kegiatan pemrosesan (orang ↔ sistem); DPIA menilai risiko (matriks 5×5, register risiko); DSR menjawab permohonan subjek data dengan tenggat otomatis 72 jam.',
        'Tanpa angka pelanggan; simbol bentuk = metafora.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const B = (o) => ({ type: 'bh', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.5, mus: 'hook',
      vo: 'Semua urusan data pribadi bisa digambar dengan tiga bentuk. Orang. Sistem. Risiko.',
      layar: 'Grid krem; lingkaran merah menggelinding masuk (ORANG), persegi biru meluncur (SISTEM), segitiga kuning berputar masuk (RISIKO) — masing-masing tepat saat disebut.',
      sfx: [[0.35, 'pop', 0.4], [0.75, 'pop', 0.4], [1.15, 'pop', 0.4], ['w:Orang', 'tick', 0.3], ['w:Sistem', 'tick', 0.3], ['w:Risiko', 'hit', 0.35]],
      vis: B({ masuk: [0.35, 0.75, 1.15], label: ['w:Orang', 'w:Sistem', 'w:Risiko'] }),
    },
    {
      id: 's2', min: 5.5, voDelay: 0.3, mus: 'tense',
      vo: 'Orang masuk ke sistem. Sistem menyimpan. Risiko muncul di antaranya. Tanpa pola, semuanya bertabrakan.',
      layar: 'Bentuk berlipat ganda dan memantul saling tumpang tindih (gerak deterministik), garis hitam tercerai-berai; tanda tanya hitam besar berdenyut di tengah.',
      sfx: [['w:Orang', 'tick', 0.3], ['w:Sistem', 'tick', 0.3], ['w:Risiko', 'tick', 0.3], ['w:bertabrakan', 'hit', 0.45]],
      vis: B({ kacau: 'w:Orang-0.2', tanya: 'w:Tanpa' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Di Privasimu Nexus, tiga bentuk itu tersusun: RoPA mencatat orang dan sistem, DPIA menilai risiko, DSR menjawab orang. Satu alur.',
      layar: 'Semua bentuk mengunci ke poster Bauhaus: baris RoPA (lingkaran → persegi), baris DPIA (segitiga + bar hitam), baris DSR (persegi → lingkaran, tag 72 jam); tulisan vertikal PRIVASIMU NEXUS; salinan kacau lenyap.',
      sfx: [['w:Di', 'whoosh', 0.45], ['w:RoPA', 'pop', 0.3], ['w:DPIA', 'pop', 0.3], ['w:DSR', 'pop', 0.3], ['w:Satu', 'ding', 0.4]],
      vis: B({ susun: 'w:Di', baris: ['w:RoPA', 'w:DPIA', 'w:DSR'], judul: 'w:Satu' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Tiga bentuk, satu alur. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Tiga bentuk, satu alur.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: B({ cta: { tag: 'Tiga bentuk,|*satu alur*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
