import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, isLocale } from '@/i18n/config';

// Type for translation messages
type Messages = Record<string, any>;

export default getRequestConfig(async ({ locale }) => {
  // Validate the incoming locale parameter
  if (!isLocale(locale)) {
    console.error(`[i18n] Invalid locale: ${locale}`);
    notFound();
  }

  try {
    const messages = (await import(`../../../messages/${locale}.json`)).default as Messages;
    return { messages, locale };
  } catch (error) {
    console.error(`[i18n] Failed to load messages for locale: ${locale}`, error);
    notFound();
  }
});

export async function loadTranslations(locale: string, namespace: string) {
  try {
    const messages = (await import(`../../../messages/${locale}.json`)).default;
    return messages[namespace] || {};
  } catch (error) {
    console.error(`[i18n] Failed to load messages for ${locale}`, error);
    return {};
  }
}

// Helper to get the current locale from the URL
export function getLocaleFromPathname(pathname: string): string | null {
  const [, locale] = pathname.split('/');
  return locales.includes(locale as any) ? locale : null;
}
