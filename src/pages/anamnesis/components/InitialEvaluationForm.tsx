import { FormSection } from "./FormSection";
import { CheckboxSection } from "./CheckboxSection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function InitialEvaluationForm({ content, onChange }: FormProps) {
  const { t } = useTranslation('anamnesis');
  
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
        title={t('form.sections.personalData.title')}
        fields={[
          {
            key: "legal_guardian",
            label: t('form.sections.personalData.legalGuardian.label'),
            placeholder: t('form.sections.personalData.legalGuardian.placeholder'),
            value: content.legal_guardian || "",
            onChange: (value) => updateField("legal_guardian", value),
          },
          {
            key: "family_relationship",
            label: t('form.sections.personalData.familyRelationship.label'),
            placeholder: t('form.sections.personalData.familyRelationship.placeholder'),
            value: content.family_relationship || "",
            onChange: (value) => updateField("family_relationship", value),
          },
          {
            key: "referral_professional",
            label: t('form.sections.personalData.referralProfessional.label'),
            placeholder: t('form.sections.personalData.referralProfessional.placeholder'),
            value: content.referral_professional || "",
            onChange: (value) => updateField("referral_professional", value),
          },
          {
            key: "main_clinical_demand",
            label: t('form.sections.personalData.mainClinicalDemand.label'),
            placeholder: t('form.sections.personalData.mainClinicalDemand.placeholder'),
            value: content.main_clinical_demand || "",
            onChange: (value) => updateField("main_clinical_demand", value),
          },
        ]}
      />

      <CheckboxSection
        title={t('form.sections.musicalHistory.title')}
        fields={[
          {
            id: "musical_education",
            label: t('form.sections.musicalHistory.musicalEducation'),
            checked: content.musical_education || false,
            onChange: (value) => updateField("musical_education", value),
          },
          {
            id: "instrumental_practice",
            label: t('form.sections.musicalHistory.instrumentalPractice'),
            checked: content.instrumental_practice || false,
            onChange: (value) => updateField("instrumental_practice", value),
          },
          {
            id: "body_musical_expression",
            label: t('form.sections.musicalHistory.bodyMusicalExpression'),
            checked: content.body_musical_expression || false,
            onChange: (value) => updateField("body_musical_expression", value),
          },
          {
            id: "vocal_expression",
            label: t('form.sections.musicalHistory.vocalExpression'),
            checked: content.vocal_expression || false,
            onChange: (value) => updateField("vocal_expression", value),
          },
          {
            id: "choral_activities",
            label: t('form.sections.musicalHistory.choralActivities'),
            checked: content.choral_activities || false,
            onChange: (value) => updateField("choral_activities", value),
          },
          {
            id: "no_musical_experience",
            label: t('form.sections.musicalHistory.noMusicalExperience'),
            checked: content.no_musical_experience || false,
            onChange: (value) => updateField("no_musical_experience", value),
          },
        ]}
      />

      <FormSection
        title={t('form.sections.soundHistory.title')}
        fields={[
          {
            key: "pregnancy_sound_experiences",
            label: t('form.sections.soundHistory.pregnancySoundExperiences.label'),
            placeholder: t('form.sections.soundHistory.pregnancySoundExperiences.placeholder'),
            value: content.pregnancy_sound_experiences || "",
            onChange: (value) => updateField("pregnancy_sound_experiences", value),
          },
          {
            key: "mother_movements_songs",
            label: t('form.sections.soundHistory.motherMovementsSongs.label'),
            placeholder: t('form.sections.soundHistory.motherMovementsSongs.placeholder'),
            value: content.mother_movements_songs || "",
            onChange: (value) => updateField("mother_movements_songs", value),
          },
          {
            key: "childhood_sound_environment",
            label: t('form.sections.soundHistory.childhoodSoundEnvironment.label'),
            placeholder: t('form.sections.soundHistory.childhoodSoundEnvironment.placeholder'),
            value: content.childhood_sound_environment || "",
            onChange: (value) => updateField("childhood_sound_environment", value),
          },
          {
            key: "parents_sound_reactions",
            label: t('form.sections.soundHistory.parentsSoundReactions.label'),
            placeholder: t('form.sections.soundHistory.parentsSoundReactions.placeholder'),
            value: content.parents_sound_reactions || "",
            onChange: (value) => updateField("parents_sound_reactions", value),
          },
          {
            key: "typical_house_sounds",
            label: t('form.sections.soundHistory.typicalHouseSounds.label'),
            placeholder: t('form.sections.soundHistory.typicalHouseSounds.placeholder'),
            value: content.typical_house_sounds || "",
            onChange: (value) => updateField("typical_house_sounds", value),
          },
          {
            key: "night_body_sounds",
            label: t('form.sections.soundHistory.nightBodySounds.label'),
            placeholder: t('form.sections.soundHistory.nightBodySounds.placeholder'),
            value: content.night_body_sounds || "",
            onChange: (value) => updateField("night_body_sounds", value),
          },
          {
            key: "family_musical_history",
            label: t('form.sections.soundHistory.familyMusicalHistory.label'),
            placeholder: t('form.sections.soundHistory.familyMusicalHistory.placeholder'),
            value: content.family_musical_history || "",
            onChange: (value) => updateField("family_musical_history", value),
          },
          {
            key: "patient_musical_history",
            label: t('form.sections.soundHistory.patientMusicalHistory.label'),
            placeholder: t('form.sections.soundHistory.patientMusicalHistory.placeholder'),
            value: content.patient_musical_history || "",
            onChange: (value) => updateField("patient_musical_history", value),
          },
        ]}
      />

      <CheckboxSection
        title={t('form.sections.musicalBehavior.title')}
        fields={[
          {
            id: "active_musical_listening",
            label: t('form.sections.musicalBehavior.activeMusicalListening'),
            checked: content.active_musical_listening || false,
            onChange: (value) => updateField("active_musical_listening", value),
          },
          {
            id: "body_expression",
            label: t('form.sections.musicalBehavior.bodyExpression'),
            checked: content.body_expression || false,
            onChange: (value) => updateField("body_expression", value),
          },
          {
            id: "sound_responsiveness",
            label: t('form.sections.musicalBehavior.soundResponsiveness'),
            checked: content.sound_responsiveness || false,
            onChange: (value) => updateField("sound_responsiveness", value),
          },
          {
            id: "spontaneous_vocal",
            label: t('form.sections.musicalBehavior.spontaneousVocal'),
            checked: content.spontaneous_vocal || false,
            onChange: (value) => updateField("spontaneous_vocal", value),
          },
          {
            id: "instrumental_exploration",
            label: t('form.sections.musicalBehavior.instrumentalExploration'),
            checked: content.instrumental_exploration || false,
            onChange: (value) => updateField("instrumental_exploration", value),
          },
          {
            id: "adverse_sound_reactivity",
            label: t('form.sections.musicalBehavior.adverseSoundReactivity'),
            checked: content.adverse_sound_reactivity || false,
            onChange: (value) => updateField("adverse_sound_reactivity", value),
          },
        ]}
      />

      <CheckboxSection
        title={t('form.sections.soundProcessing.title')}
        fields={[
          {
            id: "auditory_hypersensitivity",
            label: t('form.sections.musicalBehavior.auditoryHypersensitivity'),
            checked: content.auditory_hypersensitivity || false,
            onChange: (value) => updateField("auditory_hypersensitivity", value),
          },
          {
            id: "positive_musical_response",
            label: t('form.sections.musicalBehavior.positiveMusicalResponse'),
            checked: content.positive_musical_response || false,
            onChange: (value) => updateField("positive_musical_response", value),
          },
          {
            id: "nominal_call_response",
            label: t('form.sections.emotionalRegulation.nominalCallResponse'),
            checked: content.nominal_call_response || false,
            onChange: (value) => updateField("nominal_call_response", value),
          },
          {
            id: "active_sound_search",
            label: t('form.sections.musicalBehavior.activeSoundSearch'),
            checked: content.active_sound_search || false,
            onChange: (value) => updateField("active_sound_search", value),
          },
          {
            id: "specific_sound_aversion",
            label: t('form.sections.musicalBehavior.specificSoundAversion'),
            checked: content.specific_sound_aversion || false,
            onChange: (value) => updateField("specific_sound_aversion", value),
          },
          {
            id: "sound_source_location",
            label: t('form.sections.musicalBehavior.soundSourceLocation'),
            checked: content.sound_source_location || false,
            onChange: (value) => updateField("sound_source_location", value),
          },
        ]}
      />

      <CheckboxSection
        title={t('form.sections.musicalPreferences.title')}
        fields={[
          {
            id: "children_repertoire",
            label: t('form.sections.musicalPreferences.childrenRepertoire'),
            checked: content.children_repertoire || false,
            onChange: (value) => updateField("children_repertoire", value),
          },
          {
            id: "rock_genre",
            label: t('form.sections.musicalPreferences.rockGenre'),
            checked: content.rock_genre || false,
            onChange: (value) => updateField("rock_genre", value),
          },
          {
            id: "sacred_gospel",
            label: t('form.sections.musicalPreferences.sacredGospel'),
            checked: content.sacred_gospel || false,
            onChange: (value) => updateField("sacred_gospel", value),
          },
          {
            id: "brazilian_popular",
            label: t('form.sections.musicalPreferences.brazilianPopular'),
            checked: content.brazilian_popular || false,
            onChange: (value) => updateField("brazilian_popular", value),
          },
          {
            id: "country_music",
            label: t('form.sections.musicalPreferences.countryMusic'),
            checked: content.country_music || false,
            onChange: (value) => updateField("country_music", value),
          },
          {
            id: "classical_music",
            label: t('form.sections.musicalPreferences.classicalMusic'),
            checked: content.classical_music || false,
            onChange: (value) => updateField("classical_music", value),
          },
          {
            id: "other_musical_genres",
            label: t('form.sections.musicalPreferences.otherMusicalGenres'),
            checked: content.other_musical_genres || false,
            onChange: (value) => updateField("other_musical_genres", value),
          },
        ]}
      />

      <CheckboxSection
        title={t('form.sections.development.title')}
        fields={[
          {
            id: "cervical_control",
            label: t('form.sections.development.cervicalControl'),
            checked: content.cervical_control || false,
            onChange: (value) => updateField("cervical_control", value),
          },
          {
            id: "crawling_pattern",
            label: t('form.sections.development.crawlingPattern'),
            checked: content.crawling_pattern || false,
            onChange: (value) => updateField("crawling_pattern", value),
          },
          {
            id: "fine_motor_dev",
            label: t('form.sections.development.fineMotorDev'),
            checked: content.fine_motor_dev || false,
            onChange: (value) => updateField("fine_motor_dev", value),
          },
          {
            id: "independent_sitting",
            label: t('form.sections.development.independentSitting'),
            checked: content.independent_sitting || false,
            onChange: (value) => updateField("independent_sitting", value),
          },
          {
            id: "autonomous_walking",
            label: t('form.sections.development.autonomousWalking'),
            checked: content.autonomous_walking || false,
            onChange: (value) => updateField("autonomous_walking", value),
          },
          {
            id: "broad_motor_dev",
            label: t('form.sections.development.broadMotorDev'),
            checked: content.broad_motor_dev || false,
            onChange: (value) => updateField("broad_motor_dev", value),
          },
        ]}
      />

      <CheckboxSection
        title={t('form.sections.languageDevelopment.title')}
        fields={[
          {
            id: "babbling",
            label: t('form.sections.languageDevelopment.babbling'),
            checked: content.babbling || false,
            onChange: (value) => updateField("babbling", value),
          },
          {
            id: "simple_phrases",
            label: t('form.sections.languageDevelopment.simplePhrases'),
            checked: content.simple_phrases || false,
            onChange: (value) => updateField("simple_phrases", value),
          },
          {
            id: "echolalia",
            label: t('form.sections.languageDevelopment.echolalia'),
            checked: content.echolalia || false,
            onChange: (value) => updateField("echolalia", value),
          },
          {
            id: "first_words",
            label: t('form.sections.languageDevelopment.firstWords'),
            checked: content.first_words || false,
            onChange: (value) => updateField("first_words", value),
          },
          {
            id: "nonverbal_communication",
            label: t('form.sections.languageDevelopment.nonverbalCommunication'),
            checked: content.nonverbal_communication || false,
            onChange: (value) => updateField("nonverbal_communication", value),
          },
          {
            id: "verbal_language_absence",
            label: t('form.sections.languageDevelopment.verbalLanguageAbsence'),
            checked: content.verbal_language_absence || false,
            onChange: (value) => updateField("verbal_language_absence", value),
          },
        ]}
      />

      <CheckboxSection
        title={t('form.sections.behavior.title')}
        fields={[
          {
            id: "visual_contact",
            label: t('form.sections.emotionalRegulation.visualContact'),
            checked: content.visual_contact || false,
            onChange: (value) => updateField("visual_contact", value),
          },
          {
            id: "shared_play",
            label: t('form.sections.emotionalRegulation.sharedPlay'),
            checked: content.shared_play || false,
            onChange: (value) => updateField("shared_play", value),
          },
          {
            id: "stereotyped_behavior",
            label: t('form.sections.behavior.stereotypedBehavior'),
            checked: content.stereotyped_behavior || false,
            onChange: (value) => updateField("stereotyped_behavior", value),
          },
          {
            id: "peer_interaction",
            label: t('form.sections.emotionalRegulation.peerInteraction'),
            checked: content.peer_interaction || false,
            onChange: (value) => updateField("peer_interaction", value),
          },
          {
            id: "social_isolation",
            label: t('form.sections.otherConditions.socialIsolation'),
            checked: content.social_isolation || false,
            onChange: (value) => updateField("social_isolation", value),
          },
          {
            id: "restricted_interests",
            label: t('form.sections.behavior.restrictedInterests'),
            checked: content.restricted_interests || false,
            onChange: (value) => updateField("restricted_interests", value),
          },
        ]}
      />

      <CheckboxSection
        title={t('form.sections.emotionalRegulation.title')}
        fields={[
          {
            id: "irritability",
            label: t('form.sections.behavior.irritability'),
            checked: content.irritability || false,
            onChange: (value) => updateField("irritability", value),
          },
          {
            id: "heteroaggressive",
            label: t('form.sections.behavior.heteroaggressive'),
            checked: content.heteroaggressive || false,
            onChange: (value) => updateField("heteroaggressive", value),
          },
          {
            id: "emotional_ability",
            label: t('form.sections.emotionalRegulation.emotionalAbility'),
            checked: content.emotional_ability || false,
            onChange: (value) => updateField("emotional_ability", value),
          },
          {
            id: "anxiety",
            label: t('form.sections.emotionalRegulation.anxiety'),
            checked: content.anxiety || false,
            onChange: (value) => updateField("anxiety", value),
          },
          {
            id: "frequent_crying",
            label: t('form.sections.behavior.frequentCrying'),
            checked: content.frequent_crying || false,
            onChange: (value) => updateField("frequent_crying", value),
          },
          {
            id: "low_frustration_tolerance",
            label: t('form.sections.behavior.lowFrustrationTolerance'),
            checked: content.low_frustration_tolerance || false,
            onChange: (value) => updateField("low_frustration_tolerance", value),
          },
        ]}
      />

      <CheckboxSection
        title={t('form.sections.mentalDisorders.title')}
        fields={[
          {
            id: "autism_spectrum",
            label: t('form.sections.mentalDisorders.autismSpectrum'),
            checked: getBooleanValue("autism_spectrum"),
            onChange: (value) => updateField("autism_spectrum", value),
          },
          {
            id: "adhd",
            label: t('form.sections.mentalDisorders.adhd'),
            checked: getBooleanValue("adhd"),
            onChange: (value) => updateField("adhd", value),
          },
          {
            id: "anxiety_disorders",
            label: t('form.sections.mentalDisorders.anxietyDisorders'),
            checked: getBooleanValue("anxiety_disorders"),
            onChange: (value) => updateField("anxiety_disorders", value),
          },
          {
            id: "intellectual_disability",
            label: t('form.sections.mentalDisorders.intellectualDisability'),
            checked: getBooleanValue("intellectual_disability"),
            onChange: (value) => updateField("intellectual_disability", value),
          },
          {
            id: "down_syndrome",
            label: t('form.sections.mentalDisorders.downSyndrome'),
            checked: getBooleanValue("down_syndrome"),
            onChange: (value) => updateField("down_syndrome", value),
          },
          {
            id: "chronic_encephalopathy",
            label: t('form.sections.mentalDisorders.chronicEncephalopathy'),
            checked: getBooleanValue("chronic_encephalopathy"),
            onChange: (value) => updateField("chronic_encephalopathy", value),
          },
          {
            id: "other_diagnoses",
            label: t('form.sections.mentalDisorders.otherDiagnoses'),
            checked: getBooleanValue("other_diagnoses"),
            onChange: (value) => updateField("other_diagnoses", value),
          },
        ]}
      />

      <FormSection
        title={t('form.sections.medication.title')}
        fields={[
          {
            key: "current_medication",
            label: t('form.sections.medication.currentMedication.label'),
            placeholder: t('form.sections.medication.currentMedication.placeholder'),
            value: content.current_medication || "",
            onChange: (value) => updateField("current_medication", value),
          },
        ]}
      />

      <CheckboxSection
        title={t('form.sections.therapies.title')}
        fields={[
          {
            id: "speech_therapy",
            label: t('form.sections.therapies.speechTherapy'),
            checked: content.speech_therapy || false,
            onChange: (value) => updateField("speech_therapy", value),
          },
          {
            id: "occupational_therapy",
            label: t('form.sections.therapies.occupationalTherapy'),
            checked: content.occupational_therapy || false,
            onChange: (value) => updateField("occupational_therapy", value),
          },
          {
            id: "physiotherapy",
            label: t('form.sections.therapies.physiotherapy'),
            checked: content.physiotherapy || false,
            onChange: (value) => updateField("physiotherapy", value),
          },
          {
            id: "psychological_support",
            label: t('form.sections.therapies.psychologicalSupport'),
            checked: content.psychological_support || false,
            onChange: (value) => updateField("psychological_support", value),
          },
          {
            id: "psychopedagogical",
            label: t('form.sections.therapies.psychopedagogical'),
            checked: content.psychopedagogical || false,
            onChange: (value) => updateField("psychopedagogical", value),
          },
          {
            id: "equine_therapy",
            label: t('form.sections.therapies.equineTherapy'),
            checked: content.equine_therapy || false,
            onChange: (value) => updateField("equine_therapy", value),
          },
        ]}
      />

      <FormSection
        title={t('form.sections.socialAspects.title')}
        fields={[
          {
            key: "school_enrollment",
            label: t('form.sections.socialAspects.schoolEnrollment.label'),
            placeholder: t('form.sections.socialAspects.schoolEnrollment.placeholder'),
            value: content.school_enrollment || "",
            onChange: (value) => updateField("school_enrollment", value),
          },
          {
            key: "school_adaptation",
            label: t('form.sections.socialAspects.schoolAdaptation.label'),
            placeholder: t('form.sections.socialAspects.schoolAdaptation.placeholder'),
            value: content.school_adaptation || "",
            onChange: (value) => updateField("school_adaptation", value),
          },
          {
            key: "extracurricular_activities",
            label: t('form.sections.socialAspects.extracurricularActivities.label'),
            placeholder: t('form.sections.socialAspects.extracurricularActivities.placeholder'),
            value: content.extracurricular_activities || "",
            onChange: (value) => updateField("extracurricular_activities", value),
          },
        ]}
      />
    </div>
  );
}
