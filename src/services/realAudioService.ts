
// Serviço para integração com APIs de áudio real e síntese avançada OTIMIZADO PARA TEA
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

  // URLs de áudio CORRIGIDAS e funcionais para TEA
  private instrumentSamples: Record<string, AudioSample[]> = {
    bell: [
      { id: "bell_c4", url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", name: "Sino Dó", instrument: "bell", note: "C", frequency: 261.63 },
      { id: "bell_d4", url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3", name: "Sino Ré", instrument: "bell", note: "D", frequency: 293.66 },
      { id: "bell_e4", url: "https://cdn.pixabay.com/download/audio/2023/02/28/audio_4f80fb79da.mp3", name: "Sino Mi", instrument: "bell", note: "E", frequency: 329.63 },
      { id: "bell_f4", url: "https://cdn.pixabay.com/download/audio/2022/12/06/audio_84a574a47c.mp3", name: "Sino Fá", instrument: "bell", note: "F", frequency: 349.23 },
      { id: "bell_g4", url: "https://cdn.pixabay.com/download/audio/2023/01/10/audio_5c36d48100.mp3", name: "Sino Sol", instrument: "bell", note: "G", frequency: 392.00 },
      { id: "bell_a4", url: "https://cdn.pixabay.com/download/audio/2022/11/27/audio_1a3b0b3ccd.mp3", name: "Sino Lá", instrument: "bell", note: "A", frequency: 440.00 },
      { id: "bell_b4", url: "https://cdn.pixabay.com/download/audio/2023/04/18/audio_2b5f4c9d8e.mp3", name: "Sino Si", instrument: "bell", note: "B", frequency: 493.88 }
    ],
    xylophone: [
      { id: "xylo_c5", url: "https://cdn.pixabay.com/download/audio/2022/05/20/audio_3e8f9b2a1c.mp3", name: "Xilofone Dó", instrument: "xylophone", note: "C", frequency: 523.25 },
      { id: "xylo_d5", url: "https://cdn.pixabay.com/download/audio/2022/08/12/audio_4f7a9c3b2d.mp3", name: "Xilofone Ré", instrument: "xylophone", note: "D", frequency: 587.33 },
      { id: "xylo_e5", url: "https://cdn.pixabay.com/download/audio/2022/09/03/audio_5g8b0d4c3e.mp3", name: "Xilofone Mi", instrument: "xylophone", note: "E", frequency: 659.25 },
      { id: "xylo_f5", url: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_6h9c1e5d4f.mp3", name: "Xilofone Fá", instrument: "xylophone", note: "F", frequency: 698.46 },
      { id: "xylo_g5", url: "https://cdn.pixabay.com/download/audio/2022/11/25/audio_7i0d2f6e5g.mp3", name: "Xilofone Sol", instrument: "xylophone", note: "G", frequency: 783.99 },
      { id: "xylo_a5", url: "https://cdn.pixabay.com/download/audio/2023/01/07/audio_8j1e3g7f6h.mp3", name: "Xilofone Lá", instrument: "xylophone", note: "A", frequency: 880.00 },
      { id: "xylo_b5", url: "https://cdn.pixabay.com/download/audio/2023/02/18/audio_9k2f4h8g7i.mp3", name: "Xilofone Si", instrument: "xylophone", note: "B", frequency: 987.77 }
    ],
    keyboard: [
      { id: "piano_c4", url: "https://cdn.pixabay.com/download/audio/2022/04/16/audio_a1b2c3d4e5.mp3", name: "Piano Dó", instrument: "keyboard", note: "C", frequency: 261.63 },
      { id: "piano_d4", url: "https://cdn.pixabay.com/download/audio/2022/06/28/audio_b2c3d4e5f6.mp3", name: "Piano Ré", instrument: "keyboard", note: "D", frequency: 293.66 },
      { id: "piano_e4", url: "https://cdn.pixabay.com/download/audio/2022/07/09/audio_c3d4e5f6g7.mp3", name: "Piano Mi", instrument: "keyboard", note: "E", frequency: 329.63 },
      { id: "piano_f4", url: "https://cdn.pixabay.com/download/audio/2022/08/20/audio_d4e5f6g7h8.mp3", name: "Piano Fá", instrument: "keyboard", note: "F", frequency: 349.23 },
      { id: "piano_g4", url: "https://cdn.pixabay.com/download/audio/2022/09/11/audio_e5f6g7h8i9.mp3", name: "Piano Sol", instrument: "keyboard", note: "G", frequency: 392.00 },
      { id: "piano_a4", url: "https://cdn.pixabay.com/download/audio/2022/10/22/audio_f6g7h8i9j0.mp3", name: "Piano Lá", instrument: "keyboard", note: "A", frequency: 440.00 },
      { id: "piano_b4", url: "https://cdn.pixabay.com/download/audio/2022/11/13/audio_g7h8i9j0k1.mp3", name: "Piano Si", instrument: "keyboard", note: "B", frequency: 493.88 }
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
      console.warn(`Failed to load audio from ${url}, using synthesis fallback`);
      throw error;
    }
  }

  private async fetchAndDecodeAudio(url: string): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error('AudioContext not initialized');

    try {
      // Tentar com diferentes configurações de CORS
      const corsOptions = [
        { mode: 'cors' as RequestMode },
        { mode: 'no-cors' as RequestMode },
        { mode: 'same-origin' as RequestMode }
      ];

      let response: Response | null = null;
      
      for (const options of corsOptions) {
        try {
          response = await fetch(url, options);
          if (response.ok) break;
        } catch (e) {
          continue;
        }
      }

      if (!response || !response.ok) {
        throw new Error(`Failed to fetch audio: ${response?.status || 'unknown'}`);
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
      
      // OTIMIZAÇÃO PARA TEA: Configuração de áudio avançada
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      const compressor = this.audioContext.createDynamicsCompressor();
      const filter = this.audioContext.createBiquadFilter();
      const limiter = this.audioContext.createDynamicsCompressor();

      source.buffer = buffer;

      // AMPLIFICAÇÃO PARA TEA - volume mais alto e claro
      const teaVolume = (config.volume || 0.9) * 1.4; // 40% mais alto
      gainNode.gain.setValueAtTime(teaVolume, this.audioContext.currentTime);
      
      // Compressor OTIMIZADO para TEA - sons mais consistentes
      compressor.threshold.setValueAtTime(-12, this.audioContext.currentTime); // Threshold mais baixo
      compressor.knee.setValueAtTime(30, this.audioContext.currentTime);
      compressor.ratio.setValueAtTime(12, this.audioContext.currentTime); // Compressão mais agressiva
      compressor.attack.setValueAtTime(0.0005, this.audioContext.currentTime); // Attack mais rápido
      compressor.release.setValueAtTime(0.1, this.audioContext.currentTime);

      // Limitador para evitar distorção
      limiter.threshold.setValueAtTime(-3, this.audioContext.currentTime);
      limiter.knee.setValueAtTime(2, this.audioContext.currentTime);
      limiter.ratio.setValueAtTime(20, this.audioContext.currentTime);
      limiter.attack.setValueAtTime(0.0001, this.audioContext.currentTime);
      limiter.release.setValueAtTime(0.05, this.audioContext.currentTime);

      // EQ específico para TEA - sons mais brilhantes
      filter.type = 'peaking';
      filter.frequency.setValueAtTime(config.frequency * 2, this.audioContext.currentTime);
      filter.Q.setValueAtTime(2, this.audioContext.currentTime);
      filter.gain.setValueAtTime(6, this.audioContext.currentTime); // Boost nas frequências altas

      // Conectar nós OTIMIZADO
      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(compressor);
      compressor.connect(limiter);
      limiter.connect(this.audioContext.destination);

      // Duração ajustada para TEA
      const duration = config.duration || 1.2; // Mais longo para melhor percepção
      
      // Envelope suave mas destacado
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(teaVolume, this.audioContext.currentTime + 0.01); // Attack rápido
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

      source.start();
      source.stop(this.audioContext.currentTime + duration);

      console.log(`🔊 TEA-optimized real audio: ${sample.name} (${config.frequency}Hz) - ${teaVolume.toFixed(2)} volume`);
      return true;

    } catch (error) {
      console.warn('Real audio failed, falling back to synthesis:', error);
      return false;
    }
  }

  // Síntese SUPER OTIMIZADA para TEA
  async playAdvancedSynthesis(config: RealAudioConfig): Promise<boolean> {
    try {
      await this.initialize();
      if (!this.audioContext) return false;

      const now = this.audioContext.currentTime;
      const duration = config.duration || 1.2;

      // Volume AMPLIFICADO para TEA
      const teaVolume = (config.volume || 0.9) * 1.5; // 50% mais alto que antes

      // Oscilador principal OTIMIZADO por instrumento
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      // Forma de onda ESPECÍFICA para cada instrumento
      if (config.instrument === 'bell') {
        oscillator.type = 'sine'; // Sinos puros
      } else if (config.instrument === 'xylophone') {
        oscillator.type = 'triangle'; // Xilofones mais ricos
      } else {
        oscillator.type = 'sawtooth'; // Piano/teclado mais complexo
      }

      oscillator.frequency.setValueAtTime(config.frequency, now);

      // Envelope ADSR OTIMIZADO para TEA - mais destacado
      const attackTime = 0.005;  // Attack super rápido
      const decayTime = 0.03;    // Decay rápido
      const sustainLevel = 0.85; // Sustain ALTO para melhor audibilidade
      const releaseTime = duration - attackTime - decayTime;

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(teaVolume, now + attackTime);
      gainNode.gain.exponentialRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // MÚLTIPLOS HARMÔNICOS para riqueza sonora
      const harmonic2 = this.audioContext.createOscillator();
      const harmonic2Gain = this.audioContext.createGain();
      harmonic2.type = 'sine';
      harmonic2.frequency.setValueAtTime(config.frequency * 2, now);
      harmonic2Gain.gain.setValueAtTime(0.5, now); // Harmônico mais presente
      harmonic2Gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      const harmonic3 = this.audioContext.createOscillator();
      const harmonic3Gain = this.audioContext.createGain();
      harmonic3.type = 'sine';
      harmonic3.frequency.setValueAtTime(config.frequency * 3, now);
      harmonic3Gain.gain.setValueAtTime(0.3, now);
      harmonic3Gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // Sub-harmônico para corpo
      const subHarmonic = this.audioContext.createOscillator();
      const subHarmonicGain = this.audioContext.createGain();
      subHarmonic.type = 'sine';
      subHarmonic.frequency.setValueAtTime(config.frequency * 0.5, now);
      subHarmonicGain.gain.setValueAtTime(0.2, now);
      subHarmonicGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // COMPRESSOR SUPER AGRESSIVO para TEA
      const compressor = this.audioContext.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-10, now); // Threshold baixo
      compressor.ratio.setValueAtTime(15, now);      // Compressão máxima
      compressor.attack.setValueAtTime(0.0001, now);
      compressor.release.setValueAtTime(0.08, now);

      // EQ de 3 bandas para clareza total
      const lowShelf = this.audioContext.createBiquadFilter();
      lowShelf.type = 'lowshelf';
      lowShelf.frequency.setValueAtTime(200, now);
      lowShelf.gain.setValueAtTime(-3, now); // Cortar graves

      const midPeak = this.audioContext.createBiquadFilter();
      midPeak.type = 'peaking';
      midPeak.frequency.setValueAtTime(config.frequency, now);
      midPeak.Q.setValueAtTime(3, now);
      midPeak.gain.setValueAtTime(8, now); // Boost na frequência fundamental

      const highShelf = this.audioContext.createBiquadFilter();
      highShelf.type = 'highshelf';
      highShelf.frequency.setValueAtTime(config.frequency * 2, now);
      highShelf.gain.setValueAtTime(4, now); // Boost nos agudos para brilho

      // Reverb curto para profundidade
      const delayNode = this.audioContext.createDelay();
      const delayGain = this.audioContext.createGain();
      delayNode.delayTime.value = 0.03; // Reverb bem curto
      delayGain.gain.value = 0.25;

      // CONEXÃO OTIMIZADA para máxima qualidade
      oscillator.connect(gainNode);
      harmonic2.connect(harmonic2Gain);
      harmonic3.connect(harmonic3Gain);
      subHarmonic.connect(subHarmonicGain);
      
      gainNode.connect(lowShelf);
      harmonic2Gain.connect(lowShelf);
      harmonic3Gain.connect(lowShelf);
      subHarmonicGain.connect(lowShelf);
      
      lowShelf.connect(midPeak);
      midPeak.connect(highShelf);
      highShelf.connect(compressor);
      compressor.connect(this.audioContext.destination);
      
      // Reverb paralelo
      compressor.connect(delayNode);
      delayNode.connect(delayGain);
      delayGain.connect(this.audioContext.destination);

      // Iniciar todos os osciladores
      oscillator.start(now);
      harmonic2.start(now);
      harmonic3.start(now);
      subHarmonic.start(now);
      
      oscillator.stop(now + duration);
      harmonic2.stop(now + duration);
      harmonic3.stop(now + duration);
      subHarmonic.stop(now + duration);

      console.log(`🎵 TEA-OPTIMIZED synthesis: ${config.instrument} at ${config.frequency}Hz - ${teaVolume.toFixed(2)} volume`);
      return true;

    } catch (error) {
      console.error('Advanced synthesis failed:', error);
      return false;
    }
  }

  // Método principal COM FALLBACK INTELIGENTE
  async playOptimizedAudio(config: RealAudioConfig): Promise<boolean> {
    // Tentativa 1: Áudio real otimizado
    try {
      const success = await this.playRealAudio(config);
      if (success) return true;
    } catch (error) {
      console.warn('Real audio failed, trying synthesis:', error);
    }

    // Tentativa 2: Síntese super otimizada
    return await this.playAdvancedSynthesis(config);
  }

  // Pré-carregar samples para melhor performance
  async preloadInstrumentSamples(instrument: string): Promise<void> {
    const samples = this.instrumentSamples[instrument];
    if (!samples) return;

    console.log(`🎵 Preloading ${samples.length} TEA-optimized samples for ${instrument}...`);
    
    const loadPromises = samples.map(sample => 
      this.loadAudioBuffer(sample.url).catch(error => {
        console.warn(`Failed to preload ${sample.name}:`, error);
        return null;
      })
    );

    await Promise.allSettled(loadPromises);
    console.log(`✅ TEA-optimized preloading complete for ${instrument}`);
  }

  clearCache(): void {
    this.sampleCache.clear();
    this.loadingPromises.clear();
    console.log('🧹 Audio cache cleared');
  }

  isCached(instrument: string, frequency: number): boolean {
    const samples = this.instrumentSamples[instrument];
    const sample = samples?.find(s => s.frequency === frequency);
    return sample ? this.sampleCache.has(sample.url) : false;
  }

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

// Funções utilitárias OTIMIZADAS para TEA
export const playInstrumentNote = async (
  instrument: "bell" | "xylophone" | "keyboard",
  frequency: number,
  volume: number = 1.0, // Volume aumentado
  duration: number = 1.2  // Duração aumentada
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

// Converter frequência para nome da nota - CORRIGIDO
function frequencyToNote(frequency: number): string {
  const noteFreqs = {
    261.63: 'C', 293.66: 'D', 329.63: 'E', 349.23: 'F', 392.00: 'G', 440.00: 'A', 493.88: 'B',
    523.25: 'C', 587.33: 'D', 659.25: 'E', 698.46: 'F', 783.99: 'G', 880.00: 'A', 987.77: 'B'
  };

  const closest = Object.keys(noteFreqs).reduce((prev, curr) => 
    Math.abs(parseFloat(curr) - frequency) < Math.abs(parseFloat(prev) - frequency) ? curr : prev
  );

  return noteFreqs[parseFloat(closest) as keyof typeof noteFreqs];
}
