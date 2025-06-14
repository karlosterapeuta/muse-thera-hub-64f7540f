
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TherapyTemplate } from "../types";

interface TherapyTemplateSelectorProps {
  templates: TherapyTemplate[];
  selectedTemplate: string | null;
  onSelectTemplate: (templateId: string) => void;
}

const TherapyTemplateSelector: React.FC<TherapyTemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onSelectTemplate
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  const categories = {
    motor: { name: "Coordenação Motora", icon: "🤸" },
    communication: { name: "Comunicação", icon: "💬" },
    attention: { name: "Atenção", icon: "🎯" },
    emotional: { name: "Emocional", icon: "😊" },
    social: { name: "Social", icon: "👥" },
    memory: { name: "Memória", icon: "🧠" }
  };

  const difficulties = {
    easy: { name: "Fácil", color: "bg-green-100 text-green-800" },
    medium: { name: "Médio", color: "bg-yellow-100 text-yellow-800" },
    hard: { name: "Difícil", color: "bg-red-100 text-red-800" }
  };

  const filteredTemplates = templates.filter(template => {
    const categoryMatch = categoryFilter === "all" || template.category === categoryFilter;
    const difficultyMatch = difficultyFilter === "all" || template.difficulty === difficultyFilter;
    return categoryMatch && difficultyMatch;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Atividades Terapêuticas
        </h2>
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {Object.entries(categories).map(([key, cat]) => (
                <SelectItem key={key} value={key}>
                  {cat.icon} {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Dificuldade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {Object.entries(difficulties).map(([key, diff]) => (
                <SelectItem key={key} value={key}>
                  {diff.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className={`
              relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
              hover:shadow-lg hover:scale-[1.02] group
              ${selectedTemplate === template.id 
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md" 
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
              }
            `}
            onClick={() => onSelectTemplate(template.id)}
            style={{ borderColor: selectedTemplate === template.id ? template.color : undefined }}
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{template.icon}</span>
                  <h3 className="font-semibold text-sm">{template.name}</h3>
                </div>
                <Badge className={difficulties[template.difficulty].color}>
                  {difficulties[template.difficulty].name}
                </Badge>
              </div>

              {/* Category */}
              <Badge 
                variant="outline" 
                className="text-xs"
                style={{ borderColor: template.color, color: template.color }}
              >
                {categories[template.category].name}
              </Badge>

              {/* Description */}
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {template.description}
              </p>

              {/* Info */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{template.ageGroup}</span>
                <span>{template.duration}</span>
              </div>

              {/* Activities count */}
              <div className="text-xs text-gray-500">
                {template.activities.length} atividade{template.activities.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Selected indicator */}
            {selectedTemplate === template.id && (
              <div 
                className="absolute top-2 right-2 w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: template.color }}
              />
            )}
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma atividade encontrada com os filtros selecionados.</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setCategoryFilter("all");
              setDifficultyFilter("all");
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

export default TherapyTemplateSelector;
