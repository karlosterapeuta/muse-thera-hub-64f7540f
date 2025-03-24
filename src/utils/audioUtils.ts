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

// Background sound file sources with multiple formats for better compatibility and guaranteed fallbacks
const backgroundSoundSources = {
  rain: {
    mp3: '/lovable-uploads/rain-sound.mp3',
    ogg: '/lovable-uploads/rain-sound.ogg',
    fallback: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3'
  },
  whitenoise: {
    mp3: '/lovable-uploads/white-noise.mp3',
    ogg: '/lovable-uploads/white-noise.ogg',
    fallback: 'https://assets.mixkit.co/sfx/preview/mixkit-white-noise-ambience-loop-1236.mp3'
  },
  ocean: {
    mp3: '/lovable-uploads/ocean-waves.mp3',
    ogg: '/lovable-uploads/ocean-waves.ogg',
    fallback: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_1b0cd1027c.mp3?filename=ocean-waves-113997.mp3'
  },
  forest: {
    mp3: '/lovable-uploads/forest-ambience.mp3',
    ogg: '/lovable-uploads/forest-ambience.ogg',
    fallback: 'https://cdn.pixabay.com/download/audio/2021/10/11/audio_fd69c1e9ef.mp3?filename=forest-0-7049.mp3'
  }
};

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
  if (!audioContext || soundType === 'none') return;
  
  // Get the sound sources from our mapping
  const soundSources = backgroundSoundSources[soundType as keyof typeof backgroundSoundSources];
  if (!soundSources) return;
  
  try {
    // Try to load the sound in order of preference: MP3, OGG, then fallback
    const soundUrls = [soundSources.mp3, soundSources.ogg, soundSources.fallback];
    let arrayBuffer: ArrayBuffer | null = null;
    let error: Error | null = null;
    let loadedUrl: string = '';
    
    // Try each URL until one works
    for (const url of soundUrls) {
      try {
        console.log(`Attempting to load sound from: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
          console.warn(`Failed to load sound from ${url}: ${response.status} ${response.statusText}`);
          continue;
        }
        arrayBuffer = await response.arrayBuffer();
        loadedUrl = url;
        console.log(`Successfully loaded sound from: ${url}`);
        break; // If we got the buffer, we can stop trying other URLs
      } catch (e) {
        console.warn(`Error fetching from ${url}:`, e);
        error = e instanceof Error ? e : new Error(String(e));
      }
    }
    
    // If we couldn't load any of the sounds, try a special handling for each type
    if (!arrayBuffer) {
      console.warn(`Could not load any sound file for ${soundType}, trying special handling`);
      
      // Special handling for different sound types
      if (soundType === 'whitenoise') {
        createNoiseGenerator(volume);
        return;
      } else if (soundType === 'rain') {
        // Try a different rain sound
        const alternateRainUrl = 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_628dbb0733.mp3?filename=light-rain-ambient-114354.mp3';
        await tryAlternateSound(alternateRainUrl, volume);
        return;
      } else if (soundType === 'ocean') {
        // Try a different ocean sound
        const alternateOceanUrl = 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_1b0cd1027c.mp3?filename=ocean-waves-113997.mp3';
        await tryAlternateSound(alternateOceanUrl, volume);
        return;
      } else if (soundType === 'forest') {
        // Try a different forest sound
        const alternateForestUrl = 'https://cdn.pixabay.com/download/audio/2021/10/11/audio_fd69c1e9ef.mp3?filename=forest-0-7049.mp3';
        await tryAlternateSound(alternateForestUrl, volume);
        return;
      }
      
      throw error || new Error(`Could not load any sound file for ${soundType}`);
    }
    
    // Decode the audio data
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Stop any currently playing background sound
    if (backgroundSoundNode) {
      try {
        backgroundSoundNode.stop();
        backgroundSoundNode.disconnect();
      } catch (e) {
        // Ignore errors from already stopped sources
      }
    }
    
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
    console.log(`Background sound started: ${soundType} (from ${loadedUrl})`);
  } catch (error) {
    console.error("Error loading background sound:", error);
    
    // Fallback to creating a simple noise if all else fails
    if (soundType === 'whitenoise') {
      try {
        createNoiseGenerator(volume);
      } catch (e) {
        console.error("Error creating noise generator:", e);
      }
    } else {
      // For non-whitenoise types, create a more appropriate fallback
      createFallbackSound(soundType, volume);
    }
  }
};

/**
 * Tries to load and play an alternate sound URL
 */
const tryAlternateSound = async (url: string, volume: number) => {
  if (!audioContext) return false;
  
  try {
    console.log(`Trying alternate sound URL: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to load alternate sound: ${response.status} ${response.statusText}`);
      return false;
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Stop any currently playing background sound
    if (backgroundSoundNode) {
      try {
        backgroundSoundNode.stop();
        backgroundSoundNode.disconnect();
      } catch (e) {
        // Ignore errors from already stopped sources
      }
    }
    
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
    console.log(`Alternate background sound started from: ${url}`);
    return true;
  } catch (e) {
    console.error("Error loading alternate sound:", e);
    return false;
  }
};

/**
 * Creates a fallback sound appropriate for the selected sound type
 */
const createFallbackSound = (soundType: BackgroundSoundType, volume: number) => {
  if (!audioContext) return;
  
  console.log(`Creating fallback sound for: ${soundType}`);
  
  // Create appropriate noise type based on the requested sound
  const bufferSize = 2 * audioContext.sampleRate;
  const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  
  // Fill the buffer with appropriate noise pattern
  if (soundType === 'rain') {
    // Rain-like pattern: random with some patterns
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 0.5 - 0.25; // Quieter than white noise
      // Add occasional louder drops
      if (Math.random() > 0.995) {
        output[i] = Math.random() * 0.8 - 0.4;
      }
    }
  } 
  else if (soundType === 'ocean') {
    // Ocean-like pattern: lower frequency variations
    let value = 0;
    for (let i = 0; i < bufferSize; i++) {
      // Add slow-varying component to simulate waves
      const waveComponent = Math.sin(i * 0.0001) * 0.15;
      value += (Math.random() * 0.14 - 0.07);
      value = Math.min(0.8, Math.max(-0.8, value)); // Limit the amplitude
      output[i] = value + waveComponent;
    }
  } 
  else if (soundType === 'forest') {
    // Forest-like pattern: mostly quiet with occasional sounds
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 0.1 - 0.05; // Very quiet base
      // Add occasional bird chirps or rustling
      if (Math.random() > 0.997) {
        for (let j = 0; j < 1000 && i + j < bufferSize; j++) {
          output[i+j] = Math.sin(j * 0.1) * 0.3 * Math.exp(-j * 0.01);
        }
      }
    }
  } 
  else {
    // Default white noise for other types
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
  }
  
  // Create the source and gain nodes
  backgroundSoundNode = audioContext.createBufferSource();
  backgroundGainNode = audioContext.createGain();
  
  // Configure the nodes
  backgroundSoundNode.buffer = noiseBuffer;
  backgroundSoundNode.loop = true;
  backgroundGainNode.gain.value = volume;
  
  // Connect the nodes
  backgroundSoundNode.connect(backgroundGainNode);
  backgroundGainNode.connect(audioContext.destination);
  
  // Start playback
  backgroundSoundNode.start();
  console.log(`Fallback ${soundType} generator started`);
};

/**
 * Creates a simple noise generator as a fallback for white noise
 */
const createNoiseGenerator = (volume: number = 0.3) => {
  if (!audioContext) return;
  
  // Create a noise source with an audio buffer
  const bufferSize = 2 * audioContext.sampleRate;
  const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  
  // Fill the buffer with noise
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  
  // Create the source and gain nodes
  backgroundSoundNode = audioContext.createBufferSource();
  backgroundGainNode = audioContext.createGain();
  
  // Configure the nodes
  backgroundSoundNode.buffer = noiseBuffer;
  backgroundSoundNode.loop = true;
  backgroundGainNode.gain.value = volume;
  
  // Connect the nodes
  backgroundSoundNode.connect(backgroundGainNode);
  backgroundGainNode.connect(audioContext.destination);
  
  // Start playback
  backgroundSoundNode.start();
  console.log("Fallback white noise generator started");
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
