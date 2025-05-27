
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
  Music,
  Timer,
  Zap
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

  const getTempoDescription = (bpm: number) => {
    if (bpm < 80) return "🐌 Muito Lento";
    if (bpm < 120) return "🚶 Moderato";
    if (bpm < 160) return "🏃 Allegro";
    return "🏃‍♂️💨 Presto";
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-6 rounded-2xl shadow-2xl border-4 border-white/20">
      
      {/* Header Principal */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        
        {/* Logo e Branding */}
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 backdrop-blur rounded-full p-3 flex items-center space-x-3">
            <Music className="text-white w-8 h-8" />
            <div className="text-white">
              <div className="font-bold text-lg">Piano TEA</div>
              <div className="text-xs opacity-80">Software Educativo</div>
            </div>
          </div>
        </div>

        {/* Status Visual */}
        <div className="flex items-center space-x-4">
          <div className="bg-black/30 backdrop-blur rounded-xl p-3 flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full animate-pulse ${
              isPlaying ? 'bg-green-400' : isPaused ? 'bg-yellow-400' : 'bg-red-400'
            }`}></div>
            <span className="text-white font-bold">
              {isPlaying ? "▶️ TOCANDO" : isPaused ? "⏸️ PAUSADO" : "⏹️ PARADO"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
        
        {/* Controles de Reprodução */}
        <div className="lg:col-span-1">
          <div className="bg-black/30 backdrop-blur rounded-2xl p-4">
            <div className="text-white text-center text-sm font-bold mb-3">🎵 REPRODUÇÃO</div>
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onPrevious}
                className="text-white hover:bg-white/20 rounded-full w-12 h-12 transition-all hover:scale-110"
                title="Anterior"
              >
                <SkipBack size={20} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={isPlaying ? onPause : onPlay}
                className="text-white hover:bg-white/20 rounded-full w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg transition-all hover:scale-110"
                title={isPlaying ? "Pausar" : "Tocar"}
              >
                {isPlaying ? <Pause size={28} /> : <Play size={28} />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onStop}
                className="text-white hover:bg-white/20 rounded-full w-12 h-12 transition-all hover:scale-110"
                title="Parar"
              >
                <Square size={20} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onNext}
                className="text-white hover:bg-white/20 rounded-full w-12 h-12 transition-all hover:scale-110"
                title="Próximo"
              >
                <SkipForward size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Metrônomo e Tempo */}
        <div className="lg:col-span-1">
          <div className="bg-black/30 backdrop-blur rounded-2xl p-4">
            <div className="text-white text-center text-sm font-bold mb-3">
              <Timer className="w-4 h-4 inline mr-1" />
              METRÔNOMO
            </div>
            
            <div className="text-center mb-3">
              <div className="text-3xl font-bold text-white mb-1">{tempo}</div>
              <div className="text-xs text-gray-200">BPM</div>
              <div className="text-xs text-yellow-300">{getTempoDescription(tempo)}</div>
            </div>
            
            {/* Beat visual melhorado */}
            <div className="flex justify-center space-x-1 mb-3">
              {Array.from({ length: totalBeats }, (_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    i + 1 === currentBeat && isPlaying
                      ? "bg-yellow-400 scale-125 animate-pulse shadow-lg shadow-yellow-400/50"
                      : "bg-white/40"
                  }`}
                />
              ))}
            </div>
            
            <div className="text-center">
              <span className="text-white text-lg font-bold bg-black/50 px-3 py-1 rounded-lg">
                {timeSignature}
              </span>
            </div>
          </div>
        </div>

        {/* Volume */}
        <div className="lg:col-span-1">
          <div className="bg-black/30 backdrop-blur rounded-2xl p-4">
            <div className="text-white text-center text-sm font-bold mb-3">🔊 VOLUME</div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onMute}
                className="text-white hover:bg-white/20 rounded-full"
                title={isMuted ? "Ativar Som" : "Silenciar"}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Button>
              
              <div className="flex-1">
                <Slider
                  value={[volume]}
                  onValueChange={(value) => onVolumeChange(value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled={isMuted}
                />
              </div>
              
              <span className="text-white text-sm w-12 text-center font-bold">
                {isMuted ? "🔇" : `${volume}%`}
              </span>
            </div>

            <div className="mt-2 text-center">
              <div className={`text-xs px-2 py-1 rounded ${
                volume > 70 ? 'bg-red-500/30 text-red-200' :
                volume > 40 ? 'bg-yellow-500/30 text-yellow-200' :
                'bg-green-500/30 text-green-200'
              }`}>
                {volume > 70 ? '📢 Alto' : volume > 40 ? '🔉 Médio' : '🔈 Baixo'}
              </div>
            </div>
          </div>
        </div>

        {/* Ferramentas */}
        <div className="lg:col-span-1">
          <div className="bg-black/30 backdrop-blur rounded-2xl p-4">
            <div className="text-white text-center text-sm font-bold mb-3">🛠️ FERRAMENTAS</div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onSave}
                className="text-white hover:bg-green-500/30 rounded-xl p-2 transition-all hover:scale-105"
                title="Salvar Música"
              >
                <Save size={16} className="mr-1" />
                <span className="text-xs">Salvar</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onLoad}
                className="text-white hover:bg-blue-500/30 rounded-xl p-2 transition-all hover:scale-105"
                title="Carregar Música"
              >
                <FolderOpen size={16} className="mr-1" />
                <span className="text-xs">Abrir</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="text-white hover:bg-red-500/30 rounded-xl p-2 transition-all hover:scale-105"
                title="Limpar Tudo"
              >
                <RotateCcw size={16} className="mr-1" />
                <span className="text-xs">Limpar</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-white hover:bg-purple-500/30 rounded-xl p-2 transition-all hover:scale-105"
                title="Configurações"
              >
                <Settings size={16} className="mr-1" />
                <span className="text-xs">Config</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Controles Avançados */}
      {showAdvanced && (
        <div className="mt-6 p-4 bg-black/20 backdrop-blur rounded-2xl border border-white/20">
          <div className="text-white text-center font-bold mb-4 flex items-center justify-center">
            <Zap className="w-5 h-5 mr-2" />
            CONFIGURAÇÕES AVANÇADAS
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Controle de Tempo Detalhado */}
            <div className="space-y-3">
              <label className="text-white text-sm font-bold flex items-center">
                <Timer className="w-4 h-4 mr-2" />
                Velocidade (BPM): {tempo}
              </label>
              <Slider
                value={[tempo]}
                onValueChange={(value) => onTempoChange(value[0])}
                min={60}
                max={200}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-300">
                <span>60 🐌</span>
                <span className="font-bold text-yellow-300">{getTempoDescription(tempo)}</span>
                <span>200 🏃‍♂️💨</span>
              </div>
            </div>

            {/* Compasso */}
            <div className="space-y-3">
              <label className="text-white text-sm font-bold flex items-center">
                <Music className="w-4 h-4 mr-2" />
                Fórmula de Compasso
              </label>
              <select
                value={timeSignature}
                onChange={(e) => onTimeSignatureChange(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 backdrop-blur"
              >
                {timeSignatures.map(ts => (
                  <option key={ts} value={ts} className="bg-gray-800 text-white">
                    {ts} {ts === "4/4" ? "(Comum)" : ts === "3/4" ? "(Valsa)" : ts === "2/4" ? "(Marcha)" : "(Composto)"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Informações de Status */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl mb-1">{isPlaying ? "▶️" : isPaused ? "⏸️" : "⏹️"}</div>
              <div className="text-xs text-gray-300">Estado</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl mb-1">{isMuted ? "🔇" : "🔊"}</div>
              <div className="text-xs text-gray-300">Audio</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl mb-1">🎵</div>
              <div className="text-xs text-gray-300">{timeSignature}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl mb-1">⏱️</div>
              <div className="text-xs text-gray-300">{tempo} BPM</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationalControls;
