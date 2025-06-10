
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ReportFormFields } from "./components/ReportFormFields";
import { ReportContentTabs } from "./components/ReportContentTabs";
import { useReportData } from "./hooks/useReportData";
import { generatePDF } from "./utils/pdfGenerator";

const formSchema = z.object({
  patient_id: z.string({
    required_error: "Por favor, selecione um paciente",
  }),
  date: z.date({
    required_error: "Por favor, selecione uma data",
  }),
  type: z.string({
    required_error: "Por favor, selecione o tipo de relatório",
  }),
  content: z.record(z.any()).default({}),
});

type FormValues = z.infer<typeof formSchema>;

export default function ReportForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);
  const [activeTab, setActiveTab] = useState("manual");

  const {
    patients,
    isLoadingPatients,
    userEmail,
    userName,
    professionalData,
  } = useReportData();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_id: "",
      date: new Date(),
      type: "",
      content: {},
    },
  });

  const generateWithAI = async (keyPoints: string) => {
    setIsGeneratingWithAI(true);
    try {
      const selectedPatient = patients.find(p => p.id === form.getValues('patient_id'));
      const selectedType = form.getValues('type');
      const selectedDate = form.getValues('date');

      if (!selectedPatient || !selectedType || !selectedDate) {
        toast({
          variant: "destructive",
          title: "Dados incompletos",
          description: "Por favor, selecione paciente, data e tipo de relatório antes de gerar com IA.",
        });
        return;
      }

      console.log('Calling generate-report function with:', {
        reportType: selectedType,
        keyPoints: keyPoints,
        patientName: selectedPatient.name,
        evaluationDate: format(selectedDate, 'yyyy-MM-dd')
      });

      // Tentar chamar a função edge do Supabase com retry
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          const { data, error } = await supabase.functions.invoke('generate-report', {
            body: {
              reportType: selectedType,
              keyPoints: keyPoints,
              patientName: selectedPatient.name,
              evaluationDate: format(selectedDate, 'yyyy-MM-dd')
            }
          });

          if (error) {
            console.error('Supabase function error:', error);
            throw new Error(`Erro na função: ${error.message}`);
          }

          if (data && data.content) {
            form.setValue('content', data.content);
            setActiveTab('manual');
            toast({
              title: "Relatório gerado com IA!",
              description: "O conteúdo foi gerado pela inteligência artificial. Revise e edite conforme necessário.",
            });
            return;
          } else {
            throw new Error('Resposta inválida da função');
          }

        } catch (functionError) {
          console.error(`Tentativa ${retryCount + 1} falhou:`, functionError);
          retryCount++;
          
          if (retryCount <= maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
          }
        }
      }

      // Se chegou aqui, todas as tentativas falharam, usar fallback aprimorado
      console.log('Todas as tentativas de IA falharam, gerando conteúdo local aprimorado');
      
      const enhancedContent = generateEnhancedFallbackContent(selectedType, keyPoints, selectedPatient.name, selectedDate);
      form.setValue('content', enhancedContent);
      setActiveTab('manual');
      
      toast({
        title: "Relatório gerado localmente",
        description: "A IA está temporariamente indisponível. Um relatório estruturado foi gerado para você editar.",
        variant: "default",
      });

    } catch (error) {
      console.error('Erro geral ao gerar relatório:', error);
      toast({
        variant: "destructive",
        title: "Erro na geração",
        description: "Não foi possível gerar o relatório. Tente preencher manualmente.",
      });
    } finally {
      setIsGeneratingWithAI(false);
    }
  };

  const generateEnhancedFallbackContent = (reportType: string, keyPoints: string, patientName: string, date: Date) => {
    const formattedDate = format(date, 'dd/MM/yyyy');
    const baseContent = {
      patient_name: patientName,
      evaluation_date: formattedDate,
      key_points: keyPoints,
      generated_locally: true
    };

    switch (reportType) {
      case "individual_session":
        return {
          ...baseContent,
          objectives: `Objetivos Terapêuticos da Sessão Individual - ${patientName} (${formattedDate})
          
• Estimular a comunicação verbal e não-verbal através de atividades musicais
• Desenvolver habilidades motoras finas e grossas com instrumentos musicais
• Promover a autorregulação emocional através da expressão musical
• Fortalecer o vínculo terapêutico e a confiança
• Trabalhar aspectos específicos baseados nos pontos observados: ${keyPoints}`,

          activities: `Atividades Musicoterapêuticas Realizadas:

1. AQUECIMENTO E ACOLHIMENTO
• Música de boas-vindas personalizada
• Exercícios de respiração com sons vocais
• Reconhecimento do espaço terapêutico

2. ATIVIDADES PRINCIPAIS
• Exploração livre de instrumentos (xilofone, tambores, chocalhos)
• Improvisação musical dirigida
• Canto terapêutico com repertório conhecido
• Jogos musicais interativos

3. TÉCNICAS APLICADAS
• Método receptivo: audição musical ativa
• Método ativo: criação e execução musical
• Técnicas de espelhamento musical
• Sincronização rítmica terapêutica`,

          patient_response: `Resposta e Engajamento do Paciente:

ASPECTOS POSITIVOS OBSERVADOS:
• Demonstrou interesse pelos instrumentos apresentados
• Manteve atenção sustentada durante as atividades propostas
• Apresentou tentativas de comunicação através da música
• Mostrou sinais de relaxamento durante as intervenções

DESAFIOS IDENTIFICADOS:
• Necessidade de maior tempo de adaptação às mudanças de atividade
• Dificuldades pontuais de coordenação motora
• Momentos de autorregulação que requerem suporte adicional

PROGRESSOS OBSERVADOS:
Com base nos pontos principais relatados (${keyPoints}), foi possível observar evolução significativa na participação e interesse pelas atividades propostas.`,

          observations: `Observações Clínicas e Técnicas:

ANÁLISE MUSICOTERAPÊUTICA:
• Preferências sonoro-musicais: [instrumentos de percussão/melódicos/vocais]
• Padrões rítmicos demonstrados: [regular/irregular/em desenvolvimento]
• Capacidade de improvisação: [livre/dirigida/em construção]
• Resposta à estrutura musical: [positiva/gradual/necessita adaptação]

ASPECTOS RELACIONAIS:
• Vínculo terapêutico: fortalecimento progressivo observado
• Comunicação não-verbal: expressiva através da música
• Iniciativa musical: [espontânea/encorajada/em desenvolvimento]

PONTOS DE ATENÇÃO TÉCNICA:
• Necessidade de continuidade nas intervenções específicas
• Atenção aos sinais de fadiga ou sobrecarga sensorial
• Adaptação do setting conforme responsividade apresentada`,

          next_steps: `Planejamento e Próximos Passos:

OBJETIVOS PARA PRÓXIMAS SESSÕES:
• Aprofundar as técnicas que demonstraram maior efetividade
• Expandir o repertório musical conforme interesses manifestados
• Trabalhar aspectos específicos identificados nesta sessão
• Continuar fortalecimento do vínculo terapêutico

ESTRATÉGIAS RECOMENDADAS:
• Manter estrutura consistente das sessões
• Introduzir gradualmente novos desafios musicais
• Documentar preferências e aversões sonoras
• Considerar envolvimento familiar nas atividades domiciliares

ENCAMINHAMENTOS:
• Continuidade do processo musicoterapêutico semanal
• Avaliação contínua da evolução apresentada
• Possível interconsulta com outros profissionais se necessário`
        };

      case "monthly_evolution":
        return {
          ...baseContent,
          therapeutic_objectives: `Objetivos Terapêuticos Trabalhados no Período:

OBJETIVOS GERAIS:
• Desenvolvimento da comunicação expressiva através da música
• Estimulação de habilidades socioemocionais e cognitivas
• Promoção da autorregulação e bem-estar emocional
• Fortalecimento de vínculos e interação social

OBJETIVOS ESPECÍFICOS BASEADOS NO CASO:
Com base nas observações registradas (${keyPoints}), foram priorizados:
• Trabalho específico de expressão emocional através de improvisação
• Desenvolvimento de coordenação motora com instrumentos variados
• Estimulação da atenção sustentada através de atividades estruturadas
• Promoção da confiança e autoestima através de conquistas musicais`,

          achievements: `Conquistas e Progressos Observados no Período:

DESENVOLVIMENTO MUSICAL:
• Maior familiaridade e exploração dos instrumentos musicais
• Desenvolvimento de padrões rítmicos mais organizados
• Ampliação do repertório vocal e instrumental
• Melhora na capacidade de imitação musical

ASPECTOS SOCIOEMOCIONAIS:
• Fortalecimento significativo do vínculo terapêutico
• Maior iniciativa na participação das atividades
• Demonstração de prazer e satisfação durante as sessões
• Redução de comportamentos de resistência ou evitação

HABILIDADES COMUNICATIVAS:
• Aumento de tentativas comunicativas espontâneas
• Uso da música como canal preferencial de expressão
• Melhora na compreensão de comandos e instruções musicais
• Desenvolvimento de comunicação não-verbal mais expressiva`,

          challenges: `Desafios e Dificuldades Encontradas:

ASPECTOS TÉCNICOS:
• Necessidade de adaptação constante das estratégias terapêuticas
• Variabilidade no estado emocional entre as sessões
• Processo gradual de construção da confiança
• Necessidade de tempo adicional para algumas conquistas

FATORES EXTERNOS:
• Influência de mudanças na rotina familiar/escolar
• Necessidade de maior envolvimento de cuidadores
• Adaptação a diferentes contextos e ambientes
• Coordenação com outros tratamentos simultâneos

ÁREAS DE DESENVOLVIMENTO:
• Autorregulação emocional em momentos de frustração
• Ampliação do tempo de atenção sustentada
• Generalização das conquistas para outros contextos`,

          adjustments: `Ajustes Realizados no Plano Terapêutico:

METODOLÓGICOS:
• Adaptação do tempo de duração das atividades
• Modificação na sequência e estrutura das sessões
• Introdução de novos instrumentos e técnicas
• Personalização das intervenções conforme responsividade

AMBIENTAIS:
• Adequação do setting terapêutico
• Otimização da organização espacial dos instrumentos
• Controle de estímulos sensoriais do ambiente
• Criação de rotinas previsíveis e reconfortantes

RELACIONAIS:
• Fortalecimento de estratégias de vínculo
• Adequação da postura terapêutica
• Envolvimento gradual da família no processo`,

          next_steps: `Planejamento para o Próximo Período:

CONTINUIDADE TERAPÊUTICA:
• Manutenção da frequência semanal das sessões
• Aprofundamento das técnicas que demonstraram maior eficácia
• Expansão gradual dos desafios musicais propostos
• Documentação sistemática da evolução

METAS PARA OS PRÓXIMOS 30 DIAS:
• Consolidação das conquistas já alcançadas
• Trabalho específico nas áreas que ainda apresentam desafios
• Introdução de atividades de maior complexidade
• Preparação para possível ampliação do setting (grupo/família)

ARTICULAÇÃO INTERDISCIPLINAR:
• Comunicação regular com outros profissionais da equipe
• Compartilhamento de estratégias eficazes
• Alinhamento de objetivos terapêuticos gerais
• Avaliação contínua da necessidade de ajustes no plano global de tratamento`
        };

      case "daily_evolution":
        return {
          ...baseContent,
          initial_state: `Estado Inicial Observado (${formattedDate}):

APRESENTAÇÃO GERAL:
• Humor: [descrever o humor observado na chegada]
• Disposição: [nível de energia e interesse demonstrado]
• Comunicação: [verbal/não-verbal, espontânea/responsiva]
• Estado físico: [postura, movimento, sinais de desconforto]

CONTEXTO ESPECÍFICO:
Baseado nas informações coletadas (${keyPoints}), o paciente ${patientName} apresentou-se com características específicas que orientaram as intervenções do dia.

FATORES INFLUENCIADORES:
• Qualidade do sono na noite anterior
• Alimentação e medicação regular
• Eventos significativos recentes
• Disposição familiar/cuidadores`,

          activities: `Atividades e Intervenções Realizadas:

ESTRUTURA DA SESSÃO:
1. Acolhimento Musical (5-10 min)
   • Música de recepção personalizada
   • Reconhecimento do espaço e instrumentos
   • Exercícios de respiração e relaxamento

2. Atividade Principal (20-30 min)
   • Exploração instrumental dirigida
   • Exercícios de improvisação musical
   • Jogos musicais interativos
   • Canto terapêutico

3. Fechamento (5-10 min)
   • Música de despedida
   • Reflexão sobre a sessão
   • Organização do espaço

TÉCNICAS MUSICOTERAPÊUTICAS APLICADAS:
• Improvisação musical livre e dirigida
• Audição musical receptiva
• Composição de melodias simples
• Exercícios rítmicos estruturados`,

          responses: `Respostas e Comportamentos Observados:

ENGAJAMENTO MUSICAL:
• Nível de participação: [ativo/moderado/necessitou estímulo]
• Preferências demonstradas: [instrumentos/estilos/atividades]
• Iniciativa musical: [espontânea/encorajada/gradual]
• Duração da atenção: [sustentada/flutuante/breve]

EXPRESSÃO EMOCIONAL:
• Demonstrações de prazer e satisfação
• Momentos de frustração ou dificuldade
• Estratégias de autorregulação utilizadas
• Comunicação de necessidades e preferências

INTERAÇÃO TERAPÊUTICA:
• Qualidade do contato visual
• Responsividade aos comandos musicais
• Iniciativas comunicativas
• Busca por aprovação ou validação

ASPECTOS MOTORES:
• Coordenação na execução instrumental
• Movimentos corporais expressivos
• Controle postural durante as atividades
• Lateralidade e organização espacial`,

          observations: `Observações Relevantes da Sessão:

PROGRESSOS IDENTIFICADOS:
• Aspectos que demonstraram melhora em relação à sessão anterior
• Novas habilidades ou comportamentos emergentes
• Maior confiança ou autonomia observada
• Respostas positivas às intervenções propostas

PONTOS DE ATENÇÃO:
• Comportamentos que necessitam monitoramento
• Dificuldades persistentes ou emergentes
• Sinais de fadiga ou sobrecarga
• Necessidades de adaptação identificadas

INSIGHTS CLÍNICOS:
Com base no contexto apresentado (${keyPoints}), foi possível observar respostas específicas que contribuem para a compreensão do processo terapêutico individual.

RECOMENDAÇÕES IMEDIATAS:
• Estratégias para as próximas sessões
• Orientações para cuidadores
• Aspectos a serem mantidos ou modificados
• Necessidade de comunicação com outros profissionais`
        };

      case "semester_evolution":
        return {
          ...baseContent,
          initial_evaluation: `Avaliação Inicial do Período Semestral:

CONTEXTO DE INÍCIO:
No início deste período semestral, ${patientName} apresentava as seguintes características:
• Estado geral de desenvolvimento
• Principais demandas identificadas
• Recursos e potencialidades observados
• Expectativas familiares e terapêuticas

DIAGNÓSTICO INICIAL:
• Condição clínica principal
• Comorbidades relevantes
• Medicações em uso
• Outros tratamentos simultâneos

LINHA DE BASE ESTABELECIDA:
• Habilidades comunicativas iniciais
• Competências musicais pré-existentes
• Padrões comportamentais observados
• Preferências e aversões identificadas`,

          therapeutic_process: `Processo Terapêutico Desenvolvido no Semestre:

METODOLOGIA APLICADA:
• Abordagem musicoterapêutica predominante
• Técnicas principais utilizadas
• Adaptações metodológicas realizadas
• Frequência e duração das sessões

EVOLUÇÃO DO PLANO TERAPÊUTICO:
• Objetivos iniciais estabelecidos
• Modificações implementadas ao longo do período
• Estratégias que demonstraram maior eficácia
• Ajustes necessários identificados

MARCOS TERAPÊUTICOS SIGNIFICATIVOS:
• Sessões de maior impacto positivo
• Momentos de breakthrough terapêutico
• Conquistas graduais consolidadas
• Desafios superados ao longo do processo

INTEGRAÇÃO INTERDISCIPLINAR:
• Articulação com outros profissionais
• Trocas de informações relevantes
• Objetivos compartilhados alcançados
• Sinergia entre diferentes abordagens`,

          evolution_areas: `Áreas de Evolução Significativa Observadas:

COMUNICAÇÃO E LINGUAGEM:
• Desenvolvimento da expressão verbal/não-verbal
• Ampliação do vocabulário musical
• Melhora na compreensão de instruções
• Uso funcional da comunicação

HABILIDADES SOCIEMOCIONAIS:
• Fortalecimento do vínculo terapêutico
• Desenvolvimento da autoestima e confiança
• Melhora na regulação emocional
• Capacidade de expressar sentimentos através da música

ASPECTOS COGNITIVOS:
• Aumento do tempo de atenção sustentada
• Desenvolvimento da memória musical
• Melhora na capacidade de imitação
• Crescimento da criatividade e imaginação

COMPETÊNCIAS MUSICAIS:
• Domínio instrumental progressivo
• Desenvolvimento do senso rítmico
• Ampliação do repertório musical
• Capacidade de improvisação emergente

AUTONOMIA E INDEPENDÊNCIA:
• Maior iniciativa nas atividades
• Desenvolvimento de preferências pessoais
• Capacidade de fazer escolhas
• Autorregulação em situações desafiadoras`,

          family_involvement: `Envolvimento e Participação Familiar:

PARTICIPAÇÃO DOS CUIDADORES:
• Presença e engajamento nas orientações
• Implementação de sugestões domiciliares
• Comunicação regular sobre a evolução
• Colaboração no processo terapêutico

ORIENTAÇÕES FORNECIDAS:
• Estratégias musicais para uso domiciliar
• Atividades de estimulação cotidiana
• Manejo de comportamentos específicos
• Criação de ambiente musical favorável

RESULTADOS DO ENVOLVIMENTO FAMILIAR:
• Generalização das conquistas para o ambiente doméstico
• Fortalecimento dos vínculos familiares
• Compreensão ampliada do potencial do paciente
• Continuidade das estimulações entre sessões

DESAFIOS E SUPERAÇÕES:
• Dificuldades iniciais identificadas
• Estratégias de superação implementadas
• Crescimento da confiança familiar
• Autonomia progressiva dos cuidadores`,

          conclusions: `Conclusões do Período Semestral:

ANÁLISE GERAL DA EVOLUÇÃO:
Considerando o contexto específico apresentado (${keyPoints}), ${patientName} demonstrou progresso significativo em múltiplas áreas de desenvolvimento ao longo deste período semestral.

OBJETIVOS ALCANÇADOS:
• Metas terapêuticas atingidas integralmente
• Conquistas parciais que representam progressos importantes
• Desenvolvimentos não previstos inicialmente que emergiram
• Consolidação de habilidades previamente trabalhadas

IMPACTO DO PROCESSO MUSICOTERAPÊUTICO:
• Transformações observadas no comportamento geral
• Melhora na qualidade de vida do paciente e família
• Desenvolvimento de recursos adaptativos
• Fortalecimento da autoestima e identidade musical

FATORES DE SUCESSO IDENTIFICADOS:
• Elementos que contribuíram positivamente para a evolução
• Estratégias terapêuticas de maior eficácia
• Aspectos do vínculo terapêutico facilitadores
• Condições ambientais e familiares favoráveis

APRENDIZADOS CLÍNICOS:
• Insights sobre o caso específico
• Contribuições para a prática musicoterapêutica
• Aspectos únicos do processo individual
• Reflexões sobre a abordagem utilizada`,

          recommendations: `Recomendações para Continuidade:

CONTINUIDADE DO PROCESSO MUSICOTERAPÊUTICO:
• Manutenção da frequência atual de atendimentos
• Possível ampliação ou modificação do setting
• Integração de novos objetivos terapêuticos
• Preparação para transições futuras

ESTRATÉGIAS PARA O PRÓXIMO PERÍODO:
• Aprofundamento das conquistas consolidadas
• Trabalho em áreas que ainda necessitam desenvolvimento
• Introdução de desafios graduais apropriados
• Manutenção da motivação e engajamento

ORIENTAÇÕES ESPECÍFICAS:
• Recomendações para o ambiente familiar
• Sugestões para integração escolar/social
• Indicações de atividades musicais complementares
• Cuidados especiais a serem mantidos

ARTICULAÇÃO INTERDISCIPLINAR:
• Comunicação contínua com outros profissionais
• Participação em reuniões de equipe
• Compartilhamento de estratégias eficazes
• Avaliação conjunta da necessidade de ajustes

PERSPECTIVAS FUTURAS:
• Projeção de desenvolvimentos esperados
• Preparação para marcos de desenvolvimento
• Planejamento de alta terapêutica quando apropriada
• Manutenção de conquistas alcançadas`
        };

      case "therapeutic_discharge":
        return {
          ...baseContent,
          treatment_summary: `Resumo Completo do Tratamento Musicoterapêutico:

PERÍODO DE ACOMPANHAMENTO:
• Data de início: [inserir data inicial]
• Data de conclusão: ${formattedDate}
• Duração total: [calcular período total]
• Frequência de atendimentos: [semanal/quinzenal]
• Total de sessões realizadas: [número aproximado]

CONTEXTO INICIAL:
Quando ${patientName} iniciou o processo musicoterapêutico, apresentava as seguintes características e demandas:
${keyPoints}

METODOLOGIA EMPREGADA:
• Abordagem musicoterapêutica: [humanística/comportamental/eclética]
• Técnicas principais: improvisação, audição musical, canto terapêutico
• Instrumentos preferenciais: [listar os mais utilizados]
• Setting terapêutico: individual em consultório especializado

EVOLUÇÃO CRONOLÓGICA:
FASE INICIAL (primeiros meses):
• Estabelecimento do vínculo terapêutico
• Exploração musical livre e dirigida
• Identificação de preferências e potencialidades
• Adaptação ao setting e rotina terapêutica

FASE DE DESENVOLVIMENTO (período intermediário):
• Consolidação das conquistas iniciais
• Aprofundamento das técnicas mais eficazes
• Trabalho específico nos objetivos estabelecidos
• Ampliação do repertório e competências musicais

FASE DE CONSOLIDAÇÃO (período final):
• Integração e generalização das conquistas
• Preparação para a alta terapêutica
• Fortalecimento da autonomia
• Orientações para continuidade domiciliar`,

          achieved_goals: `Objetivos Terapêuticos Alcançados:

OBJETIVOS PRINCIPAIS ATINGIDOS:
✓ Desenvolvimento significativo da comunicação expressiva
✓ Melhora substancial na autorregulação emocional
✓ Fortalecimento das habilidades sociais e interativas
✓ Consolidação de competências musicais funcionais
✓ Ampliação da autoestima e confiança pessoal

CONQUISTAS ESPECÍFICAS DOCUMENTADAS:
ÁREA COMUNICATIVA:
• Aumento significativo de iniciativas comunicativas espontâneas
• Desenvolvimento de repertório expressivo verbal e não-verbal
• Uso funcional da música como canal comunicativo preferencial
• Compreensão ampliada de instruções e comandos musicais

ÁREA SOCIOEMOCIONAL:
• Estabelecimento de vínculo terapêutico sólido e confiável
• Demonstração regular de prazer e satisfação nas atividades
• Desenvolvimento de estratégias eficazes de autorregulação
• Expressão adequada de emoções através da música

ÁREA COGNITIVA:
• Sustentação da atenção por períodos prolongados
• Desenvolvimento da memória musical e sequencial
• Melhora na capacidade de imitação e reprodução
• Emergência de criatividade e originalidade musical

ÁREA MOTORA:
• Coordenação refinada na execução instrumental
• Desenvolvimento da lateralidade e organização espacial
• Controle postural adequado durante as atividades
• Integração sensório-motora harmoniosa

COMPETÊNCIAS MUSICAIS DESENVOLVIDAS:
• Domínio básico de instrumentos de percussão e melódicos
• Desenvolvimento de senso rítmico e melódico
• Capacidade de improvisação musical espontânea
• Repertório musical personalizado e significativo`,

          recommendations: `Recomendações Pós-Alta e Continuidade:

ORIENTAÇÕES PARA MANUTENÇÃO DAS CONQUISTAS:
• Continuidade de atividades musicais no ambiente domiciliar
• Estímulo regular às competências desenvolvidas
• Manutenção de rotina musical estruturada
• Valorização e celebração das conquistas alcançadas

ATIVIDADES MUSICAIS RECOMENDADAS:
• Exploração livre de instrumentos musicais simples
• Canto de repertório conhecido e significativo
• Audição de estilos musicais diversos
• Participação em atividades musicais comunitárias quando apropriado

ESTRATÉGIAS PARA GENERALIZAÇÃO:
• Integração das competências musicais em atividades cotidianas
• Uso da música como ferramenta de regulação emocional
• Aplicação das estratégias comunicativas desenvolvidas
• Manutenção da autoestima através de experiências musicais positivas

RECURSOS COMUNITÁRIOS SUGERIDOS:
• Grupos musicais inclusivos
• Oficinas de música adaptada
• Eventos culturais acessíveis
• Atividades musicais escolares

SINAIS DE ALERTA PARA REAVALIAÇÃO:
• Regressão significativa nas competências desenvolvidas
• Mudanças comportamentais importantes
• Perda de interesse por atividades musicais
• Dificuldades de adaptação a novas situações

DISPONIBILIDADE PARA SEGUIMENTO:
• Sessões de follow-up quando necessário
• Orientações pontuais para família/cuidadores
• Reavaliação periódica do desenvolvimento
• Possibilidade de retomada do processo se indicado

ENCAMINHAMENTOS COMPLEMENTARES:
• Continuidade com outros profissionais da equipe
• Manutenção de acompanhamentos interdisciplinares
• Avaliações periódicas especializadas
• Suporte familiar contínuo quando necessário

CONSIDERAÇÕES FINAIS:
${patientName} demonstrou evolução excepcional ao longo do processo musicoterapêutico, atingindo os objetivos estabelecidos e desenvolvendo recursos adaptativos sólidos. A família está orientada e preparada para dar continuidade às estimulações, garantindo a manutenção das conquistas alcançadas. O processo de alta ocorre em momento apropriado, com o paciente demonstrando autonomia e competências suficientes para aplicar os aprendizados em seu cotidiano.`
        };

      case "group_session":
        return {
          ...baseContent,
          participants: `Participantes da Sessão Grupal (${formattedDate}):

COMPOSIÇÃO DO GRUPO:
• Número total de participantes: [especificar]
• Faixa etária: [descrever idades]
• Perfil diagnóstico geral: [breve caracterização]
• Nível de funcionamento: [heterogêneo/homogêneo]

PRESENÇA E PARTICIPAÇÃO:
• Participantes regulares presentes
• Novos membros ou visitantes
• Ausências justificadas
• Dinâmica de chegada e acolhimento

CARACTERÍSTICAS INDIVIDUAIS RELEVANTES:
Com base nas observações específicas (${keyPoints}), cada participante apresentou particularidades que influenciaram a dinâmica grupal do dia.

INTERAÇÕES INICIAIS:
• Cumprimentos e reconhecimento mútuo
• Comunicação espontânea entre membros
• Demonstração de vínculos estabelecidos
• Preparação para as atividades propostas`,

          theme: `Tema Central da Sessão:

FOCO TERAPÊUTICO PRINCIPAL:
• Tema escolhido: [comunicação/expressão emocional/cooperação/etc.]
• Justificativa para a escolha do tema
• Relevância para o momento grupal
• Articulação com objetivos individuais

OBJETIVOS ESPECÍFICOS DA SESSÃO:
• Promover interação e comunicação entre os participantes
• Estimular expressão emocional através da música
• Desenvolver habilidades de cooperação e trabalho em equipe
• Fortalecer vínculos interpessoais no grupo
• Trabalhar aspectos específicos identificados nas necessidades individuais

METODOLOGIA TEMÁTICA:
• Abordagem utilizada para desenvolvimento do tema
• Recursos musicais selecionados
• Estratégias facilitadoras implementadas
• Adaptações realizadas conforme resposta grupal`,

          group_dynamics: `Dinâmica e Interações Grupais:

CLIMA GRUPAL OBSERVADO:
• Atmosfera geral: [harmoniosa/tensa/energética/calma]
• Nível de coesão demonstrado
• Manifestações de apoio mútuo
• Momentos de conflito ou tensão e suas resoluções

PADRÕES DE INTERAÇÃO:
• Comunicação verbal entre participantes
• Expressões não-verbais significativas
• Iniciativas de contato e aproximação
• Respeito às diferenças individuais

LIDERANÇA E PAPÉIS:
• Emergência de lideranças naturais
• Distribuição de responsabilidades
• Participantes mais ativos e mais reservados
• Estratégias de inclusão implementadas

MOMENTOS SIGNIFICATIVOS:
• Interações especialmente positivas observadas
• Situações de superação de dificuldades
• Demonstrações de empatia e cuidado mútuo
• Conquistas coletivas celebradas

DESAFIOS GRUPAIS:
• Dificuldades de comunicação identificadas
• Necessidade de mediação em conflitos
• Estratégias para incluir participantes mais retraídos
• Adaptações necessárias para diferentes níveis de funcionamento`,

          activities: `Atividades Grupais Realizadas:

ESTRUTURA DA SESSÃO GRUPAL:
1. ACOLHIMENTO MUSICAL (10 min)
   • Música de boas-vindas grupal
   • Apresentação de cada participante através da música
   • Aquecimento vocal e corporal coletivo
   • Estabelecimento de regras e acordos da sessão

2. ATIVIDADE PRINCIPAL (30-40 min)
   • Improvisação musical coletiva
   • Criação de arranjos simples em grupo
   • Jogos musicais cooperativos
   • Exercícios de expressão emocional através da música

3. FECHAMENTO E REFLEXÃO (10 min)
   • Compartilhamento de experiências da sessão
   • Música de despedida criada pelo grupo
   • Organização coletiva do espaço
   • Combinados para próxima sessão

TÉCNICAS MUSICOTERAPÊUTICAS GRUPAIS:
• Improvisação musical dirigida e livre
• Técnicas de eco e espelhamento musical
• Criação de composições coletivas
• Exercícios de sincronização rítmica grupal
• Atividades de audição musical compartilhada

INSTRUMENTOS E RECURSOS UTILIZADOS:
• Instrumentos de percussão para todos os participantes
• Violão para acompanhamento harmônico
• Materiais de apoio (lenços, objetos sonoros)
• Sistema de som para reprodução musical`,

          group_response: `Resposta e Engajamento do Grupo:

PARTICIPAÇÃO COLETIVA:
• Nível geral de engajamento: [alto/moderado/variável]
• Adesão às propostas apresentadas
• Iniciativas grupais espontâneas
• Sustentação da atenção coletiva

EXPRESSÃO MUSICAL GRUPAL:
• Qualidade da produção musical coletiva
• Sincronização e coordenação alcançadas
• Criatividade e originalidade demonstradas
• Respeito aos momentos de expressão individual

COMUNICAÇÃO E INTERAÇÃO:
• Qualidade das trocas verbais e não-verbais
• Demonstrações de escuta e atenção mútua
• Capacidade de aguardar vez e momento
• Expressão de preferências e opiniões

CLIMA EMOCIONAL:
• Manifestações de alegria e satisfação
• Momentos de tensão ou desconforto
• Estratégias coletivas de autorregulação
• Apoio mútuo em situações desafiadoras

EVOLUÇÃO DURANTE A SESSÃO:
• Mudanças observadas do início ao fim
• Momentos de maior e menor engajamento
• Adaptações realizadas pelo próprio grupo
• Conquistas alcançadas coletivamente`,

          observations: `Observações Importantes da Sessão Grupal:

PROGRESSOS GRUPAIS IDENTIFICADOS:
• Melhora na capacidade de cooperação
• Desenvolvimento de vínculos mais sólidos
• Ampliação da tolerância às diferenças
• Crescimento da identidade grupal

DESTAQUES INDIVIDUAIS NO CONTEXTO GRUPAL:
• Participantes que demonstraram maior evolução
• Momentos de liderança positiva observados
• Iniciativas de cuidado e apoio entre membros
• Superação de dificuldades individuais através do grupo

ASPECTOS TÉCNICOS RELEVANTES:
• Eficácia das técnicas utilizadas
• Necessidade de adaptações metodológicas
• Resposta às intervenções do musicoterapeuta
• Elementos facilitadores e dificultadores identificados

IMPACTO TERAPÊUTICO OBSERVADO:
Considerando o contexto específico relatado (${keyPoints}), foi possível observar impactos terapêuticos significativos tanto no nível individual quanto grupal.

RECOMENDAÇÕES PARA PRÓXIMAS SESSÕES:
• Continuidade de técnicas que demonstraram eficácia
• Aprofundamento de temas que geraram maior interesse
• Atenção especial a participantes que necessitam suporte adicional
• Possível introdução de novos desafios grupais

ORIENTAÇÕES PARA CUIDADORES:
• Compartilhamento de conquistas observadas
• Sugestões para estimulação da socialização fora do grupo
• Orientações sobre generalização das habilidades desenvolvidas
• Importância da continuidade e assiduidade nas sessões`
        };

      default:
        return {
          ...baseContent,
          content: `Relatório Musicoterapêutico Estruturado para ${patientName}

Data da Avaliação: ${formattedDate}

RESUMO EXECUTIVO:
Este relatório apresenta a análise detalhada do processo musicoterapêutico de ${patientName}, considerando os aspectos observados durante o período avaliado.

PONTOS PRINCIPAIS IDENTIFICADOS:
${keyPoints}

ANÁLISE TÉCNICA:
Com base nas observações realizadas, foi possível identificar aspectos significativos do desenvolvimento do paciente através das intervenções musicoterapêuticas implementadas.

RECOMENDAÇÕES:
• Continuidade do processo terapêutico
• Manutenção das estratégias eficazes
• Adaptações conforme evolução apresentada
• Envolvimento familiar no processo

CONSIDERAÇÕES FINAIS:
O processo musicoterapêutico demonstra resultados positivos e perspectivas favoráveis para continuidade do tratamento.`
        };
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("Submetendo formulário com dados:", data);
      const selectedPatient = patients.find(p => p.id === data.patient_id);
      if (!selectedPatient) {
        throw new Error("Paciente não encontrado");
      }

      const { error } = await supabase
        .from("assessments")
        .insert({
          patient_id: data.patient_id,
          date: format(data.date, "yyyy-MM-dd'T'HH:mm:ssXXX"),
          type: data.type,
          content: data.content,
        });

      if (error) throw error;

      await generatePDF(selectedPatient.name, data, professionalData, userEmail, userName);

      toast({
        title: "Sucesso!",
        description: "Relatório registrado e PDF gerado com sucesso.",
      });

      navigate("/processes");
    } catch (error) {
      console.error("Erro ao salvar relatório:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar o relatório.",
      });
    }
  };

  const selectedType = form.watch("type");

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Novo Relatório</CardTitle>
          <CardDescription>
            Registre um novo relatório para o paciente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <ReportFormFields
                control={form.control}
                patients={patients}
                isLoadingPatients={isLoadingPatients}
              />

              <ReportContentTabs
                control={form.control}
                selectedType={selectedType}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                generateWithAI={generateWithAI}
                isGeneratingWithAI={isGeneratingWithAI}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="submit"
                  className="w-32"
                  disabled={!form.watch("content") || Object.keys(form.watch("content") || {}).length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Gerar PDF
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
