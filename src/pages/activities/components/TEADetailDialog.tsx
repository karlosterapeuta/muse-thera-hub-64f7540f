import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TEAActivity } from '../data/tea-specific-activities';
import { TEASensoryIndicators } from './TEASensoryIndicators';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TEADetailDialogProps {
  activity: TEAActivity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TEADetailDialog({ activity, open, onOpenChange }: TEADetailDialogProps) {
  if (!activity) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {activity.title}
            <Badge>TEA Nível {activity.supportLevel}</Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Indicadores Sensoriais */}
            <TEASensoryIndicators activity={activity} />

            {/* Adaptações por Nível */}
            <div className="space-y-4">
              <h3 className="font-semibold">Adaptações por Nível de Suporte</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-green-600">Nível 1 - Suporte Mínimo</h4>
                  <ul className="text-sm space-y-1">
                    {activity.adaptationSuggestions.level1.map((suggestion, index) => (
                      <li key={index} className="text-muted-foreground">• {suggestion}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-yellow-600">Nível 2 - Suporte Substancial</h4>
                  <ul className="text-sm space-y-1">
                    {activity.adaptationSuggestions.level2.map((suggestion, index) => (
                      <li key={index} className="text-muted-foreground">• {suggestion}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-red-600">Nível 3 - Suporte Intenso</h4>
                  <ul className="text-sm space-y-1">
                    {activity.adaptationSuggestions.level3.map((suggestion, index) => (
                      <li key={index} className="text-muted-foreground">• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <Separator />

            {/* Instruções */}
            {activity.instructions && (
              <div className="space-y-2">
                <h3 className="font-semibold">Instruções</h3>
                <ol className="list-decimal list-inside space-y-1">
                  {activity.instructions.map((instruction, index) => (
                    <li key={index} className="text-sm text-muted-foreground">{instruction}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}