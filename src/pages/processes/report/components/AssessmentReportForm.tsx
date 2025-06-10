
import React, { useState } from "react";
import { FormSection } from "@/pages/anamnesis/components/FormSection";
import { SelectField } from "@/pages/anamnesis/components/SelectField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

export function AssessmentReportForm({ content, onChange }: FormProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>("musical");

  const updateField = (field: string, value: string) => {
    onChange({ ...content, [field]: value });
  };

  const scoreOptions = [
    { value: "0", label: "0 - Ausente" },
    { value: "1", label: "1 - Emergente" },
    { value: "2", label: "2 - Inconsistente" },
    { value: "3", label: "3 - Consistente" },
    { value: "4", label: "4 - Independente" },
  ];

  const domains = [
    {
      id: "musical",
      name: "Domínio Musical",
      color: "bg-blue-100 text-blue-800",
      parameters: [
        "expressao_vocal",
        "exploracao_instrumental", 
        "criacao_musical",
        "improvisacao",
        "percepcao_ritmica"
      ]
    },
    {
      id: "psychosocial", 
      name: "Domínio Psicossocial",
      color: "bg-green-100 text-green-800",
      parameters: [
        "interacao_social",
        "comunicacao_nao_verbal",
        "expressao_emocional",
        "autorregulacao",
        "participacao_grupal"
      ]
    },
    {
      id: "cognitive",
      name: "Domínio Cognitivo", 
      color: "bg-purple-100 text-purple-800",
      parameters: [
        "atencao_sustentada",
        "memoria_musical",
        "processamento_informacao",
        "resolucao_problemas",
        "tomada_decisao"
      ]
    },
    {
      id: "sensorimotor",
      name: "Domínio Sensório-Motor",
      color: "bg-orange-100 text-orange-800", 
      parameters: [
        "coordenacao_motora",
        "processamento_sensorial",
        "orientacao_espacial",
        "equilibrio_postural",
        "destreza_manual"
      ]
    }
  ];

  const calculateDomainProgress = (domain: any) => {
    const scores = domain.parameters.map((param: string) => 
      parseInt(content[param] || "0")
    );
    const total = scores.reduce((sum: number, score: number) => sum + score, 0);
    const maxPossible = domain.parameters.length * 4;
    return (total / maxPossible) * 100;
  };

  return (
    <div className="space-y-8">
      {/* Header with Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Relatório de Avaliação Musicoterapêutica</CardTitle>
          <p className="text-muted-foreground">
            Avalie cada parâmetro usando a escala de 0 a 4 pontos
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {domains.map((domain) => (
              <Card 
                key={domain.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedDomain === domain.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedDomain(domain.id)}
              >
                <CardContent className="p-4">
                  <Badge className={domain.color} variant="secondary">
                    {domain.name}
                  </Badge>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progresso</span>
                      <span>{Math.round(calculateDomainProgress(domain))}%</span>
                    </div>
                    <Progress value={calculateDomainProgress(domain)} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Domain Assessment */}
      {domains.map((domain) => (
        <Card key={domain.id} className={selectedDomain === domain.id ? 'ring-2 ring-primary' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Badge className={domain.color} variant="secondary">
                  {domain.name}
                </Badge>
              </CardTitle>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Progresso</div>
                <div className="font-bold">{Math.round(calculateDomainProgress(domain))}%</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {domain.parameters.map((param, index) => (
              <div key={param}>
                <SelectField
                  label={param.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  value={content[param] || ""}
                  onChange={(value) => updateField(param, value)}
                  options={scoreOptions}
                />
                {index < domain.parameters.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Analysis and Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Análise e Recomendações</CardTitle>
        </CardHeader>
        <CardContent>
          <FormSection
            title=""
            fields={[
              {
                key: "qualitative_analysis",
                label: "Análise Qualitativa",
                placeholder: "Descreva observações qualitativas sobre o desenvolvimento do paciente...",
                value: content.qualitative_analysis || "",
                onChange: (value) => updateField("qualitative_analysis", value),
              },
              {
                key: "strengths_identified",
                label: "Forças Identificadas",
                placeholder: "Liste os pontos fortes e habilidades observadas...",
                value: content.strengths_identified || "",
                onChange: (value) => updateField("strengths_identified", value),
              },
              {
                key: "areas_for_development",
                label: "Áreas para Desenvolvimento",
                placeholder: "Identifique áreas que necessitam maior atenção e desenvolvimento...",
                value: content.areas_for_development || "",
                onChange: (value) => updateField("areas_for_development", value),
              },
              {
                key: "therapeutic_recommendations",
                label: "Recomendações Terapêuticas",
                placeholder: "Forneça recomendações específicas para o plano terapêutico...",
                value: content.therapeutic_recommendations || "",
                onChange: (value) => updateField("therapeutic_recommendations", value),
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
