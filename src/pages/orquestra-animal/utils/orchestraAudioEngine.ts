import type { AnimalMusician, Section } from "../data/orchestraAnimals";

class OrchestraAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  init() {
    if (this.ctx) return;
    const AC = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
    this.ctx = new AC();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.6;
    this.masterGain.connect(this.ctx.destination);
  }

  async resume() {
    this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      await this.ctx.resume();
    }
  }

  private getCtx() {
    this.init();
    return this.ctx!;
  }

  private getMaster() {
    this.init();
    return this.masterGain!;
  }

  private playInstrumentBySection(
    section: Section,
    frequency: number,
    duration = 1.2,
    when = 0
  ) {
    const ctx = this.getCtx();
    const master = this.getMaster();
    const t0 = ctx.currentTime + when;

    if (section === "percussao") {
      // Noise burst (drum-like) + tonal click
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = frequency > 500 ? "highpass" : "lowpass";
      filter.frequency.value = frequency > 500 ? 2000 : 200;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.5, t0 + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.4);
      noise.connect(filter).connect(gain).connect(master);
      noise.start(t0);
      noise.stop(t0 + 0.45);

      // tonal accent for xylophone-like
      if (frequency > 500) {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = frequency;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.4, t0 + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.8);
        osc.connect(g).connect(master);
        osc.start(t0);
        osc.stop(t0 + 0.85);
      }
      return;
    }

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    let attack = 0.05;
    let release = duration;
    let peak = 0.35;

    switch (section) {
      case "cordas":
        osc.type = "sawtooth";
        filter.type = "lowpass";
        filter.frequency.value = 2200;
        filter.Q.value = 1;
        attack = 0.08;
        peak = 0.28;
        break;
      case "madeiras":
        osc.type = "triangle";
        filter.type = "lowpass";
        filter.frequency.value = 3500;
        attack = 0.06;
        peak = 0.4;
        // vibrato
        {
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.value = 5;
          lfoGain.gain.value = 4;
          lfo.connect(lfoGain).connect(osc.frequency);
          lfo.start(t0);
          lfo.stop(t0 + duration + 0.1);
        }
        break;
      case "metais":
        osc.type = "square";
        filter.type = "lowpass";
        filter.frequency.value = 2800;
        filter.Q.value = 2;
        attack = 0.03;
        peak = 0.32;
        break;
    }

    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(peak, t0 + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + release);

    osc.connect(filter).connect(gain).connect(master);
    osc.start(t0);
    osc.stop(t0 + release + 0.1);
  }

  private playAnimalSound(animalId: string, when = 0) {
    const ctx = this.getCtx();
    const master = this.getMaster();
    const t0 = ctx.currentTime + when;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g).connect(master);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.18, t0 + 0.02);

    switch (animalId) {
      case "lion-tuba":
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(110, t0);
        osc.frequency.exponentialRampToValueAtTime(55, t0 + 0.6);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.7);
        osc.start(t0);
        osc.stop(t0 + 0.75);
        break;
      case "cat-violin":
        osc.type = "triangle";
        osc.frequency.setValueAtTime(700, t0);
        osc.frequency.exponentialRampToValueAtTime(500, t0 + 0.4);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
        osc.start(t0);
        osc.stop(t0 + 0.55);
        break;
      case "dog-drums":
        osc.type = "square";
        osc.frequency.setValueAtTime(220, t0);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
        osc.start(t0);
        osc.stop(t0 + 0.2);
        break;
      case "frog-bass":
        osc.type = "square";
        osc.frequency.setValueAtTime(80, t0);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.25);
        osc.start(t0);
        osc.stop(t0 + 0.3);
        break;
      case "owl-clarinet":
        osc.type = "sine";
        osc.frequency.setValueAtTime(400, t0);
        osc.frequency.exponentialRampToValueAtTime(300, t0 + 0.5);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6);
        osc.start(t0);
        osc.stop(t0 + 0.65);
        break;
      case "elephant-trumpet":
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, t0);
        osc.frequency.exponentialRampToValueAtTime(120, t0 + 0.5);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6);
        osc.start(t0);
        osc.stop(t0 + 0.65);
        break;
      default:
        osc.type = "sine";
        osc.frequency.value = 440;
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.3);
        osc.start(t0);
        osc.stop(t0 + 0.35);
    }
  }

  async play(animal: AnimalMusician) {
    await this.resume();
    this.playAnimalSound(animal.id, 0);
    this.playInstrumentBySection(animal.section, animal.frequency, 1.4, 0.25);
  }

  async playTutti(animals: AnimalMusician[]) {
    await this.resume();
    animals.forEach((a, i) => {
      this.playInstrumentBySection(a.section, a.frequency, 2.0, i * 0.05);
    });
  }

  stopAll() {
    if (!this.ctx) return;
    this.ctx.close();
    this.ctx = null;
    this.masterGain = null;
  }
}

export const orchestraAudio = new OrchestraAudioEngine();
