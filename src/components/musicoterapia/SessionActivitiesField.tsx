import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Info, X, Search, Check, Activity } from 'lucide-react';

interface SessionActivitiesFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const SESSION_ACTIVITIES_DATA = {
  expressao: {
    title: 'Expressão Musical',
    icon: '🎼',
    options: [
      'Foram realizadas atividades de improvisação musical livre utilizando diversos instrumentos de percussão, cordas e sopro para expressão criativa espontânea.',
      'Implementaram-se exercícios de criação musical colaborativa através de composição de melodias simples e construção de arranjos grupais.',
      'Desenvolveram-se técnicas de canto terapêutico com foco na expressão vocal, respiração e projeção da voz de forma saudável.',
      'Aplicaram-se atividades de exploração instrumental direcionada, favorecendo descoberta sonora e desenvolvimento da sensibilidade musical.'
    ]
  },
  regulacao: {
    title: 'Regulação Emocional',
    icon: '🧘',
    options: [
      'Realizaram-se técnicas de relaxamento musical através de audição direcionada, visualização guiada e respiração sincronizada com elementos musicais.',
      'Implementaram-se exercícios de modulação emocional utilizando diferentes gêneros musicais, andamentos e dinâmicas para regulação do estado afetivo.',
      'Desenvolveram-se atividades de catarse musical através da expressão livre de sentimentos e emoções por meio de improvisação direcionada.',
      'Aplicaram-se técnicas de ancoragem emocional positiva associando experiências musicais prazerosas a estados de bem-estar e tranquilidade.'
    ]
  },
  comunicacao: {
    title: 'Comunicação Musical',
    icon: '💬',
    options: [
      'Foram implementadas atividades de diálogo musical através de conversas instrumentais, imitação sonora e complementaridade rítmica.',
      'Desenvolveram-se exercícios de turnos musicais com alternância de liderança, escuta ativa e responsividade aos estímulos sonoros do parceiro.',
      'Aplicaram-se técnicas de comunicação não-verbal musical utilizando gestos, movimentos corporais e expressões faciais sincronizadas com a música.',
      'Realizaram-se atividades de expressão musical de necessidades e sentimentos através de códigos sonoros e simbolismo musical personalizado.'
    ]
  },
  social: {
    title: 'Integração Social',
    icon: '🤝',
    options: [
      'Implementaram-se atividades musicais em grupo com foco na cooperação, sincronização e construção coletiva de experiências sonoras.',
      'Desenvolveram-se exercícios de ensemble musical promovendo escuta mútua, complementaridade e senso de pertencimento ao grupo.',
      'Aplicaram-se técnicas de liderança musical alternada, favorecendo iniciativa, responsabilidade e reconhecimento das contribuições individuais.',
      'Realizaram-se atividades de criação musical coletiva através de projetos colaborativos e apresentações musicais estruturadas.'
    ]
  }
} as const;

type CategoryKey = keyof typeof SESSION_ACTIVITIES_DATA;

export function SessionActivitiesField({ value = [], onChange }: SessionActivitiesFieldProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | CategoryKey>('all');
  const [search, setSearch] = useState('');

  const toggle = (option: string) => {
    onChange(value.includes(option) ? value.filter(v => v !== option) : [...value, option]);
  };

  const visibleCategories = useMemo(() => {
    const entries = Object.entries(SESSION_ACTIVITIES_DATA) as [CategoryKey, typeof SESSION_ACTIVITIES_DATA[CategoryKey]][];
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
            <p className="font-medium text-sm sm:text-base text-[#c9a84c]">Atividades realizadas na sessão</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              Selecione as técnicas e atividades musicoterapêuticas implementadas.
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
            placeholder="Buscar atividade..."
            className="pl-9 bg-[#0d0d0d]/40 border-[#c9a84c]/20 focus-visible:ring-[#c9a84c]/40"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterChip active={selectedCategory === 'all'} onClick={() => setSelectedCategory('all')}>
            Todas
          </FilterChip>
          {Object.entries(SESSION_ACTIVITIES_DATA).map(([key, cat]) => (
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
            Nenhuma atividade encontrada para "{search}".
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
            <Activity className="h-4 w-4 text-[#c9a84c]" />
            <h4 className="text-sm sm:text-base font-semibold text-[#c9a84c]">Atividades selecionadas</h4>
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
