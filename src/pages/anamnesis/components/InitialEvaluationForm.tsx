
import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox";
import { CheckboxSection } from "./CheckboxSection";
import { FormSection } from "./FormSection";
import { Label } from "@/components/ui/label";
import { SelectField } from "./SelectField";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface InitialEvaluationFormProps {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
}

export function InitialEvaluationForm({ content, onChange }: InitialEvaluationFormProps) {
  const updateField = (key: string, value: any) => {
    onChange({ ...content, [key]: value });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateField(name, value);
  };

  return (
    <div className="space-y-6">
      <FormSection title="Dados Pessoais">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="legal_guardian">Responsável Legal</Label>
            <Input
              id="legal_guardian"
              name="legal_guardian"
              value={content.legal_guardian || ""}
              onChange={handleTextChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="family_relationship">Parentesco</Label>
            <Input
              id="family_relationship"
              name="family_relationship"
              value={content.family_relationship || ""}
              onChange={handleTextChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="referral_professional">Profissional que Encaminhou</Label>
            <Input
              id="referral_professional"
              name="referral_professional"
              value={content.referral_professional || ""}
              onChange={handleTextChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="main_clinical_demand">Demanda Clínica Principal</Label>
            <Textarea
              id="main_clinical_demand"
              name="main_clinical_demand"
              value={content.main_clinical_demand || ""}
              onChange={handleTextChange}
              className="min-h-[80px]"
            />
          </div>
        </div>
      </FormSection>

      <CheckboxSection 
        title="Histórico Musical" 
        items={[
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
        items={[
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
        items={[
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
        items={[
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
        items={[
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
        items={[
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
        items={[
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
        items={[
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
        title="Saúde" 
        items={[
          {
            id: "autism_spectrum",
            label: "Transtorno do Espectro Autista",
            checked: content.autism_spectrum || false,
            onChange: (value) => updateField("autism_spectrum", value),
          },
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
            id: "adhd",
            label: "TDAH",
            checked: content.adhd || false,
            onChange: (value) => updateField("adhd", value),
          },
          {
            id: "chronic_encephalopathy",
            label: "Encefalopatia Crônica",
            checked: content.chronic_encephalopathy || false,
            onChange: (value) => updateField("chronic_encephalopathy", value),
          },
          {
            id: "anxiety_disorders",
            label: "Transtornos de Ansiedade",
            checked: content.anxiety_disorders || false,
            onChange: (value) => updateField("anxiety_disorders", value),
          },
          {
            id: "other_diagnoses",
            label: "Outros Diagnósticos",
            checked: content.other_diagnoses || false,
            onChange: (value) => updateField("other_diagnoses", value),
          },
          {
            id: "alzheimer",
            label: "Alzheimer",
            checked: content.alzheimer || false,
            onChange: (value) => updateField("alzheimer", value),
          },
        ]}
      />

      <CheckboxSection 
        title="Medicação e Terapias" 
        items={[
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
          // Removemos as opções que não existem no banco de dados
        ]}
      />

      <FormSection title="Medicação">
        <div className="space-y-2">
          <Label htmlFor="current_medication">Medicação Atual</Label>
          <Textarea
            id="current_medication"
            name="current_medication"
            value={content.current_medication || ""}
            onChange={handleTextChange}
            className="min-h-[100px]"
          />
        </div>
      </FormSection>

      <FormSection title="Aspectos Sociais">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="school_enrollment">Matrícula Escolar</Label>
            <Input
              id="school_enrollment"
              name="school_enrollment"
              value={content.school_enrollment || ""}
              onChange={handleTextChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="school_adaptation">Adaptação Escolar</Label>
            <Textarea
              id="school_adaptation"
              name="school_adaptation"
              value={content.school_adaptation || ""}
              onChange={handleTextChange}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="extracurricular_activities">Atividades Extracurriculares</Label>
            <Textarea
              id="extracurricular_activities"
              name="extracurricular_activities"
              value={content.extracurricular_activities || ""}
              onChange={handleTextChange}
              className="min-h-[100px]"
            />
          </div>
        </div>
      </FormSection>
    </div>
  );
}
