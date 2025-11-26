@echo off
REM AI Document Authoring Platform - Deployment Script for Windows

echo 🚀 Starting deployment process...
echo.

REM Check if git is initialized
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit: AI Document Authoring Platform"
)

REM Check for uncommitted changes
git status --porcelain > nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo 📝 Committing changes...
    git add .
    git commit -m "Update: %date% %time%"
)

echo.
echo ✅ Repository is ready for deployment!
echo.
echo 📋 Next steps:
echo 1. Push to GitHub:
echo    git remote add origin ^<your-repo-url^>
echo    git branch -M main
echo    git push -u origin main
echo.
echo 2. Deploy on Render.com:
echo    - Go to https://render.com
echo    - Create new Web Service for backend
echo    - Create new Static Site for frontend
echo    - Add environment variables
echo.
echo 3. Or use Vercel + Railway:
echo    - Deploy backend on Railway
echo    - Deploy frontend on Vercel
echo.
echo 📖 See DEPLOYMENT_GUIDE.md for detailed instructions
echo.
pause
