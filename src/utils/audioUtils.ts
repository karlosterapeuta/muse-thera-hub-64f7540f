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
export type BackgroundSoundType = 'rain' | 'white-noise' | 'ocean' | 'forest' | 'birds' | 'fireplace' | 'stream' | 'meditation' | 'brown-noise' | 'pink-noise' | 'none';

// Background sound file sources with multiple formats for better compatibility and guaranteed fallbacks
const backgroundSoundSources = {
  rain: {
    mp3: '/lovable-uploads/rain-sound.mp3',
    ogg: '/lovable-uploads/rain-sound.ogg',
    fallback: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3'
  },
  'white-noise': {
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
  },
  birds: {
    mp3: '/lovable-uploads/birds-chirping.mp3',
    ogg: '/lovable-uploads/birds-chirping.ogg',
    fallback: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_468a398e7a.mp3?filename=forest-birdsong-02-6791.mp3'
  },
  fireplace: {
    mp3: '/lovable-uploads/fireplace.mp3',
    ogg: '/lovable-uploads/fireplace.ogg',
    fallback: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_942b4348cf.mp3?filename=fireplace-crackling-64418.mp3'
  },
  stream: {
    mp3: '/lovable-uploads/stream-water.mp3',
    ogg: '/lovable-uploads/stream-water.ogg',
    fallback: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_87429b2ce7.mp3?filename=mountain-river-127689.mp3'
  },
  meditation: {
    mp3: '/lovable-uploads/meditation-music.mp3',
    ogg: '/lovable-uploads/meditation-music.ogg',
    fallback: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_ba00cb8992.mp3?filename=meditation-lotus-flower-110557.mp3'
  },
  'brown-noise': {
    mp3: '/lovable-uploads/brown-noise.mp3',
    ogg: '/lovable-uploads/brown-noise.ogg',
    fallback: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c2b891c6d1.mp3?filename=brown-noise-10min-113986.mp3'
  },
  'pink-noise': {
    mp3: '/lovable-uploads/pink-noise.mp3',
    ogg: '/lovable-uploads/pink-noise.ogg',
    fallback: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c46ec6c002.mp3?filename=pink-noise-10min-113985.mp3'
  }
};

// Additional high-quality fallback URLs
const highQualityFallbacks = {
  rain: [
    'https://cdn.pixabay.com/download/audio/2022/03/15/audio_628dbb0733.mp3?filename=light-rain-ambient-114354.mp3',
    'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d18957018a.mp3?filename=light-rain-110578.mp3',
    'https://cdn.pixabay.com/download/audio/2021/08/09/audio_88447e769a.mp3?filename=rain-and-thunder-16705.mp3'
  ],
  ocean: [
    'https://cdn.pixabay.com/download/audio/2022/03/10/audio_1b0cd1027c.mp3?filename=ocean-waves-113997.mp3',
    'https://cdn.pixabay.com/download/audio/2022/01/18/audio_00fc72b4d0.mp3?filename=ocean-waves-112762.mp3',
    'https://cdn.pixabay.com/download/audio/2022/01/19/audio_eb0991bcb7.mp3?filename=beach-waves-02-111598.mp3'
  ],
  forest: [
    'https://cdn.pixabay.com/download/audio/2021/10/11/audio_fd69c1e9ef.mp3?filename=forest-0-7049.mp3',
    'https://cdn.pixabay.com/download/audio/2021/09/06/audio_ef3896719b.mp3?filename=forest-with-small-river-birds-and-nature-field-recording-6735.mp3',
    'https://cdn.pixabay.com/download/audio/2021/08/09/audio_468a398e7a.mp3?filename=forest-birdsong-02-6791.mp3'
  ],
  'white-noise': [
    'https://assets.mixkit.co/sfx/preview/mixkit-white-noise-ambience-loop-1236.mp3',
    'https://cdn.pixabay.com/download/audio/2022/01/25/audio_5c6b9a3d0d.mp3?filename=white-noise-10min-7112.mp3'
  ],
  birds: [
    'https://cdn.pixabay.com/download/audio/2021/08/09/audio_468a398e7a.mp3?filename=forest-birdsong-02-6791.mp3',
    'https://cdn.pixabay.com/download/audio/2022/10/24/audio_5aa29c9fa5.mp3?filename=birds-19624.mp3',
    'https://cdn.pixabay.com/download/audio/2022/03/15/audio_3bf34cc0ec.mp3?filename=birds-singing-in-spring-114564.mp3'
  ],
  fireplace: [
    'https://cdn.pixabay.com/download/audio/2022/03/15/audio_942b4348cf.mp3?filename=fireplace-crackling-64418.mp3',
    'https://cdn.pixabay.com/download/audio/2021/08/08/audio_dc39bafae4.mp3?filename=fireplace-fire-crackling-loop-7-15970.mp3'
  ],
  stream: [
    'https://cdn.pixabay.com/download/audio/2022/05/16/audio_87429b2ce7.mp3?filename=mountain-river-127689.mp3',
    'https://cdn.pixabay.com/download/audio/2022/03/25/audio_df1d3eb5a7.mp3?filename=creek-mono-115982.mp3'
  ],
  meditation: [
    'https://cdn.pixabay.com/download/audio/2022/01/18/audio_ba00cb8992.mp3?filename=meditation-lotus-flower-110557.mp3',
    'https://cdn.pixabay.com/download/audio/2021/09/30/audio_fce41f8dce.mp3?filename=short-meditation-music-for-anxiety-and-stress-relief-7039.mp3'
  ],
  'brown-noise': [
    'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c2b891c6d1.mp3?filename=brown-noise-10min-113986.mp3'
  ],
  'pink-noise': [
    'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c46ec6c002.mp3?filename=pink-noise-10min-113985.mp3'
  ]
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
  
  console.log(`Attempting to load background sound: ${soundType}`);
  
  // Get the sound sources from our mapping
  const soundSources = backgroundSoundSources[soundType as keyof typeof backgroundSoundSources];
  if (!soundSources) return;
  
  try {
    // First try to load from our fallback URLs
    const fallbackUrls = highQualityFallbacks[soundType as keyof typeof highQualityFallbacks] || [];
    const allSoundUrls = [
      soundSources.mp3, 
      soundSources.ogg, 
      soundSources.fallback,
      ...fallbackUrls
    ];
    
    let audioBuffer: AudioBuffer | null = null;
    let loadedUrl: string = '';
    
    // Try each URL until one works
    for (const url of allSoundUrls) {
      if (!url) continue;
      
      try {
        console.log(`Attempting to load sound from: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
          console.warn(`Failed to load sound from ${url}: ${response.status} ${response.statusText}`);
          continue;
        }
        
        const arrayBuffer = await response.arrayBuffer();
        try {
          audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          loadedUrl = url;
          console.log(`Successfully loaded and decoded sound from: ${url}`);
          break; // If we successfully decoded the buffer, we can stop trying other URLs
        } catch (decodeError) {
          console.warn(`Failed to decode audio from ${url}:`, decodeError);
          // Continue to the next URL
        }
      } catch (e) {
        console.warn(`Error fetching from ${url}:`, e);
      }
    }
    
    // If we couldn't load any of the sounds, create a synthesized version
    if (!audioBuffer) {
      console.warn(`Could not load any sound file for ${soundType}, creating synthesized version`);
      createEnhancedSynthesizedSound(soundType, volume);
      return;
    }
    
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
    
    // Add slight filter to make it sound more natural
    const lowPassFilter = audioContext.createBiquadFilter();
    lowPassFilter.type = 'lowpass';
    lowPassFilter.frequency.value = 2000; // Adjust based on sound type
    
    // Connect nodes with the filter
    backgroundSoundNode.connect(lowPassFilter);
    lowPassFilter.connect(backgroundGainNode);
    backgroundGainNode.connect(audioContext.destination);
    
    // Start playback
    backgroundSoundNode.start();
    console.log(`Background sound started: ${soundType} (from ${loadedUrl})`);
  } catch (error) {
    console.error("Error loading background sound:", error);
    
    // Create synthesized sound as fallback
    createEnhancedSynthesizedSound(soundType, volume);
  }
};

/**
 * Creates high-quality synthesized sounds for different environments
 */
const createEnhancedSynthesizedSound = (soundType: BackgroundSoundType, volume: number = 0.3) => {
  if (!audioContext) return;
  
  console.log(`Creating enhanced synthesized sound for: ${soundType}`);
  
  // Larger buffer size for more natural looping sound (30 seconds at 44.1kHz)
  const sampleRate = audioContext.sampleRate;
  const bufferSize = 30 * sampleRate;
  const noiseBuffer = audioContext.createBuffer(2, bufferSize, sampleRate);
  const leftChannel = noiseBuffer.getChannelData(0);
  const rightChannel = noiseBuffer.getChannelData(1);
  
  if (soundType === 'rain') {
    createRealisticRainSound(leftChannel, rightChannel, sampleRate);
  } 
  else if (soundType === 'ocean') {
    createRealisticOceanSound(leftChannel, rightChannel, sampleRate);
  } 
  else if (soundType === 'forest') {
    createRealisticForestSound(leftChannel, rightChannel, sampleRate);
  } 
  else if (soundType === 'birds') {
    createBirdsSoundscape(leftChannel, rightChannel, sampleRate);
  }
  else if (soundType === 'fireplace') {
    createFireplaceSound(leftChannel, rightChannel, sampleRate);
  }
  else if (soundType === 'stream') {
    createStreamSound(leftChannel, rightChannel, sampleRate);
  }
  else if (soundType === 'meditation') {
    createMeditationSound(leftChannel, rightChannel, sampleRate);
  }
  else if (soundType === 'brown-noise') {
    createBrownNoise(leftChannel, rightChannel);
  }
  else if (soundType === 'pink-noise') {
    createPinkNoise(leftChannel, rightChannel);
  }
  else if (soundType === 'white-noise') {
    createImprovedWhiteNoise(leftChannel, rightChannel);
  }
  
  // Create the source and gain nodes
  backgroundSoundNode = audioContext.createBufferSource();
  backgroundGainNode = audioContext.createGain();
  
  // Add filters to shape the sound
  const lowpass = audioContext.createBiquadFilter();
  lowpass.type = 'lowpass';
  
  const highpass = audioContext.createBiquadFilter();
  highpass.type = 'highpass';
  
  // Configure filters based on sound type
  if (soundType === 'rain') {
    lowpass.frequency.value = 4000;
    highpass.frequency.value = 200;
  } else if (soundType === 'ocean') {
    lowpass.frequency.value = 1000;
    highpass.frequency.value = 100;
  } else if (soundType === 'forest') {
    lowpass.frequency.value = 5000;
    highpass.frequency.value = 300;
  } else {
    lowpass.frequency.value = 8000;
    highpass.frequency.value = 50;
  }
  
  // Configure the nodes
  backgroundSoundNode.buffer = noiseBuffer;
  backgroundSoundNode.loop = true;
  backgroundGainNode.gain.value = volume;
  
  // Connect the nodes with filters
  backgroundSoundNode.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(backgroundGainNode);
  backgroundGainNode.connect(audioContext.destination);
  
  // Start playback
  backgroundSoundNode.start();
  console.log(`Enhanced synthetic ${soundType} sound started`);
};

/**
 * Creates improved white noise with better spectral distribution
 */
const createImprovedWhiteNoise = (leftChannel: Float32Array, rightChannel: Float32Array) => {
  console.log("Creating improved white noise");
  
  for (let i = 0; i < leftChannel.length; i++) {
    // Generate uniform white noise
    const leftSample = Math.random() * 2 - 1;
    const rightSample = Math.random() * 2 - 1;
    
    // Apply slight filtering to make more pleasant
    leftChannel[i] = leftSample * 0.15;
    rightChannel[i] = rightSample * 0.15;
  }
  
  // Normalize to avoid DC offset and clipping
  normalizeAudio(leftChannel, rightChannel);
};

/**
 * Creates realistic rain sound with varied droplet patterns
 */
const createRealisticRainSound = (leftChannel: Float32Array, rightChannel: Float32Array, sampleRate: number) => {
  console.log("Creating realistic rain sound");
  const bufferLength = leftChannel.length;
  
  // Background rain noise (constant soft patter)
  for (let i = 0; i < bufferLength; i++) {
    // Base continuous rain sound (gentle noise)
    const baseNoise = Math.random() * 0.07 - 0.035;
    
    // Add time-varying intensity with slow variations
    const timeVariation = Math.sin(i / sampleRate * 0.05) * 0.03;
    
    leftChannel[i] = baseNoise + timeVariation;
    // Right channel slightly different for stereo effect
    rightChannel[i] = baseNoise + Math.random() * 0.03 - 0.015 + timeVariation;
  }
  
  // Add individual rain droplets (more prominent sound)
  const dropDensity = 0.005; // Controls how many drops we hear
  for (let second = 0; second < bufferLength / sampleRate; second++) {
    // Number of drops varies over time for natural sound
    const dropsThisSecond = Math.floor(Math.random() * 20) + 10;
    
    for (let drop = 0; drop < dropsThisSecond; drop++) {
      // Random position within this second
      const dropPos = Math.floor((second * sampleRate) + Math.random() * sampleRate);
      if (dropPos >= bufferLength - 50) continue;
      
      // Random drop volume
      const dropVolume = Math.random() * 0.4 + 0.1;
      
      // Random stereo position
      const panPosition = Math.random() * 2 - 1; // -1 to 1
      const leftGain = panPosition < 0 ? 1 : 1 - Math.abs(panPosition);
      const rightGain = panPosition > 0 ? 1 : 1 - Math.abs(panPosition);
      
      // Create drop sound (quick attack, short decay)
      for (let j = 0; j < 50; j++) {
        const amplitude = dropVolume * Math.exp(-j * 0.3) * (1 - j/50);
        leftChannel[dropPos + j] += amplitude * leftGain;
        rightChannel[dropPos + j] += amplitude * rightGain;
      }
    }
  }
  
  // Add occasional heavier drops
  for (let i = 0; i < bufferLength; i += sampleRate / 2) { // Every half second approximately
    if (Math.random() > 0.7) { // 30% chance
      const dropPos = i + Math.floor(Math.random() * 10000);
      if (dropPos >= bufferLength - 200) continue;
      
      // Loud drop with longer decay
      const dropVolume = Math.random() * 0.5 + 0.3;
      for (let j = 0; j < 200; j++) {
        const amplitude = dropVolume * Math.exp(-j * 0.1) * (1 - j/200);
        
        // Random panning for this heavy drop
        const pan = Math.random() * 2 - 1;
        if (dropPos + j < bufferLength) {
          leftChannel[dropPos + j] += amplitude * (1 - Math.max(0, pan));
          rightChannel[dropPos + j] += amplitude * (1 - Math.max(0, -pan));
        }
      }
    }
  }
  
  // Normalize to prevent clipping
  normalizeAudio(leftChannel, rightChannel);
};

/**
 * Creates realistic ocean waves sound with proper rhythm
 */
const createRealisticOceanSound = (leftChannel: Float32Array, rightChannel: Float32Array, sampleRate: number) => {
  console.log("Creating realistic ocean sound");
  const bufferLength = leftChannel.length;
  
  // Wave timing parameters
  const wavePeriod = 5; // seconds per wave
  const waveOffset = 1; // offset between left/right for stereo effect
  
  // Create base ocean noise (continuous background)
  for (let i = 0; i < bufferLength; i++) {
    // Base ocean noise - always present
    const baseNoise = (Math.random() * 0.12 - 0.06);
    leftChannel[i] = baseNoise;
    rightChannel[i] = Math.random() * 0.12 - 0.06; // Different noise for right channel
  }
  
  // Add rhythmic wave patterns
  for (let second = 0; second < bufferLength / sampleRate; second++) {
    // Position in the wave cycle (0 to 1)
    const wavePosition = (second % wavePeriod) / wavePeriod;
    
    // Create wave envelope (rises then falls)
    let waveEnvelope = 0;
    if (wavePosition < 0.2) {
      // Wave rising (crescendo)
      waveEnvelope = wavePosition * 5; // Rise to full volume
    } else if (wavePosition < 0.5) {
      // Wave at shore (peak)
      waveEnvelope = 1; 
    } else {
      // Wave receding (decrescendo)
      waveEnvelope = 1 - ((wavePosition - 0.5) * 2);
    }
    
    // Apply wave to this segment of audio
    const segmentStart = second * sampleRate;
    const segmentEnd = Math.min((second + 1) * sampleRate, bufferLength);
    
    for (let i = segmentStart; i < segmentEnd; i++) {
      // Add wave component
      const waveComponent = waveEnvelope * 0.3 * (Math.random() * 2 - 1);
      
      // Add to base noise
      leftChannel[i] += waveComponent;
      
      // Right channel slightly delayed for realism
      const rightIndex = Math.min(i + (waveOffset * sampleRate), bufferLength - 1);
      rightChannel[rightIndex] += waveComponent * 0.8;
    }
  }
  
  // Add occasional "crash" sounds for larger waves
  for (let second = 0; second < bufferLength / sampleRate; second += wavePeriod) {
    if (Math.random() > 0.6) { // 40% chance of larger wave
      const crashStart = Math.floor((second + wavePeriod * 0.3) * sampleRate);
      const crashDuration = Math.floor(sampleRate * 2); // 2 seconds
      
      if (crashStart + crashDuration >= bufferLength) continue;
      
      // Generate crash sound (filtered noise with faster attack/decay)
      for (let i = 0; i < crashDuration; i++) {
        // Envelope shape: fast attack, slow decay
        let envelope = 0;
        if (i < crashDuration * 0.1) {
          envelope = i / (crashDuration * 0.1); // Attack
        } else {
          envelope = 1 - ((i - crashDuration * 0.1) / (crashDuration * 0.9)); // Decay
        }
        
        // Add crash component
        const crashNoise = (Math.random() * 2 - 1) * envelope * 0.5;
        leftChannel[crashStart + i] += crashNoise;
        
        // Slightly different for right channel
        rightChannel[crashStart + i] += (Math.random() * 2 - 1) * envelope * 0.5;
      }
    }
  }
  
  // Normalize to prevent clipping
  normalizeAudio(leftChannel, rightChannel);
};

/**
 * Creates realistic forest ambient sound with birds and leaves
 */
const createRealisticForestSound = (leftChannel: Float32Array, rightChannel: Float32Array, sampleRate: number) => {
  console.log("Creating realistic forest sound");
  const bufferLength = leftChannel.length;
  
  // Create gentle background ambience (wind through leaves)
  for (let i = 0; i < buffer
