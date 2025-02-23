
import React, { useEffect } from "react";
import { FormSection } from "@/pages/anamnesis/components/FormSection";

export type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function TherapeuticDischargeForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  const defaultContent = {
    treatment_summary: "O processo musicoterapêutico desenvolvido alcançou significativos avanços nas seguintes áreas:\n\n1. Desenvolvimento Musical:\n- Ampliação do repertório sonoro-musical\n- Desenvolvimento de habilidades expressivas\n- Autonomia nas experiências musicais\n\n2. Aspectos Terapêuticos:\n- Fortalecimento da comunicação não-verbal\n- Desenvolvimento da expressão emocional\n- Melhora na interação social\n\n3. Evolução Clínica:\n- Alcance dos objetivos terapêuticos estabelecidos\n- Desenvolvimento de recursos internos\n- Integração das experiências musicais no cotidiano",
    achieved_goals: "1. Comunicação e Expressão:\n- Desenvolvimento da comunicação não-verbal através da música\n- Ampliação das formas de expressão emocional\n- Estabelecimento de diálogo sonoro-musical\n\n2. Aspectos Sociais:\n- Melhora na interação em grupo\n- Desenvolvimento de habilidades sociais\n- Participação ativa em experiências musicais coletivas\n\n3. Desenvolvimento Pessoal:\n- Aumento da autoexpressão\n- Fortalecimento da autonomia\n- Desenvolvimento da identidade sonora",
    recommendations: "Para a continuidade do desenvolvimento alcançado, recomenda-se:\n\n1. Manutenção das Práticas Musicais:\n- Participação em atividades musicais comunitárias\n- Manutenção do vínculo com a música como recurso expressivo\n- Exploração contínua de instrumentos musicais\n\n2. Suporte Complementar:\n- Acompanhamento periódico para avaliação\n- Integração com outras atividades artísticas\n- Participação em grupos musicais"
  };

  useEffect(() => {
    if (Object.keys(content).length === 0) {
      onChange(defaultContent);
    }
  }, []);

  const mergedContent = { ...defaultContent, ...content };

  return (
    <div className="space-y-6">
      <FormSection
        title="Avaliação Final"
        fields={[
          {
            key: "treatment_summary",
            label: "Resumo do Tratamento",
            placeholder: "Resumo do processo terapêutico",
            value: mergedContent.treatment_summary,
            onChange: (value) => handleFieldChange("treatment_summary", value),
          },
          {
            key: "achieved_goals",
            label: "Objetivos Alcançados",
            placeholder: "Descreva os objetivos alcançados",
            value: mergedContent.achieved_goals,
            onChange: (value) => handleFieldChange("achieved_goals", value),
          },
          {
            key: "recommendations",
            label: "Recomendações",
            placeholder: "Recomendações pós-alta",
            value: mergedContent.recommendations,
            onChange: (value) => handleFieldChange("recommendations", value),
          },
        ]}
      />
    </div>
  );
}
