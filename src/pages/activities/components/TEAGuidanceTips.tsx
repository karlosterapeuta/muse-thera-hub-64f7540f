import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Lightbulb, 
  Heart, 
  Shield, 
  Users, 
  Volume2, 
  Eye, 
  Clock, 
  Target,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface TEAGuidanceTipsProps {
  supportLevel?: number;
  className?: string;
}

export function TEAGuidanceTips({ supportLevel = 2, className }: TEAGuidanceTipsProps) {
  const generalTips = [
    {
      icon: <Clock className="h-4 w-4" />,
      title: "Respeite o tempo de processamento",
      description: "Permita pausas entre instruções e atividades",
      type: "success" as const
    },
    {
      icon: <Eye className="h-4 w-4" />,
      title: "Use apoios visuais",
      description: "Cartões, gestos e demonstrações facilitam a compreensão",
      type: "success" as const
    },
    {
      icon: <Volume2 className="h-4 w-4" />,
      title: "Monitore estímulos sensoriais",
      description: "Observe sinais de sobrecarga e ajuste o ambiente",
      type: "warning" as const
    },
    {
      icon: <Heart className="h-4 w-4" />,
      title: "Celebre cada conquista",
      description: "Reconheça e valorize todos os progressos, mesmo pequenos",
      type: "success" as const
    }
  ];

  const levelSpecificTips = {
    1: [
      {
        icon: <Users className="h-4 w-4" />,
        title: "Foque em habilidades sociais",
        description: "Trabalhe interação e comunicação social",
        type: "info" as const
      },
      {
        icon: <Target className="h-4 w-4" />,
        title: "Aumente gradualmente a complexidade",
        description: "Proponha desafios apropriados para estimular desenvolvimento",
        type: "info" as const
      }
    ],
    2: [
      {
        icon: <Shield className="h-4 w-4" />,
        title: "Mantenha estruturas claras",
        description: "Use rotinas previsíveis e apoios visuais consistentes",
        type: "info" as const
      },
      {
        icon: <Lightbulb className="h-4 w-4" />,
        title: "Adapte comunicação",
        description: "Use linguagem simples e concrete, evite abstrações",
        type: "info" as const
      }
    ],
    3: [
      {
        icon: <AlertTriangle className="h-4 w-4" />,
        title: "Priorize conforto e segurança",
        description: "Ambiente calmo e suporte intensivo são essenciais",
        type: "warning" as const
      },
      {
        icon: <CheckCircle2 className="h-4 w-4" />,
        title: "Aceite todas as formas de comunicação",
        description: "Valorize qualquer tentativa de interação ou expressão",
        type: "success" as const
      }
    ]
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'warning': return 'destructive';
      case 'success': return 'default';
      case 'info': return 'default';
      default: return 'default';
    }
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'success': return 'border-green-200 bg-green-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      default: return '';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          Dicas de Orientação TEA
          <Badge variant="outline">Nível {supportLevel}</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Dicas Gerais */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Orientações Gerais</h4>
          <div className="space-y-2">
            {generalTips.map((tip, index) => (
              <Alert key={index} className={getAlertStyle(tip.type)}>
                <div className="flex items-start gap-2">
                  {tip.icon}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{tip.title}</div>
                    <AlertDescription className="text-xs mt-1">
                      {tip.description}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </div>

        {/* Dicas Específicas por Nível */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">
            Específico para Nível {supportLevel}
          </h4>
          <div className="space-y-2">
            {levelSpecificTips[supportLevel as keyof typeof levelSpecificTips]?.map((tip, index) => (
              <Alert key={index} className={getAlertStyle(tip.type)}>
                <div className="flex items-start gap-2">
                  {tip.icon}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{tip.title}</div>
                    <AlertDescription className="text-xs mt-1">
                      {tip.description}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </div>

        {/* Sinais de Alerta */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-red-600">Sinais de Sobrecarga Sensorial</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <div className="font-medium">Comportamentais:</div>
              <ul className="text-muted-foreground space-y-0.5">
                <li>• Agitação ou inquietação</li>
                <li>• Comportamentos repetitivos aumentados</li>
                <li>• Evitação ou fuga</li>
              </ul>
            </div>
            <div className="space-y-1">
              <div className="font-medium">Físicos:</div>
              <ul className="text-muted-foreground space-y-0.5">
                <li>• Cobertura dos ouvidos</li>
                <li>• Fechamento dos olhos</li>
                <li>• Tensão corporal</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Estratégias de Regulação */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-green-600">Estratégias de Regulação</h4>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-3 w-3" />
              <AlertDescription>
                <div className="font-medium">Pausas estruturadas:</div>
                <div>Permita intervalos regulares para autorregulação</div>
              </AlertDescription>
            </Alert>
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-3 w-3" />
              <AlertDescription>
                <div className="font-medium">Objetos de conforto:</div>
                <div>Permita uso de itens que proporcionem segurança</div>
              </AlertDescription>
            </Alert>
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-3 w-3" />
              <AlertDescription>
                <div className="font-medium">Comunicação clara:</div>
                <div>Antecipe mudanças e explique o que vai acontecer</div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}