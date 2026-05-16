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

function playUrl(url: string, volume = 1): Promise<void> {
  // Clone so overlapping clicks don't cut each other off
  const base = getAudio(url);
  const el = base.cloneNode(true) as HTMLAudioElement;
  el.volume = volume;
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
  gain.gain.linearRampToValueAtTime(0.3, t0 + 0.02);
  gain.gain.linearRampToValueAtTime(0, t0 + 1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + 1.05);
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
      setTimeout(() => {
        if (a.soundUrl) {
          playUrl(a.soundUrl, 0.55).catch(() => synthFallback(a));
        } else {
          synthFallback(a);
        }
      }, i * 90);
    });
  },
};
