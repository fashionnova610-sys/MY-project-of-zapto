import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Globe } from "lucide-react";

const Navigation = ({ onTradeClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "How it Works", href: "#how-it-works" },
    { name: "Market", href: "#market-pulse" },
    { name: "Calculator", href: "#calculator" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
    { name: "FAQ", href: "#faq" }
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? "py-4 bg-bg-deep/80 backdrop-blur-xl border-b border-glass-border shadow-lg" : "py-8 bg-transparent"}`}>
      <div className="container flex justify-end md:justify-between items-center">
        {/* Logo - Hidden on mobile, visible on desktop */}
        <Link to="/" className="hidden md:flex items-center group">
          <img
            src="/assets/logos/logo-navbar.png"
            alt="Zaptopay Official Logo"
            className="h-16 md:h-24 w-auto object-contain hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[10px] font-black text-white/70 hover:text-primary transition-all tracking-[0.12em] uppercase"
            >
              {link.name}
            </a>
          ))}

          <div className="h-6 w-px bg-glass-border mx-2"></div>

          <button
            onClick={onTradeClick}
            className="px-8 py-4 bg-[#00ff88] text-black text-xs font-black uppercase tracking-[0.12em] hover:bg-white transition-all shadow-[0_0_30px_rgba(0,255,136,0.6)] hover:shadow-[0_0_50px_rgba(0,255,136,0.8)] animate-pulse-whatsapp"
          >
            Trade Now 🚀
          </button>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            className="w-10 h-10 glass border-glass-border flex flex-col items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-0 bg-bg-deep/95 backdrop-blur-3xl z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-700 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="text-2xl font-black tracking-widest uppercase hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            {link.name}
          </a>
        ))}

        <button
          onClick={() => { onTradeClick(); setIsMenuOpen(false); }}
          className="px-10 py-5 bg-[#00ff88] text-black text-sm font-black uppercase tracking-[0.12em] hover:bg-white transition-all shadow-[0_0_40px_rgba(37,211,102,0.4)] animate-pulse-whatsapp"
        >
          Trade Now 🚀
        </button>

        <button
          className="absolute top-8 right-8 text-text-muted font-bold tracking-widest uppercase"
          onClick={() => setIsMenuOpen(false)}
        >
          Close
        </button>
      </div>
    </nav>
  );
};

export default Navigation;