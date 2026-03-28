import React, { useState } from "react";
import { MessageCircle, Menu } from "lucide-react";
import "./Navigation.css";
import zaptoPayLogo from "../assets/branding/logo-primary.png";

const Navigation = () => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    { label: "RATES", id: "rates" },
    { label: "HOW IT WORKS", id: "how-it-works" },
    { label: "SECURITY", id: "security" },
    { label: "CONTACT", id: "contact" }
  ];

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
    <nav className="navigation">
      <div className="nav-content">
        {/* Logo */}
        <div className="nav-logo">
          <img
            className="logo-image"
            src={zaptoPayLogo}
            alt="Zaptopay logo"
          />
        </div>

        {/* Navigation Items */}
        <div className="nav-items">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${hoveredItem === item.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Icons */}
        <div className="nav-icons">
          <button className="nav-icon whatsapp-btn" onClick={handleWhatsAppClick} title="Chat on WhatsApp">
            <MessageCircle size={28} />
          </button>
          <button className="nav-icon">
            <Menu size={28} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;