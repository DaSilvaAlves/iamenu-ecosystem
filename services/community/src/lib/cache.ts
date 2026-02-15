/**
 * Simple In-Memory Cache with TTL
 * Automatically expires entries after specified duration
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class Cache {
  private store = new Map<string, CacheEntry<any>>();

  /**
   * Set a value in cache with optional TTL
   * @param key Cache key
   * @param value Value to cache
   * @param ttlSeconds Time to live in seconds (default: 5 minutes)
   */
  set<T>(key: string, value: T, ttlSeconds: number = 300): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.store.set(key, { value, expiresAt });
  }

  /**
   * Get a value from cache
   * Returns null if not found or expired
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Invalidate (delete) a cache entry
   */
  invalidate(key: string): void {
    this.store.delete(key);
  }

  /**
   * Invalidate multiple entries by pattern
   * Example: invalidate('posts:*') removes all keys starting with 'posts:'
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern.replace('*', '.*'));
    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Get cache statistics
   */
  stats() {
    let validEntries = 0;
    let expiredEntries = 0;

    for (const entry of this.store.values()) {
      if (Date.now() > entry.expiresAt) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      totalEntries: this.store.size,
      validEntries,
      expiredEntries,
    };
  }
}

// Singleton instance
export const cache = new Cache();
