import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, BarChart } from 'lucide-react';

interface EvaluationCriteriaSelectorProps {
  criteria: string[];
  onAdd: (criterion: string) => void;
  onRemove: (index: number) => void;
}

const evaluationSuggestions = [
  "Aumento do tempo de engajamento na atividade musical",
  "Participação espontânea em turnos musicais",
  "Maior variedade de respostas vocais ou gestuais",
  "Redução de comportamentos disruptivos durante sessão",
  "Evidências de transferência para outros contextos",
  "Melhoria na interação social com pares",
  "Desenvolvimento de preferências musicais expressas",
  "Aumento da iniciativa comunicativa",
  "Melhoria na coordenação motora durante atividades rítmicas",
  "Expressão emocional mais adequada",
  "Aumento da tolerância a diferentes estímulos sonoros",
  "Desenvolvimento de habilidades de escuta ativa"
];

export function EvaluationCriteriaSelector({ criteria, onAdd, onRemove }: EvaluationCriteriaSelectorProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue("");
    }
  };

  const handleSuggestionAdd = (suggestion: string) => {
    onAdd(suggestion);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium text-gray-700 dark:text-gray-300">
          Critérios de Avaliação
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="text-xs"
        >
          <BarChart className="h-3 w-3 mr-1" />
          {showSuggestions ? 'Ocultar' : 'Exemplos'}
        </Button>
      </div>

      {showSuggestions && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-800 flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Critérios Sugeridos
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {evaluationSuggestions.map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="cursor-pointer hover:bg-orange-100 transition-colors border-orange-300 text-orange-700"
                  onClick={() => handleSuggestionAdd(suggestion)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {suggestion}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Digite um critério de avaliação ou escolha das sugestões"
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1"
        />
        <Button type="button" onClick={handleAdd} disabled={!inputValue.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {criteria.length > 0 && (
        <div className="space-y-2">
          {criteria.map((criterion, index) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="flex-1 text-sm">{criterion}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                className="h-auto p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}