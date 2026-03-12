import { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Send, Mic, MicOff, Flame, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Web Speech API Types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  action_type?: string;
  action_payload?: any;
}

export default function ChatInterface() {
  const auth = useContext(AuthContext);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: "Hello! I'm FinMate. How can I help you optimize your finances today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Features State
  const [roastMode, setRoastMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + (prev ? ' ' : '') + transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.error("Speech recognition error", event.error);
        }
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: `user-${Date.now()}-${Math.random()}`, sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://127.0.0.1:8000/chat', 
      {
        message: userMessage.text,
        roast_mode: roastMode
      },
      {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });

      const aiMessage: Message = {
        id: `ai-${Date.now()}-${Math.random()}`,
        sender: 'ai',
        text: res.data.response,
        action_type: res.data.action_type,
        action_payload: res.data.action_payload
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { 
        id: `err-${Date.now()}`, 
        sender: 'ai', 
        text: "I'm having trouble connecting to my servers. Check back in a moment." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] glass-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
          <h3 className="font-semibold tracking-wide">FinMate Intelligence</h3>
        </div>
        
        {/* Roast Mode Toggle */}
        <button 
          onClick={() => setRoastMode(!roastMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
            roastMode 
              ? 'bg-[--color-accent-red-glow] border-[--color-accent-red] text-[--color-accent-red] glow-red' 
              : 'bg-white/5 border-white/10 text-[--color-text-secondary] hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          {roastMode ? 'Roast Mode ON' : 'Roast Mode'}
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
            >
              <div 
                className={`p-3.5 rounded-2xl ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-br from-[--color-accent-blue] to-[#3b71bf] text-white rounded-br-sm' 
                    : roastMode 
                      ? 'bg-[--color-accent-red-glow] border border-[--color-accent-red]/30 text-white rounded-bl-sm'
                      : 'bg-white/10 backdrop-blur-md border border-white/5 text-white rounded-bl-sm'
                }`}
              >
                {/* Parse line breaks safely */}
                {msg.text.split('\n').map((line, i) => <p key={i} className="mb-1 last:mb-0">{line}</p>)}
              </div>

              {/* Action UI Component if LLM triggered an Action */}
              {msg.action_type === 'email_template' && msg.action_payload && (
                <div className="mt-2 w-full max-w-sm bg-[#0d1220] border border-[--color-border-bright] rounded-xl p-4 glow-green">
                  <div className="flex items-center gap-2 mb-3 text-[--color-accent-green]">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Generated Email action</span>
                  </div>
                  <div className="text-sm border-b border-white/10 pb-2 mb-2">
                    <span className="text-[--color-text-muted]">Subject:</span> {msg.action_payload.subject}
                  </div>
                  <div className="text-sm text-[--color-text-secondary] whitespace-pre-wrap">
                    {msg.action_payload.body}
                  </div>
                  <button className="mt-4 w-full bg-[--color-accent-green]/20 text-[--color-accent-green] hover:bg-[--color-accent-green]/30 py-2 rounded-lg text-sm font-medium transition-colors">
                    Draft in Email Client
                  </button>
                </div>
              )}
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 mr-auto text-[--color-text-muted] text-sm p-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white/[0.03] border-t border-white/10">
        <form onSubmit={handleSend} className="relative flex items-center">
          <button 
            type="button"
            onClick={toggleListen}
            className={`absolute left-3 p-1.5 rounded-full transition-colors ${
              isListening ? 'bg-[--color-accent-red] text-white animate-pulse' : 'text-[--color-text-secondary] hover:text-white hover:bg-white/10'
            }`}
          >
            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Ask FinMate anything..."}
            className="w-full bg-[#0a0f1a] border border-white/10 focus:border-[--color-accent-blue] rounded-xl pl-12 pr-12 py-3 text-sm outline-none transition-colors"
          />
          
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2 bg-gradient-to-r from-[--color-accent-green] to-[--color-accent-blue] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
