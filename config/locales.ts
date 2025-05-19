// Supported locales
export const locales = ['en', 'sl'] as const;
export const defaultLocale = 'en';

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
