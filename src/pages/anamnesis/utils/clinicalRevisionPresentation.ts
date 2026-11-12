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
// Terminologia clínica em português usada tanto no histórico quanto no PDF.
Object.assign(labels, {
  diagnosis_date: "Data do diagnóstico",
  support_level: "Nível de suporte informado",
  autism_spectrum: "TEA — Transtorno do Espectro Autista",
  adhd: "TDAH",
  odd_disorder: "TOD — Transtorno Opositor Desafiador",
  down_syndrome: "Síndrome de Down",
  intellectual_disability: "Deficiência intelectual",
  cerebral_palsy: "Paralisia cerebral",
  epilepsy: "Epilepsia",
  chronic_encephalopathy: "Encefalopatia crônica",
  williams_syndrome: "Síndrome de Williams",
  fragile_x_syndrome: "Síndrome do X Frágil",
  rett_syndrome: "Síndrome de Rett",
  angelman_syndrome: "Síndrome de Angelman",
  alzheimer: "Doença de Alzheimer",
  parkinson: "Doença de Parkinson",
  depression: "Depressão",
  bipolar_disorder: "Transtorno bipolar",
  anxiety_disorders: "Transtornos de ansiedade",
  other_diagnoses: "Outros diagnósticos informados",
  speech_therapy: "Fonoaudiologia",
  psychological_support: "Psicologia",
  psychopedagogical: "Psicopedagogia",
  occupational_therapy: "Terapia ocupacional",
  physiotherapy: "Fisioterapia",
  equine_therapy: "Equoterapia",
  aba_therapy: "Terapia ABA",
  sensory_integration: "Integração sensorial",
  psychomotricity: "Psicomotricidade",
  nutrition: "Nutrição",
  music_therapy: "Musicoterapia",
  musical_education: "Educação musical formal",
  instrumental_practice: "Prática instrumental",
  body_musical_expression: "Expressão corporal musical",
  vocal_expression: "Expressão vocal",
  choral_activities: "Canto e coral",
  no_musical_experience: "Ausência de experiência musical formal",
  music_therapy_experience: "Experiência com musicoterapia",
  instruments_played: "Instrumentos tocados",
  music_practice_time: "Tempo de prática musical",
  pregnancy_sound_experiences: "Experiências sonoras na gestação",
  mother_movements_songs: "Canções e movimentos maternos",
  childhood_sound_environment: "Ambiente sonoro da infância",
  parents_sound_reactions: "Reações sonoras dos responsáveis",
  typical_house_sounds: "Sons habituais do ambiente doméstico",
  night_body_sounds: "Sons corporais e noturnos",
  family_musical_history: "Histórico musical familiar",
  active_musical_listening: "Escuta musical ativa",
  body_expression: "Expressão corporal",
  sound_responsiveness: "Responsividade sonora",
  spontaneous_vocal: "Vocalização espontânea",
  instrumental_exploration: "Exploração instrumental",
  adverse_sound_reactivity: "Reatividade adversa a sons",
  auditory_hypersensitivity: "Hipersensibilidade auditiva",
  positive_musical_response: "Resposta musical positiva",
  nominal_call_response: "Resposta ao chamado pelo nome",
  active_sound_search: "Busca ativa de sons",
  specific_sound_aversion: "Aversões sonoras específicas",
  sound_source_location: "Localização de fontes sonoras",
  cervical_control: "Controle cervical",
  crawling_pattern: "Padrão de engatinhar",
  fine_motor_dev: "Desenvolvimento motor fino",
  independent_sitting: "Sentar independentemente",
  autonomous_walking: "Marcha autônoma",
  broad_motor_dev: "Desenvolvimento motor amplo",
  babbling: "Balbucio",
  simple_phrases: "Frases simples",
  echolalia: "Ecolalia",
  first_words: "Primeiras palavras",
  nonverbal_communication: "Comunicação não verbal",
  verbal_language_absence: "Ausência de linguagem verbal",
  visual_contact: "Contato visual",
  shared_play: "Brincadeira compartilhada",
  peer_interaction: "Interação com pares",
  social_isolation: "Isolamento social",
  stereotyped_behavior: "Comportamentos estereotipados",
  restricted_interests: "Interesses restritos",
  irritability: "Irritabilidade",
  heteroaggressive: "Heteroagressividade",
  emotional_ability: "Regulação emocional preservada",
  anxiety: "Ansiedade",
  frequent_crying: "Choro frequente",
  low_frustration_tolerance: "Baixa tolerância à frustração",
  calming_strategies: "Estratégias para acalmar",
  communication: "Comunicação",
  comprehension: "Compreensão",
  musical_interaction: "Interação musical",
  musical_strengths: "Potencialidades musicais",
  sensory_triggers: "Gatilhos sensoriais",
  emotional_regulation: "Regulação emocional",
  daily_participation: "Participação na rotina",
  safety: "Segurança",
  family_goals: "Objetivos da família",
});
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
