// src/components/TranslationLoader.tsx
import React, { useEffect } from 'react';
import useTranslations from '../hooks/useTranslations';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * A simplified component that ensures translations are loaded properly
 * This version is designed to work with Netlify CMS translations
 */
export const TranslationLoader: React.FC = () => {
  const { isLoading, error } = useTranslations();
  const { language } = useLanguage();
  
  // Log translation status for debugging
  useEffect(() => {
    if (error) {
      console.error(`Translation error for language ${language}:`, error);
    } else if (!isLoading) {
      console.log(`Translations loaded successfully for language: ${language}`);
    }
  }, [language, isLoading, error]);
  
  return null; // This component doesn't render anything
};

export default TranslationLoader;