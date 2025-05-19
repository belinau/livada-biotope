import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, isLocale } from './i18n/config';

// Create the middleware with next-intl configuration
const intlMiddleware = createIntlMiddleware({
  // A list of all locales that are supported
  locales,
  
  // Used when no locale matches
  defaultLocale,
  
  // Add a locale prefix to all URLs
  localePrefix: 'as-needed'
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle root URL - redirect to default locale
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }
  
  // Extract the locale part from the URL
  const pathLocale = pathname.split('/')[1];
  
  // If the locale is invalid, redirect to the same path with default locale
  if (pathLocale && !isLocale(pathLocale)) {
    const newPath = pathname.replace(/^\/[^\/]+/, `/${defaultLocale}`);
    return NextResponse.redirect(new URL(newPath, request.url));
  }
  
  // Let next-intl handle valid locales
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/((?!_next|api|_vercel|.*\\..*).*)',
  ],
};
