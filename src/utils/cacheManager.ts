export interface CacheItem {
  data: any;
  timestamp: number;
  lastAccessed: number;
  size: number;
  ttl?: number; // Time to live in milliseconds
}

export interface CacheConfig {
  maxSize: number; // Maximum cache size in MB
  defaultTTL: number; // Default TTL in milliseconds
  cleanupInterval: number; // Cleanup interval in milliseconds
  maxItems: number; // Maximum number of items
}

export class CacheManager {
  private caches: Map<string, Map<string, CacheItem>> = new Map();
  private config: CacheConfig;
  private cleanupTimer: NodeJS.Timeout | null = null;
  private memoryUsage: number = 0;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 50, // 50MB default
      defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
      cleanupInterval: 5 * 60 * 1000, // 5 minutes
      maxItems: 1000,
      ...config
    };

    this.startAutomaticCleanup();
  }

  /**
   * Initialize a new cache namespace
   */
  initCache(namespace: string): void {
    if (!this.caches.has(namespace)) {
      this.caches.set(namespace, new Map());
    }
  }

  /**
   * Set an item in cache
   */
  set(namespace: string, key: string, data: any, ttl?: number): void {
    this.initCache(namespace);
    
    const cache = this.caches.get(namespace)!;
    const size = this.calculateSize(data);
    const item: CacheItem = {
      data,
      timestamp: Date.now(),
      lastAccessed: Date.now(),
      size,
      ttl: ttl || this.config.defaultTTL
    };

    // Remove old item if exists to update memory usage
    if (cache.has(key)) {
      const oldItem = cache.get(key)!;
      this.memoryUsage -= oldItem.size;
    }

    cache.set(key, item);
    this.memoryUsage += size;

    // Check if we need to cleanup
    this.checkMemoryLimits();
  }

  /**
   * Get an item from cache
   */
  get(namespace: string, key: string): any | null {
    const cache = this.caches.get(namespace);
    if (!cache) return null;

    const item = cache.get(key);
    if (!item) return null;

    // Check if item has expired
    if (this.isExpired(item)) {
      this.delete(namespace, key);
      return null;
    }

    // Update last accessed time
    item.lastAccessed = Date.now();
    return item.data;
  }

  /**
   * Delete an item from cache
   */
  delete(namespace: string, key: string): boolean {
    const cache = this.caches.get(namespace);
    if (!cache) return false;

    const item = cache.get(key);
    if (item) {
      this.memoryUsage -= item.size;
      return cache.delete(key);
    }
    return false;
  }

  /**
   * Clear entire namespace
   */
  clearNamespace(namespace: string): void {
    const cache = this.caches.get(namespace);
    if (cache) {
      // Update memory usage
      for (const item of cache.values()) {
        this.memoryUsage -= item.size;
      }
      cache.clear();
    }
  }

  /**
   * Clear all caches
   */
  clearAll(): void {
    for (const namespace of this.caches.keys()) {
      this.clearNamespace(namespace);
    }
    this.memoryUsage = 0;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const stats = {
      totalItems: 0,
      memoryUsage: this.memoryUsage,
      namespaces: {} as Record<string, { items: number; size: number }>
    };

    for (const [namespace, cache] of this.caches) {
      let namespaceSize = 0;
      for (const item of cache.values()) {
        namespaceSize += item.size;
      }
      
      stats.namespaces[namespace] = {
        items: cache.size,
        size: namespaceSize
      };
      stats.totalItems += cache.size;
    }

    return stats;
  }

  /**
   * Manual cleanup
   */
  cleanup(): number {
    let cleanedItems = 0;
    const now = Date.now();

    for (const [namespace, cache] of this.caches) {
      const itemsToDelete: string[] = [];

      for (const [key, item] of cache) {
        if (this.isExpired(item)) {
          itemsToDelete.push(key);
        }
      }

      for (const key of itemsToDelete) {
        this.delete(namespace, key);
        cleanedItems++;
      }
    }

    // If still over memory limit, remove least recently used items
    if (this.memoryUsage > this.config.maxSize * 1024 * 1024) {
      cleanedItems += this.evictLRU();
    }

    return cleanedItems;
  }

  /**
   * Perform comprehensive cleanup including all cache types
   */
  performFullCleanup(): number {
    const cleaned = this.cleanup();
    this.cleanWebStorage();
    this.cleanAudioCaches();
    return cleaned;
  }

  /**
   * Clean localStorage and sessionStorage
   */
  cleanWebStorage(): void {
    try {
      // Clean expired items from localStorage
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('temp_') || key?.startsWith('cache_')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Clear sessionStorage completely (it's temporary anyway)
      sessionStorage.clear();
    } catch (error) {
      console.warn('Failed to clean web storage:', error);
    }
  }

  /**
   * Clean audio-related caches
   */
  cleanAudioCaches(): void {
    // Clean audio synthesis caches
    if (typeof window !== 'undefined') {
      try {
        // Revoke object URLs that might be cached
        const audioKeys = Object.keys(localStorage).filter(key => 
          key.includes('audio') || key.includes('melody') || key.includes('sound')
        );
        
        audioKeys.forEach(key => {
          const value = localStorage.getItem(key);
          if (value?.startsWith('blob:')) {
            URL.revokeObjectURL(value);
          }
          localStorage.removeItem(key);
        });
      } catch (error) {
        console.warn('Failed to clean audio caches:', error);
      }
    }
  }

  /**
   * Dispose and cleanup all resources
   */
  dispose(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.clearAll();
  }

  private startAutomaticCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      const cleaned = this.cleanup();
      if (cleaned > 0) {
        console.log(`🧹 Cache cleanup: removed ${cleaned} expired items`);
      }
    }, this.config.cleanupInterval);
  }

  private isExpired(item: CacheItem): boolean {
    if (!item.ttl) return false;
    return Date.now() - item.timestamp > item.ttl;
  }

  private calculateSize(data: any): number {
    try {
      return new Blob([JSON.stringify(data)]).size;
    } catch {
      return 1024; // Default 1KB if calculation fails
    }
  }

  private checkMemoryLimits(): void {
    const maxBytes = this.config.maxSize * 1024 * 1024;
    if (this.memoryUsage > maxBytes) {
      this.evictLRU();
    }
  }

  private evictLRU(): number {
    const allItems: Array<{ namespace: string; key: string; item: CacheItem }> = [];
    
    // Collect all items
    for (const [namespace, cache] of this.caches) {
      for (const [key, item] of cache) {
        allItems.push({ namespace, key, item });
      }
    }

    // Sort by last accessed time (oldest first)
    allItems.sort((a, b) => a.item.lastAccessed - b.item.lastAccessed);

    let evicted = 0;
    const maxBytes = this.config.maxSize * 1024 * 1024;

    // Remove oldest items until under memory limit
    while (this.memoryUsage > maxBytes && allItems.length > 0) {
      const { namespace, key } = allItems.shift()!;
      this.delete(namespace, key);
      evicted++;
    }

    return evicted;
  }
}

// Global cache manager instance
export const globalCacheManager = new CacheManager({
  maxSize: 50, // 50MB
  defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
  cleanupInterval: 5 * 60 * 1000, // 5 minutes
  maxItems: 1000
});