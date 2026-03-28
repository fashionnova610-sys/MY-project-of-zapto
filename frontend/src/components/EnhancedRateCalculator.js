import React, { useState, useEffect } from 'react';
import { Calculator, ArrowRight } from 'lucide-react';
import './EnhancedRateCalculator.css';

const EnhancedRateCalculator = () => {
  const [amount, setAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('USDT');
  const [mode, setMode] = useState('sell');
  const [result, setResult] = useState(null);
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [xafRates, setXafRates] = useState({ sell: 573, buy: 598 });
  const [loading, setLoading] = useState(false);

  const cryptos = [
    { symbol: 'USDT', name: 'Tether', id: 'tether' },
    { symbol: 'BTC', name: 'Bitcoin', id: 'bitcoin' },
    { symbol: 'ETH', name: 'Ethereum', id: 'ethereum' }
  ];

  // Fetch live crypto prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const ids = cryptos.map(c => c.id).join(',');
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
        );
        const data = await response.json();
        const prices = {};
        cryptos.forEach(crypto => {
          prices[crypto.symbol] = data[crypto.id]?.usd || 1;
        });
        setCryptoPrices(prices);
      } catch (error) {
        console.error('Error fetching prices:', error);
        // Fallback prices
        setCryptoPrices({ USDT: 1, BTC: 95000, ETH: 3500 });
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch XAF rates from backend
  useEffect(() => {
    const fetchXafRates = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/rates/current`);
        const data = await response.json();
        setXafRates({ sell: data.sell_rate, buy: data.buy_rate });
      } catch (error) {
        console.error('Error fetching XAF rates:', error);
      }
    };

    fetchXafRates();
    const interval = setInterval(fetchXafRates, 300000); // Every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const calculate = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const cryptoPrice = cryptoPrices[selectedCrypto] || 1;
      const xafRate = mode === 'sell' ? xafRates.sell : xafRates.buy;
      
      let calculated;
      if (mode === 'sell') {
        // User sells crypto: crypto amount × crypto price × XAF rate
        calculated = num * cryptoPrice * xafRate;
      } else {
        // User buys crypto: crypto amount × crypto price × XAF rate
        calculated = num * cryptoPrice * xafRate;
      }

      setResult({
        xaf: calculated.toFixed(0),
        cryptoPrice: cryptoPrice,
        xafRate: xafRate
      });
      setLoading(false);
    }, 300);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setResult(null);
    }
  };

  return (
    <div className="enhanced-rate-calculator">
      <div className="calculator-header">
        <Calculator className="calc-icon" size={24} />
        <h3>Smart Rate Calculator</h3>
      </div>

      <div className="calc-mode-toggle">
        <button
          className={`mode-btn ${mode === 'sell' ? 'active' : ''}`}
          onClick={() => { setMode('sell'); setResult(null); }}
        >
          I'm Selling
        </button>
        <button
          className={`mode-btn ${mode === 'buy' ? 'active' : ''}`}
          onClick={() => { setMode('buy'); setResult(null); }}
        >
          I'm Buying
        </button>
      </div>

      <div className="crypto-selector">
        <label>Select Cryptocurrency</label>
        <div className="crypto-buttons">
          {cryptos.map((crypto) => (
            <button
              key={crypto.symbol}
              className={`crypto-btn ${selectedCrypto === crypto.symbol ? 'active' : ''}`}
              onClick={() => { setSelectedCrypto(crypto.symbol); setResult(null); }}
            >
              <span className="crypto-symbol">{crypto.symbol}</span>
              <span className="crypto-price">
                ${cryptoPrices[crypto.symbol]?.toLocaleString() || '---'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="calc-input-group">
        <label>Amount in {selectedCrypto}</label>
        <div className="input-wrapper">
          <span className="currency-symbol">{selectedCrypto}</span>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
            className="calc-input"
          />
        </div>
      </div>

      <button className="calc-btn" onClick={calculate} disabled={loading}>
        {loading ? 'Calculating...' : 'Calculate'}
        <ArrowRight size={20} />
      </button>

      {result && (
        <div className="calc-result">
          <div className="result-label">
            {mode === 'sell' ? 'You receive' : 'You pay'}
          </div>
          <div className="result-value">
            {parseInt(result.xaf).toLocaleString()} XAF
          </div>
          <div className="result-breakdown">
            <div className="breakdown-item">
              <span>Crypto Price:</span>
              <span>${result.cryptoPrice.toLocaleString()}</span>
            </div>
            <div className="breakdown-item">
              <span>XAF Rate:</span>
              <span>{result.xafRate} XAF/$</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedRateCalculator;