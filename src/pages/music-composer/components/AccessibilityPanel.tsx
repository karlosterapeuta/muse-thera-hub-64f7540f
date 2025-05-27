
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Accessibility,
  Eye,
  Ear,
  Hand,
  Brain,
  Palette,
  Volume2,
  MousePointer,
  Keyboard,
  Monitor,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  slowAnimations: boolean;
  soundFeedback: boolean;
  vibration: boolean;
  voiceNarration: boolean;
  simplifiedInterface: boolean;
  colorBlindMode: string;
  textSize: number;
  soundVolume: number;
  animationSpeed: number;
  buttonSize: number;
}

interface AccessibilityPanelProps {
  settings: AccessibilitySettings;
  onSettingsChange: (settings: AccessibilitySettings) => void;
}

const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  settings,
  onSettingsChange
}) => {
  const [activeTab, setActiveTab] = useState<string>("visual");
  const { toast } = useToast();

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    onSettingsChange(newSettings);
    
    toast({
      title: "✅ Configuração atualizada",
      description: "As configurações de acessibilidade foram aplicadas.",
    });
  };

  const colorBlindModes = [
    { id: "none", name: "Normal", description: "Visão normal das cores" },
    { id: "protanopia", name: "Protanopia", description: "Dificuldade com vermelho" },
    { id: "deuteranopia", name: "Deuteranopia", description: "Dificuldade com verde" },
    { id: "tritanopia", name: "Tritanopia", description: "Dificuldade com azul" }
  ];

  const tabs = [
    { id: "visual", name: "👁️ Visual", icon: Eye },
    { id: "auditory", name: "👂 Auditivo", icon: Ear },
    { id: "motor", name: "✋ Motor", icon: Hand },
    { id: "cognitive", name: "🧠 Cognitivo", icon: Brain }
  ];

  const resetToDefaults = () => {
    const defaultSettings: AccessibilitySettings = {
      highContrast: false,
      largeText: false,
      slowAnimations: false,
      soundFeedback: true,
      vibration: false,
      voiceNarration: false,
      simplifiedInterface: false,
      colorBlindMode: "none",
      textSize: 16,
      soundVolume: 70,
      animationSpeed: 100,
      buttonSize: 48
    };
    
    onSettingsChange(defaultSettings);
    toast({
      title: "🔄 Configurações restauradas",
      description: "Todas as configurações foram restauradas aos valores padrão.",
    });
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-2xl">
      
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-800 mb-2 flex items-center justify-center">
          <Accessibility className="w-8 h-8 mr-3" />
          ♿ Painel de Acessibilidade TEA
        </h2>
        <p className="text-indigo-600">Personalize a experiência para necessidades especiais</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center mb-6 bg-white rounded-xl p-2 shadow-lg">
        {tabs.map(tab => {
          const IconComponent = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className={`m-1 ${
                activeTab === tab.id 
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white" 
                  : "text-indigo-700 hover:bg-indigo-100"
              }`}
            >
              <IconComponent className="w-5 h-5 mr-2" />
              {tab.name}
            </Button>
          );
        })}
      </div>

      {/* Visual Settings */}
      {activeTab === "visual" && (
        <div className="space-y-6">
          <Card className="border-2 border-indigo-200">
            <CardHeader className="bg-gradient-to-r from-indigo-100 to-indigo-200">
              <CardTitle className="flex items-center text-indigo-800">
                <Eye className="w-6 h-6 mr-2" />
                👁️ Configurações Visuais
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Alto Contraste */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-bold text-gray-800">🌓 Alto Contraste</div>
                  <div className="text-sm text-gray-600">Aumenta o contraste das cores para melhor visibilidade</div>
                </div>
                <Switch
                  checked={settings.highContrast}
                  onCheckedChange={(value) => updateSetting("highContrast", value)}
                />
              </div>

              {/* Texto Grande */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-bold text-gray-800">📝 Texto Ampliado</div>
                  <div className="text-sm text-gray-600">Aumenta o tamanho do texto em toda a interface</div>
                </div>
                <Switch
                  checked={settings.largeText}
                  onCheckedChange={(value) => updateSetting("largeText", value)}
                />
              </div>

              {/* Tamanho do Texto */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-gray-800">📏 Tamanho do Texto: {settings.textSize}px</span>
                </div>
                <Slider
                  value={[settings.textSize]}
                  onValueChange={(value) => updateSetting("textSize", value[0])}
                  min={12}
                  max={24}
                  step={2}
                  className="w-full"
                />
              </div>

              {/* Modo Daltonismo */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="font-bold text-gray-800 mb-3">🎨 Suporte para Daltonismo</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {colorBlindModes.map(mode => (
                    <Button
                      key={mode.id}
                      variant={settings.colorBlindMode === mode.id ? "default" : "outline"}
                      onClick={() => updateSetting("colorBlindMode", mode.id)}
                      className="p-3 h-auto flex flex-col items-start"
                    >
                      <span className="font-bold">{mode.name}</span>
                      <span className="text-xs opacity-80">{mode.description}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Audio Settings */}
      {activeTab === "auditory" && (
        <div className="space-y-6">
          <Card className="border-2 border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-100 to-green-200">
              <CardTitle className="flex items-center text-green-800">
                <Ear className="w-6 h-6 mr-2" />
                👂 Configurações Auditivas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Feedback Sonoro */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-bold text-gray-800">🔊 Feedback Sonoro</div>
                  <div className="text-sm text-gray-600">Sons de confirmação para ações da interface</div>
                </div>
                <Switch
                  checked={settings.soundFeedback}
                  onCheckedChange={(value) => updateSetting("soundFeedback", value)}
                />
              </div>

              {/* Narração por Voz */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-bold text-gray-800">🗣️ Narração por Voz</div>
                  <div className="text-sm text-gray-600">Lê em voz alta elementos da interface</div>
                </div>
                <Switch
                  checked={settings.voiceNarration}
                  onCheckedChange={(value) => updateSetting("voiceNarration", value)}
                />
              </div>

              {/* Volume dos Sons */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-gray-800 flex items-center">
                    <Volume2 className="w-5 h-5 mr-2" />
                    Volume: {settings.soundVolume}%
                  </span>
                </div>
                <Slider
                  value={[settings.soundVolume]}
                  onValueChange={(value) => updateSetting("soundVolume", value[0])}
                  min={0}
                  max={100}
                  step={10}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Motor Settings */}
      {activeTab === "motor" && (
        <div className="space-y-6">
          <Card className="border-2 border-orange-200">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-orange-200">
              <CardTitle className="flex items-center text-orange-800">
                <Hand className="w-6 h-6 mr-2" />
                ✋ Configurações Motoras
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Vibração */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-bold text-gray-800">📳 Feedback Tátil (Vibração)</div>
                  <div className="text-sm text-gray-600">Vibração ao tocar botões (dispositivos compatíveis)</div>
                </div>
                <Switch
                  checked={settings.vibration}
                  onCheckedChange={(value) => updateSetting("vibration", value)}
                />
              </div>

              {/* Tamanho dos Botões */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-gray-800 flex items-center">
                    <MousePointer className="w-5 h-5 mr-2" />
                    Tamanho dos Botões: {settings.buttonSize}px
                  </span>
                </div>
                <Slider
                  value={[settings.buttonSize]}
                  onValueChange={(value) => updateSetting("buttonSize", value[0])}
                  min={32}
                  max={72}
                  step={8}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Pequeno</span>
                  <span>Grande</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cognitive Settings */}
      {activeTab === "cognitive" && (
        <div className="space-y-6">
          <Card className="border-2 border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-200">
              <CardTitle className="flex items-center text-purple-800">
                <Brain className="w-6 h-6 mr-2" />
                🧠 Configurações Cognitivas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Interface Simplificada */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-bold text-gray-800">🎯 Interface Simplificada</div>
                  <div className="text-sm text-gray-600">Remove elementos desnecessários da tela</div>
                </div>
                <Switch
                  checked={settings.simplifiedInterface}
                  onCheckedChange={(value) => updateSetting("simplifiedInterface", value)}
                />
              </div>

              {/* Animações Lentas */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-bold text-gray-800">🐌 Animações Suaves</div>
                  <div className="text-sm text-gray-600">Reduz a velocidade das animações</div>
                </div>
                <Switch
                  checked={settings.slowAnimations}
                  onCheckedChange={(value) => updateSetting("slowAnimations", value)}
                />
              </div>

              {/* Velocidade das Animações */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-gray-800">⚡ Velocidade das Animações: {settings.animationSpeed}%</span>
                </div>
                <Slider
                  value={[settings.animationSpeed]}
                  onValueChange={(value) => updateSetting("animationSpeed", value[0])}
                  min={25}
                  max={200}
                  step={25}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Muito Lento</span>
                  <span>Normal</span>
                  <span>Rápido</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <Button
          onClick={resetToDefaults}
          variant="outline"
          className="border-2 border-gray-400 text-gray-700 hover:bg-gray-50"
        >
          <Settings className="w-5 h-5 mr-2" />
          Restaurar Padrão
        </Button>
        
        <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
          <Accessibility className="w-5 h-5 mr-2" />
          Salvar Configurações
        </Button>
      </div>

      {/* Info Panel */}
      <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <div className="flex items-center mb-2">
          <Monitor className="w-6 h-6 text-blue-600 mr-2" />
          <span className="font-bold text-blue-800">💡 Dicas de Acessibilidade</span>
        </div>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use o <strong>modo Alto Contraste</strong> para melhor visibilidade</li>
          <li>• Ative a <strong>Narração por Voz</strong> para orientação auditiva</li>
          <li>• Configure o <strong>tamanho dos botões</strong> para facilitar o toque</li>
          <li>• Use a <strong>Interface Simplificada</strong> para reduzir distrações</li>
        </ul>
      </div>
    </div>
  );
};

export default AccessibilityPanel;
