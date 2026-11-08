/** Document history only. This never infers therapeutic progress from text changes. */
export type MusicoterapiaReportStatus = "rascunho" | "finalizado";

export interface MusicoterapiaHistoryEntry {
  id: string;
  patient_id: string | null;
  created_at: string | null;
  content: {
    document_status?: string;
    based_on_report_id?: string;
    root_report_id?: string;
    archived_pdf_document_id?: string;
    field_values?: Record<string, unknown>;
  } | null;
}

export function getMusicoterapiaReportStatus(content: MusicoterapiaHistoryEntry["content"]): MusicoterapiaReportStatus {
  // Reports created before the draft feature were completed clinical records.
  return content?.document_status === "rascunho" ? "rascunho" : "finalizado";
}

export function groupMusicoterapiaReportHistory<T extends MusicoterapiaHistoryEntry>(reports: T[]) {
  const byId = new Map(reports.map(report => [report.id, report]));
  const findRoot = (report: T): string => {
    let current = report;
    const visited = new Set<string>();
    while (!visited.has(current.id)) {
      visited.add(current.id);
      const parentId = current.content?.root_report_id || current.content?.based_on_report_id;
      if (!parentId) return current.id;
      const parent = byId.get(parentId);
      if (!parent || parent.patient_id !== report.patient_id) return parentId;
      current = parent;
    }
    return report.id;
  };

  const groups = new Map<string, { key: string; patientId: string | null; versions: T[] }>();
  reports.forEach(report => {
    const key = `${report.patient_id || "sem-paciente"}:${findRoot(report)}`;
    const group = groups.get(key) || { key, patientId: report.patient_id, versions: [] };
    group.versions.push(report);
    groups.set(key, group);
  });
  return Array.from(groups.values()).map(group => ({
    ...group,
    versions: group.versions.sort((a, b) => Date.parse(b.created_at || "") - Date.parse(a.created_at || "")),
  }));
}

export function compareMusicoterapiaReportFields(previous: MusicoterapiaHistoryEntry["content"], current: MusicoterapiaHistoryEntry["content"]) {
  const before = previous?.field_values || {};
  const after = current?.field_values || {};
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  return Array.from(keys).filter(key => JSON.stringify(before[key] ?? null) !== JSON.stringify(after[key] ?? null));
}
