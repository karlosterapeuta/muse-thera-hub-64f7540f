
import { FormSection } from "@/pages/anamnesis/components/FormSection";
import { SelectField } from "@/pages/anamnesis/components/SelectField";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function DischargeSummaryForm({ content, onChange }: FormProps) {
  const updateField = (field: string, value: string) => {
    onChange({ ...content, [field]: value });
  };

  const treatmentOutcomeOptions = [
    { value: "objectives_met", label: "Objetivos Alcançados" },
    { value: "partial_success", label: "Sucesso Parcial" },
    { value: "limited_progress", label: "Progresso Limitado" },
    { value: "transfer", label: "Transferência de Tratamento" },
  ];

  return (
    <div className="space-y-6">
      <SelectField
        label="Resultado do Tratamento"
        value={content.treatmentOutcome || ""}
        onChange={(value) => updateField("treatmentOutcome", value)}
        options={treatmentOutcomeOptions}
      />

      <FormSection
        title="Resumo de Alta"
        fields={[
          {
            key: "treatmentSummary",
            label: "Resumo do Tratamento",
            placeholder: "Apresente um resumo do processo terapêutico",
            value: content.treatmentSummary || "",
            onChange: (value) => updateField("treatmentSummary", value),
          },
          {
            key: "achievedGoals",
            label: "Objetivos Alcançados",
            placeholder: "Liste os objetivos terapêuticos alcançados",
            value: content.achievedGoals || "",
            onChange: (value) => updateField("achievedGoals", value),
          },
          {
            key: "recommendations",
            label: "Recomendações",
            placeholder: "Forneça recomendações para continuidade do cuidado",
            value: content.recommendations || "",
            onChange: (value) => updateField("recommendations", value),
          },
        ]}
      />
    </div>
  );
}
