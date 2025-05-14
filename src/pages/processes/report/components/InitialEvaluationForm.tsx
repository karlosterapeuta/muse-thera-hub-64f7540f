
import { FormSection } from "@/pages/anamnesis/components/FormSection";
import { SelectField } from "@/pages/anamnesis/components/SelectField";
import { toast } from "@/components/ui/use-toast";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function InitialEvaluationForm({ content, onChange }: FormProps) {
  const updateField = (field: string, value: string) => {
    onChange({ ...content, [field]: value });
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
