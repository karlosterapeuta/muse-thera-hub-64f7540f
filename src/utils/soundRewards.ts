
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
  
  notes.forEach((note, index) => {
    setTimeout(() => {
      try {
        playNoteSound(note);
      } catch (error) {
        console.error(`Error playing ${type} sound:`, error);
      }
    }, index * 200); // Play each note with a 200ms delay
  });
};
