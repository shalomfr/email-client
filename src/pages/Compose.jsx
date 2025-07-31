// Example content of the file, ensure all uppercase letters are converted to lowercase

<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Email } from '../api/realEmailAPI';
import { Contact, Template } from '../components/MockAPI';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
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
=======
const compose = () => {
    return (
        <div>
            <h1>Compose</h1>
>>>>>>> 379f83dac5c6ad76f49f4b87ae9b6528d5afc7ac
        </div>
    );
};

export default compose;