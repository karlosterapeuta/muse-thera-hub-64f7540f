
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  instrumentType: "bell" | "xylophone";
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
  const { toast } = useToast();

  // Configuração das lanes (faixas) baseada no instrumento
  const lanes = instrumentType === "bell" ? [
    { color: "#FF0000", frequency: 261.63, name: "Dó", key: "1" },
    { color: "#FF6600", frequency: 293.66, name: "Ré", key: "2" },
    { color: "#FFFF00", frequency: 329.63, name: "Mi", key: "3" },
    { color: "#00CC00", frequency: 349.23, name: "Fá", key: "4" },
    { color: "#0099FF", frequency: 392.00, name: "Sol", key: "5" },
    { color: "#6600FF", frequency: 440.00, name: "Lá", key: "6" },
    { color: "#FF1493", frequency: 493.88, name: "Si", key: "7" },
  ] : [
    { color: "#E53935", frequency: 523.25, name: "Dó", key: "1" },
    { color: "#FF9800", frequency: 587.33, name: "Ré", key: "2" },
    { color: "#FFEB3B", frequency: 659.25, name: "Mi", key: "3" },
    { color: "#4CAF50", frequency: 698.46, name: "Fá", key: "4" },
    { color: "#2196F3", frequency: 783.99, name: "Sol", key: "5" },
    { color: "#9C27B0", frequency: 880.00, name: "Lá", key: "6" },
    { color: "#E91E63", frequency: 987.77, name: "Si", key: "7" },
  ];

  // Gerar padrão de notas simples
  const generateNotes = () => {
    const newNotes: Note[] = [];
    const patterns = [
      [0, 2, 4], // Dó, Mi, Sol
      [1, 3, 5], // Ré, Fá, Lá
      [0, 1, 2, 3], // Sequência simples
      [4, 5, 6], // Notas agudas
    ];

    for (let i = 0; i < 20; i++) {
      const pattern = patterns[i % patterns.length];
      pattern.forEach((laneIndex, noteIndex) => {
        newNotes.push({
          id: `note-${i}-${noteIndex}`,
          lane: laneIndex,
          color: lanes[laneIndex].color,
          frequency: lanes[laneIndex].frequency,
          startTime: i * 2000 + noteIndex * 500,
          duration: 400,
          y: -50
        });
      });
    }

    setNotes(newNotes);
  };

  // Atualizar posição das notas
  const updateNotes = () => {
    if (!isPlaying) return;

    setCurrentTime(prev => prev + 16);
    
    setNotes(prevNotes => 
      prevNotes.map(note => ({
        ...note,
        y: note.y + speed
      })).filter(note => note.y < 600) // Remove notas que saíram da tela
    );

    animationRef.current = requestAnimationFrame(updateNotes);
  };

  // Detectar teclas pressionadas
  const handleKeyPress = (event: KeyboardEvent) => {
    const lane = lanes.find(l => l.key === event.key);
    if (!lane || !isPlaying) return;

    const laneIndex = lanes.indexOf(lane);
    const hitZoneTop = 500 - hitZoneHeight / 2;
    const hitZoneBottom = 500 + hitZoneHeight / 2;

    // Verificar se há uma nota na zona de acerto
    const hitNote = notes.find(note => 
      note.lane === laneIndex && 
      note.y >= hitZoneTop && 
      note.y <= hitZoneBottom
    );

    if (hitNote) {
      // Acertou!
      const precision = Math.abs(hitNote.y - 500);
      let points = 100;
      let feedback = "Good!";

      if (precision < 10) {
        points = 200;
        feedback = "Perfect!";
      } else if (precision < 20) {
        points = 150;
        feedback = "Great!";
      }

      setScore(prev => prev + points * (combo + 1));
      setCombo(prev => prev + 1);
      setMaxCombo(prev => Math.max(prev, combo + 1));

      // Tocar o som
      onNotePlay(lane.frequency, lane.color);

      // Feedback visual
      toast({
        title: feedback,
        description: `+${points * (combo + 1)} pontos`,
      });

      // Remover a nota acertada
      setNotes(prevNotes => prevNotes.filter(n => n.id !== hitNote.id));
    } else {
      // Errou ou tocou sem nota
      setCombo(0);
      
      // Ainda toca o som para feedback
      onNotePlay(lane.frequency, lane.color);
    }
  };

  // Gerenciar eventos de teclado
  useEffect(() => {
    if (isPlaying) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isPlaying, notes, combo]);

  // Iniciar/pausar o jogo
  const togglePlay = () => {
    if (!isPlaying) {
      generateNotes();
      setCurrentTime(0);
      updateNotes();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
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
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header com controles e pontuação */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            {instrumentType === "bell" ? "🔔 Sino-Hero" : "🎵 Xilofone-Hero"}
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
            <div className="text-xl font-bold">{combo}x</div>
          </div>
          <div>
            <div className="text-sm opacity-80">Max Combo</div>
            <div className="text-xl font-bold">{maxCombo}x</div>
          </div>
          <div>
            <div className="text-sm opacity-80">Velocidade</div>
            <div className="text-xl font-bold">{speed}x</div>
          </div>
        </div>
      </div>

      {/* Instruções */}
      <div className="bg-blue-50 p-3 text-center">
        <p className="text-sm text-blue-800">
          Use as teclas <strong>1-7</strong> para tocar as notas quando elas passarem pela zona de acerto!
        </p>
      </div>

      {/* Game Area */}
      <div 
        ref={gameRef}
        className="flex-1 relative bg-gradient-to-b from-gray-900 to-black overflow-hidden"
        style={{ height: "600px" }}
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
              backgroundColor: `${lane.color}20`
            }}
          >
            {/* Indicador da nota na parte inferior */}
            <div
              className="absolute bottom-0 w-full flex items-center justify-center text-white font-bold border-2 border-white/50"
              style={{
                height: "60px",
                backgroundColor: lane.color,
              }}
            >
              <div className="text-center">
                <div className="text-xs">{lane.key}</div>
                <div className="text-sm">{lane.name}</div>
              </div>
            </div>
          </div>
        ))}

        {/* Zona de acerto */}
        <div
          className="absolute w-full border-2 border-yellow-400 bg-yellow-400/20"
          style={{
            top: `${500 - hitZoneHeight / 2}px`,
            height: `${hitZoneHeight}px`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-yellow-400 font-bold text-lg">ZONA DE ACERTO</div>
          </div>
        </div>

        {/* Notas em queda */}
        {notes.map((note) => (
          <div
            key={note.id}
            className="absolute rounded-lg border-2 border-white shadow-lg"
            style={{
              left: `${(note.lane / lanes.length) * 100 + 10}%`,
              width: `${100 / lanes.length - 20}%`,
              top: `${note.y}px`,
              height: "40px",
              backgroundColor: note.color,
              transform: "translateX(-50%)",
            }}
          />
        ))}

        {/* Linha de referência no centro */}
        <div
          className="absolute w-full border-t-4 border-yellow-400"
          style={{ top: "500px" }}
        />
      </div>
    </div>
  );
};

export default GuitarHeroGame;
