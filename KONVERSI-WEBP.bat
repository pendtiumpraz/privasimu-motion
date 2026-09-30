@echo off
setlocal EnableExtensions
chcp 65001 >nul
title Konversi MP4 ke WebP - Privasimu
cd /d "%~dp0"

rem ================================================================
rem  KONVERSI-WEBP.bat - ubah hasil render MP4 menjadi WebP animasi
rem
rem  Klik dua kali             : semua out\*\*.mp4 yang BELUM punya .webp dikonversi;
rem                              yang sudah ada .webp-nya dilewati (aman dijalankan berulang).
rem                              Kalau MP4-nya dirender ulang (lebih baru), .webp dibuat lagi.
rem  KONVERSI-WEBP.bat gb05-satu-garis   : folder tertentu saja
rem  KONVERSI-WEBP.bat --paksa           : buat ulang semua .webp
rem  Mutu (opsional): --sisi=720 --fps=15 --q=70 --paralel=2 --fmt=9x16
rem  Hasil: out\folder\folder-16x9.webp (berdampingan dengan MP4). MP4 asli TIDAK dihapus/diubah.
rem  Catatan: out\log\webp-*.txt
rem ================================================================

where node >nul 2>&1 || (echo [GAGAL] Node.js belum terpasang. & goto :akhir)
where ffmpeg >nul 2>&1 || (echo [GAGAL] FFmpeg belum ada di PATH. & goto :akhir)

node lib\webp.js %*

:akhir
echo.
pause
endlocal
