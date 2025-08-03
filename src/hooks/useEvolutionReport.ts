
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { evolutionTemplate } from "@/data/evolutionTemplate";

export type EvolutionReportData = typeof evolutionTemplate & {
  patient_name?: string;
  patient_id?: string;
  date?: string;
};

export const useEvolutionReport = () => {
  const [formData, setFormData] = useState<EvolutionReportData>(evolutionTemplate);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field: keyof EvolutionReportData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const selectOption = (field: keyof EvolutionReportData, option: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: option
    }));
  };

  const clearField = (field: keyof EvolutionReportData) => {
    setFormData(prev => ({
      ...prev,
      [field]: ""
    }));
  };

  const saveReport = async () => {
    if (!selectedPatient) {
      toast.error("Por favor, selecione um paciente");
      return false;
    }

    // Validação básica
    const requiredFields = ['arrival_state', 'resources_used', 'session_exit'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof EvolutionReportData]);
    
    if (missingFields.length > 0) {
      toast.error("Por favor, preencha os campos obrigatórios");
      return false;
    }

    setIsSaving(true);
    try {
      // Obter o professional_id
      const { data: professional, error: profError } = await supabase
        .from('professionals')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profError) throw profError;

      const reportContent = {
        ...formData,
        patient_name: selectedPatient.name,
        patient_id: selectedPatient.id,
        date: new Date().toISOString().split('T')[0],
        report_type: 'evolution_musicoterapia'
      };

      const { error } = await supabase.from('reports').insert({
        patient_id: selectedPatient.id,
        professional_id: professional.id,
        type: 'evolution_musicoterapia' as any,
        content: reportContent
      });

      if (error) throw error;

      toast.success("Relatório salvo com sucesso!");
      return true;
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
      toast.error("Erro ao salvar relatório");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData(evolutionTemplate);
    setSelectedPatient(null);
  };

  return {
    formData,
    selectedPatient,
    setSelectedPatient,
    isLoading,
    isSaving,
    updateField,
    selectOption,
    clearField,
    saveReport,
    resetForm
  };
};
