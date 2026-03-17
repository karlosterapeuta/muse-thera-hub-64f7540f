import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Music2, Plus, FileX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInterventionPlans } from "@/hooks/useInterventionPlans";
import { InterventionPlanStats } from "@/components/intervention/InterventionPlanStats";
import { InterventionPlanFilters, FilterOptions } from "@/components/intervention/InterventionPlanFilters";
import { InterventionPlanCard } from "@/components/intervention/InterventionPlanCard";
import { InterventionPlanDialog } from "@/components/intervention/InterventionPlanDialog";
import type { InterventionPlan } from "@/hooks/useInterventionPlans";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import html2pdf from "html2pdf.js";
import { savePDFToStorage } from "@/utils/pdfStorageUtils";

export default function InterventionPlans() {
  const navigate = useNavigate();
  const { plans, stats, isLoading, refetch } = useInterventionPlans();
  const [selectedPlan, setSelectedPlan] = useState<InterventionPlan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    status: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Filter and sort plans
  const filteredPlans = useMemo(() => {
    let filtered = [...plans];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(plan =>
        plan.patient_name.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(plan => plan.status === filters.status);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      if (filters.sortBy === 'date') {
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (filters.sortBy === 'patient') {
        comparison = a.patient_name.localeCompare(b.patient_name);
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [plans, filters]);

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  const handleViewPlan = (plan: InterventionPlan) => {
    setSelectedPlan(plan);
    setIsDialogOpen(true);
  };

  const handleDownloadPDF = async (plan: InterventionPlan) => {
    toast.info("Gerando PDF...");

    const activities = plan.complementary_materials?.activities || [];

    const content = `
      <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
        <h1 style="color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px;">
          Plano de Intervenção Musicoterapêutico
        </h1>
        
        <div style="margin: 30px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
          <h2 style="margin: 0 0 10px 0; color: #1f2937;">Informações do Paciente</h2>
          <p style="margin: 5px 0;"><strong>Nome:</strong> ${plan.patient_name}</p>
          <p style="margin: 5px 0;"><strong>Data de Criação:</strong> ${new Date(plan.created_at).toLocaleDateString('pt-BR')}</p>
          <p style="margin: 5px 0;"><strong>Total de Atividades:</strong> ${activities.length}</p>
        </div>

        <h2 style="color: #1f2937; margin-top: 40px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
          Atividades do Plano
        </h2>

        ${activities.map((activity, index) => `
          <div style="margin: 30px 0; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; page-break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
              <h3 style="margin: 0; color: #2563eb;">Atividade ${index + 1}: ${activity.name}</h3>
              <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 12px; font-size: 12px;">
                ${activity.complexity}
              </span>
            </div>

            <div style="margin: 15px 0;">
              <h4 style="color: #374151; margin: 10px 0 5px 0;">🎯 Objetivo Geral:</h4>
              <p style="margin: 0; color: #6b7280;">${activity.generalObjective}</p>
            </div>

            <div style="margin: 15px 0;">
              <h4 style="color: #374151; margin: 10px 0 5px 0;">💡 Objetivo Específico:</h4>
              <p style="margin: 0; color: #6b7280;">${activity.specificObjective}</p>
            </div>

            <div style="margin: 15px 0;">
              <h4 style="color: #374151; margin: 10px 0 5px 0;">⏱️ Tempo Estimado:</h4>
              <p style="margin: 0; color: #6b7280;">${activity.estimatedTime}</p>
            </div>

            ${activity.materials?.length > 0 ? `
              <div style="margin: 15px 0;">
                <h4 style="color: #374151; margin: 10px 0 5px 0;">🎵 Materiais Necessários:</h4>
                <ul style="margin: 5px 0; padding-left: 20px; color: #6b7280;">
                  ${activity.materials.map(m => `<li style="margin: 5px 0;">${m}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            ${activity.evaluationCriteria?.length > 0 ? `
              <div style="margin: 15px 0;">
                <h4 style="color: #374151; margin: 10px 0 5px 0;">✅ Critérios de Avaliação:</h4>
                <ul style="margin: 5px 0; padding-left: 20px; color: #6b7280;">
                  ${activity.evaluationCriteria.map(c => `<li style="margin: 5px 0;">${c}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            ${activity.associatedDemand ? `
              <div style="margin: 15px 0; padding-top: 10px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                  <strong>Demanda Associada:</strong> ${activity.associatedDemand}
                </p>
              </div>
            ` : ''}
          </div>
        `).join('')}

        <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
          <p>Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
        </div>
      </div>
    `;

    const opt = {
      margin: 10,
      filename: `plano-intervencao-${plan.patient_name.replace(/\s+/g, '-').toLowerCase()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      const pdfInstance = html2pdf().set(opt).from(content);
      await pdfInstance.save();
      try { const blob = await pdfInstance.outputPdf('blob'); await savePDFToStorage(blob, opt.filename, "intervention"); } catch(e) { console.warn("PDF não salvo no storage:", e); }
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF. Tente novamente.");
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm("Tem certeza que deseja excluir este plano? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('treatment_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;

      toast.success("Plano excluído com sucesso!");
      refetch();
    } catch (error) {
      console.error("Erro ao excluir plano:", error);
      toast.error("Erro ao excluir plano. Tente novamente.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-lg text-muted-foreground">Carregando planos...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Music2 className="h-8 w-8 text-primary" />
            Planos de Intervenção Salvos
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie todos os seus planos de intervenção musicoterapêutica
          </p>
        </div>
        <Button onClick={() => navigate('/intervention')} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Criar Novo Plano
        </Button>
      </div>

      {/* Stats */}
      <InterventionPlanStats stats={stats} />

      {plans.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <FileX className="h-24 w-24 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhum plano criado ainda</h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            Comece criando seu primeiro plano de intervenção musicoterapêutica para seus pacientes.
          </p>
          <Button onClick={() => navigate('/intervention')} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Criar Primeiro Plano
          </Button>
        </div>
      ) : (
        <>
          {/* Filters */}
          <InterventionPlanFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          {/* Plans Grid */}
          {filteredPlans.length === 0 ? (
            <div className="text-center py-16">
              <FileX className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum plano encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Tente ajustar os filtros para encontrar o que procura.
              </p>
              <Button variant="outline" onClick={handleClearFilters}>
                Limpar Filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map((plan) => (
                <InterventionPlanCard
                  key={plan.id}
                  plan={plan}
                  onView={handleViewPlan}
                  onDownload={handleDownloadPDF}
                  onDelete={handleDeletePlan}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* View Dialog */}
      <InterventionPlanDialog
        plan={selectedPlan}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onDownload={handleDownloadPDF}
      />
    </div>
  );
}
