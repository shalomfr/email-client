@echo off
echo ===============================================
echo   Email Backend Server - Real Email Connection
echo ===============================================
echo.

cd backend

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [INFO] Installing backend dependencies...
    npm install
    echo.
)

echo [INFO] Starting backend server on port 3001...
echo.
echo ===============================================
echo   Backend API: http://localhost:3001
echo   Ready for real email connections!
echo ===============================================
echo.

npm start