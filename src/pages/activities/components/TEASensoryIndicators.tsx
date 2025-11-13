import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Volume2, 
  Eye, 
  Move, 
  Hand, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { TEAActivity } from '../data/tea-specific-activities';

interface TEASensoryIndicatorsProps {
  activity: TEAActivity;
  className?: string;
}

export function TEASensoryIndicators({ activity, className }: TEASensoryIndicatorsProps) {
  const getSensoryLevelValue = (level: string): number => {
    switch (level) {
      case 'low': case 'minimal': case 'none': return 25;
      case 'medium': case 'moderate': return 50;
      case 'high': case 'rich': return 75;
      default: return 0;
    }
  };

  const getSensoryLevelColor = (level: string): string => {
    switch (level) {
      case 'low': case 'minimal': case 'none': return 'text-green-600';
      case 'medium': case 'moderate': return 'text-yellow-600';
      case 'high': case 'rich': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  const getSensoryLevelBg = (level: string): string => {
    switch (level) {
      case 'low': case 'minimal': case 'none': return 'bg-green-100';
      case 'medium': case 'moderate': return 'bg-yellow-100';
      case 'high': case 'rich': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  const getPredictabilityColor = (level: string): string => {
    switch (level) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSupportLevelInfo = (level: number) => {
    switch (level) {
      case 1:
        return {
          label: 'Suporte Mínimo',
          description: 'Necessita suporte para iniciar interações sociais',
          color: 'text-green-600 bg-green-100'
        };
      case 2:
        return {
          label: 'Suporte Substancial',
          description: 'Necessita suporte substancial para comunicação social',
          color: 'text-yellow-600 bg-yellow-100'
        };
      case 3:
        return {
          label: 'Suporte Intenso',
          description: 'Necessita suporte muito substancial',
          color: 'text-red-600 bg-red-100'
        };
      default:
        return {
          label: 'Não especificado',
          description: '',
          color: 'text-gray-600 bg-gray-100'
        };
    }
  };

  const supportInfo = getSupportLevelInfo(activity.supportLevel);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="h-5 w-5" />
          Indicadores Sensoriais TEA
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Nível de Suporte */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className={supportInfo.color}>
              Nível {activity.supportLevel} - {supportInfo.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{supportInfo.description}</p>
        </div>

        {/* Perfil Sensorial Detalhado */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Perfil Sensorial</h4>
          
          {/* Intensidade Auditiva */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className={`h-4 w-4 ${getSensoryLevelColor(activity.sensoryProfile.auditoryIntensity)}`} />
                <span className="text-sm font-medium">Intensidade Auditiva</span>
              </div>
              <Badge className={getSensoryLevelBg(activity.sensoryProfile.auditoryIntensity)}>
                {activity.sensoryProfile.auditoryIntensity === 'low' ? 'Baixa' :
                 activity.sensoryProfile.auditoryIntensity === 'medium' ? 'Média' : 'Alta'}
              </Badge>
            </div>
            <Progress 
              value={getSensoryLevelValue(activity.sensoryProfile.auditoryIntensity)} 
              className="h-2"
            />
          </div>

          {/* Estímulos Visuais */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className={`h-4 w-4 ${getSensoryLevelColor(activity.sensoryProfile.visualStimuli)}`} />
                <span className="text-sm font-medium">Estímulos Visuais</span>
              </div>
              <Badge className={getSensoryLevelBg(activity.sensoryProfile.visualStimuli)}>
                {activity.sensoryProfile.visualStimuli === 'minimal' ? 'Mínimo' :
                 activity.sensoryProfile.visualStimuli === 'moderate' ? 'Moderado' : 'Rico'}
              </Badge>
            </div>
            <Progress 
              value={getSensoryLevelValue(activity.sensoryProfile.visualStimuli)} 
              className="h-2"
            />
          </div>

          {/* Movimento Necessário */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Move className={`h-4 w-4 ${getSensoryLevelColor(activity.sensoryProfile.movementRequired)}`} />
                <span className="text-sm font-medium">Movimento Necessário</span>
              </div>
              <Badge className={getSensoryLevelBg(activity.sensoryProfile.movementRequired)}>
                {activity.sensoryProfile.movementRequired === 'none' ? 'Nenhum' :
                 activity.sensoryProfile.movementRequired === 'minimal' ? 'Mínimo' :
                 activity.sensoryProfile.movementRequired === 'moderate' ? 'Moderado' : 'Alto'}
              </Badge>
            </div>
            <Progress 
              value={getSensoryLevelValue(activity.sensoryProfile.movementRequired)} 
              className="h-2"
            />
          </div>

          {/* Elementos Táteis */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hand className="h-4 w-4" />
              <span className="text-sm font-medium">Elementos Táteis</span>
            </div>
            <Badge variant={activity.sensoryProfile.tactileElements ? "default" : "secondary"}>
              {activity.sensoryProfile.tactileElements ? 'Presente' : 'Ausente'}
            </Badge>
          </div>
        </div>

        {/* Características de Comunicação */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Comunicação e Atenção</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Estilo de Comunicação</div>
              <Badge variant="outline">
                {activity.communicationStyle === 'verbal' ? 'Verbal' :
                 activity.communicationStyle === 'non-verbal' ? 'Não-verbal' : 'Misto'}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Tempo de Atenção</div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="text-sm">{activity.attentionSpan} min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Previsibilidade */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Nível de Estrutura</span>
            <Badge className={getPredictabilityColor(activity.predictabilityLevel)}>
              {activity.predictabilityLevel === 'high' ? 'Alta Estrutura' :
               activity.predictabilityLevel === 'medium' ? 'Estrutura Média' : 'Baixa Estrutura'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {activity.predictabilityLevel === 'high' ? 
              'Atividade altamente estruturada e previsível' :
             activity.predictabilityLevel === 'medium' ?
              'Atividade com estrutura moderada' :
              'Atividade flexível com menor estrutura'}
          </p>
        </div>

        {/* Alertas Sensoriais */}
        {activity.sensoryAlerts.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Alertas Sensoriais</span>
            </div>
            <div className="space-y-1">
              {activity.sensoryAlerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-yellow-50 rounded-md">
                  <AlertTriangle className="h-3 w-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-yellow-800">{alert}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benefícios TEA Específicos */}
        {activity.teaSpecificBenefits.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Benefícios TEA</span>
            </div>
            <div className="space-y-1">
              {activity.teaSpecificBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-green-50 rounded-md">
                  <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-green-800">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}