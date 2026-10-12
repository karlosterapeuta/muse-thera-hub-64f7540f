import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRecordedApproachResults, summarizeApproachResult } from '@/data/musicoterapiaApproachResults';

type Props = { approachIds: unknown; results: unknown };

export function MusicoterapiaApproachResultsSummary({ approachIds, results }: Props) {
  const entries = getRecordedApproachResults(approachIds, results);
  if (!entries.length) return null;
  return (
    <Card className="border border-teal-600/30">
      <CardHeader>
        <CardTitle className="text-teal-700 dark:text-teal-300 text-base">Resultados Observados por Abordagem</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Respostas informadas pelo profissional nas abordagens da Etapa 04.
        </p>
        {entries.map(({ approach, result }) => (
          <div key={approach.id} className="rounded-lg border border-teal-600/20 p-3 space-y-1">
            <p className="font-semibold text-sm">{approach.title}</p>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{summarizeApproachResult(result)}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
