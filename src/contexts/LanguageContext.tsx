import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Language } from '../lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, defaultValue?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Initialize language from localStorage if available, otherwise default to 'en'
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Load language preference from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('livada_language') as Language;
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'sl')) {
        setLanguageState(savedLanguage);
      }
    }
  }, []);

  // Fetch translations when language changes
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        setLoading(true);
        
        // Use the serverless function to fetch translations if on client
        if (typeof window !== 'undefined') {
          const response = await fetch(`/.netlify/functions/translations?locale=${language}`);
          
          if (response.ok) {
            const data = await response.json();
            setTranslations(data);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching translations:', error);
        setLoading(false);
        setTranslations({});
      }
    };
    
    fetchTranslations();
  }, [language]);

  // Wrapper for setLanguage that also saves to localStorage
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('livada_language', newLanguage);
    }
  };

  // Translation function
  const t = useCallback((key: string, defaultValue?: string): string => {
    // If translations are still loading or key doesn't exist, return the key or default value
    return translations[key] || defaultValue || key;
  }, [translations]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
