// GB45 — LAPISAN TERURAI (exploded view) "Tiga Lapis": ubin skor postur 56 "Cukup" terangkat dan terurai jadi tiga
// panel 3D melayang (Data 49 · Proses 80 · Respons 38) dengan label & bobot; lapis terlemah berdenyut merah; panel
// menyatu kembali menjadi kartu Privacy Posture asli; CTA.
// Hook (anomali): "Skor ini ternyata punya tiga lapis."
// Komposisi: 80% edukasi · 20% meme. Satu gaya: panel CSS 3D bertumpuk, jarak antarlapis dianimasikan, label per lapis.
(function (root) {
  const CONFIG = {
    title: 'GB45 · Tiga Lapis (lapisan terurai)',
    naskah: 'GB45',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 100 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 100, mode: 'major', root: 55, lead: 'keys', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.72 },
    meta: {
      judul: 'Tiga Lapis',
      gaya: 'Lapisan terurai (exploded view)',
      tampilan: 'latar biru keabu-abuan; ubin skor besar "56 · Cukup" dalam pandangan isometrik; ubin terangkat dan terurai jadi tiga panel kaca bertumpuk (biru Data, ungu Proses, jingga Respons) dengan jarak antarlapis yang membesar; label & bobot di samping dengan garis penunjuk; lapis terlemah berdenyut merah; panel menyatu kembali jadi kartu asli',
      jenisHook: 'Anomali',
      hook: '"Skor ini ternyata punya tiga lapis."',
      komposisi: '80% edukasi · 20% meme',
      rekam: ['postur-privasi'],
      fakta: [
        'Privacy Posture Score = tangkapan asli assets/app/postur-privasi.png (tenant uji): skor agregat 56 "Cukup" dari 3 layer — Data Layer 49 (bobot 50%, DSPM: discovery, klasifikasi, proteksi), Process Layer 80 (30%, RoPA, DPIA, RTP, Pihak Ketiga, CBDT), Response Layer 38 (20%, Breach, DSR, Maturity).',
        'Crop tangkapan dimulai di bawah baris deskripsi (menghindari istilah lama untuk pihak ketiga di UI & nama organisasi).',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const X = (o) => ({ type: 'ex', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.5, mus: 'hook',
      vo: 'Skor ini… ternyata punya tiga lapis.',
      layar: 'Ubin isometrik "56 · Cukup" muncul; pada "tiga" ubin terangkat dan terurai jadi tiga panel yang saling menjauh.',
      sfx: [[0.1, 'whoosh', 0.3], ['w:tiga', 'whoosh', 0.45], ['w:lapis', 'ding', 0.35]],
      vis: X({ muncul: 0.1, urai: 'w:tiga-0.1' }),
    },
    {
      id: 's2', min: 5.5, voDelay: 0.3, mus: 'tense',
      vo: 'Lapis data: empat puluh sembilan. Lapis proses: delapan puluh. Lapis respons: tiga puluh delapan, yang terlemah.',
      layar: 'Tiap panel menyala saat disebut dengan label (Data 49 · 50% · discovery, klasifikasi, proteksi; Proses 80 · 30%; Respons 38 · 20% · Breach, DSR, Maturity); panel Respons berdenyut merah "TERLEMAH".',
      sfx: [['w:data', 'tick', 0.3], ['w:proses', 'tick', 0.3], ['w:respons', 'tick', 0.3], ['w:terlemah', 'hit', 0.4]],
      vis: X({ sorot: ['w:data', 'w:proses', 'w:respons'], lemah: 'w:terlemah' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Privasimu Nexus menghitungnya dari data nyata tiap modul, bobot lima puluh, tiga puluh, dua puluh. Perbaiki lapis terlemah, skornya ikut naik.',
      layar: 'Panel menyatu kembali; kartu asli Privacy Posture Score (gauge 56 + 3-Layer Breakdown) muncul; lencana "prioritas: Response Layer".',
      sfx: [['w:menghitungnya', 'whoosh', 0.4], ['w:bobot', 'pop', 0.3], ['w:Perbaiki', 'ding', 0.35]],
      vis: X({ satu: 'w:menghitungnya-0.2', layar: { nama: 'postur-privasi', potong: [20, 125, 970, 225], at: 'w:bobot-0.2', judul: 'Privacy Posture Score' }, prioritas: 'w:Perbaiki' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Satu skor, tiga lapis. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Satu skor, tiga lapis.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: X({ cta: { tag: 'Satu skor,|*tiga lapis*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
