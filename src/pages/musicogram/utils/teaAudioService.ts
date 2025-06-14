
// Sistema de áudio robusto e adaptado para crianças TEA
class TEAAudioService {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isInitialized = false;
  private isCalmMode = false;
  private volume = 0.4;
  private soundCache = new Map<string, AudioBuffer>();
  private initializationPromise: Promise<boolean> | null = null;

  async initialize(): Promise<boolean> {
    // Evitar múltiplas inicializações simultâneas
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
        console.warn('Web Audio API não suportado');
        return false;
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
      console.error('❌ Erro ao inicializar áudio TEA:', error);
      this.isInitialized = false;
      return false;
    } finally {
      this.initializationPromise = null;
    }
  }

  // Método público para garantir que o áudio está inicializado
  async ensureInitialized(): Promise<boolean> {
    if (!this.isInitialized) {
      return await this.initialize();
    }
    return true;
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
      const initialized = await this.ensureInitialized();
      if (!initialized || !this.audioContext || !this.masterGain) {
        console.warn('Áudio não disponível, usando fallback silencioso');
        return;
      }

      await this.createAnimalSound(animalId, frequency, duration);
    } catch (error) {
      console.warn(`Erro ao tocar som do animal ${animalId}:`, error);
      // Fallback silencioso - não quebra a experiência
    }
  }

  private async createAnimalSound(animalId: string, frequency: number, duration: number): Promise<void> {
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    
    try {
      switch (animalId) {
        case 'cat-piano':
          await this.createCatPiano(frequency, duration, now);
          break;
        case 'dog-drums':
          await this.createDogDrums(frequency, duration, now);
          break;
        case 'rabbit-flute':
          await this.createRabbitFlute(frequency, duration, now);
          break;
        case 'bird-singer':
          await this.createBirdSinger(frequency, duration, now);
          break;
        case 'elephant-trumpet':
          await this.createElephantTrumpet(frequency, duration, now);
          break;
        case 'frog-bell':
          await this.createFrogBell(frequency, duration, now);
          break;
        case 'bear-guitar':
          await this.createBearGuitar(frequency, duration, now);
          break;
        case 'monkey-maracas':
          await this.createMonkeyMaracas(frequency, duration, now);
          break;
        default:
          await this.createGenericAnimalSound(frequency, duration, now);
      }
    } catch (error) {
      console.warn('Erro ao criar som específico, usando som genérico', error);
      await this.createGenericAnimalSound(frequency, duration, now);
    }
  }

  private async createCatPiano(frequency: number, duration: number, now: number): Promise<void> {
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    osc.stop(now + duration);
  }

  private async createDogDrums(frequency: number, duration: number, now: number): Promise<void> {
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(frequency * 0.5, now);
    
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    osc.connect(gain);
    gain.connect(this.masterGain!);
    
    osc.start(now);
    osc.stop(now + 0.3);
  }

  private async createRabbitFlute(frequency: number, duration: number, now: number): Promise<void> {
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.1);
    gain.gain.linearRampToValueAtTime(0.2, now + duration - 0.1);
    gain.gain.linearRampToValueAtTime(0, now + duration);
    
    osc.connect(gain);
    gain.connect(this.masterGain!);
    
    osc.start(now);
    osc.stop(now + duration);
  }

  private async createBirdSinger(frequency: number, duration: number, now: number): Promise<void> {
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);
    osc.frequency.linearRampToValueAtTime(frequency * 1.2, now + duration * 0.5);
    osc.frequency.linearRampToValueAtTime(frequency, now + duration);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    osc.connect(gain);
    gain.connect(this.masterGain!);
    
    osc.start(now);
    osc.stop(now + duration);
  }

  private async createElephantTrumpet(frequency: number, duration: number, now: number): Promise<void> {
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(frequency * 0.7, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    osc.connect(gain);
    gain.connect(this.masterGain!);
    
    osc.start(now);
    osc.stop(now + duration);
  }

  private async createFrogBell(frequency: number, duration: number, now: number): Promise<void> {
    const osc1 = this.audioContext!.createOscillator();
    const osc2 = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(frequency, now);
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 1.5, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain!);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  private async createBearGuitar(frequency: number, duration: number, now: number): Promise<void> {
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(frequency, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    osc.connect(gain);
    gain.connect(this.masterGain!);
    
    osc.start(now);
    osc.stop(now + duration);
  }

  private async createMonkeyMaracas(frequency: number, duration: number, now: number): Promise<void> {
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(frequency * 2, now);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    
    osc.connect(gain);
    gain.connect(this.masterGain!);
    
    osc.start(now);
    osc.stop(now + 0.2);
  }

  private async createGenericAnimalSound(frequency: number, duration: number, now: number): Promise<void> {
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    osc.connect(gain);
    gain.connect(this.masterGain!);
    
    osc.start(now);
    osc.stop(now + duration);
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

  // Método para cleanup quando necessário
  cleanup(): void {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    this.audioContext = null;
    this.masterGain = null;
    this.isInitialized = false;
    this.soundCache.clear();
  }
}

export const teaAudio = new TEAAudioService();
