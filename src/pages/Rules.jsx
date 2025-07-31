
import React, { useState, useEffect } from 'react';
import { Rule } from '../components/MockAPI';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Plus, Edit, Trash2, X, Filter, CheckCircle, AlertCircle, Zap
} from 'lucide-react';

export default function RulesPage() {
  const [rules, setRules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [newRule, setNewRule] = useState({
    name: '',
    conditions: {
      from: '',
      to: '',
      subject: '',
      body_contains: '',
      has_attachments: false
    },
    actions: {
      move_to_folder: '',
      add_label: '',
      mark_as_read: false,
      mark_as_starred: false,
      forward_to: '',
      delete: false
    },
    is_active: true
  });

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    const fetchedRules = await Rule.list('-created_date');
    setRules(fetchedRules);
  };

  const handleSaveRule = async () => {
    try {
      if (!newRule.name.trim()) return;
      
      if (editingRule) {
        await Rule.update(editingRule.id, newRule);
      } else {
        await Rule.create(newRule);
      }
      
      setShowForm(false);
      setEditingRule(null);
      resetForm();
      loadRules();
    } catch (error) {
      console.error('Error saving rule:', error);
    }
  };

  const resetForm = () => {
    setNewRule({
      name: '',
      conditions: {
        from: '',
        to: '',
        subject: '',
        body_contains: '',
        has_attachments: false
      },
      actions: {
        move_to_folder: '',
        add_label: '',
        mark_as_read: false,
        mark_as_starred: false,
        forward_to: '',
        delete: false
      },
      is_active: true
    });
  };

  const handleEditRule = (rule) => {
    setEditingRule(rule);
    setNewRule({
      name: rule.name,
      conditions: { ...rule.conditions },
      actions: { ...rule.actions },
      is_active: rule.is_active
    });
    setShowForm(true);
  };

  const handleDeleteRule = async (ruleId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הכלל?')) {
      await Rule.delete(ruleId);
      loadRules();
    }
  };

  const toggleRuleStatus = async (rule) => {
    await Rule.update(rule.id, { ...rule, is_active: !rule.is_active });
    loadRules();
  };

  const updateCondition = (field, value) => {
    setNewRule(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [field]: value
      }
    }));
  };

  const updateAction = (field, value) => {
    setNewRule(prev => ({
      ...prev,
      actions: {
        ...prev.actions,
        [field]: value
      }
    }));
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 overflow-hidden" dir="rtl">
      {/* Header */}
      <motion.div 
        className="p-6 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-20"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg"
              whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.3 }}
            >
              <Settings className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold">כללים ופילטרים</h1>
              <p className="text-gray-500">נהל כללים אוטומטיים לארגון המיילים שלך</p>
            </div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-600"
            >
              <Plus className="w-4 h-4 ml-2" />
              יצירת כלל חדש
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Rules List */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          <AnimatePresence>
            {rules.map((rule, index) => (
              <motion.div
                key={rule.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Switch
                              checked={rule.is_active}
                              onCheckedChange={() => toggleRuleStatus(rule)}
                            />
                          </motion.div>
                          <h3 className={`font-semibold text-lg ${!rule.is_active ? 'text-gray-500' : 'text-gray-800'}`}>
                            {rule.name}
                          </h3>
                          <Badge variant={rule.is_active ? "default" : "secondary"}>
                            {rule.is_active ? 'פעיל' : 'לא פעיל'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">תנאים:</span>
                            <div className="flex flex-wrap gap-2">
                              {rule.conditions.from && (
                                <Badge variant="outline">משולח: {rule.conditions.from}</Badge>
                              )}
                              {rule.conditions.subject && (
                                <Badge variant="outline">נושא: {rule.conditions.subject}</Badge>
                              )}
                              {rule.conditions.body_contains && (
                                <Badge variant="outline">מכיל: {rule.conditions.body_contains}</Badge>
                              )}
                              {rule.conditions.has_attachments && (
                                <Badge variant="outline">עם קבצים מצורפים</Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-green-500" />
                            <span className="font-medium">פעולות:</span>
                            <div className="flex flex-wrap gap-2">
                              {rule.actions.move_to_folder && (
                                <Badge variant="outline" className="bg-blue-50">העבר ל: {rule.actions.move_to_folder}</Badge>
                              )}
                              {rule.actions.add_label && (
                                <Badge variant="outline" className="bg-green-50">הוסף תווית: {rule.actions.add_label}</Badge>
                              )}
                              {rule.actions.mark_as_read && (
                                <Badge variant="outline" className="bg-yellow-50">סמן כנקרא</Badge>
                              )}
                              {rule.actions.mark_as_starred && (
                                <Badge variant="outline" className="bg-orange-50">סמן בכוכב</Badge>
                              )}
                              {rule.actions.delete && (
                                <Badge variant="outline" className="bg-red-50">מחק</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button variant="ghost" size="icon" onClick={() => handleEditRule(rule)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteRule(rule.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {rules.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">אין כללים מוגדרים</h3>
              <p className="text-gray-400 mb-4">צור כלל ראשון כדי להתחיל לארגן את המיילים שלך אוטומטית</p>
              <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-purple-500 to-pink-600">
                <Plus className="w-4 h-4 ml-2" />
                יצירת כלל ראשון
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Add/Edit Rule Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
            >
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">
                    {editingRule ? 'עריכת כלל' : 'יצירת כלל חדש'}
                  </h2>
                  <Button variant="ghost" size="icon" onClick={() => {
                    setShowForm(false);
                    setEditingRule(null);
                    resetForm();
                  }}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                {/* Rule Name */}
                <div className="space-y-2">
                  <Label htmlFor="rule_name">שם הכלל *</Label>
                  <Input
                    id="rule_name"
                    value={newRule.name}
                    onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="שם תיאורי לכלל"
                  />
                </div>

                {/* Conditions */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-500" />
                    תנאי הכלל
                  </h3>
                  <p className="text-sm text-gray-500">הכלל יופעל כאשר מייל עומד בתנאים הבאים:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="from_condition">משולח</Label>
                      <Input
                        id="from_condition"
                        value={newRule.conditions.from}
                        onChange={(e) => updateCondition('from', e.target.value)}
                        placeholder="example@domain.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="to_condition">אל נמען</Label>
                      <Input
                        id="to_condition"
                        value={newRule.conditions.to}
                        onChange={(e) => updateCondition('to', e.target.value)}
                        placeholder="my@email.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject_condition">נושא מכיל</Label>
                      <Input
                        id="subject_condition"
                        value={newRule.conditions.subject}
                        onChange={(e) => updateCondition('subject', e.target.value)}
                        placeholder="מילות מפתח בנושא"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="body_condition">תוכן מכיל</Label>
                      <Input
                        id="body_condition"
                        value={newRule.conditions.body_contains}
                        onChange={(e) => updateCondition('body_contains', e.target.value)}
                        placeholder="מילות מפתח בתוכן"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch
                      id="has_attachments"
                      checked={newRule.conditions.has_attachments}
                      onCheckedChange={(checked) => updateCondition('has_attachments', checked)}
                    />
                    <Label htmlFor="has_attachments">יש קבצים מצורפים</Label>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-500" />
                    פעולות לביצוע
                  </h3>
                  <p className="text-sm text-gray-500">כאשר מייל עומד בתנאים, בצע את הפעולות הבאות:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="move_folder">העבר לתיקייה</Label>
                      <Select value={newRule.actions.move_to_folder} onValueChange={(value) => updateAction('move_to_folder', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="בחר תיקייה" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={null}>ללא העברה</SelectItem>
                          <SelectItem value="inbox">דואר נכנס</SelectItem>
                          <SelectItem value="sent">נשלח</SelectItem>
                          <SelectItem value="drafts">טיוטות</SelectItem>
                          <SelectItem value="junk">זבל</SelectItem>
                          <SelectItem value="trash">פח אשפה</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="add_label">הוסף תווית</Label>
                      <Input
                        id="add_label"
                        value={newRule.actions.add_label}
                        onChange={(e) => updateAction('add_label', e.target.value)}
                        placeholder="שם תווית"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="forward_to">העבר למייל</Label>
                      <Input
                        id="forward_to"
                        value={newRule.actions.forward_to}
                        onChange={(e) => updateAction('forward_to', e.target.value)}
                        placeholder="forward@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Switch
                        id="mark_read"
                        checked={newRule.actions.mark_as_read}
                        onCheckedChange={(checked) => updateAction('mark_as_read', checked)}
                      />
                      <Label htmlFor="mark_read">סמן כנקרא</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Switch
                        id="mark_starred"
                        checked={newRule.actions.mark_as_starred}
                        onCheckedChange={(checked) => updateAction('mark_as_starred', checked)}
                      />
                      <Label htmlFor="mark_starred">סמן בכוכב</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Switch
                        id="delete_email"
                        checked={newRule.actions.delete}
                        onCheckedChange={(checked) => updateAction('delete', checked)}
                      />
                      <Label htmlFor="delete_email" className="text-red-600">מחק מייל</Label>
                    </div>
                  </div>
                </div>

                {/* Rule Status */}
                <div className="flex items-center space-x-2 space-x-reverse p-4 bg-gray-50 rounded-lg">
                  <Switch
                    id="rule_active"
                    checked={newRule.is_active}
                    onCheckedChange={(checked) => setNewRule(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="rule_active" className="font-medium">הכלל פעיל</Label>
                  <span className="text-sm text-gray-500">- הכלל יופעל אוטומטיט על מיילים חדשים</span>
                </div>
              </div>
              
              <div className="p-6 border-t flex justify-end gap-3">
                <Button variant="outline" onClick={() => {
                  setShowForm(false);
                  setEditingRule(null);
                  resetForm();
                }}>
                  ביטול
                </Button>
                <Button 
                  onClick={handleSaveRule}
                  disabled={!newRule.name.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-600"
                >
                  {editingRule ? 'עדכן כלל' : 'צור כלל'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
