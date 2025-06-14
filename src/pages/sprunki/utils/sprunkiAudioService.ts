class SprunkiAudioService {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isInitialized = false;
  private characterGains: Map<string, GainNode> = new Map();
  private activeOscillators: Map<string, OscillatorNode[]> = new Map();
  private settings = {
    sensoryMode: false,
    visualFeedbackOnly: false,
    masterVolume: 0.6
  };

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = this.settings.masterVolume;
      this.masterGain.connect(this.audioContext.destination);

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.isInitialized = true;
      console.log('🎵 Sprunki Audio inicializado');
      return true;
    } catch (error) {
      console.log('Erro no áudio, modo visual ativo:', error);
      this.isInitialized = true; // Allow visual-only mode
      return true;
    }
  }

  async playCharacterSound(characterId: string, frequency: number, type: string): Promise<void> {
    if (this.settings.visualFeedbackOnly || !this.audioContext || !this.masterGain) {
      return;
    }

    try {
      // Stop previous sounds for this character
      this.stopCharacterSound(characterId);

      const characterGain = this.audioContext.createGain();
      characterGain.gain.value = this.settings.sensoryMode ? 0.4 : 0.6;
      characterGain.connect(this.masterGain);
      
      this.characterGains.set(characterId, characterGain);

      // Create continuous loops based on character type
      const oscillators = this.createLoopingOscillators(type, frequency, characterGain);
      this.activeOscillators.set(characterId, oscillators);

      // Start all oscillators for continuous playback
      const now = this.audioContext.currentTime;
      oscillators.forEach(osc => osc.start(now));

    } catch (error) {
      console.log(`Erro ao tocar som do personagem ${characterId}:`, error);
    }
  }

  private createLoopingOscillators(type: string, frequency: number, gain: GainNode): OscillatorNode[] {
    if (!this.audioContext) return [];

    const oscillators: OscillatorNode[] = [];

    switch (type) {
      case 'beat':
        // Continuous kick drum pattern
        const kick = this.audioContext.createOscillator();
        kick.type = 'sine';
        kick.frequency.value = 60;
        
        // Create envelope for kick drum effect
        const kickGain = this.audioContext.createGain();
        kickGain.gain.setValueAtTime(0.8, this.audioContext.currentTime);
        kick.connect(kickGain);
        kickGain.connect(gain);
        
        oscillators.push(kick);
        break;

      case 'melody':
        // Melodic loop
        const melody = this.audioContext.createOscillator();
        melody.type = 'triangle';
        melody.frequency.value = frequency;
        
        // Add slight vibrato for organic feel
        const vibrato = this.audioContext.createOscillator();
        vibrato.type = 'sine';
        vibrato.frequency.value = 5;
        
        const vibratoGain = this.audioContext.createGain();
        vibratoGain.gain.value = 2;
        
        vibrato.connect(vibratoGain);
        vibratoGain.connect(melody.frequency);
        
        melody.connect(gain);
        oscillators.push(melody, vibrato);
        break;

      case 'effect':
        // Atmospheric effect
        const effect = this.audioContext.createOscillator();
        effect.type = 'square';
        effect.frequency.value = frequency;
        
        // Create filter for effect processing
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = frequency * 2;
        filter.Q.value = 5;
        
        effect.connect(filter);
        filter.connect(gain);
        oscillators.push(effect);
        break;

      case 'harmony':
        // Harmonic voices/chords
        [1, 1.25, 1.5, 1.75].forEach(ratio => {
          const harm = this.audioContext.createOscillator();
          harm.type = 'sine';
          harm.frequency.value = frequency * ratio;
          
          const harmGain = this.audioContext.createGain();
          harmGain.gain.value = 0.3; // Lower individual volumes for blend
          
          harm.connect(harmGain);
          harmGain.connect(gain);
          oscillators.push(harm);
        });
        break;

      default:
        const defaultOsc = this.audioContext.createOscillator();
        defaultOsc.type = 'sine';
        defaultOsc.frequency.value = frequency;
        defaultOsc.connect(gain);
        oscillators.push(defaultOsc);
    }

    return oscillators;
  }

  stopCharacterSound(characterId: string): void {
    const oscillators = this.activeOscillators.get(characterId);
    if (oscillators) {
      oscillators.forEach(osc => {
        try {
          osc.stop();
        } catch (error) {
          // Oscillator might already be stopped
        }
      });
      this.activeOscillators.delete(characterId);
    }

    const gain = this.characterGains.get(characterId);
    if (gain) {
      gain.disconnect();
      this.characterGains.delete(characterId);
    }
  }

  stopAllSounds(): void {
    this.activeOscillators.forEach((_, characterId) => {
      this.stopCharacterSound(characterId);
    });
  }

  setCharacterVolume(characterId: string, volume: number): void {
    const gain = this.characterGains.get(characterId);
    if (gain) {
      gain.gain.value = volume * (this.settings.sensoryMode ? 0.3 : 0.5);
    }
  }

  setMasterVolume(volume: number): void {
    this.settings.masterVolume = volume;
    if (this.masterGain) {
      this.masterGain.gain.value = volume;
    }
  }

  setSensoryMode(enabled: boolean): void {
    this.settings.sensoryMode = enabled;
    this.characterGains.forEach(gain => {
      gain.gain.value = gain.gain.value * (enabled ? 0.5 : 2);
    });
  }

  setVisualFeedbackOnly(enabled: boolean): void {
    this.settings.visualFeedbackOnly = enabled;
    if (enabled) {
      this.stopAllSounds();
    }
  }

  getInitialized(): boolean {
    return this.isInitialized;
  }

  cleanup(): void {
    this.stopAllSounds();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    this.audioContext = null;
    this.masterGain = null;
    this.isInitialized = false;
  }
}

export const sprunkiAudio = new SprunkiAudioService();
