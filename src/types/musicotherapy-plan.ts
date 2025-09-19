export interface MusicotherapyTreatmentPlan {
  // Database fields
  id?: string;
  patient_id?: string;
  professional_id?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;

  // 1. Patient Identification
  patient_full_name: string;
  patient_birth_date?: string;
  patient_age: string;
  clinical_diagnosis: string;
  responsible_person: string;
  plan_start_date: string;

  // 2. Initial Assessment
  clinical_family_history: string;
  physical_cognitive_conditions: string;
  interaction_communication_level: string;
  musical_interests: string;
  observed_behaviors: string;

  // 3. General Objectives
  general_objectives: string[];

  // 4. Specific Objectives  
  specific_objectives: string[];

  // 5. Musicotherapy Resources
  musical_instruments: string[];
  technological_resources: string[];
  voice_body_resources: string[];
  complementary_materials: string[];

  // 6. Strategies and Techniques
  musical_improvisation: string;
  musical_recreation: string;
  musical_composition: string;
  receptive_listening: string;
  rhythmic_dynamics: string;

  // 7. Frequency and Duration
  weekly_sessions: number;
  session_duration_minutes: number;
  estimated_period_months: number;

  // 8. Evaluation Criteria
  evaluation_criteria_list: string[];

  // 9. Therapeutic Plan in Action
  session_structure: string;
  activity_sequence: string;
  flexibility_adjustments: string;

  // 10. Re-evaluation and Evolution
  reevaluation_frequency: string;
  evolution_recording: string;
  necessary_adjustments: string;
}

export const defaultTreatmentPlan: Partial<MusicotherapyTreatmentPlan> = {
  patient_full_name: "",
  patient_age: "",
  clinical_diagnosis: "",
  responsible_person: "",
  plan_start_date: new Date().toISOString().split('T')[0],
  clinical_family_history: "",
  physical_cognitive_conditions: "",
  interaction_communication_level: "",
  musical_interests: "",
  observed_behaviors: "",
  general_objectives: [],
  specific_objectives: [],
  musical_instruments: [],
  technological_resources: [],
  voice_body_resources: [],
  complementary_materials: [],
  musical_improvisation: "",
  musical_recreation: "",
  musical_composition: "",
  receptive_listening: "",
  rhythmic_dynamics: "",
  weekly_sessions: 1,
  session_duration_minutes: 45,
  estimated_period_months: 3,
  evaluation_criteria_list: [],
  session_structure: "",
  activity_sequence: "",
  flexibility_adjustments: "",
  reevaluation_frequency: "mensal",
  evolution_recording: "",
  necessary_adjustments: "",
};