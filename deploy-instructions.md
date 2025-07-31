# הוראות פריסה על Hostinger

## 1. הכנת Frontend

התיקייה `dist` שנוצרה מכילה את הקבצים הסטטיים של ה-Frontend.

## 2. הכנת Backend

### יצירת package.json לפרודקשן בתיקיית backend:
```json
{
  "name": "email-client-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "imap": "^0.8.19",
    "mailparser": "^3.6.5",
    "nodemailer": "^6.9.7",
    "dotenv": "^16.3.1"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
```

## 3. קובץ .env לפרודקשן

צור קובץ `.env` בתיקיית backend:
```
PORT=3001
NODE_ENV=production
```

## 4. שינוי כתובת API ב-Frontend

עדכן את `src/api/realEmailAPI.js`:
```javascript
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com/api'  // שנה לדומיין שלך
  : 'http://localhost:3001/api';
```

## 5. העלאה ל-Hostinger

### אופציה א: דרך cPanel
1. דחוס את תיקיית `dist` ל-ZIP
2. העלה דרך File Manager של cPanel
3. חלץ לתיקיית public_html

### אופציה ב: דרך FTP
1. התחבר עם FileZilla/WinSCP
2. העלה את תוכן תיקיית `dist` ל-public_html
3. העלה את תיקיית `backend` לתיקייה נפרדת

## 6. הגדרת Node.js ב-Hostinger

### דרך cPanel:
1. היכנס ל-"Setup Node.js App"
2. צור אפליקציה חדשה
3. הגדר:
   - Node.js version: 18.x או 20.x
   - Application mode: Production
   - Application root: /home/username/backend
   - Application URL: api.your-domain.com
   - Application startup file: server.js

### דרך SSH:
```bash
# התחבר ל-SSH
ssh username@your-server.com

# עבור לתיקיית backend
cd ~/backend

# התקן dependencies
npm install --production

# הפעל עם PM2
pm2 start server.js --name email-backend
pm2 save
pm2 startup
```

## 7. הגדרת .htaccess

צור קובץ `.htaccess` ב-public_html:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Redirect API calls to Node.js
  RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
  
  # Handle React Router
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Enable CORS
<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
</IfModule>
```

## 8. SSL Certificate

ב-Hostinger cPanel:
1. לך ל-"SSL/TLS Status"
2. הפעל Let's Encrypt SSL
3. וודא ש-HTTPS עובד

## 9. בדיקה סופית

1. בדוק שהאתר עולה: https://your-domain.com
2. בדוק שה-API עובד: https://your-domain.com/api/test
3. בדוק ב-Console של הדפדפן שאין שגיאות

## טיפים חשובים:

1. **אבטחה**: אל תעלה את קובץ `.env` עם סיסמאות אמיתיות
2. **ביצועים**: השתמש ב-PM2 להרצת Node.js
3. **גיבויים**: הגדר גיבויים אוטומטיים ב-Hostinger
4. **מוניטורינג**: הגדר Uptime monitoring

## בעיות נפוצות:

1. **"Cannot find module"** - הרץ `npm install` בשרת
2. **"502 Bad Gateway"** - בדוק שה-Node.js app רץ
3. **CORS errors** - בדוק הגדרות CORS בשרת