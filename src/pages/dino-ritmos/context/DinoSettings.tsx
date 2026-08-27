import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { setVolume as setEngineVolume } from "../audio/dinoSounds";

export interface DinoSettings {
  volume: number; // 0..1
  narration: boolean;
  reducedSensory: boolean;
  animationSpeed: number; // 0.5..1.5
  calmMode: boolean;
  reducedVisuals: boolean;
  vibration: boolean;
}

const DEFAULTS: DinoSettings = {
  volume: 0.7,
  narration: true,
  reducedSensory: false,
  animationSpeed: 1,
  calmMode: false,
  reducedVisuals: false,
  vibration: false,
};

const KEY = "dino-ritmos:settings";

interface Ctx {
  settings: DinoSettings;
  update: <K extends keyof DinoSettings>(k: K, v: DinoSettings[K]) => void;
  reset: () => void;
}

const DinoSettingsContext = createContext<Ctx | null>(null);

export function DinoSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<DinoSettings>(() => {
    if (typeof window === "undefined") return DEFAULTS;
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch { /* noop */ }
    setEngineVolume(settings.volume);
  }, [settings]);

  const ctx = useMemo<Ctx>(() => ({
    settings,
    update: (k, v) => setSettings((s) => ({ ...s, [k]: v })),
    reset: () => setSettings(DEFAULTS),
  }), [settings]);

  return <DinoSettingsContext.Provider value={ctx}>{children}</DinoSettingsContext.Provider>;
}

export function useDinoSettings() {
  const ctx = useContext(DinoSettingsContext);
  if (!ctx) throw new Error("useDinoSettings must be used within DinoSettingsProvider");
  return ctx;
}

// Progress tracking (rewards + therapeutic stats)
export interface DinoProgress {
  stars: number;
  eggs: number;
  interactions: number;
  totalSeconds: number;
  byMode: Record<string, number>;
  byDino: Record<string, number>;
  lastSession: string | null;
}

const PROGRESS_KEY = "dino-ritmos:progress";
const DEFAULT_PROGRESS: DinoProgress = {
  stars: 0, eggs: 0, interactions: 0, totalSeconds: 0, byMode: {}, byDino: {}, lastSession: null,
};

export function loadProgress(): DinoProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? { ...DEFAULT_PROGRESS, ...JSON.parse(raw) } : DEFAULT_PROGRESS;
  } catch { return DEFAULT_PROGRESS; }
}

export function saveProgress(p: DinoProgress) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch { /* noop */ }
}

export function trackInteraction(dinoId?: string, mode?: string, addStars = 0, addEggs = 0) {
  const p = loadProgress();
  p.interactions += 1;
  p.stars += addStars;
  p.eggs += addEggs;
  if (dinoId) p.byDino[dinoId] = (p.byDino[dinoId] ?? 0) + 1;
  if (mode) p.byMode[mode] = (p.byMode[mode] ?? 0) + 1;
  p.lastSession = new Date().toISOString();
  saveProgress(p);
}

export function addTime(seconds: number) {
  const p = loadProgress();
  p.totalSeconds += seconds;
  saveProgress(p);
}

export function resetProgress() {
  saveProgress(DEFAULT_PROGRESS);
}

// ---- Best scores per mode (persisted) ----
const BEST_KEY = "dino-ritmos:best";

export function loadBest(mode: string): number {
  try {
    const raw = localStorage.getItem(BEST_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    return all[mode] ?? 0;
  } catch { return 0; }
}

export function saveBest(mode: string, value: number) {
  try {
    const raw = localStorage.getItem(BEST_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    if ((all[mode] ?? 0) >= value) return;
    all[mode] = value;
    localStorage.setItem(BEST_KEY, JSON.stringify(all));
  } catch { /* noop */ }
}

/** CSV report of the current session data, for the therapist. */
export function progressToCsv(p: DinoProgress): string {
  const rows: string[][] = [["metrica", "chave", "valor"]];
  rows.push(["resumo", "estrelas", String(p.stars)]);
  rows.push(["resumo", "ovos", String(p.eggs)]);
  rows.push(["resumo", "interacoes", String(p.interactions)]);
  rows.push(["resumo", "tempo_segundos", String(p.totalSeconds)]);
  rows.push(["resumo", "ultima_sessao", p.lastSession ?? ""]);
  Object.entries(p.byDino).forEach(([k, v]) => rows.push(["por_dino", k, String(v)]));
  Object.entries(p.byMode).forEach(([k, v]) => rows.push(["por_modo", k, String(v)]));
  return rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
}
