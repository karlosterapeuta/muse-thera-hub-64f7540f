
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, FastForward, Rewind } from "lucide-react";

interface Note {
  id: string;
  pitch: string;
  duration: number;
  position: { x: number; y: number };
  color: string;
  shape: string;
  timestamp: number;
}

interface VisualTimelineProps {
  notes: Note[];
  isPlaying: boolean;
  currentPosition: number;
  duration: number;
  onSeek: (position: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  tempo: number;
}

const VisualTimeline: React.FC<VisualTimelineProps> = ({
  notes,
  isPlaying,
  currentPosition,
  duration,
  onSeek,
  onPlay,
  onPause,
  onStop,
  tempo
}) => {
  const [selectedSection, setSelectedSection] = useState<{ start: number; end: number } | null>(null);
  const [loopMode, setLoopMode] = useState(false);

  // Calcular posições das notas na timeline
  const timelineWidth = 800;
  const getTimelinePosition = (timestamp: number) => {
    if (duration === 0) return 0;
    return (timestamp / duration) * timelineWidth;
  };

  // Formatear tempo em mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcular duração total estimada
  const estimatedDuration = notes.length > 0 ? (notes.length * (60 / tempo)) : 0;

  const handleTimelineClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = x / timelineWidth;
    const newPosition = Math.floor(percentage * (notes.length || 1));
    onSeek(newPosition);
  };

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 shadow-2xl">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-white">
          <h3 className="text-2xl font-bold flex items-center">
            🎵 Linha do Tempo Musical
          </h3>
          <p className="text-slate-300 text-sm">Visualize e controle sua música</p>
        </div>
        
        <div className="flex items-center space-x-3 text-white">
          <div className="bg-slate-700 rounded-lg px-3 py-2">
            <span className="text-sm font-bold">Posição: {currentPosition + 1}/{notes.length || 1}</span>
          </div>
          <div className="bg-slate-700 rounded-lg px-3 py-2">
            <span className="text-sm font-bold">⏱️ {formatTime(currentPosition * (60 / tempo))}</span>
          </div>
        </div>
      </div>

      {/* Timeline Visual */}
      <div className="mb-6">
        <div 
          className="relative bg-slate-700 rounded-xl h-24 cursor-pointer border-2 border-slate-600 hover:border-slate-500 transition-colors"
          onClick={handleTimelineClick}
          style={{ width: `${timelineWidth}px`, margin: '0 auto' }}
        >
          {/* Grid de tempo */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: 21 }, (_, i) => (
              <div 
                key={i}
                className="border-l border-slate-600 h-full flex-1 relative"
              >
                <span className="absolute -bottom-6 left-0 text-xs text-slate-400 transform -translate-x-1/2">
                  {formatTime((i / 20) * estimatedDuration)}
                </span>
              </div>
            ))}
          </div>

          {/* Notas na timeline */}
          {notes.map((note, index) => {
            const position = (index / (notes.length || 1)) * timelineWidth;
            const colors: { [key: string]: string } = {
              '#FF0000': 'bg-red-500',
              '#FF6600': 'bg-orange-500',
              '#FFFF00': 'bg-yellow-500',
              '#00CC00': 'bg-green-500',
              '#0099FF': 'bg-blue-500',
              '#6600FF': 'bg-purple-500',
              '#FF1493': 'bg-pink-500'
            };
            
            return (
              <div
                key={note.id}
                className={`absolute w-3 h-16 top-1 rounded-full shadow-lg transform -translate-x-1/2 ${
                  colors[note.color] || 'bg-gray-500'
                } ${index === currentPosition ? 'ring-4 ring-yellow-400 scale-125' : ''} transition-all`}
                style={{ left: `${position}px` }}
                title={`${note.pitch} - ${index + 1}`}
              >
                {/* Forma da nota */}
                <div className="w-full h-4 flex items-center justify-center text-white text-xs font-bold">
                  {note.shape === 'circle' && '●'}
                  {note.shape === 'square' && '■'}
                  {note.shape === 'triangle' && '▲'}
                  {note.shape === 'diamond' && '◆'}
                </div>
              </div>
            );
          })}

          {/* Cursor de reprodução */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-yellow-400 shadow-lg transform -translate-x-1/2 transition-all duration-300"
            style={{ 
              left: `${(currentPosition / (notes.length || 1)) * timelineWidth}px`,
              boxShadow: '0 0 20px rgba(255, 255, 0, 0.8)'
            }}
          >
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-yellow-400"></div>
          </div>

          {/* Seleção de seção para loop */}
          {selectedSection && (
            <div 
              className="absolute top-0 bottom-0 bg-blue-400 bg-opacity-30 border-2 border-blue-400"
              style={{
                left: `${(selectedSection.start / (notes.length || 1)) * timelineWidth}px`,
                width: `${((selectedSection.end - selectedSection.start) / (notes.length || 1)) * timelineWidth}px`
              }}
            />
          )}
        </div>
      </div>

      {/* Controles de Navegação */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
        
        {/* Controles principais */}
        <div className="flex items-center space-x-2 bg-slate-700 rounded-xl p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSeek(Math.max(0, currentPosition - 1))}
            className="text-white hover:bg-slate-600 rounded-lg"
            title="Anterior"
          >
            <Rewind size={20} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={isPlaying ? onPause : onPlay}
            className="text-white hover:bg-slate-600 rounded-lg bg-gradient-to-r from-green-600 to-green-700 w-12 h-12"
            title={isPlaying ? "Pausar" : "Reproduzir"}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onStop}
            className="text-white hover:bg-slate-600 rounded-lg"
            title="Parar"
          >
            <RotateCcw size={20} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSeek(Math.min(notes.length - 1, currentPosition + 1))}
            className="text-white hover:bg-slate-600 rounded-lg"
            title="Próximo"
          >
            <FastForward size={20} />
          </Button>
        </div>

        {/* Controle de posição */}
        <div className="flex-1 max-w-md bg-slate-700 rounded-xl p-3">
          <div className="text-white text-sm font-bold mb-2 text-center">Posição na Música</div>
          <Slider
            value={[currentPosition]}
            onValueChange={(value) => onSeek(value[0])}
            max={Math.max(0, notes.length - 1)}
            step={1}
            className="w-full"
          />
        </div>

        {/* Informações de tempo */}
        <div className="bg-slate-700 rounded-xl p-3 text-white text-center">
          <div className="text-sm font-bold">⏱️ TEMPO</div>
          <div className="text-lg font-bold text-yellow-400">
            {formatTime(currentPosition * (60 / tempo))} / {formatTime(estimatedDuration)}
          </div>
          <div className="text-xs text-slate-300">{tempo} BPM</div>
        </div>
      </div>

      {/* Informações da música */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
        <div className="bg-slate-700 rounded-lg p-3">
          <div className="text-2xl text-blue-400 font-bold">{notes.length}</div>
          <div className="text-white text-sm">Total de Notas</div>
        </div>
        
        <div className="bg-slate-700 rounded-lg p-3">
          <div className="text-2xl text-green-400 font-bold">{formatTime(estimatedDuration)}</div>
          <div className="text-white text-sm">Duração Estimada</div>
        </div>
        
        <div className="bg-slate-700 rounded-lg p-3">
          <div className="text-2xl text-yellow-400 font-bold">{tempo}</div>
          <div className="text-white text-sm">BPM</div>
        </div>
        
        <div className="bg-slate-700 rounded-lg p-3">
          <div className={`text-2xl font-bold ${isPlaying ? 'text-green-400' : 'text-red-400'}`}>
            {isPlaying ? '▶️' : '⏸️'}
          </div>
          <div className="text-white text-sm">Status</div>
        </div>
      </div>
    </div>
  );
};

export default VisualTimeline;
