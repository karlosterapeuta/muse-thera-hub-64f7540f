import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

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

          {value.length > 0 && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 font-medium mb-2">
                Objetivos Selecionados ({value.length})
              </p>
              <div className="space-y-2">
                {value.map((objective, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <p className="text-green-700 text-sm">{objective}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}