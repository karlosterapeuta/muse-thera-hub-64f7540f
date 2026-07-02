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

/**
 * Fetch the live index.html (bypassing cache) and extract a fingerprint
 * of the deployed build: the set of hashed entry asset URLs. When a new
 * build is deployed these filenames change, giving us a reliable signal.
 */
async function fetchDeployedFingerprint(): Promise<string | null> {
  try {
    const res = await fetch(`/index.html?_v=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (!res.ok) return null;
    const html = await res.text();
    // Collect hashed asset references (js/css) which change every build
    const matches = html.match(/(?:src|href)="([^"]*\/assets\/[^"]+\.(?:js|css))"/g);
    if (!matches || matches.length === 0) return null;
    return matches.sort().join('|');
  } catch {
    return null;
  }
}

let currentFingerprint: string | null = null;
let versionPollInterval: number | null = null;
let isUpdating = false;

async function checkForNewDeployment(): Promise<void> {
  if (isUpdating || document.visibilityState !== 'visible') return;

  const latest = await fetchDeployedFingerprint();
  if (!latest) return;

  // First successful read establishes the baseline
  if (currentFingerprint === null) {
    currentFingerprint = latest;
    return;
  }

  // A change means a new build is live -> update automatically
  if (latest !== currentFingerprint) {
    isUpdating = true;
    console.log('[VersionManager] Nova versão detectada em runtime, atualizando...');
    await clearAllCaches();
    localStorage.setItem(RELOAD_FLAG, 'true');
    localStorage.setItem(VERSION_KEY, APP_VERSION);
    window.location.reload();
  }
}

/**
 * Start periodic checks for new deployments. Automatically clears caches and
 * reloads when a newer build is detected, without any user interaction.
 */
export function startVersionPolling(intervalMs = 60 * 1000): void {
  if (versionPollInterval !== null) return;

  // Establish baseline immediately
  checkForNewDeployment();

  versionPollInterval = window.setInterval(checkForNewDeployment, intervalMs);

  // Also check whenever the tab regains focus / becomes visible
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkForNewDeployment();
  });
  window.addEventListener('focus', () => checkForNewDeployment());
}

// Type declaration for the global constant injected by Vite
declare const __APP_VERSION__: string;
