import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Info, X, Search, Check, ArrowRight } from 'lucide-react';

interface RecommendationsFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const RECOMMENDATIONS_DATA = {
  continuidade: {
    title: 'Continuidade Terapêutica',
    icon: '🔁',
    options: [
      'Recomenda-se manutenção das sessões de musicoterapia semanais para consolidação dos processos de autorregulação através da experiência musical.',
      'Sugere-se continuidade do acompanhamento por 4-6 meses para aprofundamento das competências de expressão criativa e comunicação não-verbal.',
      'Indica-se seguimento quinzenal para monitoramento da transferência das habilidades musicais para contextos funcionais do cotidiano.',
      'Orienta-se acompanhamento mensal com reavaliação das respostas neuromusicais e ajustes nas intervenções sonoro-musicais específicas.'
    ]
  },
  domiciliar: {
    title: 'Estimulação Domiciliar',
    icon: '🏠',
    options: [
      'Recomenda-se implementação de rotina diária de escuta musical estruturada com repertório específico para modulação do humor e estados de alerta.',
      'Sugere-se utilização de instrumentos musicais simples durante atividades cotidianas para estimulação da coordenação motora e expressão criativa.',
      'Indica-se aplicação de técnicas de respiração musicalmente assistida para desenvolvimento de estratégias de autorregulação emocional.',
      'Orienta-se criação de momentos musicais familiares estruturados para fortalecimento de vínculos afetivos e comunicação interpessoal.'
    ]
  },
  recursos: {
    title: 'Recursos e Adaptações',
    icon: '🛠️',
    options: [
      'Recomenda-se aquisição de instrumentos musicais adaptados às necessidades motoras específicas para maximização da participação ativa.',
      'Sugere-se organização de ambiente sonoro domiciliar com redução de ruídos competitivos e implementação de estímulos musicais terapêuticos.',
      'Indica-se uso de tecnologias musicais assistivas incluindo aplicativos de criação musical e dispositivos de amplificação sonora quando necessário.',
      'Orienta-se criação de repertório musical personalizado considerando preferências individuais e objetivos terapêuticos específicos.'
    ]
  },
  encaminhamentos: {
    title: 'Encaminhamentos',
    icon: '🔗',
    options: [
      'Recomenda-se avaliação audiológica especializada para investigação da acuidade auditiva e processamento musical específico.',
      'Sugere-se interconsulta neurológica para compreensão dos mecanismos neuroplásticos envolvidos na resposta à intervenção musicoterapêutica.',
      'Indica-se encaminhamento para educação musical adaptada para desenvolvimento de competências musicais formais complementares.',
      'Orienta-se avaliação fonoaudiológica para investigação das interfaces entre processamento musical e desenvolvimento da linguagem.'
    ]
  }
} as const;

type CategoryKey = keyof typeof RECOMMENDATIONS_DATA;

export function RecommendationsField({ value = [], onChange }: RecommendationsFieldProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | CategoryKey>('all');
  const [search, setSearch] = useState('');

  const toggle = (option: string) => {
    onChange(value.includes(option) ? value.filter(v => v !== option) : [...value, option]);
  };

  const visibleCategories = useMemo(() => {
    const entries = Object.entries(RECOMMENDATIONS_DATA) as [CategoryKey, typeof RECOMMENDATIONS_DATA[CategoryKey]][];
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
            <p className="font-medium text-sm sm:text-base text-[#c9a84c]">Recomendações terapêuticas</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              Defina orientações para continuidade, estimulação domiciliar e encaminhamentos.
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
            placeholder="Buscar recomendação..."
            className="pl-9 bg-[#0d0d0d]/40 border-[#c9a84c]/20 focus-visible:ring-[#c9a84c]/40"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterChip active={selectedCategory === 'all'} onClick={() => setSelectedCategory('all')}>
            Todas
          </FilterChip>
          {Object.entries(RECOMMENDATIONS_DATA).map(([key, cat]) => (
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
            Nenhuma recomendação encontrada para "{search}".
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
            <ArrowRight className="h-4 w-4 text-[#c9a84c]" />
            <h4 className="text-sm sm:text-base font-semibold text-[#c9a84c]">Recomendações selecionadas</h4>
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
