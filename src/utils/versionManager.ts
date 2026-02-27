// Version generated at build time
const APP_VERSION = __APP_VERSION__;

const VERSION_KEY = 'app_version';
const RELOAD_FLAG = 'app_version_reloading';

// Keys to preserve during cache cleanup
const PRESERVED_PREFIXES = ['theme', 'sb-'];

function shouldPreserveKey(key: string): boolean {
  return PRESERVED_PREFIXES.some(prefix => key.startsWith(prefix));
}

async function clearAllCaches(): Promise<void> {
  try {
    // 1. Clear Cache API (Service Worker caches)
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('[VersionManager] Caches do SW limpos:', cacheNames);
    }

    // 2. Unregister all Service Workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(reg => reg.unregister()));
      console.log('[VersionManager] Service Workers desregistrados:', registrations.length);
    }

    // 3. Clean localStorage (preserve essential keys)
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !shouldPreserveKey(key) && key !== RELOAD_FLAG) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log('[VersionManager] localStorage limpo, removidos:', keysToRemove.length);

    // 4. Clear sessionStorage
    sessionStorage.clear();
    console.log('[VersionManager] sessionStorage limpo');
  } catch (error) {
    console.error('[VersionManager] Erro ao limpar caches:', error);
  }
}

/**
 * Check app version and clear all caches if outdated.
 * Returns true if a reload is needed (caller should skip rendering).
 */
export async function checkVersionAndCleanup(): Promise<boolean> {
  const savedVersion = localStorage.getItem(VERSION_KEY);
  const isReloading = localStorage.getItem(RELOAD_FLAG);

  // If we just reloaded after cleanup, remove flag and continue
  if (isReloading) {
    localStorage.removeItem(RELOAD_FLAG);
    localStorage.setItem(VERSION_KEY, APP_VERSION);
    console.log('[VersionManager] Versão atualizada para:', APP_VERSION);
    return false;
  }

  // If version matches, nothing to do
  if (savedVersion === APP_VERSION) {
    return false;
  }

  // Version changed or first visit — clean everything
  console.log('[VersionManager] Nova versão detectada:', APP_VERSION, '(anterior:', savedVersion, ')');

  await clearAllCaches();

  // Set reload flag and new version, then reload
  localStorage.setItem(RELOAD_FLAG, 'true');
  localStorage.setItem(VERSION_KEY, APP_VERSION);

  window.location.reload();
  return true; // Signal caller to stop rendering
}

// Type declaration for the global constant injected by Vite
declare const __APP_VERSION__: string;
