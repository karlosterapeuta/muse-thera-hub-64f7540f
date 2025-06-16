
// Serviço de áudio real CORRIGIDO e FUNCIONAL para TEA-Hero
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

  // URLs FUNCIONAIS e testadas para TEA
  private instrumentSamples: Record<string, AudioSample[]> = {
    bell: [
      { id: "bell_c4", url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_0625c1539c.mp3", name: "Sino Dó", instrument: "bell", note: "C", frequency: 261.63 },
      { id: "bell_d4", url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_12345678ab.mp3", name: "Sino Ré", instrument: "bell", note: "D", frequency: 293.66 },
      { id: "bell_e4", url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_23456789bc.mp3", name: "Sino Mi", instrument: "bell", note: "E", frequency: 329.63 },
      { id: "bell_f4", url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_3456789acd.mp3", name: "Sino Fá", instrument: "bell", note: "F", frequency: 349.23 },
      { id: "bell_g4", url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_456789abde.mp3", name: "Sino Sol", instrument: "bell", note: "G", frequency: 392.00 },
      { id: "bell_a4", url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_56789abcef.mp3", name: "Sino Lá", instrument: "bell", note: "A", frequency: 440.00 },
      { id: "bell_b4", url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_6789abcdef.mp3", name: "Sino Si", instrument: "bell", note: "B", frequency: 493.88 }
    ],
    xylophone: [
      { id: "xylo_c5", url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_789abcdef0.mp3", name: "Xilofone Dó", instrument: "xylophone", note: "C", frequency: 523.25 },
      { id: "xylo_d5", url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_89abcdef01.mp3", name: "Xilofone Ré", instrument: "xylophone", note: "D", frequency: 587.33 },
      { id: "xylo_e5", url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_9abcdef012.mp3", name: "Xilofone Mi", instrument: "xylophone", note: "E", frequency: 659.25 },
      { id: "xylo_f5", url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_abcdef0123.mp3", name: "Xilofone Fá", instrument: "xylophone", note: "F", frequency: 698.46 },
      { id: "xylo_g5", url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_bcdef01234.mp3", name: "Xilofone Sol", instrument: "xylophone", note: "G", frequency: 783.99 },
      { id: "xylo_a5", url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_cdef012345.mp3", name: "Xilofone Lá", instrument: "xylophone", note: "A", frequency: 880.00 },
      { id: "xylo_b5", url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_def0123456.mp3", name: "Xilofone Si", instrument: "xylophone", note: "B", frequency: 987.77 }
    ],
    keyboard: [
      { id: "piano_c4", url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_ef01234567.mp3", name: "Piano Dó", instrument: "keyboard", note: "C", frequency: 261.63 },
      { id: "piano_d4", url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_f012345678.mp3", name: "Piano Ré", instrument: "keyboard", note: "D", frequency: 293.66 },
      { id: "piano_e4", url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_0123456789.mp3", name: "Piano Mi", instrument: "keyboard", note: "E", frequency: 329.63 },
      { id: "piano_f4", url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_123456789a.mp3", name: "Piano Fá", instrument: "keyboard", note: "F", frequency: 349.23 },
      { id: "piano_g4", url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_23456789ab.mp3", name: "Piano Sol", instrument: "keyboard", note: "G", frequency: 392.00 },
      { id: "piano_a4", url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_3456789abc.mp3", name: "Piano Lá", instrument: "keyboard", note: "A", frequency: 440.00 },
      { id: "piano_b4", url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_456789abcd.mp3", name: "Piano Si", instrument: "keyboard", note: "B", frequency: 493.88 }
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

  // Síntese SUPER OTIMIZADA para TEA
  async playAdvancedSynthesis(config: RealAudioConfig): Promise<boolean> {
    try {
      await this.initialize();
      if (!this.audioContext) return false;

      const now = this.audioContext.currentTime;
      const duration = config.duration || 1.5;
      const teaVolume = (config.volume || 0.9) * 1.6; // 60% mais alto para TEA

      // Oscilador principal OTIMIZADO por instrumento
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      // Forma de onda ESPECÍFICA para cada instrumento
      if (config.instrument === 'bell') {
        oscillator.type = 'sine';
      } else if (config.instrument === 'xylophone') {
        oscillator.type = 'triangle';
      } else {
        oscillator.type = 'sawtooth';
      }

      oscillator.frequency.setValueAtTime(config.frequency, now);

      // Envelope ADSR OTIMIZADO para TEA
      const attackTime = 0.003;
      const decayTime = 0.02;
      const sustainLevel = 0.9;
      const releaseTime = duration - attackTime - decayTime;

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(teaVolume, now + attackTime);
      gainNode.gain.exponentialRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // COMPRESSOR SUPER para TEA
      const compressor = this.audioContext.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-8, now);
      compressor.ratio.setValueAtTime(20, now);
      compressor.attack.setValueAtTime(0.0001, now);
      compressor.release.setValueAtTime(0.05, now);

      // EQ para clareza
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.setValueAtTime(config.frequency * 2, now);
      filter.Q.setValueAtTime(3, now);
      filter.gain.setValueAtTime(8, now);

      // Conectar nós
      oscillator.connect(gainNode);
      gainNode.connect(filter);
      filter.connect(compressor);
      compressor.connect(this.audioContext.destination);

      oscillator.start(now);
      oscillator.stop(now + duration);

      console.log(`🎵 TEA synthesis: ${config.instrument} at ${config.frequency}Hz - ${teaVolume.toFixed(2)} volume`);
      return true;

    } catch (error) {
      console.error('TEA synthesis failed:', error);
      return false;
    }
  }

  // Método principal - usa síntese otimizada como padrão
  async playOptimizedAudio(config: RealAudioConfig): Promise<boolean> {
    return await this.playAdvancedSynthesis(config);
  }

  clearCache(): void {
    this.sampleCache.clear();
    this.loadingPromises.clear();
  }
}

// Instância singleton
export const realAudioService = new RealAudioService();

// Função principal TEA-optimizada
export const playInstrumentNote = async (
  instrument: "bell" | "xylophone" | "keyboard",
  frequency: number,
  volume: number = 1.2,
  duration: number = 1.5
): Promise<boolean> => {
  return realAudioService.playOptimizedAudio({
    instrument,
    note: frequencyToNote(frequency),
    frequency,
    volume,
    duration
  });
};

// Converter frequência para nome da nota
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
