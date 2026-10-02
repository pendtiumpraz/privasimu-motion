@echo off
rem ================================================================
rem  RENDER-LANDING.bat - render ulang video landing page Privasimu
rem  (LP01 stomp, LP02 Satu Kanvas, LP03 Memo Direksi) dengan
rem  voice-over edge-tts + musik + SFX, lalu buat WebP untuk website.
rem
rem  Butuh: Node.js 20+, FFmpeg di PATH, Python 3 + pip install -r requirements.txt
rem  Hasil : out\lpXX-...\lpXX-...-16x9.mp4 / -9x16.mp4 / .webp
rem  Untuk website: salin poster/cuplikan/film WebP ke
rem  priva-front\public\landing\video\^<nama^>\ (lihat README bagian Landing).
rem ================================================================
cd /d "%~dp0"
set "VIDEO=lp02-satu-kanvas lp03-memo-direksi"
if exist lp01-stomp-layar set "VIDEO=lp01-stomp-layar %VIDEO%"
call RENDER.bat --paksa %VIDEO% %*
call KONVERSI-WEBP.bat --paksa %VIDEO%
