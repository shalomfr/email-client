
import React, { useState, useEffect } from 'react';
import { Account } from '../api/realEmailAPI';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Alert, AlertDescription } from '../components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, AlertCircle, Shield, Wifi, Server, Lock, 
  Globe, Smartphone, Monitor, Settings as SettingsIcon, Send,
  Bell, Eye, Zap, Clock, Mail, User, Search
} from 'lucide-react';
import { detectEmailProvider, formatProviderInfo } from '../utils/emailProviders';

export default function SettingsPage() {
  const [account, setAccount] = useState({});
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    desktopNotifications: true,
    soundNotifications: false,
    autoRead: false,
    smartReply: true,
    darkMode: false,
    language: 'he',
    timezone: 'Asia/Jerusalem'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [detectedProvider, setDetectedProvider] = useState(null);
  const [showProviderInfo, setShowProviderInfo] = useState(false);

  useEffect(() => {
    loadAccount();
  }, []);

  const loadAccount = async () => {
    setIsLoading(true);
    const accounts = await Account.list();
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      const newAccount = {
        email_address: 'user@example.com',
        password: '',
        imap_server: 'imap.example.com',
        imap_port: 993,
        imap_ssl: true,
        smtp_server: 'smtp.example.com',
        smtp_port: 465,
        smtp_ssl: true,
      };
      setAccount(newAccount);
    }
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setAccount(prev => ({ ...prev, [field]: value }));
    
    // Auto-detect email provider when email is entered
    if (field === 'email_address' && value.includes('@')) {
      const provider = detectEmailProvider(value);
      if (provider) {
        setDetectedProvider(provider);
        setShowProviderInfo(true);
        
        // Auto-fill settings if provider is detected
        if (!provider.generic) {
          // Fill IMAP settings
          if (provider.imap) {
            setAccount(prev => ({
              ...prev,
              imap_server: provider.imap.server,
              imap_port: provider.imap.port,
              imap_ssl: true
            }));
          }
          
          // Fill SMTP settings
          if (provider.smtp) {
            setAccount(prev => ({
              ...prev,
              smtp_server: provider.smtp.server,
              smtp_port: provider.smtp.port,
              smtp_ssl: true
            }));
          }
        }
      }
    }
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
        // First save the settings to localStorage
        const accountToSave = { ...account, id: '1' };
        await Account.update('1', accountToSave);
        console.log('Settings saved to localStorage');
        
        // Then try to login with the credentials
        const loginData = {
            email: account.email_address,
            password: account.password,
            imap_server: account.imap_server,
            imap_port: parseInt(account.imap_port),
            smtp_server: account.smtp_server,
            smtp_port: parseInt(account.smtp_port)
        };
        
        console.log('Attempting to login with:', { ...loginData, password: '***' });
        
        try {
            const loginResult = await Account.login(loginData);
            
            if (loginResult.success) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
                console.log('Successfully connected to email server!');
                
                // Redirect to inbox after successful login
                setTimeout(() => {
                    window.location.href = '/Inbox';
                }, 1500);
            } else {
                alert('ההגדרות נשמרו, אך החיבור לשרת המייל נכשל.\nאנא בדוק את הפרטים.\n' + (loginResult.error || ''));
            }
        } catch (loginError) {
            console.error('Login error:', loginError);
            alert('ההגדרות נשמרו, אך אירעה שגיאה בחיבור:\n' + (loginError.message || 'אנא בדוק את הפרטים ונסה שוב'));
        }
    } catch (error) {
        console.error('Failed to save settings:', error);
        alert('שגיאה בשמירת ההגדרות');
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <SettingsIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        </motion.div>
        <p className="text-xl text-gray-700">טוען הגדרות...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 flex-1 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 relative" dir="rtl">
      {/* Header */}
      <motion.div
        className="max-w-4xl mx-auto relative z-10 mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4"
          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.3 }}
        >
          <SettingsIcon className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          הגדרות מערכת
        </h1>
        <p className="text-gray-500 mt-2">נהל את חשבונות המייל והגדרות החיבור שלך</p>
      </motion.div>

      <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* Account Settings */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <motion.div
              className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            />
            
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.5 }}
                >
                  <Shield className="w-6 h-6 text-blue-600" />
                </motion.div>
                הגדרות חשבון מייל
              </CardTitle>
              <CardDescription>
                הגדר את פרטי החיבור לשרתי המייל. הנתונים נשמרים בצורה מאובטחת במערכת.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Basic Account Settings */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                  <Globe className="w-5 h-5 text-green-600" />
                  פרטי חשבון בסיסיים
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <motion.div 
                    className="space-y-2"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <span>כתובת מייל</span>
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      </motion.div>
                    </Label>
                    <div className="flex gap-2">
                      <Input 
                        id="email" 
                        value={account.email_address || ''} 
                        onChange={e => handleInputChange('email_address', e.target.value)}
                        className="transition-all duration-300 focus:shadow-lg flex-1"
                        placeholder="user@example.com"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const provider = detectEmailProvider(account.email_address);
                          if (provider) {
                            setDetectedProvider(provider);
                            setShowProviderInfo(true);
                          }
                        }}
                        className="flex items-center gap-2"
                      >
                        <Search className="w-4 h-4" />
                        זהה ספק
                      </Button>
                    </div>
                  </motion.div>
                  
                  {/* Provider Detection Info */}
                  <AnimatePresence>
                    {showProviderInfo && detectedProvider && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="col-span-2"
                      >
                        <Alert className={`border-2 ${detectedProvider.generic ? 'border-yellow-400 bg-yellow-50' : 'border-green-400 bg-green-50'}`}>
                          <div className="flex items-start gap-3">
                            <Search className="w-5 h-5 mt-1 text-green-600" />
                            <div className="flex-1">
                              <div className="font-semibold mb-2">
                                {detectedProvider.generic ? 
                                  `🔍 זוהה דומיין: ${detectedProvider.detectedDomain}` :
                                  `✅ זוהה ספק: ${detectedProvider.name}`
                                }
                              </div>
                              {!detectedProvider.generic && (
                                <div className="text-sm text-gray-700 mb-2">
                                  ההגדרות מולאו אוטומטית. בדוק שהן נכונות:
                                </div>
                              )}
                              <pre className="text-xs bg-white/80 p-3 rounded-lg whitespace-pre-wrap font-mono" dir="ltr">
                                {formatProviderInfo(detectedProvider)}
                              </pre>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowProviderInfo(false)}
                                className="mt-2"
                              >
                                סגור
                              </Button>
                            </div>
                          </div>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <motion.div 
                    className="space-y-2"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      סיסמה
                    </Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={account.password || ''} 
                      onChange={e => handleInputChange('password', e.target.value)}
                      className="transition-all duration-300 focus:shadow-lg"
                    />
                  </motion.div>
                </div>
              </motion.div>

              {/* IMAP Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="border-t pt-6">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                    <Server className="w-5 h-5 text-blue-600" />
                    הגדרות שרת נכנס (IMAP)
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.div 
                      className="space-y-2"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      <Label htmlFor="imap_server">שרת</Label>
                      <Input 
                        id="imap_server" 
                        value={account.imap_server || ''} 
                        onChange={e => handleInputChange('imap_server', e.target.value)}
                        placeholder="imap.gmail.com"
                        className="transition-all duration-300 focus:shadow-lg"
                      />
                    </motion.div>
                    
                    <motion.div 
                      className="space-y-2"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      <Label htmlFor="imap_port">פורט</Label>
                      <Input 
                        id="imap_port" 
                        type="number" 
                        value={account.imap_port || ''} 
                        onChange={e => handleInputChange('imap_port', parseInt(e.target.value))}
                        placeholder="993"
                        className="transition-all duration-300 focus:shadow-lg"
                      />
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mt-4"
                    whileHover={{ backgroundColor: '#f8fafc' }}
                  >
                    <div className="flex items-center gap-3">
                      <Wifi className="w-5 h-5 text-green-600" />
                      <div>
                        <Label htmlFor="imap_ssl" className="font-medium">חיבור מאובטח (SSL)</Label>
                        <p className="text-sm text-gray-500">מומלץ להשאיר פעיל לבטיחות מירבית</p>
                      </div>
                    </div>
                    <Switch 
                      id="imap_ssl" 
                      checked={account.imap_ssl || false} 
                      onCheckedChange={checked => handleInputChange('imap_ssl', checked)} 
                    />
                  </motion.div>
                </div>
              </motion.div>

              {/* SMTP Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <div className="border-t pt-6">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                    <Send className="w-5 h-5 text-indigo-600" />
                    הגדרות שרת יוצא (SMTP)
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.div 
                      className="space-y-2"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      <Label htmlFor="smtp_server">שרת</Label>
                      <Input 
                        id="smtp_server" 
                        value={account.smtp_server || ''} 
                        onChange={e => handleInputChange('smtp_server', e.target.value)}
                        placeholder="smtp.gmail.com"
                        className="transition-all duration-300 focus:shadow-lg"
                      />
                    </motion.div>
                    
                    <motion.div 
                      className="space-y-2"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      <Label htmlFor="smtp_port">פורט</Label>
                      <Input 
                        id="smtp_port" 
                        type="number" 
                        value={account.smtp_port || ''} 
                        onChange={e => handleInputChange('smtp_port', parseInt(e.target.value))}
                        placeholder="587"
                        className="transition-all duration-300 focus:shadow-lg"
                      />
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mt-4"
                    whileHover={{ backgroundColor: '#f8fafc' }}
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <div>
                        <Label htmlFor="smtp_ssl" className="font-medium">חיבור מאובטח (SSL)</Label>
                        <p className="text-sm text-gray-500">הצפנה לשליחת מיילים</p>
                      </div>
                    </div>
                    <Switch 
                      id="smtp_ssl" 
                      checked={account.smtp_ssl || false} 
                      onCheckedChange={checked => handleInputChange('smtp_ssl', checked)} 
                    />
                  </motion.div>
                </div>
              </motion.div>
            </CardContent>

            <CardFooter className="bg-gray-50/50 flex justify-between items-center">
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -20 }}
                  >
                    <Alert variant="default" className="bg-green-50 border-green-200 text-green-800 p-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        <AlertDescription className="font-semibold">ההגדרות נשמרו בהצלחה!</AlertDescription>
                      </div>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving} 
                  className="mr-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSaving ? (
                    <motion.div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <SettingsIcon className="w-4 h-4" />
                      </motion.div>
                      שומר...
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      שמור שינויים
                    </div>
                  )}
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Preferences & Stats Panel */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* User Preferences */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-purple-500" />
                העדפות משתמש
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'התראות במייל', icon: Mail },
                { key: 'desktopNotifications', label: 'התראות בדסקטופ', icon: Monitor },
                { key: 'soundNotifications', label: 'התראות קוליות', icon: Bell },
                { key: 'autoRead', label: 'סימון קריאה אוטומטי', icon: Eye },
                { key: 'smartReply', label: 'תשובות חכמות', icon: Zap }
              ].map(({ key, label, icon: Icon }, index) => (
                <motion.div
                  key={key}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <Switch
                    checked={preferences[key]}
                    onCheckedChange={(checked) => handlePreferenceChange(key, checked)}
                  />
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Connection Status */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wifi className="w-5 h-5 text-green-500" />
                סטטוס חיבור
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">שרת IMAP</span>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-3 h-3 bg-orange-500 rounded-full" />
                  </motion.div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">שרת SMTP</span>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    <div className="w-3 h-3 bg-orange-500 rounded-full" />
                  </motion.div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  * זוהי הדגמה - החיבור האמיתי אינו פעיל
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Monitor className="w-5 h-5 text-blue-500" />
                סטטיסטיקות מהירות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'מיילים נכנסים היום', value: '12', color: 'text-blue-600' },
                  { label: 'מיילים שנשלחו', value: '3', color: 'text-green-600' },
                  { label: 'טיוטות', value: '1', color: 'text-gray-600' },
                  { label: 'מיילים בזבל', value: '5', color: 'text-red-600' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="flex justify-between items-center"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                  >
                    <span className="text-sm text-gray-600">{stat.label}</span>
                    <motion.span 
                      className={`font-bold ${stat.color}`}
                      whileHover={{ scale: 1.2 }}
                    >
                      {stat.value}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device Info */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-purple-500" />
                מידע על המכשיר
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>דפדפן: Chrome/Safari</p>
                <p>מערכת הפעלה: {navigator.platform}</p>
                <p>רזולוציה: {window.screen.width}x{window.screen.height}</p>
                <motion.p 
                  className="text-green-600 font-medium"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  ● מחובר ופעיל
                </motion.p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Supported Providers Card */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Card className="overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <motion.div
              className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
            />
            
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.5 }}
                >
                  <Globe className="w-6 h-6 text-purple-600" />
                </motion.div>
                ספקי אימייל נתמכים
              </CardTitle>
              <CardDescription>
                האפליקציה מזהה אוטומטית את ההגדרות עבור הספקים הבאים
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <div className="col-span-full mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">ספקים בינלאומיים:</h3>
                </div>
                {['Gmail', 'Outlook', 'Yahoo', 'iCloud', 'ProtonMail', 'Zoho', 'AOL', 'GMX', 'Mail.com', 'Fastmail', 'Yandex'].map((provider, idx) => (
                  <motion.div
                    key={provider}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.3 + idx * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 text-center font-medium text-gray-700 border border-blue-200/50 hover:border-blue-400 transition-colors"
                  >
                    {provider}
                  </motion.div>
                ))}
                
                <div className="col-span-full mt-6 mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">ספקים ישראליים:</h3>
                </div>
                {['Walla', 'Bezeq', 'NetVision'].map((provider, idx) => (
                  <motion.div
                    key={provider}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.9 + idx * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 text-center font-medium text-gray-700 border border-green-200/50 hover:border-green-400 transition-colors"
                  >
                    {provider}
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 }}
                className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
              >
                <p className="text-sm text-yellow-800">
                  <strong>💡 טיפ:</strong> גם אם הספק שלך לא ברשימה, המערכת תנסה לזהות את ההגדרות הנכונות על בסיס הדומיין.
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
