
// Sistema de áudio robusto e simplificado para crianças TEA
class TEAAudioService {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isInitialized = false;
  private isCalmMode = false;
  private volume = 0.4;
  private initializationPromise: Promise<boolean> | null = null;

  async initialize(): Promise<boolean> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    if (this.isInitialized) return true;

    this.initializationPromise = this._initialize();
    return this.initializationPromise;
  }

  private async _initialize(): Promise<boolean> {
    try {
      // Verificar suporte do navegador
      if (!window.AudioContext && !(window as any).webkitAudioContext) {
        console.log('Web Audio API não suportado, usando fallback');
        this.isInitialized = true; // Marcar como inicializado para usar fallback
        return true;
      }

      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.audioContext.destination);

      // Resumir contexto se necessário
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.isInitialized = true;
      console.log('🎵 Áudio TEA inicializado com sucesso');
      return true;
    } catch (error) {
      console.log('Erro no Web Audio, usando fallback simples:', error);
      this.isInitialized = true; // Usar fallback
      return true;
    } finally {
      this.initializationPromise = null;
    }
  }

  setCalmMode(enabled: boolean): void {
    this.isCalmMode = enabled;
    this.updateVolume();
  }

  private updateVolume(): void {
    if (this.masterGain) {
      const finalVolume = this.isCalmMode ? this.volume * 0.6 : this.volume;
      this.masterGain.gain.setValueAtTime(finalVolume, this.audioContext?.currentTime || 0);
    }
  }

  async playAnimalSound(animalId: string, frequency: number, duration: number = 0.6): Promise<void> {
    try {
      const initialized = await this.initialize();
      if (!initialized) return;

      // Se Web Audio não funcionar, usar fallback simples
      if (!this.audioContext || !this.masterGain) {
        this.playFallbackSound(frequency);
        return;
      }

      await this.createAnimalSound(animalId, frequency, duration);
    } catch (error) {
      console.log(`Usando fallback para som do animal ${animalId}`);
      this.playFallbackSound(frequency);
    }
  }

  private playFallbackSound(frequency: number): void {
    // Fallback simples usando oscilador básico
    try {
      if (!this.audioContext) return;
      
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.frequency.value = frequency;
      osc.type = 'sine';
      
      gain.gain.value = 0.1;
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      osc.start();
      osc.stop(this.audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Fallback também falhou, continuando silenciosamente');
    }
  }

  private async createAnimalSound(animalId: string, frequency: number, duration: number): Promise<void> {
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    
    try {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      // Sons específicos por animal
      switch (animalId) {
        case 'cat-piano':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(frequency, now);
          break;
        case 'dog-drums':
          osc.type = 'square';
          osc.frequency.setValueAtTime(frequency * 0.5, now);
          break;
        case 'rabbit-flute':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(frequency, now);
          break;
        case 'bird-singer':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(frequency, now);
          osc.frequency.linearRampToValueAtTime(frequency * 1.2, now + duration * 0.5);
          break;
        default:
          osc.type = 'sine';
          osc.frequency.setValueAtTime(frequency, now);
      }
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch (error) {
      console.log('Erro ao criar som específico:', error);
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(0.6, volume));
    this.updateVolume();
  }

  getVolume(): number {
    return this.volume;
  }

  getCalmMode(): boolean {
    return this.isCalmMode;
  }

  getInitialized(): boolean {
    return this.isInitialized;
  }

  cleanup(): void {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    this.audioContext = null;
    this.masterGain = null;
    this.isInitialized = false;
  }
}

export const teaAudio = new TEAAudioService();
