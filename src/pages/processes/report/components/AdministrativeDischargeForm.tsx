import { FormSection } from "@/pages/anamnesis/components/FormSection";
import { DateField } from "./DateField";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function AdministrativeDischargeForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <DateField
          label="Data da Alta"
          value={content.discharge_date || ""}
          onChange={(value) => handleFieldChange("discharge_date", value)}
        />
      </div>

      <FormSection
        title="Informações da Alta"
        fields={[
          {
            key: "reason",
            label: "Motivo da Alta",
            placeholder: "Descreva o motivo da alta",
            value: content.reason || "",
            onChange: (value) => handleFieldChange("reason", value),
          },
          {
            key: "recommendations",
            label: "Recomendações",
            placeholder: "Anote as recomendações para o paciente",
            value: content.recommendations || "",
            onChange: (value) => handleFieldChange("recommendations", value),
          },
          {
            key: "follow_up",
            label: "Acompanhamento",
            placeholder: "Descreva o plano de acompanhamento",
            value: content.follow_up || "",
            onChange: (value) => handleFieldChange("follow_up", value),
          },
        ]}
      />
    </div>
  );
}
