
import React, { useEffect } from "react";
import { FormSection } from "@/pages/anamnesis/components/FormSection";
import { DateField } from "./DateField";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function DailyEvolutionForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    const newContent = { ...content, [key]: value };
    onChange(newContent);
  };

  const defaultContent = {
    date: "",
    initial_state: "Estado inicial do paciente:\n- Humor\n- Disposição\n- Nível de engajamento",
    activities: "Atividades realizadas:\n1. Exercícios de atenção musical\n2. Técnicas de expressão sonora\n3. Atividades rítmicas\n4. Improvisação musical",
    responses: "Respostas observadas:\n- Engajamento nas atividades\n- Interação musical\n- Expressão emocional\n- Desenvolvimento motor",
    observations: "Observações gerais sobre o desenvolvimento da sessão e aspectos relevantes a serem considerados para o planejamento futuro."
  };

  useEffect(() => {
    if (Object.keys(content).length === 0) {
      onChange(defaultContent);
    }
  }, []);

  const mergedContent = { ...defaultContent, ...content };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <DateField
          label="Data"
          value={mergedContent.date}
          onChange={(value) => handleFieldChange("date", value)}
        />
      </div>

      <FormSection
        title="Evolução Diária"
        fields={[
          {
            key: "initial_state",
            label: "Estado Inicial",
            placeholder: "Descreva o estado inicial do paciente",
            value: mergedContent.initial_state,
            onChange: (value) => handleFieldChange("initial_state", value),
          },
          {
            key: "activities",
            label: "Atividades Realizadas",
            placeholder: "Liste as atividades realizadas na sessão",
            value: mergedContent.activities,
            onChange: (value) => handleFieldChange("activities", value),
          },
          {
            key: "responses",
            label: "Respostas Observadas",
            placeholder: "Descreva as respostas do paciente",
            value: mergedContent.responses,
            onChange: (value) => handleFieldChange("responses", value),
          },
          {
            key: "observations",
            label: "Observações",
            placeholder: "Observações adicionais",
            value: mergedContent.observations,
            onChange: (value) => handleFieldChange("observations", value),
          },
        ]}
      />
    </div>
  );
}
