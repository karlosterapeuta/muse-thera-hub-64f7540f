import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Volume2, Eye, Move, AlertTriangle } from 'lucide-react';
import { TEAActivity } from '../data/tea-specific-activities';

interface TEAActivityCardProps {
  activity: TEAActivity;
  onViewDetails: (activity: TEAActivity) => void;
}

const getSupportLevelColor = (level: number) => {
  switch (level) {
    case 1: return "bg-green-100 text-green-800 border-green-200";
    case 2: return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case 3: return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getSensoryIntensityIcon = (intensity: string) => {
  switch (intensity) {
    case 'low': return <Volume2 className="h-3 w-3 text-green-600" />;
    case 'medium': return <Volume2 className="h-3 w-3 text-yellow-600" />;
    case 'high': return <Volume2 className="h-3 w-3 text-red-600" />;
    default: return null;
  }
};

const getVisualStimuliIcon = (stimuli: string) => {
  switch (stimuli) {
    case 'minimal': return <Eye className="h-3 w-3 text-green-600" />;
    case 'moderate': return <Eye className="h-3 w-3 text-yellow-600" />;
    case 'rich': return <Eye className="h-3 w-3 text-red-600" />;
    default: return null;
  }
};

const getMovementIcon = (movement: string) => {
  switch (movement) {
    case 'none': return <Move className="h-3 w-3 text-gray-400" />;
    case 'minimal': return <Move className="h-3 w-3 text-green-600" />;
    case 'moderate': return <Move className="h-3 w-3 text-yellow-600" />;
    case 'high': return <Move className="h-3 w-3 text-red-600" />;
    default: return null;
  }
};

export function TEAActivityCard({ activity, onViewDetails }: TEAActivityCardProps) {
  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">
            {activity.title}
          </h3>
          <Badge 
            variant="outline" 
            className={`text-xs whitespace-nowrap ${getSupportLevelColor(activity.supportLevel)}`}
          >
            Nível {activity.supportLevel}
          </Badge>
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-2">
          {activity.description}
        </p>
      </CardHeader>

      <CardContent className="pt-0 pb-3 space-y-3">
        {/* Informações básicas */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{activity.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{activity.ageGroup}</span>
          </div>
        </div>

        {/* Perfil sensorial */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Perfil Sensorial:</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1" title="Intensidade Auditiva">
              {getSensoryIntensityIcon(activity.sensoryProfile.auditoryIntensity)}
              <span className="text-xs">Audio</span>
            </div>
            <div className="flex items-center gap-1" title="Estímulos Visuais">
              {getVisualStimuliIcon(activity.sensoryProfile.visualStimuli)}
              <span className="text-xs">Visual</span>
            </div>
            <div className="flex items-center gap-1" title="Movimento Necessário">
              {getMovementIcon(activity.sensoryProfile.movementRequired)}
              <span className="text-xs">Movimento</span>
            </div>
          </div>
        </div>

        {/* Características TEA */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {activity.communicationStyle}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Atenção: {activity.attentionSpan}min
            </Badge>
            <Badge variant="outline" className="text-xs">
              {activity.predictabilityLevel} estrutura
            </Badge>
          </div>
        </div>

        {/* Alertas sensoriais */}
        {activity.sensoryAlerts.length > 0 && (
          <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded-md">
            <AlertTriangle className="h-3 w-3 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-800">
              {activity.sensoryAlerts[0]}
              {activity.sensoryAlerts.length > 1 && (
                <span className="text-yellow-600"> +{activity.sensoryAlerts.length - 1} mais</span>
              )}
            </div>
          </div>
        )}

        {/* Benefícios TEA específicos */}
        {activity.teaSpecificBenefits.length > 0 && (
          <div className="text-xs">
            <div className="font-medium text-muted-foreground mb-1">Benefícios TEA:</div>
            <div className="text-muted-foreground">
              {activity.teaSpecificBenefits[0]}
              {activity.teaSpecificBenefits.length > 1 && (
                <span className="text-primary"> +{activity.teaSpecificBenefits.length - 1} mais</span>
              )}
            </div>
          </div>
        )}

        {/* Tags principais */}
        <div className="flex flex-wrap gap-1">
          {activity.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {activity.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{activity.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button 
          onClick={() => onViewDetails(activity)}
          variant="outline" 
          size="sm" 
          className="w-full"
        >
          Ver Detalhes TEA
        </Button>
      </CardFooter>
    </Card>
  );
}