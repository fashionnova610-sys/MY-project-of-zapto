import React, { useState } from 'react';

const faqData = [
    {
        question: "How long does a typical trade take?",
        answer: "On average, trades are completed in under 2 minutes. This includes the time it takes for blockchain confirmation and the instant Mobile Money transfer to your wallet."
    },
    {
        question: "What are your trading limits?",
        answer: "We support trades from $10 up to $50,000 per user daily. For larger institutional trades, please contact our founder directly on WhatsApp for premium service."
    },
    {
        question: "Is Zaptopay safe and regulated?",
        answer: "Yes. Zaptopay operates with standard liquidity provider licenses in the region. We use end-to-end encrypted tunnels for trade communication and never hold your funds in escrow longer than necessary."
    },
    {
        question: "Which crypto assets do you support?",
        answer: "We primarily support USDT (TRC20/ERC20), Bitcoin (BTC), and Ethereum (ETH). We also support various stablecoins on the Polygon and BSC networks."
    },
    {
        question: "Can I sell my crypto for cash if I'm not in Cameroon?",
        answer: "Currently, we specialize in XAF payouts for Cameroon (MTN/Orange). We are expanding to other CEMAC and UEMOA regions (Gabon, Ivory Coast, Senegal) very soon."
    }
];

const FAQAccordion = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-24 relative overflow-hidden">
            <div className="container relative z-10">
                <div className="text-center mb-16" data-aos="fade-up">
                    <h2 className="text-4xl md:text-5xl font-black mb-4">Frequently Asked Questions</h2>
                    <p className="text-text-muted">Everything you need to know about trading with Zaptopay.</p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqData.map((item, index) => (
                        <div key={index} className="glass overflow-hidden transition-all duration-300 border-white/10 active:border-primary/30" data-aos="fade-up" data-aos-delay={index * 100}>
                            <button 
                                onClick={() => toggleAccordion(index)}
                                className="w-full p-6 text-left flex justify-between items-center bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                <span className={`font-bold transition-all ${activeIndex === index ? 'text-primary' : 'text-text-main'}`}>
                                    {item.question}
                                </span>
                                <span className={`text-xl transition-transform duration-300 ${activeIndex === index ? 'rotate-45 text-primary' : 'text-text-muted'}`}>
                                    +
                                </span>
                            </button>
                            <div className={`transition-all duration-500 ease-in-out ${activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="p-6 pt-0 text-white/70 leading-relaxed border-t border-white/10 bg-white/2">
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Background vector */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-secondary/10 blur-[100px] -z-10 rounded-full"></div>
        </section>
    );
};

export default FAQAccordion;
