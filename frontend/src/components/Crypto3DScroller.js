import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Crypto3DScroller.css';

gsap.registerPlugin(ScrollTrigger);

const Crypto3DScroller = () => {
  const scrollerRef = useRef(null);
  const coinsRef = useRef([]);

  const cryptoCoins = [
    { symbol: '₿', name: 'Bitcoin', color: '#f7931a' },
    { symbol: 'Ξ', name: 'Ethereum', color: '#627eea' },
    { symbol: '₮', name: 'Tether', color: '#26a17b' },
    { symbol: '◆', name: 'BNB', color: '#f3ba2f' },
    { symbol: '₿', name: 'Bitcoin', color: '#f7931a' },
    { symbol: 'Ξ', name: 'Ethereum', color: '#627eea' },
    { symbol: '₮', name: 'Tether', color: '#26a17b' },
    { symbol: '◆', name: 'BNB', color: '#f3ba2f' },
  ];

  useEffect(() => {
    // 3D rotation animation for each coin
    coinsRef.current.forEach((coin, index) => {
      if (coin) {
        gsap.to(coin, {
          rotateY: 360,
          duration: 3 + (index * 0.2),
          repeat: -1,
          ease: 'none',
          delay: index * 0.1
        });

        // Floating animation
        gsap.to(coin, {
          y: -15,
          duration: 2 + (index * 0.1),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.15
        });
      }
    });

    // Scroll-triggered animation
    if (scrollerRef.current) {
      gsap.fromTo(scrollerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: scrollerRef.current,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1
          }
        }
      );
    }
  }, []);

  return (
    <div className="crypto-3d-scroller" ref={scrollerRef}>
      <div className="scroller-track-3d">
        {cryptoCoins.map((crypto, index) => (
          <div
            key={`${crypto.symbol}-${index}`}
            className="crypto-coin-3d"
            ref={el => coinsRef.current[index] = el}
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