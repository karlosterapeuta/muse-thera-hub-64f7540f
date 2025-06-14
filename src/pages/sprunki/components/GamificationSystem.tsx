
import React, { useState, useEffect } from 'react';
import { Star, Trophy, Target, Music, Zap, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  requirement: number;
  current: number;
  unlocked: boolean;
  category: 'creation' | 'exploration' | 'mastery' | 'therapeutic';
}

export interface GamificationData {
  level: number;
  xp: number;
  xpToNextLevel: number;
  achievements: Achievement[];
  streak: number;
  totalSessions: number;
  favoriteMode: string;
  creationsCount: number;
  harmoniesCreated: number;
  modesExplored: string[];
}

interface GamificationSystemProps {
  metrics: any;
  currentMode: string;
  onLevelUp?: (newLevel: number) => void;
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

const initialAchievements: Achievement[] = [
  {
    id: 'first-touch',
    name: 'Primeiro Toque',
    description: 'Crie seu primeiro som',
    icon: <Music className="w-4 h-4" />,
    requirement: 1,
    current: 0,
    unlocked: false,
    category: 'creation'
  },
  {
    id: 'explorer',
    name: 'Explorador Musical',
    description: 'Experimente todos os 4 modos',
    icon: <Target className="w-4 h-4" />,
    requirement: 4,
    current: 0,
    unlocked: false,
    category: 'exploration'
  },
  {
    id: 'composer',
    name: 'Compositor',
    description: 'Crie 50 sons',
    icon: <Star className="w-4 h-4" />,
    requirement: 50,
    current: 0,
    unlocked: false,
    category: 'creation'
  },
  {
    id: 'harmony-master',
    name: 'Mestre da Harmonia',
    description: 'Crie 10 harmonias tocando múltiplos pontos',
    icon: <Trophy className="w-4 h-4" />,
    requirement: 10,
    current: 0,
    unlocked: false,
    category: 'mastery'
  },
  {
    id: 'therapeutic-session',
    name: 'Sessão Terapêutica',
    description: 'Complete uma sessão de 5 minutos',
    icon: <Heart className="w-4 h-4" />,
    requirement: 300000, // 5 minutes in milliseconds
    current: 0,
    unlocked: false,
    category: 'therapeutic'
  },
  {
    id: 'energy-master',
    name: 'Mestre da Energia',
    description: 'Mantenha alta intensidade por 2 minutos',
    icon: <Zap className="w-4 h-4" />,
    requirement: 120000, // 2 minutes
    current: 0,
    unlocked: false,
    category: 'therapeutic'
  }
];

const GamificationSystem: React.FC<GamificationSystemProps> = ({
  metrics,
  currentMode,
  onLevelUp,
  onAchievementUnlocked
}) => {
  const [gamificationData, setGamificationData] = useState<GamificationData>(() => {
    const saved = localStorage.getItem('sensorsync-gamification');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        achievements: parsed.achievements || initialAchievements
      };
    }
    return {
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      achievements: initialAchievements,
      streak: 0,
      totalSessions: 0,
      favoriteMode: 'calm',
      creationsCount: 0,
      harmoniesCreated: 0,
      modesExplored: []
    };
  });

  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  // Calculate XP from metrics
  useEffect(() => {
    const xpGain = Math.floor(metrics.movementCount * 2);
    const sessionXP = Math.floor(metrics.sessionDuration / 10000); // 1 XP per 10 seconds
    const totalXP = xpGain + sessionXP;

    if (totalXP > gamificationData.xp) {
      const newXP = totalXP;
      let newLevel = gamificationData.level;
      let xpToNext = gamificationData.xpToNextLevel;

      // Check for level up
      while (newXP >= xpToNext) {
        newLevel++;
        xpToNext = newLevel * 100; // Each level requires more XP
        if (onLevelUp) {
          onLevelUp(newLevel);
        }
      }

      setGamificationData(prev => ({
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNextLevel: xpToNext,
        creationsCount: metrics.movementCount
      }));
    }
  }, [metrics, gamificationData.xp, gamificationData.level, gamificationData.xpToNextLevel, onLevelUp]);

  // Check achievements
  useEffect(() => {
    const updatedAchievements = gamificationData.achievements.map(achievement => {
      let current = achievement.current;

      switch (achievement.id) {
        case 'first-touch':
          current = metrics.movementCount > 0 ? 1 : 0;
          break;
        case 'composer':
          current = metrics.movementCount;
          break;
        case 'therapeutic-session':
          current = metrics.sessionDuration;
          break;
        case 'explorer':
          current = gamificationData.modesExplored.length;
          break;
        case 'harmony-master':
          current = gamificationData.harmoniesCreated;
          break;
        case 'energy-master':
          if (metrics.averageIntensity > 0.7) {
            current = Math.min(current + 1000, achievement.requirement);
          }
          break;
      }

      const wasUnlocked = achievement.unlocked;
      const unlocked = current >= achievement.requirement;

      if (!wasUnlocked && unlocked) {
        setNewlyUnlocked(prev => [...prev, { ...achievement, current, unlocked }]);
        if (onAchievementUnlocked) {
          onAchievementUnlocked({ ...achievement, current, unlocked });
        }
      }

      return { ...achievement, current, unlocked };
    });

    setGamificationData(prev => ({
      ...prev,
      achievements: updatedAchievements
    }));
  }, [metrics, gamificationData.modesExplored, gamificationData.harmoniesCreated, onAchievementUnlocked]);

  // Track mode exploration
  useEffect(() => {
    if (!gamificationData.modesExplored.includes(currentMode)) {
      setGamificationData(prev => ({
        ...prev,
        modesExplored: [...prev.modesExplored, currentMode]
      }));
    }
  }, [currentMode, gamificationData.modesExplored]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('sensorsync-gamification', JSON.stringify(gamificationData));
  }, [gamificationData]);

  const progressPercentage = (gamificationData.xp / gamificationData.xpToNextLevel) * 100;
  const unlockedAchievements = gamificationData.achievements.filter(a => a.unlocked);

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Progresso Terapêutico
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Level and XP */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Nível {gamificationData.level}</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {gamificationData.xp} / {gamificationData.xpToNextLevel} XP
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Recent Achievements */}
        {unlockedAchievements.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Conquistas Desbloqueadas</h4>
            <div className="grid grid-cols-2 gap-2">
              {unlockedAchievements.slice(-4).map(achievement => (
                <Badge
                  key={achievement.id}
                  variant="secondary"
                  className="flex items-center gap-1 p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
                >
                  {achievement.icon}
                  <span className="text-xs">{achievement.name}</span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Current Challenges */}
        <div>
          <h4 className="text-sm font-medium mb-2">Desafios Ativos</h4>
          <div className="space-y-2">
            {gamificationData.achievements
              .filter(a => !a.unlocked)
              .slice(0, 3)
              .map(achievement => (
                <div key={achievement.id} className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
                  <div className="flex items-center gap-2 mb-1">
                    {achievement.icon}
                    <span className="text-xs font-medium">{achievement.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </span>
                    <span className="text-xs font-bold">
                      {achievement.current}/{achievement.requirement}
                    </span>
                  </div>
                  <Progress 
                    value={(achievement.current / achievement.requirement) * 100} 
                    className="h-1 mt-1" 
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2">
            <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
              {gamificationData.modesExplored.length}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Modos Explorados</div>
          </div>
          <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-2">
            <div className="text-lg font-bold text-green-700 dark:text-green-300">
              {Math.floor(metrics.sessionDuration / 60000)}m
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">Tempo de Sessão</div>
          </div>
        </div>
      </CardContent>

      {/* Achievement Notifications */}
      {newlyUnlocked.length > 0 && (
        <div className="fixed top-4 right-4 z-50">
          {newlyUnlocked.map(achievement => (
            <div
              key={achievement.id}
              className="bg-yellow-400 text-yellow-900 p-4 rounded-lg shadow-lg mb-2 animate-bounce"
              onClick={() => setNewlyUnlocked(prev => prev.filter(a => a.id !== achievement.id))}
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <div>
                  <div className="font-bold">Conquista Desbloqueada!</div>
                  <div className="text-sm">{achievement.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default GamificationSystem;
