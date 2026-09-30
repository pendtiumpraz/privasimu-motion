// TY48 — KREDIT AKHIR FILM "Film dengan Satu Pemeran": daftar kredit bergulir ke atas; semua peran diisi nama yang sama.
// Hook (relate): "Pemeran. DPO sebagai Legal. DPO sebagai IT. DPO sebagai layanan pelanggan. DPO sebagai humas."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: kredit film dua kolom (peran — nama) yang bergulir mengikuti suara.
// vis.baris: [peran, nama, kapan] — `kapan` = cue saat baris itu berada di garis baca; tanpa `kapan` = mengalir di antara
// baris yang punya cue. ['#', judul, kapan] = judul bagian. ['logo', '', kapan] = logo.
(function (root) {
  const CONFIG = {
    title: 'TY48 · Film dengan Satu Pemeran (kredit akhir film)',
    naskah: 'TY48',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+10%',
    maxPause: 0.3,
    tail: 0.3,
    burnCaptions: false, // isi VO tampil sebagai baris kredit; .srt tetap dibuat
    capMap: [['aiti', 'IT']],
    music: { bpm: 76, mode: 'major', root: 53, lead: 'keys', drums: 'none', sonic: true },
    mix: { duckTo: 0.45, musicGain: 0.85 },
    meta: {
      judul: 'Film dengan Satu Pemeran',
      gaya: 'Kredit akhir film',
      tampilan: 'layar hitam ala bioskop; kredit putih gading dua kolom bergulir ke atas, butiran film dan kedip proyektor halus',
      jenisHook: 'Relate',
      hook: '"Pemeran. DPO sebagai Legal. DPO sebagai IT. DPO sebagai layanan pelanggan. DPO sebagai humas."',
      komposisi: '70% edukasi · 30% meme',
      sasaran: 'DPO/PPDP yang bekerja sendirian, manajemen yang menunjuknya',
      rekam: ['Gaya narator film: tenang, berwibawa, sedikit jenaka. "IT" dibaca "ai-ti".'],
      fakta: [
        'Dukungan PPDP: dasbor kepatuhan lintas modul, antrean pekerjaan yang menunggu tindakan, asisten AI Priva, log audit (fakta_produk.json: ppdp).',
        'Daftar peran (notulis rapat, pengingat tenggat, dst.) = humor empati, bukan data.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const K = (o) => ({ type: 'kr', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.35, mus: 'calm',
      vo: 'Pemeran. DPO sebagai Legal. DPO sebagai aiti. DPO sebagai layanan pelanggan. DPO sebagai humas.',
      layar: 'Kredit bergulir: PEMERAN — Legal … DPO, IT … DPO, Layanan Pelanggan … DPO, Humas … DPO.',
      vis: K({ baris: [['#', 'PEMERAN', 'w:Pemeran'], ['Legal', 'DPO', 'w:Legal'], ['IT', 'DPO', 'w:aiti'], ['Layanan Pelanggan', 'DPO', 'w:pelanggan'], ['Humas', 'DPO', 'w:humas']] }),
    },
    {
      id: 's2', min: 4, voDelay: 0.2, mus: 'calm',
      vo: 'Satu film. Satu pemeran. Pemeran pengganti: tidak ada.',
      layar: 'Gulir makin cepat: Notulis Rapat, Pengingat Tenggat, Penjawab "Datanya di Mana?", Pemadam Kebakaran, Penerjemah Pasal … semuanya DPO. Lalu PEMERAN PENGGANTI: (tidak ada).',
      sfx: [['w:tidak', 'crickets', 0.35]],
      vis: K({
        baris: [['Notulis Rapat', 'DPO'], ['Pengingat Tenggat', 'DPO'], ['Penjawab “Datanya di Mana?”', 'DPO'], ['Pemadam Kebakaran', 'DPO'], ['Penerjemah Pasal', 'DPO'],
          ['#', 'PEMERAN PENGGANTI', 'w:pengganti'], ['(tidak ada)', '', 'w:tidak+0.15']],
      }),
    },
    {
      id: 's3', min: 5, voDelay: 0.25, mus: 'main',
      vo: 'Turut membantu: Privasimu Nexus. Antrean kerja, dasbor kepatuhan, dan asisten AI Priva.',
      layar: 'TURUT MEMBANTU — logo Privasimu Nexus; Antrean Kerja, Dasbor Kepatuhan, Asisten AI (Priva), Log Audit.',
      sfx: [['w:Privasimu', 'shimmer', 0.35]],
      vis: K({
        baris: [['#', 'TURUT MEMBANTU', 'w:Turut'], ['logo', '', 'w:Privasimu+0.1'], ['Antrean Kerja', 'Privasimu Nexus', 'w:Antrean'], ['Dasbor Kepatuhan', 'Privasimu Nexus', 'w:dasbor'],
          ['Asisten AI', 'Priva', 'w:asisten+0.2'], ['Log Audit', 'Privasimu Nexus', 'end-0.2']],
      }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.3,
      vo: 'Sekuelnya lebih ringan. Cek kesiapanmu gratis, di privasimu dot com.',
      layar: 'Kartu penutup di atas hitam: logo, "Sekuelnya lebih ringan.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.35]],
      vis: K({ cta: { tag: 'Sekuelnya|*lebih ringan*.', at: 0.2, btnAt: 'w:Cek', tirai: false } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
