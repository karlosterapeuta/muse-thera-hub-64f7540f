import { playNoteSound } from '@/utils/audioUtils';
import { getAuthenticMusicalSequence } from '@/data/authenticMusicalSequences';
import { TEA_MASTER_FREQUENCIES, getLaneConfig } from '@/constants/teaFrequencies';

interface TEAAudioSettings {
  noteVolume: number;
  backgroundVolume: number;
  noteSoundEnabled: boolean;
  backgroundEnabled: boolean;
  audioMode: 'notes' | 'background' | 'both';
}

class TEAHeroAudioManager {
  private audioContext: AudioContext | null = null;
  private backgroundSource: OscillatorNode | null = null;
  private masterGain: GainNode | null = null;
  private noteGain: GainNode | null = null;
  private backgroundGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private isRepeating: boolean = false;
  private currentSongId: string | null = null;
  private currentInstrumentType: "bell" | "xylophone" | "keyboard" | null = null;
  
  private settings: TEAAudioSettings = {
    noteVolume: 0.95, // Volume máximo para funcionar sem fone
    backgroundVolume: 0.4,
    noteSoundEnabled: true,
    backgroundEnabled: true,
    audioMode: 'both'
  };

  async initialize(): Promise<boolean> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create gain nodes
      this.masterGain = this.audioContext.createGain();
      this.noteGain = this.audioContext.createGain();
      this.backgroundGain = this.audioContext.createGain();
      
      // Connect nodes
      this.noteGain.connect(this.masterGain);
      this.backgroundGain.connect(this.masterGain);
      this.masterGain.connect(this.audioContext.destination);
      
      // Set initial volumes
      this.updateVolumes();
      
      console.log('🎵 TEA Hero Audio Manager initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize TEA Hero Audio Manager:', error);
      return false;
    }
  }

  private updateVolumes(): void {
    if (!this.noteGain || !this.backgroundGain) return;
    
    this.noteGain.gain.value = this.settings.noteVolume;
    this.backgroundGain.gain.value = this.settings.backgroundVolume;
  }

  async playFallingNoteSound(frequency: number, instrumentType: "bell" | "xylophone" | "keyboard"): Promise<void> {
    if (!this.settings.noteSoundEnabled || this.settings.audioMode === 'background') return;
    
    try {
      // Mobile detection for higher volume
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Use higher volume for mobile devices to work without headphones
      const mobileVolumeBoost = isMobile ? 1.5 : 1.0;
      const noteVolume = this.settings.noteVolume * 0.9 * mobileVolumeBoost; // Much higher volume
      
      await playNoteSound(`${frequency}Hz`, instrumentType);
      console.log(`🎵 Falling note: ${frequency}Hz (Mobile: ${isMobile}, Volume boost: ${mobileVolumeBoost}x)`);
    } catch (error) {
      console.warn('⚠️ Failed to play falling note sound:', error);
    }
  }

  async createSyntheticBackgroundMusic(songId: string, instrumentType: "bell" | "xylophone" | "keyboard"): Promise<void> {
    if (!this.settings.backgroundEnabled || this.settings.audioMode === 'notes') return;
    if (!this.audioContext) return;

    // Store current song and instrument for repeat functionality
    this.currentSongId = songId;
    this.currentInstrumentType = instrumentType;

    try {
      const sequence = getAuthenticMusicalSequence(songId);
      if (!sequence) {
        console.warn('⚠️ No sequence found for background music');
        return;
      }

      console.log(`🎼 Creating background music for: ${sequence.name}`);
      
      // Stop any existing background music
      if (this.backgroundSource) {
        this.backgroundSource.stop();
      }
      
      // Create a simple harmonic background
      const oscillator = this.audioContext.createOscillator();
      const envelope = this.audioContext.createGain();
      
      // Use root chord of the sequence
      const firstNote = sequence.notes[0];
      if (firstNote) {
        const laneConfig = getLaneConfig(instrumentType, 0); // Base note
        oscillator.frequency.setValueAtTime(laneConfig.frequency * 0.5, this.audioContext.currentTime); // Lower octave
        oscillator.type = 'sine';
        
        // Soft envelope
        envelope.gain.setValueAtTime(0, this.audioContext.currentTime);
        envelope.gain.linearRampToValueAtTime(this.settings.backgroundVolume * 0.3, this.audioContext.currentTime + 1);
        envelope.gain.setValueAtTime(this.settings.backgroundVolume * 0.3, this.audioContext.currentTime + sequence.totalDuration / 1000 - 1);
        envelope.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + sequence.totalDuration / 1000);
        
        oscillator.connect(envelope);
        envelope.connect(this.backgroundGain!);
        
        this.backgroundSource = oscillator;
        this.isPlaying = true;
        this.isPaused = false;
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + sequence.totalDuration / 1000);
        
        // Auto-repeat if enabled
        if (this.isRepeating) {
          oscillator.onended = () => {
            if (this.isRepeating && this.currentSongId && this.currentInstrumentType) {
              setTimeout(() => {
                this.createSyntheticBackgroundMusic(this.currentSongId!, this.currentInstrumentType!);
              }, 500); // Small delay before repeat
            }
          };
        }
        
        console.log(`✅ Background music started for ${sequence.totalDuration}ms`);
      }
    } catch (error) {
      console.error('❌ Failed to create background music:', error);
    }
  }

  setNoteVolume(volume: number): void {
    this.settings.noteVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  setBackgroundVolume(volume: number): void {
    this.settings.backgroundVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  setNoteSoundEnabled(enabled: boolean): void {
    this.settings.noteSoundEnabled = enabled;
  }

  setBackgroundEnabled(enabled: boolean): void {
    this.settings.backgroundEnabled = enabled;
  }

  setAudioMode(mode: 'notes' | 'background' | 'both'): void {
    this.settings.audioMode = mode;
    this.settings.noteSoundEnabled = mode === 'notes' || mode === 'both';
    this.settings.backgroundEnabled = mode === 'background' || mode === 'both';
  }

  // New playback control methods
  pause(): void {
    if (this.isPlaying && !this.isPaused && this.audioContext) {
      this.audioContext.suspend();
      this.isPaused = true;
      console.log('⏸️ Music paused');
    }
  }

  resume(): void {
    if (this.isPaused && this.audioContext) {
      this.audioContext.resume();
      this.isPaused = false;
      console.log('▶️ Music resumed');
    }
  }

  togglePause(): boolean {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
    return this.isPaused;
  }

  setRepeating(repeat: boolean): void {
    this.isRepeating = repeat;
    console.log(`🔁 Repeat mode: ${repeat ? 'ON' : 'OFF'}`);
  }

  toggleRepeat(): boolean {
    this.isRepeating = !this.isRepeating;
    console.log(`🔁 Repeat mode: ${this.isRepeating ? 'ON' : 'OFF'}`);
    return this.isRepeating;
  }

  // Getters for status
  getIsPlaying(): boolean {
    return this.isPlaying && !this.isPaused;
  }

  getIsPaused(): boolean {
    return this.isPaused;
  }

  getIsRepeating(): boolean {
    return this.isRepeating;
  }

  getSettings(): TEAAudioSettings {
    return { ...this.settings };
  }

  stop(): void {
    if (this.backgroundSource) {
      this.backgroundSource.stop();
      this.backgroundSource = null;
    }
    this.isPlaying = false;
    this.isPaused = false;
    this.currentSongId = null;
    this.currentInstrumentType = null;
    console.log('⏹️ Music stopped');
  }

  cleanup(): void {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export const teaHeroAudio = new TEAHeroAudioManager();