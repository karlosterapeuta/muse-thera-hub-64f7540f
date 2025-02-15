
import { FormSection } from "@/pages/anamnesis/components/FormSection";
import { SelectField } from "@/pages/anamnesis/components/SelectField";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function SessionSummaryForm({ content, onChange }: FormProps) {
  const updateField = (field: string, value: string) => {
    onChange({ ...content, [field]: value });
  };

  const participationOptions = [
    { value: "active", label: "Participação Ativa" },
    { value: "moderate", label: "Participação Moderada" },
    { value: "passive", label: "Participação Passiva" },
    { value: "resistant", label: "Resistente" },
  ];

  return (
    <div className="space-y-6">
      <SelectField
        label="Nível de Participação"
        value={content.participationLevel || ""}
        onChange={(value) => updateField("participationLevel", value)}
        options={participationOptions}
      />

      <FormSection
        title="Resumo da Sessão"
        fields={[
          {
            key: "musicalInterventions",
            label: "Intervenções Musicais",
            placeholder: "Descreva as intervenções musicais utilizadas",
            value: content.musicalInterventions || "",
            onChange: (value) => updateField("musicalInterventions", value),
          },
          {
            key: "responses",
            label: "Respostas Observadas",
            placeholder: "Registre as respostas do paciente às intervenções",
            value: content.responses || "",
            onChange: (value) => updateField("responses", value),
          },
          {
            key: "clinicalObservations",
            label: "Observações Clínicas",
            placeholder: "Anote observações clínicas relevantes",
            value: content.clinicalObservations || "",
            onChange: (value) => updateField("clinicalObservations", value),
          },
        ]}
      />
    </div>
  );
}
