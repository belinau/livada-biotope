// src/components/TranslationLoader.tsx
import React, { useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';

/**
 * A reusable component that ensures basic navigation translations are properly loaded
 * If translations aren't loaded, it triggers a page reload
 * 
 * This component only checks for Navbar.home to avoid reloading for missing content translations
 */
export const TranslationLoader: React.FC = () => {
  const { t } = useTranslations();
  
  useEffect(() => {
    // Only check the Navbar.home key which should always exist
    const navKey = 'Navbar.home';
    if (!t(navKey) || t(navKey).includes(navKey)) {
      console.log(`Basic navigation translations not loaded properly, reloading page.`);
      // Add a small delay to prevent immediate reload loops
      const timer = setTimeout(() => {
        window.location.reload();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [t]);
  
  return null; // This component doesn't render anything
};

export default TranslationLoader;