import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, ChevronDown, ChevronUp, Music, Brain, Heart } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface MusicoterapiaGuidanceProps {
  text: string;
  fieldId: string;
}

// Guidance content for specific fields
const FIELD_GUIDANCE: Record<string, {
  icon: React.ElementType;
  tips: string[];
  examples: string[];
}> = {
  therapeutic_objectives: {
    icon: Brain,
    tips: [
      'Defina objetivos específicos que utilizam a música como ferramenta principal',
      'Considere as necessidades individuais do paciente com TEA',
      'Integre aspectos comunicativos, sensoriais e sociais',
      'Estabeleça metas mensuráveis e alcançáveis'
    ],
    examples: [
      'Desenvolver comunicação não-verbal através de gestos musicais',
      'Promover autorregulação emocional com sequências rítmicas',
      'Estimular interação social em atividades musicais de grupo'
    ]
  },
  session_activities: {
    icon: Music,
    tips: [
      'Descreva as atividades de forma detalhada e sequencial',
      'Inclua instrumentos específicos utilizados',
      'Mencione técnicas musicoterapêuticas aplicadas',
      'Relate adaptações feitas conforme resposta do paciente'
    ],
    examples: [
      'Exploração dirigida de instrumentos de percussão com diferentes texturas',
      'Imitação rítmica utilizando pandeiro e movimento corporal',
      'Canto de canções funcionais para transições entre atividades'
    ]
  },
  patient_evolution: {
    icon: Heart,
    tips: [
      'Foque nos progressos observados durante as sessões',
      'Relate mudanças comportamentais positivas',
      'Mencione desenvolvimento de habilidades musicais',
      'Inclua aspectos de comunicação e interação social'
    ],
    examples: [
      'Maior engajamento com atividades rítmicas estruturadas',
      'Desenvolvimento da capacidade de imitação musical',
      'Uso espontâneo de instrumentos para expressão emocional'
    ]
  },
  recommendations: {
    icon: Lightbulb,
    tips: [
      'Sugira continuidade baseada nos progressos observados',
      'Inclua orientações para família e cuidadores',
      'Proponha atividades musicais para casa',
      'Indique frequência e duração das sessões'
    ],
    examples: [
      'Manutenção das sessões semanais com expansão do repertório',
      'Implementação de playlist terapêutica para uso domiciliar',
      'Participação gradual em atividades musicais grupais'
    ]
  }
};

export function MusicoterapiaGuidance({ text, fieldId }: MusicoterapiaGuidanceProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const guidance = FIELD_GUIDANCE[fieldId];
  const GuidanceIcon = guidance?.icon || Lightbulb;

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <GuidanceIcon className="h-4 w-4 mr-2" />
          <span className="text-sm">Orientações para este campo</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 ml-auto" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-auto" />
          )}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <Card className="mt-2 bg-muted/30 border-primary/20">
          <CardContent className="pt-4 space-y-4">
            {/* Basic guidance text */}
            <div className="flex items-start space-x-2">
              <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                {text}
              </p>
            </div>

            {/* Enhanced guidance if available */}
            {guidance && (
              <>
                {guidance.tips.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-primary">
                      Dicas para preenchimento:
                    </h5>
                    <ul className="space-y-1">
                      {guidance.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <span className="w-1 h-1 rounded-full bg-primary mt-2 mr-2 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {guidance.examples.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-primary">
                      Exemplos práticos:
                    </h5>
                    <div className="space-y-2">
                      {guidance.examples.map((example, index) => (
                        <div key={index} className="p-2 bg-background rounded border-l-2 border-primary/50">
                          <p className="text-sm italic text-muted-foreground">
                            "{example}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}