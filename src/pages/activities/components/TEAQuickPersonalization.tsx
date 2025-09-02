import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Brain, AlertCircle } from 'lucide-react';

interface TEAQuickPersonalizationProps {
  teaProfile?: any;
  onOpenPersonalization: () => void;
  className?: string;
}

export function TEAQuickPersonalization({ 
  teaProfile, 
  onOpenPersonalization, 
  className 
}: TEAQuickPersonalizationProps) {
  if (!teaProfile) {
    return (
      <Card className={`bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium text-sm text-blue-900">Personalização TEA</div>
                <div className="text-xs text-blue-700">Configure um perfil para recomendações personalizadas</div>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={onOpenPersonalization}
              className="border-blue-300 hover:bg-blue-100"
            >
              <Settings className="h-3 w-3 mr-1" />
              Configurar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-r from-green-50 to-blue-50 border-green-200 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-5 w-5 text-green-600" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="font-medium text-sm text-green-900">Perfil TEA Configurado</div>
                <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                  Nível {teaProfile.supportLevel}
                </Badge>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="text-green-700">
                  {teaProfile.communicationPreferences?.primaryStyle === 'verbal' ? 'Verbal' :
                   teaProfile.communicationPreferences?.primaryStyle === 'non-verbal' ? 'Não-verbal' : 'Misto'}
                </span>
                <span className="text-green-600">•</span>
                <span className="text-green-700">
                  {teaProfile.sensoryProfile?.auditoryTolerance < 30 ? 'Sensível a sons' :
                   teaProfile.sensoryProfile?.auditoryTolerance < 70 ? 'Tolerância moderada' : 'Tolerante a sons'}
                </span>
              </div>
            </div>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={onOpenPersonalization}
            className="border-green-300 hover:bg-green-100"
          >
            <Settings className="h-3 w-3 mr-1" />
            Editar
          </Button>
        </div>
        
        {/* Quick indicators */}
        <div className="flex gap-2 mt-3">
          {teaProfile.sensoryProfile?.predictabilityNeed > 70 && (
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
              Alta estrutura
            </Badge>
          )}
          {teaProfile.sensoryProfile?.auditoryTolerance < 40 && (
            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Sensível
            </Badge>
          )}
          {teaProfile.communicationPreferences?.needsProcessingTime && (
            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
              Tempo extra
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}