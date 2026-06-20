import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Sparkles, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMusicotherapyTreatmentPlans } from '@/hooks/useMusicotherapyTreatmentPlans';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { toast as sonnerToast } from 'sonner';
import { TreatmentPlanViewModal } from './components/TreatmentPlanViewModal';
import { MusicotherapyTreatmentPlanPDFv2 as MusicotherapyTreatmentPlanPDF } from '@/components/MusicotherapyTreatmentPlanPDFv2';
import { generateStaticPDF } from '@/utils/staticPDFGenerator';
import { useProfessionalData } from '@/hooks/useProfessionalData';
import { imageUrlToBase64 } from '@/utils/imageToBase64';
import { PlanStatsHeader } from '@/components/treatment-plan/PlanStatsHeader';
import { PlanListCard } from '@/components/treatment-plan/PlanListCard';

export default function MusicotherapyTreatmentPlans() {
  const navigate = useNavigate();
  const { data: plans, isLoading } = useMusicotherapyTreatmentPlans();
  const { data: professionalData } = useProfessionalData();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('updated_at');
  const [viewingPlanId, setViewingPlanId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [isDuplicating, setIsDuplicating] = useState<string | null>(null);

  const stats = useMemo(() => {
    const list = plans || [];
    const norm = (s?: string) => (s || 'draft').toLowerCase();
    return {
      total: list.length,
      active: list.filter(p => norm(p.status) === 'active' || norm(p.status) === 'ativo').length,
      draft: list.filter(p => norm(p.status) === 'draft' || norm(p.status) === 'rascunho').length,
      completed: list.filter(p => norm(p.status) === 'completed' || norm(p.status) === 'concluído').length,
    };
  }, [plans]);

  const filteredPlans = useMemo(() => {
    const list = plans || [];
    const term = searchTerm.toLowerCase();
    return list.filter(plan => {
      const matchesSearch = !term ||
        plan.patient_full_name?.toLowerCase().includes(term) ||
        plan.clinical_diagnosis?.toLowerCase().includes(term) ||
        plan.responsible_person?.toLowerCase().includes(term);
      const matchesStatus = statusFilter === 'all' || (plan.status || 'draft') === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'patient_name': return (a.patient_full_name || '').localeCompare(b.patient_full_name || '');
        case 'status': return (a.status || '').localeCompare(b.status || '');
        case 'created_at': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default: return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });
  }, [plans, searchTerm, statusFilter, sortBy]);

  const handleDelete = async (planId: string) => {
    try {
      const { error } = await supabase.from('treatment_plans').delete().eq('id', planId);
      if (error) throw error;
      toast({ title: 'Plano excluído', description: 'O plano foi removido com sucesso.' });
      queryClient.invalidateQueries({ queryKey: ['musicotherapy-treatment-plans'] });
    } catch (e) {
      toast({ title: 'Erro ao excluir', description: 'Não foi possível excluir o plano.', variant: 'destructive' });
    }
  };

  const handleDuplicate = async (planId: string) => {
    setIsDuplicating(planId);
    const loadingId = sonnerToast.loading('Duplicando plano...');
    try {
      const { data: original, error: fetchErr } = await supabase
        .from('treatment_plans').select('*').eq('id', planId).single();
      if (fetchErr || !original) throw fetchErr || new Error('Plano não encontrado');

      const { id, created_at, updated_at, ...rest } = original as any;
      const copy = {
        ...rest,
        status: 'draft',
        patient_full_name: `${original.patient_full_name || 'Plano'} (Cópia)`,
        plan_start_date: new Date().toISOString().split('T')[0],
      };
      const { data: inserted, error: insertErr } = await supabase
        .from('treatment_plans').insert(copy).select('id').single();
      if (insertErr) throw insertErr;

      sonnerToast.success('Plano duplicado com sucesso!', { id: loadingId });
      queryClient.invalidateQueries({ queryKey: ['musicotherapy-treatment-plans'] });
      if (inserted?.id) navigate(`/musicotherapy-treatment-plan/${inserted.id}`);
    } catch (e) {
      sonnerToast.error('Erro ao duplicar plano.', { id: loadingId });
    } finally {
      setIsDuplicating(null);
    }
  };

  const handleDownloadPDF = async (planId: string) => {
    setIsDownloading(planId);
    const loadingId = sonnerToast.loading('Gerando PDF do plano...');
    try {
      const { data: planData, error } = await supabase
        .from('treatment_plans').select('*').eq('id', planId).single();
      if (error || !planData) throw new Error('Plano não encontrado');

      const parseJsonField = (field: any): string[] => {
        if (!field) return [];
        if (Array.isArray(field)) return field;
        if (typeof field === 'string') {
          try { const p = JSON.parse(field); return Array.isArray(p) ? p : []; } catch { return []; }
        }
        return [];
      };

      const parsed = {
        ...planData,
        general_objectives: parseJsonField(planData.general_objectives),
        specific_objectives: parseJsonField(planData.specific_objectives),
        musical_instruments: parseJsonField(planData.musical_instruments),
        technological_resources: parseJsonField(planData.technological_resources),
        voice_body_resources: parseJsonField(planData.voice_body_resources),
        complementary_materials: parseJsonField(planData.complementary_materials),
        evaluation_criteria_list: parseJsonField(planData.evaluation_criteria_list),
      };

      const photoUrl = professionalData?.stamp_photo_url || professionalData?.avatar_url;
      const photoBase64 = photoUrl ? await imageUrlToBase64(photoUrl) : null;
      const stampBase64 = professionalData?.digital_stamp_url ? await imageUrlToBase64(professionalData.digital_stamp_url) : null;

      const success = await generateStaticPDF(
        <MusicotherapyTreatmentPlanPDF
          planData={parsed as any}
          therapistName={professionalData?.name}
          professionalPhotoUrl={photoBase64 || undefined}
          digitalStampUrl={stampBase64 || undefined}
          professionalEmail={professionalData?.email || undefined}
          professionalPhone={professionalData?.phone || undefined}
          professionalSpecialty={professionalData?.specialty || undefined}
          professionalRegistry={professionalData?.register || undefined}
        />,
        { filename: `Plano_Musicoterapeutico_${(planData.patient_full_name || 'paciente').replace(/\s+/g, '_')}.pdf`, waitTime: 2000 }
      );
      if (success) sonnerToast.success('PDF gerado!', { id: loadingId });
      else throw new Error('Falha ao gerar PDF');
    } catch {
      sonnerToast.error('Erro ao gerar PDF.', { id: loadingId });
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <div className="min-h-screen relative w-full overflow-x-hidden bg-background">
      {/* Ambient cosmic blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Premium Header */}
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-amber-400/5" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-5">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-amber-500 blur-xl opacity-40" />
                  <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary to-amber-500 shadow-lg">
                    <ClipboardList className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
                  </div>
                </div>
                <div className="space-y-2 min-w-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-background/40 backdrop-blur text-xs font-medium text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    Plano Clínico · IA Integrada
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                    Planos Musicoterapêuticos
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                    Crie, organize e acompanhe os planos de tratamento musicoterapêuticos dos seus pacientes.
                  </p>
                </div>
              </div>

              <Button
                onClick={() => navigate('/musicotherapy-treatment-plan')}
                className="bg-gradient-to-br from-primary to-amber-500 text-white border-0 shadow-md hover:opacity-90 transition-all duration-200 font-semibold gap-2"
              >
                <Plus className="h-4 w-4" />
                Novo Plano
              </Button>
            </div>

            {/* Status pills */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/60 bg-background/40 backdrop-blur text-xs font-medium">
                <ClipboardList className="h-3.5 w-3.5 text-primary" /> {stats.total} planos
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/60 bg-background/40 backdrop-blur text-xs font-medium">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Assistente IA
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/60 bg-background/40 backdrop-blur text-xs font-medium">
                <Filter className="h-3.5 w-3.5 text-rose-400" /> Filtros avançados
              </div>
            </div>
          </div>
        </div>


        {/* Stats */}
        <PlanStatsHeader total={stats.total} active={stats.active} draft={stats.draft} completed={stats.completed} />

        {/* Filters */}
        <Card className="border border-border/60">
          <CardContent className="pt-5 pb-5">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por paciente, diagnóstico ou responsável..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px] h-10">
                  <Filter className="h-4 w-4 mr-1" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="archived">Arquivado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[200px] h-10">
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated_at">Última atualização</SelectItem>
                  <SelectItem value="created_at">Data de criação</SelectItem>
                  <SelectItem value="patient_name">Nome do paciente</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-56 animate-pulse bg-muted/40" />
            ))}
          </div>
        ) : filteredPlans.length === 0 ? (
          <Card className="border-dashed border-2 border-border/50 bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                <ClipboardList className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {searchTerm || statusFilter !== 'all' ? 'Nenhum plano encontrado' : 'Comece seu primeiro plano'}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Tente ajustar a busca ou os filtros aplicados.'
                    : 'Construa um plano musicoterapêutico completo em 10 seções clínicas estruturadas.'}
                </p>
              </div>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={() => navigate('/musicotherapy-treatment-plan')} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Criar primeiro plano
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {filteredPlans.length} {filteredPlans.length === 1 ? 'plano encontrado' : 'planos encontrados'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {filteredPlans.map((plan, idx) => (
                <PlanListCard
                  key={plan.id}
                  plan={plan}
                  index={idx}
                  isDownloading={isDownloading === plan.id}
                  isDuplicating={isDuplicating === plan.id}
                  onView={() => setViewingPlanId(plan.id)}
                  onEdit={() => navigate(`/musicotherapy-treatment-plan/${plan.id}`)}
                  onDownload={() => handleDownloadPDF(plan.id)}
                  onDuplicate={() => handleDuplicate(plan.id)}
                  onDelete={() => handleDelete(plan.id)}
                />
              ))}
            </div>
          </>
        )}

        <TreatmentPlanViewModal
          planId={viewingPlanId}
          open={!!viewingPlanId}
          onClose={() => setViewingPlanId(null)}
        />
      </div>
    </div>
  );
}
