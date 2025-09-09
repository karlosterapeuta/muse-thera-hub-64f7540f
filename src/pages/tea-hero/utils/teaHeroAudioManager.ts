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
  private backgroundSource: AudioBufferSourceNode | null = null;
  private masterGain: GainNode | null = null;
  private noteGain: GainNode | null = null;
  private backgroundGain: GainNode | null = null;
  private isPlaying: boolean = false;
  
  private settings: TEAAudioSettings = {
    noteVolume: 0.8,
    backgroundVolume: 0.3,
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
      // Play with slightly lower volume for falling notes
      const fallbackVolume = this.settings.noteVolume * 0.6;
      await playNoteSound(`${frequency}Hz`, instrumentType);
      console.log(`🎵 Falling note: ${frequency}Hz`);
    } catch (error) {
      console.warn('⚠️ Failed to play falling note sound:', error);
    }
  }

  async createSyntheticBackgroundMusic(songId: string, instrumentType: "bell" | "xylophone" | "keyboard"): Promise<void> {
    if (!this.settings.backgroundEnabled || this.settings.audioMode === 'notes') return;
    if (!this.audioContext) return;

    try {
      const sequence = getAuthenticMusicalSequence(songId);
      if (!sequence) {
        console.warn('⚠️ No sequence found for background music');
        return;
      }

      console.log(`🎼 Creating background music for: ${sequence.name}`);
      
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
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + sequence.totalDuration / 1000);
        
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

  getSettings(): TEAAudioSettings {
    return { ...this.settings };
  }

  stop(): void {
    if (this.backgroundSource) {
      this.backgroundSource.stop();
      this.backgroundSource = null;
    }
    this.isPlaying = false;
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