import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Paperclip, Wind, Gavel, Heart, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateSupportResponse } from '../services/gemini';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'model';
  text: string;
  type?: 'legal' | 'psychological';
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Assalomu alaykum. Men Nafas yordamchisiman. Sizga qanday yordam bera olaman? Sizning xavfsizligingiz va anonimligingiz biz uchun birinchi o'rinda." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await generateSupportResponse(input, history);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen max-w-4xl mx-auto">
      <header className="p-4 border-b border-outline-variant/20 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
            <Wind size={24} />
          </div>
          <div>
            <h1 className="font-bold text-on-surface">Nafas</h1>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Xavfsiz va maxfiy</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-outline hover:text-primary transition-colors">
            <Info size={20} />
          </button>
        </div>
      </header>

      <div className="flex-grow overflow-y-auto p-4 space-y-6 no-scrollbar">
        <div className="flex justify-center">
          <span className="text-[10px] font-bold text-outline uppercase tracking-[0.2em] bg-surface-container-low px-4 py-1 rounded-full">
            Suhbat boshlandi — 100% Anonim
          </span>
        </div>

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-3 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
              msg.role === 'model' ? "bg-primary text-white" : "bg-secondary text-white"
            )}>
              {msg.role === 'model' ? <Wind size={16} /> : <Heart size={16} />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl shadow-sm",
              msg.role === 'model' 
                ? "bg-white border border-outline-variant/10 text-on-surface" 
                : "bg-primary text-white"
            )}>
              <div className="prose prose-sm max-w-none prose-p:leading-relaxed">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center animate-pulse">
              <Wind size={16} />
            </div>
            <div className="bg-white border border-outline-variant/10 p-4 rounded-2xl flex gap-1">
              <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-white/50 backdrop-blur-md border-t border-outline-variant/20">
        <div className="flex items-center gap-2 bg-white rounded-full p-2 shadow-lg border border-outline-variant/10">
          <button className="p-2 text-outline hover:text-primary transition-colors">
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Nima haqida o'ylayapsiz?.."
            className="flex-grow bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-outline-variant"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-center text-outline-variant mt-3 font-medium">
          Nafas xatoliklar qilishi mumkin. Muhim qarorlar uchun mutaxassis bilan maslahatlashing.
        </p>
      </div>
    </div>
  );
}
