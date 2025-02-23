
import React, { useEffect } from "react";
import { FormSection } from "@/pages/anamnesis/components/FormSection";
import { DateField } from "./DateField";

export type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function GroupSessionForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  const defaultContent = {
    session_date: "",
    participants: "Lista de participantes:\n- Nome do Participante 1\n- Nome do Participante 2\n- Nome do Participante 3",
    theme: "Tema da Sessão:\n- Objetivo principal\n- Foco terapêutico",
    group_dynamics: "Dinâmica do grupo:\n- Interações observadas\n- Papéis assumidos\n- Comportamentos grupais",
    activities: "Atividades realizadas:\n1. Atividade inicial\n2. Desenvolvimento\n3. Fechamento",
    group_response: "Resposta do grupo:\n- Participação geral\n- Engajamento nas atividades\n- Interações entre participantes",
    observations: "Observações adicionais:\n- Aspectos relevantes\n- Pontos de atenção\n- Sugestões para próximos encontros"
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
          label="Data da Sessão"
          value={mergedContent.session_date}
          onChange={(value) => handleFieldChange("session_date", value)}
        />
      </div>

      <FormSection
        title="Dados da Sessão em Grupo"
        fields={[
          {
            key: "participants",
            label: "Participantes",
            placeholder: "Liste os participantes da sessão",
            value: mergedContent.participants,
            onChange: (value) => handleFieldChange("participants", value),
          },
          {
            key: "theme",
            label: "Tema",
            placeholder: "Descreva o tema da sessão",
            value: mergedContent.theme,
            onChange: (value) => handleFieldChange("theme", value),
          },
        ]}
      />

      <FormSection
        title="Desenvolvimento"
        fields={[
          {
            key: "group_dynamics",
            label: "Dinâmica do Grupo",
            placeholder: "Descreva a dinâmica do grupo",
            value: mergedContent.group_dynamics,
            onChange: (value) => handleFieldChange("group_dynamics", value),
          },
          {
            key: "activities",
            label: "Atividades Realizadas",
            placeholder: "Liste as atividades realizadas",
            value: mergedContent.activities,
            onChange: (value) => handleFieldChange("activities", value),
          },
        ]}
      />

      <FormSection
        title="Avaliação"
        fields={[
          {
            key: "group_response",
            label: "Resposta do Grupo",
            placeholder: "Descreva a resposta do grupo",
            value: mergedContent.group_response,
            onChange: (value) => handleFieldChange("group_response", value),
          },
          {
            key: "observations",
            label: "Observações",
            placeholder: "Adicione observações relevantes",
            value: mergedContent.observations,
            onChange: (value) => handleFieldChange("observations", value),
          },
        ]}
      />
    </div>
  );
}
