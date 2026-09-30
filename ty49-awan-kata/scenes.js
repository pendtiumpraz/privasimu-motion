// TY49 — AWAN KATA "Kata Paling Sering Tahun Ini": kata-kata keseharian DPO memenuhi layar (yang paling sering paling
// besar: "revisi"), tumbuh satu per satu di posisi spiral; lalu kata baru masuk dan mendominasi: "tercatat" (Privasimu
// Nexus) sementara awan lama meredup; CTA.
// Hook (relate): "Kata yang paling sering diucapkan DPO tahun ini: 'revisi'."
// Komposisi: 50% edukasi · 50% meme. Satu gaya: awan kata (posisi spiral dihitung sekali, ukuran tumbuh). Frekuensi = ilustrasi.
(function (root) {
  const CONFIG = {
    title: 'TY49 · Kata Paling Sering Tahun Ini (awan kata)',
    naskah: 'TY49',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 108 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 108, mode: 'major', root: 55, lead: 'pluck', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.72 },
    meta: {
      judul: 'Kata Paling Sering Tahun Ini',
      gaya: 'Awan kata',
      tampilan: 'latar krem; awan kata warna-warni (Inter tebal) tumbuh satu per satu dari pusat spiral, "revisi" terbesar dan berdenyut; kata baru "tercatat" biru menyala di tengah sementara awan lama meredup; logo Nexus kecil',
      jenisHook: 'Relate',
      hook: '"Kata yang paling sering diucapkan DPO tahun ini: \'revisi\'."',
      komposisi: '50% edukasi · 50% meme',
      fakta: [
        'Privasimu Nexus (fakta_produk.json): RoPA/DPIA/DSR/Consent/Insiden tercatat dengan kode otomatis, riwayat perubahan, dan log audit — "tercatat" sebagai kata kunci brand.',
        'Frekuensi kata & daftar kata = ilustrasi (ditandai *ilustrasi); tanpa nama orang/merek.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const W = (o) => ({ type: 'ak', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5.5, voDelay: 0.5, mus: 'hook',
      vo: 'Kata yang paling sering diucapkan DPO tahun ini: "revisi".',
      layar: 'Awan kata tumbuh cepat dari pusat (rapat, form, tenggat, draf, kopi…); pada "revisi" kata REVISI raksasa muncul di tengah dan berdenyut.',
      sfx: [[0.1, 'whoosh', 0.3], ['w:tahun', 'tick', 0.25], ['w:revisi', 'hit', 0.4]],
      vis: W({ mulai: 0.2, utama: 'w:revisi-0.1' }),
    },
    {
      id: 's2', min: 5, voDelay: 0.3, mus: 'tense',
      vo: 'Disusul: rapat, form, tenggat, "sebentar", dan "final" yang tidak pernah final.',
      layar: 'Kata yang disebut menyala bergantian; "FINAL" bergetar; label kecil "*frekuensi ilustrasi".',
      sfx: [['w:rapat', 'tick', 0.25], ['w:form', 'tick', 0.25], ['w:tenggat', 'tick', 0.25], ['w:sebentar', 'tick', 0.25], ['w:final', 'pop', 0.3]],
      vis: W({ sorot: [['rapat', 'w:rapat'], ['form', 'w:form'], ['tenggat', 'w:tenggat'], ['sebentar', 'w:sebentar'], ['FINAL', 'w:final']] }),
    },
    {
      id: 's3', min: 5.5, voDelay: 0.3, mus: 'main',
      vo: 'Tahun depan, kata paling seringnya bisa berbeda: "tercatat". Di Privasimu Nexus, semuanya tercatat.',
      layar: 'Awan lama meredup & mengecil; kata baru "TERCATAT" biru menyala membesar di tengah dengan logo Nexus kecil di bawahnya.',
      sfx: [['w:tercatat', 'whoosh', 0.45], ['w:tercatat+0.4', 'ding', 0.4], ['w:semuanya', 'pop', 0.3]],
      vis: W({ baru: 'w:tercatat-0.2' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Ganti kata paling seringmu. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Ganti kata paling seringmu.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: W({ cta: { tag: 'Ganti kata|*paling seringmu*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
