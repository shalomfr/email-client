// Mock API עבור פרויקט עצמאי
// הקובץ הזה מרכז את כל הגישה לנתונים.
// המתכנת יצטרך להחליף את הלוגיקה כאן בלוגיקה שפונה לשרת אמיתי.

// --- נתוני דמה ---
let mockEmails = [
    { id: "1", from: "dvir.cohen@example.com", from_name: "דביר כהן", to: ["user@example.com"], subject: "סיכום פגישת פרויקט 'אלפא'", body: "<h3>היי,</h3><p>מצורף סיכום הפגישה שהתקיימה אתמול. נא לעבור על הנקודות העיקריות ולאשר.</p><p>תודה,<br>דביר</p>", date: new Date().toISOString(), is_read: false, is_starred: true, folder: "inbox", labels: ["עבודה", "חשוב"], selected: false },
    { id: "2", from: "no-reply@linkedin.com", from_name: "LinkedIn", to: ["user@example.com"], subject: "יש לך 3 הצעות עבודה חדשות", body: "<h2>הזדמנויות חדשות מחכות לך!</h2><p>ראינו שאתה מחפש משרה חדשה. הנה כמה משרות שעשויות לעניין אותך:</p><ul><li>מפתח Full Stack בחברת הייטק</li><li>Frontend Developer בסטארטאפ</li><li>Tech Lead בחברה מבוססת</li></ul>", date: new Date(Date.now() - 3600000).toISOString(), is_read: false, is_starred: false, folder: "inbox", labels: ["עדכונים"], selected: false },
    { id: "3", from: "support@super-deal.co.il", from_name: "SuperDeal", to: ["user@example.com"], subject: "⚡️ מבצעי סוף העונה!", body: "<h2>אל תפספסו!</h2><p>עד 70% הנחה על כל המוצרים באתר!</p><p>המבצע בתוקף עד סוף השבוע בלבד.</p>", date: new Date(Date.now() - 86400000).toISOString(), is_read: true, is_starred: false, folder: "inbox", labels: ["קידום מכירות"], selected: false },
    { id: "4", from: "user@example.com", from_name: "אני", to: ["mom@example.com"], subject: "מה שלומך?", body: "היי אמא,<br><br>מה קורה? איך הבריאות?<br>נתראה בסוף השבוע?<br><br>אוהב,<br>בנך", date: new Date(Date.now() - 7200000).toISOString(), is_read: true, is_starred: false, folder: "sent", selected: false},
    { id: "5", from: "user@example.com", from_name: "אני", to: ["service@bezeq.co.il"], subject: "חשבונית אחרונה", body: "שלום,<br><br>אשמח לקבל פירוט של החשבונית האחרונה.<br>מספר לקוח: 123456789<br><br>תודה מראש", date: new Date(Date.now() - 172800000).toISOString(), is_read: true, is_starred: false, folder: "sent", selected: false},
    { id: "6", from: "newsletter@medium.com", from_name: "Medium Daily Digest", to: ["user@example.com"], subject: "הסיפורים הכי מעניינים היום", body: "<h3>הסיפורים המומלצים שלך להיום</h3><p>1. איך לבנות אפליקציית React מודרנית<br>2. 10 טיפים לפיתוח יעיל יותר<br>3. העתיד של AI בפיתוח תוכנה</p>", date: new Date(Date.now() - 10800000).toISOString(), is_read: true, is_starred: false, folder: "inbox", labels: ["קריאה"], selected: false }
];

let mockContacts = [
    { id: "1", name: "דביר כהן", email: "dvir.cohen@example.com", phone: "052-1234567", company: "ExampleTech", position: "מנהל פרויקטים", groups: ["עבודה"] },
    { id: "2", name: "אמא", email: "mom@example.com", phone: "050-9876543", groups: ["משפחה"] }
];

let mockTasks = [
    { id: "1", title: "לעבור על סיכום פגישה", description: "פרויקט אלפא", priority: "high", status: "pending", due_date: "2024-07-29T23:59:59Z" },
    { id: "2", title: "להתקשר לאמא", description: "", priority: "medium", status: "completed", due_date: null }
];

let mockRules = [
    { id: "1", name: "סנן הצעות עבודה", conditions: { from: "linkedin" }, actions: { move_to_folder: "עבודה" }, is_active: true }
];

let mockTemplates = [
    { id: "1", name: "תגובה מהירה", subject: "Re: {{original_subject}}", body: "תודה על פנייתך, אחזור אליך בהקדם." }
];

let mockLabels = [
    { id: "1", name: "עבודה", color: "#4285F4" },
    { id: "2", name: "חשוב", color: "#EA4335" }
];

let mockAccounts = [
    { id: "1", email_address: 'user@example.com', imap_server: 'imap.example.com', imap_port: 993, imap_ssl: true, smtp_server: 'smtp.example.com', smtp_port: 465, smtp_ssl: true }
];


// Store all mock data in one object for better access
const mockData = {
    emails: mockEmails,
    contacts: mockContacts,
    tasks: mockTasks,
    rules: mockRules,
    templates: mockTemplates,
    labels: mockLabels,
    accounts: mockAccounts
};

// --- פונקציות API מדומות ---
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const createApiFor = (dataType) => ({
    list: async () => {
        await delay(300);
        console.log(`Listing all ${dataType}:`, mockData[dataType]);
        return [...mockData[dataType]];
    },
    filter: async (conditions) => {
        await delay(300);
        console.log(`Filtering ${dataType} with conditions:`, conditions);
        const filtered = mockData[dataType].filter(item => 
            Object.entries(conditions).every(([key, value]) => item[key] === value)
        );
        console.log(`Found ${filtered.length} ${dataType}`);
        return filtered;
    },
    create: async (newData) => {
        await delay(500);
        const newItem = { id: Date.now().toString(), ...newData };
        mockData[dataType].unshift(newItem);
        console.log(`Created new ${dataType}:`, newItem);
        return newItem;
    },
    update: async (id, updateData) => {
        await delay(200);
        const itemIndex = mockData[dataType].findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            mockData[dataType][itemIndex] = { ...mockData[dataType][itemIndex], ...updateData };
            console.log(`Updated ${dataType}:`, mockData[dataType][itemIndex]);
            return mockData[dataType][itemIndex];
        }
        throw new Error('Item not found');
    },
    delete: async (id) => {
        await delay(200);
        const itemIndex = mockData[dataType].findIndex(item => item.id === id);
        if (itemIndex === -1) {
          return false;
        }
        mockData[dataType].splice(itemIndex, 1);
        console.log(`Deleted ${dataType} with id: ${id}`);
        return true;
    }
});

export const Email = createApiFor('emails');
export const Contact = createApiFor('contacts');
export const Task = createApiFor('tasks');
export const Rule = createApiFor('rules');
export const Template = createApiFor('templates');
export const Label = createApiFor('labels');
export const Account = createApiFor('accounts');