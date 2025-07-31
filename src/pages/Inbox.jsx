
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Email } from '../api/realEmailAPI';

import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, Trash2, Archive, RefreshCw, Filter, SortAsc,
  Clock, Paperclip, Flag, Eye, EyeOff, MoreHorizontal, Reply,
  Forward, Download, Zap, ClipboardCheck, X, Mail
} from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

const folderNames = {
  inbox: 'דואר נכנס',
  starred: 'מסומן בכוכב',
  sent: 'נשלח',
  drafts: 'טיוטות',
  junk: 'זבל',
  trash: 'פח אשפה'
};

const folderColors = {
  inbox: 'from-blue-500 to-indigo-600',
  starred: 'from-yellow-500 to-orange-600',
  sent: 'from-green-500 to-emerald-600',
  drafts: 'from-gray-500 to-slate-600',
  junk: 'from-orange-500 to-red-600',
  trash: 'from-red-500 to-rose-600'
};

function ToolBar({ folder, onRefresh, onFilter, onSort }) {
  return (
    <motion.div
      className="p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-20"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            className={`px-4 py-2 rounded-xl bg-gradient-to-r ${folderColors[folder]} text-white shadow-lg`}
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <h2 className="text-lg font-bold">{folderNames[folder]}</h2>
          </motion.div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onFilter}>
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onSort}>
            <SortAsc className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function InboxPage() {
  const location = useLocation();
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const searchParams = new URLSearchParams(location.search);
  const folder = searchParams.get('folder') || 'inbox';

  useEffect(() => {
    loadEmails();
  }, [folder]);

  const loadEmails = async () => {
    setLoading(true);
    console.log('Loading emails for folder:', folder);
    try {
      const fetchedEmails = await Email.filter({ folder });
      console.log('Fetched emails:', fetchedEmails);
      console.log('First email details:', fetchedEmails[0]);
      setEmails(fetchedEmails);
      if (fetchedEmails.length > 0 && !selectedEmail) {
        setSelectedEmail(fetchedEmails[0]);
      }
    } catch (error) {
      console.error('Error loading emails:', error);
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadEmails();
  };

  const handleFilter = () => {
    console.log('Filter clicked');
  };

  const handleSort = () => {
    console.log('Sort clicked');
  };

  const handleStar = async (email) => {
    try {
      await Email.update(email.id, { is_starred: !email.is_starred });
      loadEmails();
    } catch (error) {
      console.error('Error updating email:', error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      <ToolBar 
        folder={folder}
        onRefresh={handleRefresh}
        onFilter={handleFilter}
        onSort={handleSort}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Email List */}
        <motion.div
          className="bg-white/60 backdrop-blur-sm border-l border-gray-200/50 w-full md:w-96 flex-shrink-0 flex flex-col shadow-xl overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="p-4 border-b border-gray-200/50 bg-white/90 backdrop-blur-sm flex-shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">
                {emails.length} הודעות
              </span>
            </div>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
                  <p className="text-gray-500">טוען הודעות...</p>
                </div>
              </div>
            ) : emails.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Mail className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">אין הודעות בתיקייה זו</p>
                  <p className="text-xs text-gray-400 mt-2">Loading: {loading.toString()}, Count: {emails.length}</p>
                </div>
              </div>
            ) : (
              <AnimatePresence>
                {console.log('Rendering emails:', emails.length, emails)}
                {emails.map((email, index) => {
                  console.log('Rendering email:', index, email);
                  return (
                <motion.div
                  key={email.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                  whileHover={{
                    scale: 1.02,
                    y: -2
                  }}
                  style={{ boxShadow: "0 0 0 rgba(0,0,0,0)" }}
                  onClick={() => setSelectedEmail(email)}
                  className={`flex items-start gap-3 p-4 border-b border-gray-100/50 cursor-pointer transition-all duration-300 relative overflow-hidden ${
                    selectedEmail?.id === email.id
                      ? 'bg-gradient-to-l from-blue-50 to-indigo-50 border-blue-200'
                      : 'hover:bg-gray-50/80'
                  } ${!email.is_read ? 'bg-blue-50/30' : ''}`}
                >
                  <motion.div
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg"
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {(email.from_name || email.from || 'U').charAt(0).toUpperCase()}
                  </motion.div>

                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-semibold text-sm ${!email.is_read ? 'text-gray-900' : 'text-gray-600'}`}>
                        {email.from_name || email.from || 'Unknown'}
                      </span>
                      <div className="flex items-center gap-1">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStar(email);
                          }}
                          whileHover={{ scale: 1.2, rotate: 15 }}
                          whileTap={{ scale: 0.8 }}
                          className="p-1"
                        >
                          <Star 
                            className={`w-4 h-4 ${email.is_starred ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} 
                          />
                        </motion.button>
                        <span className="text-xs text-gray-500">
                          {email.date ? format(new Date(email.date), 'HH:mm', { locale: he }) : ''}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className={`text-sm mb-1 line-clamp-1 ${!email.is_read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {email.subject || '(ללא נושא)'}
                    </h3>
                    
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {email.body ? email.body.replace(/<[^>]*>/g, '') : ''}
                    </p>

                    {email.labels && email.labels.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {email.labels.slice(0, 2).map((label, labelIndex) => (
                          <motion.span
                            key={labelIndex}
                            className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 * labelIndex }}
                          >
                            {label}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </motion.div>

        {/* Email Content */}
        <motion.div 
          className="flex-1 bg-white/40 backdrop-blur-sm flex flex-col overflow-hidden"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {selectedEmail ? (
            <motion.div 
              className="h-full flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Email Header */}
              <div className="p-6 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.3 }}
                                          >
                        {(selectedEmail.from_name || selectedEmail.from || 'U').charAt(0).toUpperCase()}
                      </motion.div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{selectedEmail.from_name || selectedEmail.from || 'Unknown'}</h2>
                      <p className="text-sm text-gray-600">{selectedEmail.from}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {[Reply, Forward, Archive, Trash2].map((Icon, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button variant="ghost" size="icon">
                          <Icon className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <motion.h1 
                  className="text-xl font-bold text-gray-900 mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {selectedEmail.subject}
                </motion.h1>
                
                <motion.p 
                  className="text-sm text-gray-600"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                                      {selectedEmail.date ? format(new Date(selectedEmail.date), 'dd/MM/yyyy בשעה HH:mm', { locale: he }) : 'תאריך לא זמין'}
                </motion.p>
              </div>

              {/* Email Body */}
              <motion.div 
                className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div 
                  className="prose prose-gray max-w-none leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              className="h-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <Zap className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">בחר מייל לקריאה</h3>
                <p className="text-gray-500">לחץ על מייל מהרשימה כדי לקרוא אותו</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
