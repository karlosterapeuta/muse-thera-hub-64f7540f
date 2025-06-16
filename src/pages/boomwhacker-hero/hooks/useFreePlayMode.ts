
import { useState, useCallback, useRef } from 'react';

interface RecordedNote {
  note: number;
  timestamp: number;
  duration: number;
}

export const useFreePlayMode = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSequence, setRecordedSequence] = useState<RecordedNote[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const recordingStartTime = useRef<number>(0);
  const playbackTimeout = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setRecordedSequence([]);
    recordingStartTime.current = Date.now();
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
  }, []);

  const recordNote = useCallback((noteIndex: number) => {
    if (!isRecording) return;
    
    const timestamp = Date.now() - recordingStartTime.current;
    const newNote: RecordedNote = {
      note: noteIndex,
      timestamp,
      duration: 500 // duração padrão da nota
    };
    
    setRecordedSequence(prev => [...prev, newNote]);
  }, [isRecording]);

  const playRecording = useCallback((onPlayNote: (noteIndex: number) => void) => {
    if (recordedSequence.length === 0 || isPlaying) return;
    
    setIsPlaying(true);
    
    recordedSequence.forEach((note) => {
      playbackTimeout.current = setTimeout(() => {
        onPlayNote(note.note);
      }, note.timestamp);
    });
    
    // Parar reprodução quando terminar
    const maxTimestamp = Math.max(...recordedSequence.map(n => n.timestamp));
    playbackTimeout.current = setTimeout(() => {
      setIsPlaying(false);
    }, maxTimestamp + 1000);
  }, [recordedSequence, isPlaying]);

  const clearRecording = useCallback(() => {
    setRecordedSequence([]);
    if (playbackTimeout.current) {
      clearTimeout(playbackTimeout.current);
      playbackTimeout.current = null;
    }
    setIsPlaying(false);
  }, []);

  return {
    isRecording,
    recordedSequence,
    isPlaying,
    startRecording,
    stopRecording,
    recordNote,
    playRecording,
    clearRecording
  };
};
