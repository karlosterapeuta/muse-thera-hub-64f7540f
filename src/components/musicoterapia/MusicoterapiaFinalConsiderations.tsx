import React from 'react';
import { ClipboardCheck, Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getMusicoterapiaFinalConsiderations } from '@/utils/musicoterapiaFinalConsiderations';

interface Props {
  fields: Record<string, unknown> | undefined;
  onChange: (note: string) => void;
}

/**
 * Etapa 08 enxuta: síntese factual calculada das etapas anteriores e apenas
 * uma observação opcional, de autoria e responsabilidade do profissional.
 */
export function MusicoterapiaFinalConsiderations({ fields, onChange }: Props) {
  const summary = getMusicoterapiaFinalConsiderations(fields);
  const note = typeof fields?.final_considerations === 'string'
    ? fields.final_considerations
    : Array.isArray(fields?.final_considerations)
      ? fields.final_considerations.filter((item): item is string => typeof item === 'string').join(' ')
      : '';

  return (
    <section className="space-y-5" aria-label="Considerações finais do relatório">
      <div className="rounded-2xl border border-teal-600/40 bg-teal-600/[0.07] p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <ClipboardCheck className="h-6 w-6 shrink-0 text-teal-800 dark:text-teal-200 mt-0.5" />
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-teal-800 dark:text-teal-200">
              Síntese clínica do acompanhamento
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-foreground/80">
              Resumo gerado a partir das respostas registradas na Etapa 04
              e das demandas identificadas na Etapa 05.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-border/60 bg-[#111111]/70 p-4 space-y-3" aria-live="polite">
          {summary.paragraphs.length ? (
            summary.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              A síntese aparecerá quando os resultados dos objetivos forem registrados na Etapa 04.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="musicoterapia_final_considerations" className="font-semibold text-sm text-teal-800 dark:text-teal-200">
          Observação conclusiva (opcional)
        </Label>
        <Textarea
          id="musicoterapia_final_considerations"
          rows={3}
          maxLength={1500}
          value={note}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Acrescente somente algo clinicamente relevante que ainda não esteja registrado nas etapas anteriores."
          className="w-full min-h-[90px] resize-y bg-[#101a2e] border-border/70 text-foreground placeholder:text-muted-foreground"
        />
        <p className="text-xs text-muted-foreground">
          Não é necessário repetir objetivos, abordagens ou recomendações. {note.length}/1500 caracteres
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-[#111111]/60 p-3 text-xs text-muted-foreground leading-relaxed">
        <Info className="h-4 w-4 shrink-0 text-teal-700 dark:text-teal-300 mt-0.5" />
        <p>
          Os resultados refletem somente as classificações informadas pelo profissional.
          A síntese não determina eficácia da intervenção, prognóstico nem indicação automática de alta.
          Revise o texto antes de assinar.
        </p>
      </div>
    </section>
  );
}
