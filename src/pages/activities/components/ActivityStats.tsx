import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  CheckCircle, 
  Eye, 
  TrendingUp, 
  Clock,
  Target,
  BookOpen
} from 'lucide-react';

interface ActivityStatsProps {
  totalActivities: number;
  filteredActivities: number;
  userActivityData: {
    favorites: string[];
    completed: Array<{ activityId: string }>;
    recentlyViewed: string[];
  };
  allActivities: Array<{
    id: number;
    title: string;
    category: string;
    duration: string;
  }>;
}

export const ActivityStats: React.FC<ActivityStatsProps> = ({
  totalActivities,
  filteredActivities,
  userActivityData,
  allActivities
}) => {
  const favoriteCount = userActivityData.favorites.length;
  const completedCount = userActivityData.completed.length;
  const recentlyViewedCount = userActivityData.recentlyViewed.length;

  // Calculate popular activities (most viewed/completed)
  const popularActivities = allActivities
    .map(activity => {
      const viewCount = userActivityData.recentlyViewed.filter(r => r === activity.id.toString()).length;
      const completionCount = userActivityData.completed.filter(c => c.activityId === activity.id.toString()).length;
      return {
        ...activity,
        popularity: viewCount + (completionCount * 2) // Weight completions more
      };
    })
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 3);

  const stats = [
    {
      icon: BookOpen,
      label: 'Total de Atividades',
      value: totalActivities,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      icon: Target,
      label: 'Filtradas',
      value: filteredActivities,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Heart,
      label: 'Favoritas',
      value: favoriteCount,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      icon: CheckCircle,
      label: 'Concluídas',
      value: completedCount,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: Eye,
      label: 'Visualizadas',
      value: recentlyViewedCount,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover-lift">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Popular Activities */}
      {popularActivities.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Atividades Populares</h3>
            </div>
            <div className="space-y-3">
              {popularActivities.map((activity, index) => (
                <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{activity.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {activity.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {activity.duration}
                      </div>
                    </div>
                  </div>
                  {activity.popularity > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {activity.popularity} pts
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};