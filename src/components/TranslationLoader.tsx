// src/components/TranslationLoader.tsx
import React, { useEffect, useState } from 'react';
import useTranslations from '../hooks/useTranslations';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * A reusable component that ensures translations are properly loaded
 * This improved version handles translation loading more reliably
 */
export const TranslationLoader: React.FC = () => {
  const { t } = useTranslations();
  const { language } = useLanguage();
  const [translationsChecked, setTranslationsChecked] = useState(false);
  
  useEffect(() => {
    // Reset the check when language changes
    setTranslationsChecked(false);
  }, [language]);
  
  useEffect(() => {
    if (translationsChecked) return;
    
    // Check multiple translation keys to ensure translations are loaded
    const keysToCheck = ['Navbar.home', 'Navbar.projects', 'Navbar.biodiversity'];
    let allKeysValid = true;
    
    for (const key of keysToCheck) {
      const translation = t(key);
      if (!translation || translation.includes(key)) {
        allKeysValid = false;
        break;
      }
    }
    
    if (!allKeysValid) {
      console.log(`Translations not loaded properly for language: ${language}, attempting to load...`);
      
      // Attempt to load translations directly from public folder
      fetch(`/locales/${language}/common.json`)
        .then(response => response.json())
        .then(data => {
          console.log(`Successfully loaded translations for ${language}`);
          // Force a reload after a short delay to apply translations
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch(error => {
          console.error(`Failed to load translations for ${language}:`, error);
        });
    } else {
      console.log(`Translations loaded successfully for language: ${language}`);
      setTranslationsChecked(true);
    }
  }, [t, language, translationsChecked]);
  
  return null; // This component doesn't render anything
};

export default TranslationLoader;