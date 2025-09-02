import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  TrendingUp, 
  Heart, 
  Clock,
  Target,
  Users,
  Lightbulb
} from 'lucide-react';
import { Activity } from '../types';
import { ActivityCard } from './ActivityCard';

interface RecommendationEngineProps {
  allActivities: Activity[];
  userActivityData: {
    favorites: string[];
    completed: Array<{ activityId: string }>;
    recentlyViewed: string[];
    ratings: Array<{ activityId: string; rating: number }>;
  };
  onViewActivity: (activity: Activity) => void;
  currentFilters?: any;
}

interface Recommendation {
  type: 'similar_to_favorites' | 'based_on_completed' | 'trending' | 'quick_prep' | 'new_category';
  title: string;
  description: string;
  activities: Activity[];
  icon: React.ReactNode;
  color: string;
}

export const RecommendationEngine: React.FC<RecommendationEngineProps> = ({
  allActivities,
  userActivityData,
  onViewActivity,
  currentFilters
}) => {
  const generateRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];

    // 1. Similar to favorites (if user has favorites)
    if (userActivityData.favorites.length > 0) {
      const favoriteActivities = allActivities.filter(a => 
        userActivityData.favorites.includes(a.id.toString())
      );
      
      const favoriteCategories = [...new Set(favoriteActivities.map(a => a.category))];
      const favoriteTags = [...new Set(favoriteActivities.flatMap(a => a.tags || []))];
      
      const similarActivities = allActivities
        .filter(activity => 
          !userActivityData.favorites.includes(activity.id.toString()) &&
          !userActivityData.completed.some(c => c.activityId === activity.id.toString()) &&
          (favoriteCategories.includes(activity.category) ||
           activity.tags?.some(tag => favoriteTags.includes(tag)))
        )
        .slice(0, 4);

      if (similarActivities.length > 0) {
        recommendations.push({
          type: 'similar_to_favorites',
          title: 'Baseado nos seus Favoritos',
          description: 'Atividades similares às que você marcou como favoritas',
          activities: similarActivities,
          icon: <Heart className="h-5 w-5" />,
          color: 'text-red-500'
        });
      }
    }

    // 2. Based on completed activities
    if (userActivityData.completed.length > 0) {
      const completedActivities = allActivities.filter(a =>
        userActivityData.completed.some(c => c.activityId === a.id.toString())
      );
      
      const completedCategories = [...new Set(completedActivities.map(a => a.category))];
      const nextLevelActivities = allActivities
        .filter(activity => 
          completedCategories.includes(activity.category) &&
          !userActivityData.completed.some(c => c.activityId === activity.id.toString()) &&
          activity.difficulty !== 'easy' // Suggest slightly more challenging
        )
        .slice(0, 3);

      if (nextLevelActivities.length > 0) {
        recommendations.push({
          type: 'based_on_completed',
          title: 'Próximo Nível',
          description: 'Atividades mais avançadas baseadas no que você já completou',
          activities: nextLevelActivities,
          icon: <TrendingUp className="h-5 w-5" />,
          color: 'text-green-500'
        });
      }
    }

    // 3. Quick preparation activities
    const quickPrepActivities = allActivities
      .filter(activity => 
        (activity.preparationSteps?.length || 0) <= 3 &&
        !userActivityData.recentlyViewed.includes(activity.id.toString())
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    if (quickPrepActivities.length > 0) {
      recommendations.push({
        type: 'quick_prep',
        title: 'Preparação Rápida',
        description: 'Atividades que você pode começar imediatamente',
        activities: quickPrepActivities,
        icon: <Clock className="h-5 w-5" />,
        color: 'text-blue-500'
      });
    }

    // 4. Explore new categories
    const userCategories = new Set([
      ...allActivities
        .filter(a => userActivityData.favorites.includes(a.id.toString()))
        .map(a => a.category),
      ...allActivities
        .filter(a => userActivityData.completed.some(c => c.activityId === a.id.toString()))
        .map(a => a.category)
    ]);

    const newCategoryActivities = allActivities
      .filter(activity => !userCategories.has(activity.category))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    if (newCategoryActivities.length > 0) {
      recommendations.push({
        type: 'new_category',
        title: 'Explore Novas Áreas',
        description: 'Descubra atividades de categorias que você ainda não explorou',
        activities: newCategoryActivities,
        icon: <Lightbulb className="h-5 w-5" />,
        color: 'text-purple-500'
      });
    }

    // 5. Trending activities (most popular overall)
    const trendingActivities = allActivities
      .filter(activity => 
        !userActivityData.recentlyViewed.includes(activity.id.toString())
      )
      .sort(() => Math.random() - 0.5) // Simulate trending
      .slice(0, 4);

    if (trendingActivities.length > 0) {
      recommendations.push({
        type: 'trending',
        title: 'Em Alta',
        description: 'Atividades populares entre outros profissionais',
        activities: trendingActivities,
        icon: <Sparkles className="h-5 w-5" />,
        color: 'text-yellow-500'
      });
    }

    return recommendations;
  };

  const recommendations = generateRecommendations();

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Recomendações Personalizadas</h2>
        <p className="text-muted-foreground">
          Atividades selecionadas especialmente para você baseadas no seu histórico
        </p>
      </div>

      {recommendations.map((recommendation, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="bg-muted/30">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-background ${recommendation.color}`}>
                {recommendation.icon}
              </div>
              <div>
                <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {recommendation.description}
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recommendation.activities.map((activity) => (
                <div key={activity.id} className="transform transition-all duration-200 hover:scale-[1.02]">
                  <ActivityCard
                    activity={activity}
                    onViewDetails={onViewActivity}
                    categoryColor="#3B82F6"
                  />
                </div>
              ))}
            </div>
            
            {recommendation.activities.length > 4 && (
              <div className="mt-6 text-center">
                <Button variant="outline">
                  Ver Mais Recomendações
                  <TrendingUp className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};