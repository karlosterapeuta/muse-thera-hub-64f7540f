// Sistema de áudio TEA-HERO CORRIGIDO e SINCRONIZADO

// Frequências EXATAS sincronizadas com lanes do jogo
const noteFrequencies: Record<string, number> = {
  // Sino (Bell) - C4 a B4
  "C": 261.63, "D": 293.66, "E": 329.63, "F": 349.23, "G": 392.00, "A": 440.00, "B": 493.88,
  // Xilofone - C5 a B5  
  "C5": 523.25, "D5": 587.33, "E5": 659.25, "F5": 698.46, "G5": 783.99, "A5": 880.00, "B5": 987.77,
  // Piano/Keyboard - C4 a B4 (mesmo que sino)
  "C4": 261.63, "D4": 293.66, "E4": 329.63, "F4": 349.23, "G4": 392.00, "A4": 440.00, "B4": 493.88,
};

import { playInstrumentNote, realAudioService } from '@/services/realAudioService';

// FUNÇÃO PRINCIPAL - TEA-OPTIMIZED
export const playNoteSound = async (noteKey: string, instrument?: "bell" | "xylophone" | "keyboard") => {
  try {
    // Determinar frequência CORRIGIDA baseada no instrumento
    let frequency: number;
    
    if (noteKey.includes('Hz')) {
      frequency = parseFloat(noteKey.replace('Hz', ''));
    } else {
      // Mapear nota para frequência CORRETA do instrumento
      if (instrument === 'xylophone') {
        frequency = noteFrequencies[noteKey + '5'] || noteFrequencies[noteKey] || 523.25;
      } else {
        frequency = noteFrequencies[noteKey] || 261.63;
      }
    }

    // USAR SÍNTESE TEA-OPTIMIZADA
    if (instrument) {
      console.log(`🎵 TEA-Hero: Playing ${instrument} at ${frequency}Hz`);
      
      const success = await playInstrumentNote(instrument, frequency, 1.2, 1.5);
      if (success) {
        console.log(`✅ TEA audio success: ${instrument} - ${frequency}Hz`);
        return;
      }
    }

    // FALLBACK: Síntese BÁSICA mas OTIMIZADA
    console.log(`🔄 TEA fallback synthesis for ${frequency}Hz`);
    
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();
    
    // CONFIGURAÇÃO TEA-ESPECÍFICA
    let waveType: OscillatorType = 'triangle';
    let teaVolume = 1.4; // Volume amplificado para TEA
    
    if (instrument === 'bell') {
      waveType = 'sine';
      teaVolume = 1.6;
    } else if (instrument === 'xylophone') {
      waveType = 'square';
      teaVolume = 1.5;
    } else if (instrument === 'keyboard') {
      waveType = 'sawtooth';
      teaVolume = 1.4;
    }
    
    // Oscilador PRINCIPAL
    const oscillator = audioContext.createOscillator();
    oscillator.type = waveType;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    // Envelope ADSR para TEA
    const gainNode = audioContext.createGain();
    const attackTime = 0.002;
    const decayTime = 0.015;
    const sustainLevel = 0.95;
    const releaseTime = 1.2;
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(teaVolume, audioContext.currentTime + attackTime);
    gainNode.gain.exponentialRampToValueAtTime(sustainLevel, audioContext.currentTime + attackTime + decayTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + attackTime + decayTime + releaseTime);
    
    // COMPRESSOR para consistência
    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-6, audioContext.currentTime);
    compressor.ratio.setValueAtTime(15, audioContext.currentTime);
    compressor.attack.setValueAtTime(0.0001, audioContext.currentTime);
    compressor.release.setValueAtTime(0.04, audioContext.currentTime);
    
    // EQ para clareza
    const filter = audioContext.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.setValueAtTime(frequency * 1.5, audioContext.currentTime);
    filter.Q.setValueAtTime(2, audioContext.currentTime);
    filter.gain.setValueAtTime(6, audioContext.currentTime);
    
    // Conectar
    oscillator.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(compressor);
    compressor.connect(audioContext.destination);
    
    const totalDuration = attackTime + decayTime + releaseTime;
    oscillator.start();
    oscillator.stop(audioContext.currentTime + totalDuration);
    
    console.log(`🔊 TEA fallback: ${noteKey} at ${frequency}Hz with ${waveType}`);
    
    oscillator.onended = () => {
      if (audioContext.state !== 'closed') {
        setTimeout(() => { audioContext.close(); }, 100);
      }
    };

  } catch (error) {
    console.error("TEA audio completely failed:", error);
  }
};

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

// NOVA função para pré-carregar áudio por instrumento
export const preloadInstrumentAudio = async (instrument: "bell" | "xylophone" | "keyboard"): Promise<void> => {
  try {
    console.log(`🎵 Initializing TEA audio for ${instrument}...`);
    // Por enquanto só inicializa o serviço
    await realAudioService.playOptimizedAudio({
      instrument,
      note: 'C',
      frequency: instrument === 'xylophone' ? 523.25 : 261.63,
      volume: 0.01, // Volume mínimo para teste
      duration: 0.01
    });
    console.log(`✅ TEA audio ready for ${instrument}`);
  } catch (error) {
    console.warn(`⚠️ TEA audio preload failed for ${instrument}:`, error);
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
