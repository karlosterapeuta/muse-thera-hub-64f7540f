import React, { useState, useMemo } from 'react';
import { Search, Info, ArrowRight, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

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
  const [customRecommendation, setCustomRecommendation] = useState<string>('');

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

  const handleAddCustomRecommendation = () => {
    const trimmedRecommendation = customRecommendation.trim();
    
    // Validar que não está vazio
    if (!trimmedRecommendation) {
      return;
    }
    
    // Validar que não é duplicado
    if (value.includes(trimmedRecommendation)) {
      return;
    }
    
    // Adicionar à lista de recomendações
    onChange([...value, trimmedRecommendation]);
    
    // Limpar o campo
    setCustomRecommendation('');
  };

  const isPreDefinedRecommendation = (recommendation: string) => {
    return Object.values(RECOMMENDATIONS_DATA)
      .flat()
      .includes(recommendation);
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
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950/30 dark:to-emerald-950/30">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-green-700 dark:text-green-300 flex items-center gap-2">
                <span className="text-xl">✅</span>
                Recomendações Selecionadas ({selectedCount})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {value.map((recommendation, index) => {
                const isPredefined = isPreDefinedRecommendation(recommendation);
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                      isPredefined
                        ? 'bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                        : 'bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                    }`}
                  >
                    <div className="flex items-start gap-2 flex-1">
                      <span className={`mt-1 ${isPredefined ? 'text-orange-600 dark:text-orange-400' : 'text-purple-600 dark:text-purple-400'}`}>
                        {isPredefined ? '💡' : '✏️'}
                      </span>
                      <p className={`text-sm leading-relaxed ${
                        isPredefined
                          ? 'text-orange-700 dark:text-orange-300'
                          : 'text-purple-700 dark:text-purple-300'
                      }`}>
                        {recommendation}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRecommendation(recommendation)}
                      className={`flex-shrink-0 h-8 w-8 p-0 ${
                        isPredefined
                          ? 'hover:bg-orange-200 dark:hover:bg-orange-800 text-orange-600 dark:text-orange-400'
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

      {/* Seção de Recomendações Personalizadas */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 dark:from-purple-950/30 dark:to-pink-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <span className="text-xl">✏️</span>
            Adicionar Recomendação Personalizada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Card de orientações */}
          <div className="bg-purple-100 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-purple-800 dark:text-purple-200 font-medium text-sm">
                  Como elaborar recomendações terapêuticas eficazes:
                </p>
                <ul className="text-purple-700 dark:text-purple-300 text-sm space-y-1 ml-4 list-disc">
                  <li>Seja específico sobre frequência e duração das atividades sugeridas</li>
                  <li>Inclua orientações práticas para família ou equipe multidisciplinar</li>
                  <li>Relacione recomendações aos objetivos terapêuticos estabelecidos</li>
                  <li>Sugira recursos musicais acessíveis e aplicáveis no contexto domiciliar</li>
                  <li>Mencione encaminhamentos para profissionais complementares quando indicado</li>
                  <li>Especifique prazos para reavaliação ou retorno terapêutico</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Campo de entrada */}
          <div className="space-y-2">
            <Label htmlFor="custom-recommendation" className="text-purple-700 dark:text-purple-300 font-medium">
              Digite sua recomendação personalizada:
            </Label>
            <Textarea
              id="custom-recommendation"
              value={customRecommendation}
              onChange={(e) => setCustomRecommendation(e.target.value)}
              placeholder="Ex: Recomenda-se aos familiares a implementação de rotina diária de 15 minutos de atividades musicais estruturadas, utilizando o repertório de canções trabalhadas em sessão. Sugere-se especial atenção à manutenção do andamento regular durante as canções de ninar para favorecimento da autorregulação emocional no período noturno. Orientamos retorno para reavaliação em 3 meses..."
              className="min-h-[140px] border-purple-300 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 resize-vertical"
              onKeyDown={(e) => {
                // Adicionar com Ctrl+Enter ou Cmd+Enter
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  handleAddCustomRecommendation();
                }
              }}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-purple-600 dark:text-purple-400">
                {customRecommendation.length > 0 && `${customRecommendation.length} caracteres`}
                {customRecommendation.length === 0 && "Dica: Use Ctrl+Enter para adicionar rapidamente"}
              </p>
              <Button
                type="button"
                onClick={handleAddCustomRecommendation}
                disabled={!customRecommendation.trim()}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
              >
                <span className="mr-2">➕</span>
                Adicionar Recomendação
              </Button>
            </div>
          </div>

          {/* Exemplos inspiradores */}
          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
            <p className="text-xs text-purple-700 dark:text-purple-300 font-medium mb-2">
              💡 Exemplos de recomendações bem estruturadas:
            </p>
            <ul className="text-xs text-purple-600 dark:text-purple-400 space-y-1 ml-4 list-disc">
              <li>"Sugere-se encaminhamento para avaliação neuropsicológica especializada para investigação aprofundada das funções executivas e sua relação com o processamento musical observado durante as intervenções. Recomenda-se retorno em 60 dias."</li>
              <li>"Orienta-se aos responsáveis a criação de 'momento musical familiar' três vezes por semana (20 minutos cada), utilizando os instrumentos trabalhados em sessão para fortalecimento de vínculos e generalização das estratégias de comunicação não-verbal."</li>
              <li>"Recomenda-se aos educadores a implementação de transições entre atividades mediadas por sinais musicais específicos (melodias de 'início' e 'finalização'), visando redução de comportamentos disruptivos e favorecimento da organização temporal no ambiente escolar."</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}