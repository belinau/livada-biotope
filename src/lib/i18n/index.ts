// Re-export all i18n utilities for easier imports

// Core
import { locales, defaultLocale } from '@/config';
export { locales, defaultLocale };

// Routing
export * from './routing';

// Date and time formatting
export * from './date';

// Number formatting
export * from './number';

// Pluralization
export * from './plural';
// Text handling
export * from './text';

// Types
export type { Locale } from './routing';
export type { DateStyle } from './date';
export type { NumberStyle, NumberFormatOptions } from './number';
export type { PluralRule, PluralOptions } from './plural';
export type { TextDirection, Script, LocaleInfo } from './text';

// Utility functions

/**
 * Gets the current locale from the URL or defaults to the default locale
 */
export function getCurrentLocale(pathname: string = window.location.pathname): string {
  const [, pathLocale] = pathname.split('/');
  return locales.includes(pathLocale as any) ? pathLocale : defaultLocale;
}

/**
 * Gets the current URL with a different locale
 */
export function getLocalizedUrl(
  pathname: string,
  targetLocale: string = defaultLocale,
  currentLocale: string = defaultLocale
): string {
  // Remove current locale if present
  const pathWithoutLocale = pathname.replace(new RegExp(`^/(${locales.join('|')})`), '');
  
  // Add target locale if it's not the default
  return targetLocale === defaultLocale
    ? pathWithoutLocale || '/'
    : `/${targetLocale}${pathWithoutLocale || '/'}`;
}

/**
 * Gets the current URL with query parameters
 */
export function getUrlWithParams(
  pathname: string,
  params: Record<string, string | number | boolean | undefined>,
  options: { removeUndefined?: boolean } = {}
): string {
  const { removeUndefined = true } = options;
  
  // Filter out undefined values if needed
  const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== undefined && (removeUndefined ? value !== '' : true)) {
      acc[key] = String(value);
    }
    return acc;
  }, {} as Record<string, string>);
  
  const searchParams = new URLSearchParams(filteredParams).toString();
  const separator = pathname.includes('?') ? '&' : '?';
  
  return searchParams ? `${pathname}${separator}${searchParams}` : pathname;
}

/**
 * Gets the current URL with a different locale and query parameters
 */
export function getLocalizedUrlWithParams(
  pathname: string,
  targetLocale: string = defaultLocale,
  params: Record<string, string | number | boolean | undefined> = {},
  options: { removeUndefined?: boolean } = {}
): string {
  const localizedPath = getLocalizedUrl(pathname, targetLocale);
  return getUrlWithParams(localizedPath, params, options);
}

/**
 * Gets the current URL with a hash
 */
export function getUrlWithHash(
  pathname: string,
  hash: string
): string {
  // Remove any existing hash
  const pathWithoutHash = pathname.split('#')[0];
  return `${pathWithoutHash}${hash ? `#${hash}` : ''}`;
}

/**
 * Gets the current URL with query parameters and hash
 */
export function getUrlWithParamsAndHash(
  pathname: string,
  params: Record<string, string | number | boolean | undefined> = {},
  hash: string = '',
  options: { removeUndefined?: boolean } = {}
): string {
  const urlWithParams = getUrlWithParams(pathname, params, options);
  return getUrlWithHash(urlWithParams, hash);
}

/**
 * Gets the current URL with a different locale, query parameters, and hash
 */
export function getLocalizedUrlWithParamsAndHash(
  pathname: string,
  targetLocale: string = defaultLocale,
  params: Record<string, string | number | boolean | undefined> = {},
  hash: string = '',
  options: { removeUndefined?: boolean } = {}
): string {
  const localizedPath = getLocalizedUrl(pathname, targetLocale);
  return getUrlWithParamsAndHash(localizedPath, params, hash, options);
}

/**
 * Creates a URL object with locale, query parameters, and hash
 */
export function createUrlObject(
  pathname: string,
  options: {
    locale?: string;
    params?: Record<string, string | number | boolean | undefined>;
    hash?: string;
    removeUndefinedParams?: boolean;
  } = {}
): URL {
  const { locale, params = {}, hash = '', removeUndefinedParams = true } = options;
  
  // Get the base URL with the correct locale
  const baseUrl = locale ? getLocalizedUrl(pathname, locale) : pathname;
  
  // Create a URL object
  const url = new URL(baseUrl, window.location.origin);
  
  // Set query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && (removeUndefinedParams ? value !== '' : true)) {
      url.searchParams.set(key, String(value));
    }
  });
  
  // Set hash
  if (hash) {
    url.hash = hash;
  }
  
  return url;
}

/**
 * Gets the current URL with all its components
 */
export function getCurrentUrlComponents(): {
  pathname: string;
  locale: string;
  params: URLSearchParams;
  hash: string;
  fullPath: string;
} {
  const { pathname, search, hash } = window.location;
  const locale = getCurrentLocale(pathname);
  const params = new URLSearchParams(search);
  
  return {
    pathname,
    locale,
    params,
    hash: hash.slice(1), // Remove the '#'
    fullPath: `${pathname}${search}${hash}`,
  };
}

/**
 * Checks if the current URL matches a given path pattern
 */
export function isCurrentPath(
  pathPattern: string | RegExp,
  options: { exact?: boolean } = {}
): boolean {
  const { exact = false } = options;
  const { pathname } = window.location;
  
  if (typeof pathPattern === 'string') {
    // Handle exact match
    if (exact) {
      return pathname === pathPattern;
    }
    
    // Handle startsWith match
    return pathname.startsWith(pathPattern);
  }
  
  // Handle regex match
  return pathPattern.test(pathname);
}

/**
 * Gets the current URL with updated query parameters
 */
export function updateUrlParams(
  updates: Record<string, string | number | boolean | undefined | null>,
  options: { removeUndefined?: boolean } = {}
): string {
  const { pathname, search } = window.location;
  const params = new URLSearchParams(search);
  
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined || (options.removeUndefined && value === '')) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  });
  
  const searchString = params.toString();
  return `${pathname}${searchString ? `?${searchString}` : ''}`;
}

/**
 * Navigates to a new URL with optional state and replace flag
 */
export function navigateTo(
  url: string,
  options: { replace?: boolean; state?: any; scroll?: boolean } = {}
): void {
  const { replace = false, state = null, scroll = true } = options;
  
  if (replace) {
    window.history.replaceState(state, '', url);
  } else {
    window.history.pushState(state, '', url);
  }
  
  // Scroll to top if needed
  if (scroll) {
    window.scrollTo(0, 0);
  }
  
  // Dispatch a custom event to notify about the navigation
  window.dispatchEvent(new CustomEvent('routeChange', { detail: { url, replace, state } }));
}

/**
 * Reloads the current page with a new locale
 */
export function changeLocale(
  newLocale: string,
  options: { replace?: boolean } = {}
): void {
  const currentPath = window.location.pathname;
  const newPath = getLocalizedUrl(currentPath, newLocale);
  navigateTo(newPath, { replace: options.replace });
}

/**
 * Gets the current URL with a new locale
 */
export function getUrlWithLocale(
  newLocale: string,
  options: { currentPath?: string } = {}
): string {
  const currentPath = options.currentPath || window.location.pathname;
  return getLocalizedUrl(currentPath, newLocale);
}

/**
 * Gets the current URL with updated query parameters and hash
 */
export function getUpdatedUrl(
  updates: {
    params?: Record<string, string | number | boolean | undefined | null>;
    hash?: string | null;
    removeUndefinedParams?: boolean;
  } = {}
): string {
  const { params = {}, hash = null, removeUndefinedParams = true } = updates;
  const { pathname, search } = window.location;
  
  // Update query parameters
  const urlParams = new URLSearchParams(search);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || (removeUndefinedParams && value === '')) {
      urlParams.delete(key);
    } else {
      urlParams.set(key, String(value));
    }
  });
  
  // Build the URL
  const searchString = urlParams.toString();
  const hashString = hash === null ? window.location.hash : hash ? `#${hash}` : '';
  
  return `${pathname}${searchString ? `?${searchString}` : ''}${hashString}`;
}

/**
 * Updates the URL with new query parameters and/or hash
 */
export function updateUrl(
  updates: {
    params?: Record<string, string | number | boolean | undefined | null>;
    hash?: string | null;
    removeUndefinedParams?: boolean;
    replace?: boolean;
    scroll?: boolean;
  } = {}
): void {
  const { replace = false, scroll = true, ...rest } = updates;
  const newUrl = getUpdatedUrl(rest);
  navigateTo(newUrl, { replace, scroll });
}

// Export all utilities as a single object for easier use in templates
export const i18n = {
  // Core
  locales,
  defaultLocale,
  
  // Functions
  getCurrentLocale,
  getLocalizedUrl,
  getUrlWithParams,
  getLocalizedUrlWithParams,
  getUrlWithHash,
  getUrlWithParamsAndHash,
  getLocalizedUrlWithParamsAndHash,
  createUrlObject,
  getCurrentUrlComponents,
  isCurrentPath,
  updateUrlParams,
  navigateTo,
  changeLocale,
  getUrlWithLocale,
  getUpdatedUrl,
  updateUrl,
  
  // Re-export all other utilities
  ...require('./routing'),
  ...require('./date'),
  ...require('./number'),
  ...require('./plural'),
  ...require('./text'),
};

// Default export for easier imports
export default i18n;
