import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Target } from 'lucide-react';

interface ObjectivesSelectorProps {
  label: string;
  objectives: string[];
  onAdd: (objective: string) => void;
  onRemove: (index: number) => void;
  suggestions: string[];
  type: 'general' | 'specific';
}

const generalObjectives = [
  "Promover a comunicação verbal e não verbal",
  "Favorecer a autorregulação emocional",
  "Estimular habilidades cognitivas (atenção, memória, concentração)",
  "Melhorar habilidades motoras finas e grossas",
  "Incentivar a socialização e interação",
  "Desenvolver expressão criativa e emocional",
  "Reduzir comportamentos disruptivos",
  "Estimular desenvolvimento da linguagem"
];

const specificObjectives = [
  "Ampliar o tempo de atenção sustentada em atividades musicais para até [X] minutos",
  "Favorecer a iniciação de turnos musicais em atividades rítmicas",
  "Desenvolver a expressão vocal através de canções dirigidas",
  "Estimular movimentos coordenados ao acompanhar pulso musical",
  "Incentivar interação em grupo através de improvisações coletivas",
  "Promover imitação de gestos e movimentos musicais",
  "Desenvolver discriminação auditiva de timbres e intensidades",
  "Aumentar vocabulário funcional através de canções temáticas",
  "Melhorar coordenação bilateral através de instrumentos de percussão",
  "Desenvolver controle respiratório através de exercícios vocais"
];

export function ObjectivesSelector({ 
  label, 
  objectives, 
  onAdd, 
  onRemove, 
  type 
}: ObjectivesSelectorProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const suggestions = type === 'general' ? generalObjectives : specificObjectives;

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue("");
    }
  };

  const handleSuggestionAdd = (suggestion: string) => {
    onAdd(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium text-foreground">
          {label}
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="text-xs"
        >
          <Target className="h-3 w-3 mr-1" />
          {showSuggestions ? 'Ocultar' : 'Sugestões'}
        </Button>
      </div>

      {showSuggestions && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-800 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Objetivos Sugeridos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleSuggestionAdd(suggestion)}
                className="w-full text-left text-sm h-auto p-3 justify-start whitespace-normal hover:bg-green-100"
              >
                <Plus className="h-3 w-3 mr-2 flex-shrink-0" />
                <span className="text-left">{suggestion}</span>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Digite um ${type === 'general' ? 'objetivo geral' : 'objetivo específico'} ou escolha das sugestões`}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1"
        />
        <Button type="button" onClick={handleAdd} disabled={!inputValue.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {objectives.length > 0 && (
        <div className="space-y-2">
          {objectives.map((objective, index) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
              <span className="flex-1 text-sm">{objective}</span>
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