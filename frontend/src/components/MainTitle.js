import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Bot, ChevronRight } from "lucide-react";
import SplineBackground from "./SplineBackground";

const MainTitle = ({ onTradeClick }) => {
    // Mouse Tracking Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 100 };
    const rotateX = useSpring(useTransform(mouseY, [-500, 500], [15, -15]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-500, 500], [-15, 15]), springConfig);
    
    // Parallax background text
    const textX = useSpring(useTransform(mouseX, [-500, 500], [30, -30]), springConfig);
    const textY = useSpring(useTransform(mouseY, [-500, 500], [30, -30]), springConfig);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    // Robot Head Cursor Logic
    const headX = useSpring(useTransform(mouseX, [-500, 500], [-30, 30]), springConfig);
    const headY = useSpring(useTransform(mouseY, [-500, 500], [-30, 30]), springConfig);
    const headRotate = useSpring(useTransform(mouseX, [-500, 500], [-25, 25]), springConfig);

    return (
        <section 
            id="home" 
            className="relative min-h-screen flex items-center justify-center pt-20 pb-20 overflow-hidden"
            style={{ touchAction: 'pan-y' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <SplineBackground />

            {/* Main Hero Content */}
            <div className="container relative z-20 flex flex-col items-center justify-center">
                
                {/* Central Branding Stack */}
                <motion.div 
                    className="relative w-full flex items-center justify-center mb-12 select-none"
                    style={{ rotateX, rotateY }}
                    data-aos="zoom-in"
                >
                    {/* Foreground "ZAPTOPAY" Typography (More Solid) */}
                    <motion.div 
                        style={{ x: textX, y: textY }}
                        className="text-[18vw] font-black text-white/10 tracking-[-0.05em] leading-none whitespace-nowrap uppercase italic blur-[1px]"
                    >
                        ZAPTOPAY
                    </motion.div>

                    {/* Navbar Logo in Front of Text */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <motion.img 
                            src="/assets/logos/logo-navbar.png" 
                            alt="Zaptopay Hero Logo" 
                            style={{ z: 200 }}
                            className="h-32 md:h-56 w-auto object-contain animate-float drop-shadow-[0_0_50px_rgba(255,255,255,0.4)]" 
                        />
                    </div>
                </motion.div>

                {/* Minimalist Messaging Panel */}
                <div className="max-w-4xl text-center space-y-6" data-aos="fade-up" data-aos-delay="200">
                    <h2 className="text-lg md:text-2xl font-black text-white/80 tracking-[0.2em] uppercase leading-relaxed max-w-3xl mx-auto drop-shadow-2xl">
                        Cameroon's <span className="text-primary italic">#1</span> Institutional 
                        <div className="text-4xl md:text-6xl mt-2 mb-4 tracking-tighter">Crypto to XAF Exchange</div>
                        <div className="text-[10px] md:text-xs text-white/40 tracking-[0.5em] mt-4 font-bold flex items-center justify-center gap-2">
                             DOUALA • YAOUNDÉ • BAMENDA • SOUTHWEST
                        </div>
                    </h2>
                    
                    <p className="text-text-muted text-sm md:text-base max-w-2xl mx-auto tracking-wide leading-relaxed">
                        The fastest and most secure way to exchange Bitcoin and USDT for Mobile Money in the <span className="text-white font-bold">CEMAC Region</span>. 
                        Professional service. Instant payouts. Guaranteed rates.
                    </p>
                    
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
                        <button 
                            onClick={() => window.scrollTo({ top: document.getElementById('market-pulse').offsetTop - 100, behavior: 'smooth' })}
                            className="relative group px-14 py-6 bg-[#00ff88] text-black font-black text-xs md:text-sm uppercase tracking-[0.3em] rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,255,136,0.6)] hover:shadow-[0_0_50px_rgba(0,255,136,0.8)] transition-all active:scale-95 animate-pulse-whatsapp"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Check Rates
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right group-hover:translate-x-1 transition-transform" aria-hidden="true">
                                    <path d="m9 18 6-6-6-6"></path>
                                </svg>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </button>
                        
                        <button 
                            onClick={() => onTradeClick("Hi Zaptopay! 🇨🇲 I want to initiate a professional trade. Please send your current USDT to XAF institutional rates ASAP. 🚀")}
                            className="px-14 py-6 glass border-white/10 text-white font-black text-xs md:text-sm uppercase tracking-[0.3em] rounded-2xl hover:bg-white/5 transition-all text-center flex items-center justify-center gap-3 group"
                        >
                            <span>Direct WhatsApp Trade</span>
                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rocket"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3"></path><path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5"></path></svg>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Footer Info Removed */}
            </div>
        </section>
    );
};

export default MainTitle;