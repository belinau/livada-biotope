import React, { useState, createContext, useContext, useCallback } from 'react';
import { translations } from '../lib/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('sl');
    const t = useCallback((key) => translations[language]?.[key] || key, [language]);
    return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
};

export const useTranslation = () => useContext(LanguageContext);