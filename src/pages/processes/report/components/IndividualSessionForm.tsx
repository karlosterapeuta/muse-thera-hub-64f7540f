
import { FormSection } from "@/pages/anamnesis/components/FormSection";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function IndividualSessionForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      <FormSection
        title="Dados da Sessão"
        fields={[
          {
            key: "data_session",
            label: "Data da Sessão",
            placeholder: "dd/mm/aaaa",
            value: content.data_session || "",
            onChange: (value) => handleFieldChange("data_session", value),
          },
          {
            key: "objectives",
            label: "Objetivos",
            placeholder: "Objetivos da sessão",
            value: content.objectives || "",
            onChange: (value) => handleFieldChange("objectives", value),
          },
        ]}
      />

      <FormSection
        title="Desenvolvimento"
        fields={[
          {
            key: "activities",
            label: "Atividades Realizadas",
            placeholder: "Descreva as atividades realizadas durante a sessão",
            value: content.activities || "",
            onChange: (value) => handleFieldChange("activities", value),
          },
          {
            key: "patient_response",
            label: "Resposta do Paciente",
            placeholder: "Como o paciente respondeu às atividades",
            value: content.patient_response || "",
            onChange: (value) => handleFieldChange("patient_response", value),
          },
        ]}
      />

      <FormSection
        title="Conclusão"
        fields={[
          {
            key: "observations",
            label: "Observações",
            placeholder: "Observações adicionais",
            value: content.observations || "",
            onChange: (value) => handleFieldChange("observations", value),
          },
          {
            key: "next_steps",
            label: "Próximos Passos",
            placeholder: "Planejamento para as próximas sessões",
            value: content.next_steps || "",
            onChange: (value) => handleFieldChange("next_steps", value),
          },
        ]}
      />
    </div>
  );
}
