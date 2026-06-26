// Force a full client-side cleanup: caches, service workers, cookies,
// localStorage and sessionStorage. Preserves the auth session and theme
// so the user is not logged out and keeps their visual preference.

const PRESERVED_PREFIXES = ['theme', 'sb-'];

function shouldPreserveKey(key: string): boolean {
  return PRESERVED_PREFIXES.some((prefix) => key.startsWith(prefix));
}

function clearCookies(): void {
  try {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = (eqPos > -1 ? cookie.substring(0, eqPos) : cookie).trim();
      if (!name) continue;
      // Preserve Supabase auth cookies (avoid forcing logout)
      if (name.startsWith('sb-')) continue;

      const paths = ['/', window.location.pathname];
      const domains = [
        '',
        window.location.hostname,
        `.${window.location.hostname}`,
      ];
      for (const path of paths) {
        for (const domain of domains) {
          document.cookie =
            `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}` +
            (domain ? `;domain=${domain}` : '');
        }
      }
    }
  } catch (error) {
    console.warn('Falha ao limpar cookies:', error);
  }
}

export async function forceClientUpdate(): Promise<void> {
  try {
    // 1. Clear Cache API (Service Worker caches)
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
    }

    // 2. Unregister all Service Workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((reg) => reg.unregister()));
    }

    // 3. Clean localStorage (preserve auth + theme)
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !shouldPreserveKey(key)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    // 4. Clear sessionStorage
    sessionStorage.clear();

    // 5. Clear cookies (preserve auth)
    clearCookies();
  } catch (error) {
    console.error('Erro ao forçar atualização:', error);
  }

  // 6. Hard reload from server (bypass cache)
  window.location.reload();
}
