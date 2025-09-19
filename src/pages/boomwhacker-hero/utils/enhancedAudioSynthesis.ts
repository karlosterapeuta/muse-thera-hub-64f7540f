
import { AudioSynthesis } from './audioSynthesis';
import { globalCacheManager } from "@/utils/cacheManager";

export class EnhancedAudioSynthesis extends AudioSynthesis {
  private harmonicContext: AudioContext | null = null;
  private activeOscillators: Map<number, OscillatorNode> = new Map();

  constructor() {
    super();
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.harmonicContext = new AudioContextClass();
    } catch (error) {
      console.error('❌ Erro ao inicializar contexto harmônico:', error);
    }
  }

  // Tocar nota com harmonias
  async playBoomwhackerWithHarmony(
    frequency: number, 
    noteIndex: number, 
    activeNotes: Set<number> = new Set()
  ): Promise<void> {
    if (!this.harmonicContext) return;

    try {
      if (this.harmonicContext.state === 'suspended') {
        await this.harmonicContext.resume();
      }

      // Parar oscilador anterior se existir
      const existingOsc = this.activeOscillators.get(noteIndex);
      if (existingOsc) {
        existingOsc.stop();
        this.activeOscillators.delete(noteIndex);
      }

      const oscillator = this.harmonicContext.createOscillator();
      const gainNode = this.harmonicContext.createGain();
      
      // Configurar forma de onda baseada em quantas notas estão ativas
      if (activeNotes.size > 1) {
        oscillator.type = 'triangle'; // Som mais suave para acordes
      } else {
        oscillator.type = 'sine'; // Som puro para notas individuais
      }
      
      oscillator.frequency.setValueAtTime(frequency, this.harmonicContext.currentTime);
      
      // Volume ajustado baseado no número de notas ativas
      const baseVolume = activeNotes.size > 1 ? 0.2 : 0.3;
      gainNode.gain.setValueAtTime(0, this.harmonicContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(baseVolume, this.harmonicContext.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.harmonicContext.currentTime + 0.8);
      
      // Adicionar harmônicos sutis
      const harmonic2 = this.harmonicContext.createOscillator();
      const harmonic2Gain = this.harmonicContext.createGain();
      
      harmonic2.type = 'sine';
      harmonic2.frequency.setValueAtTime(frequency * 2, this.harmonicContext.currentTime);
      harmonic2Gain.gain.setValueAtTime(0, this.harmonicContext.currentTime);
      harmonic2Gain.gain.linearRampToValueAtTime(baseVolume * 0.3, this.harmonicContext.currentTime + 0.02);
      harmonic2Gain.gain.exponentialRampToValueAtTime(0.001, this.harmonicContext.currentTime + 0.6);
      
      // Conectar osciladores
      oscillator.connect(gainNode);
      harmonic2.connect(harmonic2Gain);
      gainNode.connect(this.harmonicContext.destination);
      harmonic2Gain.connect(this.harmonicContext.destination);
      
      // Iniciar osciladores
      oscillator.start();
      harmonic2.start();
      
      // Agendar parada
      oscillator.stop(this.harmonicContext.currentTime + 0.8);
      harmonic2.stop(this.harmonicContext.currentTime + 0.6);
      
      // Armazenar referência
      this.activeOscillators.set(noteIndex, oscillator);
      
      // Limpar referência quando parar
      oscillator.onended = () => {
        this.activeOscillators.delete(noteIndex);
      };
      
      console.log(`🎵 Tocando nota harmônica: ${frequency}Hz (${activeNotes.size} notas ativas)`);
      
    } catch (error) {
      console.error('Erro ao tocar nota harmônica:', error);
    }
  }

  // Tocar acorde de múltiplas notas
  async playChord(frequencies: number[], noteIndices: number[]): Promise<void> {
    const activeNotes = new Set(noteIndices);
    
    for (let i = 0; i < frequencies.length; i++) {
      await this.playBoomwhackerWithHarmony(frequencies[i], noteIndices[i], activeNotes);
    }
  }

  // Parar todas as notas
  stopAllNotes(): void {
    this.activeOscillators.forEach((oscillator, noteIndex) => {
      try {
        oscillator.stop();
        this.activeOscillators.delete(noteIndex);
      } catch (error) {
        console.warn(`Erro ao parar oscilador ${noteIndex}:`, error);
      }
    });
    this.activeOscillators.clear();
  }

  dispose(): void {
    this.stopAllNotes();
    
    // Clear enhanced audio caches
    globalCacheManager.clearNamespace('audio');
    
    if (this.harmonicContext) {
      this.harmonicContext.close();
      this.harmonicContext = null;
    }
    super.dispose();
  }
}

// Instância global melhorada
export const globalEnhancedAudio = new EnhancedAudioSynthesis();
