
import { FormSection } from "@/pages/anamnesis/components/FormSection";
import { DateField } from "./DateField";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function TechnicalReportForm({ content, onChange }: FormProps) {
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
        title="Detalhes do Relatório"
        fields={[
          {
            key: "summary",
            label: "Resumo",
            placeholder: "Descreva o resumo do relatório",
            value: content.summary || "Resumo do processo musicoterapêutico:\n\n1. Contexto Clínico:\n- Início do acompanhamento\n- Demanda inicial\n- Abordagem utilizada\n\n2. Desenvolvimento:\n- Principais intervenções realizadas\n- Resposta ao tratamento\n- Evolução observada",
            onChange: (value) => handleFieldChange("summary", value),
          },
          {
            key: "observations",
            label: "Observações",
            placeholder: "Anote observações relevantes",
            value: content.observations || "Observações técnicas relevantes:\n\n1. Aspectos Musicais:\n- Preferências sonoro-musicais\n- Respostas às intervenções\n- Padrões de expressão musical\n\n2. Aspectos Terapêuticos:\n- Vínculo terapêutico\n- Dinâmica das sessões\n- Pontos de atenção",
            onChange: (value) => handleFieldChange("observations", value),
          },
          {
            key: "recommendations",
            label: "Recomendações",
            placeholder: "Liste as recomendações",
            value: content.recommendations || "Recomendações técnicas:\n\n1. Orientações Específicas:\n- Continuidade do processo musicoterapêutico\n- Adaptações necessárias\n- Encaminhamentos complementares\n\n2. Sugestões de Intervenção:\n- Abordagens musicais recomendadas\n- Estratégias terapêuticas\n- Metas de desenvolvimento",
            onChange: (value) => handleFieldChange("recommendations", value),
          },
        ]}
      />
    </div>
  );
}
