
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Music, Zap, Heart } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

interface GamificationSystemProps {
  metrics: {
    movementCount: number;
    sessionDuration: number;
    modeChanges: number;
    harmoniesCreated?: number;
  };
  currentMode: string;
  onLevelUp: (level: number) => void;
  onAchievementUnlocked: (achievement: Achievement) => void;
}

const GamificationSystem: React.FC<GamificationSystemProps> = ({
  metrics,
  currentMode,
  onLevelUp,
  onAchievementUnlocked
}) => {
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-touch',
      name: 'Primeiro Toque',
      description: 'Crie sua primeira nota musical',
      icon: <Music className="w-4 h-4" />,
      unlocked: false,
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'explorer',
      name: 'Explorador Musical',
      description: 'Teste todos os modos do jogo',
      icon: <Target className="w-4 h-4" />,
      unlocked: false,
      progress: 0,
      maxProgress: 5
    },
    {
      id: 'composer',
      name: 'Compositor',
      description: 'Crie 100 notas musicais',
      icon: <Star className="w-4 h-4" />,
      unlocked: false,
      progress: 0,
      maxProgress: 100
    },
    {
      id: 'harmony-master',
      name: 'Mestre da Harmonia',
      description: 'Crie 10 harmonias',
      icon: <Zap className="w-4 h-4" />,
      unlocked: false,
      progress: 0,
      maxProgress: 10
    },
    {
      id: 'dedicated',
      name: 'Dedicado',
      description: 'Toque por 10 minutos',
      icon: <Heart className="w-4 h-4" />,
      unlocked: false,
      progress: 0,
      maxProgress: 600000 // 10 minutes in milliseconds
    }
  ]);

  // Calculate experience and level based on metrics
  useEffect(() => {
    const newExperience = 
      metrics.movementCount * 2 + 
      Math.floor(metrics.sessionDuration / 1000) + 
      metrics.modeChanges * 10 +
      (metrics.harmoniesCreated || 0) * 25;

    const newLevel = Math.floor(newExperience / 100) + 1;

    if (newLevel > level) {
      setLevel(newLevel);
      onLevelUp(newLevel);
    }

    setExperience(newExperience);
  }, [metrics, level, onLevelUp]);

  // Update achievements
  useEffect(() => {
    setAchievements(prev => prev.map(achievement => {
      let newProgress = achievement.progress;
      let unlocked = achievement.unlocked;

      switch (achievement.id) {
        case 'first-touch':
          newProgress = Math.min(metrics.movementCount, achievement.maxProgress);
          break;
        case 'explorer':
          newProgress = Math.min(metrics.modeChanges, achievement.maxProgress);
          break;
        case 'composer':
          newProgress = Math.min(metrics.movementCount, achievement.maxProgress);
          break;
        case 'harmony-master':
          newProgress = Math.min(metrics.harmoniesCreated || 0, achievement.maxProgress);
          break;
        case 'dedicated':
          newProgress = Math.min(metrics.sessionDuration, achievement.maxProgress);
          break;
      }

      if (newProgress >= achievement.maxProgress && !unlocked) {
        unlocked = true;
        onAchievementUnlocked(achievement);
      }

      return {
        ...achievement,
        progress: newProgress,
        unlocked
      };
    }));
  }, [metrics, onAchievementUnlocked]);

  const experienceToNextLevel = ((level * 100) - experience);
  const currentLevelProgress = (experience % 100);

  return (
    <div className="space-y-4">
      {/* Level Progress */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
            <Trophy className="w-5 h-5" />
            Nível {level}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-yellow-600 dark:text-yellow-400">Experiência</span>
              <span className="text-yellow-600 dark:text-yellow-400">{experience} XP</span>
            </div>
            <Progress value={currentLevelProgress} className="h-2" />
            <div className="text-xs text-yellow-500 dark:text-yellow-500 text-center">
              {experienceToNextLevel} XP para próximo nível
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <Star className="w-5 h-5" />
            Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`
                  p-3 rounded-lg transition-all duration-300
                  ${achievement.unlocked 
                    ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                    : 'bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    p-2 rounded-full 
                    ${achievement.unlocked 
                      ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300' 
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                    }
                  `}>
                    {achievement.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`
                        font-medium text-sm
                        ${achievement.unlocked 
                          ? 'text-green-700 dark:text-green-300' 
                          : 'text-gray-600 dark:text-gray-400'
                        }
                      `}>
                        {achievement.name}
                      </span>
                      {achievement.unlocked && (
                        <Badge variant="default" className="bg-green-500 text-white text-xs">
                          Desbloqueado!
                        </Badge>
                      )}
                    </div>
                    
                    <p className={`
                      text-xs mb-2
                      ${achievement.unlocked 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-gray-500 dark:text-gray-500'
                      }
                    `}>
                      {achievement.description}
                    </p>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">
                          Progresso
                        </span>
                        <span className="text-gray-500">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="h-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300 text-base">
            <Target className="w-4 h-4" />
            Estatísticas da Sessão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="font-bold text-purple-600 dark:text-purple-400">
                {metrics.movementCount}
              </div>
              <div className="text-xs text-purple-500 dark:text-purple-500">
                Notas Criadas
              </div>
            </div>
            
            <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="font-bold text-purple-600 dark:text-purple-400">
                {Math.floor(metrics.sessionDuration / 1000)}s
              </div>
              <div className="text-xs text-purple-500 dark:text-purple-500">
                Tempo Ativo
              </div>
            </div>
            
            <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="font-bold text-purple-600 dark:text-purple-400">
                {metrics.modeChanges}
              </div>
              <div className="text-xs text-purple-500 dark:text-purple-500">
                Modos Testados
              </div>
            </div>
            
            <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="font-bold text-purple-600 dark:text-purple-400">
                {metrics.harmoniesCreated || 0}
              </div>
              <div className="text-xs text-purple-500 dark:text-purple-500">
                Harmonias
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationSystem;
