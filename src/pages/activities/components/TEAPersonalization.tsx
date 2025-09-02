import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { User, Save, RotateCcw, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SensoryProfile {
  auditoryTolerance: number; // 0-100
  visualTolerance: number; // 0-100
  tactileTolerance: number; // 0-100
  movementPreference: number; // 0-100
  predictabilityNeed: number; // 0-100
}

interface CommunicationPreferences {
  primaryStyle: 'verbal' | 'non-verbal' | 'mixed';
  useVisualSupports: boolean;
  preferredInteractionDuration: number; // minutes
  needsProcessingTime: boolean;
}

interface TEAProfile {
  supportLevel: 1 | 2 | 3;
  sensoryProfile: SensoryProfile;
  communicationPreferences: CommunicationPreferences;
  specificNeeds: string;
  successfulActivities: string[];
  challengingAreas: string[];
  motivators: string[];
}

interface TEAPersonalizationProps {
  onProfileSave: (profile: TEAProfile) => void;
  currentProfile?: Partial<TEAProfile>;
}

export function TEAPersonalization({ onProfileSave, currentProfile }: TEAPersonalizationProps) {
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<TEAProfile>({
    supportLevel: 2,
    sensoryProfile: {
      auditoryTolerance: 50,
      visualTolerance: 50,
      tactileTolerance: 50,
      movementPreference: 50,
      predictabilityNeed: 75
    },
    communicationPreferences: {
      primaryStyle: 'mixed',
      useVisualSupports: true,
      preferredInteractionDuration: 20,
      needsProcessingTime: true
    },
    specificNeeds: '',
    successfulActivities: [],
    challengingAreas: [],
    motivators: [],
    ...currentProfile
  });

  const updateProfile = (key: keyof TEAProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateSensoryProfile = (key: keyof SensoryProfile, value: number) => {
    setProfile(prev => ({
      ...prev,
      sensoryProfile: {
        ...prev.sensoryProfile,
        [key]: value
      }
    }));
  };

  const updateCommunicationPreferences = (key: keyof CommunicationPreferences, value: any) => {
    setProfile(prev => ({
      ...prev,
      communicationPreferences: {
        ...prev.communicationPreferences,
        [key]: value
      }
    }));
  };

  const resetToDefaults = () => {
    setProfile({
      supportLevel: 2,
      sensoryProfile: {
        auditoryTolerance: 50,
        visualTolerance: 50,
        tactileTolerance: 50,
        movementPreference: 50,
        predictabilityNeed: 75
      },
      communicationPreferences: {
        primaryStyle: 'mixed',
        useVisualSupports: true,
        preferredInteractionDuration: 20,
        needsProcessingTime: true
      },
      specificNeeds: '',
      successfulActivities: [],
      challengingAreas: [],
      motivators: []
    });
    
    toast({
      title: "Perfil resetado",
      description: "As configurações foram restauradas aos valores padrão."
    });
  };

  const saveProfile = () => {
    onProfileSave(profile);
    toast({
      title: "Perfil TEA salvo",
      description: "Suas preferências foram salvas e serão usadas para personalizar as recomendações."
    });
  };

  const getSensoryLevelLabel = (value: number): string => {
    if (value < 30) return 'Baixa tolerância';
    if (value < 70) return 'Tolerância moderada';
    return 'Alta tolerância';
  };

  const getSensoryLevelColor = (value: number): string => {
    if (value < 30) return 'text-red-600';
    if (value < 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>Personalização TEA</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetToDefaults}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Resetar
            </Button>
            <Button size="sm" onClick={saveProfile}>
              <Save className="h-4 w-4 mr-1" />
              Salvar Perfil
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Nível de Suporte */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Nível de Suporte no Espectro</Label>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map(level => (
              <Card
                key={level}
                className={`cursor-pointer transition-colors ${
                  profile.supportLevel === level 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => updateProfile('supportLevel', level)}
              >
                <CardContent className="p-4 text-center">
                  <div className="font-medium">Nível {level}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {level === 1 ? 'Suporte Mínimo' : 
                     level === 2 ? 'Suporte Substancial' : 'Suporte Intenso'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        {/* Perfil Sensorial */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <Label className="text-base font-medium">Perfil Sensorial</Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tolerância Auditiva */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm">Tolerância Auditiva</Label>
                <Badge className={getSensoryLevelColor(profile.sensoryProfile.auditoryTolerance)}>
                  {getSensoryLevelLabel(profile.sensoryProfile.auditoryTolerance)}
                </Badge>
              </div>
              <Slider
                value={[profile.sensoryProfile.auditoryTolerance]}
                onValueChange={(value) => updateSensoryProfile('auditoryTolerance', value[0])}
                max={100}
                step={10}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground">
                0 = Muito sensível a sons | 100 = Tolera sons altos
              </div>
            </div>

            {/* Tolerância Visual */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm">Tolerância Visual</Label>
                <Badge className={getSensoryLevelColor(profile.sensoryProfile.visualTolerance)}>
                  {getSensoryLevelLabel(profile.sensoryProfile.visualTolerance)}
                </Badge>
              </div>
              <Slider
                value={[profile.sensoryProfile.visualTolerance]}
                onValueChange={(value) => updateSensoryProfile('visualTolerance', value[0])}
                max={100}
                step={10}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground">
                0 = Prefere pouco estímulo visual | 100 = Tolera muitos estímulos
              </div>
            </div>

            {/* Tolerância Tátil */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm">Tolerância Tátil</Label>
                <Badge className={getSensoryLevelColor(profile.sensoryProfile.tactileTolerance)}>
                  {getSensoryLevelLabel(profile.sensoryProfile.tactileTolerance)}
                </Badge>
              </div>
              <Slider
                value={[profile.sensoryProfile.tactileTolerance]}
                onValueChange={(value) => updateSensoryProfile('tactileTolerance', value[0])}
                max={100}
                step={10}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground">
                0 = Evita texturas | 100 = Gosta de explorar texturas
              </div>
            </div>

            {/* Preferência de Movimento */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm">Necessidade de Movimento</Label>
                <Badge className={getSensoryLevelColor(profile.sensoryProfile.movementPreference)}>
                  {profile.sensoryProfile.movementPreference < 30 ? 'Prefere calma' :
                   profile.sensoryProfile.movementPreference < 70 ? 'Movimento moderado' : 'Muito ativo'}
                </Badge>
              </div>
              <Slider
                value={[profile.sensoryProfile.movementPreference]}
                onValueChange={(value) => updateSensoryProfile('movementPreference', value[0])}
                max={100}
                step={10}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground">
                0 = Prefere atividades calmas | 100 = Precisa de muito movimento
              </div>
            </div>
          </div>

          {/* Necessidade de Previsibilidade */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm">Necessidade de Estrutura/Previsibilidade</Label>
              <Badge className={getSensoryLevelColor(100 - profile.sensoryProfile.predictabilityNeed)}>
                {profile.sensoryProfile.predictabilityNeed > 70 ? 'Alta necessidade' :
                 profile.sensoryProfile.predictabilityNeed > 40 ? 'Necessidade moderada' : 'Flexível'}
              </Badge>
            </div>
            <Slider
              value={[profile.sensoryProfile.predictabilityNeed]}
              onValueChange={(value) => updateSensoryProfile('predictabilityNeed', value[0])}
              max={100}
              step={10}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground">
              0 = Muito flexível | 100 = Precisa de alta estrutura e previsibilidade
            </div>
          </div>
        </div>

        <Separator />

        {/* Preferências de Comunicação */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Preferências de Comunicação</Label>
          
          {/* Estilo Principal */}
          <div className="space-y-2">
            <Label className="text-sm">Estilo Principal de Comunicação</Label>
            <div className="flex gap-2">
              {[
                { value: 'verbal', label: 'Verbal' },
                { value: 'non-verbal', label: 'Não-verbal' },
                { value: 'mixed', label: 'Misto' }
              ].map(style => (
                <Badge
                  key={style.value}
                  variant={profile.communicationPreferences.primaryStyle === style.value ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => updateCommunicationPreferences('primaryStyle', style.value)}
                >
                  {style.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Duração Preferida de Interação */}
          <div className="space-y-3">
            <Label className="text-sm">
              Duração Preferida de Interação: {profile.communicationPreferences.preferredInteractionDuration} minutos
            </Label>
            <Slider
              value={[profile.communicationPreferences.preferredInteractionDuration]}
              onValueChange={(value) => updateCommunicationPreferences('preferredInteractionDuration', value[0])}
              min={5}
              max={60}
              step={5}
              className="w-full"
            />
          </div>

          {/* Switches */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Usar Apoios Visuais</Label>
              <Switch
                checked={profile.communicationPreferences.useVisualSupports}
                onCheckedChange={(checked) => updateCommunicationPreferences('useVisualSupports', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-sm">Precisa de Tempo Extra para Processar</Label>
              <Switch
                checked={profile.communicationPreferences.needsProcessingTime}
                onCheckedChange={(checked) => updateCommunicationPreferences('needsProcessingTime', checked)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Necessidades Específicas */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Necessidades e Observações Específicas</Label>
          <Textarea
            placeholder="Descreva necessidades específicas, sensibilidades particulares, estratégias que funcionam bem, etc."
            value={profile.specificNeeds}
            onChange={(e) => updateProfile('specificNeeds', e.target.value)}
            rows={4}
          />
        </div>

        {/* Resumo do Perfil */}
        <Card className="bg-gray-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Resumo do Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Nível de Suporte:</span> Nível {profile.supportLevel}
              </div>
              <div>
                <span className="font-medium">Comunicação:</span> {
                  profile.communicationPreferences.primaryStyle === 'verbal' ? 'Verbal' :
                  profile.communicationPreferences.primaryStyle === 'non-verbal' ? 'Não-verbal' : 'Misto'
                }
              </div>
              <div>
                <span className="font-medium">Sensibilidade Auditiva:</span> {getSensoryLevelLabel(profile.sensoryProfile.auditoryTolerance)}
              </div>
              <div>
                <span className="font-medium">Necessidade de Estrutura:</span> {
                  profile.sensoryProfile.predictabilityNeed > 70 ? 'Alta' :
                  profile.sensoryProfile.predictabilityNeed > 40 ? 'Moderada' : 'Baixa'
                }
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}