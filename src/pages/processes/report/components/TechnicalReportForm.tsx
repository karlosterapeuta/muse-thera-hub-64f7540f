
import { FormSection } from "@/pages/anamnesis/components/FormSection";

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
      <FormSection
        title="Dados do Relatório"
        fields={[
          {
            key: "report_date",
            label: "Data do Relatório",
            placeholder: "dd/mm/aaaa",
            value: content.report_date || "",
            onChange: (value) => handleFieldChange("report_date", value),
          },
          {
            key: "purpose",
            label: "Finalidade",
            placeholder: "Finalidade do relatório técnico",
            value: content.purpose || "",
            onChange: (value) => handleFieldChange("purpose", value),
          },
        ]}
      />

      <FormSection
        title="Avaliação Técnica"
        fields={[
          {
            key: "technical_assessment",
            label: "Avaliação",
            placeholder: "Avaliação técnica detalhada",
            value: content.technical_assessment || "",
            onChange: (value) => handleFieldChange("technical_assessment", value),
          },
          {
            key: "methodology",
            label: "Metodologia",
            placeholder: "Metodologia utilizada",
            value: content.methodology || "",
            onChange: (value) => handleFieldChange("methodology", value),
          },
        ]}
      />

      <FormSection
        title="Conclusão"
        fields={[
          {
            key: "conclusions",
            label: "Conclusões",
            placeholder: "Conclusões técnicas",
            value: content.conclusions || "",
            onChange: (value) => handleFieldChange("conclusions", value),
          },
          {
            key: "recommendations",
            label: "Recomendações",
            placeholder: "Recomendações técnicas",
            value: content.recommendations || "",
            onChange: (value) => handleFieldChange("recommendations", value),
          },
        ]}
      />
    </div>
  );
}
