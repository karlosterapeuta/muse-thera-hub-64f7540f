
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  FileText, Music, Mic, Gift, 
  Sparkles, Search, Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

import SpeechDetector from "@/components/fala-magica/SpeechDetector";
import PDFViewer from "@/components/fala-magica/PDFViewer";
import RewardSystem from "@/components/fala-magica/RewardSystem";
import MagicalGuide from "@/components/fala-magica/MagicalGuide";
import WordTracker from "@/components/fala-magica/WordTracker";

import { 
  InteractivePDF, 
  Reward, 
  UserProgress,
  Word
} from "@/components/fala-magica/types";

const mockPDFs: InteractivePDF[] = [
  {
    id: "pdf1",
    title: "Animais da Fazenda",
    category: "animais",
    pdfUrl: "#",
    thumbnailUrl: "https://placehold.co/200x150?text=Animais",
    words: [
      { id: "w1", text: "Gato", imageUrl: "https://placehold.co/400x400?text=Gato", audioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-domestic-cat-hungry-meow-45.mp3", sungAudioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-cartoon-toy-whistle-616.mp3" },
      { id: "w2", text: "Cachorro", imageUrl: "https://placehold.co/400x400?text=Cachorro", audioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-dog-barking-twice-1.mp3", sungAudioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-cartoon-toy-whistle-616.mp3" },
      { id: "w3", text: "Vaca", imageUrl: "https://placehold.co/400x400?text=Vaca", audioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-cow-moo-1744.mp3", sungAudioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-cartoon-toy-whistle-616.mp3" },
      { id: "w4", text: "Galinha", imageUrl: "https://placehold.co/400x400?text=Galinha", audioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-hen-on-the-farm-clucking-16.mp3", sungAudioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-cartoon-toy-whistle-616.mp3" },
      { id: "w5", text: "Cavalo", imageUrl: "https://placehold.co/400x400?text=Cavalo", audioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-horse-neighing-1712.mp3", sungAudioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-cartoon-toy-whistle-616.mp3" },
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
      { id: "w6", text: "Mesa", imageUrl: "https://placehold.co/400x400?text=Mesa", audioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-female-voice-saying-table-4773.mp3", sungAudioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-ethereal-fairy-win-sound-2019.mp3" },
      { id: "w7", text: "Cama", imageUrl: "https://placehold.co/400x400?text=Cama", audioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-female-voice-saying-bed-4774.mp3", sungAudioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-ethereal-fairy-win-sound-2019.mp3" },
      { id: "w8", text: "Cadeira", imageUrl: "https://placehold.co/400x400?text=Cadeira", audioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-female-voice-saying-chair-4772.mp3", sungAudioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-ethereal-fairy-win-sound-2019.mp3" },
      { id: "w9", text: "Sofá", imageUrl: "https://placehold.co/400x400?text=Sofá", audioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-female-voice-saying-sofa-4775.mp3", sungAudioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-ethereal-fairy-win-sound-2019.mp3" },
      { id: "w10", text: "Geladeira", imageUrl: "https://placehold.co/400x400?text=Geladeira", audioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-female-voice-saying-fridge-4776.mp3", sungAudioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-ethereal-fairy-win-sound-2019.mp3" },
    ],
    createdAt: new Date()
  },
  {
    id: "pdf3",
    title: "Cores e Formas",
    category: "outros",
    pdfUrl: "#",
    thumbnailUrl: "https://placehold.co/200x150?text=Cores",
    words: [
      { id: "w11", text: "Vermelho", imageUrl: "https://placehold.co/400x400/ff0000/ffffff?text=Vermelho", audioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-female-voice-saying-red-4782.mp3", sungAudioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-game-flute-bonus-2313.mp3" },
      { id: "w12", text: "Azul", imageUrl: "https://placehold.co/400x400/0000ff/ffffff?text=Azul", audioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-female-voice-saying-blue-4783.mp3", sungAudioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-game-flute-bonus-2313.mp3" },
      { id: "w13", text: "Verde", imageUrl: "https://placehold.co/400x400/00ff00/ffffff?text=Verde", audioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-female-voice-saying-green-4784.mp3", sungAudioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-game-flute-bonus-2313.mp3" },
      { id: "w14", text: "Amarelo", imageUrl: "https://placehold.co/400x400/ffff00/000000?text=Amarelo", audioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-female-voice-saying-yellow-4785.mp3", sungAudioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-game-flute-bonus-2313.mp3" },
      { id: "w15", text: "Círculo", imageUrl: "https://placehold.co/400x400/ffffff/000000?text=○", audioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-female-voice-saying-circle-4786.mp3", sungAudioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-game-flute-bonus-2313.mp3" },
      { id: "w16", text: "Quadrado", imageUrl: "https://placehold.co/400x400/ffffff/000000?text=□", audioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-female-voice-saying-square-4787.mp3", sungAudioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-game-flute-bonus-2313.mp3" },
    ],
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
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("todos");
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalPoints: 15,
    vocalizationCount: 3,
    completedActivities: [],
    unlockedRewards: ["r1"],
    lastSessionDate: new Date()
  });
  
  const { toast } = useToast();
  
  // Filter PDFs based on search term and category
  const filteredPDFs = mockPDFs.filter(pdf => {
    const matchesSearch = pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdf.words.some(word => word.text.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === "todos" || pdf.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Load user progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('userProgress');
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        // Ensure lastSessionDate is a Date object
        parsedProgress.lastSessionDate = new Date(parsedProgress.lastSessionDate);
        setUserProgress(parsedProgress);
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
    
    // Set the first PDF as selected by default if none is selected
    if (!currentPDF && mockPDFs.length > 0) {
      setCurrentPDF(mockPDFs[0]);
    }
  }, []);
  
  // Save user progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
  }, [userProgress]);

  const handleVocalization = () => {
    setUserProgress(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + 5,
      vocalizationCount: prev.vocalizationCount + 1,
      lastSessionDate: new Date()
    }));
    
    // Check if user has enough points to unlock new rewards
    const newlyUnlockedRewards = mockRewards
      .filter(reward => !userProgress.unlockedRewards.includes(reward.id))
      .filter(reward => userProgress.totalPoints + 5 >= reward.requiredPoints)
      .map(reward => reward.id);
    
    if (newlyUnlockedRewards.length > 0) {
      setUserProgress(prev => ({
        ...prev,
        unlockedRewards: [...prev.unlockedRewards, ...newlyUnlockedRewards]
      }));
      
      toast({
        title: "🎁 Nova recompensa desbloqueada!",
        description: "Vá até a guia Recompensas para ver o que você ganhou!",
      });
    } else {
      toast({
        title: "🎉 Você falou!",
        description: "Você ganhou 5 pontos por falar!",
      });
    }
  };
  
  const handleClaimReward = (rewardId: string) => {
    if (!userProgress.unlockedRewards.includes(rewardId)) {
      setUserProgress(prev => ({
        ...prev,
        unlockedRewards: [...prev.unlockedRewards, rewardId]
      }));
    }
  };

  const handlePlayWord = (word: Word) => {
    // Add points for practicing words
    setUserProgress(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + 2,
      lastSessionDate: new Date()
    }));
    
    toast({
      title: "🔊 " + word.text,
      description: "Você ganhou 2 pontos por praticar esta palavra!",
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <MagicalGuide 
                character="fada"
                message="Vamos praticar! Cada som é uma conquista mágica! Tente imitar os sons dos animais que aparecem."
              />
              <SpeechDetector 
                onVocalization={handleVocalization}
                sensitivity={10} // Lower sensitivity for easier detection
                duration={30} // Longer duration to give more time to practice
              />
            </div>
            
            <div className="md:col-span-1">
              <WordTracker />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="materials">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <FileText className="mr-2 text-purple-500" /> Materiais Visuais
                  </CardTitle>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Buscar materiais..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline" size="icon">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={categoryFilter === "todos" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCategoryFilter("todos")}
                        className="flex items-center gap-1"
                      >
                        <Filter className="h-3 w-3" /> Todos
                      </Button>
                      <Button
                        variant={categoryFilter === "animais" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCategoryFilter("animais")}
                      >
                        Animais
                      </Button>
                      <Button
                        variant={categoryFilter === "casa" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCategoryFilter("casa")}
                      >
                        Casa
                      </Button>
                      <Button
                        variant={categoryFilter === "outros" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCategoryFilter("outros")}
                      >
                        Outros
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-medium text-purple-700">Cartelas Interativas</h3>
                      {filteredPDFs.length > 0 ? (
                        filteredPDFs.map(pdf => (
                          <button
                            key={pdf.id}
                            onClick={() => setCurrentPDF(pdf)}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${
                              currentPDF?.id === pdf.id 
                                ? 'border-purple-500 bg-purple-50' 
                                : 'border-gray-200 hover:border-purple-200'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-12 h-12 rounded bg-purple-100 flex items-center justify-center overflow-hidden"
                              >
                                {pdf.thumbnailUrl && (
                                  <img 
                                    src={pdf.thumbnailUrl} 
                                    alt={pdf.title} 
                                    className="w-full h-full object-cover" 
                                  />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{pdf.title}</div>
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                                    {pdf.category}
                                  </span>
                                  <span>{pdf.words.length} palavras</span>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          <FileText className="h-8 w-8 mb-2 mx-auto opacity-40" />
                          <p>Nenhum material encontrado.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              {currentPDF ? (
                <PDFViewer pdf={currentPDF} onPlayWord={handlePlayWord} />
              ) : (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center h-full flex items-center justify-center">
                  <div>
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-600">
                      Selecione um material para visualizar
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mt-2">
                      Escolha um dos materiais disponíveis na lista ao lado para começar a praticar palavras e sons.
                    </p>
                  </div>
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
