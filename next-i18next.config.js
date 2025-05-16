module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'sl'],
    localeDetection: false,
  },
  // Path to your translation files
  localePath: './public/locales',
  // Use JSON files directly
  defaultNS: 'translation',
  // Debug only in development
  debug: process.env.NODE_ENV === 'development',
  // Fallback to default locale
  fallbackLng: 'en',
  // No file extension needed
  localeExtension: 'json',
  // Reload in development
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
