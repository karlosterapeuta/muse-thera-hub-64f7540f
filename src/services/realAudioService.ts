
// Serviço para integração com APIs de áudio real e síntese avançada
export interface AudioSample {
  id: string;
  url: string;
  name: string;
  instrument: string;
  note: string;
  frequency: number;
  cached?: boolean;
}

export interface RealAudioConfig {
  instrument: "bell" | "xylophone" | "keyboard";
  note: string;
  frequency: number;
  volume?: number;
  duration?: number;
}

class RealAudioService {
  private audioContext: AudioContext | null = null;
  private sampleCache = new Map<string, AudioBuffer>();
  private loadingPromises = new Map<string, Promise<AudioBuffer>>();

  // Samples de instrumentos reais otimizados para TEA
  private instrumentSamples: Record<string, AudioSample[]> = {
    bell: [
      { id: "bell_c4", url: "https://freesound.org/data/previews/316/316847_4939433-lq.mp3", name: "Sino Dó", instrument: "bell", note: "C", frequency: 261.63 },
      { id: "bell_d4", url: "https://freesound.org/data/previews/316/316848_4939433-lq.mp3", name: "Sino Ré", instrument: "bell", note: "D", frequency: 293.66 },
      { id: "bell_e4", url: "https://freesound.org/data/previews/316/316849_4939433-lq.mp3", name: "Sino Mi", instrument: "bell", note: "E", frequency: 329.63 },
      { id: "bell_f4", url: "https://freesound.org/data/previews/316/316850_4939433-lq.mp3", name: "Sino Fá", instrument: "bell", note: "F", frequency: 349.23 },
      { id: "bell_g4", url: "https://freesound.org/data/previews/316/316851_4939433-lq.mp3", name: "Sino Sol", instrument: "bell", note: "G", frequency: 392.00 },
      { id: "bell_a4", url: "https://freesound.org/data/previews/316/316852_4939433-lq.mp3", name: "Sino Lá", instrument: "bell", note: "A", frequency: 440.00 },
      { id: "bell_b4", url: "https://freesound.org/data/previews/316/316853_4939433-lq.mp3", name: "Sino Si", instrument: "bell", note: "B", frequency: 493.88 }
    ],
    xylophone: [
      { id: "xylo_c5", url: "https://freesound.org/data/previews/178/178204_1676145-lq.mp3", name: "Xilofone Dó", instrument: "xylophone", note: "C", frequency: 523.25 },
      { id: "xylo_d5", url: "https://freesound.org/data/previews/178/178205_1676145-lq.mp3", name: "Xilofone Ré", instrument: "xylophone", note: "D", frequency: 587.33 },
      { id: "xylo_e5", url: "https://freesound.org/data/previews/178/178206_1676145-lq.mp3", name: "Xilofone Mi", instrument: "xylophone", note: "E", frequency: 659.25 },
      { id: "xylo_f5", url: "https://freesound.org/data/previews/178/178207_1676145-lq.mp3", name: "Xilofone Fá", instrument: "xylophone", note: "F", frequency: 698.46 },
      { id: "xylo_g5", url: "https://freesound.org/data/previews/178/178208_1676145-lq.mp3", name: "Xilofone Sol", instrument: "xylophone", note: "G", frequency: 783.99 },
      { id: "xylo_a5", url: "https://freesound.org/data/previews/178/178209_1676145-lq.mp3", name: "Xilofone Lá", instrument: "xylophone", note: "A", frequency: 880.00 },
      { id: "xylo_b5", url: "https://freesound.org/data/previews/178/178210_1676145-lq.mp3", name: "Xilofone Si", instrument: "xylophone", note: "B", frequency: 987.77 }
    ],
    keyboard: [
      { id: "piano_c4", url: "https://freesound.org/data/previews/120/120041_1735162-lq.mp3", name: "Piano Dó", instrument: "keyboard", note: "C", frequency: 261.63 },
      { id: "piano_d4", url: "https://freesound.org/data/previews/120/120042_1735162-lq.mp3", name: "Piano Ré", instrument: "keyboard", note: "D", frequency: 293.66 },
      { id: "piano_e4", url: "https://freesound.org/data/previews/120/120043_1735162-lq.mp3", name: "Piano Mi", instrument: "keyboard", note: "E", frequency: 329.63 },
      { id: "piano_f4", url: "https://freesound.org/data/previews/120/120044_1735162-lq.mp3", name: "Piano Fá", instrument: "keyboard", note: "F", frequency: 349.23 },
      { id: "piano_g4", url: "https://freesound.org/data/previews/120/120045_1735162-lq.mp3", name: "Piano Sol", instrument: "keyboard", note: "G", frequency: 392.00 },
      { id: "piano_a4", url: "https://freesound.org/data/previews/120/120046_1735162-lq.mp3", name: "Piano Lá", instrument: "keyboard", note: "A", frequency: 440.00 },
      { id: "piano_b4", url: "https://freesound.org/data/previews/120/120047_1735162-lq.mp3", name: "Piano Si", instrument: "keyboard", note: "B", frequency: 493.88 }
    ]
  };

  async initialize(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  async loadAudioBuffer(url: string): Promise<AudioBuffer> {
    if (!this.audioContext) {
      await this.initialize();
    }

    // Verificar cache primeiro
    if (this.sampleCache.has(url)) {
      return this.sampleCache.get(url)!;
    }

    // Verificar se já está carregando
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url)!;
    }

    // Carregar novo sample
    const loadPromise = this.fetchAndDecodeAudio(url);
    this.loadingPromises.set(url, loadPromise);

    try {
      const buffer = await loadPromise;
      this.sampleCache.set(url, buffer);
      this.loadingPromises.delete(url);
      return buffer;
    } catch (error) {
      this.loadingPromises.delete(url);
      throw error;
    }
  }

  private async fetchAndDecodeAudio(url: string): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error('AudioContext not initialized');

    try {
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      return await this.audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.warn(`Failed to load audio from ${url}:`, error);
      throw error;
    }
  }

  async playRealAudio(config: RealAudioConfig): Promise<boolean> {
    try {
      await this.initialize();
      if (!this.audioContext) return false;

      const samples = this.instrumentSamples[config.instrument];
      const sample = samples.find(s => s.frequency === config.frequency);

      if (!sample) {
        console.warn(`Sample not found for ${config.instrument} at ${config.frequency}Hz`);
        return false;
      }

      const buffer = await this.loadAudioBuffer(sample.url);
      
      // Criar e configurar nós de áudio para TEA
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      const compressor = this.audioContext.createDynamicsCompressor();
      const filter = this.audioContext.createBiquadFilter();

      source.buffer = buffer;

      // Configuração otimizada para TEA - sons mais destacados
      gainNode.gain.setValueAtTime(config.volume || 0.9, this.audioContext.currentTime);
      
      // Compressor para sons mais consistentes e audíveis
      compressor.threshold.setValueAtTime(-18, this.audioContext.currentTime);
      compressor.knee.setValueAtTime(25, this.audioContext.currentTime);
      compressor.ratio.setValueAtTime(8, this.audioContext.currentTime);
      compressor.attack.setValueAtTime(0.001, this.audioContext.currentTime);
      compressor.release.setValueAtTime(0.2, this.audioContext.currentTime);

      // Filtro passa-alta para clareza (especialmente útil para categoria infantil)
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(100, this.audioContext.currentTime);
      filter.Q.setValueAtTime(0.5, this.audioContext.currentTime);

      // Conectar nós
      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(compressor);
      compressor.connect(this.audioContext.destination);

      // Configurar duração
      const duration = config.duration || 1.0;
      
      // Envelope para entrada e saída suaves
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(config.volume || 0.9, this.audioContext.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

      source.start();
      source.stop(this.audioContext.currentTime + duration);

      console.log(`🎵 Real audio played: ${sample.name} (${config.frequency}Hz)`);
      return true;

    } catch (error) {
      console.error('Error playing real audio:', error);
      return false;
    }
  }

  // Síntese avançada como fallback para quando samples reais não estão disponíveis
  async playAdvancedSynthesis(config: RealAudioConfig): Promise<boolean> {
    try {
      await this.initialize();
      if (!this.audioContext) return false;

      const now = this.audioContext.currentTime;
      const duration = config.duration || 1.0;

      // Oscilador principal com forma de onda otimizada para cada instrumento
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      // Configuração de forma de onda baseada no instrumento
      if (config.instrument === 'bell') {
        oscillator.type = 'sine'; // Sinos são mais senoidais
      } else if (config.instrument === 'xylophone') {
        oscillator.type = 'square'; // Xilofones têm mais harmônicos pares
      } else {
        oscillator.type = 'triangle'; // Piano/teclado é mais suave
      }

      oscillator.frequency.setValueAtTime(config.frequency, now);

      // Envelope ADSR otimizado para categoria infantil - mais destacado
      const attackTime = 0.01;
      const decayTime = 0.1;
      const sustainLevel = 0.7; // Sustain alto para melhor percepção
      const releaseTime = duration - attackTime - decayTime;

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(config.volume || 0.8, now + attackTime);
      gainNode.gain.exponentialRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // Adicionar harmônicos para sons mais ricos
      const harmonic2 = this.audioContext.createOscillator();
      const harmonic2Gain = this.audioContext.createGain();
      harmonic2.type = 'sine';
      harmonic2.frequency.setValueAtTime(config.frequency * 2, now);
      harmonic2Gain.gain.setValueAtTime(0.3, now);
      harmonic2Gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // Compressor e filtro para melhor qualidade
      const compressor = this.audioContext.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-20, now);
      compressor.ratio.setValueAtTime(6, now);

      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(config.frequency * 3, now);
      filter.Q.setValueAtTime(2, now);

      // Conectar todos os nós
      oscillator.connect(gainNode);
      harmonic2.connect(harmonic2Gain);
      
      gainNode.connect(filter);
      harmonic2Gain.connect(filter);
      
      filter.connect(compressor);
      compressor.connect(this.audioContext.destination);

      // Iniciar e parar
      oscillator.start(now);
      harmonic2.start(now);
      
      oscillator.stop(now + duration);
      harmonic2.stop(now + duration);

      console.log(`🎵 Advanced synthesis: ${config.instrument} at ${config.frequency}Hz`);
      return true;

    } catch (error) {
      console.error('Error with advanced synthesis:', error);
      return false;
    }
  }

  // Método principal que tenta real audio primeiro, depois fallback
  async playOptimizedAudio(config: RealAudioConfig): Promise<boolean> {
    // Tentar áudio real primeiro
    try {
      const success = await this.playRealAudio(config);
      if (success) return true;
    } catch (error) {
      console.warn('Real audio failed, trying synthesis:', error);
    }

    // Fallback para síntese avançada
    return await this.playAdvancedSynthesis(config);
  }

  // Pré-carregar samples para melhor performance
  async preloadInstrumentSamples(instrument: string): Promise<void> {
    const samples = this.instrumentSamples[instrument];
    if (!samples) return;

    console.log(`🎵 Preloading ${samples.length} samples for ${instrument}...`);
    
    const loadPromises = samples.map(sample => 
      this.loadAudioBuffer(sample.url).catch(error => {
        console.warn(`Failed to preload ${sample.name}:`, error);
        return null;
      })
    );

    await Promise.allSettled(loadPromises);
    console.log(`✅ Preloading complete for ${instrument}`);
  }

  // Limpar cache se necessário
  clearCache(): void {
    this.sampleCache.clear();
    this.loadingPromises.clear();
    console.log('🧹 Audio cache cleared');
  }

  // Verificar se um sample está em cache
  isCached(instrument: string, frequency: number): boolean {
    const samples = this.instrumentSamples[instrument];
    const sample = samples?.find(s => s.frequency === frequency);
    return sample ? this.sampleCache.has(sample.url) : false;
  }

  // Obter informações sobre o cache
  getCacheInfo(): { cached: number; total: number; instruments: string[] } {
    let total = 0;
    const instruments = Object.keys(this.instrumentSamples);
    
    instruments.forEach(inst => {
      total += this.instrumentSamples[inst].length;
    });

    return {
      cached: this.sampleCache.size,
      total,
      instruments
    };
  }
}

// Instância singleton
export const realAudioService = new RealAudioService();

// Funções utilitárias para fácil uso
export const playInstrumentNote = async (
  instrument: "bell" | "xylophone" | "keyboard",
  frequency: number,
  volume: number = 0.8,
  duration: number = 1.0
): Promise<boolean> => {
  return realAudioService.playOptimizedAudio({
    instrument,
    note: frequencyToNote(frequency),
    frequency,
    volume,
    duration
  });
};

export const preloadInstrument = async (instrument: string): Promise<void> => {
  return realAudioService.preloadInstrumentSamples(instrument);
};

// Converter frequência para nome da nota
function frequencyToNote(frequency: number): string {
  const noteFreqs = {
    261.63: 'C',
    293.66: 'D', 
    329.63: 'E',
    349.23: 'F',
    392.00: 'G',
    440.00: 'A',
    493.88: 'B',
    523.25: 'C',
    587.33: 'D',
    659.25: 'E',
    698.46: 'F',
    783.99: 'G',
    880.00: 'A',
    987.77: 'B'
  };

  // Encontrar a frequência mais próxima
  const closest = Object.keys(noteFreqs).reduce((prev, curr) => 
    Math.abs(parseFloat(curr) - frequency) < Math.abs(parseFloat(prev) - frequency) ? curr : prev
  );

  return noteFreqs[parseFloat(closest) as keyof typeof noteFreqs];
}
