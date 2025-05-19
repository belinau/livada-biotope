// Define the locales as a const array for type safety
export const locales = ['en', 'sl'] as const;

// Define the Locale type based on the locales array
export type Locale = (typeof locales)[number];

// Define the default locale
export const defaultLocale: Locale = 'en';

// Define locale names for display
export const localeNames: Record<Locale, string> = {
  en: 'English',
  sl: 'Slovenščina',
};

// Type guard to check if a string is a valid locale
export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// For backward compatibility
export type TranslationKey = string;

// Helper function to validate translation keys
export function isValidTranslationKey(key: string): boolean {
  try {
    const parts = key.split('.');
    if (parts.length !== 2) return false;
    
    const [namespace, translationKey] = parts;
    const translations = require(`@/messages/en`);
    
    return (
      namespace in translations && 
      typeof translations[namespace] === 'object' &&
      translationKey in translations[namespace]
    );
  } catch {
    return false;
  }
}

// Alias for backward compatibility
export const getTranslationKey = isValidTranslationKey;
