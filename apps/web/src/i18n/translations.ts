export type LangCode = 'en' | 'ur' | 'hi' | 'pa' | 'sv' | 'phr' | 'gu' | 'ks' | 'fa' | 'ar';

export interface Language {
  code: LangCode;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  font?: string;
}

export const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', dir: 'rtl', font: 'Noto Nastaliq Urdu' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', dir: 'ltr' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', dir: 'ltr' },
  { code: 'phr', name: 'Pahari', nativeName: 'پہاڑی', dir: 'rtl' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', dir: 'ltr' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'کٲشُر', dir: 'rtl' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', dir: 'rtl' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
];

type TranslationKeys = {
  // Nav
  dashboard: string;
  compose: string;
  calendar: string;
  inbox: string;
  analytics: string;
  team: string;
  settings: string;
  signOut: string;
  // Dashboard
  welcomeBack: string;
  socialOverview: string;
  newPost: string;
  viewCalendar: string;
  totalFollowers: string;
  impressions: string;
  engagements: string;
  engagementRate: string;
  recentPosts: string;
  noPosts: string;
  // Compose
  composePost: string;
  selectPlatforms: string;
  whatsOnYourMind: string;
  publishNow: string;
  schedulePost: string;
  preview: string;
  selectPlatformPreview: string;
  schedule: string;
  // Settings
  profile: string;
  apiKeys: string;
  connectedAccounts: string;
  fullName: string;
  email: string;
  timezone: string;
  language: string;
  theme: string;
  saveChanges: string;
  // Admin
  admin: string;
  users: string;
  addUser: string;
  editUser: string;
  resetPassword: string;
  deleteUser: string;
  userManagement: string;
  role: string;
  active: string;
  inactive: string;
  actions: string;
  colorTheme: string;
  subscription: string;
  // Auth
  signIn: string;
  signUp: string;
  noAccount: string;
  haveAccount: string;
  password: string;
  confirmPassword: string;
  // Common
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  add: string;
  search: string;
  loading: string;
  configured: string;
  notConfigured: string;
  connect: string;
  notConnected: string;
  perMonth: string;
  free: string;
  pro: string;
  subscribe: string;
  currentPlan: string;
};

const en: TranslationKeys = {
  dashboard: 'Dashboard', compose: 'Compose', calendar: 'Calendar', inbox: 'Inbox',
  analytics: 'Analytics', team: 'Team', settings: 'Settings', signOut: 'Sign out',
  welcomeBack: 'Welcome back! Here\'s your social media overview.',
  socialOverview: 'Social Media Overview', newPost: 'New Post', viewCalendar: 'View Calendar',
  totalFollowers: 'Total Followers', impressions: 'Impressions', engagements: 'Engagements',
  engagementRate: 'Engagement Rate', recentPosts: 'Recent Posts', noPosts: 'No posts yet. Create your first post!',
  composePost: 'Compose Post', selectPlatforms: 'Select Platforms', whatsOnYourMind: 'What\'s on your mind? Write your post here...',
  publishNow: 'Publish Now', schedulePost: 'Schedule Post', preview: 'Preview',
  selectPlatformPreview: 'Select a platform to preview', schedule: 'Schedule',
  profile: 'Profile', apiKeys: 'API Keys', connectedAccounts: 'Connected Accounts',
  fullName: 'Full Name', email: 'Email', timezone: 'Timezone', language: 'Language',
  theme: 'Theme', saveChanges: 'Save Changes',
  admin: 'Admin', users: 'Users', addUser: 'Add User', editUser: 'Edit User',
  resetPassword: 'Reset Password', deleteUser: 'Delete User', userManagement: 'User Management',
  role: 'Role', active: 'Active', inactive: 'Inactive', actions: 'Actions',
  colorTheme: 'Color Theme', subscription: 'Subscription',
  signIn: 'Sign in', signUp: 'Sign up', noAccount: 'Don\'t have an account?',
  haveAccount: 'Already have an account?', password: 'Password', confirmPassword: 'Confirm Password',
  save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', add: 'Add',
  search: 'Search', loading: 'Loading...', configured: 'Configured', notConfigured: 'Not configured',
  connect: 'Connect', notConnected: 'Not connected',
  perMonth: '/month', free: 'Free', pro: 'Pro', subscribe: 'Subscribe', currentPlan: 'Current Plan',
};

const ur: TranslationKeys = {
  dashboard: 'ڈیش بورڈ', compose: 'تحریر', calendar: 'کیلنڈر', inbox: 'ان باکس',
  analytics: 'تجزیات', team: 'ٹیم', settings: 'ترتیبات', signOut: 'سائن آؤٹ',
  welcomeBack: '!خوش آمدید! یہاں آپ کا سوشل میڈیا جائزہ ہے',
  socialOverview: 'سوشل میڈیا جائزہ', newPost: 'نئی پوسٹ', viewCalendar: 'کیلنڈر دیکھیں',
  totalFollowers: 'کل فالوورز', impressions: 'نقوش', engagements: 'مشغولیت',
  engagementRate: 'مشغولیت کی شرح', recentPosts: 'حالیہ پوسٹس', noPosts: '!ابھی تک کوئی پوسٹ نہیں۔ اپنی پہلی پوسٹ بنائیں',
  composePost: 'پوسٹ تحریر', selectPlatforms: 'پلیٹ فارمز منتخب کریں', whatsOnYourMind: '...آپ کے ذہن میں کیا ہے؟ یہاں لکھیں',
  publishNow: 'ابھی شائع کریں', schedulePost: 'شیڈول', preview: 'پیش نظارہ',
  selectPlatformPreview: 'پیش نظارہ کے لیے پلیٹ فارم منتخب کریں', schedule: 'شیڈول',
  profile: 'پروفائل', apiKeys: 'API کیز', connectedAccounts: 'منسلک اکاؤنٹس',
  fullName: 'پورا نام', email: 'ای میل', timezone: 'ٹائم زون', language: 'زبان',
  theme: 'تھیم', saveChanges: 'تبدیلیاں محفوظ کریں',
  admin: 'ایڈمن', users: 'صارفین', addUser: 'صارف شامل کریں', editUser: 'صارف ترمیم',
  resetPassword: 'پاسورڈ ری سیٹ', deleteUser: 'صارف حذف کریں', userManagement: 'صارف انتظام',
  role: 'کردار', active: 'فعال', inactive: 'غیر فعال', actions: 'اقدامات',
  colorTheme: 'رنگ تھیم', subscription: 'سبسکرپشن',
  signIn: 'سائن ان', signUp: 'سائن اپ', noAccount: 'اکاؤنٹ نہیں ہے؟',
  haveAccount: 'پہلے سے اکاؤنٹ ہے؟', password: 'پاسورڈ', confirmPassword: 'پاسورڈ کی تصدیق',
  save: 'محفوظ', cancel: 'منسوخ', delete: 'حذف', edit: 'ترمیم', add: 'شامل',
  search: 'تلاش', loading: '...لوڈ ہو رہا ہے', configured: 'ترتیب شدہ', notConfigured: 'ترتیب نہیں',
  connect: 'جوڑیں', notConnected: 'منسلک نہیں',
  perMonth: '/ماہ', free: 'مفت', pro: 'پرو', subscribe: 'سبسکرائب', currentPlan: 'موجودہ پلان',
};

const hi: TranslationKeys = {
  dashboard: 'डैशबोर्ड', compose: 'लिखें', calendar: 'कैलेंडर', inbox: 'इनबॉक्स',
  analytics: 'विश्लेषण', team: 'टीम', settings: 'सेटिंग्स', signOut: 'साइन आउट',
  welcomeBack: 'वापस स्वागत है! यहाँ आपका सोशल मीडिया अवलोकन है।',
  socialOverview: 'सोशल मीडिया अवलोकन', newPost: 'नई पोस्ट', viewCalendar: 'कैलेंडर देखें',
  totalFollowers: 'कुल फॉलोअर्स', impressions: 'इम्प्रेशन', engagements: 'एंगेजमेंट',
  engagementRate: 'एंगेजमेंट दर', recentPosts: 'हाल की पोस्ट', noPosts: 'अभी कोई पोस्ट नहीं है। अपनी पहली पोस्ट बनाएं!',
  composePost: 'पोस्ट लिखें', selectPlatforms: 'प्लेटफॉर्म चुनें', whatsOnYourMind: 'आपके मन में क्या है? यहाँ लिखें...',
  publishNow: 'अभी प्रकाशित करें', schedulePost: 'शेड्यूल', preview: 'पूर्वावलोकन',
  selectPlatformPreview: 'पूर्वावलोकन के लिए प्लेटफॉर्म चुनें', schedule: 'शेड्यूल',
  profile: 'प्रोफ़ाइल', apiKeys: 'API कुंजियाँ', connectedAccounts: 'जुड़े खाते',
  fullName: 'पूरा नाम', email: 'ईमेल', timezone: 'टाइमज़ोन', language: 'भाषा',
  theme: 'थीम', saveChanges: 'बदलाव सहेजें',
  admin: 'एडमिन', users: 'उपयोगकर्ता', addUser: 'उपयोगकर्ता जोड़ें', editUser: 'उपयोगकर्ता संपादित करें',
  resetPassword: 'पासवर्ड रीसेट', deleteUser: 'उपयोगकर्ता हटाएं', userManagement: 'उपयोगकर्ता प्रबंधन',
  role: 'भूमिका', active: 'सक्रिय', inactive: 'निष्क्रिय', actions: 'कार्रवाई',
  colorTheme: 'रंग थीम', subscription: 'सदस्यता',
  signIn: 'साइन इन', signUp: 'साइन अप', noAccount: 'खाता नहीं है?',
  haveAccount: 'पहले से खाता है?', password: 'पासवर्ड', confirmPassword: 'पासवर्ड पुष्टि',
  save: 'सहेजें', cancel: 'रद्द', delete: 'हटाएं', edit: 'संपादन', add: 'जोड़ें',
  search: 'खोजें', loading: 'लोड हो रहा है...', configured: 'कॉन्फ़िगर', notConfigured: 'कॉन्फ़िगर नहीं',
  connect: 'जोड़ें', notConnected: 'जुड़ा नहीं',
  perMonth: '/माह', free: 'मुफ़्त', pro: 'प्रो', subscribe: 'सब्सक्राइब', currentPlan: 'वर्तमान प्लान',
};

const pa: TranslationKeys = {
  dashboard: 'ਡੈਸ਼ਬੋਰਡ', compose: 'ਲਿਖੋ', calendar: 'ਕੈਲੰਡਰ', inbox: 'ਇਨਬਾਕਸ',
  analytics: 'ਵਿਸ਼ਲੇਸ਼ਣ', team: 'ਟੀਮ', settings: 'ਸੈਟਿੰਗਜ਼', signOut: 'ਸਾਈਨ ਆਊਟ',
  welcomeBack: 'ਵਾਪਸੀ ਤੇ ਸੁਆਗਤ! ਇੱਥੇ ਤੁਹਾਡਾ ਸੋਸ਼ਲ ਮੀਡੀਆ ਸਾਰ ਹੈ।',
  socialOverview: 'ਸੋਸ਼ਲ ਮੀਡੀਆ ਸਾਰ', newPost: 'ਨਵੀਂ ਪੋਸਟ', viewCalendar: 'ਕੈਲੰਡਰ ਵੇਖੋ',
  totalFollowers: 'ਕੁੱਲ ਫਾਲੋਅਰਜ਼', impressions: 'ਇੰਪ੍ਰੈਸ਼ਨ', engagements: 'ਐਂਗੇਜਮੈਂਟ',
  engagementRate: 'ਐਂਗੇਜਮੈਂਟ ਦਰ', recentPosts: 'ਹਾਲ ਦੀਆਂ ਪੋਸਟਾਂ', noPosts: 'ਅਜੇ ਕੋਈ ਪੋਸਟ ਨਹੀਂ। ਆਪਣੀ ਪਹਿਲੀ ਪੋਸਟ ਬਣਾਓ!',
  composePost: 'ਪੋਸਟ ਲਿਖੋ', selectPlatforms: 'ਪਲੈਟਫਾਰਮ ਚੁਣੋ', whatsOnYourMind: 'ਤੁਹਾਡੇ ਮਨ ਵਿੱਚ ਕੀ ਹੈ? ਇੱਥੇ ਲਿਖੋ...',
  publishNow: 'ਹੁਣੇ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ', schedulePost: 'ਸ਼ੈਡਿਊਲ', preview: 'ਪੂਰਵ ਦ੍ਰਿਸ਼',
  selectPlatformPreview: 'ਪੂਰਵ ਦ੍ਰਿਸ਼ ਲਈ ਪਲੈਟਫਾਰਮ ਚੁਣੋ', schedule: 'ਸ਼ੈਡਿਊਲ',
  profile: 'ਪ੍ਰੋਫ਼ਾਈਲ', apiKeys: 'API ਕੁੰਜੀਆਂ', connectedAccounts: 'ਜੁੜੇ ਖਾਤੇ',
  fullName: 'ਪੂਰਾ ਨਾਮ', email: 'ਈਮੇਲ', timezone: 'ਟਾਈਮਜ਼ੋਨ', language: 'ਭਾਸ਼ਾ',
  theme: 'ਥੀਮ', saveChanges: 'ਤਬਦੀਲੀਆਂ ਸੁਰੱਖਿਅਤ ਕਰੋ',
  admin: 'ਐਡਮਿਨ', users: 'ਉਪਭੋਗਤਾ', addUser: 'ਉਪਭੋਗਤਾ ਸ਼ਾਮਲ ਕਰੋ', editUser: 'ਉਪਭੋਗਤਾ ਸੰਪਾਦਿਤ ਕਰੋ',
  resetPassword: 'ਪਾਸਵਰਡ ਰੀਸੈੱਟ', deleteUser: 'ਉਪਭੋਗਤਾ ਮਿਟਾਓ', userManagement: 'ਉਪਭੋਗਤਾ ਪ੍ਰਬੰਧਨ',
  role: 'ਭੂਮਿਕਾ', active: 'ਸਰਗਰਮ', inactive: 'ਅਸਰਗਰਮ', actions: 'ਕਾਰਵਾਈਆਂ',
  colorTheme: 'ਰੰਗ ਥੀਮ', subscription: 'ਸਬਸਕ੍ਰਿਪਸ਼ਨ',
  signIn: 'ਸਾਈਨ ਇਨ', signUp: 'ਸਾਈਨ ਅੱਪ', noAccount: 'ਖਾਤਾ ਨਹੀਂ ਹੈ?',
  haveAccount: 'ਪਹਿਲਾਂ ਤੋਂ ਖਾਤਾ ਹੈ?', password: 'ਪਾਸਵਰਡ', confirmPassword: 'ਪਾਸਵਰਡ ਪੁਸ਼ਟੀ',
  save: 'ਸੁਰੱਖਿਅਤ', cancel: 'ਰੱਦ', delete: 'ਮਿਟਾਓ', edit: 'ਸੰਪਾਦਨ', add: 'ਸ਼ਾਮਲ',
  search: 'ਖੋਜੋ', loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...', configured: 'ਕੌਂਫ਼ਿਗਰ', notConfigured: 'ਕੌਂਫ਼ਿਗਰ ਨਹੀਂ',
  connect: 'ਜੋੜੋ', notConnected: 'ਜੁੜਿਆ ਨਹੀਂ',
  perMonth: '/ਮਹੀਨਾ', free: 'ਮੁਫ਼ਤ', pro: 'ਪ੍ਰੋ', subscribe: 'ਸਬਸਕ੍ਰਾਈਬ', currentPlan: 'ਮੌਜੂਦਾ ਪਲਾਨ',
};

const sv: TranslationKeys = {
  dashboard: 'Instrumentpanel', compose: 'Skriv', calendar: 'Kalender', inbox: 'Inkorg',
  analytics: 'Analys', team: 'Team', settings: 'Inställningar', signOut: 'Logga ut',
  welcomeBack: 'Välkommen tillbaka! Här är din sociala medier-översikt.',
  socialOverview: 'Sociala medier-översikt', newPost: 'Nytt inlägg', viewCalendar: 'Visa kalender',
  totalFollowers: 'Totalt följare', impressions: 'Visningar', engagements: 'Engagemang',
  engagementRate: 'Engagemangsgrad', recentPosts: 'Senaste inlägg', noPosts: 'Inga inlägg ännu. Skapa ditt första inlägg!',
  composePost: 'Skriv inlägg', selectPlatforms: 'Välj plattformar', whatsOnYourMind: 'Vad tänker du på? Skriv ditt inlägg här...',
  publishNow: 'Publicera nu', schedulePost: 'Schemalägg', preview: 'Förhandsgranska',
  selectPlatformPreview: 'Välj plattform för förhandsgranskning', schedule: 'Schema',
  profile: 'Profil', apiKeys: 'API-nycklar', connectedAccounts: 'Anslutna konton',
  fullName: 'Fullständigt namn', email: 'E-post', timezone: 'Tidszon', language: 'Språk',
  theme: 'Tema', saveChanges: 'Spara ändringar',
  admin: 'Admin', users: 'Användare', addUser: 'Lägg till användare', editUser: 'Redigera användare',
  resetPassword: 'Återställ lösenord', deleteUser: 'Ta bort användare', userManagement: 'Användarhantering',
  role: 'Roll', active: 'Aktiv', inactive: 'Inaktiv', actions: 'Åtgärder',
  colorTheme: 'Färgtema', subscription: 'Prenumeration',
  signIn: 'Logga in', signUp: 'Registrera', noAccount: 'Har du inget konto?',
  haveAccount: 'Har du redan ett konto?', password: 'Lösenord', confirmPassword: 'Bekräfta lösenord',
  save: 'Spara', cancel: 'Avbryt', delete: 'Ta bort', edit: 'Redigera', add: 'Lägg till',
  search: 'Sök', loading: 'Laddar...', configured: 'Konfigurerad', notConfigured: 'Ej konfigurerad',
  connect: 'Anslut', notConnected: 'Ej ansluten',
  perMonth: '/månad', free: 'Gratis', pro: 'Pro', subscribe: 'Prenumerera', currentPlan: 'Nuvarande plan',
};

// RTL languages use same structure
const phr: TranslationKeys = { ...ur, dashboard: 'ڈیش بورڈ' }; // Pahari (similar to Urdu)
const ks: TranslationKeys = { ...ur, dashboard: 'ڈیش بورڈ' }; // Kashmiri (similar script)

const gu: TranslationKeys = {
  dashboard: 'ડેશબોર્ડ', compose: 'લખો', calendar: 'કેલેન્ડર', inbox: 'ઇનબોક્સ',
  analytics: 'વિશ્લેષણ', team: 'ટીમ', settings: 'સેટિંગ્સ', signOut: 'સાઇન આઉટ',
  welcomeBack: 'પાછા આવ્યા! અહીં તમારો સોશિયલ મીડિયા સારાંશ છે.',
  socialOverview: 'સોશિયલ મીડિયા સારાંશ', newPost: 'નવી પોસ્ટ', viewCalendar: 'કેલેન્ડર જુઓ',
  totalFollowers: 'કુલ ફોલોઅર્સ', impressions: 'ઇમ્પ્રેશન્સ', engagements: 'એન્ગેજમેન્ટ',
  engagementRate: 'એન્ગેજમેન્ટ દર', recentPosts: 'તાજેતરની પોસ્ટ્સ', noPosts: 'હજુ કોઈ પોસ્ટ નથી. તમારી પ્રથમ પોસ્ટ બનાવો!',
  composePost: 'પોસ્ટ લખો', selectPlatforms: 'પ્લેટફોર્મ પસંદ કરો', whatsOnYourMind: 'તમારા મનમાં શું છે? અહીં લખો...',
  publishNow: 'હમણાં પ્રકાશિત કરો', schedulePost: 'શેડ્યૂલ', preview: 'પૂર્વાવલોકન',
  selectPlatformPreview: 'પૂર્વાવલોકન માટે પ્લેટફોર્મ પસંદ કરો', schedule: 'શેડ્યૂલ',
  profile: 'પ્રોફાઇલ', apiKeys: 'API કીઝ', connectedAccounts: 'જોડાયેલ ખાતાઓ',
  fullName: 'પૂરું નામ', email: 'ઈમેલ', timezone: 'ટાઈમઝોન', language: 'ભાષા',
  theme: 'થીમ', saveChanges: 'ફેરફારો સાચવો',
  admin: 'એડમિન', users: 'વપરાશકર્તાઓ', addUser: 'વપરાશકર્તા ઉમેરો', editUser: 'વપરાશકર્તા સંપાદિત કરો',
  resetPassword: 'પાસવર્ડ રીસેટ', deleteUser: 'વપરાશકર્તા કાઢી નાખો', userManagement: 'વપરાશકર્તા વ્યવસ્થાપન',
  role: 'ભૂમિકા', active: 'સક્રિય', inactive: 'નિષ્ક્રિય', actions: 'ક્રિયાઓ',
  colorTheme: 'રંગ થીમ', subscription: 'સબ્સ્ક્રિપ્શન',
  signIn: 'સાઇન ઇન', signUp: 'સાઇન અપ', noAccount: 'ખાતું નથી?',
  haveAccount: 'પહેલેથી ખાતું છે?', password: 'પાસવર્ડ', confirmPassword: 'પાસવર્ડ પુષ્ટિ',
  save: 'સાચવો', cancel: 'રદ', delete: 'કાઢો', edit: 'સંપાદન', add: 'ઉમેરો',
  search: 'શોધો', loading: 'લોડ થઈ રહ્યું છે...', configured: 'કૉન્ફિગર', notConfigured: 'કૉન્ફિગર નહીં',
  connect: 'જોડો', notConnected: 'જોડાયેલ નથી',
  perMonth: '/મહિનો', free: 'મફત', pro: 'પ્રો', subscribe: 'સબ્સ્ક્રાઇબ', currentPlan: 'વર્તમાન પ્લાન',
};

const fa: TranslationKeys = {
  dashboard: 'داشبورد', compose: 'نوشتن', calendar: 'تقویم', inbox: 'صندوق ورودی',
  analytics: 'تحلیل', team: 'تیم', settings: 'تنظیمات', signOut: 'خروج',
  welcomeBack: '!خوش آمدید! اینجا نمای کلی رسانه اجتماعی شماست',
  socialOverview: 'نمای رسانه اجتماعی', newPost: 'پست جدید', viewCalendar: 'مشاهده تقویم',
  totalFollowers: 'کل دنبال‌کنندگان', impressions: 'نمایش‌ها', engagements: 'تعامل',
  engagementRate: 'نرخ تعامل', recentPosts: 'پست‌های اخیر', noPosts: '!هنوز پستی وجود ندارد. اولین پست خود را بسازید',
  composePost: 'نوشتن پست', selectPlatforms: 'انتخاب پلتفرم', whatsOnYourMind: '...چه چیزی در ذهن شماست؟ اینجا بنویسید',
  publishNow: 'انتشار فوری', schedulePost: 'زمان‌بندی', preview: 'پیش‌نمایش',
  selectPlatformPreview: 'برای پیش‌نمایش پلتفرم انتخاب کنید', schedule: 'زمان‌بندی',
  profile: 'پروفایل', apiKeys: 'کلیدهای API', connectedAccounts: 'حساب‌های متصل',
  fullName: 'نام کامل', email: 'ایمیل', timezone: 'منطقه زمانی', language: 'زبان',
  theme: 'تم', saveChanges: 'ذخیره تغییرات',
  admin: 'مدیر', users: 'کاربران', addUser: 'افزودن کاربر', editUser: 'ویرایش کاربر',
  resetPassword: 'بازنشانی رمز', deleteUser: 'حذف کاربر', userManagement: 'مدیریت کاربران',
  role: 'نقش', active: 'فعال', inactive: 'غیرفعال', actions: 'عملیات',
  colorTheme: 'تم رنگی', subscription: 'اشتراک',
  signIn: 'ورود', signUp: 'ثبت‌نام', noAccount: 'حساب ندارید؟',
  haveAccount: 'قبلاً حساب دارید؟', password: 'رمز عبور', confirmPassword: 'تأیید رمز',
  save: 'ذخیره', cancel: 'لغو', delete: 'حذف', edit: 'ویرایش', add: 'افزودن',
  search: 'جستجو', loading: '...در حال بارگذاری', configured: 'پیکربندی شده', notConfigured: 'پیکربندی نشده',
  connect: 'اتصال', notConnected: 'متصل نیست',
  perMonth: '/ماه', free: 'رایگان', pro: 'حرفه‌ای', subscribe: 'اشتراک', currentPlan: 'پلان فعلی',
};

const ar: TranslationKeys = {
  dashboard: 'لوحة المعلومات', compose: 'إنشاء', calendar: 'التقويم', inbox: 'البريد الوارد',
  analytics: 'التحليلات', team: 'الفريق', settings: 'الإعدادات', signOut: 'تسجيل الخروج',
  welcomeBack: '!مرحباً بعودتك! إليك نظرة عامة على وسائل التواصل الاجتماعي',
  socialOverview: 'نظرة عامة على التواصل الاجتماعي', newPost: 'منشور جديد', viewCalendar: 'عرض التقويم',
  totalFollowers: 'إجمالي المتابعين', impressions: 'مرات الظهور', engagements: 'التفاعلات',
  engagementRate: 'معدل التفاعل', recentPosts: 'المنشورات الأخيرة', noPosts: '!لا توجد منشورات حتى الآن. أنشئ أول منشور لك',
  composePost: 'إنشاء منشور', selectPlatforms: 'اختر المنصات', whatsOnYourMind: '...ما الذي يدور في ذهنك؟ اكتب هنا',
  publishNow: 'نشر الآن', schedulePost: 'جدولة', preview: 'معاينة',
  selectPlatformPreview: 'اختر منصة للمعاينة', schedule: 'الجدول',
  profile: 'الملف الشخصي', apiKeys: 'مفاتيح API', connectedAccounts: 'الحسابات المتصلة',
  fullName: 'الاسم الكامل', email: 'البريد الإلكتروني', timezone: 'المنطقة الزمنية', language: 'اللغة',
  theme: 'السمة', saveChanges: 'حفظ التغييرات',
  admin: 'المشرف', users: 'المستخدمون', addUser: 'إضافة مستخدم', editUser: 'تعديل مستخدم',
  resetPassword: 'إعادة تعيين كلمة المرور', deleteUser: 'حذف مستخدم', userManagement: 'إدارة المستخدمين',
  role: 'الدور', active: 'نشط', inactive: 'غير نشط', actions: 'الإجراءات',
  colorTheme: 'سمة اللون', subscription: 'الاشتراك',
  signIn: 'تسجيل الدخول', signUp: 'إنشاء حساب', noAccount: 'ليس لديك حساب؟',
  haveAccount: 'لديك حساب بالفعل؟', password: 'كلمة المرور', confirmPassword: 'تأكيد كلمة المرور',
  save: 'حفظ', cancel: 'إلغاء', delete: 'حذف', edit: 'تعديل', add: 'إضافة',
  search: 'بحث', loading: '...جاري التحميل', configured: 'تم التهيئة', notConfigured: 'غير مهيأ',
  connect: 'اتصال', notConnected: 'غير متصل',
  perMonth: '/شهر', free: 'مجاني', pro: 'احترافي', subscribe: 'اشترك', currentPlan: 'الخطة الحالية',
};

export const translations: Record<LangCode, TranslationKeys> = {
  en, ur, hi, pa, sv, phr, gu, ks, fa, ar
};

export function t(key: keyof TranslationKeys, lang: LangCode = 'en'): string {
  return translations[lang]?.[key] || translations.en[key] || key;
}

export function getLanguage(code: LangCode): Language {
  return languages.find(l => l.code === code) || languages[0];
}
