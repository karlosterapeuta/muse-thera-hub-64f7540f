
// Map of notes to their frequencies in Hz
const noteFrequencies: Record<string, number> = {
  "C1": 261.63, // C4 (middle C)
  "D": 293.66,  // D4
  "E": 329.63,  // E4
  "F": 349.23,  // F4
  "G": 392.00,  // G4
  "A": 440.00,  // A4
  "B": 493.88,  // B4
  "C8": 523.25  // C5
};

// TEA and mental health optimized frequencies
export const therapeuticFrequencies = {
  autism: {
    alpha: { left: 200, right: 205, description: "Auxilia na redução da ansiedade e melhora o foco em indivíduos com TEA." },
    theta: { left: 180, right: 187, description: "Promove relaxamento e pode ajudar com hipersensibilidade sensorial." },
    delta: { left: 130, right: 133, description: "Pode auxiliar na melhoria do sono e redução da agitação em casos de TEA." }
  },
  mentalHealth: {
    anxiety: { left: 300, right: 310, description: "Frequência que ajuda a reduzir a ansiedade e acalmar a mente." },
    depression: { left: 220, right: 228, description: "Promove sensação de bem-estar e pode auxiliar em quadros depressivos." },
    adhd: { left: 250, right: 258, description: "Auxilia na melhoria do foco e concentração em casos de TDAH." },
    stress: { left: 150, right: 158, description: "Redução do estresse e tensão, promovendo relaxamento profundo." }
  }
};

// Background sound types
export type BackgroundSoundType = 'rain' | 'whitenoise' | 'ocean' | 'forest' | 'none';

// AudioContext singleton to prevent multiple instances
let audioContext: AudioContext | null = null;
let currentOscillators: OscillatorNode[] = [];
let currentGainNodes: GainNode[] = [];
let backgroundSoundNode: AudioBufferSourceNode | null = null;
let backgroundGainNode: GainNode | null = null;

/**
 * Plays a musical note with the given frequency
 */
export const playNoteSound = (note: string, duration: number = 500) => {
  try {
    // Initialize AudioContext if it doesn't exist
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Check if the context is suspended (browser autoplay policy) and resume it
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    // Get the frequency for the requested note
    const frequency = noteFrequencies[note];
    if (!frequency) {
      console.warn(`Unknown note: ${note}`);
      return;
    }
    
    // Create an oscillator for generating the tone
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Configure the oscillator
    oscillator.type = 'sine'; // Sine wave for a pure tone
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    // Configure the gain (volume) node with a slight fade-out
    gainNode.gain.setValueAtTime(0.6, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);
    
    // Connect the nodes to the audio output
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Keep track of active oscillators
    currentOscillators.push(oscillator);
    currentGainNodes.push(gainNode);
    
    // Play the note and stop after duration
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration / 1000);

    return true;
  } catch (error) {
    console.error("Error playing audio:", error);
    return false;
  }
};

/**
 * Plays a binaural beat with the specified carrier frequency and beat frequency
 * @param leftFreq The frequency for the left ear in Hz
 * @param rightFreq The frequency for the right ear in Hz
 * @param duration Duration in milliseconds (default 15min)
 * @param volume Volume from 0 to 1
 * @param backgroundSound Optional background sound to play
 * @param backgroundVolume Volume of the background sound (0 to 1)
 */
export const playBinauralBeat = (
  leftFreq: number = 200, 
  rightFreq: number = 205, 
  duration: number = 900000, // 15 minutes default
  volume: number = 0.5,
  backgroundSound: BackgroundSoundType = 'none',
  backgroundVolume: number = 0.3
) => {
  try {
    // Stop any currently playing audio
    stopAllAudio();
    
    // Initialize AudioContext if it doesn't exist
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Check if the context is suspended (browser autoplay policy) and resume it
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    // Create two oscillators for the binaural beat
    const leftOscillator = audioContext.createOscillator();
    const rightOscillator = audioContext.createOscillator();
    
    const leftGain = audioContext.createGain();
    const rightGain = audioContext.createGain();
    
    // Set frequencies - each ear gets its specific frequency
    leftOscillator.frequency.value = leftFreq;
    rightOscillator.frequency.value = rightFreq;
    
    // Set oscillator type
    leftOscillator.type = 'sine';
    rightOscillator.type = 'sine';
    
    // Set volume
    leftGain.gain.value = volume;
    rightGain.gain.value = volume;
    
    // Create a stereo panner for left channel
    const leftPanner = audioContext.createStereoPanner();
    leftPanner.pan.value = -1; // Full left
    
    // Create a stereo panner for right channel
    const rightPanner = audioContext.createStereoPanner();
    rightPanner.pan.value = 1; // Full right
    
    // Connect left oscillator to left ear
    leftOscillator.connect(leftGain);
    leftGain.connect(leftPanner);
    leftPanner.connect(audioContext.destination);
    
    // Connect right oscillator to right ear
    rightOscillator.connect(rightGain);
    rightGain.connect(rightPanner);
    rightPanner.connect(audioContext.destination);
    
    // Keep track of active oscillators and gain nodes
    currentOscillators.push(leftOscillator, rightOscillator);
    currentGainNodes.push(leftGain, rightGain);
    
    // Add background sound if selected
    if (backgroundSound !== 'none') {
      loadBackgroundSound(backgroundSound, backgroundVolume);
    }
    
    // Start the oscillators
    leftOscillator.start();
    rightOscillator.start();
    
    // Stop after duration if specified
    if (duration > 0) {
      leftOscillator.stop(audioContext.currentTime + duration / 1000);
      rightOscillator.stop(audioContext.currentTime + duration / 1000);
    }
    
    return true;
  } catch (error) {
    console.error("Error playing binaural beat:", error);
    return false;
  }
};

/**
 * Loads and plays a background sound
 */
const loadBackgroundSound = async (soundType: BackgroundSoundType, volume: number = 0.3) => {
  if (!audioContext) return;
  
  let soundUrl = '';
  
  // Map sound type to URL
  switch (soundType) {
    case 'rain':
      soundUrl = '/lovable-uploads/rain-sound.mp3';
      break;
    case 'whitenoise':
      soundUrl = '/lovable-uploads/white-noise.mp3';
      break;
    case 'ocean':
      soundUrl = '/lovable-uploads/ocean-waves.mp3';
      break;
    case 'forest':
      soundUrl = '/lovable-uploads/forest-ambience.mp3';
      break;
    default:
      return; // No sound to load
  }
  
  try {
    // Fetch the audio file
    const response = await fetch(soundUrl);
    const arrayBuffer = await response.arrayBuffer();
    
    // Decode the audio data
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Create source and gain nodes
    backgroundSoundNode = audioContext.createBufferSource();
    backgroundGainNode = audioContext.createGain();
    
    // Configure nodes
    backgroundSoundNode.buffer = audioBuffer;
    backgroundSoundNode.loop = true;
    backgroundGainNode.gain.value = volume;
    
    // Connect nodes
    backgroundSoundNode.connect(backgroundGainNode);
    backgroundGainNode.connect(audioContext.destination);
    
    // Start playback
    backgroundSoundNode.start();
  } catch (error) {
    console.error("Error loading background sound:", error);
  }
};

/**
 * Update the background sound volume
 */
export const updateBackgroundVolume = (volume: number) => {
  if (backgroundGainNode) {
    backgroundGainNode.gain.value = volume;
  }
};

/**
 * Update the binaural beat volume
 */
export const updateBinauralVolume = (volume: number) => {
  currentGainNodes.forEach(gain => {
    gain.gain.value = volume;
  });
};

/**
 * Stops all audio playback
 */
export const stopAllAudio = () => {
  if (!audioContext) return;
  
  // Stop and disconnect all active oscillators
  currentOscillators.forEach(osc => {
    try {
      osc.stop();
      osc.disconnect();
    } catch (e) {
      // Ignore errors from already stopped oscillators
    }
  });
  
  // Disconnect all gain nodes
  currentGainNodes.forEach(gain => {
    try {
      gain.disconnect();
    } catch (e) {
      // Ignore errors
    }
  });
  
  // Stop and disconnect background sound if playing
  if (backgroundSoundNode) {
    try {
      backgroundSoundNode.stop();
      backgroundSoundNode.disconnect();
      backgroundSoundNode = null;
    } catch (e) {
      // Ignore errors
    }
  }
  
  if (backgroundGainNode) {
    try {
      backgroundGainNode.disconnect();
      backgroundGainNode = null;
    } catch (e) {
      // Ignore errors
    }
  }
  
  // Clear the arrays
  currentOscillators = [];
  currentGainNodes = [];
};
