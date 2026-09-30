// TY29 — OUTLINE + GEMA "Satu Permintaan, Tujuh Gema": kata HAPUS padat di tengah, salinannya (garis tepi saja) bergema
// ke tujuh arah dengan jeda dan opasitas menurun, tiap gema mendarat sebagai nama sistem; lalu gema kembali sebagai centang.
// Hook (relate): "Satu permintaan: 'hapus data saya'. Tujuh sistem yang harus menjawab."
// Komposisi: 50% edukasi · 50% meme. Satu gaya: salinan teks stroke-only dengan jeda waktu & opasitas menurun.
(function (root) {
  const CONFIG = {
    title: 'TY29 · Satu Permintaan, Tujuh Gema (outline gema)',
    naskah: 'TY29',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+7%',
    maxPause: 0.4,
    beat: 60 / 100 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 100, mode: 'minor', root: 50, lead: 'bell', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.8 },
    meta: {
      judul: 'Satu Permintaan, Tujuh Gema',
      gaya: 'Outline + gema',
      tampilan: 'kata HAPUS putih padat di tengah gelap; salinan garis tepi bergema ke tujuh arah, tiap gema jadi nama sistem; gema kembali sebagai centang',
      jenisHook: 'Relate',
      hook: '"Satu permintaan: \'hapus data saya\'. Tujuh sistem yang harus menjawab."',
      komposisi: '50% edukasi · 50% meme',
      fakta: [
        'DSR: permohonan tercatat di satu antrean, tenggat otomatis 72 jam, alur Handler–Reviewer–Approver (fakta_produk.json: dsr). Data Discovery: pencarian data satu subjek di berbagai sistem untuk mendukung DSR (data-discovery).',
        'Angka "tujuh sistem" dan nama sistem = ilustrasi (diberi label). Pil tenggat = potongan layar asli assets/app/dsr-detail.png.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const G = (o) => ({ type: 'gm', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 4, voDelay: 0.4, mus: 'hush',
      vo: 'Satu permintaan: hapus data saya.',
      layar: 'Kata HAPUS putih padat di tengah; di "hapus" kata berdenyut sekali.',
      sfx: [['w:hapus', 'boom', 0.45]],
      vis: G({ denyut: 'w:hapus', teks: 'Satu permintaan: *"hapus data saya."*' }),
    },
    {
      id: 's2', min: 5, voDelay: 0.25, mus: 'tense',
      vo: 'Tujuh sistem yang harus menjawab. CRM, email, layanan pelanggan, arsip, cloud, spreadsheet, cadangan.',
      layar: 'Gema garis tepi memancar ke tujuh arah, tiap gema berhenti sebagai label sistem saat disebut.',
      sfx: [['w:CRM', 'blip', 0.3], ['w:email', 'blip', 0.3], ['w:layanan', 'blip', 0.3], ['w:arsip', 'blip', 0.3], ['w:cloud', 'blip', 0.3], ['w:spreadsheet', 'blip', 0.3], ['w:cadangan', 'blip', 0.3]],
      vis: G({ gema: 'w:Tujuh', label: ['w:CRM', 'w:email', 'w:layanan', 'w:arsip', 'w:cloud', 'w:spreadsheet', 'w:cadangan'], teks: '*Tujuh sistem* yang harus menjawab. *ilustrasi', teksAt: 'w:Tujuh' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.25, mus: 'main',
      vo: 'Data Discovery menemukan lokasinya. Permohonannya terlacak di satu antrean, dengan tenggat tujuh puluh dua jam, sampai selesai.',
      layar: 'Gema kembali ke tengah sebagai centang hijau satu per satu; pil tenggat asli "71h tersisa" dan penghitung 7/7 selesai.',
      sfx: [['w:menemukan', 'sweep', 0.35], ['w:terlacak', 'check', 0.35], ['w:terlacak+0.3', 'check', 0.3], ['w:terlacak+0.6', 'check', 0.3], ['w:selesai', 'levelup', 0.45]],
      vis: G({ kembali: 'w:menemukan', pil: 'w:tenggat', selesai: 'w:selesai', teks: 'Ditemukan, terlacak di *satu antrean*, sampai selesai.' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.4,
      vo: 'Satu permintaan, satu jawaban. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Satu permintaan, satu jawaban.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: G({ cta: { tag: 'Satu permintaan,|*satu jawaban*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
