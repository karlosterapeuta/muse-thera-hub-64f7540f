import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { globalCacheManager } from '@/utils/cacheManager';

export interface CacheStats {
  totalItems: number;
  memoryUsage: number;
  namespaces: Record<string, { items: number; size: number }>;
}

export function useCacheManager() {
  const [stats, setStats] = useState<CacheStats>({
    totalItems: 0,
    memoryUsage: 0,
    namespaces: {}
  });

  const updateStats = useCallback(() => {
    setStats(globalCacheManager.getStats());
  }, []);

  const clearCache = useCallback((namespace?: string) => {
    if (namespace) {
      globalCacheManager.clearNamespace(namespace);
    } else {
      globalCacheManager.clearAll();
    }
    updateStats();
  }, [updateStats]);

  const cleanupCache = useCallback(() => {
    const cleaned = globalCacheManager.cleanup();
    updateStats();
    if (cleaned > 0) {
      toast.success(`Cache limpo! ${cleaned} itens removidos.`);
    }
    return cleaned;
  }, [updateStats]);

  const cleanWebStorage = useCallback(() => {
    globalCacheManager.cleanWebStorage();
    updateStats();
    toast.success('Storage local limpo com sucesso!');
  }, [updateStats]);

  const cleanAudioCaches = useCallback(() => {
    globalCacheManager.cleanAudioCaches();
    updateStats();
    toast.success('Cache de áudio limpo com sucesso!');
  }, [updateStats]);

  const performFullCleanup = useCallback(() => {
    // Clean all types of caches
    const cleaned = globalCacheManager.cleanup();
    globalCacheManager.cleanWebStorage();
    globalCacheManager.cleanAudioCaches();
    
    // Also clean specific audio namespaces
    globalCacheManager.clearNamespace('audio');
    globalCacheManager.clearNamespace('melodies');
    globalCacheManager.clearNamespace('sounds');
    
    updateStats();
    toast.success(`Limpeza completa realizada! ${cleaned} itens removidos.`);
    return cleaned;
  }, [updateStats]);

  useEffect(() => {
    updateStats();
    
    // Update stats every 2 minutes (reduced frequency)
    const interval = setInterval(updateStats, 120000);
    
    return () => clearInterval(interval);
  }, [updateStats]);

  return {
    stats,
    clearCache,
    cleanupCache,
    cleanWebStorage,
    cleanAudioCaches,
    performFullCleanup,
    updateStats
  };
}

export function useCachedData<T>(
  namespace: string,
  key: string,
  fetcher: () => Promise<T> | T,
  ttl?: number
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to get from cache first
      const cached = globalCacheManager.get(namespace, key);
      if (cached !== null) {
        setData(cached);
        setLoading(false);
        return;
      }

      // Fetch new data
      const result = await fetcher();
      
      // Cache the result
      globalCacheManager.set(namespace, key, result, ttl);
      
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [namespace, key, fetcher, ttl]);

  const invalidate = useCallback(() => {
    globalCacheManager.delete(namespace, key);
    fetchData();
  }, [namespace, key, fetchData]);

  const updateCache = useCallback((newData: T) => {
    globalCacheManager.set(namespace, key, newData, ttl);
    setData(newData);
  }, [namespace, key, ttl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    invalidate,
    updateCache
  };
}