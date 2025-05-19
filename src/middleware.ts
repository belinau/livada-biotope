import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './config/i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // Used when no locale matches
  defaultLocale,
  
  // Locale prefix handling
  localePrefix: 'as-needed',
  
  // Disable automatic locale detection
  localeDetection: false,
  
  // Pathnames to ignore
  pathnames: {
    // If you have localized paths, define them here
    // '/about': {
    //   en: '/about',
    //   sl: '/o-nas'
    // }
  },
  
  // Custom domain configuration (if needed)
  // domains: [
  //   {
  //     domain: 'example.com',
  //     defaultLocale: 'en',
  //     locales: ['en'],
  //   },
  //   {
  //     domain: 'example.si',
  //     defaultLocale: 'sl',
  //     locales: ['sl'],
  //   },
  // ],
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all request paths except for:
    // - API routes
    // - Static files
    // - _next/static files
    // - _next/image files
    // - Favicon and manifest files
    // - Public folder files
    '/((?!api|_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|xml|txt|css|js|woff|woff2|ttf|eot)$).*)',
  ],
};
