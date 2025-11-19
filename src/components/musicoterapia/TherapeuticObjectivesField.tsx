import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Info, X } from 'lucide-react';

interface TherapeuticObjectivesFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const THERAPEUTIC_CATEGORIES = {
  'expressao_musical': {
    title: 'Expressão Musical',
    count: 4,
    options: [
      'Desenvolver expressão criativa através de improvisação musical espontânea e direcionada.',
      'Promover comunicação não-verbal através de experiências musicais expressivas e significativas.',
      'Estimular criatividade musical utilizando diversos instrumentos e recursos sonoros disponíveis.',
      'Fortalecer capacidade de expressão emocional através da criação e interpretação musical.'
    ]
  },
  'regulacao_musica': {
    title: 'Regulação Através da Música',
    count: 4,
    options: [
      'Desenvolver autorregulação emocional através de experiências musicais estruturadas e terapêuticas.',
      'Promover estados de relaxamento e bem-estar utilizando música como mediador terapêutico.',
      'Estimular modulação do humor e energia através de atividades musicais específicas.',
      'Fortalecer estratégias de enfrentamento e organização interna através da experiência musical.'
    ]
  },
  'desenvolvimento_musical': {
    title: 'Desenvolvimento Musical',
    count: 4,
    options: [
      'Desenvolver percepção musical incluindo discriminação de ritmos, melodias e harmonias.',
      'Promover coordenação rítmica integrada ao movimento corporal e expressão gestual.',
      'Estimular habilidades musicais básicas através de atividades lúdicas e prazerosas.',
      'Fortalecer sensibilidade musical e apreciação estética de diferentes estilos musicais.'
    ]
  },
  'integracao_social': {
    title: 'Integração Social Musical',
    count: 4,
    options: [
      'Desenvolver habilidades de cooperação através de atividades musicais grupais e ensemble.',
      'Promover comunicação interpessoal através de experiências musicais compartilhadas.',
      'Estimular participação social ativa em contextos musicais coletivos e comunitários.',
      'Fortalecer vínculos interpessoais através de experiências musicais significativas e colaborativas.'
    ]
  }
};

export function TherapeuticObjectivesField({ value = [], onChange }: TherapeuticObjectivesFieldProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customObjective, setCustomObjective] = useState<string>('');

  const handleOptionToggle = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter(v => v !== option)
      : [...value, option];
    onChange(newValue);
  };

  const getDisplayedOptions = () => {
    if (selectedCategory === 'all') {
      return Object.values(THERAPEUTIC_CATEGORIES).flatMap(cat => cat.options);
    }
    return THERAPEUTIC_CATEGORIES[selectedCategory as keyof typeof THERAPEUTIC_CATEGORIES]?.options || [];
  };

  const getCategoryOptions = (categoryKey: string) => {
    return THERAPEUTIC_CATEGORIES[categoryKey as keyof typeof THERAPEUTIC_CATEGORIES]?.options || [];
  };

  const handleAddCustomObjective = () => {
    const trimmedObjective = customObjective.trim();
    
    if (!trimmedObjective) {
      return;
    }
    
    if (value.includes(trimmedObjective)) {
      return;
    }
    
    onChange([...value, trimmedObjective]);
    setCustomObjective('');
  };

  const handleRemoveObjective = (objective: string) => {
    onChange(value.filter(v => v !== objective));
  };

  const isPreDefinedObjective = (objective: string) => {
    return Object.values(THERAPEUTIC_CATEGORIES)
      .flatMap(cat => cat.options)
      .includes(objective);
  };

  return (
    <div className="space-y-6">
      {/* Orientações para Preenchimento */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-blue-800 font-medium">Orientações para Preenchimento</p>
              <p className="text-blue-700 text-sm">
                <span className="font-medium">Descrição:</span> Objetivos específicos através da música
              </p>
              <p className="text-blue-700 text-sm">
                <span className="font-medium">Orientação:</span> Objetivos que utilizam a música como ferramenta terapêutica principal
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categorias de Preenchimento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-blue-600">🗂️</span>
            Categorias de Preenchimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedCategory === 'all' ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory('all')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              📋 Todas as Categorias
            </Button>
            {Object.entries(THERAPEUTIC_CATEGORIES).map(([key, category]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(key)}
              >
                {category.title}
              </Button>
            ))}
          </div>

          {selectedCategory === 'all' ? (
            /* Visualização por categoria quando "Todas as Categorias" está selecionado */
            <div className="space-y-6">
              {Object.entries(THERAPEUTIC_CATEGORIES).map(([key, category]) => (
                <div key={key}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">
                        {Object.keys(THERAPEUTIC_CATEGORIES).indexOf(key) + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-blue-600">{category.title}</h3>
                    <Badge variant="secondary">{category.count} opções</Badge>
                  </div>
                  <div className="space-y-3 ml-10">
                    {category.options.map((option, index) => {
                      const isSelected = value.includes(option);
                      return (
                        <div
                          key={index}
                          onClick={() => handleOptionToggle(option)}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-blue-50 border-blue-300 shadow-sm' 
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 mt-1 flex-shrink-0 ${
                              isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                            }`}>
                              {isSelected && (
                                <div className="w-full h-full rounded-full bg-white scale-50"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">{option}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Visualização da categoria específica */
            selectedCategory !== 'all' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">
                      {Object.keys(THERAPEUTIC_CATEGORIES).indexOf(selectedCategory) + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-600">
                    {THERAPEUTIC_CATEGORIES[selectedCategory as keyof typeof THERAPEUTIC_CATEGORIES]?.title}
                  </h3>
                  <Badge variant="secondary">
                    {THERAPEUTIC_CATEGORIES[selectedCategory as keyof typeof THERAPEUTIC_CATEGORIES]?.count} opções
                  </Badge>
                </div>
                <div className="space-y-3 ml-10">
                  {getCategoryOptions(selectedCategory).map((option, index) => {
                    const isSelected = value.includes(option);
                    return (
                      <div
                        key={index}
                        onClick={() => handleOptionToggle(option)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-300 shadow-sm' 
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 mt-1 flex-shrink-0 ${
                            isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                          }`}>
                            {isSelected && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{option}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          )}

          {/* Seção de Objetivos Personalizados */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 dark:from-purple-950/30 dark:to-pink-950/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                <span className="text-xl">✏️</span>
                Adicionar Objetivo Personalizado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Card de orientações */}
              <div className="bg-purple-100 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-purple-800 dark:text-purple-200 font-medium text-sm">
                      Como escrever objetivos terapêuticos eficazes:
                    </p>
                    <ul className="text-purple-700 dark:text-purple-300 text-sm space-y-1 ml-4 list-disc">
                      <li>Seja específico e mensurável</li>
                      <li>Use verbos de ação (desenvolver, promover, estimular, fortalecer)</li>
                      <li>Foque em comportamentos observáveis</li>
                      <li>Relacione com a música como ferramenta terapêutica</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Campo de entrada */}
              <div className="space-y-2">
                <Label htmlFor="custom-objective" className="text-purple-700 dark:text-purple-300 font-medium">
                  Digite seu objetivo personalizado:
                </Label>
                <Textarea
                  id="custom-objective"
                  value={customObjective}
                  onChange={(e) => setCustomObjective(e.target.value)}
                  placeholder="Ex: Desenvolver controle respiratório através de exercícios de sopro em instrumentos de vento..."
                  className="min-h-[100px] border-purple-300 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 resize-vertical"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      handleAddCustomObjective();
                    }
                  }}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    {customObjective.length > 0 && `${customObjective.length} caracteres`}
                    {customObjective.length === 0 && "Dica: Use Ctrl+Enter para adicionar rapidamente"}
                  </p>
                  <Button
                    type="button"
                    onClick={handleAddCustomObjective}
                    disabled={!customObjective.trim()}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <span className="mr-2">➕</span>
                    Adicionar Objetivo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {value.length > 0 && (
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950/30 dark:to-emerald-950/30">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-green-700 dark:text-green-300 flex items-center gap-2">
                    <span className="text-xl">✅</span>
                    Objetivos Selecionados ({value.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {value.map((objective, index) => {
                    const isPredefined = isPreDefinedObjective(objective);
                    return (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                          isPredefined
                            ? 'bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                            : 'bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                        }`}
                      >
                        <div className="flex items-start gap-2 flex-1">
                          <span className={`mt-1 ${isPredefined ? 'text-green-600 dark:text-green-400' : 'text-purple-600 dark:text-purple-400'}`}>
                            {isPredefined ? '📋' : '✏️'}
                          </span>
                          <p className={`text-sm leading-relaxed ${
                            isPredefined
                              ? 'text-green-700 dark:text-green-300'
                              : 'text-purple-700 dark:text-purple-300'
                          }`}>
                            {objective}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveObjective(objective)}
                          className={`flex-shrink-0 h-8 w-8 p-0 ${
                            isPredefined
                              ? 'hover:bg-green-200 dark:hover:bg-green-800 text-green-600 dark:text-green-400'
                              : 'hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-400'
                          }`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}