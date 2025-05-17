
import { FormSection } from "@/pages/anamnesis/components/FormSection";
import { SelectField } from "@/pages/anamnesis/components/SelectField";
import { CheckboxSection } from "@/pages/anamnesis/components/CheckboxSection";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function InitialEvaluationForm({ content, onChange }: FormProps) {
  // Ensure proper boolean handling for all fields
  const updateField = (field: string, value: string | boolean) => {
    onChange({ ...content, [field]: value });
    console.log(`Report form - Field ${field} updated with value:`, value);
  };

  const musicalEngagementOptions = [
    { value: "high", label: "Alto engajamento com atividades musicais" },
    { value: "moderate", label: "Engajamento moderado" },
    { value: "low", label: "Baixo engajamento" },
    { value: "variable", label: "Engajamento variável" },
  ];

  const musicalPreferenceOptions = [
    { value: "receptive", label: "Predominantemente receptivo" },
    { value: "active", label: "Predominantemente ativo" },
    { value: "mixed", label: "Misto" },
  ];

  return (
    <div className="space-y-6">
      <SelectField
        label="Nível de Engajamento Musical"
        value={content.musicalEngagement || ""}
        onChange={(value) => updateField("musicalEngagement", value)}
        options={musicalEngagementOptions}
      />
      
      <SelectField
        label="Perfil de Preferência Musical"
        value={content.musicalPreference || ""}
        onChange={(value) => updateField("musicalPreference", value)}
        options={musicalPreferenceOptions}
      />

      <CheckboxSection
        title="Medicação e Terapias"
        fields={[
          {
            id: "psychomotricity",
            label: "Psicomotricidade",
            checked: Boolean(content.psychomotricity),
            onChange: (value) => updateField("psychomotricity", value),
          },
          {
            id: "music_therapy",
            label: "Musicoterapia",
            checked: Boolean(content.music_therapy),
            onChange: (value) => updateField("music_therapy", value),
          },
          {
            id: "nutrition",
            label: "Nutrição",
            checked: Boolean(content.nutrition),
            onChange: (value) => updateField("nutrition", value),
          },
          {
            id: "aba_therapy",
            label: "Terapia ABA",
            checked: Boolean(content.aba_therapy),
            onChange: (value) => updateField("aba_therapy", value),
          },
          {
            id: "sensory_integration",
            label: "Integração Sensorial",
            checked: Boolean(content.sensory_integration),
            onChange: (value) => updateField("sensory_integration", value),
          },
        ]}
      />

      <CheckboxSection
        title="Transtornos Mentais"
        fields={[
          {
            id: "alzheimer",
            label: "Alzheimer",
            checked: Boolean(content.alzheimer),
            onChange: (value) => updateField("alzheimer", value),
          },
        ]}
      />

      <FormSection
        title="Avaliação Inicial"
        fields={[
          {
            key: "initialObservations",
            label: "Observações Iniciais",
            placeholder: "Registre as observações iniciais do paciente",
            value: content.initialObservations || "",
            onChange: (value) => updateField("initialObservations", value),
          },
          {
            key: "musicalHistory",
            label: "História Musical",
            placeholder: "Descreva a história e experiências musicais do paciente",
            value: content.musicalHistory || "",
            onChange: (value) => updateField("musicalHistory", value),
          },
          {
            key: "therapeuticPotential",
            label: "Potencial Terapêutico",
            placeholder: "Avalie o potencial terapêutico observado",
            value: content.therapeuticPotential || "",
            onChange: (value) => updateField("therapeuticPotential", value),
          },
        ]}
      />
    </div>
  );
}
