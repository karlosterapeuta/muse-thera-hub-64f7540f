
class AudioSynthesis {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillators: Map<string, OscillatorNode> = new Map();
  private initialized = false;

  async initialize(): Promise<boolean> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Erro ao inicializar áudio:', error);
      return false;
    }
  }

  createSoundWave(x: number, y: number, canvasWidth: number, canvasHeight: number): string {
    if (!this.audioContext || !this.masterGain) return '';

    const id = `wave-${Date.now()}-${Math.random()}`;
    
    // Convert position to frequency (20Hz to 2000Hz)
    const frequency = 200 + (x / canvasWidth) * 1800;
    
    // Convert Y position to volume (0.1 to 0.8)
    const volume = 0.1 + (1 - y / canvasHeight) * 0.7;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.masterGain);
      
      // Wave type based on position
      const waveTypes: OscillatorType[] = ['sine', 'square', 'sawtooth', 'triangle'];
      const typeIndex = Math.floor((y / canvasHeight) * waveTypes.length);
      oscillator.type = waveTypes[typeIndex] || 'sine';
      
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.5);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 1.5);
      
      this.oscillators.set(id, oscillator);
      
      // Remove from map when done
      oscillator.onended = () => {
        this.oscillators.delete(id);
      };
      
      return id;
    } catch (error) {
      console.error('Erro ao criar onda sonora:', error);
      return '';
    }
  }

  setMasterVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(volume, this.audioContext!.currentTime);
    }
  }

  stopAll() {
    this.oscillators.forEach((oscillator) => {
      try {
        oscillator.stop();
      } catch (error) {
        // Oscillator already stopped
      }
    });
    this.oscillators.clear();
  }

  getInitialized(): boolean {
    return this.initialized;
  }

  cleanup() {
    this.stopAll();
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.initialized = false;
  }
}

export const audioSynthesis = new AudioSynthesis();
