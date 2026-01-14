@echo off
echo Starting Landing Page Project...
echo.

REM Kill any existing Node processes
taskkill /f /im node.exe >nul 2>&1

REM Navigate to project directory
cd /d "C:\Users\ASUS\Desktop\My-Portfolio\landing-page-project"

REM Start development server on port 3007
echo Starting development server on port 3007...
npm run dev -- --port 3007

pause


