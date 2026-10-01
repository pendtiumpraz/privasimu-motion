// Kurasi screenshot ASLI aplikasi (dataroom/ + frontend/tmp/audit4/) menjadi aset video di assets/app/.
// File sumber tidak diubah: hanya dibaca, dipotong (crop) dan area sensitif (nama user, kunci API) diburamkan pada SALINAN.
// Pakai: node lib/app-shots.js [nama ...]   (tanpa nama = semua aset; dengan nama = hanya itu, manifest lain dipertahankan)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const DR = path.join(ROOT, 'dataroom', '03-tenant');
const A4 = path.join(ROOT, 'frontend', 'tmp', 'audit4');
const OUT = path.join(__dirname, '..', 'assets', 'app');
const SIDEBAR_USER = [0, 470, 262, 140]; // blok nama user di bawah sidebar (viewport 1264)
const ORG = [330, 36, 300, 24];          // baris nama organisasi tenant di bawah judul halaman (viewport 1264, belum digulir)

// crop: [x, y, w, h] | null (utuh); blur: daftar [x, y, w, h] relatif ke gambar SUMBER
const SHOTS = [
  { name: 'dashboard', src: `${DR}/dashboard/01-overview.png`, crop: [0, 0, 1264, 790], blur: [SIDEBAR_USER, ORG], desc: 'Dashboard: sambutan, skor GAP 81%, DSR pending, breach aktif, ringkasan modul (tampilan penuh dengan sidebar)' },
  { name: 'dashboard-postur', src: `${DR}/dashboard/01-overview.png`, crop: [262, 770, 1002, 480], desc: 'Postur Kepatuhan: tren bulanan per modul + Compliance Score 81% (lingkaran)' },
  // angka total di donat "Distribusi Risiko RoPA" tampil rusak ("09192") → diburamkan
  { name: 'dashboard-risiko', src: `${DR}/dashboard/01-overview.png`, crop: [262, 1262, 1002, 478], blur: [[672, 1508, 112, 52]], desc: 'Risk Analytics: DPIA Risk Heatmap 5x5 + distribusi risiko RoPA (angka total diburamkan) + Top Risks' },
  { name: 'dashboard-sla', src: `${DR}/dashboard/01-overview.png`, crop: [262, 1750, 1002, 380], desc: 'Operasional/SLA: waktu respon DSR, timeline breach terbaru, consent adoption' },
  { name: 'breach-detail', src: `${DR}/breach/03-detail.png`, crop: [0, 0, 1264, 790], blur: [SIDEBAR_USER, ORG], desc: 'Detail insiden BRC: label HIGH/Wajib Notifikasi, deskripsi, stepper 5 fase (Terdeteksi-Assessment-Containment-Notifikasi-Ditutup)' },
  { name: 'breach-fase', src: `${DR}/breach/03-detail.png`, crop: [262, 470, 1002, 840], desc: 'Fase 1 Deteksi & Eskalasi: daftar tugas tercentang, keterkaitan RoPA, form severity & jumlah terdampak' },
  { name: 'breach-aksi', src: `${DR}/breach/03-detail.png`, crop: [262, 1505, 1002, 150], desc: 'Tombol aksi insiden: Template Pemberitahuan, Timeline, RACI Matrix, War Room, PICAPA, SIEM/SOAR, Unduh PDF' },
  { name: 'breach-ai', src: `${DR}/breach/03-detail.png`, crop: [262, 1760, 1002, 200], desc: 'AI Incident Response Advisor + tombol Generate AI Incident Response' },
  { name: 'ropa-baru', src: `${DR}/ropa/04-wizard-step1.png`, blur: [[0, 500, 262, 69], [215, 238, 330, 30]], desc: 'Modal Buat RoPA Baru (awal wizard)' },
  { name: 'ropa-data-spesifik', src: `${DR}/ropa/09-wizard-section4-pengumpulan.png`, crop: [262, 60, 1002, 940], desc: 'Wizard RoPA bagian Pengumpulan Data: sumber data, jumlah subjek, daftar Data Pribadi Spesifik (kesehatan, biometrik, anak, keuangan, dll.)' },
  { name: 'ropa-tersimpan', src: `${DR}/ropa/14-after-save.png`, blur: [[0, 500, 262, 69], ORG], desc: 'RoPA tersimpan (notifikasi berhasil + daftar)' },
  { name: 'dpia-list', src: `${DR}/dpia/02-list.png`, crop: [0, 0, 1264, 790], blur: [SIDEBAR_USER, ORG], desc: 'Daftar DPIA' },
  { name: 'dpia-risiko', src: `${DR}/dpia/06-wizard-step3-risiko.png`, crop: [0, 0, 1264, 790], blur: [SIDEBAR_USER, ORG], desc: 'Wizard DPIA langkah Potensi Risiko (kategori risiko, pertanyaan, progres)' },
  { name: 'dsr-form', src: `${DR}/dsr/02-create-modal.png`, crop: [0, 0, 1264, 790], blur: [SIDEBAR_USER, [262, 515, 1002, 275], [330, 34, 300, 9], [330, 43, 36, 17]], desc: 'Modal Buat DSR Baru: aplikasi, nama & email pemohon, tipe permintaan' },
  { name: 'dsr-detail', src: `${DR}/dsr/05-detail.png`, crop: [262, 0, 1002, 250], blur: [ORG], desc: 'Header detail DSR-2026-017: tipe Akses Data, status pending review, pil tenggat "7h tersisa", tab Overview/Scope/SQL Pack/Executions/Certificates' },
  { name: 'consent-detail', src: `${DR}/consent/02-detail.png`, crop: [0, 0, 1625, 1015], blur: [[0, 470, 330, 90], [300, 525, 1010, 180], ORG], desc: 'Consent point: ringkasan, integrasi (Consent Form Embed, Preference Center, API Server, Real-time Webhook, Embed & RoPA)' },
  { name: 'ai-agent-chat', src: `${DR}/ai-agent/03-chat-response.png`, blur: [[0, 500, 262, 69], ORG], desc: 'AI Agent PRIVASIMU menjawab (rekomendasi RoPA/DPIA)' },
  { name: 'gap-hasil', src: `${DR}/gap-assessment/02-hasil.png`, crop: [262, 113, 1002, 690], blur: [[330, 149, 300, 24]], desc: 'Hasil GAP Assessment: compliance score 81%, framework UU No. 27/2022, statistik per area' },
  { name: 'gap-rekomendasi', src: `${DR}/gap-assessment/02-hasil.png`, crop: [262, 1250, 1002, 900], desc: 'GAP Assessment: rekomendasi perbaikan per pasal (CRITICAL/HIGH/MEDIUM) + AI Remediation Plan' },
  // kartu "Terakhir disimpan" memuat ID soal & nama file dokumen → bagian bawahnya diburamkan
  { name: 'gap-ringkasan', src: `${DR}/gap-assessment/01-overview.png`, crop: [262, 170, 1002, 660], blur: [[888, 508, 326, 238]], desc: 'GAP Assessment: KPI (4 asesmen, skor tertinggi 81%, rata-rata 73%) + grafik skor per versi + kartu lanjutkan assessment' },
  { name: 'gap-mulai', src: `${DR}/gap-assessment/01-overview.png`, crop: [262, 832, 1002, 150], desc: 'Tab kerangka (GDPR / UU PDP / PDPA) + toolbar dengan tombol "Mulai Assessment" (untuk hook)' },
  { name: 'postur-privasi', src: `${A4}/security.png`, crop: [345, 62, 1000, 355], desc: 'Privacy Posture Score 56 "Cukup" + 3-Layer Breakdown (Data 49, Process 80, Response 38), UI terbaru' },
  { name: 'children-pro', blur: [[300, 22, 200, 26]], src: `${A4}/consent__guardian.png`, desc: 'Children Pro (persetujuan wali anak): judul, tab Kewenangan Wali / Menunggu / Peralihan (tampilan terbaru)' },
  { name: 'inclusive-privacy', blur: [[300, 22, 200, 26]], src: `${A4}/consent__accessibility.png`, desc: 'Inclusive Privacy (persetujuan aksesibel penyandang disabilitas): judul & tab (tampilan terbaru)' },
  { name: 'dpo-academy', blur: [[300, 22, 200, 26], [998, 167, 133, 153]], src: `${A4}/learn__dpo-academy.png`, desc: 'DPO Academy: kartu kursus Kepatuhan UU PDP, Manajemen Risiko, Audit Kepatuhan, Tata Kelola (tampilan terbaru)' },
  { name: 'ai-agent-home', blur: [[300, 22, 200, 26]], src: `${A4}/ai-agent.png`, desc: 'AI Agent: sapaan "apa yang ingin Anda ketahui?", chip modul & saran pertanyaan (tampilan terbaru)' },
  { name: 'policy-review', blur: [[300, 22, 200, 26]], src: `${A4}/policy-review.png`, desc: 'Telaah Kebijakan: ringkasan kesesuaian & daftar dokumen (tampilan terbaru)' },
  { name: 'holding-header', blur: [[300, 22, 200, 26]], src: `${A4}/holding-dashboard.png`, crop: [200, 0, 1240, 200], desc: 'Holding Group Dashboard: judul & tab (tampilan terbaru, tanpa data grup)' },
  { name: 'fire-drill-header', blur: [[300, 22, 200, 26]], src: `${A4}/simulation.png`, crop: [200, 0, 1240, 260], desc: 'Fire Drill: banner Simulasi Insiden Data Breach (tampilan terbaru)' },
  { name: 'ropa-list-baru', blur: [[300, 22, 200, 26]], src: `${A4}/ropa.png`, desc: 'Register RoPA (tampilan terbaru)' },
  { name: 'dpia-list-baru', blur: [[300, 22, 200, 26]], src: `${A4}/dpia.png`, desc: 'Daftar DPIA (tampilan terbaru)' },
  { name: 'breach-list-baru', blur: [[300, 22, 200, 26]], src: `${A4}/breach.png`, desc: 'Manajemen Insiden Data (tampilan terbaru)' },
];

fs.mkdirSync(OUT, { recursive: true });
const PILIH = process.argv.slice(2), MANIFEST = path.join(OUT, 'manifest.json');
const manifest = PILIH.length && fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};
for (const s of SHOTS.filter((x) => !PILIH.length || PILIH.includes(x.name))) {
  const out = path.join(OUT, s.name + '.png');
  const parts = [];
  let cur = '[0:v]';
  (s.blur || []).forEach((b, i) => {
    const [x, y, w, h] = b;
    parts.push(`${cur}split[m${i}][c${i}];[c${i}]crop=${w}:${h}:${x}:${y},gblur=sigma=14:steps=3[b${i}];[m${i}][b${i}]overlay=${x}:${y}:format=rgb[o${i}]`); // format=rgb: tanpa subsampling warna YUV
    cur = `[o${i}]`;
  });
  const crop = s.crop ? `crop=${s.crop[2]}:${s.crop[3]}:${s.crop[0]}:${s.crop[1]}` : 'null';
  parts.push(`${cur}${crop}[out]`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', s.src, '-filter_complex', parts.join(';'), '-map', '[out]', out]);
  const dim = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', out], { encoding: 'utf8' }).trim().replace(',', 'x');
  manifest[s.name] = { file: `assets/app/${s.name}.png`, ukuran: dim, isi: s.desc, sumber: path.relative(ROOT, s.src).replace(/\\/g, '/') };
  console.log('ok', s.name.padEnd(20), dim);
}
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`\n${Object.keys(manifest).length} aset -> ${OUT}`);
