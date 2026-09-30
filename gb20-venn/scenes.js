// GB20 — DIAGRAM VENN "Irisan": tiga lingkaran tembus pandang (Legal · IT · Bisnis) saling bertumpuk; irisan tengah = DPO.
// Tiap lingkaran menarik ke arahnya sendiri → irisan menyempit dan tugas menumpuk; di Nexus ketiganya berpusat sama:
// irisan jadi seluruh lingkaran = satu ruang kerja (antrean kerja + asisten AI Priva, tangkapan asli); CTA.
// Hook (relate): "Legal. IT. Bisnis. Yang di tengah itu kamu, DPO."
// Komposisi: 70% edukasi · 30% meme. Satu gaya: lingkaran mix-blend + label di irisan.
(function (root) {
  const CONFIG = {
    title: 'GB20 · Irisan (diagram Venn)',
    naskah: 'GB20',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    maxPause: 0.4,
    beat: 60 / 100 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 100, mode: 'major', root: 55, lead: 'keys', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.72 },
    meta: {
      judul: 'Irisan',
      gaya: 'Diagram Venn',
      tampilan: 'kertas putih hangat; tiga lingkaran besar tembus pandang (biru Legal, hijau IT, jingga Bisnis) dengan mix-blend multiply; label di tiap irisan; lingkaran saling menarik lalu berpusat sama; panel antrean kerja + kartu AI Agent asli',
      jenisHook: 'Relate',
      hook: '"Legal. IT. Bisnis. Yang di tengah itu kamu, DPO."',
      komposisi: '70% edukasi · 30% meme',
      rekam: ['ai-agent-home'],
      fakta: [
        'Dukungan PPDP (fakta_produk.json): antrean pekerjaan yang menunggu tindakan; dasbor kepatuhan lintas modul; asisten AI Priva menjawab berdasarkan knowledge base platform; log audit aktor manusia & AI.',
        'Kartu AI Agent = tangkapan asli assets/app/ai-agent-home.png (pintasan modul & contoh prompt; header organisasi dipotong).',
        'Isi antrean kerja (3 tugas) = ilustrasi (ditandai *).',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const Vn = (o) => ({ type: 'vn', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5.5, voDelay: 0.5, mus: 'hook',
      vo: 'Legal. IT. Bisnis. Yang di tengah itu… kamu, DPO.',
      layar: 'Tiga lingkaran masuk dari tiga sisi saat disebut (Legal biru, IT hijau, Bisnis jingga) dan bertumpuk; irisan tengah menyala dengan label "KAMU · DPO".',
      sfx: [['w:Legal', 'pop', 0.3], ['w:IT', 'pop', 0.3], ['w:Bisnis', 'pop', 0.3], ['w:kamu', 'ding', 0.4]],
      vis: Vn({ masuk: ['w:Legal', 'w:IT', 'w:Bisnis'], tengah: 'w:kamu' }),
    },
    {
      id: 's2', min: 6, voDelay: 0.3, mus: 'tense',
      vo: 'Tiap lingkaran menarik ke arahnya sendiri: DPIA sistem baru, akses data pelanggan, kontrak pihak ketiga. Irisannya makin sempit, tugasnya makin menumpuk.',
      layar: 'Label tugas muncul di irisan berpasangan (Legal∩IT: DPIA sistem baru; IT∩Bisnis: akses data pelanggan; Legal∩Bisnis: kontrak pihak ketiga); lingkaran saling menjauh, irisan tengah menyempit; label DPO terjepit; hitungan tugas naik.',
      sfx: [['w:DPIA', 'tick', 0.3], ['w:akses', 'tick', 0.3], ['w:kontrak', 'tick', 0.3], ['w:sempit', 'whoosh', 0.35], ['w:menumpuk', 'hit', 0.35]],
      vis: Vn({ tugas: ['w:DPIA', 'w:akses', 'w:kontrak'], tarik: 'w:Irisannya', tumpuk: 'w:menumpuk' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Di Privasimu Nexus, ketiganya berpusat sama. Irisan itu jadi satu ruang kerja: antrean pekerjaan, dasbor lintas modul, asisten AI Priva.',
      layar: 'Tiga lingkaran meluncur ke satu pusat (irisan = seluruh lingkaran); di dalamnya panel "Antrean kerja" (3 tugas*) dan kartu AI Agent asli (pintasan modul + contoh prompt).',
      sfx: [['w:berpusat', 'whoosh', 0.45], ['w:sama', 'ding', 0.4], ['w:antrean', 'pop', 0.3], ['w:asisten', 'pop', 0.3]],
      vis: Vn({ pusat: 'w:berpusat', antrean: 'w:antrean', layar: { nama: 'ai-agent-home', potong: [560, 140, 580, 480], at: 'w:asisten-0.2', judul: 'AI Agent · Priva' } }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Yang di tengah, tidak sendirian. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Yang di tengah tidak sendirian.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: Vn({ cta: { tag: 'Yang di tengah|*tidak sendirian*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
