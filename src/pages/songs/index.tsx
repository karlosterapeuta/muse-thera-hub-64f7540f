import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, Music, Mic, Gift, 
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import SpeechDetector from "@/components/fala-magica/SpeechDetector";
import PDFViewer from "@/components/fala-magica/PDFViewer";
import AudioGuide from "@/components/fala-magica/AudioGuide";
import RewardSystem from "@/components/fala-magica/RewardSystem";
import WordTracker from "@/components/fala-magica/WordTracker";
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
      
      <Tabs defaultValue="practice" className="space-y-6">
        <TabsList className="w-full grid grid-cols-3 gap-2">
          <TabsTrigger value="practice" className="flex items-center justify-center">
            <Mic className="mr-2" /> Prática de Fala
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center justify-center">
            <FileText className="mr-2" /> Materiais
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center justify-center">
            <Gift className="mr-2" /> Recompensas
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="practice">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <MagicalGuide 
                character="fada"
                message="Vamos praticar! Cada som é uma conquista mágica!"
              />
              <SpeechDetector onVocalization={handleVocalization} />
              <WordTracker />
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Music className="mr-2 text-purple-500" /> Áudio Guiado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentAudio ? (
                    <AudioGuide audio={currentAudio} />
                  ) : (
                    <div className="text-center text-gray-500">
                      Selecione um áudio dos materiais para começar
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="materials">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <FileText className="mr-2 text-purple-500" /> PDFs e Áudios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-medium text-purple-700">Cartelas Interativas</h3>
                      {mockPDFs.map(pdf => (
                        <button
                          key={pdf.id}
                          onClick={() => setCurrentPDF(pdf)}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            currentPDF?.id === pdf.id 
                              ? 'border-purple-500 bg-purple-50' 
                              : 'border-gray-200 hover:border-purple-200'
                          }`}
                        >
                          <div className="font-medium">{pdf.title}</div>
                          <div className="text-sm text-gray-500">{pdf.category}</div>
                        </button>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium text-purple-700">Áudios Guiados</h3>
                      {mockAudios.map(audio => (
                        <button
                          key={audio.id}
                          onClick={() => setCurrentAudio(audio)}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            currentAudio?.id === audio.id 
                              ? 'border-purple-500 bg-purple-50' 
                              : 'border-gray-200 hover:border-purple-200'
                          }`}
                        >
                          <div className="font-medium">{audio.title}</div>
                          <div className="text-sm text-gray-500">{audio.voiceType}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              {currentPDF ? (
                <PDFViewer pdf={currentPDF} onPlayWord={() => {}} />
              ) : (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-600">
                    Selecione um material para visualizar
                  </h3>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="rewards">
          <RewardSystem 
            rewards={mockRewards} 
            userProgress={userProgress}
            onClaimReward={handleClaimReward}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
