@echo off
echo =========================================
echo Starting FileFlow Development Environment
echo =========================================

echo.
echo [1/2] Starting Backend (Node.js/Express)...
cd fileflow-backend
start /B cmd /c "npm run dev"
cd ..

echo.
echo Waiting 5 seconds to ensure backend is fully initialized...
timeout /t 5 /nobreak >nul

echo.
echo [2/2] Starting Frontend (Vite/React)...
echo Backend and Frontend logs will now appear together in this window.
echo Press Ctrl+C to stop both servers.
echo.

cd fileflow-frontend
npm run dev
