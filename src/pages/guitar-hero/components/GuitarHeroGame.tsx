import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { playNoteSound } from '@/utils/audioUtils';
import { getMusicalSequence } from '@/data/musicalSequences';
import { MusicalSequence } from '@/types/musicTypes';

type InstrumentType = "bell" | "xylophone" | "keyboard";

interface Song {
  id: string;
  title: string;
  artist: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
  instrument: InstrumentType;
  color: string;
  category: "infantil" | "clássico" | "brasileiro" | "terapêutico" | "desenhos";
  therapeuticBenefits: string;
  hasSequence?: boolean;
}

interface GuitarHeroGameProps {
  instrumentType: InstrumentType;
  onNotePlay: (frequency: number, color: string) => void;
  selectedSong: Song;
  gameSpeed?: number;
}

interface Note {
  id: string;
  key: number;
  color: string;
  frequency: number;
  position: number;
  timestamp: number;
}

const GuitarHeroGame: React.FC<GuitarHeroGameProps> = ({ 
  instrumentType, 
  onNotePlay, 
  selectedSong,
  gameSpeed = 1.0
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sequence, setSequence] = useState<MusicalSequence | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [totalNotes, setTotalNotes] = useState(0);
  const [hitNotes, setHitNotes] = useState(0);

  const gameContainerRef = useRef<HTMLDivElement>(null);
  const comboRef = useRef(0);
  const maxComboRef = useRef(0);

  const notePositions = {
    1: 10,
    2: 23,
    3: 36,
    4: 49,
    5: 62,
    6: 75,
    7: 88,
  };

  useEffect(() => {
    const seq = getMusicalSequence(selectedSong.id);
    setSequence(seq);
    if (seq) {
      setTotalNotes(seq.notes.length);
    }
  }, [selectedSong.id]);

  const calculateNoteFrequency = useCallback((key: number) => {
    const baseFrequency = instrumentType === "bell" ? 261.63 : // C4 for bell
                            instrumentType === "xylophone" ? 392.00 : // G4 for xylophone
                            220.00; // A3 for keyboard
  
    const noteFrequencies = {
      1: baseFrequency / 2,
      2: baseFrequency / 1.75,
      3: baseFrequency / 1.5,
      4: baseFrequency,
      5: baseFrequency * 1.25,
      6: baseFrequency * 1.5,
      7: baseFrequency * 2,
    };
  
    return noteFrequencies[key] || baseFrequency;
  }, [instrumentType]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isPlaying) return;

    const keyMap = {
      '1': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
      '6': 6,
      '7': 7,
    };

    const keyPressed = keyMap[event.key as keyof typeof keyMap];

    if (keyPressed) {
      const now = Date.now() - (startTime || 0);
      const tolerance = 150 / gameSpeed;

      const noteHit = notes.find(
        (note) =>
          note.key === keyPressed &&
          Math.abs(note.timestamp - now) <= tolerance
      );

      if (noteHit) {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteHit.id));
        setScore((prevScore) => prevScore + 100);
        onNotePlay(noteHit.frequency, noteHit.color);

        comboRef.current += 1;
        maxComboRef.current = Math.max(maxComboRef.current, comboRef.current);
        setHitNotes(prevHitNotes => prevHitNotes + 1);
      } else {
        comboRef.current = 0;
      }
      setAccuracy(Math.max(0, (hitNotes / totalNotes) * 100));
    }
  }, [isPlaying, notes, startTime, onNotePlay, totalNotes, hitNotes, gameSpeed]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const startGame = () => {
    if (!sequence) return;

    setNotes([]);
    setScore(0);
    setIsPlaying(true);
    setProgress(0);
    setStartTime(Date.now());
    setCurrentNoteIndex(0);
    setHitNotes(0);
    comboRef.current = 0;
    maxComboRef.current = 0;

    // Convert MusicalNote to simplified note format for the game
    const initialNotes = sequence.notes.slice(0, 5).map((note, index) => ({
      id: `note-${index}`,
      key: Math.floor(Math.random() * 7) + 1, // Convert to 1-7 key range
      color: 'bg-blue-500',
      frequency: calculateNoteFrequency(Math.floor(Math.random() * 7) + 1),
      position: 0,
      timestamp: note.timing
    }));
    setNotes(initialNotes);
  };

  const stopGame = () => {
    setIsPlaying(false);
    setAccuracy(totalNotes > 0 ? Math.round((hitNotes / totalNotes) * 100) : 100);
  };

  useEffect(() => {
    if (isPlaying && sequence) {
      const now = Date.now() - (startTime || 0);
      const currentNote = sequence.notes[currentNoteIndex];

      if (currentNote && now >= currentNote.timing - (200 / gameSpeed)) {
        const newNote = {
          id: `note-${currentNoteIndex}`,
          key: Math.floor(Math.random() * 7) + 1, // Convert to 1-7 key range
          color: 'bg-blue-500',
          frequency: calculateNoteFrequency(Math.floor(Math.random() * 7) + 1),
          position: 0,
          timestamp: currentNote.timing,
        };

        setNotes(prevNotes => [...prevNotes, newNote]);
        setCurrentNoteIndex(prevIndex => prevIndex + 1);
      }

      const gameDuration = sequence.totalDuration || 10000;
      const currentProgress = startTime ? Math.min(((now) / gameDuration) * 100, 100) : 0;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        stopGame();
      }
    }
  }, [isPlaying, startTime, sequence, currentNoteIndex, calculateNoteFrequency, gameSpeed]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setNotes(prevNotes => 
          prevNotes.map(note => ({
            ...note,
            position: note.position + (2 * gameSpeed) // Apply speed multiplier
          })).filter(note => note.position < 100)
        );
      }, 50 / gameSpeed); // Adjust interval timing based on speed

      return () => clearInterval(interval);
    }
  }, [isPlaying, gameSpeed]);

  return (
    <div className="flex flex-col h-full">
      <Card className="mb-4">
        <CardContent className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{selectedSong.title}</h2>
            <p className="text-gray-500">{selectedSong.artist}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div>
              <div className="text-sm font-medium">Score</div>
              <div className="text-lg">{score}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Accuracy</div>
              <div className="text-lg">{accuracy}%</div>
            </div>
            <div>
              <div className="text-sm font-medium">Max Combo</div>
              <div className="text-lg">{maxComboRef.current}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex-grow relative overflow-hidden" ref={gameContainerRef}>
        {Object.entries(notePositions).map(([key, position]) => (
          <div
            key={key}
            className="absolute bottom-0 h-16 w-3 bg-gray-300 rounded-md transition-colors duration-200"
            style={{ left: `calc(${position}% - 0.375rem)` }}
          />
        ))}
        {notes.map((note) => (
          <div
            key={note.id}
            className={`absolute bottom-16 h-16 w-3 rounded-md ${note.color}`}
            style={{ left: `calc(${notePositions[note.key]}% - 0.375rem)`, bottom: `${note.position}%` }}
          />
        ))}
        <div className="absolute bottom-16 h-16 w-3 bg-yellow-400 rounded-md" style={{ left: 'calc(50% - 0.375rem)' }} />
      </div>

      <div className="mt-4">
        <Progress value={progress} />
      </div>

      <div className="mt-4 flex justify-center">
        {!isPlaying ? (
          <Button onClick={startGame}>Start Game</Button>
        ) : (
          <Button onClick={stopGame} variant="destructive">Stop Game</Button>
        )}
      </div>
    </div>
  );
};

export default GuitarHeroGame;
