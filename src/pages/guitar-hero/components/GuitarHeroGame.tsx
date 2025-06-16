import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { playNoteSound } from '@/utils/audioUtils';
import { getAuthenticMusicalSequence } from '@/data/authenticMusicalSequences';
import { TEA_MASTER_FREQUENCIES, getLaneConfig, NOTE_TO_LANE_MAP } from '@/constants/teaFrequencies';

interface MusicalSequence {
  name: string;
  notes: {
    note: string;
    duration?: number;
  }[];
}

interface TEAFrequencyConfig {
  note: string;
  frequency: number;
  color: string;
  name: string;
  symbol: string;
}

interface Note {
  id: string;
  lane: number;
  time: number;
  frequency: number;
  color: string;
  name: string;
  note: string;
}

interface LaneProps {
  laneIndex: number;
  color: string;
  isPressed: boolean;
  instrumentType: "bell" | "xylophone" | "keyboard";
  children?: React.ReactNode;
}

interface GuitarHeroGameProps {
  instrumentType: "bell" | "xylophone" | "keyboard";
  onNotePlay?: (frequency: number, color: string) => void;
  selectedSong?: {
    id: string;
    title: string;
    hasSequence?: boolean;
  };
  gameSpeed?: number;
}

const Lane: React.FC<LaneProps> = ({ laneIndex, color, isPressed, instrumentType, children }) => {
  const laneConfig = getLaneConfig(instrumentType, laneIndex);
  
  return (
    <div 
      className={`
        relative w-full h-full border-2 border-gray-300 
        ${isPressed ? 'bg-yellow-300' : 'bg-gray-100'}
        transition-all duration-100 ease-in-out
        flex flex-col items-center justify-end p-2
      `}
      style={{
        backgroundColor: isPressed ? '#fef08a' : color + '20',
        borderColor: color
      }}
    >
      <div className="text-center space-y-1">
        <div className="text-2xl">{laneConfig.symbol}</div>
        <div className="text-sm font-bold">{laneConfig.name}</div>
        <div className="text-xs text-gray-600">{laneConfig.note}</div>
        <div className="text-xs text-gray-500">{Math.round(laneConfig.frequency)}Hz</div>
        <div className="text-xs font-mono bg-black text-white px-1 rounded">
          {laneIndex + 1}
        </div>
      </div>
      {children}
    </div>
  );
};

const GuitarHeroGame: React.FC<GuitarHeroGameProps> = ({
  instrumentType,
  onNotePlay,
  selectedSong,
  gameSpeed = 1.0
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [pressedLanes, setPressedLanes] = useState<boolean[]>(new Array(7).fill(false));
  const [score, setScore] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const gameLoopRef = useRef<number>();
  const lastNoteTime = useRef(0);

  const laneConfigs = TEA_MASTER_FREQUENCIES[instrumentType];

  const generateAuthenticGameNotes = useCallback(() => {
    if (!selectedSong?.hasSequence) {
      return generateRandomNotes();
    }

    const sequence = getAuthenticMusicalSequence(selectedSong.id);
    if (!sequence) {
      console.warn(`⚠️ Sequence not found for ${selectedSong.id}, using random notes`);
      return generateRandomNotes();
    }

    console.log(`🎼 GENERATING AUTHENTIC: ${sequence.name} - ${sequence.notes.length} notes`);
    
    const gameNotes: Note[] = [];
    let currentTime = 2000;

    sequence.notes.forEach((seqNote, index) => {
      const laneIndex = NOTE_TO_LANE_MAP[seqNote.note];
      if (laneIndex === undefined) {
        console.warn(`⚠️ Note ${seqNote.note} not found in lane mapping`);
        return;
      }

      const laneConfig = getLaneConfig(instrumentType, laneIndex);
      
      console.log(`🎵 SYNC CHECK: ${seqNote.note} → Lane ${laneIndex} → ${laneConfig.frequency}Hz (${laneConfig.color})`);

      gameNotes.push({
        id: `${selectedSong.id}-${index}`,
        lane: laneIndex,
        time: currentTime,
        frequency: laneConfig.frequency,
        color: laneConfig.color,
        name: laneConfig.name,
        note: seqNote.note
      });

      currentTime += (seqNote.duration || 800) / gameSpeed;
    });

    console.log(`✅ AUTHENTIC NOTES GENERATED: ${gameNotes.length} notes perfectly synchronized`);
    return gameNotes;
  }, [selectedSong, instrumentType, gameSpeed]);

  const generateRandomNotes = useCallback(() => {
    const notes: Note[] = [];
    const totalNotes = 20;
    
    for (let i = 0; i < totalNotes; i++) {
      const laneIndex = Math.floor(Math.random() * 7);
      const laneConfig = getLaneConfig(instrumentType, laneIndex);
      
      notes.push({
        id: `random-${i}`,
        lane: laneIndex,
        time: 2000 + (i * 1000) / gameSpeed,
        frequency: laneConfig.frequency,
        color: laneConfig.color,
        name: laneConfig.name,
        note: laneConfig.note
      });
    }
    
    console.log(`🎲 RANDOM NOTES: ${notes.length} notes with synchronized frequencies`);
    return notes;
  }, [instrumentType, gameSpeed]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const laneIndex = parseInt(event.key) - 1;
    if (laneIndex >= 0 && laneIndex < 7) {
      const laneConfig = getLaneConfig(instrumentType, laneIndex);
      
      console.log(`🎹 KEY PRESS: ${event.key} → Lane ${laneIndex} → ${laneConfig.frequency}Hz`);
      
      playNoteSound(`${laneConfig.frequency}Hz`, instrumentType);
      
      if (onNotePlay) {
        onNotePlay(laneConfig.frequency, laneConfig.color);
      }

      setPressedLanes(prev => {
        const newPressed = [...prev];
        newPressed[laneIndex] = true;
        return newPressed;
      });

      setTimeout(() => {
        setPressedLanes(prev => {
          const newPressed = [...prev];
          newPressed[laneIndex] = false;
          return newPressed;
        });
      }, 150);

      const currentNotes = notes.filter(note => 
        note.lane === laneIndex && 
        Math.abs(note.time - gameTime) < 200
      );

      if (currentNotes.length > 0) {
        setScore(prev => prev + 100);
        setNotes(prev => prev.filter(note => !currentNotes.includes(note)));
        console.log(`✅ HIT! Score +100, Lane ${laneIndex} (${laneConfig.note})`);
      }
    }
  }, [notes, gameTime, instrumentType, onNotePlay]);

  useEffect(() => {
    if (isPlaying) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isPlaying, handleKeyPress]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setGameTime(prev => prev + 16);
      }, 16);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  useEffect(() => {
    setNotes(generateAuthenticGameNotes());
  }, [generateAuthenticGameNotes]);

  const startGame = () => {
    console.log(`🎮 STARTING TEA-Hero: ${instrumentType} - ${selectedSong ? selectedSong.title : 'Random Mode'}`);
    setIsPlaying(true);
    setShowControls(false);
    setScore(0);
    setGameTime(0);
    setNotes(generateAuthenticGameNotes());
  };

  const stopGame = () => {
    setIsPlaying(false);
    setShowControls(true);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-purple-900 to-black text-white overflow-hidden">
      {showControls && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black bg-opacity-75">
          <Card className="p-8 text-center space-y-4 bg-gray-900 border-purple-500">
            <h2 className="text-2xl font-bold text-purple-300">
              🎵 TEA-Hero: {instrumentType.toUpperCase()}
            </h2>
            {selectedSong ? (
              <div className="space-y-2">
                <Badge variant="secondary" className="text-green-300 bg-green-800">
                  🎼 {selectedSong.title}
                </Badge>
                <p className="text-sm text-gray-300">Melodia 100% sincronizada!</p>
              </div>
            ) : (
              <Badge variant="secondary" className="text-blue-300 bg-blue-800">
                🎲 Modo Prática Musical
              </Badge>
            )}
            <p className="text-gray-300">Use as teclas 1-7 para tocar as notas</p>
            <p className="text-sm text-yellow-300">Velocidade: {gameSpeed}x</p>
            <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-700">
              ▶️ Iniciar Jogo
            </Button>
          </Card>
        </div>
      )}

      <div className="absolute top-4 left-4 z-10 space-y-2">
        <div className="text-xl font-bold">Pontuação: {score}</div>
        <div className="text-sm">Tempo: {Math.floor(gameTime / 1000)}s</div>
        {selectedSong && (
          <Badge variant="secondary" className="text-green-300 bg-green-800">
            🎼 {selectedSong.title}
          </Badge>
        )}
        <Badge variant="secondary" className="text-purple-300 bg-purple-800">
          🎵 {instrumentType.toUpperCase()}
        </Badge>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <Button onClick={stopGame} variant="secondary" size="sm">
          ⏹️ Parar
        </Button>
      </div>

      <div className="relative h-full grid grid-cols-7 gap-1 p-4">
        {laneConfigs.map((laneConfig, index) => (
          <Lane
            key={index}
            laneIndex={index}
            color={laneConfig.color}
            isPressed={pressedLanes[index]}
            instrumentType={instrumentType}
          >
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              {notes
                .filter(note => note.lane === index)
                .map(note => {
                  const progress = (gameTime - note.time + 2000) / 2000;
                  const yPosition = progress * 100;
                  
                  if (yPosition > 100) return null;
                  
                  return (
                    <div
                      key={note.id}
                      className="absolute w-full h-8 rounded-lg shadow-lg border-2 border-white"
                      style={{
                        backgroundColor: note.color,
                        top: `${Math.max(0, yPosition)}%`,
                        transform: 'translateY(-50%)',
                        opacity: yPosition > 80 ? (100 - yPosition) / 20 : 1
                      }}
                    >
                      <div className="text-center text-white text-xs font-bold leading-8">
                        {note.name}
                      </div>
                    </div>
                  );
                })}
            </div>
          </Lane>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-red-500 to-transparent opacity-50" />
    </div>
  );
};

export default GuitarHeroGame;
