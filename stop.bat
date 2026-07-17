@echo off
title NetPulse - Stopping...

echo Stopping NetPulse servers...

:: Kill by window title
taskkill /FI "WINDOWTITLE eq NetPulse Backend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq NetPulse Frontend*" /F >nul 2>&1

:: Kill any leftover python processes still holding port 8000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000 " 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo Done. All NetPulse servers stopped.
timeout /t 3 /nobreak >nul
