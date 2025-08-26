
// Motor de áudio TEA-OPTIMIZED para sequências musicais autênticas

import { playInstrumentNote, realAudioService } from '@/services/realAudioService';

export interface TEAAudioConfig {
  instrument: "bell" | "xylophone" | "keyboard";
  frequency: number;
  volume?: number;
  duration?: number;
  teaOptimized?: boolean;
}

class TEAAudioEngine {
  private audioContext: AudioContext | null = null;
  private initialized = false;

  async initialize(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    this.initialized = true;
    console.log('🎵 TEA Audio Engine initialized');
  }

  // Tocar nota com otimização TEA avançada
  async playTEAOptimizedNote(config: TEAAudioConfig): Promise<boolean> {
    try {
      if (!this.initialized) {
        console.log('🔄 TEA Audio Engine not initialized, initializing...');
        await this.initialize();
      }

      console.log(`🎵 Playing TEA-optimized note: ${config.instrument} at ${config.frequency}Hz`);

      // Usar serviço real com otimizações TEA
      const success = await playInstrumentNote(
        config.instrument,
        config.frequency,
        (config.volume || 1.0) * 1.6, // 60% mais alto para TEA
        config.duration || 1.5
      );

      if (success) {
        console.log(`🎯 TEA-OPTIMIZED: ${config.instrument} at ${config.frequency}Hz played successfully`);
        return true;
      }

      console.log(`⚠️ Real audio service failed, using TEA fallback synthesis`);
      // Fallback com síntese otimizada para TEA
      return await this.playTEAFallbackSynthesis(config);

    } catch (error) {
      console.error('❌ TEA audio error:', error);
      console.log('🔄 Attempting fallback synthesis...');
      try {
        return await this.playTEAFallbackSynthesis(config);
      } catch (fallbackError) {
        console.error('❌ TEA fallback synthesis also failed:', fallbackError);
        return false;
      }
    }
  }

  // Síntese de fallback otimizada para TEA
  private async playTEAFallbackSynthesis(config: TEAAudioConfig): Promise<boolean> {
    try {
      if (!this.audioContext) return false;

      const now = this.audioContext.currentTime;
      const duration = config.duration || 1.5;
      const teaVolume = (config.volume || 1.0) * 1.8; // Volume amplificado para TEA

      // Oscilador principal com forma de onda otimizada
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      // Escolher forma de onda baseada no instrumento
      if (config.instrument === 'bell') {
        oscillator.type = 'sine';
      } else if (config.instrument === 'xylophone') {
        oscillator.type = 'triangle';
      } else {
        oscillator.type = 'sawtooth';
      }

      oscillator.frequency.setValueAtTime(config.frequency, now);

      // Envelope ADSR otimizado para TEA
      const attackTime = 0.002;
      const decayTime = 0.01;
      const sustainLevel = 0.95;
      const releaseTime = duration - attackTime - decayTime;

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(teaVolume, now + attackTime);
      gainNode.gain.exponentialRampToValueAtTime(sustainLevel * 0.9, now + attackTime + decayTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // Compressor dinâmico para consistência
      const compressor = this.audioContext.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-6, now);
      compressor.ratio.setValueAtTime(20, now);
      compressor.attack.setValueAtTime(0.0001, now);
      compressor.release.setValueAtTime(0.03, now);

      // EQ para clareza auditiva
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.setValueAtTime(config.frequency * 2, now);
      filter.Q.setValueAtTime(4, now);
      filter.gain.setValueAtTime(8, now);

      // Reverb leve para profundidade
      const reverb = this.audioContext.createConvolver();
      const reverbBuffer = this.createReverbBuffer(0.3, 0.02);
      reverb.buffer = reverbBuffer;

      const reverbGain = this.audioContext.createGain();
      reverbGain.gain.setValueAtTime(0.15, now);

      // Conectar pipeline de áudio
      oscillator.connect(gainNode);
      gainNode.connect(filter);
      filter.connect(compressor);
      
      // Split para dry/wet
      compressor.connect(this.audioContext.destination); // Dry
      compressor.connect(reverbGain);
      reverbGain.connect(reverb);
      reverb.connect(this.audioContext.destination); // Wet

      oscillator.start(now);
      oscillator.stop(now + duration);

      console.log(`🔊 TEA Fallback synthesis: ${config.instrument} at ${config.frequency}Hz`);
      return true;

    } catch (error) {
      console.error('TEA fallback synthesis failed:', error);
      return false;
    }
  }

  // Criar buffer de reverb
  private createReverbBuffer(duration: number, decay: number): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext not initialized');
    
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const impulse = this.audioContext.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const n = length - i;
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(n / length, decay);
      }
    }
    
    return impulse;
  }

  // Verificar status do motor
  getStatus() {
    return {
      initialized: this.initialized,
      audioContextState: this.audioContext?.state || 'not-created',
      sampleRate: this.audioContext?.sampleRate || 0
    };
  }

  // Limpar recursos
  dispose() {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    this.audioContext = null;
    this.initialized = false;
    console.log('🎵 TEA Audio Engine disposed');
  }
}

// Instância singleton do motor TEA
export const teaAudioEngine = new TEAAudioEngine();

// Função principal para tocar notas autênticas
export const playAuthenticTEANote = async (
  instrument: "bell" | "xylophone" | "keyboard",
  frequency: number,
  volume: number = 1.2,
  duration: number = 1.5
): Promise<boolean> => {
  return teaAudioEngine.playTEAOptimizedNote({
    instrument,
    frequency,
    volume,
    duration,
    teaOptimized: true
  });
};
