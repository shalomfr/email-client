import React, { useState, useEffect } from 'react';
import { Email } from '../api/realEmailAPI';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

// Mock AI function - replace with real AI integration
const InvokeLLM = async ({ prompt, response_json_schema }) => {
  // Simulate AI response delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock responses based on the schema
  if (response_json_schema.properties.summary) {
    return {
      summary: "זהו סיכום דוגמה של המייל. המייל עוסק בנושאים חשובים.",
      sentiment: "positive",
      priority: "medium"
    };
  }
  
  if (response_json_schema.properties.replies) {
    return {
      replies: [
        "תודה רבה על פנייתך. אחזור אליך בהקדם.",
        "קיבלתי את הודעתך ואטפל בה במהרה.",
        "אשמח לעזור. אצור איתך קשר בקרוב."
      ]
    };
  }
  
  if (response_json_schema.properties.completion) {
    return {
      completion: "בהמשך לשיחתנו, אני רוצה להדגיש כמה נקודות חשובות..."
    };
  }
  
  if (response_json_schema.properties.labels) {
    return {
      labels: ["עבודה", "דחוף"]
    };
  }
  
  return {};
};
import { 
  Brain, Zap, MessageSquare, FileText, Languages, Lightbulb, 
  TrendingUp, Clock, Star, RefreshCw, Send, Sparkles
} from 'lucide-react';

export default function SmartFeaturesPage() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [summary, setSummary] = useState('');
  const [smartReplies, setSmartReplies] = useState([]);
  const [sentiment, setSentiment] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [composeText, setComposeText] = useState('');
  const [smartCompose, setSmartCompose] = useState('');

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    const fetchedEmails = await Email.list('-date', 10);
    setEmails(fetchedEmails);
  };

  const analyzEmail = async (email) => {
    setIsProcessing(true);
    setSelectedEmail(email);
    
    try {
      // Summarize email
      const summaryResponse = await InvokeLLM({
        prompt: `בבקשה תסכם את המייל הבא בעברית במשפט או שניים קצרים:
        
        נושא: ${email.subject}
        תוכן: ${email.body.replace(/<[^>]*>/g, '')}`,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            sentiment: { type: "string", enum: ["positive", "negative", "neutral"] },
            priority: { type: "string", enum: ["low", "medium", "high", "urgent"] }
          }
        }
      });
      
      setSummary(summaryResponse.summary);
      setSentiment(summaryResponse.sentiment);
      
      // Generate smart replies
      const repliesResponse = await InvokeLLM({
        prompt: `צור 3 הצעות תשובה קצרות ומקצועיות בעברית למייל הבא:
        
        נושא: ${email.subject}
        תוכן: ${email.body.replace(/<[^>]*>/g, '')}`,
        response_json_schema: {
          type: "object",
          properties: {
            replies: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });
      
      setSmartReplies(repliesResponse.replies || []);
      
    } catch (error) {
      console.error('Error analyzing email:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateSmartCompose = async () => {
    if (!composeText.trim()) return;
    
    setIsProcessing(true);
    try {
      const response = await InvokeLLM({
        prompt: `השלם את הטקסט הבא באופן מקצועי ומנומס בעברית:
        
        "${composeText}"
        
        אנא תן המשך טבעי ומתאים למייל עסקי.`,
        response_json_schema: {
          type: "object",
          properties: {
            completion: { type: "string" }
          }
        }
      });
      
      setSmartCompose(response.completion);
    } catch (error) {
      console.error('Error generating smart compose:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😟';
      default: return '😐';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 overflow-hidden" dir="rtl">
      {/* Header */}
      <motion.div 
        className="p-6 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-20"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg"
            whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.3 }}
          >
            <Brain className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold">פיצ'רים חכמים</h1>
            <p className="text-gray-500">כלים מתקדמים מבוססי בינה מלאכותית</p>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 flex overflow-hidden">
        {/* Emails List */}
        <motion.div 
          className="w-80 bg-white/60 backdrop-blur-sm border-l border-gray-200/50 p-4 overflow-y-auto"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            מיילים לניתוח
          </h3>
          <div className="space-y-2">
            {emails.map((email, index) => (
              <motion.div
                key={email.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                  selectedEmail?.id === email.id 
                    ? 'bg-blue-100 border-blue-200 border' 
                    : 'bg-white/80 hover:bg-gray-50'
                }`}
                onClick={() => analyzEmail(email)}
              >
                <p className="font-medium text-sm truncate">{email.subject}</p>
                <p className="text-xs text-gray-500 truncate">{email.from_name}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">
                    {new Date(email.date).toLocaleDateString('he-IL')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Analysis Results */}
        <motion.div 
          className="flex-1 p-6 overflow-y-auto"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {!selectedEmail ? (
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
                  <Brain className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">בחר מייל לניתוח</h3>
                <p className="text-gray-400">הבינה המלאכותית תנתח את המייל ותציע תובנות חכמות</p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Email Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      סיכום חכם
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </motion.div>
                        <span>מנתח מייל...</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-gray-700">{summary}</p>
                        {sentiment && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">רגש:</span>
                            <Badge className={getSentimentColor(sentiment)}>
                              {getSentimentIcon(sentiment)} {sentiment === 'positive' ? 'חיובי' : sentiment === 'negative' ? 'שלילי' : 'נייטרלי'}
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Smart Replies */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-green-500" />
                      תשובות חכמות
                    </CardTitle>
                    <CardDescription>הצעות תשובה מהירות למייל</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {smartReplies.length > 0 ? (
                      <div className="space-y-2">
                        {smartReplies.map((reply, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                            className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                            onClick={() => {
                              window.location.href = `/Compose?reply=${selectedEmail.id}&suggestion=${encodeURIComponent(reply)}`;
                            }}
                          >
                            <p className="text-sm">{reply}</p>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      !isProcessing && <p className="text-gray-500">אין הצעות תשובה זמינות</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Smart Compose */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      כתיבה חכמה
                    </CardTitle>
                    <CardDescription>התחל לכתוב והבינה המלאכותית תעזור להשלים</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        placeholder="התחל לכתוב מייל..."
                        value={composeText}
                        onChange={(e) => setComposeText(e.target.value)}
                      />
                      <Button 
                        onClick={generateSmartCompose}
                        disabled={!composeText.trim() || isProcessing}
                        className="bg-gradient-to-r from-yellow-500 to-orange-600"
                      >
                        <Zap className="w-4 h-4 ml-2" />
                        השלם בחכמה
                      </Button>
                    </div>
                    
                    {smartCompose && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                      >
                        <h4 className="font-medium text-yellow-800 mb-2">הצעת השלמה:</h4>
                        <p className="text-gray-700">{smartCompose}</p>
                        <Button 
                          size="sm" 
                          className="mt-3 bg-gradient-to-r from-blue-500 to-indigo-600"
                          onClick={() => {
                            window.location.href = `/Compose?content=${encodeURIComponent(composeText + ' ' + smartCompose)}`;
                          }}
                        >
                          <Send className="w-4 h-4 ml-2" />
                          השתמש בהצעה
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Analytics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      תובנות פרודוקטיביות
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{emails.length}</div>
                        <div className="text-sm text-gray-600">מיילים אחרונים</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {emails.filter(e => e.is_read).length}
                        </div>
                        <div className="text-sm text-gray-600">מיילים שנקראו</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                          {emails.filter(e => e.is_starred).length}
                        </div>
                        <div className="text-sm text-gray-600">מיילים מסומנים</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">85%</div>
                        <div className="text-sm text-gray-600">יעילות מענה</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}