import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// Type for the translations object
type TranslationsMap = Record<string, string>;

// Default translations for critical UI elements
// This ensures key translations are available during server-side rendering
const defaultTranslations: Record<string, Record<string, string>> = {
  en: {
    'projects.letsNotDryOut': 'Let\'s Not Dry Out the Future',
    'projects.letsNotDryOut.description': 'A project to monitor soil moisture and biodiversity',
    'menu.home': 'Home',
    'menu.about': 'About',
    'menu.projects': 'Projects',
    'menu.events': 'Events',
    'menu.contact': 'Contact',
    'Navbar.home': 'Home',
    'Navbar.biodiversity': 'Biodiversity',
    'Navbar.projects': 'Projects',
    'Navbar.instructables': 'Instructables',
    'Navbar.ecofeminism': 'Ecofeminism',
    'Navbar.events': 'Events',
    'Navbar.about': 'About'
  },
  sl: {
    'projects.letsNotDryOut': 'Ne Izsušimo Prihodnosti',
    'projects.letsNotDryOut.description': 'Projekt za spremljanje vlažnosti tal in biotske raznovrstnosti',
    'menu.home': 'Domov',
    'menu.about': 'O nas',
    'menu.projects': 'Projekti',
    'menu.events': 'Dogodki',
    'menu.contact': 'Kontakt',
    'Navbar.home': 'Domov',
    'Navbar.biodiversity': 'Biotska raznovrstnost',
    'Navbar.projects': 'Projekti',
    'Navbar.instructables': 'Navodila',
    'Navbar.ecofeminism': 'Ekofeminizem',
    'Navbar.events': 'Dogodki',
    'Navbar.about': 'O nas'
  }
};

/**
 * Custom hook for fetching and using translations from the serverless function
 */
export const useTranslations = () => {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<TranslationsMap>(
    // Initialize with default translations for the current language
    defaultTranslations[language as keyof typeof defaultTranslations] || {}
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch translations when the language changes
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Start with default translations for the current language
        const defaultLangTranslations = defaultTranslations[language as keyof typeof defaultTranslations] || {};
        
        // Use the serverless function to fetch translations
        try {
          const response = await fetch(`/.netlify/functions/translations?locale=${language}`);
          
          if (response.ok) {
            const data = await response.json();
            // Merge fetched translations with defaults (fetched takes precedence)
            setTranslations({ ...defaultLangTranslations, ...data });
          } else {
            console.warn(`Error fetching translations: ${response.status}`);
            // Fall back to default translations
            setTranslations(defaultLangTranslations);
          }
        } catch (fetchError) {
          console.warn('Error fetching translations, using defaults:', fetchError);
          // Fall back to default translations
          setTranslations(defaultLangTranslations);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error in translations hook:', error);
        setError('Failed to load translations');
        setLoading(false);
      }
    };
    
    // Only fetch additional translations on the client side
    if (typeof window !== 'undefined') {
      fetchTranslations();
    } else {
      // For server-side rendering, use default translations
      setTranslations(defaultTranslations[language as keyof typeof defaultTranslations] || {});
      setLoading(false);
    }
  }, [language]);

  // Function to get a translation by key
  const t = useCallback((key: string, defaultValue?: string): string => {
    // Return the translation if it exists, otherwise the default value or key
    return translations[key] || defaultValue || key;
  }, [translations]);

  return { t, loading, error };
};

export default useTranslations;
