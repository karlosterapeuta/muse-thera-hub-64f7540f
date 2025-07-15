
import { FormSection } from "./FormSection";
import { CheckboxSection } from "./CheckboxSection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function InitialEvaluationForm({ content, onChange }: FormProps) {
  // Ensuring the updateField function properly handles boolean values
  const updateField = (field: string, value: any) => {
    onChange({ ...content, [field]: value });
    console.log(`Field ${field} updated with value:`, value, "type:", typeof value);
  };

  // Função para garantir que os valores booleanos sejam tratados corretamente
  const getBooleanValue = (fieldName: string): boolean => {
    if (fieldName in content) {
      return Boolean(content[fieldName]);
    }
    return false;
  };

  return (
    <div className="space-y-8">
      <FormSection
        title="Dados Pessoais e Familiares"
        fields={[
          {
            key: "legal_guardian",
            label: "Responsável Legal",
            placeholder: "Nome do responsável legal",
            value: content.legal_guardian || "",
            onChange: (value) => updateField("legal_guardian", value),
          },
          {
            key: "family_relationship",
            label: "Parentesco",
            placeholder: "Grau de parentesco com o paciente",
            value: content.family_relationship || "",
            onChange: (value) => updateField("family_relationship", value),
          },
          {
            key: "referral_professional",
            label: "Profissional que Encaminhou",
            placeholder: "Nome do profissional",
            value: content.referral_professional || "",
            onChange: (value) => updateField("referral_professional", value),
          },
          {
            key: "main_clinical_demand",
            label: "Demanda Clínica Principal",
            placeholder: "Descreva a demanda clínica principal",
            value: content.main_clinical_demand || "",
            onChange: (value) => updateField("main_clinical_demand", value),
          },
        ]}
      />

      <CheckboxSection
        title="Histórico Musical"
        fields={[
          {
            id: "musical_education",
            label: "Educação Musical",
            checked: content.musical_education || false,
            onChange: (value) => updateField("musical_education", value),
          },
          {
            id: "instrumental_practice",
            label: "Prática Instrumental",
            checked: content.instrumental_practice || false,
            onChange: (value) => updateField("instrumental_practice", value),
          },
          {
            id: "body_musical_expression",
            label: "Expressão Corporal Musical",
            checked: content.body_musical_expression || false,
            onChange: (value) => updateField("body_musical_expression", value),
          },
          {
            id: "vocal_expression",
            label: "Expressão Vocal",
            checked: content.vocal_expression || false,
            onChange: (value) => updateField("vocal_expression", value),
          },
          {
            id: "choral_activities",
            label: "Atividades Corais",
            checked: content.choral_activities || false,
            onChange: (value) => updateField("choral_activities", value),
          },
          {
            id: "no_musical_experience",
            label: "Sem Experiência Musical",
            checked: content.no_musical_experience || false,
            onChange: (value) => updateField("no_musical_experience", value),
          },
        ]}
      />

      <FormSection
        title="História Sonora e Musical Detalhada"
        fields={[
          {
            key: "pregnancy_sound_experiences",
            label: "Vivências sonoras durante a gravidez",
            placeholder: "Descreva as vivências sonoras durante a gravidez",
            value: content.pregnancy_sound_experiences || "",
            onChange: (value) => updateField("pregnancy_sound_experiences", value),
          },
          {
            key: "mother_movements_songs",
            label: "Movimentos corporais e canções da mãe",
            placeholder: "Descreva os movimentos corporais e canções da mãe",
            value: content.mother_movements_songs || "",
            onChange: (value) => updateField("mother_movements_songs", value),
          },
          {
            key: "childhood_sound_environment",
            label: "Ambiente sonoro durante a infância",
            placeholder: "Descreva o ambiente sonoro durante a infância",
            value: content.childhood_sound_environment || "",
            onChange: (value) => updateField("childhood_sound_environment", value),
          },
          {
            key: "parents_sound_reactions",
            label: "Reações dos pais aos sons e aos ruídos",
            placeholder: "Descreva as reações dos pais aos sons e ruídos",
            value: content.parents_sound_reactions || "",
            onChange: (value) => updateField("parents_sound_reactions", value),
          },
          {
            key: "typical_house_sounds",
            label: "Os sons típicos da casa (bater de portas, gritos, prantos, ruídos de mastigar, tiques com sons, murmúrios, assobios, etc...)",
            placeholder: "Descreva os sons típicos da casa",
            value: content.typical_house_sounds || "",
            onChange: (value) => updateField("typical_house_sounds", value),
          },
          {
            key: "night_body_sounds",
            label: "Sons durante a noite e sons corporais",
            placeholder: "Descreva os sons durante a noite e sons corporais",
            value: content.night_body_sounds || "",
            onChange: (value) => updateField("night_body_sounds", value),
          },
          {
            key: "family_musical_history",
            label: "História Musical da família",
            placeholder: "Descreva a história musical da família",
            value: content.family_musical_history || "",
            onChange: (value) => updateField("family_musical_history", value),
          },
          {
            key: "patient_musical_history",
            label: "História musical do paciente",
            placeholder: "Descreva a história musical do paciente",
            value: content.patient_musical_history || "",
            onChange: (value) => updateField("patient_musical_history", value),
          },
        ]}
      />

      <CheckboxSection
        title="Comportamento Musical"
        fields={[
          {
            id: "active_musical_listening",
            label: "Escuta Musical Ativa",
            checked: content.active_musical_listening || false,
            onChange: (value) => updateField("active_musical_listening", value),
          },
          {
            id: "body_expression",
            label: "Expressão Corporal",
            checked: content.body_expression || false,
            onChange: (value) => updateField("body_expression", value),
          },
          {
            id: "sound_responsiveness",
            label: "Responsividade Sonora",
            checked: content.sound_responsiveness || false,
            onChange: (value) => updateField("sound_responsiveness", value),
          },
          {
            id: "spontaneous_vocal",
            label: "Emissões Vocais Espontâneas",
            checked: content.spontaneous_vocal || false,
            onChange: (value) => updateField("spontaneous_vocal", value),
          },
          {
            id: "instrumental_exploration",
            label: "Exploração Instrumental",
            checked: content.instrumental_exploration || false,
            onChange: (value) => updateField("instrumental_exploration", value),
          },
          {
            id: "adverse_sound_reactivity",
            label: "Reatividade Sonora Adversa",
            checked: content.adverse_sound_reactivity || false,
            onChange: (value) => updateField("adverse_sound_reactivity", value),
          },
        ]}
      />

      <CheckboxSection
        title="Processamento Sonoro"
        fields={[
          {
            id: "auditory_hypersensitivity",
            label: "Hipersensibilidade Auditiva",
            checked: content.auditory_hypersensitivity || false,
            onChange: (value) => updateField("auditory_hypersensitivity", value),
          },
          {
            id: "positive_musical_response",
            label: "Resposta Musical Positiva",
            checked: content.positive_musical_response || false,
            onChange: (value) => updateField("positive_musical_response", value),
          },
          {
            id: "nominal_call_response",
            label: "Resposta ao Chamado Nominal",
            checked: content.nominal_call_response || false,
            onChange: (value) => updateField("nominal_call_response", value),
          },
          {
            id: "active_sound_search",
            label: "Busca Ativa por Sons",
            checked: content.active_sound_search || false,
            onChange: (value) => updateField("active_sound_search", value),
          },
          {
            id: "specific_sound_aversion",
            label: "Aversão a Sons Específicos",
            checked: content.specific_sound_aversion || false,
            onChange: (value) => updateField("specific_sound_aversion", value),
          },
          {
            id: "sound_source_location",
            label: "Localização de Fonte Sonora",
            checked: content.sound_source_location || false,
            onChange: (value) => updateField("sound_source_location", value),
          },
        ]}
      />

      <CheckboxSection
        title="Preferências Musicais"
        fields={[
          {
            id: "children_repertoire",
            label: "Repertório Infantil",
            checked: content.children_repertoire || false,
            onChange: (value) => updateField("children_repertoire", value),
          },
          {
            id: "rock_genre",
            label: "Rock",
            checked: content.rock_genre || false,
            onChange: (value) => updateField("rock_genre", value),
          },
          {
            id: "sacred_gospel",
            label: "Sacra/Gospel",
            checked: content.sacred_gospel || false,
            onChange: (value) => updateField("sacred_gospel", value),
          },
          {
            id: "brazilian_popular",
            label: "MPB",
            checked: content.brazilian_popular || false,
            onChange: (value) => updateField("brazilian_popular", value),
          },
          {
            id: "country_music",
            label: "Sertanejo",
            checked: content.country_music || false,
            onChange: (value) => updateField("country_music", value),
          },
          {
            id: "classical_music",
            label: "Música Clássica",
            checked: content.classical_music || false,
            onChange: (value) => updateField("classical_music", value),
          },
          {
            id: "other_musical_genres",
            label: "Outros Gêneros",
            checked: content.other_musical_genres || false,
            onChange: (value) => updateField("other_musical_genres", value),
          },
        ]}
      />

      <CheckboxSection
        title="Desenvolvimento"
        fields={[
          {
            id: "cervical_control",
            label: "Controle Cervical",
            checked: content.cervical_control || false,
            onChange: (value) => updateField("cervical_control", value),
          },
          {
            id: "crawling_pattern",
            label: "Padrão de Engatinhar",
            checked: content.crawling_pattern || false,
            onChange: (value) => updateField("crawling_pattern", value),
          },
          {
            id: "fine_motor_dev",
            label: "Desenvolvimento Motor Fino",
            checked: content.fine_motor_dev || false,
            onChange: (value) => updateField("fine_motor_dev", value),
          },
          {
            id: "independent_sitting",
            label: "Sentar Independente",
            checked: content.independent_sitting || false,
            onChange: (value) => updateField("independent_sitting", value),
          },
          {
            id: "autonomous_walking",
            label: "Marcha Autônoma",
            checked: content.autonomous_walking || false,
            onChange: (value) => updateField("autonomous_walking", value),
          },
          {
            id: "broad_motor_dev",
            label: "Desenvolvimento Motor Amplo",
            checked: content.broad_motor_dev || false,
            onChange: (value) => updateField("broad_motor_dev", value),
          },
        ]}
      />

      <CheckboxSection
        title="Desenvolvimento da Linguagem"
        fields={[
          {
            id: "babbling",
            label: "Balbucios",
            checked: content.babbling || false,
            onChange: (value) => updateField("babbling", value),
          },
          {
            id: "simple_phrases",
            label: "Frases Simples",
            checked: content.simple_phrases || false,
            onChange: (value) => updateField("simple_phrases", value),
          },
          {
            id: "echolalia",
            label: "Ecolalia",
            checked: content.echolalia || false,
            onChange: (value) => updateField("echolalia", value),
          },
          {
            id: "first_words",
            label: "Primeiras Palavras",
            checked: content.first_words || false,
            onChange: (value) => updateField("first_words", value),
          },
          {
            id: "nonverbal_communication",
            label: "Comunicação Não-verbal",
            checked: content.nonverbal_communication || false,
            onChange: (value) => updateField("nonverbal_communication", value),
          },
          {
            id: "verbal_language_absence",
            label: "Ausência de Linguagem Verbal",
            checked: content.verbal_language_absence || false,
            onChange: (value) => updateField("verbal_language_absence", value),
          },
        ]}
      />

      <CheckboxSection
        title="Comportamento"
        fields={[
          {
            id: "visual_contact",
            label: "Contato Visual",
            checked: content.visual_contact || false,
            onChange: (value) => updateField("visual_contact", value),
          },
          {
            id: "shared_play",
            label: "Brincadeira Compartilhada",
            checked: content.shared_play || false,
            onChange: (value) => updateField("shared_play", value),
          },
          {
            id: "stereotyped_behavior",
            label: "Comportamentos Estereotipados",
            checked: content.stereotyped_behavior || false,
            onChange: (value) => updateField("stereotyped_behavior", value),
          },
          {
            id: "peer_interaction",
            label: "Interação com Pares",
            checked: content.peer_interaction || false,
            onChange: (value) => updateField("peer_interaction", value),
          },
          {
            id: "social_isolation",
            label: "Isolamento Social",
            checked: content.social_isolation || false,
            onChange: (value) => updateField("social_isolation", value),
          },
          {
            id: "restricted_interests",
            label: "Interesses Restritos",
            checked: content.restricted_interests || false,
            onChange: (value) => updateField("restricted_interests", value),
          },
        ]}
      />

      <CheckboxSection
        title="Regulação Emocional"
        fields={[
          {
            id: "irritability",
            label: "Irritabilidade",
            checked: content.irritability || false,
            onChange: (value) => updateField("irritability", value),
          },
          {
            id: "heteroaggressive",
            label: "Heteroagressividade",
            checked: content.heteroaggressive || false,
            onChange: (value) => updateField("heteroaggressive", value),
          },
          {
            id: "emotional_ability",
            label: "Capacidade Emocional",
            checked: content.emotional_ability || false,
            onChange: (value) => updateField("emotional_ability", value),
          },
          {
            id: "anxiety",
            label: "Ansiedade",
            checked: content.anxiety || false,
            onChange: (value) => updateField("anxiety", value),
          },
          {
            id: "frequent_crying",
            label: "Choro Frequente",
            checked: content.frequent_crying || false,
            onChange: (value) => updateField("frequent_crying", value),
          },
          {
            id: "low_frustration_tolerance",
            label: "Baixa Tolerância à Frustração",
            checked: content.low_frustration_tolerance || false,
            onChange: (value) => updateField("low_frustration_tolerance", value),
          },
        ]}
      />

      <CheckboxSection
        title="Transtornos Mentais"
        fields={[
          {
            id: "autism_spectrum",
            label: "Transtornos do espectro autista",
            checked: getBooleanValue("autism_spectrum"),
            onChange: (value) => updateField("autism_spectrum", value),
          },
          {
            id: "adhd",
            label: "TDAH",
            checked: getBooleanValue("adhd"),
            onChange: (value) => updateField("adhd", value),
          },
          {
            id: "anxiety_disorders",
            label: "Transtornos de Ansiedade",
            checked: getBooleanValue("anxiety_disorders"),
            onChange: (value) => updateField("anxiety_disorders", value),
          },
          {
            id: "depression",
            label: "Depressão",
            checked: getBooleanValue("depression"),
            onChange: (value) => updateField("depression", value),
          },
          {
            id: "bipolar_disorder",
            label: "Transtorno Bipolar",
            checked: getBooleanValue("bipolar_disorder"),
            onChange: (value) => updateField("bipolar_disorder", value),
          },
          {
            id: "alzheimer",
            label: "Alzheimer",
            checked: getBooleanValue("alzheimer"),
            onChange: (value) => updateField("alzheimer", value),
          },
        ]}
      />

      <CheckboxSection
        title="Outras Condições"
        fields={[
          {
            id: "down_syndrome",
            label: "Síndrome de Down",
            checked: getBooleanValue("down_syndrome"),
            onChange: (value) => updateField("down_syndrome", value),
          },
          {
            id: "intellectual_disability",
            label: "Deficiência Intelectual",
            checked: getBooleanValue("intellectual_disability"),
            onChange: (value) => updateField("intellectual_disability", value),
          },
          {
            id: "chronic_encephalopathy",
            label: "Encefalopatia Crônica",
            checked: getBooleanValue("chronic_encephalopathy"),
            onChange: (value) => updateField("chronic_encephalopathy", value),
          },
          {
            id: "cerebral_palsy",
            label: "Paralisia Cerebral",
            checked: getBooleanValue("cerebral_palsy"),
            onChange: (value) => updateField("cerebral_palsy", value),
          },
          {
            id: "epilepsy",
            label: "Epilepsia",
            checked: getBooleanValue("epilepsy"),
            onChange: (value) => updateField("epilepsy", value),
          },
          {
            id: "williams_syndrome",
            label: "Síndrome de Williams",
            checked: getBooleanValue("williams_syndrome"),
            onChange: (value) => updateField("williams_syndrome", value),
          },
          {
            id: "fragile_x_syndrome",
            label: "Síndrome do X Frágil",
            checked: getBooleanValue("fragile_x_syndrome"),
            onChange: (value) => updateField("fragile_x_syndrome", value),
          },
          {
            id: "rett_syndrome",
            label: "Síndrome de Rett",
            checked: getBooleanValue("rett_syndrome"),
            onChange: (value) => updateField("rett_syndrome", value),
          },
          {
            id: "other_diagnoses",
            label: "Outros Diagnósticos",
            checked: getBooleanValue("other_diagnoses"),
            onChange: (value) => updateField("other_diagnoses", value),
          },
        ]}
      />

      <CheckboxSection
        title="Medicação e Terapias"
        fields={[
          {
            id: "speech_therapy",
            label: "Fonoaudiologia",
            checked: getBooleanValue("speech_therapy"),
            onChange: (value) => updateField("speech_therapy", value),
          },
          {
            id: "psychological_support",
            label: "Acompanhamento Psicológico",
            checked: getBooleanValue("psychological_support"),
            onChange: (value) => updateField("psychological_support", value),
          },
          {
            id: "psychopedagogical",
            label: "Psicopedagogia",
            checked: getBooleanValue("psychopedagogical"),
            onChange: (value) => updateField("psychopedagogical", value),
          },
          {
            id: "occupational_therapy",
            label: "Terapia Ocupacional",
            checked: getBooleanValue("occupational_therapy"),
            onChange: (value) => updateField("occupational_therapy", value),
          },
          {
            id: "physiotherapy",
            label: "Fisioterapia",
            checked: getBooleanValue("physiotherapy"),
            onChange: (value) => updateField("physiotherapy", value),
          },
          {
            id: "equine_therapy",
            label: "Equoterapia",
            checked: getBooleanValue("equine_therapy"),
            onChange: (value) => updateField("equine_therapy", value),
          },
          {
            id: "aba_therapy",
            label: "Terapia ABA",
            checked: getBooleanValue("aba_therapy"),
            onChange: (value) => updateField("aba_therapy", value),
          },
          {
            id: "sensory_integration",
            label: "Integração Sensorial",
            checked: getBooleanValue("sensory_integration"),
            onChange: (value) => updateField("sensory_integration", value),
          },
          {
            id: "psychomotricity",
            label: "Psicomotricidade",
            checked: getBooleanValue("psychomotricity"),
            onChange: (value) => updateField("psychomotricity", value),
          },
          {
            id: "music_therapy",
            label: "Musicoterapia",
            checked: getBooleanValue("music_therapy"),
            onChange: (value) => updateField("music_therapy", value),
          },
          {
            id: "nutrition",
            label: "Nutrição",
            checked: getBooleanValue("nutrition"),
            onChange: (value) => updateField("nutrition", value),
          },
        ]}
      />

      <FormSection
        title="Medicação"
        fields={[
          {
            key: "current_medication",
            label: "Medicação Atual",
            placeholder: "Liste as medicações em uso",
            value: content.current_medication || "",
            onChange: (value) => updateField("current_medication", value),
          },
        ]}
      />

      <FormSection
        title="Aspectos Sociais"
        fields={[
          {
            key: "school_enrollment",
            label: "Matrícula Escolar",
            placeholder: "Informações sobre matrícula escolar",
            value: content.school_enrollment || "",
            onChange: (value) => updateField("school_enrollment", value),
          },
          {
            key: "school_adaptation",
            label: "Adaptação Escolar",
            placeholder: "Como tem sido a adaptação escolar",
            value: content.school_adaptation || "",
            onChange: (value) => updateField("school_adaptation", value),
          },
          {
            key: "extracurricular_activities",
            label: "Atividades Extracurriculares",
            placeholder: "Liste as atividades extracurriculares",
            value: content.extracurricular_activities || "",
            onChange: (value) => updateField("extracurricular_activities", value),
          },
        ]}
      />

      {/* História Sonora e Musical Detalhada */}
      <FormSection
        title="História Sonora e Musical Detalhada"
        fields={[
          {
            key: "pregnancy_sound_experiences",
            label: "Experiências sonoras durante a gravidez",
            placeholder: "Descreva as experiências sonoras da mãe durante a gravidez",
            value: content.pregnancy_sound_experiences || "",
            onChange: (value) => updateField("pregnancy_sound_experiences", value),
          },
          {
            key: "mother_movements_songs",
            label: "Movimentos e canções da mãe",
            placeholder: "Descreva os movimentos e canções da mãe durante a gravidez",
            value: content.mother_movements_songs || "",
            onChange: (value) => updateField("mother_movements_songs", value),
          },
          {
            key: "childhood_sound_environment",
            label: "Ambiente sonoro da infância",
            placeholder: "Descreva o ambiente sonoro durante a infância",
            value: content.childhood_sound_environment || "",
            onChange: (value) => updateField("childhood_sound_environment", value),
          },
          {
            key: "parents_sound_reactions",
            label: "Reações sonoras dos pais",
            placeholder: "Descreva as reações dos pais aos sons",
            value: content.parents_sound_reactions || "",
            onChange: (value) => updateField("parents_sound_reactions", value),
          },
          {
            key: "typical_house_sounds",
            label: "Sons típicos da casa",
            placeholder: "Descreva os sons típicos do ambiente doméstico",
            value: content.typical_house_sounds || "",
            onChange: (value) => updateField("typical_house_sounds", value),
          },
          {
            key: "night_body_sounds",
            label: "Sons corporais noturnos",
            placeholder: "Descreva os sons corporais durante a noite",
            value: content.night_body_sounds || "",
            onChange: (value) => updateField("night_body_sounds", value),
          },
          {
            key: "family_musical_history",
            label: "História musical familiar",
            placeholder: "Descreva a história musical da família",
            value: content.family_musical_history || "",
            onChange: (value) => updateField("family_musical_history", value),
          },
          {
            key: "patient_musical_history",
            label: "História musical do paciente",
            placeholder: "Descreva a história musical do paciente",
            value: content.patient_musical_history || "",
            onChange: (value) => updateField("patient_musical_history", value),
          },
        ]}
      />
    </div>
  );
}
