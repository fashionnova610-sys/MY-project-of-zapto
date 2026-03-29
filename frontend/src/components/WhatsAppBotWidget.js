import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Calculator, TrendingUp, ShieldCheck, Phone } from 'lucide-react';
import axios from 'axios';
import { CONFIG } from '../utils/config';
import './WhatsAppBotWidget.css';

const WhatsAppBotWidget = () => {
    const [rates, setRates] = useState({ sell_rate: 0, buy_rate: 0 });
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [hasFetchedRates, setHasFetchedRates] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await axios.get(`${CONFIG.API_BASE}/rates/current?currency=USDT`);
                if (response.data) {
                    setRates(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch rates for bot:", error);
            }
        };

        const detectLocation = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                setUserLocation(data);
                console.log(`[Bot] Location detected: ${data.city}, ${data.country_name}`);
            } catch (error) {
                console.error("Location detection failed:", error);
            }
        };

        fetchRates();
        detectLocation();
        
        const rateInterval = setInterval(fetchRates, 60000);
        return () => clearInterval(rateInterval);
    }, []);

    useEffect(() => {
        // Only set initial welcome message if no messages exist and rates are loaded
        if (messages.length === 0 && rates.sell_rate !== 0) {
            setMessages([
                { 
                    role: 'bot', 
                    text: `👋 Welcome to Zaptopay! Your trusted partner for secure Crypto-to-XAF exchange. 🔒\n\n📊 TODAY'S LIVE RATES (USDT)\n🟢 SELL: ${rates.sell_rate} XAF\n🔴 BUY: ${rates.buy_rate} XAF\n\nHow can I help you? Choose an option below or type your request! 👇`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                }
            ]);
        }
    }, [rates]);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.pageYOffset > 300);
        };
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen, isTyping]);

    const handleSend = async (messageText = inputValue) => {
        const textToSubmit = messageText || inputValue;
        if (!textToSubmit.trim()) return;

        const userMsg = { 
            role: 'user', 
            text: textToSubmit, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };
        
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            const response = await axios.post(`${CONFIG.API_BASE}/bot/chat`, { 
                message: textToSubmit,
                location: userLocation ? `${userLocation.city}, ${userLocation.country_name}` : "Unknown"
            });
            
            setTimeout(() => {
                const botResponse = { 
                    role: 'bot', 
                    text: response.data.response, 
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                };
                setMessages(prev => [...prev, botResponse]);
                setIsTyping(false);
            }, 1000);
        } catch (error) {
            console.error("Bot chat error:", error);
            setIsTyping(false);
            setMessages(prev => [...prev, { 
                role: 'bot', 
                text: "⚠️ Sorry, I'm experiencing a technical hiccup. Please try again or head straight to our WhatsApp support!",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            }]);
        }
    };

    const quickActions = [
        { label: "Live Rates", icon: <TrendingUp size={12} />, text: "What are the latest exchange rates?" },
        { label: "Sell USDT", icon: <Calculator size={12} />, text: "I want to sell USDT for XAF" },
        { label: "Security", icon: <ShieldCheck size={12} />, text: "Is Zaptopay safe and secure?" }
    ];

    const redirectToWhatsApp = () => {
        const userTexts = messages.filter(m => m.role === 'user').map(m => m.text).join(' | ');
        const finalMessage = encodeURIComponent(`👋 Hi Zaptopay Team! I'm ready to trade.\n\nMy Request: ${userTexts || "I have a question about rates."}\n\n(Sent via Zaptopay AI Bot)`);
        window.open(`https://wa.me/${CONFIG.SUPPORT_WHATSAPP}?text=${finalMessage}`, '_blank');
    };

    return (
        <div className={`fixed bottom-8 right-8 z-[100] transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
            <div className={`absolute bottom-20 right-0 w-[400px] h-[600px] bg-[#E5DDD5] rounded-xl shadow-2xl transition-all duration-500 origin-bottom-right border border-gray-300 flex flex-col ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                {/* Official WhatsApp Header */}
                <div className="bg-[#075E54] p-3 flex justify-between items-center shadow-lg border-b border-black/10">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img 
                                src="/assets/logos/logo-app.png"
                                alt="Zaptopay AI Agent" 
                                className="w-10 h-10 rounded-full bg-white object-cover p-1"
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#075E54] rounded-full"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-white text-sm">Zaptopay AI Agent</span>
                            <span className="text-[10px] text-white/80">⚡ Online • Typically responds instantly</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-white/70">
                        <Phone size={18} />
                        <button onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* WhatsApp Chat Body */}
                <div 
                    ref={scrollRef} 
                    className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar flex flex-col"
                    style={{
                      backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`,
                      backgroundSize: '400px',
                      backgroundBlendMode: 'overlay'
                    }}
                >
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`relative max-w-[85%] p-3 rounded-lg text-[14px] leading-relaxed shadow-sm ${
                                msg.role === 'user' 
                                  ? 'bg-[#DCF8C6] text-black rounded-tr-none' 
                                  : 'bg-[#FFFFFF] text-black rounded-tl-none'
                            }`}>
                                {msg.text}
                                <div className={`text-[9px] mt-1 opacity-60 text-right ${msg.role === 'user' ? 'text-black' : 'text-gray-500'}`}>
                                    {msg.time}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white/90 border border-gray-200 p-3 rounded-lg flex gap-1 items-center shadow-sm">
                                <div className="typing-dot bg-gray-400"></div>
                                <div className="typing-dot bg-gray-400"></div>
                                <div className="typing-dot bg-gray-400"></div>
                            </div>
                        </div>
                    )}
                    
                    {/* Quick Actions & WhatsApp Link */}
                    <div className="pt-3 mt-4 border-t border-black/5 flex flex-col gap-3">
                        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                            {quickActions.map((action, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => handleSend(action.text)}
                                    className="flex items-center gap-2 whitespace-nowrap px-4 py-2 bg-white/60 border border-gray-200 rounded-lg text-[11px] font-bold text-gray-700 hover:bg-[#DCF8C6] transition-all duration-300"
                                >
                                    {action.icon}
                                    {action.label}
                                </button>
                            ))}
                        </div>
                        
                        <button 
                            onClick={redirectToWhatsApp}
                            className="w-full py-3 bg-[#25D366] text-white font-bold text-[13px] rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-md"
                        >
                            <MessageCircle size={20} />
                            Chat with Verified Agent
                        </button>
                    </div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-[#F0F2F5] flex gap-2 border-t border-gray-200">
                    <button type="button" className="text-gray-500 hover:text-gray-700 px-1">
                        <Bot size={22} />
                    </button>
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a message"
                        className="flex-1 bg-white border border-gray-100 rounded-lg px-4 py-2 text-sm text-black focus:outline-none shadow-sm"
                    />
                    <button 
                        type="submit" 
                        disabled={!inputValue.trim() || isTyping}
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${
                            inputValue.trim() ? 'bg-[#075E54] text-white' : 'bg-gray-200 text-gray-400'
                        }`}
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-all relative group shadow-2xl animate-pulse-whatsapp ${isOpen ? 'rotate-90' : ''}`}
            >
                {isOpen ? <X size={28} /> : <Phone size={30} fill="currentColor" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black text-white group-hover:animate-bounce shadow-xl">1</span>
                )}
            </button>
        </div>
    );
};

export default WhatsAppBotWidget;
