import { useMemo } from "react";
import { 
  Stethoscope, Pill, HeartPulse, Music, Volume2, Brain, 
  Baby, Heart, School, FileText, Users, Activity,
  Ear, MessageCircle, Hand, Eye, Smile, AlertTriangle
} from "lucide-react";
import { CollapsibleSection } from "./CollapsibleSection";
import { AnamnesisProgressBar } from "./AnamnesisProgressBar";
import { ModernCheckboxGrid } from "./ModernCheckboxCard";
import { AutoExpandTextarea, ModernTextInput } from "./AutoExpandTextarea";

interface ValidationError {
  field: string;
  label: string;
  section: number;
  sectionTitle: string;
}

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
  fieldErrors?: Record<string, string>;
  getSectionErrors?: (sectionNumber: number) => ValidationError[];
};

export function InitialEvaluationForm({ content, onChange, fieldErrors = {}, getSectionErrors }: FormProps) {
  const updateField = (field: string, value: string | boolean) => {
    onChange({ ...content, [field]: value });
  };

  const getBooleanValue = (fieldName: string): boolean => {
    if (fieldName in content) {
      return Boolean(content[fieldName]);
    }
    return false;
  };

  const getStringValue = (fieldName: string): string => {
    return content[fieldName] || "";
  };

  // Calculate progress
  const calculateProgress = useMemo(() => {
    const totalFields = 80;
    let filledFields = 0;
    
    Object.entries(content).forEach(([key, value]) => {
      if (value && value !== "" && value !== false) {
        filledFields++;
      }
    });
    
    return Math.min(Math.round((filledFields / totalFields) * 100), 100);
  }, [content]);

  // Check section completion (>= 50% of fields filled)
  const isSectionComplete = (fields: string[]): boolean => {
    const filledCount = fields.filter(f => {
      const val = content[f];
      return val && val !== "" && val !== false;
    }).length;
    return filledCount >= Math.ceil(fields.length * 0.5);
  };

  // Section 2 uses a different rule: any diagnosis selected OR clinical details filled
  const isSection2Complete = (fields: string[]): boolean => {
    return fields.some(f => {
      const val = content[f];
      return val && val !== "" && val !== false;
    });
  };

  const section1Fields = ["referral_professional", "main_clinical_demand", "diagnosis_details", "cid_code"];
  const section2Fields = [
    "autism_spectrum", "adhd", "down_syndrome", "intellectual_disability",
    "cerebral_palsy", "epilepsy", "chronic_encephalopathy", "williams_syndrome",
    "fragile_x_syndrome", "rett_syndrome", "angelman_syndrome", "alzheimer", "parkinson",
    "depression", "bipolar_disorder", "anxiety_disorders", "odd_disorder", "other_diagnoses",
    "clinical_details",
  ];

  const section3Fields = ["current_medication", "medication_schedule", "medication_effects"];
  const section4Fields = ["speech_therapy", "psychological_support", "occupational_therapy", "physiotherapy"];
  const section5Fields = ["musical_education", "instrumental_practice", "patient_musical_history"];
  const section6Fields = ["pregnancy_sound_experiences", "childhood_sound_environment", "family_musical_history"];
  const section7Fields = ["active_musical_listening", "body_expression", "sound_responsiveness"];
  const section8Fields = ["auditory_hypersensitivity", "positive_musical_response", "nominal_call_response"];
  const section9Fields = ["cervical_control", "independent_sitting", "autonomous_walking", "babbling", "first_words"];
  const section10Fields = ["visual_contact", "peer_interaction", "irritability", "anxiety"];
  const section11Fields = ["school_enrollment", "school_adaptation", "extracurricular_activities"];

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <AnamnesisProgressBar 
        progress={calculateProgress}
        totalSections={11}
        completedSections={[
          isSectionComplete(section1Fields),
          isSection2Complete(section2Fields),
          isSectionComplete(section3Fields),
          isSectionComplete(section4Fields),
          isSectionComplete(section5Fields),
          isSectionComplete(section6Fields),
          isSectionComplete(section7Fields),
          isSectionComplete(section8Fields),
          isSectionComplete(section9Fields),
          isSectionComplete(section10Fields),
          isSectionComplete(section11Fields),
        ].filter(Boolean).length}
      />

      {/* SEÇÃO 1: Identificação e Encaminhamento */}
      <CollapsibleSection
        title="Identificação e Encaminhamento"
        icon={FileText}
        sectionNumber={1}
        defaultOpen={true}
        isComplete={isSectionComplete(section1Fields)}
        hasErrors={getSectionErrors ? getSectionErrors(1).length > 0 : false}
        errorCount={getSectionErrors ? getSectionErrors(1).length : 0}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ModernTextInput
              id="mother_name"
              label="Nome da Mãe"
              value={getStringValue("mother_name")}
              onChange={(value) => updateField("mother_name", value)}
              placeholder="Nome completo da mãe"
              icon={Users}
            />
            <ModernTextInput
              id="father_name"
              label="Nome do Pai"
              value={getStringValue("father_name")}
              onChange={(value) => updateField("father_name", value)}
              placeholder="Nome completo do pai"
              icon={Users}
            />
          </div>
          <ModernTextInput
            id="referral_professional"
            label="Profissional que Encaminhou"
            value={getStringValue("referral_professional")}
            onChange={(value) => updateField("referral_professional", value)}
            placeholder="Nome do profissional que fez o encaminhamento"
            icon={Users}
          />
          <AutoExpandTextarea
            id="main_clinical_demand"
            label="Demanda Clínica Principal"
            value={getStringValue("main_clinical_demand")}
            onChange={(value) => updateField("main_clinical_demand", value)}
            placeholder="Descreva a queixa principal e motivo do encaminhamento para musicoterapia..."
            icon={Stethoscope}
            required
            hint="Inclua informações sobre as principais dificuldades observadas e expectativas terapêuticas"
            error={fieldErrors["main_clinical_demand"]}
            hasError={!!fieldErrors["main_clinical_demand"]}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AutoExpandTextarea
              id="diagnosis_details"
              label="Diagnóstico(s) Existente(s)"
              value={getStringValue("diagnosis_details")}
              onChange={(value) => updateField("diagnosis_details", value)}
              placeholder="Liste os diagnósticos médicos estabelecidos..."
              minRows={2}
            />
            <ModernTextInput
              id="cid_code"
              label="CID-10/11 (opcional)"
              value={getStringValue("cid_code")}
              onChange={(value) => updateField("cid_code", value)}
              placeholder="Ex: F84.0, F90.0"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ModernTextInput
              id="diagnosis_date"
              label="Data do Diagnóstico"
              value={getStringValue("diagnosis_date")}
              onChange={(value) => updateField("diagnosis_date", value)}
              placeholder="Ex: 15/05/2023"
              icon={FileText}
            />
            <ModernTextInput
              id="support_level"
              label="Nível de Suporte (TEA)"
              value={getStringValue("support_level")}
              onChange={(value) => updateField("support_level", value)}
              placeholder="Ex: Nível 1 de suporte"
              icon={Activity}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* SEÇÃO 2: Histórico Clínico e Médico */}
      <CollapsibleSection
        title="Histórico Clínico e Médico"
        icon={Stethoscope}
        sectionNumber={2}
        isComplete={isSection2Complete(section2Fields)}
      >
        <div className="space-y-6">
          <ModernCheckboxGrid
            title="Diagnósticos e Condições"
            fields={[
              { id: "autism_spectrum", label: "TEA - Transtorno do Espectro Autista", checked: getBooleanValue("autism_spectrum"), onChange: (v) => updateField("autism_spectrum", v), icon: Brain },
              { id: "adhd", label: "TDAH", checked: getBooleanValue("adhd"), onChange: (v) => updateField("adhd", v), icon: Activity },
              { id: "down_syndrome", label: "Síndrome de Down", checked: getBooleanValue("down_syndrome"), onChange: (v) => updateField("down_syndrome", v), icon: Heart },
              { id: "intellectual_disability", label: "Deficiência Intelectual", checked: getBooleanValue("intellectual_disability"), onChange: (v) => updateField("intellectual_disability", v), icon: Brain },
              { id: "cerebral_palsy", label: "Paralisia Cerebral", checked: getBooleanValue("cerebral_palsy"), onChange: (v) => updateField("cerebral_palsy", v), icon: Hand },
              { id: "epilepsy", label: "Epilepsia", checked: getBooleanValue("epilepsy"), onChange: (v) => updateField("epilepsy", v), icon: AlertTriangle },
              { id: "chronic_encephalopathy", label: "Encefalopatia Crônica", checked: getBooleanValue("chronic_encephalopathy"), onChange: (v) => updateField("chronic_encephalopathy", v), icon: Brain },
              { id: "williams_syndrome", label: "Síndrome de Williams", checked: getBooleanValue("williams_syndrome"), onChange: (v) => updateField("williams_syndrome", v), icon: Heart },
              { id: "fragile_x_syndrome", label: "Síndrome X Frágil", checked: getBooleanValue("fragile_x_syndrome"), onChange: (v) => updateField("fragile_x_syndrome", v), icon: Brain },
              { id: "rett_syndrome", label: "Síndrome de Rett", checked: getBooleanValue("rett_syndrome"), onChange: (v) => updateField("rett_syndrome", v), icon: Heart },
              { id: "angelman_syndrome", label: "Síndrome de Angelman", checked: getBooleanValue("angelman_syndrome"), onChange: (v) => updateField("angelman_syndrome", v), icon: Heart },
              { id: "alzheimer", label: "Doença de Alzheimer", checked: getBooleanValue("alzheimer"), onChange: (v) => updateField("alzheimer", v), icon: Brain },
              { id: "parkinson", label: "Doença de Parkinson", checked: getBooleanValue("parkinson"), onChange: (v) => updateField("parkinson", v), icon: Activity },
              { id: "depression", label: "Depressão", checked: getBooleanValue("depression"), onChange: (v) => updateField("depression", v), icon: Heart },
              { id: "bipolar_disorder", label: "Transtorno Bipolar", checked: getBooleanValue("bipolar_disorder"), onChange: (v) => updateField("bipolar_disorder", v), icon: Activity },
              { id: "anxiety_disorders", label: "Transtornos de Ansiedade", checked: getBooleanValue("anxiety_disorders"), onChange: (v) => updateField("anxiety_disorders", v), icon: AlertTriangle },
              { id: "odd_disorder", label: "TOD - Transtorno Opositor Desafiador", checked: getBooleanValue("odd_disorder"), onChange: (v) => updateField("odd_disorder", v), icon: AlertTriangle },
              { id: "other_diagnoses", label: "Outros Diagnósticos", checked: getBooleanValue("other_diagnoses"), onChange: (v) => updateField("other_diagnoses", v), icon: FileText },
            ]}
          />
          <AutoExpandTextarea
            id="clinical_details"
            label="Detalhes Adicionais sobre Condições"
            value={getStringValue("clinical_details")}
            onChange={(value) => updateField("clinical_details", value)}
            placeholder="Descreva detalhes específicos sobre os diagnósticos, histórico médico relevante..."
            minRows={2}
          />
        </div>
      </CollapsibleSection>

      {/* SEÇÃO 3: Medicação em Uso */}
      <CollapsibleSection
        title="Medicação em Uso"
        icon={Pill}
        sectionNumber={3}
        isComplete={isSectionComplete(section3Fields)}
      >
        <div className="space-y-6">
          <AutoExpandTextarea
            id="current_medication"
            label="Medicação Atual"
            value={getStringValue("current_medication")}
            onChange={(value) => updateField("current_medication", value)}
            placeholder="Liste os medicamentos em uso, dosagens e frequência..."
            icon={Pill}
            hint="Ex: Risperidona 1mg - manhã e noite; Melatonina 3mg - antes de dormir"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AutoExpandTextarea
              id="medication_schedule"
              label="Horários e Dosagens"
              value={getStringValue("medication_schedule")}
              onChange={(value) => updateField("medication_schedule", value)}
              placeholder="Detalhe os horários de administração..."
              minRows={2}
            />
            <AutoExpandTextarea
              id="medication_effects"
              label="Efeitos Observados"
              value={getStringValue("medication_effects")}
              onChange={(value) => updateField("medication_effects", value)}
              placeholder="Descreva efeitos positivos ou colaterais observados..."
              minRows={2}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* SEÇÃO 4: Terapias e Acompanhamentos */}
      <CollapsibleSection
        title="Terapias e Acompanhamentos"
        icon={HeartPulse}
        sectionNumber={4}
        isComplete={isSectionComplete(section4Fields)}
      >
        <div className="space-y-6">
          <ModernCheckboxGrid
            title="Terapias em Andamento"
            columns={2}
            fields={[
              { id: "speech_therapy", label: "Fonoaudiologia", checked: getBooleanValue("speech_therapy"), onChange: (v) => updateField("speech_therapy", v) },
              { id: "psychological_support", label: "Psicologia", checked: getBooleanValue("psychological_support"), onChange: (v) => updateField("psychological_support", v) },
              { id: "psychopedagogical", label: "Psicopedagogia", checked: getBooleanValue("psychopedagogical"), onChange: (v) => updateField("psychopedagogical", v) },
              { id: "occupational_therapy", label: "Terapia Ocupacional", checked: getBooleanValue("occupational_therapy"), onChange: (v) => updateField("occupational_therapy", v) },
              { id: "physiotherapy", label: "Fisioterapia", checked: getBooleanValue("physiotherapy"), onChange: (v) => updateField("physiotherapy", v) },
              { id: "equine_therapy", label: "Equoterapia", checked: getBooleanValue("equine_therapy"), onChange: (v) => updateField("equine_therapy", v) },
              { id: "aba_therapy", label: "Terapia ABA", checked: getBooleanValue("aba_therapy"), onChange: (v) => updateField("aba_therapy", v) },
              { id: "sensory_integration", label: "Integração Sensorial", checked: getBooleanValue("sensory_integration"), onChange: (v) => updateField("sensory_integration", v) },
              { id: "psychomotricity", label: "Psicomotricidade", checked: getBooleanValue("psychomotricity"), onChange: (v) => updateField("psychomotricity", v) },
              { id: "nutrition", label: "Nutrição", checked: getBooleanValue("nutrition"), onChange: (v) => updateField("nutrition", v) },
            ]}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AutoExpandTextarea
              id="therapy_frequency"
              label="Frequência das Terapias"
              value={getStringValue("therapy_frequency")}
              onChange={(value) => updateField("therapy_frequency", value)}
              placeholder="Ex: Fono 2x/semana, TO 1x/semana..."
              minRows={2}
            />
            <AutoExpandTextarea
              id="therapy_observations"
              label="Observações sobre Evolução"
              value={getStringValue("therapy_observations")}
              onChange={(value) => updateField("therapy_observations", value)}
              placeholder="Descreva a evolução observada nas terapias..."
              minRows={2}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* SEÇÃO 5: Perfil Musical do Paciente */}
      <CollapsibleSection
        title="Perfil Musical do Paciente"
        icon={Music}
        sectionNumber={5}
        isComplete={isSectionComplete(section5Fields)}
        hasErrors={getSectionErrors ? getSectionErrors(5).length > 0 : false}
        errorCount={getSectionErrors ? getSectionErrors(5).length : 0}
      >
        <div className="space-y-6">
          <ModernCheckboxGrid
            title="Experiências Musicais"
            fields={[
              { id: "musical_education", label: "Educação Musical Formal", checked: getBooleanValue("musical_education"), onChange: (v) => updateField("musical_education", v), icon: Music },
              { id: "instrumental_practice", label: "Prática Instrumental", checked: getBooleanValue("instrumental_practice"), onChange: (v) => updateField("instrumental_practice", v), icon: Music },
              { id: "choral_activities", label: "Canto/Coral", checked: getBooleanValue("choral_activities"), onChange: (v) => updateField("choral_activities", v), icon: MessageCircle },
              { id: "body_musical_expression", label: "Expressão Corporal Musical", checked: getBooleanValue("body_musical_expression"), onChange: (v) => updateField("body_musical_expression", v), icon: Hand },
              { id: "vocal_expression", label: "Expressão Vocal", checked: getBooleanValue("vocal_expression"), onChange: (v) => updateField("vocal_expression", v), icon: MessageCircle },
              { id: "no_musical_experience", label: "Sem Experiência Musical Formal", checked: getBooleanValue("no_musical_experience"), onChange: (v) => updateField("no_musical_experience", v), icon: FileText },
            ]}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ModernTextInput
              id="instruments_played"
              label="Instrumento(s) que toca/tocou"
              value={getStringValue("instruments_played")}
              onChange={(value) => updateField("instruments_played", value)}
              placeholder="Ex: Violão, Piano, Flauta..."
            />
            <ModernTextInput
              id="music_practice_time"
              label="Tempo de Prática Musical"
              value={getStringValue("music_practice_time")}
              onChange={(value) => updateField("music_practice_time", value)}
              placeholder="Ex: 2 anos de aulas de violão"
            />
          </div>
          <AutoExpandTextarea
            id="patient_musical_history"
            label="História Musical do Paciente"
            value={getStringValue("patient_musical_history")}
            onChange={(value) => updateField("patient_musical_history", value)}
            placeholder="Descreva a relação do paciente com a música, preferências, reações a estímulos musicais..."
            icon={Music}
            required
            error={fieldErrors["patient_musical_history"]}
            hasError={!!fieldErrors["patient_musical_history"]}
          />
        </div>
      </CollapsibleSection>

      {/* SEÇÃO 6: Identidade Sonora (ISO) */}
      <CollapsibleSection
        title="Identidade Sonora (ISO)"
        icon={Volume2}
        sectionNumber={6}
        isComplete={isSectionComplete(section6Fields)}
        hasErrors={getSectionErrors ? getSectionErrors(6).length > 0 : false}
        errorCount={getSectionErrors ? getSectionErrors(6).length : 0}
      >
        <div className="space-y-6">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-primary">ISO (Identidade Sonora)</strong> - Baseado no modelo de Benenzon, 
              essa seção explora o universo sonoro-musical que caracteriza o paciente, fundamentando a abordagem 
              musicoterapêutica personalizada.
            </p>
          </div>
          
          <AutoExpandTextarea
            id="pregnancy_sound_experiences"
            label="Vivências Sonoras Durante a Gestação"
            value={getStringValue("pregnancy_sound_experiences")}
            onChange={(value) => updateField("pregnancy_sound_experiences", value)}
            placeholder="Descreva sons, músicas ou experiências sonoras relatadas durante a gestação..."
            icon={Volume2}
          />
          <AutoExpandTextarea
            id="mother_movements_songs"
            label="Canções e Movimentos da Mãe"
            value={getStringValue("mother_movements_songs")}
            onChange={(value) => updateField("mother_movements_songs", value)}
            placeholder="Músicas que a mãe cantava, ninava, ou movimentos rítmicos durante a gestação..."
          />
          <AutoExpandTextarea
            id="childhood_sound_environment"
            label="Ambiente Sonoro na Infância"
            value={getStringValue("childhood_sound_environment")}
            onChange={(value) => updateField("childhood_sound_environment", value)}
            placeholder="Descreva os sons predominantes no ambiente durante a primeira infância..."
          />
          <AutoExpandTextarea
            id="parents_sound_reactions"
            label="Reações dos Cuidadores aos Sons"
            value={getStringValue("parents_sound_reactions")}
            onChange={(value) => updateField("parents_sound_reactions", value)}
            placeholder="Como os cuidadores reagiam aos sons do ambiente e da criança..."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AutoExpandTextarea
              id="typical_house_sounds"
              label="Sons Típicos do Ambiente Familiar"
              value={getStringValue("typical_house_sounds")}
              onChange={(value) => updateField("typical_house_sounds", value)}
              placeholder="Sons cotidianos da casa: TV, rádio, vozes..."
              minRows={2}
            />
            <AutoExpandTextarea
              id="night_body_sounds"
              label="Sons Noturnos e Corporais"
              value={getStringValue("night_body_sounds")}
              onChange={(value) => updateField("night_body_sounds", value)}
              placeholder="Sons do corpo, respiração, sons noturnos percebidos..."
              minRows={2}
            />
          </div>
          <AutoExpandTextarea
            id="family_musical_history"
            label="História Musical Familiar"
            value={getStringValue("family_musical_history")}
            onChange={(value) => updateField("family_musical_history", value)}
            placeholder="Tradições musicais da família, músicas significativas, rituais com música..."
            icon={Users}
            required
            error={fieldErrors["family_musical_history"]}
            hasError={!!fieldErrors["family_musical_history"]}
          />
          
          <ModernCheckboxGrid
            title="Preferências de Gêneros Musicais"
            fields={[
              { id: "children_repertoire", label: "Repertório Infantil", checked: getBooleanValue("children_repertoire"), onChange: (v) => updateField("children_repertoire", v) },
              { id: "brazilian_popular", label: "MPB", checked: getBooleanValue("brazilian_popular"), onChange: (v) => updateField("brazilian_popular", v) },
              { id: "rock_genre", label: "Rock", checked: getBooleanValue("rock_genre"), onChange: (v) => updateField("rock_genre", v) },
              { id: "country_music", label: "Sertanejo", checked: getBooleanValue("country_music"), onChange: (v) => updateField("country_music", v) },
              { id: "sacred_gospel", label: "Gospel/Sacro", checked: getBooleanValue("sacred_gospel"), onChange: (v) => updateField("sacred_gospel", v) },
              { id: "classical_music", label: "Música Clássica", checked: getBooleanValue("classical_music"), onChange: (v) => updateField("classical_music", v) },
              { id: "other_musical_genres", label: "Outros Gêneros", checked: getBooleanValue("other_musical_genres"), onChange: (v) => updateField("other_musical_genres", v) },
            ]}
          />
        </div>
      </CollapsibleSection>

      {/* SEÇÃO 7: Comportamento Musical Observado */}
      <CollapsibleSection
        title="Comportamento Musical Observado"
        icon={Music}
        sectionNumber={7}
        isComplete={isSectionComplete(section7Fields)}
      >
        <div className="space-y-6">
          <ModernCheckboxGrid
            title="Indicadores de Comportamento Musical"
            fields={[
              { id: "active_musical_listening", label: "Escuta Musical Ativa", checked: getBooleanValue("active_musical_listening"), onChange: (v) => updateField("active_musical_listening", v), icon: Ear },
              { id: "body_expression", label: "Expressão Corporal", checked: getBooleanValue("body_expression"), onChange: (v) => updateField("body_expression", v), icon: Hand },
              { id: "sound_responsiveness", label: "Responsividade Sonora", checked: getBooleanValue("sound_responsiveness"), onChange: (v) => updateField("sound_responsiveness", v), icon: Volume2 },
              { id: "spontaneous_vocal", label: "Emissões Vocais Espontâneas", checked: getBooleanValue("spontaneous_vocal"), onChange: (v) => updateField("spontaneous_vocal", v), icon: MessageCircle },
              { id: "instrumental_exploration", label: "Exploração Instrumental", checked: getBooleanValue("instrumental_exploration"), onChange: (v) => updateField("instrumental_exploration", v), icon: Music },
              { id: "adverse_sound_reactivity", label: "Reatividade Adversa a Sons", checked: getBooleanValue("adverse_sound_reactivity"), onChange: (v) => updateField("adverse_sound_reactivity", v), icon: AlertTriangle },
            ]}
          />
          <AutoExpandTextarea
            id="musical_behavior_description"
            label="Descrição do Comportamento Musical Observado"
            value={getStringValue("musical_behavior_description")}
            onChange={(value) => updateField("musical_behavior_description", value)}
            placeholder="Descreva em detalhes como o paciente se comporta em situações musicais, suas reações, preferências e aversões..."
            icon={Eye}
          />
        </div>
      </CollapsibleSection>

      {/* SEÇÃO 8: Processamento Auditivo e Sensorial */}
      <CollapsibleSection
        title="Processamento Auditivo e Sensorial"
        icon={Ear}
        sectionNumber={8}
        isComplete={isSectionComplete(section8Fields)}
      >
        <div className="space-y-6">
          <ModernCheckboxGrid
            title="Indicadores de Processamento"
            columns={2}
            fields={[
              { id: "auditory_hypersensitivity", label: "Hipersensibilidade Auditiva", checked: getBooleanValue("auditory_hypersensitivity"), onChange: (v) => updateField("auditory_hypersensitivity", v), icon: Ear },
              { id: "positive_musical_response", label: "Resposta Musical Positiva", checked: getBooleanValue("positive_musical_response"), onChange: (v) => updateField("positive_musical_response", v), icon: Smile },
              { id: "nominal_call_response", label: "Resposta ao Chamado Nominal", checked: getBooleanValue("nominal_call_response"), onChange: (v) => updateField("nominal_call_response", v), icon: MessageCircle },
              { id: "active_sound_search", label: "Busca Ativa por Sons", checked: getBooleanValue("active_sound_search"), onChange: (v) => updateField("active_sound_search", v), icon: Ear },
              { id: "specific_sound_aversion", label: "Aversão a Sons Específicos", checked: getBooleanValue("specific_sound_aversion"), onChange: (v) => updateField("specific_sound_aversion", v), icon: AlertTriangle },
              { id: "sound_source_location", label: "Localização de Fonte Sonora", checked: getBooleanValue("sound_source_location"), onChange: (v) => updateField("sound_source_location", v), icon: Ear },
            ]}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AutoExpandTextarea
              id="discomfort_sounds"
              label="Sons que Causam Desconforto"
              value={getStringValue("discomfort_sounds")}
              onChange={(value) => updateField("discomfort_sounds", value)}
              placeholder="Liste sons, ruídos ou músicas que causam desconforto ou aversão..."
              minRows={2}
            />
            <AutoExpandTextarea
              id="calming_sounds"
              label="Sons que Acalmam/Agradam"
              value={getStringValue("calming_sounds")}
              onChange={(value) => updateField("calming_sounds", value)}
              placeholder="Liste sons, músicas ou vozes que acalmam ou agradam o paciente..."
              minRows={2}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* SEÇÃO 9: Desenvolvimento Neuropsicomotor */}
      <CollapsibleSection
        title="Desenvolvimento Neuropsicomotor"
        icon={Baby}
        sectionNumber={9}
        isComplete={isSectionComplete(section9Fields)}
      >
        <div className="space-y-6">
          <ModernCheckboxGrid
            title="Marcos do Desenvolvimento Motor"
            fields={[
              { id: "cervical_control", label: "Controle Cervical", checked: getBooleanValue("cervical_control"), onChange: (v) => updateField("cervical_control", v) },
              { id: "independent_sitting", label: "Sentar Independente", checked: getBooleanValue("independent_sitting"), onChange: (v) => updateField("independent_sitting", v) },
              { id: "crawling_pattern", label: "Engatinhar", checked: getBooleanValue("crawling_pattern"), onChange: (v) => updateField("crawling_pattern", v) },
              { id: "autonomous_walking", label: "Marcha Autônoma", checked: getBooleanValue("autonomous_walking"), onChange: (v) => updateField("autonomous_walking", v) },
              { id: "fine_motor_dev", label: "Desenvolvimento Motor Fino", checked: getBooleanValue("fine_motor_dev"), onChange: (v) => updateField("fine_motor_dev", v) },
              { id: "broad_motor_dev", label: "Desenvolvimento Motor Amplo", checked: getBooleanValue("broad_motor_dev"), onChange: (v) => updateField("broad_motor_dev", v) },
            ]}
          />
          
          <ModernCheckboxGrid
            title="Desenvolvimento da Linguagem"
            fields={[
              { id: "babbling", label: "Balbucios", checked: getBooleanValue("babbling"), onChange: (v) => updateField("babbling", v), icon: MessageCircle },
              { id: "first_words", label: "Primeiras Palavras", checked: getBooleanValue("first_words"), onChange: (v) => updateField("first_words", v), icon: MessageCircle },
              { id: "simple_phrases", label: "Frases Simples", checked: getBooleanValue("simple_phrases"), onChange: (v) => updateField("simple_phrases", v), icon: MessageCircle },
              { id: "echolalia", label: "Ecolalia", checked: getBooleanValue("echolalia"), onChange: (v) => updateField("echolalia", v), icon: MessageCircle },
              { id: "nonverbal_communication", label: "Comunicação Não-verbal", checked: getBooleanValue("nonverbal_communication"), onChange: (v) => updateField("nonverbal_communication", v), icon: Hand },
              { id: "verbal_language_absence", label: "Ausência de Linguagem Verbal", checked: getBooleanValue("verbal_language_absence"), onChange: (v) => updateField("verbal_language_absence", v), icon: AlertTriangle },
            ]}
          />
        </div>
      </CollapsibleSection>

      {/* SEÇÃO 10: Aspectos Comportamentais e Emocionais */}
      <CollapsibleSection
        title="Aspectos Comportamentais e Emocionais"
        icon={Heart}
        sectionNumber={10}
        isComplete={isSectionComplete(section10Fields)}
      >
        <div className="space-y-6">
          <ModernCheckboxGrid
            title="Comportamento Social"
            fields={[
              { id: "visual_contact", label: "Contato Visual", checked: getBooleanValue("visual_contact"), onChange: (v) => updateField("visual_contact", v), icon: Eye },
              { id: "shared_play", label: "Brincadeira Compartilhada", checked: getBooleanValue("shared_play"), onChange: (v) => updateField("shared_play", v), icon: Users },
              { id: "peer_interaction", label: "Interação com Pares", checked: getBooleanValue("peer_interaction"), onChange: (v) => updateField("peer_interaction", v), icon: Users },
              { id: "stereotyped_behavior", label: "Comportamentos Estereotipados", checked: getBooleanValue("stereotyped_behavior"), onChange: (v) => updateField("stereotyped_behavior", v), icon: Activity },
              { id: "social_isolation", label: "Isolamento Social", checked: getBooleanValue("social_isolation"), onChange: (v) => updateField("social_isolation", v), icon: AlertTriangle },
              { id: "restricted_interests", label: "Interesses Restritos", checked: getBooleanValue("restricted_interests"), onChange: (v) => updateField("restricted_interests", v), icon: Brain },
            ]}
          />
          
          <ModernCheckboxGrid
            title="Regulação Emocional"
            columns={2}
            fields={[
              { id: "irritability", label: "Irritabilidade", checked: getBooleanValue("irritability"), onChange: (v) => updateField("irritability", v), icon: AlertTriangle },
              { id: "heteroaggressive", label: "Heteroagressividade", checked: getBooleanValue("heteroaggressive"), onChange: (v) => updateField("heteroaggressive", v), icon: AlertTriangle },
              { id: "emotional_ability", label: "Capacidade Emocional Adequada", checked: getBooleanValue("emotional_ability"), onChange: (v) => updateField("emotional_ability", v), icon: Heart },
              { id: "anxiety", label: "Ansiedade", checked: getBooleanValue("anxiety"), onChange: (v) => updateField("anxiety", v), icon: AlertTriangle },
              { id: "frequent_crying", label: "Choro Frequente", checked: getBooleanValue("frequent_crying"), onChange: (v) => updateField("frequent_crying", v), icon: Heart },
              { id: "low_frustration_tolerance", label: "Baixa Tolerância à Frustração", checked: getBooleanValue("low_frustration_tolerance"), onChange: (v) => updateField("low_frustration_tolerance", v), icon: AlertTriangle },
            ]}
          />
          
          <AutoExpandTextarea
            id="regulation_strategies"
            label="Estratégias de Regulação que Funcionam"
            value={getStringValue("regulation_strategies")}
            onChange={(value) => updateField("regulation_strategies", value)}
            placeholder="Descreva estratégias que ajudam a acalmar ou regular o paciente..."
            icon={Heart}
          />
          <AutoExpandTextarea
            id="calming_strategies"
            label="Estratégias Utilizadas para Acalmar"
            value={getStringValue("calming_strategies")}
            onChange={(value) => updateField("calming_strategies", value)}
            placeholder="Quais estratégias vocês utilizam para acalmar o paciente em momentos de crise ou agitação?..."
            icon={Heart}
          />
        </div>
      </CollapsibleSection>

      {/* SEÇÃO 11: Contexto Social e Escolar */}
      <CollapsibleSection
        title="Contexto Social e Escolar"
        icon={School}
        sectionNumber={11}
        isComplete={isSectionComplete(section11Fields)}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AutoExpandTextarea
              id="school_enrollment"
              label="Matrícula Escolar"
              value={getStringValue("school_enrollment")}
              onChange={(value) => updateField("school_enrollment", value)}
              placeholder="Informações sobre escola, série, tipo de ensino..."
              icon={School}
              minRows={2}
            />
            <AutoExpandTextarea
              id="school_adaptation"
              label="Adaptação Escolar"
              value={getStringValue("school_adaptation")}
              onChange={(value) => updateField("school_adaptation", value)}
              placeholder="Descreva como está a adaptação escolar..."
              minRows={2}
            />
          </div>
          <AutoExpandTextarea
            id="extracurricular_activities"
            label="Atividades Extracurriculares"
            value={getStringValue("extracurricular_activities")}
            onChange={(value) => updateField("extracurricular_activities", value)}
            placeholder="Liste atividades extras: esportes, artes, terapias complementares..."
          />
          <AutoExpandTextarea
            id="family_support_network"
            label="Rede de Apoio Familiar"
            value={getStringValue("family_support_network")}
            onChange={(value) => updateField("family_support_network", value)}
            placeholder="Descreva a rede de apoio: familiares envolvidos, cuidadores, rotina de cuidados..."
            icon={Users}
          />
        </div>
      </CollapsibleSection>

      {/* Objetivos Terapêuticos */}
      <CollapsibleSection
        title="Objetivos Terapêuticos"
        icon={Activity}
        sectionNumber={12}
        defaultOpen={false}
        isComplete={Boolean(getStringValue("therapeutic_goals"))}
        hasErrors={getSectionErrors ? getSectionErrors(12).length > 0 : false}
        errorCount={getSectionErrors ? getSectionErrors(12).length : 0}
      >
        <div className="space-y-6">
          <AutoExpandTextarea
            id="therapeutic_goals"
            label="Objetivos Terapêuticos Propostos"
            value={getStringValue("therapeutic_goals")}
            onChange={(value) => updateField("therapeutic_goals", value)}
            placeholder="Defina os objetivos terapêuticos iniciais baseados na avaliação..."
            icon={Activity}
            required
            hint="Baseie-se nos dados coletados para traçar objetivos claros e mensuráveis"
            error={fieldErrors["therapeutic_goals"]}
            hasError={!!fieldErrors["therapeutic_goals"]}
          />
          <AutoExpandTextarea
            id="treatment_approach"
            label="Abordagem de Tratamento"
            value={getStringValue("treatment_approach")}
            onChange={(value) => updateField("treatment_approach", value)}
            placeholder="Descreva a abordagem musicoterapêutica a ser utilizada..."
            icon={Music}
          />
        </div>
      </CollapsibleSection>
    </div>
  );
}
