import React, { useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';

interface TranslationLoaderProps {
  testKey: string;
}

/**
 * A reusable component that ensures translations are properly loaded
 * If translations aren't loaded, it triggers a page reload
 */
export const TranslationLoader: React.FC<TranslationLoaderProps> = ({ testKey }) => {
  const { t } = useTranslations();
  
  useEffect(() => {
    // Check if translations are loaded properly
    if (!t(testKey) || t(testKey).includes(testKey)) {
      console.log(`Translations not loaded properly, reloading page. Test key: ${testKey}`);
      // Add a small delay to prevent immediate reload loops
      const timer = setTimeout(() => {
        window.location.reload();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [t, testKey]);
  
  return null; // This component doesn't render anything
};

export default TranslationLoader;
