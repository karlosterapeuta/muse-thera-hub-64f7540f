import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, X, TrendingUp, Check, Music, MessageCircle, Sparkles } from 'lucide-react';

interface PatientEvolutionFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const CATEGORIES = [
  {
    id: 'musical',
    name: 'Evolução Musical',
    icon: Music,
    phrases: [
      'demonstra resposta musical espontânea e cada vez mais elaborada às propostas apresentadas',
      'apresenta engajamento crescente com atividades rítmicas estruturadas e livres',
      'evidencia expressão emocional mais clara e intencional através de recursos musicais',
      'mostra capacidade aprimorada de imitação de padrões rítmicos simples e complexos',
      'utiliza a música de forma cada vez mais efetiva para processos de autorregulação',
      'demonstra preferências musicais mais definidas e capacidade de escolha dirigida',
      'apresenta melhora significativa na coordenação motora durante atividades instrumentais',
      'evidencia maior tempo de atenção sustentada durante experiências musicais',
      'mostra desenvolvimento na capacidade de antecipar estruturas musicais familiares',
      'demonstra criatividade crescente em propostas de improvisação musical dirigida',
    ],
  },
  {
    id: 'communication',
    name: 'Evolução Comunicativa',
    icon: MessageCircle,
    phrases: [
      'desenvolve comunicação não-verbal mais efetiva através de gestos musicais funcionais',
      'apresenta iniciativa crescente para interações musicais com terapeuta e pares',
      'demonstra expressão clara de preferências musicais através de escolhas dirigidas',
      'evidencia turnos conversacionais mais organizados em atividades musicais estruturadas',
      'utiliza gestos musicais funcionais de forma cada vez mais intencional e efetiva',
      'mostra melhora na capacidade de seguir instruções simples em contexto musical',
      'demonstra desenvolvimento na utilização de instrumentos como extensão comunicativa',
      'apresenta vocalização mais intencional e direcionada durante atividades musicais',
      'evidencia maior reciprocidade social durante experiências musicais compartilhadas',
      'mostra capacidade emergente de liderar iniciativas musicais em grupo',
    ],
  },
  {
    id: 'sensory',
    name: 'Evolução Sensorial',
    icon: Sparkles,
    phrases: [
      'demonstra maior tolerância e interesse por texturas sonoras anteriormente rejeitadas',
      'apresenta discriminação auditiva mais refinada entre diferentes timbres instrumentais',
      'evidencia autorregulação sensorial mais efetiva através de escolhas musicais apropriadas',
      'mostra capacidade crescente de modular resposta a diferentes intensidades sonoras',
      'demonstra integração sensório-motora aprimorada durante atividades rítmico-corporais',
      'apresenta exploração sensorial mais organizada e direcionada de instrumentos diversos',
      'evidencia preferências sensoriais mais definidas e comunicadas de forma clara',
      'mostra desenvolvimento na capacidade de antecipar mudanças sonoras estruturadas',
      'demonstra maior flexibilidade na aceitação de novos estímulos sonoros apresentados',
      'apresenta utilização funcional de informações sensoriais musicais para autorregulação',
    ],
  },
];

export function PatientEvolutionField({ value = [], onChange }: PatientEvolutionFieldProps) {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);

  const toggle = (phrase: string) => {
    if (value.includes(phrase)) {
      onChange(value.filter(v => v !== phrase));
    } else {
      onChange([...value, phrase]);
    }
  };

  const removeItem = (item: string) => onChange(value.filter(v => v !== item));

  const current = CATEGORIES.find(c => c.id === activeCat)!;

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
              Selecione as evoluções observadas. Você pode escolher quantas quiser em cada categoria.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs de categoria */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const selectedInCat = cat.phrases.filter(p => value.includes(p)).length;
          const isActive = activeCat === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCat(cat.id)}
              className={`flex items-center justify-between gap-2 rounded-xl border p-3 transition text-left ${
                isActive
                  ? 'border-[#c9a84c] bg-[#c9a84c]/10'
                  : 'border-white/5 bg-[#0d0d0d]/30 hover:border-[#c9a84c]/30'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-[#c9a84c]' : 'text-muted-foreground'}`} />
                <span className={`text-xs sm:text-sm font-medium truncate ${isActive ? 'text-[#c9a84c]' : 'text-foreground'}`}>
                  {cat.name}
                </span>
              </div>
              {selectedInCat > 0 && (
                <Badge className="bg-[#c9a84c] text-black hover:bg-[#c9a84c] text-[10px]">{selectedInCat}</Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Frases da categoria ativa */}
      <div className="rounded-2xl border border-white/5 bg-[#0d0d0d]/30 p-3 sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {current.phrases.map((phrase, i) => {
            const selected = value.includes(phrase);
            return (
              <button
                key={i}
                type="button"
                onClick={() => toggle(phrase)}
                className={`group flex items-start gap-2 p-3 rounded-lg border text-left transition ${
                  selected
                    ? 'border-[#c9a84c] bg-[#c9a84c]/10'
                    : 'border-white/5 bg-[#0d0d0d]/40 hover:border-[#c9a84c]/40'
                }`}
              >
                <div className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center flex-shrink-0 ${
                  selected ? 'bg-[#c9a84c] border-[#c9a84c]' : 'border-[#c9a84c]/40'
                }`}>
                  {selected && <Check className="h-3 w-3 text-black" />}
                </div>
                <span className={`text-xs sm:text-sm leading-relaxed ${selected ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {phrase}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selecionados */}
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
                  onClick={() => removeItem(item)}
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
