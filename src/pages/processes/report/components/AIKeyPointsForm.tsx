
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, Info, Zap, Brain, Rocket } from "lucide-react";
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
    <div className="space-y-6">
      {/* Animated Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="relative bg-white rounded-xl p-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <Brain className="h-10 w-10 text-purple-600 animate-pulse" />
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                IA Especializada em Musicoterapia
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Análise inteligente • Relatórios profissionais • Economia de tempo
              </p>
            </div>
            <Rocket className="h-10 w-10 text-pink-600 animate-bounce" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">⚡</div>
              <div className="text-sm font-semibold text-blue-800">Rápido</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-600">🎯</div>
              <div className="text-sm font-semibold text-purple-800">Preciso</div>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-3">
              <div className="text-2xl font-bold text-pink-600">📊</div>
              <div className="text-sm font-semibold text-pink-800">Profissional</div>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-2 border-dashed border-purple-300 bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-pink-50/50 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-primary">
            <div className="relative">
              <Sparkles className="h-6 w-6 animate-spin text-purple-600" />
              <div className="absolute inset-0 bg-purple-400 rounded-full blur-sm opacity-30 animate-pulse"></div>
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Geração Inteligente de Relatório
            </span>
          </CardTitle>
          <p className="text-base text-muted-foreground">
            🎼 Nossa IA especializada analisa suas informações e cria um {getReportTypeLabel(reportType).toLowerCase()} 
            completo e estruturado seguindo as melhores práticas da musicoterapia.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-purple-600" />
              <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
            </div>
            <AlertDescription className="text-base">
              <strong className="text-purple-800">💡 Dica Profissional:</strong> {getGuidanceText(reportType)}
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <Label htmlFor="keyPoints" className="text-lg font-semibold flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Informações do Paciente e Contexto da Sessão
            </Label>
            <p className="text-base text-muted-foreground bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200">
              🎯 <strong>Quanto mais detalhes você fornecer, mais preciso e personalizado será o relatório gerado.</strong>
              <br />
              ✨ A IA analisará suas informações e criará um documento profissional completo.
            </p>
            <Textarea
              id="keyPoints"
              placeholder={getDetailedPlaceholderText(reportType)}
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              rows={14}
              className="text-base border-2 border-purple-200 focus:border-purple-400 bg-white/70 backdrop-blur-sm"
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Caracteres: <span className={keyPoints.length >= 200 ? 'text-green-600 font-semibold' : 'text-orange-600'}>{keyPoints.length}</span> 
                (recomendado: mínimo 200 para melhor qualidade)
              </p>
              {keyPoints.length >= 200 && (
                <div className="flex items-center gap-1 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Pronto para gerar!</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="relative">
            <Button 
              onClick={handleGenerate}
              disabled={!keyPoints.trim() || keyPoints.length < 50 || isGenerating}
              className="w-full h-16 text-lg font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 hover:from-purple-700 hover:via-blue-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-purple-500/25 transform hover:scale-[1.02] transition-all duration-300 rounded-xl relative overflow-hidden group"
              size="lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-pulse group-hover:animate-none"></div>
              <div className="relative flex items-center justify-center gap-3">
                {isGenerating ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Gerando relatório inteligente...</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <Zap className="h-6 w-6 animate-bounce" />
                    <span>🚀 Gerar {getReportTypeLabel(reportType)} com IA</span>
                    <Sparkles className="h-6 w-6 animate-pulse" />
                  </>
                )}
              </div>
            </Button>
            
            {!isGenerating && keyPoints.length >= 200 && (
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-30 animate-pulse pointer-events-none"></div>
            )}
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
            <div className="text-sm space-y-2">
              <div className="flex items-center gap-2 text-green-700 font-semibold">
                <Sparkles className="h-4 w-4" />
                <span>Vantagens da Geração com IA:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>✨ Estrutura profissional automatizada</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>📝 Linguagem técnica apropriada</span>
                </div>
                <div className="flex items-center gap-2 text-purple-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>🔄 Totalmente editável após geração</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
