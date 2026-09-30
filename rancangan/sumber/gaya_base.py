# Katalog gaya motion graphic: struktur baris + 7 keluarga gaya.
# Data tiap keluarga ada di gaya_ty.py (tipografi), gaya_gb.py (grafis & bentuk), gaya_lain.py (craft, layar, sinematik,
# parodi format, struktur edit). Frasa viral untuk hook ada di data_frasa.py. Dirangkum data_gaya.py → buat_excel.py.
#
# Aturan isi (sama dengan rancangan lain):
# - Fitur hanya yang ada di backend/resources/konten/fakta_produk.json atau terlihat di screenshot asli.
# - Angka di hook yang bukan fakta produk/hukum = ILUSTRASI → tulis di kolom catatan, beri label di layar.
# - Istilah "pihak ketiga", bukan "vendor". Tanpa wajah/suara/nama tokoh nyata, tanpa merek pihak lain.

KELUARGA = [
    # (kode, nama, gelombang produksi, ciri)
    ('TY', 'Tipografi', 1, 'Huruf jadi bintang utama; hampir tanpa gambar.'),
    ('GB', 'Grafis & bentuk', 2, 'Bentuk, garis, dan diagram yang bercerita.'),
    ('CR', 'Craft (buatan tangan)', 3, 'Tekstur kertas, tinta, dan benda nyata.'),
    ('UI', 'Layar & UI', 4, 'Cerita terjadi di layar: aplikasi, chat, desktop.'),
    ('SN', 'Sinematik & retro', 5, 'Suasana film, cahaya, dan nostalgia.'),
    ('PF', 'Parodi format', 6, 'Format sehari-hari yang dipelesetkan.'),
    ('SE', 'Struktur edit', 7, 'Cara menyusun cerita; bisa digabung dengan gaya mana pun.'),
]
NAMA_KELUARGA = {k: n for k, n, _, _ in KELUARGA}
GELOMBANG = {k: g for k, _, g, _ in KELUARGA}

HOOK = ('Reverse psychology', 'Relate', 'Anomali', 'Logika dipatahkan')
STATUS = ('Sudah', 'Bisa', 'Berat', 'Tidak cocok')
# Gaya yang diminta dikerjakan paling dulu (gelombang 0)
DULUAN = {'GB05'}


def R(kode, gaya, tampilan, teknik, status, upaya, wow, brand, judul, jenis_hook, hook, alur, modul, aset, durasi, sumber, catatan=''):
    """Satu baris katalog. status: 'Sudah (KODE)' | 'Bisa' | 'Berat' | 'Tidak cocok'."""
    dipakai = ''
    if status.startswith('Sudah'):
        assert '(' in status, (kode, 'status Sudah wajib menyebut kode video')
        dipakai = status[status.index('(') + 1:status.rindex(')')]
        status = 'Sudah'
    assert status in STATUS, (kode, status)
    assert jenis_hook in HOOK or jenis_hook == '—', (kode, jenis_hook)
    assert 1 <= upaya <= 5 and 1 <= wow <= 10 and 1 <= brand <= 10, (kode, upaya, wow, brand)
    assert kode[:2] in NAMA_KELUARGA, kode
    return dict(kode=kode, kel=kode[:2], keluarga=NAMA_KELUARGA[kode[:2]], gaya=gaya, tampilan=tampilan, teknik=teknik, status=status,
                dipakai=dipakai, upaya=upaya, wow=wow, brand=brand, judul=judul, jenis_hook=jenis_hook, hook=hook, alur=alur,
                modul=modul, aset=aset, durasi=durasi, sumber=sumber, catatan=catatan,
                gelombang=0 if kode in DULUAN else GELOMBANG[kode[:2]])
