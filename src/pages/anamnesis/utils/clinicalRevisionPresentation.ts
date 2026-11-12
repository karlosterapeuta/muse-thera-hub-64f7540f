/** Human-readable clinical revision history, without exposing database internals. */
const labels: Record<string, string> = {
  main_clinical_demand: "Demanda clínica principal",
  diagnosis_details: "Diagnósticos informados",
  cid_code: "CID informado",
  clinical_details: "Histórico clínico",
  current_medication: "Medicações em uso",
  medication_schedule: "Horários e dosagens",
  medication_effects: "Efeitos das medicações",
  patient_musical_history: "História musical",
  musical_behavior_description: "Comportamento musical",
  discomfort_sounds: "Sons desconfortáveis",
  calming_sounds: "Sons calmantes",
  therapeutic_goals: "Objetivos terapêuticos",
  treatment_approach: "Abordagem terapêutica",
  tea_functional_profile: "Perfil funcional TEA",
  review_status: "Situação da anamnese",
  referral_professional: "Profissional encaminhador",
  legal_guardian: "Responsável legal",
  mother_name: "Nome da mãe",
  father_name: "Nome do pai",
  family_relationship: "Parentesco",
  school_enrollment: "Escolarização",
  school_adaptation: "Adaptação escolar",
  extracurricular_activities: "Atividades extracurriculares",
  family_support_network: "Rede de apoio",
  regulation_strategies: "Estratégias de regulação",
  therapy_frequency: "Frequência dos atendimentos",
  therapy_observations: "Observações terapêuticas",
};
const excluded = new Set([
  "id", "patient_id", "professional_id", "created_at", "updated_at",
  "finalized_by", "finalized_at", "user_id"
]);
const meaningful = (value: unknown): boolean =>
  value === true ||
  (typeof value === "string" && value.trim().length > 0) ||
  (typeof value === "number" && Number.isFinite(value)) ||
  (Array.isArray(value) && value.some(meaningful)) ||
  (Boolean(value) && typeof value === "object" &&
    Object.values(value as Record<string, unknown>).some(meaningful));
export const clinicalFieldLabel = (field: string) =>
  labels[field] ?? field.replace(/_/g, " ").replace(/^./, initial => initial.toUpperCase());

export const formatClinicalRevisionValue = (value: unknown): string => {
  if (value == null || value === "") return "Não informado";
  if (typeof value === "boolean") return value ? "Marcado" : "Não marcado";
  if (Array.isArray(value)) return value.map(formatClinicalRevisionValue).join("; ");
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([, part]) => meaningful(part))
      .map(([key, part]) => `${clinicalFieldLabel(key)}: ${formatClinicalRevisionValue(part)}`).join("\n") || "Não informado";
  }
  return String(value);
};

export const changedClinicalFields = (
  oldSnapshot: Record<string, unknown> | null,
  newSnapshot: Record<string, unknown>,
): string[] => {
  const keys = new Set([...Object.keys(oldSnapshot || {}), ...Object.keys(newSnapshot || {})]);
  return Array.from(keys).filter(key => {
    if (excluded.has(key)) return false;
    const oldValue = oldSnapshot?.[key];
    const newValue = newSnapshot[key];
    if (oldSnapshot == null && !meaningful(newValue)) return false;
    return JSON.stringify(oldValue ?? null) !== JSON.stringify(newValue ?? null);
  }).sort((a,b) => clinicalFieldLabel(a).localeCompare(clinicalFieldLabel(b),"pt-BR"));
};
