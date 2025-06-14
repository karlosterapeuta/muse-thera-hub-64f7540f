
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
      characterGain.gain.value = this.settings.sensoryMode ? 0.3 : 0.5;
      characterGain.connect(this.masterGain);
      
      this.characterGains.set(characterId, characterGain);

      // Create sound based on character type
      const oscillators = this.createCharacterOscillators(type, frequency, characterGain);
      this.activeOscillators.set(characterId, oscillators);

      // Start all oscillators
      const now = this.audioContext.currentTime;
      oscillators.forEach(osc => osc.start(now));

    } catch (error) {
      console.log(`Erro ao tocar som do personagem ${characterId}:`, error);
    }
  }

  private createCharacterOscillators(type: string, frequency: number, gain: GainNode): OscillatorNode[] {
    if (!this.audioContext) return [];

    const oscillators: OscillatorNode[] = [];

    switch (type) {
      case 'beat':
        // Kick drum simulation
        const kick = this.audioContext.createOscillator();
        kick.type = 'sine';
        kick.frequency.setValueAtTime(60, this.audioContext.currentTime);
        kick.frequency.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        kick.connect(gain);
        oscillators.push(kick);
        break;

      case 'melody':
        // Simple melody line
        const melody = this.audioContext.createOscillator();
        melody.type = 'triangle';
        melody.frequency.value = frequency;
        melody.connect(gain);
        oscillators.push(melody);
        break;

      case 'bass':
        // Bass line
        const bass = this.audioContext.createOscillator();
        bass.type = 'sawtooth';
        bass.frequency.value = frequency * 0.5;
        bass.connect(gain);
        oscillators.push(bass);
        break;

      case 'harmony':
        // Harmonic chord
        [1, 1.25, 1.5].forEach(ratio => {
          const harm = this.audioContext.createOscillator();
          harm.type = 'sine';
          harm.frequency.value = frequency * ratio;
          harm.connect(gain);
          oscillators.push(harm);
        });
        break;

      case 'effect':
        // Special effect
        const effect = this.audioContext.createOscillator();
        effect.type = 'square';
        effect.frequency.setValueAtTime(frequency * 2, this.audioContext.currentTime);
        effect.frequency.linearRampToValueAtTime(frequency * 4, this.audioContext.currentTime + 0.5);
        effect.connect(gain);
        oscillators.push(effect);
        break;

      case 'rhythm':
        // Rhythmic pattern
        const rhythm = this.audioContext.createOscillator();
        rhythm.type = 'square';
        rhythm.frequency.value = frequency;
        rhythm.connect(gain);
        oscillators.push(rhythm);
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
