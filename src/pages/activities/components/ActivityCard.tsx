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
    <Card className="group h-full hover-lift cursor-pointer transition-all duration-300 hover:shadow-lg" onClick={() => onViewDetails(activity)}>
      {/* Image Section */}
      {mainImage && (
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <img
            src={mainImage.url}
            alt={mainImage.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              console.log('Erro ao carregar imagem:', mainImage.url);
              e.currentTarget.style.display = 'none';
            }}
            onLoad={() => {
              console.log('Imagem carregada com sucesso:', mainImage.url);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <Badge className={`absolute top-3 right-3 ${getDifficultyColor(activity.difficulty)} shadow-md`}>
            {getDifficultyLabel(activity.difficulty)}
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors font-semibold">
          {activity.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {activity.description}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Activity Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm truncate">{activity.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm truncate">{activity.ageGroup}</span>
          </div>
        </div>

        {/* Objectives Preview */}
        {activity.objectives && activity.objectives.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-medium">Objetivos principais:</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              {activity.objectives.slice(0, 2).map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                  <span className="line-clamp-1">{objective}</span>
                </li>
              ))}
              {activity.objectives.length > 2 && (
                <li className="text-xs text-muted-foreground italic">
                  +{activity.objectives.length - 2} objetivos adicionais
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Tags */}
        {activity.tags && activity.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {activity.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {activity.tags.length > 2 && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  +{activity.tags.length - 2} mais
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button 
          variant="outline" 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 font-medium"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(activity);
          }}
        >
          Ver Detalhes
          <Target className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      </CardContent>
    </Card>
  );
};