# Merangkum katalog gaya dari tiap keluarga + memeriksa konsistensinya. Dipakai buat_excel.py.
import os
import re

from gaya_base import KELUARGA, HOOK, STATUS, NAMA_KELUARGA  # noqa: F401
import gaya_ty
import gaya_gb
import gaya_lain

_urut = {k: i for i, (k, _, _, _) in enumerate(KELUARGA)}
G = sorted(gaya_ty.ROWS + gaya_gb.ROWS + gaya_lain.ROWS, key=lambda r: (_urut[r['kel']], int(r['kode'][2:])))

# kode unik
_kode = [r['kode'] for r in G]
_dobel = sorted({k for k in _kode if _kode.count(k) > 1})
assert not _dobel, f'kode gaya dobel: {_dobel}'

# aset layar harus benar-benar ada di motion/assets/app
_APP = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'assets', 'app'))
_ada = {os.path.splitext(f)[0] for f in os.listdir(_APP)} if os.path.isdir(_APP) else None
if _ada is not None:
    for r in G:
        for a in re.split(r',\s*', r['aset']):
            assert a in ('—', '', 'semua aset') or a in _ada, f"{r['kode']}: aset '{a}' tidak ada di assets/app"

# istilah terlarang di teks yang tampil
for r in G:
    for k in ('gaya', 'tampilan', 'judul', 'hook', 'alur', 'modul'):
        assert 'vendor' not in r[k].lower(), f"{r['kode']}: pakai 'pihak ketiga', bukan 'vendor'"


# ---------------------------------------------------------------- komposisi edukasi vs meme (persen meme; edukasi = 100 - meme)
# Bawaan diturunkan dari kecocokan merek (makin serius makin sedikit meme); parodi format +10. Nilai khusus di KOMPOSISI.
KOMPOSISI = {
    'TY01': 10, 'TY02': 20, 'TY03': 10, 'TY04': 70, 'GB01': 10, 'GB02': 10, 'GB05': 10,
    'CR01': 70, 'CR02': 30, 'UI01': 15, 'UI02': 50, 'UI03': 70, 'UI05': 70, 'SN01': 20, 'SN02': 60,
    'PF01': 70, 'PF02': 60, 'PF03': 100, 'PF04': 10, 'PF05': 70, 'PF08': 60, 'PF13': 90, 'PF24': 90, 'PF25': 90,
    'SE12': 80, 'SE13': 20, 'SE20': 0, 'SE23': 40, 'SE24': 80, 'TY33': 10, 'TY36': 30, 'TY43': 70, 'TY45': 30,
}
_DARI_MEREK = {10: 10, 9: 20, 8: 30, 7: 50, 6: 70, 5: 80}
for r in G:
    if r['judul'] == '—':
        r['meme'] = None
        continue
    m = KOMPOSISI.get(r['kode'])
    if m is None:
        m = _DARI_MEREK.get(r['brand'], 40)
        if r['kel'] == 'PF':
            m = min(90, m + 10)
    r['meme'] = m
