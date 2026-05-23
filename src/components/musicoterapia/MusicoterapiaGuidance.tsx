import React from 'react';
import { Lightbulb, Music, Brain, Heart, Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface MusicoterapiaGuidanceProps {
  text: string;
  fieldId: string;
}

const FIELD_GUIDANCE: Record<string, {
  icon: React.ElementType;
  tips: string[];
  examples: string[];
}> = {
  therapeutic_objectives: {
    icon: Brain,
    tips: [
      'Defina objetivos específicos que utilizam a música como ferramenta principal',
      'Considere as necessidades individuais do paciente com TEA',
      'Integre aspectos comunicativos, sensoriais e sociais',
      'Estabeleça metas mensuráveis e alcançáveis'
    ],
    examples: [
      'Desenvolver comunicação não-verbal através de gestos musicais',
      'Promover autorregulação emocional com sequências rítmicas',
      'Estimular interação social em atividades musicais de grupo'
    ]
  },
  session_activities: {
    icon: Music,
    tips: [
      'Descreva as atividades de forma detalhada e sequencial',
      'Inclua instrumentos específicos utilizados',
      'Mencione técnicas musicoterapêuticas aplicadas',
      'Relate adaptações feitas conforme resposta do paciente'
    ],
    examples: [
      'Exploração dirigida de instrumentos de percussão com diferentes texturas',
      'Imitação rítmica utilizando pandeiro e movimento corporal',
      'Canto de canções funcionais para transições entre atividades'
    ]
  },
  patient_evolution: {
    icon: Heart,
    tips: [
      'Foque nos progressos observados durante as sessões',
      'Relate mudanças comportamentais positivas',
      'Mencione desenvolvimento de habilidades musicais',
      'Inclua aspectos de comunicação e interação social'
    ],
    examples: [
      'Maior engajamento com atividades rítmicas estruturadas',
      'Desenvolvimento da capacidade de imitação musical',
      'Uso espontâneo de instrumentos para expressão emocional'
    ]
  },
  recommendations: {
    icon: Lightbulb,
    tips: [
      'Sugira continuidade baseada nos progressos observados',
      'Inclua orientações para família e cuidadores',
      'Proponha atividades musicais para casa',
      'Indique frequência e duração das sessões'
    ],
    examples: [
      'Manutenção das sessões semanais com expansão do repertório',
      'Implementação de playlist terapêutica para uso domiciliar',
      'Participação gradual em atividades musicais grupais'
    ]
  }
};

export function MusicoterapiaGuidance({ text, fieldId }: MusicoterapiaGuidanceProps) {
  const guidance = FIELD_GUIDANCE[fieldId];
  const GuidanceIcon = guidance?.icon || Lightbulb;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-[#c9a84c] transition-colors"
        >
          <Info className="h-3 w-3" />
          Orientações
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[340px] bg-[#1a1a1a] border-[#c9a84c]/20 text-gray-200 p-0 overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
          <GuidanceIcon className="h-3.5 w-3.5 text-[#c9a84c]" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#c9a84c] font-bold">
            Orientações do campo
          </span>
        </div>

        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          <p className="text-xs text-gray-300 leading-relaxed">{text}</p>

          {guidance && (
            <>
              {guidance.tips.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-[10px] uppercase tracking-widest font-bold text-[#f0d78c]">
                    Dicas
                  </h5>
                  <ul className="space-y-1.5">
                    {guidance.tips.map((tip, index) => (
                      <li key={index} className="text-xs text-gray-400 flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#c9a84c] mt-1.5 flex-shrink-0" />
                        <span className="leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {guidance.examples.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-[10px] uppercase tracking-widest font-bold text-[#f0d78c]">
                    Exemplos
                  </h5>
                  <div className="space-y-2">
                    {guidance.examples.map((example, index) => (
                      <div
                        key={index}
                        className="p-2.5 bg-black/40 rounded border-l-2 border-[#c9a84c]/50"
                      >
                        <p className="text-xs italic text-gray-400 leading-relaxed">
                          "{example}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
