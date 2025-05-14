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
  const updateField = (field: string, value: any) => {
    onChange({ ...content, [field]: value });
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
        title="Transtorno do Espectro Autista (TEA)"
        fields={[
          {
            id: "autism_level_1",
            label: "TEA Nível 1 (Suporte Leve)",
            checked: content.autism_level_1 || false,
            onChange: (value) => updateField("autism_level_1", value),
          },
          {
            id: "autism_level_2",
            label: "TEA Nível 2 (Suporte Substancial)",
            checked: content.autism_level_2 || false,
            onChange: (value) => updateField("autism_level_2", value),
          },
          {
            id: "autism_level_3",
            label: "TEA Nível 3 (Suporte Muito Substancial)",
            checked: content.autism_level_3 || false,
            onChange: (value) => updateField("autism_level_3", value),
          },
          {
            id: "high_functioning_autism",
            label: "Autismo de Alto Funcionamento",
            checked: content.high_functioning_autism || false,
            onChange: (value) => updateField("high_functioning_autism", value),
          },
          {
            id: "asperger_syndrome",
            label: "Síndrome de Asperger",
            checked: content.asperger_syndrome || false,
            onChange: (value) => updateField("asperger_syndrome", value),
          },
          {
            id: "pdd_nos",
            label: "Transtorno Global do Desenvolvimento SOE",
            checked: content.pdd_nos || false,
            onChange: (value) => updateField("pdd_nos", value),
          },
          {
            id: "regressive_autism",
            label: "Autismo Regressivo",
            checked: content.regressive_autism || false,
            onChange: (value) => updateField("regressive_autism", value),
          },
        ]}
      />

      <CheckboxSection
        title="Transtornos Mentais"
        fields={[
          {
            id: "adhd",
            label: "TDAH",
            checked: content.adhd || false,
            onChange: (value) => updateField("adhd", value),
          },
          {
            id: "adhd_inattentive",
            label: "TDAH Predominantemente Desatento",
            checked: content.adhd_inattentive || false,
            onChange: (value) => updateField("adhd_inattentive", value),
          },
          {
            id: "adhd_hyperactive",
            label: "TDAH Predominantemente Hiperativo/Impulsivo",
            checked: content.adhd_hyperactive || false,
            onChange: (value) => updateField("adhd_hyperactive", value),
          },
          {
            id: "oppositional_defiant_disorder",
            label: "Transtorno Opositor Desafiador (TOD)",
            checked: content.oppositional_defiant_disorder || false,
            onChange: (value) => updateField("oppositional_defiant_disorder", value),
          },
          {
            id: "anxiety_disorders",
            label: "Transtornos de Ansiedade",
            checked: content.anxiety_disorders || false,
            onChange: (value) => updateField("anxiety_disorders", value),
          },
          {
            id: "specific_phobia",
            label: "Fobia Específica",
            checked: content.specific_phobia || false,
            onChange: (value) => updateField("specific_phobia", value),
          },
          {
            id: "separation_anxiety",
            label: "Ansiedade de Separação",
            checked: content.separation_anxiety || false,
            onChange: (value) => updateField("separation_anxiety", value),
          },
          {
            id: "social_anxiety",
            label: "Ansiedade Social",
            checked: content.social_anxiety || false,
            onChange: (value) => updateField("social_anxiety", value),
          },
          {
            id: "ocd",
            label: "Transtorno Obsessivo-Compulsivo (TOC)",
            checked: content.ocd || false,
            onChange: (value) => updateField("ocd", value),
          },
          {
            id: "depression",
            label: "Depressão",
            checked: content.depression || false,
            onChange: (value) => updateField("depression", value),
          },
          {
            id: "bipolar_disorder",
            label: "Transtorno Bipolar",
            checked: content.bipolar_disorder || false,
            onChange: (value) => updateField("bipolar_disorder", value),
          },
        ]}
      />

      <CheckboxSection
        title="Outras Condições"
        fields={[
          {
            id: "down_syndrome",
            label: "Síndrome de Down",
            checked: content.down_syndrome || false,
            onChange: (value) => updateField("down_syndrome", value),
          },
          {
            id: "intellectual_disability",
            label: "Deficiência Intelectual",
            checked: content.intellectual_disability || false,
            onChange: (value) => updateField("intellectual_disability", value),
          },
          {
            id: "chronic_encephalopathy",
            label: "Encefalopatia Crônica",
            checked: content.chronic_encephalopathy || false,
            onChange: (value) => updateField("chronic_encephalopathy", value),
          },
          {
            id: "cerebral_palsy",
            label: "Paralisia Cerebral",
            checked: content.cerebral_palsy || false,
            onChange: (value) => updateField("cerebral_palsy", value),
          },
          {
            id: "epilepsy",
            label: "Epilepsia",
            checked: content.epilepsy || false,
            onChange: (value) => updateField("epilepsy", value),
          },
          {
            id: "williams_syndrome",
            label: "Síndrome de Williams",
            checked: content.williams_syndrome || false,
            onChange: (value) => updateField("williams_syndrome", value),
          },
          {
            id: "fragile_x_syndrome",
            label: "Síndrome do X Frágil",
            checked: content.fragile_x_syndrome || false,
            onChange: (value) => updateField("fragile_x_syndrome", value),
          },
          {
            id: "rett_syndrome",
            label: "Síndrome de Rett",
            checked: content.rett_syndrome || false,
            onChange: (value) => updateField("rett_syndrome", value),
          },
          {
            id: "other_diagnoses",
            label: "Outros Diagnósticos",
            checked: content.other_diagnoses || false,
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
            checked: content.speech_therapy || false,
            onChange: (value) => updateField("speech_therapy", value),
          },
          {
            id: "psychological_support",
            label: "Acompanhamento Psicológico",
            checked: content.psychological_support || false,
            onChange: (value) => updateField("psychological_support", value),
          },
          {
            id: "psychopedagogical",
            label: "Psicopedagogia",
            checked: content.psychopedagogical || false,
            onChange: (value) => updateField("psychopedagogical", value),
          },
          {
            id: "occupational_therapy",
            label: "Terapia Ocupacional",
            checked: content.occupational_therapy || false,
            onChange: (value) => updateField("occupational_therapy", value),
          },
          {
            id: "physiotherapy",
            label: "Fisioterapia",
            checked: content.physiotherapy || false,
            onChange: (value) => updateField("physiotherapy", value),
          },
          {
            id: "equine_therapy",
            label: "Equoterapia",
            checked: content.equine_therapy || false,
            onChange: (value) => updateField("equine_therapy", value),
          },
          {
            id: "aba_therapy",
            label: "Terapia ABA",
            checked: content.aba_therapy || false,
            onChange: (value) => updateField("aba_therapy", value),
          },
          {
            id: "sensory_integration",
            label: "Integração Sensorial",
            checked: content.sensory_integration || false,
            onChange: (value) => updateField("sensory_integration", value),
          },
          {
            id: "psychomotricity",
            label: "Psicomotricidade",
            checked: content.psychomotricity || false,
            onChange: (value) => updateField("psychomotricity", value),
          },
          {
            id: "music_therapy",
            label: "Musicoterapia",
            checked: content.music_therapy || false,
            onChange: (value) => updateField("music_therapy", value),
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
    </div>
  );
}
