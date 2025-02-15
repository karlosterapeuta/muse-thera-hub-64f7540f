
import { FormSection } from "@/pages/anamnesis/components/FormSection";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function TeaScaleForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      <FormSection
        title="Dados da Avaliação"
        fields={[
          {
            key: "evaluation_date",
            label: "Data da Avaliação",
            placeholder: "dd/mm/aaaa",
            value: content.evaluation_date || "",
            onChange: (value) => handleFieldChange("evaluation_date", value),
          },
        ]}
      />

      <FormSection
        title="Áreas Avaliadas"
        fields={[
          {
            key: "social_interaction",
            label: "Interação Social",
            placeholder: "Avaliação da interação social",
            value: content.social_interaction || "",
            onChange: (value) => handleFieldChange("social_interaction", value),
          },
          {
            key: "communication",
            label: "Comunicação",
            placeholder: "Avaliação da comunicação",
            value: content.communication || "",
            onChange: (value) => handleFieldChange("communication", value),
          },
          {
            key: "behavior_patterns",
            label: "Padrões de Comportamento",
            placeholder: "Avaliação dos padrões de comportamento",
            value: content.behavior_patterns || "",
            onChange: (value) => handleFieldChange("behavior_patterns", value),
          },
        ]}
      />

      <FormSection
        title="Conclusão"
        fields={[
          {
            key: "conclusions",
            label: "Conclusões",
            placeholder: "Conclusões da avaliação",
            value: content.conclusions || "",
            onChange: (value) => handleFieldChange("conclusions", value),
          },
          {
            key: "recommendations",
            label: "Recomendações",
            placeholder: "Recomendações baseadas na avaliação",
            value: content.recommendations || "",
            onChange: (value) => handleFieldChange("recommendations", value),
          },
        ]}
      />
    </div>
  );
}
