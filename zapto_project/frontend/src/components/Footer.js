import React from "react";

const Footer = () => (
    <footer className="pt-20 pb-10 border-t border-glass-border bg-black text-white">
        <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-1 md:col-span-2">
                    <img 
                        src="/assets/logos/logo-navbar.png" 
                        alt="Zaptopay Institutional" 
                        className="h-20 w-auto mb-6 opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
                    />
                    <p className="text-text-muted max-w-sm leading-relaxed mb-6 font-medium">
                        The #1 institutional-grade Crypto-to-XAF exchange. Serving Douala, Yaoundé, and the entire <span className="text-white border-b border-primary/50">CEMAC Region</span> with unparalleled speed and security.
                    </p>
                    <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                             <span className="text-xl">🇨🇲</span>
                             <span className="text-[10px] uppercase font-bold tracking-tighter">Verified Cameroon Operation</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg text-primary">
                             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
                             <span className="text-[10px] uppercase font-bold tracking-tighter">Institutional Security</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="font-bold mb-6 text-white uppercase tracking-wider text-sm opacity-50">Exchange</h4>
                    <ul className="space-y-4 text-text-muted text-sm">
                        <li><a href="#rates" className="hover:text-primary transition-colors uppercase tracking-widest font-bold block">Live Market Rates</a></li>
                        <li><a href="#how-it-works" className="hover:text-primary transition-colors uppercase tracking-widest font-bold block">Trade Protocol</a></li>
                        <li><a href="#ledger" className="hover:text-primary transition-colors uppercase tracking-widest font-bold block">Verification Ledger</a></li>
                        <li><a href="#testimonials" className="hover:text-primary transition-colors uppercase tracking-widest font-bold block">Global Reviews</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-6 text-white uppercase tracking-wider text-sm opacity-50">Legal & Support</h4>
                    <ul className="space-y-4 text-text-muted text-sm">
                        <li><a href="#faq" className="hover:text-primary transition-colors uppercase tracking-widest font-bold block">Help Center</a></li>
                        <li><a href="#contact" className="hover:text-primary transition-colors uppercase tracking-widest font-bold block">Business Inquiries</a></li>
                        <li><a href="https://whatsapp.com/channel/0029VanCSucGehEDUIf3ck3W" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors uppercase tracking-widest font-bold block">Admin Support</a></li>
                    </ul>
                </div>
            </div>
            <div className="pt-8 border-t border-white/5 text-center text-text-muted text-xs tracking-[0.2em] font-bold">
                &copy; 2026 ZAPTOPAY LTD. DEVELOPED FOR THE FUTURE.
            </div>
        </div>
    </footer>
);

export default Footer;
