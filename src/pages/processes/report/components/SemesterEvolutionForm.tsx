import { FormSection } from "@/pages/anamnesis/components/FormSection";
import { DateField } from "./DateField";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function SemesterEvolutionForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <DateField
          label="Semestre/Ano"
          value={content.semester || ""}
          onChange={(value) => handleFieldChange("semester", value)}
        />
      </div>

      <FormSection
        title="Avaliação Geral"
        fields={[
          {
            key: "overall_progress",
            label: "Progresso Geral",
            placeholder: "Descreva o progresso geral do semestre",
            value: content.overall_progress || "Durante este semestre, observou-se evolução significativa nos seguintes aspectos:\n\n1. Desenvolvimento Musical:\n- Aumento da complexidade nas respostas musicais\n- Maior engajamento em atividades de improvisação\n- Ampliação do repertório musical terapêutico\n\n2. Aspectos Terapêuticos:\n- Fortalecimento do vínculo terapêutico\n- Maior autonomia nas expressões sonoro-musicais\n- Desenvolvimento da comunicação através da música",
            onChange: (value) => handleFieldChange("overall_progress", value),
          },
          {
            key: "therapeutic_goals",
            label: "Objetivos Terapêuticos",
            placeholder: "Avaliação dos objetivos terapêuticos",
            value: content.therapeutic_goals || "1. Objetivos Alcançados:\n- Estabelecimento de canais de comunicação não-verbal\n- Desenvolvimento de habilidades de interação musical\n- Ampliação da expressão emocional\n\n2. Objetivos em Desenvolvimento:\n- Aprofundamento da consciência corporal-musical\n- Fortalecimento da autonomia nas escolhas musicais\n- Expansão das formas de expressão sonora",
            onChange: (value) => handleFieldChange("therapeutic_goals", value),
          },
        ]}
      />

      <FormSection
        title="Recomendações"
        fields={[
          {
            key: "recommendations",
            label: "Recomendações",
            placeholder: "Recomendações para o próximo semestre",
            value: content.recommendations || "Para o próximo semestre, recomenda-se:\n\n1. Intervenções Musicoterapêuticas:\n- Intensificar experiências de composição musical\n- Desenvolver atividades de improvisação direcionada\n- Implementar técnicas receptivas específicas\n\n2. Abordagem Terapêutica:\n- Manter a frequência atual das sessões\n- Introduzir novas modalidades de expressão musical\n- Fortalecer o trabalho com dinâmicas em grupo",
            onChange: (value) => handleFieldChange("recommendations", value),
          },
        ]}
      />
    </div>
  );
}
