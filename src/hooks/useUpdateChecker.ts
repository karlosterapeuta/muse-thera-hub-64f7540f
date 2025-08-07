import { useState, useEffect, useCallback } from 'react';

interface VersionInfo {
  buildTimestamp: number;
  version: string;
}

interface UpdateCheckerState {
  isUpdateAvailable: boolean;
  isChecking: boolean;
  currentVersion: string;
  latestVersion: string;
  lastChecked: number | null;
}

const UPDATE_CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutes
const REMIND_LATER_DURATION = 4 * 60 * 60 * 1000; // 4 hours
const STORAGE_KEYS = {
  CURRENT_VERSION: 'app_current_version',
  LAST_CHECKED: 'app_last_checked',
  REMIND_LATER_UNTIL: 'app_remind_later_until',
  UPDATE_DISMISSED: 'app_update_dismissed'
};

export const useUpdateChecker = () => {
  const [state, setState] = useState<UpdateCheckerState>({
    isUpdateAvailable: false,
    isChecking: false,
    currentVersion: '',
    latestVersion: '',
    lastChecked: null
  });

  const getCurrentVersion = useCallback((): VersionInfo => {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_VERSION);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fallback if parsing fails
      }
    }
    
    // Generate version based on build time
    const buildTimestamp = new Date().getTime();
    const version = `1.0.${Math.floor(buildTimestamp / 1000)}`;
    
    const versionInfo = { buildTimestamp, version };
    localStorage.setItem(STORAGE_KEYS.CURRENT_VERSION, JSON.stringify(versionInfo));
    return versionInfo;
  }, []);

  const checkForUpdates = useCallback(async () => {
    const now = Date.now();
    const remindLaterUntil = localStorage.getItem(STORAGE_KEYS.REMIND_LATER_UNTIL);
    
    // Skip check if user chose "remind later" and time hasn't passed
    if (remindLaterUntil && now < parseInt(remindLaterUntil)) {
      return;
    }

    setState(prev => ({ ...prev, isChecking: true }));

    try {
      // Fetch version info from server
      const response = await fetch('/version.json?t=' + Date.now());
      if (!response.ok) {
        throw new Error('Failed to fetch version info');
      }

      const latestVersionInfo: VersionInfo = await response.json();
      const currentVersionInfo = getCurrentVersion();

      const isUpdateAvailable = latestVersionInfo.buildTimestamp > currentVersionInfo.buildTimestamp;
      
      setState(prev => ({
        ...prev,
        isUpdateAvailable,
        currentVersion: currentVersionInfo.version,
        latestVersion: latestVersionInfo.version,
        lastChecked: now,
        isChecking: false
      }));

      localStorage.setItem(STORAGE_KEYS.LAST_CHECKED, now.toString());

    } catch (error) {
      console.warn('Failed to check for updates:', error);
      setState(prev => ({ ...prev, isChecking: false }));
    }
  }, [getCurrentVersion]);

  const applyUpdate = useCallback(() => {
    // Clear localStorage entries related to update checking
    localStorage.removeItem(STORAGE_KEYS.REMIND_LATER_UNTIL);
    localStorage.removeItem(STORAGE_KEYS.UPDATE_DISMISSED);
    
    // Reload the page to get the latest version
    window.location.reload();
  }, []);

  const remindLater = useCallback(() => {
    const remindUntil = Date.now() + REMIND_LATER_DURATION;
    localStorage.setItem(STORAGE_KEYS.REMIND_LATER_UNTIL, remindUntil.toString());
    
    setState(prev => ({ ...prev, isUpdateAvailable: false }));
  }, []);

  const dismissUpdate = useCallback(() => {
    const currentVersionInfo = getCurrentVersion();
    localStorage.setItem(STORAGE_KEYS.UPDATE_DISMISSED, currentVersionInfo.version);
    
    setState(prev => ({ ...prev, isUpdateAvailable: false }));
  }, [getCurrentVersion]);

  // Initialize and set up periodic checking
  useEffect(() => {
    const currentVersionInfo = getCurrentVersion();
    setState(prev => ({ ...prev, currentVersion: currentVersionInfo.version }));

    // Initial check
    checkForUpdates();

    // Set up periodic checking
    const intervalId = setInterval(checkForUpdates, UPDATE_CHECK_INTERVAL);

    return () => clearInterval(intervalId);
  }, [checkForUpdates, getCurrentVersion]);

  // Manual check function
  const manualCheck = useCallback(() => {
    checkForUpdates();
  }, [checkForUpdates]);

  return {
    ...state,
    checkForUpdates: manualCheck,
    applyUpdate,
    remindLater,
    dismissUpdate
  };
};