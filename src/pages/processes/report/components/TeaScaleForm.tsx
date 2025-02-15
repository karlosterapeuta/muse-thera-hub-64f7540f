import { FormSection } from "@/pages/anamnesis/components/FormSection";
import { DateField } from "./DateField";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function TeaScaleForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <DateField
          label="Data da Avaliação"
          value={content.evaluation_date || ""}
          onChange={(value) => handleFieldChange("evaluation_date", value)}
        />
      </div>

      <FormSection
        title="Áreas Avaliadas"
        fields={[
          {
            key: "social_interaction",
            label: "Interação Social",
            placeholder: "Avaliação da interação social",
            value: content.social_interaction || "1. Engajamento Social:\n- Capacidade de participação em atividades musicais em grupo\n- Iniciativa nas interações musicais\n- Resposta a estímulos sociais-musicais\n\n2. Comunicação Social:\n- Uso da música como forma de comunicação\n- Reciprocidade musical\n- Atenção compartilhada durante atividades musicais",
            onChange: (value) => handleFieldChange("social_interaction", value),
          },
          {
            key: "communication",
            label: "Comunicação",
            placeholder: "Avaliação da comunicação",
            value: content.communication || "1. Comunicação Não-Verbal:\n- Expressão através de elementos musicais\n- Uso de gestos e movimentos na música\n- Compreensão de sinais musicais\n\n2. Comunicação Verbal:\n- Uso de vocalizações musicais\n- Participação em canções\n- Integração entre fala e música",
            onChange: (value) => handleFieldChange("communication", value),
          },
          {
            key: "behavior_patterns",
            label: "Padrões de Comportamento",
            placeholder: "Avaliação dos padrões de comportamento",
            value: content.behavior_patterns || "1. Respostas aos Estímulos Musicais:\n- Padrões de resposta a diferentes elementos musicais\n- Preferências musicais observadas\n- Reações a mudanças na música\n\n2. Comportamentos Durante as Atividades:\n- Nível de envolvimento nas experiências musicais\n- Flexibilidade nas propostas musicais\n- Padrões de autorregulação através da música",
            onChange: (value) => handleFieldChange("behavior_patterns", value),
          },
        ]}
      />

      <FormSection
        title="Conclusão"
        fields={[
          {
            key: "conclusions",
            label: "Conclusões",
            placeholder: "Conclusões da avaliação",
            value: content.conclusions || "Com base nas observações realizadas através da escala TEA, conclui-se:\n\n1. Potencialidades:\n- Áreas de maior resposta musical\n- Recursos internos identificados\n- Canais de comunicação estabelecidos\n\n2. Aspectos a Desenvolver:\n- Áreas que necessitam maior atenção\n- Desafios identificados\n- Pontos de intervenção prioritários",
            onChange: (value) => handleFieldChange("conclusions", value),
          },
          {
            key: "recommendations",
            label: "Recomendações",
            placeholder: "Recomendações baseadas na avaliação",
            value: content.recommendations || "1. Intervenções Sugeridas:\n- Abordagens musicoterapêuticas específicas\n- Estratégias de intervenção personalizadas\n- Adaptações necessárias nas atividades\n\n2. Orientações:\n- Frequência recomendada de atendimento\n- Modalidades de intervenção indicadas\n- Sugestões para equipe multidisciplinar",
            onChange: (value) => handleFieldChange("recommendations", value),
          },
        ]}
      />
    </div>
  );
}
