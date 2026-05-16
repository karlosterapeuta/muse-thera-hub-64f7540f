import * as Tone from "tone";
import type { Dino, DinoInstrument } from "../data/dinos";

let started = false;
let masterVol: Tone.Volume | null = null;
const instruments = new Map<DinoInstrument, Tone.ToneAudioNode & { triggerAttackRelease?: any }>();

function dbFromUnit(v: number) {
  // v in [0,1] → dB. 0 → -60 (effectively mute), 1 → 0dB
  if (v <= 0) return -60;
  return Math.max(-60, 20 * Math.log10(v));
}

export async function ensureAudioReady(volume = 0.7) {
  if (!started) {
    await Tone.start();
    masterVol = new Tone.Volume(dbFromUnit(volume)).toDestination();
    started = true;
  } else if (masterVol) {
    masterVol.volume.value = dbFromUnit(volume);
  }
}

export function setVolume(volume: number) {
  if (masterVol) masterVol.volume.value = dbFromUnit(volume);
}

function out() {
  return masterVol ?? Tone.getDestination();
}

function getInstrument(kind: DinoInstrument) {
  if (instruments.has(kind)) return instruments.get(kind)!;
  let node: any;
  switch (kind) {
    case "drums": {
      // Membrane (kick) — gentle attack
      node = new Tone.MembraneSynth({ pitchDecay: 0.05, octaves: 4, envelope: { attack: 0.005, decay: 0.4, sustain: 0.01, release: 0.4 } });
      break;
    }
    case "deepDrum": {
      node = new Tone.MembraneSynth({ pitchDecay: 0.08, octaves: 6, oscillator: { type: "sine" }, envelope: { attack: 0.01, decay: 0.6, sustain: 0.02, release: 0.8 } });
      break;
    }
    case "xylophone": {
      node = new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 0.4, release: 0.2 }, harmonicity: 5.1, modulationIndex: 16, resonance: 4000, octaves: 1.2 } as any);
      break;
    }
    case "piano": {
      node = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "triangle" }, envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 1.2 } });
      break;
    }
    case "flute": {
      node = new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.6 } });
      break;
    }
    case "guitar": {
      node = new Tone.PluckSynth({ attackNoise: 0.5, dampening: 4000, resonance: 0.9 });
      break;
    }
    case "bass": {
      node = new Tone.MonoSynth({ oscillator: { type: "sawtooth" }, envelope: { attack: 0.04, decay: 0.4, sustain: 0.6, release: 1 }, filterEnvelope: { attack: 0.05, decay: 0.2, sustain: 0.4, release: 1, baseFrequency: 200, octaves: 2 } });
      break;
    }
    case "synthWater": {
      const fx = new Tone.FeedbackDelay({ delayTime: 0.25, feedback: 0.4, wet: 0.4 });
      const synth = new Tone.FMSynth({ harmonicity: 1.5, modulationIndex: 6, envelope: { attack: 0.05, decay: 0.4, sustain: 0.3, release: 1 } });
      synth.chain(fx, out());
      instruments.set(kind, synth as any);
      return synth as any;
    }
  }
  node.connect(out());
  instruments.set(kind, node);
  return node;
}

export function playDino(dino: Dino, opts?: { duration?: string | number; noteOverride?: string }) {
  if (!started) return; // gesture not yet granted
  const inst: any = getInstrument(dino.instrument);
  const duration = opts?.duration ?? "8n";
  const note = opts?.noteOverride ?? dino.note;
  try {
    if (inst instanceof Tone.MetalSynth) {
      inst.triggerAttackRelease(duration, undefined);
    } else if (inst.triggerAttackRelease) {
      inst.triggerAttackRelease(note, duration);
    }
  } catch (e) {
    console.warn("[DinoRitmos] sound failed", e);
  }
}

export function playRhythm(dino: Dino, pattern: number[] = [0, 0.4, 0.8, 1.2]) {
  if (!started) return;
  const now = Tone.now();
  pattern.forEach((t) => {
    const inst: any = getInstrument(dino.instrument);
    try {
      if (inst instanceof Tone.MetalSynth) {
        inst.triggerAttackRelease("16n", now + t);
      } else if (inst.triggerAttackRelease) {
        inst.triggerAttackRelease(dino.note, "8n", now + t);
      }
    } catch { /* noop */ }
  });
}

// Soft ambient pad
let ambient: { synth: Tone.PolySynth; loop: Tone.Loop } | null = null;
export function startAmbient() {
  if (!started || ambient) return;
  const reverb = new Tone.Reverb({ decay: 6, wet: 0.5 }).connect(out());
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: { attack: 2, decay: 1, sustain: 0.6, release: 4 },
    volume: -18,
  }).connect(reverb);
  const chords = [
    ["C4", "E4", "G4"],
    ["A3", "C4", "E4"],
    ["F3", "A3", "C4"],
    ["G3", "B3", "D4"],
  ];
  let i = 0;
  const loop = new Tone.Loop((time) => {
    synth.triggerAttackRelease(chords[i % chords.length], "2n", time);
    i++;
  }, "2n");
  loop.start(0);
  Tone.Transport.start();
  ambient = { synth, loop };
}

export function stopAmbient() {
  if (!ambient) return;
  ambient.loop.stop();
  ambient.synth.dispose();
  Tone.Transport.stop();
  ambient = null;
}

// Speech synthesis (browser) for syllables
export function speak(text: string, opts?: { rate?: number; pitch?: number }) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "pt-BR";
  u.rate = opts?.rate ?? 0.85;
  u.pitch = opts?.pitch ?? 1.2;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}
