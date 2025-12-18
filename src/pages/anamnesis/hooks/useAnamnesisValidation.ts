import { useMemo, useCallback } from "react";

interface ValidationError {
  field: string;
  label: string;
  section: number;
  sectionTitle: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  fieldErrors: Record<string, string>;
  completionPercentage: number;
}

// Definição dos campos obrigatórios por seção
const requiredFields: Record<number, { field: string; label: string; sectionTitle: string }[]> = {
  1: [
    { field: "main_clinical_demand", label: "Demanda Clínica Principal", sectionTitle: "Identificação e Encaminhamento" }
  ],
  5: [
    { field: "patient_musical_history", label: "História Musical do Paciente", sectionTitle: "Perfil Musical do Paciente" }
  ],
  6: [
    { field: "family_musical_history", label: "História Musical Familiar", sectionTitle: "Identidade Sonora (ISO)" }
  ],
  12: [
    { field: "therapeutic_goals", label: "Objetivos Terapêuticos", sectionTitle: "Objetivos Terapêuticos" }
  ]
};

// Todos os campos para cálculo de progresso (não obrigatórios, mas contam para completude)
const allTrackableFields = [
  "referral_professional", "main_clinical_demand", "diagnosis_details", "cid_code",
  "clinical_details", "current_medication", "medication_schedule", "medication_effects",
  "therapy_frequency", "therapy_observations", "instruments_played", "music_practice_time",
  "patient_musical_history", "pregnancy_sound_experiences", "mother_movements_songs",
  "childhood_sound_environment", "parents_sound_reactions", "typical_house_sounds",
  "night_body_sounds", "family_musical_history", "musical_behavior_description",
  "discomfort_sounds", "calming_sounds", "regulation_strategies", "family_support_network",
  "school_enrollment", "school_adaptation", "extracurricular_activities",
  "therapeutic_goals", "treatment_approach"
];

export function useAnamnesisValidation(formData: Record<string, any>) {
  // Validar todos os campos obrigatórios
  const validate = useCallback((): ValidationResult => {
    const errors: ValidationError[] = [];
    const fieldErrors: Record<string, string> = {};

    Object.entries(requiredFields).forEach(([sectionNum, fields]) => {
      fields.forEach(({ field, label, sectionTitle }) => {
        const value = formData[field];
        const isEmpty = !value || (typeof value === "string" && value.trim() === "");
        
        if (isEmpty) {
          errors.push({
            field,
            label,
            section: parseInt(sectionNum),
            sectionTitle
          });
          fieldErrors[field] = `${label} é obrigatório`;
        }
      });
    });

    // Calcular porcentagem de preenchimento
    let filledCount = 0;
    allTrackableFields.forEach((field) => {
      const value = formData[field];
      if (value && (typeof value !== "string" || value.trim() !== "")) {
        filledCount++;
      }
    });

    // Também contar checkboxes marcados
    const checkboxFields = Object.entries(formData).filter(([key, value]) => 
      typeof value === "boolean" && value === true
    );
    filledCount += checkboxFields.length;

    const totalFields = allTrackableFields.length + 50; // Aproximadamente 50 checkboxes
    const completionPercentage = Math.min(100, Math.round((filledCount / totalFields) * 100));

    return {
      isValid: errors.length === 0,
      errors,
      fieldErrors,
      completionPercentage
    };
  }, [formData]);

  // Validar um campo específico
  const validateField = useCallback((fieldName: string): string | null => {
    for (const [sectionNum, fields] of Object.entries(requiredFields)) {
      const fieldConfig = fields.find(f => f.field === fieldName);
      if (fieldConfig) {
        const value = formData[fieldName];
        const isEmpty = !value || (typeof value === "string" && value.trim() === "");
        if (isEmpty) {
          return `${fieldConfig.label} é obrigatório`;
        }
      }
    }
    return null;
  }, [formData]);

  // Verificar se uma seção tem erros
  const getSectionErrors = useCallback((sectionNumber: number): ValidationError[] => {
    const result = validate();
    return result.errors.filter(e => e.section === sectionNumber);
  }, [validate]);

  // Verificar se um campo específico é obrigatório
  const isFieldRequired = useCallback((fieldName: string): boolean => {
    for (const fields of Object.values(requiredFields)) {
      if (fields.some(f => f.field === fieldName)) {
        return true;
      }
    }
    return false;
  }, []);

  // Resultado memoizado
  const validationResult = useMemo(() => validate(), [validate]);

  return {
    ...validationResult,
    validate,
    validateField,
    getSectionErrors,
    isFieldRequired,
    requiredFields
  };
}
