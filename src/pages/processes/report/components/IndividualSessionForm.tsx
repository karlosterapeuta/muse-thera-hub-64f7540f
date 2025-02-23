
import React, { useEffect } from "react";
import { FormSection } from "@/pages/anamnesis/components/FormSection";

export type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function IndividualSessionForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    const newContent = { ...content, [key]: value };
    console.log("Atualizando conteúdo:", newContent);
    onChange(newContent);
  };

  const defaultContent = {
    objectives: "1. Promover engajamento musical e autoexpressão\n2. Desenvolver habilidades de comunicação não-verbal\n3. Estimular interação social através da música\n4. Trabalhar aspectos emocionais e cognitivos\n5. Aprimorar habilidades motoras através de atividades rítmicas",
    activities: "- Re-criação musical utilizando instrumentos de percussão e melódicos\n- Improvisação musical livre e direcionada\n- Técnicas receptivas com audição musical selecionada\n- Atividades de movimento corporal com suporte musical\n- Exercícios de coordenação rítmica\n- Jogos musicais interativos",
    patient_response: "O paciente demonstrou:\n- Engajamento significativo nas atividades propostas\n- Boa resposta às intervenções musicais\n- Progresso na expressão emocional através da música\n- Melhora na interação social durante atividades em grupo\n- Desenvolvimento positivo das habilidades motoras\n- Aumento da atenção e participação nas atividades",
    observations: "Durante a sessão, observou-se progresso significativo no desenvolvimento musical e terapêutico. O paciente demonstrou maior consciência rítmica, melhor coordenação motora e aumentou sua capacidade de expressão através da música. As intervenções musicoterapêuticas mostraram-se efetivas, contribuindo para o alcance dos objetivos estabelecidos.",
    next_steps: "Para as próximas sessões, propõe-se:\n1. Intensificar atividades de improvisação musical\n2. Introduzir novos instrumentos musicais\n3. Aumentar complexidade dos exercícios rítmicos\n4. Desenvolver atividades específicas para comunicação não-verbal\n5. Manter foco no desenvolvimento da expressão emocional através da música",
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
        title="Dados da Sessão"
        fields={[
          {
            key: "objectives",
            label: "Objetivos",
            placeholder: "Ex: Desenvolvimento de habilidades de comunicação não-verbal através da expressão musical",
            value: mergedContent.objectives,
            onChange: (value) => handleFieldChange("objectives", value),
          },
        ]}
      />

      <FormSection
        title="Desenvolvimento"
        fields={[
          {
            key: "activities",
            label: "Atividades Realizadas",
            placeholder: "Descreva as intervenções musicoterapêuticas realizadas",
            value: mergedContent.activities,
            onChange: (value) => handleFieldChange("activities", value),
          },
          {
            key: "patient_response",
            label: "Resposta do Paciente",
            placeholder: "Como o paciente respondeu às intervenções musicoterapêuticas",
            value: mergedContent.patient_response,
            onChange: (value) => handleFieldChange("patient_response", value),
          },
        ]}
      />

      <FormSection
        title="Conclusão"
        fields={[
          {
            key: "observations",
            label: "Observações",
            placeholder: "Observações sobre o processo musicoterapêutico",
            value: mergedContent.observations,
            onChange: (value) => handleFieldChange("observations", value),
          },
          {
            key: "next_steps",
            label: "Próximos Passos",
            placeholder: "Planejamento para as próximas intervenções",
            value: mergedContent.next_steps,
            onChange: (value) => handleFieldChange("next_steps", value),
          },
        ]}
      />
    </div>
  );
}
