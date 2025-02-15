
import { FormSection } from "@/pages/anamnesis/components/FormSection";
import { DateField } from "./DateField";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function DailyEvolutionForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <DateField
          label="Data"
          value={content.date || ""}
          onChange={(value) => handleFieldChange("date", value)}
        />
      </div>

      <FormSection
        title="Informações do Dia"
        fields={[
          {
            key: "emotional_state",
            label: "Estado Emocional",
            placeholder: "Descreva o estado emocional do paciente",
            value: content.emotional_state || "1. Apresentação Inicial:\n- Humor ao chegar na sessão\n- Disposição para atividades musicais\n- Estado de regulação emocional\n\n2. Durante a Sessão:\n- Variações emocionais observadas\n- Respostas afetivas à música\n- Expressão emocional através dos elementos sonoro-musicais",
            onChange: (value) => handleFieldChange("emotional_state", value),
          },
        ]}
      />

      <FormSection
        title="Atividades e Comportamento"
        fields={[
          {
            key: "activities",
            label: "Atividades do Dia",
            placeholder: "Descreva as atividades realizadas",
            value: content.activities || "1. Experiências Musicais:\n- Re-criação musical com instrumentos específicos\n- Improvisação musical livre/direcionada\n- Audição musical receptiva\n- Composição musical terapêutica\n\n2. Intervenções Realizadas:\n- Técnicas musicoterapêuticas aplicadas\n- Adaptações necessárias\n- Recursos utilizados",
            onChange: (value) => handleFieldChange("activities", value),
          },
          {
            key: "behavior",
            label: "Comportamento",
            placeholder: "Descreva o comportamento observado",
            value: content.behavior || "1. Aspectos Comportamentais:\n- Nível de engajamento nas atividades\n- Interação com os elementos musicais\n- Respostas aos estímulos sonoros\n\n2. Aspectos Relacionais:\n- Qualidade da interação musical\n- Comunicação não-verbal\n- Vínculo terapêutico",
            onChange: (value) => handleFieldChange("behavior", value),
          },
        ]}
      />

      <FormSection
        title="Observações"
        fields={[
          {
            key: "significant_events",
            label: "Eventos Significativos",
            placeholder: "Eventos importantes do dia",
            value: content.significant_events || "1. Momentos Relevantes:\n- Respostas musicais significativas\n- Insights durante as atividades\n- Mudanças observadas\n\n2. Desenvolvimento:\n- Progressos específicos notados\n- Novas habilidades demonstradas\n- Desafios encontrados",
            onChange: (value) => handleFieldChange("significant_events", value),
          },
          {
            key: "notes",
            label: "Anotações Adicionais",
            placeholder: "Outras observações relevantes",
            value: content.notes || "1. Aspectos Técnicos:\n- Elementos musicais trabalhados\n- Respostas a instrumentos específicos\n- Preferências musicais observadas\n\n2. Planejamento:\n- Sugestões para próxima sessão\n- Aspectos a serem desenvolvidos\n- Adaptações necessárias",
            onChange: (value) => handleFieldChange("notes", value),
          },
        ]}
      />
    </div>
  );
}
