import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useProfessionalData } from './useProfessionalData';

export interface InterventionPlanActivity {
  name: string;
  generalObjective: string;
  specificObjective: string;
  materials: string[];
  estimatedTime: string;
  evaluationCriteria: string[];
  complexity: string;
  associatedDemand: string;
}

export interface InterventionPlan {
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  patient_name: string;
  patient_birth_date: string | null;
  complementary_materials: {
    activities?: InterventionPlanActivity[];
  };
}

export interface InterventionPlanStats {
  total: number;
  active: number;
  completed: number;
  draft: number;
  totalActivities: number;
  uniquePatients: number;
}

export function useInterventionPlans() {
  const { data: professionalData } = useProfessionalData();

  const { data: plans = [], isLoading, error, refetch } = useQuery({
    queryKey: ['intervention-plans', professionalData?.id],
    queryFn: async () => {
      if (!professionalData?.id) {
        throw new Error('Professional ID not found');
      }

      const { data, error } = await supabase
        .from('treatment_plans')
        .select(`
          id,
          created_at,
          updated_at,
          status,
          patient_full_name,
          patient_birth_date,
          complementary_materials
        `)
        .eq('professional_id', professionalData.id)
        .not('complementary_materials', 'is', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching intervention plans:', error);
        throw error;
      }

      return (data || []).map(plan => ({
        id: plan.id,
        created_at: plan.created_at,
        updated_at: plan.updated_at,
        status: plan.status || 'active',
        patient_name: plan.patient_full_name || 'Paciente não identificado',
        patient_birth_date: plan.patient_birth_date,
        complementary_materials: plan.complementary_materials as any || { activities: [] },
      })) as InterventionPlan[];
    },
    enabled: !!professionalData?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Calculate statistics
  const stats: InterventionPlanStats = {
    total: plans.length,
    active: plans.filter(p => p.status === 'active').length,
    completed: plans.filter(p => p.status === 'completed').length,
    draft: plans.filter(p => p.status === 'draft').length,
    totalActivities: plans.reduce((sum, plan) => 
      sum + (plan.complementary_materials?.activities?.length || 0), 0
    ),
    uniquePatients: new Set(plans.map(p => p.patient_name)).size,
  };

  return {
    plans,
    stats,
    isLoading,
    error,
    refetch,
  };
}
