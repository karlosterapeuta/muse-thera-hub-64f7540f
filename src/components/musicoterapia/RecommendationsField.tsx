import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Check, Lightbulb } from 'lucide-react';

interface RecommendationsFieldProps {
  value: string[] | string;
  onChange: (value: string[]) => void;
}

/**
 * Um campo curto e editável, sem busca, filtros ou cartões de textos prontos.
 * Mantém o formato string[] já usado pelos relatórios existentes.
 */
const QUICK_SUGGESTIONS = [
  'Recomenda-se manter o acompanhamento musicoterapêutico e reavaliar periodicamente os objetivos estabelecidos, utilizando registros descritivos das respostas musicais, do contexto das atividades e dos apoios necessários, para orientar possíveis ajustes no planejamento.',
  'Sugere-se revisar os objetivos classificados com dificuldade e adequar a complexidade das propostas sonoro-musicais às possibilidades de participação do paciente, respeitando suas preferências, sinais de desconforto e formas individuais de comunicação.',
  'Nos objetivos classificados como sem avanço observado, recomenda-se reexaminar as estratégias terapêuticas e ampliar os registros das oportunidades oferecidas, das respostas apresentadas e do nível de mediação, sem interpretar essa classificação como incapacidade permanente.',
  'Para estimular a imitação vocal, podem ser consideradas experiências graduais de eco sonoro, canto responsivo e pequenas alternâncias melódicas, quando pertinentes, com registro de tentativas, iniciativas espontâneas e respostas produzidas com ou sem apoio.',
  'Para favorecer a atenção compartilhada, sugere-se oferecer oportunidades de interação em torno de instrumentos, pausas musicais e escolhas de repertório, observando iniciativas e respostas de compartilhamento de interesse sem exigir contato ocular.',
  'Recomenda-se favorecer oportunidades de comunicação funcional nas experiências musicais, incluindo escolhas, pedidos, recusas, gestos e vocalizações, documentando quais modalidades comunicativas foram utilizadas e as condições em que ocorreram.',
  'Considerar as preferências musicais efetivamente manifestadas pelo paciente na seleção de repertórios e instrumentos futuros, observando aceitação, recusa, participação voluntária e possíveis necessidades de adaptação sensorial.',
  'Para objetivos ligados à percepção auditiva, sugere-se explorar gradualmente contrastes de timbre, altura, intensidade e duração, respeitando a sensibilidade sonora e registrando respostas discriminativas, sinais de conforto e necessidade de mediação.',
  'Nos objetivos relacionados à interação social e ao vínculo terapêutico, recomenda-se propor experiências musicais compartilhadas e previsíveis, respeitando o ritmo de aproximação do paciente e registrando iniciativas, reciprocidade e permanência voluntária.',
  'Para objetivos de expressão emocional e autorregulação, considerar experiências musicais escolhidas ou aceitas pelo paciente, documentando sinais observáveis de participação, desconforto e estratégias de apoio, sem presumir redução de ansiedade ou outros efeitos clínicos.',
  'Nas atividades instrumentais e rítmicas, sugere-se graduar as demandas motoras e de sequenciamento conforme as necessidades observadas, registrando execução, tentativas, ritmo de participação e tipo de assistência, sem pressupor progresso funcional não documentado.',
  'Quando pertinente e autorizado, orientar familiares e equipe de acompanhamento sobre preferências musicais e formas de participação registradas, alinhando as propostas de continuidade sem atribuir resultados terapêuticos a contextos que não foram avaliados.'
] as const;

export function RecommendationsField({ value = [], onChange }: RecommendationsFieldProps) {
  const items = Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : typeof value === 'string' ? [value] : [];
  const content = items.join('\n');

  const updateText = (text: string) => {
    onChange(text.trim() ? [text] : []);
  };

  const addSuggestion = (suggestion: string) => {
    const trimmed = content.trim();
    if (trimmed.includes(suggestion)) {
      const remaining = content.split('\n').filter((line) => line.trim() !== suggestion).join('\n');
      updateText(remaining);
      return;
    }
    updateText(trimmed ? `${trimmed}\n${suggestion}` : suggestion);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs sm:text-sm text-muted-foreground">
        Selecione sugestões para compor recomendações mais descritivas e individualizadas. Revise e adapte o texto aos registros reais do paciente antes de emitir o relatório.
      </p>

      <Textarea
        id="recommendations"
        aria-label="Recomendações terapêuticas"
        value={content}
        onChange={(event) => updateText(event.target.value)}
        rows={6}
        placeholder="Ex.: Manter sessões de musicoterapia. Reavaliar a atenção e a concentração após o próximo período de acompanhamento."
        className="bg-[#101a2e] border-border/70 text-foreground placeholder:text-muted-foreground resize-y min-h-[120px]"
      />

      <div className="space-y-2">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lightbulb className="h-3.5 w-3.5 text-teal-700 dark:text-teal-300" />
          Sugestões rápidas (exemplos editáveis; inclua apenas os pertinentes)
        </p>
        <div className="flex flex-wrap gap-2">
          {QUICK_SUGGESTIONS.map((suggestion) => {
            const selected = content.includes(suggestion);
            return (
              <button
                type="button"
                key={suggestion}
                aria-pressed={selected}
                onClick={() => addSuggestion(suggestion)}
                className={`rounded-lg border px-3 py-2 text-xs text-left leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${selected
                  ? 'border-teal-600 bg-teal-600/15 text-teal-800 dark:text-teal-200'
                  : 'border-border/70 text-foreground/80 hover:border-teal-600/50'}`}
              >
                {selected && <Check className="inline h-3.5 w-3.5 mr-1 text-teal-800 dark:text-teal-200" />}
                {suggestion}
              </button>
            );
          })}
        </div>
      </div>
      {content.trim() && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange([])}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Limpar recomendações
          </Button>
        </div>
      )}
    </div>
  );
}
