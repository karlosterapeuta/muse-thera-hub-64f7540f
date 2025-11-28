import { saveAs } from "file-saver";
import { BackupData } from "../hooks/useBackupData";

export interface BackupMetadata {
  version: string;
  system: string;
  exportedAt: string;
  exportedBy: string;
  professionalEmail: string;
  professionalName: string;
  backupType: "complete" | "selective";
  categories: string[];
  totalRecords: number;
}

export interface BackupFile {
  metadata: BackupMetadata;
  data: Partial<BackupData>;
  statistics: Record<string, number>;
}

export interface BackupHistoryItem {
  id: string;
  date: string;
  type: "complete" | "selective";
  categories: string[];
  totalRecords: number;
  fileSize: string;
}

const BACKUP_HISTORY_KEY = "mustera_backup_history";

export function generateBackupFile(
  data: Partial<BackupData>,
  userId: string,
  email: string,
  name: string,
  backupType: "complete" | "selective",
  categories: string[]
): void {
  const statistics: Record<string, number> = {};
  let totalRecords = 0;

  // Calculate statistics
  if (data.patients) {
    statistics.patients = data.patients.length;
    totalRecords += data.patients.length;
  }
  if (data.anamnesis) {
    statistics.anamnesis = data.anamnesis.length;
    totalRecords += data.anamnesis.length;
  }
  if (data.assessments) {
    statistics.assessments = data.assessments.length;
    totalRecords += data.assessments.length;
  }
  if (data.treatmentPlans) {
    statistics.treatmentPlans = data.treatmentPlans.length;
    totalRecords += data.treatmentPlans.length;
  }
  if (data.reports) {
    statistics.reports = data.reports.length;
    totalRecords += data.reports.length;
  }
  if (data.financialRecords) {
    statistics.financialRecords = data.financialRecords.length;
    totalRecords += data.financialRecords.length;
  }
  if (data.clinics) {
    statistics.clinics = data.clinics.length;
    totalRecords += data.clinics.length;
  }
  if (data.sessions) {
    statistics.sessions = data.sessions.length;
    totalRecords += data.sessions.length;
  }

  const backupFile: BackupFile = {
    metadata: {
      version: "1.0",
      system: "MuseTera",
      exportedAt: new Date().toISOString(),
      exportedBy: userId,
      professionalEmail: email,
      professionalName: name,
      backupType,
      categories,
      totalRecords,
    },
    data,
    statistics,
  };

  const jsonString = JSON.stringify(backupFile, null, 2);
  const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
  const date = new Date().toISOString().split("T")[0];
  const fileName = `mustera_backup_${backupType}_${date}.json`;

  // Save file
  saveAs(blob, fileName);

  // Add to history
  addToBackupHistory({
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    type: backupType,
    categories,
    totalRecords,
    fileSize: formatFileSize(blob.size),
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export function getBackupHistory(): BackupHistoryItem[] {
  try {
    const history = localStorage.getItem(BACKUP_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
}

function addToBackupHistory(item: BackupHistoryItem): void {
  const history = getBackupHistory();
  history.unshift(item);
  // Keep only last 10 backups
  const trimmedHistory = history.slice(0, 10);
  localStorage.setItem(BACKUP_HISTORY_KEY, JSON.stringify(trimmedHistory));
}

export function clearBackupHistory(): void {
  localStorage.removeItem(BACKUP_HISTORY_KEY);
}
