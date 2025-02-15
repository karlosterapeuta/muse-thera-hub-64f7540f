import { FormSection } from "@/pages/anamnesis/components/FormSection";
import { DateField } from "./DateField";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function TechnicalReportForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <DateField
          label="Data do Relatório"
          value={content.report_date || ""}
          onChange={(value) => handleFieldChange("report_date", value)}
        />
      </div>

      <FormSection
        title="Detalhes do Relatório"
        fields={[
          {
            key: "summary",
            label: "Resumo",
            placeholder: "Descreva o resumo do relatório",
            value: content.summary || "",
            onChange: (value) => handleFieldChange("summary", value),
          },
          {
            key: "observations",
            label: "Observações",
            placeholder: "Anote observações relevantes",
            value: content.observations || "",
            onChange: (value) => handleFieldChange("observations", value),
          },
          {
            key: "recommendations",
            label: "Recomendações",
            placeholder: "Liste as recomendações",
            value: content.recommendations || "",
            onChange: (value) => handleFieldChange("recommendations", value),
          },
        ]}
      />
    </div>
  );
}
