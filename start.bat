@echo off
echo ========================================
echo AI Document Authoring Platform
echo ========================================
echo.

echo Starting Backend Server...
cd backend
start cmd /k "venv\Scripts\activate && uvicorn main:app --reload --port 8000"
cd ..

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
cd frontend
start cmd /k "npm start"
cd ..

echo.
echo ========================================
echo Servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo ========================================
echo.
echo Press any key to exit...
pause > nul
