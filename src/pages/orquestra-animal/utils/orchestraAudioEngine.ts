import type { AnimalMusician, Section } from "../data/orchestraAnimals";

// Global singleton AudioContext (created on first user gesture)
let _ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!_ctx || _ctx.state === "closed") {
    const AC = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
    _ctx = new AC();
    console.log("[OrchestraAudio] AudioContext created, state:", _ctx.state);
  }
  if (_ctx.state === "suspended") {
    _ctx.resume().then(() => console.log("[OrchestraAudio] resumed"));
  }
  return _ctx;
}

/** Plays a simple tone with envelope. Volume is loud enough to be unmistakable. */
function playTone(
  type: OscillatorType,
  frequency: number,
  duration: number,
  delay = 0,
  volume = 0.3
) {
  const ctx = getCtx();
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  // Simple envelope: quick attack, slow release
  gain.gain.value = 0;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(volume, t0 + 0.02);
  gain.gain.linearRampToValueAtTime(0, t0 + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

function playNoise(duration: number, delay = 0, volume = 0.4, highpass = false) {
  const ctx = getCtx();
  const t0 = ctx.currentTime + delay;
  const sampleCount = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < sampleCount; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / sampleCount);
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = highpass ? "highpass" : "lowpass";
  filter.frequency.value = highpass ? 2000 : 250;
  const gain = ctx.createGain();
  gain.gain.value = volume;
  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  src.start(t0);
  src.stop(t0 + duration);
}

function timbreForSection(section: Section): OscillatorType {
  switch (section) {
    case "cordas":
      return "sawtooth";
    case "madeiras":
      return "triangle";
    case "metais":
      return "square";
    default:
      return "sine";
  }
}

function playInstrument(animal: AnimalMusician, delay = 0) {
  if (animal.section === "percussao") {
    if (animal.frequency > 500) {
      // Xilofone — tom + clique
      playTone("sine", animal.frequency, 0.8, delay, 0.35);
      playTone("sine", animal.frequency * 2, 0.4, delay, 0.15);
    } else {
      // Bateria — só ruído filtrado
      playNoise(0.35, delay, 0.5, false);
    }
    return;
  }
  const type = timbreForSection(animal.section);
  // Main note
  playTone(type, animal.frequency, 1.2, delay, 0.3);
  // Harmonic (octave above) for richer sound
  playTone(type, animal.frequency * 2, 1.2, delay, 0.12);
}

function playAnimalSfx(animalId: string, delay = 0) {
  switch (animalId) {
    case "lion-tuba":
      playTone("sawtooth", 110, 0.6, delay, 0.25);
      break;
    case "cat-violin":
      playTone("triangle", 700, 0.4, delay, 0.2);
      break;
    case "dog-drums":
      playTone("square", 220, 0.15, delay, 0.25);
      break;
    case "frog-bass":
      playTone("square", 80, 0.25, delay, 0.3);
      break;
    case "owl-clarinet":
      playTone("sine", 400, 0.5, delay, 0.2);
      break;
    case "elephant-trumpet":
      playTone("sawtooth", 180, 0.5, delay, 0.25);
      break;
    default:
      playTone("sine", 440, 0.2, delay, 0.2);
  }
}

export const orchestraAudio = {
  /** Call from a click handler. Synchronous. */
  play(animal: AnimalMusician) {
    console.log("[OrchestraAudio] play()", animal.name);
    getCtx(); // ensure created in gesture
    playAnimalSfx(animal.id, 0);
    playInstrument(animal, 0.2);
  },
  playTutti(animals: AnimalMusician[]) {
    console.log("[OrchestraAudio] playTutti()");
    getCtx();
    animals.forEach((a, i) => playInstrument(a, i * 0.05));
  },
};
