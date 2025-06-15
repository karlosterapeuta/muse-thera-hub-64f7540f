
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Home, Volume2 } from 'lucide-react';
import { GameStats, FallingNote } from '../hooks/useGuitarHeroGame';
import { TraditionalSong } from '../data/traditionalSongs';

interface GuitarHeroUIProps {
  gameState: 'menu' | 'playing' | 'paused' | 'ended';
  currentSong: TraditionalSong | null;
  gameStats: GameStats;
  fallingNotes: FallingNote[];
  currentTime: number;
  TRACK_HEIGHT: number;
  NOTE_HEIGHT: number;
  HIT_ZONE_Y: number;
  onTrackClick: (trackIndex: number) => void;
  onTogglePause: () => void;
  onStop: () => void;
  onBackToMenu: () => void;
}

const GuitarHeroUI: React.FC<GuitarHeroUIProps> = ({
  gameState,
  currentSong,
  gameStats,
  fallingNotes,
  currentTime,
  TRACK_HEIGHT,
  NOTE_HEIGHT,
  HIT_ZONE_Y,
  onTrackClick,
  onTogglePause,
  onStop,
  onBackToMenu
}) => {
  const TRACK_WIDTH = 100;
  const trackColors = [
    '#FF2D2D', // C - Vermelho
    '#FF8A2D', // D - Laranja  
    '#FFD700', // E - Amarelo
    '#5CFF2D', // F - Verde
    '#2D8A5C', // G - Verde escuro
    '#8A2BE2'  // A - Roxo
  ];

  const trackNames = ['C', 'D', 'E', 'F', 'G', 'A'];
  const trackKeys = ['A', 'S', 'D', 'F', 'G', 'H'];

  const getComboColor = (combo: number) => {
    if (combo >= 50) return 'text-purple-400';
    if (combo >= 30) return 'text-blue-400';
    if (combo >= 20) return 'text-green-400';
    if (combo >= 10) return 'text-yellow-400';
    return 'text-white';
  };

  const getStreakMultiplier = (streak: number) => {
    return Math.floor(streak / 10) + 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black text-white overflow-hidden">
      {/* Header do jogo */}
      <div className="flex justify-between items-center p-4 bg-black bg-opacity-80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={onBackToMenu}
            className="text-white border-white hover:bg-white hover:text-black"
          >
            <Home className="w-4 h-4 mr-2" />
            Menu
          </Button>
          
          <div className="flex gap-2">
            <Button
              onClick={onTogglePause}
              className="w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-full p-0"
            >
              {gameState === 'playing' ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            
            <Button
              onClick={onStop}
              className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full p-0"
            >
              <Square className="w-6 h-6" />
            </Button>
          </div>
          
          {currentSong && (
            <div>
              <h2 className="text-xl font-bold">{currentSong.title}</h2>
              <p className="text-gray-400">{currentSong.artist}</p>
              <Badge className={`${
                currentSong.difficulty === 'easy' ? 'bg-green-600' : 
                currentSong.difficulty === 'medium' ? 'bg-yellow-600' : 'bg-red-600'
              }`}>
                {currentSong.difficulty === 'easy' ? 'Fácil' : 
                 currentSong.difficulty === 'medium' ? 'Médio' : 'Difícil'}
              </Badge>
            </div>
          )}
        </div>

        {/* Estatísticas em tempo real */}
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">
              {gameStats.score.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Pontuação</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${getComboColor(gameStats.combo)}`}>
              {gameStats.combo}x
            </div>
            <div className="text-sm text-gray-400">Combo</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-bold text-blue-400">
              {gameStats.streak}
            </div>
            <div className="text-sm text-gray-400">
              Sequência ({getStreakMultiplier(gameStats.streak)}x)
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">
              {gameStats.accuracy.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400">Precisão</div>
          </div>
        </div>
      </div>

      {/* Área principal do jogo Guitar Hero */}
      <div className="relative flex-1 flex justify-center items-center">
        <div 
          className="relative bg-black bg-opacity-40 rounded-lg overflow-hidden border-2 border-gray-600"
          style={{ width: TRACK_WIDTH * 6, height: TRACK_HEIGHT }}
        >
          {/* Trilhas de fundo */}
          {trackColors.map((color, index) => (
            <div
              key={index}
              className="absolute border-r border-gray-600 cursor-pointer transition-all duration-100 hover:bg-opacity-30"
              style={{
                left: index * TRACK_WIDTH,
                width: TRACK_WIDTH,
                height: TRACK_HEIGHT,
                backgroundColor: `${color}15`
              }}
              onClick={() => onTrackClick(index)}
            >
              {/* Nome da nota no topo */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white font-bold text-lg">
                {trackNames[index]}
              </div>
              
              {/* Tecla correspondente */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm">
                {trackKeys[index]}
              </div>

              {/* Linha de referência no meio */}
              <div 
                className="absolute w-full border-t border-gray-500 opacity-30"
                style={{ top: TRACK_HEIGHT / 2 }}
              />
            </div>
          ))}

          {/* Hit Zone (zona de acerto) */}
          <div
            className="absolute w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 border-t-2 border-b-2 border-white"
            style={{
              top: HIT_ZONE_Y,
              height: 80
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-30" />
            {/* Indicadores de hit zone por trilha */}
            {trackColors.map((color, index) => (
              <div
                key={index}
                className="absolute border-2 border-white rounded-lg bg-black bg-opacity-60"
                style={{
                  left: index * TRACK_WIDTH + 10,
                  width: TRACK_WIDTH - 20,
                  height: 60,
                  top: 10,
                  borderColor: color
                }}
              >
                <div className="flex items-center justify-center h-full">
                  <span className="text-white font-bold text-lg">{trackNames[index]}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Notas caindo */}
          {fallingNotes.map((note) => (
            <div
              key={note.id}
              className="absolute rounded-lg border-2 border-white transition-all duration-100"
              style={{
                left: note.track * TRACK_WIDTH + 10,
                top: note.y,
                width: TRACK_WIDTH - 20,
                height: NOTE_HEIGHT,
                backgroundColor: note.color,
                boxShadow: `0 0 20px ${note.color}`,
                opacity: note.hit ? 0.3 : 0.9,
                transform: note.hit ? 'scale(1.3)' : 'scale(1)',
                zIndex: note.hit ? 10 : 5
              }}
            >
              {/* Efeito de brilho na nota */}
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)`,
                  animation: note.hit ? 'none' : 'shimmer 2s infinite'
                }}
              />
              
              {/* Intensidade visual */}
              <div
                className="absolute inset-1 rounded-md bg-white"
                style={{
                  opacity: note.intensity * 0.3
                }}
              />
            </div>
          ))}

          {/* Efeitos visuais de combo */}
          {gameStats.combo > 10 && (
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-10"
                style={{
                  animation: `pulse ${Math.max(0.5, 2 - gameStats.combo / 50)}s infinite`
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Barra de progresso da música */}
      {currentSong && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black bg-opacity-60 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">
                {Math.floor(currentTime / 1000 / 60)}:{(Math.floor(currentTime / 1000) % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-sm text-gray-300">
                {Math.floor(currentSong.duration / 60)}:{(currentSong.duration % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <Progress 
              value={currentSong ? (currentTime / (currentSong.duration * 1000)) * 100 : 0} 
              className="w-full h-3 bg-gray-700"
            />
          </div>
        </div>
      )}

      {/* Instruções de controle */}
      <div className="absolute top-20 right-4 bg-black bg-opacity-60 p-4 rounded-lg">
        <h3 className="text-sm font-bold mb-2">Controles:</h3>
        <div className="text-xs space-y-1">
          {trackKeys.map((key, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-6 h-6 bg-gray-700 rounded text-center text-white font-bold text-xs flex items-center justify-center">
                {key}
              </span>
              <span style={{ color: trackColors[index] }}>
                Nota {trackNames[index]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pausado overlay */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-96">
            <CardContent className="text-center p-8">
              <h2 className="text-2xl font-bold mb-4">⏸️ Jogo Pausado</h2>
              <p className="text-gray-600 mb-6">Pressione Play para continuar</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={onTogglePause} className="bg-green-500 hover:bg-green-600">
                  <Play className="w-4 h-4 mr-2" />
                  Continuar
                </Button>
                <Button onClick={onBackToMenu} variant="outline">
                  <Home className="w-4 h-4 mr-2" />
                  Menu Principal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GuitarHeroUI;
