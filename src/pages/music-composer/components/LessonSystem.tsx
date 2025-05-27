
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
}

interface LessonSystemProps {
  onLessonSelect: (lesson: Lesson) => void;
  currentProgress: number;
  onStartLesson: () => void;
}

const LessonSystem: React.FC<LessonSystemProps> = ({
  onLessonSelect,
  currentProgress,
  onStartLesson
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
      pattern: ["C", "C", "C"],
      completed: false,
      stars: 0
    },
    {
      id: "2", 
      title: "🟠 Conhecendo o RÉ",
      description: "Explore a nota RÉ (laranja) e sua posição",
      level: 1,
      notes: ["D"],
      pattern: ["D", "D", "D"],
      completed: false,
      stars: 0
    },
    {
      id: "3",
      title: "🔴🟠 DÓ e RÉ Juntos",
      description: "Combine DÓ e RÉ em sequências simples",
      level: 2,
      notes: ["C", "D"],
      pattern: ["C", "D", "C", "D"],
      completed: false,
      stars: 0
    },
    {
      id: "4",
      title: "🟡 A Alegria do MI",
      description: "Descubra a nota MI (amarelo) brilhante",
      level: 2,
      notes: ["E"],
      pattern: ["E", "E", "E"],
      completed: false,
      stars: 0
    },
    {
      id: "5",
      title: "🎵 Escala Básica",
      description: "Toque DÓ-RÉ-MI em sequência",
      level: 3,
      notes: ["C", "D", "E"],
      pattern: ["C", "D", "E", "C", "D", "E"],
      completed: false,
      stars: 0
    }
  ];

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    onLessonSelect(lesson);
    
    toast({
      title: `📚 Lição selecionada: ${lesson.title}`,
      description: lesson.description,
    });
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
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lessons.map((lesson) => (
          <Card 
            key={lesson.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-3 ${
              selectedLesson?.id === lesson.id 
                ? "border-yellow-400 shadow-xl shadow-yellow-400/50" 
                : "border-transparent"
            }`}
            onClick={() => handleSelectLesson(lesson)}
          >
            <CardHeader className={`bg-gradient-to-r ${getLevelColor(lesson.level)} text-white rounded-t-lg`}>
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
                  {lesson.notes.map((note, index) => {
                    const colors: { [key: string]: string } = {
                      'C': 'bg-red-500',
                      'D': 'bg-orange-500', 
                      'E': 'bg-yellow-500',
                      'F': 'bg-green-500',
                      'G': 'bg-blue-500',
                      'A': 'bg-purple-500',
                      'B': 'bg-pink-500'
                    };
                    return (
                      <div 
                        key={index}
                        className={`w-8 h-8 rounded-full ${colors[note]} flex items-center justify-center text-white font-bold text-xs shadow-lg`}
                      >
                        {note}
                      </div>
                    );
                  })}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartLesson();
                  }}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Iniciar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonSystem;
