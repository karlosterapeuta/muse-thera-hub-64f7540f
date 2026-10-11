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
  'Manter o acompanhamento musicoterapêutico e reavaliar os objetivos periodicamente.',
  'Priorizar nas próximas sessões os objetivos que ainda apresentam dificuldades.',
  'Compartilhar com a família estratégias musicais adequadas às preferências do paciente.'
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
        Escreva orientações breves e específicas para este paciente.
      </p>

      <Textarea
        id="recommendations"
        aria-label="Recomendações terapêuticas"
        value={content}
        onChange={(event) => updateText(event.target.value)}
        rows={4}
        placeholder="Ex.: Manter sessões de musicoterapia. Reavaliar a atenção e a concentração após o próximo período de acompanhamento."
        className="bg-[#101a2e] border-white/15 text-gray-100 placeholder:text-gray-400 resize-y min-h-[120px]"
      />

      <div className="space-y-2">
        <p className="flex items-center gap-2 text-xs text-gray-400">
          <Lightbulb className="h-3.5 w-3.5 text-[#c9a84c]" />
          Sugestões rápidas (opcionais; revise antes de incluir)
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
                className={`rounded-lg border px-3 py-2 text-xs text-left leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0d78c] ${selected
                  ? 'border-[#c9a84c] bg-[#c9a84c]/15 text-[#f0d78c]'
                  : 'border-white/15 text-gray-300 hover:border-[#c9a84c]/50'}`}
              >
                {selected && <Check className="inline h-3.5 w-3.5 mr-1 text-[#f0d78c]" />}
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
