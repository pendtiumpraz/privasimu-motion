@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
title Render versi sales - Privasimu
cd /d "%~dp0"

rem ================================================================
rem  RENDER-SALES.bat - versi video per sales (nama + nomor WhatsApp di penutup video)
rem
rem  1. Isi sales\daftar-sales.xlsx: sheet Sales (Nama, No. WhatsApp, Aktif = Ya),
rem     sheet Video (video yang dibuatkan versi sales + format), lalu simpan.
rem  2. Video dasar harus sudah dirender dulu lewat RENDER.bat.
rem  3. Klik dua kali file ini. Hasil: out\folder\folder-9x16-NOMOR.mp4
rem  Opsi:  RENDER-SALES.bat t01-stomp m02-gap   : video tertentu saja
rem         RENDER-SALES.bat --fmt=16x9           : format tertentu saja
rem         RENDER-SALES.bat --paksa              : buat ulang walau sudah ada
rem  Versi yang sudah jadi dan tidak berubah dilewati otomatis. Log: out\log\sales-*.txt
rem  PENTING: jangan mengedit file .bat ini saat sedang berjalan.
rem ================================================================

echo Memeriksa perangkat...
where node >nul 2>&1 || (echo [GAGAL] Node.js belum terpasang. & goto :akhir)
where ffmpeg >nul 2>&1 || (echo [GAGAL] FFmpeg belum ada di PATH. & goto :akhir)
where python >nul 2>&1 || (echo [GAGAL] Python belum terpasang. & goto :akhir)
python -c "import openpyxl" >nul 2>&1 || (echo [GAGAL] Paket openpyxl belum ada. Jalankan: pip install openpyxl & goto :akhir)

if not exist "sales\daftar-sales.xlsx" (
  python lib\buat_template_sales.py
  echo.
  echo File sales\daftar-sales.xlsx baru dibuat. Isi data sales dulu, simpan, lalu jalankan file ini lagi.
  goto :akhir
)

node lib\sales.js %*

:akhir
echo.
pause
endlocal
