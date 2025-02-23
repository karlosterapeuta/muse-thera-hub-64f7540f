
import React, { useEffect } from "react";
import { FormSection } from "@/pages/anamnesis/components/FormSection";

export type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function DailyEvolutionForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    const newContent = { ...content, [key]: value };
    onChange(newContent);
  };

  const defaultContent = {
    initial_state: "Estado inicial do paciente:\n\n1. Aspectos Emocionais:\n- Humor: alegre/triste/ansioso/irritado\n- Disposição: participativo/resistente/apático\n- Nível de energia: alto/moderado/baixo\n\n2. Aspectos Cognitivos:\n- Atenção: focado/disperso\n- Compreensão: boa/regular/prejudicada\n- Memória: preservada/alterada\n\n3. Aspectos Sociais:\n- Interação: comunicativo/reservado\n- Contato visual: presente/intermitente/ausente\n- Relacionamento com terapeuta: colaborativo/resistente",

    activities: "Atividades realizadas:\n\n1. Experiências Receptivas:\n- Audição musical dirigida\n- Relaxamento com música\n\n2. Experiências Recreativas:\n- Jogos musicais\n- Atividades rítmicas\n- Movimento corporal com música\n\n3. Experiências Criativas:\n- Improvisação instrumental\n- Composição musical\n- Criação de letras\n\n4. Técnicas Específicas:\n- Exercícios de vocalização\n- Prática instrumental\n- Expressão corporal",

    responses: "Respostas observadas:\n\n1. Aspectos Musicais:\n- Ritmo: coordenado/descoordenado\n- Melodia: afinado/desafinado\n- Expressão musical: espontânea/dirigida\n\n2. Aspectos Terapêuticos:\n- Engajamento nas atividades: alto/moderado/baixo\n- Expressão emocional: adequada/exagerada/contida\n- Desenvolvimento motor: adequado/em desenvolvimento\n\n3. Interação Musical:\n- Resposta aos estímulos sonoros\n- Iniciativa musical\n- Criatividade musical",

    observations: "Observações gerais:\n\n1. Progressos Observados:\n- Aspectos positivos da sessão\n- Conquistas alcançadas\n- Habilidades desenvolvidas\n\n2. Desafios Encontrados:\n- Dificuldades apresentadas\n- Resistências observadas\n- Pontos de atenção\n\n3. Planejamento Futuro:\n- Objetivos para próximas sessões\n- Ajustes necessários\n- Estratégias a serem implementadas"
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
