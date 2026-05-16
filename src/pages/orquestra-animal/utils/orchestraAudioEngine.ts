import type { AnimalMusician, Section } from "../data/orchestraAnimals";

class OrchestraAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  /** Must be called from a user gesture (click/tap). Returns a live AudioContext. */
  private ensure(): { ctx: AudioContext; master: GainNode } {
    if (!this.ctx || this.ctx.state === "closed") {
      const AC = (window.AudioContext ||
        (window as any).webkitAudioContext) as typeof AudioContext;
      this.ctx = new AC();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.8;
      this.masterGain.connect(this.ctx.destination);
    }
    // Resume if suspended (best-effort; fire-and-forget is fine inside a gesture)
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return { ctx: this.ctx, master: this.masterGain! };
  }

  private playInstrumentBySection(
    section: Section,
    frequency: number,
    duration = 1.2,
    when = 0
  ) {
    const { ctx, master } = this.ensure();
    const t0 = ctx.currentTime + when;

    if (section === "percussao") {
      // Noise burst
      const bufferSize = Math.floor(ctx.sampleRate * 0.4);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = frequency > 500 ? "highpass" : "lowpass";
      filter.frequency.value = frequency > 500 ? 2000 : 250;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0, t0);
      ng.gain.linearRampToValueAtTime(0.7, t0 + 0.005);
      ng.gain.linearRampToValueAtTime(0, t0 + 0.4);
      noise.connect(filter).connect(ng).connect(master);
      noise.start(t0);
      noise.stop(t0 + 0.45);

      if (frequency > 500) {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = frequency;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, t0);
        g.gain.linearRampToValueAtTime(0.5, t0 + 0.005);
        g.gain.linearRampToValueAtTime(0, t0 + 0.8);
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
    let peak = 0.45;

    switch (section) {
      case "cordas":
        osc.type = "sawtooth";
        filter.type = "lowpass";
        filter.frequency.value = 2200;
        attack = 0.08;
        peak = 0.35;
        break;
      case "madeiras":
        osc.type = "triangle";
        filter.type = "lowpass";
        filter.frequency.value = 3500;
        attack = 0.06;
        peak = 0.5;
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
        attack = 0.03;
        peak = 0.4;
        break;
    }

    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(peak, t0 + attack);
    gain.gain.linearRampToValueAtTime(0, t0 + duration);

    osc.connect(filter).connect(gain).connect(master);
    osc.start(t0);
    osc.stop(t0 + duration + 0.1);
  }

  private playAnimalSound(animalId: string, when = 0) {
    const { ctx, master } = this.ensure();
    const t0 = ctx.currentTime + when;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g).connect(master);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(0.3, t0 + 0.02);

    const stopAt = (dur: number) => {
      g.gain.linearRampToValueAtTime(0, t0 + dur);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
    };

    switch (animalId) {
      case "lion-tuba":
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(110, t0);
        osc.frequency.linearRampToValueAtTime(55, t0 + 0.6);
        stopAt(0.7);
        break;
      case "cat-violin":
        osc.type = "triangle";
        osc.frequency.setValueAtTime(700, t0);
        osc.frequency.linearRampToValueAtTime(500, t0 + 0.4);
        stopAt(0.5);
        break;
      case "dog-drums":
        osc.type = "square";
        osc.frequency.setValueAtTime(220, t0);
        stopAt(0.18);
        break;
      case "frog-bass":
        osc.type = "square";
        osc.frequency.setValueAtTime(80, t0);
        stopAt(0.25);
        break;
      case "owl-clarinet":
        osc.type = "sine";
        osc.frequency.setValueAtTime(400, t0);
        osc.frequency.linearRampToValueAtTime(300, t0 + 0.5);
        stopAt(0.6);
        break;
      case "elephant-trumpet":
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, t0);
        osc.frequency.linearRampToValueAtTime(120, t0 + 0.5);
        stopAt(0.6);
        break;
      default:
        osc.type = "sine";
        osc.frequency.value = 440;
        stopAt(0.3);
    }
  }

  /** Call this from a user click handler. Synchronous scheduling. */
  play(animal: AnimalMusician) {
    this.ensure();
    this.playAnimalSound(animal.id, 0);
    this.playInstrumentBySection(animal.section, animal.frequency, 1.4, 0.25);
  }

  playTutti(animals: AnimalMusician[]) {
    this.ensure();
    animals.forEach((a, i) => {
      this.playInstrumentBySection(a.section, a.frequency, 2.0, i * 0.05);
    });
  }
}

export const orchestraAudio = new OrchestraAudioEngine();
