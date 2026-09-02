@echo off
echo =========================================
echo Starting FileFlow Development Environment
echo =========================================

echo.
echo [1/2] Cleaning up old processes and starting Backend...
:: Kills any ghost node processes that might be hanging on the port from a previous bad crash
FOR /F "tokens=5" %%a IN ('netstat -aon ^| findstr :5000') DO taskkill /F /PID %%a >nul 2>&1

cd fileflow-backend
start /B cmd /c "npx nodemon --watch src src/server.js"
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
