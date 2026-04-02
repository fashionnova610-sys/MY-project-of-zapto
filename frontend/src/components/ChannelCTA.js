import React from 'react';
import { motion } from 'framer-motion';
import { Users, Bell, TrendingUp, ArrowRight } from 'lucide-react';

const ChannelCTA = () => {
    return (
        <section className="py-24 relative overflow-hidden bg-bg-deep">
            {/* Background Orbs */}
            <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-secondary/5 blur-[100px] rounded-full"></div>
            
            <div className="container relative z-10">
                <div className="glass p-8 md:p-16 border-primary/20 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                    {/* Pulsing Live Badge */}
                    <div className="absolute top-8 right-8 flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full animate-pulse">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Live Updates</span>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8" data-aos="fade-right">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary border border-primary/20">
                                <Users size={16} />
                                <span className="text-[11px] font-black uppercase tracking-widest">Join 500+ Traders</span>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9]">
                                THE ZAPTOPAY<br />
                                <span className="text-primary italic">INNER CIRCLE.</span>
                            </h2>

                            <p className="text-lg text-text-muted max-w-md leading-relaxed">
                                Don't just trade. Lead. Get instant rate spikes, market intelligence, and verified exchange alerts before they hit the site.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                        <Bell size={20} className="text-secondary" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black uppercase tracking-wide">Instant Rate Alerts</h4>
                                        <p className="text-xs text-text-muted">Zero-delay notifications on favorable price movements.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                        <TrendingUp size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black uppercase tracking-wide">Market Intel</h4>
                                        <p className="text-xs text-text-muted">Direct insights from Zaptopay liquidity providers.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative" data-aos="fade-left">
                            <div className="relative z-10 glass p-8 border-white/10 rounded-3xl bg-black/40 shadow-2xl space-y-8 backdrop-blur-3xl">
                                <div className="flex items-center gap-4">
                                    <img src="/assets/logos/logo-app.png" alt="Zaptopay Channel" className="w-16 h-16 rounded-2xl shadow-xl" />
                                    <div>
                                        <h3 className="font-black text-xl uppercase tracking-tight">ZAPTOPAY OFFICIAL</h3>
                                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Verified Channel • 2.4k Followers</p>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                    <p className="text-sm italic text-white/50 leading-relaxed font-medium">
                                        "The rates here are consistently higher for selling. Essential for anyone handling USDT in Cameroon."
                                    </p>
                                    <div className="mt-4 flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">RM</div>
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Verified Trader</span>
                                    </div>
                                </div>

                                <a 
                                    href="https://whatsapp.com/channel/0029VanCSucGehEDUIf3ck3W" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block w-full py-6 bg-primary text-bg-deep text-center font-black text-sm uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.03] active:scale-95 transition-all shadow-[0_0_40px_rgba(9,188,138,0.3)] flex items-center justify-center gap-3"
                                >
                                    FOLLOW NOOW
                                    <ArrowRight size={18} />
                                </a>
                            </div>

                            {/* Floating Logo Ornament */}
                            <img 
                                src="/assets/logos/logo-symbol.png" 
                                alt="Zaptopay Symbol" 
                                className="absolute -bottom-10 -right-10 w-40 h-40 opacity-10 -z-10 blur-sm mix-blend-overlay rotate-12" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ChannelCTA;
