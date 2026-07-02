
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Info, Play, Square, Volume2, VolumeX, Music } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  { name: "Gama baixo (30-40 Hz)", color: "#ef4444", description: "Melhoria cognitiva" },
  { name: "Gama alta (40+ Hz)", color: "#ef4444", description: "Desempenho cognitivo máximo" },
];

// Background sound options
const backgroundSounds = [
  { value: "none", label: "Nenhum", icon: VolumeX },
  { value: "white-noise", label: "Ruído Branco", icon: Volume2 },
  { value: "rain", label: "Chuva", icon: Volume2 },
  { value: "ocean", label: "Oceano", icon: Volume2 },
  { value: "forest", label: "Floresta", icon: Volume2 },
  { value: "fireplace", label: "Lareira", icon: Volume2 },
  { value: "birds", label: "Pássaros", icon: Volume2 },
  { value: "stream", label: "Riacho", icon: Volume2 },
  { value: "meditation", label: "Meditação", icon: Music },
  { value: "brown-noise", label: "Ruído Marrom", icon: Volume2 },
  { value: "pink-noise", label: "Ruído Rosa", icon: Volume2 },
];

export default function BinauralFrequencies() {
  // State for therapeutic frequencies
  const [selectedTherapeuticFrequency, setSelectedTherapeuticFrequency] = useState(therapeuticFrequenciesArray.length > 0 ? therapeuticFrequenciesArray[0].value : "");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [backgroundVolume, setBackgroundVolume] = useState(30);
  const [selectedBackground, setSelectedBackground] = useState<BackgroundSoundType>("none");
  
  // New states for direct frequency control
  const [leftFrequency, setLeftFrequency] = useState(200);
  const [rightFrequency, setRightFrequency] = useState(205);

  // Effect to stop audio when component unmounts
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  // Effect to update frequencies based on therapeutic selection
  useEffect(() => {
    const selectedFreq = therapeuticFrequenciesArray.find(f => f.value === selectedTherapeuticFrequency);
    if (selectedFreq) {
      setLeftFrequency(selectedFreq.baseFrequency);
      setRightFrequency(selectedFreq.baseFrequency + selectedFreq.binauralBeat);
    }
  }, [selectedTherapeuticFrequency]);

  // Handle play button click
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

  const handleLeftFrequencyChange = (value: number[]) => {
    setLeftFrequency(value[0]);
  };

  const handleRightFrequencyChange = (value: number[]) => {
    setRightFrequency(value[0]);
  };

  // Get binaural beat frequency
  const binauralBeatFrequency = rightFrequency - leftFrequency;
  
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

  const currentCategory = getBrainwaveCategory(binauralBeatFrequency);
  const categoryInfo = frequencyRanges.find(range => range.name.startsWith(currentCategory));

  // Function to get color based on frequency type
  const getFrequencyColor = (type: string) => {
    if (type === 'left') return '#3b82f6'; // Blue for left ear
    if (type === 'right') return '#ec4899'; // Pink for right ear
    return categoryInfo?.color || '#8b5cf6'; // Purple for binaural beat or fallback
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <ResourceBackButton className="mb-4" />
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
          Frequências Binaurais Terapêuticas
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Frequências específicas para beneficiar pessoas com TEA e transtornos mentais
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Main control card */}
        <div className="dark:bg-slate-900 bg-slate-100 rounded-lg px-4 py-6">
          {/* Left ear frequency control */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-lg font-medium">Frequência do ouvido esquerdo</span>
              </div>
              <span className="text-lg font-medium">{leftFrequency.toFixed(1)} Hz</span>
            </div>
            <Slider
              value={[leftFrequency]}
              min={100}
              max={500}
              step={0.1}
              onValueChange={handleLeftFrequencyChange}
              className="dark:bg-slate-800 bg-slate-200"
            />
          </div>
          
          {/* Right ear frequency control */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-pink-500 mr-2"></div>
                <span className="text-lg font-medium">Frequência do ouvido direito</span>
              </div>
              <span className="text-lg font-medium">{rightFrequency.toFixed(1)} Hz</span>
            </div>
            <Slider
              value={[rightFrequency]}
              min={100}
              max={500}
              step={0.1}
              onValueChange={handleRightFrequencyChange}
              className="dark:bg-slate-800 bg-slate-200"
            />
          </div>
          
          {/* Binaural beat display */}
          <div className="mb-8 rounded-lg p-6" style={{ backgroundColor: categoryInfo?.color || '#8b5cf6' }}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-white text-xl font-medium">Batida binaural</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 p-1">
                      <Info className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">A batida binaural é a diferença entre as frequências apresentadas em cada ouvido.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-white text-5xl font-bold mb-1">
              {binauralBeatFrequency.toFixed(1)} Hz
            </div>
            <div className="text-white text-2xl font-medium mb-1">
              {currentCategory}
            </div>
            <div className="text-white text-lg opacity-80">
              {currentCategory}: {categoryInfo?.description || ""}
            </div>
          </div>
          
          {/* Volume and background sound controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Binaural volume control */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Volume2 className="mr-2 h-5 w-5 text-primary" />
                  <span className="font-medium">Volume da Frequência</span>
                </div>
                <span>{volume}%</span>
              </div>
              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="dark:bg-slate-800 bg-slate-200"
              />
            </div>
            
            {/* Background sound control */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Volume2 className="mr-2 h-5 w-5 text-primary" />
                  <span className="font-medium">Volume do Som de Fundo</span>
                </div>
                <span>{backgroundVolume}%</span>
              </div>
              <Slider
                value={[backgroundVolume]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleBackgroundVolumeChange}
                className="dark:bg-slate-800 bg-slate-200"
              />
            </div>
          </div>
          
          {/* Background sound selection - Converted to dropdown */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3">Som de Fundo</h3>
            <Select
              value={selectedBackground}
              onValueChange={(value) => setSelectedBackground(value as BackgroundSoundType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o som de fundo" />
              </SelectTrigger>
              <SelectContent>
                {backgroundSounds.map((sound) => (
                  <SelectItem key={sound.value} value={sound.value}>
                    <div className="flex items-center">
                      <sound.icon className="mr-2 h-4 w-4" />
                      <span>{sound.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Play/Stop button */}
          <div className="flex justify-center mb-6">
            <Button
              onClick={handlePlay}
              className="w-32 h-12 text-lg"
              variant={isPlaying ? "destructive" : "default"}
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
          </div>
        </div>
        
        {/* Therapeutic Frequencies selection */}
        <Card className="dark:bg-slate-900 bg-slate-100">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Frequências Terapêuticas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {therapeuticFrequenciesArray.map((freq) => (
                <button
                  key={freq.value}
                  onClick={() => setSelectedTherapeuticFrequency(freq.value)}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    selectedTherapeuticFrequency === freq.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  <div className="font-medium">{freq.name}</div>
                  <div className="text-sm opacity-90 mt-1">
                    {freq.baseFrequency} Hz + {freq.binauralBeat} Hz
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Frequency Guide Card */}
        <Card className="dark:bg-slate-900 bg-slate-100">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Guia de Faixa de Frequência</h2>
            <div className="space-y-3">
              {frequencyRanges.map((range, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                    style={{backgroundColor: range.color}}
                  ></div>
                  <div className="flex flex-wrap w-full">
                    <div className="font-medium w-48">{range.name}</div>
                    <div className="text-muted-foreground">{range.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
