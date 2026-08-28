// Motor de áudio dedicado aos Sinos Musicais (handbells coloridos)
// Usa um único AudioContext compartilhado, retomado no primeiro gesto do usuário.

const BELL_FREQUENCIES: Record<string, number> = {
  "C↓": 261.63, // Dó4
  C: 261.63,
  D: 293.66,
  E: 329.63,
  F: 349.23,
  G: 392.0,
  A: 440.0,
  B: 493.88,
  "C↑": 523.25, // Dó5
};

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
const activeNodes = new Set<{ osc: OscillatorNode[]; gain: GainNode }>();

const getContext = (): AudioContext | null => {
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch (e) {
    console.error("Bell audio context error:", e);
    return null;
  }
};

export const resumeBellAudio = () => {
  getContext();
};

export const getBellFrequency = (noteKey: string): number | null => {
  const direct = BELL_FREQUENCIES[noteKey];
  if (direct) return direct;
  const base = noteKey.replace(/[^A-Ga-g]/g, "").toUpperCase();
  return BELL_FREQUENCIES[base] ?? null;
};

/**
 * Toca uma nota de sino com timbre metálico (parciais inarmônicos).
 */
export const playBellNote = (noteKey: string, duration = 1.6, volume = 1): boolean => {
  const frequency = getBellFrequency(noteKey);
  if (!frequency) {
    console.warn("Nota de sino desconhecida:", noteKey);
    return false;
  }

  const audio = getContext();
  if (!audio || !master) return false;

  const now = audio.currentTime;
  const gain = audio.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.55 * volume, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  gain.connect(master);

  // Parciais típicos de sino/handbell
  const partials: Array<[number, number]> = [
    [1, 1],
    [2, 0.45],
    [3, 0.22],
    [4.2, 0.12],
    [5.4, 0.08],
  ];

  const oscs: OscillatorNode[] = [];
  partials.forEach(([ratio, amp]) => {
    const osc = audio.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency * ratio, now);
    const partialGain = audio.createGain();
    partialGain.gain.setValueAtTime(amp, now);
    osc.connect(partialGain);
    partialGain.connect(gain);
    osc.start(now);
    osc.stop(now + duration + 0.05);
    oscs.push(osc);
  });

  const entry = { osc: oscs, gain };
  activeNodes.add(entry);
  oscs[0].onended = () => {
    activeNodes.delete(entry);
    try {
      gain.disconnect();
    } catch {
      /* noop */
    }
  };

  return true;
};

export const stopBellAudio = () => {
  activeNodes.forEach((entry) => {
    try {
      entry.gain.gain.cancelScheduledValues(ctx?.currentTime ?? 0);
      entry.gain.gain.setValueAtTime(0, ctx?.currentTime ?? 0);
      entry.osc.forEach((o) => {
        try {
          o.stop();
        } catch {
          /* noop */
        }
      });
    } catch {
      /* noop */
    }
  });
  activeNodes.clear();
};
