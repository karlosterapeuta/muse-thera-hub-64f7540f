
import { FormSection } from "@/pages/anamnesis/components/FormSection";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function GroupSessionForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      <FormSection
        title="Dados da Sessão em Grupo"
        fields={[
          {
            key: "date",
            label: "Data",
            placeholder: "dd/mm/aaaa",
            value: content.date || "",
            onChange: (value) => handleFieldChange("date", value),
          },
          {
            key: "participants",
            label: "Participantes",
            placeholder: "Nomes dos participantes",
            value: content.participants || "",
            onChange: (value) => handleFieldChange("participants", value),
          },
          {
            key: "theme",
            label: "Tema",
            placeholder: "Tema da sessão em grupo",
            value: content.theme || "",
            onChange: (value) => handleFieldChange("theme", value),
          },
        ]}
      />

      <FormSection
        title="Desenvolvimento"
        fields={[
          {
            key: "group_dynamics",
            label: "Dinâmica do Grupo",
            placeholder: "Descreva a dinâmica e interações do grupo",
            value: content.group_dynamics || "",
            onChange: (value) => handleFieldChange("group_dynamics", value),
          },
          {
            key: "activities",
            label: "Atividades Realizadas",
            placeholder: "Descreva as atividades realizadas",
            value: content.activities || "",
            onChange: (value) => handleFieldChange("activities", value),
          },
        ]}
      />

      <FormSection
        title="Avaliação"
        fields={[
          {
            key: "group_response",
            label: "Resposta do Grupo",
            placeholder: "Como o grupo respondeu às atividades",
            value: content.group_response || "",
            onChange: (value) => handleFieldChange("group_response", value),
          },
          {
            key: "observations",
            label: "Observações",
            placeholder: "Observações gerais sobre a sessão",
            value: content.observations || "",
            onChange: (value) => handleFieldChange("observations", value),
          },
        ]}
      />
    </div>
  );
}
