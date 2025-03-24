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
  for (let i = 0; i < bufferLength; i++) {
    // Gentle noise base (wind through leaves)
    const baseNoise = Math.random() * 0.03 - 0.015;
    
    // Add slow modulation to simulate gentle wind variations
    const windVariation = Math.sin(i / sampleRate * 0.1) * 0.01 + 
                          Math.sin(i / sampleRate * 0.047) * 0.005;
    
    leftChannel[i] = baseNoise + windVariation;
    // Slightly different for right channel
    rightChannel[i] = Math.random() * 0.03 - 0.015 + 
                      Math.sin((i / sampleRate * 0.1) + 0.4) * 0.01;
  }
  
  // Add bird chirps randomly throughout
  const durationSeconds = bufferLength / sampleRate;
  const numBirds = Math.floor(durationSeconds / 2); // Bird sound every ~2 seconds on average
  
  for (let bird = 0; bird < numBirds; bird++) {
    // Random time for this bird sound
    const birdTime = Math.floor(Math.random() * bufferLength);
    if (birdTime >= bufferLength - 5000) continue;
    
    // Random stereo position
    const pan = Math.random() * 2 - 1; // -1 (left) to 1 (right)
    const leftGain = pan < 0 ? 1 : 1 - Math.abs(pan);
    const rightGain = pan > 0 ? 1 : 1 - Math.abs(pan);
    
    // Generate bird chirp (multiple notes)
    const numChirps = Math.floor(Math.random() * 4) + 1;
    
    for (let chirp = 0; chirp < numChirps; chirp++) {
      const chirpStart = birdTime + chirp * 2000 * Math.random();
      if (chirpStart >= bufferLength - 500) continue;
      
      // Bird frequency and duration
      const frequency = 2000 + Math.random() * 2000; // Hz (bird pitch)
      const chirpLength = Math.floor((Math.random() * 300) + 100);
      
      // Generate the chirp using sine waves with frequency modulation
      for (let i = 0; i < chirpLength; i++) {
        if (chirpStart + i >= bufferLength) break;
        
        // Create envelope
        const envelope = Math.sin((i / chirpLength) * Math.PI) * 0.3;
        
        // Add slight frequency variation
        const freqMod = frequency * (1 + Math.sin(i * 0.1) * 0.1);
        const sample = Math.sin(i * freqMod / sampleRate * Math.PI * 2) * envelope;
        
        // Add to both channels with panning
        leftChannel[chirpStart + i] += sample * leftGain;
        rightChannel[chirpStart + i] += sample * rightGain;
      }
    }
  }
  
  // Add occasional leaf rustling sounds
  for (let second = 0; second < durationSeconds; second += 3) {
    if (Math.random() > 0.7) { // 30% chance of leaf rustle
      const rustleStart = Math.floor(second * sampleRate + Math.random() * sampleRate);
      if (rustleStart >= bufferLength - 5000) continue;
      
      const rustleDuration = Math.floor(sampleRate * (0.5 + Math.random())); // 0.5-1.5 seconds
      
      // Random stereo position
      const pan = Math.random() * 2 - 1;
      
      // Generate rustle sound (filtered noise with envelope)
      for (let i = 0; i < rustleDuration; i++) {
        if (rustleStart + i >= bufferLength) break;
        
        // Envelope: quick attack, sustain, slow decay
        let envelope = 0;
        if (i < rustleDuration * 0.1) {
          envelope = i / (rustleDuration * 0.1); // Attack
        } else if (i < rustleDuration * 0.6) {
          envelope = 1; // Sustain
        } else {
          envelope = 1 - ((i - rustleDuration * 0.6) / (rustleDuration * 0.4)); // Decay
        }
        
        // Filtered noise for rustling
        const rustleNoise = (Math.random() * 2 - 1) * envelope * 0.15;
        
        // Apply panning
        leftChannel[rustleStart + i] += rustleNoise * (1 - Math.max(0, pan));
        rightChannel[rustleStart + i] += rustleNoise * (1 - Math.max(0, -pan));
      }
    }
  }
  
  // Normalize to prevent clipping
  normalizeAudio(leftChannel, rightChannel);
};

/**
 * Creates birds chirping ambient sound
 */
const createBirdsSoundscape = (leftChannel: Float32Array, rightChannel: Float32Array, sampleRate: number) => {
  console.log("Creating birds chirping ambient sound");
  const bufferLength = leftChannel.length;
  
  // Create very light background ambience (gentle wind)
  for (let i = 0; i < bufferLength; i++) {
    // Very subtle background noise
    const baseNoise = Math.random() * 0.02 - 0.01;
    leftChannel[i] = baseNoise;
    rightChannel[i] = Math.random() * 0.02 - 0.01;
  }
  
  // Add many bird chirps
  const durationSeconds = bufferLength / sampleRate;
  const numBirds = Math.floor(durationSeconds * 3); // More birds for denser soundscape
  
  for (let bird = 0; bird < numBirds; bird++) {
    // Random time for this bird sound
    const birdTime = Math.floor(Math.random() * bufferLength);
    if (birdTime >= bufferLength - 8000) continue;
    
    // Random stereo position
    const pan = Math.random() * 2 - 1; // -1 (left) to 1 (right)
    const leftGain = pan < 0 ? 1 : 1 - Math.abs(pan);
    const rightGain = pan > 0 ? 1 : 1 - Math.abs(pan);
    
    // Bird type (different frequency ranges for different birds)
    const birdType = Math.floor(Math.random() * 4);
    let baseFrequency = 0;
    
    switch(birdType) {
      case 0: // Small bird (high pitch)
        baseFrequency = 3000 + Math.random() * 2000;
        break;
      case 1: // Medium bird
        baseFrequency = 1500 + Math.random() * 1500;
        break;
      case 2: // Lower pitched bird
        baseFrequency = 800 + Math.random() * 700;
        break;
      case 3: // Varied bird
        baseFrequency = 1000 + Math.random() * 3000;
        break;
    }
    
    // Generate bird call pattern (multiple notes with pauses)
    const numNotes = Math.floor(Math.random() * 5) + 1;
    let noteTime = birdTime;
    
    for (let note = 0; note < numNotes; note++) {
      // Each note has slight frequency variation
      const noteFreq = baseFrequency * (0.9 + Math.random() * 0.2);
      // Note duration varies
      const noteDuration = Math.floor((Math.random() * 200) + 50);
      
      // Generate the note
      for (let i = 0; i < noteDuration; i++) {
        if (noteTime + i >= bufferLength) break;
        
        // Create envelope (attack and decay)
        let envelope = 0;
        if (i < noteDuration * 0.3) {
          envelope = i / (noteDuration * 0.3); // Attack
        } else {
          envelope = 1 - ((i - noteDuration * 0.3) / (noteDuration * 0.7)); // Decay
        }
        
        // Add slight vibrato for realism
        const vibrato = Math.sin(i * 0.3) * 0.05;
        const freqWithVibrato = noteFreq * (1 + vibrato);
        
        // Generate sine tone
        const sample = Math.sin(i * freqWithVibrato / sampleRate * Math.PI * 2) * envelope * 0.3;
        
        // Add to channels with stereo positioning
        leftChannel[noteTime + i] += sample * leftGain;
        rightChannel[noteTime + i] += sample * rightGain;
      }
      
      // Move to next note with random pause
      noteTime += noteDuration + Math.floor(Math.random() * 500) + 100;
      if (noteTime >= bufferLength) break;
    }
  }
  
  // Normalize to prevent clipping
  normalizeAudio(leftChannel, rightChannel);
};

/**
 * Creates realistic fireplace crackling sound
 */
const createFireplaceSound = (leftChannel: Float32Array, rightChannel: Float32Array, sampleRate: number) => {
  console.log("Creating fireplace sound");
  const bufferLength = leftChannel.length;
  
  // Create base fire ambience (low frequency rumble/hiss)
  for (let i = 0; i < bufferLength; i++) {
    // Base fire noise (filtered random)
    const baseNoise = Math.random() * 0.1 - 0.05;
    
    // Add slow modulation to simulate fire breathing
    const fireModulation = Math.sin(i / sampleRate * 0.2) * 0.02 + 
                          Math.sin(i / sampleRate * 0.07) * 0.01;
    
    leftChannel[i] = baseNoise + fireModulation;
    rightChannel[i] = Math.random() * 0.1 - 0.05 + 
                      Math.sin((i / sampleRate * 0.2) + 0.4) * 0.02;
  }
  
  // Add crackling sounds (sharp, short transients)
  const durationSeconds = bufferLength / sampleRate;
  // More frequent crackling for realism
  const numCrackles = Math.floor(durationSeconds * 8);
  
  for (let crackle = 0; crackle < numCrackles; crackle++) {
    // Random time for this crackle
    const crackleTime = Math.floor(Math.random() * bufferLength);
    if (crackleTime >= bufferLength - 2000) continue;
    
    // Random stereo position (slight)
    const pan = Math.random() * 1.2 - 0.6; // Less stereo spread for fire
    const leftGain = pan < 0 ? 1 : 1 - Math.abs(pan);
    const rightGain = pan > 0 ? 1 : 1 - Math.abs(pan);
    
    // Crackle intensity and duration
    const intensity = Math.random() * 0.4 + 0.1;
    const crackleDuration = Math.floor(Math.random() * 100 + 20);
    
    // Generate the crackle (sharp attack, quick decay)
    for (let i = 0; i < crackleDuration; i++) {
      if (crackleTime + i >= bufferLength) break;
      
      // Sharp attack, quick decay envelope
      let envelope = 0;
      if (i < crackleDuration * 0.1) {
        envelope = i / (crackleDuration * 0.1); // Very fast attack
      } else {
        envelope = 1 - ((i - crackleDuration * 0.1) / (crackleDuration * 0.9)); // Quick decay
      }
      
      // Filtered noise for crackling
      const crackleNoise = (Math.random() * 2 - 1) * envelope * intensity;
      
      // Add to both channels
      leftChannel[crackleTime + i] += crackleNoise * leftGain;
      rightChannel[crackleTime + i] += crackleNoise * rightGain;
    }
  }
  
  // Add occasional larger pops/snaps (less frequent but louder)
  for (let second = 0; second < durationSeconds; second += 1) {
    if (Math.random() > 0.7) { // 30% chance of pop each second
      const popTime = Math.floor(second * sampleRate + Math.random() * sampleRate);
      if (popTime >= bufferLength - 500) continue;
      
      const popDuration = Math.floor(Math.random() * 200 + 100);
      const popIntensity = Math.random() * 0.6 + 0.3;
      
      // Random pan
      const pan = Math.random() * 1.6 - 0.8;
      
      // Generate pop sound (very sharp attack, quick decay)
      for (let i = 0; i < popDuration; i++) {
        if (popTime + i >= bufferLength) break;
        
        // Envelope
        let envelope = Math.exp(-i * 0.05) * (1 - i/popDuration);
        
        // Add filtered noise with envelope
        const popNoise = (Math.random() * 2 - 1) * envelope * popIntensity;
        
        // Add to channels with panning
        leftChannel[popTime + i] += popNoise * (1 - Math.max(0, pan));
        rightChannel[popTime + i] += popNoise * (1 - Math.max(0, -pan));
      }
    }
  }
  
  // Normalize to prevent clipping
  normalizeAudio(leftChannel, rightChannel);
};

/**
 * Creates a flowing stream/river ambient sound
 */
const createStreamSound = (leftChannel: Float32Array, rightChannel: Float32Array, sampleRate: number) => {
  console.log("Creating stream/river sound");
  const bufferLength = leftChannel.length;
  
  // Create continuous water flow background
  for (let i = 0; i < bufferLength; i++) {
    // Base continuous flow noise (gentle noise)
    const baseNoise = Math.random() * 0.12 - 0.06;
    
    // Add slow variations for natural flow
    const flowVariation = Math.sin(i / sampleRate * 0.1) * 0.02 + 
                          Math.sin(i / sampleRate * 0.23) * 0.01;
    
    leftChannel[i] = baseNoise + flowVariation;
    // Right channel slightly different for stereo effect
    rightChannel[i] = Math.random() * 0.12 - 0.06 + 
                     Math.sin((i / sampleRate * 0.1) + 0.6) * 0.02;
  }
  
  // Add water splashes and gurgles
  const durationSeconds = bufferLength / sampleRate;
  const numSplashes = Math.floor(durationSeconds * 3); // 3 splashes per second on average
  
  for (let splash = 0; splash < numSplashes; splash++) {
    // Random time for this splash
    const splashTime = Math.floor(Math.random() * bufferLength);
    if (splashTime >= bufferLength - 5000) continue;
    
    // Random stereo position
    const pan = Math.random() * 1.8 - 0.9; // -0.9 to 0.9
    const leftGain = pan < 0 ? 1 : 1 - Math.abs(pan);
    const rightGain = pan > 0 ? 1 : 1 - Math.abs(pan);
    
    // Splash type (different sizes and durations)
    const splashType = Math.floor(Math.random() * 3);
    let splashDuration = 0;
    let splashIntensity = 0;
    
    switch(splashType) {
      case 0: // Small splash/bubble
        splashDuration = Math.floor(Math.random() * 200 + 100);
        splashIntensity = Math.random() * 0.15 + 0.05;
        break;
      case 1: // Medium splash
        splashDuration = Math.floor(Math.random() * 300 + 200);
        splashIntensity = Math.random() * 0.25 + 0.15;
        break;
      case 2: // Larger gurgle
        splashDuration = Math.floor(Math.random() * 500 + 300);
        splashIntensity = Math.random() * 0.3 + 0.2;
        break;
    }
    
    // Generate the splash sound (quick attack, medium decay)
    for (let i = 0; i < splashDuration; i++) {
      if (splashTime + i >= bufferLength) break;
      
      // Envelope shaping
      let envelope = 0;
      if (i < splashDuration * 0.1) {
        envelope = i / (splashDuration * 0.1); // Attack
      } else {
        envelope = 1 - ((i - splashDuration * 0.1) / (splashDuration * 0.9)); // Decay
      }
      
      // Add resonance filtering to make more "watery" sound
      const resonanceFreq = 800 + Math.random() * 1200 + Math.sin(i * 0.1) * 300;
      const resonanceQ = 0.5 + Math.random() * 0.5;
      
      // Create filtered noise with envelope and resonance
      const splashNoise = (Math.random() * 2 - 1) * envelope * splashIntensity;
      
      // Apply simple resonance filter (this is a simplified approximation)
      let filteredNoise = splashNoise * Math.sin(i * resonanceFreq / sampleRate * Math.PI * 2) * resonanceQ;
      
      // Add to both channels with stereo position
      leftChannel[splashTime + i] += filteredNoise * leftGain;
      rightChannel[splashTime + i] += filteredNoise * rightGain;
    }
  }
  
  // Add occasional "rush" sounds for a flowing stream
  for (let second = 0; second < durationSeconds; second += 2) {
    if (Math.random() > 0.6) { // 40% chance 
      const rushTime = Math.floor(second * sampleRate + Math.random() * sampleRate);
      if (rushTime >= bufferLength - 10000) continue;
      
      const rushDuration = Math.floor(sampleRate * (0.5 + Math.random())); // 0.5-1.5 seconds
      const rushIntensity = Math.random() * 0.25 + 0.1;
      
      // Create a "whooshing" water sound
      for (let i = 0; i < rushDuration; i++) {
        if (rushTime + i >= bufferLength) break;
        
        // Slow attack, slow release envelope
        let envelope = 0;
        if (i < rushDuration * 0.3) {
          envelope = i / (rushDuration * 0.3); // Slower attack
        } else if (i > rushDuration * 0.7) {
          envelope = 1 - ((i - rushDuration * 0.7) / (rushDuration * 0.3)); // Slower decay
        } else {
          envelope = 1; // Sustain
        }
        
        // Create rushing water sound (filtered noise with moving filter)
        const filterFreq = 400 + Math.sin(i / rushDuration * Math.PI * 2) * 300;
        const rushNoise = (Math.random() * 2 - 1) * envelope * rushIntensity;
        const filter = Math.sin(i * filterFreq / sampleRate * Math.PI * 2) * 0.5 + 0.5;
        
        // Apply to both channels with slight movement
        const pan = Math.sin(i / rushDuration * Math.PI * 3) * 0.4;
        leftChannel[rushTime + i] += rushNoise * filter * (1 - Math.max(0, pan));
        rightChannel[rushTime + i] += rushNoise * filter * (1 - Math.max(0, -pan));
      }
    }
  }
  
  // Normalize to prevent clipping
  normalizeAudio(leftChannel, rightChannel);
};

/**
 * Creates meditation ambient music
 */
const createMeditationSound = (leftChannel: Float32Array, rightChannel: Float32Array, sampleRate: number) => {
  console.log("Creating meditation ambient sound");
  const bufferLength = leftChannel.length;
  
  // Basic scales and notes for meditation music (pentatonic scale)
  const baseFreq = 110; // A2
  const pentatonicRatios = [1, 1.125, 1.25, 1.5, 1.6875]; // Pentatonic scale frequency ratios
  const notes = pentatonicRatios.map(ratio => baseFreq * ratio);
  
  // Add gentle background drone
  const droneFreq = baseFreq / 2; // Fundamental drone at A1
  for (let i = 0; i < bufferLength; i++) {
    // Create drone with harmonics
    const fundamental = Math.sin(i * droneFreq / sampleRate * Math.PI * 2) * 0.1;
    const harmonic1 = Math.sin(i * droneFreq * 2 / sampleRate * Math.PI * 2) * 0.05;
    const harmonic2 = Math.sin(i * droneFreq * 3 / sampleRate * Math.PI * 2) * 0.03;
    
    // Add slight modulation
    const modulator = Math.sin(i / sampleRate * 0.05) * 0.03;
    
    // Combine drones
    leftChannel[i] = fundamental + harmonic1 + harmonic2 + modulator;
    rightChannel[i] = fundamental + harmonic1 * 0.8 + harmonic2 * 1.2 + modulator;
  }
  
  // Add occasional gentle bells/chimes
  const durationSeconds = bufferLength / sampleRate;
  const numBells = Math.floor(durationSeconds / 4); // A bell every 4 seconds on average
  
  for (let bell = 0; bell < numBells; bell++) {
    // Random time for this bell
    const bellTime = Math.floor(Math.random() * bufferLength);
    if (bellTime >= bufferLength - 12000) continue;
    
    // Random note from our scale
    const noteIndex = Math.floor(Math.random() * notes.length);
    const noteFreq = notes[noteIndex] * (1 + (Math.random() * 0.04 - 0.02)); // Slight frequency variation
    
    // Bell duration and envelope
    const bellDuration = Math.floor(sampleRate * (1.5 + Math.random() * 2)); // 1.5-3.5 seconds
    
    // Random pan position
    const pan = Math.random() * 1.6 - 0.8; // -0.8 to 0.8
    
    // Generate bell tone (sine wave with exponential decay)
    for (let i = 0; i < bellDuration; i++) {
      if (bellTime + i >= bufferLength) break;
      
      // Exponential decay envelope
      const envelope = Math.exp(-i / (bellDuration * 0.3)) * 0.2;
      
      // Bell has multiple harmonics
      const mainTone = Math.sin(i * noteFreq / sampleRate * Math.PI * 2);
      const harmonic1 = Math.sin(i * noteFreq * 2.76 / sampleRate * Math.PI * 2) * 0.4; // Major third harmonic
      const harmonic2 = Math.sin(i * noteFreq * 3 / sampleRate * Math.PI * 2) * 0.2; // Perfect fifth
      
      // Combine harmonics with envelope
      const bellSound = (mainTone + harmonic1 + harmonic2) * envelope;
      
      // Add to channels with panning
      leftChannel[bellTime + i] += bellSound * (1 - Math.max(0, pan));
      rightChannel[bellTime + i] += bellSound * (1 - Math.max(0, -pan));
    }
  }
  
  // Add slow gentle pad sweeps
  for (let second = 0; second < durationSeconds; second += 8) { // Every 8 seconds
    const sweepStart = Math.floor(second * sampleRate);
    if (sweepStart >= bufferLength - 12 * sampleRate) continue;
    
    // Random note from our scale
    const noteIndex = Math.floor(Math.random() * notes.length);
    const noteFreq = notes[noteIndex] * 2; // One octave higher
    
    // Sweep duration (long)
    const sweepDuration = Math.floor(sampleRate * (8 + Math.random() * 4)); // 8-12 seconds
    if (sweepStart + sweepDuration >= bufferLength) continue;
    
    // Generate pad sweep
    for (let i = 0; i < sweepDuration; i++) {
      // Slow attack, slow release envelope
      let envelope = 0;
      if (i < sweepDuration * 0.3) {
        envelope = i / (sweepDuration * 0.3) * 0.15; // Slow attack
      } else if (i > sweepDuration * 0.7) {
        envelope = (1 - ((i - sweepDuration * 0.7) / (sweepDuration * 0.3))) * 0.15; // Slow release
      } else {
        envelope = 0.15; // Sustain
      }
      
      // Slow LFO for subtle movement
      const lfo = Math.sin(i / sampleRate * 0.25) * 0.01;
      
      // Multiple layered sine waves for rich pad sound
      const sine1 = Math.sin(i * noteFreq / sampleRate * Math.PI * 2);
      const sine2 = Math.sin(i * noteFreq * 1.01 / sampleRate * Math.PI * 2) * 0.5; // Slightly detuned
      const sine3 = Math.sin(i * noteFreq * 2 / sampleRate * Math.PI * 2) * 0.3; // Octave
      
      // Combine with envelope and LFO
      const padSound = (sine1 + sine2 + sine3) * (envelope + lfo);
      
      // Add to both channels with slight stereo widening
      leftChannel[sweepStart + i] += padSound * 0.9;
      rightChannel[sweepStart + i] += padSound * 1.1;
    }
  }
  
  // Normalize to prevent clipping
  normalizeAudio(leftChannel, rightChannel);
};

/**
 * Creates brown noise (deeper than white noise, falls off at 6dB per octave)
 */
const createBrownNoise = (leftChannel: Float32Array, rightChannel: Float32Array) => {
  console.log("Creating brown noise");
  
  // Brown noise is integrated white noise
  let lastLeftSample = 0;
  let lastRightSample = 0;
  
  for (let i = 0; i < leftChannel.length; i++) {
    // Generate new random samples
    const leftWhite = Math.random() * 2 - 1;
    const rightWhite = Math.random() * 2 - 1;
    
    // Leaky integrator to create brown noise (1/f² spectrum)
    lastLeftSample = (0.02 * leftWhite) + (0.98 * lastLeftSample);
    lastRightSample = (0.02 * rightWhite) + (0.98 * lastRightSample);
    
    // Store the brown noise sample
    leftChannel[i] = lastLeftSample * 3.5; // Scale for better amplitude
    rightChannel[i] = lastRightSample * 3.5;
  }
  
  // Normalize to avoid DC offset and clipping
  normalizeAudio(leftChannel, rightChannel);
};

/**
 * Creates pink noise (falls off at 3dB per octave)
 */
const createPinkNoise = (leftChannel: Float32Array, rightChannel: Float32Array) => {
  console.log("Creating pink noise");
  
  // Pink noise requires filtered white noise
  // Using Paul Kellet's algorithm for approximating pink noise
  
  // Filter coefficients
  let b0L = 0, b1L = 0, b2L = 0, b3L = 0, b4L = 0, b5L = 0, b6L = 0;
  let b0R = 0, b1R = 0, b2R = 0, b3R = 0, b4R = 0, b5R = 0, b6R = 0;
  
  for (let i = 0; i < leftChannel.length; i++) {
    // Generate white noise
    const whiteL = Math.random() * 2 - 1;
    const whiteR = Math.random() * 2 - 1;
    
    // Filter white noise to pink (Paul Kellet's refined method)
    b0L = 0.99886 * b0L + whiteL * 0.0555179;
    b1L = 0.99332 * b1L + whiteL * 0.0750759;
    b2L = 0.96900 * b2L + whiteL * 0.1538520;
    b3L = 0.86650 * b3L + whiteL * 0.3104856;
    b4L = 0.55000 * b4L + whiteL * 0.5329522;
    b5L = -0.7616 * b5L - whiteL * 0.0168980;
    
    b0R = 0.99886 * b0R + whiteR * 0.0555179;
    b1R = 0.99332 * b1R + whiteR * 0.0750759;
    b2R = 0.96900 * b2R + whiteR * 0.1538520;
    b3R = 0.86650 * b3R + whiteR * 0.3104856;
    b4R = 0.55000 * b4R + whiteR * 0.5329522;
    b5R = -0.7616 * b5R - whiteR * 0.0168980;
    
    // Combine filter outputs to create pink noise
    const pinkL = b0L + b1L + b2L + b3L + b4L + b5L + b6L + whiteL * 0.5362;
    const pinkR = b0R + b1R + b2R + b3R + b4R + b5R + b6R + whiteR * 0.5362;
    
    // Save filter values
    b6L = b5L * 0.115926;
    b6R = b5R * 0.115926;
    
    // Store the pink noise sample (scaled down to avoid clipping)
    leftChannel[i] = pinkL * 0.11;
    rightChannel[i] = pinkR * 0.11;
  }
  
  // Normalize to avoid DC offset and clipping
  normalizeAudio(leftChannel, rightChannel);
};

/**
 * Normalizes audio to prevent clipping
 */
const normalizeAudio = (leftChannel: Float32Array, rightChannel: Float32Array) => {
  // Find the maximum amplitude
  let maxAmplitude = 0;
  for (let i = 0; i < leftChannel.length; i++) {
    maxAmplitude = Math.max(maxAmplitude, Math.abs(leftChannel[i]), Math.abs(rightChannel[i]));
  }
  
  // If we need to normalize (close to clipping)
  if (maxAmplitude > 0.8) {
    const normalizationFactor = 0.8 / maxAmplitude;
    for (let i = 0; i < leftChannel.length; i++) {
      leftChannel[i] *= normalizationFactor;
      rightChannel[i] *= normalizationFactor;
    }
    console.log(`Normalized audio by factor: ${normalizationFactor}`);
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
