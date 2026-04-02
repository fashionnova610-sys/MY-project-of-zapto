import React, { useState, useEffect } from 'react';
import { Calculator, ArrowRight, Zap, RefreshCw, TrendingUp, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { CONFIG } from '../utils/config';

const EnhancedRateCalculator = ({ onWhatsAppClick }) => {
    // 1. Assets Configuration
    const cryptos = [
        { name: 'Tether (USDT)', symbol: 'USDT', icon: '₮', color: 'text-primary' },
        { name: 'Bitcoin (BTC)', symbol: 'BTC', icon: '₿', color: 'text-amber-500' },
        { name: 'Ethereum (ETH)', symbol: 'ETH', icon: 'Ξ', color: 'text-blue-500' },
        { name: 'Binance Coin (BNB)', symbol: 'BNB', icon: 'BNB', color: 'text-yellow-500' },
        { name: 'Solana (SOL)', symbol: 'SOL', icon: 'SOL', color: 'text-cyan-500' }
    ];

    // 2. State
    const [selectedCrypto, setSelectedCrypto] = useState('USDT');
    const [amount, setAmount] = useState('');
    const [mode, setMode] = useState('sell'); // 'sell' or 'buy'
    const [inputMode, setInputMode] = useState('USD'); // 'USD' or 'XAF'
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [rates, setRates] = useState({ sell: 650, buy: 680 }); // Anchor: USDT/XAF
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('MTN');
    const [hasFetchedRates, setHasFetchedRates] = useState(false);
    const [cryptoPrices, setCryptoPrices] = useState({ USDT: 1, BTC: 95000, ETH: 3500, BNB: 600, SOL: 180 });

    // 3. Data Fetching
    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
                    params: {
                        ids: 'tether,bitcoin,ethereum,binancecoin,solana',
                        vs_currencies: 'usd'
                    }
                });
                const data = res.data;
                const newPrices = {
                    USDT: data.tether?.usd || 1,
                    BTC: data.bitcoin?.usd || 95000,
                    ETH: data.ethereum?.usd || 3500,
                    BNB: data.binancecoin?.usd || 600,
                    SOL: data.solana?.usd || 180
                };
                setCryptoPrices(newPrices);
            } catch (error) {
                console.error('Error fetching crypto prices:', error);
            }
        };

        const fetchXafRates = async () => {
            try {
                const res = await axios.get(`${CONFIG.API_BASE}/rates/current?currency=USDT`, {
                    headers: { 'Cache-Control': 'no-cache' }
                });
                if (res.data) {

                    setRates({
                        sell: res.data.sell_rate,
                        buy: res.data.buy_rate
                    });
                    setHasFetchedRates(true);
                }
            } catch (error) {
                console.error('[Rates] Sync Failed:', error);
            }
        };

        fetchPrices();
        fetchXafRates();
        const interval = setInterval(() => { fetchPrices(); fetchXafRates(); }, 60000);
        return () => clearInterval(interval);
    }, []);

    // Reset inputMode when switching to USDT (no CRYPTO input mode for USDT)
    useEffect(() => {
        if (selectedCrypto === 'USDT' && inputMode === 'CRYPTO') {
            setInputMode('USD');
        }
        setAmount('');
        setResult(null);
    }, [selectedCrypto]);

    // 4. Logic
    const calculate = (e) => {
        if (e) e.preventDefault();
        const num = parseFloat(amount);
        if (isNaN(num) || num <= 0) {
            setResult(null);
            return;
        }

        setLoading(true);
        setTimeout(() => {
            const P = cryptoPrices[selectedCrypto] || 1; // Coin Price in USD
            const R = mode === 'sell' ? (rates.sell || 650) : (rates.buy || 680); // Anchor Rate (XAF/USDT)
            
            let A; // usdAmount
            let xafTotal;
            let cryptoAmount;

            if (inputMode === 'USD') {
                A = num;
                xafTotal = Math.floor(A * R);
                cryptoAmount = (selectedCrypto === 'USDT') ? A : (A / P);
            } else if (inputMode === 'XAF') {
                // Input is XAF
                xafTotal = Math.floor(num);
                A = xafTotal / R;
                cryptoAmount = (selectedCrypto === 'USDT') ? A : (A / P);
            } else {
                // Input is CRYPTO (raw coin amount)
                cryptoAmount = num;
                A = (selectedCrypto === 'USDT') ? num : (num * P);
                xafTotal = Math.floor(A * R);
            }
            
            setResult({
                xafValue: xafTotal,
                cryptoAmount: parseFloat(cryptoAmount.toFixed(8)),
                usdValue: A,
                symbol: selectedCrypto,
                cryptoPrice: P,
                xafRate: R,
                unitRateXaf: Math.floor(P * R),
                paymentMethod: selectedPaymentMethod
            });
            setLoading(false);
        }, 600);
    };

    return (
        <section id="calculator" className="py-24 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full h-full bg-primary/5 blur-[150px] rounded-full"></div>
            
            <div className="container max-w-7xl px-4 md:px-12">
                <div className="flex flex-col xl:flex-row gap-16 xl:gap-40 items-start xl:items-center justify-between">
                    {/* Left: Info */}
                    <div data-aos="fade-right" className="xl:flex-1 2xl:max-w-2xl">
                        <h2 className="text-4xl md:text-5xl 2xl:text-6xl font-black mb-6 uppercase tracking-tight">
                            Smart <span className="text-primary italic">Rate</span> Calculator
                        </h2>
                        <p className="text-text-muted text-lg mb-8 max-w-lg xl:max-w-xl 2xl:max-w-2xl">
                            Get real-time quotes combining global market prices with our elite local XAF rates. Instant, accurate, and ready for execution.
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-sm font-bold tracking-widest text-text-muted">
                                <TrendingUp size={18} className="text-primary" />
                                <span>LIVE PRICES FROM COINGECKO</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm font-bold tracking-widest text-text-muted">
                                <RefreshCw size={18} className="text-primary" />
                                <span>AUTO-REFRESH EVERY 60 SECONDS</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Calculator Card */}
                    <div className="glass p-6 md:p-10 border-white/10 relative group w-full xl:max-w-xl 2xl:max-w-2xl min-w-0" data-aos="fade-left">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        {/* Sell/Buy Toggle */}
                        <div className="flex p-1 bg-white/5 rounded-none border border-white/10 mb-8">
                            <button
                                onClick={() => { setMode('sell'); setResult(null); }}
                                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.12em] transition-all ${mode === 'sell' ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'}`}
                            >
                                I am Selling
                            </button>
                            <button
                                onClick={() => { setMode('buy'); setResult(null); }}
                                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.12em] transition-all ${mode === 'buy' ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'}`}
                            >
                                I am Buying
                            </button>
                        </div>

                        {/* Asset Grid */}
                        <div className="mb-8">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4 block underline decoration-primary/30 underline-offset-4">Select Crypto Asset</label>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {cryptos.map((crypto) => (
                                    <button
                                        key={crypto.symbol}
                                        onClick={() => { setSelectedCrypto(crypto.symbol); setResult(null); }}
                                        className={`py-4 px-1 glass border-white/10 flex flex-col items-center justify-center gap-2 transition-all hover:border-primary/50 min-w-0 ${selectedCrypto === crypto.symbol ? 'bg-primary/10 border-primary ring-1 ring-primary/30' : ''}`}
                                    >
                                        <span className={`text-xl font-black shrink-0 ${crypto.color}`}>{crypto.icon}</span>
                                        <span className="text-[8px] font-bold tracking-widest uppercase text-white/90">{crypto.symbol}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Payment Method Selector */}
                        <div className="mb-8">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4 block underline decoration-primary/30 underline-offset-4">Receiving Method (CEMAC)</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'MTN', name: 'MTN MoMo', color: 'text-yellow-400', icon: '🟡', logo: '⚡' },
                                    { id: 'Orange', name: 'Orange Money', color: 'text-orange-500', icon: '🟠', logo: '🍊' },
                                    { id: 'Wave', name: 'Wave Money', color: 'text-blue-400', icon: '🌊', logo: '💠' }
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => { setSelectedPaymentMethod(method.id); setResult(null); }}
                                        className={`group relative overflow-hidden py-4 px-2 glass border-white/5 flex flex-col items-center justify-center gap-2 transition-all duration-500 hover:border-primary/40 ${selectedPaymentMethod === method.id ? 'bg-primary/10 border-primary shadow-[0_0_30px_rgba(0,255,136,0.15)] ring-1 ring-primary/20 scale-[1.02]' : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-[1.01]'}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/5 group-hover:border-primary/30 transition-all duration-500 ${selectedPaymentMethod === method.id ? 'border-primary/30 scale-110' : ''}`}>
                                            <span className="text-sm">{method.logo}</span>
                                        </div>
                                        <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-all ${method.color} ${selectedPaymentMethod === method.id ? 'opacity-100' : 'opacity-70'}`}>{method.name}</span>
                                        {selectedPaymentMethod === method.id && (
                                            <div className="absolute top-0 right-0 p-1">
                                                <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Amount Input */}
                        <div className="mb-8 space-y-2">
                            <div className="flex justify-between items-end mb-4">
                                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] block underline decoration-primary/30 underline-offset-4">
                                    Enter Amount to {mode === 'sell' ? 'Sell' : 'Buy'}
                                </label>
                                <div className="flex bg-white/5 p-1 rounded-none border border-white/10 gap-1">
                                    <button 
                                        onClick={() => { setInputMode('USD'); setAmount(''); setResult(null); }}
                                        className={`px-3 py-1 text-[8px] font-black uppercase transition-all ${inputMode === 'USD' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'}`}
                                    >
                                        USD
                                    </button>
                                    <button 
                                        onClick={() => { setInputMode('XAF'); setAmount(''); setResult(null); }}
                                        className={`px-3 py-1 text-[8px] font-black uppercase transition-all ${inputMode === 'XAF' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'}`}
                                    >
                                        XAF
                                    </button>
                                    {selectedCrypto !== 'USDT' && (
                                        <button 
                                            onClick={() => { setInputMode('CRYPTO'); setAmount(''); setResult(null); }}
                                            className={`px-3 py-1 text-[8px] font-black uppercase transition-all ${inputMode === 'CRYPTO' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'}`}
                                        >
                                            {selectedCrypto}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => { setAmount(e.target.value); setResult(null); }}
                                    placeholder={inputMode === 'USD' ? 'Amount in USD' : inputMode === 'XAF' ? 'Amount in XAF' : `Amount in ${selectedCrypto}`}
                                    className="w-full bg-white/10 border border-white/20 p-6 text-2xl font-black text-white outline-none focus:border-primary focus:bg-white/15 transition-all pr-28 placeholder:text-white/40"
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-primary font-black uppercase text-sm tracking-widest opacity-80">
                                    {inputMode === 'CRYPTO' ? selectedCrypto : inputMode}
                                </span>
                            </div>
                            {selectedCrypto !== 'USDT' && (
                                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-2 flex justify-between">
                                    <span className="opacity-50">1 {selectedCrypto} = {cryptoPrices[selectedCrypto] ? `$${cryptoPrices[selectedCrypto].toLocaleString()}` : '…'}</span>
                                </p>
                            )}
                        </div>

                        <button
                            onClick={calculate}
                            disabled={!amount || loading}
                            className="w-full py-6 bg-[#00ff88] text-black font-black uppercase tracking-[0.12em] hover:bg-white transition-all duration-500 shadow-[0_15px_40px_rgba(0,255,136,0.3)] disabled:opacity-40 flex items-center justify-center gap-3 mb-10 overflow-hidden relative group"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <div className="relative z-10 flex items-center justify-center gap-3">
                                {loading ? (
                                    <>
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                        SYNCING_RATES
                                    </>
                                ) : (
                                    <>
                                        CALCULATE QUOTE <Zap size={18} className="fill-current" />
                                    </>
                                )}
                            </div>
                        </button>

                        {/* Result Area */}
                        {result && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                <div className="glass bg-primary/5 border-primary/20 p-8 text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-10">
                                        <MessageCircle size={100} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-primary mb-2 block">You Recieve Approximately</span>
                                    <div className="text-5xl md:text-6xl font-black mb-2 tracking-tighter">
                                        {Math.round(result.xafValue).toLocaleString()}
                                        <span className="text-xl ml-2 font-light opacity-50">XAF</span>
                                    </div>
                                    <div className="w-20 h-1 bg-primary/30 mx-auto mt-6"></div>
                                    
                                    <div className="flex justify-between mt-8 text-[10px] font-black tracking-widest uppercase text-text-muted">
                                        <div className="text-left">
                                            <p className="opacity-50 mb-1">{selectedCrypto} Rate</p>
                                            <p className="text-white">{result.unitRateXaf.toLocaleString()} XAF</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="opacity-50 mb-1">Anchor Rate</p>
                                            <p className="text-white">{result.xafRate} XAF/$</p>
                                        </div>
                                    </div>
                                </div>

                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => onWhatsAppClick(`Hey Zaptopay VIP! ⚡ I just calculated a trade:
- Amount: ${result.cryptoAmount} ${result.symbol}
- Serving: ${mode === 'sell' ? 'I am Selling Crypto' : 'I am Buying Crypto'}
- Network/Method: ${result.paymentMethod}
- Final Settlement: ${result.xafValue.toLocaleString()} XAF
- Using Anchor Rate: ${result.xafRate} XAF/$

I want to finalize this now! 🚀`)}
                                    className="w-full py-6 bg-[#00ff88] text-black font-black text-sm uppercase tracking-[0.18em] flex items-center justify-center gap-4 hover:bg-white transition-all duration-700 shadow-[0_0_30px_rgba(0,255,136,0.6)] relative overflow-hidden group animate-pulse-whatsapp"
                                >
                                    <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
                                    </div>
                                    Message Agent on WhatsApp ASAP
                                </motion.button>
                                <p className="text-center text-[10px] font-black text-primary uppercase tracking-[0.18em] animate-pulse">
                                    Direct VIP Support Available 24/7
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EnhancedRateCalculator;