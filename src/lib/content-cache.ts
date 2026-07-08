/**
 * Simple in-memory + localStorage cache for site content API calls.
 * Avoids repeated Supabase round-trips on page load.
 */

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();

function getFromStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`siteCache_${key}`);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(`siteCache_${key}`);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() };
    localStorage.setItem(`siteCache_${key}`, JSON.stringify(entry));
  } catch {
    // Storage full or not available – ignore
  }
}

export async function cachedFetch<T>(url: string): Promise<T> {
  const cacheKey = url;

  // 1. Check memory cache (fastest)
  const memEntry = memoryCache.get(cacheKey);
  if (memEntry && Date.now() - memEntry.timestamp < CACHE_TTL_MS) {
    return memEntry.data as T;
  }

  // 2. Check localStorage
  const stored = getFromStorage<T>(cacheKey);
  if (stored !== null) {
    memoryCache.set(cacheKey, { data: stored, timestamp: Date.now() });
    return stored;
  }

  // 3. Fetch from network
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const data: T = await res.json();

  // Store in both caches
  memoryCache.set(cacheKey, { data, timestamp: Date.now() });
  saveToStorage(cacheKey, data);

  return data;
}

/** Invalidate cache for a specific URL (call after admin updates) */
export function invalidateCache(url: string): void {
  memoryCache.delete(url);
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`siteCache_${url}`);
  }
}
