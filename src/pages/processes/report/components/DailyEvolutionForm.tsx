
import { FormSection } from "@/pages/anamnesis/components/FormSection";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function DailyEvolutionForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      <FormSection
        title="Informações do Dia"
        fields={[
          {
            key: "date",
            label: "Data",
            placeholder: "dd/mm/aaaa",
            value: content.date || "",
            onChange: (value) => handleFieldChange("date", value),
          },
          {
            key: "emotional_state",
            label: "Estado Emocional",
            placeholder: "Descreva o estado emocional do paciente",
            value: content.emotional_state || "",
            onChange: (value) => handleFieldChange("emotional_state", value),
          },
        ]}
      />

      <FormSection
        title="Atividades e Comportamento"
        fields={[
          {
            key: "activities",
            label: "Atividades do Dia",
            placeholder: "Descreva as atividades realizadas",
            value: content.activities || "",
            onChange: (value) => handleFieldChange("activities", value),
          },
          {
            key: "behavior",
            label: "Comportamento",
            placeholder: "Descreva o comportamento observado",
            value: content.behavior || "",
            onChange: (value) => handleFieldChange("behavior", value),
          },
        ]}
      />

      <FormSection
        title="Observações"
        fields={[
          {
            key: "significant_events",
            label: "Eventos Significativos",
            placeholder: "Eventos importantes do dia",
            value: content.significant_events || "",
            onChange: (value) => handleFieldChange("significant_events", value),
          },
          {
            key: "notes",
            label: "Anotações Adicionais",
            placeholder: "Outras observações relevantes",
            value: content.notes || "",
            onChange: (value) => handleFieldChange("notes", value),
          },
        ]}
      />
    </div>
  );
}
