// Email Provider Detection and Configuration
// אלגוריתם זיהוי ספקי אימייל והגדרותיהם

export const emailProviders = {
  // Gmail / Google Workspace
  gmail: {
    name: 'Gmail / Google Workspace',
    domains: ['gmail.com', 'googlemail.com'],
    imap: {
      server: 'imap.gmail.com',
      port: 993,
      encryption: 'SSL/TLS',
      auth: 'OAuth2 / App Password'
    },
    pop3: {
      server: 'pop.gmail.com',
      port: 995,
      encryption: 'SSL/TLS'
    },
    smtp: {
      server: 'smtp.gmail.com',
      port: 587,
      altPort: 465,
      encryption: 'STARTTLS או SSL/TLS',
      authRequired: true
    },
    notes: [
      'יש להפעיל "אפליקציות פחות מאובטחות" או להשתמש בסיסמאות אפליקציה',
      'תמיכה באימות דו-שלבי',
      'עבור Google Workspace - עדכן את השרת לפי הדומיין המותאם'
    ]
  },

  // Outlook.com / Hotmail / Live / Office 365
  outlook: {
    name: 'Outlook.com / Hotmail / Live / Office 365',
    domains: ['outlook.com', 'hotmail.com', 'live.com', 'msn.com'],
    imap: {
      server: 'outlook.office365.com',
      altServer: 'imap-mail.outlook.com',
      port: 993,
      encryption: 'SSL/TLS'
    },
    pop3: {
      server: 'outlook.office365.com',
      port: 995,
      encryption: 'SSL/TLS'
    },
    smtp: {
      server: 'smtp-mail.outlook.com',
      altServer: 'smtp.office365.com',
      port: 587,
      encryption: 'STARTTLS',
      authRequired: true
    },
    notes: [
      'עבור Office 365 עסקי: השתמש ב-outlook.office365.com',
      'תמיכה באימות מודרני (OAuth2)',
      'עדכן הגדרות אבטחה בחשבון Microsoft'
    ]
  },

  // Yahoo Mail
  yahoo: {
    name: 'Yahoo Mail',
    domains: ['yahoo.com', 'yahoo.co.il', 'ymail.com', 'rocketmail.com'],
    imap: {
      server: 'imap.mail.yahoo.com',
      port: 993,
      encryption: 'SSL/TLS'
    },
    pop3: {
      server: 'pop.mail.yahoo.com',
      port: 995,
      encryption: 'SSL/TLS'
    },
    smtp: {
      server: 'smtp.mail.yahoo.com',
      port: 587,
      altPort: 465,
      encryption: 'STARTTLS או SSL/TLS',
      authRequired: true
    },
    notes: [
      'יש להפעיל "גישה לאפליקציות פחות מאובטחות"',
      'או ליצור סיסמת אפליקציה מיוחדת'
    ]
  },

  // Apple iCloud Mail
  icloud: {
    name: 'Apple iCloud Mail',
    domains: ['icloud.com', 'me.com', 'mac.com'],
    imap: {
      server: 'imap.mail.me.com',
      port: 993,
      encryption: 'SSL/TLS'
    },
    smtp: {
      server: 'smtp.mail.me.com',
      port: 587,
      encryption: 'STARTTLS',
      authRequired: true
    },
    notes: [
      'נדרש אימות דו-שלבי',
      'יש ליצור סיסמת אפליקציה ספציפית',
      'הגדרות זמינות רק עם מנוי iCloud+'
    ]
  },

  // ProtonMail
  protonmail: {
    name: 'ProtonMail',
    domains: ['protonmail.com', 'proton.me', 'pm.me'],
    imap: {
      server: '127.0.0.1',
      port: 1143,
      encryption: 'STARTTLS',
      note: 'דרך ProtonMail Bridge'
    },
    smtp: {
      server: '127.0.0.1',
      port: 1025,
      encryption: 'STARTTLS',
      note: 'דרך ProtonMail Bridge'
    },
    notes: [
      'נדרש להתקין ProtonMail Bridge (חשבון בתשלום)',
      'הצפנה מקצה לקצה',
      'לא זמין לחשבונות חינמיים'
    ]
  },

  // Zoho Mail
  zoho: {
    name: 'Zoho Mail',
    domains: ['zoho.com', 'zohomail.com'],
    imap: {
      server: 'imap.zoho.com',
      port: 993,
      encryption: 'SSL/TLS'
    },
    pop3: {
      server: 'pop.zoho.com',
      port: 995,
      encryption: 'SSL/TLS'
    },
    smtp: {
      server: 'smtp.zoho.com',
      port: 587,
      altPort: 465,
      encryption: 'STARTTLS או SSL/TLS',
      authRequired: true
    },
    notes: []
  },

  // AOL Mail
  aol: {
    name: 'AOL Mail',
    domains: ['aol.com', 'aim.com'],
    imap: {
      server: 'imap.aol.com',
      port: 993,
      encryption: 'SSL/TLS'
    },
    pop3: {
      server: 'pop.aol.com',
      port: 995,
      encryption: 'SSL/TLS'
    },
    smtp: {
      server: 'smtp.aol.com',
      port: 587,
      encryption: 'STARTTLS',
      authRequired: true
    },
    notes: [
      'נדרש להפעיל "אפליקציות חיצוניות" בהגדרות החשבון'
    ]
  },

  // GMX Mail
  gmx: {
    name: 'GMX Mail',
    domains: ['gmx.com', 'gmx.net', 'gmx.de'],
    imap: {
      server: 'imap.gmx.com',
      port: 993,
      encryption: 'SSL/TLS'
    },
    pop3: {
      server: 'pop.gmx.com',
      port: 995,
      encryption: 'SSL/TLS'
    },
    smtp: {
      server: 'mail.gmx.com',
      port: 587,
      altPort: 465,
      encryption: 'STARTTLS או SSL/TLS',
      authRequired: true
    },
    notes: []
  },

  // Mail.com
  mailcom: {
    name: 'Mail.com',
    domains: ['mail.com', 'email.com', 'usa.com'],
    imap: {
      server: 'imap.mail.com',
      port: 993,
      encryption: 'SSL/TLS'
    },
    smtp: {
      server: 'smtp.mail.com',
      port: 587,
      encryption: 'STARTTLS',
      authRequired: true
    },
    notes: []
  },

  // Fastmail
  fastmail: {
    name: 'Fastmail',
    domains: ['fastmail.com', 'fastmail.fm'],
    imap: {
      server: 'imap.fastmail.com',
      port: 993,
      encryption: 'SSL/TLS'
    },
    smtp: {
      server: 'smtp.fastmail.com',
      port: 587,
      altPort: 465,
      encryption: 'STARTTLS או SSL/TLS',
      authRequired: true
    },
    notes: [
      'תמיכה באימות OAuth2',
      'אפשרות ליצור סיסמאות אפליקציה'
    ]
  },

  // Yandex Mail
  yandex: {
    name: 'Yandex Mail',
    domains: ['yandex.com', 'yandex.ru', 'ya.ru'],
    imap: {
      server: 'imap.yandex.com',
      port: 993,
      encryption: 'SSL/TLS'
    },
    smtp: {
      server: 'smtp.yandex.com',
      port: 587,
      altPort: 465,
      encryption: 'STARTTLS או SSL/TLS',
      authRequired: true
    },
    notes: [
      'נדרש להפעיל גישה לאפליקציות חיצוניות'
    ]
  },

  // Israeli Providers
  // Walla Mail
  walla: {
    name: 'Walla Mail',
    domains: ['walla.com', 'walla.co.il'],
    pop3: {
      server: 'pop3.walla.co.il',
      port: 110,
      encryption: 'ללא (או TLS אם זמין)'
    },
    smtp: {
      server: 'smtp.walla.co.il',
      port: 25,
      altPort: 587,
      authRequired: true
    },
    notes: [
      'תמיכה מוגבלת ב-IMAP',
      'מומלץ POP3'
    ]
  },

  // Bezeq International
  bezeq: {
    name: 'Bezeq International',
    domains: ['013.net', 'bezeqint.net'],
    pop3: {
      server: 'pop3.013.net',
      port: 110,
      encryption: 'ללא'
    },
    smtp: {
      server: 'smtp.013.net',
      port: 25,
      authRequired: true
    },
    notes: [
      'שירות מוגבל',
      'מומלץ לבדוק עדכניות ההגדרות'
    ]
  },

  // NetVision
  netvision: {
    name: 'NetVision',
    domains: ['netvision.net.il', '012.net.il'],
    pop3: {
      server: 'pop3.netvision.net.il',
      port: 110
    },
    smtp: {
      server: 'smtp.netvision.net.il',
      port: 25,
      authRequired: true
    },
    notes: []
  }
};

// Function to detect email provider from email address
export const detectEmailProvider = (email) => {
  if (!email || !email.includes('@')) {
    return null;
  }

  const domain = email.split('@')[1].toLowerCase();
  
  // Search through all providers
  for (const [key, provider] of Object.entries(emailProviders)) {
    if (provider.domains && provider.domains.some(d => domain.endsWith(d))) {
      return {
        ...provider,
        detectedDomain: domain,
        providerKey: key
      };
    }
  }

  // If no provider found, return generic settings
  return {
    name: 'ספק אימייל לא מוכר',
    detectedDomain: domain,
    generic: true,
    imap: {
      server: `mail.${domain}`,
      altServer: `imap.${domain}`,
      port: 993,
      altPort: 143,
      encryption: 'SSL/TLS או STARTTLS'
    },
    pop3: {
      server: `mail.${domain}`,
      altServer: `pop.${domain}`,
      port: 995,
      altPort: 110,
      encryption: 'SSL/TLS'
    },
    smtp: {
      server: `mail.${domain}`,
      altServer: `smtp.${domain}`,
      port: 587,
      altPort: 465,
      encryption: 'STARTTLS או SSL/TLS',
      authRequired: true
    },
    notes: [
      'אלו הגדרות גנריות - ייתכן שיש צורך להתאים אותן',
      'בדוק עם ספק האימייל שלך את ההגדרות הנכונות',
      'נסה את שתי האפשרויות של השרתים והפורטים'
    ]
  };
};

// Function to format provider info for display
export const formatProviderInfo = (provider) => {
  if (!provider) return '';

  let output = `🔍 זיהיתי את הספק: ${provider.name}\n\n`;

  if (provider.imap) {
    output += `📧 הגדרות שרת נכנס (IMAP):\n`;
    output += `- שרת: ${provider.imap.server}`;
    if (provider.imap.altServer) output += ` או ${provider.imap.altServer}`;
    output += `\n- פורט: ${provider.imap.port}`;
    if (provider.imap.altPort) output += ` או ${provider.imap.altPort}`;
    output += `\n- הצפנה: ${provider.imap.encryption}\n`;
    if (provider.imap.note) output += `- הערה: ${provider.imap.note}\n`;
    output += '\n';
  }

  if (provider.pop3) {
    output += `📧 הגדרות שרת נכנס (POP3):\n`;
    output += `- שרת: ${provider.pop3.server}`;
    if (provider.pop3.altServer) output += ` או ${provider.pop3.altServer}`;
    output += `\n- פורט: ${provider.pop3.port}`;
    if (provider.pop3.altPort) output += ` או ${provider.pop3.altPort}`;
    output += `\n- הצפנה: ${provider.pop3.encryption || 'ללא'}\n\n`;
  }

  if (provider.smtp) {
    output += `📤 הגדרות שרת יוצא (SMTP):\n`;
    output += `- שרת: ${provider.smtp.server}`;
    if (provider.smtp.altServer) output += ` או ${provider.smtp.altServer}`;
    output += `\n- פורט: ${provider.smtp.port}`;
    if (provider.smtp.altPort) output += ` או ${provider.smtp.altPort}`;
    output += `\n- הצפנה: ${provider.smtp.encryption}\n`;
    output += `- אימות: ${provider.smtp.authRequired ? 'נדרש' : 'לא נדרש'}\n`;
    if (provider.smtp.note) output += `- הערה: ${provider.smtp.note}\n`;
  }

  if (provider.notes && provider.notes.length > 0) {
    output += `\n⚠️ הערות מיוחדות:\n`;
    provider.notes.forEach(note => {
      output += `• ${note}\n`;
    });
  }

  return output;
};