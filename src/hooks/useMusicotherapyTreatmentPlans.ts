import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useProfessionalData } from './useProfessionalData';

export interface MusicotherapyTreatmentPlanSummary {
  id: string;
  patient_full_name: string;
  clinical_diagnosis: string;
  status: string;
  created_at: string;
  updated_at: string;
  patient_age: string;
  responsible_person: string;
  plan_start_date: string;
}

export function useMusicotherapyTreatmentPlans() {
  const { data: professionalData } = useProfessionalData();

  return useQuery({
    queryKey: ['musicotherapy-treatment-plans', professionalData?.id],
    queryFn: async () => {
      if (!professionalData?.id) {
        throw new Error('Professional ID not found');
      }

      const { data, error } = await supabase
        .from('treatment_plans')
        .select(`
          id,
          patient_full_name,
          clinical_diagnosis,
          status,
          created_at,
          updated_at,
          patient_age,
          responsible_person,
          plan_start_date
        `)
        .eq('professional_id', professionalData.id)
        .not('patient_full_name', 'is', null)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching treatment plans:', error);
        throw error;
      }

      return data as MusicotherapyTreatmentPlanSummary[];
    },
    enabled: !!professionalData?.id,
  });
}