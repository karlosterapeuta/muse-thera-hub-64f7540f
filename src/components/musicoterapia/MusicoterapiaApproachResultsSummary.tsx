import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRecordedApproachResults, summarizeApproachResult } from '@/data/musicoterapiaApproachResults';

type Props = { approachIds: unknown; results: unknown };

export function MusicoterapiaApproachResultsSummary({ approachIds, results }: Props) {
  const entries = getRecordedApproachResults(approachIds, results);
  if (!entries.length) return null;
  return (
    <Card className="border border-[#c9a84c]/30">
      <CardHeader>
        <CardTitle className="text-[#c9a84c] text-base">Resultados Observados por Abordagem</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Respostas informadas pelo profissional nas abordagens da Etapa 04.
        </p>
        {entries.map(({ approach, result }) => (
          <div key={approach.id} className="rounded-lg border border-[#c9a84c]/20 p-3 space-y-1">
            <p className="font-semibold text-sm">{approach.title}</p>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{summarizeApproachResult(result)}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
