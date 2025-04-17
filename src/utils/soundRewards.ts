
import { playNoteSound } from './audioUtils';

type RewardSound = 'success' | 'levelUp' | 'achievement';

// Musical notes for different rewards
const REWARD_NOTES = {
  success: ['C', 'E', 'G'],
  levelUp: ['C↓', 'E', 'G', 'C↑'],
  achievement: ['G', 'C↑', 'E', 'G']
};

export const playRewardSound = (type: RewardSound) => {
  const notes = REWARD_NOTES[type];
  
  notes.forEach((note, index) => {
    setTimeout(() => {
      playNoteSound(note);
    }, index * 200); // Play each note with a 200ms delay
  });
};
