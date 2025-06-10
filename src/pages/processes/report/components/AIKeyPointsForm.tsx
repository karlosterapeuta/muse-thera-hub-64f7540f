
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AIKeyPointsFormProps {
  onGenerate: (keyPoints: string) => Promise<void>;
  isGenerating: boolean;
  reportType: string;
}

export function AIKeyPointsForm({ onGenerate, isGenerating, reportType }: AIKeyPointsFormProps) {
  const [keyPoints, setKeyPoints] = useState("");

  const getDetailedPlaceholderText = (type: string) => {
    const placeholders = {
      individual_session: `Exemplo detalhado para uma sessão individual:

"Paciente João, 8 anos, diagnóstico de TEA. Primeira sessão após período de férias escolares. Chegou um pouco agitado, demonstrando dificuldade inicial para estabelecer contato visual.

PONTOS POSITIVOS:
- Demonstrou interesse imediato pelos instrumentos de percussão, especialmente pandeiro e xilofone
- Após 10 minutos, conseguiu se acalmar com música instrumental suave
- Tentou imitar ritmos simples propostos pelo terapeuta
- Vocalizou espontaneamente durante atividade com violão

DESAFIOS OBSERVADOS:
- Resistência inicial às mudanças de atividade
- Dificuldade em manter atenção por mais de 5 minutos
- Sensibilidade a sons muito agudos
- Necessitou de mais tempo para transições

ESTRATÉGIAS EFICAZES:
- Uso de música familiar como âncora emocional
- Instrumentos com texturas táteis interessantes
- Comunicação através de gestos musicais
- Ambiente com iluminação suave

OBJETIVOS TRABALHADOS:
- Autorregulação emocional
- Coordenação motora fina e grossa
- Comunicação não-verbal
- Socialização e vínculo terapêutico"`,

      monthly_evolution: `Exemplo para evolução mensal:

"Pedro, 12 anos, autismo nível 1. Acompanhamento há 6 meses.

EVOLUÇÃO NO PERÍODO:
- Mês focado em habilidades de comunicação e interação social
- 4 sessões realizadas com frequência semanal
- Introdução de atividades em dupla (terapeuta-paciente)

PROGRESSOS SIGNIFICATIVOS:
- Aumento de 40% nas iniciativas comunicativas espontâneas
- Desenvolvimento de preferência por instrumentos harmônicos (teclado/violão)
- Melhora notável na imitação rítmica e melódica
- Redução de comportamentos estereotipados durante as atividades musicais
- Maior tolerância a mudanças no repertório musical

DESAFIOS PERSISTENTES:
- Dificuldade com mudanças bruscas de dinâmica musical
- Necessidade de preparação prévia para atividades novas
- Sensibilidade a determinados timbres instrumentais

ESTRATÉGIAS IMPLEMENTADAS:
- Uso de agenda visual musical
- Técnicas de respiração com flauta doce
- Criação de 'biblioteca musical pessoal'
- Envolvimento da família em atividades domiciliares

FEEDBACK FAMILIAR:
- Família relata maior calma em casa
- Começou a cantarolar músicas trabalhadas na terapia
- Demonstra interesse por instrumentos em outros contextos"`,

      daily_evolution: `Exemplo para evolução diária:

"Maria, 15 anos, ansiedade e depressão. Sessão de hoje (23/05).

ESTADO INICIAL:
- Chegou visivelmente tensa, relatando semana difícil na escola
- Postura corporal fechada, evitando contato visual
- Relatou insônia e dificuldade de concentração
- Humor rebaixado, pouca energia aparente

INTERVENÇÕES REALIZADAS:
- Iniciamos com respiração guiada ao som do violão
- Atividade de improvisação livre no teclado para expressão emocional
- Composição de melodia simples sobre sentimentos atuais
- Técnica de relaxamento com música receptiva

RESPOSTAS OBSERVADAS:
- Após 15 minutos, demonstrou maior relaxamento corporal
- Expressou através da música sentimentos que verbalmente eram difíceis
- Criou melodia melancólica mas esperançosa
- Verbalizou sensação de alívio ao final da sessão

INSIGHTS DA SESSÃO:
- Música como canal privilegiado de expressão emocional
- Necessidade de atividades que promovam autoestima
- Importância do setting acolhedor e não-julgativo
- Potencial da composição como ferramenta terapêutica"`,

      semester_evolution: `Exemplo para evolução semestral:

"Ana, 7 anos, paralisia cerebral leve. Avaliação de 6 meses de tratamento.

CONTEXTO INICIAL:
- Início do acompanhamento em janeiro/2024
- Demanda: estimulação motora e comunicativa
- Família muito engajada no processo
- Objetivos: coordenação, expressão e socialização

PROCESSO DESENVOLVIDO:
- 24 sessões realizadas (frequência semanal)
- Metodologia: técnicas ativas e receptivas
- Instrumentos adaptados conforme necessidades motoras
- Trabalho gradual de complexidade crescente

PRINCIPAIS CONQUISTAS:
- Desenvolvimento significativo da coordenação bilateral
- Ampliação do vocabulário expressivo
- Melhora na sustentação da atenção (5 para 20 minutos)
- Criação de vínculos sociais positivos
- Demonstração de iniciativa musical espontânea

ENVOLVIMENTO FAMILIAR:
- Pais participativos e colaborativos
- Implementação de atividades musicais domiciliares
- Crescimento da confiança familiar no potencial da criança
- Relatos de generalização para outros contextos

PERSPECTIVAS:
- Excelente evolução em todos os parâmetros
- Recomendação de continuidade
- Possibilidade de inclusão em atividades grupais
- Preparação para desafios de maior complexidade"`,

      therapeutic_discharge: `Exemplo para alta terapêutica:

"Carlos, 45 anos, reabilitação pós-AVC. Processo de 18 meses finalizado.

RESUMO DO TRATAMENTO:
- Início: março/2023 - Término: setembro/2024
- 72 sessões realizadas
- Foco: reabilitação motora, cognitiva e emocional
- Evolução excepcional em todos os aspectos

OBJETIVOS ALCANÇADOS:
- Recuperação de 85% da coordenação motora fina
- Melhora significativa na expressão verbal
- Desenvolvimento de estratégias de autorregulação emocional
- Retomada de atividades musicais recreativas
- Fortalecimento da autoestima e confiança

COMPETÊNCIAS DESENVOLVIDAS:
- Execução instrumental adaptada
- Criação de repertório musical personalizado
- Uso da música como ferramenta de bem-estar
- Habilidades de relaxamento e controle de ansiedade

PREPARAÇÃO PARA ALTA:
- Família orientada para continuidade domiciliar
- Estratégias de manutenção estabelecidas
- Recursos comunitários identificados
- Follow-up programado para 3 meses

PROGNÓSTICO:
- Excelente para manutenção das conquistas
- Autonomia suficiente para autogestão
- Recursos adaptativos bem desenvolvidos
- Alta com segurança e confiança"`,

      group_session: `Exemplo para sessão em grupo:

"Grupo de adolescentes (14-17 anos), 5 participantes. Tema: 'Expressão de identidade'.

COMPOSIÇÃO DO GRUPO:
- João (16 anos, introvertido, gosta de guitarra)
- Maria (15 anos, muito verbal, prefere canto)
- Pedro (17 anos, líder natural, baterista)
- Ana (14 anos, tímida, interesse por piano)
- Lucas (16 anos, crítico musical, gosta de composição)

DINÂMICA OBSERVADA:
- Energia alta no início da sessão
- Boa interação entre Maria e Pedro
- João mais reservado, mas engajado instrumentalmente
- Ana precisou de encorajamento para participar
- Lucas assumiu papel de 'diretor musical'

ATIVIDADES REALIZADAS:
- Criação coletiva de música sobre 'quem somos'
- Cada membro contribuiu com seu instrumento preferido
- Improvisação livre seguida de estruturação
- Compartilhamento de significados pessoais da música criada

RESULTADOS:
- Música original criada pelo grupo
- Todos participaram ativamente
- Momentos de liderança distribuída
- Expressão autêntica de personalidades
- Vínculo grupal fortalecido

OBSERVAÇÕES TÉCNICAS:
- Necessidade de mediação em momentos de divergência criativa
- Importância do respeito aos tempos individuais
- Música como facilitadora de comunicação autêntica
- Potencial do grupo para trabalhos futuros mais complexos"`
    };

    return placeholders[type as keyof typeof placeholders] || placeholders.individual_session;
  };

  const getReportTypeLabel = (type: string) => {
    const labels = {
      individual_session: "Sessão Individual",
      monthly_evolution: "Evolução Mensal", 
      daily_evolution: "Evolução Diária",
      semester_evolution: "Evolução Semestral",
      therapeutic_discharge: "Alta Terapêutica",
      group_session: "Sessão em Grupo",
      technical_report: "Relatório Técnico"
    };

    return labels[type as keyof typeof labels] || "Relatório";
  };

  const getGuidanceText = (type: string) => {
    const guidance = {
      individual_session: "Descreva detalhadamente a sessão: estado inicial do paciente, atividades realizadas, respostas observadas, progressos e desafios identificados.",
      monthly_evolution: "Relate a evolução do paciente no período: objetivos trabalhados, conquistas alcançadas, dificuldades encontradas e ajustes necessários.",
      daily_evolution: "Documente a sessão do dia: como o paciente chegou, atividades propostas, respostas apresentadas e observações relevantes.",
      semester_evolution: "Avalie o período completo: contexto inicial, processo desenvolvido, áreas de evolução, envolvimento familiar e conclusões.",
      therapeutic_discharge: "Summarize todo o tratamento: objetivos alcançados, competências desenvolvidas e recomendações para continuidade.",
      group_session: "Descreva a dinâmica grupal: participantes, tema trabalhado, interações observadas e resultados da sessão.",
      technical_report: "Forneça uma análise técnica completa do processo musicoterapêutico e suas implicações clínicas."
    };

    return guidance[type as keyof typeof guidance] || guidance.individual_session;
  };

  const handleGenerate = async () => {
    if (keyPoints.trim()) {
      await onGenerate(keyPoints.trim());
    }
  };

  return (
    <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          Geração Inteligente de Relatório
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Forneça informações detalhadas sobre o paciente e o contexto. A IA gerará um {getReportTypeLabel(reportType).toLowerCase()} completo e estruturado que você poderá revisar e personalizar.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Dica:</strong> {getGuidanceText(reportType)}
          </AlertDescription>
        </Alert>

        <div>
          <Label htmlFor="keyPoints" className="text-base font-medium">
            Informações do Paciente e Contexto da Sessão
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            Quanto mais detalhes você fornecer, mais preciso e personalizado será o relatório gerado.
          </p>
          <Textarea
            id="keyPoints"
            placeholder={getDetailedPlaceholderText(reportType)}
            value={keyPoints}
            onChange={(e) => setKeyPoints(e.target.value)}
            rows={12}
            className="mt-2 text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Caracteres: {keyPoints.length} (recomendado: mínimo 200 caracteres para melhor qualidade)
          </p>
        </div>
        
        <Button 
          onClick={handleGenerate}
          disabled={!keyPoints.trim() || keyPoints.length < 50 || isGenerating}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando relatório inteligente...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Gerar {getReportTypeLabel(reportType)} com IA
            </>
          )}
        </Button>
        
        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>✨ O relatório será gerado com estrutura profissional e linguagem técnica apropriada</p>
          <p>📝 Você poderá revisar, editar e personalizar todo o conteúdo antes de salvar</p>
          <p>🔄 Se a IA estiver indisponível, um modelo estruturado será gerado automaticamente</p>
        </div>
      </CardContent>
    </Card>
  );
}
