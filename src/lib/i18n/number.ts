import { locales, defaultLocale } from '@/config';
import { isLocale } from './routing';

type Locale = (typeof locales)[number];

export type NumberStyle = 'decimal' | 'percent' | 'currency' | 'unit';

export interface NumberFormatOptions extends Intl.NumberFormatOptions {
  style?: NumberStyle;
  currency?: string;
  unit?: string;
  unitDisplay?: 'long' | 'short' | 'narrow';
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
  compactDisplay?: 'short' | 'long';
  signDisplay?: 'auto' | 'never' | 'always' | 'exceptZero';
}

const defaultCurrency = 'EUR';

/**
 * Formats a number according to the specified style and locale
 */
export function formatNumber(
  value: number | string,
  options: NumberFormatOptions = {},
  locale: string = defaultLocale
): string {
  const targetLocale = isLocale(locale) ? locale : defaultLocale;
  const {
    style = 'decimal',
    currency = defaultCurrency,
    unit = 'meter',
    unitDisplay = 'short',
    notation = 'standard',
    compactDisplay = 'short',
    signDisplay = 'auto',
    ...restOptions
  } = options;

  const formatOptions: Intl.NumberFormatOptions = {
    ...restOptions,
    style,
    currency: style === 'currency' ? currency : undefined,
    unit: style === 'unit' ? unit : undefined,
    unitDisplay: style === 'unit' ? unitDisplay : undefined,
    notation,
    compactDisplay: notation === 'compact' ? compactDisplay : undefined,
    signDisplay,
  };

  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numberValue)) {
    console.warn(`Invalid number value: ${value}`);
    return String(value);
  }

  return new Intl.NumberFormat(targetLocale, formatOptions).format(numberValue);
}

/**
 * Formats a number as a currency amount
 */
export function formatCurrency(
  value: number | string,
  currency: string = defaultCurrency,
  options: Omit<NumberFormatOptions, 'style' | 'currency'> = {},
  locale: string = defaultLocale
): string {
  return formatNumber(value, { ...options, style: 'currency', currency }, locale);
}

/**
 * Formats a number as a percentage
 */
export function formatPercent(
  value: number | string,
  options: Omit<NumberFormatOptions, 'style'> = {},
  locale: string = defaultLocale
): string {
  return formatNumber(value, { ...options, style: 'percent' }, locale);
}

/**
 * Formats a number with a unit
 */
export function formatUnit(
  value: number | string,
  unit: string = 'meter',
  options: Omit<NumberFormatOptions, 'style' | 'unit'> = {},
  locale: string = defaultLocale
): string {
  return formatNumber(value, { ...options, style: 'unit', unit }, locale);
}

/**
 * Formats a number in a compact form (e.g., 1.2K, 3.4M)
 */
export function formatCompactNumber(
  value: number | string,
  options: Omit<NumberFormatOptions, 'notation' | 'compactDisplay'> = {},
  locale: string = defaultLocale
): string {
  return formatNumber(value, { ...options, notation: 'compact' }, locale);
}

/**
 * Parses a localized number string into a number
 */
export function parseNumber(
  value: string,
  locale: string = defaultLocale
): number | null {
  const targetLocale = isLocale(locale) ? locale : defaultLocale;
  
  // Get the decimal and group separators for the locale
  const parts = new Intl.NumberFormat(targetLocale).formatToParts(12345.6);
  const numerals = [...new Intl.NumberFormat(targetLocale, { useGrouping: false }).format(9876543210)].reverse();
  const index = new Map(numerals.map((d, i) => [d, i]));
  
  const group = parts.find(part => part.type === 'group')?.value || '';
  const decimal = parts.find(part => part.type === 'decimal')?.value || '.';
  
  // Remove all non-numeric characters except the first decimal separator
  let cleaned = '';
  let hasDecimal = false;
  
  for (const char of value) {
    if (index.has(char)) {
      cleaned += index.get(char);
    } else if (char === decimal && !hasDecimal) {
      cleaned += '.';
      hasDecimal = true;
    } else if (char === group) {
      // Skip group separators
      continue;
    } else if (/[+\-]/.test(char) && cleaned.length === 0) {
      // Handle sign at the beginning
      cleaned += char;
    }
  }
  
  const result = parseFloat(cleaned);
  return isNaN(result) ? null : result;
}

/**
 * Converts a number to words (supports English and Slovenian)
 */
export function numberToWords(
  num: number,
  locale: string = defaultLocale
): string {
  const targetLocale = isLocale(locale) ? locale : defaultLocale;
  
  if (targetLocale === 'sl') {
    return numberToSlovenianWords(num);
  }
  
  // Default to English
  return numberToEnglishWords(num);
}

// Helper function for English number to words conversion
function numberToEnglishWords(num: number): string {
  if (num === 0) return 'zero';
  
  const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const scales = ['', 'thousand', 'million', 'billion', 'trillion'];
  
  function convertLessThanOneThousand(n: number): string {
    if (n === 0) return '';
    
    let result = '';
    
    if (n >= 100) {
      result += units[Math.floor(n / 100)] + ' hundred';
      n %= 100;
      if (n !== 0) result += ' ';
    }
    
    if (n >= 20) {
      result += tens[Math.floor(n / 10)];
      if (n % 10 !== 0) {
        result += '-' + units[n % 10];
      }
    } else if (n >= 10) {
      result += teens[n - 10];
    } else if (n > 0) {
      result += units[n];
    }
    
    return result;
  }
  
  if (num < 0) {
    return 'minus ' + numberToEnglishWords(-num);
  }
  
  let result = '';
  let scale = 0;
  
  while (num > 0) {
    const chunk = num % 1000;
    if (chunk !== 0) {
      let chunkStr = convertLessThanOneThousand(chunk);
      if (scale > 0) {
        chunkStr += ' ' + scales[scale];
      }
      result = chunkStr + (result ? ' ' + result : '');
    }
    num = Math.floor(num / 1000);
    scale++;
  }
  
  return result.trim();
}

// Helper function for Slovenian number to words conversion
function numberToSlovenianWords(num: number): string {
  if (num === 0) return 'nič';
  
  const units = ['', 'ena', 'dva', 'tri', 'štiri', 'pet', 'šest', 'sedem', 'osem', 'devet'];
  const teens = ['deset', 'enajst', 'dvanajst', 'trinajst', 'štirinajst', 'petnajst', 'šestnajst', 'sedemnajst', 'osemnajst', 'devetnajst'];
  const tens = ['', 'deset', 'dvajset', 'trideset', 'štirideset', 'petdeset', 'šestdeset', 'sedemdeset', 'osemdeset', 'devetdeset'];
  const hundreds = ['', 'sto', 'dvesto', 'tristo', 'štiristo', 'petsto', 'šesto', 'sedemsto', 'osemsto', 'devetsto'];
  const scales = ['', 'tisoč', 'milijon', 'milijarda', 'bilijon'];
  
  function convertLessThanOneThousand(n: number, isFemale: boolean = false): string {
    if (n === 0) return '';
    
    let result = '';
    
    if (n >= 100) {
      result += hundreds[Math.floor(n / 100)];
      n %= 100;
      if (n !== 0) result += ' ';
    }
    
    if (n >= 20) {
      const ten = Math.floor(n / 10);
      const unit = n % 10;
      if (unit !== 0) {
        result += (unit === 1 ? 'en' : units[unit]) + 'in' + tens[ten].slice(1);
      } else {
        result += tens[ten];
      }
    } else if (n >= 10) {
      result += teens[n - 10];
    } else if (n > 0) {
      if (n === 1 && isFemale) {
        result += 'ena';
      } else if (n === 2 && isFemale) {
        result += 'dve';
      } else {
        result += units[n];
      }
    }
    
    return result;
  }
  
  if (num < 0) {
    return 'minus ' + numberToSlovenianWords(-num);
  }
  
  let result = '';
  let scale = 0;
  
  while (num > 0) {
    const chunk = num % 1000;
    if (chunk !== 0) {
      let chunkStr = convertLessThanOneThousand(chunk, scale === 1);
      if (scale > 0) {
        // Handle plural forms for scales
        if (chunk % 100 === 1) {
          chunkStr += ' ' + scales[scale];
        } else if (chunk % 100 === 2) {
          chunkStr += ' ' + scales[scale] + 'a';
        } else if (chunk % 100 === 3 || chunk % 100 === 4) {
          chunkStr += ' ' + scales[scale] + 'e';
        } else {
          chunkStr += ' ' + scales[scale] + 'ov';
        }
      }
      result = chunkStr + (result ? ' ' + result : '');
    }
    num = Math.floor(num / 1000);
    scale++;
  }
  
  return result.trim();
}
