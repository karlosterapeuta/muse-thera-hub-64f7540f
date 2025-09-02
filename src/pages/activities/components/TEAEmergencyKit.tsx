import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Heart, Music, Eye, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { teaAudio } from '../../musicogram/utils/teaAudioService';

interface CalmingTechnique {
  id: string;
  name: string;
  description: string;
  duration: number;
  steps: string[];
  icon: string;
  color: string;
}

interface EmergencySound {
  id: string;
  name: string;
  frequency: number;
  duration: number;
  type: 'calm' | 'focus' | 'ground';
  description: string;
}

const calmingTechniques: CalmingTechnique[] = [
  {
    id: 'breathing-54321',
    name: 'Respiração 5-4-3-2-1',
    description: 'Técnica sensorial para grounding',
    duration: 300, // 5 minutos
    steps: [
      '5 coisas que posso VER ao meu redor',
      '4 coisas que posso TOCAR',
      '3 coisas que posso OUVIR',
      '2 coisas que posso CHEIRAR',
      '1 coisa que posso SENTIR (sabor)'
    ],
    icon: '👁️',
    color: 'blue'
  },
  {
    id: 'box-breathing',
    name: 'Respiração Quadrada',
    description: 'Inspire 4, segure 4, expire 4, segure 4',
    duration: 240,
    steps: [
      'Inspire contando até 4',
      'Segure a respiração por 4',
      'Expire contando até 4',
      'Segure sem ar por 4',
      'Repita o ciclo 8 vezes'
    ],
    icon: '🫁',
    color: 'green'
  },
  {
    id: 'butterfly-hug',
    name: 'Abraço da Borboleta',
    description: 'Autoacolhimento através do toque',
    duration: 180,
    steps: [
      'Cruze os braços sobre o peito',
      'Coloque as mãos nos ombros',
      'Faça movimentos suaves alternados',
      'Respire devagar e profundo',
      'Continue por 3 minutos'
    ],
    icon: '🦋',
    color: 'purple'
  },
  {
    id: 'progressive-relaxation',
    name: 'Relaxamento Progressivo',
    description: 'Tensão e relaxamento muscular',
    duration: 420,
    steps: [
      'Tensione os músculos dos pés (5s)',
      'Relaxe completamente (10s)',
      'Suba para panturrilhas, coxas...',
      'Continue até chegar à cabeça',
      'Termine com respiração profunda'
    ],
    icon: '💆',
    color: 'indigo'
  }
];

const emergencySounds: EmergencySound[] = [
  {
    id: 'calm-wave',
    name: 'Ondas Calmas',
    frequency: 220,
    duration: 10,
    type: 'calm',
    description: 'Som suave para acalmar'
  },
  {
    id: 'focus-tone',
    name: 'Tom de Foco',
    frequency: 440,
    duration: 5,
    type: 'focus',
    description: 'Som para direcionar atenção'
  },
  {
    id: 'grounding-pulse',
    name: 'Pulso de Ancoragem',
    frequency: 110,
    duration: 8,
    type: 'ground',
    description: 'Som grave para grounding'
  }
];

const visualProtocols = [
  {
    id: 'stop-protocol',
    name: 'PROTOCOLO PARE',
    steps: ['PARE', 'RESPIRE', 'OBSERVE', 'ESCOLHA'],
    colors: ['red', 'blue', 'yellow', 'green'],
    description: 'Para momentos de sobrecarga'
  },
  {
    id: 'safe-space',
    name: 'ESPAÇO SEGURO',
    steps: ['ENCONTRE', 'SENTE-SE', 'RESPIRE', 'RELAXE'],
    colors: ['green', 'blue', 'purple', 'indigo'],
    description: 'Para buscar segurança'
  }
];

export function TEAEmergencyKit() {
  const [activeTechnique, setActiveTechnique] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const startTechnique = (techniqueId: string) => {
    setActiveTechnique(techniqueId);
    setCurrentStep(0);
    setTimer(0);
    setIsTimerRunning(true);
  };

  const nextStep = () => {
    const technique = calmingTechniques.find(t => t.id === activeTechnique);
    if (technique && currentStep < technique.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const stopTechnique = () => {
    setActiveTechnique(null);
    setCurrentStep(0);
    setTimer(0);
    setIsTimerRunning(false);
  };

  const playEmergencySound = async (sound: EmergencySound) => {
    if (isMuted) return;
    
    setPlayingSound(sound.id);
    try {
      await teaAudio.setCalmMode(true);
      await teaAudio.playAnimalSound(sound.id, sound.frequency, sound.duration);
    } catch (error) {
      console.log('Erro ao reproduzir som de emergência:', error);
    }
    
    setTimeout(() => {
      setPlayingSound(null);
    }, sound.duration * 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const activeTechniqueData = calmingTechniques.find(t => t.id === activeTechnique);

  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-5 h-5" />
          Kit de Emergência TEA
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ferramentas rápidas para momentos de crise e autorregulação
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Controles de Áudio */}
        <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            <span className="text-sm font-medium">Sons de Emergência</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            className={isMuted ? 'text-muted-foreground' : ''}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>

        {/* Sons de Emergência */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Music className="w-4 h-4" />
            Sons de Acalmamento
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {emergencySounds.map((sound) => (
              <Button
                key={sound.id}
                variant="outline"
                size="sm"
                disabled={isMuted}
                className={`h-auto p-3 ${playingSound === sound.id ? 'bg-primary/10 border-primary' : ''}`}
                onClick={() => playEmergencySound(sound)}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {playingSound === sound.id ? (
                      <Pause className="w-3 h-3" />
                    ) : (
                      <Play className="w-3 h-3" />
                    )}
                    <span className="text-xs font-medium">{sound.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{sound.description}</p>
                  <Badge variant={sound.type === 'calm' ? 'default' : sound.type === 'focus' ? 'secondary' : 'outline'} className="mt-1">
                    {sound.type}
                  </Badge>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Técnicas de Autorregulação */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Técnicas de Autorregulação
          </h3>

          {!activeTechnique ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {calmingTechniques.map((technique) => (
                <Card key={technique.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => startTechnique(technique.id)}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{technique.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{technique.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{technique.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {Math.floor(technique.duration / 60)}min
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {technique.steps.length} passos
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{activeTechniqueData?.icon}</span>
                      <div>
                        <h4 className="font-medium">{activeTechniqueData?.name}</h4>
                        <p className="text-xs text-muted-foreground">Tempo: {formatTime(timer)}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={stopTechnique}>
                      Parar
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progresso</span>
                      <span>{currentStep + 1}/{activeTechniqueData?.steps.length}</span>
                    </div>
                    <Progress 
                      value={((currentStep + 1) / (activeTechniqueData?.steps.length || 1)) * 100} 
                      className="h-2"
                    />
                  </div>

                  <Card className="bg-background/50">
                    <CardContent className="p-4">
                      <h5 className="font-medium mb-2">Passo {currentStep + 1}:</h5>
                      <p className="text-sm">{activeTechniqueData?.steps[currentStep]}</p>
                    </CardContent>
                  </Card>

                  <div className="flex gap-2">
                    <Button 
                      onClick={nextStep}
                      disabled={currentStep >= (activeTechniqueData?.steps.length || 0) - 1}
                      className="flex-1"
                    >
                      {currentStep >= (activeTechniqueData?.steps.length || 0) - 1 ? 'Concluído' : 'Próximo Passo'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Separator />

        {/* Protocolos Visuais */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Protocolos Visuais
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visualProtocols.map((protocol) => (
              <Card key={protocol.id} className="bg-background/50">
                <CardContent className="p-4">
                  <h4 className="font-medium text-sm mb-2">{protocol.name}</h4>
                  <p className="text-xs text-muted-foreground mb-3">{protocol.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {protocol.steps.map((step, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg text-center text-sm font-bold text-white transition-all hover:scale-105 cursor-pointer`}
                        style={{
                          backgroundColor: protocol.colors[index] === 'red' ? 'hsl(var(--destructive))' :
                                         protocol.colors[index] === 'blue' ? 'hsl(var(--primary))' :
                                         protocol.colors[index] === 'green' ? 'hsl(142, 76%, 36%)' :
                                         protocol.colors[index] === 'yellow' ? 'hsl(48, 96%, 53%)' :
                                         protocol.colors[index] === 'purple' ? 'hsl(262, 83%, 58%)' :
                                         'hsl(224, 71%, 54%)'
                        }}
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            💡 <strong>Lembre-se:</strong> Estes são recursos de apoio. Em situações de emergência real, procure ajuda profissional.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}