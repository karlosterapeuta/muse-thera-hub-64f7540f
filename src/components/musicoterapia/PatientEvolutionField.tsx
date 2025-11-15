import React, { useState, useMemo } from 'react';
import { Search, Info, Music } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PatientEvolutionFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const PATIENT_EVOLUTION_DATA = {
  "Expressão Musical": [
    "Apresenta evolução significativa na improvisação musical, criando espontaneamente melodias e ritmos pessoais.",
    "Observa-se progressos na criatividade musical, explorando diferentes instrumentos e sonoridades com originalidade.",
    "Evolução positiva na comunicação através da música, utilizando elementos musicais para expressar estados internos.",
    "Demonstra avanços na expressão emocional musical, conectando sentimentos com produção sonora de forma autêntica.",
    "Apresenta regressão na improvisação musical, demonstrando menor espontaneidade e criatividade em relação a sessões anteriores.",
    "Observa-se estagnação na expressão musical, mantendo-se no mesmo nível de exploração sonora sem avanços significativos no período avaliado.",
    "Não demonstra interesse ou engajamento nas atividades de expressão musical, mantendo-se passivo ou resistente às propostas apresentadas.",
    "Apresenta resistência às atividades de improvisação musical, evitando exploração de instrumentos e limitando-se a padrões repetitivos já conhecidos."
  ],
  "Regulação Através da Música": [
    "Apresenta progressos na autorregulação emocional através da música, utilizando-a como ferramenta de organização interna.",
    "Observa-se evolução no relaxamento musical, demonstrando maior capacidade de acalmar-se com estímulos sonoros.",
    "Evolução positiva na modulação do humor através da música, alterando estados emocionais conforme necessário.",
    "Demonstra avanços na organização interna através de estruturas musicais, encontrando equilíbrio e harmonia pessoal.",
    "Apresenta maior dificuldade na autorregulação emocional, com a música não produzindo o efeito organizador esperado nas intervenções.",
    "Observa-se resposta paradoxal aos estímulos musicais relaxantes, demonstrando aumento de agitação ou desconforto durante atividades que deveriam promover calma.",
    "Demonstra dependência excessiva da música para regulação, com dificuldade em manter-se organizado na ausência de estímulos musicais estruturados.",
    "Não apresenta evolução na capacidade de utilizar a música como recurso de autorregulação, mantendo padrões de desregulação emocional inalterados."
  ],
  "Comunicação Musical": [
    "Apresenta progressos no diálogo musical, estabelecendo conversas sonoras com terapeuta e pares.",
    "Observa-se evolução nos turnos rítmicos, respeitando espaços temporais e criando interações musicais sincronizadas.",
    "Evolução positiva na reciprocidade musical, respondendo e iniciando trocas musicais de forma espontânea.",
    "Demonstra avanços na atenção compartilhada musical, focalizando conjuntamente em experiências sonoras.",
    "Apresenta retrocesso na comunicação musical, evitando diálogos sonoros e demonstrando preferência por atividades musicais solitárias.",
    "Não demonstra reciprocidade musical, ignorando tentativas de interação sonora do terapeuta ou mantendo-se alheio às propostas de turnos rítmicos.",
    "Observa-se ausência de progressos na comunicação através da música, mantendo-se restrito a padrões comunicativos limitados e repetitivos.",
    "Apresenta resistência ativa às tentativas de estabelecimento de diálogo musical, interrompendo bruscamente interações ou se retirando das atividades propostas."
  ],
  "Desenvolvimento Musical": [
    "Apresenta progressos na percepção musical, discriminando altura, timbre, intensidade e duração com maior precisão.",
    "Observa-se evolução na coordenação rítmica, sincronizando movimentos corporais com pulsação musical.",
    "Evolução positiva na discriminação sonora, identificando e diferenciando diversos elementos musicais.",
    "Demonstra avanços na memória musical, recordando e reproduzindo sequências melódicas e rítmicas complexas.",
    "Apresenta regressão nas habilidades de percepção musical, demonstrando maior dificuldade em discriminar elementos básicos como altura e intensidade.",
    "Observa-se piora na coordenação rítmica, com maior descoordenação motora e dificuldade em sincronizar movimentos com pulsação musical.",
    "Não apresenta evolução mensurável nas habilidades musicais básicas, mantendo-se em um platô de desenvolvimento sem avanços significativos.",
    "Demonstra desinteresse persistente nas atividades de desenvolvimento musical, com baixa motivação e engajamento limitado nas propostas apresentadas."
  ],
  "Desafios e Resistências": [
    "Apresenta resistência significativa ao setting terapêutico, com dificuldade em manter-se presente nas atividades propostas.",
    "Observa-se padrão de evitação das experiências musicais, com o paciente recusando-se a participar ou engajar-se nas intervenções.",
    "Demonstra baixa tolerância às frustrações musicais, reagindo com irritabilidade ou desorganização diante de desafios propostos.",
    "Mantém padrões de comportamento disruptivo durante as sessões, comprometendo o aproveitamento das intervenções musicoterapêuticas."
  ]
};

const CATEGORY_FILTERS = [
  "Todas as Categorias",
  "Expressão Musical", 
  "Regulação Através da Música",
  "Comunicação Musical",
  "Desenvolvimento Musical",
  "Desafios e Resistências"
];

export function PatientEvolutionField({ value, onChange }: PatientEvolutionFieldProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas as Categorias');

  const filteredData = useMemo(() => {
    let data: Record<string, string[]> = PATIENT_EVOLUTION_DATA;
    
    // Filter by category
    if (selectedCategory !== 'Todas as Categorias') {
      const categoryData = PATIENT_EVOLUTION_DATA[selectedCategory as keyof typeof PATIENT_EVOLUTION_DATA];
      data = categoryData ? { [selectedCategory]: categoryData } : {};
    }
    
    // Filter by search term
    if (!searchTerm) return data;
    
    const filtered: Record<string, string[]> = {};
    Object.entries(data).forEach(([category, evolutions]) => {
      const filteredEvolutions = evolutions.filter(evolution =>
        evolution.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredEvolutions.length > 0) {
        filtered[category] = filteredEvolutions;
      }
    });
    return filtered;
  }, [searchTerm, selectedCategory]);

  const handleEvolutionChange = (evolution: string, checked: boolean) => {
    if (checked) {
      onChange([...value, evolution]);
    } else {
      onChange(value.filter(v => v !== evolution));
    }
  };

  const removeEvolution = (evolution: string) => {
    onChange(value.filter(v => v !== evolution));
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
            <span className="text-sm text-blue-800 ml-2">Progressos através da música</span>
          </div>
          <div>
            <span className="font-medium text-sm text-blue-900">Orientação:</span>
            <span className="text-sm text-blue-800 ml-2">Foque em como a música impacta o desenvolvimento do paciente</span>
          </div>
        </CardContent>
      </Card>

      {/* Header com ícone */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Music className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-medium text-blue-600">Evolução do Paciente</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Modelos especializados para documentar progressos terapêuticos
        </p>
      </div>

      {/* Selected Evolutions */}
      {selectedCount > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Evoluções Selecionadas ({selectedCount})
          </Label>
          <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
            {value.map((evolution) => (
              <Badge
                key={evolution}
                variant="secondary"
                className="text-xs py-1 px-2 leading-relaxed"
              >
                {evolution.length > 100 ? `${evolution.substring(0, 100)}...` : evolution}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                  onClick={() => removeEvolution(evolution)}
                >
                  ×
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar evoluções..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Evolution Categories */}
      <div className="space-y-4">
        {Object.entries(filteredData).map(([category, evolutions]) => (
          <Card key={category} className="border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-600 text-sm">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  {category === "Expressão Musical" && <span className="text-white text-xs">🎵</span>}
                  {category === "Regulação Através da Música" && <span className="text-white text-xs">🎶</span>}
                  {category === "Comunicação Musical" && <span className="text-white text-xs">🎼</span>}
                  {category === "Desenvolvimento Musical" && <span className="text-white text-xs">🎹</span>}
                </div>
                {category}
                <span className="text-xs text-green-600 font-normal bg-green-100 px-2 py-1 rounded">
                  {evolutions.length} evoluções
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {evolutions.map((evolution, index) => {
                  const isSelected = value.includes(evolution);
                  const isHighlighted = index === 2; // Terceira opção destacada nas imagens
                  return (
                    <div 
                      key={evolution} 
                      className={`flex items-start space-x-3 p-3 rounded-lg border ${
                        isHighlighted 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'bg-gray-50/50 border-gray-100'
                      }`}
                    >
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs mt-0.5">
                        •
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id={`evolution-${category}-${index}`}
                            checked={isSelected}
                            onCheckedChange={(checked) => 
                              handleEvolutionChange(evolution, checked as boolean)
                            }
                            className="mt-1"
                          />
                          <Label
                            htmlFor={`evolution-${category}-${index}`}
                            className={`text-sm font-normal cursor-pointer flex-1 leading-relaxed ${
                              isHighlighted ? 'text-blue-900' : ''
                            }`}
                          >
                            {evolution}
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
          <p>Nenhuma evolução encontrada para "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}