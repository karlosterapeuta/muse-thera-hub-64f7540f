import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Info, X, Search, Check, TrendingUp } from 'lucide-react';

interface PatientEvolutionFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const PATIENT_EVOLUTION_DATA = {
  expressao: {
    title: 'Expressão Musical',
    icon: '🎼',
    options: [
      'Apresenta evolução significativa na improvisação musical, criando espontaneamente melodias e ritmos pessoais.',
      'Observa-se progressos na criatividade musical, explorando diferentes instrumentos e sonoridades com originalidade.',
      'Evolução positiva na comunicação através da música, utilizando elementos musicais para expressar estados internos.',
      'Demonstra avanços na expressão emocional musical, conectando sentimentos com produção sonora de forma autêntica.',
      'Apresenta regressão na improvisação musical, demonstrando menor espontaneidade e criatividade em relação a sessões anteriores.',
      'Observa-se estagnação na expressão musical, mantendo-se no mesmo nível de exploração sonora sem avanços significativos no período avaliado.',
      'Não demonstra interesse ou engajamento nas atividades de expressão musical, mantendo-se passivo ou resistente às propostas apresentadas.',
      'Apresenta resistência às atividades de improvisação musical, evitando exploração de instrumentos e limitando-se a padrões repetitivos já conhecidos.'
    ]
  },
  regulacao: {
    title: 'Regulação Emocional',
    icon: '🧘',
    options: [
      'Apresenta progressos na autorregulação emocional através da música, utilizando-a como ferramenta de organização interna.',
      'Observa-se evolução no relaxamento musical, demonstrando maior capacidade de acalmar-se com estímulos sonoros.',
      'Evolução positiva na modulação do humor através da música, alterando estados emocionais conforme necessário.',
      'Demonstra avanços na organização interna através de estruturas musicais, encontrando equilíbrio e harmonia pessoal.',
      'Apresenta maior dificuldade na autorregulação emocional, com a música não produzindo o efeito organizador esperado nas intervenções.',
      'Observa-se resposta paradoxal aos estímulos musicais relaxantes, demonstrando aumento de agitação ou desconforto durante atividades que deveriam promover calma.',
      'Demonstra dependência excessiva da música para regulação, com dificuldade em manter-se organizado na ausência de estímulos musicais estruturados.',
      'Não apresenta evolução na capacidade de utilizar a música como recurso de autorregulação, mantendo padrões de desregulação emocional inalterados.'
    ]
  },
  comunicacao: {
    title: 'Comunicação Musical',
    icon: '💬',
    options: [
      'Apresenta progressos no diálogo musical, estabelecendo conversas sonoras com terapeuta e pares.',
      'Observa-se evolução nos turnos rítmicos, respeitando espaços temporais e criando interações musicais sincronizadas.',
      'Evolução positiva na reciprocidade musical, respondendo e iniciando trocas musicais de forma espontânea.',
      'Demonstra avanços na atenção compartilhada musical, focalizando conjuntamente em experiências sonoras.',
      'Apresenta retrocesso na comunicação musical, evitando diálogos sonoros e demonstrando preferência por atividades musicais solitárias.',
      'Não demonstra reciprocidade musical, ignorando tentativas de interação sonora do terapeuta ou mantendo-se alheio às propostas de turnos rítmicos.',
      'Observa-se ausência de progressos na comunicação através da música, mantendo-se restrito a padrões comunicativos limitados e repetitivos.',
      'Apresenta resistência ativa às tentativas de estabelecimento de diálogo musical, interrompendo bruscamente interações ou se retirando das atividades propostas.'
    ]
  },
  desenvolvimento: {
    title: 'Desenvolvimento Musical',
    icon: '🎹',
    options: [
      'Apresenta progressos na percepção musical, discriminando altura, timbre, intensidade e duração com maior precisão.',
      'Observa-se evolução na coordenação rítmica, sincronizando movimentos corporais com pulsação musical.',
      'Evolução positiva na discriminação sonora, identificando e diferenciando diversos elementos musicais.',
      'Demonstra avanços na memória musical, recordando e reproduzindo sequências melódicas e rítmicas complexas.',
      'Apresenta regressão nas habilidades de percepção musical, demonstrando maior dificuldade em discriminar elementos básicos como altura e intensidade.',
      'Observa-se piora na coordenação rítmica, com maior descoordenação motora e dificuldade em sincronizar movimentos com pulsação musical.',
      'Não apresenta evolução mensurável nas habilidades musicais básicas, mantendo-se em um platô de desenvolvimento sem avanços significativos.',
      'Demonstra desinteresse persistente nas atividades de desenvolvimento musical, com baixa motivação e engajamento limitado nas propostas apresentadas.'
    ]
  },
  desafios: {
    title: 'Desafios e Resistências',
    icon: '⚠️',
    options: [
      'Apresenta resistência significativa ao setting terapêutico, com dificuldade em manter-se presente nas atividades propostas.',
      'Observa-se padrão de evitação das experiências musicais, com o paciente recusando-se a participar ou engajar-se nas intervenções.',
      'Demonstra baixa tolerância às frustrações musicais, reagindo com irritabilidade ou desorganização diante de desafios propostos.',
      'Mantém padrões de comportamento disruptivo durante as sessões, comprometendo o aproveitamento das intervenções musicoterapêuticas.'
    ]
  }
} as const;

type CategoryKey = keyof typeof PATIENT_EVOLUTION_DATA;

export function PatientEvolutionField({ value = [], onChange }: PatientEvolutionFieldProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | CategoryKey>('all');
  const [search, setSearch] = useState('');

  const toggle = (option: string) => {
    onChange(value.includes(option) ? value.filter(v => v !== option) : [...value, option]);
  };

  const visibleCategories = useMemo(() => {
    const entries = Object.entries(PATIENT_EVOLUTION_DATA) as [CategoryKey, typeof PATIENT_EVOLUTION_DATA[CategoryKey]][];
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
            <p className="font-medium text-sm sm:text-base text-[#c9a84c]">Evolução do paciente</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              Documente progressos, estagnações e desafios observados através da música.
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
            placeholder="Buscar evolução..."
            className="pl-9 bg-[#0d0d0d]/40 border-[#c9a84c]/20 focus-visible:ring-[#c9a84c]/40"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterChip active={selectedCategory === 'all'} onClick={() => setSelectedCategory('all')}>
            Todas
          </FilterChip>
          {Object.entries(PATIENT_EVOLUTION_DATA).map(([key, cat]) => (
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
            Nenhuma evolução encontrada para "{search}".
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
            <TrendingUp className="h-4 w-4 text-[#c9a84c]" />
            <h4 className="text-sm sm:text-base font-semibold text-[#c9a84c]">Evoluções selecionadas</h4>
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
