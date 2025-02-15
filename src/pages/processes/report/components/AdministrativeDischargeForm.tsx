
import { FormSection } from "@/pages/anamnesis/components/FormSection";

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
          {
            key: "reason",
            label: "Motivo",
            placeholder: "Motivo da alta administrativa",
            value: content.reason || "",
            onChange: (value) => handleFieldChange("reason", value),
          },
        ]}
      />

      <FormSection
        title="Informações Adicionais"
        fields={[
          {
            key: "observations",
            label: "Observações",
            placeholder: "Observações relevantes",
            value: content.observations || "",
            onChange: (value) => handleFieldChange("observations", value),
          },
        ]}
      />
    </div>
  );
}
