// Supported locales
export const locales = ['en', 'sl'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

// Locale display names
export const localeNames: Record<Locale, string> = {
  en: 'English',
  sl: 'Slovenščina',
};

// Locale direction
export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  sl: 'ltr',
};

// Locale paths for static assets
export const localePaths: Record<Locale, string> = {
  en: '',
  sl: '/sl',
};

// Date and time formats for each locale
export const dateTimeFormats = {
  en: {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  },
  sl: {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  },
} as const;
