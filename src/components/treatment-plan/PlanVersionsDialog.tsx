import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { History, Camera, RotateCcw, Trash2, Loader2 } from 'lucide-react';
import { MusicotherapyTreatmentPlan } from '@/types/musicotherapy-plan';

interface Version {
  id: string;
  version_number: number;
  label: string | null;
  snapshot: any;
  created_at: string;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  planId?: string;
  professionalId?: string;
  currentData: Partial<MusicotherapyTreatmentPlan>;
  onRestore: (snapshot: Partial<MusicotherapyTreatmentPlan>) => void;
}

export function PlanVersionsDialog({ open, onOpenChange, planId, professionalId, currentData, onRestore }: Props) {
  const { toast } = useToast();
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [label, setLabel] = useState('');

  const load = async () => {
    if (!planId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('treatment_plan_versions')
      .select('*')
      .eq('plan_id', planId)
      .order('version_number', { ascending: false });
    if (!error) setVersions((data as any) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (open) load();
  }, [open, planId]);

  const handleSnapshot = async () => {
    if (!planId || !professionalId) {
      toast({ variant: 'destructive', title: 'Salve o plano primeiro' });
      return;
    }
    setSaving(true);
    const nextVersion = (versions[0]?.version_number || 0) + 1;
    const { error } = await supabase.from('treatment_plan_versions').insert({
      plan_id: planId,
      professional_id: professionalId,
      version_number: nextVersion,
      label: label.trim() || `Versão ${nextVersion}`,
      snapshot: currentData as any,
    });
    setSaving(false);
    if (error) {
      toast({ variant: 'destructive', title: 'Erro ao salvar versão', description: error.message });
    } else {
      toast({ title: 'Versão salva', description: `v${nextVersion} criada com sucesso.` });
      setLabel('');
      load();
    }
  };

  const handleRestore = (v: Version) => {
    onRestore(v.snapshot as Partial<MusicotherapyTreatmentPlan>);
    toast({ title: 'Versão restaurada', description: `v${v.version_number} aplicada ao editor. Salve para confirmar.` });
    onOpenChange(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('treatment_plan_versions').delete().eq('id', id);
    if (error) toast({ variant: 'destructive', title: 'Erro ao excluir', description: error.message });
    else load();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><History className="h-5 w-5 text-primary" /> Versionamento do plano</DialogTitle>
          <DialogDescription>Guarde snapshots e restaure versões anteriores quando precisar.</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Input placeholder="Rótulo (opcional) ex.: revisão trimestral" value={label} onChange={(e) => setLabel(e.target.value)} />
          <Button onClick={handleSnapshot} disabled={saving || !planId}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Camera className="h-4 w-4 mr-2" />} Salvar versão
          </Button>
        </div>

        <ScrollArea className="max-h-[400px] pr-3">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-6"><Loader2 className="h-4 w-4 animate-spin" /> Carregando...</div>
          ) : versions.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">Nenhuma versão salva ainda.</p>
          ) : (
            <div className="space-y-2">
              {versions.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">v{v.version_number}</Badge>
                      <span className="font-medium text-sm">{v.label || `Versão ${v.version_number}`}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(v.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="outline" onClick={() => handleRestore(v)}>
                      <RotateCcw className="h-3.5 w-3.5 mr-1" /> Restaurar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(v.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
