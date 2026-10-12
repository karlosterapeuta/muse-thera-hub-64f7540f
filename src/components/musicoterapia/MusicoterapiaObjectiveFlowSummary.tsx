import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getObjectiveOutcomes, getPendingObjectiveInterventions,
  getObjectiveOutcomeLabel
} from '@/data/musicoterapiaObjectiveOutcomes';

interface Props {
  objectiveIds: unknown;
  outcomes: unknown;
}

/** Resumo factual reutilizado no preview e na revisão final. */
export function MusicoterapiaObjectiveFlowSummary({ objectiveIds, outcomes }: Props) {
  const results = getObjectiveOutcomes(objectiveIds, outcomes);
  if (!results.length) return null;
  const pending = getPendingObjectiveInterventions(objectiveIds, outcomes);
  const notAssessed = results.filter(item => item.status === 'not_assessed');

  return (
    <Card className="border border-teal-600/30">
      <CardHeader>
        <CardTitle className="text-teal-700 dark:text-teal-300 text-base">Resultados dos Objetivos e Aspectos a Intervir</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2">Resultados registrados — Etapa 04</h4>
          <div className="space-y-1">
            {results.map(({ objective, status }) => (
              <p key={objective.id} className="text-sm">
                {objective.icon} <strong>{objective.title}:</strong> {getObjectiveOutcomeLabel(status)}
              </p>
            ))}
          </div>
        </div>
        <div className="border-t pt-3">
          <h4 className="font-semibold text-sm mb-2">Necessidades de continuidade — Etapa 05</h4>
          {pending.length > 0 ? (
            <ul className="space-y-1 text-sm list-disc pl-5">
              {pending.map(({ objective, status }) => (
                <li key={objective.id}>
                  <strong>{objective.title}</strong> — {getObjectiveOutcomeLabel(status)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma demanda de continuidade identificada nos objetivos avaliados; os não avaliados exigem acompanhamento.</p>
          )}
          {notAssessed.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Objetivos não avaliados: {notAssessed.map(item => item.objective.title).join(', ')}.
              Eles não são considerados dificuldades automaticamente.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
