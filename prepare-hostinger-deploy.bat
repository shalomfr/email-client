@echo off
chcp 65001 >nul
color 0A

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║        הכנת האפליקציה לפריסה בהוסטינגר            ║
echo ╚══════════════════════════════════════════════════════╝
echo.

set NODE_PATH=C:\Program Files\nodejs
set PATH=%NODE_PATH%;%PATH%

REM Create deployment folder
if exist hostinger-deploy rmdir /s /q hostinger-deploy
mkdir hostinger-deploy
mkdir hostinger-deploy\frontend
mkdir hostinger-deploy\backend

echo [1/7] בונה את ה-Frontend...
call "%NODE_PATH%\npm.cmd" run build
if %errorlevel% neq 0 (
    echo ❌ שגיאה בבניית Frontend
    pause
    exit /b 1
)
echo ✅ Frontend נבנה בהצלחה

echo.
echo [2/7] מעתיק קבצי Frontend...
xcopy /E /Q dist hostinger-deploy\frontend\ >nul
echo ✅ קבצי Frontend הועתקו

echo.
echo [3/7] מעתיק קבצי Backend...
xcopy /E /Q backend hostinger-deploy\backend\ >nul
echo ✅ קבצי Backend הועתקו

echo.
echo [4/7] יוצר package.json לפרודקשן...
(
echo {
echo   "name": "email-client-backend",
echo   "version": "1.0.0",
echo   "main": "server.js",
echo   "scripts": {
echo     "start": "node server.js"
echo   },
echo   "dependencies": {
echo     "express": "^4.18.2",
echo     "cors": "^2.8.5",
echo     "imap": "^0.8.19",
echo     "mailparser": "^3.6.5",
echo     "nodemailer": "^6.9.7",
echo     "dotenv": "^16.3.1"
echo   },
echo   "engines": {
echo     "node": ">=14.0.0"
echo   }
echo }
) > hostinger-deploy\backend\package.json

echo.
echo [5/7] יוצר קובץ .env...
(
echo PORT=3001
echo NODE_ENV=production
) > hostinger-deploy\backend\.env

echo.
echo [6/7] יוצר קובץ .htaccess...
(
echo ^<IfModule mod_rewrite.c^>
echo   RewriteEngine On
echo   RewriteBase /
echo   
echo   # Redirect API calls to Node.js
echo   RewriteRule ^^api/(.*^)$ http://localhost:3001/api/$1 [P,L]
echo   
echo   # Handle React Router
echo   RewriteCond %%{REQUEST_FILENAME} !-f
echo   RewriteCond %%{REQUEST_FILENAME} !-d
echo   RewriteRule . /index.html [L]
echo ^</IfModule^>
echo.
echo # Enable CORS
echo ^<IfModule mod_headers.c^>
echo   Header set Access-Control-Allow-Origin "*"
echo ^</IfModule^>
) > hostinger-deploy\frontend\.htaccess

echo.
echo [7/7] יוצר הוראות פריסה...
(
echo הוראות פריסה על Hostinger
echo ========================
echo.
echo 1. העלאת Frontend:
echo    - היכנס ל-cPanel של Hostinger
echo    - פתח את File Manager
echo    - העלה את תוכן תיקיית 'frontend' ל-public_html
echo    - כולל את קובץ .htaccess!
echo.
echo 2. העלאת Backend:
echo    - צור תיקייה חדשה מחוץ ל-public_html (למשל: /home/username/email-backend)
echo    - העלה את תוכן תיקיית 'backend' לשם
echo.
echo 3. הגדרת Node.js App:
echo    - ב-cPanel לך ל-"Setup Node.js App"
echo    - צור אפליקציה חדשה:
echo      * Node.js version: 18.x או 20.x
echo      * Application mode: Production
echo      * Application root: /home/username/email-backend
echo      * Application URL: השאר ריק או api.yourdomain.com
echo      * Application startup file: server.js
echo    - לחץ "Create"
echo    - לחץ "Run NPM Install"
echo    - לחץ "Start"
echo.
echo 4. עדכון כתובת API:
echo    - ערוך את הקבצים ב-public_html/assets/*.js
echo    - החלף http://localhost:3001 ב-https://yourdomain.com
echo    - או הגדר subdomain: api.yourdomain.com
echo.
echo 5. הפעלת SSL:
echo    - ב-cPanel לך ל-"SSL/TLS Status"
echo    - הפעל Let's Encrypt SSL לדומיין שלך
echo.
echo בהצלחה!
) > hostinger-deploy\README.txt

REM Create deployment ZIPs
echo.
echo יוצר קבצי ZIP...
powershell -Command "Compress-Archive -Path hostinger-deploy\frontend\* -DestinationPath hostinger-frontend.zip -Force"
powershell -Command "Compress-Archive -Path hostinger-deploy\backend\* -DestinationPath hostinger-backend.zip -Force"
powershell -Command "Compress-Archive -Path hostinger-deploy\* -DestinationPath hostinger-full-deploy.zip -Force"

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║                 ✅ הושלם בהצלחה!                     ║
echo ╚══════════════════════════════════════════════════════╝
echo.
echo 📦 נוצרו 3 קבצים:
echo    1. hostinger-frontend.zip - רק ה-Frontend
echo    2. hostinger-backend.zip - רק ה-Backend
echo    3. hostinger-full-deploy.zip - הכל ביחד
echo.
echo 📝 קרא את hostinger-deploy\README.txt להוראות מפורטות
echo.
echo 🎯 השלבים הבאים:
echo    1. התחבר ל-cPanel של Hostinger
echo    2. העלה את הקבצים לפי ההוראות
echo    3. הגדר Node.js App
echo    4. תהנה מהאפליקציה שלך באינטרנט!
echo.
pause