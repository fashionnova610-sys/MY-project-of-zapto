import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Crypto3DScroller.css';

gsap.registerPlugin(ScrollTrigger);

const Crypto3DScroller = () => {
    const scrollerRef = useRef(null);
    const trackRef = useRef(null);

    const cryptoCoins = [
        { symbol: '₿', name: 'Bitcoin', color: '#f7931a' },
        { symbol: 'Ξ', name: 'Ethereum', color: '#627eea' },
        { symbol: '₮', name: 'Tether', color: '#26a17b' },
        { symbol: '◆', name: 'BNB', color: '#f3ba2f' }
    ];

    useEffect(() => {
        if (!trackRef.current) return;

        // Infinite loop animation using 1/3 technique for triple redundancy
        const trackWidth = trackRef.current.scrollWidth;
        gsap.to(trackRef.current, {
            x: -trackWidth / 3,
            duration: 25,
            repeat: -1,
            ease: "none",
        });

        // Scroll-triggered skew/tilt
        gsap.to(scrollerRef.current, {
            rotateY: 15,
            rotateX: 5,
            duration: 1,
            scrollTrigger: {
                trigger: scrollerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });
    }, []);

    return (
        <div className="crypto-3d-scroller" ref={scrollerRef}>
            <div className="scroller-track-3d" ref={trackRef}>
                {/* Triple the list for seamless loop */}
                {[...cryptoCoins, ...cryptoCoins, ...cryptoCoins].map((crypto, index) => (
                    <div
                        key={index}
                        className="crypto-coin-3d group"
                        style={{ '--coin-color': crypto.color }}
                    >
                        <div className="coin-face coin-front">
                            <span className="coin-symbol">{crypto.symbol}</span>
                        </div>
                        <div className="coin-face coin-back">
                            <span className="coin-name">{crypto.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Crypto3DScroller;