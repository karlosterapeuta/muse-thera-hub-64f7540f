
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  RotateCcw,
  Settings,
  Home,
  FileText,
  Music
} from "lucide-react";

interface TopToolbarProps {
  // Playback controls
  isPlaying: boolean;
  isPaused: boolean;
  isMuted: boolean;
  volume: number;
  tempo: number;
  timeSignature: string;
  currentBeat: number;
  totalBeats: number;
  
  // Handlers
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onMute: () => void;
  onVolumeChange: (value: number) => void;
  onTempoChange: (value: number) => void;
  onTimeSignatureChange: (value: string) => void;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
  
  // Note tools
  selectedColor: string;
  selectedShape: string;
  onColorSelect: (color: string) => void;
  onShapeSelect: (shape: string) => void;
}

const TopToolbar: React.FC<TopToolbarProps> = ({
  isPlaying,
  isPaused,
  isMuted,
  volume,
  tempo,
  timeSignature,
  currentBeat,
  totalBeats,
  onPlay,
  onPause,
  onStop,
  onPrevious,
  onNext,
  onMute,
  onVolumeChange,
  onTempoChange,
  onTimeSignatureChange,
  onSave,
  onLoad,
  onClear,
  selectedColor,
  selectedShape,
  onColorSelect,
  onShapeSelect
}) => {
  const noteColors = [
    { color: "#FF0000", note: "C", name: "Dó" },
    { color: "#FF6600", note: "D", name: "Ré" },
    { color: "#FFFF00", note: "E", name: "Mi" },
    { color: "#00CC00", note: "F", name: "Fá" },
    { color: "#0099FF", note: "G", name: "Sol" },
    { color: "#6600FF", note: "A", name: "Lá" },
    { color: "#FF1493", note: "B", name: "Si" }
  ];

  const noteShapes = [
    { shape: "circle", symbol: "●", name: "Círculo" },
    { shape: "square", symbol: "■", name: "Quadrado" },
    { shape: "triangle", symbol: "▲", name: "Triângulo" },
    { shape: "diamond", symbol: "◆", name: "Losango" }
  ];

  const timeSignatures = ["2/4", "3/4", "4/4", "6/8"];

  return (
    <div className="bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 border-b border-gray-500 p-2">
      <div className="flex items-center justify-between gap-2">
        
        {/* Left Section - Main Tools */}
        <div className="flex items-center gap-1">
          {/* File Operations */}
          <div className="flex items-center gap-1 bg-gray-500/50 rounded p-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={onSave}
              className="text-white hover:bg-gray-400 h-7 w-7 p-0"
              title="Salvar"
            >
              <Save className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onLoad}
              className="text-white hover:bg-gray-400 h-7 w-7 p-0"
              title="Carregar"
            >
              <FolderOpen className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClear}
              className="text-white hover:bg-gray-400 h-7 w-7 p-0"
              title="Limpar"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>

          {/* Time Signature */}
          <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
            {timeSignature.split('/')[0]}
          </div>
          <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
            {timeSignature.split('/')[1]}
          </div>

          {/* Tempo Circle */}
          <div className="bg-red-500 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold text-white border-2 border-red-600">
            {Math.round(tempo/10)}
          </div>

          {/* Metronome Visual */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalBeats }, (_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  i + 1 === currentBeat && isPlaying
                    ? "bg-green-500 border-green-300 text-white"
                    : "bg-gray-300 border-gray-400 text-gray-700"
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Note Tools */}
          <div className="flex items-center gap-1">
            {noteShapes.map((shape) => (
              <button
                key={shape.shape}
                onClick={() => onShapeSelect(shape.shape)}
                className={`w-6 h-6 flex items-center justify-center text-white rounded border-2 transition-all ${
                  selectedShape === shape.shape
                    ? "border-white bg-blue-600"
                    : "border-gray-400 hover:border-gray-200 bg-gray-600"
                }`}
                title={shape.name}
              >
                <span className="text-xs">{shape.symbol}</span>
              </button>
            ))}
          </div>

          {/* Color Picker */}
          <div className="flex items-center gap-1">
            {noteColors.map((note) => (
              <button
                key={note.color}
                onClick={() => onColorSelect(note.color)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  selectedColor === note.color
                    ? "border-white scale-110"
                    : "border-gray-400 hover:border-gray-200"
                }`}
                style={{ backgroundColor: note.color }}
                title={`${note.name} (${note.note})`}
              />
            ))}
          </div>

          <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">X</div>
        </div>

        {/* Center Section - Playback Controls */}
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={onPrevious}
            className="text-white hover:bg-gray-500 h-8 w-8 p-0 bg-gray-600 rounded-full"
            title="Anterior"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={isPlaying ? onPause : onPlay}
            className={`h-8 w-8 p-0 rounded-full ${
              isPlaying 
                ? "bg-yellow-500 hover:bg-yellow-600 text-white" 
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
            title={isPlaying ? "Pausar" : "Reproduzir"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onStop}
            className="text-white hover:bg-gray-500 h-8 w-8 p-0 bg-gray-600 rounded-full"
            title="Parar"
          >
            <Square className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onNext}
            className="text-white hover:bg-gray-500 h-8 w-8 p-0 bg-gray-600 rounded-full"
            title="Próximo"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Right Section - Additional Tools */}
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-gray-500 h-7 w-7 p-0 bg-orange-500 rounded"
            title="Configurações"
          >
            <Music className="w-3 h-3" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-gray-500 h-7 w-7 p-0 bg-blue-500 rounded"
            title="Ondas"
          >
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-gray-500 h-7 w-7 p-0 bg-gray-600 rounded"
            title="Home"
          >
            <Home className="w-3 h-3" />
          </Button>

          {/* Volume Control */}
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={onMute}
              className="text-white hover:bg-gray-500 h-7 w-7 p-0 bg-gray-600 rounded"
              title={isMuted ? "Ativar Som" : "Silenciar"}
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
              <FileText className="w-3 h-3 text-white" />
            </div>
            <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
              <Settings className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopToolbar;
