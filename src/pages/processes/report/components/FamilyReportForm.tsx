import { FormSection } from "@/pages/anamnesis/components/FormSection";
import { DateField } from "./DateField";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function FamilyReportForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <DateField
          label="Data do Relatório"
          value={content.report_date || ""}
          onChange={(value) => handleFieldChange("report_date", value)}
        />
      </div>

      <FormSection
        title="Evolução"
        fields={[
          {
            key: "progress_summary",
            label: "Resumo do Progresso",
            placeholder: "Resumo do progresso para a família",
            value: content.progress_summary || "Durante o período de atendimento musicoterapêutico, observamos:\n\n1. Desenvolvimento Musical:\n- Interesse e participação nas atividades musicais\n- Evolução na expressão sonoro-musical\n- Respostas positivas às intervenções\n\n2. Aspectos Terapêuticos:\n- Desenvolvimento da comunicação através da música\n- Fortalecimento de vínculos sociais\n- Expressão emocional através das experiências musicais",
            onChange: (value) => handleFieldChange("progress_summary", value),
          },
          {
            key: "achievements",
            label: "Conquistas",
            placeholder: "Principais conquistas alcançadas",
            value: content.achievements || "Conquistas significativas observadas:\n\n1. Desenvolvimento Pessoal:\n- Maior autonomia nas escolhas musicais\n- Ampliação da expressão individual\n- Desenvolvimento da autoconfiança\n\n2. Habilidades Sociais:\n- Melhora na interação através da música\n- Participação em atividades musicais em grupo\n- Desenvolvimento da comunicação não-verbal",
            onChange: (value) => handleFieldChange("achievements", value),
          },
        ]}
      />

      <FormSection
        title="Orientações"
        fields={[
          {
            key: "family_guidelines",
            label: "Orientações para a Família",
            placeholder: "Orientações e sugestões para a família",
            value: content.family_guidelines || "Recomendações para apoio ao processo terapêutico:\n\n1. Atividades Musicais em Casa:\n- Manter momentos de escuta musical\n- Incentivar a expressão sonoro-musical\n- Participar de atividades musicais conjuntas\n\n2. Suporte ao Desenvolvimento:\n- Valorizar as conquistas musicais\n- Estimular a continuidade das práticas\n- Manter comunicação sobre as respostas observadas\n\n3. Recursos Sugeridos:\n- Playlist terapêutica personalizada\n- Instrumentos musicais adequados\n- Atividades musicais específicas",
            onChange: (value) => handleFieldChange("family_guidelines", value),
          },
        ]}
      />
    </div>
  );
}
