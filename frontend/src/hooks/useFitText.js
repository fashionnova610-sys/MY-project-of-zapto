import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useFitText
 * Scales single-line text to fit inside its container's width and height.
 * - Works with ResizeObserver to remain responsive
 * - Uses binary search for stable sizing
 *
 * Usage:
 * const { containerRef, textRef, fontSize } = useFitText({ min: 8, max: 1000, padding: 0, step: 1 });
 * <div ref={containerRef}><span ref={textRef} style={{fontSize}}>Text</span></div>
 */
export default function useFitText({ min = 8, max = 1000, step = 1, padding = 0 } = {}) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [fontSize, setFontSize] = useState(min);

  const fits = useCallback(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return false;
    const cRect = container.getBoundingClientRect();
    const tRect = text.getBoundingClientRect();
    const availableW = Math.max(0, cRect.width - padding * 2);
    const availableH = Math.max(0, cRect.height - padding * 2);
    return tRect.width <= availableW && tRect.height <= availableH;
  }, [padding]);

  const measureAndFit = useCallback(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    let low = min;
    let high = max;
    let best = low;
    // Binary search for the largest font that fits
    for (let i = 0; i < 20 && high - low > step; i++) {
      const mid = Math.floor((low + high) / 2);
      text.style.fontSize = `${mid}px`;
      // Force layout
      // eslint-disable-next-line no-unused-expressions
      text.offsetWidth;
      if (fits()) {
        best = mid;
        low = mid + step;
      } else {
        high = mid - step;
      }
    }
    text.style.fontSize = `${best}px`;
    setFontSize(best);
  }, [fits, min, max, step]);

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      measureAndFit();
    });
    if (containerRef.current) ro.observe(containerRef.current);
    const text = textRef.current;
    if (text) ro.observe(text);

    // Initial measure after mount
    measureAndFit();

    return () => ro.disconnect();
  }, [measureAndFit]);

  return { containerRef, textRef, fontSize };
}