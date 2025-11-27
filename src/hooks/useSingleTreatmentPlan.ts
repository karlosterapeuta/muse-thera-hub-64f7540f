import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MusicotherapyTreatmentPlan } from '@/types/musicotherapy-plan';

export function useSingleTreatmentPlan(planId: string | null) {
  return useQuery({
    queryKey: ['treatment-plan', planId],
    queryFn: async () => {
      if (!planId) {
        throw new Error('Plan ID is required');
      }

      const { data, error } = await supabase
        .from('treatment_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (error) {
        console.error('Error fetching treatment plan:', error);
        throw error;
      }

      // Parse JSON fields
      const parseJsonField = (field: any): string[] => {
        if (!field) return [];
        if (Array.isArray(field)) return field;
        if (typeof field === 'string') {
          try {
            const parsed = JSON.parse(field);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        }
        return [];
      };

      return {
        ...data,
        general_objectives: parseJsonField(data.general_objectives),
        specific_objectives: parseJsonField(data.specific_objectives),
        musical_instruments: parseJsonField(data.musical_instruments),
        technological_resources: parseJsonField(data.technological_resources),
        voice_body_resources: parseJsonField(data.voice_body_resources),
        complementary_materials: parseJsonField(data.complementary_materials),
        evaluation_criteria_list: parseJsonField(data.evaluation_criteria_list),
      } as MusicotherapyTreatmentPlan;
    },
    enabled: !!planId,
    staleTime: 5 * 60 * 1000,
  });
}
