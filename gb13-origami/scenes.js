// GB13 — ORIGAMI (lipat kertas) "Selembar Kontrak": selembar DPA dilipat akordeon jadi pesawat kertas yang terbang ke
// pojok (dilupakan) → kembali & dibuka → telaah per bab (temuan + rekomendasi klausul) → dilipat jadi perisai; CTA.
// Hook (logika dipatahkan): "Kontrak sudah ditandatangani. Bukan berarti datanya aman."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: panel kertas CSS 3D berputar di engsel lipatan + bayangan lipatan.
(function (root) {
  const CONFIG = {
    title: 'GB13 · Selembar Kontrak (origami)',
    naskah: 'GB13',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 96 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 96, mode: 'major', root: 55, lead: 'keys', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.72 },
    meta: {
      judul: 'Selembar Kontrak',
      gaya: 'Origami (lipat kertas)',
      tampilan: 'meja kayu terang; selembar kertas kontrak (DPA) dengan pasal-pasal; kertas terlipat akordeon 3D (bayangan di tiap lipatan) → pesawat kertas terbang ke pojok → kembali, terbuka; stempel temuan per bab + rekomendasi klausul; kertas terlipat jadi perisai',
      jenisHook: 'Logika dipatahkan',
      hook: '"Kontrak sudah ditandatangani. Bukan berarti datanya aman."',
      komposisi: '70% edukasi · 30% meme',
      fakta: [
        'Telaah Kontrak (fakta_produk.json): telaah per bab untuk DPA, kontrak pihak ketiga, NDA, kontrak pelanggan; rujukan pasal diverifikasi ke knowledge base; rekomendasi klausul.',
        'Temuan di layar (Pasal 4 sub-prosesor, Pasal 7 insiden 3×24 jam, Pasal 9 transfer) = contoh ilustratif, ditandai *.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const O = (o) => ({ type: 'or', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5.5, voDelay: 0.5, mus: 'hook',
      vo: 'Kontrak sudah ditandatangani… bukan berarti datanya aman.',
      layar: 'Kertas DPA dengan tanda tangan; pada "ditandatangani" kertas terlipat akordeon jadi pesawat kertas; pada "aman" pesawat terbang ke pojok atas.',
      sfx: [[0.1, 'whoosh', 0.25], ['w:ditandatangani', 'tick', 0.3], ['w:ditandatangani+0.5', 'tick', 0.3], ['w:aman', 'whoosh', 0.45]],
      vis: O({ lipat: 'w:ditandatangani-0.2', terbang: 'w:aman-0.2', teks: 'Ditandatangani ≠ *aman*.' }),
    },
    {
      id: 's2', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Privasimu Nexus membukanya lagi, menelaah per bab: sub-prosesor, pemberitahuan insiden, transfer data. Rujukan pasal diverifikasi.',
      layar: 'Pesawat kembali ke meja dan terbuka jadi kertas; stempel temuan per bab muncul: Pasal 4 · Pasal 7 · Pasal 9 dengan rekomendasi klausul.',
      sfx: [['w:membukanya', 'whoosh', 0.4], ['w:sub-prosesor', 'pop', 0.3], ['w:pemberitahuan', 'pop', 0.3], ['w:transfer', 'pop', 0.3], ['w:diverifikasi', 'ding', 0.3]],
      vis: O({ buka: 'w:membukanya-0.3', temuan: ['w:sub-prosesor', 'w:pemberitahuan', 'w:transfer'], teks: 'Telaah *per bab*, rujukan pasal *terverifikasi*.' }),
    },
    {
      id: 's3', min: 7, voDelay: 0.3, mus: 'main',
      vo: 'Klausulnya diperbaiki. Kertas yang sama, sekarang jadi perisai.',
      layar: 'Stempel berubah hijau; kertas terlipat lagi menjadi perisai kertas bergaris lipatan; tiga panah merah (risiko) menghantam perisai dan terpental dengan kilat kuning.',
      sfx: [['w:diperbaiki', 'ding', 0.35], ['w:perisai-0.3', 'whoosh', 0.45], ['w:perisai+0.3', 'hit', 0.3], ['w:perisai+1.5', 'hit', 0.4], ['w:perisai+1.8', 'hit', 0.4], ['w:perisai+2.1', 'hit', 0.45]],
      vis: O({ perbaiki: 'w:diperbaiki', perisai: 'w:perisai-0.5', teks: 'Kertas yang sama, jadi *perisai*.' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Lipat kontrakmu jadi perisai. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Lipat kontrakmu jadi perisai.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: O({ cta: { tag: 'Lipat kontrakmu|*jadi perisai*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
