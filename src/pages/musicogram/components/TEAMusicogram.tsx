
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { StageCell, AnimalInstrument } from '../types/tea';
import { animalInstruments } from '../data/animalInstruments';
import { teaAudio } from '../utils/teaAudioService';
import AnimalPalette from './AnimalPalette';
import TEAMusicogramStage from './TEAMusicogramStage';
import TEAControls from './TEAControls';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

const STAGE_ROWS = 6;
const STAGE_COLS = 16;

const TEAMusicogram: React.FC = () => {
  const { toast } = useToast();
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentColumn, setCurrentColumn] = useState(-1);
  const [tempo, setTempo] = useState(100);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [calmMode, setCalmMode] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Inicializar palco vazio
  const [stage, setStage] = useState<StageCell[][]>(() => {
    const initialStage: StageCell[][] = [];
    for (let row = 0; row < STAGE_ROWS; row++) {
      const stageRow: StageCell[] = [];
      for (let col = 0; col < STAGE_COLS; col++) {
        stageRow.push({
          id: `${row}-${col}`,
          animalId: null,
          position: { row, col },
          isActive: false
        });
      }
      initialStage.push(stageRow);
    }
    return initialStage;
  });

  // Inicializar áudio quando usuário interagir
  const initializeAudio = useCallback(async () => {
    try {
      const success = await teaAudio.initialize();
      setAudioInitialized(success);
      setShowAudioPrompt(!success);
      
      if (success) {
        toast({
          title: "🎵 Áudio Ativado!",
          description: "Agora você pode ouvir os sons dos animais!",
        });
      } else {
        toast({
          title: "⚠️ Áudio Limitado",
          description: "Continuando sem som - a diversão visual continua!",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao inicializar áudio:', error);
      setShowAudioPrompt(false);
    }
  }, [toast]);

  const handleCellClick = useCallback((row: number, col: number) => {
    setStage(prevStage => {
      const newStage = [...prevStage];
      const cell = newStage[row][col];
      
      if (cell.animalId === selectedAnimal) {
        cell.animalId = null;
      } else if (selectedAnimal) {
        cell.animalId = selectedAnimal;
      }
      
      return newStage;
    });
  }, [selectedAnimal]);

  const playComposition = useCallback(async () => {
    if (isPlaying) return;
    
    // Tentar inicializar áudio se ainda não foi inicializado
    if (!audioInitialized) {
      await initializeAudio();
    }
    
    setIsPlaying(true);
    setCurrentColumn(0);
    
    const beatDuration = (60 / tempo) * 1000;
    let currentCol = 0;
    
    const playNextColumn = async () => {
      if (currentCol >= STAGE_COLS) {
        setIsPlaying(false);
        setCurrentColumn(-1);
        toast({
          title: "🎉 Que apresentação incrível!",
          description: "Todos os animais tocaram maravilhosamente!",
        });
        return;
      }
      
      setCurrentColumn(currentCol);
      
      // Tocar todas as notas da coluna atual
      if (!isMuted && audioInitialized) {
        const playPromises = [];
        for (let row = 0; row < STAGE_ROWS; row++) {
          const cell = stage[row][currentCol];
          if (cell.animalId) {
            const animal = animalInstruments.find(a => a.id === cell.animalId);
            if (animal) {
              playPromises.push(teaAudio.playAnimalSound(animal.id, animal.frequency, 0.6));
            }
          }
        }
        await Promise.allSettled(playPromises);
      }
      
      currentCol++;
      
      if (isPlaying) {
        intervalRef.current = setTimeout(playNextColumn, beatDuration);
      }
    };
    
    playNextColumn();
  }, [stage, tempo, isMuted, isPlaying, audioInitialized, toast, initializeAudio]);

  const stopComposition = useCallback(() => {
    setIsPlaying(false);
    setCurrentColumn(-1);
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clearStage = useCallback(() => {
    if (isPlaying) stopComposition();
    
    setStage(prevStage => 
      prevStage.map(row => 
        row.map(cell => ({ ...cell, animalId: null }))
      )
    );
    
    toast({
      title: "🧹 Palco Limpo!",
      description: "Todos os animais voltaram para seus lugares",
    });
  }, [isPlaying, stopComposition, toast]);

  const saveComposition = useCallback(() => {
    const hasAnimals = stage.some(row => row.some(cell => cell.animalId));
    
    if (!hasAnimals) {
      toast({
        title: "🎭 Palco Vazio",
        description: "Coloque alguns animais no palco antes de salvar!",
        variant: "destructive"
      });
      return;
    }
    
    const composition = {
      id: `tea-comp-${Date.now()}`,
      name: `🎵 Música dos Animais ${new Date().toLocaleTimeString()}`,
      stage,
      tempo,
      createdAt: new Date().toISOString(),
      stickers: []
    };
    
    const saved = localStorage.getItem('tea-musicogram-compositions') || '[]';
    const compositions = JSON.parse(saved);
    compositions.push(composition);
    localStorage.setItem('tea-musicogram-compositions', JSON.stringify(compositions));
    
    toast({
      title: "🎉 Música Salva!",
      description: `"${composition.name}" foi salva com sucesso!`,
    });
  }, [stage, tempo, toast]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    teaAudio.setVolume(newVolume);
  }, []);

  const handleToggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      teaAudio.setVolume(newMuted ? 0 : volume);
      return newMuted;
    });
  }, [volume]);

  const handleToggleCalmMode = useCallback(() => {
    setCalmMode(prev => {
      const newCalmMode = !prev;
      teaAudio.setCalmMode(newCalmMode);
      
      toast({
        title: newCalmMode ? "🌙 Modo Calmo Ativado" : "☀️ Modo Normal Ativado",
        description: newCalmMode ? "Sons mais suaves e transições lentas" : "Experiência completa reativada",
      });
      
      return newCalmMode;
    });
  }, [toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-green-100 dark:from-sky-900/20 dark:to-green-900/20 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-800 dark:to-pink-800 text-white p-6 shadow-2xl">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-2">
            🎭 Musicograma dos Animais TEA
          </h1>
          <p className="text-lg opacity-90 mb-2">
            Um palco musical especialmente criado para crianças do espectro autista
          </p>
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
            <span className={`w-2 h-2 rounded-full animate-pulse ${audioInitialized ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
            {audioInitialized ? 'Áudio Ativo' : 'Clique para ativar áudio'} • Sons suaves • Interação intuitiva
          </div>
        </div>
      </div>

      {/* Audio Initialization Prompt */}
      {showAudioPrompt && !audioInitialized && (
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 border-b-2 border-yellow-300 p-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4">
              <div className="text-2xl">🎵</div>
              <div className="flex-1">
                <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                  Clique no botão abaixo para ativar os sons dos animais!
                </p>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  (O musicograma funciona sem som também)
                </p>
              </div>
              <Button 
                onClick={initializeAudio}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Ativar Sons
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <TEAControls
        isPlaying={isPlaying}
        onPlay={playComposition}
        onStop={stopComposition}
        onClear={clearStage}
        onSave={saveComposition}
        tempo={tempo}
        onTempoChange={setTempo}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        calmMode={calmMode}
        onToggleCalmMode={handleToggleCalmMode}
      />

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        <AnimalPalette
          animals={animalInstruments}
          selectedAnimal={selectedAnimal}
          onSelectAnimal={setSelectedAnimal}
          calmMode={calmMode}
        />
        
        <TEAMusicogramStage
          stage={stage}
          animals={animalInstruments}
          selectedAnimal={selectedAnimal}
          onCellClick={handleCellClick}
          isPlaying={isPlaying}
          currentColumn={currentColumn}
          calmMode={calmMode}
        />
      </div>
    </div>
  );
};

export default TEAMusicogram;
