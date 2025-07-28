import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SessionActivitiesFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const SESSION_ACTIVITIES_DATA = {
  "Atividades Rítmicas": [
    "Exploração de instrumentos de percussão",
    "Imitação de padrões rítmicos simples",
    "Criação de sequências rítmicas",
    "Jogos rítmicos com movimento corporal",
    "Uso de metrônomo para sincronização",
    "Atividades de pulsação com diferentes andamentos",
    "Exercícios de coordenação motora com ritmo",
    "Improvisação rítmica livre"
  ],
  "Atividades Melódicas": [
    "Canto de melodias simples",
    "Exploração vocal com diferentes alturas",
    "Uso de instrumentos melódicos (xilofone, metalofone)",
    "Imitação de contornos melódicos",
    "Criação de melodias simples",
    "Exercícios de respiração com sons vocais",
    "Vocalização com vogais e consoantes",
    "Canções temáticas adaptadas"
  ],
  "Atividades de Escuta": [
    "Identificação de sons do ambiente",
    "Discriminação auditiva de timbres",
    "Reconhecimento de diferentes estilos musicais",
    "Relaxamento com música instrumental",
    "Atividades de atenção auditiva dirigida",
    "Escuta ativa de diferentes texturas sonoras",
    "Jogos de identificação de instrumentos",
    "Momentos de silêncio e pausa musical"
  ],
  "Atividades de Movimento": [
    "Dança livre com música",
    "Movimentos dirigidos com instrumentos",
    "Expressão corporal rítmica",
    "Jogos de imitação gestual",
    "Coordenação de movimentos bilaterais",
    "Atividades de lateralidade com música",
    "Exercícios de equilíbrio com apoio musical",
    "Caminhada rítmica no espaço"
  ],
  "Atividades de Interação Social": [
    "Jogos musicais em grupo",
    "Atividades de turnos musicais",
    "Comunicação através de instrumentos",
    "Dinâmicas de imitação musical",
    "Construção coletiva de músicas",
    "Exercícios de contato visual com música",
    "Atividades de cooperação musical",
    "Momentos de partilha e expressão"
  ],
  "Atividades de Autorregulação": [
    "Exercícios de respiração com música",
    "Técnicas de relaxamento sonoro",
    "Atividades para gestão de ansiedade",
    "Música para transições e mudanças",
    "Exercícios de foco e concentração",
    "Atividades de autocontrole com ritmo",
    "Técnicas de acalmia com sons suaves",
    "Momentos de introspecção musical"
  ]
};

export function SessionActivitiesField({ value, onChange }: SessionActivitiesFieldProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return SESSION_ACTIVITIES_DATA;
    
    const filtered: Record<string, string[]> = {};
    Object.entries(SESSION_ACTIVITIES_DATA).forEach(([category, activities]) => {
      const filteredActivities = activities.filter(activity =>
        activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredActivities.length > 0) {
        filtered[category] = filteredActivities;
      }
    });
    return filtered;
  }, [searchTerm]);

  const handleActivityChange = (activity: string, checked: boolean) => {
    if (checked) {
      onChange([...value, activity]);
    } else {
      onChange(value.filter(v => v !== activity));
    }
  };

  const removeActivity = (activity: string) => {
    onChange(value.filter(v => v !== activity));
  };

  const selectedCount = value.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          Atividades Selecionadas ({selectedCount})
        </Label>
      </div>

      {/* Selected Activities */}
      {selectedCount > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
          {value.map((activity) => (
            <Badge
              key={activity}
              variant="secondary"
              className="text-xs py-1 px-2"
            >
              {activity}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                onClick={() => removeActivity(activity)}
              >
                ×
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar atividades..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories and Activities */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {Object.entries(filteredData).map(([category, activities]) => (
          <Collapsible
            key={category}
            open={openCategories[category] ?? true}
            onOpenChange={() => toggleCategory(category)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-3 h-auto font-medium"
              >
                <span className="text-left">
                  {category} ({activities.length})
                </span>
                {openCategories[category] === false ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="pl-4 pr-2 pb-2">
              <div className="grid grid-cols-1 gap-2">
                {activities.map((activity) => {
                  const isSelected = value.includes(activity);
                  return (
                    <div key={activity} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        id={`activity-${activity}`}
                        checked={isSelected}
                        onCheckedChange={(checked) => 
                          handleActivityChange(activity, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`activity-${activity}`}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {activity}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {Object.keys(filteredData).length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhuma atividade encontrada para "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}