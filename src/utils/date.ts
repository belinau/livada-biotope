interface FormatDateOptions extends Intl.DateTimeFormatOptions {
  locale?: string;
}

export function formatDate(dateString: string, locale: string = 'en'): string {
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', dateString);
    return '';
  }

  const options: FormatDateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    locale,
  };

  return new Intl.DateTimeFormat(locale, options).format(date);
}

// Format date for machine-readable format (YYYY-MM-DD)
export function formatDateForMachine(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Format time in 12-hour format with AM/PM
export function formatTime(date: Date, locale: string = 'en'): string {
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

// Format date and time together
export function formatDateTime(
  dateString: string,
  locale: string = 'en',
  includeTime: boolean = true
): string {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', dateString);
    return '';
  }
  
  let options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  if (includeTime) {
    options = {
      ...options,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
  }
  
  return new Intl.DateTimeFormat(locale, options).format(date);
}

// Calculate time ago (e.g., "2 days ago")
export function timeAgo(dateString: string, locale: string = 'en'): string {
  const date = new Date(dateString);
  const now = new Date();
  
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', dateString);
    return '';
  }
  
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    
    if (interval >= 1) {
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
      return rtf.format(-interval, unit as Intl.RelativeTimeFormatUnit);
    }
  }
  
  return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(0, 'second');
}
