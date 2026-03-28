import React, { useState } from "react";
import "./MainTitle.css";

const MainTitle = () => {
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState('sell'); // 'sell' or 'buy'
  
  const rates = {
    topLeft: ["USDT", "BTC"],
    topRight: ["ETH", "XAF"]
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleWhatsAppClick = () => {
    const actionText = action === 'sell' ? 'sell' : 'buy';
    const amountText = amount ? `$${amount}` : '$100';
    
    const message = encodeURIComponent(`👋 Hi Zaptopay!

I want to ${actionText} ${amountText} USDT.

Please provide me with the payment details.

Thank you!`);
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
              
              {/* Interactive Amount Input */}
              <div className="interactive-trade">
                <div className="trade-action-selector">
                  <button 
                    className={`action-btn ${action === 'sell' ? 'active' : ''}`}
                    onClick={() => setAction('sell')}
                  >
                    Sell
                  </button>
                  <button 
                    className={`action-btn ${action === 'buy' ? 'active' : ''}`}
                    onClick={() => setAction('buy')}
                  >
                    Buy
                  </button>
                </div>
                
                <div className="amount-input-wrapper">
                  <span className="dollar-sign">$</span>
                  <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="100"
                    className="amount-input"
                  />
                  <span className="currency-label">USDT</span>
                </div>
                
                <div className="instant-quote">
                  {amount && parseFloat(amount) > 0 ? (
                    <>
                      <span className="quote-label">{action === 'sell' ? 'You get' : 'You pay'}:</span>
                      <span className="quote-value">
                        {(parseFloat(amount) * (action === 'sell' ? 573 : 598)).toLocaleString()} XAF
                      </span>
                    </>
                  ) : (
                    <span className="quote-placeholder">Enter amount to see instant quote</span>
                  )}
                </div>
              </div>
              
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
                {amount ? `Trade $${amount} on WhatsApp` : 'Start Trading on WhatsApp'}
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