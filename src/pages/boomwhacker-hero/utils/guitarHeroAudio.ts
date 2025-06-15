
import { TraditionalSong } from '../data/traditionalSongs';

class GuitarHeroAudioManager {
  private audioContext: AudioContext | null = null;
  private currentTrack: HTMLAudioElement | null = null;
  private musicVolume: number = 0.7;
  private effectsVolume: number = 0.5;
  private isInitialized: boolean = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      this.isInitialized = true;
      console.log('🎵 Guitar Hero Audio Manager inicializado');
    } catch (error) {
      console.error('❌ Erro ao inicializar áudio:', error);
    }
  }

  async loadTrack(song: TraditionalSong): Promise<boolean> {
    try {
      if (this.currentTrack) {
        this.currentTrack.pause();
        this.currentTrack = null;
      }

      // Para demonstração, usar um áudio sintético se o arquivo não existir
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.preload = 'auto';
      audio.volume = this.musicVolume;

      // Tentar carregar arquivo real, senão usar síntese
      try {
        audio.src = song.audioFile;
        await new Promise((resolve, reject) => {
          audio.addEventListener('canplaythrough', resolve, { once: true });
          audio.addEventListener('error', reject, { once: true });
          audio.load();
        });
        
        console.log(`✅ Áudio carregado: ${song.title}`);
      } catch (error) {
        console.log(`⚠️ Arquivo não encontrado: ${song.audioFile}, usando síntese`);
        // Criar áudio sintético se arquivo não existir
        const syntheticBlob = await this.createSyntheticAudio(song);
        audio.src = URL.createObjectURL(syntheticBlob);
      }

      this.currentTrack = audio;
      return true;
    } catch (error) {
      console.error(`❌ Erro ao carregar música ${song.title}:`, error);
      return false;
    }
  }

  async createSyntheticAudio(song: TraditionalSong): Promise<Blob> {
    if (!this.audioContext) {
      throw new Error('AudioContext não inicializado');
    }

    const sampleRate = this.audioContext.sampleRate;
    const duration = song.duration;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    // Frequências das notas dos boomwhackers
    const frequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00]; // C, D, E, F, G, A

    // Gerar áudio baseado no pattern da música
    song.pattern.forEach(note => {
      const startSample = Math.floor((note.time / 1000) * sampleRate);
      const durationSamples = Math.floor((note.duration / 1000) * sampleRate);
      const frequency = frequencies[note.track];
      const intensity = note.intensity || 0.8;

      for (let i = 0; i < durationSamples && (startSample + i) < data.length; i++) {
        const time = i / sampleRate;
        const envelope = Math.exp(-time * 2) * intensity; // Decay exponencial
        const oscillator = Math.sin(2 * Math.PI * frequency * time) * envelope;
        
        // Adicionar harmônicos para soar mais como boomwhacker
        const harmonic2 = Math.sin(2 * Math.PI * frequency * 2 * time) * envelope * 0.3;
        const harmonic3 = Math.sin(2 * Math.PI * frequency * 3 * time) * envelope * 0.1;
        
        data[startSample + i] += (oscillator + harmonic2 + harmonic3) * 0.3;
      }
    });

    // Converter buffer para blob
    const arrayBuffer = this.audioBufferToWav(buffer);
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  private audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);

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
    view.setUint16(22, 1, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);

    // Convert float samples to 16-bit PCM
    const data = buffer.getChannelData(0);
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, data[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }

    return arrayBuffer;
  }

  play(): boolean {
    if (!this.currentTrack) return false;
    
    try {
      this.currentTrack.currentTime = 0;
      this.currentTrack.play();
      return true;
    } catch (error) {
      console.error('❌ Erro ao reproduzir:', error);
      return false;
    }
  }

  pause(): void {
    if (this.currentTrack) {
      this.currentTrack.pause();
    }
  }

  resume(): boolean {
    if (!this.currentTrack) return false;
    
    try {
      this.currentTrack.play();
      return true;
    } catch (error) {
      console.error('❌ Erro ao retomar:', error);
      return false;
    }
  }

  stop(): void {
    if (this.currentTrack) {
      this.currentTrack.pause();
      this.currentTrack.currentTime = 0;
    }
  }

  getCurrentTime(): number {
    return this.currentTrack ? this.currentTrack.currentTime * 1000 : 0;
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.currentTrack) {
      this.currentTrack.volume = this.musicVolume;
    }
  }

  setEffectsVolume(volume: number): void {
    this.effectsVolume = Math.max(0, Math.min(1, volume));
  }

  onTimeUpdate(callback: (time: number) => void): void {
    if (this.currentTrack) {
      this.currentTrack.addEventListener('timeupdate', () => {
        callback(this.getCurrentTime());
      });
    }
  }

  onEnded(callback: () => void): void {
    if (this.currentTrack) {
      this.currentTrack.addEventListener('ended', callback);
    }
  }

  // Tocar efeito sonoro quando acerta nota
  async playHitEffect(noteIndex: number, hitType: 'perfect' | 'good' | 'ok'): Promise<void> {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Frequências das notas
      const frequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00];
      oscillator.frequency.setValueAtTime(frequencies[noteIndex], this.audioContext.currentTime);
      
      // Volume baseado na qualidade do acerto
      const volume = hitType === 'perfect' ? 0.3 : hitType === 'good' ? 0.2 : 0.1;
      gainNode.gain.setValueAtTime(volume * this.effectsVolume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    } catch (error) {
      console.error('❌ Erro ao tocar efeito:', error);
    }
  }

  // Tocar efeito de miss
  async playMissEffect(): Promise<void> {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(80, this.audioContext.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0.2 * this.effectsVolume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('❌ Erro ao tocar efeito de miss:', error);
    }
  }

  dispose(): void {
    if (this.currentTrack) {
      this.currentTrack.pause();
      this.currentTrack = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.isInitialized = false;
  }
}

export const guitarHeroAudio = new GuitarHeroAudioManager();
