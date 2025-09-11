import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Volume2, Play, Music, Trophy, Guitar, Star, Youtube } from 'lucide-react';
import { TRADITIONAL_SONGS, TraditionalSong, getSongsByDifficulty } from './data/traditionalSongs';
import { useGuitarHeroGame } from './hooks/useGuitarHeroGame';
import { guitarHeroAudio } from './utils/guitarHeroAudio';
import GuitarHeroUI from './components/GuitarHeroUI';
import { YouTubeVideoModal } from './components/YouTubeVideoModal';
import { getYouTubeId } from '@/utils/youtubeUtils';

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
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [volume, setVolume] = useState(0.7);
  const [youtubeModalOpen, setYoutubeModalOpen] = useState(false);
  const [selectedYouTubeSong, setSelectedYouTubeSong] = useState<TraditionalSong | null>(null);
  
  const {
    gameState,
    currentSong,
    fallingNotes,
    gameStats,
    currentTime,
    isAudioPlaying,
    TRACK_HEIGHT,
    NOTE_HEIGHT,
    HIT_ZONE_Y,
    startGame,
    togglePause,
    stopGame,
    backToMenu,
    checkHit,
    updateTime
  } = useGuitarHeroGame();

  // Inicializar áudio
  useEffect(() => {
    guitarHeroAudio.initialize();
    return () => guitarHeroAudio.dispose();
  }, []);

  // Sincronizar tempo do áudio com o jogo
  useEffect(() => {
    if (gameState === 'playing' && currentSong) {
      const interval = setInterval(() => {
        const audioTime = guitarHeroAudio.getCurrentTime();
        updateTime(audioTime);
      }, 16); // ~60fps

      return () => clearInterval(interval);
    }
  }, [gameState, currentSong, updateTime]);

  // Controlar áudio conforme estado do jogo
  useEffect(() => {
    if (gameState === 'playing' && isAudioPlaying) {
      guitarHeroAudio.resume();
    } else {
      guitarHeroAudio.pause();
    }
  }, [gameState, isAudioPlaying]);

  // Atualizar volume
  useEffect(() => {
    guitarHeroAudio.setMusicVolume(volume);
  }, [volume]);

  // Iniciar jogo com música selecionada ou abrir vídeo do YouTube
  const handleStartGame = useCallback(async (song: TraditionalSong) => {
    // Se é um vídeo do YouTube, abrir modal
    if (song.youtubeId) {
      setSelectedYouTubeSong(song);
      setYoutubeModalOpen(true);
      
      toast({
        title: "🎵 Vídeo MuseTera",
        description: `Abrindo: ${song.title}`,
      });
      return;
    }

    console.log(`🎮 Iniciando ${song.title} (${song.difficulty})`);
    
    const loaded = await guitarHeroAudio.loadTrack(song);
    if (!loaded) {
      toast({
        title: "❌ Erro",
        description: "Não foi possível carregar a música. Tentando novamente...",
        variant: "destructive"
      });
      return;
    }

    startGame(song);
    guitarHeroAudio.play();
    
    toast({
      title: "🎵 Jogo Iniciado!",
      description: `Tocando: ${song.title} - ${song.artist}`,
    });
  }, [startGame, toast]);

  // Controlar clique nas trilhas
  const handleTrackClick = useCallback(async (trackIndex: number) => {
    if (gameState === 'playing') {
      const result = checkHit(trackIndex);
      
      if (result && result.type !== 'miss') {
        await guitarHeroAudio.playHitEffect(trackIndex, result.type);
        
        // Mostrar feedback visual
        const messages = {
          perfect: '🔥 PERFEITO!',
          good: '✨ BOM!',
          ok: '👍 OK!'
        };
        
        toast({
          title: messages[result.type],
          description: `+${result.points} pontos`,
          duration: 1000
        });
      } else {
        await guitarHeroAudio.playMissEffect();
      }
    }
  }, [gameState, checkHit, toast]);

  // Controlar teclas do teclado
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const keyMap: Record<string, number> = {
        'a': 0, 's': 1, 'd': 2, 'f': 3, 'g': 4, 'h': 5
      };
      
      const trackIndex = keyMap[event.key.toLowerCase()];
      if (trackIndex !== undefined) {
        handleTrackClick(trackIndex);
      }
      
      // Controles do jogo
      if (event.key === ' ') { // Espaço para pausar
        event.preventDefault();
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleTrackClick, togglePause]);

  // Renderizar menu de seleção
  if (gameState === 'menu') {
    const songsToShow = getSongsByDifficulty(selectedDifficulty);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-orange-500" style={{ fontFamily: 'Pacifico, cursive' }}>
              🎵 Boomwhacker Hero
            </h1>
            <Badge className="ml-4 bg-green-600">Músicas Tradicionais Brasileiras</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-20"
              />
            </div>
          </div>
        </header>

        <div className="pt-20 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">🇧🇷 GUITAR HERO BRASILEIRO</h1>
            <p className="text-xl text-purple-200">
              Toque as clássicas músicas tradicionais do Brasil!
            </p>
            <div className="mt-4 p-3 bg-green-900 bg-opacity-50 rounded-lg">
              <p className="text-sm text-green-200">
                ✅ <strong>Músicas Tradicionais Autênticas</strong> - Patrimônio cultural brasileiro
              </p>
            </div>
          </div>

          {/* Seletor de dificuldade */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Escolha a Dificuldade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 justify-center">
                {['easy', 'medium', 'hard'].map((diff) => (
                  <Button
                    key={diff}
                    variant={selectedDifficulty === diff ? 'default' : 'outline'}
                    onClick={() => setSelectedDifficulty(diff as any)}
                    className={`px-6 py-3 ${
                      diff === 'easy' ? 'text-green-600 border-green-600' :
                      diff === 'medium' ? 'text-yellow-600 border-yellow-600' :
                      'text-red-600 border-red-600'
                    }`}
                  >
                    {diff === 'easy' ? '🟢 Fácil' : 
                     diff === 'medium' ? '🟡 Médio' : '🔴 Difícil'}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lista de músicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Músicas Tradicionais - {selectedDifficulty === 'easy' ? 'Fácil' : selectedDifficulty === 'medium' ? 'Médio' : 'Difícil'}
                </span>
                <Badge variant="secondary">{songsToShow.length} músicas</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {songsToShow.map((song) => (
                  <Card 
                    key={song.id} 
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      song.isMuseteraCreated 
                        ? 'bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-violet-200 dark:border-violet-700 hover:from-violet-100 hover:to-purple-100 dark:hover:from-violet-900/30 dark:hover:to-purple-900/30'
                        : 'hover:bg-blue-50 dark:hover:bg-blue-900'
                    }`}
                    onClick={() => handleStartGame(song)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{song.title}</h3>
                          {song.youtubeId && (
                            <Youtube className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex gap-1">
                          {song.isMuseteraCreated && (
                            <Badge className="bg-violet-500 text-white text-xs">
                              🎵 MuseTera
                            </Badge>
                          )}
                          <Badge className={`${
                            song.difficulty === 'easy' ? 'bg-green-600' : 
                            song.difficulty === 'medium' ? 'bg-yellow-600' : 'bg-red-600'
                          }`}>
                            {song.difficulty === 'easy' ? 'Fácil' : 
                             song.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        {song.artist}
                        {song.isMuseteraCreated && (
                          <span className="text-violet-600 dark:text-violet-400 text-xs block">
                            Conteúdo Educacional Original
                          </span>
                        )}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <span>⏱️ {song.youtubeId ? `${Math.floor(song.duration / 60)}min` : `${song.duration}s`}</span>
                        <span>🎵 {song.bpm} BPM</span>
                        <span>🎼 {song.pattern.length} notas</span>
                      </div>
                      
                      <Button 
                        className={`w-full ${
                          song.youtubeId 
                            ? 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700' 
                            : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartGame(song);
                        }}
                      >
                        {song.youtubeId ? (
                          <>
                            <Youtube className="w-4 h-4 mr-2" />
                            Assistir Vídeo MuseTera
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Jogar Agora
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {songsToShow.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma música encontrada para esta dificuldade</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instruções */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Guitar className="w-5 h-5" />
                Como Jogar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-2">🎮 Controles:</h4>
                  <ul className="space-y-1 text-sm">
                    <li><kbd className="bg-gray-700 px-2 py-1 rounded">A</kbd> = Nota C (Dó)</li>
                    <li><kbd className="bg-gray-700 px-2 py-1 rounded">S</kbd> = Nota D (Ré)</li>
                    <li><kbd className="bg-gray-700 px-2 py-1 rounded">D</kbd> = Nota E (Mi)</li>
                    <li><kbd className="bg-gray-700 px-2 py-1 rounded">F</kbd> = Nota F (Fá)</li>
                    <li><kbd className="bg-gray-700 px-2 py-1 rounded">G</kbd> = Nota G (Sol)</li>
                    <li><kbd className="bg-gray-700 px-2 py-1 rounded">H</kbd> = Nota A (Lá)</li>
                    <li><kbd className="bg-gray-700 px-2 py-1 rounded">Espaço</kbd> = Pausar/Continuar</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold mb-2">🎯 Sistema de Pontuação:</h4>
                  <ul className="space-y-1 text-sm">
                    <li><span className="text-purple-400">🔥 Perfeito:</span> 300 pontos</li>
                    <li><span className="text-blue-400">✨ Bom:</span> 200 pontos</li>
                    <li><span className="text-green-400">👍 OK:</span> 100 pontos</li>
                    <li><span className="text-yellow-400">🔥 Combo:</span> Multiplicador a cada 10 acertos</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* YouTube Video Modal */}
        {selectedYouTubeSong && (
          <YouTubeVideoModal
            isOpen={youtubeModalOpen}
            onClose={() => {
              setYoutubeModalOpen(false);
              setSelectedYouTubeSong(null);
            }}
            youtubeId={selectedYouTubeSong.youtubeId!}
            title={selectedYouTubeSong.title}
            customTitle={selectedYouTubeSong.youtubeTitle}
          />
        )}
      </div>
    );
  }

  // Renderizar tela de fim de jogo
  if (gameState === 'ended') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white flex items-center justify-center">
        <Card className="w-96 bg-black bg-opacity-80 border-2 border-yellow-500">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              🏆 Parabéns!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl font-bold text-yellow-400">
              {gameStats.score.toLocaleString()}
            </div>
            <p className="text-gray-300">Pontuação Final</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-800 p-3 rounded">
                <div className="font-bold text-blue-400">{gameStats.hits}</div>
                <div>Acertos</div>
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <div className="font-bold text-red-400">{gameStats.misses}</div>
                <div>Erros</div>
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <div className="font-bold text-purple-400">{gameStats.maxCombo}x</div>
                <div>Combo Máximo</div>
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <div className="font-bold text-green-400">{gameStats.accuracy.toFixed(1)}%</div>
                <div>Precisão</div>
              </div>
            </div>
            
            {currentSong && (
              <div className="bg-blue-900 bg-opacity-50 p-3 rounded">
                <p className="font-bold">{currentSong.title}</p>
                <p className="text-sm text-gray-300">{currentSong.artist}</p>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button onClick={backToMenu} className="flex-1">
                Menu Principal
              </Button>
              <Button 
                onClick={() => currentSong && handleStartGame(currentSong)} 
                variant="outline" 
                className="flex-1"
              >
                Jogar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Renderizar jogo em execução
  return (
    <GuitarHeroUI
      gameState={gameState}
      currentSong={currentSong}
      gameStats={gameStats}
      fallingNotes={fallingNotes}
      currentTime={currentTime}
      TRACK_HEIGHT={TRACK_HEIGHT}
      NOTE_HEIGHT={NOTE_HEIGHT}
      HIT_ZONE_Y={HIT_ZONE_Y}
      onTrackClick={handleTrackClick}
      onTogglePause={togglePause}
      onStop={stopGame}
      onBackToMenu={backToMenu}
    />
  );
};

export default BoomwhackerHero;
