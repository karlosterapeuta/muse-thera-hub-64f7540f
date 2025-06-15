import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Volume2, Play, Pause, RotateCcw, Trophy, Music, Target, Search, Heart, Settings, Square } from 'lucide-react';
import { Input } from '@/components/ui/input';
import MusicAPI from './components/MusicAPI';
import MusicPlayer from './components/MusicPlayer';
import { MusicTrack, MusicAPIManager } from './utils/musicAPIs';
import Enhanced3DCylinders from './components/Enhanced3DCylinders';
import VisualEffects from './components/VisualEffects';
import { useFreePlayMode } from './hooks/useFreePlayMode';
import { globalEnhancedAudio } from './utils/enhancedAudioSynthesis';

// Configuração das notas dos Boomwhackers
const BOOMWHACKER_NOTES = [
  { note: 'C', color: '#FF2D2D', name: 'Dó', frequency: 261.63, track: 0, key: 'a' },
  { note: 'D', color: '#FF8A2D', name: 'Ré', frequency: 293.66, track: 1, key: 's' },
  { note: 'E', color: '#FFD700', name: 'Mi', frequency: 329.63, track: 2, key: 'd' },
  { note: 'F', color: '#5CFF2D', name: 'Fá', frequency: 349.23, track: 3, key: 'f' },
  { note: 'G', color: '#2D8A5C', name: 'Sol', frequency: 392.00, track: 4, key: 'g' },
  { note: 'A', color: '#8A2BE2', name: 'Lá', frequency: 440.00, track: 5, key: 'h' }
];

// Música de exemplo original "Melodia de Demonstração"
const DEMO_SONG = {
  id: 'demo-melody',
  title: 'Melodia de Demonstração',
  artist: 'Compositor Original',
  duration: 20,
  bpm: 120,
  difficulty: 'medium',
  pattern: [
    { time: 1000, track: 4, duration: 500 }, // G
    { time: 2000, track: 1, duration: 500 }, // D
    { time: 3000, track: 2, duration: 500 }, // E
    { time: 4000, track: 4, duration: 500 }, // G
    { time: 5000, track: 5, duration: 500 }, // A
    { time: 6000, track: 4, duration: 500 }, // G
    { time: 7000, track: 2, duration: 500 }, // E
    { time: 8000, track: 1, duration: 500 }, // D
    { time: 9000, track: 4, duration: 500 }, // G
    { time: 10000, track: 1, duration: 500 }, // D
    { time: 11000, track: 2, duration: 500 }, // E
    { time: 12000, track: 4, duration: 500 }, // G
    { time: 13000, track: 5, duration: 500 }, // A
    { time: 14000, track: 4, duration: 500 }, // G
    { time: 15000, track: 2, duration: 500 }, // E
    { time: 16000, track: 1, duration: 500 }, // D
  ]
};

interface FallingNote {
  id: string;
  track: number;
  y: number;
  targetTime: number;
  hit: boolean;
  color: string;
  startTime: number;
}

interface GameStats {
  score: number;
  combo: number;
  maxCombo: number;
  hits: number;
  misses: number;
  accuracy: number;
}

type GameDifficulty = 'Todos' | 'Iniciante' | 'Intermediário' | 'Avançado';

interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
  life: number;
  velocity: { x: number; y: number };
}

const BoomwhackerHero: React.FC = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'ended' | 'freeplay'>('menu');
  const [selectedSong, setSelectedSong] = useState<typeof DEMO_SONG | MusicTrack | null>(null);
  const [availableTracks, setAvailableTracks] = useState<MusicTrack[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fallingNotes, setFallingNotes] = useState<FallingNote[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    combo: 0,
    maxCombo: 0,
    hits: 0,
    misses: 0,
    accuracy: 0
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [difficulty, setDifficulty] = useState<GameDifficulty>('Todos');
  const [showMusicAPI, setShowMusicAPI] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  
  // Novos estados para funcionalidades aprimoradas
  const [gameMode, setGameMode] = useState<'menu' | 'playing' | 'paused' | 'ended' | 'freeplay'>('menu');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  
  // Hook para modo livre
  const {
    isRecording,
    recordedSequence,
    isPlaying: isPlayingRecording,
    startRecording,
    stopRecording,
    recordNote,
    playRecording,
    clearRecording
  } = useFreePlayMode();

  const gameRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const noteIdCounter = useRef<number>(0);
  const gameLoopRef = useRef<number>();
  const timeSimulationRef = useRef<NodeJS.Timeout>();
  const particleIdCounter = useRef<number>(0);

  // Configurações do jogo
  const TRACK_WIDTH = 100;
  const TRACK_HEIGHT = 500;
  const NOTE_HEIGHT = 30;
  const HIT_ZONE_Y = TRACK_HEIGHT - 120;
  const NOTE_SPEED = 200;
  const HIT_TOLERANCE = 60;
  const NOTE_FALL_TIME = 2000; // 2 segundos para nota cair

  // Helper function to check if song is a MusicTrack
  const isMusicTrack = (song: typeof selectedSong): song is MusicTrack => {
    return song !== null && 'source' in song;
  };

  // Função para criar partículas visuais
  const createParticles = useCallback((noteIndex: number) => {
    const note = BOOMWHACKER_NOTES[noteIndex];
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < 8; i++) {
      particleIdCounter.current += 1;
      newParticles.push({
        id: `particle-${particleIdCounter.current}`,
        x: noteIndex * TRACK_WIDTH + 50 + (Math.random() - 0.5) * 60,
        y: TRACK_HEIGHT - 150 + (Math.random() - 0.5) * 40,
        color: note.color,
        life: 1,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: -Math.random() * 3 - 1
        }
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
    
    // Remover partículas após animação
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 2000);
  }, [TRACK_WIDTH, TRACK_HEIGHT]);

  // Função para reproduzir gravação
  const handlePlayRecording = useCallback(() => {
    playRecording((noteIndex: number) => {
      playBoomwhackerSound(noteIndex);
    });
  }, [playRecording]);

  // Inicializar contexto de áudio
  const initializeAudio = useCallback(async () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      // Garantir que o contexto seja desbloqueado
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      
      setAudioContext(ctx);
      console.log('🎵 Contexto de áudio inicializado e desbloqueado');
    } catch (error) {
      console.error('Erro ao inicializar áudio:', error);
    }
  }, []);

  // Tocar som do boomwhacker
  const playBoomwhackerSound = useCallback(async (noteIndex: number) => {
    if (noteIndex < 0 || noteIndex >= BOOMWHACKER_NOTES.length) {
      console.log('⚠️ Índice de nota inválido');
      return;
    }

    try {
      const note = BOOMWHACKER_NOTES[noteIndex];
      
      // Usar áudio melhorado com harmonias
      await globalEnhancedAudio.playBoomwhackerWithHarmony(
        note.frequency, 
        noteIndex, 
        activeNotes
      );
      
      // Adicionar à lista de notas ativas
      setActiveNotes(prev => new Set([...prev, noteIndex]));
      
      // Remover da lista após um tempo
      setTimeout(() => {
        setActiveNotes(prev => {
          const newSet = new Set(prev);
          newSet.delete(noteIndex);
          return newSet;
        });
      }, 600);
      
      // Criar partículas visuais
      createParticles(noteIndex);
      
      // Gravar nota se estiver no modo de gravação
      if (gameMode === 'freeplay' && isRecording) {
        recordNote(noteIndex);
      }
      
      console.log(`🎵 Tocando nota melhorada ${note.note} (${note.frequency}Hz)`);
    } catch (error) {
      console.error('Erro ao tocar nota:', error);
    }
  }, [activeNotes, gameMode, isRecording, recordNote, createParticles]);

  // Gerar notas conforme a música
  const generateNotes = useCallback(() => {
    if (!selectedSong || gameState !== 'playing') return;

    const pattern = 'pattern' in selectedSong ? selectedSong.pattern : [
      { time: 1000, track: 0, duration: 500 },
      { time: 2000, track: 1, duration: 500 },
      { time: 3000, track: 2, duration: 500 },
      { time: 4000, track: 3, duration: 500 },
      { time: 5000, track: 4, duration: 500 },
      { time: 6000, track: 5, duration: 500 },
      { time: 7000, track: 0, duration: 500 },
      { time: 8000, track: 1, duration: 500 },
    ];

    pattern.forEach(notePattern => {
      const noteTime = notePattern.time;
      const shouldGenerate = 
        currentTime >= (noteTime - NOTE_FALL_TIME) && 
        currentTime < (noteTime - NOTE_FALL_TIME + 100) &&
        !fallingNotes.some(fn => Math.abs(fn.targetTime - noteTime) < 100);
      
      if (shouldGenerate) {
        noteIdCounter.current += 1;
        const trackNote = BOOMWHACKER_NOTES[notePattern.track];
        
        console.log(`🎵 Gerando nota ${trackNote.note} para tempo ${noteTime}ms (atual: ${currentTime.toFixed(0)}ms)`);
        
        setFallingNotes(prev => [...prev, {
          id: `note-${noteTime}-${notePattern.track}-${noteIdCounter.current}`,
          track: notePattern.track,
          y: -NOTE_HEIGHT,
          targetTime: noteTime,
          hit: false,
          color: trackNote.color,
          startTime: Date.now()
        }]);
      }
    });
  }, [selectedSong, gameState, currentTime, fallingNotes]);

  // Atualizar posições das notas
  const updateNotes = useCallback(() => {
    setFallingNotes(prev => {
      return prev.map(note => {
        const timeToTarget = note.targetTime - currentTime;
        const fallProgress = 1 - (timeToTarget / NOTE_FALL_TIME);
        const newY = fallProgress * (HIT_ZONE_Y + NOTE_HEIGHT);
        
        return {
          ...note,
          y: newY
        };
      }).filter(note => {
        const timePastTarget = currentTime - note.targetTime;
        const shouldKeep = timePastTarget < 1000 && !note.hit;
        
        if (!shouldKeep && !note.hit && timePastTarget >= 1000) {
          console.log(`❌ Nota perdida: ${BOOMWHACKER_NOTES[note.track].note}`);
          setGameStats(prevStats => ({
            ...prevStats,
            combo: 0,
            misses: prevStats.misses + 1,
            accuracy: prevStats.hits > 0 ? (prevStats.hits / (prevStats.hits + prevStats.misses + 1)) * 100 : 0
          }));
        }
        
        return shouldKeep;
      });
    });
  }, [currentTime]);

  // Verificar acerto de nota
  const checkHit = useCallback(async (trackIndex: number) => {
    const hitNote = fallingNotes.find(note => 
      note.track === trackIndex && 
      !note.hit &&
      Math.abs(currentTime - note.targetTime) < HIT_TOLERANCE
    );

    if (hitNote) {
      setFallingNotes(prev => 
        prev.map(note => 
          note.id === hitNote.id ? { ...note, hit: true } : note
        )
      );

      // Tocar som do boomwhacker
      await playBoomwhackerSound(trackIndex);

      setGameStats(prev => {
        const newCombo = prev.combo + 1;
        const baseScore = 100;
        const comboMultiplier = Math.floor(newCombo / 10) + 1;
        const scoreGain = baseScore * comboMultiplier;

        return {
          ...prev,
          score: prev.score + scoreGain,
          combo: newCombo,
          maxCombo: Math.max(prev.maxCombo, newCombo),
          hits: prev.hits + 1,
          accuracy: ((prev.hits + 1) / (prev.hits + prev.misses + 1)) * 100
        };
      });

      const timing = Math.abs(currentTime - hitNote.targetTime);
      const accuracy = timing < 20 ? 'Perfeito!' : timing < 40 ? 'Bom!' : 'Ok!';
      
      console.log(`🎯 Acerto! ${accuracy} - Timing: ${timing.toFixed(0)}ms`);
      
      toast({
        title: `🎯 ${accuracy}`,
        description: `+${100 * Math.floor((gameStats.combo + 1) / 10 + 1)} pontos`,
      });
    } else {
      // Miss
      await playBoomwhackerSound(trackIndex);
    }
  }, [fallingNotes, currentTime, gameStats.combo, playBoomwhackerSound, toast]);

  // Controlar tempo do jogo - MELHORADO
  const handleMusicTimeUpdate = useCallback((timeInSeconds: number) => {
    const timeInMs = timeInSeconds * 1000;
    setCurrentTime(timeInMs);
    
    // Se o jogo está rodando e a música terminou, finalizar
    if (gameState === 'playing' && selectedSong && timeInMs >= selectedSong.duration * 1000) {
      console.log('⏱️ Música terminou - finalizando jogo via time update');
      handleTrackEnd();
    }
  }, [gameState, selectedSong]);

  // Controlar play/pause
  const handleMusicPlayPause = useCallback((playing: boolean) => {
    console.log(`🎵 Player estado: ${playing ? 'Play' : 'Pause'}`);
    setIsMusicPlaying(playing);
    
    // Se pausou durante o jogo, pausar o jogo também
    if (!playing && gameState === 'playing') {
      setGameState('paused');
    }
  }, [gameState]);

  // Iniciar jogo
  const startGame = useCallback(async () => {
    if (!selectedSong) return;
    
    console.log(`🎮 Iniciando jogo com música: ${selectedSong.title}`);
    
    // Inicializar áudio se necessário
    if (!audioContext) {
      await initializeAudio();
    }
    
    setGameState('playing');
    setCurrentTime(0);
    setGameStartTime(Date.now());
    setFallingNotes([]);
    setGameStats({
      score: 0,
      combo: 0,
      maxCombo: 0,
      hits: 0,
      misses: 0,
      accuracy: 0
    });
    
    noteIdCounter.current = 0;
    
    // Iniciar música junto com o jogo
    if (isMusicTrack(selectedSong) && selectedSong.preview_url) {
      console.log('🎵 Iniciando música real junto com o jogo');
      setIsMusicPlaying(true);
      handleMusicPlayPause(true);
    } else {
      console.log('🎮 Iniciando modo simulação junto com o jogo');
      setIsMusicPlaying(true);
    }
    
    toast({
      title: "🎵 Jogo Iniciado!",
      description: `Tocando: ${selectedSong.title}`,
    });
  }, [selectedSong, audioContext, initializeAudio, toast, handleMusicPlayPause]);

  // Toggle pause
  const toggleGamePause = useCallback(() => {
    if (gameState === 'playing') {
      console.log('⏸️ Pausando jogo');
      setGameState('paused');
    } else if (gameState === 'paused') {
      console.log('▶️ Retomando jogo');
      setGameState('playing');
    }
  }, [gameState]);

  // Parar música
  const stopMusic = useCallback(() => {
    console.log('⏹️ Parando música e resetando jogo');
    setCurrentTime(0);
    setGameStartTime(0);
    setFallingNotes([]);
    
    if (gameState === 'playing') {
      setGameState('paused');
    }
    
    toast({
      title: "⏹️ Música Parada",
      description: "A reprodução foi interrompida",
    });
  }, [gameState, toast]);

  // Quando música termina - MELHORADO
  const handleTrackEnd = useCallback(() => {
    console.log('🏆 Música terminou - finalizando jogo');
    setGameState('ended');
    setIsMusicPlaying(false);
    
    // Limpar simulação de tempo se estiver rodando
    if (timeSimulationRef.current) {
      clearInterval(timeSimulationRef.current);
      timeSimulationRef.current = undefined;
    }
    
    toast({
      title: "🏆 Jogo Finalizado!",
      description: `Pontuação final: ${gameStats.score.toLocaleString()}`,
    });
  }, [gameStats.score, toast]);

  // Lidar com falha de música - MELHORADO
  const handleTrackFailed = useCallback(async () => {
    if (!selectedSong) return;
    
    console.log(`❌ Música falhou: ${selectedSong.title}`);
    
    let nextTrack = null;
    
    if (availableTracks.length > 1 && isMusicTrack(selectedSong)) {
      const currentTrack = selectedSong as MusicTrack;
      const currentIndex = availableTracks.findIndex(track => 
        track.id === currentTrack.id && track.source === currentTrack.source
      );
      
      if (currentIndex !== -1) {
        nextTrack = MusicAPIManager.getNextValidTrack(availableTracks, currentIndex);
      }
    }
    
    if (!nextTrack) {
      console.log('🔄 Carregando novas músicas...');
      
      try {
        // Sempre tentar demo primeiro para garantir que funcione
        let newTracks = await MusicAPIManager.getPopular('demo');
        
        if (newTracks.length > 0) {
          setAvailableTracks(newTracks);
          nextTrack = newTracks[0];
          console.log(`✅ Novas músicas demo carregadas: ${newTracks.length}`);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar novas músicas:', error);
      }
    }
    
    if (nextTrack) {
      console.log(`🔄 Trocando para: ${nextTrack.title}`);
      setSelectedSong(nextTrack);
      
      toast({
        title: "🔄 Música Alterada",
        description: `Agora tocando: ${nextTrack.title}`,
      });
    } else {
      console.log('🚨 Voltando para música padrão...');
      setSelectedSong(DEMO_SONG);
      
      toast({
        title: "🎵 Usando Música Padrão",
        description: "Carregando música de demonstração",
      });
    }
  }, [selectedSong, availableTracks, toast]);

  // Loop principal do jogo
  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    generateNotes();
    updateNotes();

    // Verificar se o jogo deve terminar
    if (selectedSong && currentTime > selectedSong.duration * 1000) {
      console.log('⏱️ Tempo do jogo esgotado');
      handleTrackEnd();
      return;
    }
  }, [gameState, generateNotes, updateNotes, selectedSong, currentTime, handleTrackEnd]);

  // Manipular clique na trilha
  const handleTrackClick = useCallback((trackIndex: number) => {
    if (gameState === 'playing') {
      checkHit(trackIndex);
    } else {
      playBoomwhackerSound(trackIndex);
    }
  }, [gameState, checkHit, playBoomwhackerSound]);

  // Manipular teclas do teclado
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const note = BOOMWHACKER_NOTES.find(n => n.key === event.key.toLowerCase());
    if (note) {
      handleTrackClick(note.track);
    }
  }, [handleTrackClick]);

  // Efeito para inicialização - MELHORADO para músicas originais
  useEffect(() => {
    initializeAudio();
    setSelectedSong(DEMO_SONG);
    
    // Carregar biblioteca original de músicas livres de direitos autorais
    MusicAPIManager.getPopular('demo').then(tracks => {
      setAvailableTracks(tracks);
      console.log(`🎵 Biblioteca original carregada: ${tracks.length} composições livres de direitos autorais`);
      
      toast({
        title: "🎵 Biblioteca Musical Carregada",
        description: `${tracks.length} composições originais disponíveis - 100% livres de direitos autorais`,
      });
    });
    
    console.log('🎵 Jogo inicializado com música original');
  }, [initializeAudio, toast]);

  // Efeito para manipular teclas
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Efeito para loop do jogo
  useEffect(() => {
    let animationId: number;
    
    if (gameState === 'playing') {
      const runGameLoop = () => {
        gameLoop();
        animationId = requestAnimationFrame(runGameLoop);
      };
      animationId = requestAnimationFrame(runGameLoop);
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [gameState, gameLoop]);

  // Efeito para simulação de tempo quando não há áudio real - MELHORADO
  useEffect(() => {
    if (gameState === 'playing' && selectedSong && isMusicPlaying) {
      // Se é MusicTrack sem preview_url ou ANGELS_SONG, usar simulação
      if (!isMusicTrack(selectedSong) || !selectedSong.preview_url) {
        console.log('🎮 Iniciando simulação de tempo sincronizada');
        timeSimulationRef.current = setInterval(() => {
          setCurrentTime(prev => {
            const newTime = prev + 100;
            // Verificar se chegou ao fim da música
            if (newTime >= selectedSong.duration * 1000) {
              console.log('🏆 Música simulada terminou');
              if (timeSimulationRef.current) {
                clearInterval(timeSimulationRef.current);
                timeSimulationRef.current = undefined;
              }
              // Usar setTimeout para evitar problemas de estado
              setTimeout(() => {
                handleTrackEnd();
              }, 0);
              return selectedSong.duration * 1000;
            }
            return newTime;
          });
        }, 100);
      }
    } else {
      if (timeSimulationRef.current) {
        clearInterval(timeSimulationRef.current);
        timeSimulationRef.current = undefined;
      }
    }

    return () => {
      if (timeSimulationRef.current) {
        clearInterval(timeSimulationRef.current);
        timeSimulationRef.current = undefined;
      }
    };
  }, [gameState, selectedSong, isMusicPlaying, handleTrackEnd]);

  // Renderizar menu de seleção de música
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-orange-500" style={{ fontFamily: 'Pacifico, cursive' }}>
              MusicaFácil
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => setShowMusicAPI(!showMusicAPI)}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Music className="w-4 h-4 mr-2" />
              Biblioteca Original
            </Button>
            <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          </div>
        </header>

        <div className="pt-20 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">🎵 BOOMWHACKER HERO</h1>
            <p className="text-xl text-purple-200">Escolha uma música e toque as notas que caem!</p>
            <div className="mt-4 p-3 bg-green-900 bg-opacity-50 rounded-lg">
              <p className="text-sm text-green-200">
                ✅ <strong>100% Livre de Direitos Autorais</strong> - Todas as músicas são composições originais
              </p>
            </div>
          </div>

          {showMusicAPI ? (
            <MusicAPI 
              onTrackSelect={(track) => {
                setSelectedSong(track);
                if (track.source !== 'synthesized') {
                  MusicAPIManager.getPopular(track.source).then(tracks => {
                    setAvailableTracks(tracks);
                  });
                }
                setShowMusicAPI(false);
                toast({
                  title: "🎵 Composição Original Selecionada!",
                  description: `${track.title} - ${track.artist} (Livre de direitos autorais)`,
                });
              }}
              selectedTrack={selectedSong as MusicTrack}
            />
          ) : (
            <>
              {selectedSong && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Music className="w-5 h-5" />
                      Composição Selecionada
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                        <div>
                          <h3 className="text-lg font-semibold">{selectedSong.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300">{selectedSong.artist}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge>Duração: {selectedSong.duration}s</Badge>
                            {'bpm' in selectedSong && selectedSong.bpm && (
                              <Badge variant="outline">{selectedSong.bpm} BPM</Badge>
                            )}
                            {isMusicTrack(selectedSong) && (
                              <Badge variant="secondary">
                                {selectedSong.source}
                              </Badge>
                            )}
                            <Badge className="bg-green-600">
                              Original & Livre
                            </Badge>
                          </div>
                        </div>
                        <Badge variant="default">Pronto para jogar!</Badge>
                      </div>
                      
                      <MusicPlayer
                        track={selectedSong as MusicTrack}
                        isPlaying={isMusicPlaying}
                        onPlayPause={handleMusicPlayPause}
                        onTrackFailed={handleTrackFailed}
                        onTimeUpdate={handleMusicTimeUpdate}
                        volume={musicVolume}
                        onVolumeChange={setMusicVolume}
                      />

                      <div className="flex justify-center gap-2">
                        <Button
                          onClick={() => handleMusicPlayPause(!isMusicPlaying)}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          {isMusicPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                          {isMusicPlaying ? 'Pausar' : 'Tocar'}
                        </Button>
                        
                        <Button
                          onClick={stopMusic}
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          <Square className="w-4 h-4 mr-2" />
                          Parar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="text-center">
                <Button
                  onClick={startGame}
                  disabled={!selectedSong}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-xl font-bold rounded-full"
                >
                  <Play className="w-6 h-6 mr-2" />
                  COMEÇAR JOGO
                </Button>
                
                <Button
                  onClick={() => setGameMode('freeplay')}
                  className="ml-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 text-xl font-bold rounded-full"
                >
                  <Music className="w-6 h-6 mr-2" />
                  MODO LIVRE
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Renderizar modo livre
  if (gameMode === 'freeplay') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden">
        {/* Header do modo livre */}
        <div className="flex justify-between items-center p-4 bg-black bg-opacity-80">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setGameMode('menu')}
              className="text-white border-white hover:bg-white hover:text-black"
            >
              ← Menu
            </Button>
            
            <div>
              <h2 className="text-xl font-bold">🎵 Modo Livre</h2>
              <p className="text-gray-400">Toque livremente e grave suas criações</p>
            </div>
          </div>

          {/* Controles de gravação */}
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  className="bg-red-500 hover:bg-red-600"
                >
                  <circle className="w-4 h-4 mr-2 fill-current" />
                  Gravar
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  className="bg-gray-500 hover:bg-gray-600 animate-pulse"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Parar Gravação
                </Button>
              )}
              
              <Button
                onClick={handlePlayRecording}
                disabled={recordedSequence.length === 0 || isPlayingRecording}
                className="bg-green-500 hover:bg-green-600 disabled:opacity-50"
              >
                <Play className="w-4 h-4 mr-2" />
                Reproduzir ({recordedSequence.length})
              </Button>
              
              <Button
                onClick={clearRecording}
                disabled={recordedSequence.length === 0}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Limpar
              </Button>
            </div>
          </div>
        </div>

        {/* Área visual do modo livre */}
        <div className="relative mx-auto" style={{ width: TRACK_WIDTH * 6, height: TRACK_HEIGHT }}>
          {/* Trilhas de fundo */}
          {BOOMWHACKER_NOTES.map((note, index) => (
            <div
              key={note.note}
              className="absolute border-l-2 border-gray-600 cursor-pointer transition-all duration-200 hover:bg-opacity-30"
              style={{
                left: index * TRACK_WIDTH,
                width: TRACK_WIDTH,
                height: TRACK_HEIGHT,
                backgroundColor: activeNotes.has(index) ? `${note.color}30` : `${note.color}10`
              }}
              onClick={() => handleTrackClick(index)}
            >
              {/* Zona de toque visual */}
              <div
                className={`absolute w-full border-2 rounded-lg transition-all duration-200 ${
                  activeNotes.has(index) 
                    ? 'border-white bg-white bg-opacity-40 shadow-2xl' 
                    : 'border-white bg-white bg-opacity-20'
                }`}
                style={{
                  bottom: 100,
                  height: 80,
                  boxShadow: activeNotes.has(index) 
                    ? `0 0 30px ${note.color}` 
                    : '0 0 20px rgba(255,255,255,0.5)'
                }}
              >
                <div className="text-center text-white font-bold pt-6">
                  {note.note}
                </div>
              </div>
            </div>
          ))}

          {/* Efeitos visuais */}
          <VisualEffects 
            particles={particles} 
            trackWidth={TRACK_WIDTH} 
            trackHeight={TRACK_HEIGHT} 
          />
        </div>

        {/* Cilindros 3D melhorados */}
        <Enhanced3DCylinders 
          notes={BOOMWHACKER_NOTES}
          activeNotes={activeNotes}
          onNoteClick={handleTrackClick}
          gameMode="freeplay"
        />

        {/* Instruções */}
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <div className="bg-black bg-opacity-60 rounded-lg p-4">
            <p className="text-white mb-2">
              <strong>Use as teclas:</strong> A, S, D, F, G, H | <strong>ou clique</strong> nos cilindros/trilhas
            </p>
            {isRecording && (
              <p className="text-red-400 animate-pulse">
                🔴 GRAVANDO - Toque as notas para criar sua sequência
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Renderizar jogo normal com melhorias visuais
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header do jogo */}
      <div className="flex justify-between items-center p-4 bg-black bg-opacity-80">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => {
              setGameState('menu');
              setIsMusicPlaying(false);
            }}
            className="text-white border-white hover:bg-white hover:text-black"
          >
            ← Menu
          </Button>
          
          {/* Controles de música no jogo */}
          <div className="flex gap-2">
            <Button
              onClick={toggleGamePause}
              className="w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-full p-0"
            >
              {gameState === 'playing' ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            
            <Button
              onClick={stopMusic}
              className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full p-0"
              title="Parar música"
            >
              <Square className="w-6 h-6" />
            </Button>
          </div>
          
          <div>
            <h2 className="text-xl font-bold">{selectedSong?.title}</h2>
            <p className="text-gray-400">{selectedSong?.artist}</p>
            <p className="text-xs text-green-400">🎵 Composição Original</p>
          </div>
        </div>

        {/* Seletor de dificuldade no jogo */}
        <div className="flex gap-2 p-1 bg-gray-800 bg-opacity-80 rounded-full">
          {(['Todos', 'Iniciante', 'Intermediário', 'Avançado'] as GameDifficulty[]).map((level) => (
            <Button
              key={level}
              variant={difficulty === level ? 'default' : 'ghost'}
              size="sm"
              className={`rounded-full ${difficulty === level ? 'bg-white text-black' : 'text-white hover:bg-gray-700'}`}
              onClick={() => setDifficulty(level)}
            >
              {level}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{gameStats.score.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Pontuação</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-400">{gameStats.combo}x</div>
            <div className="text-sm text-gray-400">Combo</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">{gameStats.accuracy.toFixed(1)}%</div>
            <div className="text-sm text-gray-400">Precisão</div>
          </div>
        </div>
      </div>

      {/* Player de música durante o jogo */}
      {selectedSong && (gameState === 'playing' || gameState === 'paused') && (
        <div className="fixed top-20 right-4 z-40 w-80">
          <MusicPlayer
            track={selectedSong as MusicTrack}
            isPlaying={isMusicPlaying}
            onPlayPause={handleMusicPlayPause}
            onTrackEnd={handleTrackEnd}
            onTrackFailed={handleTrackFailed}
            onTimeUpdate={handleMusicTimeUpdate}
            volume={musicVolume}
            onVolumeChange={setMusicVolume}
          />
        </div>
      )}

      {/* Área do jogo com efeitos visuais */}
      <div 
        ref={gameRef}
        className="relative mx-auto" 
        style={{ width: TRACK_WIDTH * 6, height: TRACK_HEIGHT }}
      >
        {/* Trilhas de fundo melhoradas */}
        {BOOMWHACKER_NOTES.map((note, index) => (
          <div
            key={note.note}
            className="absolute border-l-2 border-gray-600 cursor-pointer transition-all duration-200"
            style={{
              left: index * TRACK_WIDTH,
              width: TRACK_WIDTH,
              height: TRACK_HEIGHT,
              backgroundColor: activeNotes.has(index) ? `${note.color}30` : `${note.color}10`
            }}
            onClick={() => handleTrackClick(index)}
          >
            {/* Hit zone melhorada */}
            <div
              className={`absolute w-full border-2 rounded-lg transition-all duration-200 ${
                activeNotes.has(index) 
                  ? 'border-white bg-white bg-opacity-40 shadow-2xl' 
                  : 'border-white bg-white bg-opacity-20'
              }`}
              style={{
                bottom: 100,
                height: 80,
                boxShadow: activeNotes.has(index) 
                  ? `0 0 30px ${note.color}` 
                  : '0 0 20px rgba(255,255,255,0.5)'
              }}
            >
              <div className="text-center text-white font-bold pt-6">
                {note.note}
              </div>
            </div>
          </div>
        ))}

        {/* Notas caindo */}
        {fallingNotes.map((note) => (
          <div
            key={note.id}
            className="absolute rounded-full border-2 border-white"
            style={{
              left: note.track * TRACK_WIDTH + 20,
              top: note.y,
              width: 60,
              height: NOTE_HEIGHT,
              backgroundColor: note.color,
              boxShadow: `0 0 10px ${note.color}`,
              opacity: note.hit ? 0.3 : 0.8,
              transform: note.hit ? 'scale(1.5)' : 'scale(1)',
              transition: note.hit ? 'all 0.3s ease-out' : 'none'
            }}
          />
        ))}
      </div>

      {/* Cilindros 3D melhorados */}
      <Enhanced3DCylinders 
        notes={BOOMWHACKER_NOTES}
        activeNotes={activeNotes}
        onNoteClick={handleTrackClick}
        gameMode="playing"
      />

      {/* Efeitos visuais */}
      <VisualEffects 
        particles={particles} 
        trackWidth={TRACK_WIDTH} 
        trackHeight={TRACK_HEIGHT} 
      />

      {/* Barra de progresso */}
      <div className="absolute bottom-4 left-4 right-4">
        <Progress 
          value={selectedSong ? (currentTime / (selectedSong.duration * 1000)) * 100 : 0} 
          className="w-full h-2"
        />
      </div>

      {/* Tela de fim de jogo */}
      {gameState === 'ended' && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="text-center">🏆 Jogo Finalizado!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-3xl font-bold text-yellow-500">{gameStats.score.toLocaleString()}</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-bold">Acertos</div>
                  <div>{gameStats.hits}</div>
                </div>
                <div>
                  <div className="font-bold">Erros</div>
                  <div>{gameStats.misses}</div>
                </div>
                <div>
                  <div className="font-bold">Combo Máximo</div>
                  <div>{gameStats.maxCombo}x</div>
                </div>
                <div>
                  <div className="font-bold">Precisão</div>
                  <div>{gameStats.accuracy.toFixed(1)}%</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setGameState('menu')} className="flex-1">
                  Menu Principal
                </Button>
                <Button onClick={startGame} variant="outline" className="flex-1">
                  Jogar Novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BoomwhackerHero;
