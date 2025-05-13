import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// Type for the translations object
type TranslationsMap = Record<string, string>;

/**
 * Custom hook for accessing translations
 * This updated version is designed to work with Netlify CMS translations
 */
const useTranslations = () => {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<TranslationsMap>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch translations from the Netlify function
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Log the current language and fetch URL for debugging
        const fetchUrl = `/.netlify/functions/translations?locale=${language}`;
        console.log(`Fetching translations for language: ${language} from: ${fetchUrl}`);
        
        // Fetch translations from the Netlify function
        const response = await fetch(fetchUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch translations: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`Received translations data with ${Object.keys(data).length} keys`);
        
        // Check if we got empty data
        if (Object.keys(data).length === 0) {
          console.warn('Received empty translations data');
        }
        
        setTranslations(data);
        setLastUpdated(new Date());
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
      if (isLoading) {
        return defaultValue || key;
      }

      const translation = translations[key];
      
      // Log missing translations for debugging
      if (!translation && process.env.NODE_ENV !== 'production') {
        console.warn(`Missing translation for key: "${key}" in language: ${language}`);
      }
      
      // Return the translation, default value, or key
      return translation || defaultValue || key;
    },
    [translations, isLoading, language]
  );

  return { t, isLoading, error, lastUpdated };
};

export default useTranslations;
