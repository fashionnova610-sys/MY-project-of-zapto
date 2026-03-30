import React from 'react';

const FounderSection = () => {
    return (
        <section id="founder" className="py-24 relative overflow-hidden">
            <div className="container relative z-10">
                <div className="glass p-12 lg:p-20 overflow-hidden relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        
                        {/* 1. Visionary Narrative */}
                        <div className="flex flex-col items-start text-left" data-aos="fade-right">
                            <h2 className="text-4xl lg:text-7xl font-black mb-8 leading-tight uppercase tracking-tighter">
                                Meet the <br />
                                <span className="text-primary italic">Visionary</span>
                            </h2>
                            <p className="border-l-4 border-primary pl-6 text-text-muted text-lg lg:text-xl mb-10 leading-relaxed italic">
                                "My mission is to bridge the gap between digital assets and local currency for every African. 
                                We don't just process transactions; we build the infrastructure for financial freedom."
                            </p>
                            
                            <div className="flex flex-wrap gap-4 mb-10">
                                <div className="flex items-center gap-3 glass py-2 px-4 border-primary/20 bg-primary/5">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Verified Transparency</span>
                                </div>
                                <div className="flex items-center gap-3 glass py-2 px-4 border-primary/20 bg-primary/5">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Secure XAF Off-ramping</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 items-center">
                                <button className="px-10 py-5 bg-primary text-black font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]">
                                    Our Promise
                                </button>
                                <div className="text-[10px] font-mono opacity-50 tracking-[0.3em]">
                                    ENCRYPTED PIPELINE: <span className="text-primary">ZAPTO_NODE_01</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Visual Centerpiece (The Founder) */}
                        <div className="relative group flex justify-center" data-aos="zoom-in">
                            <div className="relative w-80 h-80 md:w-[450px] md:h-[450px]">
                                {/* Dynamic Glows */}
                                <div className="absolute -inset-10 bg-gradient-to-tr from-primary/40 to-secondary/20 blur-[80px] opacity-30 group-hover:opacity-60 transition-opacity rounded-full animate-pulse"></div>
                                
                                {/* Image Container */}
                                <div className="relative h-full w-full rounded-3xl overflow-hidden border border-white/10 shadow-3xl bg-black/40">
                                    <img 
                                        src="/assets/founder.jpg" 
                                        alt="Doumene M. Rosvel - Zaptopay Founder & CEO" 
                                        className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                                        style={{ objectPosition: 'center 15%' }}
                                    />
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                                </div>

                                {/* Floating Tag */}
                                <div className="absolute -bottom-6 -left-6 md:-left-12 glass p-6 border-primary/50 text-left backdrop-blur-3xl animate-float min-w-[240px]">
                                    <div className="text-[10px] font-bold text-primary mb-1 tracking-[0.4em] uppercase">Founder & CEO</div>
                                    <div className="text-2xl font-black tracking-tighter">Doumene M. Rosvel</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-primary/5 to-transparent -z-10"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        </section>
    );
};

export default FounderSection;
