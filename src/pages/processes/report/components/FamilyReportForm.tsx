
import { FormSection } from "@/pages/anamnesis/components/FormSection";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function FamilyReportForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      <FormSection
        title="Identificação"
        fields={[
          {
            key: "report_date",
            label: "Data do Relatório",
            placeholder: "dd/mm/aaaa",
            value: content.report_date || "",
            onChange: (value) => handleFieldChange("report_date", value),
          },
        ]}
      />

      <FormSection
        title="Evolução"
        fields={[
          {
            key: "progress_summary",
            label: "Resumo do Progresso",
            placeholder: "Resumo do progresso para a família",
            value: content.progress_summary || "",
            onChange: (value) => handleFieldChange("progress_summary", value),
          },
          {
            key: "achievements",
            label: "Conquistas",
            placeholder: "Principais conquistas alcançadas",
            value: content.achievements || "",
            onChange: (value) => handleFieldChange("achievements", value),
          },
        ]}
      />

      <FormSection
        title="Orientações"
        fields={[
          {
            key: "family_guidelines",
            label: "Orientações para a Família",
            placeholder: "Orientações e sugestões para a família",
            value: content.family_guidelines || "",
            onChange: (value) => handleFieldChange("family_guidelines", value),
          },
        ]}
      />
    </div>
  );
}
