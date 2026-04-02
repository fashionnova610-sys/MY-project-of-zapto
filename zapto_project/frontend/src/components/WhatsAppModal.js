import React, { useState, useEffect } from 'react';
import { X, Send, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { CONFIG } from '../utils/config';
import './WhatsAppModal.css';

const WhatsAppModal = ({ isOpen, onClose, initialMessage }) => {
  const [whatsappNumber, setWhatsappNumber] = useState('237676339620');

  useEffect(() => {
    axios.get(`${CONFIG.API_BASE}/settings`).then(res => {
      if (res.data.contact_whatsapp) setWhatsappNumber(res.data.contact_whatsapp);
    }).catch(() => {});
  }, []);
  const defaultMessage = `👋 Welcome to Zaptopay!

Your trusted partner for secure Crypto-to-XAF exchange. 🔒

📊 TODAY'S LIVE RATES (USDT)
🟢 YOU SELL to us: 573 XAF/$
🔴 YOU BUY from us: 598 XAF/$

💡 HOW TO START:
Tell us what you need in one quick message. 
For example: "I want to sell $100 USDT" or "I want to buy $50 of BTC."

⏱️ A real, verified Zaptopay agent is standing by to process your transaction safely in under 2 minutes.

How can we help you today? 👇`;

  const [message, setMessage] = useState(initialMessage || defaultMessage);

  useEffect(() => {
    if (isOpen && initialMessage) {
      setMessage(initialMessage);
    }
  }, [isOpen, initialMessage]);

  const handleSend = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="whatsapp-modal-overlay" onClick={onClose}>
      <div className="whatsapp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-left">
            <div className="whatsapp-icon">💬</div>
            <div>
              <h3>Message Preview</h3>
              <p className="agent-status">Agent available • Responds in ~2 min</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="agent-badge-container">
            <div className="agent-avatar">
              <img src="/assets/logos/logo-navbar.png" alt="Zaptopay Agent" />
              <div className="online-indicator"></div>
            </div>
            <div className="agent-info">
              <div className="agent-name">Zaptopay Trade Desk <span className="verified-tag">✓ Verified Agent</span></div>
              <div className="agent-stats">Institutional Liquidity Provider • Cameroon</div>
            </div>
          </div>

          <div className="message-preview">
            <div className="preview-label">Official Trade Payload</div>
            <div className="textarea-wrapper">
              <textarea
                className="message-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={12}
                spellCheck="false"
              />
              <div className="textarea-glow"></div>
            </div>
            <p className="preview-hint">You can edit the message above before sending to our trade desk.</p>
          </div>

          <div className="modal-footer">
            <button className="edit-btn" onClick={() => setMessage(initialMessage || defaultMessage)}>
              <RefreshCw size={14} />
              Reset
            </button>
            <button className="send-btn" onClick={handleSend}>
              <Send size={18} />
              Confirm & Start Trade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppModal;