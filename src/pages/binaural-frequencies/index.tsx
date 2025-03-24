
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SelectField } from "@/pages/treatment-plan/components/SelectField";
import {
  Play,
  Square,
  VolumeX,
  Volume,
  Volume1,
  Volume2,
  Info,
  Headphones,
  Brain
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
  ...Object.entries(therapeuticFrequencies.autism || {}).map(([key, item]) => ({
    value: `autism_${key}`,
    name: `TEA - ${key.charAt(0).toUpperCase() + key.slice(1)}`,
    description: item.description,
    baseFrequency: item.left,
    binauralBeat: item.right - item.left
  })),
  ...Object.entries(therapeuticFrequencies.mentalHealth || {}).map(([key, item]) => ({
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
  // State for therapeutic frequencies
  const [selectedTherapeuticFrequency, setSelectedTherapeuticFrequency] = useState(therapeuticFrequenciesArray.length > 0 ? therapeuticFrequenciesArray[0].value : "");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [backgroundVolume, setBackgroundVolume] = useState(30);
  const [selectedBackground, setSelectedBackground] = useState<BackgroundSoundType>("white-noise");

  // Effect to stop audio when component unmounts
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  // Get selected therapeutic frequency details
  const getSelectedTherapeuticFrequency = () => {
    return therapeuticFrequenciesArray.find(f => f.value === selectedTherapeuticFrequency);
  };

  // Handle play button click
  const handlePlay = async () => {
    if (isPlaying) {
      stopAllAudio();
      setIsPlaying(false);
      return;
    }

    const selectedFreq = getSelectedTherapeuticFrequency();
    if (!selectedFreq) return;

    const leftFreq = selectedFreq.baseFrequency;
    const rightFreq = selectedFreq.baseFrequency + selectedFreq.binauralBeat;

    console.log("Playing therapeutic binaural beat with parameters:", {
      leftFrequency: leftFreq,
      rightFrequency: rightFreq,
      binauralBeat: selectedFreq.binauralBeat,
      volume: volume / 100,
      backgroundType: selectedBackground,
      backgroundVolume: backgroundVolume / 100
    });

    const success = await playBinauralBeat(
      leftFreq,
      rightFreq,
      900000, // Default duration (15 minutes)
      volume / 100,
      selectedBackground,
      backgroundVolume / 100
    );

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

  const handleTherapeuticFrequencyChange = (value: string) => {
    setSelectedTherapeuticFrequency(value);
  };

  // Get current frequency info
  const currentFreq = getSelectedTherapeuticFrequency();
  const binauralBeatFrequency = currentFreq?.binauralBeat || 0;
  const currentCategory = currentFreq ? getBrainwaveCategory(binauralBeatFrequency) : "";
  const categoryInfo = frequencyRanges.find(range => range.name.startsWith(currentCategory));

  // Determine the frequency range category
  function getBrainwaveCategory(beatFrequency: number) {
    if (beatFrequency < 1) return "Sub-delta";
    if (beatFrequency <= 4) return "Delta";
    if (beatFrequency <= 8) return "Teta";
    if (beatFrequency <= 12) return "Alfa";
    if (beatFrequency <= 16) return "Beta baixo";
    if (beatFrequency <= 24) return "Beta médio";
    if (beatFrequency <= 30) return "Beta alto";
    if (beatFrequency <= 40) return "Gama baixo";
    return "Gama alta";
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
          Frequências Binaurais Terapêuticas
        </h1>
        <p className="text-gray-600 max-w-3xl">
          As frequências binaurais podem beneficiar pessoas com TEA (Transtorno do Espectro Autista) 
          e diversos transtornos mentais através da estimulação cerebral específica.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5" />
              Terapia com Frequências Binaurais
            </CardTitle>
            <CardDescription>
              Frequências especificamente calibradas para TEA e saúde mental
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {/* Therapeutic Frequency Selector */}
              <SelectField 
                label="Selecione o objetivo terapêutico"
                value={selectedTherapeuticFrequency}
                onChange={handleTherapeuticFrequencyChange}
                options={therapeuticFrequenciesArray.map(f => ({ value: f.value, label: f.name }))}
              />
              
              <div className="bg-secondary/20 p-3 rounded-md">
                <p className="text-sm">
                  {currentFreq?.description || ""}
                </p>
              </div>

              {/* Binaural Beat Info Card */}
              <div className="mt-6 p-4 rounded-lg bg-purple-600 text-white relative">
                <h3 className="text-lg font-medium mb-1">Batida binaural</h3>
                <div className="text-3xl font-bold mb-1">
                  {binauralBeatFrequency.toFixed(1)} Hz
                </div>
                <div className="text-lg">
                  {currentCategory}
                </div>
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

        <div className="space-y-6">
          <Card className="bg-card/95 backdrop-blur">
            <CardHeader>
              <CardTitle>Guia de Frequências para Neuroplasticidade</CardTitle>
              <CardDescription>
                Diferentes faixas de frequência têm efeitos terapêuticos específicos no cérebro
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
          
          <Card>
            <CardHeader>
              <CardTitle>Benefícios Terapêuticos</CardTitle>
              <CardDescription>
                Potenciais benefícios para pessoas com TEA e transtornos mentais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">TEA (Transtorno do Espectro Autista)</h3>
                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                  <li>Redução da hipersensibilidade sensorial</li>
                  <li>Melhoria na capacidade de concentração</li>
                  <li>Auxílio na regulação emocional</li>
                  <li>Redução da ansiedade e agitação</li>
                  <li>Melhoria na qualidade do sono</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Saúde Mental</h3>
                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                  <li>Redução de sintomas de ansiedade</li>
                  <li>Alívio de quadros depressivos</li>
                  <li>Melhoria na concentração para TDAH</li>
                  <li>Redução do stress e tensão</li>
                  <li>Promoção de estados de relaxamento profundo</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Recomendações de Uso</h3>
                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                  <li>Use fones de ouvido estéreo de boa qualidade</li>
                  <li>Escolha um ambiente tranquilo e confortável</li>
                  <li>Inicie com sessões curtas (5-10 minutos) e aumente gradualmente</li>
                  <li>Use regularmente para melhores resultados</li>
                  <li>Não utilize durante atividades que exigem atenção plena</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
