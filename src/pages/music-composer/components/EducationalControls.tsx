
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward,
  Volume2,
  VolumeX,
  RotateCcw,
  Settings,
  Save,
  FolderOpen,
  Home
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface EducationalControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  isMuted: boolean;
  volume: number;
  tempo: number;
  timeSignature: string;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onMute: () => void;
  onVolumeChange: (volume: number) => void;
  onTempoChange: (tempo: number) => void;
  onTimeSignatureChange: (timeSignature: string) => void;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
  currentBeat: number;
  totalBeats: number;
}

const EducationalControls: React.FC<EducationalControlsProps> = ({
  isPlaying,
  isPaused,
  isMuted,
  volume,
  tempo,
  timeSignature,
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
  currentBeat = 1,
  totalBeats = 4
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const timeSignatures = ["4/4", "3/4", "2/4", "6/8"];

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-xl shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Logo e Info */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
          >
            <Home size={24} />
          </Button>
          
          <div className="bg-white/20 rounded-full px-4 py-2 flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white font-bold">Piano Educativo</span>
          </div>
        </div>

        {/* Controles Principais */}
        <div className="flex items-center space-x-2 bg-black/30 rounded-xl p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            className="text-white hover:bg-white/20 rounded-full w-12 h-12"
          >
            <SkipBack size={20} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={isPlaying ? onPause : onPlay}
            className="text-white hover:bg-white/20 rounded-full w-16 h-16 bg-green-500 hover:bg-green-600"
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onStop}
            className="text-white hover:bg-white/20 rounded-full w-12 h-12"
          >
            <Square size={20} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            className="text-white hover:bg-white/20 rounded-full w-12 h-12"
          >
            <SkipForward size={20} />
          </Button>
        </div>

        {/* Metrônomo Visual */}
        <div className="flex items-center space-x-3 bg-black/30 rounded-xl p-3">
          <div className="text-white text-center">
            <div className="text-xs opacity-75">TEMPO</div>
            <div className="text-2xl font-bold">{tempo}</div>
            <div className="text-xs opacity-75">BPM</div>
          </div>
          
          {/* Beat visual */}
          <div className="flex space-x-1">
            {Array.from({ length: totalBeats }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i + 1 === currentBeat && isPlaying
                    ? "bg-yellow-400 scale-125 animate-pulse"
                    : "bg-white/40"
                }`}
              />
            ))}
          </div>
          
          <div className="text-white text-center">
            <div className="text-xs opacity-75">COMPASSO</div>
            <div className="text-xl font-bold">{timeSignature}</div>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center space-x-2 bg-black/30 rounded-xl p-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMute}
            className="text-white hover:bg-white/20"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
          
          <div className="w-20">
            <Slider
              value={[volume]}
              onValueChange={(value) => onVolumeChange(value[0])}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          
          <span className="text-white text-sm w-8">{volume}%</span>
        </div>

        {/* Ferramentas */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSave}
            className="text-white hover:bg-white/20 rounded-full"
            title="Salvar Composição"
          >
            <Save size={20} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onLoad}
            className="text-white hover:bg-white/20 rounded-full"
            title="Carregar Composição"
          >
            <FolderOpen size={20} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="text-white hover:bg-white/20 rounded-full bg-red-500 hover:bg-red-600"
            title="Limpar Tudo"
          >
            <RotateCcw size={20} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-white hover:bg-white/20 rounded-full"
            title="Configurações Avançadas"
          >
            <Settings size={20} />
          </Button>
        </div>
      </div>

      {/* Controles Avançados */}
      {showAdvanced && (
        <div className="mt-4 p-4 bg-black/20 rounded-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Controle de Tempo */}
            <div className="space-y-2">
              <label className="text-white text-sm font-bold">Velocidade (BPM)</label>
              <div className="flex items-center space-x-2">
                <span className="text-white text-xs">60</span>
                <Slider
                  value={[tempo]}
                  onValueChange={(value) => onTempoChange(value[0])}
                  min={60}
                  max={200}
                  step={1}
                  className="flex-1"
                />
                <span className="text-white text-xs">200</span>
              </div>
              <div className="text-center text-white text-xs">
                {tempo < 80 && "🐌 Muito Lento"}
                {tempo >= 80 && tempo < 120 && "🚶 Lento"}
                {tempo >= 120 && tempo < 160 && "🏃 Normal"}
                {tempo >= 160 && "🏃‍♂️💨 Rápido"}
              </div>
            </div>

            {/* Compasso */}
            <div className="space-y-2">
              <label className="text-white text-sm font-bold">Compasso</label>
              <select
                value={timeSignature}
                onChange={(e) => onTimeSignatureChange(e.target.value)}
                className="w-full p-2 rounded-lg bg-white/20 text-white border border-white/30"
              >
                {timeSignatures.map(ts => (
                  <option key={ts} value={ts} className="bg-gray-800">
                    {ts} {ts === "4/4" ? "(Comum)" : ts === "3/4" ? "(Valsa)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Informações */}
            <div className="space-y-2">
              <label className="text-white text-sm font-bold">Status</label>
              <div className="bg-white/20 rounded-lg p-3 text-white text-sm space-y-1">
                <div>🎵 Estado: {isPlaying ? "▶️ Tocando" : isPaused ? "⏸️ Pausado" : "⏹️ Parado"}</div>
                <div>🔊 Volume: {isMuted ? "🔇 Mudo" : `${volume}%`}</div>
                <div>⏱️ Tempo: {tempo} BPM</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationalControls;
