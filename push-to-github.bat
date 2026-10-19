@echo off
set /p REPO_URL="Enter your GitHub Repository URL (e.g., https://github.com/your-username/your-repo.git): "
if "%REPO_URL%"=="" (
    echo No URL entered. Exiting.
    pause
    exit /b
)

git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main
echo Pushing to GitHub...
git push -u origin main

echo.
echo Done! Your code has been pushed to GitHub.
pause
