/**
 * Utility for caching API responses to improve performance
 */

// Check if we're running on the client side
export const isClient = typeof window !== 'undefined';

// Cache interface
export interface CacheItem<T> {
  data: T;
  timestamp: number;
  language?: string;
}

// Cache storage
const cacheStore: Record<string, CacheItem<any>> = {};

// Default cache expiry time (5 minutes)
export const DEFAULT_CACHE_EXPIRY_MS = 5 * 60 * 1000;

/**
 * Get data from cache if available and not expired
 * @param key Cache key
 * @param expiryMs Cache expiry time in milliseconds
 * @param language Optional language parameter for language-specific caching
 * @returns Cached data or null if not found or expired
 */
export function getFromCache<T>(key: string, expiryMs = DEFAULT_CACHE_EXPIRY_MS, language?: string): T | null {
  if (!isClient) return null;
  
  const cacheKey = language ? `${key}_${language}` : key;
  const cachedItem = cacheStore[cacheKey];
  const now = Date.now();
  
  if (cachedItem && now - cachedItem.timestamp < expiryMs) {
    return cachedItem.data;
  }
  
  return null;
}

/**
 * Store data in cache
 * @param key Cache key
 * @param data Data to cache
 * @param language Optional language parameter for language-specific caching
 */
export function storeInCache<T>(key: string, data: T, language?: string): void {
  if (!isClient) return;
  
  const cacheKey = language ? `${key}_${language}` : key;
  cacheStore[cacheKey] = {
    data,
    timestamp: Date.now(),
    language
  };
}

/**
 * Clear a specific cache item
 * @param key Cache key
 * @param language Optional language parameter for language-specific caching
 */
export function clearCacheItem(key: string, language?: string): void {
  if (!isClient) return;
  
  const cacheKey = language ? `${key}_${language}` : key;
  delete cacheStore[cacheKey];
}

/**
 * Clear all cache items
 */
export function clearAllCache(): void {
  if (!isClient) return;
  
  Object.keys(cacheStore).forEach(key => {
    delete cacheStore[key];
  });
}

/**
 * Fetch data with caching
 * @param url URL to fetch
 * @param options Fetch options
 * @param cacheKey Cache key (defaults to URL)
 * @param expiryMs Cache expiry time in milliseconds
 * @param language Optional language parameter for language-specific caching
 * @returns Fetched data (from cache if available and not expired)
 */
export async function fetchWithCache<T>(
  url: string,
  options?: RequestInit,
  cacheKey?: string,
  expiryMs = DEFAULT_CACHE_EXPIRY_MS,
  language?: string
): Promise<T> {
  if (!isClient) {
    // Server-side rendering, fetch without cache
    const response = await fetch(url, options);
    return await response.json();
  }
  
  const key = cacheKey || url;
  
  // Try to get from cache first
  const cachedData = getFromCache<T>(key, expiryMs, language);
  if (cachedData) {
    return cachedData;
  }
  
  // If not in cache or expired, fetch fresh data
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  
  const data: T = await response.json();
  
  // Store in cache
  storeInCache<T>(key, data, language);
  
  return data;
}
