import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEnvVariable(key: string, defaultValue?: string): string {
  if (typeof window !== 'undefined') {
    // Client-side: use NEXT_PUBLIC_ prefixed env vars
    const value = process.env[`NEXT_PUBLIC_${key}`];
    if (value) return value;
  }
  
  // Server-side or fallback
  const value = process.env[key];
  if (value) return value;
  
  if (defaultValue !== undefined) return defaultValue;
  
  throw new Error(`Environment variable ${key} is not defined`);
}

// Type guard for error handling
export function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

// Format date using date-fns
export function formatDate(date: Date | string, format = 'PPP'): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
