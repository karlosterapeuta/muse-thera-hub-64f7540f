import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Info, X, Search, Check, Target } from 'lucide-react';

interface TherapeuticObjectivesFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const THERAPEUTIC_CATEGORIES = {
  expressao_musical: {
    title: 'Expressão Musical',
    icon: '🎼',
    options: [
      'Desenvolver expressão criativa através de improvisação musical espontânea e direcionada.',
      'Promover comunicação não-verbal através de experiências musicais expressivas e significativas.',
      'Estimular criatividade musical utilizando diversos instrumentos e recursos sonoros disponíveis.',
      'Fortalecer capacidade de expressão emocional através da criação e interpretação musical.'
    ]
  },
  regulacao_musica: {
    title: 'Regulação Emocional',
    icon: '🧘',
    options: [
      'Desenvolver autorregulação emocional através de experiências musicais estruturadas e terapêuticas.',
      'Promover estados de relaxamento e bem-estar utilizando música como mediador terapêutico.',
      'Estimular modulação do humor e energia através de atividades musicais específicas.',
      'Fortalecer estratégias de enfrentamento e organização interna através da experiência musical.'
    ]
  },
  desenvolvimento_musical: {
    title: 'Desenvolvimento Musical',
    icon: '🎵',
    options: [
      'Desenvolver percepção musical incluindo discriminação de ritmos, melodias e harmonias.',
      'Promover coordenação rítmica integrada ao movimento corporal e expressão gestual.',
      'Estimular habilidades musicais básicas através de atividades lúdicas e prazerosas.',
      'Fortalecer sensibilidade musical e apreciação estética de diferentes estilos musicais.'
    ]
  },
  integracao_social: {
    title: 'Integração Social',
    icon: '🤝',
    options: [
      'Desenvolver habilidades de cooperação através de atividades musicais grupais e ensemble.',
      'Promover comunicação interpessoal através de experiências musicais compartilhadas.',
      'Estimular participação social ativa em contextos musicais coletivos e comunitários.',
      'Fortalecer vínculos interpessoais através de experiências musicais significativas e colaborativas.'
    ]
  }
} as const;

type CategoryKey = keyof typeof THERAPEUTIC_CATEGORIES;

export function TherapeuticObjectivesField({ value = [], onChange }: TherapeuticObjectivesFieldProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | CategoryKey>('all');
  const [search, setSearch] = useState('');

  const toggle = (option: string) => {
    onChange(value.includes(option) ? value.filter(v => v !== option) : [...value, option]);
  };

  const visibleCategories = useMemo(() => {
    const entries = Object.entries(THERAPEUTIC_CATEGORIES) as [CategoryKey, typeof THERAPEUTIC_CATEGORIES[CategoryKey]][];
    const filtered = selectedCategory === 'all' ? entries : entries.filter(([k]) => k === selectedCategory);
    if (!search.trim()) return filtered;
    const term = search.toLowerCase();
    return filtered
      .map(([k, c]) => [k, { ...c, options: c.options.filter(o => o.toLowerCase().includes(term)) }] as const)
      .filter(([, c]) => c.options.length > 0);
  }, [selectedCategory, search]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Orientação compacta */}
      <div className="rounded-2xl border border-[#c9a84c]/30 bg-[#0d0d0d]/40 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex-shrink-0">
            <Info className="h-4 w-4 sm:h-5 sm:w-5 text-[#c9a84c]" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm sm:text-base text-[#c9a84c]">Defina objetivos terapêuticos</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              Selecione um ou mais objetivos que utilizam a música como ferramenta terapêutica principal.
            </p>
          </div>
        </div>
      </div>

      {/* Busca + filtros */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar objetivo..."
            className="pl-9 bg-[#0d0d0d]/40 border-[#c9a84c]/20 focus-visible:ring-[#c9a84c]/40"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterChip active={selectedCategory === 'all'} onClick={() => setSelectedCategory('all')}>
            Todas
          </FilterChip>
          {Object.entries(THERAPEUTIC_CATEGORIES).map(([key, cat]) => (
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

      {/* Listagem por categoria */}
      <div className="space-y-5 sm:space-y-6">
        {visibleCategories.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#c9a84c]/20 p-8 text-center text-sm text-muted-foreground">
            Nenhum objetivo encontrado para "{search}".
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

      {/* Selecionados */}
      {value.length > 0 && (
        <div className="rounded-2xl border border-[#c9a84c]/40 bg-gradient-to-br from-[#c9a84c]/10 to-transparent p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-[#c9a84c]" />
            <h4 className="text-sm sm:text-base font-semibold text-[#c9a84c]">
              Objetivos selecionados
            </h4>
            <Badge className="bg-[#c9a84c] text-black hover:bg-[#c9a84c] text-[10px] sm:text-xs">
              {value.length}
            </Badge>
          </div>
          <div className="space-y-2">
            {value.map((obj, i) => (
              <div
                key={i}
                className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-[#0d0d0d]/40 border border-[#c9a84c]/20"
              >
                <span className="text-[#c9a84c] text-xs mt-1 flex-shrink-0">●</span>
                <p className="flex-1 text-xs sm:text-sm leading-relaxed text-foreground">{obj}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange(value.filter(v => v !== obj))}
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

function FilterChip({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
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
