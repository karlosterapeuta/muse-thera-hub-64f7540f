
import { FormSection } from "@/pages/anamnesis/components/FormSection";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function TeamReportForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      <FormSection
        title="Identificação"
        fields={[
          {
            key: "report_date",
            label: "Data do Relatório",
            placeholder: "dd/mm/aaaa",
            value: content.report_date || "",
            onChange: (value) => handleFieldChange("report_date", value),
          },
        ]}
      />

      <FormSection
        title="Avaliação"
        fields={[
          {
            key: "clinical_evolution",
            label: "Evolução Clínica",
            placeholder: "Descrição da evolução clínica",
            value: content.clinical_evolution || "1. Aspectos Musicoterapêuticos:\n- Desenvolvimento da identidade sonora\n- Evolução nas respostas musicais\n- Integração sensorial através da música\n\n2. Desenvolvimento Terapêutico:\n- Progresso nos objetivos estabelecidos\n- Respostas às intervenções realizadas\n- Indicadores de evolução observados\n\n3. Aspectos Interdisciplinares:\n- Integração com outras terapias\n- Contribuições para o desenvolvimento global\n- Pontos de atenção identificados",
            onChange: (value) => handleFieldChange("clinical_evolution", value),
          },
          {
            key: "interventions",
            label: "Intervenções Realizadas",
            placeholder: "Descrição das intervenções",
            value: content.interventions || "1. Abordagens Utilizadas:\n- Técnicas musicoterapêuticas aplicadas\n- Metodologias de intervenção\n- Adaptações realizadas\n\n2. Recursos Terapêuticos:\n- Instrumentos musicais utilizados\n- Experiências musicais propostas\n- Estratégias de intervenção específicas",
            onChange: (value) => handleFieldChange("interventions", value),
          },
        ]}
      />

      <FormSection
        title="Recomendações"
        fields={[
          {
            key: "team_recommendations",
            label: "Recomendações para Equipe",
            placeholder: "Recomendações para a equipe multidisciplinar",
            value: content.team_recommendations || "1. Diretrizes Terapêuticas:\n- Abordagens recomendadas\n- Estratégias de intervenção sugeridas\n- Pontos de atenção específicos\n\n2. Integração do Trabalho:\n- Sugestões para trabalho interdisciplinar\n- Áreas de complementaridade\n- Objetivos compartilhados\n\n3. Acompanhamento:\n- Indicadores de evolução a observar\n- Aspectos a serem monitorados\n- Avaliações periódicas sugeridas",
            onChange: (value) => handleFieldChange("team_recommendations", value),
          },
        ]}
      />
    </div>
  );
}
