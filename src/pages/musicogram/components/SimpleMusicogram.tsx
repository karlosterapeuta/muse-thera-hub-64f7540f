import React, { useState, useCallback, useRef } from 'react';
import { GridCell, SimpleInstrument } from '../types/simple';
import { simpleInstruments } from '../data/simpleInstruments';
import { realisticAudio } from '../utils/realisticAudioService';
import SimplePalette from './SimplePalette';
import SimpleGrid from './SimpleGrid';
import SimpleControls from './SimpleControls';
import { useToast } from '@/hooks/use-toast';

const GRID_ROWS = 8;
const GRID_COLS = 16;

const SimpleMusicogram: React.FC = () => {
  const { toast } = useToast();
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentColumn, setCurrentColumn] = useState(-1);
  const [tempo, setTempo] = useState(120);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Inicializar grid vazio
  const [grid, setGrid] = useState<GridCell[][]>(() => {
    const initialGrid: GridCell[][] = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      const gridRow: GridCell[] = [];
      for (let col = 0; col < GRID_COLS; col++) {
        gridRow.push({
          id: `${row}-${col}`,
          instrumentId: null,
          position: { row, col }
        });
      }
      initialGrid.push(gridRow);
    }
    return initialGrid;
  });

  const handleCellClick = useCallback((row: number, col: number) => {
    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      const cell = newGrid[row][col];
      
      if (cell.instrumentId === selectedInstrument) {
        // Remove instrumento se já estiver na célula
        cell.instrumentId = null;
      } else if (selectedInstrument) {
        // Adiciona instrumento selecionado
        cell.instrumentId = selectedInstrument;
      }
      
      return newGrid;
    });
  }, [selectedInstrument]);

  const playComposition = useCallback(async () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setCurrentColumn(0);
    
    const beatDuration = (60 / tempo) * 1000; // milliseconds per beat
    
    intervalRef.current = setInterval(async () => {
      setCurrentColumn(prevCol => {
        const nextCol = prevCol + 1;
        
        if (nextCol >= GRID_COLS) {
          // Fim da composição
          setIsPlaying(false);
          setCurrentColumn(-1);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return -1;
        }
        
        // Tocar todas as notas da coluna atual com sons realistas
        if (!isMuted) {
          for (let row = 0; row < GRID_ROWS; row++) {
            const cell = grid[row][nextCol];
            if (cell.instrumentId) {
              const instrument = simpleInstruments.find(i => i.id === cell.instrumentId);
              if (instrument) {
                // Usar o novo sistema de áudio realista
                realisticAudio.playRealisticNote(instrument.id, instrument.frequency, 0.6);
              }
            }
          }
        }
        
        return nextCol;
      });
    }, beatDuration);
  }, [grid, tempo, isMuted, isPlaying]);

  const stopComposition = useCallback(() => {
    setIsPlaying(false);
    setCurrentColumn(-1);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clearGrid = useCallback(() => {
    if (isPlaying) stopComposition();
    
    setGrid(prevGrid => 
      prevGrid.map(row => 
        row.map(cell => ({ ...cell, instrumentId: null }))
      )
    );
    
    toast({
      title: "Grade Limpa",
      description: "Todas as notas foram removidas da composição",
    });
  }, [isPlaying, stopComposition, toast]);

  const saveComposition = useCallback(() => {
    const hasNotes = grid.some(row => row.some(cell => cell.instrumentId));
    
    if (!hasNotes) {
      toast({
        title: "Composição Vazia",
        description: "Adicione algumas notas antes de salvar",
        variant: "destructive"
      });
      return;
    }
    
    const composition = {
      id: `comp-${Date.now()}`,
      name: `Composição ${new Date().toLocaleTimeString()}`,
      grid,
      tempo,
      createdAt: new Date().toISOString()
    };
    
    // Salvar no localStorage (em produção seria no banco de dados)
    const saved = localStorage.getItem('musicogram-compositions') || '[]';
    const compositions = JSON.parse(saved);
    compositions.push(composition);
    localStorage.setItem('musicogram-compositions', JSON.stringify(compositions));
    
    toast({
      title: "Composição Salva! 🎵",
      description: `"${composition.name}" foi salva com sucesso`,
    });
  }, [grid, tempo, toast]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    realisticAudio.setVolume(newVolume);
  }, []);

  const handleToggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      realisticAudio.setVolume(newMuted ? 0 : volume);
      return newMuted;
    });
  }, [volume]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            🎵 Musicograma Realista
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Crie suas composições com sons realistas de instrumentos musicais
          </p>
          <div className="mt-2 inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Sons avançados com síntese realista
          </div>
        </div>
      </div>

      {/* Controls */}
      <SimpleControls
        isPlaying={isPlaying}
        onPlay={playComposition}
        onStop={stopComposition}
        onClear={clearGrid}
        onSave={saveComposition}
        tempo={tempo}
        onTempoChange={setTempo}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content */}
      <div className="flex flex-1">
        <SimplePalette
          instruments={simpleInstruments}
          selectedInstrument={selectedInstrument}
          onSelectInstrument={setSelectedInstrument}
        />
        
        <SimpleGrid
          grid={grid}
          instruments={simpleInstruments}
          selectedInstrument={selectedInstrument}
          onCellClick={handleCellClick}
          isPlaying={isPlaying}
          currentColumn={currentColumn}
        />
      </div>
    </div>
  );
};

export default SimpleMusicogram;
