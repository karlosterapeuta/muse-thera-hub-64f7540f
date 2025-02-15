
import { FormSection } from "@/pages/anamnesis/components/FormSection";
import { DateField } from "./DateField";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function AdministrativeDischargeForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <DateField
          label="Data da Alta"
          value={content.discharge_date || ""}
          onChange={(value) => handleFieldChange("discharge_date", value)}
        />
      </div>

      <FormSection
        title="Informações da Alta"
        fields={[
          {
            key: "reason",
            label: "Motivo da Alta",
            placeholder: "Descreva o motivo da alta",
            value: content.reason || "Motivos que levaram à alta administrativa:\n\n1. Aspectos Administrativos:\n- Mudança de residência\n- Impossibilidade de manutenção do tratamento\n- Questões relacionadas à frequência\n\n2. Contexto Familiar:\n- Reorganização da dinâmica familiar\n- Alterações na disponibilidade de horários",
            onChange: (value) => handleFieldChange("reason", value),
          },
          {
            key: "recommendations",
            label: "Recomendações",
            placeholder: "Anote as recomendações para o paciente",
            value: content.recommendations || "Recomendações para continuidade do cuidado:\n\n1. Encaminhamentos:\n- Buscar serviço de musicoterapia na nova localidade\n- Manter acompanhamento com equipe multidisciplinar\n\n2. Orientações:\n- Manter as práticas musicais desenvolvidas\n- Continuar atividades que favoreçam o desenvolvimento",
            onChange: (value) => handleFieldChange("recommendations", value),
          },
          {
            key: "follow_up",
            label: "Acompanhamento",
            placeholder: "Descreva o plano de acompanhamento",
            value: content.follow_up || "Plano de acompanhamento pós-alta:\n\n1. Transição:\n- Período de adaptação de 30 dias\n- Contatos de referência fornecidos\n\n2. Suporte:\n- Disponibilidade para orientações pontuais\n- Articulação com nova equipe quando necessário",
            onChange: (value) => handleFieldChange("follow_up", value),
          },
        ]}
      />
    </div>
  );
}
