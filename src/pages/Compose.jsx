
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Email } from '../api/realEmailAPI';
import { Contact, Template } from '../components/MockAPI';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Save, Paperclip, Smile, Bold, Italic, Underline,
  Link, AlignLeft, AlignCenter, List, Users, Clock, Star,
  X, Plus, Trash2, Eye, Archive, ArrowLeft, Zap
} from 'lucide-react';

export default function ComposePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const editorRef = useRef(null);

  const [email, setEmail] = useState({
    to: [],
    cc: [],
    bcc: [],
    subject: '',
    body: '',
    priority: 'medium',
    schedule_send: null
  });

  const [contacts, setContacts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  useEffect(() => {
    loadContacts();
    loadTemplates();

    // Check if replying to an email
    const urlParams = new URLSearchParams(location.search);
    const replyTo = urlParams.get('replyTo');
    if (replyTo) {
      // Would load the original email and populate fields
      setEmail(prev => ({
        ...prev,
        subject: `Re: ${replyTo}`,
        to: ['original@sender.com']
      }));
    }
  }, []);

  const loadContacts = async () => {
    const fetchedContacts = await Contact.list();
    setContacts(fetchedContacts);
  };

  const loadTemplates = async () => {
    const fetchedTemplates = await Template.list();
    setTemplates(fetchedTemplates);
  };

  const handleSend = async () => {
    if (!email.to.length || !email.subject.trim() || !email.body.trim()) {
      // In a real app, you'd show a user-friendly error message
      alert('Please fill in To, Subject, and Body fields.');
      return;
    }

    setIsSending(true);
    try {
      await Email.create({
        from: 'user@example.com',
        from_name: 'אני',
        to: email.to,
        cc: email.cc || [],
        bcc: email.bcc || [],
        subject: email.subject,
        body: email.body,
        date: new Date().toISOString(),
        folder: 'sent',
        is_read: true,
        priority: email.priority
      });

      navigate('/Inbox?folder=sent');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      await Email.create({
        from: 'user@example.com',
        from_name: 'אני',
        to: email.to || [],
        subject: email.subject || 'ללא נושא',
        body: email.body || '',
        date: new Date().toISOString(),
        folder: 'drafts',
        is_read: true
      });

      navigate('/Inbox?folder=drafts');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft. Please try again.');
    }
  };

  const handleScheduleSend = async () => {
    if (!email.to.length || !email.subject.trim() || !email.body.trim()) {
      alert('Please fill in To, Subject, and Body fields before scheduling.');
      return;
    }
    if (!scheduleDate || !scheduleTime) {
      alert('Please select both a date and time for scheduling.');
      return;
    }

    const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);

    try {
      await Email.create({
        from: 'user@example.com',
        from_name: 'אני',
        to: [...email.to],
        cc: email.cc || [],
        bcc: email.bcc || [],
        subject: email.subject,
        body: email.body,
        date: new Date().toISOString(), // Current date when created
        folder: 'drafts', // Will be moved to sent by backend when the time comes
        is_read: true,
        priority: email.priority,
        snoozed_until: scheduledDateTime.toISOString() // Using snooze mechanism for scheduling
      });

      setShowScheduleModal(false);
      navigate('/Inbox?folder=drafts'); // or a dedicated scheduled folder
    } catch (error) {
      console.error('Error scheduling email:', error);
      alert('Failed to schedule email. Please try again.');
    }
  };

  const applyTemplate = (template) => {
    setEmail(prev => ({
      ...prev,
      subject: template.subject,
      body: template.body
    }));
    setShowTemplates(false);
  };

  const addRecipient = (field, emailToAdd) => {
    // Basic email validation
    if (!emailToAdd.includes('@') || emailToAdd.indexOf('.') === -1) {
      alert('Please enter a valid email address.');
      return;
    }
    if (email[field].includes(emailToAdd)) {
        alert('Recipient already added.');
        return;
    }
    setEmail(prev => ({
      ...prev,
      [field]: [...prev[field], emailToAdd]
    }));
  };

  const removeRecipient = (field, index) => {
    setEmail(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const formatText = (command) => {
    document.execCommand(command, false, null);
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 overflow-hidden">
      {/* Header */}
      <motion.div
        className="p-6 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-20"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="ghost" size="icon" onClick={() => navigate('/Inbox')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div
              className="flex items-center gap-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">כתיבת מייל חדש</h1>
                <p className="text-sm text-gray-500">צור והשלח הודעות מקצועיות</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="flex items-center gap-2"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="w-4 h-4 ml-2" />
                שמור כטיוטה
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" onClick={() => setShowScheduleModal(true)}>
                <Clock className="w-4 h-4 ml-2" />
                תזמן שליחה
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleSend} disabled={isSending} className="bg-gradient-to-r from-blue-500 to-indigo-600">
                {isSending ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Zap className="w-4 h-4 ml-2" />
                  </motion.div>
                ) : (
                  <Send className="w-4 h-4 ml-2" />
                )}
                {isSending ? 'שולח...' : 'שלח'}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Compose Area */}
        <motion.div
          className="flex-1 p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6 h-full flex flex-col">
              {/* Recipients */}
              <div className="space-y-4 mb-6">
                {/* To Field */}
                <div className="flex items-center gap-3">
                  <Label className="text-sm font-medium w-12">אל:</Label>
                  <div className="flex-1 flex flex-wrap gap-2 border rounded-lg p-2 min-h-[40px] bg-white/50">
                    <AnimatePresence>
                      {email.to.map((recipient, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {recipient}
                          <button onClick={() => removeRecipient('to', index)} className="ml-1">
                            <X className="w-3 h-3" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <Input
                      placeholder="הקלד כתובת מייל..."
                      className="border-0 bg-transparent flex-1 min-w-[200px] focus:ring-0"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim() !== '') {
                          addRecipient('to', e.target.value.trim());
                          e.target.value = '';
                          e.preventDefault(); // Prevent form submission
                        }
                      }}
                    />
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setShowCc(!showCc)}>
                      Cc
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowBcc(!showBcc)}>
                      Bcc
                    </Button>
                  </div>
                </div>

                {/* CC Field */}
                <AnimatePresence>
                  {showCc && (
                    <motion.div
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Label className="text-sm font-medium w-12">עותק:</Label>
                      <div className="flex-1 flex flex-wrap gap-2 border rounded-lg p-2 min-h-[40px] bg-white/50">
                        {email.cc?.map((recipient, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                          >
                            {recipient}
                            <button onClick={() => removeRecipient('cc', index)} className="ml-1">
                              <X className="w-3 h-3" />
                            </button>
                          </motion.div>
                        ))}
                        <Input
                          placeholder="הקלד כתובת מייל..."
                          className="border-0 bg-transparent flex-1 min-w-[200px] focus:ring-0"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim() !== '') {
                              addRecipient('cc', e.target.value.trim());
                              e.target.value = '';
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* BCC Field */}
                <AnimatePresence>
                  {showBcc && (
                    <motion.div
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Label className="text-sm font-medium w-12">עותק מוסתר:</Label>
                      <div className="flex-1 flex flex-wrap gap-2 border rounded-lg p-2 min-h-[40px] bg-white/50">
                        {email.bcc?.map((recipient, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                          >
                            {recipient}
                            <button onClick={() => removeRecipient('bcc', index)} className="ml-1">
                              <X className="w-3 h-3" />
                            </button>
                          </motion.div>
                        ))}
                        <Input
                          placeholder="הקלד כתובת מייל..."
                          className="border-0 bg-transparent flex-1 min-w-[200px] focus:ring-0"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim() !== '') {
                              addRecipient('bcc', e.target.value.trim());
                              e.target.value = '';
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Subject */}
                <div className="flex items-center gap-3">
                  <Label className="text-sm font-medium w-12">נושא:</Label>
                  <Input
                    value={email.subject}
                    onChange={(e) => setEmail(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="נושא ההודעה"
                    className="flex-1 bg-white/50"
                  />
                </div>
              </div>

              {/* Formatting Toolbar */}
              <motion.div
                className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50/50 mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {[
                  { icon: Bold, command: 'bold' },
                  { icon: Italic, command: 'italic' },
                  { icon: Underline, command: 'underline' },
                  { icon: Link, command: 'createLink' },
                  { icon: List, command: 'insertUnorderedList' },
                  { icon: AlignLeft, command: 'justifyLeft' },
                  { icon: AlignCenter, command: 'justifyCenter' }
                ].map((tool, index) => (
                  <motion.div
                    key={tool.command}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => formatText(tool.command)}
                    >
                      <tool.icon className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}

                <div className="h-6 w-px bg-gray-300 mx-2" />

                <Select value={email.priority} onValueChange={(value) => setEmail(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">עדיפות נמוכה</SelectItem>
                    <SelectItem value="medium">עדיפות רגילה</SelectItem>
                    <SelectItem value="high">עדיפות גבוהה</SelectItem>
                    <SelectItem value="urgent">דחוף</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              {/* Email Body */}
              <motion.div
                className="flex-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div
                  ref={editorRef}
                  contentEditable
                  className="w-full h-full p-4 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  style={{ minHeight: '300px' }}
                  onInput={(e) => setEmail(prev => ({ ...prev, body: e.target.innerHTML }))}
                  dangerouslySetInnerHTML={{ __html: email.body }}
                />
              </motion.div>

              {/* Attachments */}
              <AnimatePresence>
                {attachments.length > 0 && (
                  <motion.div
                    className="mt-4 p-3 border rounded-lg bg-gray-50"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Paperclip className="w-4 h-4" />
                      <span className="text-sm font-medium">קבצים מצורפים</span>
                    </div>
                    <div className="space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                          <span className="text-sm">{file.name}</span>
                          <Button variant="ghost" size="sm" onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          className="w-80 p-6 border-r border-gray-200/50 bg-white/40 backdrop-blur-sm"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  פעולות מהירות
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { icon: Users, label: 'בחר מאנשי קשר', action: () => {} },
                  { icon: Archive, label: 'השתמש בתבנית', action: () => setShowTemplates(true) },
                  { icon: Clock, label: 'תזמן שליחה', action: () => setShowScheduleModal(true) },
                  { icon: Paperclip, label: 'צרף קבצים', action: () => {} }
                ].map((action, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3"
                      onClick={action.action}
                    >
                      <action.icon className="w-4 h-4" />
                      {action.label}
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Contacts */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  אנשי קשר אחרונים
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {contacts.slice(0, 5).map((contact, index) => (
                    <motion.div
                      key={contact.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      whileHover={{ scale: 1.02, x: 5 }}
                      onClick={() => addRecipient('to', contact.email)}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {contact.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{contact.name}</p>
                        <p className="text-xs text-gray-500 truncate">{contact.email}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Suggestions */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-600" />
                  הצעות חכמות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-purple-700">💡 נושא המייל יכול להיות מפורט יותר</p>
                  <p className="text-purple-700">📝 הוסף חתימה מקצועית</p>
                  <p className="text-purple-700">⏰ מומלץ לשלוח בשעות העבודה</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Templates Modal */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
            >
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">בחר תבנית</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowTemplates(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid gap-4">
                  {templates.map((template) => (
                    <motion.div
                      key={template.id}
                      className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => applyTemplate(template)}
                    >
                      <h3 className="font-semibold mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
                      <div className="text-xs text-gray-400 line-clamp-2" dangerouslySetInnerHTML={{ __html: template.body }} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schedule Send Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              dir="rtl"
            >
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">תזמון שליחה</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowScheduleModal(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-gray-500 mt-2">בחר מתי לשלוח את המייל</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="schedule_date">תאריך שליחה</Label>
                  <Input
                    id="schedule_date"
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule_time">שעת שליחה</Label>
                  <Input
                    id="schedule_time"
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>

                {/* Quick Schedule Options */}
                <div className="space-y-2">
                  <Label>אפשרויות מהירות</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'מחר ב-9:00', getValue: () => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        return { date: tomorrow.toISOString().split('T')[0], time: '09:00' };
                      }},
                      { label: 'מחרתיים ב-9:00', getValue: () => {
                        const dayAfter = new Date();
                        dayAfter.setDate(dayAfter.getDate() + 2);
                        return { date: dayAfter.toISOString().split('T')[0], time: '09:00' };
                      }},
                      { label: 'בעוד שעה', getValue: () => {
                        const inHour = new Date();
                        inHour.setHours(inHour.getHours() + 1);
                        inHour.setMinutes(0); // Round down to the nearest hour for simplicity
                        return {
                          date: inHour.toISOString().split('T')[0],
                          time: inHour.toTimeString().slice(0, 5)
                        };
                      }},
                      { label: 'ביום ב׳ הקרוב ב-9:00', getValue: () => {
                        const nextMonday = new Date();
                        // Find next Monday
                        nextMonday.setDate(nextMonday.getDate() + (1 + 7 - nextMonday.getDay()) % 7);
                        if (nextMonday.getDay() === 1 && nextMonday.getDate() === new Date().getDate()) { // If today is Monday
                            nextMonday.setDate(nextMonday.getDate() + 7); // Go to next Monday
                        }
                        return { date: nextMonday.toISOString().split('T')[0], time: '09:00' };
                      }}
                    ].map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const { date, time } = option.getValue();
                          setScheduleDate(date);
                          setScheduleTime(time);
                        }}
                        className="text-xs"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowScheduleModal(false)}>ביטול</Button>
                  <Button
                    onClick={handleScheduleSend}
                    disabled={!scheduleDate || !scheduleTime || email.to.length === 0 || !email.subject.trim() || !email.body.trim()}
                    className="bg-gradient-to-r from-purple-500 to-pink-600"
                  >
                    <Clock className="w-4 h-4 ml-2" />
                    תזמן שליחה
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
