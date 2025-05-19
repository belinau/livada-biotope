import { locales, defaultLocale } from '@/config';
import { isLocale } from './routing';

type Locale = (typeof locales)[number];

export type DateStyle = 'full' | 'long' | 'medium' | 'short' | 'monthYear' | 'time';

const dateTimeFormats: Record<Locale, Record<DateStyle, Intl.DateTimeFormatOptions>> = {
  en: {
    full: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
    medium: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    short: {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
    },
    monthYear: {
      year: 'numeric',
      month: 'long',
    },
    time: {
      hour: '2-digit',
      minute: '2-digit',
    },
  },
  sl: {
    full: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
    medium: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    short: {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
    },
    monthYear: {
      year: 'numeric',
      month: 'long',
    },
    time: {
      hour: '2-digit',
      minute: '2-digit',
    },
  },
};

/**
 * Formats a date according to the specified style and locale
 */
export function formatDate(
  date: Date | string | number,
  style: DateStyle = 'medium',
  locale: string = defaultLocale
): string {
  const targetLocale = isLocale(locale) ? locale : defaultLocale;
  const options = dateTimeFormats[targetLocale][style];
  
  // Handle string and number dates
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  return new Intl.DateTimeFormat(targetLocale, options).format(dateObj);
}

/**
 * Formats a date range
 */
export function formatDateRange(
  startDate: Date | string | number,
  endDate: Date | string | number,
  style: DateStyle = 'medium',
  locale: string = defaultLocale
): string {
  const targetLocale = isLocale(locale) ? locale : defaultLocale;
  const start = typeof startDate === 'string' || typeof startDate === 'number' 
    ? new Date(startDate) 
    : startDate;
  
  const end = typeof endDate === 'string' || typeof endDate === 'number' 
    ? new Date(endDate) 
    : endDate;
  
  // If the dates are the same, just return a single formatted date
  if (start.getTime() === end.getTime()) {
    return formatDate(start, style, locale);
  }
  
  // For the same month, format as "15.-17. april 2023"
  if (start.getFullYear() === end.getFullYear() && 
      start.getMonth() === end.getMonth()) {
    const dayFormat = { day: 'numeric' } as const;
    const monthYearFormat = { month: 'long', year: 'numeric' } as const;
    
    const dayStart = new Intl.DateTimeFormat(targetLocale, dayFormat).format(start);
    const dayEnd = new Intl.DateTimeFormat(targetLocale, dayFormat).format(end);
    const monthYear = new Intl.DateTimeFormat(targetLocale, monthYearFormat).format(end);
    
    return `${dayStart}.-${dayEnd}. ${monthYear}`;
  }
  
  // For the same year, format as "15. april - 17. maj 2023"
  if (start.getFullYear() === end.getFullYear()) {
    const dayMonthFormat = { day: 'numeric', month: 'long' } as const;
    const yearFormat = { year: 'numeric' } as const;
    
    const dayMonthStart = new Intl.DateTimeFormat(targetLocale, dayMonthFormat).format(start);
    const dayMonthEnd = new Intl.DateTimeFormat(targetLocale, dayMonthFormat).format(end);
    const year = new Intl.DateTimeFormat(targetLocale, yearFormat).format(end);
    
    return `${dayMonthStart} - ${dayMonthEnd} ${year}`;
  }
  
  // For different years, format as "15. april 2022 - 17. maj 2023"
  const fullFormat = { day: 'numeric', month: 'long', year: 'numeric' } as const;
  const startStr = new Intl.DateTimeFormat(targetLocale, fullFormat).format(start);
  const endStr = new Intl.DateTimeFormat(targetLocale, fullFormat).format(end);
  
  return `${startStr} - ${endStr}`;
}

/**
 * Gets the relative time string (e.g., "2 days ago")
 */
export function getRelativeTimeString(
  date: Date | string | number,
  locale: string = defaultLocale
): string {
  const targetLocale = isLocale(locale) ? locale : defaultLocale;
  const formatter = new Intl.RelativeTimeFormat(targetLocale, { numeric: 'auto' });
  
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  const now = new Date();
  const diffInMs = dateObj.getTime() - now.getTime();
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));
  
  if (Math.abs(diffInDays) < 1) {
    const diffInHours = Math.round(diffInMs / (1000 * 60 * 60));
    if (Math.abs(diffInHours) < 1) {
      const diffInMinutes = Math.round(diffInMs / (1000 * 60));
      return formatter.format(diffInMinutes, 'minute');
    }
    return formatter.format(diffInHours, 'hour');
  }
  
  if (Math.abs(diffInDays) < 30) {
    return formatter.format(diffInDays, 'day');
  }
  
  const diffInMonths = Math.round(diffInDays / 30);
  if (Math.abs(diffInMonths) < 12) {
    return formatter.format(diffInMonths, 'month');
  }
  
  const diffInYears = Math.round(diffInMonths / 12);
  return formatter.format(diffInYears, 'year');
}

/**
 * Gets the timezone of the user's browser
 */
export function getBrowserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Converts a date to the local timezone
 */
export function toLocalTime(
  date: Date | string | number,
  timeZone?: string
): Date {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : new Date(date);
  
  if (!timeZone) {
    return dateObj;
  }
  
  const dateStr = dateObj.toLocaleString('en-US', { timeZone });
  return new Date(dateStr);
}
