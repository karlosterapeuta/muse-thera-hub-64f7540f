import React from 'react';
import { BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSelectedMusicoterapiaReferences } from '@/data/musicoterapiaReferences';

interface Props {
  referenceIds: unknown;
}

/** Lista bibliográfica fiel às escolhas feitas na Etapa 06. */
export function MusicoterapiaReferenceSummary({ referenceIds }: Props) {
  const references = getSelectedMusicoterapiaReferences(referenceIds);
  if (!references.length) return null;

  return (
    <Card className="border border-[#c9a84c]/30">
      <CardHeader>
        <CardTitle className="text-[#c9a84c] text-base flex items-center gap-2">
          <BookOpen className="h-5 w-5 shrink-0" />
          Referências Bibliográficas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {references.map((reference, index) => (
          <div key={reference.id} className="text-sm flex items-start gap-2 rounded-lg border border-[#c9a84c]/15 p-3">
            <span className="text-xs text-muted-foreground shrink-0 mt-0.5">{index + 1}.</span>
            <p className="leading-relaxed break-words">{reference.bibliography}</p>
          </div>
        ))}
        <p className="text-xs text-muted-foreground">
          Referências selecionadas pelo profissional. A inclusão bibliográfica, isoladamente,
          não comprova eficácia ou causalidade dos resultados clínicos descritos.
        </p>
      </CardContent>
    </Card>
  );
}
