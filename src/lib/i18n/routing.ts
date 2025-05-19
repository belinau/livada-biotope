import { locales, defaultLocale } from '@/config';

type Locale = (typeof locales)[number];

/**
 * Checks if a given locale is a valid locale
 */
export function isLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}

/**
 * Gets the current locale from a pathname
 */
export function getLocaleFromPathname(pathname: string): Locale {
  const [, pathLocale] = pathname.split('/');
  return isLocale(pathLocale) ? pathLocale : defaultLocale;
}

/**
 * Adds or replaces the locale in a pathname
 */
export function localizePathname(pathname: string, locale: Locale): string {
  const [, ...parts] = pathname.split('/');
  
  // If the first part is a locale, replace it
  if (isLocale(parts[0])) {
    parts[0] = locale;
  } else {
    // Otherwise, prepend the locale
    parts.unshift(locale);
  }
  
  // Handle root path
  const path = `/${parts.join('/')}`;
  return path === `/${locale}` ? `/${locale}/` : path;
}

/**
 * Removes the locale from a pathname
 */
export function unlocalizePathname(pathname: string): string {
  const parts = pathname.split('/');
  if (isLocale(parts[1])) {
    const path = `/${parts.slice(2).join('/')}`;
    return path || '/';
  }
  return pathname;
}

/**
 * Gets the pathname without the locale prefix
 */
export function getPathnameWithoutLocale(pathname: string): string {
  const parts = pathname.split('/');
  if (isLocale(parts[1])) {
    return `/${parts.slice(2).join('/')}` || '/';
  }
  return pathname;
}

/**
 * Creates a URL with the specified locale
 */
export function createLocalizedUrl(
  pathname: string,
  locale: Locale,
  searchParams?: URLSearchParams | string
): string {
  const path = localizePathname(pathname, locale);
  const search = searchParams 
    ? typeof searchParams === 'string' 
      ? searchParams 
      : searchParams.toString()
    : '';
  
  return search ? `${path}?${search}` : path;
}

/**
 * Gets the alternate URLs for a pathname
 */
export function getAlternateUrls(
  pathname: string,
  siteUrl: string
): { [locale: string]: string } {
  const path = getPathnameWithoutLocale(pathname);
  return locales.reduce((acc, locale) => ({
    ...acc,
    [locale]: `${siteUrl}${locale === defaultLocale ? '' : `/${locale}`}${path}`,
  }), {});
}

/**
 * Gets the canonical URL for a pathname
 */
export function getCanonicalUrl(
  pathname: string,
  siteUrl: string
): string {
  const path = getPathnameWithoutLocale(pathname);
  return `${siteUrl}${path}`;
}
