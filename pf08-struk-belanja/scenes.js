// PF08 — STRUK BELANJA "Emotional Damage: Denda 2%": kertas printer termal keluar dari celah kasir dan memanjang ke
// bawah; baris kelalaian dicetak per karakter dengan kolom "sanksi" (peringatan tertulis · penghentian sementara ·
// penghapusan data · denda); TOTAL: denda administratif hingga 2% pendapatan tahunan; cap EMOTIONAL DAMAGE; struk
// disobek zigzag → versi Nexus: tiap baris terpetakan ke modul (Paparan Sanksi Administratif); CTA.
// Hook (anomali): "CFO membaca: denda administratif hingga 2% dari pendapatan tahunan."
// Komposisi: 40% edukasi · 60% meme. Satu gaya: struk termal (kertas tumbuh ke bawah, cetak per karakter, tepi sobek).
(function (root) {
  const CONFIG = {
    title: 'PF08 · Emotional Damage: Denda 2% (struk belanja)',
    naskah: 'PF08',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 104 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 104, mode: 'minor', root: 50, lead: 'chip', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.7 },
    meta: {
      judul: 'Emotional Damage: Denda 2%',
      gaya: 'Struk belanja',
      tampilan: 'meja kasir gelap; celah printer termal di atas; kertas putih memanjang ke bawah saat baris dicetak (huruf mono abu-hitam ala termal), garis putus-putus, TOTAL besar, barcode, cap merah miring, tepi sobek zigzag; versi kedua bergaya sama dengan chip modul',
      jenisHook: 'Anomali',
      hook: '"CFO membaca: denda administratif hingga 2% dari pendapatan tahunan."',
      komposisi: '40% edukasi · 60% meme',
      fakta: [
        'UU PDP (UU 27/2022) Pasal 57: sanksi administratif berupa peringatan tertulis, penghentian sementara kegiatan pemrosesan, penghapusan/pemusnahan data pribadi, dan denda administratif paling tinggi 2% dari pendapatan tahunan.',
        'Paparan Sanksi Administratif (fakta_produk.json): pemetaan pasal bersanksi ke modul kepatuhan terkait; penilaian paparan sanksi.',
        'Frasa "Emotional Damage" dipakai sebagai teks meme saja, tanpa meniru persona/suara siapa pun; tidak ada nominal rupiah.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const S = (o) => ({ type: 'sb', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5.5, voDelay: 0.5, mus: 'hook',
      vo: 'CFO membaca struk ini: denda administratif, hingga dua persen dari pendapatan tahunan.',
      layar: 'Struk keluar dari celah: kop "TOKO KEPATUHAN · struk tagihan UU PDP", lalu baris: "Tanpa dasar pemrosesan … peringatan tertulis", "Pemberitahuan insiden terlambat … penghentian sementara".',
      sfx: [[0.1, 'tick', 0.25], ['w:membaca', 'tick', 0.25], ['w:denda', 'tick', 0.25], ['w:dua', 'hit', 0.35]],
      vis: S({ cetak: [[0, 0.1], [1, 'w:membaca-0.3'], [2, 'w:membaca+0.6'], [3, 'w:denda']] }),
    },
    {
      id: 's2', min: 6, voDelay: 0.3, mus: 'tense',
      vo: 'Data spesifik tanpa DPIA. Persetujuan tanpa bukti. Total: hingga dua persen pendapatan tahunan. Emotional damage.',
      layar: 'Baris terus dicetak: "Data spesifik tanpa DPIA … penghapusan data", "Persetujuan tanpa bukti … denda administratif"; garis putus; TOTAL besar "DENDA: hingga 2% pendapatan tahunan"; barcode; cap merah EMOTIONAL DAMAGE menghantam.',
      sfx: [['w:Data', 'tick', 0.25], ['w:Persetujuan', 'tick', 0.25], ['w:Total', 'hit', 0.4], ['w:Emotional', 'hit', 0.5]],
      vis: S({ cetak: [[4, 'w:Data'], [5, 'w:Persetujuan'], [6, 'w:Total-0.2'], [7, 'w:Total'], [8, 'w:tahunan']], cap: 'w:Emotional' }),
    },
    {
      id: 's3', min: 5.5, voDelay: 0.3, mus: 'main',
      vo: 'Privasimu Nexus memetakan tiap pasal bersanksi ke modulnya: RoPA, Insiden, DPIA, Consent. Kelihatan sebelum ditagih.',
      layar: 'Struk disobek zigzag dan jatuh; struk baru "PAPARAN SANKSI · terpetakan" tercetak: tiap kelalaian → chip modul (RoPA · Insiden · DPIA · Consent) dengan status; TOTAL berubah "paparan: terpetakan ✓".',
      sfx: [['w:memetakan', 'whoosh', 0.45], ['w:RoPA', 'tick', 0.25], ['w:Insiden', 'tick', 0.25], ['w:DPIA', 'tick', 0.25], ['w:Consent', 'tick', 0.25], ['w:kelihatan', 'ding', 0.4]],
      vis: S({ sobek: 'w:memetakan-0.3', cetak: [[9, 'w:memetakan'], [10, 'w:RoPA'], [11, 'w:Insiden'], [12, 'w:DPIA'], [13, 'w:Consent'], [14, 'w:kelihatan']] }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Baca struknya sekarang, bukan saat ditagih. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Baca struknya sekarang, bukan saat ditagih.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: S({ cta: { tag: 'Baca struknya sekarang,|*bukan saat ditagih*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
