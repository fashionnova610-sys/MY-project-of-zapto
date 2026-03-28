/**
 * initFitTextClass
 * Framer-like "fit" for any element with class "fit-text".
 * - Scales font-size to fill its container without overflow
 * - Reacts to resize (window + ResizeObserver)
 * - Works for single or multi-line (data-multiline="false" to force single line)
 * - Supports data-min-font, data-max-font, data-padding
 */
export function initFitTextClass({ selector = '.fit-text', defaultMin = 12, defaultMax = 220 } = {}) {
  const ro = new ResizeObserver(entries => {
    for (const entry of entries) {
      const el = entry.target.__fitTextEl;
      if (el) applyFit(el);
    }
  });

  const applyFit = (el) => {
    const container = el.closest('.fit-text-container') || el.parentElement;
    if (!container) return;

    const padding = parseFloat(el.dataset.padding || 0);
    const min = parseFloat(el.dataset.minFont || defaultMin);
    const max = parseFloat(el.dataset.maxFont || defaultMax);
    const multiline = el.dataset.multiline !== 'false';

    // Ensure measurement styles
    const originalWhiteSpace = el.style.whiteSpace;
    el.style.whiteSpace = multiline ? 'normal' : 'nowrap';
    el.style.lineHeight = el.style.lineHeight || '1';

    const availableWidth = Math.max(0, container.clientWidth - padding * 2);
    const availableHeight = Math.max(0, container.clientHeight - padding * 2);
    if (!availableWidth || !availableHeight) return;

    // Binary search for font-size
    let lo = min;
    let hi = max;
    let best = min;
    const iterations = 12;

    for (let i = 0; i < iterations; i++) {
      const mid = (lo + hi) / 2;
      el.style.fontSize = mid + 'px';

      // Measure overflow
      const overW = el.scrollWidth > availableWidth + 0.5; // tolerance
      const overH = el.scrollHeight > availableHeight + 0.5;
      const over = overW || overH;

      if (over) {
        hi = mid - 0.5;
      } else {
        best = mid;
        lo = mid + 0.5;
      }
    }

    el.style.fontSize = best + 'px';
    // restore temp styles if originally unset
    if (originalWhiteSpace === '') {
      el.style.whiteSpace = multiline ? '' : 'nowrap';
    }
  };

  const attach = () => {
    const nodes = Array.from(document.querySelectorAll(selector));
    nodes.forEach((el) => {
      applyFit(el);
      const container = el.closest('.fit-text-container') || el.parentElement;
      if (container && !container.__fitTextEl) {
        container.__fitTextEl = el;
        ro.observe(container);
      }
    });
  };

  const handleResize = () => {
    window.requestAnimationFrame(() => {
      const nodes = document.querySelectorAll(selector);
      nodes.forEach((el) => applyFit(el));
    });
  };

  attach();
  window.addEventListener('resize', handleResize);

  return () => {
    ro.disconnect();
    window.removeEventListener('resize', handleResize);
    // cleanup flags
    const nodes = document.querySelectorAll(selector);
    nodes.forEach((el) => {
      const container = el.closest('.fit-text-container') || el.parentElement;
      if (container && container.__fitTextEl) delete container.__fitTextEl;
    });
  };
}