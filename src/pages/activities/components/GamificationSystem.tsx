import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Trophy, 
  Star, 
  Target, 
  Flame,
  Award,
  Crown,
  Zap,
  Heart,
  BookOpen,
  Users,
  Calendar,
  TrendingUp,
  Sparkles,
  Medal,
  Gift
} from 'lucide-react';
import { Activity } from '../types';

interface UserActivityData {
  favorites: string[];
  completed: Array<{ activityId: string; completedAt: string; duration: number }>;
  recentlyViewed: string[];
  ratings: Array<{ activityId: string; rating: number }>;
}

interface GamificationSystemProps {
  userActivityData: UserActivityData;
  allActivities: Activity[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  requirement: number;
  currentProgress: number;
  unlocked: boolean;
  category: 'exploration' | 'mastery' | 'social' | 'consistency' | 'special';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: React.ReactNode;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const GamificationSystem: React.FC<GamificationSystemProps> = ({
  userActivityData,
  allActivities
}) => {
  const [selectedBadgeCategory, setSelectedBadgeCategory] = useState<string>('all');
  const [showAchievements, setShowAchievements] = useState(false);

  // Calculate user statistics
  const userStats = useMemo(() => {
    const completedActivities = userActivityData.completed;
    const favoriteActivities = userActivityData.favorites;
    const viewedActivities = userActivityData.recentlyViewed;
    const ratings = userActivityData.ratings;

    // Categories explored
    const categoriesExplored = new Set(
      completedActivities
        .map(c => allActivities.find(a => a.id.toString() === c.activityId)?.category)
        .filter(Boolean)
    ).size;

    // Consecutive days (simplified calculation)
    const totalDays = Math.floor(
      completedActivities.length > 0 
        ? (Date.now() - new Date(completedActivities[0].completedAt).getTime()) / (1000 * 60 * 60 * 24)
        : 0
    );

    // Average rating given
    const avgRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
      : 0;

    // Total time spent
    const totalTime = completedActivities.reduce((sum, c) => sum + c.duration, 0);

    return {
      completedCount: completedActivities.length,
      favoritesCount: favoriteActivities.length,
      viewedCount: viewedActivities.length,
      ratingsCount: ratings.length,
      categoriesExplored,
      totalDays,
      avgRating,
      totalTime,
      highRatings: ratings.filter(r => r.rating >= 4).length
    };
  }, [userActivityData, allActivities]);

  // Generate badges
  const badges: Badge[] = useMemo(() => [
    // Exploration badges
    {
      id: 'first-activity',
      name: 'Primeiro Passo',
      description: 'Complete sua primeira atividade',
      icon: <Target className="h-5 w-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      requirement: 1,
      currentProgress: userStats.completedCount,
      unlocked: userStats.completedCount >= 1,
      category: 'exploration'
    },
    {
      id: 'explorer',
      name: 'Explorador',
      description: 'Complete 10 atividades diferentes',
      icon: <BookOpen className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      requirement: 10,
      currentProgress: userStats.completedCount,
      unlocked: userStats.completedCount >= 10,
      category: 'exploration'
    },
    {
      id: 'category-master',
      name: 'Mestre das Categorias',
      description: 'Explore todas as 5 categorias principais',
      icon: <Crown className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      requirement: 5,
      currentProgress: userStats.categoriesExplored,
      unlocked: userStats.categoriesExplored >= 5,
      category: 'exploration'
    },

    // Mastery badges
    {
      id: 'dedicated',
      name: 'Dedicado',
      description: 'Complete 25 atividades',
      icon: <Flame className="h-5 w-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      requirement: 25,
      currentProgress: userStats.completedCount,
      unlocked: userStats.completedCount >= 25,
      category: 'mastery'
    },
    {
      id: 'expert',
      name: 'Especialista',
      description: 'Complete 50 atividades',
      icon: <Trophy className="h-5 w-5" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      requirement: 50,
      currentProgress: userStats.completedCount,
      unlocked: userStats.completedCount >= 50,
      category: 'mastery'
    },
    {
      id: 'time-master',
      name: 'Mestre do Tempo',
      description: 'Acumule 500 minutos de atividades',
      icon: <Zap className="h-5 w-5" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      requirement: 500,
      currentProgress: userStats.totalTime,
      unlocked: userStats.totalTime >= 500,
      category: 'mastery'
    },

    // Social badges
    {
      id: 'curator',
      name: 'Curador',
      description: 'Avalie 10 atividades',
      icon: <Star className="h-5 w-5" />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      requirement: 10,
      currentProgress: userStats.ratingsCount,
      unlocked: userStats.ratingsCount >= 10,
      category: 'social'
    },
    {
      id: 'quality-reviewer',
      name: 'Crítico de Qualidade',
      description: 'Dê 20 avaliações 4+ estrelas',
      icon: <Award className="h-5 w-5" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      requirement: 20,
      currentProgress: userStats.highRatings,
      unlocked: userStats.highRatings >= 20,
      category: 'social'
    },

    // Consistency badges
    {
      id: 'collector',
      name: 'Colecionador',
      description: 'Tenha 15 atividades favoritas',
      icon: <Heart className="h-5 w-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      requirement: 15,
      currentProgress: userStats.favoritesCount,
      unlocked: userStats.favoritesCount >= 15,
      category: 'consistency'
    }
  ], [userStats]);

  // Calculate level and experience
  const calculateLevel = () => {
    const totalPoints = userStats.completedCount * 10 + 
                       userStats.ratingsCount * 5 + 
                       userStats.favoritesCount * 2 +
                       badges.filter(b => b.unlocked).length * 20;
    
    const level = Math.floor(totalPoints / 100) + 1;
    const currentLevelPoints = totalPoints % 100;
    const nextLevelPoints = 100;
    
    return { level, currentLevelPoints, nextLevelPoints, totalPoints };
  };

  const { level, currentLevelPoints, nextLevelPoints, totalPoints } = calculateLevel();

  // Recent achievements (newly unlocked badges)
  const recentAchievements: Achievement[] = useMemo(() => {
    return badges
      .filter(b => b.unlocked)
      .slice(-3)
      .map(badge => ({
        id: badge.id,
        title: badge.name,
        description: badge.description,
        points: 20,
        icon: badge.icon,
        unlockedAt: new Date().toISOString(),
        rarity: 'common' as const
      }));
  }, [badges]);

  const filteredBadges = selectedBadgeCategory === 'all' 
    ? badges 
    : badges.filter(b => b.category === selectedBadgeCategory);

  const badgeCategories = [
    { id: 'all', name: 'Todas', count: badges.length },
    { id: 'exploration', name: 'Exploração', count: badges.filter(b => b.category === 'exploration').length },
    { id: 'mastery', name: 'Maestria', count: badges.filter(b => b.category === 'mastery').length },
    { id: 'social', name: 'Social', count: badges.filter(b => b.category === 'social').length },
    { id: 'consistency', name: 'Consistência', count: badges.filter(b => b.category === 'consistency').length }
  ];

  return (
    <div className="space-y-6">
      {/* Player Level & Progress */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-full">
              <Crown className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">Nível {level}</div>
              <div className="text-sm text-muted-foreground">
                {totalPoints} pontos totais
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso para o próximo nível</span>
                <span>{currentLevelPoints}/{nextLevelPoints} XP</span>
              </div>
              <Progress value={(currentLevelPoints / nextLevelPoints) * 100} className="h-3" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{userStats.completedCount}</div>
                <div className="text-xs text-muted-foreground">Concluídas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{badges.filter(b => b.unlocked).length}</div>
                <div className="text-xs text-muted-foreground">Badges</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{userStats.categoriesExplored}</div>
                <div className="text-xs text-muted-foreground">Categorias</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{Math.floor(userStats.totalTime / 60)}h</div>
                <div className="text-xs text-muted-foreground">Tempo Total</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Conquistas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex-shrink-0 p-4 bg-muted/50 rounded-lg min-w-48">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                      {achievement.icon}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{achievement.title}</div>
                      <Badge variant="secondary" className="text-xs">
                        +{achievement.points} XP
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Badge Collection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Medal className="h-5 w-5" />
              Coleção de Badges
            </CardTitle>
            <Dialog open={showAchievements} onOpenChange={setShowAchievements}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Gift className="h-4 w-4 mr-2" />
                  Ver Todas
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Todas as Conquistas</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {badges.map((badge) => (
                    <Card key={badge.id} className={badge.unlocked ? '' : 'opacity-50'}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-full ${badge.bgColor}`}>
                            <div className={badge.color}>
                              {badge.icon}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{badge.name}</div>
                            <div className="text-xs text-muted-foreground">{badge.description}</div>
                          </div>
                          {badge.unlocked && (
                            <Trophy className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        {!badge.unlocked && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progresso</span>
                              <span>{Math.min(badge.currentProgress, badge.requirement)}/{badge.requirement}</span>
                            </div>
                            <Progress 
                              value={(badge.currentProgress / badge.requirement) * 100} 
                              className="h-2" 
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Category filters */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {badgeCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedBadgeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedBadgeCategory(category.id)}
                className="whitespace-nowrap"
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>

          {/* Badge grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBadges.slice(0, 8).map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-lg border text-center transition-all duration-200 ${
                  badge.unlocked 
                    ? 'bg-card hover:shadow-md cursor-pointer' 
                    : 'bg-muted/30 opacity-60'
                }`}
              >
                <div className={`mx-auto mb-2 p-3 rounded-full ${badge.bgColor} w-fit`}>
                  <div className={badge.color}>
                    {badge.icon}
                  </div>
                </div>
                <div className="font-medium text-sm mb-1">{badge.name}</div>
                <div className="text-xs text-muted-foreground mb-2">{badge.description}</div>
                
                {badge.unlocked ? (
                  <Badge variant="default" className="text-xs">
                    <Trophy className="h-3 w-3 mr-1" />
                    Desbloqueado
                  </Badge>
                ) : (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      {Math.min(badge.currentProgress, badge.requirement)}/{badge.requirement}
                    </div>
                    <Progress 
                      value={(badge.currentProgress / badge.requirement) * 100} 
                      className="h-1" 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};