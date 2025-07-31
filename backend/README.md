# Email Client Backend - שרת למיילים אמיתיים

## התקנה והפעלה

### 1. התקן את התלויות:
```bash
cd backend
npm install
```

### 2. הפעל את השרת:
```bash
npm start
```

השרת ירוץ על פורט 3001.

## איך זה עובד

השרת מתחבר לחשבונות מייל אמיתיים דרך:
- **IMAP** - לקריאת מיילים
- **SMTP** - לשליחת מיילים

## נקודות אבטחה חשובות

1. **אל תשמור סיסמאות בקוד!**
2. **השתמש ב-HTTPS בסביבת production**
3. **הוסף rate limiting**
4. **השתמש ב-OAuth2 כשאפשר**

## API Endpoints

### התחברות
```
POST /api/auth/login
Body: {
  email: "user@gmail.com",
  password: "app-password",
  imap_server: "imap.gmail.com",
  imap_port: 993,
  smtp_server: "smtp.gmail.com",
  smtp_port: 587
}
```

### קבלת מיילים
```
GET /api/emails/:folder
Headers: { Authorization: "session-id" }
```

### שליחת מייל
```
POST /api/emails/send
Headers: { Authorization: "session-id" }
Body: {
  to: ["recipient@example.com"],
  subject: "נושא",
  body: "<p>תוכן המייל</p>"
}
```

## תמיכה בספקי מייל

- Gmail - דורש App Password
- Outlook/Hotmail
- Yahoo Mail
- כל ספק עם IMAP/SMTP