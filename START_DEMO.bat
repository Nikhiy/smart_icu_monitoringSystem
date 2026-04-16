@echo off
REM Smart ICU Monitoring System - Demo Launcher
REM Starts everything with one click!

cls
color 0A
echo.
echo ===============================================================================
echo.
echo   ^>^>^>   SMART ICU MONITORING SYSTEM - DEMO LAUNCHER   ^<^<^<
echo.
echo ===============================================================================
echo.
echo This script will start everything for your presentation:
echo   1. Backend server (Flask)
echo   2. Frontend dashboard (React/Vite)
echo   3. Patient data simulator
echo.
echo You'll need 3 separate windows/terminals.
echo.
pause

REM Check if we're in the right directory
if not exist "backend\app.py" (
    echo.
    echo ERROR: backend\app.py not found!
    echo Please run this from: d:\smart_icu_monitoringSystem
    echo.
    pause
    exit /b 1
)

echo.
echo Starting components...
echo.

REM Start backend in new window
echo [1/3] Starting Backend Server...
start "Smart ICU - Backend" cmd /k "cd backend & python app.py"
timeout /t 2 /nobreak

REM Start frontend in new window
echo [2/3] Starting Frontend Dashboard...
start "Smart ICU - Frontend" cmd /k "cd frontend-vite & npm run dev"
timeout /t 3 /nobreak

REM Start simulator in new window
echo [3/3] Starting Data Simulator...
start "Smart ICU - Simulator" cmd /k "python realistic_simulator.py"

echo.
echo ===============================================================================
echo.
echo   ALL SYSTEMS STARTING!
echo.
echo   ^ Backend:   http://localhost:5000 (Terminal window)
echo   ^ Frontend:  http://localhost:5173 (opens automatically)
echo   ^ Simulator: Select scenario when prompted (Terminal window)
echo.
echo   Next steps:
echo   1. Wait 5 seconds for all windows to open
echo   2. Open browser to: http://localhost:5173
echo   3. In Simulator window: Choose a scenario (1-5)
echo   4. Watch the dashboard update in real-time!
echo.
echo ===============================================================================
echo.
pause
