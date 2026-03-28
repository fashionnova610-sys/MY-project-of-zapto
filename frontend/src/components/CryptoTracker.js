import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import './CryptoTracker.css';

const CryptoTracker = () => {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const cryptos = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
    { id: 'tether', symbol: 'USDT', name: 'Tether' },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB' }
  ];

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const ids = cryptos.map(c => c.id).join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
      );
      const data = await response.json();
      setPrices(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    // Refresh every 60 seconds
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    if (!price) return '---';
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price < 100) return `$${price.toFixed(2)}`;
    return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  const formatChange = (change) => {
    if (!change) return '0.00';
    return Math.abs(change).toFixed(2);
  };

  return (
    <div className="crypto-tracker">
      <div className="tracker-header">
        <h3>Live Crypto Prices</h3>
        <button 
          className="refresh-btn" 
          onClick={fetchPrices}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'spinning' : ''} />
          Refresh
        </button>
      </div>

      <div className="crypto-grid">
        {cryptos.map((crypto) => {
          const priceData = prices[crypto.id];
          const price = priceData?.usd;
          const change = priceData?.usd_24h_change;
          const isPositive = change >= 0;

          return (
            <div key={crypto.id} className="crypto-card">
              <div className="crypto-info">
                <div className="crypto-symbol">{crypto.symbol}</div>
                <div className="crypto-name">{crypto.name}</div>
              </div>
              <div className="crypto-price">
                <div className="price-value">{formatPrice(price)}</div>
                {change !== undefined && (
                  <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
                    {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {formatChange(change)}%
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {lastUpdate && (
        <div className="last-update">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default CryptoTracker;