
import { playNoteSound } from './audioUtils';

type RewardSound = 'success' | 'levelUp' | 'achievement';

// Musical notes for different rewards
const REWARD_NOTES = {
  success: ['C', 'E', 'G'],
  levelUp: ['C↓', 'E', 'G', 'C↑'],
  achievement: ['G', 'C↑', 'E', 'G']
};

/**
 * Plays a reward sound when a user achieves something
 * @param type The type of reward sound to play
 */
export const playRewardSound = (type: RewardSound) => {
  const notes = REWARD_NOTES[type];
  
  // Ensure we actually have notes to play
  if (!notes || notes.length === 0) {
    console.error(`No notes defined for reward type: ${type}`);
    return;
  }
  
  // Play each note in sequence with a delay
  notes.forEach((note, index) => {
    setTimeout(() => {
      try {
        // Verify the note exists before playing
        if (note) {
          playNoteSound(note);
        } else {
          console.error(`Invalid note at index ${index} for ${type}`);
        }
      } catch (error) {
        console.error(`Error playing ${type} sound at index ${index}:`, error);
      }
    }, index * 200); // Play each note with a 200ms delay
  });
};
