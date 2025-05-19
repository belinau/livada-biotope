'use client';

import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { locales, defaultLocale } from '@/i18n/config';

interface LocaleValidatorProps {
  locale: string;
  children: ReactNode;
}

export function LocaleValidator({ locale, children }: LocaleValidatorProps) {
  const router = useRouter();

  useEffect(() => {
    // Check if the current locale is valid
    const isValidLocale = (locales as readonly string[]).includes(locale);
    
    if (!isValidLocale) {
      // Redirect to the default locale if the current one is invalid
      const newPath = window.location.pathname.replace(/^\/[^/]+/, `/${defaultLocale}`);
      router.replace(newPath);
    }
  }, [locale, router]);

  // Only render children if the locale is valid
  const isValidLocale = (locales as readonly string[]).includes(locale);
  return isValidLocale ? <>{children}</> : null;
}

export default LocaleValidator;