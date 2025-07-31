
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Mail, Edit, Send, Star, Trash2, Archive, Inbox, Settings, Menu, X, User, Search,
  Bell, Plus, Filter, SortAsc, RefreshCw, Zap, Calendar, Users, FolderOpen, Tag, ClipboardCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const folders = [
  { name: 'דואר נכנס', icon: Inbox, folder: 'inbox', page: 'Inbox', count: 12, color: 'text-blue-600' },
  { name: 'מסומן בכוכב', icon: Star, folder: 'starred', page: 'Inbox', count: 3, color: 'text-yellow-600' },
  { name: 'נשלח', icon: Send, folder: 'sent', page: 'Inbox', count: 0, color: 'text-green-600' },
  { name: 'טיוטות', icon: Edit, folder: 'drafts', page: 'Inbox', count: 1, color: 'text-gray-600' },
  { name: 'זבל', icon: Archive, folder: 'junk', page: 'Inbox', count: 5, color: 'text-orange-600' },
  { name: 'פח אשפה', icon: Trash2, folder: 'trash', page: 'Inbox', count: 0, color: 'text-red-600' },
];

const navigationPages = [
  { name: 'כתיבת מייל', page: 'Compose', icon: Edit, color: 'text-purple-600' },
  { name: 'חיפוש מתקדם', page: 'Search', icon: Search, color: 'text-blue-600' },
  { name: 'פיצ\'רים חכמים', page: 'SmartFeatures', icon: Zap, color: 'text-pink-600' },
  { name: 'אנשי קשר', page: 'Contacts', icon: Users, color: 'text-green-600' },
  { name: 'משימות', page: 'Tasks', icon: ClipboardCheck, color: 'text-pink-600' },
  { name: 'תוויות', page: 'Labels', icon: Tag, color: 'text-orange-600' },
  { name: 'כללים', page: 'Rules', icon: Settings, color: 'text-indigo-600' },
];

const sidebarVariants = {
  open: { 
    x: 0, 
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30,
      staggerChildren: 0.1,
      delayChildren: 0.2
    } 
  },
  closed: { 
    x: "100%", 
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30 
    } 
  }
};

const itemVariants = {
  open: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
  closed: { opacity: 0, x: 20, transition: { duration: 0.2 } }
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState(3);

  const isActive = (page, folder) => {
    const searchParams = new URLSearchParams(location.search);
    const currentFolder = searchParams.get('folder') || 'inbox';
    const currentPath = location.pathname.replace('/', '');
    return currentPath.toLowerCase() === page.toLowerCase() && currentFolder === folder;
  };

  const handleSearch = (e) => {
      if (e.key === 'Enter') {
          navigate(`/Search?q=${searchQuery}`);
      }
  }

  const SidebarContent = () => (
    <motion.div 
      className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-800 backdrop-blur-sm overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100"
      variants={sidebarVariants}
      initial="closed"
      animate="open"
    >
      {/* Header */}
      <motion.div 
        className="p-6 border-b border-gray-200/50 sticky top-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 z-10"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg"
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <Mail className="text-white w-6 h-6" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                דואר מתקדם
              </h1>
              <p className="text-xs text-gray-500">מערכת ניהול מיילים</p>
            </div>
          </motion.div>
          {notifications > 0 && (
            <motion.div
              className="relative"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <motion.span 
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
              >
                {notifications}
              </motion.span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div className="p-4" variants={itemVariants}>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="חיפוש במיילים..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearch}
            className="pr-10 bg-white/70 backdrop-blur-sm border-gray-200/50 focus:bg-white transition-all duration-300"
          />
        </div>
      </motion.div>

      {/* New Mail Button */}
      <motion.div className="px-4 mb-6" variants={itemVariants}>
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link to={"/Compose"}>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ x: 2 }}
              >
                <Edit className="w-4 h-4" />
                מייל חדש
              </motion.div>
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Navigation Pages */}
      <motion.nav className="px-2 mb-4" variants={itemVariants}>
        <motion.div
          initial="closed"
          animate="open"
          variants={{
            open: {
              transition: { staggerChildren: 0.1, delayChildren: 0.2 }
            }
          }}
        >
          {navigationPages.map((item, index) => (
            <motion.div
              key={item.name}
              variants={{
                open: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 24
                  }
                },
                closed: { opacity: 0, y: 20 }
              }}
            >
              <Link
                to={`/${item.page}`}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group mb-1 ${
                  currentPageName.toLowerCase() === item.page.toLowerCase()
                    ? 'bg-white/80 backdrop-blur-sm shadow-md border border-blue-200/50'
                    : 'hover:bg-white/50 backdrop-blur-sm'
                }`}
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <item.icon className={`w-5 h-5 ${currentPageName.toLowerCase() === item.page.toLowerCase() ? item.color : 'text-gray-600 group-hover:' + item.color}`} />
                </motion.div>
                <span className={`font-medium ${currentPageName.toLowerCase() === item.page.toLowerCase() ? 'text-gray-900' : 'text-gray-700'}`}>
                  {item.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.nav>

      {/* Folders Navigation */}
      <motion.nav className="flex-1 px-2 space-y-1 overflow-y-auto" variants={itemVariants}>
        <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider px-3">תיקיות</p>
        <motion.div
          initial="closed"
          animate="open"
          variants={{
            open: {
              transition: { staggerChildren: 0.1, delayChildren: 0.3 }
            }
          }}
        >
          {folders.map((item, index) => (
            <motion.div
              key={item.name}
              variants={{
                open: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 24
                  }
                },
                closed: { opacity: 0, y: 20 }
              }}
            >
              <Link
                to={`/${item.page}?folder=${item.folder}`}
                className={`flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-300 group ${
                  isActive(item.page, item.folder)
                    ? 'bg-white/80 backdrop-blur-sm shadow-md border border-blue-200/50'
                    : 'hover:bg-white/50 backdrop-blur-sm'
                }`}
              >
                <motion.div 
                  className="flex items-center gap-3"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <item.icon className={`w-5 h-5 ${isActive(item.page, item.folder) ? item.color : 'text-gray-600 group-hover:' + item.color}`} />
                  </motion.div>
                  <span className={`font-medium ${isActive(item.page, item.folder) ? 'text-gray-900' : 'text-gray-700'}`}>
                    {item.name}
                  </span>
                </motion.div>
                {item.count > 0 && (
                  <motion.span 
                    className={`text-xs px-2 py-1 rounded-full ${
                      isActive(item.page, item.folder) 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, delay: index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {item.count}
                  </motion.span>
                )}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.nav>

      {/* Settings and User */}
      <motion.div className="p-4 border-t border-gray-200/50 space-y-3" variants={itemVariants}>
        <Link
          to={"/Settings"}
          className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group ${
            currentPageName === 'Settings' 
              ? 'bg-white/80 backdrop-blur-sm shadow-md border border-gray-200/50' 
              : 'hover:bg-white/50 backdrop-blur-sm'
          }`}
        >
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.3 }}
          >
            <Settings className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
          </motion.div>
          <span className="font-medium text-gray-700">הגדרות</span>
        </Link>
        
        <motion.div 
          className="flex items-center gap-3 px-3 py-2 bg-white/30 rounded-xl backdrop-blur-sm"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <User className="w-8 h-8 p-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">משתמש</p>
            <p className="text-xs text-gray-500 truncate">user@example.com</p>
          </div>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="h-screen w-full flex bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50" dir="rtl">
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
              <motion.div
                className="relative w-80 max-w-[calc(100%-3rem)] h-full shadow-2xl ml-auto"
                variants={sidebarVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <SidebarContent />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 border-l border-gray-200/50 shadow-xl backdrop-blur-sm">
        <SidebarContent />
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Mobile Header */}
        <motion.header 
          className="flex lg:hidden items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200/50"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.h1 
            className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            דואר מתקדם
          </motion.h1>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
              <Menu />
            </Button>
          </motion.div>
        </motion.header>

        {/* Main Content */}
        <div 
          className="flex-1 overflow-y-auto"
        >
          {children}
        </div>
      </main>
    </div>
  );
}
