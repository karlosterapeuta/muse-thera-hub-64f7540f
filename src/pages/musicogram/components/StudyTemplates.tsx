
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StudyTemplate } from "../types";
import { BookOpen, Clock, Users, Target } from "lucide-react";

interface StudyTemplatesProps {
  templates: StudyTemplate[];
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

const StudyTemplates: React.FC<StudyTemplatesProps> = ({
  templates,
  selectedTemplate,
  onSelectTemplate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  // Obter categorias únicas
  const categories = Array.from(new Set(templates.map(t => t.category)));
  const difficulties = ["Fácil", "Médio", "Difícil"];

  // Filtrar templates
  const filteredTemplates = templates.filter(template => {
    const categoryMatch = selectedCategory === "all" || template.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === "all" || template.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil": return "bg-green-100 text-green-800 border-green-200";
      case "Médio": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Difícil": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "Coordenação Motora": "🤸",
      "Expressão Emocional": "😊",
      "Comunicação": "💬",
      "Integração Sensorial": "👂",
      "Atenção e Concentração": "🎯",
      "Habilidades Sociais": "👥",
      "Autorregulação": "🧘",
      "Criatividade": "🎨",
      "Relaxamento": "💤",
      "Memória": "🧠"
    };
    return icons[category] || "📋";
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <div className="flex-1">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {getCategoryIcon(category)} {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todas as dificuldades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as dificuldades</SelectItem>
              {difficulties.map(difficulty => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficulty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className={`
              border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
              hover:shadow-md hover:scale-[1.02] group
              ${selectedTemplate === template.id 
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30" 
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
              }
            `}
            onClick={() => onSelectTemplate(template.id)}
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getCategoryIcon(template.category)}</span>
                  <h4 className="font-semibold text-sm leading-tight">{template.name}</h4>
                </div>
                <Badge className={`text-xs ${getDifficultyColor(template.difficulty)}`}>
                  {template.difficulty}
                </Badge>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded p-2 text-center">
                <div className="text-lg">{template.previewContent}</div>
              </div>

              {/* Info */}
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  <span className="line-clamp-2">{template.objective}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{template.ageGroup}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{template.duration}</span>
                  </div>
                </div>
              </div>

              {/* Category badge */}
              <Badge variant="outline" className="text-xs">
                {template.category}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Nenhum template encontrado com os filtros selecionados.</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setSelectedCategory("all");
              setSelectedDifficulty("all");
            }}
            className="mt-2"
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
};

export default StudyTemplates;
