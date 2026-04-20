// In-memory cache replacement for Redis
// Since we don't have Redis on the deployment server, use a simple Map-based cache

const cache = new Map<string, { value: string; expiresAt?: number }>();

export const memoryCache = {
  get(key: string): string | null {
    const entry = cache.get(key);
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      cache.delete(key);
      return null;
    }
    return entry.value;
  },

  set(key: string, value: string, ttlSeconds?: number): void {
    cache.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
    });
  },

  del(key: string): void {
    cache.delete(key);
  },

  clear(): void {
    cache.clear();
  },
};
