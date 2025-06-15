
// Utilitário para síntese de áudio procedural melhorado
export class AudioSynthesis {
  private audioContext: AudioContext | null = null;
  private audioCache: Map<string, string> = new Map();

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

  // Padrões musicais por gênero - COMPOSIÇÕES ORIGINAIS
  private getOriginalMelodyPattern(title: string, genre: string): { notes: number[], rhythm: number[], tempo: number } {
    // Frequências das notas (C4 = 261.63Hz como base)
    const notes = {
      C: 261.63, D: 293.66, E: 329.63, F: 349.23, G: 392.00, A: 440.00, B: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99
    };

    // Padrões originais baseados em gênero musical
    switch (genre) {
      case 'infantil':
        // Padrão alegre e simples para crianças
        return {
          notes: [notes.C, notes.E, notes.G, notes.E, notes.C, notes.G, notes.F, notes.E, notes.D, notes.C],
          rhythm: [0.5, 0.5, 0.5, 0.5, 0.75, 0.25, 0.5, 0.5, 0.5, 1.0],
          tempo: 100
        };
      
      case 'mpb':
        // Padrão sofisticado estilo MPB
        return {
          notes: [notes.F, notes.A, notes.C5, notes.A, notes.G, notes.F, notes.E, notes.D, notes.F, notes.G],
          rhythm: [0.75, 0.25, 0.5, 0.5, 0.75, 0.25, 0.5, 0.5, 0.75, 1.25],
          tempo: 95
        };
      
      case 'bossa nova':
        // Padrão suave estilo bossa nova
        return {
          notes: [notes.A, notes.G, notes.F, notes.E, notes.D, notes.E, notes.F, notes.G, notes.A],
          rhythm: [0.67, 0.33, 0.5, 0.5, 0.5, 0.5, 0.67, 0.33, 1.0],
          tempo: 120
        };
      
      case 'rock':
        // Padrão energético de rock
        return {
          notes: [notes.E, notes.G, notes.A, notes.C5, notes.A, notes.G, notes.E, notes.D, notes.E],
          rhythm: [0.5, 0.25, 0.25, 0.5, 0.25, 0.25, 0.5, 0.5, 1.0],
          tempo: 130
        };
      
      case 'forró':
        // Padrão rítmico de forró
        return {
          notes: [notes.D, notes.F, notes.A, notes.F, notes.D, notes.G, notes.F, notes.E, notes.D],
          rhythm: [0.33, 0.33, 0.34, 0.33, 0.33, 0.34, 0.5, 0.5, 1.0],
          tempo: 115
        };
      
      case 'sertanejo':
        // Padrão country brasileiro
        return {
          notes: [notes.G, notes.B, notes.D5, notes.B, notes.G, notes.A, notes.G, notes.F, notes.G],
          rhythm: [0.5, 0.5, 0.75, 0.25, 0.5, 0.5, 0.5, 0.5, 1.0],
          tempo: 90
        };
      
      case 'samba':
        // Padrão sincopado de samba
        return {
          notes: [notes.C, notes.E, notes.G, notes.A, notes.G, notes.E, notes.C, notes.D, notes.C],
          rhythm: [0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.5, 0.5, 1.0],
          tempo: 100
        };
      
      case 'romântica':
        // Padrão suave e romântico
        return {
          notes: [notes.F, notes.A, notes.C5, notes.D5, notes.C5, notes.A, notes.F, notes.G, notes.F],
          rhythm: [1.0, 0.5, 0.5, 1.0, 0.5, 0.5, 0.75, 0.25, 1.5],
          tempo: 75
        };
      
      default:
        // Padrão genérico
        return {
          notes: [notes.C, notes.E, notes.G, notes.E, notes.C, notes.G, notes.E, notes.C],
          rhythm: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1.0],
          tempo: 120
        };
    }
  }

  // Criar uma melodia original baseada em gênero
  async generateOriginalMelody(title: string, genre: string, duration: number = 30): Promise<string> {
    if (!this.audioContext) {
      throw new Error('Contexto de áudio não disponível');
    }

    // Verificar cache primeiro
    const cacheKey = `${title}-${genre}-${duration}`;
    if (this.audioCache.has(cacheKey)) {
      console.log(`🎵 Usando melodia original em cache para: ${title}`);
      return this.audioCache.get(cacheKey)!;
    }

    try {
      const pattern = this.getOriginalMelodyPattern(title, genre);
      const { notes, rhythm, tempo } = pattern;
      
      // Calcular duração baseada no tempo
      const beatDuration = 60 / tempo; // duração de uma batida em segundos
      const patternDuration = rhythm.reduce((sum, beat) => sum + beat, 0) * beatDuration;
      const repetitions = Math.ceil(duration / patternDuration);
      
      const sampleRate = this.audioContext.sampleRate;
      const totalSamples = Math.floor(sampleRate * duration);
      const buffer = this.audioContext.createBuffer(2, totalSamples, sampleRate); // Stereo
      const leftChannel = buffer.getChannelData(0);
      const rightChannel = buffer.getChannelData(1);

      let currentTime = 0;
      let sampleIndex = 0;

      // Gerar repetições da melodia
      for (let rep = 0; rep < repetitions && currentTime < duration; rep++) {
        for (let i = 0; i < notes.length && currentTime < duration; i++) {
          const frequency = notes[i];
          const noteDuration = Math.min(rhythm[i] * beatDuration, duration - currentTime);
          const noteSamples = Math.floor(noteDuration * sampleRate);
          
          // Gerar a nota com envelope ADSR suavizado
          for (let s = 0; s < noteSamples && sampleIndex < totalSamples; s++, sampleIndex++) {
            const t = s / sampleRate;
            const noteProgress = s / noteSamples;
            
            // Envelope ADSR mais suave
            let envelope = 1;
            if (noteProgress < 0.1) {
              envelope = noteProgress / 0.1; // Attack
            } else if (noteProgress > 0.8) {
              envelope = (1 - noteProgress) / 0.2; // Release
            } else {
              envelope = 0.8; // Sustain
            }
            
            // Onda senoidal com harmônicos sutis baseados no gênero
            let fundamental = Math.sin(2 * Math.PI * frequency * (currentTime + t));
            let harmonic2 = 0.3 * Math.sin(2 * Math.PI * frequency * 2 * (currentTime + t));
            let harmonic3 = 0.1 * Math.sin(2 * Math.PI * frequency * 3 * (currentTime + t));
            
            // Variações por gênero
            if (genre === 'rock') {
              // Adicionar distorção sutil para rock
              fundamental = Math.tanh(fundamental * 1.5);
              harmonic2 *= 0.5;
            } else if (genre === 'forró') {
              // Adicionar um vibrato sutil para forró
              const vibrato = 1 + 0.02 * Math.sin(2 * Math.PI * 5 * (currentTime + t));
              fundamental *= vibrato;
            }
            
            const sample = (fundamental + harmonic2 + harmonic3) * envelope * 0.2;
            
            leftChannel[sampleIndex] = sample;
            rightChannel[sampleIndex] = sample * 0.9; // Ligeira diferença para stereo
          }
          
          currentTime += noteDuration;
        }
      }

      // Fade out suave no final
      const fadeOutSamples = Math.min(sampleRate * 2, totalSamples / 10); // 2 segundos ou 10% da música
      for (let i = 0; i < fadeOutSamples; i++) {
        const fadeIndex = totalSamples - fadeOutSamples + i;
        const fadeFactor = 1 - (i / fadeOutSamples);
        leftChannel[fadeIndex] *= fadeFactor;
        rightChannel[fadeIndex] *= fadeFactor;
      }

      // Converter para WAV e criar URL
      const wavArrayBuffer = this.bufferToWav(buffer);
      const blob = new Blob([wavArrayBuffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      // Adicionar ao cache
      this.audioCache.set(cacheKey, url);
      
      console.log(`🎵 Melodia original gerada: ${title} (${genre}) - ${duration}s`);
      return url;

    } catch (error) {
      console.error('❌ Erro ao gerar melodia original:', error);
      throw error;
    }
  }

  // Manter método antigo para compatibilidade
  async generateBrazilianMelody(title: string, duration: number = 30): Promise<string> {
    // Detectar gênero baseado no título para compatibilidade
    let genre = 'mpb';
    if (title.includes('Infantil') || title.includes('Criança')) genre = 'infantil';
    else if (title.includes('Rock')) genre = 'rock';
    else if (title.includes('Forró')) genre = 'forró';
    else if (title.includes('Samba')) genre = 'samba';
    
    return this.generateOriginalMelody(title, genre, duration);
  }

  // Converter AudioBuffer para WAV com melhor qualidade
  private bufferToWav(buffer: AudioBuffer): ArrayBuffer {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    // RIFF chunk descriptor
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
    writeString(8, 'WAVE');

    // FMT sub-chunk
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // SubChunk1Size (16 for PCM)
    view.setUint16(20, 1, true);  // AudioFormat (1 for PCM)
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true); // ByteRate
    view.setUint16(32, numberOfChannels * 2, true); // BlockAlign
    view.setUint16(34, 16, true); // BitsPerSample

    // Data sub-chunk
    writeString(36, 'data');
    view.setUint32(40, length * numberOfChannels * 2, true);

    // Convert samples
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return arrayBuffer;
  }

  // Limpar cache de áudio
  clearCache() {
    this.audioCache.forEach(url => URL.revokeObjectURL(url));
    this.audioCache.clear();
    console.log('🧹 Cache de áudio limpo');
  }

  dispose() {
    this.clearCache();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Instância global para reutilização
export const globalAudioSynthesis = new AudioSynthesis();
