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

// AudioContext singleton to prevent multiple instances
let audioContext: AudioContext | null = null;
let currentOscillators: OscillatorNode[] = [];
let currentGainNodes: GainNode[] = [];

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
 * @param carrierFreq The base frequency in Hz (typically 100-500 Hz)
 * @param beatFreq The difference between the two tones to create the binaural beat (desired brainwave Hz)
 * @param duration Duration in milliseconds
 * @param volume Volume from 0 to 1
 */
export const playBinauralBeat = (carrierFreq: number = 200, beatFreq: number = 10, duration: number = 60000, volume: number = 0.5) => {
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
    
    // Set frequencies - one oscillator is at carrier frequency, the other is at carrier + beat
    leftOscillator.frequency.value = carrierFreq;
    rightOscillator.frequency.value = carrierFreq + beatFreq;
    
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
  
  // Clear the arrays
  currentOscillators = [];
  currentGainNodes = [];
};
