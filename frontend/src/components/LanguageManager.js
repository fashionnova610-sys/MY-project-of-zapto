import React, { useEffect } from 'react';

const LanguageManager = () => {
    useEffect(() => {
        const detectAndTranslate = async () => {
            try {
                // Fetch Geo-IP data
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                
                const country = data.country_code; // CM, NG, US, etc.
                const languages = data.languages; // e.g. "en-CM,fr-CM"
                


                // Simple Logic: If Cameroon (CM) and it's not already translated, set to French
                if (country === 'CM' && !document.cookie.includes('googtrans')) {
                    // Force Google Translate to French
                    const expiry = new Date();
                    expiry.setFullYear(expiry.getFullYear() + 1);
                    document.cookie = `googtrans=/en/fr; path=/; expires=${expiry.toUTCString()}`;
                    document.cookie = `googtrans=/en/fr; path=/; domain=.zaptopay-official-2026.netlify.app; expires=${expiry.toUTCString()}`;
                    
                    // Reload to apply if necessary, or let the widget handle it
                    // window.location.reload(); 
                }
            } catch (error) {
                console.error('[Geo-IP] Error detecting location:', error);
            }
        };

        detectAndTranslate();
    }, []);

    return (
        <div id="google_translate_element" style={{ visibility: 'hidden', height: 0, overflow: 'hidden' }}></div>
    );
};

export default LanguageManager;
