
import { useState, useRef, useCallback, useEffect } from 'react';
import { TraditionalSong } from '../data/traditionalSongs';

export interface FallingNote {
  id: string;
  track: number;
  y: number;
  targetTime: number;
  hit: boolean;
  color: string;
  startTime: number;
  intensity: number;
}

export interface GameStats {
  score: number;
  combo: number;
  maxCombo: number;
  hits: number;
  misses: number;
  accuracy: number;
  streak: number;
}

export interface HitResult {
  type: 'perfect' | 'good' | 'ok' | 'miss';
  points: number;
  timing: number;
}

export const useGuitarHeroGame = () => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'ended'>('menu');
  const [currentSong, setCurrentSong] = useState<TraditionalSong | null>(null);
  const [fallingNotes, setFallingNotes] = useState<FallingNote[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    combo: 0,
    maxCombo: 0,
    hits: 0,
    misses: 0,
    accuracy: 0,
    streak: 0
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const noteIdCounter = useRef<number>(0);
  const gameStartTime = useRef<number>(0);
  const lastNoteGenerationTime = useRef<number>(0);

  // Configurações do jogo estilo Guitar Hero
  const TRACK_HEIGHT = 500;
  const NOTE_HEIGHT = 30;
  const HIT_ZONE_Y = TRACK_HEIGHT - 120;
  const NOTE_SPEED = 300; // pixels per second
  const FALL_TIME = 2000; // tempo para nota cair até hit zone
  
  // Tolerâncias de timing (em ms)
  const PERFECT_TOLERANCE = 50;
  const GOOD_TOLERANCE = 100;
  const OK_TOLERANCE = 150;

  // Resetar jogo
  const resetGame = useCallback(() => {
    setFallingNotes([]);
    setGameStats({
      score: 0,
      combo: 0,
      maxCombo: 0,
      hits: 0,
      misses: 0,
      accuracy: 0,
      streak: 0
    });
    setCurrentTime(0);
    noteIdCounter.current = 0;
    gameStartTime.current = 0;
    lastNoteGenerationTime.current = 0;
  }, []);

  // Iniciar jogo
  const startGame = useCallback((song: TraditionalSong) => {
    console.log(`🎮 Iniciando jogo Guitar Hero: ${song.title}`);
    setCurrentSong(song);
    resetGame();
    setGameState('playing');
    setIsAudioPlaying(true);
    gameStartTime.current = Date.now();
    lastNoteGenerationTime.current = 0;
  }, [resetGame]);

  // Pausar/despausar jogo
  const togglePause = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused');
      setIsAudioPlaying(false);
    } else if (gameState === 'paused') {
      setGameState('playing');
      setIsAudioPlaying(true);
    }
  }, [gameState]);

  // Parar jogo
  const stopGame = useCallback(() => {
    setGameState('ended');
    setIsAudioPlaying(false);
  }, []);

  // Voltar ao menu
  const backToMenu = useCallback(() => {
    setGameState('menu');
    setCurrentSong(null);
    resetGame();
    setIsAudioPlaying(false);
  }, [resetGame]);

  // Gerar notas conforme a música
  const generateNotes = useCallback(() => {
    if (!currentSong || gameState !== 'playing') return;

    const currentGameTime = currentTime;
    
    // Encontrar notas que devem ser geradas agora
    currentSong.pattern.forEach((notePattern) => {
      const noteTime = notePattern.time;
      const shouldGenerate = 
        currentGameTime >= (noteTime - FALL_TIME) && 
        currentGameTime < (noteTime - FALL_TIME + 100) &&
        !fallingNotes.some(fn => Math.abs(fn.targetTime - noteTime) < 50);

      if (shouldGenerate) {
        noteIdCounter.current += 1;
        
        const newNote: FallingNote = {
          id: `note-${noteTime}-${notePattern.track}-${noteIdCounter.current}`,
          track: notePattern.track,
          y: -NOTE_HEIGHT,
          targetTime: noteTime,
          hit: false,
          color: getNoteColor(notePattern.track),
          startTime: currentGameTime,
          intensity: notePattern.intensity || 0.8
        };
        
        setFallingNotes(prev => [...prev, newNote]);
        console.log(`🎵 Nota gerada: Track ${notePattern.track} para tempo ${noteTime}ms`);
      }
    });
  }, [currentSong, gameState, currentTime, fallingNotes]);

  // Atualizar posições das notas
  const updateNotes = useCallback(() => {
    if (gameState !== 'playing') return;

    setFallingNotes(prev => {
      return prev.map(note => {
        const timeElapsed = currentTime - note.startTime;
        const fallProgress = timeElapsed / FALL_TIME;
        const newY = fallProgress * (HIT_ZONE_Y + NOTE_HEIGHT);
        
        return { ...note, y: newY };
      }).filter(note => {
        // Remover notas que passaram da área de jogo
        const timePastTarget = currentTime - note.targetTime;
        const shouldKeep = timePastTarget < 500 && !note.hit;
        
        // Se a nota passou sem ser acertada, contar como miss
        if (!shouldKeep && !note.hit && timePastTarget >= 0) {
          console.log(`❌ Nota perdida: Track ${note.track}`);
          setGameStats(prevStats => ({
            ...prevStats,
            combo: 0,
            streak: 0,
            misses: prevStats.misses + 1,
            accuracy: prevStats.hits > 0 ? (prevStats.hits / (prevStats.hits + prevStats.misses + 1)) * 100 : 0
          }));
        }
        
        return shouldKeep;
      });
    });
  }, [gameState, currentTime]);

  // Verificar acerto de nota (Guitar Hero style)
  const checkHit = useCallback((trackIndex: number): HitResult | null => {
    if (gameState !== 'playing') return null;

    const hitNote = fallingNotes.find(note => 
      note.track === trackIndex && 
      !note.hit &&
      Math.abs(currentTime - note.targetTime) < OK_TOLERANCE
    );

    if (!hitNote) {
      return { type: 'miss', points: 0, timing: 0 };
    }

    const timing = Math.abs(currentTime - hitNote.targetTime);
    let hitType: 'perfect' | 'good' | 'ok' = 'ok';
    let basePoints = 100;

    // Determinar qualidade do acerto
    if (timing < PERFECT_TOLERANCE) {
      hitType = 'perfect';
      basePoints = 300;
    } else if (timing < GOOD_TOLERANCE) {
      hitType = 'good';
      basePoints = 200;
    } else {
      hitType = 'ok';
      basePoints = 100;
    }

    // Marcar nota como acertada
    setFallingNotes(prev => 
      prev.map(note => 
        note.id === hitNote.id ? { ...note, hit: true } : note
      )
    );

    // Atualizar estatísticas
    setGameStats(prev => {
      const newCombo = prev.combo + 1;
      const newStreak = prev.streak + 1;
      const comboMultiplier = Math.floor(newCombo / 10) + 1;
      const intensityMultiplier = hitNote.intensity;
      const finalPoints = Math.floor(basePoints * comboMultiplier * intensityMultiplier);

      return {
        ...prev,
        score: prev.score + finalPoints,
        combo: newCombo,
        streak: newStreak,
        maxCombo: Math.max(prev.maxCombo, newCombo),
        hits: prev.hits + 1,
        accuracy: ((prev.hits + 1) / (prev.hits + prev.misses + 1)) * 100
      };
    });

    console.log(`🎯 ${hitType.toUpperCase()}! Timing: ${timing.toFixed(0)}ms, Pontos: ${Math.floor(basePoints * (Math.floor((gameStats.combo + 1) / 10) + 1) * hitNote.intensity)}`);

    return {
      type: hitType,
      points: Math.floor(basePoints * (Math.floor((gameStats.combo + 1) / 10) + 1) * hitNote.intensity),
      timing
    };
  }, [gameState, fallingNotes, currentTime, gameStats.combo]);

  // Atualizar tempo atual do jogo
  const updateTime = useCallback((timeInMs: number) => {
    setCurrentTime(timeInMs);
    
    // Verificar se a música terminou
    if (currentSong && timeInMs >= currentSong.duration * 1000) {
      console.log('🏆 Música terminou - finalizando jogo');
      stopGame();
    }
  }, [currentSong, stopGame]);

  // Game loop principal
  useEffect(() => {
    if (gameState === 'playing') {
      const gameLoop = () => {
        generateNotes();
        updateNotes();
      };
      
      const intervalId = setInterval(gameLoop, 16); // ~60fps
      return () => clearInterval(intervalId);
    }
  }, [gameState, generateNotes, updateNotes]);

  return {
    // Estado do jogo
    gameState,
    currentSong,
    fallingNotes,
    gameStats,
    currentTime,
    isAudioPlaying,
    
    // Configurações visuais
    TRACK_HEIGHT,
    NOTE_HEIGHT,
    HIT_ZONE_Y,
    
    // Ações do jogo
    startGame,
    togglePause,
    stopGame,
    backToMenu,
    checkHit,
    updateTime,
    
    // Utilitários
    resetGame
  };
};

// Função auxiliar para obter cor da nota por track
const getNoteColor = (track: number): string => {
  const colors = [
    '#FF2D2D', // C - Vermelho
    '#FF8A2D', // D - Laranja  
    '#FFD700', // E - Amarelo
    '#5CFF2D', // F - Verde
    '#2D8A5C', // G - Verde escuro
    '#8A2BE2'  // A - Roxo
  ];
  return colors[track] || '#FFFFFF';
};
