
import { FormSection } from "@/pages/anamnesis/components/FormSection";

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
      <FormSection
        title="Dados do Relatório"
        fields={[
          {
            key: "report_date",
            label: "Data do Relatório",
            placeholder: "dd/mm/aaaa",
            value: content.report_date || "",
            onChange: (value) => handleFieldChange("report_date", value),
          },
          {
            key: "purpose",
            label: "Finalidade",
            placeholder: "Finalidade do relatório técnico",
            value: content.purpose || "Relatório técnico musicoterapêutico para:\n- Documentação do processo terapêutico\n- Avaliação do desenvolvimento clínico\n- Fundamentação de condutas terapêuticas",
            onChange: (value) => handleFieldChange("purpose", value),
          },
        ]}
      />

      <FormSection
        title="Avaliação Técnica"
        fields={[
          {
            key: "technical_assessment",
            label: "Avaliação",
            placeholder: "Avaliação técnica detalhada",
            value: content.technical_assessment || "1. Fundamentação Técnica:\n- Abordagem musicoterapêutica utilizada\n- Metodologia de intervenção\n- Instrumentos de avaliação aplicados\n\n2. Análise do Processo:\n- Desenvolvimento sonoro-musical\n- Respostas às intervenções\n- Evolução terapêutica observada\n\n3. Aspectos Clínicos:\n- Indicadores de desenvolvimento\n- Parâmetros avaliados\n- Resultados obtidos",
            onChange: (value) => handleFieldChange("technical_assessment", value),
          },
          {
            key: "methodology",
            label: "Metodologia",
            placeholder: "Metodologia utilizada",
            value: content.methodology || "1. Procedimentos Musicoterapêuticos:\n- Técnicas específicas aplicadas\n- Experiências musicais realizadas\n- Recursos terapêuticos utilizados\n\n2. Instrumentos de Avaliação:\n- Escalas e protocolos\n- Registros sistemáticos\n- Documentação audiovisual",
            onChange: (value) => handleFieldChange("methodology", value),
          },
        ]}
      />

      <FormSection
        title="Conclusão"
        fields={[
          {
            key: "conclusions",
            label: "Conclusões",
            placeholder: "Conclusões técnicas",
            value: content.conclusions || "Com base na avaliação técnica realizada, conclui-se:\n\n1. Resultados Alcançados:\n- Desenvolvimento musical observado\n- Objetivos terapêuticos atingidos\n- Evolução clínica documentada\n\n2. Análise Técnica:\n- Efetividade das intervenções\n- Resposta ao tratamento\n- Indicadores de progresso",
            onChange: (value) => handleFieldChange("conclusions", value),
          },
          {
            key: "recommendations",
            label: "Recomendações",
            placeholder: "Recomendações técnicas",
            value: content.recommendations || "1. Diretrizes Terapêuticas:\n- Continuidade do processo\n- Ajustes metodológicos\n- Novas intervenções propostas\n\n2. Encaminhamentos:\n- Avaliações complementares\n- Intervenções adicionais\n- Acompanhamento específico",
            onChange: (value) => handleFieldChange("recommendations", value),
          },
        ]}
      />
    </div>
  );
}
