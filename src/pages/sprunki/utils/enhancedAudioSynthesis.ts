
interface InstrumentSettings {
  type: OscillatorType;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  filterFrequency?: number;
  filterQ?: number;
}

const instruments: Record<string, InstrumentSettings> = {
  piano: {
    type: 'triangle',
    attack: 0.01,
    decay: 0.3,
    sustain: 0.3,
    release: 1.0
  },
  guitar: {
    type: 'sawtooth',
    attack: 0.02,
    decay: 0.2,
    sustain: 0.6,
    release: 0.8,
    filterFrequency: 2000,
    filterQ: 1
  },
  flute: {
    type: 'sine',
    attack: 0.1,
    decay: 0.1,
    sustain: 0.8,
    release: 0.3,
    filterFrequency: 3000,
    filterQ: 2
  },
  drums: {
    type: 'square',
    attack: 0.001,
    decay: 0.1,
    sustain: 0.1,
    release: 0.2,
    filterFrequency: 500,
    filterQ: 5
  },
  synth: {
    type: 'square',
    attack: 0.05,
    decay: 0.2,
    sustain: 0.7,
    release: 0.5,
    filterFrequency: 1500,
    filterQ: 3
  }
};

class EnhancedAudioSynthesis {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverb: ConvolverNode | null = null;
  private delay: DelayNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private activeNotes: Map<string, { oscillator: OscillatorNode; gain: GainNode }> = new Map();
  private currentInstrument: string = 'piano';
  private reverbLevel = 0.3;
  private delayLevel = 0.2;

  async initialize(): Promise<boolean> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Master gain
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);

      // Create reverb
      await this.createReverb();

      // Create delay
      this.delay = this.audioContext.createDelay(1.0);
      this.delay.delayTime.setValueAtTime(0.3, this.audioContext.currentTime);
      
      const delayGain = this.audioContext.createGain();
      delayGain.gain.setValueAtTime(this.delayLevel, this.audioContext.currentTime);

      // Create filter
      this.filter = this.audioContext.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(5000, this.audioContext.currentTime);

      // Connect effects chain
      this.masterGain.connect(this.filter!);
      this.filter!.connect(this.delay!);
      this.delay!.connect(delayGain);
      delayGain.connect(this.delay!);
      
      this.filter!.connect(this.reverb!);
      this.reverb!.connect(this.audioContext.destination);
      this.filter!.connect(this.audioContext.destination);

      return true;
    } catch (error) {
      console.error('Erro ao inicializar áudio aprimorado:', error);
      return false;
    }
  }

  private async createReverb(): Promise<void> {
    if (!this.audioContext) return;

    this.reverb = this.audioContext.createConvolver();
    
    // Create impulse response for reverb
    const length = this.audioContext.sampleRate * 2;
    const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }
    
    this.reverb.buffer = impulse;

    const reverbGain = this.audioContext.createGain();
    reverbGain.gain.setValueAtTime(this.reverbLevel, this.audioContext.currentTime);
    this.reverb.connect(reverbGain);
    reverbGain.connect(this.audioContext.destination);
  }

  setInstrument(instrument: string): void {
    if (instruments[instrument]) {
      this.currentInstrument = instrument;
    }
  }

  createNote(frequency: number, x: number, y: number, canvasWidth: number, canvasHeight: number): string {
    if (!this.audioContext || !this.masterGain) return '';

    const id = `note-${Date.now()}-${Math.random()}`;
    const instrument = instruments[this.currentInstrument];

    // Create oscillator
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = instrument.type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    // Create envelope
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);

    // Apply ADSR envelope
    const now = this.audioContext.currentTime;
    gainNode.gain.linearRampToValueAtTime(0.8, now + instrument.attack);
    gainNode.gain.exponentialRampToValueAtTime(instrument.sustain, now + instrument.attack + instrument.decay);

    // Create filter if instrument has one
    let filterNode: BiquadFilterNode | null = null;
    if (instrument.filterFrequency) {
      filterNode = this.audioContext.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(instrument.filterFrequency, this.audioContext.currentTime);
      filterNode.Q.setValueAtTime(instrument.filterQ || 1, this.audioContext.currentTime);
    }

    // Connect nodes
    oscillator.connect(gainNode);
    if (filterNode) {
      gainNode.connect(filterNode);
      filterNode.connect(this.masterGain);
    } else {
      gainNode.connect(this.masterGain);
    }

    // Spatial audio - pan based on X position
    const panner = this.audioContext.createStereoPanner();
    panner.pan.value = (x / canvasWidth) * 2 - 1; // -1 to 1
    
    if (filterNode) {
      filterNode.connect(panner);
    } else {
      gainNode.connect(panner);
    }
    panner.connect(this.masterGain);

    oscillator.start(this.audioContext.currentTime);

    // Store for later cleanup
    this.activeNotes.set(id, { oscillator, gain: gainNode });

    // Auto-release after duration
    const duration = instrument.attack + instrument.decay + instrument.release;
    setTimeout(() => {
      if (this.activeNotes.has(id)) {
        this.releaseNote(id);
      }
    }, duration * 1000);

    return id;
  }

  releaseNote(noteId: string): void {
    const note = this.activeNotes.get(noteId);
    if (!note || !this.audioContext) return;

    const instrument = instruments[this.currentInstrument];
    const now = this.audioContext.currentTime;

    // Release envelope
    note.gain.gain.cancelScheduledValues(now);
    note.gain.gain.setValueAtTime(note.gain.gain.value, now);
    note.gain.gain.exponentialRampToValueAtTime(0.001, now + instrument.release);

    // Stop and cleanup
    note.oscillator.stop(now + instrument.release);
    note.oscillator.onended = () => {
      this.activeNotes.delete(noteId);
    };
  }

  createChord(frequencies: number[], x: number, y: number, canvasWidth: number, canvasHeight: number): string[] {
    return frequencies.map(freq => this.createNote(freq, x, y, canvasWidth, canvasHeight));
  }

  setReverbLevel(level: number): void {
    this.reverbLevel = Math.max(0, Math.min(1, level));
  }

  setDelayLevel(level: number): void {
    this.delayLevel = Math.max(0, Math.min(1, level));
    if (this.delay && this.audioContext) {
      // Update delay feedback
    }
  }

  setMasterVolume(volume: number): void {
    if (this.masterGain && this.audioContext) {
      this.masterGain.gain.setValueAtTime(volume, this.audioContext.currentTime);
    }
  }

  stopAll(): void {
    this.activeNotes.forEach((note, id) => {
      this.releaseNote(id);
    });
  }

  cleanup(): void {
    this.stopAll();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }

  // Musical scale helpers
  getChordFrequencies(baseFrequency: number, chordType: 'major' | 'minor' | 'seventh' | 'diminished'): number[] {
    const ratios: Record<string, number[]> = {
      major: [1, 1.25, 1.5],
      minor: [1, 1.2, 1.5],
      seventh: [1, 1.25, 1.5, 1.75],
      diminished: [1, 1.2, 1.414]
    };

    return ratios[chordType].map(ratio => baseFrequency * ratio);
  }

  getScaleFrequency(baseFrequency: number, scale: 'pentatonic' | 'major' | 'minor' | 'blues', noteIndex: number): number {
    const scales: Record<string, number[]> = {
      pentatonic: [1, 1.125, 1.25, 1.5, 1.667],
      major: [1, 1.125, 1.25, 1.333, 1.5, 1.667, 1.875],
      minor: [1, 1.125, 1.2, 1.333, 1.5, 1.6, 1.8],
      blues: [1, 1.2, 1.25, 1.414, 1.5, 1.8]
    };

    const scaleRatios = scales[scale];
    const index = noteIndex % scaleRatios.length;
    const octave = Math.floor(noteIndex / scaleRatios.length);
    
    return baseFrequency * scaleRatios[index] * Math.pow(2, octave);
  }
}

export const enhancedAudio = new EnhancedAudioSynthesis();
