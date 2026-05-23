import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Info, X, Search, Check, CheckCircle } from 'lucide-react';

interface ConclusionFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const CONCLUSION_DATA = {
  expressao: {
    title: 'Expressão Musical',
    icon: '🎼',
    options: [
      'A expressão musical demonstra evolução significativa, evidenciada pela maior criatividade e espontaneidade na exploração de sons, ritmos e melodias durante as sessões.',
      'Observa-se desenvolvimento notável na capacidade de improvisação musical, favorecendo a expressão de sentimentos e comunicação não-verbal através da música.',
      'A comunicação musical evoluiu de forma expressiva, constituindo-se como um canal efetivo para interação e expressão de conteúdos emocionais internos.',
      'A criatividade musical apresenta expansão significativa, refletindo-se em maior diversidade expressiva e uso funcional dos recursos musicais disponíveis.',
      'A expressão musical apresenta regressão no período avaliado, evidenciada pela redução na espontaneidade e criatividade nas produções sonoras durante as sessões.',
      'A capacidade de expressão musical mantém-se estagnada, sem evolução mensurável no período analisado, demandando revisão das estratégias terapêuticas adotadas.',
      'Não se observa resposta significativa às intervenções voltadas para expressão musical, indicando necessidade de abordagens alternativas ou reavaliação dos objetivos terapêuticos.',
      'As limitações na expressão musical permanecem inalteradas, com o paciente mantendo padrões restritivos e repetitivos apesar das intervenções realizadas.'
    ]
  },
  regulacao: {
    title: 'Regulação Emocional',
    icon: '🧘',
    options: [
      'A autorregulação emocional através da música demonstra progressos importantes, evidenciados pela maior capacidade de modulação do estado afetivo durante as experiências musicais.',
      'O relaxamento e bem-estar promovidos pela música apresentam resultados consistentes, favorecendo estados de calma e organização interna.',
      'Observa-se evolução significativa na modulação do humor através de experiências musicais específicas, desenvolvendo repertório de estratégias de autorregulação.',
      'O uso funcional da música para regulação emocional consolida-se como recurso terapêutico efetivo, proporcionando maior estabilidade e equilíbrio emocional.',
      'A autorregulação emocional através da música não demonstra progressos, persistindo padrões de desregulação que comprometem o aproveitamento das sessões terapêuticas.',
      'Os recursos musicais de relaxamento apresentam efeito limitado ou inconsistente, não consolidando-se como estratégia efetiva de modulação emocional para o paciente.',
      'Observa-se resistência persistente às estratégias de regulação através da música, com o paciente demonstrando dificuldade em engajar-se nas propostas de organização interna.',
      'A dependência da música para regulação emocional torna-se problemática, comprometendo o desenvolvimento de recursos internos de autorregulação do paciente.'
    ]
  },
  desenvolvimento: {
    title: 'Desenvolvimento Musical',
    icon: '🎹',
    options: [
      'As habilidades musicais básicas demonstram evolução progressiva, com desenvolvimento da percepção rítmica, melódica e harmônica de forma integrada.',
      'A percepção musical apresenta refinamento gradual, evidenciado pela maior sensibilidade aos elementos musicais e capacidade de discriminação sonora.',
      'A coordenação rítmica evoluiu de forma consistente, favorecendo a sincronização corporal e a expressão através do movimento integrado à música.',
      'As habilidades musicais básicas mantêm-se estagnadas, sem evidências de desenvolvimento progressivo da percepção rítmica, melódica ou harmônica no período avaliado.',
      'Observa-se regressão nas habilidades de percepção e coordenação musical, com o paciente apresentando desempenho inferior ao demonstrado em avaliações anteriores.',
      'As dificuldades na coordenação rítmica e discriminação sonora permanecem inalteradas, indicando necessidade de adaptação das estratégias de intervenção musical.',
      'O aproveitamento das atividades de desenvolvimento musical mostra-se limitado, com o paciente demonstrando baixo interesse e engajamento nas propostas apresentadas.'
    ]
  },
  integracao: {
    title: 'Integração Terapêutica',
    icon: '🌟',
    options: [
      'Em síntese, a musicoterapia proporciona benefícios multidimensionais, integrando aspectos expressivos, regulatórios e relacionais através da experiência musical.',
      'O impacto terapêutico da música evidencia-se de forma clara, promovendo desenvolvimento em múltiplas áreas e favorecendo o bem-estar global do paciente.',
      'Conclui-se que as perspectivas de continuidade são promissoras, com a música consolidando-se como recurso valioso para desenvolvimento e expressão pessoal.',
      'Em síntese, os benefícios terapêuticos da musicoterapia mostram-se limitados no período avaliado, indicando necessidade de revisão dos objetivos e estratégias de intervenção.',
      'O impacto terapêutico da música não se evidencia de forma clara no quadro atual do paciente, sugerindo necessidade de reavaliação da adequação desta modalidade terapêutica.',
      'Conclui-se que as perspectivas de evolução permanecem incertas, sendo necessário considerar abordagens complementares ou ajustes significativos no plano terapêutico.',
      'A resposta do paciente à musicoterapia mostra-se aquém do esperado, com progressos mínimos ou ausentes, demandando discussão em equipe multidisciplinar sobre continuidade e adaptações.',
      'Observa-se manutenção do quadro clínico sem alterações significativas, sugerindo que os recursos musicais não têm sido suficientes para promover mudanças terapêuticas no período analisado.'
    ]
  },
  desafios: {
    title: 'Desafios e Resistências',
    icon: '⚠️',
    options: [
      'Concluindo, os desafios relacionados à resistência ao processo terapêutico permanecem como fator limitante, demandando estratégias de vínculo e engajamento.',
      'Em síntese, as dificuldades de tolerância e flexibilidade nas atividades musicais constituem-se como principais obstáculos ao desenvolvimento terapêutico no momento atual.'
    ]
  }
} as const;

type CategoryKey = keyof typeof CONCLUSION_DATA;

export function ConclusionField({ value = [], onChange }: ConclusionFieldProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | CategoryKey>('all');
  const [search, setSearch] = useState('');

  const toggle = (option: string) => {
    onChange(value.includes(option) ? value.filter(v => v !== option) : [...value, option]);
  };

  const visibleCategories = useMemo(() => {
    const entries = Object.entries(CONCLUSION_DATA) as [CategoryKey, typeof CONCLUSION_DATA[CategoryKey]][];
    const filtered = selectedCategory === 'all' ? entries : entries.filter(([k]) => k === selectedCategory);
    if (!search.trim()) return filtered;
    const term = search.toLowerCase();
    return filtered
      .map(([k, c]) => [k, { ...c, options: c.options.filter(o => o.toLowerCase().includes(term)) }] as const)
      .filter(([, c]) => c.options.length > 0);
  }, [selectedCategory, search]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-2xl border border-[#c9a84c]/30 bg-[#0d0d0d]/40 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex-shrink-0">
            <Info className="h-4 w-4 sm:h-5 sm:w-5 text-[#c9a84c]" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm sm:text-base text-[#c9a84c]">Conclusão clínica</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              Síntese do impacto musical terapêutico no desenvolvimento do paciente.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar conclusão..."
            className="pl-9 bg-[#0d0d0d]/40 border-[#c9a84c]/20 focus-visible:ring-[#c9a84c]/40"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterChip active={selectedCategory === 'all'} onClick={() => setSelectedCategory('all')}>
            Todas
          </FilterChip>
          {Object.entries(CONCLUSION_DATA).map(([key, cat]) => (
            <FilterChip
              key={key}
              active={selectedCategory === key}
              onClick={() => setSelectedCategory(key as CategoryKey)}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.title}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="space-y-5 sm:space-y-6">
        {visibleCategories.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#c9a84c]/20 p-8 text-center text-sm text-muted-foreground">
            Nenhuma conclusão encontrada para "{search}".
          </div>
        )}

        {visibleCategories.map(([key, cat]) => (
          <div key={key} className="space-y-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-base sm:text-lg">{cat.icon}</span>
              <h3 className="text-sm sm:text-base font-semibold text-[#c9a84c]">{cat.title}</h3>
              <Badge variant="secondary" className="bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 text-[10px] sm:text-xs">
                {cat.options.length}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {cat.options.map((option, idx) => {
                const selected = value.includes(option);
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => toggle(option)}
                    className={`text-left p-3 sm:p-4 rounded-xl border transition-all duration-200 group ${
                      selected
                        ? 'bg-[#c9a84c]/15 border-[#c9a84c]/60 shadow-[0_0_0_1px_rgba(201,168,76,0.2)]'
                        : 'bg-[#0d0d0d]/30 border-white/5 hover:border-[#c9a84c]/30 hover:bg-[#0d0d0d]/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
                          selected
                            ? 'bg-[#c9a84c] border-[#c9a84c]'
                            : 'border-white/20 group-hover:border-[#c9a84c]/60'
                        }`}
                      >
                        {selected && <Check className="h-3.5 w-3.5 text-black" />}
                      </div>
                      <p className={`text-xs sm:text-sm leading-relaxed ${selected ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {option}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {value.length > 0 && (
        <div className="rounded-2xl border border-[#c9a84c]/40 bg-gradient-to-br from-[#c9a84c]/10 to-transparent p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-4 w-4 text-[#c9a84c]" />
            <h4 className="text-sm sm:text-base font-semibold text-[#c9a84c]">Conclusões selecionadas</h4>
            <Badge className="bg-[#c9a84c] text-black hover:bg-[#c9a84c] text-[10px] sm:text-xs">{value.length}</Badge>
          </div>
          <div className="space-y-2">
            {value.map((item, i) => (
              <div key={i} className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-[#0d0d0d]/40 border border-[#c9a84c]/20">
                <span className="text-[#c9a84c] text-xs mt-1 flex-shrink-0">●</span>
                <p className="flex-1 text-xs sm:text-sm leading-relaxed text-foreground">{item}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange(value.filter(v => v !== item))}
                  className="h-7 w-7 p-0 flex-shrink-0 hover:bg-[#c9a84c]/20 text-[#c9a84c]"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs sm:text-sm px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${
        active
          ? 'bg-[#c9a84c] text-black border-[#c9a84c] shadow-[0_0_20px_-5px_rgba(201,168,76,0.6)]'
          : 'bg-[#0d0d0d]/40 text-muted-foreground border-white/10 hover:border-[#c9a84c]/40 hover:text-[#c9a84c]'
      }`}
    >
      {children}
    </button>
  );
}
