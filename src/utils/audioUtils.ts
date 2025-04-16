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
};
