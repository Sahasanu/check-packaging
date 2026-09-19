@echo off
echo =========================================================================
echo  Legal Metrology (Packaged Commodities) Compliance Checking System
echo  Department of Consumer Affairs (DoCA) ^| Problem Statement ID: 26034
echo =========================================================================
echo.

echo [1/2] Starting Python FastAPI Backend Server on http://127.0.0.1:8000 ...
start "LMPC Backend API" cmd /k ".\venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Vite Frontend Dashboard on http://localhost:5173 ...
start "LMPC Frontend UI" cmd /k "cd frontend && npm run dev"

echo.
echo All services launched!
echo Open your browser at: http://localhost:5173
echo.
