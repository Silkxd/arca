// Offline storage utilities for caching data when Supabase is unavailable

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt?: number;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  key: string;
}

const CACHE_PREFIX = 'arca_cache_';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Store data in localStorage with expiration
 */
export const cacheData = <T>(data: T, options: CacheOptions): void => {
  const { key, ttl = DEFAULT_TTL } = options;
  
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    expiresAt: ttl > 0 ? Date.now() + ttl : undefined
  };
  
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch (error) {
    console.warn('Failed to cache data:', error);
  }
};

/**
 * Retrieve data from localStorage cache
 */
export const getCachedData = <T>(key: string): T | null => {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    if (!cached) return null;
    
    const entry: CacheEntry<T> = JSON.parse(cached);
    
    // Check if expired
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    
    return entry.data;
  } catch (error) {
    console.warn('Failed to retrieve cached data:', error);
    return null;
  }
};

/**
 * Clear specific cache entry
 */
export const clearCache = (key: string): void => {
  try {
    localStorage.removeItem(CACHE_PREFIX + key);
  } catch (error) {
    console.warn('Failed to clear cache:', error);
  }
};

/**
 * Clear all cache entries
 */
export const clearAllCache = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to clear all cache:', error);
  }
};

/**
 * Check if cached data exists and is valid
 */
export const hasCachedData = (key: string): boolean => {
  return getCachedData(key) !== null;
};

/**
 * Get cache age in milliseconds
 */
export const getCacheAge = (key: string): number | null => {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    if (!cached) return null;
    
    const entry: CacheEntry<any> = JSON.parse(cached);
    return Date.now() - entry.timestamp;
  } catch (error) {
    return null;
  }
};

/**
 * Store failed operations for retry when back online
 */
export interface PendingOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  table: string;
  data: any;
  timestamp: number;
}

const PENDING_OPS_KEY = 'pending_operations';

export const addPendingOperation = (operation: Omit<PendingOperation, 'id' | 'timestamp'>): void => {
  try {
    const existing = getPendingOperations();
    const newOp: PendingOperation = {
      ...operation,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
    
    existing.push(newOp);
    localStorage.setItem(PENDING_OPS_KEY, JSON.stringify(existing));
  } catch (error) {
    console.warn('Failed to store pending operation:', error);
  }
};

export const getPendingOperations = (): PendingOperation[] => {
  try {
    const stored = localStorage.getItem(PENDING_OPS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to retrieve pending operations:', error);
    return [];
  }
};

export const removePendingOperation = (id: string): void => {
  try {
    const existing = getPendingOperations();
    const filtered = existing.filter(op => op.id !== id);
    localStorage.setItem(PENDING_OPS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.warn('Failed to remove pending operation:', error);
  }
};

export const clearPendingOperations = (): void => {
  try {
    localStorage.removeItem(PENDING_OPS_KEY);
  } catch (error) {
    console.warn('Failed to clear pending operations:', error);
  }
};