import React, { useState, useEffect } from 'react';
import { Email } from '../api/realEmailAPI';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search as SearchIcon, Filter, Calendar, Paperclip, Star, User,
  Mail, FileText, Clock, Tag, X, RefreshCw
} from 'lucide-react';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    subject: '',
    hasAttachment: false,
    isStarred: false,
    isUnread: false,
    folder: 'all',
    dateFrom: '',
    dateTo: '',
    labels: []
  });

  const performSearch = async () => {
    if (!searchQuery.trim() && !hasAdvancedFilters()) return;
    
    setIsSearching(true);
    try {
      let emails = await Email.list();
      
      // Apply text search
      if (searchQuery.trim()) {
        emails = emails.filter(email => 
          email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          email.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
          email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
          email.from_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply advanced filters
      if (filters.from) {
        emails = emails.filter(email => 
          email.from.toLowerCase().includes(filters.from.toLowerCase())
        );
      }
      
      if (filters.to) {
        emails = emails.filter(email => 
          email.to.some(recipient => recipient.toLowerCase().includes(filters.to.toLowerCase()))
        );
      }
      
      if (filters.subject) {
        emails = emails.filter(email => 
          email.subject.toLowerCase().includes(filters.subject.toLowerCase())
        );
      }
      
      if (filters.hasAttachment) {
        emails = emails.filter(email => email.attachments && email.attachments.length > 0);
      }
      
      if (filters.isStarred) {
        emails = emails.filter(email => email.is_starred);
      }
      
      if (filters.isUnread) {
        emails = emails.filter(email => !email.is_read);
      }
      
      if (filters.folder !== 'all') {
        emails = emails.filter(email => email.folder === filters.folder);
      }
      
      if (filters.dateFrom) {
        emails = emails.filter(email => new Date(email.date) >= new Date(filters.dateFrom));
      }
      
      if (filters.dateTo) {
        emails = emails.filter(email => new Date(email.date) <= new Date(filters.dateTo));
      }
      
      setSearchResults(emails);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const hasAdvancedFilters = () => {
    return filters.from || filters.to || filters.subject || filters.hasAttachment || 
           filters.isStarred || filters.isUnread || filters.folder !== 'all' ||
           filters.dateFrom || filters.dateTo;
  };

  const clearFilters = () => {
    setFilters({
      from: '',
      to: '',
      subject: '',
      hasAttachment: false,
      isStarred: false,
      isUnread: false,
      folder: 'all',
      dateFrom: '',
      dateTo: '',
      labels: []
    });
    setSearchQuery('');
    setSearchResults([]);
  };

  const getSearchOperators = () => [
    { operator: 'from:', description: 'חיפוש לפי שולח', example: 'from:manager@company.com' },
    { operator: 'to:', description: 'חיפוש לפי נמען', example: 'to:me@example.com' },
    { operator: 'subject:', description: 'חיפוש בנושא', example: 'subject:דוח חודשי' },
    { operator: 'has:attachment', description: 'מיילים עם קבצים מצורפים', example: 'has:attachment' },
    { operator: 'is:unread', description: 'מיילים לא נקראים', example: 'is:unread' },
    { operator: 'is:starred', description: 'מיילים מסומנים בכוכב', example: 'is:starred' },
    { operator: 'after:', description: 'מיילים אחרי תאריך', example: 'after:2024/01/01' },
    { operator: 'before:', description: 'מיילים לפני תאריך', example: 'before:2024/12/31' }
  ];

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 overflow-hidden" dir="rtl">
      {/* Header */}
      <motion.div 
        className="p-6 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-20"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg"
            whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.3 }}
          >
            <SearchIcon className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold">חיפוש מתקדם</h1>
            <p className="text-gray-500">מצא בדיוק את המייל שאתה מחפש</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="חפש במיילים... (השתמש באופרטורים כמו from:, subject:, has:attachment)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && performSearch()}
              className="pr-12 text-lg"
            />
          </div>
          <Button onClick={performSearch} disabled={isSearching} className="bg-gradient-to-r from-blue-500 to-indigo-600">
            {isSearching ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <RefreshCw className="w-4 h-4" />
              </motion.div>
            ) : (
              <SearchIcon className="w-4 h-4" />
            )}
            חפש
          </Button>
          <Button variant="outline" onClick={() => setShowAdvanced(!showAdvanced)}>
            <Filter className="w-4 h-4 ml-2" />
            חיפוש מתקדם
          </Button>
        </div>
      </motion.div>

      <div className="flex-1 flex overflow-hidden">
        {/* Advanced Search Panel */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              className="w-80 bg-white/60 backdrop-blur-sm border-l border-gray-200/50 p-6 overflow-y-auto"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg">פילטרים מתקדמים</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowAdvanced(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="from_filter">משולח</Label>
                  <Input
                    id="from_filter"
                    placeholder="כתובת מייל של השולח"
                    value={filters.from}
                    onChange={(e) => setFilters(prev => ({ ...prev, from: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to_filter">אל נמען</Label>
                  <Input
                    id="to_filter"
                    placeholder="כתובת מייל של הנמען"
                    value={filters.to}
                    onChange={(e) => setFilters(prev => ({ ...prev, to: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject_filter">נושא</Label>
                  <Input
                    id="subject_filter"
                    placeholder="מילות מפתח בנושא"
                    value={filters.subject}
                    onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="folder_filter">תיקייה</Label>
                  <select
                    id="folder_filter"
                    value={filters.folder}
                    onChange={(e) => setFilters(prev => ({ ...prev, folder: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="all">כל התיקיות</option>
                    <option value="inbox">דואר נכנס</option>
                    <option value="sent">נשלח</option>
                    <option value="drafts">טיוטות</option>
                    <option value="junk">זבל</option>
                    <option value="trash">פח אשפה</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch
                      id="has_attachment"
                      checked={filters.hasAttachment}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasAttachment: checked }))}
                    />
                    <Label htmlFor="has_attachment">יש קבצים מצורפים</Label>
                  </div>

                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch
                      id="is_starred"
                      checked={filters.isStarred}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, isStarred: checked }))}
                    />
                    <Label htmlFor="is_starred">מסומן בכוכב</Label>
                  </div>

                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch
                      id="is_unread"
                      checked={filters.isUnread}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, isUnread: checked }))}
                    />
                    <Label htmlFor="is_unread">לא נקרא</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>טווח תאריכים</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <Input
                      type="date"
                      placeholder="מתאריך"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    />
                    <Input
                      type="date"
                      placeholder="עד תאריך"
                      value={filters.dateTo}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    נקה פילטרים
                  </Button>
                </div>
              </div>

              {/* Search Operators Help */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-3">אופרטורי חיפוש</h4>
                <div className="space-y-2 text-sm">
                  {getSearchOperators().map((op, index) => (
                    <div key={index} className="text-blue-700">
                      <code className="bg-blue-100 px-1 rounded">{op.operator}</code>
                      <span className="text-blue-600 text-xs block">{op.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results */}
        <motion.div 
          className="flex-1 p-6 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">תוצאות חיפוש ({searchResults.length})</h3>
                <Button variant="outline" onClick={clearFilters}>
                  <X className="w-4 h-4 ml-2" />
                  נקה חיפוש
                </Button>
              </div>

              {searchResults.map((email, index) => (
                <motion.div
                  key={email.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <motion.div
                              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold"
                              whileHover={{ rotate: [0, -10, 10, 0] }}
                            >
                              {email.from_name.charAt(0)}
                            </motion.div>
                            <div>
                              <p className="font-semibold">{email.from_name}</p>
                              <p className="text-sm text-gray-500">{email.from}</p>
                            </div>
                          </div>
                          
                          <h4 className="font-semibold mb-1">{email.subject}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {email.body.replace(/<[^>]*>/g, '').substring(0, 150)}...
                          </p>
                          
                          <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(email.date).toLocaleDateString('he-IL')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(email.date).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            {email.folder && (
                              <Badge variant="outline" className="text-xs">
                                {email.folder}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          {email.is_starred && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                          {!email.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                          {email.labels && email.labels.map(label => (
                            <Badge key={label} variant="secondary" className="text-xs">
                              {label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="flex items-center justify-center h-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  {searchQuery || hasAdvancedFilters() ? 'לא נמצאו תוצאות' : 'התחל לחפש'}
                </h3>
                <p className="text-gray-400">
                  {searchQuery || hasAdvancedFilters() 
                    ? 'נסה לשנות את תנאי החיפוש' 
                    : 'הקלד מילות מפתח או השתמש בחיפוש מתקדם'
                  }
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}