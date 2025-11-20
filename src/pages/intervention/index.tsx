import { useState } from "react";
import { Music2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useInterventionForm } from "@/hooks/useInterventionForm";
import { useActivityGeneration } from "@/hooks/useActivityGeneration";
import { usePDFExport } from "@/hooks/usePDFExport";
import { SavedPlansSection } from "@/components/intervention/SavedPlansSection";
import { PatientSelection } from "@/components/intervention/PatientSelection";
import { DemandSelection } from "@/components/intervention/DemandSelection";
import { GeneratedActivitiesList } from "@/components/intervention/GeneratedActivitiesList";
import { GenerationProgress } from "@/components/intervention/GenerationProgress";

export default function InterventionForm() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const formState = useInterventionForm();
  const activityState = useActivityGeneration();
  const pdfState = usePDFExport();

  const handleGenerateActivities = async () => {
    await activityState.generateActivities(formState.selectedPatient, formState.selectedDemands, formState.selectedSubDemands, formState.patients);
  };

  const handleSavePlan = async () => {
    if (activityState.suggestedActivities.length === 0) {
      toast({ variant: "destructive", title: "Nenhuma atividade", description: "Gere atividades antes de salvar." });
      return;
    }
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      const selectedPatient = formState.patients.find(p => p.id === formState.selectedPatient);
      if (!selectedPatient) throw new Error("Paciente não encontrado");
      let professionalId = user.id;
      const { data: professional } = await supabase.from('professionals').select('id').eq('user_id', user.id).maybeSingle();
      if (!professional) {
        const { data: newProfessional, error: createError } = await supabase.from('professionals').insert([{ user_id: user.id, name: formState.userName, email: formState.userEmail }]).select().single();
        if (createError) throw createError;
        professionalId = newProfessional.id;
      } else {
        professionalId = professional.id;
      }
      const { error } = await supabase.from('treatment_plans').insert([{ professional_id: professionalId, patient_id: formState.selectedPatient, patient_full_name: selectedPatient.name, complementary_materials: { activities: activityState.suggestedActivities } }]);
      if (error) throw error;
      toast({ title: "Plano salvo com sucesso!", description: "O plano de intervenção foi salvo." });
      activityState.clearActivities();
      formState.resetForm();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro ao salvar", description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    const selectedPatient = formState.patients.find(p => p.id === formState.selectedPatient);
    if (!selectedPatient) return;
    await pdfState.exportPDF(activityState.suggestedActivities, selectedPatient.name, formState.userName, formState.userEmail);
  };

  return (
    <div className="w-full px-0 py-2 sm:py-4 space-y-3 sm:space-y-4">
      <SavedPlansSection />
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Music2 className="h-6 w-6 text-primary" />
            <CardTitle>Criar Novo Plano de Intervenção</CardTitle>
          </div>
          <CardDescription>Selecione um paciente e as demandas terapêuticas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <PatientSelection patients={formState.patients} selectedPatient={formState.selectedPatient} isLoading={formState.isLoadingPatients} onPatientChange={formState.setSelectedPatient} />
          {formState.selectedPatient && (
            <>
              <DemandSelection selectedDemands={formState.selectedDemands} selectedSubDemands={formState.selectedSubDemands} expandedCategories={formState.expandedCategories} onDemandToggle={formState.handleDemandToggle} onSubDemandToggle={formState.handleSubDemandToggle} onCategoryToggle={formState.toggleCategory} />
              <div className="flex justify-center pt-4">
                <Button size="lg" onClick={handleGenerateActivities} disabled={activityState.isGenerating} className="w-full sm:w-auto">
                  <Sparkles className="mr-2 h-5 w-5" />
                  {activityState.isGenerating ? "Gerando..." : "Gerar Atividades com IA"}
                </Button>
              </div>
            </>
          )}
          {activityState.isGenerating && <GenerationProgress message={activityState.generationProgress} />}
        </CardContent>
      </Card>
      <GeneratedActivitiesList activities={activityState.suggestedActivities} expandedActivities={activityState.expandedActivities} onToggleActivity={activityState.toggleActivity} onSave={handleSavePlan} onDownload={handleDownloadPDF} isSaving={isSaving} isExporting={pdfState.isExporting} />
    </div>
  );
}
