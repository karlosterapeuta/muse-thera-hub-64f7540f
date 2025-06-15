
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Volume2, Guitar, Trophy } from 'lucide-react';
import { TraditionalSong } from './data/traditionalSongs';
import { useGuitarHeroGame } from './hooks/useGuitarHeroGame';
import { guitarHeroAudio } from './utils/guitarHeroAudio';
import GuitarHeroUI from './components/GuitarHeroUI';
import MusicSelector from './components/MusicSelector';

// Configuração das notas dos Boomwhackers
const BOOMWHACKER_NOTES = [
  { note: 'C', color: '#FF2D2D', name: 'Dó', frequency: 261.63, track: 0, key: 'a' },
  { note: 'D', color: '#FF8A2D', name: 'Ré', frequency: 293.66, track: 1, key: 's' },
  { note: 'E', color: '#FFD700', name: 'Mi', frequency: 329.63, track: 2, key: 'd' },
  { note: 'F', color: '#5CFF2D', name: 'Fá', frequency: 349.23, track: 3, key: 'f' },
  { note: 'G', color: '#2D8A5C', name: 'Sol', frequency: 392.00, track: 4, key: 'g' },
  { note: 'A', color: '#8A2BE2', name: 'Lá', frequency: 440.00, track: 5, key: 'h' }
];

const BoomwhackerHero: React.FC = () => {
  const { toast } = useToast();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [volume, setVolume] = useState(0.7);
  
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

  // Iniciar jogo com música selecionada
  const handleStartGame = useCallback(async (song: TraditionalSong) => {
    console.log(`🎮 Iniciando ${song.title} (${song.difficulty})`);
    
    // Parar qualquer preview que esteja tocando
    guitarHeroAudio.pause();
    
    toast({
      title: "🎵 Carregando música...",
      description: `Preparando: ${song.title}`,
    });

    const loaded = await guitarHeroAudio.loadTrack(song);
    if (!loaded) {
      toast({
        title: "⚠️ Música carregada",
        description: "Usando áudio sintético - a música ainda funcionará!",
        variant: "default"
      });
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
              <span className="text-sm w-8">{Math.round(volume * 100)}%</span>
            </div>
          </div>
        </header>

        <div className="pt-20 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">🇧🇷 GUITAR HERO BRASILEIRO</h1>
            <p className="text-xl text-purple-200">
              Toque as clássicas músicas tradicionais do Brasil com áudio real!
            </p>
            <div className="mt-4 p-3 bg-green-900 bg-opacity-50 rounded-lg">
              <p className="text-sm text-green-200">
                ✅ <strong>Músicas Tradicionais Autênticas</strong> - Patrimônio cultural brasileiro com áudio real
              </p>
            </div>
          </div>

          {/* Music Selector Component */}
          <MusicSelector 
            selectedDifficulty={selectedDifficulty}
            onSelectSong={handleStartGame}
            onDifficultyChange={setSelectedDifficulty}
          />

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
                    <li><kbd className="bg-gray-700 px-2 py-1 rounded">A</kbd> = Nota C (Dó) - Vermelho</li>
                    <li><kbd className="bg-gray-700 px-2 py-1 rounded">S</kbd> = Nota D (Ré) - Laranja</li>
                    <li><kbd className="bg-gray-700 px-2 py-1 rounded">D</kbd> = Nota E (Mi) - Amarelo</li>
                    <li><kbd className="bg-gray-700 px-2 py-1 rounded">F</kbd> = Nota F (Fá) - Verde</li>
                    <li><kbd className="bg-gray-700 px-2 py-1 rounded">G</kbd> = Nota G (Sol) - Verde Escuro</li>
                    <li><kbd className="bg-gray-700 px-2 py-1 rounded">H</kbd> = Nota A (Lá) - Roxo</li>
                    <li><kbd className="bg-gray-700 px-2 py-1 rounded">Espaço</kbd> = Pausar/Continuar</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold mb-2">🎯 Sistema de Pontuação:</h4>
                  <ul className="space-y-1 text-sm">
                    <li><span className="text-purple-400">🔥 Perfeito:</span> 300 pontos (±50ms)</li>
                    <li><span className="text-blue-400">✨ Bom:</span> 200 pontos (±100ms)</li>
                    <li><span className="text-green-400">👍 OK:</span> 100 pontos (±150ms)</li>
                    <li><span className="text-yellow-400">🔥 Combo:</span> Multiplicador a cada 10 acertos</li>
                    <li><span className="text-orange-400">🎵 Preview:</span> Clique para ouvir antes de jogar</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
