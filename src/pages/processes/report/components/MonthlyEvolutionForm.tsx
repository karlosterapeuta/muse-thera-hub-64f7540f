import { FormSection } from "@/pages/anamnesis/components/FormSection";
import { DateField } from "./DateField";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function MonthlyEvolutionForm({ content, onChange }: FormProps) {
  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <DateField
          label="Data"
          value={content.month || ""}
          onChange={(value) => handleFieldChange("month", value)}
        />
      </div>

      <FormSection
        title="Evolução"
        fields={[
          {
            key: "development_areas",
            label: "Áreas de Desenvolvimento",
            placeholder: "Descreva as áreas trabalhadas",
            value: content.development_areas || "1. Desenvolvimento Sonoro-Musical:\n- Exploração de diferentes timbres e intensidades\n- Desenvolvimento rítmico\n- Expressão melódica\n\n2. Aspectos Psicossociais:\n- Interação social através da música\n- Expressão emocional\n- Comunicação não-verbal\n\n3. Habilidades Cognitivas:\n- Atenção e concentração nas atividades musicais\n- Memória musical\n- Organização temporal",
            onChange: (value) => handleFieldChange("development_areas", value),
          },
          {
            key: "progress",
            label: "Progressos Alcançados",
            placeholder: "Descreva os progressos observados",
            value: content.progress || "- Aumento significativo na participação em atividades de improvisação musical\n- Melhora na coordenação rítmica e expressão sonora\n- Desenvolvimento da capacidade de interação musical em grupo\n- Ampliação do repertório de expressão emocional através da música\n- Maior autonomia nas escolhas musicais e expressivas",
            onChange: (value) => handleFieldChange("progress", value),
          },
          {
            key: "challenges",
            label: "Desafios",
            placeholder: "Descreva os desafios encontrados",
            value: content.challenges || "- Necessidade de maior estruturação temporal em algumas atividades\n- Momentos de resistência em experiências musicais específicas\n- Variação no nível de engajamento em diferentes modalidades de intervenção\n- Aspectos a serem desenvolvidos na interação musical em grupo",
            onChange: (value) => handleFieldChange("challenges", value),
          },
        ]}
      />
    </div>
  );
}
