@echo off
chcp 65001 >nul
color 0A
title Email Client - Real Email Mode

echo.
echo ════════════════════════════════════════════════════════════════════
echo                    EMAIL CLIENT - REAL EMAIL MODE
echo                         מערכת דואר אמיתית
echo ════════════════════════════════════════════════════════════════════
echo.

REM Set Node.js path
set NODE_PATH=C:\Program Files\nodejs
set PATH=%NODE_PATH%;%PATH%

REM Check if Node.js exists in the specific location
echo [1/5] בודק התקנת Node.js...
if exist "%NODE_PATH%\node.exe" (
    for /f "tokens=*" %%i in ('"%NODE_PATH%\node.exe" --version') do set NODE_VERSION=%%i
    echo ✅ Node.js %NODE_VERSION% מותקן ב-%NODE_PATH%
) else (
    echo ❌ Node.js לא נמצא ב-%NODE_PATH%
    echo.
    echo אנא התקן Node.js מ: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check if dependencies are installed
echo.
echo [2/5] בודק התקנת חבילות...
if not exist "node_modules" (
    echo 📦 מתקין חבילות Frontend...
    call "%NODE_PATH%\npm.cmd" install
    if %errorlevel% neq 0 (
        echo ❌ שגיאה בהתקנת חבילות Frontend
        pause
        exit /b 1
    )
)

if not exist "backend\node_modules" (
    echo 📦 מתקין חבילות Backend...
    cd backend
    call "%NODE_PATH%\npm.cmd" install
    cd ..
    if %errorlevel% neq 0 (
        echo ❌ שגיאה בהתקנת חבילות Backend
        pause
        exit /b 1
    )
)

echo ✅ כל החבילות מותקנות

REM Kill any existing processes on our ports
echo.
echo [3/5] בודק פורטים...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do (
    echo סוגר תהליך ישן על פורט 3001...
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do (
    echo סוגר תהליך ישן על פורט 5173...
    taskkill /F /PID %%a >nul 2>&1
)

REM Start Backend Server
echo.
echo [4/5] מפעיל שרת Backend...
start "Email Backend Server" cmd /k "cd /d "%CD%\backend" && "%NODE_PATH%\node.exe" server.js"
echo ✅ שרת Backend רץ על פורט 3001

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend Server
echo.
echo [5/5] מפעיל שרת Frontend...
start "Email Frontend Server" cmd /k "cd /d "%CD%" && "%NODE_PATH%\npm.cmd" run dev"
echo ✅ שרת Frontend רץ על פורט 5173

REM Wait for frontend to start
timeout /t 5 /nobreak >nul

REM Open browser
echo.
echo 🌐 פותח דפדפן...
start http://localhost:5173

echo.
echo ════════════════════════════════════════════════════════════════════
echo                        ✅ המערכת פועלת!
echo ════════════════════════════════════════════════════════════════════
echo.
echo 📧 הוראות לחיבור מיילים אמיתיים:
echo.
echo 1. לך להגדרות באפליקציה (אייקון הגלגל שיניים)
echo.
echo 2. הזן את פרטי המייל שלך:
echo    ┌─────────────────────────────────────────────┐
echo    │ Gmail:                                      │
echo    │ • כתובת: your-email@gmail.com              │
echo    │ • סיסמה: App Password (לא הסיסמה הרגילה!) │
echo    │ • IMAP: imap.gmail.com (993)               │
echo    │ • SMTP: smtp.gmail.com (587)               │
echo    └─────────────────────────────────────────────┘
echo.
echo    ┌─────────────────────────────────────────────┐
echo    │ Outlook:                                    │
echo    │ • כתובת: your-email@outlook.com            │
echo    │ • סיסמה: הסיסמה הרגילה שלך                │
echo    │ • IMAP: outlook.office365.com (993)        │
echo    │ • SMTP: smtp.office365.com (587)           │
echo    └─────────────────────────────────────────────┘
echo.
echo    ⚠️  חשוב עבור Gmail:
echo    1. הפעל IMAP בהגדרות Gmail
echo    2. צור App Password ב: https://myaccount.google.com/apppasswords
echo    3. השתמש ב-App Password במקום הסיסמה הרגילה
echo.
echo 3. לחץ "שמור הגדרות"
echo.
echo 4. המיילים האמיתיים שלך יופיעו בדואר נכנס!
echo.
echo ════════════════════════════════════════════════════════════════════
echo.
echo 💡 טיפים:
echo    • המתן מספר שניות לטעינת המיילים
echo    • בדוק ב-Console (F12) אם יש שגיאות
echo    • וודא שהפרטים נכונים במיוחד App Password
echo.
echo 🛑 לעצירת השרתים: סגור את חלונות ה-CMD או לחץ Ctrl+C
echo.
echo 📝 לוגים של השרתים מופיעים בחלונות הנפרדים
echo.
pause