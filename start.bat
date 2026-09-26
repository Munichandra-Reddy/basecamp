@echo off
echo Starting TeamFlow Platform (Backend API + React Frontend)...
echo.

start "TeamFlow Backend" cmd /k "cd backend && npm install && npm run dev"
start "TeamFlow Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo Launching TeamFlow servers...
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
