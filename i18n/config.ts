import { getRequestConfig } from 'next-intl/server';

// Define supported locales
export const locales = ['en', 'sl'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

// Type guard for locale validation
export const isLocale = (locale: string | undefined): locale is Locale => {
  return typeof locale === 'string' && (locales as ReadonlyArray<string>).includes(locale);
};

// Type for translation messages
type Messages = Record<string, any>;

export default getRequestConfig(async ({ locale }) => {
  // If locale is invalid, use default locale
  const validLocale = isLocale(locale) ? locale : defaultLocale;
  
  try {
    const messages = (await import(`../messages/${validLocale}.json`)).default as Messages;
    
    return {
      messages,
      locale: validLocale
    };
  } catch (error) {
    console.error(`[i18n] Failed to load messages for locale: ${validLocale}`, error);
    // Return empty messages if loading fails
    return {
      messages: {},
      locale: validLocale
    };
  }
});