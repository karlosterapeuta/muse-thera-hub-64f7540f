import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { getMusicalSequence, generateGameNotes } from "@/data/musicalSequences";
import { getAuthenticMusicalSequence, generateAuthenticGameNotes } from "@/data/authenticMusicalSequences";
import { playNoteSound, preloadInstrumentAudio } from "@/utils/audioUtils";
import { TEA_MASTER_FREQUENCIES, getLaneConfig, validateSynchronization } from "@/constants/teaFrequencies";

interface Note {
  id: string;
  lane: number;
  color: string;
  frequency: number;
  startTime: number;
  duration: number;
  y: number;
}

interface GuitarHeroGameProps {
  instrumentType: "bell" | "xylophone" | "keyboard";
  onNotePlay: (frequency: number, color: string) => void;
  selectedSong?: { id: string; title: string; hasSequence?: boolean; };
  gameSpeed?: number;
}

const GuitarHeroGame: React.FC<GuitarHeroGameProps> = ({ 
  instrumentType, 
  onNotePlay, 
  selectedSong,
  gameSpeed = 1.0
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [notes, setNotes] = useState<Note[]>([]);
  const [hitZoneHeight] = useState(80);
  const [audioReady, setAudioReady] = useState(false);
  
  const gameRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const gameStartTimeRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // LANES SINCRONIZADAS COM A MASTER TABLE
  const lanes = TEA_MASTER_FREQUENCIES[instrumentType];

  // Pré-carregar áudio TEA SINCRONIZADO
  useEffect(() => {
    const initAudio = async () => {
      try {
        console.log(`🎵 Initializing TEA SYNCHRONIZED audio for ${instrumentType}...`);
        
        // VALIDAR SINCRONIZAÇÃO PRIMEIRO
        const isValid = validateSynchronization(instrumentType);
        if (!isValid) {
          console.error(`❌ Synchronization validation FAILED for ${instrumentType}`);
          toast(`❌ Erro de sincronização para ${instrumentType}!`, { duration: 3000 });
          return;
        }
        
        await preloadInstrumentAudio(instrumentType);
        setAudioReady(true);
        console.log(`✅ TEA SYNCHRONIZED audio ready for ${instrumentType}`);
        console.log(`🔍 Lane frequencies:`, lanes.map(l => `${l.note}:${l.frequency}Hz`));
        toast(`🔊 Áudio TEA SINCRONIZADO para ${instrumentType}!`, { duration: 2000 });
      } catch (error) {
        console.warn(`⚠️ TEA audio init failed:`, error);
        setAudioReady(false);
        toast(`🔊 Usando áudio TEA básico para ${instrumentType}`, { duration: 2000 });
      }
    };

    initAudio();
  }, [instrumentType]);

  // Função SINCRONIZADA para tocar áudio
  const playInstrumentAudio = useCallback(async (frequency: number, duration: number = 1.5) => {
    try {
      console.log(`🎵 TEA-SYNCHRONIZED: Playing ${instrumentType} at EXACT ${frequency}Hz`);
      
      // VALIDAR que a frequência corresponde a uma lane válida
      const laneConfig = lanes.find(l => Math.abs(l.frequency - frequency) < 0.1);
      if (!laneConfig) {
        console.warn(`⚠️ Frequency ${frequency}Hz not found in ${instrumentType} lanes`);
      } else {
        console.log(`✅ VALIDATED: ${frequency}Hz = ${laneConfig.note} (${laneConfig.name})`);
      }
      
      await playNoteSound(`${frequency}Hz`, instrumentType);
      console.log(`✅ TEA SYNCHRONIZED audio played: ${instrumentType} - ${frequency}Hz`);
    } catch (error) {
      console.error("TEA SYNCHRONIZED audio error:", error);
      onNotePlay(frequency, lanes.find(l => Math.abs(l.frequency - frequency) < 0.1)?.color || "#FFFFFF");
    }
  }, [instrumentType, lanes, onNotePlay]);

  // Função melhorada para música de fundo com qualidade superior
  const startBackgroundMusic = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      
      const playBackgroundTone = (frequency: number, startTime: number, duration: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const compressor = audioContext.createDynamicsCompressor();
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + startTime);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime);
        gainNode.gain.linearRampToValueAtTime(0.12, audioContext.currentTime + startTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + startTime + duration);
        
        compressor.threshold.setValueAtTime(-35, audioContext.currentTime + startTime);
        compressor.ratio.setValueAtTime(3, audioContext.currentTime + startTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(compressor);
        compressor.connect(audioContext.destination);
        
        oscillator.start(audioContext.currentTime + startTime);
        oscillator.stop(audioContext.currentTime + startTime + duration);
      };

      // Melodias SINCRONIZADAS com as lanes
      const melody = instrumentType === "bell" ? [
        { freq: 261.63, time: 0, duration: 0.5 },    // Dó
        { freq: 293.66, time: 0.5, duration: 0.5 },  // Ré
        { freq: 329.63, time: 1, duration: 0.5 },    // Mi
        { freq: 261.63, time: 1.5, duration: 0.5 },  // Dó
        { freq: 293.66, time: 2, duration: 0.5 },    // Ré
        { freq: 329.63, time: 2.5, duration: 0.5 },  // Mi
        { freq: 392.00, time: 3, duration: 1 },      // Sol
        { freq: 329.63, time: 4, duration: 0.5 },    // Mi
        { freq: 293.66, time: 4.5, duration: 0.5 },  // Ré
        { freq: 261.63, time: 5, duration: 1 },      // Dó
      ] : instrumentType === "xylophone" ? [
        { freq: 523.25, time: 0, duration: 0.5 },    // Dó (C5)
        { freq: 587.33, time: 0.5, duration: 0.5 },  // Ré (D5)
        { freq: 659.25, time: 1, duration: 0.5 },    // Mi (E5)
        { freq: 523.25, time: 1.5, duration: 0.5 },  // Dó (C5)
        { freq: 587.33, time: 2, duration: 0.5 },    // Ré (D5)
        { freq: 659.25, time: 2.5, duration: 0.5 },  // Mi (E5)
        { freq: 783.99, time: 3, duration: 1 },      // Sol (G5)
        { freq: 659.25, time: 4, duration: 0.5 },    // Mi (E5)
        { freq: 587.33, time: 4.5, duration: 0.5 },  // Ré (D5)
        { freq: 523.25, time: 5, duration: 1 },      // Dó (C5)
      ] : [
        { freq: 261.63, time: 0, duration: 0.5 },
        { freq: 293.66, time: 0.5, duration: 0.5 },
        { freq: 329.63, time: 1, duration: 0.5 },
        { freq: 349.23, time: 1.5, duration: 0.5 },
        { freq: 392.00, time: 2, duration: 0.5 },
        { freq: 440.00, time: 2.5, duration: 0.5 },
        { freq: 493.88, time: 3, duration: 1 },
        { freq: 392.00, time: 4, duration: 0.5 },
        { freq: 329.63, time: 4.5, duration: 0.5 },
        { freq: 261.63, time: 5, duration: 1 },
      ];

      melody.forEach(note => {
        const adjustedTime = note.time / gameSpeed;
        const adjustedDuration = note.duration / gameSpeed;
        playBackgroundTone(note.freq, adjustedTime, adjustedDuration);
      });

      const interval = setInterval(() => {
        if (isPlaying) {
          melody.forEach(note => {
            const adjustedTime = note.time / gameSpeed;
            const adjustedDuration = note.duration / gameSpeed;
            playBackgroundTone(note.freq, adjustedTime, adjustedDuration);
          });
        } else {
          clearInterval(interval);
        }
      }, 6000 / gameSpeed);

      console.log(`🎵 TEA-optimized background music: ${instrumentType} at ${gameSpeed}x speed`);
      
    } catch (error) {
      console.error("Error starting background music:", error);
    }
  }, [instrumentType, isPlaying, gameSpeed]);

  // Parar música de fundo
  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
      backgroundMusicRef.current = null;
    }
    console.log("🎵 Background music stopped");
  }, []);

  // Gerar padrão de notas AUTÊNTICAS E TOTALMENTE SINCRONIZADAS
  const generateNotes = useCallback(() => {
    if (selectedSong?.hasSequence) {
      const sequence = getAuthenticMusicalSequence(selectedSong.id);
      if (sequence) {
        console.log(`🎼 Loading TEA AUTHENTIC SYNCHRONIZED sequence: ${sequence.name}`);
        console.log(`📊 Authentic notes: ${sequence.notes.length}, BPM: ${sequence.bpm}, Duration: ${sequence.totalDuration}ms`);
        
        const gameNotes = generateAuthenticGameNotes(sequence, instrumentType);
        const adjustedNotes = gameNotes.map(note => ({
          ...note,
          startTime: note.startTime / gameSpeed
        }));
        setNotes(adjustedNotes);
        
        // VALIDAÇÃO DE SINCRONIZAÇÃO FINAL
        console.log(`🔍 FINAL SYNC VALIDATION for ${selectedSong.title}:`);
        adjustedNotes.forEach((note, index) => {
          const laneConfig = getLaneConfig(instrumentType, note.lane);
          const freqMatch = Math.abs(note.frequency - laneConfig.frequency) < 0.1;
          const colorMatch = note.color === laneConfig.color;
          
          if (!freqMatch || !colorMatch) {
            console.error(`❌ SYNC ERROR note ${index}: lane=${note.lane}, freq=${note.frequency}/${laneConfig.frequency}, color=${note.color}/${laneConfig.color}`);
          } else {
            console.log(`✅ SYNC OK note ${index}: ${laneConfig.note} at ${note.frequency}Hz`);
          }
        });
        
        console.log(`🎯 Generated ${adjustedNotes.length} AUTHENTIC SYNCHRONIZED notes for ${selectedSong.title}`);
        toast(`🎼 MELODIA SINCRONIZADA: ${sequence.name} com ${sequence.notes.length} notas!`, { duration: 3000 });
        return;
      }
    }

    // Fallback: padrão simples melhorado
    console.log(`⚠️ Using enhanced practice pattern for ${selectedSong?.title || 'practice'}`);
    const newNotes: Note[] = [];
    
    // Padrões mais musicais para prática
    const musicalPatterns = [
      [0, 2, 4, 2], // C-E-G-E (acorde maior)
      [4, 3, 2, 1], // G-F-E-D (descida)
      [0, 1, 2, 3], // C-D-E-F (subida)
      [4, 5, 6, 4], // G-A-B-G
      [2, 1, 0, 1], // E-D-C-D
      [6, 5, 4, 3]  // B-A-G-F
    ];

    let noteId = 0;
    for (let i = 0; i < 20; i++) {
      const pattern = musicalPatterns[i % musicalPatterns.length];
      const baseTime = (i * 4000) / gameSpeed;
      
      pattern.forEach((laneIndex, noteIndex) => {
        if (laneIndex < lanes.length) {
          newNotes.push({
            id: `practice-note-${noteId++}`,
            lane: laneIndex,
            color: lanes[laneIndex].color,
            frequency: lanes[laneIndex].frequency, // Frequência EXATA da lane
            startTime: baseTime + (noteIndex * 1000) / gameSpeed,
            duration: 800 / gameSpeed,
            y: -100
          });
        }
      });
    }

    setNotes(newNotes);
    toast(`🎯 Padrão de prática musical carregado com ${newNotes.length} notas`, { duration: 2000 });
  }, [instrumentType, lanes, selectedSong, gameSpeed]);

  // Atualizar posição das notas
  const updateNotes = useCallback(() => {
    if (!isPlaying) return;

    const now = Date.now();
    const currentGameTime = now - gameStartTimeRef.current;
    
    setNotes(prevNotes => 
      prevNotes
        .map(note => {
          const noteAge = currentGameTime - note.startTime;
          const baseSpeed = 2;
          const newY = noteAge * baseSpeed * 0.1 * gameSpeed;
          return { ...note, y: newY };
        })
        .filter(note => note.y < 600)
    );

    setNotes(prevNotes => {
      const missedNotes = prevNotes.filter(note => note.y > 500);
      if (missedNotes.length > 0 && combo > 0) {
        setCombo(0);
        toast("Notas perdidas! Combo resetado", { duration: 1000 });
      }
      return prevNotes.filter(note => note.y <= 500);
    });

    lastUpdateTimeRef.current = now;
    animationRef.current = requestAnimationFrame(updateNotes);
  }, [isPlaying, combo, gameSpeed]);

  // Detectar teclas COM ÁUDIO 100% SINCRONIZADO
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!isPlaying) return;

    const keyPressed = event.key;
    const lane = lanes.find(l => l.key === keyPressed);
    if (!lane) return;

    event.preventDefault();

    const laneIndex = lanes.indexOf(lane);
    const hitZoneTop = 350;
    const hitZoneBottom = hitZoneTop + hitZoneHeight;

    console.log(`🎹 TEA Key: ${keyPressed}, Lane: ${laneIndex}, Note: ${lane.note}, Freq: ${lane.frequency}Hz`);

    const hitNote = notes.find(note => 
      note.lane === laneIndex && 
      note.y >= hitZoneTop - 50 && 
      note.y <= hitZoneBottom + 50
    );

    if (hitNote) {
      // VERIFICAÇÃO DE SINCRONIZAÇÃO EM TEMPO REAL
      const expectedFreq = lane.frequency;
      const actualFreq = hitNote.frequency;
      const syncError = Math.abs(expectedFreq - actualFreq);
      
      if (syncError > 0.1) {
        console.error(`❌ SYNC ERROR: Expected ${expectedFreq}Hz, got ${actualFreq}Hz (error: ${syncError.toFixed(2)}Hz)`);
      } else {
        console.log(`✅ PERFECT SYNC: ${lane.note} at ${expectedFreq}Hz`);
      }

      const precision = Math.abs(hitNote.y - (hitZoneTop + hitZoneHeight / 2));
      let points = 100;
      let feedback = "Good!";

      if (precision < 15) {
        points = 300;
        feedback = "Perfect!";
      } else if (precision < 30) {
        points = 200;
        feedback = "Great!";
      }

      const finalPoints = points * Math.max(1, combo + 1);
      setScore(prev => prev + finalPoints);
      setCombo(prev => prev + 1);
      setMaxCombo(prev => Math.max(prev, combo + 1));

      // Tocar som EXATAMENTE SINCRONIZADO com a lane
      console.log(`🎯 HIT! Playing LANE frequency ${lane.frequency}Hz for note ${lane.note}`);
      playInstrumentAudio(lane.frequency, 1.5);

      toast(`${feedback} +${finalPoints} pontos`, { duration: 1000 });
      setNotes(prevNotes => prevNotes.filter(n => n.id !== hitNote.id));
      
    } else {
      if (combo > 0) {
        setCombo(0);
        toast("Miss! Combo perdido", { duration: 1000 });
      }
      
      // Tocar som da lane pressionada para feedback SINCRONIZADO
      console.log(`❌ MISS! Playing LANE frequency ${lane.frequency}Hz for feedback`);
      playInstrumentAudio(lane.frequency, 0.8);
    }
  }, [lanes, isPlaying, notes, combo, hitZoneHeight, playInstrumentAudio]);

  // Gerenciar eventos de teclado
  useEffect(() => {
    if (isPlaying) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isPlaying, handleKeyPress]);

  // Iniciar/pausar o jogo
  const togglePlay = () => {
    if (!isPlaying) {
      generateNotes();
      gameStartTimeRef.current = Date.now();
      startBackgroundMusic();
      
      if (selectedSong?.hasSequence) {
        console.log(`🎵 Starting TEA ${selectedSong.title} with authentic sequence at ${gameSpeed}x speed`);
        toast(`🎼 TEA-Optimized: ${selectedSong.title} (${gameSpeed}x) ${audioReady ? '🔊 Real Audio' : '🔊 Synthesis'}`, { duration: 2000 });
      } else {
        console.log(`🎵 Starting TEA ${instrumentType} game with random pattern at ${gameSpeed}x speed`);
        toast(`🔊 TEA ${instrumentType} game iniciado (${gameSpeed}x) ${audioReady ? '🔊 Real Audio' : '🔊 Synthesis'}`, { duration: 2000 });
      }
      
      setIsPlaying(true);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      stopBackgroundMusic();
      setIsPlaying(false);
      console.log(`Pausing TEA ${instrumentType} game`);
    }
  };

  // Iniciar animação quando o jogo começar
  useEffect(() => {
    if (isPlaying) {
      updateNotes();
    }
  }, [isPlaying, updateNotes]);

  // Resetar o jogo
  const resetGame = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    stopBackgroundMusic();
    setIsPlaying(false);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setNotes([]);
    gameStartTimeRef.current = 0;
    console.log(`TEA game reset for ${instrumentType}`);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      stopBackgroundMusic();
    };
  }, [stopBackgroundMusic]);

  const getInstrumentTitle = () => {
    if (selectedSong?.hasSequence) {
      return `🎼 ${selectedSong.title} (AUTÊNTICA)`;
    }
    
    switch (instrumentType) {
      case "bell": return "🔔 TEA Sino-Hero";
      case "xylophone": return "🎵 TEA Xilofone-Hero";
      case "keyboard": return "🎹 TEA Teclado-Hero";
      default: return "TEA-Hero";
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">
              {getInstrumentTitle()}
            </h1>
            {selectedSong?.hasSequence && (
              <p className="text-sm opacity-90">
                🎼 Melodia autêntica TEA sincronizada • Velocidade: {gameSpeed}x
              </p>
            )}
            <p className="text-xs text-green-300">
              🔊 Áudio TEA-autêntico {audioReady ? 'ATIVO' : 'BÁSICO'} - melodias 100% reconhecíveis
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={togglePlay} variant="secondary" size="sm">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? "Pausar" : "Jogar"}
            </Button>
            <Button onClick={resetGame} variant="secondary" size="sm">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-sm opacity-80">Pontuação</div>
            <div className="text-xl font-bold">{score.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm opacity-80">Combo</div>
            <div className="text-xl font-bold text-yellow-300">{combo}x</div>
          </div>
          <div>
            <div className="text-sm opacity-80">Max Combo</div>
            <div className="text-xl font-bold text-orange-300">{maxCombo}x</div>
          </div>
          <div>
            <div className="text-sm opacity-80">Velocidade</div>
            <div className="text-xl font-bold">{gameSpeed}x</div>
          </div>
        </div>
      </div>

      {/* Instruções ATUALIZADAS */}
      <div className="bg-blue-600 p-3 text-center text-white">
        <p className="text-sm">
          Use as teclas <strong>1-7</strong> para tocar as notas quando elas passarem pela zona dourada!
          {selectedSong?.hasSequence && (
            <span className="block mt-1 text-yellow-200">
              🎼 Esta música toca a melodia autêntica de "{selectedSong.title}" com frequências sincronizadas
            </span>
          )}
          <span className="block mt-1 text-green-200">
            🔊 <strong>Sistema TEA-Autêntico:</strong> Cada nota visual = frequência musical exata + melodias reconhecíveis
          </span>
        </p>
      </div>

      {/* Game Area */}
      <div 
        ref={gameRef}
        className="flex-1 relative bg-gradient-to-b from-gray-900 to-black overflow-hidden"
        style={{ height: "500px" }}
      >
        {/* Lanes (faixas) */}
        {lanes.map((lane, index) => (
          <div
            key={index}
            className="absolute border-r border-gray-600"
            style={{
              left: `${(index / lanes.length) * 100}%`,
              width: `${100 / lanes.length}%`,
              height: "100%",
              backgroundColor: `${lane.color}15`
            }}
          >
            {/* Indicador da nota na parte inferior */}
            <div
              className="absolute bottom-0 w-full flex items-center justify-center text-white font-bold border-2 border-white/50 shadow-lg"
              style={{
                height: "70px",
                backgroundColor: lane.color,
              }}
            >
              <div className="text-center">
                <div className="text-xs font-bold">{lane.key}</div>
                <div className="text-2xl">{lane.symbol}</div>
                <div className="text-xs font-bold">{lane.name}</div>
                <div className="text-xs text-white/80">{Math.round(lane.frequency)}Hz</div>
              </div>
            </div>
          </div>
        ))}

        {/* Zona de acerto */}
        <div
          className="absolute w-full border-4 border-yellow-400 bg-yellow-400/30 shadow-lg"
          style={{ top: "350px", height: `${hitZoneHeight}px` }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-yellow-400 font-bold text-lg animate-pulse">ZONA DE ACERTO TEA</div>
          </div>
        </div>

        {/* Notas em queda */}
        {notes.map((note) => (
          <div
            key={note.id}
            className="absolute rounded-lg border-2 border-white shadow-xl flex items-center justify-center text-white font-bold transition-transform"
            style={{
              left: `${(note.lane / lanes.length) * 100 + 1}%`,
              width: `${100 / lanes.length - 2}%`,
              top: `${note.y}px`,
              height: "50px",
              backgroundColor: note.color,
              boxShadow: `0 0 20px ${note.color}50`,
            }}
          >
            <div className="text-center">
              <div className="text-lg">{lanes[note.lane].symbol}</div>
            </div>
          </div>
        ))}

        {/* Linha de referência */}
        <div
          className="absolute w-full border-t-4 border-yellow-400 opacity-50"
          style={{ top: "380px" }}
        />
      </div>
    </div>
  );
};

export default GuitarHeroGame;
