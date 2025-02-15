
import { FormSection } from "@/pages/anamnesis/components/FormSection";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function IndividualSessionForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      <FormSection
        title="Dados da Sessão"
        fields={[
          {
            key: "data_session",
            label: "Data da Sessão",
            placeholder: "dd/mm/aaaa",
            value: content.data_session || "",
            onChange: (value) => handleFieldChange("data_session", value),
          },
          {
            key: "objectives",
            label: "Objetivos",
            placeholder: "Ex: Desenvolvimento de habilidades de comunicação não-verbal através da expressão musical",
            value: content.objectives || "1. Promover autoexpressão através da música\n2. Desenvolver habilidades de comunicação não-verbal\n3. Estimular interação social através de atividades musicais\n4. Trabalhar aspectos emocionais através da expressão sonoro-musical",
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
            value: content.activities || "- Re-criação musical com instrumentos de percussão\n- Improvisação musical livre\n- Técnicas receptivas com audição musical\n- Composição musical terapêutica\n- Movimento corporal com suporte musical",
            onChange: (value) => handleFieldChange("activities", value),
          },
          {
            key: "patient_response",
            label: "Resposta do Paciente",
            placeholder: "Como o paciente respondeu às intervenções musicoterapêuticas",
            value: content.patient_response || "- Demonstrou engajamento nas atividades propostas\n- Apresentou respostas rítmicas consistentes\n- Estabeleceu contato visual durante as interações musicais\n- Expressou emoções através da improvisação musical\n- Manteve atenção sustentada durante as atividades",
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
            value: content.observations || "O paciente demonstrou progresso significativo na expressão sonoro-musical, evidenciando desenvolvimento nas áreas de comunicação não-verbal e interação social através das experiências musicais propostas.",
            onChange: (value) => handleFieldChange("observations", value),
          },
          {
            key: "next_steps",
            label: "Próximos Passos",
            placeholder: "Planejamento para as próximas intervenções",
            value: content.next_steps || "- Expandir repertório de experiências musicais\n- Introduzir novas técnicas de improvisação\n- Desenvolver atividades de composição musical terapêutica\n- Aprofundar trabalho com expressão emocional através da música",
            onChange: (value) => handleFieldChange("next_steps", value),
          },
        ]}
      />
    </div>
  );
}
