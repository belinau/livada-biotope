import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Type for the translations object
type TranslationsMap = Record<string, string>;

/**
 * Custom hook for accessing translations
 * This updated version is designed to work with Netlify CMS translations
 */
const useTranslations = () => {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<TranslationsMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch translations from the Netlify function
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch translations from the Netlify function
        const response = await fetch(`/.netlify/functions/translations?locale=${language}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch translations: ${response.status}`);
        }
        
        const data = await response.json();
        setTranslations(data);
      } catch (err) {
        console.error('Error fetching translations:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslations();
  }, [language]);

  // Translation function
  const t = useCallback(
    (key: string, defaultValue?: string): string => {
      // If translations are still loading, return the key or default value
      if (isLoading) {
        return defaultValue || key;
      }

      // Check if the translation exists
      const translation = translations[key];
      
      // Return the translation, default value, or key
      return translation || defaultValue || key;
    },
    [translations, isLoading]
  );

  return { t, isLoading, error };
};

export default useTranslations;
