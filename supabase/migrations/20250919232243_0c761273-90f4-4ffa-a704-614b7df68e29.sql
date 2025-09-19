-- Add comprehensive fields for the 10-section musicotherapy treatment plan model

-- 1. Patient Identification fields
ALTER TABLE treatment_plans ADD COLUMN patient_full_name text;
ALTER TABLE treatment_plans ADD COLUMN patient_birth_date date;
ALTER TABLE treatment_plans ADD COLUMN patient_age text;
ALTER TABLE treatment_plans ADD COLUMN clinical_diagnosis text;
ALTER TABLE treatment_plans ADD COLUMN responsible_person text;
ALTER TABLE treatment_plans ADD COLUMN plan_start_date date;

-- 2. Initial Assessment fields  
ALTER TABLE treatment_plans ADD COLUMN clinical_family_history text;
ALTER TABLE treatment_plans ADD COLUMN physical_cognitive_conditions text;
ALTER TABLE treatment_plans ADD COLUMN interaction_communication_level text;
ALTER TABLE treatment_plans ADD COLUMN musical_interests text;
ALTER TABLE treatment_plans ADD COLUMN observed_behaviors text;

-- 3. General Objectives (jsonb for flexibility)
ALTER TABLE treatment_plans ADD COLUMN general_objectives jsonb;

-- 4. Specific Objectives (jsonb array)
ALTER TABLE treatment_plans ADD COLUMN specific_objectives jsonb;

-- 5. Musicotherapy Resources (jsonb for categories)
ALTER TABLE treatment_plans ADD COLUMN musical_instruments jsonb;
ALTER TABLE treatment_plans ADD COLUMN technological_resources jsonb;
ALTER TABLE treatment_plans ADD COLUMN voice_body_resources jsonb;
ALTER TABLE treatment_plans ADD COLUMN complementary_materials jsonb;

-- 6. Strategies and Techniques (jsonb for different types)
ALTER TABLE treatment_plans ADD COLUMN musical_improvisation text;
ALTER TABLE treatment_plans ADD COLUMN musical_recreation text;
ALTER TABLE treatment_plans ADD COLUMN musical_composition text;
ALTER TABLE treatment_plans ADD COLUMN receptive_listening text;
ALTER TABLE treatment_plans ADD COLUMN rhythmic_dynamics text;

-- 7. Frequency and Duration fields
ALTER TABLE treatment_plans ADD COLUMN weekly_sessions integer;
ALTER TABLE treatment_plans ADD COLUMN session_duration_minutes integer;
ALTER TABLE treatment_plans ADD COLUMN estimated_period_months integer;

-- 8. Evaluation Criteria (jsonb array)
ALTER TABLE treatment_plans ADD COLUMN evaluation_criteria_list jsonb;

-- 9. Therapeutic Plan in Action
ALTER TABLE treatment_plans ADD COLUMN session_structure text;
ALTER TABLE treatment_plans ADD COLUMN activity_sequence text;
ALTER TABLE treatment_plans ADD COLUMN flexibility_adjustments text;

-- 10. Re-evaluation and Evolution
ALTER TABLE treatment_plans ADD COLUMN reevaluation_frequency text;
ALTER TABLE treatment_plans ADD COLUMN evolution_recording text;
ALTER TABLE treatment_plans ADD COLUMN necessary_adjustments text;

-- Add indexes for better performance
CREATE INDEX idx_treatment_plans_patient_professional ON treatment_plans(patient_id, professional_id);
CREATE INDEX idx_treatment_plans_start_date ON treatment_plans(plan_start_date);