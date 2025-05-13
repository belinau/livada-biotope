import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

// Define the supported languages
export type Language = 'en' | 'sl';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Initialize language from localStorage if available, otherwise default to 'en'
  const [language, setLanguageState] = useState<Language>('en');

  // Load language preference from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('livada_language') as Language;
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'sl')) {
        setLanguageState(savedLanguage);
      }
    }
  }, []);

  // Save language preference to localStorage when it changes
  const setLanguage = useCallback((newLanguage: Language) => {
    setLanguageState(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('livada_language', newLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};