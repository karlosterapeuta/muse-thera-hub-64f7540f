
import { FormSection } from "@/pages/anamnesis/components/FormSection";
import { SelectField } from "@/pages/anamnesis/components/SelectField";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function ProgressReportForm({ content, onChange }: FormProps) {
  const updateField = (field: string, value: string) => {
    onChange({ ...content, [field]: value });
  };

  const progressOptions = [
    { value: "significant", label: "Progresso Significativo" },
    { value: "moderate", label: "Progresso Moderado" },
    { value: "minimal", label: "Progresso Mínimo" },
    { value: "no_change", label: "Sem Alteração" },
    { value: "regression", label: "Regressão" },
  ];

  return (
    <div className="space-y-6">
      <SelectField
        label="Avaliação do Progresso"
        value={content.progressLevel || ""}
        onChange={(value) => updateField("progressLevel", value)}
        options={progressOptions}
      />

      <FormSection
        title="Relatório de Progresso"
        fields={[
          {
            key: "musicalDevelopment",
            label: "Desenvolvimento Musical",
            placeholder: "Descreva o desenvolvimento musical observado",
            value: content.musicalDevelopment || "",
            onChange: (value) => updateField("musicalDevelopment", value),
          },
          {
            key: "therapeuticAchievements",
            label: "Conquistas Terapêuticas",
            placeholder: "Registre as conquistas alcançadas no processo terapêutico",
            value: content.therapeuticAchievements || "",
            onChange: (value) => updateField("therapeuticAchievements", value),
          },
          {
            key: "challengesAndStrategies",
            label: "Desafios e Estratégias",
            placeholder: "Descreva os desafios encontrados e estratégias utilizadas",
            value: content.challengesAndStrategies || "",
            onChange: (value) => updateField("challengesAndStrategies", value),
          },
        ]}
      />
    </div>
  );
}
