import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Waves, 
  Play, 
  Square, 
  Volume2, 
  Music, 
  Brain, 
  CloudRain, 
  Download 
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  playBinauralBeat, 
  stopAllAudio, 
  updateBackgroundVolume, 
  updateBinauralVolume,
  therapeuticFrequencies, 
  BackgroundSoundType 
} from "@/utils/audioUtils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Frequências cerebrais em Hz
const brainwaveFrequencies = {
  delta: { min: 0.5, max: 4, default: 2, description: "Sono profundo, cicatrização, regeneração" },
  theta: { min: 4, max: 8, default: 6, description: "Sono REM, meditação profunda, criatividade" },
  alpha: { min: 8, max: 14, default: 10, description: "Relaxamento, calma, aprendizado fácil" },
  beta: { min: 14, max: 30, default: 20, description: "Concentração, foco, atividade mental" },
  gamma: { min: 30, max: 100, default: 40, description: "Processamento cognitivo de alto nível" }
};

export default function BinauralFrequencies() {
  // General state
  const [mainTab, setMainTab] = useState("tea");
  const [activeTab, setActiveTab] = useState("alpha");
  const [isPlaying, setIsPlaying] = useState(false);
  
  // General binaural beat parameters
  const [frequency, setFrequency] = useState(brainwaveFrequencies.alpha.default);
  const [duration, setDuration] = useState(15); // Duração em minutos
  const [volume, setVolume] = useState(60);
  
  // Advanced parameters
  const [leftFrequency, setLeftFrequency] = useState(200);
  const [rightFrequency, setRightFrequency] = useState(205);
  const [backgroundSound, setBackgroundSound] = useState<BackgroundSoundType>("none");
  const [backgroundVolume, setBackgroundVolume] = useState(30);
  const [customPresetName, setCustomPresetName] = useState("");
  const [customPresetNotes, setCustomPresetNotes] = useState("");
  
  // TEA-specific state
  const [teaProfile, setTeaProfile] = useState("alpha");
  
  // Mental health specific state
  const [mentalHealthProfile, setMentalHealthProfile] = useState("anxiety");

  // Limpa o áudio quando o componente é desmontado
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const handlePlay = () => {
    if (isPlaying) {
      stopAllAudio();
      setIsPlaying(false);
      return;
    }
    
    let success = false;
    
    // Calculate the actual frequencies to use based on the tab
    const volumeNormalized = volume / 100;
    const durationMs = duration * 60000; // Convert minutes to ms
    const bgVolumeNormalized = backgroundVolume / 100;
    
    if (mainTab === "advanced") {
      // For advanced tab, use the explicitly set left/right frequencies
      success = playBinauralBeat(
        leftFrequency, 
        rightFrequency, 
        durationMs, 
        volumeNormalized,
        backgroundSound,
        bgVolumeNormalized
      );
    }
    else if (mainTab === "tea") {
      // For TEA tab, use the therapeutic frequencies for autism
      const freqs = therapeuticFrequencies.autism[teaProfile as keyof typeof therapeuticFrequencies.autism];
      success = playBinauralBeat(
        freqs.left,
        freqs.right,
        durationMs,
        volumeNormalized,
        backgroundSound,
        bgVolumeNormalized
      );
    }
    else if (mainTab === "mental") {
      // For mental health tab, use the therapeutic frequencies for mental health
      const freqs = therapeuticFrequencies.mentalHealth[mentalHealthProfile as keyof typeof therapeuticFrequencies.mentalHealth];
      success = playBinauralBeat(
        freqs.left,
        freqs.right,
        durationMs,
        volumeNormalized,
        backgroundSound,
        bgVolumeNormalized
      );
    }
    
    setIsPlaying(success);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    // Atualiza o volume em tempo real mesmo durante a reprodução
    updateBinauralVolume(newVolume / 100);
  };

  const handleBackgroundVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setBackgroundVolume(newVolume);
    updateBackgroundVolume(newVolume / 100);
  };

  const generateDownloadLink = () => {
    // In a real implementation, this would generate an actual audio file
    // For now, we'll just show an alert
    alert("Esta funcionalidade requer implementação de servidor para gerar arquivos de áudio. Na versão atual, use a reprodução online.");
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6 text-primary flex items-center gap-2">
        <Waves className="h-8 w-8" />
        Frequências Binaurais
      </h1>
      
      <Tabs value={mainTab} onValueChange={setMainTab} className="w-full mb-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="tea">
            <Brain className="mr-2 h-4 w-4" />
            TEA
          </TabsTrigger>
          <TabsTrigger value="mental">
            <Music className="mr-2 h-4 w-4" />
            Transtornos Mentais
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Music className="mr-2 h-4 w-4" />
            Avançado
          </TabsTrigger>
        </TabsList>
        
        {/* TEA Tab Content */}
        <TabsContent value="tea" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Frequências Binaurais para TEA</CardTitle>
                <CardDescription>
                  Frequências específicas otimizadas para ajudar pessoas com Transtorno do Espectro Autista
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Label className="mb-2 block">Selecione o perfil TEA:</Label>
                  <ToggleGroup type="single" value={teaProfile} onValueChange={(value) => value && setTeaProfile(value)} className="flex flex-wrap gap-2">
                    <ToggleGroupItem value="alpha" className="flex-grow">Alpha - Redução de Ansiedade</ToggleGroupItem>
                    <ToggleGroupItem value="theta" className="flex-grow">Theta - Hipersensibilidade</ToggleGroupItem>
                    <ToggleGroupItem value="delta" className="flex-grow">Delta - Agitação/Sono</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                <Card className="mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Configuração atual</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Frequência Esquerda:</p>
                        <p className="text-xl font-bold">{therapeuticFrequencies.autism[teaProfile as keyof typeof therapeuticFrequencies.autism].left} Hz</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Frequência Direita:</p>
                        <p className="text-xl font-bold">{therapeuticFrequencies.autism[teaProfile as keyof typeof therapeuticFrequencies.autism].right} Hz</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-medium">Benefício:</p>
                        <p className="text-sm">{therapeuticFrequencies.autism[teaProfile as keyof typeof therapeuticFrequencies.autism].description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Common controls: Duration, volume, background */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Duração: {duration} min</Label>
                      <span className="text-sm text-muted-foreground">1 - 60 min</span>
                    </div>
                    <Slider
                      value={[duration]}
                      min={1}
                      max={60}
                      step={1}
                      onValueChange={(value) => setDuration(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Volume: {volume}%</Label>
                      <span className="text-sm text-muted-foreground">
                        <Volume2 className="h-4 w-4 inline-block mr-1" />
                      </span>
                    </div>
                    <Slider
                      value={[volume]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                    />
                  </div>
                  
                  {/* Background Sound Controls */}
                  <div className="space-y-2 pt-4 border-t">
                    <Label>Som de Fundo</Label>
                    <Select 
                      value={backgroundSound} 
                      onValueChange={(value) => setBackgroundSound(value as BackgroundSoundType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um som de fundo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sem som de fundo</SelectItem>
                        <SelectItem value="rain">Chuva</SelectItem>
                        <SelectItem value="whitenoise">Ruído Branco</SelectItem>
                        <SelectItem value="ocean">Ondas do Oceano</SelectItem>
                        <SelectItem value="forest">Floresta</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {backgroundSound !== 'none' && (
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between">
                          <Label>Volume do Fundo: {backgroundVolume}%</Label>
                          <CloudRain className="h-4 w-4" />
                        </div>
                        <Slider
                          value={[backgroundVolume]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={handleBackgroundVolumeChange}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      className="w-full" 
                      onClick={handlePlay}
                      size="lg"
                    >
                      {isPlaying ? (
                        <>
                          <Square className="mr-2 h-5 w-5" /> Parar
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-5 w-5" /> Iniciar
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      className="w-full" 
                      onClick={generateDownloadLink}
                      variant="outline"
                      size="lg"
                    >
                      <Download className="mr-2 h-5 w-5" /> Exportar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Uso de Frequências Binaurais para TEA</CardTitle>
                <CardDescription>
                  Como as frequências binaurais podem auxiliar pessoas com TEA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">Redução de Ansiedade</h3>
                  <p className="text-sm">Frequências alpha (8-14 Hz) podem ajudar a reduzir os sentimentos de ansiedade comuns em pessoas com TEA, promovendo um estado de calma sem sonolência.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Hipersensibilidade Sensorial</h3>
                  <p className="text-sm">Frequências theta (4-8 Hz) podem reduzir o processamento sensorial excessivo, ajudando a diminuir a sobrecarga sensorial e aumentando a tolerância a estímulos.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Dificuldades de Sono</h3>
                  <p className="text-sm">Frequências delta (0.5-4 Hz) podem auxiliar no estabelecimento de rotinas de sono mais saudáveis, especialmente benéficas para pessoas com TEA que frequentemente apresentam distúrbios do sono.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Foco e Concentração</h3>
                  <p className="text-sm">Frequências específicas na faixa beta podem auxiliar no aumento da concentração para tarefas específicas, potencialmente ajudando em atividades educacionais e terapêuticas.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Autorregulação</h3>
                  <p className="text-sm">A exposição regular a frequências específicas pode ajudar a desenvolver melhores capacidades de autorregulação, potencialmente reduzindo comportamentos repetitivos ou estereotipados.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Transições e Mudanças de Rotina</h3>
                  <p className="text-sm">Certos ritmos binaurais podem facilitar transições entre atividades, reduzindo o estresse associado a mudanças na rotina, uma dificuldade comum em pessoas com TEA.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Comunicação Social</h3>
                  <p className="text-sm">Frequências específicas podem potencializar sessões de terapia focadas na comunicação social, facilitando a abertura para interações e o processamento de pistas sociais.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Integração Sensorial</h3>
                  <p className="text-sm">Batidas binaurais podem complementar terapias de integração sensorial, ajudando o cérebro a processar e integrar informações sensoriais de forma mais eficiente.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Processamento Emocional</h3>
                  <p className="text-sm">Determinadas frequências podem facilitar o processamento e a expressão emocional, área frequentemente desafiadora para pessoas com TEA.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Redução de Comportamentos Repetitivos</h3>
                  <p className="text-sm">A combinação de frequências específicas pode ajudar a diminuir a intensidade de comportamentos repetitivos ou estereotipados, especialmente quando usada regularmente.</p>
                </div>
                
                <div className="pt-4 mt-4 border-t">
                  <p className="text-xs text-muted-foreground italic">Nota: Os efeitos das frequências binaurais variam de pessoa para pessoa. Sempre consulte um profissional de saúde qualificado antes de iniciar qualquer intervenção terapêutica para TEA.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Mental Health Tab Content */}
        <TabsContent value="mental" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Frequências para Transtornos Mentais</CardTitle>
                <CardDescription>
                  Frequências binaurais específicas que podem auxiliar em diferentes condições de saúde mental
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Label className="mb-2 block">Selecione o perfil de saúde mental:</Label>
                  <ToggleGroup type="single" value={mentalHealthProfile} onValueChange={(value) => value && setMentalHealthProfile(value)} className="flex flex-wrap gap-2">
                    <ToggleGroupItem value="anxiety" className="flex-grow">Ansiedade</ToggleGroupItem>
                    <ToggleGroupItem value="depression" className="flex-grow">Depressão</ToggleGroupItem>
                    <ToggleGroupItem value="adhd" className="flex-grow">TDAH</ToggleGroupItem>
                    <ToggleGroupItem value="stress" className="flex-grow">Estresse</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                
                <Card className="mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Configuração atual</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Frequência Esquerda:</p>
                        <p className="text-xl font-bold">{therapeuticFrequencies.mentalHealth[mentalHealthProfile as keyof typeof therapeuticFrequencies.mentalHealth].left} Hz</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Frequência Direita:</p>
                        <p className="text-xl font-bold">{therapeuticFrequencies.mentalHealth[mentalHealthProfile as keyof typeof therapeuticFrequencies.mentalHealth].right} Hz</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-medium">Benefício:</p>
                        <p className="text-sm">{therapeuticFrequencies.mentalHealth[mentalHealthProfile as keyof typeof therapeuticFrequencies.mentalHealth].description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Common controls: Duration, volume, background */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Duração: {duration} min</Label>
                      <span className="text-sm text-muted-foreground">1 - 60 min</span>
                    </div>
                    <Slider
                      value={[duration]}
                      min={1}
                      max={60}
                      step={1}
                      onValueChange={(value) => setDuration(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Volume: {volume}%</Label>
                      <span className="text-sm text-muted-foreground">
                        <Volume2 className="h-4 w-4 inline-block mr-1" />
                      </span>
                    </div>
                    <Slider
                      value={[volume]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                    />
                  </div>
                  
                  {/* Background Sound Controls */}
                  <div className="space-y-2 pt-4 border-t">
                    <Label>Som de Fundo</Label>
                    <Select 
                      value={backgroundSound} 
                      onValueChange={(value) => setBackgroundSound(value as BackgroundSoundType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um som de fundo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sem som de fundo</SelectItem>
                        <SelectItem value="rain">Chuva</SelectItem>
                        <SelectItem value="whitenoise">Ruído Branco</SelectItem>
                        <SelectItem value="ocean">Ondas do Oceano</SelectItem>
                        <SelectItem value="forest">Floresta</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {backgroundSound !== 'none' && (
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between">
                          <Label>Volume do Fundo: {backgroundVolume}%</Label>
                          <CloudRain className="h-4 w-4" />
                        </div>
                        <Slider
                          value={[backgroundVolume]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={handleBackgroundVolumeChange}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      className="w-full" 
                      onClick={handlePlay}
                      size="lg"
                    >
                      {isPlaying ? (
                        <>
                          <Square className="mr-2 h-5 w-5" /> Parar
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-5 w-5" /> Iniciar
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      className="w-full" 
                      onClick={generateDownloadLink}
                      variant="outline"
                      size="lg"
                    >
                      <Download className="mr-2 h-5 w-5" /> Exportar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Benefícios para Saúde Mental</CardTitle>
                <CardDescription>
                  Como as frequências binaurais podem auxiliar em diferentes transtornos mentais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">Ansiedade</h3>
                  <p className="text-sm">Frequências específicas podem promover relaxamento e reduzir os sintomas de ansiedade, estimulando ondas cerebrais associadas à calma e ao equilíbrio emocional.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Depressão</h3>
                  <p className="text-sm">Determinadas frequências podem ajudar a estimular a produção de neurotransmissores associados ao bem-estar, melhorando o humor e reduzindo sintomas depressivos.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">TDAH</h3>
                  <p className="text-sm">Frequências beta específicas podem auxiliar no aumento da concentração e do foco, enquanto reduzem a inquietação e a impulsividade características do TDAH.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Estresse</h3>
                  <p className="text-sm">Frequências mais baixas podem induzir um estado de relaxamento profundo, reduzindo os níveis de cortisol e ajudando o corpo a recuperar-se dos efeitos do estresse crônico.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Insônia</h3>
                  <p className="text-sm">Frequências delta podem ajudar a regular o ciclo de sono, facilitando o adormecimento e melhorando a qualidade do descanso em pessoas com distúrbios do sono.</p>
                </div>
                
                <div className="pt-4 mt-4 border-t">
                  <p className="text-xs text-muted-foreground italic">Nota: As frequências binaurais não substituem o tratamento médico convencional. Sempre consulte um profissional de saúde mental antes de utilizar estas frequências como complemento ao seu tratamento.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Advanced Tab Content */}
        <TabsContent value="advanced" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Configuração Avançada</CardTitle>
                <CardDescription>
                  Configure precisamente frequências específicas para cada ouvido e outras opções avançadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label>Frequência Ouvido Esquerdo (Hz)</Label>
                    <Input 
                      type="number" 
                      value={leftFrequency}
                      min={20}
                      max={1000}
                      onChange={(e) => setLeftFrequency(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Frequência Ouvido Direito (Hz)</Label>
                    <Input 
                      type="number" 
                      value={rightFrequency}
                      min={20}
                      max={1000}
                      onChange={(e) => setRightFrequency(Number(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Diferença de batida: {Math.abs(rightFrequency - leftFrequency).toFixed(1)} Hz</Label>
                    <span className="text-sm text-muted-foreground">
                      Efeito: {getEffectDescription(Math.abs(rightFrequency - leftFrequency))}
                    </span>
                  </div>
                  <div className="p-3 bg-muted rounded-md text-sm">
                    {getBeatFrequencyExplanation(Math.abs(rightFrequency - leftFrequency))}
                  </div>
                </div>
                
                {/* Custom presets feature */}
                <div className="space-y-4 mb-6 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <Label>Salvar como predefinição personalizada</Label>
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Nome da predefinição"
                      value={customPresetName}
                      onChange={(e) => setCustomPresetName(e.target.value)}
                    />
                    <Textarea
                      placeholder="Notas (opcional)"
                      value={customPresetNotes}
                      onChange={(e) => setCustomPresetNotes(e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      onClick={() => alert("Funcionalidade em desenvolvimento: Esta opção de salvar predefinições personalizadas estará disponível em breve.")}
                    >
                      Salvar Predefinição
                    </Button>
                  </div>
                </div>
                
                {/* Common controls: Duration, volume, background */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Duração: {duration} min</Label>
                      <span className="text-sm text-muted-foreground">1 - 60 min</span>
                    </div>
                    <Slider
                      value={[duration]}
                      min={1}
                      max={60}
                      step={1}
                      onValueChange={(value) => setDuration(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Volume: {volume}%</Label>
                      <span className="text-sm text-muted-foreground">
                        <Volume2 className="h-4 w-4 inline-block mr-1" />
                      </span>
                    </div>
                    <Slider
                      value={[volume]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                    />
                  </div>
                  
                  {/* Background Sound Controls */}
                  <div className="space-y-2 pt-4 border-t">
                    <Label>Som de Fundo</Label>
                    <Select 
                      value={backgroundSound} 
                      onValueChange={(value) => setBackgroundSound(value as BackgroundSoundType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um som de fundo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sem som de fundo</SelectItem>
                        <SelectItem value="rain">Chuva</SelectItem>
                        <SelectItem value="whitenoise">Ruído Branco</SelectItem>
                        <SelectItem value="ocean">Ondas do Oceano</SelectItem>
                        <SelectItem value="forest">Floresta</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {backgroundSound !== 'none' && (
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between">
                          <Label>Volume do Fundo: {backgroundVolume}%</Label>
                          <CloudRain className="h-4 w-4" />
                        </div>
                        <Slider
                          value={[backgroundVolume]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={handleBackgroundVolumeChange}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      className="w-full" 
                      onClick={handlePlay}
                      size="lg"
                    >
                      {isPlaying ? (
                        <>
                          <Square className="mr-2 h-5 w-5" /> Parar
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-5 w-5" /> Iniciar
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      className="w-full" 
                      onClick={generateDownloadLink}
                      variant="outline"
                      size="lg"
                    >
                      <Download className="mr-2 h-5 w-5" /> Exportar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Uso Avançado de Frequências Binaurais</CardTitle>
                <CardDescription>
                  Informações técnicas sobre frequências binaurais e seus efeitos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">O que são Batidas Binaurais?</h3>
                  <p className="text-sm">Quando duas frequências ligeiramente diferentes são apresentadas separadamente a cada ouvido, o cérebro percebe uma terceira frequência pulsante igual à diferença entre as duas. Esta é a batida binaural.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Princípio de Funcionamento</h3>
                  <p className="text-sm">O tronco cerebral sincroniza com esta diferença de frequência através de um processo chamado "resposta de acompanhamento de frequência". Isso pode induzir estados cerebrais específicos, dependendo da frequência da batida.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Cálculo de Batida</h3>
                  <p className="text-sm">Frequência de Batida = |Frequência Direita - Frequência Esquerda|<br/>
                  Exemplo: 205 Hz (direita) - 200 Hz (esquerda) = 5 Hz (batida theta)</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Portadora vs. Frequência de Batida</h3>
                  <p className="text-sm">A "portadora" é a média das duas frequências (ex: 200 + 205 / 2 = 202,5 Hz). Portadoras entre 100-300 Hz são mais eficazes para criar batidas binaurais perceptíveis.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">Personalização Terapêutica</h3>
                  <p className="text-sm">A capacidade de ajustar precisamente as frequências permite personalizar o tratamento para necessidades específicas, maximizando o potencial terapêutico.</p>
                </div>
                
                <div className="pt-4 mt-4 border-t">
                  <p className="text-xs text-muted-foreground italic">Nota: Para obter o máximo benefício, use fones de ouvido estéreo de boa qualidade e pratique em um ambiente tranquilo, livre de distrações.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper functions for the advanced tab
function getEffectDescription(beatFrequency: number): string {
  if (beatFrequency <= 4) return "Delta (sono profundo)";
  if (beatFrequency <= 8) return "Theta (meditação)";
  if (beatFrequency <= 14) return "Alpha (relaxamento)";
  if (beatFrequency <= 30) return "Beta (concentração)";
  return "Gamma (processamento cognitivo)";
}

function getBeatFrequencyExplanation(beatFrequency: number): string {
  if (beatFrequency <= 4) {
    return "Esta diferença produz batidas Delta (0.5-4 Hz), associadas com sono profundo, cicatrização e regeneração. Útil para insônia e recuperação física.";
  }
  if (beatFrequency <= 8) {
    return "Esta diferença produz batidas Theta (4-8 Hz), associadas com meditação profunda, criatividade e sono REM. Útil para relaxamento profundo e acesso ao subconsciente.";
  }
  if (beatFrequency <= 14) {
    return "Esta diferença produz batidas Alpha (8-14 Hz), associadas com relaxamento, calma e aprendizado fácil. Útil para redução de estresse e melhora da concentração.";
  }
  if (beatFrequency <= 30) {
    return "Esta diferença produz batidas Beta (14-30 Hz), associadas com concentração, foco e atividade mental. Útil para atividades que exigem atenção e processamento cognitivo.";
  }
  return "Esta diferença produz batidas Gamma (30+ Hz), associadas com processamento cognitivo de alto nível e estados de consciência expandida. Útil para resolução de problemas complexos.";
}
