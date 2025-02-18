
import React, { useEffect } from "react";
import { FormSection } from "@/pages/anamnesis/components/FormSection";
import { DateField } from "./DateField";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function TechnicalReportForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  const defaultContent = {
    report_date: "",
    summary: "Resumo do processo musicoterapêutico:\n\n1. Contexto Clínico:\n- Início do acompanhamento\n- Demanda inicial\n- Abordagem utilizada\n\n2. Desenvolvimento:\n- Principais intervenções realizadas\n- Resposta ao tratamento\n- Evolução observada",
    observations: "Observações técnicas relevantes:\n\n1. Aspectos Musicais:\n- Preferências sonoro-musicais\n- Respostas às intervenções\n- Padrões de expressão musical\n\n2. Aspectos Terapêuticos:\n- Vínculo terapêutico\n- Dinâmica das sessões\n- Pontos de atenção",
    recommendations: "Recomendações técnicas:\n\n1. Orientações Específicas:\n- Continuidade do processo musicoterapêutico\n- Adaptações necessárias\n- Encaminhamentos complementares\n\n2. Sugestões de Intervenção:\n- Abordagens musicais recomendadas\n- Estratégias terapêuticas\n- Metas de desenvolvimento"
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
          label="Data do Relatório"
          value={mergedContent.report_date}
          onChange={(value) => handleFieldChange("report_date", value)}
        />
      </div>

      <FormSection
        title="Detalhes do Relatório"
        fields={[
          {
            key: "summary",
            label: "Resumo",
            placeholder: "Descreva o resumo do relatório",
            value: mergedContent.summary,
            onChange: (value) => handleFieldChange("summary", value),
          },
          {
            key: "observations",
            label: "Observações",
            placeholder: "Anote observações relevantes",
            value: mergedContent.observations,
            onChange: (value) => handleFieldChange("observations", value),
          },
          {
            key: "recommendations",
            label: "Recomendações",
            placeholder: "Liste as recomendações",
            value: mergedContent.recommendations,
            onChange: (value) => handleFieldChange("recommendations", value),
          },
        ]}
      />
    </div>
  );
}
