import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Target, Eye } from 'lucide-react';
import { Activity } from '../types';

interface ActivityCardProps {
  activity: Activity;
  onViewDetails: (activity: Activity) => void;
  categoryColor?: string;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
};

const getDifficultyLabel = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'Fácil';
    case 'medium': return 'Médio';
    case 'hard': return 'Difícil';
    default: return difficulty;
  }
};

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onViewDetails,
  categoryColor = '#3B82F6'
}) => {
  // Get the first image from resourceLinks
  const mainImage = activity.resourceLinks?.find(link => link.type === 'image');

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Image Preview */}
      {mainImage && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={mainImage.url}
            alt={mainImage.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <Badge className={`absolute top-2 right-2 ${getDifficultyColor(activity.difficulty)}`}>
            {getDifficultyLabel(activity.difficulty)}
          </Badge>
        </div>
      )}
      
      <CardHeader className={mainImage ? "pb-3" : "pb-3"}>
        {!mainImage && (
          <div className="flex items-start justify-between mb-2">
            <Badge className={getDifficultyColor(activity.difficulty)}>
              {getDifficultyLabel(activity.difficulty)}
            </Badge>
          </div>
        )}
        <CardTitle className="text-lg line-clamp-2">{activity.title}</CardTitle>
        <CardDescription className="line-clamp-3">
          {activity.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Informações principais */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{activity.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{activity.ageGroup}</span>
          </div>
        </div>

        {/* Objetivos principais */}
        {activity.objectives && activity.objectives.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Objetivos:</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              {activity.objectives.slice(0, 2).map((objective, index) => (
                <li key={index} className="line-clamp-1">• {objective}</li>
              ))}
              {activity.objectives.length > 2 && (
                <li className="text-xs italic">+{activity.objectives.length - 2} mais...</li>
              )}
            </ul>
          </div>
        )}

        {/* Tags */}
        {activity.tags && activity.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {activity.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {activity.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{activity.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Áreas terapêuticas */}
        {activity.therapeuticAreas && activity.therapeuticAreas.length > 0 && (
          <div>
            <span className="text-xs font-medium text-muted-foreground">Áreas: </span>
            <span className="text-xs text-muted-foreground">
              {activity.therapeuticAreas.slice(0, 2).join(', ')}
              {activity.therapeuticAreas.length > 2 && '...'}
            </span>
          </div>
        )}

        {/* Botão de detalhes */}
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => onViewDetails(activity)}
        >
          <Eye className="h-4 w-4 mr-2" />
          Ver Detalhes
        </Button>
      </CardContent>
    </Card>
  );
};