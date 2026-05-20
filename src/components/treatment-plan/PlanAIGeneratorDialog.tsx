import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Wand2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { MusicotherapyTreatmentPlan } from '@/types/musicotherapy-plan';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientContext: {
    patient_full_name?: string;
    patient_age?: string;
    clinical_diagnosis?: string;
  };
  onGenerated: (data: Partial<MusicotherapyTreatmentPlan>) => void;
}

export const PlanAIGeneratorDialog: React.FC<Props> = ({ open, onOpenChange, patientContext, onGenerated }) => {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!patientContext.clinical_diagnosis && !notes.trim()) {
      toast.error('Informe ao menos o diagnóstico ou notas clínicas.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-treatment-plan', {
        body: {
          patient_full_name: patientContext.patient_full_name,
          patient_age: patientContext.patient_age,
          clinical_diagnosis: patientContext.clinical_diagnosis,
          clinical_notes: notes,
        },
      });
      if (error) throw error;
      if (!data?.plan) throw new Error('Resposta inválida da IA');
      onGenerated(data.plan);
      toast.success('Plano gerado pela IA! Revise e ajuste conforme necessário.');
      onOpenChange(false);
      setNotes('');
    } catch (e: any) {
      console.error(e);
      const msg = e?.message || '';
      if (msg.includes('429')) toast.error('Limite de requisições atingido. Aguarde um momento.');
      else if (msg.includes('402')) toast.error('Créditos de IA esgotados. Adicione créditos em Settings.');
      else toast.error('Erro ao gerar plano com IA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            Gerar Plano com IA
          </DialogTitle>
          <DialogDescription>
            A IA criará uma sugestão de plano musicoterapêutico com base no diagnóstico e nas informações clínicas fornecidas. Você poderá editar livremente após a geração.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-lg bg-muted/40 p-3 text-sm space-y-1 border">
            <div><strong>Paciente:</strong> {patientContext.patient_full_name || '—'}</div>
            <div><strong>Idade:</strong> {patientContext.patient_age || '—'}</div>
            <div><strong>Diagnóstico:</strong> {patientContext.clinical_diagnosis || '—'}</div>
          </div>

          <div className="space-y-2">
            <Label>Notas clínicas adicionais (opcional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: paciente apresenta hipersensibilidade auditiva, prefere instrumentos de percussão, demonstra interesse por MPB..."
              rows={6}
            />
            <p className="text-xs text-muted-foreground">
              Quanto mais contexto, melhor a sugestão. Inclua interesses musicais, comportamentos observados e prioridades terapêuticas.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancelar</Button>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Gerando...</> : <><Wand2 className="h-4 w-4 mr-2" />Gerar com IA</>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
