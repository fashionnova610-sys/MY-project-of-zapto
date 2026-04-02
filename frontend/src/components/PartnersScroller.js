import React from 'react';
import { motion } from 'framer-motion';

const partners = [
    { name: 'Bybit', logo: '/assets/partners/bybit.png' },
    { name: 'OKX', logo: '/assets/partners/okx.svg' },
    { name: 'Binance', logo: '/assets/partners/binance.webp' },
    { name: 'KuCoin', logo: '/assets/partners/kucoin.jpg' },
    { name: 'Bitget', logo: '/assets/partners/bitget.jpg' },
    { name: 'MTN', logo: '/assets/brands/mtn.png' },
    { name: 'Orange Money', logo: '/assets/brands/orange.png' },
];

const PartnersScroller = () => {
    // Triple for truly infinite scroll coverage on all screens
    const scrollItems = [...partners, ...partners, ...partners];

    return (
        <section className="py-24 bg-bg-deep relative overflow-hidden">
            <div className="container mb-12 text-center">
                <h3 className="text-sm font-black uppercase tracking-[0.5em] text-primary/60 mb-8">Official Ecosystem Partners</h3>
            </div>
            
            <div className="relative flex overflow-hidden">
                <motion.div 
                    className="flex gap-12 whitespace-nowrap"
                    animate={{ x: ["0%", "-33.33%"] }}
                    transition={{
                        repeat: Infinity,
                        duration: 25,
                        ease: "linear",
                        repeatType: "loop"
                    }}
                >
                    {scrollItems.map((partner, i) => (
                        <div 
                            key={i} 
                            className="flex items-center gap-4 glass p-6 min-w-[280px] group hover:border-primary/50 transition-all duration-500 transform hover:-rotate-3 hover:scale-105 perspective-1000"
                            style={{
                                transformStyle: 'preserve-3d'
                            }}
                        >
                            <img 
                                src={partner.logo} 
                                alt={partner.name} 
                                className="h-10 w-auto filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                            />
                            <span className="text-lg font-bold text-text-muted group-hover:text-white uppercase tracking-wider">{partner.name}</span>
                        </div>
                    ))}
                </motion.div>
                
                {/* Gradient Fades for depth */}
                <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-bg-deep to-transparent z-20 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-bg-deep to-transparent z-20 pointer-events-none"></div>
            </div>
        </section>
    );
};

export default PartnersScroller;
