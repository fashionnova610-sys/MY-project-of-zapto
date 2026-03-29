import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { ThemeProvider } from "./context/ThemeContext";

// Components
import Navigation from "./components/Navigation";
import MainTitle from "./components/MainTitle";
import Crypto3DScroller from "./components/Crypto3DScroller";
import CryptoTracker from "./components/CryptoTracker";
import EnhancedRateCalculator from "./components/EnhancedRateCalculator";
import WhatsAppBotWidget from "./components/WhatsAppBotWidget";
import TransactionHistory from "./components/TransactionHistory";
import FounderSection from "./components/FounderSection";
import FAQAccordion from "./components/FAQAccordion";
import ChannelCTA from "./components/ChannelCTA";
import PartnersScroller from "./components/PartnersScroller";
import MouseGlow from "./components/MouseGlow";
import Testimonials from "./components/Testimonials";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

// Features
const HowItWorks = () => (
    <section id="how-it-works" className="container py-24">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-primary glow-text" data-aos="fade-up">Fastest Crypto to XAF</h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
                Exchange your Bitcoin, Ethereum, or USDT for Mobile Money in 3 simple steps.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent -z-10"></div>

                { [
                    { step: "01", title: "Calculate", desc: "Use our live calculator to see exactly how much XAF you will receive." },
                    { step: "02", title: "Chat with Bot", desc: "Interact with ZaptoBot on the site and get connected to verified agents." },
                    { step: "03", title: "Receive Funds", desc: "Get paid instantly via MTN or Orange Mobile Money with receipt." }
                ].map((item, i) => (
                    <div key={i} className="glass p-10 relative overflow-hidden group hover:border-black/20 dark:hover:border-white/20 transition-all duration-300" data-aos="fade-up" data-aos-delay={i * 200}>
                        <div className="absolute top-0 right-0 p-4 font-black text-6xl text-black/5 dark:text-white/5 group-hover:text-primary transition-colors">
                            {item.step}
                        </div>
                        <h3 className="text-2xl font-bold mb-4 relative z-10 text-text-main">{item.title}</h3>
                        <p className="text-text-muted leading-relaxed relative z-10">{item.desc}</p>
                        <div className="mt-6 w-12 h-1 bg-primary group-hover:w-full transition-all duration-500"></div>
                    </div>
                ))}
            </div>
    </section>
);

const WhyChooseUs = () => (
    <section id="why-us" className="relative overflow-hidden py-24 bg-card/10 border-y border-glass-border">
        <div className="bg-grid"></div>
        <div className="container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight" data-aos="fade-right">
                        Trusted by <span className="text-primary italic">100k+</span> Satisfied Users
                    </h2>
                    <div className="space-y-6">
                        {[
                            { icon: "⚡", title: "Instant Payouts", desc: "Mobile Money transfers reach your wallet in seconds, not hours." },
                            { icon: "🛡️", title: "Verified Security", desc: "Regulated exchange processes and end-to-end encryption." },
                            { icon: "💎", title: "Competitive Rates", desc: "The highest market rates for USDT and Bitcoin in Cameroon." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-6 items-start" data-aos="fade-right" data-aos-delay={i * 150}>
                                <div className="w-14 h-14 glass flex items-center justify-center text-3xl shrink-0 border-primary/30 shadow-lg">
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                                    <p className="text-text-muted">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative" data-aos="zoom-in">
                    <div className="glass p-8 rotate-3 hover:rotate-0 transition-transform duration-500 relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Public Ledger Live</span>
                            <span className="text-text-muted text-xs animate-pulse">Scanning blockchain...</span>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(idx => (
                                <div key={idx} className="flex justify-between items-center p-3 border-b border-white/5">
                                    <div className="flex gap-3 items-center">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary/80"></div>
                                        <div>
                                            <div className="text-sm font-bold">TX #ZAPTO...{idx}X7</div>
                                            <div className="text-[10px] text-text-muted">SUCCESSFUL</div>
                                        </div>
                                    </div>
                                    <div className="text-primary font-mono text-sm">+$500.00</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl animate-pulse-glow"></div>
                </div>
            </div>
        </div>
    </section>
);



function AppContent() {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            easing: 'ease-out-cubic',
        });
    }, []);

    const orgSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Zaptopay",
        "url": "https://zaptopay.com",
        "logo": "https://zaptopay.com/logo.png",
        "description": "Fastest and most secure Crypto-to-XAF exchange in Cameroon. Sell Bitcoin, Ethereum, and USDT instantly.",
        "sameAs": [
            "https://twitter.com/zaptopay",
            "https://facebook.com/zaptopay"
        ]
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How fast is a Zaptopay transaction?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Average transaction time is under 2 minutes. Your XAF is sent via Mobile Money immediately upon blockchain confirmation."
                }
            },
            {
                "@type": "Question",
                "name": "Is Zaptopay secure?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, Zaptopay uses end-to-end encrypted trade processes and verified agent matching for all crypto-to-XAF exchanges."
                }
            }
        ]
    };

    return (
        <div className="App text-text-main selection:bg-white selection:text-black group">
            <MouseGlow />
            <Helmet>
                <title>Zaptopay | Secure Crypto-to-XAF Exchange Cameroon</title>
                <meta name="description" content="Exchange Bitcoin, USDT, and Ethereum for XAF instantly. The most trusted crypto exchange in Central Africa with live marketplace rates and verified security." />
                <meta name="keywords" content="crypto to xaf, sell usdt cameroon, bitcoin to mobile money, zaptopay, crypto exchange africa, douala crypto, yaounde bitcoin" />
                <link rel="canonical" href="https://zaptopay.com/" />
                <meta property="og:locale" content="en_CM" />
                <meta property="og:locale:alternate" content="fr_CM" />
                
                <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
                <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
                <script type="application/ld+json">{JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "LocalBusiness",
                    "name": "Zaptopay Cameroon",
                    "image": "https://zaptopay.com/og-image.png",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Douala",
                        "addressRegion": "Littoral",
                        "addressCountry": "CM"
                    },
                    "url": "https://zaptopay.com",
                    "telephone": "+237600000000",
                    "priceRange": "$$",
                    "openingHoursSpecification": {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": [
                            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
                        ],
                        "opens": "00:00",
                        "closes": "23:59"
                    }
                })}</script>
                <script type="application/ld+json">{JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Service",
                    "serviceType": "Cryptocurrency Exchange",
                    "provider": {
                        "@type": "LocalBusiness",
                        "name": "Zaptopay"
                    },
                    "areaServed": {
                        "@type": "Country",
                        "name": "Cameroon"
                    },
                    "hasOfferCatalog": {
                        "@type": "OfferCatalog",
                        "name": "Crypto to XAF Exchange",
                        "itemListElement": [
                            {
                                "@type": "Offer",
                                "itemOffered": {
                                    "@type": "Service",
                                    "name": "USDT to XAF Instant Payout"
                                }
                            },
                            {
                                "@type": "Offer",
                                "itemOffered": {
                                    "@type": "Service",
                                    "name": "Bitcoin to XAF Instant Payout"
                                }
                            }
                        ]
                    }
                })}</script>
            </Helmet>

            <Navigation />
            <Routes>
                <Route path="/" element={
                    <main>
                        {/* Global Glows */}
                        <div className="bg-blob" style={{ top: '10%', left: '-10%' }}></div>
                        <div className="bg-blob" style={{ top: '60%', right: '-10%', background: 'var(--secondary-glow)', opacity: '0.2' }}></div>
                        
                        <MainTitle />
                        <Crypto3DScroller />
                        <PartnersScroller />
                        <HowItWorks />
                        <WhyChooseUs />
                        
                        <section id="rates" className="container relative z-10 py-24 mb-12">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter" data-aos="fade-up">Live Marketplace</h2>
                                <p className="text-text-muted text-lg" data-aos="fade-up" data-aos-delay="100">Synchronized with global Binance market rates.</p>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12" data-aos="zoom-in">
                                <CryptoTracker />
                                <EnhancedRateCalculator />
                            </div>
                        </section>

                        <TransactionHistory />
                        <Testimonials />
                        <ChannelCTA />
                        <FounderSection />
                        <FAQAccordion />
                        <ContactSection />
                        <Footer />
                        <WhatsAppBotWidget />
                    </main>
                } />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <HelmetProvider>
            <ThemeProvider>
                <BrowserRouter>
                    <AppContent />
                </BrowserRouter>
            </ThemeProvider>
        </HelmetProvider>
    );
}

export default App;