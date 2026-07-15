@echo off
title NetPulse - Stopping...

echo Stopping NetPulse servers...

taskkill /FI "WINDOWTITLE eq NetPulse Backend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq NetPulse Frontend*" /F >nul 2>&1

echo Done. All NetPulse servers stopped.
timeout /t 3 /nobreak >nul
