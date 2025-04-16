
// Map of note keys to their frequencies in Hz
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
 * Plays a sound for a given note
 * @param noteKey The key of the note to play
 */
export const playNoteSound = (noteKey: string) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();
    
    // Create oscillator for tone generation
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    
    // Get the frequency for the note
    const frequency = noteFrequencies[noteKey] || 440; // Default to A 440Hz if not found
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    // Create a gain node for volume control
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // Start at 30% volume
    
    // Fade out the sound
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.8);
    
    // Connect the nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Track the audio nodes
    activeAudioNodes.push(oscillator);
    activeAudioNodes.push(gainNode);
    
    // Start and stop the oscillator
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.8);
    
    // Clean up nodes after they're done
    oscillator.onended = () => {
      // Remove from active nodes list
      const oscillatorIndex = activeAudioNodes.indexOf(oscillator);
      if (oscillatorIndex !== -1) {
        activeAudioNodes.splice(oscillatorIndex, 1);
      }
      
      const gainIndex = activeAudioNodes.indexOf(gainNode);
      if (gainIndex !== -1) {
        activeAudioNodes.splice(gainIndex, 1);
      }
      
      // Close audio context to free up resources
      if (audioContext.state !== 'closed') {
        setTimeout(() => {
          audioContext.close();
        }, 100);
      }
    };
  } catch (error) {
    console.error("Error playing note sound:", error);
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
