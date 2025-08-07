export interface VersionInfo {
  buildTimestamp: number;
  version: string;
  buildDate: string;
}

export const generateVersionInfo = (): VersionInfo => {
  const buildTimestamp = Date.now();
  const buildDate = new Date(buildTimestamp).toISOString();
  const version = `1.0.${Math.floor(buildTimestamp / 1000)}`;
  
  return {
    buildTimestamp,
    version,
    buildDate
  };
};

export const compareVersions = (current: VersionInfo, latest: VersionInfo): boolean => {
  return latest.buildTimestamp > current.buildTimestamp;
};

export const formatVersion = (versionInfo: VersionInfo): string => {
  return `${versionInfo.version} (${new Date(versionInfo.buildTimestamp).toLocaleDateString()})`;
};