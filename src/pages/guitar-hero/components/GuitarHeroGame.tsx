
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { NoteSequence, Note } from '@/types/musicTypes';

interface GuitarHeroGameProps {
  instrumentType: 'bell' | 'xylophone' | 'keyboard';
  onNotePlay: (frequency: number, color: string) => void;
  noteSequence?: NoteSequence;
}

interface FallingNote {
  id: string;
  note: string;
  frequency: number;
  color: string;
  position: number;
  lane: number;
  timing: number;
  duration: number;
}

const GuitarHeroGame: React.FC<GuitarHeroGameProps> = ({ 
  instrumentType, 
  onNotePlay,
  noteSequence 
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [gameTime, setGameTime] = useState(0);
  const [fallingNotes, setFallingNotes] = useState<FallingNote[]>([]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  
  const gameRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const lastNoteTimeRef = useRef<number>(0);

  // Configurações baseadas no instrumento
  const instrumentConfig = {
    bell: {
      lanes: 5,
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'],
      notes: ['C', 'D', 'E', 'F', 'G'],
      frequencies: [261.63, 293.66, 329.63, 349.23, 392.00]
    },
    xylophone: {
      lanes: 7,
      colors: ['#FF6B6B', '#FF8E53', '#FECA57', '#96CEB4', '#4ECDC4', '#45B7D1', '#A55EEA'],
      notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      frequencies: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88]
    },
    keyboard: {
      lanes: 7,
      colors: ['#FFFFFF', '#000000', '#FFFFFF', '#000000', '#FFFFFF', '#FFFFFF', '#000000'],
      notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      frequencies: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88]
    }
  };

  const config = instrumentConfig[instrumentType];

  // Converter sequência musical em notas que caem
  const generateNotesFromSequence = useCallback(() => {
    if (!noteSequence || !noteSequence.notes.length) {
      return [];
    }

    const notes: FallingNote[] = [];
    let currentTime = 0;
    const beatDuration = 60000 / noteSequence.bpm; // duração de uma batida em ms

    noteSequence.notes.forEach((note: Note, index: number) => {
      const laneIndex = config.notes.indexOf(note.note);
      if (laneIndex !== -1) {
        const fallingNote: FallingNote = {
          id: `note-${index}`,
          note: note.note,
          frequency: note.frequency,
          color: config.colors[laneIndex],
          position: 0,
          lane: laneIndex,
          timing: currentTime + 2000, // 2 segundos de delay inicial
          duration: note.duration * beatDuration
        };
        notes.push(fallingNote);
      }
      currentTime += note.duration * beatDuration;
    });

    return notes;
  }, [noteSequence, config]);

  // Função para iniciar o jogo
  const startGame = useCallback(() => {
    setGameStarted(true);
    setIsPaused(false);
    setScore(0);
    setCombo(0);
    setAccuracy(100);
    setGameTime(0);
    setCurrentNoteIndex(0);
    startTimeRef.current = Date.now();
    lastNoteTimeRef.current = Date.now();
    
    // Gerar notas da sequência musical
    const generatedNotes = generateNotesFromSequence();
    setFallingNotes(generatedNotes);
  }, [generateNotesFromSequence]);

  // Função para pausar/despausar
  const togglePause = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  // Função para reiniciar
  const resetGame = useCallback(() => {
    setGameStarted(false);
    setIsPaused(false);
    setScore(0);
    setCombo(0);
    setAccuracy(100);
    setGameTime(0);
    setFallingNotes([]);
    setCurrentNoteIndex(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  // Função para tocar nota quando tecla é pressionada
  const playNote = useCallback((laneIndex: number) => {
    if (!gameStarted || isPaused) return;

    const frequency = config.frequencies[laneIndex];
    const color = config.colors[laneIndex];
    onNotePlay(frequency, color);

    // Verificar se há uma nota na zona de acerto
    const hitZone = 80; // zona de acerto em %
    const tolerance = 10; // tolerância em %

    const noteInZone = fallingNotes.find(note => 
      note.lane === laneIndex && 
      Math.abs(note.position - hitZone) <= tolerance &&
      note.position > 0
    );

    if (noteInZone) {
      // Acerto!
      setScore(prev => prev + (10 + combo));
      setCombo(prev => prev + 1);
      
      // Remover a nota acertada
      setFallingNotes(prev => prev.filter(note => note.id !== noteInZone.id));
      
      // Feedback visual pode ser adicionado aqui
    } else {
      // Erro - quebrar combo
      setCombo(0);
    }
  }, [gameStarted, isPaused, config, onNotePlay, fallingNotes, combo]);

  // Event listener para teclas
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const keyToLane: { [key: string]: number } = {
        '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6
      };
      
      const laneIndex = keyToLane[event.key];
      if (laneIndex !== undefined && laneIndex < config.lanes) {
        playNote(laneIndex);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playNote, config.lanes]);

  // Loop principal do jogo
  useEffect(() => {
    if (!gameStarted || isPaused) return;

    const gameLoop = () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      setGameTime(elapsed);

      // Atualizar posição das notas
      setFallingNotes(prev => prev.map(note => {
        const noteElapsed = now - lastNoteTimeRef.current;
        const newPosition = (noteElapsed / (note.timing + note.duration)) * 100;
        
        return {
          ...note,
          position: Math.min(newPosition, 100)
        };
      }).filter(note => note.position < 100)); // Remover notas que saíram da tela

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted, isPaused]);

  // Verificar fim do jogo
  useEffect(() => {
    if (gameStarted && fallingNotes.length === 0 && currentNoteIndex >= (noteSequence?.notes.length || 0)) {
      // Fim do jogo após um delay
      setTimeout(() => {
        setGameStarted(false);
      }, 2000);
    }
  }, [gameStarted, fallingNotes.length, currentNoteIndex, noteSequence]);

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header do jogo */}
      <div className="bg-black/50 p-4 flex justify-between items-center">
        <div className="flex space-x-6">
          <div>Score: <span className="text-yellow-400 font-bold">{score.toLocaleString()}</span></div>
          <div>Combo: <span className="text-orange-400 font-bold">x{combo}</span></div>
          <div>Precisão: <span className="text-green-400 font-bold">{accuracy.toFixed(1)}%</span></div>
        </div>
        
        <div className="flex space-x-2">
          {!gameStarted ? (
            <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              Iniciar
            </Button>
          ) : (
            <>
              <Button onClick={togglePause} variant="secondary">
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </Button>
              <Button onClick={resetGame} variant="destructive">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Área do jogo */}
      <div className="flex-1 relative" ref={gameRef}>
        <div className="absolute inset-0 flex">
          {/* Lanes do jogo */}
          {Array.from({ length: config.lanes }).map((_, laneIndex) => (
            <div 
              key={laneIndex}
              className="flex-1 border-r border-gray-600 relative"
              style={{ backgroundColor: `${config.colors[laneIndex]}15` }}
            >
              {/* Zona de acerto */}
              <div 
                className="absolute left-0 right-0 h-16 border-2 border-yellow-400 bg-yellow-400/20 rounded"
                style={{ bottom: '10%' }}
              />
              
              {/* Tecla do instrumento */}
              <button
                onClick={() => playNote(laneIndex)}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full font-bold text-lg border-2 hover:scale-110 transition-transform"
                style={{ 
                  backgroundColor: config.colors[laneIndex],
                  borderColor: instrumentType === 'keyboard' ? '#333' : '#fff',
                  color: instrumentType === 'keyboard' && (laneIndex === 1 || laneIndex === 3 || laneIndex === 6) ? '#fff' : '#000'
                }}
              >
                {laneIndex + 1}
              </button>

              {/* Notas que caem */}
              {fallingNotes
                .filter(note => note.lane === laneIndex)
                .map(note => (
                  <div
                    key={note.id}
                    className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full border-2 border-white shadow-lg"
                    style={{
                      backgroundColor: note.color,
                      top: `${note.position}%`,
                      transition: 'top 0.1s linear'
                    }}
                  />
                ))
              }
            </div>
          ))}
        </div>

        {/* Informações da música */}
        {noteSequence && (
          <div className="absolute top-4 left-4 bg-black/70 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Informações Musicais</h3>
            <p>Tonalidade: {noteSequence.key} Maior</p>
            <p>Andamento: {noteSequence.bpm} BPM</p>
            <p>Compasso: {noteSequence.timeSignature}</p>
            <p>Notas: {noteSequence.notes.length}</p>
            <Progress 
              value={(currentNoteIndex / noteSequence.notes.length) * 100} 
              className="mt-2 w-48"
            />
          </div>
        )}

        {/* Overlay de pausa */}
        {isPaused && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <Card>
              <CardContent className="p-8 text-center text-black">
                <h2 className="text-2xl font-bold mb-4">Jogo Pausado</h2>
                <Button onClick={togglePause}>
                  <Play className="w-4 h-4 mr-2" />
                  Continuar
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tela de fim de jogo */}
        {!gameStarted && score > 0 && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <Card>
              <CardContent className="p-8 text-center text-black">
                <h2 className="text-3xl font-bold mb-4 text-yellow-600">Parabéns!</h2>
                <div className="space-y-2 mb-6">
                  <p className="text-xl">Score Final: <span className="font-bold">{score.toLocaleString()}</span></p>
                  <p>Maior Combo: <span className="font-bold">x{combo}</span></p>
                  <p>Precisão: <span className="font-bold">{accuracy.toFixed(1)}%</span></p>
                </div>
                <div className="flex space-x-4">
                  <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
                    Jogar Novamente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Instruções */}
      <div className="bg-black/50 p-2 text-center text-sm">
        Use as teclas <strong>1-{config.lanes}</strong> para tocar as notas quando elas passarem pela zona dourada!
      </div>
    </div>
  );
};

export default GuitarHeroGame;
