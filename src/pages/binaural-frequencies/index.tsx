
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Waves, Play, Square, Volume2 } from "lucide-react";
import { playNoteSound, stopAllAudio } from "@/utils/audioUtils";

// Frequências cerebrais em Hz
const brainwaveFrequencies = {
  delta: { min: 0.5, max: 4, default: 2, description: "Sono profundo, cicatrização, regeneração" },
  theta: { min: 4, max: 8, default: 6, description: "Sono REM, meditação profunda, criatividade" },
  alpha: { min: 8, max: 14, default: 10, description: "Relaxamento, calma, aprendizado fácil" },
  beta: { min: 14, max: 30, default: 20, description: "Concentração, foco, atividade mental" },
  gamma: { min: 30, max: 100, default: 40, description: "Processamento cognitivo de alto nível" }
};

export default function BinauralFrequencies() {
  const [activeTab, setActiveTab] = useState("alpha");
  const [frequency, setFrequency] = useState(brainwaveFrequencies.alpha.default);
  const [duration, setDuration] = useState(5); // Duração em minutos
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(60);

  // Atualiza a frequência quando a aba muda
  useEffect(() => {
    const tab = activeTab as keyof typeof brainwaveFrequencies;
    setFrequency(brainwaveFrequencies[tab].default);
  }, [activeTab]);

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
    } else {
      const success = playNoteSound("C1", duration * 60000); // Converter minutos para milissegundos
      setIsPlaying(success);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6 text-primary flex items-center gap-2">
        <Waves className="h-8 w-8" />
        Frequências Binaurais
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Gerador de Frequências Binaurais</CardTitle>
            <CardDescription>
              Selecione o tipo de ondas cerebrais e ajuste a frequência para suas necessidades específicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="delta">Delta</TabsTrigger>
                <TabsTrigger value="theta">Theta</TabsTrigger>
                <TabsTrigger value="alpha">Alpha</TabsTrigger>
                <TabsTrigger value="beta">Beta</TabsTrigger>
                <TabsTrigger value="gamma">Gamma</TabsTrigger>
              </TabsList>
              
              {Object.entries(brainwaveFrequencies).map(([key, value]) => (
                <TabsContent key={key} value={key} className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">{key.charAt(0).toUpperCase() + key.slice(1)} ({value.min}-{value.max} Hz)</CardTitle>
                      <CardDescription>{value.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Frequência: {frequency.toFixed(1)} Hz</Label>
                  <span className="text-sm text-muted-foreground">
                    {brainwaveFrequencies[activeTab as keyof typeof brainwaveFrequencies].min} - 
                    {brainwaveFrequencies[activeTab as keyof typeof brainwaveFrequencies].max} Hz
                  </span>
                </div>
                <Slider
                  value={[frequency]}
                  min={brainwaveFrequencies[activeTab as keyof typeof brainwaveFrequencies].min}
                  max={brainwaveFrequencies[activeTab as keyof typeof brainwaveFrequencies].max}
                  step={0.1}
                  onValueChange={(value) => setFrequency(value[0])}
                />
              </div>

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
                  onValueChange={(value) => setVolume(value[0])}
                />
              </div>

              <Button 
                className="w-full mt-4" 
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Benefícios das Frequências Binaurais</CardTitle>
            <CardDescription>
              Como as ondas cerebrais afetam o seu bem-estar e desempenho
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Delta (0.5-4 Hz)</h3>
              <p className="text-sm">Promove sono profundo reparador, regeneração celular e cura. Ideal para sono profundo e recuperação física.</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Theta (4-8 Hz)</h3>
              <p className="text-sm">Facilita a meditação profunda, criatividade e memória. Útil para relaxamento profundo e trabalho criativo.</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Alpha (8-14 Hz)</h3>
              <p className="text-sm">Induz relaxamento, foco e aprendizado otimizado. Excelente para estudos, trabalho criativo e redução de estresse.</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Beta (14-30 Hz)</h3>
              <p className="text-sm">Aumenta concentração, atenção e alerta. Ideal para trabalho intelectual e atividades que exigem foco intenso.</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Gamma (30-100 Hz)</h3>
              <p className="text-sm">Estimula o processamento cognitivo de alto nível, percepção e consciência expandida. Associado a estados cognitivos superiores.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
