
import React, { useEffect } from "react";
import { FormSection } from "@/pages/anamnesis/components/FormSection";
import { DateField } from "./DateField";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function MonthlyEvolutionForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    const newContent = { ...content, [key]: value };
    onChange(newContent);
  };

  const defaultContent = {
    date: "",
    period: "",
    therapeutic_objectives: "Objetivos terapêuticos trabalhados:\n1. Desenvolvimento de habilidades de comunicação\n2. Estimulação sensorial através da música\n3. Fortalecimento de aspectos motores\n4. Desenvolvimento socioemocional",
    achievements: "Conquistas alcançadas:\n- Progresso na comunicação não-verbal\n- Maior engajamento em atividades musicais\n- Desenvolvimento de habilidades motoras\n- Melhora na interação social",
    challenges: "Desafios encontrados:\n- Áreas que necessitam maior atenção\n- Dificuldades específicas\n- Barreiras a serem superadas",
    adjustments: "Ajustes necessários:\n1. Adaptações nas intervenções\n2. Modificações nas estratégias\n3. Novas abordagens propostas",
    next_steps: "Próximos passos:\n- Objetivos para o próximo período\n- Estratégias a serem implementadas\n- Focos de intervenção"
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
        title="Evolução Mensal"
        fields={[
          {
            key: "period",
            label: "Período de Avaliação",
            placeholder: "Ex: Janeiro/2024",
            value: mergedContent.period,
            onChange: (value) => handleFieldChange("period", value),
          },
          {
            key: "therapeutic_objectives",
            label: "Objetivos Terapêuticos",
            placeholder: "Liste os objetivos trabalhados no período",
            value: mergedContent.therapeutic_objectives,
            onChange: (value) => handleFieldChange("therapeutic_objectives", value),
          },
          {
            key: "achievements",
            label: "Conquistas",
            placeholder: "Descreva as conquistas alcançadas",
            value: mergedContent.achievements,
            onChange: (value) => handleFieldChange("achievements", value),
          },
          {
            key: "challenges",
            label: "Desafios",
            placeholder: "Descreva os desafios encontrados",
            value: mergedContent.challenges,
            onChange: (value) => handleFieldChange("challenges", value),
          },
          {
            key: "adjustments",
            label: "Ajustes Necessários",
            placeholder: "Liste os ajustes necessários no plano terapêutico",
            value: mergedContent.adjustments,
            onChange: (value) => handleFieldChange("adjustments", value),
          },
          {
            key: "next_steps",
            label: "Próximos Passos",
            placeholder: "Descreva os próximos passos do tratamento",
            value: mergedContent.next_steps,
            onChange: (value) => handleFieldChange("next_steps", value),
          },
        ]}
      />
    </div>
  );
}
