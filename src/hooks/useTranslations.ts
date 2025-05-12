import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// Type for the translations object
type TranslationsMap = Record<string, string>;

/**
 * Custom hook for fetching and using translations from the serverless function
 */
export const useTranslations = () => {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<TranslationsMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch translations when the language changes
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the serverless function to fetch translations
        const response = await fetch(`/.netlify/functions/translations/translations?locale=${language}`);
        
        if (!response.ok) {
          throw new Error(`Error fetching translations: ${response.status}`);
        }
        
        const data = await response.json();
        setTranslations(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching translations:', error);
        setError('Failed to load translations');
        setLoading(false);
        
        // Fallback to empty translations object
        setTranslations({});
      }
    };
    
    // Only fetch on the client side
    if (typeof window !== 'undefined') {
      fetchTranslations();
    } else {
      // For server-side rendering, don't try to fetch
      setLoading(false);
    }
  }, [language]);

  // Function to get a translation by key
  const t = useCallback((key: string, defaultValue?: string): string => {
    // If translations are still loading, return the key or default value
    if (loading) {
      return defaultValue || key;
    }
    
    // Return the translation if it exists, otherwise the key or default value
    return translations[key] || defaultValue || key;
  }, [translations, loading]);

  return { t, loading, error };
};

export default useTranslations;
