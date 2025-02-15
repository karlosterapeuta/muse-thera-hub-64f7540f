
import { FormSection } from "@/pages/anamnesis/components/FormSection";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function MonthlyEvolutionForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      <FormSection
        title="Período"
        fields={[
          {
            key: "month",
            label: "Mês/Ano",
            placeholder: "mm/aaaa",
            value: content.month || "",
            onChange: (value) => handleFieldChange("month", value),
          },
        ]}
      />

      <FormSection
        title="Evolução"
        fields={[
          {
            key: "development_areas",
            label: "Áreas de Desenvolvimento",
            placeholder: "Descreva as áreas trabalhadas",
            value: content.development_areas || "",
            onChange: (value) => handleFieldChange("development_areas", value),
          },
          {
            key: "progress",
            label: "Progressos Alcançados",
            placeholder: "Descreva os progressos observados",
            value: content.progress || "",
            onChange: (value) => handleFieldChange("progress", value),
          },
          {
            key: "challenges",
            label: "Desafios",
            placeholder: "Descreva os desafios encontrados",
            value: content.challenges || "",
            onChange: (value) => handleFieldChange("challenges", value),
          },
        ]}
      />
    </div>
  );
}
