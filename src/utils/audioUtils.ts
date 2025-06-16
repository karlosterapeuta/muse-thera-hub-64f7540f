// Map of note keys to their frequencies in Hz - CORRIGIDO E SINCRONIZADO
const noteFrequencies: Record<string, number> = {
  "C↓": 261.63, // Low C (Dó)
  "D": 293.66,  // D (Ré)
  "E": 329.63,  // E (Mi)
  "F": 349.23,  // F (Fá)
  "G": 392.00,  // G (Sol)
  "A": 440.00,  // A (Lá)
  "B": 493.88,  // B (Si)
  "C↑": 523.25, // High C (Dó alto)
  "C": 261.63,  // Regular C (Dó regular - same as C↓)
  "C5": 523.25, // Xilofone (oitava C5)
  "D5": 587.33, // Xilofone (oitava C5)
  "E5": 659.25, // Xilofone (oitava C5)
  "F5": 698.46, // Xilofone (oitava C5)
  "G5": 783.99, // Xilofone (oitava C5)
  "A5": 880.00, // Xilofone (oitava C5)
  "B5": 987.77, // Xilofone (oitava C5)
};

// Importar o novo serviço de áudio real
import { playInstrumentNote, realAudioService } from '@/services/realAudioService';

// Keep track of audio contexts to stop them later
const activeAudioNodes: AudioNode[] = [];

// Define therapeutic frequencies for different conditions
interface TherapeuticFrequency {
  left: number;
  right: number;
  description: string;
}

interface TherapeuticFrequencyGroup {
  [key: string]: TherapeuticFrequency;
}

export interface TherapeuticFrequencyMap {
  autism?: TherapeuticFrequencyGroup;
  mentalHealth?: TherapeuticFrequencyGroup;
  [key: string]: TherapeuticFrequencyGroup | undefined;
}

export const therapeuticFrequencies: TherapeuticFrequencyMap = {
  autism: {
    attention: {
      left: 200,
      right: 208,
      description: "Ajuda a melhorar a atenção e o foco"
    },
    anxiety: {
      left: 220,
      right: 226,
      description: "Reduz a ansiedade e promove a calma"
    },
    sensory: {
      left: 240,
      right: 244,
      description: "Auxilia na integração sensorial"
    }
  },
  mentalHealth: {
    depression: {
      left: 200,
      right: 210,
      description: "Ajuda a elevar o humor e energia"
    },
    anxiety: {
      left: 280,
      right: 286,
      description: "Combate a ansiedade e tensão"
    },
    sleep: {
      left: 180,
      right: 184,
      description: "Promove relaxamento e sono tranquilo"
    },
    focus: {
      left: 300,
      right: 307,
      description: "Melhora a concentração e clareza mental"
    }
  }
};

// Background sound type definition
export type BackgroundSoundType = 
  | "none" 
  | "white-noise" 
  | "rain" 
  | "ocean" 
  | "forest" 
  | "fireplace" 
  | "birds" 
  | "stream" 
  | "meditation" 
  | "brown-noise" 
  | "pink-noise";

// Store audio contexts and nodes for binaural beats
let binauralOscillatorLeft: OscillatorNode | null = null;
let binauralOscillatorRight: OscillatorNode | null = null;
let binauralGainNode: GainNode | null = null;
let backgroundAudioElement: HTMLAudioElement | null = null;
let audioContext: AudioContext | null = null;

/**
 * SISTEMA DE ÁUDIO REVOLUCIONÁRIO PARA TEA-HERO
 * Prioriza áudio real com fallback inteligente para síntese super otimizada
 */
export const playNoteSound = async (noteKey: string, instrument?: "bell" | "xylophone" | "keyboard") => {
  try {
    // Determinar frequência CORRIGIDA
    let frequency: number;
    
    if (noteKey.includes('Hz')) {
      frequency = parseFloat(noteKey.replace('Hz', ''));
    } else {
      frequency = noteFrequencies[noteKey] || 440;
    }

    // ABORDAGEM REVOLUCIONÁRIA: Áudio real otimizado para TEA
    if (instrument) {
      console.log(`🎵 Playing TEA-optimized ${instrument} at ${frequency}Hz`);
      
      try {
        const success = await playInstrumentNote(instrument, frequency, 1.0, 1.2);
        if (success) {
          console.log(`✅ TEA-optimized real audio success: ${instrument} - ${frequency}Hz`);
          return;
        }
      } catch (error) {
        console.warn(`⚠️ Real audio failed, using SUPER synthesis:`, error);
      }
    }

    // FALLBACK: Síntese SUPER OTIMIZADA para TEA
    console.log(`🔄 Using TEA-OPTIMIZED synthesis for ${frequency}Hz`);
    
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();
    
    // CONFIGURAÇÃO ESPECÍFICA PARA TEA
    let waveType: OscillatorType = 'triangle';
    let teaVolume = 1.3; // VOLUME AMPLIFICADO PARA TEA
    
    if (instrument === 'bell') {
      waveType = 'sine';
      teaVolume = 1.5; // Sinos ainda mais altos
    } else if (instrument === 'xylophone') {
      waveType = 'square';
      teaVolume = 1.4;
    } else if (instrument === 'keyboard') {
      waveType = 'sawtooth'; // Mais rico para piano
      teaVolume = 1.3;
    }
    
    // OSCILADOR PRINCIPAL SUPER OTIMIZADO
    const oscillator = audioContext.createOscillator();
    oscillator.type = waveType;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    // ENVELOPE ADSR ESPECÍFICO PARA TEA - máxima audibilidade
    const gainNode = audioContext.createGain();
    const attackTime = 0.003;  // Attack ultra rápido
    const decayTime = 0.02;    // Decay muito rápido
    const sustainLevel = 0.9;  // Sustain MÁXIMO para TEA
    const releaseTime = 1.0;   // Release mais longo para percepção
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(teaVolume, audioContext.currentTime + attackTime);
    gainNode.gain.exponentialRampToValueAtTime(sustainLevel, audioContext.currentTime + attackTime + decayTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + attackTime + decayTime + releaseTime);
    
    // HARMÔNICOS MÚLTIPLOS para riqueza sonora EXTREMA
    const harmonic2 = audioContext.createOscillator();
    const harmonic2Gain = audioContext.createGain();
    harmonic2.type = 'sine';
    harmonic2.frequency.setValueAtTime(frequency * 2, audioContext.currentTime);
    harmonic2Gain.gain.setValueAtTime(0.6, audioContext.currentTime); // Mais presente
    harmonic2Gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + attackTime + decayTime + releaseTime);
    
    const harmonic3 = audioContext.createOscillator();
    const harmonic3Gain = audioContext.createGain();
    harmonic3.type = 'sine';
    harmonic3.frequency.setValueAtTime(frequency * 3, audioContext.currentTime);
    harmonic3Gain.gain.setValueAtTime(0.4, audioContext.currentTime);
    harmonic3Gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + attackTime + decayTime + releaseTime);

    const harmonic4 = audioContext.createOscillator();
    const harmonic4Gain = audioContext.createGain();
    harmonic4.type = 'sine';
    harmonic4.frequency.setValueAtTime(frequency * 4, audioContext.currentTime);
    harmonic4Gain.gain.setValueAtTime(0.2, audioContext.currentTime);
    harmonic4Gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + attackTime + decayTime + releaseTime);
    
    // SUB-HARMÔNICO para corpo sonoro
    const subHarmonic = audioContext.createOscillator();
    const subHarmonicGain = audioContext.createGain();
    subHarmonic.type = 'sine';
    subHarmonic.frequency.setValueAtTime(frequency * 0.5, audioContext.currentTime);
    subHarmonicGain.gain.setValueAtTime(0.3, audioContext.currentTime);
    subHarmonicGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + attackTime + decayTime + releaseTime);
    
    // COMPRESSOR ULTRA AGRESSIVO para TEA
    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-8, audioContext.currentTime); // Threshold super baixo
    compressor.knee.setValueAtTime(40, audioContext.currentTime);
    compressor.ratio.setValueAtTime(20, audioContext.currentTime); // Compressão MÁXIMA
    compressor.attack.setValueAtTime(0.0001, audioContext.currentTime);
    compressor.release.setValueAtTime(0.05, audioContext.currentTime);
    
    // EQ DE 3 BANDAS para máxima clareza
    const lowCut = audioContext.createBiquadFilter();
    lowCut.type = 'highpass';
    lowCut.frequency.setValueAtTime(80, audioContext.currentTime);
    lowCut.Q.setValueAtTime(0.7, audioContext.currentTime);
    
    const midBoost = audioContext.createBiquadFilter();
    midBoost.type = 'peaking';
    midBoost.frequency.setValueAtTime(frequency, audioContext.currentTime);
    midBoost.Q.setValueAtTime(4, audioContext.currentTime);
    midBoost.gain.setValueAtTime(10, audioContext.currentTime); // Boost MASSIVO na fundamental
    
    const highBoost = audioContext.createBiquadFilter();
    highBoost.type = 'peaking';
    highBoost.frequency.setValueAtTime(frequency * 3, audioContext.currentTime);
    highBoost.Q.setValueAtTime(2, audioContext.currentTime);
    highBoost.gain.setValueAtTime(6, audioContext.currentTime); // Brilho extra
    
    // LIMITADOR para evitar distorção
    const limiter = audioContext.createDynamicsCompressor();
    limiter.threshold.setValueAtTime(-1, audioContext.currentTime);
    limiter.ratio.setValueAtTime(50, audioContext.currentTime);
    limiter.attack.setValueAtTime(0.0001, audioContext.currentTime);
    limiter.release.setValueAtTime(0.01, audioContext.currentTime);
    
    // REVERB micro para profundidade sem reverberação
    const delayNode = audioContext.createDelay();
    const delayGain = audioContext.createGain();
    delayNode.delayTime.value = 0.02; // Reverb muito curto
    delayGain.gain.value = 0.2;
    
    // CONEXÃO EM CADEIA SUPER OTIMIZADA
    oscillator.connect(gainNode);
    harmonic2.connect(harmonic2Gain);
    harmonic3.connect(harmonic3Gain);
    harmonic4.connect(harmonic4Gain);
    subHarmonic.connect(subHarmonicGain);
    
    // Primeira etapa: Mix dos osciladores
    gainNode.connect(lowCut);
    harmonic2Gain.connect(lowCut);
    harmonic3Gain.connect(lowCut);
    harmonic4Gain.connect(lowCut);
    subHarmonicGain.connect(lowCut);
    
    // Segunda etapa: EQ em série
    lowCut.connect(midBoost);
    midBoost.connect(highBoost);
    
    // Terceira etapa: Dinâmicas
    highBoost.connect(compressor);
    compressor.connect(limiter);
    
    // Saída principal
    limiter.connect(audioContext.destination);
    
    // Reverb paralelo
    limiter.connect(delayNode);
    delayNode.connect(delayGain);
    delayGain.connect(audioContext.destination);
    
    // Rastrear nós
    activeAudioNodes.push(oscillator, gainNode, harmonic2, harmonic2Gain, harmonic3, harmonic3Gain, harmonic4, harmonic4Gain, subHarmonic, subHarmonicGain, compressor, lowCut, midBoost, highBoost, limiter, delayNode, delayGain);
    
    // Iniciar TODOS os osciladores
    const totalDuration = attackTime + decayTime + releaseTime;
    oscillator.start();
    harmonic2.start();
    harmonic3.start();
    harmonic4.start();
    subHarmonic.start();
    
    oscillator.stop(audioContext.currentTime + totalDuration);
    harmonic2.stop(audioContext.currentTime + totalDuration);
    harmonic3.stop(audioContext.currentTime + totalDuration);
    harmonic4.stop(audioContext.currentTime + totalDuration);
    subHarmonic.stop(audioContext.currentTime + totalDuration);
    
    console.log(`🔊 TEA-OPTIMIZED SYNTHESIS: ${noteKey} at ${frequency}Hz with ${waveType} + 4 harmonics + sub + ultra compression`);
    
    // Limpeza após conclusão
    oscillator.onended = () => {
      [oscillator, gainNode, harmonic2, harmonic2Gain, harmonic3, harmonic3Gain, harmonic4, harmonic4Gain, subHarmonic, subHarmonicGain, compressor, lowCut, midBoost, highBoost, limiter, delayNode, delayGain].forEach(node => {
        const index = activeAudioNodes.indexOf(node);
        if (index !== -1) {
          activeAudioNodes.splice(index, 1);
        }
      });
      
      if (audioContext.state !== 'closed') {
        setTimeout(() => { audioContext.close(); }, 100);
      }
    };

  } catch (error) {
    console.error("TEA-optimized audio failed completely:", error);
    // Fallback final básico
    try {
      generateFallbackTone(800, parseFloat(noteKey.replace('Hz', '')) || 440);
    } catch (fallbackError) {
      console.error("All audio methods failed:", fallbackError);
    }
  }
};

/**
 * Stops all currently playing audio
 */
export const stopAllAudio = () => {
  // Stop all active audio nodes
  while (activeAudioNodes.length) {
    const node = activeAudioNodes.pop();
    if (node && 'disconnect' in node) {
      try {
        node.disconnect();
      } catch (error) {
        console.error("Error disconnecting audio node:", error);
      }
    }
  }

  // Clean up binaural beat audio
  if (binauralOscillatorLeft) {
    try {
      binauralOscillatorLeft.stop();
      binauralOscillatorLeft.disconnect();
      binauralOscillatorLeft = null;
    } catch (error) {
      console.error("Error stopping left oscillator:", error);
    }
  }

  if (binauralOscillatorRight) {
    try {
      binauralOscillatorRight.stop();
      binauralOscillatorRight.disconnect();
      binauralOscillatorRight = null;
    } catch (error) {
      console.error("Error stopping right oscillator:", error);
    }
  }

  if (binauralGainNode) {
    try {
      binauralGainNode.disconnect();
      binauralGainNode = null;
    } catch (error) {
      console.error("Error disconnecting gain node:", error);
    }
  }

  if (backgroundAudioElement) {
    try {
      backgroundAudioElement.pause();
      backgroundAudioElement.currentTime = 0;
      backgroundAudioElement = null;
    } catch (error) {
      console.error("Error stopping background audio:", error);
    }
  }

  if (audioContext) {
    try {
      audioContext.close();
      audioContext = null;
    } catch (error) {
      console.error("Error closing audio context:", error);
    }
  }
};

/**
 * Get background sound URL based on type
 */
const getBackgroundSoundUrl = (type: BackgroundSoundType): string => {
  switch (type) {
    case "white-noise":
      return "https://assets.mixkit.co/sfx/preview/mixkit-white-noise-ambience-702.mp3";
    case "rain":
      return "https://assets.mixkit.co/sfx/preview/mixkit-rain-ambience-light-1252.mp3";
    case "ocean":
      return "https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-ambience-1189.mp3";
    case "forest":
      return "https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3";
    case "fireplace":
      return "https://assets.mixkit.co/sfx/preview/mixkit-campfire-crackles-1330.mp3";
    case "birds":
      return "https://assets.mixkit.co/sfx/preview/mixkit-morning-birds-singing-2472.mp3";
    case "stream":
      return "https://assets.mixkit.co/sfx/preview/mixkit-small-stream-running-loop-1248.mp3";
    case "meditation":
      return "https://assets.mixkit.co/sfx/preview/mixkit-meditation-bell-595.mp3";
    case "brown-noise":
      return "https://assets.mixkit.co/sfx/preview/mixkit-dense-static-noise-2132.mp3";
    case "pink-noise":
      return "https://assets.mixkit.co/sfx/preview/mixkit-rain-and-thunder-storm-2390.mp3";
    default:
      return "";
  }
};

/**
 * Play binaural beat with the specified frequencies
 * @param leftFrequency - Frequency for the left ear (Hz)
 * @param rightFrequency - Frequency for the right ear (Hz)
 * @param duration - Duration in milliseconds
 * @param volume - Volume from 0 to 1
 * @param backgroundType - Type of background sound
 * @param backgroundVolume - Volume for background sound from 0 to 1
 * @returns Success status
 */
export const playBinauralBeat = async (
  leftFrequency: number,
  rightFrequency: number,
  duration: number = 300000, // Default 5 minutes
  volume: number = 0.5,
  backgroundType: BackgroundSoundType = "none",
  backgroundVolume: number = 0.3
): Promise<boolean> => {
  try {
    // Clean up any existing audio first
    stopAllAudio();

    // Create audio context
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContext = new AudioContextClass();

    // Create stereo panner for left channel
    const pannerLeft = audioContext.createStereoPanner();
    pannerLeft.pan.value = -1; // Full left

    // Create stereo panner for right channel
    const pannerRight = audioContext.createStereoPanner();
    pannerRight.pan.value = 1; // Full right

    // Create gain node for volume control
    binauralGainNode = audioContext.createGain();
    binauralGainNode.gain.value = volume;

    // Create oscillators
    binauralOscillatorLeft = audioContext.createOscillator();
    binauralOscillatorLeft.type = "sine";
    binauralOscillatorLeft.frequency.value = leftFrequency;

    binauralOscillatorRight = audioContext.createOscillator();
    binauralOscillatorRight.type = "sine";
    binauralOscillatorRight.frequency.value = rightFrequency;

    // Connect nodes
    binauralOscillatorLeft.connect(pannerLeft);
    binauralOscillatorRight.connect(pannerRight);
    pannerLeft.connect(binauralGainNode);
    pannerRight.connect(binauralGainNode);
    binauralGainNode.connect(audioContext.destination);

    // Start oscillators
    binauralOscillatorLeft.start();
    binauralOscillatorRight.start();

    // Add background sound if selected
    if (backgroundType !== "none") {
      const soundUrl = getBackgroundSoundUrl(backgroundType);
      if (soundUrl) {
        backgroundAudioElement = new Audio(soundUrl);
        backgroundAudioElement.loop = true;
        backgroundAudioElement.volume = backgroundVolume;
        try {
          await backgroundAudioElement.play();
        } catch (error) {
          console.error("Error playing background sound:", error);
          // Continue with binaural beat even if background fails
        }
      }
    }

    // Set duration timer if specified
    if (duration && duration > 0) {
      setTimeout(() => {
        stopAllAudio();
      }, duration);
    }

    return true;
  } catch (error) {
    console.error("Error creating binaural beat:", error);
    stopAllAudio();
    return false;
  }
};

/**
 * Update the volume of the binaural beat
 * @param volume - Volume from 0 to 1
 */
export const updateBinauralVolume = (volume: number) => {
  if (binauralGainNode) {
    binauralGainNode.gain.value = volume;
  }
};

/**
 * Update the volume of the background sound
 * @param volume - Volume from 0 to 1
 */
export const updateBackgroundVolume = (volume: number) => {
  if (backgroundAudioElement) {
    backgroundAudioElement.volume = volume;
  }
};

// Função para gerar um tom para simular a reprodução de áudio
export const generateFallbackTone = (duration = 1000, frequency = 440) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 0.1); // Volume amplificado
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + (duration / 1000));
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    setTimeout(() => { oscillator.stop(); audioCtx.close(); }, duration);
    
    return true;
  } catch (error) {
    console.error("Erro ao gerar tom de fallback:", error);
    return false;
  }
};

// Verificar se um URL de áudio está acessível
export const checkAudioUrl = async (url: string): Promise<boolean> => {
  try {
    if (!url) return false;
    
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    return true; // Se não der erro, presumimos que está ok (devido a no-cors)
  } catch (error) {
    console.warn(`URL de áudio inacessível: ${url}`, error);
    return false;
  }
};

// URLs de fallback para áudios
export const audioFallbackUrls: Record<string, string> = {
  default: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3", // Música genérica
  infantil: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1ebd.mp3", // Música infantil
};

// NOVAS FUNÇÕES TEA-OPTIMIZED
/**
 * Pré-carregar samples de instrumentos para melhor performance
 */
export const preloadInstrumentAudio = async (instrument: "bell" | "xylophone" | "keyboard"): Promise<void> => {
  try {
    await realAudioService.preloadInstrumentSamples(instrument);
    console.log(`✅ TEA-optimized audio samples preloaded for ${instrument}`);
  } catch (error) {
    console.warn(`⚠️ Failed to preload ${instrument} samples:`, error);
  }
};

/**
 * Verificar status do cache de áudio
 */
export const getAudioCacheStatus = () => {
  return realAudioService.getCacheInfo();
};

/**
 * Limpar cache de áudio se necessário
 */
export const clearAudioCache = () => {
  realAudioService.clearCache();
};
