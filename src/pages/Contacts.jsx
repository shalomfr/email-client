
import React, { useState, useEffect } from 'react';
import { Contact } from '../components/MockAPI';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Plus, Search, Mail, Phone, Building, Edit, 
  Trash2, UserPlus, Filter, Grid, List, Star, X
} from 'lucide-react';

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [filterGroup, setFilterGroup] = useState('all');
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    groups: [],
    notes: ''
  });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    const fetchedContacts = await Contact.list();
    setContacts(fetchedContacts);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGroup = filterGroup === 'all' || 
                        contact.groups?.includes(filterGroup);
    
    return matchesSearch && matchesGroup;
  });

  const handleSaveContact = async () => {
    try {
      if (selectedContact) {
        await Contact.update(selectedContact.id, newContact);
      } else {
        await Contact.create(newContact);
      }
      setShowAddForm(false);
      setSelectedContact(null);
      setNewContact({
        name: '', email: '', phone: '', company: '', position: '', groups: [], notes: ''
      });
      loadContacts();
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setNewContact({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || '',
      company: contact.company || '',
      position: contact.position || '',
      groups: contact.groups || [],
      notes: contact.notes || ''
    });
    setShowAddForm(true);
  };

  const handleDeleteContact = async (contactId) => {
    try {
      await Contact.delete(contactId);
      loadContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const ContactCard = ({ contact, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Card className="h-full bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <motion.div 
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.3 }}
            >
              {contact.name.charAt(0)}
            </motion.div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" onClick={() => handleEditContact(contact)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDeleteContact(contact.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
          
          <h3 className="font-semibold text-lg mb-1">{contact.name}</h3>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="truncate">{contact.email}</span>
            </div>
            
            {contact.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{contact.phone}</span>
              </div>
            )}
            
            {contact.company && (
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                <span className="truncate">{contact.company}</span>
              </div>
            )}
          </div>
          
          {contact.groups && contact.groups.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {contact.groups.slice(0, 2).map((group, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {group}
                </Badge>
              ))}
              {contact.groups.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{contact.groups.length - 2}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 overflow-hidden">
      {/* Header */}
      <motion.div 
        className="p-6 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-20"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg"
              whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.3 }}
            >
              <Users className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold">אנשי קשר</h1>
              <p className="text-gray-500">נהל את רשת הקשרים שלך</p>
            </div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600"
            >
              <Plus className="w-4 h-4 ml-2" />
              אדם קשר חדש
            </Button>
          </motion.div>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="חפש אנשי קשר..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 bg-white/70 backdrop-blur-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence>
          {viewMode === 'grid' ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {filteredContacts.map((contact, index) => (
                <ContactCard key={contact.id} contact={contact} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {filteredContacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                            {contact.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{contact.name}</h3>
                            <p className="text-sm text-gray-600">{contact.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {contact.company && (
                            <Badge variant="outline">{contact.company}</Badge>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => handleEditContact(contact)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteContact(contact.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add/Edit Contact Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
            >
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">
                    {selectedContact ? 'עריכת איש קשר' : 'איש קשר חדש'}
                  </h2>
                  <Button variant="ghost" size="icon" onClick={() => {
                    setShowAddForm(false);
                    setSelectedContact(null);
                    setNewContact({
                      name: '', email: '', phone: '', company: '', position: '', groups: [], notes: ''
                    });
                  }}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
                <div className="space-y-2">
                  <Label htmlFor="name">שם מלא *</Label>
                  <Input
                    id="name"
                    value={newContact.name}
                    onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="שם מלא"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">כתובת מייל *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="example@domain.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">טלפון</Label>
                  <Input
                    id="phone"
                    value={newContact.phone}
                    onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="050-123-4567"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">חברה</Label>
                  <Input
                    id="company"
                    value={newContact.company}
                    onChange={(e) => setNewContact(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="שם החברה"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">תפקיד</Label>
                  <Input
                    id="position"
                    value={newContact.position}
                    onChange={(e) => setNewContact(prev => ({ ...prev, position: e.target.value }))}
                    placeholder="תפקיד בחברה"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">הערות</Label>
                  <textarea
                    id="notes"
                    value={newContact.notes}
                    onChange={(e) => setNewContact(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="הערות נוספות..."
                    className="w-full p-2 border rounded-md resize-none"
                    rows="3"
                  />
                </div>
              </div>
              
              <div className="p-6 border-t flex justify-end gap-3">
                <Button variant="outline" onClick={() => {
                  setShowAddForm(false);
                  setSelectedContact(null);
                  setNewContact({
                    name: '', email: '', phone: '', company: '', position: '', groups: [], notes: ''
                  });
                }}>
                  ביטול
                </Button>
                <Button 
                  onClick={handleSaveContact}
                  disabled={!newContact.name || !newContact.email}
                  className="bg-gradient-to-r from-green-500 to-emerald-600"
                >
                  {selectedContact ? 'עדכן' : 'הוסף'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
