import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Zap,
  Heart,
  Clock,
  Target,
  Filter,
  Download,
  Share2,
  BookOpen,
  TrendingUp,
  Sparkles,
  Calendar,
  Users,
  PlayCircle
} from 'lucide-react';
import { Activity } from '../types';
import { ActivityCard } from './ActivityCard';

interface QuickActionsProps {
  allActivities: Activity[];
  userActivityData: {
    favorites: string[];
    completed: Array<{ activityId: string }>;
    recentlyViewed: string[];
  };
  onViewActivity: (activity: Activity) => void;
  onFilterChange: (filters: any) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  allActivities,
  userActivityData,
  onViewActivity,
  onFilterChange
}) => {
  const [selectedQuickAction, setSelectedQuickAction] = useState<string | null>(null);

  // Quick filter functions
  const getQuickActivities = (type: string): Activity[] => {
    switch (type) {
      case 'quick-prep':
        return allActivities
          .filter(a => (a.preparationSteps?.length || 0) <= 3)
          .slice(0, 6);
      
      case 'short-duration':
        return allActivities
          .filter(a => parseInt(a.duration) <= 20)
          .slice(0, 6);
      
      case 'popular':
        return allActivities
          .sort(() => Math.random() - 0.5) // Simulate popularity
          .slice(0, 6);
      
      case 'new-for-you':
        const viewedIds = new Set([
          ...userActivityData.favorites,
          ...userActivityData.completed.map(c => c.activityId),
          ...userActivityData.recentlyViewed
        ]);
        return allActivities
          .filter(a => !viewedIds.has(a.id.toString()))
          .slice(0, 6);
      
      case 'beginner-friendly':
        return allActivities
          .filter(a => a.difficulty === 'easy')
          .slice(0, 6);
      
      case 'group-activities':
        return allActivities
          .filter(a => 
            a.tags?.some(tag => 
              tag.toLowerCase().includes('grupo') || 
              tag.toLowerCase().includes('social') ||
              tag.toLowerCase().includes('coletivo')
            ) ||
            a.description.toLowerCase().includes('grupo')
          )
          .slice(0, 6);
      
      default:
        return [];
    }
  };

  const quickActions = [
    {
      id: 'quick-prep',
      title: 'Preparação Rápida',
      description: 'Atividades que você pode começar agora',
      icon: <Zap className="h-5 w-5" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      count: getQuickActivities('quick-prep').length
    },
    {
      id: 'short-duration',
      title: 'Sessões Curtas',
      description: 'Atividades de até 20 minutos',
      icon: <Clock className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      count: getQuickActivities('short-duration').length
    },
    {
      id: 'popular',
      title: 'Mais Populares',
      description: 'Favoritas da comunidade',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      count: getQuickActivities('popular').length
    },
    {
      id: 'new-for-you',
      title: 'Novas para Você',
      description: 'Atividades não exploradas',
      icon: <Sparkles className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      count: getQuickActivities('new-for-you').length
    },
    {
      id: 'beginner-friendly',
      title: 'Iniciantes',
      description: 'Fáceis de implementar',
      icon: <Target className="h-5 w-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      count: getQuickActivities('beginner-friendly').length
    },
    {
      id: 'group-activities',
      title: 'Atividades em Grupo',
      description: 'Perfeitas para sessões coletivas',
      icon: <Users className="h-5 w-5" />,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      count: getQuickActivities('group-activities').length
    }
  ];

  const handleQuickFilter = (actionId: string) => {
    const action = quickActions.find(a => a.id === actionId);
    if (!action) return;

    // Apply corresponding filter
    switch (actionId) {
      case 'quick-prep':
        onFilterChange({ preparationTime: 'minimal' });
        break;
      case 'short-duration':
        onFilterChange({ duration: 'short' });
        break;
      case 'beginner-friendly':
        onFilterChange({ difficulty: 'easy' });
        break;
      case 'group-activities':
        onFilterChange({ searchTerm: 'grupo' });
        break;
      default:
        // For other actions, show modal with activities
        setSelectedQuickAction(actionId);
    }
  };

  const selectedActionData = selectedQuickAction 
    ? quickActions.find(a => a.id === selectedQuickAction)
    : null;

  const selectedActivities = selectedQuickAction 
    ? getQuickActivities(selectedQuickAction)
    : [];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Acesse rapidamente os tipos de atividades mais procurados
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all duration-200"
                onClick={() => handleQuickFilter(action.id)}
              >
                <div className={`p-2 rounded-lg ${action.bgColor}`}>
                  <div className={action.color}>
                    {action.icon}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {action.count} atividades
                  </Badge>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Action Modal */}
      <Dialog 
        open={!!selectedQuickAction} 
        onOpenChange={() => setSelectedQuickAction(null)}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedActionData?.icon}
              {selectedActionData?.title}
            </DialogTitle>
            <p className="text-muted-foreground">
              {selectedActionData?.description}
            </p>
          </DialogHeader>
          
          {selectedActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {selectedActivities.map((activity) => (
                <div key={activity.id} className="transform transition-all duration-200 hover:scale-[1.02]">
                  <ActivityCard
                    activity={activity}
                    onViewDetails={(activity) => {
                      onViewActivity(activity);
                      setSelectedQuickAction(null);
                    }}
                    categoryColor="#3B82F6"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma atividade encontrada para esta categoria.</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};