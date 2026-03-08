@echo off
:: ============ Tripzo Project Starter ============

:: Step 1: Navigate to frontend and start HTTP server
cd /d "C:\Users\aksl8\OneDrive\Desktop\Tripzo\FrontendTripzo"
start "Frontend" cmd /k "npx http-server -p 5501"

:: Step 2: Wait 3 seconds to ensure server is running
timeout /t 3 >nul

:: Step 3: Open Chrome automatically with correct URL
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "http://127.0.0.1:5501/index.html"

:: Step 4: Navigate to backend and start it
cd /d "C:\Users\aksl8\OneDrive\Desktop\Tripzo\BackendTripzo"
start "Backend" cmd /k "npm run dev"

:: Done
exit
