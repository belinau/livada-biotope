import { format, parseISO } from 'date-fns';
import { sl } from 'date-fns/locale';

type Locale = 'en' | 'sl';

export const formatEventDate = (date: Date | string, locale: Locale = 'en'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'EEEE, d. MMMM yyyy', {
    locale: locale === 'sl' ? sl : undefined,
  });
};

export const formatEventTime = (date: Date | string, locale: Locale = 'en'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'HH:mm', {
    locale: locale === 'sl' ? sl : undefined,
  });
};

export const formatDateTimeRange = (
  start: Date | string,
  end: Date | string,
  locale: Locale = 'en'
): string => {
  const startDate = typeof start === 'string' ? parseISO(start) : start;
  const endDate = typeof end === 'string' ? parseISO(end) : end;
  
  const dateFormat = 'EEEE, d. MMMM yyyy';
  const timeFormat = 'HH:mm';
  
  const startDateStr = format(startDate, dateFormat, { locale: locale === 'sl' ? sl : undefined });
  const startTimeStr = format(startDate, timeFormat, { locale: locale === 'sl' ? sl : undefined });
  const endTimeStr = format(endDate, timeFormat, { locale: locale === 'sl' ? sl : undefined });
  
  return `${startDateStr}, ${startTimeStr} - ${endTimeStr}`;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
