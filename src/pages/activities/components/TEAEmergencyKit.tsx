import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { AlertTriangle, Heart, Music, Eye, Play, Pause, Volume2, VolumeX, Wind, Waves, Brain, Speaker, TreePine, Zap, Star } from 'lucide-react';
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
  category: 'breathing' | 'nature' | 'therapeutic' | 'binaural' | 'instruments' | 'emergency';
  type: 'calm' | 'focus' | 'ground' | 'reset';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  intensity: 'low' | 'medium' | 'high';
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
  // Categoria: Respiração e Relaxamento
  {
    id: 'guided-breathing',
    name: 'Respiração Guiada',
    frequency: 136,
    duration: 60,
    category: 'breathing',
    type: 'calm',
    description: 'Som contínuo que acompanha o ritmo respiratório',
    icon: Wind,
    intensity: 'low'
  },
  {
    id: 'whisper-wind',
    name: 'Sussurro do Vento',
    frequency: 80,
    duration: 15,
    category: 'breathing',
    type: 'calm',
    description: 'Som grave e constante para relaxamento profundo',
    icon: Wind,
    intensity: 'low'
  },
  {
    id: 'calm-heartbeat',
    name: 'Batimento Cardíaco Calmo',
    frequency: 60,
    duration: 30,
    category: 'breathing',
    type: 'ground',
    description: 'Ritmo regular para autorregulação',
    icon: Heart,
    intensity: 'medium'
  },

  // Categoria: Natureza Terapêutica
  {
    id: 'gentle-rain',
    name: 'Chuva Suave',
    frequency: 150,
    duration: 20,
    category: 'nature',
    type: 'calm',
    description: 'Som de chuva leve para mascarar ruídos externos',
    icon: Waves,
    intensity: 'low'
  },
  {
    id: 'crystal-stream',
    name: 'Córrego Cristalino',
    frequency: 200,
    duration: 25,
    category: 'nature',
    type: 'calm',
    description: 'Água corrente para tranquilidade',
    icon: Waves,
    intensity: 'low'
  },
  {
    id: 'wind-leaves',
    name: 'Vento nas Folhas',
    frequency: 120,
    duration: 18,
    category: 'nature',
    type: 'calm',
    description: 'Som suave de folhagem',
    icon: TreePine,
    intensity: 'low'
  },
  {
    id: 'distant-seagulls',
    name: 'Gaivotas Distantes',
    frequency: 300,
    duration: 12,
    category: 'nature',
    type: 'focus',
    description: 'Sons de natureza não invasivos',
    icon: TreePine,
    intensity: 'medium'
  },

  // Categoria: Frequências Terapêuticas
  {
    id: 'love-frequency',
    name: '528Hz - Frequência do Amor',
    frequency: 528,
    duration: 15,
    category: 'therapeutic',
    type: 'calm',
    description: 'Frequência de cura e harmonia',
    icon: Brain,
    intensity: 'medium'
  },
  {
    id: 'natural-frequency',
    name: '432Hz - Frequência Natural',
    frequency: 432,
    duration: 20,
    category: 'therapeutic',
    type: 'calm',
    description: 'Afinação natural relaxante',
    icon: Brain,
    intensity: 'medium'
  },
  {
    id: 'pain-relief',
    name: '174Hz - Alívio da Dor',
    frequency: 174,
    duration: 10,
    category: 'therapeutic',
    type: 'ground',
    description: 'Frequência para conforto físico',
    icon: Brain,
    intensity: 'high'
  },
  {
    id: 'regeneration',
    name: '285Hz - Regeneração',
    frequency: 285,
    duration: 12,
    category: 'therapeutic',
    type: 'calm',
    description: 'Para restauração energética',
    icon: Brain,
    intensity: 'medium'
  },

  // Categoria: Sons Binaurais Suaves
  {
    id: 'alpha-waves',
    name: 'Ondas Alpha',
    frequency: 10,
    duration: 30,
    category: 'binaural',
    type: 'focus',
    description: 'Para estado de relaxamento alerta',
    icon: Zap,
    intensity: 'medium'
  },
  {
    id: 'theta-waves',
    name: 'Ondas Theta',
    frequency: 6,
    duration: 45,
    category: 'binaural',
    type: 'calm',
    description: 'Para relaxamento profundo',
    icon: Zap,
    intensity: 'low'
  },
  {
    id: 'binaural-harmony',
    name: 'Harmonia Binaural',
    frequency: 40,
    duration: 20,
    category: 'binaural',
    type: 'focus',
    description: 'Para sincronização cerebral',
    icon: Zap,
    intensity: 'medium'
  },

  // Categoria: Instrumentos Calmantes
  {
    id: 'tibetan-bell',
    name: 'Sino Tibetano',
    frequency: 256,
    duration: 8,
    category: 'instruments',
    type: 'calm',
    description: 'Som de sino suave e prolongado',
    icon: Speaker,
    intensity: 'low'
  },
  {
    id: 'native-flute',
    name: 'Flauta Nativa',
    frequency: 330,
    duration: 15,
    category: 'instruments',
    type: 'calm',
    description: 'Melodia simples e repetitiva',
    icon: Speaker,
    intensity: 'low'
  },
  {
    id: 'soft-kalimba',
    name: 'Kalimba Suave',
    frequency: 440,
    duration: 12,
    category: 'instruments',
    type: 'calm',
    description: 'Piano de polegar relaxante',
    icon: Speaker,
    intensity: 'low'
  },

  // Categoria: Sons de Emergência Específicos
  {
    id: 'sos-breathing',
    name: 'SOS Respiratório',
    frequency: 100,
    duration: 5,
    category: 'emergency',
    type: 'reset',
    description: 'Som rápido para crises de ansiedade',
    icon: AlertTriangle,
    intensity: 'high'
  },
  {
    id: 'sensory-reset',
    name: 'Reset Sensorial',
    frequency: 50,
    duration: 3,
    category: 'emergency',
    type: 'reset',
    description: 'Som muito grave para overstimulation',
    icon: AlertTriangle,
    intensity: 'high'
  },
  {
    id: 'safe-anchor',
    name: 'Âncora Segura',
    frequency: 176,
    duration: 10,
    category: 'emergency',
    type: 'ground',
    description: 'Som familiar para grounding rápido',
    icon: Star,
    intensity: 'medium'
  },

  // Sons originais atualizados
  {
    id: 'calm-wave',
    name: 'Ondas Calmas',
    frequency: 220,
    duration: 10,
    category: 'nature',
    type: 'calm',
    description: 'Som suave para acalmar',
    icon: Waves,
    intensity: 'low'
  },
  {
    id: 'focus-tone',
    name: 'Tom de Foco',
    frequency: 440,
    duration: 5,
    category: 'therapeutic',
    type: 'focus',
    description: 'Som para direcionar atenção',
    icon: Brain,
    intensity: 'medium'
  },
  {
    id: 'grounding-pulse',
    name: 'Pulso de Ancoragem',
    frequency: 110,
    duration: 8,
    category: 'emergency',
    type: 'ground',
    description: 'Som grave para grounding',
    icon: AlertTriangle,
    intensity: 'high'
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
  const [volume, setVolume] = useState([90]); // Aumentado de 85 para 90
  const [activeCategory, setActiveCategory] = useState<string>('emergency');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Estados para móvel
  const [audioActivated, setAudioActivated] = useState(false);
  const [audioStatus, setAudioStatus] = useState<'not-activated' | 'activating' | 'ready' | 'error'>('not-activated');
  const [isMobile, setIsMobile] = useState(false);
  const [showVolumeWarning, setShowVolumeWarning] = useState(false);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Detectar se é móvel
  React.useEffect(() => {
    const mobile = teaAudio.getIsMobile();
    setIsMobile(mobile);
    
    // Se for móvel, mostrar aviso de volume baixo se necessário
    if (mobile && !audioActivated) {
      setShowVolumeWarning(true);
    }
  }, [audioActivated]);

  // Sincronizar volume com o serviço de áudio
  React.useEffect(() => {
    const volumeValue = volume[0] / 100; // Converter de 0-100 para 0-1
    teaAudio.setVolume(volumeValue);
  }, [volume]);

  // Ativar áudio para móvel
  const activateAudio = async () => {
    setAudioStatus('activating');
    try {
      const ready = await teaAudio.ensureAudioReady();
      if (ready) {
        setAudioActivated(true);
        setAudioStatus('ready');
        setShowVolumeWarning(false);
        
        // Som de teste para confirmar funcionamento
        await teaAudio.playAnimalSound('test', 440, 0.3);
        
        console.log('🎵 Áudio TEA ativado com sucesso para móvel!');
      } else {
        throw new Error('Falha na ativação');
      }
    } catch (error) {
      console.log('Erro ao ativar áudio:', error);
      setAudioStatus('error');
    }
  };

  // Emergência máxima
  const activateEmergencyMax = () => {
    teaAudio.setEmergencyMaxVolume();
    setVolume([95]);
  };

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
    
    // Verificar se áudio está ativado em móvel
    if (isMobile && !audioActivated) {
      await activateAudio();
      if (!audioActivated) return;
    }
    
    setPlayingSound(sound.id);
    
    try {
      // Configurar modo baseado na categoria e intensidade
      if (sound.category === 'emergency') {
        await teaAudio.setEmergencyMode(true);
        await teaAudio.setCalmMode(false);
      } else {
        await teaAudio.setEmergencyMode(false);
        await teaAudio.setCalmMode(true);
      }
      
      // Ajustar volume baseado na intensidade (volumes mais altos)
      const currentVolume = volume[0] / 100;
      let intensityBoost = 1;
      
      switch (sound.intensity) {
        case 'high':
          intensityBoost = 1.5; // Aumentado de 1.4 para 1.5
          break;
        case 'medium':
          intensityBoost = 1.3; // Aumentado de 1.2 para 1.3
          break;
        case 'low':
          intensityBoost = 1.1; // Aumentado de 1 para 1.1
          break;
      }
      
      // Volume específico por categoria (mais altos)
      let categoryModifier = 1;
      switch (sound.category) {
        case 'emergency':
          categoryModifier = 1.3; // Aumentado de 1.2 para 1.3
          break;
        case 'therapeutic':
          categoryModifier = 1.2; // Aumentado de 1.1 para 1.2
          break;
        case 'binaural':
          categoryModifier = 0.9; // Aumentado de 0.8 para 0.9
          break;
        default:
          categoryModifier = 1.1; // Novo padrão mais alto
      }
      
      // Boost adicional para móvel
      const mobileBoost = isMobile ? 1.2 : 1;
      
      const finalVolume = Math.min(currentVolume * intensityBoost * categoryModifier * mobileBoost, 0.95);
      await teaAudio.setVolume(finalVolume);
      
      await teaAudio.playAnimalSound(sound.id, sound.frequency, sound.duration);
      
      // Restaurar volume original após o som
      setTimeout(() => {
        teaAudio.setVolume(currentVolume);
        teaAudio.setEmergencyMode(false);
      }, sound.duration * 1000 + 100);
      
    } catch (error) {
      console.log('Erro ao reproduzir som de emergência:', error);
      // Tentar novamente em caso de erro
      setTimeout(() => {
        teaAudio.playAnimalSound(sound.id, sound.frequency, sound.duration * 0.5);
      }, 500);
    }
    
    setTimeout(() => {
      setPlayingSound(null);
    }, sound.duration * 1000);
  };

  const setMaxVolume = () => {
    setVolume([95]); // Aumentado de 90 para 95
    setIsMuted(false);
    // Ativar áudio se for móvel e não estiver ativado
    if (isMobile && !audioActivated) {
      activateAudio();
    }
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
        {/* Interface Móvel Otimizada */}
        {isMobile && (
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  audioStatus === 'ready' ? 'bg-green-500 animate-pulse' :
                  audioStatus === 'activating' ? 'bg-yellow-500 animate-pulse' :
                  audioStatus === 'error' ? 'bg-red-500' :
                  'bg-gray-400'
                }`} />
                <span className="text-sm font-medium">
                  {audioStatus === 'ready' ? '🔊 Áudio Ativado' :
                   audioStatus === 'activating' ? '⏳ Ativando...' :
                   audioStatus === 'error' ? '❌ Erro no Áudio' :
                   '📱 Modo Celular'}
                </span>
              </div>
              
              {audioStatus === 'ready' && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={activateEmergencyMax}
                  className="text-xs px-3 py-1 h-7 bg-red-600 hover:bg-red-700 animate-pulse"
                >
                  🚨 MAX
                </Button>
              )}
            </div>

            {!audioActivated && (
              <div className="space-y-3">
                <Button
                  onClick={activateAudio}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                >
                  🔊 ATIVAR ÁUDIO PARA CELULAR
                </Button>
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Toque no botão acima para ativar o som</p>
                  <p>• Aumente o volume do seu celular</p>
                  <p>• Para melhor resultado, use fones de ouvido</p>
                </div>
              </div>
            )}

            {audioStatus === 'error' && (
              <div className="space-y-3">
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">
                    ⚠️ Não foi possível ativar o áudio. Tente:
                  </p>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                    <li>• Verificar se o volume está alto</li>
                    <li>• Usar fones de ouvido</li>
                    <li>• Recarregar a página</li>
                  </ul>
                </div>
                
                <Button
                  variant="outline"
                  onClick={activateAudio}
                  className="w-full"
                >
                  🔄 Tentar Novamente
                </Button>
              </div>
            )}

            {showVolumeWarning && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-700">
                  📢 Para emergências: verifique se o volume do celular está no máximo
                </p>
              </div>
            )}
          </div>
        )}

        {/* Controles de Áudio */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <span className="text-sm font-medium">Controles de Áudio</span>
              <Badge variant="secondary" className="text-xs">
                {volume[0]}%
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 min-w-[120px]">
                <VolumeX className="w-3 h-3" />
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={95} // Aumentado de 90 para 95
                  step={5}
                  className="w-20"
                  disabled={isMuted}
                />
                <Volume2 className="w-3 h-3" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={setMaxVolume}
                className="px-2 py-1 h-8 text-xs font-medium"
                title="Volume Máximo para Emergência"
              >
                MAX
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                className={isMuted ? 'text-muted-foreground' : ''}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Sons de Acalmamento Categorizados */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Music className="w-4 h-4" />
              Sons de Acalmamento
            </h3>

            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
                <TabsTrigger value="emergency" className="text-xs">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Emergência
                </TabsTrigger>
                <TabsTrigger value="breathing" className="text-xs">
                  <Wind className="w-3 h-3 mr-1" />
                  Respiração
                </TabsTrigger>
                <TabsTrigger value="nature" className="text-xs">
                  <TreePine className="w-3 h-3 mr-1" />
                  Natureza
                </TabsTrigger>
                <TabsTrigger value="therapeutic" className="text-xs">
                  <Brain className="w-3 h-3 mr-1" />
                  Terapêutico
                </TabsTrigger>
                <TabsTrigger value="binaural" className="text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  Binaural
                </TabsTrigger>
                <TabsTrigger value="instruments" className="text-xs">
                  <Speaker className="w-3 h-3 mr-1" />
                  Instrumentos
                </TabsTrigger>
              </TabsList>

              {(['emergency', 'breathing', 'nature', 'therapeutic', 'binaural', 'instruments'] as const).map((category) => (
                <TabsContent key={category} value={category} className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {emergencySounds
                      .filter(sound => sound.category === category)
                      .map((sound) => {
                        const IconComponent = sound.icon;
                        return (
                          <Button
                            key={sound.id}
                            variant="outline"
                            size="sm"
                            disabled={isMuted}
                            className={`h-auto p-3 flex-col space-y-2 ${
                              playingSound === sound.id 
                                ? 'bg-primary/10 border-primary shadow-md' 
                                : 'hover:bg-accent/50'
                            }`}
                            onClick={() => playEmergencySound(sound)}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <IconComponent className="w-4 h-4 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                  {playingSound === sound.id ? (
                                    <Pause className="w-3 h-3 text-primary" />
                                  ) : (
                                    <Play className="w-3 h-3" />
                                  )}
                                  <span className="text-xs font-medium truncate">
                                    {sound.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-xs text-muted-foreground text-left w-full">
                              {sound.description}
                            </p>
                            
                            <div className="flex items-center justify-between w-full">
                              <div className="flex gap-1">
                                <Badge 
                                  variant={
                                    sound.type === 'calm' ? 'default' : 
                                    sound.type === 'focus' ? 'secondary' : 
                                    sound.type === 'reset' ? 'destructive' :
                                    'outline'
                                  } 
                                  className="text-xs"
                                >
                                  {sound.type}
                                </Badge>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    sound.intensity === 'high' ? 'border-red-500 text-red-500' :
                                    sound.intensity === 'medium' ? 'border-yellow-500 text-yellow-500' :
                                    'border-green-500 text-green-500'
                                  }`}
                                >
                                  {sound.intensity}
                                </Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {sound.duration}s
                              </span>
                            </div>
                            
                            {playingSound === sound.id && (
                              <div className="w-full">
                                <Progress 
                                  value={(100 * (sound.duration - (Date.now() % (sound.duration * 1000)) / 1000)) / sound.duration} 
                                  className="h-1"
                                />
                              </div>
                            )}
                          </Button>
                        );
                      })}
                  </div>
                  
                  {emergencySounds.filter(sound => sound.category === category).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">Nenhum som disponível nesta categoria.</p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
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