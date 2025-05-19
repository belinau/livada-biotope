/**
 * i18n Configuration
 * 
 * This file serves as the single source of truth for all i18n-related configuration.
 */
import { notFound } from 'next/navigation';

// Supported locales
export const locales = ['en', 'sl'] as const;

export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = 'en';

// Locale display names
export const localeNames: Record<Locale, string> = {
  en: 'English',
  sl: 'Slovenščina',
} as const;

/**
 * Type guard to check if a string is a valid locale
 */
export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/**
 * Validates and returns a valid locale, falling back to the default locale
 */
export function getValidLocale(locale: unknown): Locale {
  return isLocale(locale) ? locale : defaultLocale;
}

/**
 * Gets the locale from a pathname
 */
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const maybeLocale = segments[0];
  return isLocale(maybeLocale) ? maybeLocale : defaultLocale;
}

/**
 * Adds or replaces the locale in a pathname
 */
export function localizePathname(pathname: string, locale: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  
  // If the first segment is a locale, replace it
  if (isLocale(segments[0])) {
    segments[0] = locale;
    return `/${segments.join('/')}`;
  }
  
  // Otherwise, prepend the locale
  return `/${[locale, ...segments].join('/')}`;
}

/**
 * Removes the locale from a pathname
 */
export function unlocalizePathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  
  if (isLocale(segments[0])) {
    return `/${segments.slice(1).join('/')}`;
  }
  
  return pathname;
}

/**
 * Gets the pathname without the locale
 */
export function getPathnameWithoutLocale(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  
  if (isLocale(segments[0])) {
    return `/${segments.slice(1).join('/')}`;
  }
  
  return pathname;
}

// Type for translation messages
type Messages = Record<string, any>;

/**
 * Loads messages for a given locale
 */
export async function getMessages(locale: string): Promise<Messages> {
  // Ensure the locale is valid
  if (!isLocale(locale)) {
    console.error(`[i18n] Invalid locale: ${locale}`);
    notFound();
  }

  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`[i18n] Failed to load messages for locale: ${locale}`, error);
    notFound();
  }
}
