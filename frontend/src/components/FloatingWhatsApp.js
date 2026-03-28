import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import './FloatingWhatsApp.css';

const FloatingWhatsApp = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`👋 Welcome to Zaptopay!

Your trusted partner for secure Crypto-to-XAF exchange. 🔒

📊 TODAY'S LIVE RATES (USDT)
🟢 YOU SELL to us: 573 XAF/$
🔴 YOU BUY from us: 598 XAF/$

💡 HOW TO START:
Tell us what you need in one quick message. 
For example: "I want to sell $100 USDT" or "I want to buy $50 of BTC."

⏱️ A real, verified Zaptopay agent is standing by to process your transaction safely in under 2 minutes.

How can we help you today? 👇`);
    window.open(`https://wa.me/237676339620?text=${message}`, '_blank');
  };

  return (
    <button
      className={`floating-whatsapp ${isVisible ? 'visible' : ''}`}
      onClick={handleWhatsAppClick}
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="pulse-ring"></span>
    </button>
  );
};

export default FloatingWhatsApp;