
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Trophy, Target, Music, CheckCircle, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Lesson {
  id: string;
  title: string;
  description: string;
  level: number;
  notes: string[];
  pattern: string[];
  completed: boolean;
  stars: number;
  tempo: number;
}

interface LessonSystemProps {
  onLessonSelect: (lesson: Lesson) => void;
  currentProgress: number;
  onStartLesson: () => void;
  completedLessons: string[];
  onLessonComplete: (lessonId: string, stars: number) => void;
}

const LessonSystem: React.FC<LessonSystemProps> = ({
  onLessonSelect,
  currentProgress,
  onStartLesson,
  completedLessons = [],
  onLessonComplete
}) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [userLevel, setUserLevel] = useState(1);
  const { toast } = useToast();

  const lessons: Lesson[] = [
    {
      id: "1",
      title: "🔴 Descobrindo o DÓ",
      description: "Aprenda a reconhecer e tocar a nota DÓ (vermelho)",
      level: 1,
      notes: ["C"],
      pattern: ["C", "C", "C", "C"],
      completed: completedLessons.includes("1"),
      stars: completedLessons.includes("1") ? 3 : 0,
      tempo: 80
    },
    {
      id: "2", 
      title: "🟠 Conhecendo o RÉ",
      description: "Explore a nota RÉ (laranja) e sua posição",
      level: 1,
      notes: ["D"],
      pattern: ["D", "D", "D", "D"],
      completed: completedLessons.includes("2"),
      stars: completedLessons.includes("2") ? 3 : 0,
      tempo: 80
    },
    {
      id: "3",
      title: "🔴🟠 DÓ e RÉ Juntos",
      description: "Combine DÓ e RÉ em sequências simples",
      level: 2,
      notes: ["C", "D"],
      pattern: ["C", "D", "C", "D", "C", "D"],
      completed: completedLessons.includes("3"),
      stars: completedLessons.includes("3") ? 3 : 0,
      tempo: 90
    },
    {
      id: "4",
      title: "🟡 A Alegria do MI",
      description: "Descubra a nota MI (amarelo) brilhante",
      level: 2,
      notes: ["E"],
      pattern: ["E", "E", "E", "E"],
      completed: completedLessons.includes("4"),
      stars: completedLessons.includes("4") ? 3 : 0,
      tempo: 80
    },
    {
      id: "5",
      title: "🎵 Escala Básica",
      description: "Toque DÓ-RÉ-MI em sequência",
      level: 3,
      notes: ["C", "D", "E"],
      pattern: ["C", "D", "E", "E", "D", "C"],
      completed: completedLessons.includes("5"),
      stars: completedLessons.includes("5") ? 3 : 0,
      tempo: 100
    },
    {
      id: "6",
      title: "🎶 Melodia Simples",
      description: "Toque uma melodia com DÓ, RÉ e MI",
      level: 3,
      notes: ["C", "D", "E"],
      pattern: ["C", "C", "D", "D", "E", "E", "D", "C"],
      completed: completedLessons.includes("6"),
      stars: completedLessons.includes("6") ? 3 : 0,
      tempo: 110
    }
  ];

  // Calcular nível do usuário baseado nas lições completas
  useEffect(() => {
    const completedCount = completedLessons.length;
    const newLevel = Math.floor(completedCount / 2) + 1;
    setUserLevel(newLevel);
  }, [completedLessons]);

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    onLessonSelect(lesson);
    
    toast({
      title: `📚 Lição selecionada: ${lesson.title}`,
      description: lesson.description,
    });
  };

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    onLessonSelect(lesson);
    onStartLesson();
    
    toast({
      title: `🎯 Iniciando lição: ${lesson.title}`,
      description: "Vamos praticar juntos! Siga as notas na partitura.",
    });
  };

  const isLessonLocked = (lesson: Lesson) => {
    if (lesson.level === 1) return false;
    
    // Verificar se pelo menos uma lição do nível anterior foi completada
    const previousLevelLessons = lessons.filter(l => l.level === lesson.level - 1);
    const completedPreviousLevel = previousLevelLessons.some(l => l.completed);
    
    return !completedPreviousLevel;
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return "from-green-400 to-green-600";
      case 2: return "from-blue-400 to-blue-600";
      case 3: return "from-purple-400 to-purple-600";
      default: return "from-gray-400 to-gray-600";
    }
  };

  const getDifficultyText = (level: number) => {
    switch (level) {
      case 1: return "🌱 Iniciante";
      case 2: return "🌿 Intermediário";
      case 3: return "🌳 Avançado";
      default: return "🎯 Especialista";
    }
  };

  const getColorForNote = (note: string) => {
    const colorMap: { [key: string]: string } = {
      'C': 'bg-red-500',
      'D': 'bg-orange-500', 
      'E': 'bg-yellow-500',
      'F': 'bg-green-500',
      'G': 'bg-blue-500',
      'A': 'bg-purple-500',
      'B': 'bg-pink-500'
    };
    return colorMap[note] || 'bg-gray-500';
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-800 mb-2">
          🎓 Sistema de Lições Musicais
        </h2>
        <p className="text-indigo-600">Aprenda música de forma divertida e progressiva!</p>
        
        <div className="mt-4 bg-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-600">SEU PROGRESSO</span>
            <span className="text-sm font-bold text-indigo-600">{currentProgress}%</span>
          </div>
          <Progress value={currentProgress} className="h-3" />
          <div className="mt-2 flex items-center justify-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-bold text-gray-700">Nível {userLevel}</span>
            <span className="text-xs text-gray-500">({completedLessons.length}/{lessons.length} lições)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lessons.map((lesson) => {
          const isLocked = isLessonLocked(lesson);
          
          return (
            <Card 
              key={lesson.id}
              className={`transition-all duration-300 border-3 ${
                isLocked 
                  ? "opacity-50 cursor-not-allowed border-gray-300" 
                  : `cursor-pointer hover:scale-105 hover:shadow-xl ${
                      selectedLesson?.id === lesson.id 
                        ? "border-yellow-400 shadow-xl shadow-yellow-400/50" 
                        : "border-transparent"
                    }`
              }`}
              onClick={() => !isLocked && handleSelectLesson(lesson)}
            >
              <CardHeader className={`bg-gradient-to-r ${getLevelColor(lesson.level)} text-white rounded-t-lg relative`}>
                {isLocked && (
                  <div className="absolute top-2 right-2 bg-gray-700 rounded-full p-1">
                    <span className="text-xs">🔒</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{lesson.title}</CardTitle>
                  <div className="flex items-center space-x-1">
                    {lesson.completed && <CheckCircle className="w-6 h-6 text-yellow-300" />}
                    <Target className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-sm opacity-90">{getDifficultyText(lesson.level)}</div>
              </CardHeader>
              
              <CardContent className="p-4">
                <p className="text-gray-700 text-sm mb-4">{lesson.description}</p>
                
                <div className="mb-4">
                  <div className="text-xs font-bold text-gray-500 mb-2">NOTAS DA LIÇÃO:</div>
                  <div className="flex space-x-2">
                    {lesson.notes.map((note, index) => (
                      <div 
                        key={index}
                        className={`w-8 h-8 rounded-full ${getColorForNote(note)} flex items-center justify-center text-white font-bold text-xs shadow-lg`}
                      >
                        {note}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs font-bold text-gray-500 mb-2">SEQUÊNCIA:</div>
                  <div className="flex flex-wrap gap-1">
                    {lesson.pattern.map((note, index) => (
                      <span key={index} className="bg-gray-200 px-2 py-1 rounded text-xs font-bold">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {[1, 2, 3].map((star) => (
                      <Star 
                        key={star}
                        className={`w-5 h-5 ${
                          star <= lesson.stars 
                            ? "text-yellow-500 fill-yellow-500" 
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  
                  <Button
                    size="sm"
                    disabled={isLocked}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartLesson(lesson);
                    }}
                    className={`${
                      isLocked 
                        ? "bg-gray-400 cursor-not-allowed" 
                        : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    }`}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    {isLocked ? "Bloqueado" : "Iniciar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedLesson && (
        <div className="mt-6 bg-white rounded-xl p-6 shadow-xl border-4 border-yellow-400">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-indigo-800 mb-2">
              ✨ Lição Selecionada: {selectedLesson.title}
            </h3>
            <p className="text-gray-600 mb-4">{selectedLesson.description}</p>
            
            <div className="flex justify-center space-x-4">
              <div className="bg-indigo-100 rounded-lg p-3">
                <Music className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <div className="text-sm font-bold text-indigo-800">Notas: {selectedLesson.notes.length}</div>
              </div>
              
              <div className="bg-green-100 rounded-lg p-3">
                <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-bold text-green-800">Nível: {selectedLesson.level}</div>
              </div>
              
              <div className="bg-yellow-100 rounded-lg p-3">
                <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-sm font-bold text-yellow-800">Estrelas: {selectedLesson.stars}/3</div>
              </div>

              <div className="bg-blue-100 rounded-lg p-3">
                <span className="text-2xl">⏱️</span>
                <div className="text-sm font-bold text-blue-800">Tempo: {selectedLesson.tempo} BPM</div>
              </div>
            </div>

            <div className="mt-4">
              <Button
                onClick={() => handleStartLesson(selectedLesson)}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-2"
              >
                🎯 Começar Esta Lição
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonSystem;
