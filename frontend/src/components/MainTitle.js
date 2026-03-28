import React from "react";
import "./MainTitle.css";

const MainTitle = () => {
  const rates = {
    topLeft: ["USDT", "BTC"],
    topRight: ["ETH", "XAF"]
  };

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
    <div className="main-title-section">
      {/* Top Left Rates */}
      <div className="cast-names top-left">
        {rates.topLeft.map((coin, index) => (
          <div key={index} className="cast-name crypto-badge">
            {coin}
          </div>
        ))}
      </div>

      {/* Top Right Rates */}
      <div className="cast-names top-right">
        {rates.topRight.map((coin, index) => (
          <div key={index} className="cast-name crypto-badge">
            {coin}
          </div>
        ))}
      </div>

      {/* Main Title */}
      <div className="title-container">
        <div className="background-shape"></div>
        <div className="main-title">
          <div className="fit-text-container">
            <div className="hero-content">
              <h1 className="title-text fit-text" data-min-font="24" data-max-font="180" data-multiline="false" data-padding="0">
                ZAPTOPAY
              </h1>
              <p className="hero-subtitle">Trade Crypto. Instant XAF. Zero Fear.</p>
              <div className="rate-display">
                <div className="rate-item sell">
                  <span className="rate-label">YOU SELL</span>
                  <span className="rate-value">573 XAF/$</span>
                </div>
                <div className="rate-divider">|</div>
                <div className="rate-item buy">
                  <span className="rate-label">YOU BUY</span>
                  <span className="rate-value">598 XAF/$</span>
                </div>
              </div>
              <button className="cta-button" onClick={handleWhatsAppClick}>
                <span className="cta-icon">💬</span>
                Start Trading on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Infinity Scroller with crypto icons */}
      <div className="infinite-scroller-container">
        <div className="infinite-scroller" aria-hidden="true">
          <div className="scroller-track">
            {[...Array(12)].map((_, i) => (
              <div key={`crypto-a-${i}`} className="scroller-avatar">
                <div className="crypto-icon">₿</div>
              </div>
            ))}
            {[...Array(12)].map((_, i) => (
              <div key={`crypto-b-${i}`} className="scroller-avatar">
                <div className="crypto-icon">Ξ</div>
              </div>
            ))}
            {[...Array(12)].map((_, i) => (
              <div key={`crypto-c-${i}`} className="scroller-avatar">
                <div className="crypto-icon">₮</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainTitle;