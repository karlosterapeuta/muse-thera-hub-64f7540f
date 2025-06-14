
import React, { useState } from "react";
import SprunkiGame from "./components/SprunkiGame";
import SprunkiChallengeGame from "./components/SprunkiChallengeGame";
import SprunkiGameMode from "./components/SprunkiGameMode";
import { ChallengeSettings } from "./types/challenge";

type GameMode = 'menu' | 'creative' | 'challenge';

const Sprunki: React.FC = () => {
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [challengeSettings, setChallengeSettings] = useState<ChallengeSettings>({
    speed: 'normal',
    allowRepeat: true,
    sensoryMode: false,
    visualFeedbackOnly: false,
    pauseBetweenChallenges: true
  });

  const handleSelectMode = (mode: 'creative' | 'challenge') => {
    setGameMode(mode);
  };

  const handleBackToMenu = () => {
    setGameMode('menu');
  };

  const handleSettings = () => {
    // TODO: Implementar modal de configurações
    console.log('Abrir configurações');
  };

  const updateChallengeSettings = (newSettings: Partial<ChallengeSettings>) => {
    setChallengeSettings(prev => ({ ...prev, ...newSettings }));
  };

  if (gameMode === 'menu') {
    return (
      <SprunkiGameMode
        onSelectMode={handleSelectMode}
        onSettings={handleSettings}
      />
    );
  }

  if (gameMode === 'creative') {
    return <SprunkiGame />;
  }

  if (gameMode === 'challenge') {
    return (
      <SprunkiChallengeGame
        onBackToMenu={handleBackToMenu}
        settings={challengeSettings}
        onSettingsChange={updateChallengeSettings}
      />
    );
  }

  return null;
};

export default Sprunki;
