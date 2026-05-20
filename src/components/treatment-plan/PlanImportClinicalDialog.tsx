import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, FileSearch, Stethoscope, ClipboardList } from 'lucide-react';
import { MusicotherapyTreatmentPlan } from '@/types/musicotherapy-plan';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  patientId?: string;
  onApply: (partial: Partial<MusicotherapyTreatmentPlan>) => void;
}

export function PlanImportClinicalDialog({ open, onOpenChange, patientId, onApply }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [anamnesis, setAnamnesis] = useState<any | null>(null);
  const [assessment, setAssessment] = useState<any | null>(null);
  const [useAnamnesis, setUseAnamnesis] = useState(true);
  const [useAssessment, setUseAssessment] = useState(true);

  useEffect(() => {
    if (!open || !patientId) return;
    (async () => {
      setLoading(true);
      try {
        const [{ data: ana }, { data: ass }] = await Promise.all([
          supabase.from('anamnesis').select('*').eq('patient_id', patientId).order('updated_at', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('assessments').select('*').eq('patient_id', patientId).order('date', { ascending: false }).limit(1).maybeSingle(),
        ]);
        setAnamnesis(ana);
        setAssessment(ass);
      } catch (e: any) {
        toast({ variant: 'destructive', title: 'Erro ao buscar dados clínicos', description: e.message });
      } finally {
        setLoading(false);
      }
    })();
  }, [open, patientId]);

  const buildPartial = (): Partial<MusicotherapyTreatmentPlan> => {
    const partial: Partial<MusicotherapyTreatmentPlan> = {};
    if (useAnamnesis && anamnesis) {
      const interests: string[] = [];
      if (anamnesis.children_repertoire) interests.push('Repertório infantil');
      if (anamnesis.rock_genre) interests.push('Rock');
      if (anamnesis.sacred_gospel) interests.push('Música sacra/gospel');
      if (anamnesis.brazilian_popular) interests.push('MPB');
      if (anamnesis.country_music) interests.push('Sertanejo');
      if (anamnesis.classical_music) interests.push('Música clássica');
      if (anamnesis.other_musical_genres) interests.push('Outros gêneros');

      const behaviors: string[] = [];
      if (anamnesis.stereotyped_behavior) behaviors.push('comportamentos estereotipados');
      if (anamnesis.social_isolation) behaviors.push('isolamento social');
      if (anamnesis.irritability) behaviors.push('irritabilidade');
      if (anamnesis.anxiety) behaviors.push('ansiedade');
      if (anamnesis.restricted_interests) behaviors.push('interesses restritos');

      const conditions: string[] = [];
      if (anamnesis.autism_spectrum) conditions.push('TEA');
      if (anamnesis.down_syndrome) conditions.push('Síndrome de Down');
      if (anamnesis.cerebral_palsy) conditions.push('Paralisia cerebral');
      if (anamnesis.adhd) conditions.push('TDAH');
      if (anamnesis.intellectual_disability) conditions.push('Deficiência intelectual');
      if (anamnesis.epilepsy) conditions.push('Epilepsia');

      partial.clinical_diagnosis = [anamnesis.cid_code, conditions.join(', ')].filter(Boolean).join(' - ');
      partial.musical_interests = interests.join(', ');
      partial.observed_behaviors = behaviors.join(', ');
      partial.clinical_family_history = [anamnesis.family_musical_history, anamnesis.patient_musical_history].filter(Boolean).join(' | ');
      partial.physical_cognitive_conditions = anamnesis.clinical_details || anamnesis.diagnosis_details || '';
      partial.interaction_communication_level = [
        anamnesis.visual_contact ? 'contato visual presente' : null,
        anamnesis.verbal_language_absence ? 'ausência de linguagem verbal' : null,
        anamnesis.nonverbal_communication ? 'comunicação não-verbal' : null,
        anamnesis.echolalia ? 'ecolalia' : null,
        anamnesis.simple_phrases ? 'frases simples' : null,
      ].filter(Boolean).join(', ');
    }

    if (useAssessment && assessment?.content) {
      const c = assessment.content as any;
      if (typeof c === 'object') {
        const txt = JSON.stringify(c).slice(0, 2000);
        partial.observed_behaviors = (partial.observed_behaviors ? partial.observed_behaviors + ' | ' : '') + `Avaliação ${new Date(assessment.date).toLocaleDateString('pt-BR')}: ${assessment.type}`;
        // Generic notes append
        if (c.notes) {
          partial.physical_cognitive_conditions = (partial.physical_cognitive_conditions || '') + (partial.physical_cognitive_conditions ? ' | ' : '') + String(c.notes).slice(0, 500);
        }
      }
    }
    return partial;
  };

  const handleApply = () => {
    const partial = buildPartial();
    if (!Object.keys(partial).length) {
      toast({ title: 'Nada para importar', description: 'Não foram encontrados dados clínicos para este paciente.' });
      return;
    }
    onApply(partial);
    toast({ title: 'Dados importados', description: 'Os campos foram preenchidos a partir do prontuário.' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><FileSearch className="h-5 w-5 text-primary" /> Importar do prontuário</DialogTitle>
          <DialogDescription>Pré-popular o plano a partir da Anamnese e da última Avaliação do paciente.</DialogDescription>
        </DialogHeader>

        {!patientId ? (
          <p className="text-sm text-muted-foreground">Selecione um paciente primeiro.</p>
        ) : loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Buscando dados clínicos...</div>
        ) : (
          <div className="space-y-3">
            <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${anamnesis ? 'hover:bg-muted/50' : 'opacity-50 cursor-not-allowed'}`}>
              <Checkbox checked={useAnamnesis && !!anamnesis} disabled={!anamnesis} onCheckedChange={(v) => setUseAnamnesis(!!v)} />
              <div className="flex-1">
                <div className="flex items-center gap-2 font-medium"><Stethoscope className="h-4 w-4" /> Anamnese {anamnesis ? <Badge variant="secondary">disponível</Badge> : <Badge variant="outline">não encontrada</Badge>}</div>
                <p className="text-xs text-muted-foreground mt-0.5">Diagnóstico, interesses musicais, comportamentos e histórico.</p>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${assessment ? 'hover:bg-muted/50' : 'opacity-50 cursor-not-allowed'}`}>
              <Checkbox checked={useAssessment && !!assessment} disabled={!assessment} onCheckedChange={(v) => setUseAssessment(!!v)} />
              <div className="flex-1">
                <div className="flex items-center gap-2 font-medium"><ClipboardList className="h-4 w-4" /> Última avaliação {assessment ? <Badge variant="secondary">{new Date(assessment.date).toLocaleDateString('pt-BR')}</Badge> : <Badge variant="outline">não encontrada</Badge>}</div>
                <p className="text-xs text-muted-foreground mt-0.5">Dados clínicos da última avaliação registrada.</p>
              </div>
            </label>

            <p className="text-xs text-muted-foreground">Os campos já preenchidos manualmente serão preservados.</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleApply} disabled={loading || (!anamnesis && !assessment)}>Importar dados</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
