
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { toast } from "sonner";

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
}

const GuitarHeroGame: React.FC<GuitarHeroGameProps> = ({ instrumentType, onNotePlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(2);
  const [hitZoneHeight] = useState(80);
  
  const gameRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const gameStartTimeRef = useRef<number>(0);

  // Configuração das lanes (faixas) baseada no instrumento
  const lanes = instrumentType === "bell" ? [
    { color: "#FF0000", frequency: 261.63, name: "Dó", key: "1", symbol: "🔔" },
    { color: "#FF6600", frequency: 293.66, name: "Ré", key: "2", symbol: "🔔" },
    { color: "#FFFF00", frequency: 329.63, name: "Mi", key: "3", symbol: "🔔" },
    { color: "#00CC00", frequency: 349.23, name: "Fá", key: "4", symbol: "🔔" },
    { color: "#0099FF", frequency: 392.00, name: "Sol", key: "5", symbol: "🔔" },
    { color: "#6600FF", frequency: 440.00, name: "Lá", key: "6", symbol: "🔔" },
    { color: "#FF1493", frequency: 493.88, name: "Si", key: "7", symbol: "🔔" },
  ] : instrumentType === "xylophone" ? [
    { color: "#E53935", frequency: 523.25, name: "Dó", key: "1", symbol: "🎵" },
    { color: "#FF9800", frequency: 587.33, name: "Ré", key: "2", symbol: "🎵" },
    { color: "#FFEB3B", frequency: 659.25, name: "Mi", key: "3", symbol: "🎵" },
    { color: "#4CAF50", frequency: 698.46, name: "Fá", key: "4", symbol: "🎵" },
    { color: "#2196F3", frequency: 783.99, name: "Sol", key: "5", symbol: "🎵" },
    { color: "#9C27B0", frequency: 880.00, name: "Lá", key: "6", symbol: "🎵" },
    { color: "#E91E63", frequency: 987.77, name: "Si", key: "7", symbol: "🎵" },
  ] : [
    { color: "#FF0000", frequency: 261.63, name: "Dó", key: "1", symbol: "♩" },
    { color: "#FF9933", frequency: 293.66, name: "Ré", key: "2", symbol: "♪" },
    { color: "#FFFF00", frequency: 329.63, name: "Mi", key: "3", symbol: "♫" },
    { color: "#33CC33", frequency: 349.23, name: "Fá", key: "4", symbol: "♬" },
    { color: "#33CCFF", frequency: 392.00, name: "Sol", key: "5", symbol: "♩" },
    { color: "#0000FF", frequency: 440.00, name: "Lá", key: "6", symbol: "♪" },
    { color: "#9933CC", frequency: 493.88, name: "Si", key: "7", symbol: "♫" },
  ];

  // Gerar padrão de notas mais consistente
  const generateNotes = useCallback(() => {
    const newNotes: Note[] = [];
    const patterns = [
      [0, 2, 4], // Dó, Mi, Sol (acordes maiores)
      [1, 3, 5], // Ré, Fá, Lá
      [0, 1, 2], // Sequência simples
      [4, 5, 6], // Notas agudas
      [2, 4, 6], // Saltos
      [0, 3, 6], // Acordes de sétima
    ];

    let noteId = 0;
    for (let i = 0; i < 30; i++) { // Mais notas para sessão mais longa
      const pattern = patterns[i % patterns.length];
      const baseTime = i * 3000; // 3 segundos entre padrões
      
      pattern.forEach((laneIndex, noteIndex) => {
        if (laneIndex < lanes.length) {
          newNotes.push({
            id: `note-${noteId++}`,
            lane: laneIndex,
            color: lanes[laneIndex].color,
            frequency: lanes[laneIndex].frequency,
            startTime: baseTime + noteIndex * 800, // 800ms entre notas do padrão
            duration: 600,
            y: -80 // Começar mais acima da tela
          });
        }
      });
    }

    console.log(`Generated ${newNotes.length} notes for ${instrumentType}`);
    setNotes(newNotes);
  }, [instrumentType, lanes]);

  // Atualizar posição das notas com base no tempo real
  const updateNotes = useCallback(() => {
    if (!isPlaying) return;

    const currentTime = Date.now() - gameStartTimeRef.current;
    
    setNotes(prevNotes => 
      prevNotes
        .map(note => {
          // Calcular posição baseada no tempo
          const noteAge = currentTime - note.startTime;
          const newY = (noteAge / 10) * speed; // Velocidade ajustável
          return {
            ...note,
            y: newY
          };
        })
        .filter(note => note.y < 700) // Remove notas que saíram da tela
    );

    animationRef.current = requestAnimationFrame(updateNotes);
  }, [isPlaying, speed]);

  // Detectar teclas pressionadas
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const lane = lanes.find(l => l.key === event.key);
    if (!lane || !isPlaying) return;

    event.preventDefault(); // Prevenir ações padrão do browser

    const laneIndex = lanes.indexOf(lane);
    const hitZoneTop = 420 - hitZoneHeight / 2; // Zona de acerto centralizada
    const hitZoneBottom = 420 + hitZoneHeight / 2;

    console.log(`Key pressed: ${event.key}, Lane: ${laneIndex}`);

    // Verificar se há uma nota na zona de acerto
    const hitNote = notes.find(note => 
      note.lane === laneIndex && 
      note.y >= hitZoneTop && 
      note.y <= hitZoneBottom
    );

    if (hitNote) {
      // Acertou!
      const precision = Math.abs(hitNote.y - 420);
      let points = 100;
      let feedback = "Good!";

      if (precision < 15) {
        points = 300;
        feedback = "Perfect!";
      } else if (precision < 30) {
        points = 200;
        feedback = "Great!";
      }

      const finalPoints = points * Math.max(1, combo);
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
      setCurrentTime(0);
      console.log(`Starting ${instrumentType} game`);
      updateNotes();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      console.log(`Pausing ${instrumentType} game`);
    }
    setIsPlaying(!isPlaying);
  };

  // Resetar o jogo
  const resetGame = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsPlaying(false);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setNotes([]);
    setCurrentTime(0);
    gameStartTimeRef.current = 0;
    console.log(`Game reset for ${instrumentType}`);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const getInstrumentTitle = () => {
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
          <h1 className="text-2xl font-bold">
            {getInstrumentTitle()}
          </h1>
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
            <div className="text-xl font-bold">{speed}x</div>
          </div>
        </div>
      </div>

      {/* Instruções */}
      <div className="bg-blue-600 p-3 text-center text-white">
        <p className="text-sm">
          Use as teclas <strong>1-7</strong> para tocar as notas quando elas passarem pela zona dourada!
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
            top: `${420 - hitZoneHeight / 2}px`,
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

        {/* Linha de referência no centro */}
        <div
          className="absolute w-full border-t-4 border-yellow-400 opacity-50"
          style={{ top: "420px" }}
        />
      </div>
    </div>
  );
};

export default GuitarHeroGame;
