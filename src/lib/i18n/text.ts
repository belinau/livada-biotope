import { locales, defaultLocale } from '@/config';
import { isLocale } from './routing';

type Locale = (typeof locales)[number];

type TextDirection = 'ltr' | 'rtl';

type Script = 'Latn' | 'Cyrl' | 'Arab' | 'Deva' | 'Hans' | 'Hant' | 'Jpan' | 'Kore' | 'Thai' | 'Hebr' | 'Grek' | 'Armn' | 'Gujr' | 'Taml' | 'Geor' | 'Laoo' | 'Mlym' | 'Mymr' | 'Sinh' | 'Tibt' | 'Thaa' | string;

interface LocaleInfo {
  /**
   * The language code (e.g., 'en', 'sl')
   */
  language: string;
  
  /**
   * The region code if available (e.g., 'US', 'GB', 'SI')
   */
  region?: string;
  
  /**
   * The script code if available (e.g., 'Latn', 'Cyrl')
   */
  script?: Script;
  
  /**
   * The text direction ('ltr' or 'rtl')
   */
  direction: TextDirection;
  
  /**
   * Whether the locale is right-to-left
   */
  isRTL: boolean;
  
  /**
   * Whether the locale is left-to-right
   */
  isLTR: boolean;
  
  /**
   * The display name of the locale in the locale's language
   */
  displayName: string;
  
  /**
   * The display name of the language in the current locale
   */
  languageName: string;
  
  /**
   * The display name of the region in the current locale (if available)
   */
  regionName?: string;
}

// Cache for locale info
const localeInfoCache: Record<string, LocaleInfo> = {};

// Common RTL languages
const rtlLanguages = new Set([
  'ar',  // Arabic
  'arc', // Aramaic
  'bcc', // Southern Balochi
  'bqi', // Bakthiari
  'ckb', // Sorani
  'dv',  // Divehi
  'fa',  // Persian
  'fa_AF', // Persian (Afghanistan)
  'glk', // Gilaki
  'he',  // Hebrew
  'ku',  // Kurdish
  'mzn', // Mazanderani
  'pnb', // Western Punjabi
  'ps',  // Pashto
  'sd',  // Sindhi
  'ug',  // Uyghur
  'ur',  // Urdu
  'yi',  // Yiddish
]);

// Common scripts for languages
const languageScripts: Record<string, Script> = {
  // Latin script
  en: 'Latn',
  es: 'Latn',
  fr: 'Latn',
  de: 'Latn',
  it: 'Latn',
  pt: 'Latn',
  nl: 'Latn',
  pl: 'Latn',
  uk: 'Cyrl',
  ru: 'Cyrl',
  sr: 'Cyrl',
  bg: 'Cyrl',
  mk: 'Cyrl',
  // Add more as needed
};

/**
 * Parses a locale string into its components
 */
function parseLocale(locale: string): { language: string; region?: string; script?: string } {
  // Handle cases like 'en-US', 'zh-Hans', 'zh-Hans-CN'
  const parts = locale.split(/[_-]/);
  
  const result: { language: string; region?: string; script?: string } = {
    language: parts[0].toLowerCase(),
  };
  
  if (parts.length > 1) {
    // Check if the second part is a script (4 letters) or region (2-3 letters)
    if (parts[1].length === 4) {
      result.script = parts[1];
      if (parts.length > 2) {
        result.region = parts[2].toUpperCase();
      }
    } else if (parts[1].length === 2 || parts[1].length === 3) {
      result.region = parts[1].toUpperCase();
      if (parts.length > 2 && parts[2].length === 4) {
        result.script = parts[2];
      }
    }
  }
  
  return result;
}

/**
 * Gets information about a locale
 */
export function getLocaleInfo(locale: string = defaultLocale): LocaleInfo {
  const targetLocale = isLocale(locale) ? locale : defaultLocale;
  
  // Return cached info if available
  if (localeInfoCache[targetLocale]) {
    return localeInfoCache[targetLocale];
  }
  
  const { language, region, script } = parseLocale(targetLocale);
  const isRTL = rtlLanguages.has(targetLocale) || rtlLanguages.has(language);
  const direction: TextDirection = isRTL ? 'rtl' : 'ltr';
  
  // Get display names
  let displayName = '';
  let languageName = '';
  let regionName = '';
  
  try {
    const displayNames = new Intl.DisplayNames([targetLocale], { type: 'language' });
    const regionDisplayNames = new Intl.DisplayNames([targetLocale], { type: 'region' });
    
    // Get display name in the locale's language
    displayName = displayNames.of(targetLocale) || targetLocale;
    
    // Get language name in the current locale
    languageName = new Intl.DisplayNames([targetLocale], { type: 'language' }).of(language) || language;
    
    // Get region name if available
    if (region) {
      regionName = regionDisplayNames.of(region) || region;
    }
  } catch (e) {
    console.warn(`Failed to get display names for locale: ${targetLocale}`, e);
    displayName = targetLocale;
    languageName = language;
    regionName = region || '';
  }
  
  const info: LocaleInfo = {
    language,
    region,
    script: script as Script || languageScripts[language],
    direction,
    isRTL,
    isLTR: !isRTL,
    displayName,
    languageName,
    regionName: region ? regionName : undefined,
  };
  
  // Cache the result
  localeInfoCache[targetLocale] = info;
  
  return info;
}

/**
 * Gets the text direction for a locale
 */
export function getTextDirection(locale: string = defaultLocale): TextDirection {
  return getLocaleInfo(locale).direction;
}

/**
 * Checks if a locale is right-to-left
 */
export function isRTL(locale: string = defaultLocale): boolean {
  return getLocaleInfo(locale).isRTL;
}

/**
 * Checks if a locale is left-to-right
 */
export function isLTR(locale: string = defaultLocale): boolean {
  return getLocaleInfo(locale).isLTR;
}

/**
 * Wraps text with appropriate directionality markers if needed
 */
export function bidiText(
  text: string,
  locale: string = defaultLocale,
  options: { wrapRTL?: boolean; wrapLTR?: boolean } = {}
): string {
  const { wrapRTL = true, wrapLTR = false } = options;
  const { isRTL } = getLocaleInfo(locale);
  
  if (isRTL && wrapRTL) {
    // RLM = Right-to-Left Mark
    return `\u200F${text}\u200F`;
  } else if (!isRTL && wrapLTR) {
    // LRM = Left-to-Right Mark
    return `\u200E${text}\u200E`;
  }
  
  return text;
}

/**
 * Truncates text to a maximum length, respecting word boundaries and RTL text
 */
export function truncateText(
  text: string,
  maxLength: number,
  locale: string = defaultLocale,
  options: { ellipsis?: string; trim?: boolean } = {}
): string {
  const { ellipsis = '…', trim = true } = options;
  const { isRTL } = getLocaleInfo(locale);
  
  if (typeof text !== 'string' || text.length <= maxLength) {
    return text;
  }
  
  // Trim whitespace if needed
  let result = trim ? text.trim() : text;
  
  // Truncate to max length (accounting for ellipsis)
  const maxTextLength = maxLength - ellipsis.length;
  if (maxTextLength <= 0) {
    return ellipsis;
  }
  
  if (isRTL) {
    // For RTL, truncate from the start
    const truncated = result.slice(-maxTextLength);
    return ellipsis + truncated;
  } else {
    // For LTR, truncate from the end
    const truncated = result.slice(0, maxTextLength);
    
    // Try to find the last word boundary
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 0 && lastSpace > maxTextLength / 2) {
      return truncated.slice(0, lastSpace) + ellipsis;
    }
    
    return truncated + ellipsis;
  }
}

/**
 * Capitalizes the first letter of a string according to locale rules
 */
export function capitalize(
  text: string,
  locale: string = defaultLocale,
  options: { restToLower?: boolean } = {}
): string {
  const { restToLower = false } = options;
  
  if (!text) return text;
  
  const firstChar = text[0];
  const rest = text.slice(1);
  
  const capitalizedFirst = firstChar.toLocaleUpperCase(locale);
  const processedRest = restToLower ? rest.toLocaleLowerCase(locale) : rest;
  
  return capitalizedFirst + processedRest;
}

/**
 * Converts a string to title case according to locale rules
 */
export function toTitleCase(
  text: string,
  locale: string = defaultLocale
): string {
  if (!text) return text;
  
  return text.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toLocaleUpperCase(locale) + word.slice(1).toLocaleLowerCase(locale)
  );
}

/**
 * Normalizes line endings to \n and normalizes other whitespace
 */
export function normalizeWhitespace(text: string): string {
  if (!text) return text;
  
  // Normalize line endings to LF
  let normalized = text.replace(/\r\n?/g, '\n');
  
  // Replace all whitespace sequences with a single space
  normalized = normalized.replace(/[\s\u00A0]+/g, ' ');
  
  return normalized.trim();
}

/**
 * Removes diacritics (accents) from a string
 */
export function removeDiacritics(text: string): string {
  if (!text) return text;
  
  return text.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove combining diacritical marks
    .normalize('NFC'); // Recombine any remaining characters
}

/**
 * Compares two strings according to the specified locale and options
 */
export function compareStrings(
  a: string,
  b: string,
  locale: string = defaultLocale,
  options: Intl.CollatorOptions = {}
): number {
  return new Intl.Collator(locale, {
    sensitivity: 'base',
    ignorePunctuation: true,
    ...options,
  }).compare(a, b);
}

/**
 * Sorts an array of strings according to the specified locale and options
 */
export function sortStrings(
  strings: string[],
  locale: string = defaultLocale,
  options: Intl.CollatorOptions = {}
): string[] {
  return [...strings].sort((a, b) => compareStrings(a, b, locale, options));
}
