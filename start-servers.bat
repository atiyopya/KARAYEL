@echo off
title Kareyel Servers

echo ==============================================
echo KAREYEL YAZILIM SUNUCULARI BASLATILIYOR
echo ==============================================

echo Backend sunucusu baslatiliyor (Port 5000)...
start "Kareyel Backend" cmd /c "cd backend && set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kareyel?schema=public && set JWT_SECRET=kareyel-secret-key-2026 && node src/server.js"

echo Frontend sunucusu baslatiliyor (Port 5173)...
start "Kareyel Frontend" cmd /c "cd frontend && npm run dev -- --host --port 5173"

echo Her iki sunucu da baslatildi! Pencereler arkada acik kalacaktir.
echo Siteye ulasmak icin tarayicinizdan asagidaki adrese gidin:
echo http://localhost:5173/

pause
