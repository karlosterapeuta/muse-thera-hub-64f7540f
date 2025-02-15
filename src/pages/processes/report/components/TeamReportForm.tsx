
import { FormSection } from "@/pages/anamnesis/components/FormSection";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function TeamReportForm({ content, onChange }: FormProps) {
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
        title="Avaliação"
        fields={[
          {
            key: "clinical_evolution",
            label: "Evolução Clínica",
            placeholder: "Descrição da evolução clínica",
            value: content.clinical_evolution || "",
            onChange: (value) => handleFieldChange("clinical_evolution", value),
          },
          {
            key: "interventions",
            label: "Intervenções Realizadas",
            placeholder: "Descrição das intervenções",
            value: content.interventions || "",
            onChange: (value) => handleFieldChange("interventions", value),
          },
        ]}
      />

      <FormSection
        title="Recomendações"
        fields={[
          {
            key: "team_recommendations",
            label: "Recomendações para Equipe",
            placeholder: "Recomendações para a equipe multidisciplinar",
            value: content.team_recommendations || "",
            onChange: (value) => handleFieldChange("team_recommendations", value),
          },
        ]}
      />
    </div>
  );
}
