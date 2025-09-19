import { useState, useCallback, useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { MusicotherapyTreatmentPlan, defaultTreatmentPlan } from '@/types/musicotherapy-plan';
import { useProfessionalData } from './useProfessionalData';

export function useMusicotherapyTreatmentPlan(planId?: string) {
  const [planData, setPlanData] = useState<Partial<MusicotherapyTreatmentPlan>>(defaultTreatmentPlan);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const initialDataRef = useRef<Partial<MusicotherapyTreatmentPlan>>();
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: professionalData } = useProfessionalData();

  // Helper function to parse database JSON fields
  const parseDbPlan = (dbData: any): MusicotherapyTreatmentPlan => {
    return {
      ...dbData,
      general_objectives: dbData.general_objectives ? 
        (Array.isArray(dbData.general_objectives) ? dbData.general_objectives : JSON.parse(dbData.general_objectives)) : [],
      specific_objectives: dbData.specific_objectives ? 
        (Array.isArray(dbData.specific_objectives) ? dbData.specific_objectives : JSON.parse(dbData.specific_objectives)) : [],
      musical_instruments: dbData.musical_instruments ? 
        (Array.isArray(dbData.musical_instruments) ? dbData.musical_instruments : JSON.parse(dbData.musical_instruments)) : [],
      technological_resources: dbData.technological_resources ? 
        (Array.isArray(dbData.technological_resources) ? dbData.technological_resources : JSON.parse(dbData.technological_resources)) : [],
      voice_body_resources: dbData.voice_body_resources ? 
        (Array.isArray(dbData.voice_body_resources) ? dbData.voice_body_resources : JSON.parse(dbData.voice_body_resources)) : [],
      complementary_materials: dbData.complementary_materials ? 
        (Array.isArray(dbData.complementary_materials) ? dbData.complementary_materials : JSON.parse(dbData.complementary_materials)) : [],
      evaluation_criteria_list: dbData.evaluation_criteria_list ? 
        (Array.isArray(dbData.evaluation_criteria_list) ? dbData.evaluation_criteria_list : JSON.parse(dbData.evaluation_criteria_list)) : [],
    } as MusicotherapyTreatmentPlan;
  };

  // Fetch existing plan if planId is provided
  const { data: existingPlan, isLoading } = useQuery({
    queryKey: ['treatment-plan', planId],
    queryFn: async () => {
      if (!planId) return null;
      
      const { data, error } = await supabase
        .from('treatment_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (error) throw error;
      
      return data ? parseDbPlan(data) : null;
    },
    enabled: !!planId,
  });

  // Track changes and setup auto-save
  useEffect(() => {
    if (existingPlan && !initialDataRef.current) {
      initialDataRef.current = existingPlan;
      setPlanData(existingPlan);
    }
  }, [existingPlan]);

  // Check for unsaved changes
  useEffect(() => {
    if (initialDataRef.current) {
      const hasChanges = JSON.stringify(planData) !== JSON.stringify(initialDataRef.current);
      setHasUnsavedChanges(hasChanges);
    } else if (Object.keys(planData).some(key => planData[key as keyof MusicotherapyTreatmentPlan] !== defaultTreatmentPlan[key as keyof MusicotherapyTreatmentPlan])) {
      setHasUnsavedChanges(true);
    }
  }, [planData]);

  // Auto-save functionality
  const triggerAutoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      if (hasUnsavedChanges && validateRequiredFields()) {
        setIsAutoSaving(true);
        savePlanMutation.mutate(planData, {
          onSuccess: () => {
            setIsAutoSaving(false);
            setLastSaved(new Date());
            setHasUnsavedChanges(false);
            initialDataRef.current = { ...planData };
          },
          onError: () => {
            setIsAutoSaving(false);
          }
        });
      }
    }, 30000); // Auto-save after 30 seconds of inactivity
  }, [hasUnsavedChanges, planData]);

  // Validation function
  const validateRequiredFields = useCallback(() => {
    const requiredFields = ['patient_full_name', 'clinical_diagnosis'];
    return requiredFields.every(field => 
      planData[field as keyof MusicotherapyTreatmentPlan] && 
      String(planData[field as keyof MusicotherapyTreatmentPlan]).trim() !== ''
    );
  }, [planData]);

  // Get validation errors
  const getValidationErrors = useCallback(() => {
    const errors: string[] = [];
    if (!planData.patient_full_name?.trim()) errors.push('Nome completo do paciente');
    if (!planData.clinical_diagnosis?.trim()) errors.push('Diagnóstico clínico');
    return errors;
  }, [planData]);

  // Update plan data with auto-save trigger
  const updatePlanData = useCallback((updates: Partial<MusicotherapyTreatmentPlan>) => {
    setPlanData(prev => ({ ...prev, ...updates }));
    triggerAutoSave();
  }, [triggerAutoSave]);

  // Cleanup auto-save timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Save plan mutation
  const savePlanMutation = useMutation({
    mutationFn: async (data: Partial<MusicotherapyTreatmentPlan>) => {
      if (!professionalData?.id) {
        throw new Error('Professional data not found');
      }

      const planPayload = {
        ...data,
        professional_id: professionalData.id,
        // Convert arrays to JSONB format
        general_objectives: JSON.stringify(data.general_objectives || []),
        specific_objectives: JSON.stringify(data.specific_objectives || []),
        musical_instruments: JSON.stringify(data.musical_instruments || []),
        technological_resources: JSON.stringify(data.technological_resources || []),
        voice_body_resources: JSON.stringify(data.voice_body_resources || []),
        complementary_materials: JSON.stringify(data.complementary_materials || []),
        evaluation_criteria_list: JSON.stringify(data.evaluation_criteria_list || []),
      };

      if (planId) {
        // Update existing plan
        const { data: result, error } = await supabase
          .from('treatment_plans')
          .update(planPayload)
          .eq('id', planId)
          .select()
          .single();

        if (error) throw error;
        return result;
      } else {
        // Create new plan
        const { data: result, error } = await supabase
          .from('treatment_plans')
          .insert(planPayload)
          .select()
          .single();

        if (error) throw error;
        return result;
      }
    },
    onSuccess: (data) => {
      toast({
        title: planId ? 'Plano atualizado!' : 'Plano salvo!',
        description: 'O plano de tratamento foi salvo com sucesso.',
      });
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      initialDataRef.current = { ...planData };
      queryClient.invalidateQueries({ queryKey: ['treatment-plan'] });
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] });
    },
    onError: (error) => {
      console.error('Error saving treatment plan:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar o plano de tratamento.',
      });
    },
  });

  // Delete plan mutation
  const deletePlanMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('treatment_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Plano excluído!',
        description: 'O plano de tratamento foi excluído com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] });
    },
    onError: (error) => {
      console.error('Error deleting treatment plan:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir o plano de tratamento.',
      });
    },
  });

  return {
    planData: existingPlan ? { ...defaultTreatmentPlan, ...existingPlan } : planData,
    updatePlanData,
    savePlan: (data?: Partial<MusicotherapyTreatmentPlan>) => {
      const dataToSave = data || planData;
      const errors = data ? [] : getValidationErrors();
      
      if (errors.length > 0) {
        toast({
          variant: 'destructive',
          title: 'Campos obrigatórios não preenchidos',
          description: `Preencha os seguintes campos: ${errors.join(', ')}`,
        });
        return;
      }
      
      savePlanMutation.mutate(dataToSave);
    },
    deletePlan: deletePlanMutation.mutate,
    isSaving: savePlanMutation.isPending,
    isDeleting: deletePlanMutation.isPending,
    isLoading,
    hasUnsavedChanges,
    isAutoSaving,
    lastSaved,
    validateRequiredFields,
    getValidationErrors,
  };
}