
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ChallengeGameState, ChallengeSettings } from '../types/challenge';
import { sprunkiCharacters } from '../data/sprunkiCharacters';
import { sprunkiAudio } from '../utils/sprunkiAudioService';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Play, Pause, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';

interface SprunkiChallengeGameProps {
  onBackToMenu: () => void;
  settings: ChallengeSettings;
  onSettingsChange: (settings: Partial<ChallengeSettings>) => void;
}

const SprunkiChallengeGame: React.FC<SprunkiChallengeGameProps> = ({
  onBackToMenu,
  settings,
  onSettingsChange
}) => {
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sequenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [gameState, setGameState] = useState<ChallengeGameState>({
    currentLevel: 1,
    score: 0,
    lives: 3,
    isPlaying: false,
    isShowingSequence: false,
    isPlayerTurn: false,
    playerSequence: [],
    currentSequence: [],
    timeRemaining: 10,
    attempts: 0,
    gameStatus: 'waiting'
  });

  const generateSequence = useCallback((level: number): string[] => {
    const sequenceLength = Math.min(2 + Math.floor(level / 2), 8);
    const sequence: string[] = [];
    
    for (let i = 0; i < sequenceLength; i++) {
      const randomCharacter = sprunkiCharacters[Math.floor(Math.random() * sprunkiCharacters.length)];
      sequence.push(randomCharacter.id);
    }
    
    return sequence;
  }, []);

  const startLevel = useCallback(async () => {
    const newSequence = generateSequence(gameState.currentLevel);
    const timeLimit = Math.max(10 - Math.floor(gameState.currentLevel / 3), 5);
    
    setGameState(prev => ({
      ...prev,
      currentSequence: newSequence,
      playerSequence: [],
      timeRemaining: timeLimit,
      attempts: 0,
      gameStatus: 'playing',
      isShowingSequence: true,
      isPlayerTurn: false
    }));

    // Show sequence
    await showSequence(newSequence);
  }, [gameState.currentLevel]);

  const showSequence = async (sequence: string[]) => {
    const speed = settings.speed === 'slow' ? 1000 : settings.speed === 'fast' ? 500 : 750;
    
    for (let i = 0; i < sequence.length; i++) {
      const characterId = sequence[i];
      const character = sprunkiCharacters.find(c => c.id === characterId);
      
      if (character && !settings.visualFeedbackOnly) {
        sprunkiAudio.playCharacterSound(`sequence-${i}`, character.frequency, character.type);
      }
      
      // Visual feedback could be added here
      await new Promise(resolve => setTimeout(resolve, speed));
      
      if (character && !settings.visualFeedbackOnly) {
        sprunkiAudio.stopCharacterSound(`sequence-${i}`);
      }
      
      if (i < sequence.length - 1) {
        await new Promise(resolve => setTimeout(resolve, speed * 0.3));
      }
    }
    
    // Start player turn
    setGameState(prev => ({
      ...prev,
      isShowingSequence: false,
      isPlayerTurn: true
    }));
    
    startTimer();
  };

  const startTimer = () => {
    if (timeoutRef.current) clearInterval(timeoutRef.current);
    
    timeoutRef.current = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining <= 1) {
          handleTimeUp();
          return prev;
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);
  };

  const handleCharacterClick = async (characterId: string) => {
    if (!gameState.isPlayerTurn || gameState.gameStatus !== 'playing') return;
    
    const character = sprunkiCharacters.find(c => c.id === characterId);
    if (character && !settings.visualFeedbackOnly) {
      sprunkiAudio.playCharacterSound(`player-${characterId}`, character.frequency, character.type);
      setTimeout(() => sprunkiAudio.stopCharacterSound(`player-${characterId}`), 300);
    }
    
    const newPlayerSequence = [...gameState.playerSequence, characterId];
    const expectedCharacter = gameState.currentSequence[newPlayerSequence.length - 1];
    
    setGameState(prev => ({ ...prev, playerSequence: newPlayerSequence }));
    
    if (characterId !== expectedCharacter) {
      // Wrong character
      handleWrongAnswer();
      return;
    }
    
    if (newPlayerSequence.length === gameState.currentSequence.length) {
      // Sequence completed correctly
      handleCorrectSequence();
    }
  };

  const handleCorrectSequence = () => {
    if (timeoutRef.current) clearInterval(timeoutRef.current);
    
    const timeBonus = gameState.timeRemaining * 10;
    const levelScore = 100 + timeBonus;
    
    setGameState(prev => ({
      ...prev,
      score: prev.score + levelScore,
      currentLevel: prev.currentLevel + 1,
      gameStatus: 'success',
      isPlayerTurn: false
    }));
    
    toast({
      title: "🎉 Perfeito!",
      description: `Nível ${gameState.currentLevel} completo! +${levelScore} pontos`,
    });
    
    setTimeout(() => {
      if (settings.pauseBetweenChallenges) {
        setGameState(prev => ({ ...prev, gameStatus: 'waiting' }));
      } else {
        startLevel();
      }
    }, 2000);
  };

  const handleWrongAnswer = () => {
    const newAttempts = gameState.attempts + 1;
    
    if (newAttempts >= 3) {
      handleLifeLost();
    } else {
      setGameState(prev => ({
        ...prev,
        attempts: newAttempts,
        playerSequence: []
      }));
      
      toast({
        title: "❌ Ops!",
        description: `Tente novamente! (${3 - newAttempts} tentativas restantes)`,
        variant: "destructive"
      });
    }
  };

  const handleLifeLost = () => {
    if (timeoutRef.current) clearInterval(timeoutRef.current);
    
    const newLives = gameState.lives - 1;
    
    if (newLives <= 0) {
      handleGameOver();
    } else {
      setGameState(prev => ({
        ...prev,
        lives: newLives,
        gameStatus: 'failed',
        isPlayerTurn: false
      }));
      
      toast({
        title: "💔 Vida perdida!",
        description: `${newLives} vidas restantes. Tente novamente!`,
        variant: "destructive"
      });
      
      setTimeout(() => {
        setGameState(prev => ({ ...prev, gameStatus: 'waiting' }));
      }, 2000);
    }
  };

  const handleTimeUp = () => {
    if (timeoutRef.current) clearInterval(timeoutRef.current);
    handleLifeLost();
  };

  const handleGameOver = () => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'gameOver',
      isPlayerTurn: false
    }));
    
    toast({
      title: "🎮 Fim de Jogo!",
      description: `Pontuação final: ${gameState.score} pontos`,
    });
  };

  const restartGame = () => {
    if (timeoutRef.current) clearInterval(timeoutRef.current);
    if (sequenceTimeoutRef.current) clearTimeout(sequenceTimeoutRef.current);
    
    setGameState({
      currentLevel: 1,
      score: 0,
      lives: 3,
      isPlaying: false,
      isShowingSequence: false,
      isPlayerTurn: false,
      playerSequence: [],
      currentSequence: [],
      timeRemaining: 10,
      attempts: 0,
      gameStatus: 'waiting'
    });
  };

  const repeatSequence = async () => {
    if (!settings.allowRepeat || gameState.isShowingSequence) return;
    
    setGameState(prev => ({
      ...prev,
      isShowingSequence: true,
      isPlayerTurn: false,
      playerSequence: []
    }));
    
    await showSequence(gameState.currentSequence);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
      if (sequenceTimeoutRef.current) clearTimeout(sequenceTimeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 text-white p-4 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBackToMenu}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <Home className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">🎯 Modo Desafio</h1>
              <p className="text-sm opacity-90">Nível {gameState.currentLevel}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-right">
            <div>
              <div className="text-sm opacity-90">Pontos</div>
              <div className="text-lg font-bold">{gameState.score}</div>
            </div>
            <div>
              <div className="text-sm opacity-90">Vidas</div>
              <div className="text-lg">{'❤️'.repeat(gameState.lives)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="flex-1 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Timer */}
          {gameState.isPlayerTurn && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Tempo Restante</span>
                <span className="text-lg font-bold text-red-600">{gameState.timeRemaining}s</span>
              </div>
              <Progress 
                value={(gameState.timeRemaining / 10) * 100} 
                className="h-3"
              />
            </div>
          )}

          {/* Game Status */}
          <div className="text-center mb-8">
            {gameState.gameStatus === 'waiting' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">🎵 Pronto para o nível {gameState.currentLevel}?</h2>
                <Button onClick={startLevel} className="bg-green-500 hover:bg-green-600 text-white px-8 py-3">
                  <Play className="w-5 h-5 mr-2" />
                  Começar Nível
                </Button>
              </div>
            )}
            
            {gameState.isShowingSequence && (
              <div>
                <h2 className="text-2xl font-bold mb-4">👀 Observe a sequência!</h2>
                <div className="text-lg">Memorize os bonequinhos que tocam...</div>
              </div>
            )}
            
            {gameState.isPlayerTurn && (
              <div>
                <h2 className="text-2xl font-bold mb-4">🎯 Sua vez!</h2>
                <div className="text-lg mb-4">
                  Clique nos bonequinhos na ordem correta ({gameState.playerSequence.length}/{gameState.currentSequence.length})
                </div>
                {settings.allowRepeat && (
                  <Button 
                    onClick={repeatSequence}
                    variant="outline"
                    className="mb-4"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Repetir Sequência
                  </Button>
                )}
              </div>
            )}
            
            {gameState.gameStatus === 'gameOver' && (
              <div>
                <h2 className="text-3xl font-bold mb-4">🎮 Fim de Jogo!</h2>
                <p className="text-xl mb-4">Pontuação final: {gameState.score}</p>
                <p className="text-lg mb-6">Nível alcançado: {gameState.currentLevel - 1}</p>
                <Button onClick={restartGame} className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3">
                  Jogar Novamente
                </Button>
              </div>
            )}
          </div>

          {/* Characters Grid */}
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            {sprunkiCharacters.map((character) => (
              <button
                key={character.id}
                onClick={() => handleCharacterClick(character.id)}
                disabled={!gameState.isPlayerTurn}
                className={`
                  aspect-square rounded-2xl border-4 transition-all duration-200 flex items-center justify-center text-4xl sm:text-6xl
                  ${gameState.isPlayerTurn ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed opacity-60'}
                  ${gameState.playerSequence.includes(character.id) ? 'ring-4 ring-yellow-400' : ''}
                  hover:shadow-xl active:scale-95
                `}
                style={{
                  backgroundColor: `${character.color}20`,
                  borderColor: character.color
                }}
              >
                {character.emoji}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={() => onSettingsChange({ visualFeedbackOnly: !settings.visualFeedbackOnly })}
              variant="outline"
              size="icon"
            >
              {settings.visualFeedbackOnly ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            
            {gameState.gameStatus === 'waiting' && gameState.currentLevel > 1 && (
              <Button onClick={restartGame} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reiniciar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprunkiChallengeGame;
