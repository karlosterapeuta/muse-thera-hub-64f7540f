import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Volume2, Play, Pause, RotateCcw, Trophy, Music, Target, Search, Heart, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import MusicAPI from './components/MusicAPI';
import MusicPlayer from './components/MusicPlayer';
import { MusicTrack, MusicAPIManager } from './utils/musicAPIs';

// Configuração das notas dos Boomwhackers
const BOOMWHACKER_NOTES = [
  { note: 'C', color: '#FF2D2D', name: 'Dó', frequency: 261.63, track: 0, key: 'a' },
  { note: 'D', color: '#FF8A2D', name: 'Ré', frequency: 293.66, track: 1, key: 's' },
  { note: 'E', color: '#FFD700', name: 'Mi', frequency: 329.63, track: 2, key: 'd' },
  { note: 'F', color: '#5CFF2D', name: 'Fá', frequency: 349.23, track: 3, key: 'f' },
  { note: 'G', color: '#2D8A5C', name: 'Sol', frequency: 392.00, track: 4, key: 'g' },
  { note: 'A', color: '#8A2BE2', name: 'Lá', frequency: 440.00, track: 5, key: 'h' }
];

// Música de exemplo "Anjos Que Temos Ouvido"
const ANGELS_SONG = {
  id: 'angels',
  title: 'Anjos Que Temos Ouvido',
  artist: 'Música Tradicional',
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

const BoomwhackerHero: React.FC = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'ended'>('menu');
  const [selectedSong, setSelectedSong] = useState<typeof ANGELS_SONG | MusicTrack | null>(null);
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
  const [musicPlayerCurrentTime, setMusicPlayerCurrentTime] = useState(0);
  const gameRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const gameStartTime = useRef<number>(0);
  const noteIdCounter = useRef<number>(0);

  // Configurações do jogo
  const TRACK_WIDTH = 100;
  const TRACK_HEIGHT = 500;
  const NOTE_HEIGHT = 30;
  const HIT_ZONE_Y = TRACK_HEIGHT - 120;
  const NOTE_SPEED = 200;
  const HIT_TOLERANCE = 60;

  // Inicializar contexto de áudio
  const initializeAudio = useCallback(async () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      setAudioContext(ctx);
      console.log('🎵 Contexto de áudio inicializado');
    } catch (error) {
      console.error('Erro ao inicializar áudio:', error);
    }
  }, []);

  // Novo: Sincronização com o tempo do music player
  const handleMusicTimeUpdate = useCallback((time: number) => {
    setMusicPlayerCurrentTime(time);
    // Sincronizar o tempo do jogo com o player
    if (gameState === 'playing') {
      setCurrentTime(time * 1000); // converter para ms
    }
  }, [gameState]);

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

  // Iniciar jogo com música
  const startGame = useCallback(() => {
    if (!selectedSong) return;
    
    console.log(`🎮 Iniciando jogo com música: ${selectedSong.title}`);
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
    noteIdCounter.current = 0;
    setIsMusicPlaying(true);
    
    toast({
      title: "🎵 Jogo Iniciado!",
      description: `Tocando: ${selectedSong.title}`,
    });
  }, [selectedSong, toast]);

  // Pausar/Retomar jogo
  const toggleGamePause = useCallback(() => {
    if (gameState === 'playing') {
      console.log('⏸️ Pausando jogo');
      setGameState('paused');
      setIsMusicPlaying(false);
    } else if (gameState === 'paused') {
      console.log('▶️ Retomando jogo');
      setGameState('playing');
      setIsMusicPlaying(true);
    }
  }, [gameState]);

  // Função quando música termina - melhorada
  const handleTrackEnd = useCallback(() => {
    console.log('🏆 Música terminou - finalizando jogo');
    setGameState('ended');
    setIsMusicPlaying(false);
    
    // Parar animação do jogo
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    toast({
      title: "🏆 Jogo Finalizado!",
      description: `Pontuação final: ${gameStats.score.toLocaleString()}`,
    });
  }, [gameStats.score, toast]);

  // Nova função melhorada para lidar com falha de música
  const handleTrackFailed = useCallback(async () => {
    if (!selectedSong) return;
    
    console.log(`❌ Música falhou: ${selectedSong.title}`);
    
    // Tentar próxima música válida da lista atual
    let nextTrack = null;
    
    // Só tentar getNextValidTrack se a música atual tem source e temos tracks disponíveis
    if (availableTracks.length > 1 && 'source' in selectedSong) {
      // Corrigir o tipo para incluir synthesized
      const currentTrack = selectedSong as MusicTrack;
      nextTrack = MusicAPIManager.getNextValidTrack(availableTracks, currentTrack);
    }
    
    // Se não há próxima música válida, carregar novas músicas
    if (!nextTrack) {
      console.log('🔄 Carregando novas músicas...');
      
      try {
        // Tentar diferentes fontes
        let newTracks: MusicTrack[] = [];
        
        // Primeiro tentar Spotify
        newTracks = await MusicAPIManager.getPopular('spotify');
        
        // Se Spotify falhar, tentar Jamendo
        if (newTracks.length === 0) {
          newTracks = await MusicAPIManager.getPopular('jamendo');
        }
        
        // Se ambos falharem, usar Demo
        if (newTracks.length === 0) {
          newTracks = await MusicAPIManager.getPopular('demo');
        }
        
        if (newTracks.length > 0) {
          setAvailableTracks(newTracks);
          nextTrack = newTracks[0];
          console.log(`✅ Novas músicas carregadas: ${newTracks.length}`);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar novas músicas:', error);
      }
    }
    
    // Se encontrou uma próxima música válida
    if (nextTrack) {
      console.log(`🔄 Trocando para: ${nextTrack.title}`);
      setSelectedSong(nextTrack);
      
      toast({
        title: "🔄 Música Alterada",
        description: `Agora tocando: ${nextTrack.title}`,
      });
    } else {
      // Último recurso: voltar para a música padrão ANGELS_SONG
      console.log('🚨 Voltando para música padrão...');
      setSelectedSong(ANGELS_SONG);
      
      toast({
        title: "🎵 Usando Música Padrão",
        description: "Carregando música de demonstração",
      });
    }
  }, [selectedSong, availableTracks, toast]);

  // Função para controlar play/pause do player
  const handleMusicPlayPause = useCallback((playing: boolean) => {
    console.log(`🎵 Player: ${playing ? 'Play' : 'Pause'}`);
    setIsMusicPlaying(playing);
    
    // Se estamos no jogo, sincronizar o estado do jogo
    if (gameState === 'playing' && !playing) {
      setGameState('paused');
    } else if (gameState === 'paused' && playing) {
      setGameState('playing');
    }
  }, [gameState]);

  // Gerar notas baseadas no padrão da música
  const generateNotes = useCallback((time: number) => {
    if (!selectedSong || gameState !== 'playing') return;

    // Use ANGELS_SONG pattern if it's the default song, otherwise create a simple pattern
    const pattern = 'pattern' in selectedSong ? selectedSong.pattern : [
      { time: 1000, track: 0, duration: 500 },
      { time: 2000, track: 1, duration: 500 },
      { time: 3000, track: 2, duration: 500 },
      { time: 4000, track: 3, duration: 500 },
      { time: 5000, track: 4, duration: 500 },
      { time: 6000, track: 5, duration: 500 },
    ];

    const newNotes: FallingNote[] = [];
    
    pattern.forEach(note => {
      const noteTime = note.time;
      const shouldGenerate = Math.abs(time - noteTime) < 100 && 
                           !fallingNotes.some(fn => Math.abs(fn.targetTime - noteTime) < 50);
      
      if (shouldGenerate) {
        noteIdCounter.current += 1;
        const id = `note-${noteTime}-${note.track}-${noteIdCounter.current}`;
        const trackNote = BOOMWHACKER_NOTES[note.track];
        
        newNotes.push({
          id,
          track: note.track,
          y: -NOTE_HEIGHT,
          targetTime: noteTime,
          hit: false,
          color: trackNote.color,
          startTime: Date.now()
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
      setFallingNotes(prev => 
        prev.map(note => 
          note.id === hitNote.id ? { ...note, hit: true } : note
        )
      );

      playBoomwhackerSound(trackIndex);

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

    generateNotes(elapsed);
    updateNotes(16);

    // Verificar se o jogo deve terminar baseado na duração da música
    if (selectedSong && elapsed > selectedSong.duration * 1000) {
      console.log('⏱️ Tempo do jogo esgotado');
      handleTrackEnd();
      return;
    }

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, generateNotes, updateNotes, selectedSong, handleTrackEnd]);

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

  // Efeitos
  useEffect(() => {
    initializeAudio();
    setSelectedSong(ANGELS_SONG);
    
    // Carregar músicas populares como backup
    MusicAPIManager.getPopular('demo').then(tracks => {
      setAvailableTracks(tracks);
      console.log(`🎵 Músicas de backup carregadas: ${tracks.length}`);
    });
    
    console.log('🎵 Jogo inicializado com música padrão');
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

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

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
              Minhas Músicas
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
          </div>

          {showMusicAPI ? (
            <MusicAPI 
              onTrackSelect={(track) => {
                setSelectedSong(track);
                // Carregar mais músicas da mesma fonte para ter backups
                if (track.source !== 'synthesized') {
                  MusicAPIManager.getPopular(track.source).then(tracks => {
                    setAvailableTracks(tracks);
                  });
                }
                setShowMusicAPI(false);
                toast({
                  title: "🎵 Música Selecionada!",
                  description: `${track.title} - ${track.artist}`,
                });
              }}
              selectedTrack={selectedSong as MusicTrack}
            />
          ) : (
            <>
              {/* ... keep existing code (music selection card and difficulty selector) */}

              {selectedSong && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Music className="w-5 h-5" />
                      Música Selecionada
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
                            {(selectedSong as MusicTrack).source && (
                              <Badge variant="secondary">
                                {(selectedSong as MusicTrack).source}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Badge variant="default">Pronto para jogar!</Badge>
                      </div>
                      
                      <MusicPlayer
                        track={selectedSong as MusicTrack}
                        isPlaying={false}
                        onPlayPause={() => {}}
                        onTrackFailed={handleTrackFailed}
                        onTimeUpdate={handleMusicTimeUpdate}
                        volume={musicVolume}
                        onVolumeChange={setMusicVolume}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ... keep existing code (difficulty selector, instructions, start button) */}
            </>
          )}
        </div>
      </div>
    );
  }

  // Renderizar jogo
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
          <Button
            onClick={toggleGamePause}
            className="w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-full p-0"
          >
            {gameState === 'playing' ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>
          <div>
            <h2 className="text-xl font-bold">{selectedSong?.title}</h2>
            <p className="text-gray-400">{selectedSong?.artist}</p>
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
          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
            Próxima Música
          </Button>
        </div>
      </div>

      {/* Player de música durante o jogo - melhorado */}
      {selectedSong && (gameState === 'playing' || gameState === 'paused') && (
        <div className="fixed top-20 right-4 z-40 w-80">
          <MusicPlayer
            track={selectedSong as MusicTrack}
            isPlaying={isMusicPlaying}
            onPlayPause={handleMusicPlayPause}
            onTrackEnd={handleTrackEnd}
            onTrackFailed={handleTrackFailed}
            volume={musicVolume}
            onVolumeChange={setMusicVolume}
          />
        </div>
      )}

      {/* Área do jogo */}
      <div 
        ref={gameRef}
        className="relative mx-auto" 
        style={{ width: TRACK_WIDTH * 6, height: TRACK_HEIGHT }}
      >
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
                bottom: 100,
                height: 80,
                boxShadow: '0 0 20px rgba(255,255,255,0.5)'
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

      {/* Cilindros 3D na parte inferior */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex justify-center mb-6">
        {BOOMWHACKER_NOTES.map((note, index) => (
          <div
            key={note.note}
            className="mx-2 cursor-pointer"
            style={{ perspective: '500px' }}
            onClick={() => handleTrackClick(index)}
          >
            <div
              className="relative"
              style={{
                width: '80px',
                height: '80px',
                transformStyle: 'preserve-3d',
                transform: 'rotateX(60deg)'
              }}
            >
              <div
                className="absolute w-full h-full rounded-full flex items-center justify-center text-2xl font-bold text-white"
                style={{ backgroundColor: note.color }}
              >
                {note.note}
              </div>
              <div
                className="absolute w-full rounded-full opacity-70"
                style={{
                  height: '40px',
                  backgroundColor: note.color,
                  top: '0',
                  transform: 'translateY(20px) rotateX(90deg)',
                  transformOrigin: 'top center'
                }}
              />
            </div>
          </div>
        ))}
      </div>

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
