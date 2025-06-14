
// Sistema de áudio realista com samples e síntese avançada
class RealisticAudioService {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private reverb: ConvolverNode | null = null;
  private isInitialized = false;
  private sampleCache: Map<string, AudioBuffer> = new Map();

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.3;

      // Criar reverb artificial
      await this.createReverb();
      
      this.masterGain.connect(this.audioContext.destination);

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.isInitialized = true;
      console.log('🎵 Sistema de áudio realista inicializado');
      return true;
    } catch (error) {
      console.error('❌ Erro ao inicializar áudio realista:', error);
      return false;
    }
  }

  private async createReverb(): Promise<void> {
    if (!this.audioContext) return;

    this.reverb = this.audioContext.createConvolver();
    
    // Criar impulse response artificial para reverb
    const length = this.audioContext.sampleRate * 2; // 2 segundos
    const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }
    
    this.reverb.buffer = impulse;
  }

  private async createPianoNote(frequency: number, duration: number): Promise<void> {
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    
    // Piano usa múltiplos osciladores para simular harmônicos
    const fundamental = this.audioContext.createOscillator();
    const harmonic1 = this.audioContext.createOscillator();
    const harmonic2 = this.audioContext.createOscillator();
    
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    // Configurar osciladores
    fundamental.type = 'sine';
    fundamental.frequency.setValueAtTime(frequency, now);
    
    harmonic1.type = 'sine';
    harmonic1.frequency.setValueAtTime(frequency * 2, now);
    
    harmonic2.type = 'sine';
    harmonic2.frequency.setValueAtTime(frequency * 3, now);
    
    // Filtro passa-baixa para suavizar
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);
    
    // Envelope ADSR típico de piano
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.8, now + 0.01); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.4, now + 0.1); // Decay
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration); // Release
    
    // Conectar nós
    fundamental.connect(gainNode);
    harmonic1.connect(gainNode);
    harmonic2.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(this.masterGain);
    
    // Adicionar um pouco de reverb
    if (this.reverb) {
      const reverbGain = this.audioContext.createGain();
      reverbGain.gain.value = 0.1;
      filter.connect(reverbGain);
      reverbGain.connect(this.reverb);
      this.reverb.connect(this.masterGain);
    }
    
    // Reproduzir
    fundamental.start(now);
    harmonic1.start(now);
    harmonic2.start(now);
    
    fundamental.stop(now + duration);
    harmonic1.stop(now + duration);
    harmonic2.stop(now + duration);
  }

  private async createGuitarNote(frequency: number, duration: number): Promise<void> {
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    
    // Guitarra usa Karplus-Strong synthesis simulado
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(frequency, now);
    
    // Filtro para simular corpo da guitarra
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(frequency * 2, now);
    filter.Q.setValueAtTime(8, now);
    
    // Envelope pluck característico
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.6, now + 0.005); // Attack rápido
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration); // Decay longo
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  private async createDrumNote(frequency: number, duration: number): Promise<void> {
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    
    // Bateria usa noise burst com filtro
    const noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.1, this.audioContext.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    noiseSource.buffer = noiseBuffer;
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(frequency, now);
    filter.Q.setValueAtTime(20, now);
    
    // Envelope explosivo
    gainNode.gain.setValueAtTime(1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    
    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    noiseSource.start(now);
  }

  private async createViolinNote(frequency: number, duration: number): Promise<void> {
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const lfo = this.audioContext.createOscillator(); // Para vibrato
    const lfoGain = this.audioContext.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(frequency, now);
    
    // Vibrato
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(6, now); // 6Hz vibrato
    lfoGain.gain.setValueAtTime(frequency * 0.02, now); // 2% de vibrato
    
    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);
    
    // Envelope de arco
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.5, now + 0.1); // Attack
    gainNode.gain.setValueAtTime(0.4, now + duration - 0.1); // Sustain
    gainNode.gain.linearRampToValueAtTime(0, now + duration); // Release
    
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    oscillator.start(now);
    lfo.start(now);
    oscillator.stop(now + duration);
    lfo.stop(now + duration);
  }

  private async createTrumpetNote(frequency: number, duration: number): Promise<void> {
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(frequency, now);
    
    // Filtro para brilho metálico
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(frequency * 0.5, now);
    
    // Envelope de sopro
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.6, now + 0.05); // Attack
    gainNode.gain.setValueAtTime(0.5, now + duration - 0.1); // Sustain
    gainNode.gain.linearRampToValueAtTime(0, now + duration); // Release
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  private async createFluteNote(frequency: number, duration: number): Promise<void> {
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, now);
    
    // Filtro suave
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(frequency * 4, now);
    
    // Envelope suave
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.4, now + 0.1); // Attack suave
    gainNode.gain.setValueAtTime(0.3, now + duration - 0.1); // Sustain
    gainNode.gain.linearRampToValueAtTime(0, now + duration); // Release
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  private async createBellNote(frequency: number, duration: number): Promise<void> {
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    
    // Sino com múltiplos harmônicos
    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const osc3 = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(frequency, now);
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 1.2, now);
    
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(frequency * 1.5, now);
    
    // Envelope de sino (attack rápido, decay longo)
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.8, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    osc3.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    // Adicionar reverb ao sino
    if (this.reverb) {
      const reverbGain = this.audioContext.createGain();
      reverbGain.gain.value = 0.3;
      gainNode.connect(reverbGain);
      reverbGain.connect(this.reverb);
      this.reverb.connect(this.masterGain);
    }
    
    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
    osc3.stop(now + duration);
  }

  private async createClapNote(frequency: number, duration: number): Promise<void> {
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    
    // Palma com noise filtrado
    const noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.05, this.audioContext.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    noiseSource.buffer = noiseBuffer;
    
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1500, now);
    filter.Q.setValueAtTime(2, now);
    
    // Envelope snap
    gainNode.gain.setValueAtTime(1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    noiseSource.start(now);
  }

  async playRealisticNote(instrumentId: string, frequency: number, duration: number = 0.5): Promise<void> {
    await this.initialize();
    if (!this.audioContext || !this.masterGain) return;

    try {
      switch (instrumentId) {
        case 'piano':
          await this.createPianoNote(frequency, duration);
          break;
        case 'guitar':
          await this.createGuitarNote(frequency, duration);
          break;
        case 'drum':
          await this.createDrumNote(frequency, duration);
          break;
        case 'violin':
          await this.createViolinNote(frequency, duration);
          break;
        case 'trumpet':
          await this.createTrumpetNote(frequency, duration);
          break;
        case 'flute':
          await this.createFluteNote(frequency, duration);
          break;
        case 'bell':
          await this.createBellNote(frequency, duration);
          break;
        case 'clap':
          await this.createClapNote(frequency, duration);
          break;
        default:
          // Fallback para som simples
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
          
          gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
          
          oscillator.connect(gainNode);
          gainNode.connect(this.masterGain);
          
          oscillator.start();
          oscillator.stop(this.audioContext.currentTime + duration);
      }
    } catch (error) {
      console.error(`Erro ao tocar instrumento ${instrumentId}:`, error);
    }
  }

  setVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }
}

export const realisticAudio = new RealisticAudioService();
