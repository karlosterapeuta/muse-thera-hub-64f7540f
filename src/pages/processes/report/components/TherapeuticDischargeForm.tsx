
import { FormSection } from "@/pages/anamnesis/components/FormSection";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function TherapeuticDischargeForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      <FormSection
        title="Dados da Alta"
        fields={[
          {
            key: "discharge_date",
            label: "Data da Alta",
            placeholder: "dd/mm/aaaa",
            value: content.discharge_date || "",
            onChange: (value) => handleFieldChange("discharge_date", value),
          },
        ]}
      />

      <FormSection
        title="Avaliação Final"
        fields={[
          {
            key: "treatment_summary",
            label: "Resumo do Tratamento",
            placeholder: "Resumo do processo terapêutico",
            value: content.treatment_summary || "",
            onChange: (value) => handleFieldChange("treatment_summary", value),
          },
          {
            key: "achieved_goals",
            label: "Objetivos Alcançados",
            placeholder: "Descreva os objetivos alcançados",
            value: content.achieved_goals || "",
            onChange: (value) => handleFieldChange("achieved_goals", value),
          },
        ]}
      />

      <FormSection
        title="Recomendações"
        fields={[
          {
            key: "recommendations",
            label: "Recomendações",
            placeholder: "Recomendações pós-alta",
            value: content.recommendations || "",
            onChange: (value) => handleFieldChange("recommendations", value),
          },
        ]}
      />
    </div>
  );
}
