@echo off
title NetPulse - Starting...

echo ========================================
echo    NetPulse - Network Monitoring Dashboard
echo ========================================
echo.

:: Start Backend
echo [1/2] Starting Backend (port 8000)...
start "NetPulse Backend" cmd /k "cd /d "%~dp0backend" && .\venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000"

:: Wait a bit for backend to start
timeout /t 2 /nobreak >nul

:: Start Frontend
echo [2/2] Starting Frontend (port 5173)...
start "NetPulse Frontend" cmd /k "cd /d "%~dp0frontend" && pnpm dev"

:: Wait for frontend to be ready then open browser
echo Waiting for frontend to start...
timeout /t 4 /nobreak >nul
start http://localhost:5173

echo.
echo Both servers are running!
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:5173 (browser opened)
echo.
echo Close this window anytime. Backend and Frontend run in their own windows.
echo To stop: close the "NetPulse Backend" and "NetPulse Frontend" windows.
echo.
pause
