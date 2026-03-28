import React, { useState } from 'react';
import { Calculator, ArrowRight } from 'lucide-react';
import './RateCalculator.css';

const RateCalculator = () => {
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('sell'); // 'sell' or 'buy'
  const [result, setResult] = useState(null);

  const rates = {
    sell: 573, // User sells crypto, gets XAF
    buy: 598   // User buys crypto, pays XAF
  };

  const calculate = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setResult(null);
      return;
    }

    const rate = rates[mode];
    const calculated = num * rate;
    setResult(calculated.toFixed(0));
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setResult(null);
    }
  };

  return (
    <div className="rate-calculator">
      <div className="calculator-header">
        <Calculator className="calc-icon" size={24} />
        <h3>Rate Calculator</h3>
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

      <div className="calc-input-group">
        <label>Amount in USD</label>
        <div className="input-wrapper">
          <span className="currency-symbol">$</span>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="100"
            className="calc-input"
          />
        </div>
      </div>

      <button className="calc-btn" onClick={calculate}>
        Calculate
        <ArrowRight size={20} />
      </button>

      {result && (
        <div className="calc-result">
          <div className="result-label">
            {mode === 'sell' ? 'You receive' : 'You pay'}
          </div>
          <div className="result-value">
            {parseInt(result).toLocaleString()} XAF
          </div>
          <div className="result-rate">
            Rate: {rates[mode]} XAF per $1
          </div>
        </div>
      )}
    </div>
  );
};

export default RateCalculator;