'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { defaultLocale, isLocale, locales } from '@/config/i18n';

interface LocaleValidatorProps {
  locale: string;
  children: React.ReactNode;
}

export function LocaleValidator({ locale, children }: LocaleValidatorProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If the locale is not valid, redirect to the default locale
    if (!isLocale(locale)) {
      const segments = pathname.split('/').filter(Boolean);
      
      // If the first segment is not a valid locale, prepend the default locale
      if (!segments.length || !isLocale(segments[0])) {
        const newPathname = `/${defaultLocale}${pathname}`;
        router.replace(newPathname);
      } else {
        // If the first segment is not a valid locale, replace it with the default locale
        segments[0] = defaultLocale;
        const newPathname = `/${segments.join('/')}`;
        router.replace(newPathname);
      }
    }
  }, [locale, pathname, router]);

  // If the locale is not valid, don't render anything until the redirect happens
  if (!isLocale(locale)) {
    return null;
  }

  return <>{children}</>;
}

export default LocaleValidator;
