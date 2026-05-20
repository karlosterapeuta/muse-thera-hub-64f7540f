import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Check } from 'lucide-react';
import { PLAN_TEMPLATES, type PlanTemplate } from '@/data/treatmentPlanTemplates';
import type { MusicotherapyTreatmentPlan } from '@/types/musicotherapy-plan';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (data: Partial<MusicotherapyTreatmentPlan>) => void;
  mode?: 'replace' | 'merge';
}

export const PlanTemplatesDialog: React.FC<Props> = ({ open, onOpenChange, onApply }) => {
  const [selected, setSelected] = useState<PlanTemplate | null>(null);

  const handleApply = () => {
    if (!selected) return;
    onApply(selected.data);
    onOpenChange(false);
    setSelected(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Aplicar Template Clínico
          </DialogTitle>
          <DialogDescription>
            Selecione um modelo baseado em diagnóstico. Os campos serão preenchidos automaticamente e poderão ser editados.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {PLAN_TEMPLATES.map((tpl) => {
            const isSel = selected?.id === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setSelected(tpl)}
                className={cn(
                  'text-left rounded-xl border-2 p-4 transition-all relative',
                  isSel
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/40 hover:bg-muted/40'
                )}
              >
                {isSel && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
                <div className="text-2xl mb-2">{tpl.emoji}</div>
                <div className="font-semibold text-sm leading-tight mb-1">{tpl.label}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{tpl.description}</div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleApply} disabled={!selected}>
            <Sparkles className="h-4 w-4 mr-2" />
            Aplicar Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
