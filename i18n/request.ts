import { getRequestConfig } from 'next-intl/server';

// Define the locales that your application supports
export const locales = ['en', 'sl'] as const;
export type Locale = typeof locales[number];

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is defined and valid
  if (!locale || !locales.includes(locale as Locale)) {
    // Default to 'en' if locale is not provided or invalid
    locale = 'en';
  }


  try {
    // Import messages from the correct path
    const messages = (await import(`../../messages/${locale}.json`)).default;
    
    return {
      messages,
      // Ensure we return a valid locale
      locale: locales.includes(locale as Locale) ? locale : 'en',
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    // Return empty messages if loading fails
    return {
      messages: {},
      locale: 'en',
    };
  }
});
