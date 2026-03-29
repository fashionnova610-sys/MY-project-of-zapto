import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Mic, Image as ImageIcon, Send, Loader2, Video, Volume2, Search, MapPin, Brain, Phone } from 'lucide-react';
import { GoogleGenAI, Type, ThinkingLevel, Modality } from '@google/genai';
import Markdown from 'react-markdown';

// Initial state for chat messages
const INITIAL_MESSAGE = { role: 'model', text: 'Welcome to Zaptopay! How can I help you with your crypto exchange today?' };

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const liveSessionRef = useRef(null);
  const audioContextRef = useRef(null);

  // Initialize chat session
  useEffect(() => {
  // Chat session initialization removed (handled via backend now)
  }, [API_KEY]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve({ data: base64String, mimeType: file.type });
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return;
    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/bot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: messages })
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model', text: data.response }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:scale-110 transition-transform z-50 animate-pulse-whatsapp"
      >
        <Phone size={28} fill="currentColor" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold">1</div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-6 w-[400px] h-[600px] max-h-[85vh] bg-[#E5DDD5] rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-300"
          >
            {/* WhatsApp Header */}
            <div className="p-3 bg-[#075E54] text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-white/20">
                    <img src="/assets/brands/mtn.png" alt="Zapto" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Zaptopay Official Bot</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse" />
                    <span className="text-[11px] text-white/80">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/70">
                <Phone size={18} />
                <button onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Chat Body with WhatsApp Pattern logic */}
            <div 
                className="flex-1 overflow-y-auto p-4 space-y-3"
                style={{
                  backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`,
                  backgroundSize: '400px',
                  backgroundBlendMode: 'overlay'
                }}
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`relative max-w-[85%] px-4 py-2 text-[14px] shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#DCF8C6] text-black rounded-l-lg rounded-br-lg rounded-tr-none' 
                      : 'bg-[#FFFFFF] text-black rounded-r-lg rounded-bl-lg rounded-tl-none'
                  }`}>
                    {/* Message Bubble Tail placeholder (CSS handled) */}
                    <div className="markdown-body prose prose-sm max-w-none">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                    <div className="text-[10px] text-gray-500 text-right mt-1">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-2 rounded-lg rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-[#075E54]" />
                    <span className="text-xs text-gray-400 italic">Typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-[#F0F2F5] flex items-center gap-2 border-t border-gray-200">
                <button className="text-gray-500 hover:text-gray-700">
                  <ImageIcon size={22} />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message"
                    className="w-full bg-white rounded-full px-4 py-2 text-sm text-black focus:outline-none shadow-sm border border-gray-100"
                  />
                </div>
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    input.trim() ? 'bg-[#075E54] text-white' : 'text-gray-400'
                  }`}
                >
                  <Send size={20} />
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
