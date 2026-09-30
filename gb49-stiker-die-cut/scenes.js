// GB49 — STIKER DIE-CUT "DPO Starter Pack": stiker bergaris tepi putih tebal ditempel satu-satu di tutup laptop, saling
// tumpuk: kopi ke-4, 47 tab, RoPA_final_final_v3, grup chat URGENT, 72 jam, audit minggu depan → stiker terakhir:
// Privasimu Nexus "satu tab"; CTA.
// Hook (relate): "DPO starter pack."
// Komposisi: 30% edukasi · 70% meme. Satu gaya: stiker die-cut (outline putih + bayangan, efek tempel).
(function (root) {
  const CONFIG = {
    title: 'GB49 · DPO Starter Pack (stiker die-cut)',
    naskah: 'GB49',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+12%',
    maxPause: 0.4,
    beat: 60 / 116 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 116, mode: 'major', root: 57, lead: 'pluck', drums: 'full', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.75 },
    meta: {
      judul: 'DPO Starter Pack',
      gaya: 'Stiker die-cut',
      tampilan: 'tutup laptop hijau tua (permukaan datar); stiker warna-warni bergaris tepi putih tebal & bayangan ditampar masuk satu per satu, miring dan saling tumpuk; stiker terakhir logo Privasimu Nexus besar di tengah',
      jenisHook: 'Relate',
      hook: '"DPO starter pack."',
      komposisi: '30% edukasi · 70% meme',
      fakta: [
        'Privasimu Nexus (fakta_produk.json): platform dengan modul saling terhubung — RoPA, DPIA, DSR, Consent, insiden ("satu tab" = kiasan satu platform).',
        'Isi stiker (kopi ke-4, 47 tab, RoPA_final_final_v3, grup chat URGENT) = lelucon keseharian, bukan klaim produk; "72 jam" = tenggat DSR otomatis.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const S = (o) => ({ type: 'sd', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 3.5, voDelay: 0.5, mus: 'hook',
      vo: 'DPO starter pack.',
      layar: 'Tutup laptop kosong; stiker spanduk kuning "DPO STARTER PACK" ditampar masuk di atas.',
      sfx: [[0.1, 'whoosh', 0.25], ['w:DPO', 'pop', 0.45]],
      vis: S({ tempel: [[0, 'w:DPO']] }),
    },
    {
      id: 's2', min: 5, voDelay: 0.3, mus: 'main',
      vo: 'Kopi keempat, empat puluh tujuh tab, RoPA final final v3, grup chat urgent, dan tenggat tujuh puluh dua jam.',
      layar: 'Stiker ditampar satu per satu saat disebut: ☕ kopi ke-4 · 47 tab · RoPA_final_final_v3.xlsx · grup chat URGENT 99+ · ⏱ 72 jam · 📎 audit minggu depan.',
      sfx: [['w:Kopi', 'pop', 0.4], ['w:Empat', 'pop', 0.4], ['w:RoPA', 'pop', 0.4], ['w:Grup', 'pop', 0.4], ['w:tenggat', 'pop', 0.4], ['w:jam+0.5', 'pop', 0.4]],
      vis: S({ tempel: [[1, 'w:Kopi'], [2, 'w:Empat'], [3, 'w:RoPA'], [4, 'w:Grup'], [5, 'w:tenggat'], [6, 'w:jam+0.5']] }),
    },
    {
      id: 's3', min: 4.5, voDelay: 0.4, mus: 'main',
      vo: 'Stiker terakhir: Privasimu Nexus. Semua modul, satu platform, satu tab.',
      layar: 'Stiker besar logo Privasimu Nexus ditampar di tengah menutupi tumpukan; stiker kecil "satu tab 🙂" menyusul.',
      sfx: [['w:Privasimu', 'hit', 0.45], ['w:tab', 'pop', 0.4], ['w:tab+0.3', 'ding', 0.35]],
      vis: S({ tempel: [[7, 'w:Privasimu'], [8, 'w:tab-0.1']] }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'DPO starter pack: cukup satu stiker. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "DPO starter pack: cukup satu stiker.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: S({ cta: { tag: 'DPO starter pack:|*cukup satu stiker*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
