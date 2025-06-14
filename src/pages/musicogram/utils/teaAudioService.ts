
// Sistema de áudio adaptado para crianças TEA
class TEAAudioService {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isInitialized = false;
  private isCalmMode = false;
  private volume = 0.4; // Volume mais baixo por padrão

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.audioContext.destination);

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.isInitialized = true;
      console.log('🎵 Áudio TEA inicializado');
      return true;
    } catch (error) {
      console.error('❌ Erro ao inicializar áudio TEA:', error);
      return false;
    }
  }

  setCalmMode(enabled: boolean): void {
    this.isCalmMode = enabled;
    if (enabled) {
      this.setVolume(this.volume * 0.6); // Volume ainda mais baixo no modo calmo
    } else {
      this.setVolume(this.volume);
    }
  }

  private async createAnimalSound(animalId: string, frequency: number, duration: number): Promise<void> {
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    
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
  }

  private async createCatPiano(frequency: number, duration: number, now: number): Promise<void> {
    // Piano suave com "miau" sutil
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();
    const filter = this.audioContext!.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);
    
    // Envelope suave tipo piano
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    osc.stop(now + duration);
  }

  private async createDogDrums(frequency: number, duration: number, now: number): Promise<void> {
    // Som de bateria com "au au" rítmico
    const noise = this.audioContext!.createBuffer(1, this.audioContext!.sampleRate * 0.1, this.audioContext!.sampleRate);
    const data = noise.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const source = this.audioContext!.createBufferSource();
    const gain = this.audioContext!.createGain();
    const filter = this.audioContext!.createBiquadFilter();
    
    source.buffer = noise;
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(frequency, now);
    
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    
    source.start(now);
  }

  private async createRabbitFlute(frequency: number, duration: number, now: number): Promise<void> {
    // Flauta doce e suave
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);
    
    // Envelope muito suave
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
    gain.gain.linearRampToValueAtTime(0.2, now + duration - 0.1);
    gain.gain.linearRampToValueAtTime(0, now + duration);
    
    osc.connect(gain);
    gain.connect(this.masterGain!);
    
    osc.start(now);
    osc.stop(now + duration);
  }

  private async createBirdSinger(frequency: number, duration: number, now: number): Promise<void> {
    // Canto de pássaro melodioso
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();
    const lfo = this.audioContext!.createOscillator();
    const lfoGain = this.audioContext!.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);
    
    // Vibrato suave
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(5, now);
    lfoGain.gain.setValueAtTime(frequency * 0.03, now);
    
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    osc.connect(gain);
    gain.connect(this.masterGain!);
    
    osc.start(now);
    lfo.start(now);
    osc.stop(now + duration);
    lfo.stop(now + duration);
  }

  private async createElephantTrumpet(frequency: number, duration: number, now: number): Promise<void> {
    // Trompete grave e amigável
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();
    const filter = this.audioContext!.createBiquadFilter();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(frequency, now);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(frequency * 3, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    
    osc.start(now);
    osc.stop(now + duration);
  }

  private async createFrogBell(frequency: number, duration: number, now: number): Promise<void> {
    // Sino cristalino como coaxar
    const osc1 = this.audioContext!.createOscillator();
    const osc2 = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(frequency, now);
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 1.5, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain!);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  private async createBearGuitar(frequency: number, duration: number, now: number): Promise<void> {
    // Violão caloroso
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();
    const filter = this.audioContext!.createBiquadFilter();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(frequency, now);
    
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(frequency * 2, now);
    filter.Q.setValueAtTime(5, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    
    osc.start(now);
    osc.stop(now + duration);
  }

  private async createMonkeyMaracas(frequency: number, duration: number, now: number): Promise<void> {
    // Maracas alegres
    const noise = this.audioContext!.createBuffer(1, this.audioContext!.sampleRate * 0.05, this.audioContext!.sampleRate);
    const data = noise.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    
    const source = this.audioContext!.createBufferSource();
    const gain = this.audioContext!.createGain();
    const filter = this.audioContext!.createBiquadFilter();
    
    source.buffer = noise;
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(frequency, now);
    
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    
    source.start(now);
  }

  private async createGenericAnimalSound(frequency: number, duration: number, now: number): Promise<void> {
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    osc.connect(gain);
    gain.connect(this.masterGain!);
    
    osc.start(now);
    osc.stop(now + duration);
  }

  async playAnimalSound(animalId: string, frequency: number, duration: number = 0.6): Promise<void> {
    await this.initialize();
    if (!this.audioContext || !this.masterGain) return;

    try {
      await this.createAnimalSound(animalId, frequency, duration);
    } catch (error) {
      console.error(`Erro ao tocar som do animal ${animalId}:`, error);
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(0.6, volume)); // Limita o volume máximo
    if (this.masterGain) {
      this.masterGain.gain.value = this.isCalmMode ? this.volume * 0.6 : this.volume;
    }
  }

  getVolume(): number {
    return this.volume;
  }

  getCalmMode(): boolean {
    return this.isCalmMode;
  }
}

export const teaAudio = new TEAAudioService();
