
import { useEffect, useRef } from "react";

// Planetary frequencies inspired by Music of the Spheres
// Based on orbital ratios mapped to audible harmonics
const PLANETARY_FREQUENCIES = {
  mercury: 141.27,  // Quick orbit
  venus: 221.23,    // Harmonic warmth
  earth: 136.10,    // OM frequency / Earth year
  mars: 144.72,     // Energy
  jupiter: 183.58,  // Expansion
  saturn: 147.85,   // Structure
  neptune: 211.44,  // Mystery
  cosmos: 128.00,   // Deep drone base
};

class CosmicMusicEngine {
  public ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private convolver: ConvolverNode | null = null;
  private activeNodes: AudioNode[] = [];
  private oscillators: OscillatorNode[] = [];
  private intervalIds: number[] = [];
  private isPlaying = false;

  async start(): Promise<void> {
    if (this.isPlaying) return;

    this.ctx = new AudioContext();
    this.isPlaying = true;

    // Master gain - starts at 0 for fade-in
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 4);

    // Reverb
    this.convolver = this.createReverb();
    const reverbGain = this.ctx.createGain();
    reverbGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    this.convolver.connect(reverbGain);
    reverbGain.connect(this.ctx.destination);
    this.activeNodes.push(this.convolver, reverbGain);

    // Delay effect
    const delay = this.ctx.createDelay(2);
    delay.delayTime.setValueAtTime(1.2, this.ctx.currentTime);
    const delayFeedback = this.ctx.createGain();
    delayFeedback.gain.setValueAtTime(0.25, this.ctx.currentTime);
    const delayMix = this.ctx.createGain();
    delayMix.gain.setValueAtTime(0.15, this.ctx.currentTime);
    delay.connect(delayFeedback);
    delayFeedback.connect(delay);
    delay.connect(delayMix);
    delayMix.connect(this.ctx.destination);
    this.activeNodes.push(delay, delayFeedback, delayMix);

    // Connect master to dry + effects
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.connect(this.convolver);
    this.masterGain.connect(delay);

    // Layer 1: Deep cosmic drone
    this.createDrone(PLANETARY_FREQUENCIES.cosmos, 0.12);
    this.createDrone(PLANETARY_FREQUENCIES.earth, 0.08);

    // Layer 2: Atmospheric pads (slow evolving)
    this.createEvolvingPad(PLANETARY_FREQUENCIES.venus, 0.06, 8);
    this.createEvolvingPad(PLANETARY_FREQUENCIES.jupiter, 0.05, 12);
    this.createEvolvingPad(PLANETARY_FREQUENCIES.saturn, 0.04, 15);

    // Layer 3: Orbital arpeggios
    this.startOrbitalArpeggio();

    // Layer 4: Cosmic bells (sparse)
    this.startCosmicBells();

    // Layer 5: Binaural-like subtle beating
    this.createBinauralBeat(PLANETARY_FREQUENCIES.earth, 4, 0.03); // 4Hz theta
  }

  private createReverb(): ConvolverNode {
    const convolver = this.ctx!.createConvolver();
    const rate = this.ctx!.sampleRate;
    const length = rate * 4; // 4-second reverb tail
    const impulse = this.ctx!.createBuffer(2, length, rate);

    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        // Exponential decay with random diffusion
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
      }
    }
    convolver.buffer = impulse;
    return convolver;
  }

  private createDrone(freq: number, volume: number): void {
    if (!this.ctx || !this.masterGain) return;

    // Main tone
    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Sub-octave
    const sub = this.ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.setValueAtTime(freq / 2, this.ctx.currentTime);

    // Slight detuning for richness
    const detune = this.ctx.createOscillator();
    detune.type = "sine";
    detune.frequency.setValueAtTime(freq + 0.5, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(volume * 0.6, this.ctx.currentTime);

    const detuneGain = this.ctx.createGain();
    detuneGain.gain.setValueAtTime(volume * 0.3, this.ctx.currentTime);

    // Low-pass filter for warmth
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.7, this.ctx.currentTime);

    osc.connect(gain);
    sub.connect(subGain);
    detune.connect(detuneGain);
    gain.connect(filter);
    subGain.connect(filter);
    detuneGain.connect(filter);
    filter.connect(this.masterGain);

    osc.start();
    sub.start();
    detune.start();

    this.oscillators.push(osc, sub, detune);
    this.activeNodes.push(gain, subGain, detuneGain, filter);
  }

  private createEvolvingPad(freq: number, volume: number, cycleSeconds: number): void {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Slow tremolo via LFO
    const lfo = this.ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(1 / cycleSeconds, this.ctx.currentTime);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(volume * 0.5, this.ctx.currentTime);

    const padGain = this.ctx.createGain();
    padGain.gain.setValueAtTime(volume, this.ctx.currentTime);

    // Bandpass for ethereal quality
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(freq, this.ctx.currentTime);
    filter.Q.setValueAtTime(2, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(padGain.gain);
    osc.connect(padGain);
    padGain.connect(filter);
    filter.connect(this.masterGain);

    osc.start();
    lfo.start();

    this.oscillators.push(osc, lfo);
    this.activeNodes.push(lfoGain, padGain, filter);
  }

  private startOrbitalArpeggio(): void {
    if (!this.ctx || !this.masterGain) return;

    // Pentatonic-like scale from planetary frequencies
    const notes = [
      PLANETARY_FREQUENCIES.earth,
      PLANETARY_FREQUENCIES.earth * 1.125,
      PLANETARY_FREQUENCIES.earth * 1.25,
      PLANETARY_FREQUENCIES.earth * 1.5,
      PLANETARY_FREQUENCIES.earth * 1.667,
      PLANETARY_FREQUENCIES.earth * 2,
    ];

    let noteIndex = 0;
    const ctx = this.ctx;
    const master = this.masterGain;

    const playArpNote = () => {
      if (!this.isPlaying || !ctx) return;

      const freq = notes[noteIndex % notes.length];
      noteIndex++;

      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq * 2, ctx.currentTime); // Higher octave

      const gain = ctx.createGain();
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 3);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2000, now);
      filter.frequency.exponentialRampToValueAtTime(500, now + 3);

      osc.connect(gain);
      gain.connect(filter);
      filter.connect(master);

      osc.start(now);
      osc.stop(now + 3.5);
    };

    // Play notes at slow intervals (2-5 seconds, slightly random)
    const scheduleNext = () => {
      if (!this.isPlaying) return;
      const delay = 2000 + Math.random() * 3000;
      const id = window.setTimeout(() => {
        playArpNote();
        scheduleNext();
      }, delay);
      this.intervalIds.push(id);
    };

    // Start after initial fade-in
    const startId = window.setTimeout(() => {
      playArpNote();
      scheduleNext();
    }, 5000);
    this.intervalIds.push(startId);
  }

  private startCosmicBells(): void {
    if (!this.ctx || !this.masterGain) return;

    const bellFreqs = [
      PLANETARY_FREQUENCIES.mercury * 4,
      PLANETARY_FREQUENCIES.venus * 3,
      PLANETARY_FREQUENCIES.neptune * 2,
    ];

    const ctx = this.ctx;
    const master = this.masterGain;

    const playBell = () => {
      if (!this.isPlaying || !ctx) return;

      const freq = bellFreqs[Math.floor(Math.random() * bellFreqs.length)];

      // Bell = sine + harmonic overtones with fast decay
      const fundamental = ctx.createOscillator();
      fundamental.type = "sine";
      fundamental.frequency.setValueAtTime(freq, ctx.currentTime);

      const overtone = ctx.createOscillator();
      overtone.type = "sine";
      overtone.frequency.setValueAtTime(freq * 2.756, ctx.currentTime); // Inharmonic bell ratio

      const gain = ctx.createGain();
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.025, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 4);

      const overtoneGain = ctx.createGain();
      overtoneGain.gain.setValueAtTime(0, now);
      overtoneGain.gain.linearRampToValueAtTime(0.012, now + 0.01);
      overtoneGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      fundamental.connect(gain);
      overtone.connect(overtoneGain);
      gain.connect(master);
      overtoneGain.connect(master);

      fundamental.start(now);
      overtone.start(now);
      fundamental.stop(now + 4.5);
      overtone.stop(now + 3);
    };

    const scheduleNext = () => {
      if (!this.isPlaying) return;
      const delay = 6000 + Math.random() * 10000; // Every 6-16 seconds
      const id = window.setTimeout(() => {
        playBell();
        scheduleNext();
      }, delay);
      this.intervalIds.push(id);
    };

    const startId = window.setTimeout(() => {
      playBell();
      scheduleNext();
    }, 8000);
    this.intervalIds.push(startId);
  }

  private createBinauralBeat(baseFreq: number, beatFreq: number, volume: number): void {
    if (!this.ctx || !this.masterGain) return;

    // Left ear
    const left = this.ctx.createOscillator();
    left.type = "sine";
    left.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);

    // Right ear (slightly different frequency creates the beat)
    const right = this.ctx.createOscillator();
    right.type = "sine";
    right.frequency.setValueAtTime(baseFreq + beatFreq, this.ctx.currentTime);

    const leftGain = this.ctx.createGain();
    leftGain.gain.setValueAtTime(volume, this.ctx.currentTime);

    const rightGain = this.ctx.createGain();
    rightGain.gain.setValueAtTime(volume, this.ctx.currentTime);

    const leftPanner = this.ctx.createStereoPanner();
    leftPanner.pan.setValueAtTime(-0.8, this.ctx.currentTime);

    const rightPanner = this.ctx.createStereoPanner();
    rightPanner.pan.setValueAtTime(0.8, this.ctx.currentTime);

    left.connect(leftGain);
    leftGain.connect(leftPanner);
    leftPanner.connect(this.masterGain);

    right.connect(rightGain);
    rightGain.connect(rightPanner);
    rightPanner.connect(this.masterGain);

    left.start();
    right.start();

    this.oscillators.push(left, right);
    this.activeNodes.push(leftGain, rightGain, leftPanner, rightPanner);
  }

  async stop(): Promise<void> {
    this.isPlaying = false;

    // Clear scheduled events
    this.intervalIds.forEach(id => clearTimeout(id));
    this.intervalIds = [];

    // Fade out
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0, now + 2);

      // Stop everything after fade-out
      await new Promise(resolve => setTimeout(resolve, 2200));
    }

    this.oscillators.forEach(osc => {
      try { osc.stop(); } catch {}
    });
    this.oscillators = [];
    this.activeNodes = [];

    if (this.ctx) {
      try { await this.ctx.close(); } catch {}
      this.ctx = null;
    }
    this.masterGain = null;
    this.convolver = null;
  }
}

export function CosmicAmbientMusic() {
  const engineRef = useRef<CosmicMusicEngine | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const tryStart = async () => {
      if (startedRef.current) return;
      startedRef.current = true;

      try {
        const engine = new CosmicMusicEngine();
        engineRef.current = engine;
        await engine.start();
        console.log("🎵 Música das Esferas iniciada");
      } catch (err) {
        console.warn("🎵 Erro ao iniciar música:", err);
        startedRef.current = false;
      }
    };

    // Try immediately (works if user already interacted with page)
    tryStart();

    // Also listen for interactions in case AudioContext was blocked
    const handleInteraction = () => {
      if (!startedRef.current) {
        tryStart();
      } else if (engineRef.current) {
        // Resume if suspended
        (engineRef.current as any).ctx?.resume?.();
      }
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("keydown", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      if (engineRef.current) {
        engineRef.current.stop();
      }
    };
  }, []);

  return null;
}
