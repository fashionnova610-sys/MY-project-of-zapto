import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, BarChart3 } from 'lucide-react';

const CryptoTracker = () => {
    const [prices, setPrices] = useState({});
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(null);

    const cryptos = [
        { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', color: '#f7931a' },
        { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', color: '#627eea' },
        { id: 'tether', symbol: 'USDT', name: 'Tether', color: '#26a17b' },
        { id: 'binancecoin', symbol: 'BNB', name: 'BNB', color: '#f3ba2f' }
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
        const interval = setInterval(fetchPrices, 60000);
        return () => clearInterval(interval);
    }, []);

    const formatPrice = (price) => {
        if (!price) return '---';
        if (price < 1) return `$${price.toFixed(4)}`;
        return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="glass p-8 md:p-10 relative overflow-hidden h-full flex flex-col">
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                        <BarChart3 size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tight">Market Pulse</h3>
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Global Liquid Assets</p>
                    </div>
                </div>
                <button 
                    onClick={fetchPrices}
                    disabled={loading}
                    className="w-10 h-10 glass border-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-text-muted"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin text-primary' : ''} />
                </button>
            </div>

            <div className="space-y-4 flex-1">
                {cryptos.map((crypto) => {
                    const priceData = prices[crypto.id];
                    const price = priceData?.usd;
                    const change = priceData?.usd_24h_change;
                    const isPositive = change >= 0;

                    return (
                        <div key={crypto.id} className="glass p-6 border-white/5 hover:border-white/20 transition-all group">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div 
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black transition-transform group-hover:scale-110 shadow-lg"
                                        style={{ background: `${crypto.color}20`, color: crypto.color, border: `1px solid ${crypto.color}40` }}
                                    >
                                        {crypto.symbol.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-black text-white">{crypto.name}</div>
                                        <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{crypto.symbol} / USD</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-black text-white mb-1">
                                        {formatPrice(price)}
                                    </div>
                                    {change !== undefined && (
                                        <div className={`text-[10px] font-black flex items-center justify-end gap-1 ${isPositive ? 'text-primary' : 'text-red-500'}`}>
                                            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                            {Math.abs(change).toFixed(2)}%
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {lastUpdate && (
                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Live Connection: <span className="text-primary italic">Active</span></span>
                    <span className="text-[10px] font-mono text-text-muted opacity-50">SYNC: {lastUpdate.toLocaleTimeString()}</span>
                </div>
            )}
        </div>
    );
};

export default CryptoTracker;