import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }, []);

    // Provide a dummy toggleTheme that does nothing, to avoid breaking components that depend on it
    const toggleTheme = () => {};

    return (
        <ThemeContext.Provider value={{ theme: 'dark', toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
