@echo off
echo ==============================================================================
echo   Starting JP Agencies Textile Inventory & ML Demand Forecasting System
echo ==============================================================================
echo.

start "JP Agencies - Python ML Service (Port 5001)" cmd /k "cd /d %~dp0ml-service && python app.py"
timeout /t 3 /nobreak >nul

start "JP Agencies - Node.js Backend API (Port 5050)" cmd /k "cd /d %~dp0backend && node server.js"
timeout /t 2 /nobreak >nul

start "JP Agencies - React Frontend (Port 5175)" cmd /k "cd /d %~dp0frontend && npm run dev -- --port 5175"

echo.
echo All services launched!
echo Open your browser at: http://localhost:5175
echo.
pause
