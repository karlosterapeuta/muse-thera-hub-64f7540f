
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SelectField } from "@/pages/anamnesis/components/SelectField";
import {
  Play,
  Square,
  Waves,
  CloudRain,
  Trees,
  Music,
  VolumeX,
  Volume,
  Volume1,
  Volume2,
  Info,
  Headphones,
  Ear
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  playBinauralBeat, 
  stopAllAudio, 
  updateBackgroundVolume, 
  updateBinauralVolume,
  therapeuticFrequencies, 
  BackgroundSoundType 
} from "@/utils/audioUtils";

// Convert the therapeutic frequencies object to an array for easier use in the UI
const therapeuticFrequenciesArray = [
  ...Object.entries(therapeuticFrequencies.autism).map(([key, item]) => ({
    value: `autism_${key}`,
    name: `TEA - ${key.charAt(0).toUpperCase() + key.slice(1)}`,
    description: item.description,
    baseFrequency: item.left,
    binauralBeat: item.right - item.left
  })),
  ...Object.entries(therapeuticFrequencies.mentalHealth).map(([key, item]) => ({
    value: `mental_${key}`,
    name: `Saúde Mental - ${key.charAt(0).toUpperCase() + key.slice(1)}`,
    description: item.description,
    baseFrequency: item.left,
    binauralBeat: item.right - item.left
  }))
];

// Frequency ranges and their descriptions
const frequencyRanges = [
  { name: "Sub-delta (<1 Hz)", color: "#4338ca", description: "Transe profundo, sono sem sonhos" },
  { name: "Delta (1-4 Hz)", color: "#4f46e5", description: "Sono profundo, cura" },
  { name: "Teta (4-8 Hz)", color: "#8b5cf6", description: "Meditação, criatividade" },
  { name: "Alfa (8-12 Hz)", color: "#3b82f6", description: "Relaxamento, meditação leve" },
  { name: "Beta baixo (12-16 Hz)", color: "#06b6d4", description: "Foco relaxado, aprendizagem melhorada" },
  { name: "Beta médio (16-24 Hz)", color: "#10b981", description: "Pensamento ativo, estado de alerta" },
  { name: "Beta alto (24-30 Hz)", color: "#eab308", description: "Pensamento complexo, ansiedade" },
  { name: "Gama baixo (30-40 Hz)", color: "#f97316", description: "Melhoria cognitiva" },
  { name: "Gama alta (40+ Hz)", color: "#ef4444", description: "Desempenho cognitivo máximo" },
];

export default function BinauralFrequencies() {
  // Basic tab state
  const [leftFrequency, setLeftFrequency] = useState(200);
  const [rightFrequency, setRightFrequency] = useState(205);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [backgroundVolume, setBackgroundVolume] = useState(30);
  const [selectedBackground, setSelectedBackground] = useState<BackgroundSoundType>("white-noise");

  // Therapeutic tab state
  const [selectedTherapeuticFrequency, setSelectedTherapeuticFrequency] = useState(therapeuticFrequenciesArray[0].value);
  const [isTherapeuticPlaying, setIsTherapeuticPlaying] = useState(false);
  const [therapeuticVolume, setTherapeuticVolume] = useState(50);
  const [therapeuticBackgroundVolume, setTherapeuticBackgroundVolume] = useState(30);
  const [therapeuticSelectedBackground, setTherapeuticSelectedBackground] = useState<BackgroundSoundType>("white-noise");

  // Calculate binaural beat frequency
  const binauralBeatFrequency = rightFrequency - leftFrequency;
  
  // Determine the frequency range category
  const getBrainwaveCategory = (beatFrequency: number) => {
    if (beatFrequency < 1) return "Sub-delta";
    if (beatFrequency <= 4) return "Delta";
    if (beatFrequency <= 8) return "Teta";
    if (beatFrequency <= 12) return "Alfa";
    if (beatFrequency <= 16) return "Beta baixo";
    if (beatFrequency <= 24) return "Beta médio";
    if (beatFrequency <= 30) return "Beta alto";
    if (beatFrequency <= 40) return "Gama baixo";
    return "Gama alta";
  };

  const currentCategory = getBrainwaveCategory(binauralBeatFrequency);
  const categoryInfo = frequencyRanges.find(range => range.name.startsWith(currentCategory));

  // Effect to stop audio when component unmounts
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  // Basic tab handlers
  const handlePlay = async () => {
    if (isPlaying) {
      stopAllAudio();
      setIsPlaying(false);
      return;
    }

    console.log("Playing binaural beat with parameters:", {
      leftFrequency,
      rightFrequency,
      binauralBeat: rightFrequency - leftFrequency,
      volume: volume / 100,
      backgroundType: selectedBackground,
      backgroundVolume: backgroundVolume / 100
    });

    const success = await playBinauralBeat(
      leftFrequency,
      rightFrequency,
      900000, // Default duration
      volume / 100,
      selectedBackground,
      backgroundVolume / 100
    );

    setIsPlaying(success);
  };

  // Therapeutic tab handlers
  const handleTherapeuticPlay = async () => {
    if (isTherapeuticPlaying) {
      stopAllAudio();
      setIsTherapeuticPlaying(false);
      return;
    }

    const selectedFrequency = therapeuticFrequenciesArray.find(
      f => f.value === selectedTherapeuticFrequency
    );

    if (!selectedFrequency) return;

    console.log("Playing therapeutic frequency:", {
      baseFrequency: selectedFrequency.baseFrequency,
      binauralBeat: selectedFrequency.binauralBeat,
      volume: therapeuticVolume / 100,
      backgroundType: therapeuticSelectedBackground,
      backgroundVolume: therapeuticBackgroundVolume / 100
    });

    const success = await playBinauralBeat(
      selectedFrequency.baseFrequency,
      selectedFrequency.baseFrequency + selectedFrequency.binauralBeat,
      900000, // Default duration
      therapeuticVolume / 100,
      therapeuticSelectedBackground,
      therapeuticBackgroundVolume / 100
    );

    setIsTherapeuticPlaying(success);
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

  const handleTherapeuticVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setTherapeuticVolume(newVolume);
    updateBinauralVolume(newVolume / 100);
  };

  const handleTherapeuticBackgroundVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setTherapeuticBackgroundVolume(newVolume);
    updateBackgroundVolume(newVolume / 100);
  };

  const getVolumeIcon = (vol: number) => {
    if (vol === 0) return <VolumeX size={20} />;
    if (vol < 33) return <Volume size={20} />;
    if (vol < 66) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };

  const backgroundSoundOptions = [
    { value: "white-noise", label: "Ruído Branco" },
    { value: "rain", label: "Chuva" },
    { value: "ocean", label: "Ondas do Oceano" },
    { value: "forest", label: "Floresta" },
  ];

  // Handle SelectField type mismatch
  const handleBackgroundChange = (value: string) => {
    setSelectedBackground(value as BackgroundSoundType);
  };

  const handleTherapeuticBackgroundChange = (value: string) => {
    setTherapeuticSelectedBackground(value as BackgroundSoundType);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
          Frequências Binaurais
        </h1>
        <p className="text-gray-600 max-w-3xl">
          As frequências binaurais são uma forma de estimulação cerebral que ocorre quando dois tons ligeiramente diferentes são apresentados separadamente a cada ouvido, criando uma terceira frequência percebida pelo cérebro.
        </p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="therapeutic">Terapêutico</TabsTrigger>
        </TabsList>

        {/* Basic Tab */}
        <TabsContent value="basic">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Headphones className="mr-2 h-5 w-5" />
                  Configurações da Frequência
                </CardTitle>
                <CardDescription>
                  Ajuste as frequências para cada ouvido
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* Left Ear Frequency */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium flex items-center">
                        <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                        <span>Frequência do ouvido esquerdo: {leftFrequency.toFixed(1)} Hz</span>
                      </label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Frequência apresentada ao ouvido esquerdo.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Slider
                      value={[leftFrequency]}
                      min={100}
                      max={500}
                      step={0.1}
                      onValueChange={(value) => setLeftFrequency(value[0])}
                    />
                  </div>

                  {/* Right Ear Frequency */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium flex items-center">
                        <div className="w-4 h-4 rounded-full bg-pink-500 mr-2"></div>
                        <span>Frequência do ouvido direito: {rightFrequency.toFixed(1)} Hz</span>
                      </label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Frequência apresentada ao ouvido direito.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Slider
                      value={[rightFrequency]}
                      min={100}
                      max={500}
                      step={0.1}
                      onValueChange={(value) => setRightFrequency(value[0])}
                    />
                  </div>

                  {/* Binaural Beat Info Card */}
                  <div className="mt-6 p-4 rounded-lg bg-purple-600 text-white">
                    <h3 className="text-lg font-medium mb-1">Batida binaural</h3>
                    <div className="text-3xl font-bold mb-1">{binauralBeatFrequency.toFixed(1)} Hz</div>
                    <div className="text-lg">{currentCategory}</div>
                    <div className="text-sm opacity-90">
                      {categoryInfo?.description || ""}
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-white hover:bg-white/20">
                            <Info className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">A batida binaural é a diferença entre as frequências apresentadas em cada ouvido.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium flex items-center">
                        {getVolumeIcon(volume)}
                        <span className="ml-2">Volume: {volume}%</span>
                      </label>
                    </div>
                    <Slider
                      value={[volume]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <SelectField 
                      label="Som de Fundo"
                      value={selectedBackground}
                      onChange={handleBackgroundChange}
                      options={backgroundSoundOptions}
                    />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium flex items-center">
                          {getVolumeIcon(backgroundVolume)}
                          <span className="ml-2">Volume de Fundo: {backgroundVolume}%</span>
                        </label>
                      </div>
                      <Slider
                        value={[backgroundVolume]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={handleBackgroundVolumeChange}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  onClick={handlePlay}
                  className="w-32"
                  variant={isPlaying ? "destructive" : "default"}
                >
                  {isPlaying ? (
                    <>
                      <Square className="mr-2 h-4 w-4" /> Parar
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" /> Iniciar
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-card/95 backdrop-blur">
              <CardHeader>
                <CardTitle>Guia de Faixa de Frequência</CardTitle>
                <CardDescription>
                  Diferentes faixas de frequência têm diferentes efeitos no cérebro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {frequencyRanges.map((range, index) => (
                    <div key={index} className="flex items-start">
                      <div 
                        className="w-4 h-4 rounded-full mt-1 mr-3 flex-shrink-0"
                        style={{backgroundColor: range.color}}
                      ></div>
                      <div>
                        <div className="font-medium">{range.name}:</div>
                        <div className="text-sm text-gray-600">{range.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Therapeutic Tab */}
        <TabsContent value="therapeutic">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Music className="mr-2 h-5 w-5" />
                  Frequências Terapêuticas
                </CardTitle>
                <CardDescription>
                  Frequências pré-configuradas com fins terapêuticos específicos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <SelectField 
                    label="Selecione o objetivo terapêutico"
                    value={selectedTherapeuticFrequency}
                    onChange={setSelectedTherapeuticFrequency}
                    options={therapeuticFrequenciesArray.map(f => ({ value: f.value, label: f.name }))}
                  />
                  
                  <div className="bg-secondary/20 p-3 rounded-md">
                    <p className="text-sm">
                      {therapeuticFrequenciesArray.find(f => f.value === selectedTherapeuticFrequency)?.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium flex items-center">
                        {getVolumeIcon(therapeuticVolume)}
                        <span className="ml-2">Volume: {therapeuticVolume}%</span>
                      </label>
                    </div>
                    <Slider
                      value={[therapeuticVolume]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={handleTherapeuticVolumeChange}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <SelectField 
                      label="Som de Fundo"
                      value={therapeuticSelectedBackground}
                      onChange={handleTherapeuticBackgroundChange}
                      options={backgroundSoundOptions}
                    />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium flex items-center">
                          {getVolumeIcon(therapeuticBackgroundVolume)}
                          <span className="ml-2">Volume de Fundo: {therapeuticBackgroundVolume}%</span>
                        </label>
                      </div>
                      <Slider
                        value={[therapeuticBackgroundVolume]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={handleTherapeuticBackgroundVolumeChange}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  onClick={handleTherapeuticPlay}
                  className="w-32"
                  variant={isTherapeuticPlaying ? "destructive" : "default"}
                >
                  {isTherapeuticPlaying ? (
                    <>
                      <Square className="mr-2 h-4 w-4" /> Parar
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" /> Iniciar
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recomendações de Uso</CardTitle>
                <CardDescription>
                  Orientações para maximizar os benefícios das frequências binaurais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Use fones de ouvido</h3>
                  <p className="text-sm text-gray-600">
                    Fones de ouvido são essenciais para que cada ouvido receba uma frequência distinta, criando o efeito binaural.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Ambiente tranquilo</h3>
                  <p className="text-sm text-gray-600">
                    Escolha um local calmo e confortável, livre de distrações, para melhor experiência.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Duração das sessões</h3>
                  <p className="text-sm text-gray-600">
                    Sessões de 15-30 minutos são geralmente suficientes. Comece com sessões mais curtas e aumente gradualmente.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Regularidade</h3>
                  <p className="text-sm text-gray-600">
                    Use regularmente para melhores resultados. Os efeitos podem ser cumulativos com o uso consistente.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Atenção</h3>
                  <p className="text-sm text-gray-600">
                    Não use enquanto dirige ou opera máquinas. Pessoas com epilepsia devem consultar um médico antes do uso.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
