
import { FormSection } from "@/pages/anamnesis/components/FormSection";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function GroupSessionForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      <FormSection
        title="Dados da Sessão em Grupo"
        fields={[
          {
            key: "date",
            label: "Data",
            placeholder: "dd/mm/aaaa",
            value: content.date || "",
            onChange: (value) => handleFieldChange("date", value),
          },
          {
            key: "participants",
            label: "Participantes",
            placeholder: "Liste os participantes do grupo",
            value: content.participants || "",
            onChange: (value) => handleFieldChange("participants", value),
          },
          {
            key: "theme",
            label: "Tema",
            placeholder: "Tema central da sessão em grupo",
            value: content.theme || "Integração Social através da Música:\n- Desenvolvimento de habilidades sociais\n- Promoção de interação musical em grupo\n- Fortalecimento de vínculos interpessoais",
            onChange: (value) => handleFieldChange("theme", value),
          },
        ]}
      />

      <FormSection
        title="Desenvolvimento"
        fields={[
          {
            key: "group_dynamics",
            label: "Dinâmica do Grupo",
            placeholder: "Descreva a dinâmica e interações do grupo",
            value: content.group_dynamics || "- Realização de círculo musical interativo\n- Atividades de improvisação em grupo\n- Jogos musicais cooperativos\n- Criação coletiva de canções\n- Exercícios de escuta ativa e resposta musical",
            onChange: (value) => handleFieldChange("group_dynamics", value),
          },
          {
            key: "activities",
            label: "Atividades Realizadas",
            placeholder: "Descreva as atividades musicoterapêuticas realizadas",
            value: content.activities || "1. Aquecimento musical com percussão corporal\n2. Improvisação musical coletiva\n3. Re-criação de canções significativas\n4. Composição musical em grupo\n5. Relaxamento com audição musical guiada",
            onChange: (value) => handleFieldChange("activities", value),
          },
        ]}
      />

      <FormSection
        title="Avaliação"
        fields={[
          {
            key: "group_response",
            label: "Resposta do Grupo",
            placeholder: "Como o grupo respondeu às intervenções",
            value: content.group_response || "O grupo demonstrou:\n- Boa coesão nas atividades musicais\n- Desenvolvimento da escuta mútua\n- Capacidade de sincronização rítmica\n- Expressão emocional através da música\n- Suporte mútuo nas atividades propostas",
            onChange: (value) => handleFieldChange("group_response", value),
          },
          {
            key: "observations",
            label: "Observações",
            placeholder: "Observações gerais sobre a sessão",
            value: content.observations || "A sessão em grupo promoveu importante desenvolvimento das habilidades sociais através das experiências musicais compartilhadas, fortalecendo vínculos e estimulando a expressão individual dentro do contexto coletivo.",
            onChange: (value) => handleFieldChange("observations", value),
          },
        ]}
      />
    </div>
  );
}
