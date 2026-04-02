import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import './FloatingWhatsApp.css';

const FloatingWhatsApp = ({ onClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Hide on hero section — show only after fully scrolling past the hero (100vh)
          const heroSection = document.getElementById('home');
          const heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : window.innerHeight;
          setIsVisible(window.scrollY > heroBottom - 80);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      className={`floating-whatsapp ${isVisible ? 'visible' : ''}`}
      onClick={onClick}
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="pulse-ring"></span>
    </button>
  );
};

export default FloatingWhatsApp;