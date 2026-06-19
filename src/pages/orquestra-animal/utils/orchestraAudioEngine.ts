import type { AnimalMusician } from "../data/orchestraAnimals";

// ---------- Real animal sounds (HTMLAudioElement pool) ----------

const audioPool = new Map<string, HTMLAudioElement>();

function getAudio(url: string): HTMLAudioElement {
  let el = audioPool.get(url);
  if (!el) {
    el = new Audio(url);
    el.crossOrigin = "anonymous";
    el.preload = "auto";
    audioPool.set(url, el);
  }
  return el;
}

/** Pre-load every animal sound once (best-effort). */
export function preloadAnimalSounds(animals: AnimalMusician[]) {
  animals.forEach((a) => {
    if (a.soundUrl) getAudio(a.soundUrl);
  });
}

const activeAudios = new Set<HTMLAudioElement>();
const activeSynths = new Set<{ osc: OscillatorNode; gain: GainNode }>();
const activeTimeouts = new Set<ReturnType<typeof setTimeout>>();

// ---------- Master volume ----------
let masterVolume = 1;
export function setMasterVolume(v: number) {
  masterVolume = Math.min(1, Math.max(0, v));
}
export function getMasterVolume() {
  return masterVolume;
}

function playUrl(url: string, volume = 1): Promise<void> {
  // Clone so overlapping clicks don't cut each other off
  const base = getAudio(url);
  const el = base.cloneNode(true) as HTMLAudioElement;
  el.volume = Math.min(1, Math.max(0, volume * masterVolume));
  activeAudios.add(el);
  el.addEventListener("ended", () => activeAudios.delete(el));
  const p = el.play();
  return p instanceof Promise ? p.then(() => {}) : Promise.resolve();
}


// ---------- Synth fallback (used only if URL fails) ----------

let _ctx: AudioContext | null = null;
function getCtx(): AudioContext {
  if (!_ctx || _ctx.state === "closed") {
    const AC = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    _ctx = new AC();
  }
  if (_ctx.state === "suspended") _ctx.resume();
  return _ctx;
}

function synthFallback(animal: AnimalMusician) {
  const ctx = getCtx();
  const t0 = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = animal.section === "cordas" ? "sawtooth" : animal.section === "metais" ? "square" : "triangle";
  osc.frequency.value = animal.frequency;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(0.3 * masterVolume, t0 + 0.02);
  gain.gain.linearRampToValueAtTime(0, t0 + 1);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + 1.05);
  const entry = { osc, gain };
  activeSynths.add(entry);
  osc.onended = () => activeSynths.delete(entry);
}

// ---------- Public API ----------

export const orchestraAudio = {
  play(animal: AnimalMusician) {
    console.log("[OrchestraAudio] play()", animal.name, animal.soundUrl);
    if (animal.soundUrl) {
      playUrl(animal.soundUrl, 1).catch((err) => {
        console.warn("[OrchestraAudio] real sound failed, using synth:", err);
        synthFallback(animal);
      });
      return;
    }
    synthFallback(animal);
  },

  playTutti(animals: AnimalMusician[]) {
    console.log("[OrchestraAudio] playTutti()");
    animals.forEach((a, i) => {
      const t = setTimeout(() => {
        activeTimeouts.delete(t);
        if (a.soundUrl) {
          playUrl(a.soundUrl, 0.55).catch(() => synthFallback(a));
        } else {
          synthFallback(a);
        }
      }, i * 90);
      activeTimeouts.add(t);
    });
  },

  /** Play a built sequence with a step interval; calls onStep as each animal plays. */
  playSequence(
    animals: AnimalMusician[],
    stepMs = 650,
    onStep?: (animal: AnimalMusician, index: number) => void,
    onDone?: () => void
  ) {
    animals.forEach((a, i) => {
      const t = setTimeout(() => {
        activeTimeouts.delete(t);
        onStep?.(a, i);
        if (a.soundUrl) {
          playUrl(a.soundUrl, 1).catch(() => synthFallback(a));
        } else {
          synthFallback(a);
        }
        if (i === animals.length - 1) {
          const end = setTimeout(() => {
            activeTimeouts.delete(end);
            onDone?.();
          }, stepMs);
          activeTimeouts.add(end);
        }
      }, i * stepMs);
      activeTimeouts.add(t);
    });
  },


  stopAll() {
    console.log("[OrchestraAudio] stopAll()");
    activeTimeouts.forEach((t) => clearTimeout(t));
    activeTimeouts.clear();
    activeAudios.forEach((el) => {
      try { el.pause(); el.currentTime = 0; } catch { /* noop */ }
    });
    activeAudios.clear();
    activeSynths.forEach(({ osc, gain }) => {
      try {
        const now = (_ctx?.currentTime ?? 0);
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.03);
        osc.stop(now + 0.04);
      } catch { /* noop */ }
    });
    activeSynths.clear();
  },
};
