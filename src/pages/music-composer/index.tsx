
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward,
  Volume2,
  VolumeX,
  Save,
  FolderOpen,
  Download,
  Upload,
  Trash2,
  Settings,
  Info,
  Home
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PianoKeyboard from "./components/PianoKeyboard";
import MusicalStaff from "./components/MusicalStaff";
import ToolBar from "./components/ToolBar";
import ColoredNotes from "./components/ColoredNotes";

interface Note {
  id: string;
  pitch: string;
  duration: number;
  position: { x: number; y: number };
  color: string;
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
  const [selectedTool, setSelectedTool] = useState("note");
  const [selectedColor, setSelectedColor] = useState("#FF0000");
  const [selectedDuration, setSelectedDuration] = useState("quarter");
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentComposition, setCurrentComposition] = useState<Composition | null>(null);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  
  const { toast } = useToast();
  const audioContextRef = useRef<AudioContext | null>(null);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize audio context
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, []);

  const playNote = (frequency: number, duration: number = 0.5) => {
    if (!audioContextRef.current || isMuted) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume / 100, audioContextRef.current.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + duration);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  };

  const handlePlay = () => {
    if (isPaused) {
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      setIsPlaying(true);
      setPlaybackPosition(0);
    }

    // Start playback interval
    playIntervalRef.current = setInterval(() => {
      setPlaybackPosition(prev => prev + 1);
    }, (60 / tempo) * 1000);

    toast({
      title: "Reprodução iniciada",
      description: "A composição está sendo reproduzida.",
    });
  };

  const handlePause = () => {
    setIsPlaying(false);
    setIsPaused(true);
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setPlaybackPosition(0);
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }
  };

  const handleSave = () => {
    const composition: Composition = {
      id: Date.now().toString(),
      name: `Composição ${new Date().toLocaleDateString()}`,
      notes,
      tempo,
      timeSignature
    };

    // Save to localStorage
    const savedCompositions = JSON.parse(localStorage.getItem('musicCompositions') || '[]');
    savedCompositions.push(composition);
    localStorage.setItem('musicCompositions', JSON.stringify(savedCompositions));

    setCurrentComposition(composition);

    toast({
      title: "Composição salva",
      description: "Sua composição foi salva com sucesso!",
    });
  };

  const handleAddNote = (pitch: string, position: { x: number; y: number }) => {
    const newNote: Note = {
      id: Date.now().toString(),
      pitch,
      duration: getDurationValue(selectedDuration),
      position,
      color: selectedColor,
      timestamp: Date.now()
    };

    setNotes(prev => [...prev, newNote]);
  };

  const getDurationValue = (duration: string): number => {
    switch (duration) {
      case 'whole': return 4;
      case 'half': return 2;
      case 'quarter': return 1;
      case 'eighth': return 0.5;
      case 'sixteenth': return 0.25;
      default: return 1;
    }
  };

  const handleClearAll = () => {
    setNotes([]);
    setCurrentComposition(null);
    toast({
      title: "Composição limpa",
      description: "Todas as notas foram removidas.",
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-blue-900 to-blue-700 text-white">
      {/* Top Toolbar */}
      <div className="bg-gray-800 border-b border-gray-600 p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
              <Home size={20} />
            </Button>
            <div className="bg-orange-500 rounded-full p-2">
              <Info size={16} className="text-white" />
            </div>
            <div className="bg-green-600 rounded-full p-2">
              <span className="text-white text-sm font-bold">4/4</span>
            </div>
          </div>

          <ToolBar
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
            selectedDuration={selectedDuration}
            onDurationSelect={setSelectedDuration}
          />

          <ColoredNotes
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
          />

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={isPlaying ? handlePause : handlePlay}
              className="text-white hover:bg-gray-700"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleStop}
              className="text-white hover:bg-gray-700"
            >
              <Square size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="text-white hover:bg-gray-700"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              className="text-white hover:bg-gray-700"
            >
              <Save size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearAll}
              className="text-white hover:bg-gray-700"
            >
              <Trash2 size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Musical Staff */}
        <div className="flex-1 bg-white">
          <MusicalStaff
            notes={notes}
            onAddNote={handleAddNote}
            playbackPosition={playbackPosition}
            isPlaying={isPlaying}
            timeSignature={timeSignature}
          />
        </div>

        {/* Piano Keyboard */}
        <div className="bg-gray-900 p-4">
          <PianoKeyboard
            onNotePlay={playNote}
            onNoteAdd={handleAddNote}
            selectedColor={selectedColor}
            isRecording={selectedTool === 'note'}
          />
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-blue-600 p-2 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span>Tempo: {tempo} BPM</span>
          <span>Compasso: {timeSignature}</span>
          <span>Notas: {notes.length}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Software</span>
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default MusicComposer;
