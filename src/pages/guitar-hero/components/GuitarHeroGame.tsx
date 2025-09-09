import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { playNoteSound } from '@/utils/audioUtils';
import { getAuthenticMusicalSequence } from '@/data/authenticMusicalSequences';
import { TEA_MASTER_FREQUENCIES, getLaneConfig, NOTE_TO_LANE_MAP } from '@/constants/teaFrequencies';
import { teaHeroAudio } from '@/pages/tea-hero/utils/teaHeroAudioManager';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';

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
  soundPlayed?: boolean; // Track if falling note sound was played
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
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  return (
    <div 
      className={`
        relative w-full h-full border-2 border-gray-300 
        ${isPressed ? 'bg-yellow-300' : 'bg-gray-100'}
        transition-all duration-100 ease-in-out
        flex flex-col items-center justify-end
        ${isMobile ? 'p-1' : isTablet ? 'p-1.5' : 'p-2'}
      `}
      style={{
        backgroundColor: isPressed ? '#fef08a' : color + '20',
        borderColor: color
      }}
    >
      <div className="text-center space-y-0.5">
        <div className={`${isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-2xl'}`}>
          {laneConfig.symbol}
        </div>
        <div className={`font-bold ${isMobile ? 'text-xs' : isTablet ? 'text-sm' : 'text-sm'}`}>
          {laneConfig.name}
        </div>
        <div className={`text-gray-600 ${isMobile ? 'text-[10px]' : isTablet ? 'text-xs' : 'text-xs'}`}>
          {laneConfig.note}
        </div>
        <div className={`text-gray-500 ${isMobile ? 'text-[9px]' : isTablet ? 'text-[10px]' : 'text-xs'}`}>
          {Math.round(laneConfig.frequency)}Hz
        </div>
        <div className={`font-mono bg-black text-white px-1 rounded ${isMobile ? 'text-[10px]' : isTablet ? 'text-xs' : 'text-xs'}`}>
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
  const [isPaused, setIsPaused] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const gameLoopRef = useRef<number>();
  const lastNoteTime = useRef(0);

  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const laneConfigs = TEA_MASTER_FREQUENCIES[instrumentType];

  // Debug log for button rendering
  console.log('🎮 TEA-Hero State - isPlaying:', isPlaying, 'isPaused:', isPaused, 'isRepeating:', isRepeating);

  // Check for notes passing through hit zone and play their sounds
  const checkFallingNoteSounds = useCallback(() => {
    if (!isPlaying) return;
    
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        const notePosition = (gameTime - note.time + 2000) / 2000 * 100;
        
        // Play sound when note is in hit zone (85-95% of screen) and hasn't been played yet
        if (notePosition >= 85 && notePosition <= 95 && !note.soundPlayed) {
          teaHeroAudio.playFallingNoteSound(note.frequency, instrumentType);
          return { ...note, soundPlayed: true };
        }
        
        return note;
      });
    });
  }, [gameTime, isPlaying, instrumentType]);

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
    if (isPlaying && !isPaused) {
      const interval = setInterval(() => {
        setGameTime(prev => prev + 16);
      }, 16);
      return () => clearInterval(interval);
    }
  }, [isPlaying, isPaused]);

  // Check falling note sounds on game time update
  useEffect(() => {
    if (isPlaying && !isPaused) {
      checkFallingNoteSounds();
    }
  }, [gameTime, isPlaying, isPaused, checkFallingNoteSounds]);

  useEffect(() => {
    setNotes(generateAuthenticGameNotes());
  }, [generateAuthenticGameNotes]);

  const startGame = async () => {
    console.log(`🎮 STARTING TEA-Hero: ${instrumentType} - ${selectedSong ? selectedSong.title : 'Random Mode'}`);
    console.log('▶️ Start Game button clicked');
    
    // Initialize audio manager
    await teaHeroAudio.initialize();
    
    // Start background music if enabled and song is selected
    if (selectedSong?.hasSequence) {
      await teaHeroAudio.createSyntheticBackgroundMusic(selectedSong.id, instrumentType);
    }
    
    setIsPlaying(true);
    setShowControls(false);
    setScore(0);
    setGameTime(0);
    setNotes(generateAuthenticGameNotes());
  };

  const stopGame = () => {
    console.log('🛑 Stop Game button clicked');
    setIsPlaying(false);
    setIsPaused(false);
    setShowControls(true);
    teaHeroAudio.stop();
  };

  const pauseGame = () => {
    console.log('⏸️ Pause Game button clicked');
    const newPausedState = teaHeroAudio.togglePause();
    setIsPaused(newPausedState);
    console.log('⏸️ New paused state:', newPausedState);
  };

  const toggleRepeat = () => {
    console.log('🔁 Toggle Repeat button clicked');
    const newRepeatState = teaHeroAudio.toggleRepeat();
    setIsRepeating(newRepeatState);
    console.log('🔁 New repeat state:', newRepeatState);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-purple-900 to-black text-white overflow-hidden">
      {showControls && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black bg-opacity-75">
          <Card className={`text-center space-y-4 bg-gray-900 border-purple-500 ${
            isMobile ? 'p-4 mx-2' : isTablet ? 'p-6' : 'p-8'
          }`}>
            <h2 className={`font-bold text-purple-300 ${
              isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-2xl'
            }`}>
              🎵 TEA-Hero: {instrumentType.toUpperCase()}
            </h2>
            {selectedSong ? (
              <div className="space-y-2">
                <Badge variant="secondary" className="text-green-300 bg-green-800">
                  🎼 {selectedSong.title}
                </Badge>
                <p className={`text-gray-300 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  Melodia 100% sincronizada!
                </p>
              </div>
            ) : (
              <Badge variant="secondary" className="text-blue-300 bg-blue-800">
                🎲 Modo Prática Musical
              </Badge>
            )}
            <p className={`text-gray-300 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Use as teclas 1-7 para tocar as notas
            </p>
            <p className={`text-yellow-300 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Velocidade: {gameSpeed}x
            </p>
            <Button 
              onClick={startGame} 
              className={`bg-purple-600 hover:bg-purple-700 ${
                isMobile ? 'text-sm px-4 py-2' : 'text-base'
              }`}
            >
              ▶️ Iniciar Jogo
            </Button>
          </Card>
        </div>
      )}

      <div className={`absolute top-2 left-2 z-10 space-y-1 ${
        isMobile ? 'top-1 left-1' : 'top-4 left-4'
      }`}>
        <div className={`font-bold ${
          isMobile ? 'text-sm' : isTablet ? 'text-lg' : 'text-xl'
        }`}>
          Pontuação: {score}
        </div>
        <div className={`${
          isMobile ? 'text-xs' : isTablet ? 'text-sm' : 'text-sm'
        }`}>
          Tempo: {Math.floor(gameTime / 1000)}s {isPaused ? '⏸️ PAUSADO' : ''}
        </div>
        {selectedSong && (
          <Badge 
            variant="secondary" 
            className={`text-green-300 bg-green-800 ${
              isMobile ? 'text-xs px-1.5 py-0.5' : ''
            }`}
          >
            🎼 {isMobile ? selectedSong.title.substring(0, 15) + '...' : selectedSong.title}
          </Badge>
        )}
        <Badge 
          variant="secondary" 
          className={`text-purple-300 bg-purple-800 ${
            isMobile ? 'text-xs px-1.5 py-0.5' : ''
          }`}
        >
          🎵 {instrumentType.toUpperCase()}
        </Badge>
      </div>

      <div className={`absolute top-2 right-2 z-10 flex gap-1 ${
        isMobile ? 'top-1 right-1 flex-col' : 'top-4 right-4 flex-row'
      }`}>
        <Button 
          onClick={() => {
            console.log('🟡 Pause button clicked!');
            pauseGame();
          }}
          variant="secondary" 
          size={isMobile ? "sm" : "sm"}
          className={`${isMobile ? 'text-xs px-2 py-1' : ''} ${
            isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'
          }`}
        >
          {isPaused ? '▶️' : '⏸️'} {isMobile ? '' : isPaused ? 'Retomar' : 'Pausar'}
        </Button>
        
        <Button 
          onClick={() => {
            console.log('🔵 Repeat button clicked!');
            toggleRepeat();
          }}
          variant="secondary" 
          size={isMobile ? "sm" : "sm"}
          className={`${isMobile ? 'text-xs px-2 py-1' : ''} ${
            isRepeating ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
          }`}
        >
          🔁 {isMobile ? '' : isRepeating ? 'Repetir: ON' : 'Repetir: OFF'}
        </Button>
        
        <Button 
          onClick={() => {
            console.log('🔴 Stop button clicked!');
            stopGame();
          }} 
          variant="secondary" 
          size={isMobile ? "sm" : "sm"}
          className={`${isMobile ? 'text-xs px-2 py-1' : ''} bg-red-600 hover:bg-red-700`}
        >
          ⏹️ {isMobile ? '' : 'Parar'}
        </Button>
      </div>

      {/* Main game area with responsive grid */}
      <div className={`relative h-full grid grid-cols-7 ${
        isMobile ? 'gap-0.5 p-1' : isTablet ? 'gap-1 p-2' : 'gap-1 p-4'
      }`}>
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
                  
                  const noteHeight = isMobile ? 'h-6' : isTablet ? 'h-7' : 'h-8';
                  const textSize = isMobile ? 'text-[10px]' : isTablet ? 'text-xs' : 'text-xs';
                  const leadingClass = isMobile ? 'leading-6' : isTablet ? 'leading-7' : 'leading-8';
                  
                  return (
                    <div
                      key={note.id}
                      className={`absolute w-full ${noteHeight} rounded-lg shadow-lg border-2 border-white`}
                      style={{
                        backgroundColor: note.color,
                        top: `${Math.max(0, yPosition)}%`,
                        transform: 'translateY(-50%)',
                        opacity: yPosition > 80 ? (100 - yPosition) / 20 : 1
                      }}
                    >
                      <div className={`text-center text-white font-bold ${textSize} ${leadingClass}`}>
                        {isMobile ? note.name.substring(0, 3) : note.name}
                      </div>
                    </div>
                  );
                })}
            </div>
          </Lane>
        ))}
      </div>

      {/* Hit zone indicator */}
      <div className={`absolute bottom-0 left-0 w-full bg-gradient-to-t from-red-500 to-transparent opacity-50 ${
        isMobile ? 'h-12' : isTablet ? 'h-14' : 'h-16'
      }`} />
    </div>
  );
};

export default GuitarHeroGame;
