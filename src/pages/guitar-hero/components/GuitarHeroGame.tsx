import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { getMusicalSequence, generateGameNotes } from "@/data/musicalSequences";

interface Note {
  id: string;
  lane: number;
  color: string;
  frequency: number;
  startTime: number;
  duration: number;
  y: number;
}

interface GuitarHeroGameProps {
  instrumentType: "bell" | "xylophone" | "keyboard";
  onNotePlay: (frequency: number, color: string) => void;
  selectedSong?: {
    id: string;
    title: string;
    hasSequence?: boolean;
  };
  gameSpeed?: number;
}

const GuitarHeroGame: React.FC<GuitarHeroGameProps> = ({ 
  instrumentType, 
  onNotePlay, 
  selectedSong,
  gameSpeed = 1.0
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [notes, setNotes] = useState<Note[]>([]);
  const [hitZoneHeight] = useState(80);
  
  const gameRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const gameStartTimeRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  // Configuração das lanes (faixas) baseada no instrumento
  const lanes = instrumentType === "bell" ? [
    { color: "#FF0000", frequency: 261.63, name: "Dó", key: "1", symbol: "🔔" },
    { color: "#FF6600", frequency: 293.66, name: "Ré", key: "2", symbol: "🔔" },
    { color: "#FFFF00", frequency: 329.63, name: "Mi", key: "3", symbol: "🔔" },
    { color: "#00CC00", frequency: 349.23, name: "Fá", key: "4", symbol: "🔔" },
    { color: "#0099FF", frequency: 392.00, name: "Sol", key: "5", symbol: "🔔" },
    { color: "#000080", frequency: 440.00, name: "Lá", key: "6", symbol: "🔔" },
    { color: "#800080", frequency: 493.88, name: "Si", key: "7", symbol: "🔔" },
  ] : instrumentType === "xylophone" ? [
    { color: "#E53935", frequency: 523.25, name: "Dó", key: "1", symbol: "🎵" },
    { color: "#FF9800", frequency: 587.33, name: "Ré", key: "2", symbol: "🎵" },
    { color: "#FFEB3B", frequency: 659.25, name: "Mi", key: "3", symbol: "🎵" },
    { color: "#4CAF50", frequency: 698.46, name: "Fá", key: "4", symbol: "🎵" },
    { color: "#2196F3", frequency: 783.99, name: "Sol", key: "5", symbol: "🎵" },
    { color: "#000080", frequency: 880.00, name: "Lá", key: "6", symbol: "🎵" },
    { color: "#800080", frequency: 987.77, name: "Si", key: "7", symbol: "🎵" },
  ] : [
    { color: "#FF0000", frequency: 261.63, name: "Dó", key: "1", symbol: "♩" },
    { color: "#FF9933", frequency: 293.66, name: "Ré", key: "2", symbol: "♪" },
    { color: "#FFFF00", frequency: 329.63, name: "Mi", key: "3", symbol: "♫" },
    { color: "#33CC33", frequency: 349.23, name: "Fá", key: "4", symbol: "♬" },
    { color: "#33CCFF", frequency: 392.00, name: "Sol", key: "5", symbol: "♩" },
    { color: "#000080", frequency: 440.00, name: "Lá", key: "6", symbol: "♪" },
    { color: "#800080", frequency: 493.88, name: "Si", key: "7", symbol: "♫" },
  ];

  // Função para iniciar música de fundo
  const startBackgroundMusic = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playBackgroundTone = (frequency: number, startTime: number, duration: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + startTime);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + startTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + startTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start(audioContext.currentTime + startTime);
        oscillator.stop(audioContext.currentTime + startTime + duration);
      };

      // Melodia ajustada pela velocidade
      const melody = [
        { freq: 523.25, time: 0, duration: 0.5 },
        { freq: 587.33, time: 0.5, duration: 0.5 },
        { freq: 659.25, time: 1, duration: 0.5 },
        { freq: 523.25, time: 1.5, duration: 0.5 },
        { freq: 587.33, time: 2, duration: 0.5 },
        { freq: 659.25, time: 2.5, duration: 0.5 },
        { freq: 783.99, time: 3, duration: 1 },
        { freq: 659.25, time: 4, duration: 0.5 },
        { freq: 587.33, time: 4.5, duration: 0.5 },
        { freq: 523.25, time: 5, duration: 1 },
      ];

      // Aplicar velocidade à melodia
      melody.forEach(note => {
        const adjustedTime = note.time / gameSpeed;
        const adjustedDuration = note.duration / gameSpeed;
        playBackgroundTone(note.freq, adjustedTime, adjustedDuration);
      });

      // Repetir melodia com intervalo ajustado
      const interval = setInterval(() => {
        if (isPlaying) {
          melody.forEach(note => {
            const adjustedTime = note.time / gameSpeed;
            const adjustedDuration = note.duration / gameSpeed;
            playBackgroundTone(note.freq, adjustedTime, adjustedDuration);
          });
        } else {
          clearInterval(interval);
        }
      }, 6000 / gameSpeed);

      console.log(`🎵 Background music started for ${instrumentType} at ${gameSpeed}x speed`);
      
    } catch (error) {
      console.error("Error starting background music:", error);
    }
  }, [instrumentType, isPlaying, gameSpeed]);

  // Parar música de fundo
  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
      backgroundMusicRef.current = null;
    }
    console.log("🎵 Background music stopped");
  }, []);

  // Gerar padrão de notas
  const generateNotes = useCallback(() => {
    if (selectedSong?.hasSequence) {
      const sequence = getMusicalSequence(selectedSong.id);
      if (sequence) {
        console.log(`🎼 Carregando sequência musical: ${sequence.name} at ${gameSpeed}x speed`);
        console.log(`📊 BPM: ${sequence.bpm * gameSpeed}, Notas: ${sequence.notes.length}`);
        
        const gameNotes = generateGameNotes(sequence, instrumentType);
        // Ajustar timing das notas baseado na velocidade
        const adjustedNotes = gameNotes.map(note => ({
          ...note,
          startTime: note.startTime / gameSpeed // Notas aparecem com timing ajustado
        }));
        setNotes(adjustedNotes);
        console.log(`Generated ${adjustedNotes.length} authentic notes for ${selectedSong.title} at ${gameSpeed}x speed`);
        return;
      }
    }

    // Fallback para padrão aleatório com velocidade ajustada
    console.log(`⚠️ Usando padrão aleatório para ${selectedSong?.title || 'música desconhecida'} at ${gameSpeed}x speed`);
    const newNotes: Note[] = [];
    const patterns = [
      [0, 2, 4], [1, 3, 5], [0, 1, 2], [4, 5, 6], [2, 4, 6], [0, 3, 6],
    ];

    let noteId = 0;
    for (let i = 0; i < 20; i++) {
      const pattern = patterns[i % patterns.length];
      const baseTime = (i * 4000) / gameSpeed; // Timing ajustado pela velocidade
      
      pattern.forEach((laneIndex, noteIndex) => {
        if (laneIndex < lanes.length) {
          newNotes.push({
            id: `note-${noteId++}`,
            lane: laneIndex,
            color: lanes[laneIndex].color,
            frequency: lanes[laneIndex].frequency,
            startTime: baseTime + (noteIndex * 1000) / gameSpeed, // Timing entre notas ajustado
            duration: 600 / gameSpeed, // Duração ajustada
            y: -100
          });
        }
      });
    }

    setNotes(newNotes);
  }, [instrumentType, lanes, selectedSong, gameSpeed]);

  // Atualizar posição das notas
  const updateNotes = useCallback(() => {
    if (!isPlaying) return;

    const now = Date.now();
    const currentGameTime = now - gameStartTimeRef.current;
    
    setNotes(prevNotes => 
      prevNotes
        .map(note => {
          // Calcular posição baseada no tempo com velocidade aplicada
          const noteAge = currentGameTime - note.startTime;
          const baseSpeed = 2; // Velocidade base
          const newY = noteAge * baseSpeed * 0.1 * gameSpeed; // Aplicar multiplicador de velocidade
          return {
            ...note,
            y: newY
          };
        })
        .filter(note => note.y < 600) // Remove notas que saíram da tela
    );

    // Remover notas perdidas
    setNotes(prevNotes => {
      const missedNotes = prevNotes.filter(note => note.y > 500);
      if (missedNotes.length > 0 && combo > 0) {
        setCombo(0);
        toast("Notas perdidas! Combo resetado", { duration: 1000 });
      }
      return prevNotes.filter(note => note.y <= 500);
    });

    lastUpdateTimeRef.current = now;
    animationRef.current = requestAnimationFrame(updateNotes);
  }, [isPlaying, combo, gameSpeed]);

  // Detectar teclas pressionadas
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!isPlaying) return;

    const keyPressed = event.key;
    const lane = lanes.find(l => l.key === keyPressed);
    if (!lane) return;

    event.preventDefault();

    const laneIndex = lanes.indexOf(lane);
    const hitZoneTop = 350;
    const hitZoneBottom = hitZoneTop + hitZoneHeight;

    console.log(`Key pressed: ${keyPressed}, Lane: ${laneIndex}, Current notes: ${notes.length}`);

    // Verificar se há uma nota na zona de acerto
    const hitNote = notes.find(note => 
      note.lane === laneIndex && 
      note.y >= hitZoneTop - 50 && 
      note.y <= hitZoneBottom + 50
    );

    if (hitNote) {
      // Acertou!
      const precision = Math.abs(hitNote.y - (hitZoneTop + hitZoneHeight / 2));
      let points = 100;
      let feedback = "Good!";

      if (precision < 15) {
        points = 300;
        feedback = "Perfect!";
      } else if (precision < 30) {
        points = 200;
        feedback = "Great!";
      }

      const finalPoints = points * Math.max(1, combo + 1);
      setScore(prev => prev + finalPoints);
      setCombo(prev => prev + 1);
      setMaxCombo(prev => Math.max(prev, combo + 1));

      // Tocar o som
      onNotePlay(lane.frequency, lane.color);

      // Feedback visual
      toast(`${feedback} +${finalPoints} pontos`, {
        duration: 1000,
      });

      // Remover a nota acertada
      setNotes(prevNotes => prevNotes.filter(n => n.id !== hitNote.id));
      
      console.log(`Hit note! Score: ${finalPoints}, Combo: ${combo + 1}`);
    } else {
      // Errou ou tocou sem nota
      if (combo > 0) {
        setCombo(0);
        toast("Miss! Combo perdido", {
          duration: 1000,
        });
      }
      
      // Ainda toca o som para feedback
      onNotePlay(lane.frequency, lane.color);
      console.log(`Missed note in lane ${laneIndex}`);
    }
  }, [lanes, isPlaying, notes, combo, hitZoneHeight, onNotePlay]);

  // Gerenciar eventos de teclado
  useEffect(() => {
    if (isPlaying) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isPlaying, handleKeyPress]);

  // Iniciar/pausar o jogo
  const togglePlay = () => {
    if (!isPlaying) {
      generateNotes();
      gameStartTimeRef.current = Date.now();
      startBackgroundMusic();
      
      if (selectedSong?.hasSequence) {
        console.log(`🎵 Iniciando ${selectedSong.title} com sequência musical autêntica at ${gameSpeed}x speed`);
        toast(`🎼 Tocando: ${selectedSong.title} (${gameSpeed}x)`, { duration: 2000 });
      } else {
        console.log(`🎵 Iniciando ${instrumentType} game com padrão aleatório at ${gameSpeed}x speed`);
      }
      
      setIsPlaying(true);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      stopBackgroundMusic();
      setIsPlaying(false);
      console.log(`Pausing ${instrumentType} game`);
    }
  };

  // Iniciar animação quando o jogo começar
  useEffect(() => {
    if (isPlaying) {
      updateNotes();
    }
  }, [isPlaying, updateNotes]);

  // Resetar o jogo
  const resetGame = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    stopBackgroundMusic();
    setIsPlaying(false);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setNotes([]);
    gameStartTimeRef.current = 0;
    console.log(`Game reset for ${instrumentType}`);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      stopBackgroundMusic();
    };
  }, [stopBackgroundMusic]);

  const getInstrumentTitle = () => {
    if (selectedSong?.hasSequence) {
      return `🎼 ${selectedSong.title}`;
    }
    
    switch (instrumentType) {
      case "bell": return "🔔 Sino-Hero";
      case "xylophone": return "🎵 Xilofone-Hero";
      case "keyboard": return "🎹 Teclado-Hero";
      default: return "TEA-Hero";
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header com controles e pontuação */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">
              {getInstrumentTitle()}
            </h1>
            {selectedSong?.hasSequence && (
              <p className="text-sm opacity-90">
                🎼 Sequência musical autêntica • Velocidade: {gameSpeed}x
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={togglePlay} variant="secondary" size="sm">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? "Pausar" : "Jogar"}
            </Button>
            <Button onClick={resetGame} variant="secondary" size="sm">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-sm opacity-80">Pontuação</div>
            <div className="text-xl font-bold">{score.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm opacity-80">Combo</div>
            <div className="text-xl font-bold text-yellow-300">{combo}x</div>
          </div>
          <div>
            <div className="text-sm opacity-80">Max Combo</div>
            <div className="text-xl font-bold text-orange-300">{maxCombo}x</div>
          </div>
          <div>
            <div className="text-sm opacity-80">Velocidade</div>
            <div className="text-xl font-bold">{gameSpeed}x</div>
          </div>
        </div>
      </div>

      {/* Instruções */}
      <div className="bg-blue-600 p-3 text-center text-white">
        <p className="text-sm">
          Use as teclas <strong>1-7</strong> para tocar as notas quando elas passarem pela zona dourada!
          {selectedSong?.hasSequence && (
            <span className="block mt-1 text-yellow-200">
              🎼 Esta música toca a melodia autêntica de "{selectedSong.title}" a {gameSpeed}x de velocidade
            </span>
          )}
        </p>
      </div>

      {/* Game Area */}
      <div 
        ref={gameRef}
        className="flex-1 relative bg-gradient-to-b from-gray-900 to-black overflow-hidden"
        style={{ height: "500px" }}
      >
        {/* Lanes (faixas) */}
        {lanes.map((lane, index) => (
          <div
            key={index}
            className="absolute border-r border-gray-600"
            style={{
              left: `${(index / lanes.length) * 100}%`,
              width: `${100 / lanes.length}%`,
              height: "100%",
              backgroundColor: `${lane.color}15`
            }}
          >
            {/* Indicador da nota na parte inferior */}
            <div
              className="absolute bottom-0 w-full flex items-center justify-center text-white font-bold border-2 border-white/50 shadow-lg"
              style={{
                height: "70px",
                backgroundColor: lane.color,
              }}
            >
              <div className="text-center">
                <div className="text-xs font-bold">{lane.key}</div>
                <div className="text-2xl">{lane.symbol}</div>
                <div className="text-xs font-bold">{lane.name}</div>
              </div>
            </div>
          </div>
        ))}

        {/* Zona de acerto */}
        <div
          className="absolute w-full border-4 border-yellow-400 bg-yellow-400/30 shadow-lg"
          style={{
            top: "350px",
            height: `${hitZoneHeight}px`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-yellow-400 font-bold text-lg animate-pulse">ZONA DE ACERTO</div>
          </div>
        </div>

        {/* Notas em queda */}
        {notes.map((note) => (
          <div
            key={note.id}
            className="absolute rounded-lg border-2 border-white shadow-xl flex items-center justify-center text-white font-bold transition-transform"
            style={{
              left: `${(note.lane / lanes.length) * 100 + 1}%`,
              width: `${100 / lanes.length - 2}%`,
              top: `${note.y}px`,
              height: "50px",
              backgroundColor: note.color,
              boxShadow: `0 0 20px ${note.color}50`,
            }}
          >
            <div className="text-center">
              <div className="text-lg">{lanes[note.lane].symbol}</div>
            </div>
          </div>
        ))}

        {/* Linha de referência */}
        <div
          className="absolute w-full border-t-4 border-yellow-400 opacity-50"
          style={{ top: "380px" }}
        />
      </div>
    </div>
  );
};

export default GuitarHeroGame;
