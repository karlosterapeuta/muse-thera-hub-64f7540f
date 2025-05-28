import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Define the colors for each note
const noteColors = {
  "1": { bg: "#FF0000", text: "white", name: "Vermelho" },
  "2": { bg: "#FF9933", text: "white", name: "Laranja" },
  "3": { bg: "#FFFF00", text: "black", name: "Amarelo" },
  "4": { bg: "#33CC33", text: "white", name: "Verde" },
  "5": { bg: "#33CCFF", text: "black", name: "Azul Claro" },
  "6": { bg: "#0000FF", text: "white", name: "Azul" },
  "7": { bg: "#9933CC", text: "white", name: "Roxo" },
};

// Define the songs and their notes
const songs = {
  "twinkle-bell": {
    title: "Brilha, Brilha Estrelinha",
    notes: ["1", "1", "5", "5", "6", "6", "5", "4", "4", "3", "3", "2", "2", "1"],
    speed: 800
  },
  "mary-lamb-bell": {
    title: "Mary Had a Little Lamb", 
    notes: ["3", "2", "1", "2", "3", "3", "3", "2", "2", "2", "3", "5", "5"],
    speed: 700
  },
  "old-macdonald-bell": {
    title: "Old MacDonald",
    notes: ["1", "1", "1", "5", "6", "6", "5", "3", "3", "2", "2", "1"],
    speed: 600
  },
  "row-boat-bell": {
    title: "Row Your Boat",
    notes: ["1", "1", "1", "2", "3", "3", "2", "3", "4", "5"],
    speed: 900
  },
  "happy-birthday-xylophone": {
    title: "Parabéns para Você",
    notes: ["1", "1", "2", "1", "4", "3", "1", "1", "2", "1", "5", "4"],
    speed: 700
  },
  "london-bridge-xylophone": {
    title: "London Bridge",
    notes: ["5", "6", "5", "4", "3", "4", "5", "2", "3", "4", "3", "4", "5"],
    speed: 600
  },
  "jingle-bells-xylophone": {
    title: "Jingle Bells",
    notes: ["3", "3", "3", "3", "3", "3", "3", "5", "1", "2", "3"],
    speed: 500
  }
};

interface GuitarHeroGameProps {
  instrumentType?: "bell" | "xylophone" | "keyboard";
  onNotePlay?: (frequency: number, color: string) => void;
  songId?: string;
}

const GuitarHeroGame: React.FC<GuitarHeroGameProps> = ({
  instrumentType = "bell",
  onNotePlay,
  songId = "twinkle-bell"
}) => {
  const [gameState, setGameState] = useState<"menu" | "playing" | "paused" | "ended">("menu");
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [fallingNotes, setFallingNotes] = useState<Array<{id: number, note: string, position: number}>>([]);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const currentSong = useMemo(() => songs[songId as keyof typeof songs] || songs["twinkle-bell"], [songId]);

  // Simplified note generation
  const generateNote = useCallback(() => {
    if (gameState !== "playing" || currentNoteIndex >= currentSong.notes.length) return;
    
    const noteId = Date.now();
    const note = currentSong.notes[currentNoteIndex];
    
    setFallingNotes(prev => [...prev, { id: noteId, note, position: 0 }]);
    setCurrentNoteIndex(prev => prev + 1);
  }, [gameState, currentNoteIndex, currentSong]);

  // Simplified animation loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      setFallingNotes(prev => {
        const updated = prev.map(note => ({ ...note, position: note.position + 2 }))
          .filter(note => note.position < 100);
        return updated;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gameState]);

  // Note generation timer
  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setTimeout(generateNote, currentSong.speed);
    return () => clearTimeout(timer);
  }, [gameState, generateNote, currentSong.speed]);

  // Simplified key handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (["1", "2", "3", "4", "5", "6", "7"].includes(key) && !pressedKeys.has(key)) {
        setPressedKeys(prev => new Set([...prev, key]));
        handleNotePress(key);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(event.key);
        return newSet;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [pressedKeys]);

  const handleNotePress = useCallback((noteKey: string) => {
    if (onNotePlay) {
      const frequency = 200 + parseInt(noteKey) * 100;
      const color = noteColors[noteKey as keyof typeof noteColors];
      onNotePlay(frequency, color.name);
    }

    // Check for hit
    const hitNote = fallingNotes.find(note => 
      note.note === noteKey && note.position >= 75 && note.position <= 85
    );

    if (hitNote) {
      setScore(prev => prev + 100);
      setStreak(prev => prev + 1);
      setFallingNotes(prev => prev.filter(note => note.id !== hitNote.id));
      
      toast({
        title: "Acertou! 🎵",
        description: `+100 pontos!`,
        duration: 1000,
      });
    }
  }, [fallingNotes, onNotePlay, toast]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setStreak(0);
    setCurrentNoteIndex(0);
    setFallingNotes([]);
  };

  const resetGame = () => {
    setGameState("menu");
    setScore(0);
    setStreak(0);
    setCurrentNoteIndex(0);
    setFallingNotes([]);
  };

  const togglePause = () => {
    setGameState(prev => prev === "playing" ? "paused" : "playing");
  };

  const goHome = () => {
    navigate("/tea-hero");
  };

  return (
    <div className="h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-black/30 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{currentSong.title}</h1>
          <p className="text-sm opacity-75">Pontos: {score} | Sequência: {streak}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={goHome} variant="outline" size="sm">
            <Home className="w-4 h-4" />
          </Button>
          {gameState === "menu" ? (
            <Button onClick={startGame} variant="default">
              <Play className="w-4 h-4 mr-2" />
              Iniciar
            </Button>
          ) : (
            <>
              <Button onClick={togglePause} variant="outline" size="sm">
                {gameState === "playing" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button onClick={resetGame} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Game Area */}
      <div className="relative h-[calc(100vh-200px)] mx-4">
        {/* Falling Notes */}
        {fallingNotes.map(note => (
          <div
            key={note.id}
            className="absolute w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-none"
            style={{
              backgroundColor: noteColors[note.note as keyof typeof noteColors].bg,
              color: noteColors[note.note as keyof typeof noteColors].text,
              left: `${(parseInt(note.note) - 1) * 14.28}%`,
              top: `${note.position}%`,
              transform: "translateX(-50%)"
            }}
          >
            {note.note}
          </div>
        ))}

        {/* Hit Zone */}
        <div className="absolute bottom-32 left-0 right-0 h-16 bg-yellow-400/30 border-y-2 border-yellow-400" />
      </div>

      {/* Controls */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/50">
        <div className="flex justify-center gap-2">
          {Object.entries(noteColors).map(([key, color]) => (
            <button
              key={key}
              className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-transform ${
                pressedKeys.has(key) ? "scale-90" : ""
              }`}
              style={{
                backgroundColor: color.bg,
                color: color.text,
                borderColor: pressedKeys.has(key) ? "#FFD700" : color.bg
              }}
              onClick={() => handleNotePress(key)}
            >
              {key}
            </button>
          ))}
        </div>
        <p className="text-center mt-2 text-sm opacity-75">
          Use as teclas 1-7 ou clique nos botões
        </p>
      </div>

      {/* Game Over */}
      {gameState === "ended" && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="text-center">Fim de Jogo!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p>Pontuação Final: <strong>{score}</strong></p>
              <p>Maior Sequência: <strong>{streak}</strong></p>
              <div className="flex gap-2 justify-center">
                <Button onClick={startGame}>Jogar Novamente</Button>
                <Button onClick={goHome} variant="outline">Menu Principal</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GuitarHeroGame;
