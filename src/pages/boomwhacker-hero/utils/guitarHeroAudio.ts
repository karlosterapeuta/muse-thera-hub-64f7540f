import { TraditionalSong } from '../data/traditionalSongs';

interface AudioSource {
  url: string;
  type: 'local' | 'cdn' | 'backup' | 'synthetic';
  priority: number;
}

class GuitarHeroAudioManager {
  private audioContext: AudioContext | null = null;
  private currentTrack: HTMLAudioElement | null = null;
  private musicVolume: number = 0.7;
  private effectsVolume: number = 0.5;
  private isInitialized: boolean = false;
  private loadingProgress: number = 0;
  private audioCache: Map<string, string> = new Map();
  private retryAttempts: Map<string, number> = new Map();
  private preloadedSongs: Set<string> = new Set();

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
      
      // Preload popular songs
      this.preloadPopularSongs();
    } catch (error) {
      console.error('❌ Erro ao inicializar áudio:', error);
    }
  }

  private async preloadPopularSongs() {
    // Preload easy songs for better UX
    const easyIds = ['atirei-pau-gato', 'sapo-cururu', 'boi-cara-preta'];
    
    for (const songId of easyIds) {
      try {
        const audio = new Audio();
        audio.preload = 'metadata';
        audio.src = `/assets/music/${songId}.mp3`;
        audio.load();
        this.preloadedSongs.add(songId);
      } catch (error) {
        console.log(`⚠️ Preload falhou para ${songId}:`, error);
      }
    }
  }

  private getAudioSources(song: TraditionalSong): AudioSource[] {
    const sources: AudioSource[] = [];
    
    // Local files primeiro (maior prioridade)
    if (song.audioFile) {
      sources.push({ url: song.audioFile, type: 'local', priority: 1 });
    }
    
    // CDN segundo (Archive.org é mais confiável)
    if (song.cdnUrl) {
      sources.push({ url: song.cdnUrl, type: 'cdn', priority: 2 });
    }
    
    // URLs de backup por último
    if (song.backupUrls) {
      song.backupUrls.forEach((url, index) => {
        sources.push({ url, type: 'backup', priority: 3 + index });
      });
    }
    
    // Ordenar por prioridade
    return sources.sort((a, b) => a.priority - b.priority);
  }

  private async checkFileExists(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async tryLoadAudioSource(source: AudioSource, attempts: number = 0): Promise<HTMLAudioElement | null> {
    return new Promise(async (resolve) => {
      // Para arquivos locais, verificar se existem primeiro
      if (source.type === 'local') {
        const exists = await this.checkFileExists(source.url);
        if (!exists) {
          console.log(`📁 Arquivo local não encontrado: ${source.url}`);
          resolve(null);
          return;
        }
      }

      const audio = new Audio();
      
      // Configurações específicas por tipo de fonte
      if (source.type === 'cdn' || source.type === 'backup') {
        audio.crossOrigin = 'anonymous';
      }
      
      audio.preload = 'auto';
      audio.volume = this.musicVolume;

      // Timeout mais específico por tipo
      const timeoutDuration = source.type === 'local' ? 3000 : 
                             source.type === 'cdn' ? 8000 : 10000;
      
      const timeoutId = setTimeout(() => {
        console.log(`⏰ Timeout loading ${source.type}: ${source.url} (tentativa ${attempts + 1})`);
        audio.src = '';
        resolve(null);
      }, timeoutDuration);

      const cleanup = () => {
        clearTimeout(timeoutId);
        audio.removeEventListener('canplaythrough', onSuccess);
        audio.removeEventListener('error', onError);
        audio.removeEventListener('loadeddata', onLoadedData);
      };

      const onSuccess = () => {
        cleanup();
        console.log(`✅ Carregado com sucesso (${source.type}): ${source.url}`);
        resolve(audio);
      };

      const onLoadedData = () => {
        if (audio.readyState >= 2) {
          cleanup();
          console.log(`✅ Dados carregados (${source.type}): ${source.url}`);
          resolve(audio);
        }
      };

      const onError = (e: any) => {
        cleanup();
        console.log(`❌ Erro ao carregar ${source.type}: ${source.url}`, e?.message || 'erro desconhecido');
        resolve(null);
      };

      audio.addEventListener('canplaythrough', onSuccess, { once: true });
      audio.addEventListener('loadeddata', onLoadedData, { once: true });
      audio.addEventListener('error', onError, { once: true });

      try {
        audio.src = source.url;
        audio.load();
      } catch (error) {
        cleanup();
        console.log(`❌ Exceção ao definir src ${source.type}: ${source.url}`, error);
        resolve(null);
      }
    });
  }

  async loadTrack(song: TraditionalSong): Promise<boolean> {
    try {
      if (this.currentTrack) {
        this.currentTrack.pause();
        this.currentTrack = null;
      }

      this.loadingProgress = 0;
      console.log(`🎵 Carregando: ${song.title}`);

      // Verificar cache primeiro
      const cacheKey = song.id;
      if (this.audioCache.has(cacheKey)) {
        const cachedUrl = this.audioCache.get(cacheKey)!;
        console.log(`📦 Usando cache para: ${song.title}`);
        const audio = await this.tryLoadAudioSource({ url: cachedUrl, type: 'local', priority: 0 });
        if (audio) {
          this.currentTrack = audio;
          this.loadingProgress = 100;
          return true;
        } else {
          this.audioCache.delete(cacheKey);
        }
      }

      const sources = this.getAudioSources(song);
      const attempts = this.retryAttempts.get(cacheKey) || 0;
      
      console.log(`🔄 Tentando carregar ${sources.length} fontes para: ${song.title}`);
      
      // Tentar carregar de cada fonte em ordem de prioridade
      for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        this.loadingProgress = 20 + (i * 60 / sources.length);
        
        console.log(`🎵 Tentando fonte ${i + 1}/${sources.length} (${source.type}): ${source.url}`);
        const audio = await this.tryLoadAudioSource(source, attempts);
        
        if (audio) {
          this.currentTrack = audio;
          this.audioCache.set(cacheKey, source.url);
          this.loadingProgress = 100;
          this.retryAttempts.delete(cacheKey);
          console.log(`🎉 Sucesso! Música carregada: ${song.title} via ${source.type}`);
          return true;
        }
      }

      // Se todas as fontes falharam, gerar áudio sintético como último recurso
      this.retryAttempts.set(cacheKey, attempts + 1);
      console.log(`⚠️ Todas as ${sources.length} fontes falharam para ${song.title}, gerando áudio sintético`);
      this.loadingProgress = 80;
      
      const syntheticBlob = await this.createSyntheticAudio(song);
      const syntheticUrl = URL.createObjectURL(syntheticBlob);
      
      const audio = await this.tryLoadAudioSource({ url: syntheticUrl, type: 'synthetic', priority: 999 });
      if (audio) {
        this.currentTrack = audio;
        this.audioCache.set(cacheKey, syntheticUrl);
        this.loadingProgress = 100;
        console.log(`🎼 Áudio sintético criado para: ${song.title}`);
        return true;
      }

      return false;
    } catch (error) {
      console.error(`❌ Erro crítico ao carregar música ${song.title}:`, error);
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
        const envelope = Math.exp(-time * 2) * intensity;
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

  getDuration(): number {
    return this.currentTrack ? this.currentTrack.duration * 1000 : 0;
  }

  getLoadingProgress(): number {
    return this.loadingProgress;
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

  onLoadProgress(callback: (progress: number) => void): void {
    const interval = setInterval(() => {
      callback(this.loadingProgress);
      if (this.loadingProgress >= 100) {
        clearInterval(interval);
      }
    }, 100);
  }

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

  clearCache(): void {
    this.audioCache.clear();
    this.retryAttempts.clear();
    this.preloadedSongs.clear();
    console.log('🗑️ Cache de áudio limpo');
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
    
    this.clearCache();
    this.isInitialized = false;
  }
}

export const guitarHeroAudio = new GuitarHeroAudioManager();
