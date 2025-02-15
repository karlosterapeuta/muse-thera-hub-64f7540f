
import { FormSection } from "@/pages/anamnesis/components/FormSection";
import { SelectField } from "@/pages/anamnesis/components/SelectField";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function AssessmentReportForm({ content, onChange }: FormProps) {
  const updateField = (field: string, value: string) => {
    onChange({ ...content, [field]: value });
  };

  const assessmentAreasOptions = [
    { value: "musical_perception", label: "Percepção Musical" },
    { value: "emotional_expression", label: "Expressão Emocional" },
    { value: "social_interaction", label: "Interação Social" },
    { value: "cognitive_function", label: "Função Cognitiva" },
    { value: "motor_skills", label: "Habilidades Motoras" },
  ];

  return (
    <div className="space-y-6">
      <SelectField
        label="Área Principal de Avaliação"
        value={content.mainAssessmentArea || ""}
        onChange={(value) => updateField("mainAssessmentArea", value)}
        options={assessmentAreasOptions}
      />

      <FormSection
        title="Relatório de Avaliação"
        fields={[
          {
            key: "assessmentMethodology",
            label: "Metodologia de Avaliação",
            placeholder: "Descreva os métodos e instrumentos utilizados",
            value: content.assessmentMethodology || "",
            onChange: (value) => updateField("assessmentMethodology", value),
          },
          {
            key: "findings",
            label: "Achados",
            placeholder: "Registre os principais achados da avaliação",
            value: content.findings || "",
            onChange: (value) => updateField("findings", value),
          },
          {
            key: "clinicalImplications",
            label: "Implicações Clínicas",
            placeholder: "Discuta as implicações clínicas dos achados",
            value: content.clinicalImplications || "",
            onChange: (value) => updateField("clinicalImplications", value),
          },
        ]}
      />
    </div>
  );
}
