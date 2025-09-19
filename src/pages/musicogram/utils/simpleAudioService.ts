
// Serviço de áudio simples e funcional para o musicograma
import { globalCacheManager } from "@/utils/cacheManager";

class SimpleAudioService {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.3;

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.isInitialized = true;
      console.log('🎵 Áudio inicializado com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao inicializar áudio:', error);
      return false;
    }
  }

  async playNote(frequency: number, duration: number = 0.5, waveType: OscillatorType = 'sine'): Promise<void> {
    await this.initialize();
    if (!this.audioContext || !this.masterGain) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = waveType;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  async playChord(frequencies: number[], duration: number = 0.8): Promise<void> {
    await Promise.all(frequencies.map(freq => this.playNote(freq, duration, 'sine')));
  }

  setVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  dispose(): void {
    // Clear simple audio caches
    globalCacheManager.clearNamespace('sounds');
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    this.audioContext = null;
    this.masterGain = null;
  }
}

export const simpleAudio = new SimpleAudioService();
