
import React, { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import EducationalKeyboard from "./components/EducationalKeyboard";
import EducationalStaff from "./components/EducationalStaff";
import EducationalControls from "./components/EducationalControls";
import ColoredNotesSystem from "./components/ColoredNotesSystem";

interface Note {
  id: string;
  pitch: string;
  duration: number;
  position: { x: number; y: number };
  color: string;
  shape: string;
  timestamp: number;
}

interface Composition {
  id: string;
  name: string;
  notes: Note[];
  tempo: number;
  timeSignature: string;
}

const MusicComposer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(70);
  const [tempo, setTempo] = useState(120);
  const [timeSignature, setTimeSignature] = useState("4/4");
  const [selectedColor, setSelectedColor] = useState("#FF0000");
  const [selectedShape, setSelectedShape] = useState("circle");
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentComposition, setCurrentComposition] = useState<Composition | null>(null);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [currentBeat, setCurrentBeat] = useState(1);
  const [highlightedNote, setHighlightedNote] = useState<string | undefined>();
  
  const { toast } = useToast();
  const audioContextRef = useRef<AudioContext | null>(null);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const beatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mapeamento de cores para frequências
  const colorToFrequency: { [key: string]: { frequency: number; note: string } } = {
    "#FF0000": { frequency: 261.63, note: "C" },  // Vermelho - Dó
    "#FF9900": { frequency: 293.66, note: "D" },  // Laranja - Ré
    "#FFFF00": { frequency: 329.63, note: "E" },  // Amarelo - Mi
    "#00FF00": { frequency: 349.23, note: "F" },  // Verde - Fá
    "#0099FF": { frequency: 392.00, note: "G" },  // Azul claro - Sol
    "#0000FF": { frequency: 440.00, note: "A" },  // Azul - Lá
    "#9900FF": { frequency: 493.88, note: "B" },  // Roxo - Si
    "#FF6699": { frequency: 523.25, note: "C2" }  // Rosa - Dó agudo
  };

  useEffect(() => {
    // Initialize audio context
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
      if (beatIntervalRef.current) clearInterval(beatIntervalRef.current);
    };
  }, []);

  const playNote = (frequency: number, note: string, color: string, duration: number = 0.8) => {
    if (!audioContextRef.current || isMuted) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      const filterNode = audioContextRef.current.createBiquadFilter();

      // Configurar filtro para som mais suave
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(2000, audioContextRef.current.currentTime);

      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      oscillator.type = 'sine';

      // Envelope ADSR mais suave
      const currentTime = audioContextRef.current.currentTime;
      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(volume / 100 * 0.3, currentTime + 0.05); // Attack
      gainNode.gain.linearRampToValueAtTime(volume / 100 * 0.2, currentTime + 0.2); // Decay
      gainNode.gain.linearRampToValueAtTime(volume / 100 * 0.15, currentTime + duration - 0.2); // Sustain
      gainNode.gain.linearRampToValueAtTime(0, currentTime + duration); // Release

      oscillator.start(currentTime);
      oscillator.stop(currentTime + duration);

      // Feedback visual
      setHighlightedNote(note);
      setTimeout(() => setHighlightedNote(undefined), duration * 1000);

    } catch (error) {
      console.error("Erro ao reproduzir nota:", error);
    }
  };

  const handlePlay = () => {
    if (notes.length === 0) {
      toast({
        title: "Nenhuma nota encontrada",
        description: "Adicione algumas notas na partitura antes de reproduzir.",
        variant: "destructive"
      });
      return;
    }

    if (isPaused) {
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      setIsPlaying(true);
      setPlaybackPosition(0);
      setCurrentBeat(1);
    }

    // Intervalo de reprodução das notas
    playIntervalRef.current = setInterval(() => {
      setPlaybackPosition(prev => {
        const nextPos = prev + 1;
        if (nextPos >= notes.length) {
          handleStop();
          return 0;
        }
        
        // Reproduzir a nota atual
        const currentNote = notes[nextPos % notes.length];
        const colorInfo = colorToFrequency[currentNote.color];
        if (colorInfo) {
          playNote(colorInfo.frequency, colorInfo.note, currentNote.color);
        }
        
        return nextPos;
      });
    }, (60 / tempo) * 1000);

    // Intervalo do metrônomo
    beatIntervalRef.current = setInterval(() => {
      setCurrentBeat(prev => {
        const beats = parseInt(timeSignature.split('/')[0]);
        return prev >= beats ? 1 : prev + 1;
      });
    }, (60 / tempo) * 1000);

    toast({
      title: "🎵 Reprodução iniciada",
      description: "Acompanhe a música na partitura colorida!",
    });
  };

  const handlePause = () => {
    setIsPlaying(false);
    setIsPaused(true);
    if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    if (beatIntervalRef.current) clearInterval(beatIntervalRef.current);
    
    toast({
      title: "⏸️ Música pausada",
      description: "Clique em play para continuar.",
    });
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setPlaybackPosition(0);
    setCurrentBeat(1);
    setHighlightedNote(undefined);
    
    if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    if (beatIntervalRef.current) clearInterval(beatIntervalRef.current);
    
    toast({
      title: "⏹️ Reprodução parada",
      description: "Música reiniciada para o início.",
    });
  };

  const handlePrevious = () => {
    setPlaybackPosition(prev => Math.max(0, prev - 1));
    toast({
      title: "⏮️ Nota anterior",
      description: "Voltou uma nota na sequência.",
    });
  };

  const handleNext = () => {
    setPlaybackPosition(prev => Math.min(notes.length - 1, prev + 1));
    toast({
      title: "⏭️ Próxima nota",
      description: "Avançou uma nota na sequência.",
    });
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "🔊 Som ativado" : "🔇 Som desativado",
      description: isMuted ? "Agora você pode ouvir as notas!" : "Som silenciado.",
    });
  };

  const handleSave = () => {
    if (notes.length === 0) {
      toast({
        title: "Nada para salvar",
        description: "Adicione algumas notas antes de salvar.",
        variant: "destructive"
      });
      return;
    }

    const composition: Composition = {
      id: Date.now().toString(),
      name: `Música Educativa ${new Date().toLocaleDateString()}`,
      notes,
      tempo,
      timeSignature
    };

    const savedCompositions = JSON.parse(localStorage.getItem('educationalCompositions') || '[]');
    savedCompositions.push(composition);
    localStorage.setItem('educationalCompositions', JSON.stringify(savedCompositions));

    setCurrentComposition(composition);

    toast({
      title: "💾 Música salva!",
      description: "Sua composição educativa foi salva com sucesso!",
    });
  };

  const handleLoad = () => {
    const savedCompositions = JSON.parse(localStorage.getItem('educationalCompositions') || '[]');
    
    if (savedCompositions.length === 0) {
      toast({
        title: "Nenhuma música salva",
        description: "Crie e salve uma música primeiro!",
        variant: "destructive"
      });
      return;
    }

    // Carregar a última composição salva
    const lastComposition = savedCompositions[savedCompositions.length - 1];
    setNotes(lastComposition.notes);
    setTempo(lastComposition.tempo);
    setTimeSignature(lastComposition.timeSignature);
    setCurrentComposition(lastComposition);

    toast({
      title: "📂 Música carregada!",
      description: `Carregada: ${lastComposition.name}`,
    });
  };

  const handleAddNote = (pitch: string, position: { x: number; y: number }) => {
    const newNote: Note = {
      id: Date.now().toString(),
      pitch,
      duration: 1,
      position,
      color: selectedColor,
      shape: selectedShape,
      timestamp: Date.now()
    };

    setNotes(prev => [...prev, newNote]);
    
    // Reproduzir a nota adicionada
    const colorInfo = colorToFrequency[selectedColor];
    if (colorInfo) {
      playNote(colorInfo.frequency, colorInfo.note, selectedColor, 0.5);
    }

    toast({
      title: "🎵 Nota adicionada!",
      description: `Adicionada: ${pitch} (${colorInfo?.note || 'Nota'})`,
    });
  };

  const handleClearAll = () => {
    setNotes([]);
    setCurrentComposition(null);
    handleStop();
    
    toast({
      title: "🗑️ Tudo limpo!",
      description: "Todas as notas foram removidas da partitura.",
    });
  };

  const handleEraseAll = () => {
    handleClearAll();
  };

  const handleNotePlay = (frequency: number, note: string, color: string) => {
    playNote(frequency, note, color, 0.6);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      
      {/* Controles Superiores */}
      <div className="p-4 space-y-4">
        <EducationalControls
          isPlaying={isPlaying}
          isPaused={isPaused}
          isMuted={isMuted}
          volume={volume}
          tempo={tempo}
          timeSignature={timeSignature}
          onPlay={handlePlay}
          onPause={handlePause}
          onStop={handleStop}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onMute={handleMute}
          onVolumeChange={setVolume}
          onTempoChange={setTempo}
          onTimeSignatureChange={setTimeSignature}
          onSave={handleSave}
          onLoad={handleLoad}
          onClear={handleClearAll}
          currentBeat={currentBeat}
          totalBeats={parseInt(timeSignature.split('/')[0])}
        />
        
        <ColoredNotesSystem
          selectedColor={selectedColor}
          selectedShape={selectedShape}
          onColorSelect={setSelectedColor}
          onShapeSelect={setSelectedShape}
          onEraseAll={handleEraseAll}
        />
      </div>

      {/* Área Principal */}
      <div className="flex-1 flex flex-col space-y-4 px-4">
        
        {/* Teclado Virtual */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <EducationalKeyboard
            onNotePlay={handleNotePlay}
            onNoteAdd={handleAddNote}
            selectedColor={selectedColor}
            isRecording={true}
            highlightedNote={highlightedNote}
          />
        </div>

        {/* Partitura Musical */}
        <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden">
          <EducationalStaff
            notes={notes}
            onAddNote={handleAddNote}
            playbackPosition={playbackPosition}
            isPlaying={isPlaying}
            timeSignature={timeSignature}
            highlightedNote={highlightedNote}
            selectedColor={selectedColor}
            selectedShape={selectedShape}
          />
        </div>
      </div>

      {/* Barra de Status */}
      <div className="bg-white border-t border-gray-200 p-3 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-6">
          <span className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Piano Educativo TEA</span>
          </span>
          <span>🎵 Notas: {notes.length}</span>
          <span>⏱️ Tempo: {tempo} BPM</span>
          <span>🎼 Compasso: {timeSignature}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-purple-600 font-semibold">Software Educacional Musical</span>
          <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default MusicComposer;
