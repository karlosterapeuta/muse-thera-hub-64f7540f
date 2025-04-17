import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, Music, Mic, Gift, 
  PlayCircle, Sparkles, Plus, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import SpeechDetector from "@/components/fala-magica/SpeechDetector";
import PDFViewer from "@/components/fala-magica/PDFViewer";
import AudioGuide from "@/components/fala-magica/AudioGuide";
import RewardSystem from "@/components/fala-magica/RewardSystem";

import MagicalGuide from "@/components/fala-magica/MagicalGuide";

import { 
  InteractivePDF, 
  Word, 
  GuidedAudio, 
  Reward, 
  UserProgress 
} from "@/components/fala-magica/types";

const mockPDFs: InteractivePDF[] = [
  {
    id: "pdf1",
    title: "Animais da Fazenda",
    category: "animais",
    pdfUrl: "#",
    thumbnailUrl: "https://placehold.co/200x150?text=Animais",
    words: [
      { id: "w1", text: "Gato", imageUrl: "https://placehold.co/200?text=Gato", audioUrl: "#", sungAudioUrl: "#" },
      { id: "w2", text: "Cachorro", imageUrl: "https://placehold.co/200?text=Cachorro", audioUrl: "#", sungAudioUrl: "#" },
      { id: "w3", text: "Vaca", imageUrl: "https://placehold.co/200?text=Vaca", audioUrl: "#", sungAudioUrl: "#" },
      { id: "w4", text: "Galinha", imageUrl: "https://placehold.co/200?text=Galinha", audioUrl: "#", sungAudioUrl: "#" },
    ],
    createdAt: new Date()
  },
  {
    id: "pdf2",
    title: "Objetos de Casa",
    category: "casa",
    pdfUrl: "#",
    thumbnailUrl: "https://placehold.co/200x150?text=Casa",
    words: [
      { id: "w5", text: "Mesa", imageUrl: "https://placehold.co/200?text=Mesa", audioUrl: "#", sungAudioUrl: "#" },
      { id: "w6", text: "Cama", imageUrl: "https://placehold.co/200?text=Cama", audioUrl: "#", sungAudioUrl: "#" },
      { id: "w7", text: "Cadeira", imageUrl: "https://placehold.co/200?text=Cadeira", audioUrl: "#", sungAudioUrl: "#" },
      { id: "w8", text: "Sofá", imageUrl: "https://placehold.co/200?text=Sofá", audioUrl: "#", sungAudioUrl: "#" },
    ],
    createdAt: new Date()
  }
];

const mockAudios: GuidedAudio[] = [
  {
    id: "a1",
    title: "Animais com melodia",
    description: "Nomes de animais com melodia suave",
    audioUrl: "#",
    thumbnailUrl: "https://placehold.co/200x150?text=Audio+1",
    voiceType: "infantil",
    category: "palavras",
    tags: ["animais", "melodia", "infantil"],
    duration: 120,
    hasBackgroundMusic: true,
    createdAt: new Date()
  },
  {
    id: "a2",
    title: "Palavras de casa",
    description: "Objetos de casa com voz calma",
    audioUrl: "#",
    thumbnailUrl: "https://placehold.co/200x150?text=Audio+2",
    voiceType: "adulto",
    category: "frases",
    tags: ["casa", "objetos"],
    duration: 90,
    hasBackgroundMusic: false,
    createdAt: new Date()
  }
];

const mockRewards: Reward[] = [
  {
    id: "r1",
    name: "Estrela Sonora",
    type: "adesivo",
    imageUrl: "https://placehold.co/200?text=Estrela",
    unlocked: true,
    requiredPoints: 10,
    description: "Uma estrela mágica que brilha quando você fala!",
    category: "magia",
    animation: "glow",
    soundEffect: "sparkle"
  },
  {
    id: "r2",
    name: "Fada Melodia",
    type: "personagem",
    imageUrl: "https://placehold.co/200?text=Fada",
    unlocked: false,
    requiredPoints: 30,
    description: "Uma fada musical que dança com sua voz!",
    category: "magia",
    animation: "float",
    soundEffect: "magic"
  },
  {
    id: "r3",
    name: "Pássaro Cantor",
    type: "personagem",
    imageUrl: "https://placehold.co/200?text=Passaro",
    unlocked: false,
    requiredPoints: 50,
    description: "Um pássaro que canta junto com você!",
    category: "animais",
    animation: "bounce",
    soundEffect: "cheer"
  },
  {
    id: "r4",
    name: "Arco-Íris Mágico",
    type: "efeito",
    imageUrl: "https://placehold.co/200?text=Arco-Iris",
    unlocked: false,
    requiredPoints: 75,
    description: "Um lindo arco-íris que aparece quando você fala!",
    category: "natureza",
    animation: "float",
    soundEffect: "sparkle"
  },
  {
    id: "r5",
    name: "Varinha Musical",
    type: "efeito",
    imageUrl: "https://placehold.co/200?text=Varinha",
    unlocked: false,
    requiredPoints: 100,
    description: "Uma varinha que transforma sua voz em música!",
    category: "música",
    animation: "spin",
    soundEffect: "tada"
  }
];

export default function SongsPage() {
  const [currentPDF, setCurrentPDF] = useState<InteractivePDF | null>(null);
  const [currentAudio, setCurrentAudio] = useState<GuidedAudio | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalPoints: 15,
    vocalizationCount: 3,
    completedActivities: [],
    unlockedRewards: ["r1"],
    lastSessionDate: new Date()
  });
  
  const { toast } = useToast();

  const handleVocalization = () => {
    setUserProgress(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + 5,
      vocalizationCount: prev.vocalizationCount + 1
    }));
    
    toast({
      title: "🎉 Você falou!",
      description: "Você ganhou 5 pontos por falar!",
    });
  };
  
  const handleClaimReward = (rewardId: string) => {
    if (!userProgress.unlockedRewards.includes(rewardId)) {
      setUserProgress(prev => ({
        ...prev,
        unlockedRewards: [...prev.unlockedRewards, rewardId]
      }));
    }
  };

  const handleSessionComplete = (stats: { attempts: number; duration: number }) => {
    setUserProgress(prev => ({
      ...prev,
      vocalizationCount: prev.vocalizationCount + stats.attempts,
      completedActivities: [...prev.completedActivities, `session-${Date.now()}`]
    }));
    
    toast({
      title: "Sessão Concluída",
      description: `Total de vocalizações: ${stats.attempts}, Duração: ${Math.floor(stats.duration / 60)} minutos`
    });
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="shadow-lg mb-6">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <CardTitle className="text-3xl flex items-center">
            <Sparkles className="mr-3" /> Fala Mágica
          </CardTitle>
          <p className="text-purple-100">
            Ferramentas para estimular e desenvolver a fala em crianças com TEA
          </p>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="speech" className="space-y-6">
        <TabsList className="w-full grid grid-cols-4 gap-2">
          <TabsTrigger value="speech" className="flex items-center justify-center">
            <Mic className="mr-2" /> Detector de Fala
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center justify-center">
            <Gift className="mr-2" /> Mini-Mundo
          </TabsTrigger>
          <TabsTrigger value="pdfs" className="flex items-center justify-center">
            <FileText className="mr-2" /> PDFs Interativos
          </TabsTrigger>
          <TabsTrigger value="audios" className="flex items-center justify-center">
            <PlayCircle className="mr-2" /> Áudios Guiados
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="speech">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <SessionControl onSessionComplete={handleSessionComplete} />
              <WordTracker />
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Mic className="mr-2 text-purple-500" /> Detector de Fala
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <MagicalGuide 
                      character="fada"
                      message="Vamos praticar! Cada som é uma conquista mágica!"
                    />
                    
                    <SpeechDetector onVocalization={handleVocalization} />
                  </div>
                </CardContent>
              </Card>
              
              <RewardSystem 
                rewards={mockRewards} 
                userProgress={userProgress}
                onClaimReward={handleClaimReward}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="pdfs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <FileText className="mr-2 text-purple-500" /> Cartelas Interativas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPDFs.map(pdf => (
                      <div 
                        key={pdf.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                          currentPDF?.id === pdf.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                        }`}
                        onClick={() => setCurrentPDF(pdf)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                            {pdf.thumbnailUrl ? (
                              <img 
                                src={pdf.thumbnailUrl} 
                                alt={pdf.title}
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-purple-100">
                                <FileText className="text-purple-500" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-medium text-purple-700">{pdf.title}</h4>
                            <p className="text-sm text-gray-500">
                              {pdf.words.length} palavras • {pdf.category}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button className="w-full" variant="outline">
                      <Plus size={16} className="mr-2" /> Adicionar Nova Cartela
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              {currentPDF ? (
                <PDFViewer pdf={currentPDF} onPlayWord={() => {}} />
              ) : (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 h-full flex flex-col items-center justify-center">
                  <FileText size={64} className="text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhuma cartela selecionada</h3>
                  <p className="text-gray-500 text-center mb-6">
                    Selecione uma cartela à esquerda ou crie uma nova para começar
                  </p>
                  <div className="flex space-x-4">
                    <Button variant="outline">
                      <Plus size={16} className="mr-2" /> Nova Cartela
                    </Button>
                    <Button>
                      <Download size={16} className="mr-2" /> Baixar Exemplos
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="audios">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Music className="mr-2 text-purple-500" /> Áudios Musicais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAudios.map(audio => (
                      <div 
                        key={audio.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                          currentAudio?.id === audio.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                        }`}
                        onClick={() => setCurrentAudio(audio)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                            {audio.thumbnailUrl ? (
                              <img 
                                src={audio.thumbnailUrl} 
                                alt={audio.title}
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-purple-100">
                                <Music className="text-purple-500" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-medium text-purple-700">{audio.title}</h4>
                            <p className="text-sm text-gray-500">
                              {Math.floor(audio.duration / 60)}:{(audio.duration % 60).toString().padStart(2, '0')} • {audio.voiceType}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button className="w-full" variant="outline">
                      <Plus size={16} className="mr-2" /> Adicionar Novo Áudio
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              {currentAudio ? (
                <AudioGuide audio={currentAudio} />
              ) : (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 h-full flex flex-col items-center justify-center">
                  <Music size={64} className="text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhum áudio selecionado</h3>
                  <p className="text-gray-500 text-center mb-6">
                    Selecione um áudio à esquerda ou adicione um novo para começar
                  </p>
                  <div className="flex space-x-4">
                    <Button variant="outline">
                      <Plus size={16} className="mr-2" /> Novo Áudio
                    </Button>
                    <Button>
                      <Download size={16} className="mr-2" /> Baixar Exemplos
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="rewards">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <RewardSystem 
                rewards={mockRewards} 
                userProgress={userProgress}
                onClaimReward={handleClaimReward}
              />
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Gift className="mr-2 text-purple-500" /> Progresso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Estatísticas</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-purple-600">
                            {userProgress.vocalizationCount}
                          </div>
                          <div className="text-sm text-gray-600">Vocalizações</div>
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-indigo-600">
                            {userProgress.totalPoints}
                          </div>
                          <div className="text-sm text-gray-600">Pontos</div>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-amber-600">
                            {userProgress.unlockedRewards.length}
                          </div>
                          <div className="text-sm text-gray-600">Recompensas</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-green-600">
                            {userProgress.completedActivities.length}
                          </div>
                          <div className="text-sm text-gray-600">Atividades</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Dicas para Pais e Terapeutas</h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 text-sm">
                        <ul className="list-disc pl-4 space-y-2">
                          <li>Celebre todas as tentativas de vocalização, não apenas palavras formadas.</li>
                          <li>Use as cartelas de palavras em momentos de brincadeira, sem pressão.</li>
                          <li>Escute os áudios guiados junto com a criança e imite os sons.</li>
                          <li>Mantenha sessões curtas (5-10 minutos) várias vezes ao dia, em vez de sessões longas.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
