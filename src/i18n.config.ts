import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { ReactNode } from 'react';

// Define the list of supported locales
export const locales = ['en', 'ro'] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = 'en';

// Type guard to check if a string is a valid locale
export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

// Type for messages
interface Messages {
  [key: string]: string | Messages;
}

// Get the messages for the given locale
export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!isLocale(locale)) notFound();

  try {
    const messages = (await import(`@/messages/${locale}.json`)).default as Messages;
    
    return {
      locale,
      messages,
      defaultTranslationValues: {
        strong: (chunks: ReactNode) => <strong>{chunks}</strong>,
        em: (chunks: ReactNode) => <em>{chunks}</em>,
      },
    };
  } catch (error) {
    console.error(`Error loading messages for locale ${locale}:`, error);
    notFound();
  }
});
