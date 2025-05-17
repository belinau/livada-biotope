import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'sl';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const defaultContext: LanguageContextType = {
  language: 'en',
  setLanguage: () => {},
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  initialLanguage = 'en',
}) => {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  // Load language from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'sl')) {
      setLanguageState(savedLanguage);
    } else {
      // Default to browser language if available, otherwise 'en'
      const browserLang = navigator.language.split('-')[0];
      setLanguageState(browserLang === 'sl' ? 'sl' : 'en');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;