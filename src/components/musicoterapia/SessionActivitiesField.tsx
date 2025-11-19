import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Info, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';

interface SessionActivitiesFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const SESSION_ACTIVITIES_DATA = {
  "Expressão Musical": [
    "Foram realizadas atividades de improvisação musical livre utilizando diversos instrumentos de percussão, cordas e sopro para expressão criativa espontânea.",
    "Implementaram-se exercícios de criação musical colaborativa através de composição de melodias simples e construção de arranjos grupais.",
    "Desenvolveram-se técnicas de canto terapêutico com foco na expressão vocal, respiração e projeção da voz de forma saudável.",
    "Aplicaram-se atividades de exploração instrumental direcionada, favorecendo descoberta sonora e desenvolvimento da sensibilidade musical."
  ],
  "Regulação Emocional Musical": [
    "Realizaram-se técnicas de relaxamento musical através de audição direcionada, visualização guiada e respiração sincronizada com elementos musicais.",
    "Implementaram-se exercícios de modulação emocional utilizando diferentes gêneros musicais, andamentos e dinâmicas para regulação do estado afetivo.",
    "Desenvolveram-se atividades de catarse musical através da expressão livre de sentimentos e emoções por meio de improvisação direcionada.",
    "Aplicaram-se técnicas de ancoragem emocional positiva associando experiências musicais prazerosas a estados de bem-estar e tranquilidade."
  ],
  "Comunicação Musical": [
    "Foram implementadas atividades de diálogo musical através de conversas instrumentais, imitação sonora e complementaridade rítmica.",
    "Desenvolveram-se exercícios de turnos musicais com alternância de liderança, escuta ativa e responsividade aos estímulos sonoros do parceiro.",
    "Aplicaram-se técnicas de comunicação não-verbal musical utilizando gestos, movimentos corporais e expressões faciais sincronizadas com a música.",
    "Realizaram-se atividades de expressão musical de necessidades e sentimentos através de códigos sonoros e simbolismo musical personalizado."
  ],
  "Integração Social Musical": [
    "Implementaram-se atividades musicais em grupo com foco na cooperação, sincronização e construção coletiva de experiências sonoras.",
    "Desenvolveram-se exercícios de ensemble musical promovendo escuta mútua, complementaridade e senso de pertencimento ao grupo.",
    "Aplicaram-se técnicas de liderança musical alternada, favorecendo iniciativa, responsabilidade e reconhecimento das contribuições individuais.",
    "Realizaram-se atividades de criação musical coletiva através de projetos colaborativos e apresentações musicais estruturadas."
  ]
};

const CATEGORY_FILTERS = [
  "Todas as Categorias",
  "Expressão Musical", 
  "Regulação Emocional Musical",
  "Comunicação Musical",
  "Integração Social Musical"
];

export function SessionActivitiesField({ value, onChange }: SessionActivitiesFieldProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas as Categorias');
  const [customActivity, setCustomActivity] = useState<string>('');

  const filteredData = useMemo(() => {
    let data: Record<string, string[]> = SESSION_ACTIVITIES_DATA;
    
    // Filter by category
    if (selectedCategory !== 'Todas as Categorias') {
      const categoryData = SESSION_ACTIVITIES_DATA[selectedCategory as keyof typeof SESSION_ACTIVITIES_DATA];
      data = categoryData ? { [selectedCategory]: categoryData } : {};
    }
    
    // Filter by search term
    if (!searchTerm) return data;
    
    const filtered: Record<string, string[]> = {};
    Object.entries(data).forEach(([category, activities]) => {
      const filteredActivities = activities.filter(activity =>
        activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredActivities.length > 0) {
        filtered[category] = filteredActivities;
      }
    });
    return filtered;
  }, [searchTerm, selectedCategory]);

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

  const handleAddCustomActivity = () => {
    const trimmedActivity = customActivity.trim();
    
    // Validar que não está vazio
    if (!trimmedActivity) {
      return;
    }
    
    // Validar que não é duplicado
    if (value.includes(trimmedActivity)) {
      return;
    }
    
    // Adicionar à lista de atividades
    onChange([...value, trimmedActivity]);
    
    // Limpar o campo
    setCustomActivity('');
  };

  const isPreDefinedActivity = (activity: string) => {
    return Object.values(SESSION_ACTIVITIES_DATA)
      .flat()
      .includes(activity);
  };

  const selectedCount = value.length;

  return (
    <div className="space-y-6">
      {/* Orientações para Preenchimento */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-700 text-sm">
            <Info className="h-4 w-4" />
            Orientações para Preenchimento
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <div>
            <span className="font-medium text-sm text-blue-900">Descrição:</span>
            <span className="text-sm text-blue-800 ml-2">Atividades musicoterapêuticas implementadas</span>
          </div>
          <div>
            <span className="font-medium text-sm text-blue-900">Orientação:</span>
            <span className="text-sm text-blue-800 ml-2">Descreva técnicas e instrumentos musicais específicos utilizados</span>
          </div>
        </CardContent>
      </Card>

      {/* Selected Activities */}
      {selectedCount > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Atividades Selecionadas ({selectedCount})
          </Label>
          <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
            {value.map((activity) => (
              <Badge
                key={activity}
                variant="secondary"
                className="text-xs py-1 px-2 leading-relaxed"
              >
                {activity.length > 100 ? `${activity.substring(0, 100)}...` : activity}
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
        </div>
      )}

      {/* Category Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">📂</span>
          </div>
          <Label className="text-sm font-medium">Categorias de Preenchimento</Label>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {CATEGORY_FILTERS.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="text-xs"
            >
              {category === "Todas as Categorias" ? "📋 Todas as Categorias" : category}
            </Button>
          ))}
        </div>
      </div>

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

      {/* Activities by Category */}
      <div className="space-y-4">
        {Object.entries(filteredData).map(([category, activities]) => (
          <Card key={category} className="border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-600 text-sm">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                  {Object.keys(SESSION_ACTIVITIES_DATA).indexOf(category) + 1}
                </div>
                {category}
                <span className="text-xs text-muted-foreground font-normal">
                  {activities.length} opções
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {activities.map((activity, index) => {
                  const isSelected = value.includes(activity);
                  return (
                    <div key={activity} className="flex items-start space-x-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs mt-0.5">
                        •
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id={`activity-${category}-${index}`}
                            checked={isSelected}
                            onCheckedChange={(checked) => 
                              handleActivityChange(activity, checked as boolean)
                            }
                            className="mt-1"
                          />
                          <Label
                            htmlFor={`activity-${category}-${index}`}
                            className="text-sm font-normal cursor-pointer flex-1 leading-relaxed"
                          >
                            {activity}
                          </Label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {Object.keys(filteredData).length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhuma atividade encontrada para "{searchTerm}"</p>
        </div>
      )}

      {/* Seção de Atividades Personalizadas */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 dark:from-purple-950/30 dark:to-pink-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <span className="text-xl">✏️</span>
            Adicionar Atividade Personalizada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Card de orientações */}
          <div className="bg-purple-100 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-purple-800 dark:text-purple-200 font-medium text-sm">
                  Como descrever atividades musicoterapêuticas eficazes:
                </p>
                <ul className="text-purple-700 dark:text-purple-300 text-sm space-y-1 ml-4 list-disc">
                  <li>Especifique as técnicas musicais utilizadas</li>
                  <li>Mencione os instrumentos e recursos empregados</li>
                  <li>Descreva o tipo de interação (individual, grupo, dirigida, livre)</li>
                  <li>Relate os objetivos práticos da atividade</li>
                  <li>Inclua informações sobre duração ou intensidade quando relevante</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Campo de entrada */}
          <div className="space-y-2">
            <Label htmlFor="custom-activity" className="text-purple-700 dark:text-purple-300 font-medium">
              Digite a descrição da atividade:
            </Label>
            <Textarea
              id="custom-activity"
              value={customActivity}
              onChange={(e) => setCustomActivity(e.target.value)}
              placeholder="Ex: Realizou-se sessão de improvisação rítmica com instrumentos de percussão variados (djembê, bongôs, chocalhos) para promover expressão corporal e coordenação motora, com duração de 20 minutos..."
              className="min-h-[120px] border-purple-300 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 resize-vertical"
              onKeyDown={(e) => {
                // Adicionar com Ctrl+Enter ou Cmd+Enter
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  handleAddCustomActivity();
                }
              }}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-purple-600 dark:text-purple-400">
                {customActivity.length > 0 && `${customActivity.length} caracteres`}
                {customActivity.length === 0 && "Dica: Use Ctrl+Enter para adicionar rapidamente"}
              </p>
              <Button
                type="button"
                onClick={handleAddCustomActivity}
                disabled={!customActivity.trim()}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
              >
                <span className="mr-2">➕</span>
                Adicionar Atividade
              </Button>
            </div>
          </div>

          {/* Exemplos inspiradores */}
          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
            <p className="text-xs text-purple-700 dark:text-purple-300 font-medium mb-2">
              💡 Exemplos de descrições personalizadas:
            </p>
            <ul className="text-xs text-purple-600 dark:text-purple-400 space-y-1 ml-4 list-disc">
              <li>"Aplicação de técnica de recriação musical com canções escolhidas pelo paciente, favorecendo reminiscência e expressão de memórias afetivas"</li>
              <li>"Exercícios de movimento e dança livre ao som de diferentes ritmos brasileiros (samba, forró, maracatu) para estimulação sensório-motora"</li>
              <li>"Uso de aplicativos de composição musical digital (GarageBand) para criação colaborativa e desenvolvimento de autonomia criativa"</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}