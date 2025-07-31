
import React, { useState, useEffect } from 'react';
import { Task } from '../components/MockAPI';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardCheck, Plus, Search, Edit, Trash2, Calendar, Flag, User, X
} from 'lucide-react';

const statusMap = {
  pending: { label: 'ממתין', color: 'bg-yellow-500' },
  in_progress: { label: 'בתהליך', color: 'bg-blue-500' },
  completed: { label: 'הושלם', color: 'bg-green-500' },
  cancelled: { label: 'בוטל', color: 'bg-red-500' },
};

const priorityMap = {
  low: { label: 'נמוכה', color: 'text-gray-500' },
  medium: { label: 'בינונית', color: 'text-blue-500' },
  high: { label: 'גבוהה', color: 'text-orange-500' },
  urgent: { label: 'דחופה', color: 'text-red-500' },
};

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', due_date: '' });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const fetchedTasks = await Task.list('-created_date');
    setTasks(fetchedTasks);
  };

  const handleSaveTask = async () => {
    try {
      if (editingTask) {
        await Task.update(editingTask.id, newTask);
      } else {
        await Task.create({ ...newTask, status: 'pending' });
      }
      setShowForm(false);
      setEditingTask(null);
      setNewTask({ title: '', description: '', priority: 'medium', due_date: '' });
      loadTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      due_date: task.due_date ? new Date(task.due_date).toISOString().substring(0, 10) : ''
    });
    setShowForm(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את המשימה?')) {
      await Task.delete(taskId);
      loadTasks();
    }
  };

  const toggleTaskStatus = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await Task.update(task.id, { status: newStatus });
    loadTasks();
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
              whileHover={{ scale: 1.1 }}
            >
              <ClipboardCheck className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold">ניהול משימות</h1>
              <p className="text-gray-500">עקוב אחר המשימות שלך והישאר מאורגן</p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-purple-500 to-pink-600">
              <Plus className="w-4 h-4 ml-2" />
              משימה חדשה
            </Button>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Tasks List */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          <AnimatePresence>
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className={`bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300 ${task.status === 'completed' ? 'opacity-60' : ''}`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <button onClick={() => toggleTaskStatus(task)} className="flex items-center justify-center w-6 h-6 border-2 rounded-full transition-all duration-300
                        ${task.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-blue-500'}"
                      >
                        {task.status === 'completed' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><ClipboardCheck className="w-4 h-4 text-white" /></motion.div>}
                      </button>
                    </motion.div>
                    
                    <div className="flex-1">
                      <p className={`font-semibold ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.title}
                      </p>
                      {task.description && <p className="text-sm text-gray-500">{task.description}</p>}
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        {task.due_date && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(task.due_date).toLocaleDateString('he-IL')}
                          </Badge>
                        )}
                        <Badge variant="outline" className={`flex items-center gap-1 ${priorityMap[task.priority]?.color}`}>
                          <Flag className="w-3 h-3" />
                          {priorityMap[task.priority]?.label}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditTask(task)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Add/Edit Task Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {editingTask ? 'עריכת משימה' : 'משימה חדשה'}
                  <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">כותרת *</Label>
                  <Input id="title" value={newTask.title} onChange={(e) => setNewTask(p => ({...p, title: e.target.value}))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">תיאור</Label>
                  <Input id="description" value={newTask.description} onChange={(e) => setNewTask(p => ({...p, description: e.target.value}))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="due_date">תאריך יעד</Label>
                    <Input id="due_date" type="date" value={newTask.due_date} onChange={(e) => setNewTask(p => ({...p, due_date: e.target.value}))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">עדיפות</Label>
                    <select id="priority" value={newTask.priority} onChange={(e) => setNewTask(p => ({...p, priority: e.target.value}))} className="w-full p-2 border rounded-md">
                      <option value="low">נמוכה</option>
                      <option value="medium">בינונית</option>
                      <option value="high">גבוהה</option>
                      <option value="urgent">דחופה</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowForm(false)}>ביטול</Button>
                  <Button onClick={handleSaveTask} disabled={!newTask.title} className="bg-gradient-to-r from-purple-500 to-pink-600">שמור משימה</Button>
                </div>
              </CardContent>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
