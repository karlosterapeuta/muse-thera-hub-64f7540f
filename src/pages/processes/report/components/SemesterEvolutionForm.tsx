
import { FormSection } from "@/pages/anamnesis/components/FormSection";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function SemesterEvolutionForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      <FormSection
        title="Período"
        fields={[
          {
            key: "semester",
            label: "Semestre/Ano",
            placeholder: "Ex: 1º/2024",
            value: content.semester || "",
            onChange: (value) => handleFieldChange("semester", value),
          },
        ]}
      />

      <FormSection
        title="Avaliação Geral"
        fields={[
          {
            key: "overall_progress",
            label: "Progresso Geral",
            placeholder: "Descreva o progresso geral do semestre",
            value: content.overall_progress || "",
            onChange: (value) => handleFieldChange("overall_progress", value),
          },
          {
            key: "therapeutic_goals",
            label: "Objetivos Terapêuticos",
            placeholder: "Avaliação dos objetivos terapêuticos",
            value: content.therapeutic_goals || "",
            onChange: (value) => handleFieldChange("therapeutic_goals", value),
          },
        ]}
      />

      <FormSection
        title="Recomendações"
        fields={[
          {
            key: "recommendations",
            label: "Recomendações",
            placeholder: "Recomendações para o próximo semestre",
            value: content.recommendations || "",
            onChange: (value) => handleFieldChange("recommendations", value),
          },
        ]}
      />
    </div>
  );
}
