
// Utilitário para síntese de áudio procedural
export class AudioSynthesis {
  private audioContext: AudioContext | null = null;

  constructor() {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
    } catch (error) {
      console.error('❌ Erro ao inicializar contexto de áudio:', error);
    }
  }

  // Gerar um tom simples para demonstração
  generateTone(frequency: number, duration: number, type: OscillatorType = 'sine'): Promise<AudioBuffer> {
    return new Promise((resolve, reject) => {
      if (!this.audioContext) {
        reject(new Error('Contexto de áudio não disponível'));
        return;
      }

      const sampleRate = this.audioContext.sampleRate;
      const length = sampleRate * duration;
      const buffer = this.audioContext.createBuffer(1, length, sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        let value = 0;
        
        switch (type) {
          case 'sine':
            value = Math.sin(2 * Math.PI * frequency * t);
            break;
          case 'square':
            value = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
            break;
          case 'triangle':
            value = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * t));
            break;
          default:
            value = Math.sin(2 * Math.PI * frequency * t);
        }
        
        // Aplicar envelope para evitar cliques
        const envelope = Math.min(1, Math.min(t * 10, (duration - t) * 10));
        data[i] = value * envelope * 0.3; // Volume reduzido
      }

      resolve(buffer);
    });
  }

  // Criar uma melodia simples para uma música demo
  async generateSimpleMelody(title: string): Promise<string> {
    if (!this.audioContext) {
      throw new Error('Contexto de áudio não disponível');
    }

    try {
      // Frequências das notas musicais (escala de C maior)
      const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88]; // C, D, E, F, G, A, B
      
      // Padrões simples baseados no título
      let pattern: number[] = [];
      
      if (title.toLowerCase().includes('twinkle') || title.toLowerCase().includes('brilha')) {
        pattern = [0, 0, 4, 4, 5, 5, 4]; // Twinkle Twinkle
      } else if (title.toLowerCase().includes('happy') || title.toLowerCase().includes('parabéns')) {
        pattern = [0, 0, 1, 0, 3, 2]; // Happy Birthday
      } else {
        // Padrão padrão simples
        pattern = [0, 2, 4, 2, 0, 4, 2];
      }

      // Criar buffer combinado
      const noteDuration = 0.5;
      const totalDuration = pattern.length * noteDuration;
      const sampleRate = this.audioContext.sampleRate;
      const length = sampleRate * totalDuration;
      const buffer = this.audioContext.createBuffer(1, length, sampleRate);
      const data = buffer.getChannelData(0);

      // Gerar cada nota da melodia
      for (let noteIndex = 0; noteIndex < pattern.length; noteIndex++) {
        const frequency = notes[pattern[noteIndex]];
        const startSample = Math.floor(noteIndex * noteDuration * sampleRate);
        const endSample = Math.floor((noteIndex + 1) * noteDuration * sampleRate);

        for (let i = startSample; i < endSample && i < length; i++) {
          const t = (i - startSample) / sampleRate;
          const envelope = Math.min(1, Math.min(t * 5, (noteDuration - t) * 5));
          data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.2;
        }
      }

      // Converter para blob URL
      const audioBuffer = buffer;
      const wav = this.bufferToWav(audioBuffer);
      const blob = new Blob([wav], { type: 'audio/wav' });
      return URL.createObjectURL(blob);

    } catch (error) {
      console.error('❌ Erro ao gerar melodia:', error);
      throw error;
    }
  }

  // Converter AudioBuffer para WAV
  private bufferToWav(buffer: AudioBuffer): ArrayBuffer {
    const length = buffer.length;
    const result = new ArrayBuffer(44 + length * 2);
    const view = new DataView(result);
    const channels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);

    // Convert samples
    const channelData = buffer.getChannelData(0);
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }

    return result;
  }

  dispose() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
