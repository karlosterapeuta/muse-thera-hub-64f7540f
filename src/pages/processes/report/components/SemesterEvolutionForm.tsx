
import React, { useEffect } from "react";
import { FormSection } from "@/pages/anamnesis/components/FormSection";
import { DateField } from "./DateField";

export type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function SemesterEvolutionForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    const newContent = { ...content, [key]: value };
    onChange(newContent);
  };

  const defaultContent = {
    evaluation_date: "",
    initial_evaluation: "Avaliação inicial do semestre:\n- Estado no início do período\n- Principais desafios identificados\n- Objetivos estabelecidos",
    therapeutic_process: "Processo terapêutico:\n1. Abordagens utilizadas\n2. Adaptações realizadas\n3. Desenvolvimento das intervenções\n4. Resposta às intervenções",
    evolution_areas: "Áreas de evolução:\n- Desenvolvimento musical\n- Aspectos comunicativos\n- Habilidades motoras\n- Desenvolvimento socioemocional\n- Aspectos cognitivos",
    family_involvement: "Envolvimento familiar:\n- Participação da família\n- Orientações fornecidas\n- Feedback recebido",
    conclusions: "Conclusões do período:\n- Resultados alcançados\n- Áreas de maior progresso\n- Aspectos a serem desenvolvidos",
    recommendations: "Recomendações:\n1. Continuidade do tratamento\n2. Ajustes necessários\n3. Objetivos para o próximo semestre\n4. Estratégias propostas"
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
          label="Data da Avaliação"
          value={mergedContent.evaluation_date}
          onChange={(value) => handleFieldChange("evaluation_date", value)}
        />
      </div>

      <FormSection
        title="Evolução Semestral"
        fields={[
          {
            key: "initial_evaluation",
            label: "Avaliação Inicial",
            placeholder: "Descreva a avaliação inicial do semestre",
            value: mergedContent.initial_evaluation,
            onChange: (value) => handleFieldChange("initial_evaluation", value),
          },
          {
            key: "therapeutic_process",
            label: "Processo Terapêutico",
            placeholder: "Descreva o processo terapêutico",
            value: mergedContent.therapeutic_process,
            onChange: (value) => handleFieldChange("therapeutic_process", value),
          },
          {
            key: "evolution_areas",
            label: "Áreas de Evolução",
            placeholder: "Descreva as áreas de evolução",
            value: mergedContent.evolution_areas,
            onChange: (value) => handleFieldChange("evolution_areas", value),
          },
          {
            key: "family_involvement",
            label: "Envolvimento Familiar",
            placeholder: "Descreva o envolvimento familiar",
            value: mergedContent.family_involvement,
            onChange: (value) => handleFieldChange("family_involvement", value),
          },
          {
            key: "conclusions",
            label: "Conclusões",
            placeholder: "Descreva as conclusões do período",
            value: mergedContent.conclusions,
            onChange: (value) => handleFieldChange("conclusions", value),
          },
          {
            key: "recommendations",
            label: "Recomendações",
            placeholder: "Liste as recomendações para o próximo período",
            value: mergedContent.recommendations,
            onChange: (value) => handleFieldChange("recommendations", value),
          },
        ]}
      />
    </div>
  );
}
