
import { FormSection } from "@/pages/anamnesis/components/FormSection";
import { SelectField } from "@/pages/anamnesis/components/SelectField";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Heart, Brain, Activity } from "lucide-react";

type FormProps = {
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
};

const scoreOptions = [
  { value: "0", label: "0 - Ausente" },
  { value: "1", label: "1 - Emergente" },
  { value: "2", label: "2 - Inconsistente" },
  { value: "3", label: "3 - Consistente" },
  { value: "4", label: "4 - Independente" },
];

export function AssessmentReportForm({ content, onChange }: FormProps) {
  const updateField = (field: string, value: string) => {
    onChange({ ...content, [field]: value });
  };

  const domainIcons = {
    musical: Music,
    psicossocial: Heart,
    cognitivo: Brain,
    sensoriomotor: Activity,
  };

  const domainData = {
    musical: {
      title: "Domínio Musical",
      description: "Avaliação das competências musicais",
      subdomains: {
        expressaoMusical: {
          title: "Expressão Musical",
          parameters: [
            "vocalização",
            "cantoEntoação",
            "imitaçãoVocal",
            "improvisaçãoVocal",
            "expressãoVocalIndependente"
          ]
        }
      }
    },
    psicossocial: {
      title: "Domínio Psicossocial",
      description: "Avaliação das habilidades emocionais e sociais",
      subdomains: {
        regulacaoEmocional: {
          title: "Regulação Emocional",
          parameters: [
            "reconhecimentoEmocional",
            "expressãoEmocional",
            "autoregulação",
            "adaptaçãoEmocional",
            "resiliênciaEmocional"
          ]
        }
      }
    },
    cognitivo: {
      title: "Domínio Cognitivo",
      description: "Avaliação das funções cognitivas",
      subdomains: {
        processamentoInformacao: {
          title: "Processamento da Informação",
          parameters: [
            "atençãoSustentada",
            "memóriaTrabalho",
            "flexibilidadeCognitiva",
            "velocidadeProcessamento",
            "tomadasDecisão"
          ]
        }
      }
    },
    sensoriomotor: {
      title: "Domínio Sensório-Motor",
      description: "Avaliação das habilidades sensoriais e motoras",
      subdomains: {
        processamentoSensorial: {
          title: "Processamento Sensorial",
          parameters: [
            "discriminaçãoAuditiva",
            "integraçãoSensorial",
            "coordenaçãoMotora",
            "sequenciaçãoMotora",
            "planificaçãoMotora"
          ]
        }
      }
    }
  };

  const renderParameterField = (domainKey: string, subdomainKey: string, parameter: string) => {
    const fieldKey = `${domainKey}_${subdomainKey}_${parameter}`;
    return (
      <div key={parameter} className="grid grid-cols-2 gap-4 items-center">
        <label className="text-sm font-medium capitalize">
          {parameter.replace(/([A-Z])/g, ' $1').trim()}
        </label>
        <SelectField
          label=""
          value={content[fieldKey] || ""}
          onChange={(value) => updateField(fieldKey, value)}
          options={scoreOptions}
        />
      </div>
    );
  };

  const renderSubdomain = (domainKey: string, subdomainKey: string, subdomainData: any) => {
    return (
      <Card key={subdomainKey} className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">{subdomainData.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subdomainData.parameters.map((parameter: string) => 
            renderParameterField(domainKey, subdomainKey, parameter)
          )}
          
          <FormSection
            title={`Observações - ${subdomainData.title}`}
            fields={[
              {
                key: `observacoes_${domainKey}_${subdomainKey}`,
                label: "Observações Qualitativas",
                placeholder: `Registre observações específicas sobre ${subdomainData.title.toLowerCase()}`,
                value: content[`observacoes_${domainKey}_${subdomainKey}`] || "",
                onChange: (value) => updateField(`observacoes_${domainKey}_${subdomainKey}`, value),
              }
            ]}
          />
        </CardContent>
      </Card>
    );
  };

  const renderDomain = (domainKey: string, domainData: any) => {
    const IconComponent = domainIcons[domainKey as keyof typeof domainIcons];
    
    return (
      <TabsContent key={domainKey} value={domainKey} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconComponent className="h-5 w-5" />
              {domainData.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{domainData.description}</p>
          </CardHeader>
          <CardContent>
            {Object.entries(domainData.subdomains).map(([subdomainKey, subdomainData]) =>
              renderSubdomain(domainKey, subdomainKey, subdomainData)
            )}
            
            <FormSection
              title={`Análise Geral - ${domainData.title}`}
              fields={[
                {
                  key: `analise_${domainKey}`,
                  label: "Análise do Domínio",
                  placeholder: `Análise geral dos resultados do ${domainData.title.toLowerCase()}`,
                  value: content[`analise_${domainKey}`] || "",
                  onChange: (value) => updateField(`analise_${domainKey}`, value),
                },
                {
                  key: `recomendacoes_${domainKey}`,
                  label: "Recomendações",
                  placeholder: `Recomendações específicas para o ${domainData.title.toLowerCase()}`,
                  value: content[`recomendacoes_${domainKey}`] || "",
                  onChange: (value) => updateField(`recomendacoes_${domainKey}`, value),
                }
              ]}
            />
          </CardContent>
        </Card>
      </TabsContent>
    );
  };

  return (
    <div className="space-y-6">
      <FormSection
        title="Informações Gerais da Avaliação"
        fields={[
          {
            key: "metodologia",
            label: "Metodologia de Avaliação",
            placeholder: "Descreva os métodos e instrumentos utilizados na avaliação",
            value: content.metodologia || "",
            onChange: (value) => updateField("metodologia", value),
          },
          {
            key: "ambiente",
            label: "Ambiente de Avaliação",
            placeholder: "Descreva o ambiente onde foi realizada a avaliação",
            value: content.ambiente || "",
            onChange: (value) => updateField("ambiente", value),
          }
        ]}
      />

      <Tabs defaultValue="musical" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="musical">Musical</TabsTrigger>
          <TabsTrigger value="psicossocial">Psicossocial</TabsTrigger>
          <TabsTrigger value="cognitivo">Cognitivo</TabsTrigger>
          <TabsTrigger value="sensoriomotor">Sensório-Motor</TabsTrigger>
        </TabsList>

        {Object.entries(domainData).map(([domainKey, domainData]) =>
          renderDomain(domainKey, domainData)
        )}
      </Tabs>

      <FormSection
        title="Conclusões e Recomendações Gerais"
        fields={[
          {
            key: "conclusoes",
            label: "Conclusões Gerais",
            placeholder: "Síntese dos principais achados da avaliação",
            value: content.conclusoes || "",
            onChange: (value) => updateField("conclusoes", value),
          },
          {
            key: "objetivosTerapeuticos",
            label: "Objetivos Terapêuticos",
            placeholder: "Objetivos propostos com base nos resultados da avaliação",
            value: content.objetivosTerapeuticos || "",
            onChange: (value) => updateField("objetivosTerapeuticos", value),
          },
          {
            key: "prognostico",
            label: "Prognóstico",
            placeholder: "Prognóstico baseado nos achados da avaliação",
            value: content.prognostico || "",
            onChange: (value) => updateField("prognostico", value),
          }
        ]}
      />
    </div>
  );
}
