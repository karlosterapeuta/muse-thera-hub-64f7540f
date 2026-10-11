import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MusicoterapiaReferralSummaryProps {
  source?: unknown;
  reason?: unknown;
}

/** Bloco opcional para pré-visualização e revisão final; preserva campos legados. */
export function MusicoterapiaReferralSummary({ source, reason }: MusicoterapiaReferralSummaryProps) {
  const referralSource = typeof source === 'string' ? source.trim() : '';
  const referralReason = typeof reason === 'string' ? reason.trim() : '';

  if (!referralSource && !referralReason) return null;

  return (
    <Card className="border border-[#c9a84c]/25">
      <CardHeader>
        <CardTitle className="text-base text-[#c9a84c]">Motivo do Encaminhamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {referralSource && (
          <div>
            <p className="text-xs font-medium text-muted-foreground">Quem encaminhou</p>
            <p className="mt-1 whitespace-pre-wrap break-words">{referralSource}</p>
          </div>
        )}
        {referralReason && (
          <div>
            <p className="text-xs font-medium text-muted-foreground">Motivo</p>
            <p className="mt-1 whitespace-pre-wrap break-words">{referralReason}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
