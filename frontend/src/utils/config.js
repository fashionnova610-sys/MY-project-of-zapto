/**
 * Global Configuration for Zaptopay
 * Handles environment-specific API endpoints to ensure synchronization across production and local dev.
 */

const getApiBase = () => {
    // 1. Check for manual override in dev (useful for local network testing)
    const localOverride = localStorage.getItem('ZAPTO_API_OVERRIDE');
    if (localOverride) return localOverride;

    // 2. Production Check (if browser URL is not localhost)
    const isProduction = !window.location.hostname.includes('localhost') && 
                         !window.location.hostname.includes('127.0.0.1');

    if (isProduction) {
        // Return your production backend URL here
        // If deployed on the same domain or as static + functions, use relative path
        return "https://zaptopay.netlify.app/api"; // Placeholder - Update if backend is separate
    }

    // 3. Local Development (Default)
    // Automatically use the current hostname but on port 8000 for the FastAPI backend
    return `http://${window.location.hostname}:8000/api`;
};

export const API_BASE_URL = getApiBase();

export const CONFIG = {
    API_BASE: API_BASE_URL,
    CURRENCY_LIST: ['USDT', 'BTC', 'ETH', 'BNB', 'SOL'],
    SUPPORT_WHATSAPP: '237676339620',
};
