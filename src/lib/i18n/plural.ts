import { locales, defaultLocale } from '@/config';
import { isLocale } from './routing';

type Locale = (typeof locales)[number];

type PluralRule = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

export interface PluralOptions {
  count?: number;
  offset?: number;
  type?: 'cardinal' | 'ordinal';
}

// Cache for Intl.PluralRules instances
const pluralRulesCache: Record<string, Intl.PluralRules> = {};

/**
 * Gets the plural form for a given count and locale
 */
export function getPluralForm(
  count: number,
  locale: string = defaultLocale,
  options: Omit<PluralOptions, 'count' | 'offset'> = {}
): PluralRule {
  const targetLocale = isLocale(locale) ? locale : defaultLocale;
  const cacheKey = `${targetLocale}-${options.type || 'cardinal'}`;
  
  if (!pluralRulesCache[cacheKey]) {
    pluralRulesCache[cacheKey] = new Intl.PluralRules(targetLocale, {
      type: options.type || 'cardinal',
    });
  }
  
  return pluralRulesCache[cacheKey].select(count) as PluralRule;
}

/**
 * Selects the correct string based on the count and plural rules
 */
export function pluralize<T extends Record<PluralRule, string> | [string, string] | [string, string, string]>(
  count: number,
  forms: T,
  locale: string = defaultLocale,
  options: PluralOptions = {}
): string {
  const { count: explicitCount = count, offset = 0 } = options;
  const targetCount = explicitCount - offset;
  
  // Handle simple [one, other] or [one, few, other] arrays
  if (Array.isArray(forms)) {
    if (forms.length === 2) {
      // English-style pluralization: ["item", "items"]
      return targetCount === 1 ? forms[0] : forms[1];
    } else if (forms.length === 3) {
      // Some languages need 3 forms: ["0 items", "1 item", "2 items"]
      if (targetCount === 0) return forms[0];
      if (targetCount === 1) return forms[1];
      return forms[2];
    }
  }
  
  // Handle full plural form objects
  const pluralForm = getPluralForm(targetCount, locale, options);
  
  // Try to find the most specific form available
  if (forms[pluralForm] !== undefined) {
    return forms[pluralForm];
  }
  
  // Fallback to 'other' if available
  if (forms.other !== undefined) {
    return forms.other;
  }
  
  // Last resort: return the first available form
  return Object.values(forms)[0] || '';
}

/**
 * Formats a string with a count and plural form
 */
export function formatPlural(
  count: number,
  forms: Record<PluralRule, string> | [string, string] | [string, string, string],
  locale: string = defaultLocale,
  options: PluralOptions & { formatNumber?: boolean } = {}
): string {
  const { formatNumber: shouldFormat = true, ...pluralOptions } = options;
  const formattedCount = shouldFormat 
    ? new Intl.NumberFormat(locale).format(count) 
    : String(count);
  
  const selectedForm = pluralize(count, forms, locale, pluralOptions);
  
  // Replace {count} placeholder with the actual count
  return selectedForm.replace(/\{count\}/g, formattedCount);
}

/**
 * Gets the ordinal suffix for a number (e.g., 1st, 2nd, 3rd, 4th)
 */
export function getOrdinalSuffix(
  num: number,
  locale: string = defaultLocale
): string {
  const targetLocale = isLocale(locale) ? locale : defaultLocale;
  
  // Special handling for English
  if (targetLocale.startsWith('en')) {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  }
  
  // Special handling for Slovenian
  if (targetLocale === 'sl') {
    if (num % 100 === 1) return '.';  // 1., 101., 201., ...
    if (num % 100 === 2) return '.';  // 2., 102., 202., ...
    if (num % 100 === 3 || num % 100 === 4) return '.';  // 3., 4., 103., 104., ...
    return '.';  // 0., 5., 6., 7., 8., 9., 10., 11., 12., 13., 14., ...
  }
  
  // Default to a dot for other languages
  return '.';
}

/**
 * Formats a number as an ordinal (e.g., 1st, 2nd, 3rd, 4th)
 */
export function formatOrdinal(
  num: number,
  locale: string = defaultLocale
): string {
  const targetLocale = isLocale(locale) ? locale : defaultLocale;
  
  // Special handling for English
  if (targetLocale.startsWith('en')) {
    const formatter = new Intl.PluralRules(targetLocale, { type: 'ordinal' });
    const rule = formatter.select(num);
    
    switch (rule) {
      case 'one': return `${num}st`;
      case 'two': return `${num}nd`;
      case 'few': return `${num}rd`;
      default: return `${num}th`;
    }
  }
  
  // For other languages, just append a dot (common in many European languages)
  return `${num}.`;
}

// Predefined plural forms for common use cases
export const pluralForms = {
  // English
  en: {
    items: ['item', 'items'],
    points: ['point', 'points'],
    comments: ['comment', 'comments'],
    people: ['person', 'people'],
    times: ['time', 'times'],
  },
  // Slovenian
  sl: {
    items: ['kos', 'kosa', 'kosov'],
    points: ['točka', 'točki', 'točke', 'točk'],
    comments: ['komentar', 'komentarja', 'komentarji', 'komentarjev'],
    people: ['oseba', 'osebi', 'osebe', 'oseb'],
    times: ['krat', 'krat', 'krat', 'krat'],
  },
} as const;

/**
 * Gets a predefined plural form for a given key and count
 */
export function getPluralFormByKey(
  key: keyof typeof pluralForms.en | keyof typeof pluralForms.sl,
  count: number,
  locale: string = defaultLocale
): string {
  const targetLocale = isLocale(locale) ? locale : defaultLocale;
  const forms = pluralForms[targetLocale] || pluralForms[defaultLocale];
  const formArray = forms[key];
  
  if (!formArray) {
    console.warn(`No plural form found for key: ${key}`);
    return String(count);
  }
  
  return formatPlural(count, formArray as any, locale);
}
