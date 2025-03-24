
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
  Info
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

export default function BinauralFrequencies() {
  // Basic tab state
  const [baseFrequency, setBaseFrequency] = useState(200);
  const [binauralBeat, setBinauralBeat] = useState(7);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [backgroundVolume, setBackgroundVolume] = useState(30);
  const [selectedBackground, setSelectedBackground] = useState<BackgroundSoundType>("white-noise");

  // Therapeutic tab state
  const [selectedTherapeuticFrequency, setSelectedTherapeuticFrequency] = useState(therapeuticFrequencies[0].value);
  const [isTherapeuticPlaying, setIsTherapeuticPlaying] = useState(false);
  const [therapeuticVolume, setTherapeuticVolume] = useState(50);
  const [therapeuticBackgroundVolume, setTherapeuticBackgroundVolume] = useState(30);
  const [therapeuticSelectedBackground, setTherapeuticSelectedBackground] = useState<BackgroundSoundType>("white-noise");

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
      baseFrequency,
      binauralBeat,
      volume: volume / 100,
      backgroundType: selectedBackground,
      backgroundVolume: backgroundVolume / 100
    });

    const success = await playBinauralBeat({
      baseFrequency,
      binauralBeat,
      volume: volume / 100,
      backgroundType: selectedBackground,
      backgroundVolume: backgroundVolume / 100
    });

    setIsPlaying(success);
  };

  // Therapeutic tab handlers
  const handleTherapeuticPlay = async () => {
    if (isTherapeuticPlaying) {
      stopAllAudio();
      setIsTherapeuticPlaying(false);
      return;
    }

    const selectedFrequency = therapeuticFrequencies.find(
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

    const success = await playBinauralBeat({
      baseFrequency: selectedFrequency.baseFrequency,
      binauralBeat: selectedFrequency.binauralBeat,
      volume: therapeuticVolume / 100,
      backgroundType: therapeuticSelectedBackground,
      backgroundVolume: therapeuticBackgroundVolume / 100
    });

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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Waves className="mr-2 h-5 w-5" />
                  Configuração Básica
                </CardTitle>
                <CardDescription>
                  Ajuste manualmente os parâmetros da frequência binaural
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">
                        Frequência Base (Hz): {baseFrequency}Hz
                      </label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">A frequência base é o tom principal que você ouve.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Slider
                      value={[baseFrequency]}
                      min={100}
                      max={500}
                      step={1}
                      onValueChange={(value) => setBaseFrequency(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">
                        Batimento Binaural (Hz): {binauralBeat}Hz
                      </label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">A diferença entre as frequências apresentadas a cada ouvido, que cria o efeito binaural.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Slider
                      value={[binauralBeat]}
                      min={1}
                      max={30}
                      step={0.5}
                      onValueChange={(value) => setBinauralBeat(value[0])}
                    />
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
                      onChange={setSelectedBackground}
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

            <Card>
              <CardHeader>
                <CardTitle>Efeitos das Frequências Binaurais</CardTitle>
                <CardDescription>
                  Diferentes faixas de frequência têm diferentes efeitos no cérebro
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Ondas Delta (0.5-4Hz)</h3>
                  <p className="text-sm text-gray-600">
                    Associadas ao sono profundo e recuperação. Úteis para melhorar o sono e reduzir dores.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Ondas Theta (4-8Hz)</h3>
                  <p className="text-sm text-gray-600">
                    Relacionadas à meditação profunda, criatividade e sonhos REM. Podem melhorar a criatividade e relaxamento.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Ondas Alpha (8-13Hz)</h3>
                  <p className="text-sm text-gray-600">
                    Estado de relaxamento alerta. Podem reduzir ansiedade e promover bem-estar.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Ondas Beta (13-30Hz)</h3>
                  <p className="text-sm text-gray-600">
                    Estado de alerta e concentração. Úteis para melhorar o foco e desempenho cognitivo.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Ondas Gamma (acima de 30Hz)</h3>
                  <p className="text-sm text-gray-600">
                    Associadas à percepção e consciência elevadas. Podem melhorar o processamento cognitivo.
                  </p>
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
                    options={therapeuticFrequencies.map(f => ({ value: f.value, label: f.name }))}
                  />
                  
                  <div className="bg-secondary/20 p-3 rounded-md">
                    <p className="text-sm">
                      {therapeuticFrequencies.find(f => f.value === selectedTherapeuticFrequency)?.description}
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
                      onChange={setTherapeuticSelectedBackground}
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
