
import { FormSection } from "@/pages/anamnesis/components/FormSection";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function TherapeuticDischargeForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      <FormSection
        title="Dados da Alta"
        fields={[
          {
            key: "discharge_date",
            label: "Data da Alta",
            placeholder: "dd/mm/aaaa",
            value: content.discharge_date || "",
            onChange: (value) => handleFieldChange("discharge_date", value),
          },
        ]}
      />

      <FormSection
        title="Avaliação Final"
        fields={[
          {
            key: "treatment_summary",
            label: "Resumo do Tratamento",
            placeholder: "Resumo do processo terapêutico",
            value: content.treatment_summary || "O processo musicoterapêutico desenvolvido alcançou significativos avanços nas seguintes áreas:\n\n1. Desenvolvimento Musical:\n- Ampliação do repertório sonoro-musical\n- Desenvolvimento de habilidades expressivas\n- Autonomia nas experiências musicais\n\n2. Aspectos Terapêuticos:\n- Fortalecimento da comunicação não-verbal\n- Desenvolvimento da expressão emocional\n- Melhora na interação social\n\n3. Evolução Clínica:\n- Alcance dos objetivos terapêuticos estabelecidos\n- Desenvolvimento de recursos internos\n- Integração das experiências musicais no cotidiano",
            onChange: (value) => handleFieldChange("treatment_summary", value),
          },
          {
            key: "achieved_goals",
            label: "Objetivos Alcançados",
            placeholder: "Descreva os objetivos alcançados",
            value: content.achieved_goals || "1. Comunicação e Expressão:\n- Desenvolvimento da comunicação não-verbal através da música\n- Ampliação das formas de expressão emocional\n- Estabelecimento de diálogo sonoro-musical\n\n2. Aspectos Sociais:\n- Melhora na interação em grupo\n- Desenvolvimento de habilidades sociais\n- Participação ativa em experiências musicais coletivas\n\n3. Desenvolvimento Pessoal:\n- Aumento da autoexpressão\n- Fortalecimento da autonomia\n- Desenvolvimento da identidade sonora",
            onChange: (value) => handleFieldChange("achieved_goals", value),
          },
        ]}
      />

      <FormSection
        title="Recomendações"
        fields={[
          {
            key: "recommendations",
            label: "Recomendações",
            placeholder: "Recomendações pós-alta",
            value: content.recommendations || "Para a continuidade do desenvolvimento alcançado, recomenda-se:\n\n1. Manutenção das Práticas Musicais:\n- Participação em atividades musicais comunitárias\n- Manutenção do vínculo com a música como recurso expressivo\n- Exploração contínua de instrumentos musicais\n\n2. Suporte Complementar:\n- Acompanhamento periódico para avaliação\n- Integração com outras atividades artísticas\n- Participação em grupos musicais",
            onChange: (value) => handleFieldChange("recommendations", value),
          },
        ]}
      />
    </div>
  );
}
