
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Volume2, Play, Pause, RotateCcw, Trophy, Music, Target, Search, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Configuração das notas dos Boomwhackers
const BOOMWHACKER_NOTES = [
  { note: 'C', color: '#FF0000', name: 'Dó', frequency: 261.63, track: 0 },
  { note: 'D', color: '#FF7F00', name: 'Ré', frequency: 293.66, track: 1 },
  { note: 'E', color: '#FFFF00', name: 'Mi', frequency: 329.63, track: 2 },
  { note: 'F', color: '#00FF00', name: 'Fá', frequency: 349.23, track: 3 },
  { note: 'G', color: '#0000FF', name: 'Sol', frequency: 392.00, track: 4 },
  { note: 'A', color: '#8B00FF', name: 'Lá', frequency: 440.00, track: 5 },
  { note: 'B', color: '#FF69B4', name: 'Si', frequency: 493.88, track: 6 },
  { note: 'C2', color: '#8B0000', name: 'Dó²', frequency: 523.25, track: 7 }
];

// Músicas pré-definidas para demonstração
const DEMO_SONGS = [
  {
    id: 'twinkle',
    title: 'Twinkle Twinkle Little Star',
    artist: 'Tradicional',
    duration: 30,
    bpm: 120,
    difficulty: 'easy',
    pattern: [
      { time: 0, track: 0, duration: 500 }, // C
      { time: 1000, track: 0, duration: 500 }, // C
      { time: 2000, track: 4, duration: 500 }, // G
      { time: 3000, track: 4, duration: 500 }, // G
      { time: 4000, track: 5, duration: 500 }, // A
      { time: 5000, track: 5, duration: 500 }, // A
      { time: 6000, track: 4, duration: 1000 }, // G
    ]
  },
  {
    id: 'happy',
    title: 'Happy Birthday',
    artist: 'Tradicional',
    duration: 25,
    bpm: 140,
    difficulty: 'medium',
    pattern: [
      { time: 0, track: 0, duration: 500 },
      { time: 750, track: 0, duration: 500 },
      { time: 1500, track: 1, duration: 500 },
      { time: 2250, track: 0, duration: 500 },
      { time: 3000, track: 3, duration: 500 },
      { time: 4000, track: 2, duration: 1000 },
    ]
  },
  {
    id: 'scale',
    title: 'Escala Musical',
    artist: 'Exercício',
    duration: 20,
    bpm: 100,
    difficulty: 'hard',
    pattern: [
      { time: 0, track: 0, duration: 400 },
      { time: 500, track: 1, duration: 400 },
      { time: 1000, track: 2, duration: 400 },
      { time: 1500, track: 3, duration: 400 },
      { time: 2000, track: 4, duration: 400 },
      { time: 2500, track: 5, duration: 400 },
      { time: 3000, track: 6, duration: 400 },
      { time: 3500, track: 7, duration: 400 },
    ]
  }
];

interface FallingNote {
  id: string;
  track: number;
  y: number;
  targetTime: number;
  hit: boolean;
  color: string;
}

interface GameStats {
  score: number;
  combo: number;
  maxCombo: number;
  hits: number;
  misses: number;
  accuracy: number;
}

const BoomwhackerHero: React.FC = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'ended'>('menu');
  const [selectedSong, setSelectedSong] = useState<typeof DEMO_SONGS[0] | null>(null);
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
  const gameRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const gameStartTime = useRef<number>(0);

  // Configurações do jogo
  const TRACK_WIDTH = 80;
  const TRACK_HEIGHT = 500;
  const NOTE_HEIGHT = 20;
  const HIT_ZONE_Y = TRACK_HEIGHT - 80;
  const NOTE_SPEED = 200; // pixels por segundo
  const HIT_TOLERANCE = 50; // pixels de tolerância para acerto

  // Inicializar contexto de áudio
  const initializeAudio = useCallback(async () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      setAudioContext(ctx);
    } catch (error) {
      console.error('Erro ao inicializar áudio:', error);
    }
  }, []);

  // Tocar som do boomwhacker
  const playBoomwhackerSound = useCallback((noteIndex: number) => {
    if (!audioContext || noteIndex < 0 || noteIndex >= BOOMWHACKER_NOTES.length) return;

    const note = BOOMWHACKER_NOTES[noteIndex];
    
    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(note.frequency, audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.8);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.8);
    } catch (error) {
      console.error('Erro ao tocar nota:', error);
    }
  }, [audioContext]);

  // Iniciar jogo
  const startGame = useCallback(() => {
    if (!selectedSong) return;
    
    setGameState('playing');
    setCurrentTime(0);
    setFallingNotes([]);
    setGameStats({
      score: 0,
      combo: 0,
      maxCombo: 0,
      hits: 0,
      misses: 0,
      accuracy: 0
    });
    
    gameStartTime.current = Date.now();
    
    toast({
      title: "🎵 Jogo Iniciado!",
      description: `Tocando: ${selectedSong.title}`,
    });
  }, [selectedSong, toast]);

  // Gerar notas baseadas no padrão da música
  const generateNotes = useCallback((time: number) => {
    if (!selectedSong || gameState !== 'playing') return;

    const newNotes: FallingNote[] = [];
    
    selectedSong.pattern.forEach(note => {
      const noteTime = note.time;
      const shouldGenerate = Math.abs(time - noteTime) < 100 && 
                           !fallingNotes.some(fn => Math.abs(fn.targetTime - noteTime) < 50);
      
      if (shouldGenerate) {
        const id = `note-${noteTime}-${note.track}`;
        const trackNote = BOOMWHACKER_NOTES[note.track];
        
        newNotes.push({
          id,
          track: note.track,
          y: -NOTE_HEIGHT,
          targetTime: noteTime,
          hit: false,
          color: trackNote.color
        });
      }
    });

    if (newNotes.length > 0) {
      setFallingNotes(prev => [...prev, ...newNotes]);
    }
  }, [selectedSong, gameState, fallingNotes]);

  // Atualizar posições das notas
  const updateNotes = useCallback((deltaTime: number) => {
    setFallingNotes(prev => {
      return prev.map(note => ({
        ...note,
        y: note.y + NOTE_SPEED * (deltaTime / 1000)
      })).filter(note => note.y < TRACK_HEIGHT + 50 && !note.hit);
    });
  }, []);

  // Verificar acertos
  const checkHit = useCallback((trackIndex: number) => {
    const hitNote = fallingNotes.find(note => 
      note.track === trackIndex && 
      !note.hit &&
      Math.abs(note.y - HIT_ZONE_Y) < HIT_TOLERANCE
    );

    if (hitNote) {
      // Marcar nota como acertada
      setFallingNotes(prev => 
        prev.map(note => 
          note.id === hitNote.id ? { ...note, hit: true } : note
        )
      );

      // Tocar som
      playBoomwhackerSound(trackIndex);

      // Atualizar estatísticas
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

      toast({
        title: "🎯 Acerto!",
        description: `+${100 * Math.floor((gameStats.combo + 1) / 10 + 1)} pontos`,
      });
    } else {
      // Miss - quebrar combo
      setGameStats(prev => ({
        ...prev,
        combo: 0,
        misses: prev.misses + 1,
        accuracy: (prev.hits / (prev.hits + prev.misses + 1)) * 100
      }));
    }
  }, [fallingNotes, gameStats.combo, playBoomwhackerSound, toast]);

  // Loop principal do jogo
  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    const now = Date.now();
    const elapsed = now - gameStartTime.current;
    setCurrentTime(elapsed);

    // Gerar novas notas
    generateNotes(elapsed);

    // Atualizar posições das notas
    updateNotes(16); // 60 FPS aproximadamente

    // Verificar se o jogo terminou
    if (selectedSong && elapsed > selectedSong.duration * 1000) {
      setGameState('ended');
      toast({
        title: "🏆 Jogo Finalizado!",
        description: `Pontuação final: ${gameStats.score}`,
      });
      return;
    }

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, generateNotes, updateNotes, selectedSong, gameStats.score, toast]);

  // Filtrar músicas por busca
  const filteredSongs = DEMO_SONGS.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manipular clique na trilha
  const handleTrackClick = useCallback((trackIndex: number) => {
    if (gameState === 'playing') {
      checkHit(trackIndex);
    }
  }, [gameState, checkHit]);

  // Efeitos
  useEffect(() => {
    initializeAudio();
  }, [initializeAudio]);

  useEffect(() => {
    if (gameState === 'playing') {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, gameLoop]);

  // Renderizar menu de seleção de música
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">🎵 BOOMWHACKER HERO</h1>
            <p className="text-xl text-purple-200">Escolha uma música e toque as notas que caem!</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Buscar Música
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Digite o nome da música ou artista..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSongs.map((song) => (
              <Card 
                key={song.id} 
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedSong?.id === song.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedSong(song)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{song.title}</CardTitle>
                  <p className="text-sm text-gray-600">{song.artist}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant={song.difficulty === 'easy' ? 'default' : song.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                      {song.difficulty}
                    </Badge>
                    <span className="text-sm text-gray-500">{song.duration}s</span>
                  </div>
                  <div className="text-sm text-gray-500">BPM: {song.bpm}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedSong && (
            <div className="text-center mt-8">
              <Button onClick={startGame} size="lg" className="text-xl px-8 py-4">
                <Play className="w-6 h-6 mr-2" />
                Iniciar Jogo
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Renderizar jogo
  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header do jogo */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setGameState('menu')}
            className="text-white border-white hover:bg-white hover:text-black"
          >
            ← Menu
          </Button>
          <div>
            <h2 className="text-xl font-bold">{selectedSong?.title}</h2>
            <p className="text-gray-400">{selectedSong?.artist}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{gameStats.score.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Pontos</div>
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

      {/* Área do jogo */}
      <div className="relative mx-auto" style={{ width: TRACK_WIDTH * 8, height: TRACK_HEIGHT }}>
        {/* Trilhas de fundo */}
        {BOOMWHACKER_NOTES.map((note, index) => (
          <div
            key={note.note}
            className="absolute border-l-2 border-gray-600 cursor-pointer"
            style={{
              left: index * TRACK_WIDTH,
              width: TRACK_WIDTH,
              height: TRACK_HEIGHT,
              backgroundColor: `${note.color}10`
            }}
            onClick={() => handleTrackClick(index)}
          >
            {/* Hit zone */}
            <div
              className="absolute w-full border-2 border-white rounded-lg bg-white bg-opacity-20"
              style={{
                bottom: 60,
                height: 40,
                boxShadow: '0 0 20px rgba(255,255,255,0.5)'
              }}
            >
              <div className="text-center text-white font-bold pt-2">
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
              width: 40,
              height: NOTE_HEIGHT,
              backgroundColor: note.color,
              boxShadow: `0 0 10px ${note.color}`,
              opacity: note.hit ? 0.3 : 1,
              transform: note.hit ? 'scale(1.5)' : 'scale(1)',
              transition: note.hit ? 'all 0.3s ease-out' : 'none'
            }}
          />
        ))}
      </div>

      {/* Barra de progresso */}
      <div className="mt-4">
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
