import React from 'react';

const FounderSection = () => {
    return (
        <section id="founder" className="py-24 relative overflow-hidden">
            <div className="container relative z-10">
                <div className="glass p-12 lg:p-20 overflow-hidden relative">
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-16 items-center">
                        
                        {/* 1. Visionary Narrative */}
                        <div className="flex flex-col items-center text-center max-w-4xl mx-auto" data-aos="fade-up">
                            <h2 className="text-4xl lg:text-7xl font-black mb-8 leading-tight uppercase tracking-tighter">
                                Meet the <br />
                                <span className="text-primary italic">Visionary</span>
                            </h2>
                            <p className="border-l-4 border-r-4 border-primary px-6 text-text-muted text-lg lg:text-xl mb-10 leading-relaxed italic">
                                "My mission is to bridge the gap between digital assets and local currency for every African. 
                                We don't just process transactions; we build the infrastructure for financial freedom."
                            </p>
                            
                            <div className="flex flex-wrap justify-center gap-4 mb-10">
                                <div className="flex items-center gap-3 glass py-2 px-4 border-primary/20 bg-primary/5">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Verified Transparency</span>
                                </div>
                                <div className="flex items-center gap-3 glass py-2 px-4 border-primary/20 bg-primary/5">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Secure XAF Off-ramping</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-6">
                                <button className="px-10 py-5 bg-primary text-black font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]">
                                    Our Promise
                                </button>
                                <div className="text-[10px] font-mono opacity-50 tracking-[0.3em]">
                                    ENCRYPTED PIPELINE: <span className="text-primary">ZAPTO_NODE_01</span>
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
