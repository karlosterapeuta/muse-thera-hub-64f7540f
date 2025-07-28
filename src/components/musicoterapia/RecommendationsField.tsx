import React, { useState, useMemo } from 'react';
import { Search, Info, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RecommendationsFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const RECOMMENDATIONS_DATA = {
  "Continuidade Terapêutica": [
    "Recomenda-se manutenção das sessões de musicoterapia semanais para consolidação dos processos de autorregulação através da experiência musical.",
    "Sugere-se continuidade do acompanhamento por 4-6 meses para aprofundamento das competências de expressão criativa e comunicação não-verbal.",
    "Indica-se seguimento quinzenal para monitoramento da transferência das habilidades musicais para contextos funcionais do cotidiano.",
    "Orienta-se acompanhamento mensal com reavaliação das respostas neuromusicais e ajustes nas intervenções sonoro-musicais específicas."
  ],
  "Estimulação Musical Domiciliar": [
    "Recomenda-se implementação de rotina diária de escuta musical estruturada com repertório específico para modulação do humor e estados de alerta.",
    "Sugere-se utilização de instrumentos musicais simples durante atividades cotidianas para estimulação da coordenação motora e expressão criativa.",
    "Indica-se aplicação de técnicas de respiração musicalmente assistida para desenvolvimento de estratégias de autorregulação emocional.",
    "Orienta-se criação de momentos musicais familiares estruturados para fortalecimento de vínculos afetivos e comunicação interpessoal."
  ],
  "Recursos e Adaptações": [
    "Recomenda-se aquisição de instrumentos musicais adaptados às necessidades motoras específicas para maximização da participação ativa.",
    "Sugere-se organização de ambiente sonoro domiciliar com redução de ruídos competitivos e implementação de estímulos musicais terapêuticos.",
    "Indica-se uso de tecnologias musicais assistivas incluindo aplicativos de criação musical e dispositivos de amplificação sonora quando necessário.",
    "Orienta-se criação de repertório musical personalizado considerando preferências individuais e objetivos terapêuticos específicos."
  ],
  "Encaminhamentos Complementares": [
    "Recomenda-se avaliação audiológica especializada para investigação da acuidade auditiva e processamento musical específico.",
    "Sugere-se interconsulta neurológica para compreensão dos mecanismos neuroplásticos envolvidos na resposta à intervenção musicoterapêutica.",
    "Indica-se encaminhamento para educação musical adaptada para desenvolvimento de competências musicais formais complementares.",
    "Orienta-se avaliação fonoaudiológica para investigação das interfaces entre processamento musical e desenvolvimento da linguagem."
  ]
};

const CATEGORY_FILTERS = [
  "Todas as Categorias",
  "Continuidade Terapêutica", 
  "Estimulação Musical Domiciliar",
  "Recursos e Adaptações",
  "Encaminhamentos Complementares"
];

export function RecommendationsField({ value, onChange }: RecommendationsFieldProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas as Categorias');

  const filteredData = useMemo(() => {
    let data: Record<string, string[]> = RECOMMENDATIONS_DATA;
    
    // Filter by category
    if (selectedCategory !== 'Todas as Categorias') {
      const categoryData = RECOMMENDATIONS_DATA[selectedCategory as keyof typeof RECOMMENDATIONS_DATA];
      data = categoryData ? { [selectedCategory]: categoryData } : {};
    }
    
    // Filter by search term
    if (!searchTerm) return data;
    
    const filtered: Record<string, string[]> = {};
    Object.entries(data).forEach(([category, recommendations]) => {
      const filteredRecommendations = recommendations.filter(recommendation =>
        recommendation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredRecommendations.length > 0) {
        filtered[category] = filteredRecommendations;
      }
    });
    return filtered;
  }, [searchTerm, selectedCategory]);

  const handleRecommendationChange = (recommendation: string, checked: boolean) => {
    if (checked) {
      onChange([...value, recommendation]);
    } else {
      onChange(value.filter(v => v !== recommendation));
    }
  };

  const removeRecommendation = (recommendation: string) => {
    onChange(value.filter(v => v !== recommendation));
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
            <span className="text-sm text-blue-800 ml-2">Continuidade musical terapêutica</span>
          </div>
          <div>
            <span className="font-medium text-sm text-blue-900">Orientação:</span>
            <span className="text-sm text-blue-800 ml-2">Inclua sugestões de continuidade e uso da música no cotidiano</span>
          </div>
        </CardContent>
      </Card>

      {/* Selected Recommendations */}
      {selectedCount > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Recomendações Selecionadas ({selectedCount})
          </Label>
          <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
            {value.map((recommendation) => (
              <Badge
                key={recommendation}
                variant="secondary"
                className="text-xs py-1 px-2 leading-relaxed"
              >
                {recommendation.length > 100 ? `${recommendation.substring(0, 100)}...` : recommendation}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                  onClick={() => removeRecommendation(recommendation)}
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
          placeholder="Buscar recomendações..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Recommendations by Category */}
      <div className="space-y-4">
        {Object.entries(filteredData).map(([category, recommendations]) => (
          <Card key={category} className="border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-600 text-sm">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                  {Object.keys(RECOMMENDATIONS_DATA).indexOf(category) + 1}
                </div>
                {category}
                <span className="text-xs text-muted-foreground font-normal">
                  {recommendations.length} opções
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {recommendations.map((recommendation, index) => {
                  const isSelected = value.includes(recommendation);
                  return (
                    <div key={recommendation} className="flex items-start space-x-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs mt-0.5">
                        •
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id={`recommendation-${category}-${index}`}
                            checked={isSelected}
                            onCheckedChange={(checked) => 
                              handleRecommendationChange(recommendation, checked as boolean)
                            }
                            className="mt-1"
                          />
                          <Label
                            htmlFor={`recommendation-${category}-${index}`}
                            className="text-sm font-normal cursor-pointer flex-1 leading-relaxed"
                          >
                            {recommendation}
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
          <p>Nenhuma recomendação encontrada para "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}