import React, { useState, useMemo } from 'react';
import { Search, Info, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ConclusionFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const CONCLUSION_DATA = {
  "Expressão Musical": [
    "A expressão musical demonstra evolução significativa, evidenciada pela maior criatividade e espontaneidade na exploração de sons, ritmos e melodias durante as sessões.",
    "Observa-se desenvolvimento notável na capacidade de improvisação musical, favorecendo a expressão de sentimentos e comunicação não-verbal através da música.",
    "A comunicação musical evoluiu de forma expressiva, constituindo-se como um canal efetivo para interação e expressão de conteúdos emocionais internos.",
    "A criatividade musical apresenta expansão significativa, refletindo-se em maior diversidade expressiva e uso funcional dos recursos musicais disponíveis.",
    "A expressão musical apresenta regressão no período avaliado, evidenciada pela redução na espontaneidade e criatividade nas produções sonoras durante as sessões.",
    "A capacidade de expressão musical mantém-se estagnada, sem evolução mensurável no período analisado, demandando revisão das estratégias terapêuticas adotadas.",
    "Não se observa resposta significativa às intervenções voltadas para expressão musical, indicando necessidade de abordagens alternativas ou reavaliação dos objetivos terapêuticos.",
    "As limitações na expressão musical permanecem inalteradas, com o paciente mantendo padrões restritivos e repetitivos apesar das intervenções realizadas."
  ],
  "Regulação Através da Música": [
    "A autorregulação emocional através da música demonstra progressos importantes, evidenciados pela maior capacidade de modulação do estado afetivo durante as experiências musicais.",
    "O relaxamento e bem-estar promovidos pela música apresentam resultados consistentes, favorecendo estados de calma e organização interna.",
    "Observa-se evolução significativa na modulação do humor através de experiências musicais específicas, desenvolvendo repertório de estratégias de autorregulação.",
    "O uso funcional da música para regulação emocional consolida-se como recurso terapêutico efetivo, proporcionando maior estabilidade e equilíbrio emocional.",
    "A autorregulação emocional através da música não demonstra progressos, persistindo padrões de desregulação que comprometem o aproveitamento das sessões terapêuticas.",
    "Os recursos musicais de relaxamento apresentam efeito limitado ou inconsistente, não consolidando-se como estratégia efetiva de modulação emocional para o paciente.",
    "Observa-se resistência persistente às estratégias de regulação através da música, com o paciente demonstrando dificuldade em engajar-se nas propostas de organização interna.",
    "A dependência da música para regulação emocional torna-se problemática, comprometendo o desenvolvimento de recursos internos de autorregulação do paciente."
  ],
  "Desenvolvimento Musical": [
    "As habilidades musicais básicas demonstram evolução progressiva, com desenvolvimento da percepção rítmica, melódica e harmônica de forma integrada.",
    "A percepção musical apresenta refinamento gradual, evidenciado pela maior sensibilidade aos elementos musicais e capacidade de discriminação sonora.",
    "A coordenação rítmica evoluiu de forma consistente, favorecendo a sincronização corporal e a expressão através do movimento integrado à música.",
    "As habilidades musicais básicas mantêm-se estagnadas, sem evidências de desenvolvimento progressivo da percepção rítmica, melódica ou harmônica no período avaliado.",
    "Observa-se regressão nas habilidades de percepção e coordenação musical, com o paciente apresentando desempenho inferior ao demonstrado em avaliações anteriores.",
    "As dificuldades na coordenação rítmica e discriminação sonora permanecem inalteradas, indicando necessidade de adaptação das estratégias de intervenção musical.",
    "O aproveitamento das atividades de desenvolvimento musical mostra-se limitado, com o paciente demonstrando baixo interesse e engajamento nas propostas apresentadas."
  ],
  "Integração Terapêutica": [
    "Em síntese, a musicoterapia proporciona benefícios multidimensionais, integrando aspectos expressivos, regulatórios e relacionais através da experiência musical.",
    "O impacto terapêutico da música evidencia-se de forma clara, promovendo desenvolvimento em múltiplas áreas e favorecendo o bem-estar global do paciente.",
    "Conclui-se que as perspectivas de continuidade são promissoras, com a música consolidando-se como recurso valioso para desenvolvimento e expressão pessoal.",
    "Em síntese, os benefícios terapêuticos da musicoterapia mostram-se limitados no período avaliado, indicando necessidade de revisão dos objetivos e estratégias de intervenção.",
    "O impacto terapêutico da música não se evidencia de forma clara no quadro atual do paciente, sugerindo necessidade de reavaliação da adequação desta modalidade terapêutica.",
    "Conclui-se que as perspectivas de evolução permanecem incertas, sendo necessário considerar abordagens complementares ou ajustes significativos no plano terapêutico.",
    "A resposta do paciente à musicoterapia mostra-se aquém do esperado, com progressos mínimos ou ausentes, demandando discussão em equipe multidisciplinar sobre continuidade e adaptações.",
    "Observa-se manutenção do quadro clínico sem alterações significativas, sugerindo que os recursos musicais não têm sido suficientes para promover mudanças terapêuticas no período analisado."
  ],
  "Desafios e Resistências": [
    "Concluindo, os desafios relacionados à resistência ao processo terapêutico permanecem como fator limitante, demandando estratégias de vínculo e engajamento.",
    "Em síntese, as dificuldades de tolerância e flexibilidade nas atividades musicais constituem-se como principais obstáculos ao desenvolvimento terapêutico no momento atual."
  ]
};

const CATEGORY_FILTERS = [
  "Todas as Categorias",
  "Expressão Musical", 
  "Regulação Através da Música",
  "Desenvolvimento Musical",
  "Integração Terapêutica",
  "Desafios e Resistências"
];

export function ConclusionField({ value, onChange }: ConclusionFieldProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas as Categorias');

  const filteredData = useMemo(() => {
    let data: Record<string, string[]> = CONCLUSION_DATA;
    
    // Filter by category
    if (selectedCategory !== 'Todas as Categorias') {
      const categoryData = CONCLUSION_DATA[selectedCategory as keyof typeof CONCLUSION_DATA];
      data = categoryData ? { [selectedCategory]: categoryData } : {};
    }
    
    // Filter by search term
    if (!searchTerm) return data;
    
    const filtered: Record<string, string[]> = {};
    Object.entries(data).forEach(([category, conclusions]) => {
      const filteredConclusions = conclusions.filter(conclusion =>
        conclusion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredConclusions.length > 0) {
        filtered[category] = filteredConclusions;
      }
    });
    return filtered;
  }, [searchTerm, selectedCategory]);

  const handleConclusionChange = (conclusion: string, checked: boolean) => {
    if (checked) {
      onChange([...value, conclusion]);
    } else {
      onChange(value.filter(v => v !== conclusion));
    }
  };

  const removeConclusion = (conclusion: string) => {
    onChange(value.filter(v => v !== conclusion));
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
            <span className="text-sm text-blue-800 ml-2">Síntese do impacto musical terapêutico</span>
          </div>
          <div>
            <span className="font-medium text-sm text-blue-900">Orientação:</span>
            <span className="text-sm text-blue-800 ml-2">Resumo do papel da música no desenvolvimento do paciente</span>
          </div>
        </CardContent>
      </Card>

      {/* Selected Conclusions */}
      {selectedCount > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Conclusões Selecionadas ({selectedCount})
          </Label>
          <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
            {value.map((conclusion) => (
              <Badge
                key={conclusion}
                variant="secondary"
                className="text-xs py-1 px-2 leading-relaxed"
              >
                {conclusion.length > 100 ? `${conclusion.substring(0, 100)}...` : conclusion}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                  onClick={() => removeConclusion(conclusion)}
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
          placeholder="Buscar conclusões..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Conclusions by Category */}
      <div className="space-y-4">
        {Object.entries(filteredData).map(([category, conclusions]) => (
          <Card key={category} className="border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-600 text-sm">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                  {Object.keys(CONCLUSION_DATA).indexOf(category) + 1}
                </div>
                {category}
                <span className="text-xs text-muted-foreground font-normal">
                  {conclusions.length} opções
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {conclusions.map((conclusion, index) => {
                  const isSelected = value.includes(conclusion);
                  return (
                    <div key={conclusion} className="flex items-start space-x-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs mt-0.5">
                        •
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id={`conclusion-${category}-${index}`}
                            checked={isSelected}
                            onCheckedChange={(checked) => 
                              handleConclusionChange(conclusion, checked as boolean)
                            }
                            className="mt-1"
                          />
                          <Label
                            htmlFor={`conclusion-${category}-${index}`}
                            className="text-sm font-normal cursor-pointer flex-1 leading-relaxed"
                          >
                            {conclusion}
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
          <p>Nenhuma conclusão encontrada para "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}