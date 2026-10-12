import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMusicoterapiaFinalConsiderations } from '@/utils/musicoterapiaFinalConsiderations';

/** Uma única renderização padronizada para a prévia e a revisão final. */
export function MusicoterapiaFinalConsiderationsSummary({
  fields
}: {
  fields: Record<string, unknown> | undefined;
}) {
  const summary = getMusicoterapiaFinalConsiderations(fields);
  if (!summary.paragraphs.length) return null;

  return (
    <Card className="border border-teal-600/25">
      <CardHeader>
        <CardTitle className="text-base text-teal-700 dark:text-teal-300">
          Considerações Finais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {summary.paragraphs.map((paragraph, index) => (
          <p key={index} className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {paragraph}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}
