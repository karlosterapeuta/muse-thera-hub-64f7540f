
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
  Settings
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
    <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 border-b-2 border-gray-600 p-3">
      <div className="flex items-center justify-between">
        
        {/* Left Section - File Operations */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-gray-600 rounded-lg p-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={onSave}
              className="text-white hover:bg-gray-500 h-8 w-8 p-0"
              title="Salvar"
            >
              <Save className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onLoad}
              className="text-white hover:bg-gray-500 h-8 w-8 p-0"
              title="Carregar"
            >
              <FolderOpen className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClear}
              className="text-white hover:bg-gray-500 h-8 w-8 p-0"
              title="Limpar Tudo"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-8 bg-gray-500" />

          {/* Time Signature */}
          <div className="flex items-center space-x-1">
            <span className="text-white text-xs font-bold">Compasso:</span>
            <select
              value={timeSignature}
              onChange={(e) => onTimeSignatureChange(e.target.value)}
              className="bg-gray-600 text-white text-sm rounded px-2 py-1 border border-gray-500"
            >
              {timeSignatures.map(ts => (
                <option key={ts} value={ts}>{ts}</option>
              ))}
            </select>
          </div>

          {/* Metronome Visual */}
          <div className="flex items-center space-x-1">
            <span className="text-white text-xs font-bold">Tempo:</span>
            <div className="flex space-x-1">
              {Array.from({ length: totalBeats }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full border-2 ${
                    i + 1 === currentBeat && isPlaying
                      ? "bg-red-500 border-red-300 animate-pulse"
                      : "bg-gray-600 border-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Center Section - Playback Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-gray-600 rounded-lg p-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={onPrevious}
              className="text-white hover:bg-gray-500 h-8 w-8 p-0"
              title="Anterior"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={isPlaying ? onPause : onPlay}
              className={`h-8 w-8 p-0 ${
                isPlaying 
                  ? "bg-yellow-600 hover:bg-yellow-700 text-white" 
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
              title={isPlaying ? "Pausar" : "Reproduzir"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onStop}
              className="text-white hover:bg-gray-500 bg-red-600 hover:bg-red-700 h-8 w-8 p-0"
              title="Parar"
            >
              <Square className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onNext}
              className="text-white hover:bg-gray-500 h-8 w-8 p-0"
              title="Próximo"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-8 bg-gray-500" />

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={onMute}
              className="text-white hover:bg-gray-500 h-8 w-8 p-0"
              title={isMuted ? "Ativar Som" : "Silenciar"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-16 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              title={`Volume: ${volume}%`}
            />
            <span className="text-white text-xs w-8">{volume}%</span>
          </div>

          {/* Tempo Control */}
          <div className="flex items-center space-x-2">
            <span className="text-white text-xs font-bold">BPM:</span>
            <input
              type="range"
              min="60"
              max="200"
              value={tempo}
              onChange={(e) => onTempoChange(Number(e.target.value))}
              className="w-16 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              title={`Tempo: ${tempo} BPM`}
            />
            <span className="text-white text-xs w-8">{tempo}</span>
          </div>
        </div>

        {/* Right Section - Note Tools */}
        <div className="flex items-center space-x-2">
          {/* Color Picker */}
          <div className="flex items-center space-x-1">
            <span className="text-white text-xs font-bold">Cores:</span>
            <div className="flex space-x-1 bg-gray-600 rounded-lg p-1">
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
          </div>

          <Separator orientation="vertical" className="h-8 bg-gray-500" />

          {/* Shape Picker */}
          <div className="flex items-center space-x-1">
            <span className="text-white text-xs font-bold">Formas:</span>
            <div className="flex space-x-1 bg-gray-600 rounded-lg p-1">
              {noteShapes.map((shape) => (
                <button
                  key={shape.shape}
                  onClick={() => onShapeSelect(shape.shape)}
                  className={`w-6 h-6 flex items-center justify-center text-white rounded border-2 transition-all ${
                    selectedShape === shape.shape
                      ? "border-white bg-blue-600 scale-110"
                      : "border-gray-400 hover:border-gray-200 hover:bg-gray-500"
                  }`}
                  title={shape.name}
                >
                  <span className="text-sm">{shape.symbol}</span>
                </button>
              ))}
            </div>
          </div>

          <Separator orientation="vertical" className="h-8 bg-gray-500" />

          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-gray-500 h-8 w-8 p-0"
            title="Configurações"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopToolbar;
