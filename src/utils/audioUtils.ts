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
 * NOVO: Enhanced note sound com integração de áudio real para TEA-Hero
 * Prioriza áudio real, com fallback para síntese avançada
 */
export const playNoteSound = async (noteKey: string, instrument?: "bell" | "xylophone" | "keyboard") => {
  try {
    // Determinar frequência
    let frequency: number;
    
    if (noteKey.includes('Hz')) {
      frequency = parseFloat(noteKey.replace('Hz', ''));
    } else {
      frequency = noteFrequencies[noteKey] || 440;
    }

    // NOVA ABORDAGEM: Tentar áudio real primeiro
    if (instrument) {
      console.log(`🎵 Attempting real audio for ${instrument} at ${frequency}Hz`);
      
      try {
        const success = await playInstrumentNote(instrument, frequency, 0.9, 0.8);
        if (success) {
          console.log(`✅ Real audio played successfully: ${instrument} - ${frequency}Hz`);
          return;
        }
      } catch (error) {
        console.warn(`⚠️ Real audio failed for ${instrument}, falling back to synthesis:`, error);
      }
    }

    // FALLBACK: Síntese melhorada para categoria infantil
    console.log(`🔄 Using enhanced synthesis fallback for ${frequency}Hz`);
    
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();
    
    // Configuração otimizada baseada no instrumento
    let waveType: OscillatorType = 'triangle';
    let baseVolume = 0.9; // Volume aumentado para categoria infantil
    
    if (instrument === 'bell') {
      waveType = 'sine'; // Sinos mais puros
      baseVolume = 1.0; // Volume máximo para sinos
    } else if (instrument === 'xylophone') {
      waveType = 'square'; // Xilofones mais percussivos
      baseVolume = 0.95;
    } else if (instrument === 'keyboard') {
      waveType = 'triangle'; // Teclado mais suave mas destacado
      baseVolume = 0.9;
    }
    
    // OSCILADOR PRINCIPAL melhorado
    const oscillator = audioContext.createOscillator();
    oscillator.type = waveType;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    // ENVELOPE ADSR OTIMIZADO para categoria infantil - mais destacado
    const gainNode = audioContext.createGain();
    const attackTime = 0.01;  // Attack muito rápido
    const decayTime = 0.05;   // Decay rápido
    const sustainLevel = 0.8; // Sustain alto para melhor percepção
    const releaseTime = 0.7;  // Release mais longo para ouvir bem
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(baseVolume, audioContext.currentTime + attackTime);
    gainNode.gain.exponentialRampToValueAtTime(sustainLevel, audioContext.currentTime + attackTime + decayTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + attackTime + decayTime + releaseTime);
    
    // HARMÔNICOS ENRIQUECIDOS para sons mais destacados
    const harmonic2 = audioContext.createOscillator();
    const harmonic2Gain = audioContext.createGain();
    harmonic2.type = 'sine';
    harmonic2.frequency.setValueAtTime(frequency * 2, audioContext.currentTime);
    harmonic2Gain.gain.setValueAtTime(0.4, audioContext.currentTime); // Harmônico mais presente
    harmonic2Gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + attackTime + decayTime + releaseTime);
    
    const harmonic3 = audioContext.createOscillator();
    const harmonic3Gain = audioContext.createGain();
    harmonic3.type = 'sine';
    harmonic3.frequency.setValueAtTime(frequency * 3, audioContext.currentTime);
    harmonic3Gain.gain.setValueAtTime(0.2, audioContext.currentTime);
    harmonic3Gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + attackTime + decayTime + releaseTime);
    
    // COMPRESSOR APRIMORADO para sons mais consistentes e audíveis
    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-15, audioContext.currentTime); // Threshold mais alto
    compressor.knee.setValueAtTime(35, audioContext.currentTime);
    compressor.ratio.setValueAtTime(10, audioContext.currentTime); // Compressão mais agressiva
    compressor.attack.setValueAtTime(0.001, audioContext.currentTime);
    compressor.release.setValueAtTime(0.1, audioContext.currentTime);
    
    // FILTRO PASSA-ALTAS para clareza (especialmente para TEA)
    const highpassFilter = audioContext.createBiquadFilter();
    highpassFilter.type = 'highpass';
    highpassFilter.frequency.setValueAtTime(80, audioContext.currentTime);
    highpassFilter.Q.setValueAtTime(0.5, audioContext.currentTime);
    
    // FILTRO PASSA-BAIXAS para suavizar
    const lowpassFilter = audioContext.createBiquadFilter();
    lowpassFilter.type = 'lowpass';
    lowpassFilter.frequency.setValueAtTime(frequency * 4, audioContext.currentTime);
    lowpassFilter.Q.setValueAtTime(1.5, audioContext.currentTime);
    
    // REVERB melhorado para profundidade
    const delayNode = audioContext.createDelay();
    const delayGain = audioContext.createGain();
    delayNode.delayTime.value = 0.05; // Delay mais curto
    delayGain.gain.value = 0.3; // Reverb mais presente
    
    // Conectar todos os nós em cadeia otimizada
    oscillator.connect(gainNode);
    harmonic2.connect(harmonic2Gain);
    harmonic3.connect(harmonic3Gain);
    
    gainNode.connect(highpassFilter);
    harmonic2Gain.connect(highpassFilter);
    harmonic3Gain.connect(highpassFilter);
    
    highpassFilter.connect(lowpassFilter);
    lowpassFilter.connect(compressor);
    compressor.connect(audioContext.destination);
    
    // Adicionar reverb
    compressor.connect(delayNode);
    delayNode.connect(delayGain);
    delayGain.connect(audioContext.destination);
    
    // Rastrear nós de áudio
    activeAudioNodes.push(oscillator, gainNode, harmonic2, harmonic2Gain, harmonic3, harmonic3Gain, compressor, highpassFilter, lowpassFilter, delayNode, delayGain);
    
    // Iniciar e parar osciladores
    const totalDuration = attackTime + decayTime + releaseTime;
    oscillator.start();
    harmonic2.start();
    harmonic3.start();
    
    oscillator.stop(audioContext.currentTime + totalDuration);
    harmonic2.stop(audioContext.currentTime + totalDuration);
    harmonic3.stop(audioContext.currentTime + totalDuration);
    
    console.log(`🎵 Enhanced fallback synthesis: ${noteKey} at ${frequency}Hz with ${waveType} wave + rich harmonics`);
    
    // Limpeza após conclusão
    oscillator.onended = () => {
      [oscillator, gainNode, harmonic2, harmonic2Gain, harmonic3, harmonic3Gain, compressor, highpassFilter, lowpassFilter, delayNode, delayGain].forEach(node => {
        const index = activeAudioNodes.indexOf(node);
        if (index !== -1) {
          activeAudioNodes.splice(index, 1);
        }
      });
      
      if (audioContext.state !== 'closed') {
        setTimeout(() => {
          audioContext.close();
        }, 100);
      }
    };

  } catch (error) {
    console.error("Error playing enhanced note sound:", error);
    try {
      generateFallbackTone(500, parseFloat(noteKey.replace('Hz', '')) || 440);
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
    
    // Fade in
    gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.1);
    
    // Fade out
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + (duration / 1000));
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    
    setTimeout(() => {
      oscillator.stop();
      audioCtx.close();
    }, duration);
    
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

// NOVAS FUNÇÕES para integração com serviço de áudio real

/**
 * Pré-carregar samples de instrumentos para melhor performance
 */
export const preloadInstrumentAudio = async (instrument: "bell" | "xylophone" | "keyboard"): Promise<void> => {
  try {
    await realAudioService.preloadInstrumentSamples(instrument);
    console.log(`✅ Audio samples preloaded for ${instrument}`);
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
