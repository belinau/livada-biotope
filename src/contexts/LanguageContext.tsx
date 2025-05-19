'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Locale } from '@/config/i18n';

const localeNames = {
  en: 'English',
  sl: 'Slovenščina',
} as const;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  localeNames: typeof localeNames;
  currentLanguage: Locale;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ 
  children,
  initialLocale = 'en' 
}: { 
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();
  const pathname = usePathname();

  // Update the URL when locale changes
  useEffect(() => {
    const [, currentLocale, ...segments] = pathname.split('/');
    const newPath = `/${locale}${segments.length ? `/${segments.join('/')}` : ''}`;
    
    // Only update if the locale has actually changed
    if (currentLocale !== locale) {
      router.replace(newPath);
    }
  }, [locale, pathname, router]);

  const setLocale = (newLocale: Locale) => {
    if (Object.keys(localeNames).includes(newLocale)) {
      setLocaleState(newLocale);
    } else {
      console.warn(`Attempted to set invalid locale: ${newLocale}`);
    }
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, localeNames, currentLanguage: locale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}