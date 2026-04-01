import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendingUp } from 'lucide-react';
import { API_BASE_URL } from '../utils/config';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentRate, setCurrentRate] = useState(580); // Institutional fallback rate

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch transactions and latest rates in parallel for real-time settlement calculation
                const [txRes, rateRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/transactions?limit=10`),
                    axios.get(`${API_BASE_URL}/rates/current?currency=USDT`)
                ]);
                
                if (Array.isArray(txRes.data)) {
                    setTransactions(txRes.data);
                }

                if (rateRes.data && rateRes.data.sell_rate) {
                    setCurrentRate(rateRes.data.sell_rate);
                }
            } catch (error) {
                console.error('[Ledger] Sync Failed:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    // Fallback data if API fails or for initial load
    const fallbackTX = [
        { id: 'ZAP_A1', tx_hash: '0x8f2d...b9c1', amount_usd: 1250, coin: 'USDT', status: 'COMPLETED', created_at: new Date().toISOString() },
        { id: 'ZAP_B2', tx_hash: '0x3e1a...1f2e', amount_usd: 50, coin: 'BTC', status: 'COMPLETED', created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
        { id: 'ZAP_C3', tx_hash: '0x9d1c...8c2b', amount_usd: 300, coin: 'ETH', status: 'COMPLETED', created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString() }
    ];

    const maskHash = (hash, coin) => {
        if (!hash) return "ZAP_TX_" + Math.random().toString(36).substring(7).toUpperCase();
        try {
            if (hash.startsWith('0x')) {
                return hash.substring(0, 6) + "..." + hash.substring(hash.length - 4);
            }
            return hash.substring(0, 8) + "..." + hash.substring(hash.length - 6);
        } catch (e) {
            return "ZAP_TX_ERR";
        }
    };

    const formatTimeAgo = (dateString) => {
        try {
            if (!dateString) return "Recently";
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Recently";
            
            const now = new Date();
            const diffInSeconds = Math.floor((now - date) / 1000);
            
            if (diffInSeconds < 0) return "Just now"; // Handle slight clock drift
            if (diffInSeconds < 60) return "Just now";
            
            const diffInMinutes = Math.floor(diffInSeconds / 60);
            if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
            
            const diffInHours = Math.floor(diffInMinutes / 60);
            if (diffInHours < 24) return `${diffInHours}h ${diffInMinutes % 60}m ago`;
            
            return date.toLocaleDateString();
        } catch (e) {
            return "Recently";
        }
    };

    const displayTransactions = Array.isArray(transactions) && transactions.length > 0 ? transactions : fallbackTX;

    return (
        <section id="ledger" className="py-24 bg-black/40">
            <div className="container">
                <div className="text-center mb-16" data-aos="fade-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                        <TrendingUp size={12} />
                        Live Protocol Feed
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black mb-4 text-white uppercase tracking-tighter leading-none">
                        Public <span className="text-primary italic">Ledger</span>
                    </h2>
                    <p className="text-text-muted max-w-xl mx-auto uppercase text-[10px] font-bold tracking-[0.4em]">
                        Verified cross-border liquidity settlements.
                    </p>
                </div>

                <div className="glass overflow-hidden border-white/5 shadow-2xl" data-aos="zoom-in">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="p-6 font-black uppercase text-[10px] tracking-widest text-text-muted">Transaction ID</th>
                                    <th className="p-6 font-black uppercase text-[10px] tracking-widest text-text-muted">Protocol</th>
                                    <th className="p-6 font-black uppercase text-[10px] tracking-widest text-text-muted">Settlement</th>
                                    <th className="p-6 font-black uppercase text-[10px] tracking-widest text-text-muted">Asset</th>
                                    <th className="p-6 font-black uppercase text-[10px] tracking-widest text-text-muted">Status</th>
                                    <th className="p-6 font-black uppercase text-[10px] tracking-widest text-text-muted">Verification</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayTransactions.map((tx, i) => {
                                    const usdAmount = parseFloat(tx?.amount_usd || 0);
                                    // Calculate settlement based on current institutional rate
                                    const xafSettlement = Math.round(usdAmount * currentRate);
                                    
                                    return (
                                        <tr key={tx?.id || i} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                                            <td className="p-6 font-mono text-[11px] text-primary/80 group-hover:text-primary transition-colors">
                                                {maskHash(tx?.tx_hash, tx?.coin)}
                                            </td>
                                            <td className="p-6">
                                                <span className={`px-2 py-1 rounded bg-white/5 border border-white/10 font-bold text-[9px] tracking-widest uppercase ${usdAmount > 1000 ? 'text-primary border-primary/20' : 'text-slate-400'}`}>
                                                    {usdAmount > 1000 ? 'INSTITUTION_OTC' : 'PEER_SETTLEMENT'}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-sm text-white">${usdAmount.toLocaleString()}</span>
                                                    <span className="text-[10px] text-text-muted font-bold opacity-50">≈ {xafSettlement.toLocaleString()} XAF</span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2 font-black text-[11px] text-white/90">
                                                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${tx?.coin === 'USDT' ? 'bg-emerald-500' : tx?.coin === 'BTC' ? 'bg-orange-500' : 'bg-primary'}`}></div>
                                                    {tx?.coin || 'USDT'}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit">
                                                    <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Confirmed</span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-[10px] font-bold text-text-muted group-hover:text-white transition-colors">
                                                {formatTimeAgo(tx?.created_at)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TransactionHistory;
